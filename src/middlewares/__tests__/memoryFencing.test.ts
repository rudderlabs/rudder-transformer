import {
  emitMemoryHeapSizeLimit,
  getMemoryFencingRouteLabel,
  memoryFenceMiddleware,
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

  function mockCtx(path = '/v0/destinations/ga', matchedRoute?: string) {
    return {
      status: undefined,
      body: undefined,
      path,
      _matchedRoute: matchedRoute,
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
    expect(stats.counter).not.toHaveBeenCalled();
    expect(ctx.headers['X-Rudder-Should-Retry']).toBeUndefined();
    expect(ctx.headers['X-Rudder-Error-Reason']).toBeUndefined();
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_used_percent', 40);
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
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_used_percent', 90);
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
    expect(ctx.headers['X-Rudder-Should-Retry']).toBe('true');
    expect(ctx.headers['X-Rudder-Error-Reason']).toBe('memory_fencing');
  });

  it('calculates memory percentage based on v8 heap size limit', async () => {
    (v8.getHeapStatistics as jest.Mock).mockReturnValueOnce({
      heap_size_limit: 2000,
    });

    process.memoryUsage = jest.fn(() => ({
      heapUsed: 900,
    })) as any;

    const ctx = mockCtx();
    const next = jest.fn();

    await memoryFenceMiddleware({ thresholdPercent: 50 })(ctx, next);

    expect(next).toHaveBeenCalled();
    expect(ctx.status).toBeUndefined();
    expect(stats.counter).not.toHaveBeenCalled();
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_used_percent', 45);
  });

  it('records the heap used percent for the initial cached value and each request', async () => {
    process.memoryUsage = jest.fn(() => ({ heapUsed: 400 })) as any;

    const middleware = memoryFenceMiddleware({ thresholdPercent: 80 });
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_used_percent', 40);
    expect(stats.gauge).toHaveBeenCalledTimes(1);

    await middleware(mockCtx(), jest.fn());
    await middleware(mockCtx(), jest.fn());

    expect(stats.gauge).toHaveBeenCalledTimes(3);
    expect(stats.gauge).toHaveBeenNthCalledWith(1, 'memory_heap_used_percent', 40);
    expect(stats.gauge).toHaveBeenNthCalledWith(2, 'memory_heap_used_percent', 40);
    expect(stats.gauge).toHaveBeenNthCalledWith(3, 'memory_heap_used_percent', 40);
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
    expect(stats.gauge).toHaveBeenLastCalledWith('memory_heap_used_percent', 40);
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
      expect(stats.counter).not.toHaveBeenCalled();
      expect(ctx.headers['X-Rudder-Should-Retry']).toBeUndefined();
      expect(ctx.headers['X-Rudder-Error-Reason']).toBeUndefined();
      expect(stats.gauge).toHaveBeenCalledWith('memory_heap_used_percent', 90);
    },
  );

  it('emits heap size limit through the explicit helper', () => {
    const limit = emitMemoryHeapSizeLimit();

    expect(limit).toBe(1000);
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_size_limit', 1000);
  });

  it('does not emit invalid heap size limits', () => {
    (v8.getHeapStatistics as jest.Mock).mockReturnValueOnce({
      heap_size_limit: 0,
    });

    const limit = emitMemoryHeapSizeLimit();

    expect(limit).toBe(0);
    expect(stats.gauge).not.toHaveBeenCalled();
  });

  it.each([
    {
      path: '/v0/destinations/ga',
      expectedRoute: '/:version/destinations/:destination',
    },
    {
      path: '/v0/destinations/ga/proxy',
      expectedRoute: '/v0/destinations/:destination/proxy',
    },
    {
      path: '/v1/destinations/ga/proxy',
      expectedRoute: '/v1/destinations/:destination/proxy',
    },
    {
      path: '/v0/destinations/ga/proxyTest',
      expectedRoute: '/:version/destinations/:destination/proxyTest',
    },
    {
      path: '/v0/sources/rudderstack',
      expectedRoute: '/:version/sources/:source',
    },
    {
      path: '/v0/sources/rudderstack/hydrate',
      expectedRoute: '/:version/sources/:source/hydrate',
    },
    {
      path: '/test-router/v0/ga/batch',
      expectedRoute: '/test-router/:version/:destination/batch',
    },
    {
      path: '/test-router/v0/ga',
      expectedRoute: '/test-router/:version/:destination',
    },
    {
      path: '/test-router/v0/health',
      expectedRoute: '/test-router/:version/health',
    },
    {
      path: '/test-router/custom_audience/parse-template',
      expectedRoute: '/test-router/custom_audience/parse-template',
    },
    {
      path: '/custom/path',
      expectedRoute: '/custom/path',
    },
  ])('normalizes route labels for $path', ({ path, expectedRoute }) => {
    expect(getMemoryFencingRouteLabel(mockCtx(path))).toBe(expectedRoute);
  });

  it('prefers matched route metadata for the route label', () => {
    expect(getMemoryFencingRouteLabel(mockCtx('/v0/destinations/ga', '/matched/:route'))).toBe(
      '/matched/:route',
    );
  });
});
