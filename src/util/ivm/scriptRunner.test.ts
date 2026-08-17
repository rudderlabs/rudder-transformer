import { IvmScriptRunner } from './scriptRunner';
import stats from '../stats';

// evalClosure is the sandbox entry point; each test controls whether it resolves or throws.
const evalClosure = jest.fn();

// Fidelity note: these mocks are independent jest.fn()s, but in production `stats.increment`
// delegates to `stats.counter(name, 1)` (see stats.js). So do NOT assert a total `stats.counter`
// call count across a path that also errors — the real client would count the increment as a
// counter call too. Assert seed calls via `('ivm_platform_error', 0, ...)` and error calls via
// `stats.increment` instead. The 0-seed's non-reset semantics are covered in prometheus.test.js.
jest.mock('../stats', () => ({
  counter: jest.fn(),
  increment: jest.fn(),
  gauge: jest.fn(),
}));

// Avoid reading a real bundle from disk — the runner only feeds this into compileScript, which is mocked.
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue('// bundle'),
  existsSync: jest.fn(),
}));

// Replace isolated-vm with a lightweight fake: no real isolate is built, and evalClosure is our hook.
jest.mock('isolated-vm', () => ({
  // isDisposed starts false, like a real isolate — it only flips to true when the real
  // isolated-vm terminates the isolate (explicit dispose(), or a memory-limit breach), never
  // on a plain execution timeout. Tests that simulate a real disposal flip it explicitly via
  // `ivm.Isolate.mock.results[0].value.isDisposed = true` before rejecting.
  Isolate: jest.fn().mockImplementation(() => ({
    isDisposed: false,
    createContext: jest.fn().mockResolvedValue({
      evalClosure: (...callArgs: unknown[]) => evalClosure(...callArgs),
      release: jest.fn(),
    }),
    compileScript: jest.fn().mockResolvedValue({ run: jest.fn().mockResolvedValue(undefined) }),
    getHeapStatisticsSync: jest.fn().mockReturnValue({ total_heap_size: 0 }),
    dispose: jest.fn(),
  })),
}));

// A Map-backed DisposableCache stand-in — keeps the test off real TTL timers and init logging.
jest.mock('../ivmCache/index', () =>
  jest.fn().mockImplementation((opts: { name: string }) => {
    const store = new Map<string, unknown>();
    return {
      cacheName: opts.name,
      get: (k: string) => store.get(k),
      set: (k: string, v: unknown) => store.set(k, v),
      delete: (k: string) => store.delete(k),
      values: () => store.values(),
    };
  }),
);

const makeRunner = () =>
  new IvmScriptRunner({
    bundlePath: '/tmp/bundle.js',
    memoryLimitMb: 8,
    initTimeoutMs: 100,
    execTimeoutMs: 100,
    cacheName: 'custom_mappings_ivm',
  });

const EXPRESSION = 'return evaluateCustomMappingsInSandbox($0, $1)';
const WORKSPACE = 'ws-1';
const EXPECTED_TAGS = {
  functionName: EXPRESSION,
  workspaceId: WORKSPACE,
  cache: 'custom_mappings_ivm',
};
// One 0-seed is materialised per errorType per isolate build, so the alert has a baseline no
// matter which errorType the first burst turns out to be.
const ERROR_TYPES = ['timeout', 'disposed', 'other'] as const;
const tagsFor = (errorType: (typeof ERROR_TYPES)[number]) => ({ ...EXPECTED_TAGS, errorType });
const expectSeeded = () =>
  ERROR_TYPES.forEach((errorType) =>
    expect(stats.counter).toHaveBeenCalledWith('ivm_platform_error', 0, tagsFor(errorType)),
  );

describe('IvmScriptRunner.execute platform-error counter', () => {
  beforeEach(() => jest.clearAllMocks());

  it('seeds the platform-error counter at 0 per errorType on the happy path', async () => {
    evalClosure.mockResolvedValue({ ok: true, value: { id: 'u1' } });

    await makeRunner().execute(WORKSPACE, EXPRESSION, [{}, {}]);

    // All three errorType series exist before any error can, giving rate()/increase() a 0 -> N
    // edge regardless of which errorType the first burst turns out to be.
    expect(stats.counter).toHaveBeenCalledTimes(ERROR_TYPES.length);
    expectSeeded();
    // A successful run must not record an error.
    expect(stats.increment).not.toHaveBeenCalledWith('ivm_platform_error', expect.anything());
  });

  it('seeds 0 before running and increments with errorType "timeout" on a timeout', async () => {
    evalClosure.mockRejectedValue(new Error('Script execution timed out'));

    await expect(makeRunner().execute(WORKSPACE, EXPRESSION, [{}, {}])).rejects.toThrow(
      'Script execution timed out',
    );

    expectSeeded();
    // The isolate was never disposed, so this is classified as a timeout, not "disposed".
    expect(stats.increment).toHaveBeenCalledWith('ivm_platform_error', tagsFor('timeout'));
  });

  it('increments with errorType "other" for a non-timeout error that leaves the isolate alive', async () => {
    evalClosure.mockRejectedValue(new Error('some sandboxed script exception'));

    await expect(makeRunner().execute(WORKSPACE, EXPRESSION, [{}, {}])).rejects.toThrow(
      'some sandboxed script exception',
    );

    expectSeeded();
    expect(stats.increment).toHaveBeenCalledWith('ivm_platform_error', tagsFor('other'));
  });

  it('seeds 0 even when isolate creation itself fails (build-time platform error)', async () => {
    const ivm = require('isolated-vm');
    ivm.Isolate.mockImplementationOnce(() => ({
      createContext: jest
        .fn()
        .mockRejectedValue(new Error('Isolate was disposed during execution')),
      compileScript: jest.fn(),
      getHeapStatisticsSync: jest.fn(),
      dispose: jest.fn(),
    }));

    await expect(makeRunner().execute(WORKSPACE, EXPRESSION, [{}, {}])).rejects.toThrow(
      'Isolate was disposed during execution',
    );

    // The seed runs before the isolate is built, so build-time failures are covered too. No
    // entry was ever created, so the eviction check's default-to-disposed kicks in.
    expectSeeded();
    expect(stats.increment).toHaveBeenCalledWith('ivm_platform_error', tagsFor('disposed'));
  });

  it('seeds only once per isolate — warm-isolate calls do not touch the metrics registry', async () => {
    evalClosure.mockResolvedValue({ ok: true, value: { id: 'u1' } });
    const runner = makeRunner();

    // First call builds the isolate (cache miss) and seeds; the next two reuse the warm
    // isolate (cache hits) and must not re-seed — the hot path stays off the registry.
    await runner.execute(WORKSPACE, EXPRESSION, [{}, {}]);
    await runner.execute(WORKSPACE, EXPRESSION, [{}, {}]);
    await runner.execute(WORKSPACE, EXPRESSION, [{}, {}]);

    expect(stats.counter).toHaveBeenCalledTimes(ERROR_TYPES.length);
    expectSeeded();
  });

  it('coalesces concurrent first-callers — one set of 0-seeds and one isolate build for the same key', async () => {
    evalClosure.mockResolvedValue({ ok: true, value: { id: 'u1' } });
    const ivm = require('isolated-vm');
    const runner = makeRunner();

    // Fire two calls for the same key before the first isolate finishes building. getOrCreate
    // sets pendingCreations synchronously (no await before it returns), so the second caller must
    // join the in-flight creation rather than seed/build a second time.
    await Promise.all([
      runner.execute(WORKSPACE, EXPRESSION, [{}, {}]),
      runner.execute(WORKSPACE, EXPRESSION, [{}, {}]),
    ]);

    expect(ivm.Isolate).toHaveBeenCalledTimes(1);
    expect(stats.counter).toHaveBeenCalledTimes(ERROR_TYPES.length);
    expectSeeded();
  });

  it('does not re-seed or rebuild after an error that leaves the isolate undisposed', async () => {
    const ivm = require('isolated-vm');
    const runner = makeRunner();

    // A timeout only interrupts the running script — isolated-vm never calls dispose() for it,
    // so isDisposed (mocked default: false) stays false and the isolate is kept cached.
    evalClosure.mockRejectedValueOnce(new Error('Script execution timed out.'));
    await expect(runner.execute(WORKSPACE, EXPRESSION, [{}, {}])).rejects.toThrow(
      'Script execution timed out.',
    );

    // Next call should reuse the warm isolate and avoid re-seeding the 0 baseline.
    evalClosure.mockResolvedValueOnce({ ok: true, value: { id: 'u1' } });
    await runner.execute(WORKSPACE, EXPRESSION, [{}, {}]);

    expect(ivm.Isolate).toHaveBeenCalledTimes(1);
    expect(stats.counter).toHaveBeenCalledTimes(ERROR_TYPES.length);
    expectSeeded();
    // The error is still recorded and rethrown, tagged as a timeout.
    expect(stats.increment).toHaveBeenCalledTimes(1);
    expect(stats.increment).toHaveBeenCalledWith('ivm_platform_error', tagsFor('timeout'));
  });

  it('re-seeds 0 and rebuilds once the isolate is actually disposed', async () => {
    const ivm = require('isolated-vm');
    const runner = makeRunner();

    // Real isolated-vm calls Terminate() — which flips isDisposed — synchronously before this
    // error is thrown (e.g. on a memory-limit breach), so the mock mirrors that ordering.
    evalClosure.mockImplementationOnce(() => {
      ivm.Isolate.mock.results[0].value.isDisposed = true;
      return Promise.reject(new Error('Isolate was disposed during execution'));
    });
    await expect(runner.execute(WORKSPACE, EXPRESSION, [{}, {}])).rejects.toThrow(
      'Isolate was disposed during execution',
    );

    // Next call is a fresh cache miss: it must build a new isolate AND re-seed all three
    // errorType baselines.
    evalClosure.mockResolvedValueOnce({ ok: true, value: { id: 'u1' } });
    await runner.execute(WORKSPACE, EXPRESSION, [{}, {}]);

    // Two build cycles → two sets of 0-seeds. The re-seed is inc(0), which is add-only and
    // never resets the accumulated count (proven against the real registry in prometheus.test.js).
    expect(ivm.Isolate).toHaveBeenCalledTimes(2);
    expect(stats.counter).toHaveBeenCalledTimes(2 * ERROR_TYPES.length);
    expectSeeded();
    // The single error from the first call was still recorded, tagged as disposed.
    expect(stats.increment).toHaveBeenCalledTimes(1);
    expect(stats.increment).toHaveBeenCalledWith('ivm_platform_error', tagsFor('disposed'));
  });
});
