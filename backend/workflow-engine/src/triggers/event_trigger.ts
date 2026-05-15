export interface EventConfig {
  eventType: string;
  source?: string;
  filter?: Record<string, unknown>;
}

interface EventSubscription {
  workflowId: string;
  config: EventConfig;
}

type EventHandler = (workflowId: string, event: DomainEvent) => Promise<void>;

export interface DomainEvent {
  type: string;
  source: string;
  timestamp: string;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export class EventTrigger {
  private subscriptions = new Map<string, EventSubscription[]>();
  private handlers = new Map<string, EventHandler>();

  register(workflowId: string, config: EventConfig, handler: EventHandler): void {
    const subscription: EventSubscription = { workflowId, config };

    if (!this.subscriptions.has(config.eventType)) {
      this.subscriptions.set(config.eventType, []);
    }

    this.subscriptions.get(config.eventType)!.push(subscription);
    this.handlers.set(workflowId, handler);
  }

  unregister(workflowId: string): void {
    for (const [eventType, subs] of this.subscriptions) {
      const filtered = subs.filter((s) => s.workflowId !== workflowId);
      if (filtered.length === 0) {
        this.subscriptions.delete(eventType);
      } else {
        this.subscriptions.set(eventType, filtered);
      }
    }
    this.handlers.delete(workflowId);
  }

  async emit(event: DomainEvent): Promise<void> {
    const subs = this.subscriptions.get(event.type);
    if (!subs || subs.length === 0) return;

    await Promise.all(
      subs
        .filter((sub) => this.matchesFilter(event, sub.config.filter))
        .map((sub) => {
          const handler = this.handlers.get(sub.workflowId);
          if (handler) {
            return handler(sub.workflowId, event).catch((err) => {
              console.error(`Event handler error for workflow ${sub.workflowId}:`, err);
            });
          }
          return Promise.resolve();
        }),
    );
  }

  private matchesFilter(event: DomainEvent, filter?: Record<string, unknown>): boolean {
    if (!filter || Object.keys(filter).length === 0) return true;

    return Object.entries(filter).every(([key, value]) => {
      const eventValue = this.getNestedValue(event, key);
      return eventValue === value;
    });
  }

  private getNestedValue(obj: unknown, path: string): unknown {
    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
      if (current === null || current === undefined) return undefined;
      if (typeof current === 'object' && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    return current;
  }

  getSubscriptionsByWorkflow(workflowId: string): EventSubscription[] {
    const result: EventSubscription[] = [];
    for (const subs of this.subscriptions.values()) {
      for (const sub of subs) {
        if (sub.workflowId === workflowId) {
          result.push(sub);
        }
      }
    }
    return result;
  }
}
