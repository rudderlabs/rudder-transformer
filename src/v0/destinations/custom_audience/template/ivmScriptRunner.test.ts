/**
 * Unit tests for IvmScriptRunner promise coalescing.
 *
 * Mocks isolated-vm with a 50ms delay in createContext() to guarantee the
 * race window is open. Without promise coalescing, N concurrent execute()
 * calls for the same cacheKey would each call createEntry(), creating N
 * isolates. With coalescing, only 1 is created.
 *
 * Verified to FAIL under three broken implementations:
 *   1. No coalescing at all (original code: get → miss → await createEntry → set)
 *   2. try { await createEntry() } catch — yields before storing the promise
 *   3. Any variant where the promise is stored AFTER an await
 * All produce isolateCreateCount = 5 instead of 1.
 */

// Tracks how many ivm.Isolate instances are constructed across all tests.
// Reset in beforeEach so each test starts at 0.
let isolateCreateCount = 0;

// --- Mocks ---

// DisposableCache depends on logger and stats — mock them so the real
// DisposableCache (with lru-cache) can be used without pulling in the
// full application logging/metrics stack.
jest.mock('../../../../logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const mockStats = {
  counter: jest.fn(),
  increment: jest.fn(),
  gauge: jest.fn(),
};
jest.mock('../../../../util/stats', () => mockStats);

// isolated-vm: lightweight mock with a 50ms delay in createContext() to
// simulate real async work and keep the race window open long enough for
// all 5 concurrent callers to enter getOrCreate() before the first one resolves.
jest.mock('isolated-vm', () => {
  class MockContext {
    release() {}

    async evalClosure(code: string) {
      // Test hook: `__THROW__ <kind>` simulates a platform failure inside the
      // isolate (timeout / OOM / disposed) so execute()'s catch path runs.
      if (code.includes('__THROW__')) {
        if (code.includes('timeout')) throw new Error('Script execution timed out.');
        if (code.includes('memory'))
          throw new Error('Isolate was disposed during execution due to memory limit');
        if (code.includes('disposed')) throw new Error('Isolate is disposed');
        throw new Error('boom');
      }
      if (code.includes('parseTemplateInSandbox')) {
        return { valid: true, recordFields: ['email'] };
      }
      return undefined;
    }
  }

  class MockScript {
    async run() {
      return undefined;
    }
  }

  class MockIsolate {
    private disposed = false;

    constructor() {
      isolateCreateCount++;
    }

    async createContext() {
      // This delay is the key to the test. createEntry() awaits createContext(),
      // which yields the event loop for 50ms. During that window, all other
      // concurrent callers enter getOrCreate() and observe the cache is empty.
      //
      // With coalescing: they find the pending promise in the map and await it.
      // Without coalescing: they each start their own createEntry().
      await new Promise((r) => setTimeout(r, 50));
      return new MockContext();
    }

    async compileScript() {
      return new MockScript();
    }

    getHeapStatisticsSync() {
      if (this.disposed) throw new Error('Isolate is disposed');
      return { used_heap_size: 1024, total_heap_size: 2048 };
    }

    dispose() {
      this.disposed = true;
    }
  }

  return { __esModule: true, default: { Isolate: MockIsolate } };
});

import { IvmScriptRunner, BUNDLE_PATH } from './ivmScriptRunner';

const restoreEnv = (key: string, value: string | undefined) => {
  if (value !== undefined) {
    process.env[key] = value;
  } else {
    delete process.env[key];
  }
};

const hasAggregateHeapGaugeCall = (heapSize: number) =>
  mockStats.gauge.mock.calls.some(
    ([metric, value, tags]) =>
      metric === 'ivm_cache_total_heap' &&
      value === heapSize &&
      tags?.cache === 'custom_audience_ivm',
  );

const waitForAggregateHeapGauge = async (heapSize: number) => {
  const timeoutAt = Date.now() + 2_000;

  while (Date.now() < timeoutAt) {
    if (hasAggregateHeapGaugeCall(heapSize)) {
      return;
    }
    await new Promise((r) => setTimeout(r, 25));
  }

  expect(mockStats.gauge).toHaveBeenCalledWith('ivm_cache_total_heap', heapSize, {
    cache: 'custom_audience_ivm',
  });
};

const waitForTtlExpiryAndPurge = async (runner: IvmScriptRunner, cacheKey: string) => {
  await new Promise((r) => setTimeout(r, 150));
  // Access after TTL makes lru-cache purge stale entries deterministically.
  (runner as any).cache.get(cacheKey);
};

describe('IvmScriptRunner', () => {
  let runner: IvmScriptRunner;

  beforeEach(() => {
    isolateCreateCount = 0;
    mockStats.gauge.mockClear();
    mockStats.increment.mockClear();
    runner = new IvmScriptRunner({
      bundlePath: BUNDLE_PATH,
      memoryLimitMb: 8,
      initTimeoutMs: 5_000,
      execTimeoutMs: 1_000,
      cacheName: 'custom_audience_ivm',
    });
  });

  describe('promise coalescing', () => {
    it('should create only one isolate for concurrent calls with the same cacheKey', async () => {
      const expression = 'parseTemplateInSandbox("test")';

      // Fire 5 concurrent calls with the SAME key.
      //
      // Timeline with coalescing (current code):
      //   Caller 1: cache miss → creates promise → stores in pendingCreations → awaits
      //   Callers 2-5: cache miss → find pending promise → await the SAME promise
      //   createEntry() resolves → .then stores in cache → all 5 callers get the entry
      //   Result: isolateCreateCount = 1
      //
      // Timeline WITHOUT coalescing (old code / try-catch):
      //   All 5: cache miss → no pending promise → each starts createEntry()
      //   5 isolates created independently
      //   Result: isolateCreateCount = 5  ← test fails
      const results = await Promise.all(
        Array.from({ length: 5 }, () => runner.execute('ws-1', expression, [])),
      );

      expect(results).toHaveLength(5);
      for (const result of results) {
        expect(result).toEqual({ valid: true, recordFields: ['email'] });
      }

      // The critical assertion: only ONE isolate created, not 5.
      expect(isolateCreateCount).toBe(1);
    });

    it('should create separate isolates for different cacheKeys', async () => {
      const expression = 'parseTemplateInSandbox("test")';

      // Different keys must NOT share isolates — coalescing is per-key only.
      const results = await Promise.all([
        runner.execute('ws-1', expression, []),
        runner.execute('ws-2', expression, []),
        runner.execute('ws-3', expression, []),
      ]);

      expect(results).toHaveLength(3);
      for (const result of results) {
        expect(result).toEqual({ valid: true, recordFields: ['email'] });
      }

      expect(isolateCreateCount).toBe(3);
    });

    it('should retry creation after a transient failure', async () => {
      // Verifies the .finally() cleanup path: when createEntry() rejects,
      // pendingCreations is cleaned up so subsequent calls retry fresh
      // instead of being stuck awaiting a permanently-rejected promise.
      let callCount = 0;
      jest.spyOn(runner as any, 'createEntry').mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error('transient failure');
        }
        return {
          isolate: {
            compileScript: async () => ({ run: async () => undefined }),
            dispose: () => {},
          },
          context: { evalClosure: async () => 'ok', release: () => {} },
          destroy: async () => {},
        };
      });

      // First call: createEntry rejects → .finally deletes from pendingCreations → throws
      await expect(runner.execute('ws-fail', '1+1', [])).rejects.toThrow('transient failure');

      // Second call: pendingCreations is clean → retries createEntry → succeeds
      const result = await runner.execute('ws-fail', '1+1', []);
      expect(result).toBe('ok');
      expect(callCount).toBe(2);
    });
  });

  describe('platform error metrics', () => {
    it('emits ivm_platform_error tagged with the expression, workspaceId (cacheKey) and cache', async () => {
      const expression = 'return evaluateTemplateInSandbox($0) /* __THROW__ timeout */';

      await expect(runner.execute('ws-err', expression, [])).rejects.toThrow(
        'Script execution timed out.',
      );

      expect(mockStats.increment).toHaveBeenCalledWith('ivm_platform_error', {
        functionName: expression,
        workspaceId: 'ws-err',
        cache: 'custom_audience_ivm',
      });
    });

    it('does not emit the platform error metric on success', async () => {
      await runner.execute('ws-ok', 'return parseTemplateInSandbox($0)', []);

      expect(mockStats.increment).not.toHaveBeenCalledWith('ivm_platform_error', expect.anything());
    });
  });

  describe('heap metrics', () => {
    it('should emit aggregate heap gauges on cache mutation (new entry)', async () => {
      await runner.execute('ws-1', 'parseTemplateInSandbox("test")', []);

      expect(mockStats.gauge).toHaveBeenCalledWith('ivm_cache_total_heap', 2048, {
        cache: 'custom_audience_ivm',
      });
    });

    it('should not emit aggregate on cache hit (no mutation)', async () => {
      await runner.execute('ws-1', 'parseTemplateInSandbox("test")', []);
      mockStats.gauge.mockClear();

      // Second call hits the cache — no mutation, no aggregate
      await runner.execute('ws-1', 'parseTemplateInSandbox("test")', []);

      expect(mockStats.gauge).not.toHaveBeenCalledWith(
        'ivm_cache_total_heap',
        expect.anything(),
        expect.anything(),
      );
    });

    it('should sum heap across multiple cached isolates on new entry', async () => {
      await runner.execute('ws-1', 'parseTemplateInSandbox("test")', []);
      mockStats.gauge.mockClear();

      // Adding ws-2 triggers aggregate with 2 entries in cache
      await runner.execute('ws-2', 'parseTemplateInSandbox("test")', []);

      expect(mockStats.gauge).toHaveBeenCalledWith('ivm_cache_total_heap', 4096, {
        cache: 'custom_audience_ivm',
      });
    });

    it('should emit 0 aggregate after TTL expiry', async () => {
      const shortTtlRunner = new IvmScriptRunner({
        bundlePath: BUNDLE_PATH,
        memoryLimitMb: 8,
        initTimeoutMs: 5_000,
        execTimeoutMs: 1_000,
        cacheName: 'custom_audience_ivm',
        ttlMs: 100,
      });

      await shortTtlRunner.execute('ws-ttl', 'parseTemplateInSandbox("test")', []);
      mockStats.gauge.mockClear();

      await waitForTtlExpiryAndPurge(shortTtlRunner, 'ws-ttl');
      await waitForAggregateHeapGauge(0);
    });

    it('should emit 0 aggregate after TTL expiry on second request too', async () => {
      const shortTtlRunner = new IvmScriptRunner({
        bundlePath: BUNDLE_PATH,
        memoryLimitMb: 8,
        initTimeoutMs: 5_000,
        execTimeoutMs: 1_000,
        cacheName: 'custom_audience_ivm',
        ttlMs: 100,
      });

      await shortTtlRunner.execute('ws-ttl', 'parseTemplateInSandbox("test")', []);
      await waitForTtlExpiryAndPurge(shortTtlRunner, 'ws-ttl');
      await waitForAggregateHeapGauge(0);

      await shortTtlRunner.execute('ws-ttl', 'parseTemplateInSandbox("test")', []);
      mockStats.gauge.mockClear();

      await waitForTtlExpiryAndPurge(shortTtlRunner, 'ws-ttl');
      await waitForAggregateHeapGauge(0);
    });

    it('should reflect correct aggregate after LRU eviction', async () => {
      const savedMaxSize = process.env.IVM_CACHE_MAX_SIZE;
      process.env.IVM_CACHE_MAX_SIZE = '2';

      try {
        const smallCacheRunner = new IvmScriptRunner({
          bundlePath: BUNDLE_PATH,
          memoryLimitMb: 8,
          initTimeoutMs: 5_000,
          execTimeoutMs: 1_000,
          cacheName: 'custom_audience_ivm',
        });

        // Fill cache to max (2 entries)
        await smallCacheRunner.execute('ws-1', 'parseTemplateInSandbox("test")', []);
        await smallCacheRunner.execute('ws-2', 'parseTemplateInSandbox("test")', []);
        mockStats.gauge.mockClear();

        // 3rd key evicts ws-1 (LRU). After set, cache has ws-2 + ws-3.
        await smallCacheRunner.execute('ws-3', 'parseTemplateInSandbox("test")', []);

        // disposeAfter fires asynchronously — wait one tick
        await new Promise((r) => setTimeout(r, 0));

        // Aggregate should reflect 2 live entries (ws-2 + ws-3), not 3
        expect(mockStats.gauge).toHaveBeenCalledWith('ivm_cache_total_heap', 4096, {
          cache: 'custom_audience_ivm',
        });
      } finally {
        restoreEnv('IVM_CACHE_MAX_SIZE', savedMaxSize);
      }
    });
  });
});
