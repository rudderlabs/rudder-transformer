import { memoryFenceMiddleware } from '../memoryFencing';
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

  afterEach(() => {
    process.memoryUsage = originalMemoryUsage;
    jest.clearAllMocks();
  });

  function mockCtx() {
    return {
      status: undefined,
      body: undefined,
      headers: {},
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
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_size_limit', 1000);
  });

  it('blocks request and increments counter when usage is above threshold', async () => {
    process.memoryUsage = jest.fn(() => ({
      heapUsed: 900,
    })) as any;

    const ctx = mockCtx();
    const next = jest.fn();

    await memoryFenceMiddleware({ thresholdPercent: 80 })(ctx, next);

    expect(next).not.toHaveBeenCalled();
    expect(ctx.status).toBe(503);
    expect(ctx.body).toMatch(/high memory load/i);
    expect(stats.counter).toHaveBeenCalledWith('memory_fenced_requests', 1);
    expect(ctx.headers['X-Rudder-Should-Retry']).toBe('true');
    expect(ctx.headers['X-Rudder-Error-Reason']).toBe('memory_fencing');
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_size_limit', 1000);
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

    const ctx = mockCtx();
    const next = jest.fn();

    await memoryFenceMiddleware()(ctx, next);

    expect(ctx.status).toBe(503);
    expect(stats.counter).toHaveBeenCalledWith('memory_fenced_requests', 1);
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
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_size_limit', 2000);
  });

  it('records the heap size limit only once during middleware creation', async () => {
    jest.clearAllMocks();

    const middleware = memoryFenceMiddleware({ thresholdPercent: 80 });
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_size_limit', 1000);
    expect(stats.gauge).toHaveBeenCalledTimes(1);

    // First request
    process.memoryUsage = jest.fn(() => ({ heapUsed: 400 })) as any;
    await middleware(mockCtx(), jest.fn());

    // Second request
    await middleware(mockCtx(), jest.fn());

    // Gauge should still only be called once during initialization, not on each request
    expect(stats.gauge).toHaveBeenCalledTimes(1);
  });

  it('checks memory usage periodically', async () => {
    jest.clearAllMocks();
    let mockNow = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => mockNow);

    const mockMemoryUsage = jest.fn(() => ({
      heapUsed: 400,
    })) as any;
    process.memoryUsage = mockMemoryUsage;

    const middleware = memoryFenceMiddleware({ thresholdPercent: 80 });
    expect(stats.gauge).toHaveBeenCalledWith('memory_heap_size_limit', 1000);
    expect(stats.gauge).toHaveBeenCalledTimes(1);
    expect(mockMemoryUsage).toHaveBeenCalledTimes(1);

    // call the middleware
    await middleware(mockCtx(), jest.fn());
    expect(mockMemoryUsage).toHaveBeenCalledTimes(1);
    // Simulate passage of time
    mockNow += 99;
    await middleware(mockCtx(), jest.fn());
    expect(mockMemoryUsage).toHaveBeenCalledTimes(1);

    // Simulate passage of time
    mockNow += 1;
    await middleware(mockCtx(), jest.fn());
    expect(mockMemoryUsage).toHaveBeenCalledTimes(2);
  });
});
