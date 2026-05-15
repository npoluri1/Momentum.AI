import { ActionType } from '../types.js';
import { HttpRequestAction } from './http_request.js';
import { SendEmailAction } from './send_email.js';
import { SlackNotifyAction } from './slack_notify.js';
import { CreateTaskAction } from './create_task.js';

export interface ActionImplementation {
  readonly type: ActionType;
  execute(config: Record<string, unknown>, payload?: unknown): Promise<unknown>;
}

export class ActionRegistry {
  private static instance: ActionRegistry;
  private actions = new Map<ActionType, ActionImplementation>();

  private constructor() {
    this.registerDefaults();
  }

  static getInstance(): ActionRegistry {
    if (!ActionRegistry.instance) {
      ActionRegistry.instance = new ActionRegistry();
    }
    return ActionRegistry.instance;
  }

  private registerDefaults(): void {
    this.register(new HttpRequestAction());
    this.register(new SendEmailAction());
    this.register(new SlackNotifyAction());
    this.register(new CreateTaskAction());
  }

  register(action: ActionImplementation): void {
    this.actions.set(action.type, action);
  }

  unregister(type: ActionType): boolean {
    return this.actions.delete(type);
  }

  get(type: ActionType): ActionImplementation {
    const action = this.actions.get(type);
    if (!action) {
      throw new Error(`No action registered for type: ${type}`);
    }
    return action;
  }

  has(type: ActionType): boolean {
    return this.actions.has(type);
  }

  list(): ActionType[] {
    return Array.from(this.actions.keys());
  }
}
