import { sandboxedApplyCustomMappings } from './sandboxClient';

const WS = 'ws-test-1';

describe('sandboxedApplyCustomMappings', () => {
  afterEach(() => {
    delete process.env.RS_SANDBOX_SECRET;
  });

  it('resolves valid $-path mappings', async () => {
    const out = await sandboxedApplyCustomMappings(
      { userId: 'u1' },
      [{ from: '$.userId', to: 'id' }],
      WS,
    );
    expect(out).toEqual({ id: 'u1' });
  });

  it('reuses the compiled engine across events without leaking state between evaluations', async () => {
    // The engine is compiled once per template and reused; evaluating it against different
    // events must yield independent results (no per-event state retained on the engine).
    const mappings = [{ from: '$.userId', to: 'id' }];
    const first = await sandboxedApplyCustomMappings({ userId: 'u1' }, mappings, WS);
    const second = await sandboxedApplyCustomMappings({ userId: 'u2' }, mappings, WS);
    expect(first).toEqual({ id: 'u1' });
    expect(second).toEqual({ id: 'u2' });
  });

  it('evaluates distinct mapping templates correctly on the same workspace isolate', async () => {
    // Guards the content-keyed cache: a second template on the same isolate must not resolve
    // to the first template's cached engine.
    const byId = await sandboxedApplyCustomMappings(
      { userId: 'u1', email: 'a@b.com' },
      [{ from: '$.userId', to: 'id' }],
      WS,
    );
    const byEmail = await sandboxedApplyCustomMappings(
      { userId: 'u1', email: 'a@b.com' },
      [{ from: '$.email', to: 'mail' }],
      WS,
    );
    expect(byId).toEqual({ id: 'u1' });
    expect(byEmail).toEqual({ mail: 'a@b.com' });
  });

  it('does NOT leak process.env — process is undefined in the isolate, so it throws', async () => {
    process.env.RS_SANDBOX_SECRET = 'top-secret';
    // There is no `process` global inside the isolate, so referencing it throws a
    // ReferenceError -> surfaced as a ConfigurationError. The secret is never evaluated.
    await expect(
      sandboxedApplyCustomMappings(
        { userId: 'u1' },
        [{ from: 'process.env.RS_SANDBOX_SECRET || $.userId', to: 'leak' }],
        WS,
      ),
    ).rejects.toThrow(/process is not defined/);
    // The secret never appears in the thrown error message either.
    let message = '';
    try {
      await sandboxedApplyCustomMappings(
        { userId: 'u1' },
        [{ from: 'process.env.RS_SANDBOX_SECRET || $.userId', to: 'leak' }],
        WS,
      );
    } catch (e: any) {
      message = e.message;
    }
    expect(message).not.toContain('top-secret');
  });

  it('does NOT dump the whole environment — process access throws', async () => {
    await expect(
      sandboxedApplyCustomMappings(
        { userId: 'u1' },
        [{ from: 'process.env||$.userId', to: 'dump' }],
        WS,
      ),
    ).rejects.toThrow(/process is not defined/);
  });

  it('Function() runs in the V8 isolate but cannot reach process/require', async () => {
    // Function() is a V8 built-in, so pure computation works.
    const out = (await sandboxedApplyCustomMappings(
      { userId: 'u1' },
      [{ from: "Function('return 42')()||$.userId", to: 'x' }],
      WS,
    )) as Record<string, unknown>;
    expect(out.x).toBe(42);
    // Reaching process through Function() throws (process is undefined inside the isolate) — no leak.
    process.env.RS_SANDBOX_SECRET = 'top-secret';
    await expect(
      sandboxedApplyCustomMappings(
        { userId: 'u1' },
        [{ from: "Function('return process.env')()||$.userId", to: 'envLeak' }],
        WS,
      ),
    ).rejects.toThrow(/process is not defined/);
  });

  it('constructor/this escape vectors leak no host env secret', async () => {
    const SECRET = 'planted-host-secret-4f9a';
    process.env.RS_SANDBOX_SECRET = SECRET;

    // Vector 1: Function('return this')() returns the isolate global, which cannot be
    // structured-cloned back across the boundary -> the sandbox fails closed. Either way
    // the planted secret is never surfaced to the caller.
    let vector1Output = '';
    try {
      const result = await sandboxedApplyCustomMappings(
        { userId: 'u1' },
        [{ from: "Function('return this')() || $.userId", to: 'g' }],
        WS,
      );
      vector1Output = JSON.stringify(result);
    } catch (e: any) {
      vector1Output = String(e?.message ?? e);
    }
    expect(vector1Output).not.toContain(SECRET);

    // Vector 2: the classic ({}).constructor.constructor('return process.env')() breakout.
    // process is undefined inside the isolate, so no host env is reachable. Handle it the same
    // way as Vector 1 — it may resolve (fallback) or reject depending on the engine; either
    // way the planted secret must never appear.
    let vector2Output = '';
    try {
      const result = await sandboxedApplyCustomMappings(
        { userId: 'u1' },
        [{ from: "({}).constructor.constructor('return process.env')() || $.userId", to: 'g' }],
        WS,
      );
      vector2Output = JSON.stringify(result);
    } catch (e: any) {
      vector2Output = String(e?.message ?? e);
    }
    expect(vector2Output).not.toContain(SECRET);
  });

  it('fails closed when workspaceId is missing', async () => {
    await expect(
      sandboxedApplyCustomMappings({ userId: 'u1' }, [{ from: '$.userId', to: 'id' }], ''),
    ).rejects.toThrow(/workspaceId is required/);
  });
});
