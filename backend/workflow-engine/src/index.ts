import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config.js';
import { initDatabase } from './database.js';
import { WebhookTrigger } from './triggers/webhook_trigger.js';
import { ScheduleTrigger } from './triggers/schedule_trigger.js';
import { EventTrigger } from './triggers/event_trigger.js';
import { WorkflowEngine } from './engines/workflow_engine.js';
import { createWorkflowRouter } from './routes/workflows.js';
import { createExecutionRouter } from './routes/executions.js';
import { errorHandler, notFoundHandler } from './middleware/error_handler.js';

const app = express();
const webhookTrigger = new WebhookTrigger();
const scheduleTrigger = new ScheduleTrigger();
const eventTrigger = new EventTrigger();
const workflowEngine = new WorkflowEngine();

app.use(helmet());
app.use(cors());
app.use(morgan(config.logLevel === 'debug' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'workflow-engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.post('/webhooks/:webhookId', async (req, res, next) => {
  try {
    const { webhookId } = req.params;
    const registration = webhookTrigger.get(webhookId);

    if (!registration) {
      res.status(404).json({ error: { message: 'Webhook not found', code: 'NOT_FOUND' } });
      return;
    }

    const ip = req.ip || req.socket.remoteAddress || '';
    const validation = webhookTrigger.validatePayload(
      registration,
      req.body,
      req.headers as Record<string, string>,
      ip,
    );

    if (!validation.valid) {
      res.status(401).json({ error: { message: validation.error, code: 'WEBHOOK_VALIDATION_FAILED' } });
      return;
    }

    const { getWorkflowsStore } = await import('./database.js');
    const workflow = await getWorkflowsStore().get(registration.workflowId);

    if (!workflow || !workflow.enabled) {
      res.status(400).json({ error: { message: 'Workflow not found or not enabled', code: 'WORKFLOW_INACTIVE' } });
      return;
    }

    workflowEngine.executeWorkflow(workflow, req.body).catch((err) => {
      console.error(`Webhook execution error for workflow ${workflow.id}:`, err);
    });

    res.status(202).json({ message: 'Webhook received, workflow triggered' });
  } catch (err) {
    next(err);
  }
});

app.post('/events', async (req, res, next) => {
  try {
    const event = req.body;
    if (!event || !event.type) {
      res.status(400).json({ error: { message: 'Event must have a type', code: 'INVALID_EVENT' } });
      return;
    }

    await eventTrigger.emit({
      type: event.type,
      source: event.source || 'external',
      timestamp: event.timestamp || new Date().toISOString(),
      data: event.data || {},
      metadata: event.metadata,
    });

    res.status(202).json({ message: 'Event processed' });
  } catch (err) {
    next(err);
  }
});

app.get('/webhooks', (_req, res) => {
  const all = webhookTrigger.getAll().map((w) => ({
    id: w.id,
    workflowId: w.workflowId,
    urlPath: w.urlPath,
    createdAt: w.createdAt,
  }));
  res.json({ data: all });
});

app.use('/api/workflows', createWorkflowRouter(webhookTrigger, scheduleTrigger, eventTrigger, workflowEngine));
app.use('/api/executions', createExecutionRouter(workflowEngine));

app.use(notFoundHandler);
app.use(errorHandler);

async function start(): Promise<void> {
  try {
    await initDatabase();
    app.listen(config.port, config.host, () => {
      console.log(`Workflow Engine running on ${config.host}:${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Auth enabled: ${config.auth.enabled}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  scheduleTrigger.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down...');
  scheduleTrigger.destroy();
  process.exit(0);
});

start();

export { app, webhookTrigger, scheduleTrigger, eventTrigger, workflowEngine };
