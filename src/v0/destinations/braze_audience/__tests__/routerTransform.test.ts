import { Integration } from '../routerTransform';
import { processDestinationIntegration } from '../../../../services/destination/destinationIntegration/processDestinationIntegration';
import type { Metadata } from '../../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';
import type { Connection, Destination } from '../../../../types/controlPlaneConfig';
import type { BrazeAudienceAccountConfig, BrazeAudienceConnectionConfig } from '../types';

type BrazeAudienceDestination = Destination<BrazeAudienceAccountConfig>;
type BrazeAudienceConnection = Connection<{ destination: BrazeAudienceConnectionConfig }>;
type RecordAction = 'insert' | 'update' | 'delete';

const buildDestination = (
  configOverrides: Partial<BrazeAudienceAccountConfig> = {},
): BrazeAudienceDestination => ({
  ID: 'dest-1',
  Name: 'braze_audience',
  DestinationDefinition: {
    ID: 'destDef-1',
    Name: 'BRAZE_AUDIENCE',
    DisplayName: 'Braze Audiences',
    Config: {},
  },
  Config: {
    restApiKey: 'test-rest-api-key',
    dataCenter: 'US-03',
    ...configOverrides,
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
});

const buildConnection = (
  overrides: Partial<BrazeAudienceConnectionConfig> = {},
): BrazeAudienceConnection => ({
  sourceId: 'src-1',
  destinationId: 'dest-1',
  enabled: true,
  config: {
    destination: {
      customAttributeName: 'rs_audience_high_intent',
      syncMode: 'mirror',
      identifierMappings: [{ from: 'user_id', to: 'external_id' }],
      ...overrides,
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
    destinationType: 'BRAZE_AUDIENCE',
    messageId: `msg-${jobId}`,
  }) as Metadata;

const buildInput = (
  jobId: number,
  action: RecordAction,
  identifiers: Record<string, unknown>,
  destination: BrazeAudienceDestination = buildDestination(),
  connection: BrazeAudienceConnection = buildConnection(),
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

describe('BrazeAudienceIntegration via processDestinationIntegration', () => {
  it('INSERT/UPDATE → membership true; DELETE → false in one bulk batch', async () => {
    const inputs = [
      buildInput(1, 'insert', { external_id: 'u1' }),
      buildInput(2, 'update', { external_id: 'u2' }),
      buildInput(3, 'delete', { external_id: 'u3' }),
    ];
    const results = await processDestinationIntegration(inputs, Integration, {});
    const successes = results.filter((r) => r.statusCode === 200);
    expect(successes).toHaveLength(1);
    expect(successes[0].batched).toBe(true);
    expect(getEndpoint(successes[0])).toBe('https://rest.iad-03.braze.com/users/track/bulk');
    expect(getJsonBody(successes[0])).toEqual({
      attributes: [
        { external_id: 'u1', rs_audience_high_intent: true },
        { external_id: 'u2', rs_audience_high_intent: true },
        { external_id: 'u3', rs_audience_high_intent: false },
      ],
    });
  });

  it('maps EU data center to fra host', async () => {
    const dest = buildDestination({ dataCenter: 'EU-01' });
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { external_id: 'eu-user' }, dest)],
      Integration,
      {},
    );
    expect(getEndpoint(results[0])).toBe('https://rest.fra-01.braze.eu/users/track/bulk');
  });

  it('maps AU data center to au host', async () => {
    const dest = buildDestination({ dataCenter: 'AU-01' });
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { external_id: 'au-user' }, dest)],
      Integration,
      {},
    );
    expect(getEndpoint(results[0])).toBe('https://rest.au-01.braze.com/users/track/bulk');
  });

  it('aborts empty external_id per record', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(1, 'insert', { external_id: '  ' }),
        buildInput(2, 'insert', { external_id: 'ok' }),
      ],
      Integration,
      {},
    );
    const failed = results.find((r) => r.statusCode === 400);
    const ok = results.find((r) => r.statusCode === 200);
    expect(failed).toBeDefined();
    expect(ok).toBeDefined();
    expect(getJsonBody(ok!).attributes).toEqual([
      { external_id: 'ok', rs_audience_high_intent: true },
    ]);
  });

  it('rejects non-string/non-number external_id at schema validation', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(1, 'insert', { external_id: { nested: true } }),
        buildInput(2, 'insert', { external_id: 'ok' }),
      ],
      Integration,
      {},
    );
    const failed = results.find((r) => r.statusCode === 400);
    const ok = results.find((r) => r.statusCode === 200);
    expect(failed?.error).toMatch(/message\.identifiers\.external_id/);
    expect(getJsonBody(ok!).attributes).toEqual([
      { external_id: 'ok', rs_audience_high_intent: true },
    ]);
  });

  it('accepts numeric external_id', async () => {
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { external_id: 42 })],
      Integration,
      {},
    );
    expect(results[0].statusCode).toBe(200);
    expect(getJsonBody(results[0]).attributes).toEqual([
      { external_id: '42', rs_audience_high_intent: true },
    ]);
  });

  it('rejects customAttributeName reserved as external_id', async () => {
    const connection = buildConnection({ customAttributeName: 'external_id' });
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { external_id: 'u1' }, buildDestination(), connection)],
      Integration,
      {},
    );
    expect(results[0].statusCode).toBe(400);
    expect(results[0].error).toMatch(/customAttributeName cannot be external_id/);
  });

  it('rejects missing customAttributeName via Zod', async () => {
    const connection = buildConnection({ customAttributeName: '' as unknown as string });
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { external_id: 'u1' }, buildDestination(), connection)],
      Integration,
      {},
    );
    expect(results[0].statusCode).toBe(400);
  });

  it('sends Bearer auth header from restApiKey', async () => {
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { external_id: 'u1' })],
      Integration,
      {},
    );
    const { batchedRequest } = results[0] as any;
    expect(batchedRequest.headers).toMatchObject({
      Authorization: 'Bearer test-rest-api-key',
      'Content-Type': 'application/json',
    });
  });
});

describe('BrazeAudienceIntegration trackEndpoint', () => {
  const endpointCases = [
    {
      name: 'absent (account saved before the option existed) → bulk',
      config: {},
      endpoint: 'https://rest.iad-03.braze.com/users/track/bulk',
      partner: undefined,
    },
    {
      name: 'bulk → /users/track/bulk without partner',
      config: { trackEndpoint: 'bulk' as const },
      endpoint: 'https://rest.iad-03.braze.com/users/track/bulk',
      partner: undefined,
    },
    {
      name: 'standard → /users/track with partner',
      config: { trackEndpoint: 'standard' as const },
      endpoint: 'https://rest.iad-03.braze.com/users/track',
      partner: 'RudderStack',
    },
  ];

  const batchSizeCases = [
    { name: 'standard splits at 75', trackEndpoint: 'standard' as const, sizes: [75, 1] },
    { name: 'bulk keeps 76 in one request', trackEndpoint: 'bulk' as const, sizes: [76] },
  ];

  it.each(endpointCases)('$name', async ({ config, endpoint, partner }) => {
    const dest = buildDestination(config);
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { external_id: 'u1' }, dest)],
      Integration,
      {},
    );
    expect(results[0].statusCode).toBe(200);
    expect(getEndpoint(results[0])).toBe(endpoint);
    expect(getJsonBody(results[0]).partner).toBe(partner);
    expect(getJsonBody(results[0]).attributes).toEqual([
      { external_id: 'u1', rs_audience_high_intent: true },
    ]);
  });

  it.each(batchSizeCases)('$name', async ({ trackEndpoint, sizes }) => {
    const dest = buildDestination({ trackEndpoint });
    const inputs = Array.from({ length: 76 }, (_, i) =>
      buildInput(i + 1, 'insert', { external_id: `u${i + 1}` }, dest),
    );
    const results = await processDestinationIntegration(inputs, Integration, {});
    expect(results.map((r) => getJsonBody(r).attributes.length)).toEqual(sizes);
  });

  it('rejects an unknown trackEndpoint at schema validation', async () => {
    const dest = buildDestination({ trackEndpoint: 'users_track' as unknown as 'standard' });
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { external_id: 'u1' }, dest)],
      Integration,
      {},
    );
    expect(results[0].statusCode).toBe(400);
    expect(results[0].error).toMatch(/trackEndpoint/);
  });
});
