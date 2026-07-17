import { IvmScriptRunner } from './scriptRunner';
import stats from '../stats';

// evalClosure is the sandbox entry point; each test controls whether it resolves or throws.
const evalClosure = jest.fn();

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
  Isolate: jest.fn().mockImplementation(() => ({
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

describe('IvmScriptRunner.execute platform-error counter', () => {
  beforeEach(() => jest.clearAllMocks());

  it('seeds the platform-error counter at 0 on the happy path so increase() has a baseline', async () => {
    evalClosure.mockResolvedValue({ ok: true, value: { id: 'u1' } });

    await makeRunner().execute(WORKSPACE, EXPRESSION, [{}, {}]);

    // The 0-seed creates the series before any error can, giving rate()/increase() a 0 -> N edge.
    expect(stats.counter).toHaveBeenCalledWith('ivm_platform_error', 0, EXPECTED_TAGS);
    // A successful run must not record an error.
    expect(stats.increment).not.toHaveBeenCalledWith('ivm_platform_error', expect.anything());
  });

  it('seeds 0 before running and increments on a platform failure, with matching label sets', async () => {
    evalClosure.mockRejectedValue(new Error('Script execution timed out'));

    await expect(makeRunner().execute(WORKSPACE, EXPRESSION, [{}, {}])).rejects.toThrow(
      'Script execution timed out',
    );

    // Both the seed and the error increment use the identical label set, so they land on one series.
    expect(stats.counter).toHaveBeenCalledWith('ivm_platform_error', 0, EXPECTED_TAGS);
    expect(stats.increment).toHaveBeenCalledWith('ivm_platform_error', EXPECTED_TAGS);
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

    // The seed runs before getOrCreate, so build-time failures are covered too.
    expect(stats.counter).toHaveBeenCalledWith('ivm_platform_error', 0, EXPECTED_TAGS);
    expect(stats.increment).toHaveBeenCalledWith('ivm_platform_error', EXPECTED_TAGS);
  });
});
