import { ActionType } from '../types.js';
import { config } from '../config.js';

export interface SendEmailConfig {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
}

export class SendEmailAction {
  readonly type = ActionType.SendEmail;

  async execute(actionConfig: Record<string, unknown>, _payload?: unknown): Promise<unknown> {
    const cfg = actionConfig as unknown as SendEmailConfig;
    const recipients = Array.isArray(cfg.to) ? cfg.to : [cfg.to];

    if (recipients.length === 0 || !cfg.subject || !cfg.body) {
      throw new Error('Email action requires to, subject, and body');
    }

    if (config.email.host) {
      return this.sendViaSmtp(cfg);
    }

    return this.sendViaApi(cfg);
  }

  private async sendViaSmtp(cfg: SendEmailConfig): Promise<unknown> {
    try {
      const nodemailer = await import('nodemailer');

      const transporter = nodemailer.default.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.port === 465,
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      });

      const info = await transporter.sendMail({
        from: cfg.from || config.email.from,
        to: Array.isArray(cfg.to) ? cfg.to.join(', ') : cfg.to,
        cc: cfg.cc ? (Array.isArray(cfg.cc) ? cfg.cc.join(', ') : cfg.cc) : undefined,
        bcc: cfg.bcc ? (Array.isArray(cfg.bcc) ? cfg.bcc.join(', ') : cfg.bcc) : undefined,
        subject: cfg.subject,
        text: cfg.body,
        html: cfg.html,
      });

      return { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected };
    } catch (err) {
      throw new Error(`SMTP send failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  private async sendViaApi(cfg: SendEmailConfig): Promise<unknown> {
    const response = await fetch('https://api.mailgun.net/v3/globaltasks.io/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: cfg.to,
        cc: cfg.cc,
        bcc: cfg.bcc,
        subject: cfg.subject,
        text: cfg.body,
        html: cfg.html,
        from: cfg.from || config.email.from,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Email API error: ${response.status} ${errBody}`);
    }

    return response.json();
  }
}
