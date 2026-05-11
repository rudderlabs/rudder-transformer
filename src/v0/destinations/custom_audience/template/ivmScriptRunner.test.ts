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

jest.mock('../../../../util/stats', () => ({
  increment: jest.fn(),
  gauge: jest.fn(),
}));

// isolated-vm: lightweight mock with a 50ms delay in createContext() to
// simulate real async work and keep the race window open long enough for
// all 5 concurrent callers to enter getOrCreate() before the first one resolves.
jest.mock('isolated-vm', () => {
  class MockContext {
    release() {}

    async evalClosure(code: string) {
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

    dispose() {}
  }

  return { __esModule: true, default: { Isolate: MockIsolate } };
});

// fs: mock readFileSync (getBundleCode) so we don't need the real esbuild bundle on disk.
jest.mock('fs', () => {
  const actual = jest.requireActual('fs');
  return {
    ...actual,
    readFileSync: jest.fn().mockReturnValue('// mock bundle'),
  };
});

import { IvmScriptRunner } from './ivmScriptRunner';

describe('IvmScriptRunner', () => {
  let runner: IvmScriptRunner;

  beforeEach(() => {
    isolateCreateCount = 0;
    runner = new IvmScriptRunner({
      bundlePath: '/fake/bundle.js',
      memoryLimitMb: 8,
      initTimeoutMs: 5_000,
      execTimeoutMs: 1_000,
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
});
