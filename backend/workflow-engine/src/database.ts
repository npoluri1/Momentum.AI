import { config } from './config.js';
import type {
  Workflow,
  WorkflowExecution,
  PaginationParams,
  PaginatedResult,
} from './types.js';

interface DataStore<T extends { id: string }> {
  getAll(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  set(id: string, item: T): Promise<void>;
  delete(id: string): Promise<boolean>;
  paginate(params: PaginationParams): Promise<PaginatedResult<T>>;
}

function createInMemoryStore<T extends { id: string }>(): DataStore<T> {
  const items = new Map<string, T>();

  return {
    async getAll(): Promise<T[]> {
      return Array.from(items.values());
    },
    async get(id: string): Promise<T | undefined> {
      return items.get(id);
    },
    async set(id: string, item: T): Promise<void> {
      items.set(id, item);
    },
    async delete(id: string): Promise<boolean> {
      return items.delete(id);
    },
    async paginate(params: PaginationParams): Promise<PaginatedResult<T>> {
      const all = await this.getAll();
      const total = all.length;
      const totalPages = Math.ceil(total / params.limit);
      const start = (params.page - 1) * params.limit;
      const data = all.slice(start, start + params.limit);

      return {
        data,
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages,
        },
      };
    },
  };
}

function createRedisStore<T extends { id: string }>(client: {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
  keys(pattern: string): Promise<string[]>;
}): DataStore<T> {
  const prefix = 'workflow:engine:';
  const getKey = (id: string) => `${prefix}${id}`;
  const pattern = `${prefix}*`;

  return {
    async getAll(): Promise<T[]> {
      const keys = await client.keys(pattern);
      if (keys.length === 0) return [];
      const values = await Promise.all(keys.map((k) => client.get(k)));
      return values
        .filter((v): v is string => v !== null)
        .map((v) => JSON.parse(v) as T);
    },
    async get(id: string): Promise<T | undefined> {
      const val = await client.get(getKey(id));
      return val ? (JSON.parse(val) as T) : undefined;
    },
    async set(id: string, item: T): Promise<void> {
      await client.set(getKey(id), JSON.stringify(item));
    },
    async delete(id: string): Promise<boolean> {
      const existing = await this.get(id);
      if (!existing) return false;
      await client.del(getKey(id));
      return true;
    },
    async paginate(params: PaginationParams): Promise<PaginatedResult<T>> {
      const all = await this.getAll();
      const total = all.length;
      const totalPages = Math.ceil(total / params.limit);
      const start = (params.page - 1) * params.limit;
      const data = all.slice(start, start + params.limit);

      return {
        data,
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages,
        },
      };
    },
  };
}

let workflowsStore: DataStore<Workflow>;
let executionsStore: DataStore<WorkflowExecution>;

export async function initDatabase(): Promise<void> {
  const useRedis = config.useRedis && config.redisUrl;

  if (useRedis) {
    try {
      const { createClient } = await import('redis');
      const client = createClient({ url: config.redisUrl });
      await client.connect();

      const redisOps = {
        async get(key: string) { return client.get(key); },
        async set(key: string, value: string) { await client.set(key, value); },
        async del(key: string) { await client.del(key); },
        async keys(pattern: string) { return client.keys(pattern); },
      };

      workflowsStore = createRedisStore<Workflow>(redisOps);
      executionsStore = createRedisStore<WorkflowExecution>(redisOps);
      console.log('Using Redis-backed store');
      return;
    } catch {
      console.warn('Redis unavailable, falling back to in-memory store');
    }
  }

  console.log('Using in-memory store');
  workflowsStore = createInMemoryStore<Workflow>();
  executionsStore = createInMemoryStore<WorkflowExecution>();
}

export function getWorkflowsStore(): DataStore<Workflow> {
  return workflowsStore;
}

export function getExecutionsStore(): DataStore<WorkflowExecution> {
  return executionsStore;
}
