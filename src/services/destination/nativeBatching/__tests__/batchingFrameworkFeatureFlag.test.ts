import {
  batchedDestinationsMap,
  isBatchingFrameworkEnabled,
} from '../../../../constants/batchedDestinationsMap';

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
    it.each([
      {
        description: 'returns false when env var is not set',
        envValue: undefined,
        destType: 'TEST_DEST',
        workspaceId: 'ws-1',
        expected: false,
      },
      {
        description: 'returns false when env var is empty string',
        envValue: '',
        destType: 'TEST_DEST',
        workspaceId: 'ws-1',
        expected: false,
      },
      {
        description: 'returns true for a listed workspace',
        envValue: 'ws-1,ws-2',
        destType: 'TEST_DEST',
        workspaceId: 'ws-1',
        expected: true,
      },
      {
        description: 'returns false for a non-listed workspace',
        envValue: 'ws-1,ws-2',
        destType: 'TEST_DEST',
        workspaceId: 'ws-3',
        expected: false,
      },
      {
        description: 'returns true for all workspaces when set to ALL',
        envValue: 'ALL',
        destType: 'TEST_DEST',
        workspaceId: 'any-workspace',
        expected: true,
      },
      {
        description: 'handles whitespace in workspace IDs',
        envValue: ' ws-1 , ws-2 ',
        destType: 'TEST_DEST',
        workspaceId: 'ws-1',
        expected: true,
      },
      {
        description: 'is case-insensitive for destination type (lowercase)',
        envValue: 'ALL',
        destType: 'test_dest',
        workspaceId: 'ws-1',
        expected: true,
      },
      {
        description: 'is case-insensitive for destination type (mixed case)',
        envValue: 'ALL',
        destType: 'Test_Dest',
        workspaceId: 'ws-1',
        expected: true,
      },
    ])('$description', ({ envValue, destType, workspaceId, expected }) => {
      if (envValue === undefined) {
        delete process.env[envKey];
      } else {
        process.env[envKey] = envValue;
      }
      expect(isBatchingFrameworkEnabled(destType, workspaceId)).toBe(expected);
    });
  });

  describe('GA: batchedDestinationsMap based', () => {
    it.each([
      {
        description: 'returns true when destination is in map regardless of env var',
        inMap: true,
        destType: 'TEST_DEST',
        workspaceId: 'ws-1',
        expected: true,
      },
      {
        description: 'returns false for a destination not in map and no env var',
        inMap: false,
        destType: 'UNKNOWN_DEST',
        workspaceId: 'ws-1',
        expected: false,
      },
    ])('$description', ({ inMap, destType, workspaceId, expected }) => {
      if (inMap) {
        batchedDestinationsMap['TEST_DEST'] = true;
      }
      delete process.env[envKey];
      expect(isBatchingFrameworkEnabled(destType, workspaceId)).toBe(expected);
    });
  });
});
