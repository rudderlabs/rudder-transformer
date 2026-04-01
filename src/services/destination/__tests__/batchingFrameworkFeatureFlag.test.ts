import {
  batchedDestinationsMap,
  isBatchingFrameworkEnabled,
} from '../../../constants/batchedDestinationsMap';

describe('isBatchingFrameworkEnabled', () => {
  const envKey = 'TEST_DEST_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS';
  const originalEnv = process.env[envKey];

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env[envKey];
    } else {
      process.env[envKey] = originalEnv;
    }
    delete batchedDestinationsMap['TEST_DEST'];
  });

  describe('pre-GA: env var based rollout', () => {
    it('returns false when env var is not set', () => {
      delete process.env[envKey];
      expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-1')).toBe(false);
    });

    it('returns false when env var is empty string', () => {
      process.env[envKey] = '';
      expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-1')).toBe(false);
    });

    it('returns true for a listed workspace', () => {
      process.env[envKey] = 'ws-1,ws-2';
      expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-1')).toBe(true);
      expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-2')).toBe(true);
    });

    it('returns false for a non-listed workspace', () => {
      process.env[envKey] = 'ws-1,ws-2';
      expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-3')).toBe(false);
    });

    it('returns true for all workspaces when set to ALL', () => {
      process.env[envKey] = 'ALL';
      expect(isBatchingFrameworkEnabled('TEST_DEST', 'any-workspace')).toBe(true);
    });

    it('handles whitespace in workspace IDs', () => {
      process.env[envKey] = ' ws-1 , ws-2 ';
      expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-1')).toBe(true);
      expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-2')).toBe(true);
    });

    it('is case-insensitive for destination type', () => {
      process.env[envKey] = 'ALL';
      expect(isBatchingFrameworkEnabled('test_dest', 'ws-1')).toBe(true);
      expect(isBatchingFrameworkEnabled('Test_Dest', 'ws-1')).toBe(true);
    });
  });

  describe('GA: batchedDestinationsMap based', () => {
    it('returns true when destination is in map regardless of env var', () => {
      batchedDestinationsMap['TEST_DEST'] = true;
      delete process.env[envKey];
      expect(isBatchingFrameworkEnabled('TEST_DEST', 'ws-1')).toBe(true);
    });

    it('returns false for a destination not in map and no env var', () => {
      delete process.env[envKey];
      expect(isBatchingFrameworkEnabled('UNKNOWN_DEST', 'ws-1')).toBe(false);
    });
  });
});
