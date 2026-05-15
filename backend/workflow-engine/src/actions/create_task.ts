import { ActionType } from '../types.js';
import { config } from '../config.js';

export interface CreateTaskConfig {
  title: string;
  description?: string;
  assigneeId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  projectId?: string;
  tags?: string[];
  status?: string;
}

export class CreateTaskAction {
  readonly type = ActionType.CreateTask;

  async execute(actionConfig: Record<string, unknown>, _payload?: unknown): Promise<unknown> {
    const cfg = actionConfig as unknown as CreateTaskConfig;

    if (!cfg.title) {
      throw new Error('Create task action requires a title');
    }

    const response = await fetch(`${config.taskService.url}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.taskService.apiKey ? { 'x-api-key': config.taskService.apiKey } : {}),
      },
      body: JSON.stringify({
        title: cfg.title,
        description: cfg.description || '',
        assigneeId: cfg.assigneeId,
        priority: cfg.priority || 'medium',
        dueDate: cfg.dueDate,
        projectId: cfg.projectId,
        tags: cfg.tags || [],
        status: cfg.status || 'todo',
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Task service error: ${response.status} ${errBody}`);
    }

    return response.json();
  }
}
