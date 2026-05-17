import { WorkflowEngine } from '../engines/workflow_engine';
import { ConditionalEngine } from '../engines/conditional_engine';
import { RetryEngine } from '../engines/retry_engine';

describe('WorkflowEngine', () => {
  let engine: WorkflowEngine;

  beforeEach(() => {
    engine = new WorkflowEngine();
  });

  it('should create a workflow', () => {
    const workflow = engine.createWorkflow({
      name: 'Test Workflow',
      trigger: { type: 'manual', config: {} },
      steps: [],
    });
    expect(workflow).toBeDefined();
    expect(workflow.name).toBe('Test Workflow');
    expect(workflow.id).toBeDefined();
  });

  it('should execute a workflow with no steps', async () => {
    const workflow = engine.createWorkflow({
      name: 'Empty Workflow',
      trigger: { type: 'manual', config: {} },
      steps: [],
    });
    const result = await engine.executeWorkflow(workflow.id, {});
    expect(result).toBeDefined();
  });

  it('should list all workflows', () => {
    engine.createWorkflow({
      name: 'Workflow 1',
      trigger: { type: 'manual', config: {} },
      steps: [],
    });
    engine.createWorkflow({
      name: 'Workflow 2',
      trigger: { type: 'scheduled', config: { cron: '* * * * *' } },
      steps: [],
    });
    const workflows = engine.listWorkflows();
    expect(workflows.length).toBe(2);
  });
});

describe('ConditionalEngine', () => {
  it('should evaluate condition with equals operator', () => {
    const result = ConditionalEngine.evaluateCondition(
      { field: 'status', operator: 'equals', value: 'active' },
      { status: 'active' }
    );
    expect(result).toBe(true);
  });

  it('should evaluate condition with not_equals operator', () => {
    const result = ConditionalEngine.evaluateCondition(
      { field: 'status', operator: 'not_equals', value: 'inactive' },
      { status: 'active' }
    );
    expect(result).toBe(true);
  });
});

describe('RetryEngine', () => {
  it('should retry a failing function', async () => {
    const retryEngine = new RetryEngine();
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 3) throw new Error('Temporary error');
      return 'success';
    };
    const result = await retryEngine.executeWithRetry(fn, {
      maxRetries: 3,
      baseDelayMs: 10,
    });
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('should throw after max retries', async () => {
    const retryEngine = new RetryEngine();
    const fn = async () => {
      throw new Error('Persistent error');
    };
    await expect(
      retryEngine.executeWithRetry(fn, { maxRetries: 2, baseDelayMs: 10 })
    ).rejects.toThrow();
  });
});
