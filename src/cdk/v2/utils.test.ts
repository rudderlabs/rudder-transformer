import { shouldUseCdkV2 } from './utils';

describe('cdk/v2 utils', () => {
  describe('shouldUseCdkV2', () => {
    type Case = {
      name: string;
      destType: string;
      workspaceId: string;
      env?: { key: string; value?: string };
      expected: boolean;
    };

    const cases: Case[] = [
      {
        name: 'returns false when destination is not CDK v2 enabled',
        destType: 'some_unknown_destination',
        workspaceId: 'w1',
        expected: false,
      },
      {
        name: 'returns true when destination is enabled and env toggle is not set',
        destType: 'webhook',
        workspaceId: 'w1',
        env: { key: 'DISABLE_WEBHOOK_CDK_V2' }, // ensure unset
        expected: true,
      },
      {
        name: 'returns false when DISABLE_<DEST>_CDK_V2 is ALL',
        destType: 'WEBHOOK',
        workspaceId: 'w1',
        env: { key: 'DISABLE_WEBHOOK_CDK_V2', value: 'ALL' },
        expected: false,
      },
      {
        name: 'returns true when DISABLE_<DEST>_CDK_V2 is NONE',
        destType: 'WEBHOOK',
        workspaceId: 'w1',
        env: { key: 'DISABLE_WEBHOOK_CDK_V2', value: 'NONE' },
        expected: true,
      },
      {
        name: 'returns false only for workspaceIds listed in DISABLE_<DEST>_CDK_V2 (blocked)',
        destType: 'webhook',
        workspaceId: 'w1',
        env: { key: 'DISABLE_WEBHOOK_CDK_V2', value: 'w1,w2' },
        expected: false,
      },
      {
        name: 'returns true only for workspaceIds listed in DISABLE_<DEST>_CDK_V2 (allowed)',
        destType: 'webhook',
        workspaceId: 'w3',
        env: { key: 'DISABLE_WEBHOOK_CDK_V2', value: 'w1,w2' },
        expected: true,
      },
    ];

    test.each(cases)('$name', ({ destType, workspaceId, env, expected }) => {
      const previousValue = env ? process.env[env.key] : undefined;
      if (env) {
        if (env.value === undefined) {
          delete process.env[env.key];
        } else {
          process.env[env.key] = env.value;
        }
      }
      try {
        expect(shouldUseCdkV2(destType, workspaceId)).toBe(expected);
      } finally {
        if (env) {
          if (previousValue === undefined) {
            delete process.env[env.key];
          } else {
            process.env[env.key] = previousValue;
          }
        }
      }
    });
  });
});
