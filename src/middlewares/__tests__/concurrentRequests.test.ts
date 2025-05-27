import { concurrentRequests } from '../concurrentRequests';
import stats from '../../util/stats';
jest.useFakeTimers();

jest.mock('../../util/stats', () => ({
  gauge: jest.fn(),
}));

describe('concurrentRequests middleware', () => {
  let middleware: ReturnType<typeof concurrentRequests>;

  beforeEach(() => {
    jest.clearAllMocks();
    middleware = concurrentRequests();
  });

  function mockCtx() {
    return { status: undefined, body: undefined } as any;
  }

  it('increments and decrements concurrent counter', async () => {
    const ctx = mockCtx();
    const next = jest.fn();

    await middleware(ctx, next);
    expect(next).toHaveBeenCalled();
    // No assertion for stats.gauge here, as interval not passed
  });

  it('calls stats.gauge after interval', async () => {
    const ctx = mockCtx();
    const next = jest.fn();

    // First call, should not log
    await middleware(ctx, next);
    expect(stats.gauge).not.toHaveBeenCalled();

    // Advance time by 16 seconds
    jest.advanceTimersByTime(16 * 1000);

    // Second call, should log
    await middleware(ctx, next);
    expect(stats.gauge).toHaveBeenCalledWith('http_concurrent_requests', expect.any(Number));
  });

  it('decrements concurrent even if next throws', async () => {
    const ctx = mockCtx();
    const next = jest.fn().mockRejectedValue(new Error('fail'));

    await expect(middleware(ctx, next)).rejects.toThrow('fail');
    // No assertion for stats.gauge here, as interval not passed
  });

  it('tracks concurrent requests correctly', async () => {
    const ctx1 = mockCtx();
    const ctx2 = mockCtx();
    let resolve1: () => void;
    let resolve2: () => void;

    const next1 = jest.fn(
      () =>
        new Promise<void>((res) => {
          resolve1 = res;
        }),
    );
    const next2 = jest.fn(
      () =>
        new Promise<void>((res) => {
          resolve2 = res;
        }),
    );

    // Start first request
    const p1 = middleware(ctx1, next1);

    // Advance time to trigger stats.gauge
    jest.advanceTimersByTime(16 * 1000);

    // Start second request before first finishes
    const p2 = middleware(ctx2, next2);

    // Now resolve both
    resolve1!();
    resolve2!();

    await Promise.all([p1, p2]);
    expect(stats.gauge).toHaveBeenCalledWith('http_concurrent_requests', 2);
  });
});
