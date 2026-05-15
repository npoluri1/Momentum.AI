export enum TriggerType {
  Webhook = 'webhook',
  Schedule = 'schedule',
  Event = 'event',
  FormSubmission = 'form_submission',
}

export enum ActionType {
  SlackNotify = 'slack_notify',
  SendEmail = 'send_email',
  WebhookCall = 'webhook_call',
  CreateTask = 'create_task',
  UpdateCrm = 'update_crm',
  HttpRequest = 'http_request',
}

export enum ExecutionStatus {
  Pending = 'pending',
  Running = 'running',
  Success = 'success',
  Failed = 'failed',
  TimedOut = 'timed_out',
  Cancelled = 'cancelled',
}

export enum StepStatus {
  Pending = 'pending',
  Running = 'running',
  Success = 'success',
  Failed = 'failed',
  Skipped = 'skipped',
}

export interface Condition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'regex' | 'exists' | 'not_exists';
  value?: unknown;
}

export interface ConditionGroup {
  operator: 'and' | 'or';
  conditions: (Condition | ConditionGroup)[];
}

export interface WorkflowAction {
  id: string;
  type: ActionType;
  label: string;
  config: Record<string, unknown>;
  condition?: ConditionGroup;
  timeoutMs?: number;
  retryConfig?: {
    maxRetries: number;
    delayMs: number;
    backoffMultiplier?: number;
  };
  parallel?: boolean;
  nextStepOnSuccess?: string;
  nextStepOnFailure?: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  actions: WorkflowAction[];
  condition?: ConditionGroup;
  timeoutMs?: number;
}

export interface WorkflowTrigger {
  type: TriggerType;
  config: Record<string, unknown>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: number;
  enabled: boolean;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  timeoutMs: number;
  maxRetries: number;
}

export interface StepExecution {
  stepId: string;
  label: string;
  status: StepStatus;
  startedAt: string;
  completedAt?: string;
  actions: ActionExecution[];
  error?: string;
}

export interface ActionExecution {
  actionId: string;
  type: ActionType;
  status: StepStatus;
  startedAt: string;
  completedAt?: string;
  result?: unknown;
  error?: string;
  retryCount: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecutionStatus;
  triggerType: TriggerType;
  triggerPayload?: unknown;
  steps: StepExecution[];
  currentStepIndex: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
  durationMs?: number;
  createdBy?: string;
}

export interface CreateWorkflowInput {
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  tags?: string[];
  createdBy: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export interface UpdateWorkflowInput {
  name?: string;
  description?: string;
  trigger?: WorkflowTrigger;
  steps?: WorkflowStep[];
  tags?: string[];
  timeoutMs?: number;
  maxRetries?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
