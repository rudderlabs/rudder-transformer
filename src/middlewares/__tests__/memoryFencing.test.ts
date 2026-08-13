import {
  MEMORY_FENCING_ROUTE_LABELS,
  emitMemoryHeapSizeLimit,
  emitMemoryHeapUsedPercent,
  getMemoryFencingRouteLabel,
  initMemoryFencingMetrics,
  memoryFenceMiddleware,
  startMemoryUsageReporter,
} from '../memoryFencing';
import stats from '../../util/stats';
import v8 from 'v8';

jest.mock('../../util/stats', () => ({
  counter: jest.fn(),
  gauge: jest.fn(),
}));

jest.mock('v8', () => ({
  getHeapStatistics: jest.fn(() => ({
    heap_size_limit: 1000,
  })),
}));

describe('memoryFenceMiddleware', () => {
  const originalMemoryUsage = process.memoryUsage;

  beforeEach(() => {
    (v8.getHeapStatistics as jest.Mock).mockReturnValue({
      heap_size_limit: 1000,
    });
  });

  afterEach(() => {
    process.memoryUsage = originalMemoryUsage;
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  function mockCtx(path = '/v0/destinations/ga') {
    return {
      status: undefined,
      body: undefined,
      path,
      headers: {} as Record<string, string>,
      set(header: string, value: string) {
        this.headers[header] = value;
      },
    } as any;
  }

  it('calls next when usage is below threshold', async () => {
    process.memoryUsage = jest.fn(() => ({
      heapUsed: 400,
    })) as any;

    const ctx = mockCtx();
    const next = jest.fn();

    await memoryFenceMiddleware({ thresholdPercent: 80 })(ctx, next);

    expect(next).toHaveBeenCalled();
    expect(ctx.status).toBeUndefined();
    expect(ctx.body).toBeUndefined();
    expect(stats.counter).not.toHaveBeenCalledWith('memory_fenced_requests', 1, expect.anything());
    expect(ctx.headers['X-Rudder-Should-Retry']).toBeUndefined();
    expect(ctx.headers['X-Rudder-Error-Reason']).toBeUndefined();
  });

  it('blocks request and increments counter when usage is above threshold', async () => {
    process.memoryUsage = jest.fn(() => ({
      heapUsed: 900,
    })) as any;

    const ctx = mockCtx('/v0/destinations/ga');
    const next = jest.fn();

    await memoryFenceMiddleware({ thresholdPercent: 80 })(ctx, next);

    expect(next).not.toHaveBeenCalled();
    expect(ctx.status).toBe(503);
    expect(ctx.body).toMatch(/high memory load/i);
    expect(stats.counter).toHaveBeenCalledWith('memory_fenced_requests', 1, {
      route: '/:version/destinations/:destination',
    });
    expect(ctx.headers['X-Rudder-Should-Retry']).toBe('true');
    expect(ctx.headers['X-Rudder-Error-Reason']).toBe('memory_fencing');
  });

  it('respects custom statusCode', async () => {
    process.memoryUsage = jest.fn(() => ({
      heapUsed: 900,
    })) as any;

    const ctx = mockCtx();
    const next = jest.fn();

    await memoryFenceMiddleware({ thresholdPercent: 80, statusCode: 429 })(ctx, next);

    expect(ctx.status).toBe(429);
    expect(ctx.body).toMatch(/high memory load/i);
    expect(ctx.headers['X-Rudder-Should-Retry']).toBe('true');
    expect(ctx.headers['X-Rudder-Error-Reason']).toBe('memory_fencing');
  });

  it('throws error for invalid thresholdPercent', () => {
    expect(() => memoryFenceMiddleware({ thresholdPercent: 0 })).toThrow();
    expect(() => memoryFenceMiddleware({ thresholdPercent: 100 })).toThrow();
    expect(() => memoryFenceMiddleware({ thresholdPercent: -5 })).toThrow();
  });

  it('seeds the fenced-requests counter for every bounded route as the fence is mounted', () => {
    memoryFenceMiddleware({ thresholdPercent: 80 });

    MEMORY_FENCING_ROUTE_LABELS.forEach((route) => {
      expect(stats.counter).toHaveBeenCalledWith('memory_fenced_requests', 0, { route });
    });
  });

  it('uses default options if none provided', async () => {
    process.memoryUsage = jest.fn(() => ({
      heapUsed: 900,
    })) as any;

    const ctx = mockCtx('/routerTransform');
    const next = jest.fn();

    await memoryFenceMiddleware()(ctx, next);

    expect(ctx.status).toBe(503);
    expect(stats.counter).toHaveBeenCalledWith('memory_fenced_requests', 1, {
      route: '/routerTransform',
    });
  });

  it('calculates memory percentage based on v8 heap size limit', async () => {
    (v8.getHeapStatistics as jest.Mock).mockReturnValue({
      heap_size_limit: 2000,
    });

    process.memoryUsage = jest.fn(() => ({
      heapUsed: 900,
    })) as any;

    const ctx = mockCtx();
    const next = jest.fn();

    // 900 / 2000 = 45%, below the 50% threshold
    await memoryFenceMiddleware({ thresholdPercent: 50 })(ctx, next);

    expect(next).toHaveBeenCalled();
    expect(ctx.status).toBeUndefined();
    expect(stats.counter).not.toHaveBeenCalledWith('memory_fenced_requests', 1, expect.anything());
  });

  it('does not emit the heap gauge from the request path', async () => {
    // The gauge is owned by startMemoryUsageReporter, not the middleware: a per-request emission
    // would freeze on an idle pod and would not exist at all where fencing is disabled.
    process.memoryUsage = jest.fn(() => ({ heapUsed: 400 })) as any;

    const middleware = memoryFenceMiddleware({ thresholdPercent: 80 });
    await middleware(mockCtx(), jest.fn());
    await middleware(mockCtx(), jest.fn());

    expect(stats.gauge).not.toHaveBeenCalled();
  });

  it('checks memory usage periodically', async () => {
    let mockNow = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => mockNow);

    const mockMemoryUsage = jest.fn(() => ({
      heapUsed: 400,
    })) as any;
    process.memoryUsage = mockMemoryUsage;

    const middleware = memoryFenceMiddleware({ thresholdPercent: 80 });
    expect(mockMemoryUsage).toHaveBeenCalledTimes(1);

    await middleware(mockCtx(), jest.fn());
    expect(mockMemoryUsage).toHaveBeenCalledTimes(1);

    mockNow += 99;
    await middleware(mockCtx(), jest.fn());
    expect(mockMemoryUsage).toHaveBeenCalledTimes(1);

    mockNow += 1;
    await middleware(mockCtx(), jest.fn());
    expect(mockMemoryUsage).toHaveBeenCalledTimes(2);
  });

  it('calls next when the heap limit is unusable rather than fencing everything', async () => {
    (v8.getHeapStatistics as jest.Mock).mockReturnValue({ heap_size_limit: 0 });
    process.memoryUsage = jest.fn(() => ({ heapUsed: 900 })) as any;

    const ctx = mockCtx();
    const next = jest.fn();

    await memoryFenceMiddleware({ thresholdPercent: 80 })(ctx, next);

    expect(next).toHaveBeenCalled();
    expect(ctx.status).toBeUndefined();
    expect(stats.counter).not.toHaveBeenCalledWith('memory_fenced_requests', 1, expect.anything());
  });

  it.each([['/health'], ['/metrics'], ['/features']])(
    'bypasses fencing response for operational endpoint %s',
    async (path) => {
      process.memoryUsage = jest.fn(() => ({
        heapUsed: 900,
      })) as any;

      const ctx = mockCtx(path);
      const next = jest.fn();

      await memoryFenceMiddleware({ thresholdPercent: 80 })(ctx, next);

      expect(next).toHaveBeenCalled();
      expect(ctx.status).toBeUndefined();
      expect(ctx.body).toBeUndefined();
      expect(stats.counter).not.toHaveBeenCalledWith(
        'memory_fenced_requests',
        1,
        expect.anything(),
      );
      expect(ctx.headers['X-Rudder-Should-Retry']).toBeUndefined();
      expect(ctx.headers['X-Rudder-Error-Reason']).toBeUndefined();
    },
  );
});

describe('memory fencing metrics', () => {
  const originalMemoryUsage = process.memoryUsage;

  beforeEach(() => {
    (v8.getHeapStatistics as jest.Mock).mockReturnValue({
      heap_size_limit: 1000,
    });
  });

  afterEach(() => {
    process.memoryUsage = originalMemoryUsage;
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('emits heap size limit through the explicit helper', () => {
    const limit = emitMemoryHeapSizeLimit();

    expect(limit).toBe(1000);
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_size_limit', 1000);
  });

  it('does not emit invalid heap size limits', () => {
    (v8.getHeapStatistics as jest.Mock).mockReturnValue({
      heap_size_limit: 0,
    });

    const limit = emitMemoryHeapSizeLimit();

    expect(limit).toBe(0);
    expect(stats.gauge).not.toHaveBeenCalled();
  });

  it('emits heap used percent independently of the fencing middleware', () => {
    // This is the whole point of extracting the helper: the leading indicator has to exist on
    // deployments where MEMORY_FENCING_ENABLED is unset and the middleware is never mounted.
    process.memoryUsage = jest.fn(() => ({ heapUsed: 250 })) as any;

    expect(emitMemoryHeapUsedPercent()).toBe(25);
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_used_percent', 25);
  });

  it('does not emit heap used percent when the limit is unusable', () => {
    (v8.getHeapStatistics as jest.Mock).mockReturnValue({ heap_size_limit: 0 });
    process.memoryUsage = jest.fn(() => ({ heapUsed: 250 })) as any;

    expect(emitMemoryHeapUsedPercent()).toBeNull();
    expect(stats.gauge).not.toHaveBeenCalled();
  });

  it('reports heap usage on an interval so an idle pod does not freeze the gauge', () => {
    jest.useFakeTimers();
    process.memoryUsage = jest.fn(() => ({ heapUsed: 300 })) as any;

    const timer = startMemoryUsageReporter(1000);

    // The reporter emits the constant heap size limit once, then heap-used-percent up front and on
    // each tick.
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_size_limit', 1000);
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_used_percent', 30);
    expect(stats.gauge).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(2000);
    expect(stats.gauge).toHaveBeenCalledTimes(4);

    clearInterval(timer);
    jest.useRealTimers();
  });

  it('zero-initialises the fenced-requests counter for every bounded route label', () => {
    initMemoryFencingMetrics();

    expect(stats.counter).toHaveBeenCalledTimes(MEMORY_FENCING_ROUTE_LABELS.length);
    MEMORY_FENCING_ROUTE_LABELS.forEach((route) => {
      expect(stats.counter).toHaveBeenCalledWith('memory_fenced_requests', 0, { route });
    });
  });

  it('includes the catch-all label in the bounded set', () => {
    expect(MEMORY_FENCING_ROUTE_LABELS).toContain('other');
  });

  it.each([
    { path: '/v0/destinations/ga', expectedRoute: '/:version/destinations/:destination' },
    { path: '/v0/destinations/ga/proxy', expectedRoute: '/v0/destinations/:destination/proxy' },
    { path: '/v1/destinations/ga/proxy', expectedRoute: '/v1/destinations/:destination/proxy' },
    {
      path: '/v0/destinations/ga/proxyTest',
      expectedRoute: '/:version/destinations/:destination/proxyTest',
    },
    { path: '/v0/sources/rudderstack', expectedRoute: '/:version/sources/:source' },
    { path: '/v0/sources/rudderstack/hydrate', expectedRoute: '/:version/sources/:source/hydrate' },
    { path: '/routerTransform', expectedRoute: '/routerTransform' },
    { path: '/batch', expectedRoute: '/batch' },
    { path: '/deleteUsers', expectedRoute: '/deleteUsers' },
    { path: '/customTransform', expectedRoute: '/customTransform' },
    { path: '/test-router/v0/ga/batch', expectedRoute: '/test-router/:version/:destination/batch' },
    { path: '/test-router/v0/ga', expectedRoute: '/test-router/:version/:destination' },
    { path: '/test-router/v0/health', expectedRoute: '/test-router/:version/health' },
    {
      path: '/test-router/custom_audience/parse-template',
      expectedRoute: '/test-router/custom_audience/parse-template',
    },
  ])('normalizes route labels for $path', ({ path, expectedRoute }) => {
    expect(getMemoryFencingRouteLabel(path)).toBe(expectedRoute);
    expect(MEMORY_FENCING_ROUTE_LABELS).toContain(expectedRoute);
  });

  it.each([
    ['/healthz'],
    ['/env'],
    ['/v0/destinations/'],
    ['/wp-admin/setup-config.php'],
    ['/workspaces/2abc/reconcileFunction'],
  ])('labels unknown path %s as "other" rather than echoing it back', (path) => {
    // The fence fires exactly when the process is already under memory pressure. Echoing the raw
    // path would let a path scanner add a new Prometheus child per request at the worst moment.
    expect(getMemoryFencingRouteLabel(path)).toBe('other');
  });
});
