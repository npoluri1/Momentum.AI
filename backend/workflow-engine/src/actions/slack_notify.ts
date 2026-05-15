import { ActionType } from '../types.js';
import { config } from '../config.js';

export interface SlackNotifyConfig {
  webhookUrl?: string;
  channel?: string;
  message: string;
  username?: string;
  iconEmoji?: string;
  attachments?: Array<{
    color?: string;
    title?: string;
    text?: string;
    fields?: Array<{ title: string; value: string; short?: boolean }>;
  }>;
}

export class SlackNotifyAction {
  readonly type = ActionType.SlackNotify;

  async execute(actionConfig: Record<string, unknown>, _payload?: unknown): Promise<unknown> {
    const cfg = actionConfig as unknown as SlackNotifyConfig;
    const webhookUrl = cfg.webhookUrl || config.slack.defaultWebhookUrl;

    if (!webhookUrl) {
      throw new Error('Slack notify action requires a webhook URL');
    }

    if (!cfg.message) {
      throw new Error('Slack notify action requires a message');
    }

    const payload: Record<string, unknown> = {
      text: cfg.message,
      username: cfg.username || 'Workflow Engine',
    };

    if (cfg.channel) payload.channel = cfg.channel;
    if (cfg.iconEmoji) payload.icon_emoji = cfg.iconEmoji;
    if (cfg.attachments) payload.attachments = cfg.attachments;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Slack API error: ${response.status} ${errBody}`);
    }

    return { sent: true, webhook: webhookUrl };
  }
}
