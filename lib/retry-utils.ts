export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  jitter?: boolean;
  retryCondition?: (error: Error, attempt: number) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
  timeout?: number;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
}

export class RetryManager {
  private static defaultOptions: Required<RetryOptions> = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    jitter: true,
    retryCondition: (error: Error, attempt: number) => {
      // Retry for network errors, timeouts, and 5xx status codes
      return (
        error.name === 'TypeError' || // Network errors
        error.name === 'TimeoutError' ||
        error.message.includes('fetch') ||
        error.message.includes('5') // 5xx errors
      );
    },
    onRetry: () => {},
    timeout: 30000,
  };

  /**
   * Execute a function with retry logic
   */
  static async retry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<RetryResult<T>> {
    const opts = { ...this.defaultOptions, ...options };
    const startTime = Date.now();
    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt < opts.maxAttempts) {
      attempt++;
      
      try {
        const result = await this.withTimeout(fn(), opts.timeout);
        return {
          success: true,
          data: result,
          attempts: attempt,
          totalTime: Date.now() - startTime,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Check if we should retry
        if (attempt >= opts.maxAttempts || !opts.retryCondition(lastError, attempt)) {
          break;
        }
        
        // Call retry callback
        opts.onRetry(lastError, attempt);
        
        // Calculate delay with exponential backoff and jitter
        const delay = this.calculateDelay(attempt, opts);
        await this.sleep(delay);
      }
    }

    return {
      success: false,
      error: lastError || new Error('Unknown error'),
      attempts: attempt,
      totalTime: Date.now() - startTime,
    };
  }

  /**
   * Retry specifically for fetch requests
   */
  static async retryFetch(
    url: string,
    init: RequestInit = {},
    options: RetryOptions = {}
  ): Promise<Response> {
    const retryOptions: RetryOptions = {
      ...options,
      retryCondition: (error: Error, attempt: number) => {
        // Retry for network errors and 5xx status codes
        return (
          error.name === 'TypeError' ||
          error.name === 'TimeoutError' ||
          error.message.includes('fetch') ||
          error.message.includes('NetworkError') ||
          (error.message.includes('status:') && error.message.includes('5'))
        );
      },
    };

    const result = await this.retry(async () => {
      const response = await fetch(url, init);
      
      if (!response.ok && response.status >= 500) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    }, retryOptions);

    if (!result.success) {
      throw result.error;
    }

    return result.data!;
  }

  /**
   * Retry for streaming requests
   */
  static async retryStream(
    url: string,
    init: RequestInit = {},
    options: RetryOptions = {}
  ): Promise<ReadableStream<Uint8Array>> {
    const retryOptions: RetryOptions = {
      ...options,
      maxAttempts: 2, // Fewer retries for streaming
      retryCondition: (error: Error, attempt: number) => {
        // Only retry for connection errors, not stream errors
        return (
          attempt === 1 && (
            error.name === 'TypeError' ||
            error.message.includes('fetch') ||
            error.message.includes('NetworkError')
          )
        );
      },
    };

    const result = await this.retry(async () => {
      const response = await fetch(url, init);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('No response body received');
      }
      
      return response.body;
    }, retryOptions);

    if (!result.success) {
      throw result.error;
    }

    return result.data!;
  }

  /**
   * Create a wrapper function that automatically retries
   */
  static createRetryWrapper<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: RetryOptions = {}
  ): T {
    return (async (...args: Parameters<T>) => {
      const result = await this.retry(() => fn(...args), options);
      
      if (!result.success) {
        throw result.error;
      }
      
      return result.data;
    }) as T;
  }

  /**
   * Circuit breaker pattern for failing services
   */
  static createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: {
      failureThreshold?: number;
      resetTimeout?: number;
      monitor?: (state: 'open' | 'closed' | 'half-open') => void;
    } = {}
  ): T {
    const opts = {
      failureThreshold: 5,
      resetTimeout: 60000,
      monitor: () => {},
      ...options,
    };

    let failureCount = 0;
    let lastFailureTime = 0;
    let state: 'open' | 'closed' | 'half-open' = 'closed';

    return (async (...args: Parameters<T>) => {
      const now = Date.now();
      
      // Check if circuit should be reset
      if (state === 'open' && now - lastFailureTime > opts.resetTimeout) {
        state = 'half-open';
        opts.monitor(state);
      }
      
      // If circuit is open, fail fast
      if (state === 'open') {
        throw new Error('Circuit breaker is open');
      }
      
      try {
        const result = await fn(...args);
        
        // Success - reset circuit
        if (state === 'half-open') {
          state = 'closed';
          failureCount = 0;
          opts.monitor(state);
        }
        
        return result;
      } catch (error) {
        failureCount++;
        lastFailureTime = now;
        
        // Open circuit if threshold reached
        if (failureCount >= opts.failureThreshold) {
          state = 'open';
          opts.monitor(state);
        }
        
        throw error;
      }
    }) as T;
  }

  /**
   * Add timeout to a promise
   */
  private static withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('TimeoutError')), timeout);
      }),
    ]);
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private static calculateDelay(attempt: number, options: Required<RetryOptions>): number {
    const exponentialDelay = Math.min(
      options.initialDelay * Math.pow(options.backoffFactor, attempt - 1),
      options.maxDelay
    );
    
    if (options.jitter) {
      // Add ±25% jitter to prevent thundering herd
      const jitter = exponentialDelay * 0.25;
      return exponentialDelay + (Math.random() - 0.5) * 2 * jitter;
    }
    
    return exponentialDelay;
  }

  /**
   * Sleep for specified milliseconds
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default RetryManager;