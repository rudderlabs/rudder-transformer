describe('isBatchingFrameworkEnabled', () => {
  const originalEnv = process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
    } else {
      process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = originalEnv;
    }
    jest.resetModules();
  });

  function loadModule() {
    // Re-require the module to pick up env var changes
    return require('../../../constants/batchedDestinationsMap');
  }

  it('returns false when env var is not set', () => {
    delete process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
    const { isBatchingFrameworkEnabled } = loadModule();
    expect(isBatchingFrameworkEnabled('POSTHOG', 'ws-1')).toBe(false);
  });

  it('returns false when env var is empty string', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = '';
    const { isBatchingFrameworkEnabled } = loadModule();
    expect(isBatchingFrameworkEnabled('POSTHOG', 'ws-1')).toBe(false);
  });

  it('returns true for a listed workspace', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ws-1,ws-2';
    const { isBatchingFrameworkEnabled } = loadModule();
    expect(isBatchingFrameworkEnabled('POSTHOG', 'ws-1')).toBe(true);
    expect(isBatchingFrameworkEnabled('POSTHOG', 'ws-2')).toBe(true);
  });

  it('returns false for a non-listed workspace', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ws-1,ws-2';
    const { isBatchingFrameworkEnabled } = loadModule();
    expect(isBatchingFrameworkEnabled('POSTHOG', 'ws-3')).toBe(false);
  });

  it('returns true for all workspaces when set to ALL', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ALL';
    const { isBatchingFrameworkEnabled } = loadModule();
    expect(isBatchingFrameworkEnabled('POSTHOG', 'any-workspace')).toBe(true);
  });

  it('returns false for a destination not in batchedDestinationsMap', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ALL';
    const { isBatchingFrameworkEnabled } = loadModule();
    expect(isBatchingFrameworkEnabled('UNKNOWN_DEST', 'ws-1')).toBe(false);
  });

  it('returns false when workspaceId is undefined', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ws-1';
    const { isBatchingFrameworkEnabled } = loadModule();
    expect(isBatchingFrameworkEnabled('POSTHOG', undefined)).toBe(false);
  });

  it('handles whitespace in workspace IDs', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = ' ws-1 , ws-2 ';
    const { isBatchingFrameworkEnabled } = loadModule();
    expect(isBatchingFrameworkEnabled('POSTHOG', 'ws-1')).toBe(true);
    expect(isBatchingFrameworkEnabled('POSTHOG', 'ws-2')).toBe(true);
  });

  it('is case-insensitive for destination type', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ALL';
    const { isBatchingFrameworkEnabled } = loadModule();
    expect(isBatchingFrameworkEnabled('posthog', 'ws-1')).toBe(true);
    expect(isBatchingFrameworkEnabled('PostHog', 'ws-1')).toBe(true);
  });
});
