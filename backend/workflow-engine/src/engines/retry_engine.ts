export interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier?: number;
}

export class RetryEngine {
  private defaultConfig: RetryConfig;

  constructor(defaultConfig?: Partial<RetryConfig>) {
    this.defaultConfig = {
      maxRetries: defaultConfig?.maxRetries ?? 3,
      delayMs: defaultConfig?.delayMs ?? 1000,
      backoffMultiplier: defaultConfig?.backoffMultiplier ?? 2,
    };
  }

  async execute<T>(
    fn: () => Promise<T>,
    config?: Partial<RetryConfig>,
    onRetry?: (attempt: number, error: Error, delayMs: number) => void,
  ): Promise<T> {
    const retryConfig = { ...this.defaultConfig, ...config };
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        if (attempt < retryConfig.maxRetries) {
          const delay = retryConfig.delayMs * Math.pow(retryConfig.backoffMultiplier ?? 2, attempt - 1);
          const jitter = Math.random() * delay * 0.1;
          const totalDelay = delay + jitter;

          if (onRetry) {
            onRetry(attempt, lastError, totalDelay);
          }

          await this.sleep(totalDelay);
        }
      }
    }

    throw lastError ?? new Error('Retry failed');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
