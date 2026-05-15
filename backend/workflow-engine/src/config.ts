export const config = {
  port: parseInt(process.env.PORT || '3004', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  redisUrl: process.env.REDIS_URL || '',
  useRedis: process.env.USE_REDIS === 'true',
  auth: {
    enabled: process.env.AUTH_ENABLED === 'true',
    jwtSecret: process.env.JWT_SECRET || 'workflow-engine-secret-key-change-in-prod',
    apiKeyHeader: process.env.API_KEY_HEADER || 'x-api-key',
    apiKey: process.env.API_KEY || '',
  },
  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@globaltasks.io',
  },
  slack: {
    defaultWebhookUrl: process.env.SLACK_DEFAULT_WEBHOOK_URL || '',
  },
  taskService: {
    url: process.env.TASK_SERVICE_URL || 'http://localhost:3001',
    apiKey: process.env.TASK_SERVICE_API_KEY || '',
  },
  workflowDefaults: {
    timeoutMs: parseInt(process.env.WORKFLOW_TIMEOUT_MS || '300000', 10),
    maxRetries: parseInt(process.env.WORKFLOW_MAX_RETRIES || '3', 10),
    retryDelayMs: parseInt(process.env.WORKFLOW_RETRY_DELAY_MS || '1000', 10),
  },
};
