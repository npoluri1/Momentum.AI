import { ActionType } from '../types.js';

export interface HttpRequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  followRedirects?: boolean;
}

export class HttpRequestAction {
  readonly type = ActionType.HttpRequest;

  async execute(config: Record<string, unknown>, _payload?: unknown): Promise<unknown> {
    const {
      url,
      method = 'GET',
      headers = {},
      body,
      timeoutMs = 30000,
    } = config as unknown as HttpRequestConfig;

    if (!url) {
      throw new Error('HTTP request action requires a URL');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Workflow-Engine/1.0',
          ...headers,
        },
        signal: controller.signal,
      };

      if (body && method !== 'GET' && method !== 'DELETE') {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      let responseBody: unknown;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(responseBody)}`);
      }

      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
