import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getWorkflowsStore, getExecutionsStore } from '../database.js';
import { asyncHandler, AppError } from '../middleware/error_handler.js';
import { authMiddleware } from '../middleware/auth.js';
import { WebhookTrigger } from '../triggers/webhook_trigger.js';
import { ScheduleTrigger } from '../triggers/schedule_trigger.js';
import { EventTrigger } from '../triggers/event_trigger.js';
import { WorkflowEngine } from '../engines/workflow_engine.js';
import type { Workflow, CreateWorkflowInput, UpdateWorkflowInput } from '../types.js';

export function createWorkflowRouter(
  webhookTrigger: WebhookTrigger,
  scheduleTrigger: ScheduleTrigger,
  eventTrigger: EventTrigger,
  workflowEngine: WorkflowEngine,
): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post('/', asyncHandler(async (req, res) => {
    const input = req.body as CreateWorkflowInput;

    if (!input.name || !input.trigger || !input.steps) {
      throw new AppError(400, 'Missing required fields: name, trigger, steps');
    }

    if (!input.steps.length) {
      throw new AppError(400, 'Workflow must have at least one step');
    }

    const now = new Date().toISOString();
    const workflow: Workflow = {
      id: uuidv4(),
      name: input.name,
      description: input.description || '',
      version: 1,
      enabled: false,
      trigger: input.trigger,
      steps: input.steps,
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy || 'system',
      timeoutMs: input.timeoutMs || 300000,
      maxRetries: input.maxRetries || 3,
    };

    await getWorkflowsStore().set(workflow.id, workflow);

    if (workflow.trigger.type === 'webhook') {
      webhookTrigger.register(workflow.id, workflow.trigger.config as Record<string, unknown>);
    }

    res.status(201).json({ data: workflow });
  }));

  router.get('/', asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    const result = await getWorkflowsStore().paginate({ page, limit });
    res.json(result);
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    const workflow = await getWorkflowsStore().get(req.params.id);
    if (!workflow) {
      throw new AppError(404, 'Workflow not found');
    }
    res.json({ data: workflow });
  }));

  router.put('/:id', asyncHandler(async (req, res) => {
    const existing = await getWorkflowsStore().get(req.params.id);
    if (!existing) {
      throw new AppError(404, 'Workflow not found');
    }

    const input = req.body as UpdateWorkflowInput;
    const now = new Date().toISOString();

    const updated: Workflow = {
      ...existing,
      ...input,
      id: existing.id,
      createdAt: existing.createdAt,
      createdBy: existing.createdBy,
      version: existing.version + 1,
      updatedAt: now,
    };

    await getWorkflowsStore().set(updated.id, updated);

    if (updated.trigger.type === 'webhook') {
      webhookTrigger.unregisterByWorkflow(updated.id);
      webhookTrigger.register(updated.id, updated.trigger.config as Record<string, unknown>);
    }

    res.json({ data: updated });
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    const existing = await getWorkflowsStore().get(req.params.id);
    if (!existing) {
      throw new AppError(404, 'Workflow not found');
    }

    webhookTrigger.unregisterByWorkflow(req.params.id);
    scheduleTrigger.unregisterByWorkflow(req.params.id);
    eventTrigger.unregister(req.params.id);

    if (existing.enabled) {
      existing.enabled = false;
    }

    await getWorkflowsStore().delete(req.params.id);
    res.status(204).send();
  }));

  router.post('/:id/activate', asyncHandler(async (req, res) => {
    const workflow = await getWorkflowsStore().get(req.params.id);
    if (!workflow) {
      throw new AppError(404, 'Workflow not found');
    }

    if (workflow.enabled) {
      res.json({ data: workflow });
      return;
    }

    workflow.enabled = true;
    workflow.updatedAt = new Date().toISOString();
    await getWorkflowsStore().set(workflow.id, workflow);

    switch (workflow.trigger.type) {
      case 'webhook': {
        const existing = webhookTrigger.findByWorkflow(workflow.id);
        if (!existing) {
          webhookTrigger.register(workflow.id, workflow.trigger.config as Record<string, unknown>);
        }
        break;
      }
      case 'schedule': {
        const scheduleConfig = workflow.trigger.config as { cron: string; timezone?: string; payload?: Record<string, unknown> };
        if (scheduleConfig.cron) {
          await scheduleTrigger.register(
            workflow.id,
            scheduleConfig,
            async (wfId, payload) => {
              const wf = await getWorkflowsStore().get(wfId);
              if (wf && wf.enabled) {
                await workflowEngine.executeWorkflow(wf, payload);
              }
            },
          );
        }
        break;
      }
      case 'event': {
        const eventConfig = workflow.trigger.config as { eventType: string; source?: string; filter?: Record<string, unknown> };
        if (eventConfig.eventType) {
          eventTrigger.register(
            workflow.id,
            eventConfig,
            async (wfId, event) => {
              const wf = await getWorkflowsStore().get(wfId);
              if (wf && wf.enabled) {
                await workflowEngine.executeWorkflow(wf, event.data);
              }
            },
          );
        }
        break;
      }
    }

    res.json({ data: workflow });
  }));

  router.post('/:id/deactivate', asyncHandler(async (req, res) => {
    const workflow = await getWorkflowsStore().get(req.params.id);
    if (!workflow) {
      throw new AppError(404, 'Workflow not found');
    }

    if (!workflow.enabled) {
      res.json({ data: workflow });
      return;
    }

    workflow.enabled = false;
    workflow.updatedAt = new Date().toISOString();
    await getWorkflowsStore().set(workflow.id, workflow);

    webhookTrigger.unregisterByWorkflow(workflow.id);
    scheduleTrigger.unregisterByWorkflow(workflow.id);
    eventTrigger.unregister(workflow.id);

    res.json({ data: workflow });
  }));

  router.get('/:id/executions', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    const workflow = await getWorkflowsStore().get(id);
    if (!workflow) {
      throw new AppError(404, 'Workflow not found');
    }

    const allExecutions = await getExecutionsStore().getAll();
    const filtered = allExecutions.filter((e) => e.workflowId === id);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    res.json({
      data,
      pagination: { page, limit, total, totalPages },
    });
  }));

  return router;
}
