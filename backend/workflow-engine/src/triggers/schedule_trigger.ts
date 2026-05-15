export interface ScheduleConfig {
  cron: string;
  timezone?: string;
  payload?: Record<string, unknown>;
}

interface ScheduledJob {
  workflowId: string;
  config: ScheduleConfig;
  cronTask: { stop: () => void };
}

export class ScheduleTrigger {
  private jobs = new Map<string, ScheduledJob>();
  private cronModule: typeof import('node-cron') | null = null;

  private async getCron(): Promise<typeof import('node-cron')> {
    if (!this.cronModule) {
      this.cronModule = await import('node-cron');
    }
    return this.cronModule;
  }

  async register(
    workflowId: string,
    config: ScheduleConfig,
    onFire: (workflowId: string, payload: unknown) => Promise<void>,
  ): Promise<string> {
    const cron = await this.getCron();

    const jobId = `${workflowId}-${Date.now()}`;
    const task = cron.schedule(config.cron, async () => {
      try {
        await onFire(workflowId, config.payload);
      } catch (err) {
        console.error(`Schedule trigger error for workflow ${workflowId}:`, err);
      }
    }, {
      scheduled: true,
      timezone: config.timezone,
    });

    this.jobs.set(jobId, { workflowId, config, cronTask: task });
    return jobId;
  }

  unregister(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;
    job.cronTask.stop();
    this.jobs.delete(jobId);
    return true;
  }

  unregisterByWorkflow(workflowId: string): void {
    for (const [jobId, job] of this.jobs) {
      if (job.workflowId === workflowId) {
        job.cronTask.stop();
        this.jobs.delete(jobId);
      }
    }
  }

  get(jobId: string): ScheduledJob | undefined {
    return this.jobs.get(jobId);
  }

  getAll(): ScheduledJob[] {
    return Array.from(this.jobs.values());
  }

  destroy(): void {
    for (const job of this.jobs.values()) {
      job.cronTask.stop();
    }
    this.jobs.clear();
  }
}
