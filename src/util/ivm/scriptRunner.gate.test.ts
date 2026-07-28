/**
 * Unit tests for IvmScriptRunner's per-isolate execution gate.
 *
 * An isolate has one fixed-size heap shared by every concurrent evaluation on it, so an
 * ungated burst can breach `memoryLimit` and make V8 dispose the whole isolate — failing
 * every in-flight call at once. These tests pin the gate that caps that concurrency.
 *
 * `isolated-vm` is mocked with an evalClosure that never settles on its own, so a test can
 * hold executions open and observe exactly how many the gate lets run at a time.
 *
 * Kept separate from `scriptRunner.test.ts` (the platform-error counter suite) because the two
 * need incompatible module mocks: that file stubs `fs` and `DisposableCache`, whereas these
 * tests exercise the real cache so gate teardown can be observed against real eviction.
 */

interface MockPendingExecution {
  code: string;
  finish: (value: unknown) => void;
  fail: (err: unknown) => void;
}

// Executions that have entered the isolate and not yet settled. Tests drain this to
// free slots. Reset in beforeEach.
let mockPendingExecutions: MockPendingExecution[] = [];
let mockRunningNow = 0;
let mockPeakRunning = 0;

// --- Mocks ---

// Leaf deps only — the real DisposableCache is exercised.
jest.mock('../../logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const mockStats = {
  increment: jest.fn(),
  // execute() seeds the platform-error counter at 0 on each isolate build; unmocked it would
  // throw inside the gated path and turn every test here into a platform error.
  counter: jest.fn(),
  gauge: jest.fn(),
  timing: jest.fn(),
};
jest.mock('../stats', () => mockStats);

jest.mock('isolated-vm', () => {
  class MockContext {
    release() {}

    evalClosure(code: string) {
      mockRunningNow += 1;
      mockPeakRunning = Math.max(mockPeakRunning, mockRunningNow);
      return new Promise((resolve, reject) => {
        mockPendingExecutions.push({
          code,
          finish: (value) => {
            mockRunningNow -= 1;
            resolve(value);
          },
          fail: (err) => {
            mockRunningNow -= 1;
            reject(err);
          },
        });
      });
    }
  }

  class MockScript {
    async run() {
      return undefined;
    }
  }

  class MockIsolate {
    async createContext() {
      return new MockContext();
    }

    async compileScript() {
      return new MockScript();
    }

    getHeapStatisticsSync() {
      return { used_heap_size: 1024, total_heap_size: 2048 };
    }

    dispose() {}
  }

  return { __esModule: true, default: { Isolate: MockIsolate } };
});

import { IvmScriptRunner } from './scriptRunner';

// The isolate is mocked, so the bundle is never executed — it only has to exist to be read.
const BUNDLE_PATH = __filename;

const buildRunner = (overrides: Partial<ConstructorParameters<typeof IvmScriptRunner>[0]> = {}) =>
  new IvmScriptRunner({
    bundlePath: BUNDLE_PATH,
    memoryLimitMb: 8,
    initTimeoutMs: 5_000,
    execTimeoutMs: 1_000,
    cacheName: 'test_ivm',
    ...overrides,
  });

/**
 * Wait until exactly `count` executions are inside the isolate. Isolate construction is
 * async, so admitted calls reach evalClosure a few microtasks after execute() is invoked.
 */
const waitForRunning = async (count: number) => {
  const deadline = Date.now() + 2_000;
  while (mockPendingExecutions.length !== count && Date.now() < deadline) {
    await new Promise((r) => setImmediate(r));
  }
  expect(mockPendingExecutions.length).toBe(count);
};

/** Settle the oldest in-flight execution, freeing its slot for a queued caller. */
const finishOldest = (value: unknown = 'ok') => {
  const execution = mockPendingExecutions.shift();
  expect(execution).toBeDefined();
  execution?.finish(value);
};

const failOldest = (err: Error) => {
  const execution = mockPendingExecutions.shift();
  expect(execution).toBeDefined();
  execution?.fail(err);
};

const gatesOf = (runner: IvmScriptRunner): Map<string, unknown> =>
  (runner as unknown as { gates: Map<string, unknown> }).gates;

/** How many calls have been counted as queued so far. */
const queuedCount = () =>
  mockStats.increment.mock.calls.filter(([name]) => name === 'ivm_execution_queued').length;

describe('IvmScriptRunner execution gate', () => {
  beforeEach(() => {
    mockPendingExecutions = [];
    mockRunningNow = 0;
    mockPeakRunning = 0;
    mockStats.increment.mockClear();
    mockStats.gauge.mockClear();
    mockStats.timing.mockClear();
  });

  describe('concurrency cap', () => {
    it('should admit only up to the cap at once and run the rest as slots free', async () => {
      const runner = buildRunner({ maxConcurrentExecutions: 2 });

      const calls = [1, 2, 3, 4, 5].map((n) => runner.execute('ws-1', `call-${n}`, []));

      await waitForRunning(2);
      // Draining one at a time proves a queued call only enters once a slot is free.
      finishOldest();
      await waitForRunning(2);
      finishOldest();
      await waitForRunning(2);
      finishOldest();
      await waitForRunning(2);
      finishOldest();
      await waitForRunning(1);
      finishOldest();

      await expect(Promise.all(calls)).resolves.toEqual(['ok', 'ok', 'ok', 'ok', 'ok']);
      expect(mockPeakRunning).toBe(2);
    });

    it('should hold the cap when new calls arrive while the queue is draining', async () => {
      const runner = buildRunner({ maxConcurrentExecutions: 2 });

      const calls = [1, 2, 3].map((n) => runner.execute('ws-1', `first-${n}`, []));
      await waitForRunning(2);

      // Let the queued call take over the freed slot first, so any drift in the slot
      // accounting has landed, and only then pile on fresh arrivals. If release freed the
      // slot *and* woke a waiter, the gate would now believe it has room and over-admit.
      finishOldest();
      await waitForRunning(2);
      calls.push(...[4, 5].map((n) => runner.execute('ws-1', `later-${n}`, [])));
      await new Promise((r) => setImmediate(r));

      while (mockPendingExecutions.length > 0) {
        finishOldest();
        await new Promise((r) => setImmediate(r));
      }

      await expect(Promise.all(calls)).resolves.toHaveLength(5);
      expect(mockPeakRunning).toBe(2);
    });

    it('should leave execution ungated when no cap is configured', async () => {
      const runner = buildRunner();

      const calls = [1, 2, 3, 4, 5].map((n) => runner.execute('ws-1', `call-${n}`, []));

      await waitForRunning(5);
      expect(mockPeakRunning).toBe(5);
      mockPendingExecutions.splice(0).forEach((execution) => execution.finish('ok'));
      await expect(Promise.all(calls)).resolves.toHaveLength(5);
    });

    it('should leave execution ungated when the cap is unparseable or nonsensical', async () => {
      // Number.parseInt on a bad env var yields NaN, and a zero/negative cap is equally
      // nonsensical. Both must degrade to today's ungated behaviour rather than admitting
      // nothing and wedging the sandbox.
      for (const cap of [NaN, 0, -1]) {
        const runner = buildRunner({ maxConcurrentExecutions: cap });
        const calls = [1, 2, 3].map((n) => runner.execute('ws-1', `cap-${cap}-${n}`, []));

        await waitForRunning(3);
        mockPendingExecutions.splice(0).forEach((execution) => execution.finish('ok'));
        await expect(Promise.all(calls)).resolves.toHaveLength(3);
      }
    });

    it('should gate each isolate independently', async () => {
      const runner = buildRunner({ maxConcurrentExecutions: 1 });

      const workspace1 = [
        runner.execute('ws-1', 'ws-1-first', []),
        runner.execute('ws-1', 'ws-1-queued', []),
      ];
      const workspace2 = runner.execute('ws-2', 'ws-2-first', []);

      // ws-1 is saturated, but its queue must not hold up a different workspace's isolate.
      await waitForRunning(2);
      expect(mockPendingExecutions.map((execution) => execution.code)).toEqual([
        'ws-1-first',
        'ws-2-first',
      ]);

      mockPendingExecutions.splice(0).forEach((execution) => execution.finish('ok'));
      await waitForRunning(1);
      expect(mockPendingExecutions[0].code).toBe('ws-1-queued');
      finishOldest();

      await expect(Promise.all([...workspace1, workspace2])).resolves.toHaveLength(3);
    });

    it('should release the slot when an execution fails so queued calls still run', async () => {
      const runner = buildRunner({ maxConcurrentExecutions: 1 });

      const failing = runner.execute('ws-1', 'boom', []);
      const queued = runner.execute('ws-1', 'after-boom', []);

      await waitForRunning(1);
      failOldest(new Error('Isolate is disposed'));
      await expect(failing).rejects.toThrow('Isolate is disposed');

      await waitForRunning(1);
      expect(mockPendingExecutions[0].code).toBe('after-boom');
      finishOldest();
      await expect(queued).resolves.toBe('ok');
    });

    it('should drop the gate once an isolate goes idle', async () => {
      const runner = buildRunner({ maxConcurrentExecutions: 2 });

      const calls = [runner.execute('ws-1', 'call-1', []), runner.execute('ws-1', 'call-2', [])];
      await waitForRunning(2);
      expect(gatesOf(runner).size).toBe(1);

      mockPendingExecutions.splice(0).forEach((execution) => execution.finish('ok'));
      await Promise.all(calls);

      // Otherwise `gates` would grow with every workspace ever seen.
      expect(gatesOf(runner).size).toBe(0);
    });

    it('should keep the gate while another call still holds a slot', async () => {
      const runner = buildRunner({ maxConcurrentExecutions: 2 });

      const calls = [runner.execute('ws-1', 'call-1', []), runner.execute('ws-1', 'call-2', [])];
      await waitForRunning(2);

      finishOldest();
      await new Promise((r) => setImmediate(r));
      // Dropping the gate here would let the next arrival build a fresh one with no slots
      // recorded and admit past the cap while this call is still on the isolate.
      expect(gatesOf(runner).size).toBe(1);

      finishOldest();
      await Promise.all(calls);
      expect(gatesOf(runner).size).toBe(0);
    });
  });

  describe('queue metrics', () => {
    it('should count only the calls that had to queue', async () => {
      const runner = buildRunner({ maxConcurrentExecutions: 2 });

      // Two fit under the cap, so nothing is queued yet.
      const calls = [1, 2].map((n) => runner.execute('ws-1', `call-${n}`, []));
      await waitForRunning(2);
      expect(queuedCount()).toBe(0);

      // The next three have to wait. Counted at enqueue, so all three register immediately
      // rather than trickling in as the queue drains.
      calls.push(...[3, 4, 5].map((n) => runner.execute('ws-1', `call-${n}`, [])));
      await new Promise((r) => setImmediate(r));
      expect(queuedCount()).toBe(3);
      expect(mockStats.increment).toHaveBeenCalledWith('ivm_execution_queued', {
        functionName: 'call-3',
        workspaceId: 'ws-1',
        cache: 'test_ivm',
      });

      while (mockPendingExecutions.length > 0) {
        finishOldest();
        await new Promise((r) => setImmediate(r));
      }
      await expect(Promise.all(calls)).resolves.toHaveLength(5);
      expect(queuedCount()).toBe(3);
    });

    it('should record how long a call waited for a slot', async () => {
      const runner = buildRunner({ maxConcurrentExecutions: 1 });

      const running = runner.execute('ws-1', 'running', []);
      const queued = runner.execute('ws-1', 'queued', []);

      await waitForRunning(1);
      expect(mockStats.timing).not.toHaveBeenCalled();
      finishOldest();
      await waitForRunning(1);

      // Same label set as `ivm_execution_queued`, so the counter and the wait distribution
      // can be joined per (workspace, function).
      expect(mockStats.timing).toHaveBeenCalledWith('ivm_execution_queue_wait', expect.any(Date), {
        functionName: 'queued',
        workspaceId: 'ws-1',
        cache: 'test_ivm',
      });
      finishOldest();
      await expect(Promise.all([running, queued])).resolves.toEqual(['ok', 'ok']);
    });
  });
});
