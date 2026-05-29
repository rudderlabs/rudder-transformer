import sha256 from 'sha256';
import { HashingType } from '../../util/audienceUtils';
import { Integration } from './routerTransform';
import { processBatchedDestination } from '../../../services/destination/nativeBatching/processBatchedDestination';
import type { Metadata } from '../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import { AUTHENTICATION_TYPES } from './constants';
import type {
  Action,
  ActionConfig,
  CustomAudienceConnection,
  CustomAudienceConnectionDestConfig,
  CustomAudienceDestConfig,
  CustomAudienceDestination,
} from './types';

// Pre-hashed emails used when isHashRequired=false (the default).
// validateHashingConsistency rejects unhashed values when hashing is disabled.
const hashedEmail = (plain: string) => sha256(plain);

const baseInsertAction: ActionConfig = {
  endpoint: '/audiences/{{connection.audienceId}}/members',
  method: 'POST',
  requestBody:
    '{ "audienceId": $$.connection.audienceId, "users": [$$.records.{ "email": email }] }',
  batchSize: 2,
  fields: [{ name: 'email', hashType: HashingType.SHA256, isRequired: true, isCustom: false }],
};

const baseDeleteAction: ActionConfig = {
  endpoint: '/audiences/{{connection.audienceId}}/members',
  method: 'DELETE',
  requestBody: '{ "audienceId": $$.connection.audienceId, "users": $$.records }',
  batchSize: 2,
  fields: [{ name: 'email', hashType: HashingType.SHA256, isRequired: true, isCustom: false }],
};

const buildDestination = (
  configOverrides: Partial<CustomAudienceDestConfig> = {},
): CustomAudienceDestination => ({
  ID: 'dest-1',
  Name: 'custom_audience',
  DestinationDefinition: {
    ID: 'destDef-1',
    Name: 'CUSTOM_AUDIENCE',
    DisplayName: 'Custom Audience',
    Config: {},
  },
  Config: {
    baseUrl: 'https://api.example.com',
    authenticationType: AUTHENTICATION_TYPES.NO_AUTH,
    actions: { insert: baseInsertAction, delete: baseDeleteAction },
    ...configOverrides,
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
});

const buildConnection = (
  destinationOverrides: Partial<CustomAudienceConnectionDestConfig> = {},
): CustomAudienceConnection => ({
  sourceId: 'src-1',
  destinationId: 'dest-1',
  enabled: true,
  config: {
    destination: {
      audienceId: 'aud-42',
      isHashRequired: false,
      ...destinationOverrides,
    },
  },
});

const buildMetadata = (jobId: number): Metadata =>
  ({
    jobId,
    workspaceId: 'ws-1',
    destinationId: 'dest-1',
    sourceId: 'src-1',
    sourceType: 'warehouse',
    sourceCategory: 'warehouse',
    destinationType: 'CUSTOM_AUDIENCE',
    messageId: `msg-${jobId}`,
  }) as Metadata;

const buildInput = (
  jobId: number,
  action: Action,
  identifiers: Record<string, unknown>,
  destination: CustomAudienceDestination = buildDestination(),
  connection: CustomAudienceConnection = buildConnection(),
): RouterTransformationRequestData =>
  ({
    message: {
      type: 'record',
      action,
      identifiers,
      channel: 'sources',
      context: {},
      recordId: String(jobId),
    },
    metadata: buildMetadata(jobId),
    destination,
    connection,
  }) as unknown as RouterTransformationRequestData;

describe('CustomAudienceIntegration via processBatchedDestination', () => {
  it('groups events by action and chunks by batchSize', async () => {
    const inputs = [
      buildInput(1, 'insert', { email: hashedEmail('a@b.com') }),
      buildInput(2, 'insert', { email: hashedEmail('c@d.com') }),
      buildInput(3, 'insert', { email: hashedEmail('e@f.com') }),
      buildInput(4, 'delete', { email: hashedEmail('g@h.com') }),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});

    const successResults = results.filter((r) => r.statusCode === 200);
    // 3 inserts → 2 chunks of batchSize=2; 1 delete → 1 chunk. Total 3 success batches.
    expect(successResults).toHaveLength(3);
    expect(results.filter((r) => r.statusCode !== 200)).toHaveLength(0);

    const insertBatches = successResults.filter(
      (r) => !Array.isArray(r.batchedRequest) && r.batchedRequest?.method === 'POST',
    );
    const deleteBatches = successResults.filter(
      (r) => !Array.isArray(r.batchedRequest) && r.batchedRequest?.method === 'DELETE',
    );
    expect(insertBatches).toHaveLength(2);
    expect(deleteBatches).toHaveLength(1);

    const insertJobIds = insertBatches.flatMap((r) => r.metadata.map((m) => m.jobId)).sort();
    const deleteJobIds = deleteBatches.flatMap((r) => r.metadata.map((m) => m.jobId));
    expect(insertJobIds).toEqual([1, 2, 3]);
    expect(deleteJobIds).toEqual([4]);
  });

  const errorCases = [
    {
      name: 'event with action that has no matching config',
      buildInputs: () => {
        const destination = buildDestination();
        delete destination.Config.actions.delete;
        return [
          buildInput(1, 'insert', { email: hashedEmail('a@b.com') }, destination),
          buildInput(2, 'delete', { email: hashedEmail('g@h.com') }, destination),
        ];
      },
      failingJobId: 2,
      errorMatch: /No action configuration/,
    },
    {
      name: 'event with all fields stripped',
      buildInputs: () => [
        buildInput(1, 'insert', { email: hashedEmail('a@b.com') }),
        buildInput(2, 'insert', { email: '', other: null }),
      ],
      failingJobId: 2,
      errorMatch: /All fields were stripped after processing; nothing to send/,
    },
    {
      name: 'event failing schema validation (wrong type)',
      buildInputs: () => [
        buildInput(1, 'insert', { email: hashedEmail('a@b.com') }),
        {
          ...buildInput(2, 'insert', { email: hashedEmail('b@c.com') }),
          message: { type: 'identify' },
        } as unknown as RouterTransformationRequestData,
      ],
      failingJobId: 2,
      errorMatch: /Invalid/,
    },
    {
      name: 'event with empty-string customMapping "from" value',
      buildInputs: () => {
        const connection = buildConnection({ customMappings: [{ from: '', to: 'listId' }] });
        return [buildInput(1, 'insert', { email: 'a@b.com' }, buildDestination(), connection)];
      },
      failingJobId: 1,
      errorMatch: /Custom mapping "from" value must be non-empty/,
    },
    {
      name: 'event missing required fields for action',
      buildInputs: () => [buildInput(1, 'insert', { phone: '+1' })],
      failingJobId: 1,
      errorMatch: /Missing required fields for action "insert": email/,
    },
    {
      name: 'update event validates required fields from insert action when useInsertConfig is true',
      buildInputs: () => {
        const destination = buildDestination({
          actions: {
            insert: {
              ...baseInsertAction,
              fields: [
                ...baseInsertAction.fields,
                {
                  name: 'externalId',
                  hashType: HashingType.NONE,
                  isRequired: true,
                  isCustom: false,
                },
              ],
            },
            update: {
              useInsertConfig: true,
            },
            delete: baseDeleteAction,
          },
        });
        return [buildInput(1, 'update', { email: hashedEmail('a@b.com') }, destination)];
      },
      failingJobId: 1,
      errorMatch: /Missing required fields for action "update": externalId/,
    },
  ];

  it.each(errorCases)(
    'returns 400 for: $name',
    async ({ buildInputs, failingJobId, errorMatch }) => {
      const results = await processBatchedDestination(buildInputs(), Integration, {});
      const errors = results.filter((r) => r.statusCode === 400);
      expect(errors).toHaveLength(1);
      expect(errors[0].metadata[0].jobId).toBe(failingJobId);
      expect(errors[0].error).toMatch(errorMatch);
    },
  );

  it('hashes fields when isHashRequired is true', async () => {
    const connection = buildConnection({ isHashRequired: true });
    const inputs = [
      buildInput(1, 'insert', { email: 'a@b.com' }, buildDestination(), connection),
      buildInput(2, 'insert', { email: 'c@d.com' }, buildDestination(), connection),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});

    const success = results.find((r) => r.statusCode === 200);
    const batched = success?.batchedRequest;
    if (!batched || Array.isArray(batched)) throw new Error('expected single batchedRequest');
    const body = batched.body?.JSON as { users: { email: string }[] };
    const emails = body.users.map((u) => u.email).sort();
    expect(emails).toEqual([sha256('a@b.com'), sha256('c@d.com')].sort());
  });

  it('allows custom mappings for unknown target fields and ignores them in template output', async () => {
    const connection = buildConnection({ customMappings: [{ from: 'some-value', to: 'unused' }] });
    const inputs = [
      buildInput(1, 'insert', { email: hashedEmail('a@b.com') }, buildDestination(), connection),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});

    const success = results.find((r) => r.statusCode === 200);
    const batched = success?.batchedRequest;
    if (!batched || Array.isArray(batched)) throw new Error('expected single batchedRequest');
    const body = batched.body?.JSON as { users: { email: string }[] };
    expect(body).toEqual({
      audienceId: 'aud-42',
      users: [{ email: hashedEmail('a@b.com') }],
    });
  });

  const authCases = [
    {
      name: 'Bearer',
      overrides: { authenticationType: AUTHENTICATION_TYPES.BEARER_TOKEN, bearerToken: 'sek-ret' },
      expectedHeader: 'Authorization',
      expectedValue: 'Bearer sek-ret',
    },
    {
      name: 'API key',
      overrides: {
        authenticationType: AUTHENTICATION_TYPES.API_KEY,
        apiKeyName: 'X-Custom-Key',
        apiKeyValue: 'secret',
      },
      expectedHeader: 'X-Custom-Key',
      expectedValue: 'secret',
    },
  ];

  it.each(authCases)(
    'builds $name auth header when configured',
    async ({ overrides, expectedHeader, expectedValue }) => {
      const destination = buildDestination(overrides);
      const inputs = [buildInput(1, 'insert', { email: hashedEmail('a@b.com') }, destination)];

      const results = await processBatchedDestination(inputs, Integration, {});

      const success = results.find((r) => r.statusCode === 200);
      const batched = success?.batchedRequest;
      if (!batched || Array.isArray(batched)) throw new Error('expected single batchedRequest');
      const headers = batched.headers as Record<string, string>;
      expect(headers[expectedHeader]).toBe(expectedValue);
    },
  );

  it('throws when requestBody template fails at runtime', async () => {
    const destination = buildDestination({
      actions: {
        insert: { ...baseInsertAction, requestBody: '$$.records[0].$notARealMethod()' },
        delete: baseDeleteAction,
      },
    });

    const inputs = [buildInput(1, 'insert', { email: hashedEmail('a@b.com') }, destination)];

    await expect(processBatchedDestination(inputs, Integration, {})).rejects.toThrow();
  });

  it('batches insert and update events together when update uses insert config', async () => {
    const destination = buildDestination({
      actions: {
        insert: baseInsertAction,
        update: {
          endpoint: '/audiences/{{connection.audienceId}}/members',
          method: 'POST',
          requestBody: '{ "users": [$$.records.{ "email": email }] }',
          batchSize: 10,
          fields: baseInsertAction.fields,
          useInsertConfig: true,
        },
        delete: baseDeleteAction,
      },
    });

    const inputs = [
      buildInput(1, 'insert', { email: hashedEmail('z@x.com') }, destination),
      buildInput(2, 'update', { email: hashedEmail('a@b.com') }, destination),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});

    const success = results.filter((r) => r.statusCode === 200);
    expect(success).toHaveLength(1);
    const batched = success[0]?.batchedRequest;
    if (!batched || Array.isArray(batched)) throw new Error('expected single batchedRequest');
    // Should use insert config's endpoint and method, and batch insert/update together.
    expect(batched.endpoint).toBe('https://api.example.com/audiences/aud-42/members');
    expect(batched.method).toBe('POST');
    const body = batched.body?.JSON as { users: { email: string }[] };
    expect(body.users).toHaveLength(2);
    expect(success[0].metadata.map((m) => m.jobId).sort()).toEqual([1, 2]);
  });

  it('keeps update batches separate when update uses its own config', async () => {
    const destination = buildDestination({
      actions: {
        insert: baseInsertAction,
        update: {
          ...baseInsertAction,
          useInsertConfig: false,
        },
        delete: baseDeleteAction,
      },
    });

    const inputs = [
      buildInput(1, 'insert', { email: hashedEmail('a@b.com') }, destination),
      buildInput(2, 'update', { email: hashedEmail('c@d.com') }, destination),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});

    const success = results.filter((r) => r.statusCode === 200);
    expect(success).toHaveLength(2);
    expect(success.map((r) => r.metadata.map((m) => m.jobId).sort())).toEqual([[1], [2]]);
  });
});
