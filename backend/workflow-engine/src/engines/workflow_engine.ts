import { v4 as uuidv4 } from 'uuid';
import {
  ExecutionStatus,
  StepStatus,
  type Workflow,
  type WorkflowExecution,
  type WorkflowStep,
  type WorkflowAction,
  type StepExecution,
  type ActionExecution,
} from '../types.js';
import { config } from '../config.js';
import { ConditionalEngine } from './conditional_engine.js';
import { RetryEngine } from './retry_engine.js';
import { ActionRegistry } from '../actions/action_registry.js';
import { getExecutionsStore } from '../database.js';

export class WorkflowEngine {
  private conditionalEngine: ConditionalEngine;
  private retryEngine: RetryEngine;
  private actionRegistry: ActionRegistry;

  constructor() {
    this.conditionalEngine = new ConditionalEngine();
    this.retryEngine = new RetryEngine({
      maxRetries: config.workflowDefaults.maxRetries,
      delayMs: config.workflowDefaults.retryDelayMs,
    });
    this.actionRegistry = ActionRegistry.getInstance();
  }

  async executeWorkflow(
    workflow: Workflow,
    triggerPayload?: unknown,
    createdBy?: string,
  ): Promise<WorkflowExecution> {
    const executionId = uuidv4();
    const startedAt = new Date().toISOString();

    const execution: WorkflowExecution = {
      id: executionId,
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: ExecutionStatus.Running,
      triggerType: workflow.trigger.type,
      triggerPayload,
      steps: workflow.steps.map((step) => ({
        stepId: step.id,
        label: step.label,
        status: StepStatus.Pending,
        startedAt: '',
        actions: step.actions.map((action) => ({
          actionId: action.id,
          type: action.type,
          status: StepStatus.Pending,
          startedAt: '',
          retryCount: 0,
        })),
      })),
      currentStepIndex: 0,
      startedAt,
      createdBy,
    };

    await getExecutionsStore().set(executionId, execution);

    const totalTimeout = setTimeout(async () => {
      const current = await getExecutionsStore().get(executionId);
      if (current && current.status === ExecutionStatus.Running) {
        current.status = ExecutionStatus.TimedOut;
        current.completedAt = new Date().toISOString();
        current.durationMs = Date.now() - new Date(current.startedAt).getTime();
        current.error = 'Workflow timed out';
        await getExecutionsStore().set(executionId, current);
      }
    }, workflow.timeoutMs || config.workflowDefaults.timeoutMs);

    try {
      await this.executeSteps(workflow, execution);
      clearTimeout(totalTimeout);

      const completed = await getExecutionsStore().get(executionId);
      if (completed) {
        const allSuccess = completed.steps.every(
          (s) => s.status === StepStatus.Success || s.status === StepStatus.Skipped,
        );
        completed.status = allSuccess ? ExecutionStatus.Success : ExecutionStatus.Failed;
        completed.completedAt = new Date().toISOString();
        completed.durationMs = Date.now() - new Date(completed.startedAt).getTime();
        await getExecutionsStore().set(executionId, completed);
      }
    } catch (err) {
      clearTimeout(totalTimeout);
      const failed = await getExecutionsStore().get(executionId);
      if (failed) {
        failed.status = ExecutionStatus.Failed;
        failed.completedAt = new Date().toISOString();
        failed.durationMs = Date.now() - new Date(failed.startedAt).getTime();
        failed.error = err instanceof Error ? err.message : String(err);
        await getExecutionsStore().set(executionId, failed);
      }
    }

    return (await getExecutionsStore().get(executionId))!;
  }

  private async executeSteps(workflow: Workflow, execution: WorkflowExecution): Promise<void> {
    const steps = workflow.steps;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepExec = execution.steps[i];

      stepExec.status = StepStatus.Running;
      stepExec.startedAt = new Date().toISOString();
      execution.currentStepIndex = i;
      await getExecutionsStore().set(execution.id, execution);

      const stepTimeout = step.timeoutMs || workflow.timeoutMs || config.workflowDefaults.timeoutMs;
      const shouldSkip = step.condition && !this.conditionalEngine.evaluate(
        step.condition,
        { payload: execution.triggerPayload, workflow, execution },
      );

      if (shouldSkip) {
        stepExec.status = StepStatus.Skipped;
        stepExec.completedAt = new Date().toISOString();
        await getExecutionsStore().set(execution.id, execution);
        continue;
      }

      try {
        await this.executeStepActionsWithTimeout(
          step, stepExec, execution, stepTimeout,
        );

        if (stepExec.status !== StepStatus.Success) {
          return;
        }
      } catch (err) {
        stepExec.status = StepStatus.Failed;
        stepExec.error = err instanceof Error ? err.message : String(err);
        stepExec.completedAt = new Date().toISOString();
        await getExecutionsStore().set(execution.id, execution);
        return;
      }

      await getExecutionsStore().set(execution.id, execution);
    }
  }

  private async executeStepActionsWithTimeout(
    step: WorkflowStep,
    stepExec: StepExecution,
    execution: WorkflowExecution,
    timeoutMs: number,
  ): Promise<void> {
    await Promise.race([
      this.executeStepActions(step, stepExec, execution),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error(`Step "${step.label}" timed out after ${timeoutMs}ms`)), timeoutMs),
      ),
    ]);
  }

  private async executeStepActions(
    step: WorkflowStep,
    stepExec: StepExecution,
    execution: WorkflowExecution,
  ): Promise<void> {
    const parallelActions = step.actions.filter((a) => a.parallel);
    const sequentialActions = step.actions.filter((a) => !a.parallel);
    const context = {
      payload: execution.triggerPayload,
      workflow: { id: execution.workflowId, name: execution.workflowName },
      execution: { id: execution.id },
    };

    if (parallelActions.length > 0) {
      await Promise.all(
        parallelActions.map((action) =>
          this.executeSingleAction(action, stepExec, context, execution),
        ),
      );
    }

    for (const action of sequentialActions) {
      const actionExec = stepExec.actions.find((a) => a.actionId === action.id);
      if (!actionExec) continue;

      if (action.condition && !this.conditionalEngine.evaluate(action.condition, context)) {
        actionExec.status = StepStatus.Skipped;
        actionExec.completedAt = new Date().toISOString();
        continue;
      }

      try {
        await this.executeSingleAction(action, stepExec, context, execution);
      } catch {
        if (action.nextStepOnFailure && actionExec.status !== StepStatus.Success) {
          stepExec.status = StepStatus.Failed;
          return;
        }
      }

      if (actionExec.status !== StepStatus.Success) {
        stepExec.status = StepStatus.Failed;
        return;
      }
    }

    const allActionsSuccess = stepExec.actions.every(
      (a) => a.status === StepStatus.Success || a.status === StepStatus.Skipped,
    );
    stepExec.status = allActionsSuccess ? StepStatus.Success : StepStatus.Failed;
    stepExec.completedAt = new Date().toISOString();
  }

  private async executeSingleAction(
    action: WorkflowAction,
    stepExec: StepExecution,
    context: Record<string, unknown>,
    execution: WorkflowExecution,
  ): Promise<void> {
    const actionExec = stepExec.actions.find((a) => a.actionId === action.id);
    if (!actionExec) return;

    actionExec.status = StepStatus.Running;
    actionExec.startedAt = new Date().toISOString();
    actionExec.retryCount = 0;
    await getExecutionsStore().set(execution.id, execution);

    const actionTimeout = action.timeoutMs || 30000;

    try {
      const result = await this.retryEngine.execute(
        async () => {
          const impl = this.actionRegistry.get(action.type);
          return impl.execute(action.config, context.payload);
        },
        action.retryConfig,
        (attempt, _error, delayMs) => {
          actionExec.retryCount = attempt;
          console.warn(
            `Retry ${attempt}/${action.retryConfig?.maxRetries ?? 3} for action ${action.label}: retrying in ${delayMs}ms`,
          );
        },
      );

      actionExec.status = StepStatus.Success;
      actionExec.result = result;
      actionExec.completedAt = new Date().toISOString();
    } catch (err) {
      actionExec.status = StepStatus.Failed;
      actionExec.error = err instanceof Error ? err.message : String(err);
      actionExec.completedAt = new Date().toISOString();
      throw err;
    } finally {
      await getExecutionsStore().set(execution.id, execution);
    }
  }

  async getExecution(executionId: string): Promise<WorkflowExecution | undefined> {
    return getExecutionsStore().get(executionId);
  }

  async cancelExecution(executionId: string): Promise<WorkflowExecution | undefined> {
    const execution = await getExecutionsStore().get(executionId);
    if (!execution || execution.status !== ExecutionStatus.Running) {
      return execution;
    }

    execution.status = ExecutionStatus.Cancelled;
    execution.completedAt = new Date().toISOString();
    execution.durationMs = Date.now() - new Date(execution.startedAt).getTime();
    await getExecutionsStore().set(executionId, execution);
    return execution;
  }
}
