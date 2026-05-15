import { v4 as uuidv4 } from 'uuid';

export interface WebhookConfig {
  secret?: string;
  requireAuth?: boolean;
  allowedIps?: string[];
  payloadSchema?: Record<string, unknown>;
}

export interface WebhookRegistration {
  id: string;
  workflowId: string;
  urlPath: string;
  config: WebhookConfig;
  createdAt: string;
}

export class WebhookTrigger {
  private webhooks = new Map<string, WebhookRegistration>();

  register(workflowId: string, config?: WebhookConfig): WebhookRegistration {
    const id = uuidv4();
    const urlPath = `/webhooks/${id}`;

    const registration: WebhookRegistration = {
      id,
      workflowId,
      urlPath,
      config: {
        secret: config?.secret,
        requireAuth: config?.requireAuth ?? false,
        allowedIps: config?.allowedIps,
        payloadSchema: config?.payloadSchema,
      },
      createdAt: new Date().toISOString(),
    };

    this.webhooks.set(id, registration);
    return registration;
  }

  unregister(id: string): boolean {
    return this.webhooks.delete(id);
  }

  get(id: string): WebhookRegistration | undefined {
    return this.webhooks.get(id);
  }

  findByWorkflow(workflowId: string): WebhookRegistration | undefined {
    for (const webhook of this.webhooks.values()) {
      if (webhook.workflowId === workflowId) return webhook;
    }
    return undefined;
  }

  getByUrlPath(urlPath: string): WebhookRegistration | undefined {
    for (const webhook of this.webhooks.values()) {
      if (webhook.urlPath === urlPath) return webhook;
    }
    return undefined;
  }

  validatePayload(registration: WebhookRegistration, payload: unknown, headers: Record<string, string>, ip: string): { valid: boolean; error?: string } {
    if (registration.config.requireAuth && registration.config.secret) {
      const providedSecret = headers['x-webhook-secret'] || headers.authorization?.replace('Bearer ', '');
      if (providedSecret !== registration.config.secret) {
        return { valid: false, error: 'Invalid webhook secret' };
      }
    }

    if (registration.config.allowedIps && registration.config.allowedIps.length > 0) {
      if (!registration.config.allowedIps.includes(ip)) {
        return { valid: false, error: 'IP not allowed' };
      }
    }

    if (registration.config.payloadSchema && typeof payload === 'object' && payload !== null) {
      const schema = registration.config.payloadSchema;
      for (const [key, type] of Object.entries(schema)) {
        if (type === 'required' && !(key in (payload as Record<string, unknown>))) {
          return { valid: false, error: `Missing required field: ${key}` };
        }
      }
    }

    return { valid: true };
  }

  getAll(): WebhookRegistration[] {
    return Array.from(this.webhooks.values());
  }

  unregisterByWorkflow(workflowId: string): void {
    for (const [id, webhook] of this.webhooks) {
      if (webhook.workflowId === workflowId) {
        this.webhooks.delete(id);
      }
    }
  }
}
