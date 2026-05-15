import { Router } from 'express';
import { getWorkflowsStore, getExecutionsStore } from '../database.js';
import { asyncHandler, AppError } from '../middleware/error_handler.js';
import { authMiddleware } from '../middleware/auth.js';
import { WorkflowEngine } from '../engines/workflow_engine.js';

export function createExecutionRouter(workflowEngine: WorkflowEngine): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get('/', asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const workflowId = req.query.workflowId as string | undefined;
    const status = req.query.status as string | undefined;

    let allExecutions = await getExecutionsStore().getAll();

    if (workflowId) {
      allExecutions = allExecutions.filter((e) => e.workflowId === workflowId);
    }

    if (status) {
      allExecutions = allExecutions.filter((e) => e.status === status);
    }

    allExecutions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    const total = allExecutions.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = allExecutions.slice(start, start + limit);

    res.json({
      data,
      pagination: { page, limit, total, totalPages },
    });
  }));

  router.post('/', asyncHandler(async (req, res) => {
    const { workflowId, payload } = req.body as { workflowId: string; payload?: unknown };

    if (!workflowId) {
      throw new AppError(400, 'workflowId is required');
    }

    const workflow = await getWorkflowsStore().get(workflowId);
    if (!workflow) {
      throw new AppError(404, 'Workflow not found');
    }

    if (!workflow.enabled) {
      throw new AppError(400, 'Workflow is not enabled');
    }

    const createdBy = (req as Record<string, unknown>).userId as string | undefined;
    const execution = await workflowEngine.executeWorkflow(workflow, payload, createdBy);

    res.status(201).json({ data: execution });
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    const execution = await workflowEngine.getExecution(req.params.id);
    if (!execution) {
      throw new AppError(404, 'Execution not found');
    }
    res.json({ data: execution });
  }));

  router.post('/:id/cancel', asyncHandler(async (req, res) => {
    const execution = await workflowEngine.cancelExecution(req.params.id);
    if (!execution) {
      throw new AppError(404, 'Execution not found');
    }
    res.json({ data: execution });
  }));

  return router;
}
