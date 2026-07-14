import type { Middleware } from 'koa';
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

// `/metrics` is served by a separate Koa app on METRICS_PORT (see src/index.ts), so it can never
// reach this middleware. It is listed anyway so the set stays correct if the two apps are merged.
const OPERATIONAL_ENDPOINTS = new Set(['/health', '/metrics', '/features']);

// Anything not matched below is labelled `other`. The label MUST stay bounded: the fence fires
// precisely when the process is already under memory pressure, and an unbounded label would let a
// path scanner add a new Prometheus child per request at exactly the wrong moment.
const OTHER_ROUTE = 'other';

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
  { pattern: /^\/routerTransform$/, route: '/routerTransform' },
  { pattern: /^\/batch$/, route: '/batch' },
  { pattern: /^\/deleteUsers$/, route: '/deleteUsers' },
  { pattern: /^\/customTransform$/, route: '/customTransform' },
  {
    pattern: /^\/workspaces\/[^/]+\/reconcileFunction$/,
    route: '/workspaces/:wId/reconcileFunction',
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

export const MEMORY_FENCING_ROUTE_LABELS: string[] = [
  ...ROUTE_NORMALIZERS.map(({ route }) => route),
  OTHER_ROUTE,
];

/**
 * Maps a request path onto the bounded label set above.
 *
 * Note this deliberately does not consult `ctx._matchedRoute`: the fence is mounted before
 * `applicationRoutes(app)` and short-circuits without calling `next()`, so @koa/router has not run
 * and that field is always undefined here.
 */
export function getMemoryFencingRouteLabel(path: string): string {
  return ROUTE_NORMALIZERS.find(({ pattern }) => pattern.test(path))?.route ?? OTHER_ROUTE;
}

/**
 * Creates the `memory_fenced_requests` children up front, at zero.
 *
 * A labelled prom-client counter creates its children lazily, so without this the series would not
 * exist until the first fence. `increase()` cannot see the 0 -> N step on a series that springs
 * into existence already at N, which would make the burst alert miss short bursts and the
 * sustained alert fire long before its window is actually satisfied.
 */
export function initMemoryFencingMetrics(): void {
  MEMORY_FENCING_ROUTE_LABELS.forEach((route) => {
    stats.counter('memory_fenced_requests', 0, { route });
  });
}

export function emitMemoryHeapSizeLimit(): number {
  const limit = v8.getHeapStatistics().heap_size_limit;
  if (Number.isFinite(limit) && limit > 0) {
    stats.gauge('memory_heap_size_limit', limit);
  }
  return limit;
}

/**
 * Emits heap usage as a percentage of this worker's V8 heap limit.
 *
 * Registered with `aggregator: 'max'` so prom-client reports the hottest cluster worker rather than
 * summing four workers' percentages together.
 */
export function emitMemoryHeapUsedPercent(): number | null {
  const limit = v8.getHeapStatistics().heap_size_limit;
  const { heapUsed } = process.memoryUsage();

  if (!Number.isFinite(limit) || limit <= 0 || !Number.isFinite(heapUsed)) {
    return null;
  }

  const usagePercent = (heapUsed / limit) * 100;
  stats.gauge('memory_heap_used_percent', usagePercent);
  return usagePercent;
}

/**
 * Reports heap usage on a timer, independently of whether fencing is enabled.
 *
 * This is the leading indicator: it has to exist on deployments where fencing is switched off, and
 * it has to keep updating on an idle pod, which a per-request emission would not.
 */
export function startMemoryUsageReporter(intervalMs = 10_000): NodeJS.Timeout {
  emitMemoryHeapUsedPercent();
  const timer = setInterval(emitMemoryHeapUsedPercent, intervalMs);
  timer.unref();
  return timer;
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

  return async (ctx, next) => {
    // Check memory usage periodically
    if (Date.now() - lastMemoryCheck >= memoryUsageRefreshPeriod) {
      ({ heapUsed } = process.memoryUsage());
      lastMemoryCheck = Date.now();
    }

    if (!Number.isFinite(limit) || limit <= 0 || !Number.isFinite(heapUsed)) {
      await next();
      return;
    }

    const usagePercent = (heapUsed / limit) * 100;
    if (usagePercent <= thresholdPercent || OPERATIONAL_ENDPOINTS.has(ctx.path)) {
      await next();
      return;
    }

    stats.counter('memory_fenced_requests', 1, { route: getMemoryFencingRouteLabel(ctx.path) });
    ctx.set('X-Rudder-Should-Retry', 'true');
    ctx.set('X-Rudder-Error-Reason', 'memory_fencing');
    ctx.status = statusCode;
    ctx.body = 'Server is under high memory load. Please try again later.';
  };
}
