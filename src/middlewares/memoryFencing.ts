import { Middleware } from 'koa';
import v8 from 'v8';
import stats from '../util/stats';

/**
 * Options for configuring the memory fencing middleware.
 *
 * @property thresholdPercent - The heap usage threshold (as a percentage of the max heap)
 *   at which the middleware will trigger memory fencing. Defaults to 80 (i.e., 80%).
 * @property statusCode - The HTTP status code to return when the memory threshold is exceeded.
 *   Defaults to 503 (Service Unavailable).
 */
interface MemoryFenceOptions {
  memoryUsageRefreshPeriod?: number; // default 100ms
  thresholdPercent?: number; // default 80 means 80% of max heap usage
  statusCode?: number; // default 503
}

/**
 * Middleware to fence requests when server memory usage exceeds a specified threshold.
 *
 * @param options - Configuration options for the memory fence.
 * @param options.thresholdPercent - The memory usage percentage (1-99) at which to start fencing requests. Defaults to 80.
 * @param options.statusCode - The HTTP status code to return when fenced. Defaults to 503.
 * @throws Will throw an error if `thresholdPercent` is not between 1 and 99.
 * @returns A middleware function that blocks requests when memory usage exceeds the threshold.
 *
 * When the memory usage exceeds the specified threshold, the middleware:
 * - Increments the `memory_fenced_requests` counter.
 * - Responds with the specified status code and a message indicating high memory load.
 */
export function memoryFenceMiddleware(options?: MemoryFenceOptions): Middleware {
  const { thresholdPercent = 80, statusCode = 503, memoryUsageRefreshPeriod = 100 } = options || {};
  if (thresholdPercent <= 0 || thresholdPercent >= 100) {
    throw new Error('thresholdPercent must be between 1 and 100');
  }
  const limit = v8.getHeapStatistics().heap_size_limit;
  stats.gauge('memory_heap_size_limit', limit);
  let { heapUsed }: { heapUsed: number } = process.memoryUsage();
  let lastMemoryCheck = Date.now();
  return async (ctx, next) => {
    // Check memory usage periodically
    if (Date.now() - lastMemoryCheck >= memoryUsageRefreshPeriod) {
      ({ heapUsed } = process.memoryUsage());
      lastMemoryCheck = Date.now();
    }
    const usagePercent = (heapUsed / limit) * 100;
    if (usagePercent > thresholdPercent) {
      stats.counter('memory_fenced_requests', 1);
      ctx.set('X-Rudder-Should-Retry', 'true');
      ctx.set('X-Rudder-Error-Reason', 'memory_fencing');
      ctx.status = statusCode;
      ctx.body = 'Server is under high memory load. Please try again later.';
      return;
    }
    await next();
  };
}
