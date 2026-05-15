import dotenv from 'dotenv';
dotenv.config();

export const config = {
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT || '3001', 10),
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'rt:',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-dev-secret-change-in-production',
    algorithms: ['HS256'] as string[],
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  chat: {
    maxHistoryPerRoom: parseInt(process.env.CHAT_MAX_HISTORY || '100', 10),
  },
  rateLimit: {
    maxEventsPerSecond: parseInt(process.env.RATE_LIMIT_PER_SEC || '30', 10),
  },
};
