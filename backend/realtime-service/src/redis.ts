import Redis from 'ioredis';
import { config } from './config';

const pubClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db,
  keyPrefix: config.redis.keyPrefix,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
  maxRetriesPerRequest: 10,
  enableOfflineQueue: true,
});

const subClient = pubClient.duplicate();

pubClient.on('connect', () => {
  console.log('[Redis] Publisher connected');
});

subClient.on('connect', () => {
  console.log('[Redis] Subscriber connected');
});

pubClient.on('error', (err) => {
  console.error('[Redis] Publisher error:', err.message);
});

subClient.on('error', (err) => {
  console.error('[Redis] Subscriber error:', err.message);
});

pubClient.on('close', () => {
  console.warn('[Redis] Publisher connection closed');
});

subClient.on('close', () => {
  console.warn('[Redis] Subscriber connection closed');
});

const cacheClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db + 1 || 1,
  keyPrefix: 'cache:',
  retryStrategy: (times: number) => Math.min(times * 100, 3000),
  maxRetriesPerRequest: 3,
});

cacheClient.on('error', (err) => {
  console.error('[Redis Cache] Error:', err.message);
});

async function testConnection(): Promise<boolean> {
  try {
    await pubClient.ping();
    await subClient.ping();
    await cacheClient.ping();
    return true;
  } catch (err) {
    console.error('[Redis] Connection test failed:', err);
    return false;
  }
}

export { pubClient, subClient, cacheClient, testConnection };
