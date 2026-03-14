/**
 * Utility function to retry API calls with exponential backoff
 * Silently retries failed requests in the background
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: any) => void;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  onRetry: () => {},
};

/**
 * Retries an async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt < opts.maxRetries) {
        const delay = Math.min(
          opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
          opts.maxDelay
        );

        opts.onRetry?.(attempt + 1, error);
        
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Sets up automatic retry for a data fetching function
 * Checks if data is loaded, and if not, retries in the background
 */
export function setupAutoRetry<T>(
  fetchFn: () => Promise<T>,
  checkFn: () => boolean,
  options: RetryOptions = {}
): () => void {
  let retryTimeout: NodeJS.Timeout | null = null;
  let isRetrying = false;

  const attemptRetry = async () => {
    if (isRetrying) return;
    
    // Check if data is already loaded
    if (checkFn()) {
      return; // Data is loaded, no need to retry
    }

    isRetrying = true;
    
    try {
      await retryWithBackoff(fetchFn, {
        ...options,
        onRetry: (attempt, error) => {
          console.log(`Auto-retrying API call (attempt ${attempt}/${options.maxRetries || 3})...`);
          options.onRetry?.(attempt, error);
        },
      });
      
      // If successful, check again after a short delay
      if (!checkFn()) {
        // Still not loaded, schedule another retry
        retryTimeout = setTimeout(attemptRetry, 2000);
      }
    } catch (error) {
      console.error('Auto-retry failed after all attempts:', error);
      // Schedule another retry after a longer delay
      retryTimeout = setTimeout(attemptRetry, 5000);
    } finally {
      isRetrying = false;
    }
  };

  // Start retry check after initial load
  retryTimeout = setTimeout(attemptRetry, 2000);

  // Return cleanup function
  return () => {
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  };
}

