import { useEffect, useRef } from 'react';

/**
 * Custom hook for automatic retry of data fetching
 * Silently retries in the background if data is not loaded
 */
export function useAutoRetry<T>(
  fetchFn: () => Promise<T>,
  checkFn: () => boolean,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    retryInterval?: number;
    enabled?: boolean;
  } = {}
) {
  const {
    maxRetries = 5,
    initialDelay = 2000,
    retryInterval = 3000,
    enabled = true,
  } = options;

  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRetryingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const attemptRetry = async () => {
      // Check if data is already loaded
      if (checkFn()) {
        retryCountRef.current = 0;
        return;
      }

      // Don't retry if already retrying or exceeded max retries
      if (isRetryingRef.current || retryCountRef.current >= maxRetries) {
        return;
      }

      isRetryingRef.current = true;
      retryCountRef.current += 1;

      try {
        console.log(`Auto-retrying API call (attempt ${retryCountRef.current}/${maxRetries})...`);
        await fetchFn();
        
        // If successful, check again after a short delay
        if (!checkFn()) {
          // Still not loaded, schedule another retry
          timeoutRef.current = setTimeout(attemptRetry, retryInterval);
        } else {
          // Data loaded successfully, reset counter
          retryCountRef.current = 0;
        }
      } catch (error) {
        console.error(`Auto-retry attempt ${retryCountRef.current} failed:`, error);
        
        // Schedule another retry if we haven't exceeded max retries
        if (retryCountRef.current < maxRetries) {
          timeoutRef.current = setTimeout(attemptRetry, retryInterval);
        }
      } finally {
        isRetryingRef.current = false;
      }
    };

    // Start retry check after initial delay
    timeoutRef.current = setTimeout(attemptRetry, initialDelay);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      isRetryingRef.current = false;
    };
  }, [fetchFn, checkFn, enabled, maxRetries, initialDelay, retryInterval]);
}

