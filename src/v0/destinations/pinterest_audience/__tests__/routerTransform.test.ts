import sha256 from 'sha256';
import { Integration } from '../routerTransform';
import { processDestinationIntegration } from '../../../../services/destination/destinationIntegration/processDestinationIntegration';
import type { Metadata } from '../../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';

type RecordAction = 'insert' | 'update' | 'delete';

const AD_ACCOUNT_ID = '549756359984';
const LIST_ID = '2542620905475';
const OTHER_LIST_ID = '2542620905999';
const ACCESS_TOKEN = 'test-pinterest-audience-access-token';
const endpointFor = (listId: string) =>
  `https://api.pinterest.com/v5/ad_accounts/${AD_ACCOUNT_ID}/customer_lists/${listId}`;
const ENDPOINT = endpointFor(LIST_ID);

const buildDestination = () => ({
  ID: 'dest-1',
  Name: 'pinterest_audience',
  DestinationDefinition: {
    ID: 'destDef-1',
    Name: 'PINTEREST_AUDIENCE',
    DisplayName: 'Pinterest Audience',
    Config: {},
  },
  Config: { rudderAccountId: 'acc-1' },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
});

const buildConnection = (overrides: Record<string, unknown> = {}) => ({
  sourceId: 'src-1',
  destinationId: 'dest-1',
  enabled: true,
  config: {
    destination: {
      adAccountId: AD_ACCOUNT_ID,
      customerListId: LIST_ID,
      audienceId: '2542620905476',
      isHashRequired: true,
      syncMode: 'mirror',
      schemaVersion: '1.1',
      identifierMappings: [{ from: 'email', to: 'EMAIL' }],
      ...overrides,
    },
  },
});

const buildInput = (
  jobId: number,
  action: RecordAction,
  identifiers: Record<string, unknown>,
  connection: ReturnType<typeof buildConnection> = buildConnection(),
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
    metadata: {
      jobId,
      workspaceId: 'ws-1',
      destinationId: 'dest-1',
      sourceId: 'src-1',
      destinationType: 'PINTEREST_AUDIENCE',
      messageId: `msg-${jobId}`,
      secret: { accessToken: ACCESS_TOKEN },
    } as unknown as Metadata,
    destination: buildDestination(),
    connection,
  }) as unknown as RouterTransformationRequestData;

const run = (inputs: RouterTransformationRequestData[]) =>
  processDestinationIntegration(inputs, Integration, {});
const successes = (results: any[]) => results.filter((r) => r.statusCode === 200);
const failures = (results: any[]) => results.filter((r) => r.statusCode !== 200);
const bodyOf = (r: any) => r.batchedRequest.body.JSON;
const jobIdsOf = (r: any) => r.metadata.map((m: any) => m.jobId);

describe('pinterest_audience router transform', () => {
  it('builds one PATCH to the customer list with records_v2', async () => {
    const results = await run([buildInput(1, 'insert', { EMAIL: '  Alice@Example.COM ' })]);
    const ok = successes(results);
    expect(ok).toHaveLength(1);
    expect(ok[0].batched).toBe(true);
    expect(ok[0].batchedRequest).toMatchObject({
      method: 'PATCH',
      endpoint: ENDPOINT,
      endpointPath: '/ad_accounts/{ad_account_id}/customer_lists/{customer_list_id}',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ACCESS_TOKEN}` },
    });
    expect(bodyOf(ok[0])).toEqual({
      operation_type: 'ADD',
      records_v2: [{ email: sha256('alice@example.com') }],
    });
  });

  it('D1 insert+update become one ADD request and delete one REMOVE request on the same URL', async () => {
    const results = await run([
      buildInput(1, 'insert', { EMAIL: 'a@example.com' }),
      buildInput(2, 'update', { EMAIL: 'b@example.com' }),
      buildInput(3, 'delete', { EMAIL: 'c@example.com' }),
    ]);
    const ok = successes(results);
    expect(ok).toHaveLength(2);
    ok.forEach((r) => expect(r.batchedRequest.endpoint).toBe(ENDPOINT));
    expect(ok.map((r) => [bodyOf(r), jobIdsOf(r)])).toEqual([
      [
        {
          operation_type: 'ADD',
          records_v2: [{ email: sha256('a@example.com') }, { email: sha256('b@example.com') }],
        },
        [1, 2],
      ],
      [{ operation_type: 'REMOVE', records_v2: [{ email: sha256('c@example.com') }] }, [3]],
    ]);
  });

  it('D2 rows of two connections go to their own list and never mix', async () => {
    const results = await run([
      buildInput(1, 'insert', { EMAIL: 'a@example.com' }),
      buildInput(
        2,
        'insert',
        { EMAIL: 'b@example.com' },
        buildConnection({ customerListId: OTHER_LIST_ID }),
      ),
    ]);
    expect(
      successes(results).map((r) => [r.batchedRequest.endpoint, bodyOf(r).records_v2, jobIdsOf(r)]),
    ).toEqual([
      [ENDPOINT, [{ email: sha256('a@example.com') }], [1]],
      [endpointFor(OTHER_LIST_ID), [{ email: sha256('b@example.com') }], [2]],
    ]);
  });

  it('rows with different identifier sets share one request', async () => {
    const results = await run([
      buildInput(1, 'insert', { EMAIL: 'a@example.com' }),
      buildInput(2, 'insert', { MAID: 'CDDA802E-FB9C-47AD-9866-0794D394C912' }),
      buildInput(3, 'insert', { PHONE: '+1 (415) 555-0132', EMAIL: 'c@example.com' }),
    ]);
    const ok = successes(results);
    expect(ok).toHaveLength(1);
    expect(bodyOf(ok[0]).records_v2).toEqual([
      { email: sha256('a@example.com') },
      { maid: sha256('cdda802e-fb9c-47ad-9866-0794d394c912') },
      { email: sha256('c@example.com'), hashed_phone_number: sha256('14155550132') },
    ]);
  });

  it('ignores identifier keys Pinterest does not accept', async () => {
    const results = await run([
      buildInput(1, 'insert', {
        EMAIL: 'a@example.com',
        EXTERNAL_ID: 'x-1',
        email: 'b@example.com',
      }),
    ]);
    expect(bodyOf(successes(results)[0]).records_v2).toEqual([{ email: sha256('a@example.com') }]);
  });

  it.each([
    { name: 'no identifiers', identifiers: {} },
    { name: 'D7 only invalid identifiers', identifiers: { PHONE: '12345', EMAIL: 'not-an-email' } },
    { name: 'only unsupported keys', identifiers: { EXTERNAL_ID: 'x-1' } },
  ])('aborts only the record with $name; siblings deliver', async ({ identifiers }) => {
    const results = await run([
      buildInput(1, 'insert', { EMAIL: 'a@example.com' }),
      buildInput(2, 'insert', identifiers),
    ]);
    expect(jobIdsOf(successes(results)[0])).toEqual([1]);
    expect(failures(results)).toEqual([
      expect.objectContaining({
        statusCode: 400,
        error: 'No valid Pinterest identifier (EMAIL / MAID / PHONE) after normalization',
        metadata: [expect.objectContaining({ jobId: 2 })],
      }),
    ]);
  });

  it('D8 passes pre-hashed values through when isHashRequired is false', async () => {
    const pre = sha256('alice@example.com');
    const results = await run([
      buildInput(1, 'insert', { EMAIL: pre }, buildConnection({ isHashRequired: false })),
    ]);
    expect(bodyOf(successes(results)[0]).records_v2).toEqual([{ email: pre }]);
  });

  it('D9 aborts a plain value when isHashRequired is false', async () => {
    const results = await run([
      buildInput(
        1,
        'insert',
        { EMAIL: 'alice@example.com' },
        buildConnection({ isHashRequired: false }),
      ),
    ]);
    expect(failures(results)).toEqual([
      expect.objectContaining({
        statusCode: 400,
        error:
          'Hashing is disabled but the value for field EMAIL appears to be unhashed. Either enable hashing or send pre-hashed data.',
      }),
    ]);
  });

  it('D10 chunks at 1000 rows per request (literal, so a changed constant fails)', async () => {
    const inputs = Array.from({ length: 1001 }, (_, i) =>
      buildInput(i + 1, 'insert', { EMAIL: `user${i}@example.com` }),
    );
    const sizes = successes(await run(inputs)).map((r) => bodyOf(r).records_v2.length);
    expect(sizes).toEqual([1000, 1]);
  });

  it('D11 fails the record when the access token is missing', async () => {
    const input = buildInput(1, 'insert', { EMAIL: 'a@example.com' });
    delete (input.metadata as any).secret;
    const results = await run([input]);
    expect(successes(results)).toHaveLength(0);
    expect(results[0]).toMatchObject({
      error: 'Secret or accessToken is not present in the metadata',
    });
  });

  it('rejects a non-record message type via the input schema', async () => {
    const input = buildInput(1, 'insert', { EMAIL: 'a@example.com' });
    (input.message as any).type = 'track';
    const results = await run([input]);
    expect(results[0].statusCode).toBe(400);
  });

  it('fails a row that carries no connection', async () => {
    const input = buildInput(1, 'insert', { EMAIL: 'a@example.com' }) as any;
    delete input.connection;
    const results = await run([input]);
    expect(results[0]).toMatchObject({
      statusCode: 400,
      error: 'Connection config is required for pinterest_audience',
    });
  });

  it.each([
    { field: 'adAccountId', value: '../x' },
    { field: 'adAccountId', value: 'abc' },
    { field: 'customerListId', value: '' },
    { field: 'customerListId', value: '1234567890123456789' },
  ])('rejects a non-numeric $field ($value) as a configuration error', async ({ field, value }) => {
    const results = await run([
      buildInput(1, 'insert', { EMAIL: 'a@example.com' }, buildConnection({ [field]: value })),
      buildInput(2, 'insert', { EMAIL: 'b@example.com' }),
    ]);
    expect(jobIdsOf(successes(results)[0])).toEqual([2]);
    expect(failures(results)).toEqual([
      expect.objectContaining({
        statusCode: 400,
        error: `connection.config.destination.${field}: ${field} must be a numeric Pinterest id`,
        statTags: expect.objectContaining({ errorType: 'configuration' }),
      }),
    ]);
  });

  it('hashes each row per its own connection and sends it to its own list URL', async () => {
    const OTHER_AD_ACCOUNT_ID = '549756359985';
    const preHashed = sha256('pre@example.com');
    const results = await run([
      buildInput(1, 'insert', { EMAIL: 'Hash@Example.com' }),
      buildInput(
        2,
        'insert',
        { EMAIL: preHashed },
        buildConnection({
          isHashRequired: false,
          adAccountId: OTHER_AD_ACCOUNT_ID,
          customerListId: OTHER_LIST_ID,
        }),
      ),
    ]);
    const ok = successes(results);
    expect(failures(results)).toHaveLength(0);
    expect(
      ok
        .map((r) => [r.batchedRequest.endpoint, bodyOf(r), jobIdsOf(r)])
        .sort((a, b) => a[2][0] - b[2][0]),
    ).toEqual([
      [
        ENDPOINT,
        { operation_type: 'ADD', records_v2: [{ email: sha256('hash@example.com') }] },
        [1],
      ],
      [
        `https://api.pinterest.com/v5/ad_accounts/${OTHER_AD_ACCOUNT_ID}/customer_lists/${OTHER_LIST_ID}`,
        { operation_type: 'ADD', records_v2: [{ email: preHashed }] },
        [2],
      ],
    ]);
  });

  it('fails only the pre-hashed row when isHashRequired is true; siblings deliver', async () => {
    const results = await run([
      buildInput(1, 'insert', { EMAIL: 'good@example.com' }),
      buildInput(2, 'insert', { EMAIL: sha256('pre@example.com') }),
      buildInput(3, 'insert', { EMAIL: 'also@example.com' }),
    ]);
    const ok = successes(results);
    expect(ok).toHaveLength(1);
    expect(jobIdsOf(ok[0])).toEqual([1, 3]);
    const bad = failures(results);
    expect(bad).toHaveLength(1);
    expect(bad[0].metadata.map((m: any) => m.jobId)).toEqual([2]);
    expect(bad[0].statusCode).toBe(400);
  });
});
