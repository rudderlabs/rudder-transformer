import type { Context, Middleware } from 'koa';
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

type ContextWithMatchedRoute = Pick<Context, 'path'> & Record<string, unknown>;

const MATCHED_ROUTE_FIELD = '_matchedRoute';
const OPERATIONAL_ENDPOINTS = new Set(['/health', '/metrics', '/features']);

const ROUTE_NORMALIZERS: Array<{ pattern: RegExp; route: string }> = [
  { pattern: /^\/[^/]+\/destinations\/[^/]+$/, route: '/:version/destinations/:destination' },
  {
    pattern: /^\/v0\/destinations\/[^/]+\/proxy$/,
    route: '/v0/destinations/:destination/proxy',
  },
  {
    pattern: /^\/v1\/destinations\/[^/]+\/proxy$/,
    route: '/v1/destinations/:destination/proxy',
  },
  {
    pattern: /^\/[^/]+\/destinations\/[^/]+\/proxyTest$/,
    route: '/:version/destinations/:destination/proxyTest',
  },
  { pattern: /^\/[^/]+\/sources\/[^/]+$/, route: '/:version/sources/:source' },
  {
    pattern: /^\/[^/]+\/sources\/[^/]+\/hydrate$/,
    route: '/:version/sources/:source/hydrate',
  },
  {
    pattern: /^\/test-router\/custom_audience\/parse-template$/,
    route: '/test-router/custom_audience/parse-template',
  },
  { pattern: /^\/test-router\/[^/]+\/health$/, route: '/test-router/:version/health' },
  {
    pattern: /^\/test-router(?:\/[^/]+){2}\/batch$/,
    route: '/test-router/:version/:destination/batch',
  },
  { pattern: /^\/test-router(?:\/[^/]+){2}$/, route: '/test-router/:version/:destination' },
];

export function emitMemoryHeapSizeLimit(): number {
  const limit = v8.getHeapStatistics().heap_size_limit;
  if (Number.isFinite(limit) && limit > 0) {
    stats.gauge('memory_heap_size_limit', limit);
  }
  return limit;
}

export function getMemoryFencingRouteLabel(ctx: ContextWithMatchedRoute): string {
  const matchedRoute = ctx[MATCHED_ROUTE_FIELD];
  if (typeof matchedRoute === 'string' && matchedRoute.length > 0) {
    return matchedRoute;
  }

  const normalizedRoute = ROUTE_NORMALIZERS.find(({ pattern }) => pattern.test(ctx.path));
  return normalizedRoute?.route ?? ctx.path;
}

function emitMemoryHeapUsedPercent(heapUsed: number, heapSizeLimit: number): number | null {
  if (!Number.isFinite(heapSizeLimit) || heapSizeLimit <= 0 || !Number.isFinite(heapUsed)) {
    return null;
  }

  const usagePercent = (heapUsed / heapSizeLimit) * 100;
  stats.gauge('memory_heap_used_percent', usagePercent);
  return usagePercent;
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
 * - Increments the `memory_fenced_requests` counter with a bounded route label.
 * - Responds with the specified status code and a message indicating high memory load.
 */
export function memoryFenceMiddleware(options?: MemoryFenceOptions): Middleware {
  const { thresholdPercent = 80, statusCode = 503, memoryUsageRefreshPeriod = 100 } = options || {};
  if (thresholdPercent <= 0 || thresholdPercent >= 100) {
    throw new Error('thresholdPercent must be between 1 and 100');
  }

  const limit = v8.getHeapStatistics().heap_size_limit;
  let { heapUsed }: { heapUsed: number } = process.memoryUsage();
  let lastMemoryCheck = Date.now();
  emitMemoryHeapUsedPercent(heapUsed, limit);

  return async (ctx, next) => {
    // Check memory usage periodically
    if (Date.now() - lastMemoryCheck >= memoryUsageRefreshPeriod) {
      ({ heapUsed } = process.memoryUsage());
      lastMemoryCheck = Date.now();
    }

    const usagePercent = emitMemoryHeapUsedPercent(heapUsed, limit);
    if (usagePercent !== null && usagePercent > thresholdPercent) {
      if (OPERATIONAL_ENDPOINTS.has(ctx.path)) {
        await next();
        return;
      }

      stats.counter('memory_fenced_requests', 1, { route: getMemoryFencingRouteLabel(ctx) });
      ctx.set('X-Rudder-Should-Retry', 'true');
      ctx.set('X-Rudder-Error-Reason', 'memory_fencing');
      ctx.status = statusCode;
      ctx.body = 'Server is under high memory load. Please try again later.';
      return;
    }
    await next();
  };
}
