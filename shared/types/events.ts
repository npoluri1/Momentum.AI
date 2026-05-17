// ============================================================================
// Momentum.AI Domain Events
// ============================================================================

export interface BaseEvent {
  eventId: string;
  version: number;
  timestamp: string;
  correlationId?: string;
  causationId?: string;
  organizationId: string;
  actorId?: string;
}

// ─── Task Events ─────────────────────────────────────────────────────────────

export interface TaskCreatedEvent extends BaseEvent {
  eventType: 'task.created';
  data: {
    taskId: string;
    projectId: string;
    taskListId?: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    assigneeId?: string;
    createdBy: string;
    tags: string[];
  };
}

export interface TaskUpdatedEvent extends BaseEvent {
  eventType: 'task.updated';
  data: {
    taskId: string;
    projectId: string;
    changes: Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      assigneeId: string;
      dueDate: string;
      tags: string[];
      taskListId: string;
    }>;
    previousValues: Record<string, unknown>;
    updatedBy: string;
  };
}

export interface TaskDeletedEvent extends BaseEvent {
  eventType: 'task.deleted';
  data: {
    taskId: string;
    projectId: string;
    deletedBy: string;
  };
}

export interface TaskStatusChangedEvent extends BaseEvent {
  eventType: 'task.status_changed';
  data: {
    taskId: string;
    projectId: string;
    fromStatus: string;
    toStatus: string;
    assigneeId?: string;
    changedBy: string;
  };
}

export interface TaskAssignedEvent extends BaseEvent {
  eventType: 'task.assigned';
  data: {
    taskId: string;
    projectId: string;
    taskTitle: string;
    previousAssigneeId?: string;
    newAssigneeId: string;
    assignedBy: string;
  };
}

// ─── Project Events ──────────────────────────────────────────────────────────

export interface ProjectCreatedEvent extends BaseEvent {
  eventType: 'project.created';
  data: {
    projectId: string;
    name: string;
    description?: string;
    ownerId: string;
  };
}

export interface ProjectArchivedEvent extends BaseEvent {
  eventType: 'project.archived';
  data: {
    projectId: string;
    archivedBy: string;
  };
}

export interface UserJoinedWorkspaceEvent extends BaseEvent {
  eventType: 'user.joined_workspace';
  data: {
    userId: string;
    userName: string;
    userEmail: string;
    organizationId: string;
    role: string;
    invitedBy?: string;
  };
}

export interface UserLeftWorkspaceEvent extends BaseEvent {
  eventType: 'user.left_workspace';
  data: {
    userId: string;
    organizationId: string;
  };
}

// ─── CRM Events ──────────────────────────────────────────────────────────────

export interface LeadCreatedEvent extends BaseEvent {
  eventType: 'lead.created';
  data: {
    leadId: string;
    name: string;
    email?: string;
    company?: string;
    source: string;
    score: number;
    assignedToId?: string;
  };
}

export interface LeadStatusChangedEvent extends BaseEvent {
  eventType: 'lead.status_changed';
  data: {
    leadId: string;
    fromStatus: string;
    toStatus: string;
    changedBy: string;
  };
}

export interface LeadConvertedToDealEvent extends BaseEvent {
  eventType: 'lead.converted_to_deal';
  data: {
    leadId: string;
    dealId: string;
    dealName: string;
    dealValue: number;
    contactId?: string;
    pipelineId: string;
    stageId: string;
    convertedBy: string;
  };
}

export interface DealCreatedEvent extends BaseEvent {
  eventType: 'deal.created';
  data: {
    dealId: string;
    name: string;
    value: number;
    currency: string;
    pipelineId: string;
    stageId: string;
    contactId?: string;
    leadId?: string;
    ownerId: string;
  };
}

export interface DealStageChangedEvent extends BaseEvent {
  eventType: 'deal.stage_changed';
  data: {
    dealId: string;
    dealName: string;
    dealValue: number;
    pipelineId: string;
    fromStageId: string;
    fromStageName: string;
    toStageId: string;
    toStageName: string;
    changedBy: string;
  };
}

export interface DealWonEvent extends BaseEvent {
  eventType: 'deal.won';
  data: {
    dealId: string;
    dealName: string;
    dealValue: number;
    pipelineId: string;
    stageId: string;
    contactId?: string;
    ownerId: string;
    closedBy: string;
  };
}

export interface DealLostEvent extends BaseEvent {
  eventType: 'deal.lost';
  data: {
    dealId: string;
    dealName: string;
    dealValue: number;
    pipelineId: string;
    stageId: string;
    lostReason?: string;
    ownerId: string;
    closedBy: string;
  };
}

export interface ContactCreatedEvent extends BaseEvent {
  eventType: 'contact.created';
  data: {
    contactId: string;
    name: string;
    email?: string;
    company?: string;
    source: string;
    assignedToId?: string;
  };
}

// ─── Agent Events ────────────────────────────────────────────────────────────

export interface AgentMessageReceivedEvent extends BaseEvent {
  eventType: 'agent.message_received';
  data: {
    sessionId: string;
    agentId: string;
    messageId: string;
    role: string;
    content: string;
    userId?: string;
  };
}

export interface AgentSessionCreatedEvent extends BaseEvent {
  eventType: 'agent.session_created';
  data: {
    sessionId: string;
    agentId: string;
    agentName: string;
    userId: string;
  };
}

export interface AgentToolExecutedEvent extends BaseEvent {
  eventType: 'agent.tool_executed';
  data: {
    sessionId: string;
    agentId: string;
    toolName: string;
    toolArguments: string;
    result?: string;
    durationMs: number;
  };
}

// ─── Workflow Events ─────────────────────────────────────────────────────────

export interface WorkflowStartedEvent extends BaseEvent {
  eventType: 'workflow.started';
  data: {
    workflowId: string;
    workflowName: string;
    executionId: string;
    triggerType: string;
  };
}

export interface WorkflowStepCompletedEvent extends BaseEvent {
  eventType: 'workflow.step_completed';
  data: {
    workflowId: string;
    executionId: string;
    stepId: string;
    stepOrder: number;
    actionResults: { actionId: string; status: string }[];
    durationMs: number;
  };
}

export interface WorkflowCompletedEvent extends BaseEvent {
  eventType: 'workflow.completed';
  data: {
    workflowId: string;
    workflowName: string;
    executionId: string;
    totalSteps: number;
    totalDurationMs: number;
    status: 'completed' | 'failed' | 'cancelled';
    error?: string;
  };
}

export interface WorkflowFailedEvent extends BaseEvent {
  eventType: 'workflow.failed';
  data: {
    workflowId: string;
    executionId: string;
    failedStepId?: string;
    failedActionId?: string;
    error: string;
    errorCode: string;
  };
}

// ─── Notification Events ─────────────────────────────────────────────────────

export interface NotificationSentEvent extends BaseEvent {
  eventType: 'notification.sent';
  data: {
    notificationId: string;
    userId: string;
    type: string;
    title: string;
    channels: string[];
  };
}

// ─── Integration Events ──────────────────────────────────────────────────────

export interface IntegrationSyncedEvent extends BaseEvent {
  eventType: 'integration.synced';
  data: {
    integrationId: string;
    provider: string;
    syncType: 'full' | 'incremental';
    recordsProcessed: number;
    durationMs: number;
    status: 'success' | 'partial' | 'failed';
    error?: string;
  };
}

// ─── Event Union ─────────────────────────────────────────────────────────────

export type DomainEvent =
  | TaskCreatedEvent
  | TaskUpdatedEvent
  | TaskDeletedEvent
  | TaskStatusChangedEvent
  | TaskAssignedEvent
  | ProjectCreatedEvent
  | ProjectArchivedEvent
  | UserJoinedWorkspaceEvent
  | UserLeftWorkspaceEvent
  | LeadCreatedEvent
  | LeadStatusChangedEvent
  | LeadConvertedToDealEvent
  | DealCreatedEvent
  | DealStageChangedEvent
  | DealWonEvent
  | DealLostEvent
  | ContactCreatedEvent
  | AgentMessageReceivedEvent
  | AgentSessionCreatedEvent
  | AgentToolExecutedEvent
  | WorkflowStartedEvent
  | WorkflowStepCompletedEvent
  | WorkflowCompletedEvent
  | WorkflowFailedEvent
  | NotificationSentEvent
  | IntegrationSyncedEvent;

// ─── Event Bus Interface ─────────────────────────────────────────────────────

export interface EventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventType: T['eventType'],
    handler: (event: T) => Promise<void>,
  ): Promise<void>;
  unsubscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): Promise<void>;
}
