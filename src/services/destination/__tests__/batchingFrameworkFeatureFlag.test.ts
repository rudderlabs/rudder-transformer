import {
  batchedDestinationsMap,
  isBatchingFrameworkEnabled,
} from '../../../constants/batchedDestinationsMap';

describe('isBatchingFrameworkEnabled', () => {
  const originalEnv = process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;

  beforeAll(() => {
    // Register a test destination for these tests
    batchedDestinationsMap['TEST_DEST'] = true;
  });

  afterAll(() => {
    delete batchedDestinationsMap['TEST_DEST'];
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
    } else {
      process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = originalEnv;
    }
  });

  it('returns false when env var is not set', () => {
    delete process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
    expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-1')).toBe(false);
  });

  it('returns false when env var is empty string', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = '';
    expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-1')).toBe(false);
  });

  it('returns true for a listed workspace', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ws-1,ws-2';
    expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-1')).toBe(true);
    expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-2')).toBe(true);
  });

  it('returns false for a non-listed workspace', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ws-1,ws-2';
    expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-3')).toBe(false);
  });

  it('returns true for all workspaces when set to ALL', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ALL';
    expect(isBatchingFrameworkEnabled('TEST_DEST', 'any-workspace')).toBe(true);
  });

  it('returns false for a destination not in batchedDestinationsMap', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ALL';
    expect(isBatchingFrameworkEnabled('UNKNOWN_DEST', 'ws-1')).toBe(false);
  });

  it('returns false when workspaceId is undefined', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ws-1';
    expect(isBatchingFrameworkEnabled('TEST_DEST', undefined)).toBe(false);
  });

  it('handles whitespace in workspace IDs', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = ' ws-1 , ws-2 ';
    expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-1')).toBe(true);
    expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-2')).toBe(true);
  });

  it('is case-insensitive for destination type', () => {
    process.env.BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ALL';
    expect(isBatchingFrameworkEnabled('test_dest', 'ws-1')).toBe(true);
    expect(isBatchingFrameworkEnabled('Test_Dest', 'ws-1')).toBe(true);
  });
});
