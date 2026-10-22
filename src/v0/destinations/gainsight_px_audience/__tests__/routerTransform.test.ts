import { Integration } from '../routerTransform';
import { processDestinationIntegration } from '../../../../services/destination/destinationIntegration/processDestinationIntegration';
import type { Metadata } from '../../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';
import logger from '../../../../logger';

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

const buildConnection = (
  customAttributeName = 'rs_gpx_e2e',
  sourceId = 'src-1',
  fieldMappings?: unknown,
) => ({
  sourceId,
  destinationId: 'dest-1',
  enabled: true,
  config: {
    destination: {
      customAttributeName,
      syncMode: 'mirror',
      schemaVersion: '1.1',
      identifierMappings: [{ from: 'user_id', to: 'identifyId' }],
      ...(fieldMappings !== undefined ? { fieldMappings } : {}),
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
  fields: Record<string, unknown> = {},
): RouterTransformationRequestData =>
  ({
    message: {
      type: 'record',
      action,
      identifiers,
      fields,
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

  it('sets the trimmed API key header in the router output', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(
          1,
          'insert',
          { identifyId: 'u-1' },
          buildDestination({ apiKey: '  test-gainsight-px-api-key  ' }),
        ),
      ],
      Integration,
      {},
    );
    expect(successes(results)[0].batchedRequest.headers).toEqual({
      'Content-Type': 'application/json',
      'X-APTRINSIC-API-KEY': 'test-gainsight-px-api-key',
    });
  });

  it.each([[''], ['   ']])(
    'fails the row in input-schema validation when the API key is %p',
    async (apiKey) => {
      const results = await processDestinationIntegration(
        [buildInput(1, 'insert', { identifyId: 'u-1' }, buildDestination({ apiKey }))],
        Integration,
        {},
      );
      expect(successes(results)).toHaveLength(0);
      const failed = results[0] as any;
      expect(failed.statusCode).toBe(400);
      expect(failed.error).toBe('destination.Config.apiKey: Gainsight PX API key is missing');
      expect(failed.statTags.errorCategory).toBe('dataValidation');
      expect(failed.statTags.errorType).toBe('configuration');
    },
  );

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

describe('GainsightPxAudienceIntegration — trait mappings (v1.1)', () => {
  const TRAITS = [
    { from: 'role', to: 'rs_gpx_string', type: 'STRING' },
    { from: 'events', to: 'rs_gpx_number', type: 'NUMBER' },
    { from: 'last_visit', to: 'rs_gpx_date', type: 'DATE_TIME' },
  ];
  const traitConnection = buildConnection('rs_gpx_e2e', 'src-1', TRAITS);
  const member = (
    jobId: number,
    action: RecordAction,
    identifyId: string,
    fields: Record<string, unknown>,
    connection = traitConnection,
  ) => buildInput(jobId, action, { identifyId }, buildDestination(), connection, fields);

  let warnSpy: jest.SpyInstance;
  beforeEach(() => {
    warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => undefined);
  });
  afterEach(() => warnSpy.mockRestore());

  it('writes the flag and the converted traits in one PUT', async () => {
    const results = await processDestinationIntegration(
      [
        member(1, 'insert', 'u-1', {
          rs_gpx_string: 'admin',
          rs_gpx_number: '42',
          rs_gpx_date: '2026-10-20T10:00:00Z',
        }),
      ],
      Integration,
      {},
    );
    const body = bodyOf(successes(results)[0]);
    expect(body).toEqual({
      identifyId: 'u-1',
      customAttributes: {
        rs_gpx_e2e: true,
        rs_gpx_string: 'admin',
        rs_gpx_number: 42,
        rs_gpx_date: 1792490400000,
      },
    });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('writes the traits on update as on insert', async () => {
    const results = await processDestinationIntegration(
      [member(1, 'update', 'u-1', { rs_gpx_string: 'viewer' })],
      Integration,
      {},
    );
    expect(bodyOf(successes(results)[0]).customAttributes).toMatchObject({
      rs_gpx_e2e: true,
      rs_gpx_string: 'viewer',
    });
  });

  it('writes only { flag: false } on delete, even with trait values present (D23)', async () => {
    const results = await processDestinationIntegration(
      [member(1, 'delete', 'u-1', { rs_gpx_string: 'admin', rs_gpx_number: 'abc' })],
      Integration,
      {},
    );
    expect(bodyOf(successes(results)[0])).toEqual({
      identifyId: 'u-1',
      customAttributes: { rs_gpx_e2e: false },
    });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('leaves a bad trait out, keeps the flag and the other traits, and logs one line per (attribute, reason)', async () => {
    const results = await processDestinationIntegration(
      [
        member(1, 'insert', 'secret-user-1', { rs_gpx_string: 'admin', rs_gpx_number: 'abc' }),
        member(2, 'insert', 'secret-user-2', { rs_gpx_string: null, rs_gpx_number: 'xyz' }),
      ],
      Integration,
      {},
    );

    expect(successes(results).map(bodyOf)).toEqual([
      {
        identifyId: 'secret-user-1',
        customAttributes: { rs_gpx_e2e: true, rs_gpx_string: 'admin' },
      },
      { identifyId: 'secret-user-2', customAttributes: { rs_gpx_e2e: true } },
    ]);
    expect(warnSpy.mock.calls).toEqual([
      [
        'Gainsight PX Audience: trait left out of the write',
        {
          destType: 'gainsight_px_audience',
          attribute: 'rs_gpx_number',
          reason: 'unconvertible',
          count: 2,
        },
      ],
    ]);
    const logged = JSON.stringify(warnSpy.mock.calls);
    ['abc', 'xyz', 'secret-user-1', 'secret-user-2'].forEach((text) =>
      expect(logged).not.toContain(text),
    );
  });

  it('counts per transformEvents pass: a dontBatch row logs on its own', async () => {
    const batchable = member(1, 'insert', 'secret-user-1', { rs_gpx_number: 'abc' });
    const retried = member(2, 'insert', 'secret-user-2', { rs_gpx_number: 'xyz' });
    (retried.metadata as any).dontBatch = true;

    const results = await processDestinationIntegration([batchable, retried], Integration, {});

    expect(successes(results)).toHaveLength(2);
    const line = [
      'Gainsight PX Audience: trait left out of the write',
      {
        destType: 'gainsight_px_audience',
        attribute: 'rs_gpx_number',
        reason: 'unconvertible',
        count: 1,
      },
    ];
    const forPair = warnSpy.mock.calls.filter(
      ([, meta]) => meta.attribute === 'rs_gpx_number' && meta.reason === 'unconvertible',
    );
    expect(forPair).toEqual([line, line]);
    const logged = JSON.stringify(warnSpy.mock.calls);
    ['abc', 'xyz', 'secret-user-1', 'secret-user-2'].forEach((text) =>
      expect(logged).not.toContain(text),
    );
  });

  it('logs unknown_type for a row saved without type', async () => {
    const results = await processDestinationIntegration(
      [
        member(
          1,
          'insert',
          'u-1',
          { rs_gpx_string: 'admin' },
          buildConnection('rs_gpx_e2e', 'src-1', [{ from: 'role', to: 'rs_gpx_string' }]),
        ),
      ],
      Integration,
      {},
    );
    expect(bodyOf(successes(results)[0]).customAttributes).toEqual({ rs_gpx_e2e: true });
    expect(warnSpy).toHaveBeenCalledWith('Gainsight PX Audience: trait left out of the write', {
      destType: 'gainsight_px_audience',
      attribute: 'rs_gpx_string',
      reason: 'unknown_type',
      count: 1,
    });
  });

  describe('a malformed trait config never blocks the flag (D18)', () => {
    const flagOnly = async (
      fieldMappings: unknown,
      fields: unknown = { rs_gpx_string: 'x' },
    ): Promise<any> => {
      const results = await processDestinationIntegration(
        [
          buildInput(
            1,
            'insert',
            { identifyId: 'u-1' },
            buildDestination(),
            buildConnection('rs_gpx_e2e', 'src-1', fieldMappings),
            fields as Record<string, unknown>,
          ),
        ],
        Integration,
        {},
      );
      expect(results).toHaveLength(1);
      expect(results[0].statusCode).toBe(200);
      return bodyOf(results[0]);
    };

    it('writes the flag and logs unknown_type for a stored type: null', async () => {
      const body = await flagOnly([{ from: 'role', to: 'rs_gpx_string', type: null }]);
      expect(body.customAttributes).toEqual({ rs_gpx_e2e: true });
      expect(warnSpy).toHaveBeenCalledWith(
        'Gainsight PX Audience: trait left out of the write',
        expect.objectContaining({ attribute: 'rs_gpx_string', reason: 'unknown_type' }),
      );
    });

    it('drops non-object rows and rows with a non-string from/to, keeping the valid ones', async () => {
      const body = await flagOnly([
        'oops',
        null,
        42,
        { from: 1, to: 'rs_gpx_number', type: 'NUMBER' },
        { from: 'a', to: null, type: 'STRING' },
        { from: 'role', to: 'rs_gpx_string', type: 'STRING' },
      ]);
      expect(body.customAttributes).toEqual({ rs_gpx_e2e: true, rs_gpx_string: 'x' });
    });

    it('has no row cap: 60 valid rows are all written', async () => {
      const rows = Array.from({ length: 60 }, (_, i) => ({
        from: `c${i}`,
        to: `t${i}`,
        type: 'STRING',
      }));
      const values = Object.fromEntries(rows.map((r) => [r.to, 'v']));
      const body = await flagOnly(rows, values);
      expect(Object.keys(body.customAttributes)).toHaveLength(61);
    });

    it.each([
      ['a string', 'oops'],
      ['an array', ['x']],
      ['a number', 7],
    ])('treats fields as %s as no field values, leaving traits out', async (_label, fields) => {
      const body = await flagOnly([{ from: 'role', to: 'rs_gpx_string', type: 'STRING' }], fields);
      expect(body.customAttributes).toEqual({ rs_gpx_e2e: true });
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('treats a non-array fieldMappings as none', async () => {
      const body = await flagOnly({ from: 'role', to: 'rs_gpx_string', type: 'STRING' });
      expect(body.customAttributes).toEqual({ rs_gpx_e2e: true });
    });
  });

  it('never lets a trait overwrite the flag (API-saved config)', async () => {
    const results = await processDestinationIntegration(
      [
        member(
          1,
          'insert',
          'u-1',
          { rs_gpx_e2e: false },
          buildConnection('rs_gpx_e2e', 'src-1', [
            { from: 'x', to: 'rs_gpx_e2e', type: 'BOOLEAN' },
          ]),
        ),
      ],
      Integration,
      {},
    );
    expect(bodyOf(successes(results)[0]).customAttributes).toEqual({ rs_gpx_e2e: true });
  });

  it('does not count traits of a row that fails on its identifyId', async () => {
    await processDestinationIntegration(
      [buildInput(1, 'insert', {}, buildDestination(), traitConnection, { rs_gpx_number: 'abc' })],
      Integration,
      {},
    );
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('keeps v1 behaviour for a connection without fieldMappings, and tolerates null ones', async () => {
    const results = await processDestinationIntegration(
      [
        member(1, 'insert', 'u-1', { rs_gpx_string: 'x' }, buildConnection()),
        member(2, 'insert', 'u-2', {}, buildConnection('rs_gpx_e2e', 'src-1', null)),
      ],
      Integration,
      {},
    );
    expect(successes(results).map((r) => bodyOf(r).customAttributes)).toEqual([
      { rs_gpx_e2e: true },
      { rs_gpx_e2e: true },
    ]);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
