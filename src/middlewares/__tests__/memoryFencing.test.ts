import { memoryFenceMiddleware } from '../memoryFencing';
import stats from '../../util/stats';

jest.mock('../../util/stats', () => ({
  counter: jest.fn(),
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
      heapUsed: 40,
      heapTotal: 100,
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
  });

  it('blocks request and increments counter when usage is above threshold', async () => {
    process.memoryUsage = jest.fn(() => ({
      heapUsed: 90,
      heapTotal: 100,
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
  });

  it('respects custom statusCode', async () => {
    process.memoryUsage = jest.fn(() => ({
      heapUsed: 90,
      heapTotal: 100,
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
      heapUsed: 90,
      heapTotal: 100,
    })) as any;

    const ctx = mockCtx();
    const next = jest.fn();

    await memoryFenceMiddleware()(ctx, next);

    expect(ctx.status).toBe(503);
    expect(stats.counter).toHaveBeenCalledWith('memory_fenced_requests', 1);
    expect(ctx.headers['X-Rudder-Should-Retry']).toBe('true');
    expect(ctx.headers['X-Rudder-Error-Reason']).toBe('memory_fencing');
  });
});
