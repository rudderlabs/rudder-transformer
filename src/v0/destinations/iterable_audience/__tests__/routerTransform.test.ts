import { Integration } from '../routerTransform';
import { processBatchedDestination } from '../../../../services/destination/nativeBatching/processBatchedDestination';
import type { Metadata } from '../../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';
import type { Connection, Destination } from '../../../../types/controlPlaneConfig';
import type { IdentifierMapping, IterableAccountConfig, IterableConnectionConfig } from '../types';

type IterableAudienceDestination = Destination<IterableAccountConfig>;
type IterableAudienceConnection = Connection<{ destination: IterableConnectionConfig }>;
type RecordAction = 'insert' | 'update' | 'delete';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const buildDestination = (
  configOverrides: Partial<IterableAccountConfig> = {},
): IterableAudienceDestination => ({
  ID: 'dest-1',
  Name: 'iterable_audience',
  DestinationDefinition: {
    ID: 'destDef-1',
    Name: 'ITERABLE_AUDIENCE',
    DisplayName: 'Iterable Audience',
    Config: {},
  },
  Config: {
    apiKey: 'test-api-key',
    dataCenter: 'US',
    projectType: 'email-based',
    ...configOverrides,
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
});

const buildConnection = (
  audienceId: string | number,
  identifierMappings: IdentifierMapping[],
  extra: { updateExistingUsersOnly?: boolean } = {},
): IterableAudienceConnection => ({
  sourceId: 'src-1',
  destinationId: 'dest-1',
  enabled: true,
  config: {
    destination: {
      audienceId: String(audienceId),
      identifierMappings,
      ...(typeof extra.updateExistingUsersOnly === 'boolean'
        ? { updateExistingUsersOnly: extra.updateExistingUsersOnly }
        : {}),
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
    destinationType: 'ITERABLE_AUDIENCE',
    messageId: `msg-${jobId}`,
  }) as Metadata;

const buildInput = (
  jobId: number,
  action: RecordAction,
  identifiers: Record<string, unknown>,
  destination: IterableAudienceDestination,
  connection: IterableAudienceConnection,
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

const getJsonBody = (response: any): any => {
  const { batchedRequest } = response;
  if (!batchedRequest || Array.isArray(batchedRequest)) {
    throw new Error('expected single batchedRequest');
  }
  return batchedRequest.body?.JSON;
};

const getEndpoint = (response: any): string => {
  const { batchedRequest } = response;
  if (!batchedRequest || Array.isArray(batchedRequest)) {
    throw new Error('expected single batchedRequest');
  }
  return batchedRequest.endpoint;
};

const getHeaders = (response: any): Record<string, string> => {
  const { batchedRequest } = response;
  if (!batchedRequest || Array.isArray(batchedRequest)) {
    throw new Error('expected single batchedRequest');
  }
  return batchedRequest.headers as Record<string, string>;
};

// Project-type fixtures used by the parameterised happy-path test.
const emailMappings: IdentifierMapping[] = [{ from: 'email', to: 'email' }];
const userIdMappings: IdentifierMapping[] = [{ from: 'userId', to: 'userId' }];

// ---------------------------------------------------------------------------
// Happy-path coverage: project type x action
// ---------------------------------------------------------------------------

describe('IterableAudienceIntegration happy paths', () => {
  it('email-based + INSERT emits subscribe body', async () => {
    const destination = buildDestination({ projectType: 'email-based' });
    const connection = buildConnection(123, emailMappings);
    const inputs = [buildInput(1, 'insert', { email: 'a@b.com' }, destination, connection)];

    const results = await processBatchedDestination(inputs, Integration, {});
    const success = results.find((r) => r.statusCode === 200)!;
    expect(getJsonBody(success)).toEqual({
      listId: 123,
      subscribers: [{ email: 'a@b.com' }],
    });
    expect(getEndpoint(success)).toBe('https://api.iterable.com/api/lists/subscribe');
  });

  it('email-based + UPDATE emits subscribe body', async () => {
    const destination = buildDestination({ projectType: 'email-based' });
    const connection = buildConnection(123, emailMappings);
    const inputs = [buildInput(1, 'update', { email: 'a@b.com' }, destination, connection)];

    const results = await processBatchedDestination(inputs, Integration, {});
    const success = results.find((r) => r.statusCode === 200)!;
    expect(getJsonBody(success)).toEqual({
      listId: 123,
      subscribers: [{ email: 'a@b.com' }],
    });
    expect(getEndpoint(success)).toBe('https://api.iterable.com/api/lists/subscribe');
  });

  it('email-based + DELETE emits unsubscribe body with channelUnsubscribe:false', async () => {
    const destination = buildDestination({ projectType: 'email-based' });
    const connection = buildConnection(123, emailMappings);
    const inputs = [buildInput(1, 'delete', { email: 'a@b.com' }, destination, connection)];

    const results = await processBatchedDestination(inputs, Integration, {});
    const success = results.find((r) => r.statusCode === 200)!;
    expect(getJsonBody(success)).toEqual({
      listId: 123,
      subscribers: [{ email: 'a@b.com' }],
      channelUnsubscribe: false,
    });
    expect(getEndpoint(success)).toBe('https://api.iterable.com/api/lists/unsubscribe');
  });

  it('userId-based + INSERT emits subscribe body with userId', async () => {
    const destination = buildDestination({ projectType: 'userId-based' });
    const connection = buildConnection(123, userIdMappings);
    const inputs = [buildInput(1, 'insert', { userId: 'u-1' }, destination, connection)];

    const results = await processBatchedDestination(inputs, Integration, {});
    const success = results.find((r) => r.statusCode === 200)!;
    expect(getJsonBody(success)).toEqual({
      listId: 123,
      subscribers: [{ userId: 'u-1' }],
    });
  });

  it('userId-based + DELETE emits unsubscribe with userId', async () => {
    const destination = buildDestination({ projectType: 'userId-based' });
    const connection = buildConnection(123, userIdMappings);
    const inputs = [buildInput(1, 'delete', { userId: 'u-1' }, destination, connection)];

    const results = await processBatchedDestination(inputs, Integration, {});
    const success = results.find((r) => r.statusCode === 200)!;
    expect(getJsonBody(success)).toEqual({
      listId: 123,
      subscribers: [{ userId: 'u-1' }],
      channelUnsubscribe: false,
    });
  });
});

// ---------------------------------------------------------------------------
// Hybrid project: identifier selection
// ---------------------------------------------------------------------------

describe('IterableAudienceIntegration hybrid project', () => {
  const hybridMappings: IdentifierMapping[] = [
    { from: 'email', to: 'email' },
    { from: 'userId', to: 'userId' },
  ];

  it('row with email+userId emits both identifiers (hybrid)', async () => {
    const destination = buildDestination({ projectType: 'hybrid' });
    const connection = buildConnection(123, hybridMappings);
    const inputs = [
      buildInput(1, 'insert', { email: 'a@b.com', userId: 'u-1' }, destination, connection),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});
    const success = results.find((r) => r.statusCode === 200)!;
    expect(getJsonBody(success)).toEqual({
      listId: 123,
      subscribers: [{ userId: 'u-1', email: 'a@b.com' }],
    });
  });

  it('row with only email emits email', async () => {
    const destination = buildDestination({ projectType: 'hybrid' });
    const connection = buildConnection(123, hybridMappings);
    const inputs = [buildInput(1, 'insert', { email: 'a@b.com' }, destination, connection)];

    const results = await processBatchedDestination(inputs, Integration, {});
    const success = results.find((r) => r.statusCode === 200)!;
    expect(getJsonBody(success)).toEqual({
      listId: 123,
      subscribers: [{ email: 'a@b.com' }],
    });
  });
});

// ---------------------------------------------------------------------------
// Batching + chunking
// ---------------------------------------------------------------------------

describe('IterableAudienceIntegration batching', () => {
  it('splits 1001 inserts into two batches of [1000, 1]', async () => {
    const destination = buildDestination({ projectType: 'email-based' });
    const connection = buildConnection(123, emailMappings);
    const inputs: RouterTransformationRequestData[] = [];
    for (let i = 1; i <= 1001; i += 1) {
      inputs.push(
        buildInput(i, 'insert', { email: `user${i}@example.com` }, destination, connection),
      );
    }

    const results = await processBatchedDestination(inputs, Integration, {});
    const successes = results.filter((r) => r.statusCode === 200);
    expect(successes).toHaveLength(2);

    const subscribersBySize = successes
      .map((r) => (getJsonBody(r) as { subscribers: unknown[] }).subscribers.length)
      .sort((a, b) => b - a);
    expect(subscribersBySize).toEqual([1000, 1]);

    const allJobIds = successes
      .flatMap((r) => r.metadata.map((m) => m.jobId!))
      .sort((a, b) => a - b);
    expect(allJobIds[0]).toBe(1);
    expect(allJobIds[allJobIds.length - 1]).toBe(1001);
    expect(allJobIds).toHaveLength(1001);
  });

  it('separates INSERT and DELETE into subscribe vs unsubscribe batches', async () => {
    const destination = buildDestination({ projectType: 'email-based' });
    const connection = buildConnection(123, emailMappings);
    const inputs = [
      buildInput(1, 'insert', { email: 'a@b.com' }, destination, connection),
      buildInput(2, 'delete', { email: 'c@d.com' }, destination, connection),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});
    const successes = results.filter((r) => r.statusCode === 200);
    expect(successes).toHaveLength(2);

    const subscribe = successes.find((r) => getEndpoint(r).endsWith('/api/lists/subscribe'))!;
    const unsubscribe = successes.find((r) => getEndpoint(r).endsWith('/api/lists/unsubscribe'))!;

    expect(getJsonBody(subscribe)).toEqual({
      listId: 123,
      subscribers: [{ email: 'a@b.com' }],
    });
    expect(getJsonBody(unsubscribe)).toEqual({
      listId: 123,
      subscribers: [{ email: 'c@d.com' }],
      channelUnsubscribe: false,
    });
  });

  it('propagates updateExistingUsersOnly into subscribe body but not unsubscribe', async () => {
    const destination = buildDestination({ projectType: 'email-based' });
    const connection = buildConnection(123, emailMappings, { updateExistingUsersOnly: true });
    const inputs = [
      buildInput(1, 'insert', { email: 'a@b.com' }, destination, connection),
      buildInput(2, 'delete', { email: 'c@d.com' }, destination, connection),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});
    const successes = results.filter((r) => r.statusCode === 200);
    expect(successes).toHaveLength(2);

    const subscribe = successes.find((r) => getEndpoint(r).endsWith('/api/lists/subscribe'))!;
    const unsubscribe = successes.find((r) => getEndpoint(r).endsWith('/api/lists/unsubscribe'))!;

    expect(getJsonBody(subscribe)).toEqual({
      listId: 123,
      subscribers: [{ email: 'a@b.com' }],
      updateExistingUsersOnly: true,
    });
    const unsubscribeBody = getJsonBody(unsubscribe);
    expect(unsubscribeBody).toEqual({
      listId: 123,
      subscribers: [{ email: 'c@d.com' }],
      channelUnsubscribe: false,
    });
    expect(Object.prototype.hasOwnProperty.call(unsubscribeBody, 'updateExistingUsersOnly')).toBe(
      false,
    );
  });

  it('produces one subscribe + one unsubscribe batch from a hybrid 3+2 mixed-identifier batch', async () => {
    // Hybrid project with email + userId mappings; 5 events mix email-only,
    // userId-only and hybrid rows across INSERT and DELETE actions.
    const destination = buildDestination({ projectType: 'hybrid' });
    const hybridMappings: IdentifierMapping[] = [
      { from: 'email', to: 'email' },
      { from: 'userId', to: 'userId' },
    ];
    const connection = buildConnection(777, hybridMappings);

    const inputs = [
      // INSERTs: email-only, userId-only, hybrid-row (both columns present)
      buildInput(1, 'insert', { email: 'a@b.com' }, destination, connection),
      buildInput(2, 'insert', { userId: 'u-2' }, destination, connection),
      buildInput(3, 'insert', { email: 'c@d.com', userId: 'u-3' }, destination, connection),
      // DELETEs: email-only, userId-only
      buildInput(4, 'delete', { email: 'e@f.com' }, destination, connection),
      buildInput(5, 'delete', { userId: 'u-5' }, destination, connection),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});
    const successes = results.filter((r) => r.statusCode === 200);
    expect(successes).toHaveLength(2);

    const subscribe = successes.find((r) => getEndpoint(r).endsWith('/api/lists/subscribe'))!;
    const unsubscribe = successes.find((r) => getEndpoint(r).endsWith('/api/lists/unsubscribe'))!;

    // Hybrid sends both identifiers when a row has both (row 3 → email + userId).
    expect(getJsonBody(subscribe)).toEqual({
      listId: 777,
      subscribers: [{ email: 'a@b.com' }, { userId: 'u-2' }, { userId: 'u-3', email: 'c@d.com' }],
    });
    expect(subscribe.metadata.map((m) => m.jobId)).toEqual([1, 2, 3]);

    expect(getJsonBody(unsubscribe)).toEqual({
      listId: 777,
      subscribers: [{ email: 'e@f.com' }, { userId: 'u-5' }],
      channelUnsubscribe: false,
    });
    expect(unsubscribe.metadata.map((m) => m.jobId)).toEqual([4, 5]);
  });
});

// ---------------------------------------------------------------------------
// Per-row validation errors
// ---------------------------------------------------------------------------

describe('IterableAudienceIntegration per-row errors', () => {
  it('returns 400 for row with empty mapped identifier; other rows succeed', async () => {
    const destination = buildDestination({ projectType: 'email-based' });
    const connection = buildConnection(123, emailMappings);
    const inputs = [
      buildInput(1, 'insert', { email: 'a@b.com' }, destination, connection),
      buildInput(2, 'insert', { email: '' }, destination, connection),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});
    const successes = results.filter((r) => r.statusCode === 200);
    const errors = results.filter((r) => r.statusCode === 400);

    expect(errors).toHaveLength(1);
    expect(errors[0].metadata[0].jobId).toBe(2);
    expect(successes).toHaveLength(1);
    expect(successes[0].metadata.map((m) => m.jobId)).toEqual([1]);
  });

  it('returns 400 for row with malformed email; other rows succeed', async () => {
    // Force the invalid-rejection branch in processAudienceRecord so the
    // malformed email is dropped → triggers "all identifier values empty".
    const previous = process.env.ITERABLE_AUDIENCE_REJECT_INVALID_FIELDS;
    process.env.ITERABLE_AUDIENCE_REJECT_INVALID_FIELDS = 'true';
    try {
      const destination = buildDestination({ projectType: 'email-based' });
      const connection = buildConnection(123, emailMappings);
      const inputs = [
        buildInput(1, 'insert', { email: 'a@b.com' }, destination, connection),
        buildInput(2, 'insert', { email: 'not-an-email' }, destination, connection),
      ];

      const results = await processBatchedDestination(inputs, Integration, {});
      const errors = results.filter((r) => r.statusCode === 400);
      const successes = results.filter((r) => r.statusCode === 200);

      expect(errors).toHaveLength(1);
      expect(errors[0].metadata[0].jobId).toBe(2);
      expect(successes).toHaveLength(1);
      expect(successes[0].metadata.map((m) => m.jobId)).toEqual([1]);
    } finally {
      if (previous === undefined) {
        delete process.env.ITERABLE_AUDIENCE_REJECT_INVALID_FIELDS;
      } else {
        process.env.ITERABLE_AUDIENCE_REJECT_INVALID_FIELDS = previous;
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Identifier / project-type mismatch (per-row, not construction-time)
// ---------------------------------------------------------------------------

describe('IterableAudienceIntegration identifier selection errors', () => {
  // Identifiers are mapped at rudder-sources, so there is no construction-time
  // mapping validation. A row whose identifier does not match the project type
  // surfaces as a per-row 400 from `selectIdentifierForRow`.
  it('returns 400 when an email-based project row carries only a userId', async () => {
    const destination = buildDestination({ projectType: 'email-based' });
    const connection = buildConnection(123, emailMappings);
    const inputs = [buildInput(1, 'insert', { userId: 'u-1' }, destination, connection)];

    const results = await processBatchedDestination(inputs, Integration, {});
    const errors = results.filter((r) => r.statusCode === 400);
    expect(errors).toHaveLength(1);
    expect(errors[0].metadata[0].jobId).toBe(1);
  });

  it('returns 400 when a userId-based project row carries only an email', async () => {
    const destination = buildDestination({ projectType: 'userId-based' });
    const connection = buildConnection(123, userIdMappings);
    const inputs = [buildInput(1, 'insert', { email: 'a@b.com' }, destination, connection)];

    const results = await processBatchedDestination(inputs, Integration, {});
    const errors = results.filter((r) => r.statusCode === 400);
    expect(errors).toHaveLength(1);
    expect(errors[0].metadata[0].jobId).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Datacenter routing + auth header
// ---------------------------------------------------------------------------

describe('IterableAudienceIntegration datacenter + auth', () => {
  it('EU datacenter routes to api.eu.iterable.com', async () => {
    const destination = buildDestination({ dataCenter: 'EU', projectType: 'email-based' });
    const connection = buildConnection(123, emailMappings);
    const inputs = [buildInput(1, 'insert', { email: 'a@b.com' }, destination, connection)];

    const results = await processBatchedDestination(inputs, Integration, {});
    const success = results.find((r) => r.statusCode === 200)!;
    expect(getEndpoint(success)).toBe('https://api.eu.iterable.com/api/lists/subscribe');
  });

  it('lowercases emails end-to-end on the outgoing batch body', async () => {
    const destination = buildDestination({ projectType: 'email-based' });
    const connection = buildConnection(123, emailMappings);
    const inputs = [
      buildInput(1, 'insert', { email: '  Alice@EXAMPLE.com  ' }, destination, connection),
      buildInput(2, 'insert', { email: 'BOB@example.COM' }, destination, connection),
    ];

    const results = await processBatchedDestination(inputs, Integration, {});
    const success = results.find((r) => r.statusCode === 200)!;
    expect(getJsonBody(success)).toEqual({
      listId: 123,
      subscribers: [{ email: 'alice@example.com' }, { email: 'bob@example.com' }],
    });
  });

  it('sets Api-Key header from destination config', async () => {
    const destination = buildDestination({
      apiKey: 'super-secret',
      projectType: 'email-based',
    });
    const connection = buildConnection(123, emailMappings);
    const inputs = [buildInput(1, 'insert', { email: 'a@b.com' }, destination, connection)];

    const results = await processBatchedDestination(inputs, Integration, {});
    const success = results.find((r) => r.statusCode === 200)!;
    const headers = getHeaders(success);
    expect(headers['Api-Key']).toBe('super-secret');
    expect(headers['Content-Type']).toBe('application/json');
  });
});
