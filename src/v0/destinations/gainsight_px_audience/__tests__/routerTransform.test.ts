import { Integration } from '../routerTransform';
import { processDestinationIntegration } from '../../../../services/destination/destinationIntegration/processDestinationIntegration';
import type { Metadata } from '../../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';

type RecordAction = 'insert' | 'update' | 'delete';

const buildDestination = (config: Record<string, unknown> = {}) => ({
  ID: 'dest-1',
  Name: 'gainsight_px_audience',
  DestinationDefinition: {
    ID: 'destDef-1',
    Name: 'GAINSIGHT_PX_AUDIENCE',
    DisplayName: 'Gainsight PX Audience',
    Config: {},
  },
  Config: {
    rudderAccountId: 'acc-1',
    apiKey: 'test-gainsight-px-api-key',
    dataCenter: 'US',
    ...config,
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
});

const buildConnection = (customAttributeName = 'rs_gpx_e2e', sourceId = 'src-1') => ({
  sourceId,
  destinationId: 'dest-1',
  enabled: true,
  config: {
    destination: {
      customAttributeName,
      syncMode: 'mirror',
      schemaVersion: '1.1',
      identifierMappings: [{ from: 'user_id', to: 'identifyId' }],
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
    destinationType: 'GAINSIGHT_PX_AUDIENCE',
    messageId: `msg-${jobId}`,
  }) as Metadata;

const buildInput = (
  jobId: number,
  action: RecordAction,
  identifiers: Record<string, unknown>,
  destination = buildDestination(),
  connection: ReturnType<typeof buildConnection> | undefined = buildConnection(),
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

const successes = (results: any[]) => results.filter((r) => r.statusCode === 200);
const bodyOf = (r: any) => r.batchedRequest.body.JSON;

describe('GainsightPxAudienceIntegration via processDestinationIntegration', () => {
  it('sends one PUT /users/update per row: insert/update → true, delete → false', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(1, 'insert', { identifyId: 'u-1' }),
        buildInput(2, 'update', { identifyId: 'u-2' }),
        buildInput(3, 'delete', { identifyId: 'u-3' }),
      ],
      Integration,
      {},
    );

    const ok = successes(results);
    expect(ok).toHaveLength(3);
    ok.forEach((r) => {
      expect(r.batched).toBe(true);
      expect(r.metadata).toHaveLength(1);
      expect(r.batchedRequest.method).toBe('PUT');
      expect(r.batchedRequest.endpoint).toBe('https://api.aptrinsic.com/v1/users/update');
      expect(r.batchedRequest.endpointPath).toBe('/v1/users/update');
    });
    expect(ok.map(bodyOf)).toEqual([
      { identifyId: 'u-1', customAttributes: { rs_gpx_e2e: true } },
      { identifyId: 'u-2', customAttributes: { rs_gpx_e2e: true } },
      { identifyId: 'u-3', customAttributes: { rs_gpx_e2e: false } },
    ]);
  });

  it('never puts the API key in transform output', async () => {
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { identifyId: 'u-1' })],
      Integration,
      {},
    );
    const serialized = JSON.stringify(successes(results)[0].batchedRequest);
    expect(serialized).not.toContain('test-gainsight-px-api-key');
    expect(successes(results)[0].batchedRequest.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it.each([
    ['EU', 'https://api-eu.aptrinsic.com/v1/users/update'],
    ['US2', 'https://api-us2.aptrinsic.com/v1/users/update'],
  ])('maps data center %s to its host', async (dataCenter, endpoint) => {
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { identifyId: 'u-1' }, buildDestination({ dataCenter }))],
      Integration,
      {},
    );
    expect(successes(results)[0].batchedRequest.endpoint).toBe(endpoint);
  });

  it('keeps special characters and case in the body and out of the URL (trim only)', async () => {
    const ids = ['a;b', 'a,b', 'a/b', 'a+b', 'a b', 'Case-1', 'case-1'];
    const results = await processDestinationIntegration(
      [
        ...ids.map((id, i) => buildInput(i + 1, 'insert', { identifyId: id })),
        buildInput(99, 'insert', { identifyId: '  padded  ' }),
      ],
      Integration,
      {},
    );
    const ok = successes(results);
    expect(ok.map((r) => bodyOf(r).identifyId)).toEqual([...ids, 'padded']);
    ok.forEach((r) =>
      expect(r.batchedRequest.endpoint).toBe('https://api.aptrinsic.com/v1/users/update'),
    );
  });

  it('writes a numeric identifyId as its string form', async () => {
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { identifyId: 12345 })],
      Integration,
      {},
    );
    expect(bodyOf(successes(results)[0])).toEqual({
      identifyId: '12345',
      customAttributes: { rs_gpx_e2e: true },
    });
  });

  it('two connections in one call each write their own attribute', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(
          1,
          'insert',
          { identifyId: 'u-1' },
          buildDestination(),
          buildConnection('rs_attr_a', 'src-a'),
        ),
        buildInput(
          2,
          'delete',
          { identifyId: 'u-2' },
          buildDestination(),
          buildConnection('rs_attr_b', 'src-b'),
        ),
      ],
      Integration,
      {},
    );
    expect(successes(results).map(bodyOf)).toEqual([
      { identifyId: 'u-1', customAttributes: { rs_attr_a: true } },
      { identifyId: 'u-2', customAttributes: { rs_attr_b: false } },
    ]);
  });

  it.each([
    ['missing', {}, 'No identifyId mapped'],
    ['blank', { identifyId: '   ' }, 'No identifyId mapped'],
    ['an object', { identifyId: { id: 1 } }, 'Invalid identifyId'],
    ['a boolean', { identifyId: true }, 'Invalid identifyId'],
    ['NaN', { identifyId: Number.NaN }, 'Invalid identifyId'],
  ])('fails only the row whose identifyId is %s', async (_case, identifiers, error) => {
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', identifiers), buildInput(2, 'insert', { identifyId: 'good' })],
      Integration,
      {},
    );
    expect(successes(results)).toHaveLength(1);
    const failed = results.find((r: any) => r.statusCode === 400) as any;
    expect(failed.error).toBe(error);
    expect(failed.metadata[0].jobId).toBe(1);
  });

  it('rejects an attribute name outside ^[A-Za-z0-9_]{1,200}$', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(
          1,
          'insert',
          { identifyId: 'u-1' },
          buildDestination(),
          buildConnection('rs-bad'),
        ),
      ],
      Integration,
      {},
    );
    expect(results[0].statusCode).toBe(400);
  });

  it('rejects an unknown data center', async () => {
    const results = await processDestinationIntegration(
      [buildInput(1, 'insert', { identifyId: 'u-1' }, buildDestination({ dataCenter: 'APAC' }))],
      Integration,
      {},
    );
    expect(results[0].statusCode).toBe(400);
  });

  it('fails a row that carries no connection', async () => {
    // Omit the key outright: passing `undefined` to buildInput would pick up its default.
    const input = buildInput(1, 'insert', { identifyId: 'u-1' }) as any;
    delete input.connection;
    const results = await processDestinationIntegration([input], Integration, {});
    expect(results[0].statusCode).toBe(400);
    expect(results[0].error).toContain('Connection config is required');
  });
});
