// ============================================================================
// Global-Tasks-dos Shared Types
// ============================================================================

// ─── User & Organization ─────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  isActive: boolean;
  preferences: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── Agent ───────────────────────────────────────────────────────────────────

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  tools?: string[];
  memory?: { type: 'buffer' | 'summary' | 'vector'; maxMessages?: number };
  instructions?: string[];
}

export interface Agent {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  config: AgentConfig;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentSession {
  id: string;
  agentId: string;
  organizationId: string;
  userId: string;
  title?: string;
  status: 'active' | 'paused' | 'closed';
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AgentMessage {
  id: string;
  sessionId: string;
  agentId: string;
  role: 'user' | 'agent' | 'system' | 'tool';
  content: string;
  toolCalls?: { name: string; arguments: string; result?: string }[];
  attachments?: { name: string; url: string; mimeType: string }[];
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ─── Project & Task ──────────────────────────────────────────────────────────

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  status: 'active' | 'archived' | 'completed';
  ownerId: string;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  organizationId: string;
  projectId: string;
  taskListId?: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'cancelled';
  priority: 'none' | 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  dueDate?: string;
  tags: string[];
  estimatedHours?: number;
  loggedHours?: number;
  order: number;
  parentId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskList {
  id: string;
  organizationId: string;
  projectId: string;
  name: string;
  description?: string;
  order: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  organizationId: string;
  resourceType: 'task' | 'project' | 'deal' | 'agent_session';
  resourceId: string;
  authorId: string;
  content: string;
  mentions: string[];
  attachments: { name: string; url: string }[];
  editedAt?: string;
  createdAt: string;
}

// ─── CRM (Leads, Contacts, Deals, Pipeline) ──────────────────────────────────

export interface Lead {
  id: string;
  organizationId: string;
  source: 'web' | 'referral' | 'LinkedIn' | 'manual' | 'api' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  score: number;
  notes?: string;
  customFields: Record<string, unknown>;
  assignedToId?: string;
  convertedToDealId?: string;
  convertedToContactId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  organizationId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  avatarUrl?: string;
  tags: string[];
  source: string;
  customFields: Record<string, unknown>;
  assignedToId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pipeline {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  stages: PipelineStage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  pipelineId: string;
  name: string;
  order: number;
  color?: string;
  probability: number;
  isWonStage: boolean;
  isLostStage: boolean;
}

export interface Deal {
  id: string;
  organizationId: string;
  pipelineId: string;
  stageId: string;
  name: string;
  value: number;
  currency: string;
  contactId?: string;
  leadId?: string;
  ownerId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'won' | 'lost';
  lostReason?: string;
  expectedCloseDate?: string;
  notes?: string;
  customFields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  organizationId: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'task' | 'deal_update' | 'lead_update';
  subject: string;
  description?: string;
  resourceType: 'lead' | 'contact' | 'deal';
  resourceId: string;
  performedById: string;
  dueDate?: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Workflow ────────────────────────────────────────────────────────────────

export type WorkflowTriggerType =
  | 'task_created'
  | 'task_updated'
  | 'task_status_changed'
  | 'lead_created'
  | 'lead_status_changed'
  | 'deal_created'
  | 'deal_stage_changed'
  | 'deal_status_changed'
  | 'contact_created'
  | 'agent_message_received'
  | 'scheduled'
  | 'webhook'
  | 'manual';

export type WorkflowActionType =
  | 'assign_task'
  | 'update_task'
  | 'create_task'
  | 'send_email'
  | 'send_slack'
  | 'send_webhook'
  | 'update_deal_stage'
  | 'assign_lead'
  | 'trigger_agent'
  | 'run_script'
  | 'wait';

export interface WorkflowTrigger {
  type: WorkflowTriggerType;
  config: Record<string, unknown>;
  filters?: Record<string, unknown>;
}

export interface WorkflowAction {
  type: WorkflowActionType;
  config: Record<string, unknown>;
  order: number;
  label?: string;
}

export interface WorkflowStep {
  id: string;
  workflowId: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  order: number;
  isEnabled: boolean;
  condition?: { field: string; operator: string; value: unknown };
}

export interface Workflow {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  isActive: boolean;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecution {
  id: string;
  organizationId: string;
  workflowId: string;
  stepId: string;
  triggerEvent: string;
  triggerData: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  results: { actionId: string; status: string; output?: unknown; error?: string }[];
  error?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

// ─── Integration ─────────────────────────────────────────────────────────────

export interface IntegrationConfig {
  version: string;
  settings: Record<string, unknown>;
  credentials: Record<string, unknown>;
  webhookUrl?: string;
}

export interface Integration {
  id: string;
  organizationId: string;
  provider: string;
  name: string;
  config: IntegrationConfig;
  isEnabled: boolean;
  lastSyncAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  organizationId: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  resourceType?: string;
  resourceId?: string;
  isRead: boolean;
  isSeen: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ─── Generic API Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
  meta?: { requestId: string; timestamp: string };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
