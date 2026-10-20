jest.mock('../../../adapters/network');

import { httpGET, httpPOST } from '../../../adapters/network';
import logger from '../../../logger';
import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import * as lookupModule from './lookup';
import { Integration } from './routerTransform';
import { authCache } from './utils';

const mockHttpGet = httpGET as unknown as jest.Mock;
const mockHttpPost = httpPOST as unknown as jest.Mock;

const TOKEN = 'cdf01657-110d-4155-99a7-f986b2ff13a0:int';
const ENDPOINT_PATH = '/rest/v1/lists/:listId/leads.json';
const listEndpoint = (listId: string) =>
  `https://123-ABC-456.mktorest.com/rest/v1/lists/${listId}/leads.json`;
const HEADERS = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

const destination = (config: Record<string, unknown> = {}) => ({
  ID: 'dest-1',
  Name: 'MARKETO_AUDIENCE',
  DestinationDefinition: {
    ID: 'def-1',
    Name: 'MARKETO_AUDIENCE',
    DisplayName: 'Marketo Audience',
    Config: {},
  },
  Config: {
    rudderAccountId: 'acc-1',
    accountId: '123-ABC-456',
    clientId: 'marketo-client-id',
    clientSecret: 'marketo-client-secret',
    ...config,
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
});

const connection = (audienceId: unknown = '1234') => ({
  sourceId: 'src-1',
  destinationId: 'dest-1',
  enabled: true,
  config: {
    destination: {
      audienceId,
      createAudience: 'no',
      syncMode: 'mirror',
      identifierMappings: [
        { from: 'marketo_lead_id', to: 'id' },
        { from: 'email', to: 'email' },
      ],
      schemaVersion: '1.1',
      eventType: 'record',
    },
  },
});

type RowOptions = {
  action?: string;
  audienceId?: unknown;
  config?: Record<string, unknown>;
  type?: string;
};

const row = (
  jobId: number,
  identifiers: Record<string, unknown>,
  { action = 'insert', audienceId = '1234', config = {}, type = 'record' }: RowOptions = {},
) =>
  ({
    message: { type, action, identifiers, fields: {}, channel: 'sources', context: {} },
    // Only jobId: Event Tester sends synthetic metadata, so nothing else may be read from it.
    metadata: { jobId },
    destination: destination(config),
    connection: connection(audienceId),
  }) as unknown as RouterTransformationRequestData;

const tokenResponse = (expiresIn = 3599) => ({
  success: true,
  response: {
    status: 200,
    data: {
      access_token: TOKEN,
      token_type: 'bearer',
      expires_in: expiresIn,
      scope: 'api@acme.io',
    },
  },
});

const leadsResponse = (result: { id: number; email: string }[]) => ({
  success: true,
  response: {
    status: 200,
    data: { requestId: '10e3c#18a8d2c10e7', result, success: true },
  },
});

const run = (inputs: RouterTransformationRequestData[]) =>
  processDestinationIntegration(inputs, Integration, {});

type Result = Awaited<ReturnType<typeof run>>[number];

const jobIds = (result: Result) => result.metadata.map((m) => m.jobId);
const forJob = (results: Result[], jobId: number) =>
  results.find((result) => jobIds(result).includes(jobId));
const failure = (results: Result[], jobId: number) => {
  const result = forJob(results, jobId);
  return { statusCode: result?.statusCode, error: result?.error };
};
// The framework emits one request object per batch; the shared type also allows an array.
type BatchedRequest = {
  method: string;
  endpoint: string;
  endpointPath: string;
  headers: Record<string, unknown>;
  body: { JSON: { input: unknown[] } };
};
const requestOf = (result: Result | undefined) =>
  result?.batchedRequest as BatchedRequest | undefined;
const membership = (result: Result | undefined) => ({
  method: requestOf(result)?.method,
  endpoint: requestOf(result)?.endpoint,
  endpointPath: requestOf(result)?.endpointPath,
  headers: requestOf(result)?.headers,
  body: requestOf(result)?.body.JSON,
  jobIds: result ? jobIds(result) : [],
});

describe('MARKETO_AUDIENCE router transform', () => {
  beforeEach(() => {
    mockHttpGet.mockReset();
    mockHttpPost.mockReset();
    authCache.del('dest-1');
    mockHttpGet.mockResolvedValue(tokenResponse());
  });

  const unbatched = (jobId: number, identifiers: Record<string, unknown>, action = 'insert') =>
    ({
      ...row(jobId, identifiers, { action }),
      metadata: { jobId, dontBatch: true },
    }) as unknown as RouterTransformationRequestData;

  it('adds and removes lead IDs in separate requests without a lookup', async () => {
    const results = await run([
      row(1, { id: '101' }),
      row(2, { id: '202' }, { action: 'delete' }),
      row(3, { id: 303 }, { action: 'update' }),
    ]);

    expect(mockHttpPost).not.toHaveBeenCalled();
    expect(results.map(membership)).toEqual([
      {
        method: 'POST',
        endpoint: listEndpoint('1234'),
        endpointPath: ENDPOINT_PATH,
        headers: HEADERS,
        body: { input: [{ id: 101 }, { id: 303 }] },
        jobIds: [1, 3],
      },
      {
        method: 'DELETE',
        endpoint: listEndpoint('1234'),
        endpointPath: ENDPOINT_PATH,
        headers: HEADERS,
        body: { input: [{ id: 202 }] },
        jobIds: [2],
      },
    ]);
  });

  it('fetches one token per destination and reuses the cached one', async () => {
    await run([row(1, { id: '101' }), row(2, { id: '102' })]);
    await run([row(3, { id: '103' })]);

    expect(mockHttpGet).toHaveBeenCalledTimes(1);
    expect(mockHttpGet.mock.calls[0][0]).toBe(
      'https://123-ABC-456.mktorest.com/identity/oauth/token',
    );
    expect(mockHttpGet.mock.calls[0][1]).toEqual({
      params: {
        client_id: 'marketo-client-id',
        client_secret: 'marketo-client-secret',
        grant_type: 'client_credentials',
      },
    });
  });

  it('makes one identity call when it fails and fails every row with its error', async () => {
    mockHttpGet.mockResolvedValue({
      success: false,
      response: {
        response: {
          status: 401,
          data: { error: 'invalid_client', error_description: 'Bad client credentials' },
        },
      },
    });
    const inputs = Array.from({ length: 5 }, (_, i) => row(i + 1, { id: String(100 + i) }));

    const results = await run(inputs);

    expect(mockHttpGet).toHaveBeenCalledTimes(1);
    expect(results.map((result) => [jobIds(result), result.statusCode])).toEqual(
      [1, 2, 3, 4, 5].map((jobId) => [[jobId], 401]),
    );
  });

  it('retries every row when Marketo returns a token that expires now', async () => {
    mockHttpGet.mockResolvedValue(tokenResponse(0));

    const results = await run([row(1, { id: '101' })]);

    expect(failure(results, 1).statusCode).toBe(500);
  });

  it('keeps the identity response, and the token in it, out of the row error', async () => {
    mockHttpGet.mockResolvedValue(tokenResponse(0));

    const results = await run([row(1, { id: '101' })]);

    expect(failure(results, 1).error).not.toContain(TOKEN);
  });

  const tokenFailureCases = [
    {
      name: 'a DNS failure, which Node reports with no HTTP status',
      response: { success: false, response: { code: 'ENOTFOUND' } },
      expected: { statusCode: 500, error: 'Marketo access token could not be fetched' },
    },
    {
      name: 'a broken pipe, which Node reports with no HTTP status',
      response: { success: false, response: { code: 'EPIPE' } },
      expected: { statusCode: 500, error: 'Marketo access token could not be fetched' },
    },
    {
      name: 'an HTTP 503',
      response: { success: false, response: { response: { status: 503, data: '' } } },
      expected: { statusCode: 500, error: 'Marketo access token could not be fetched' },
    },
    {
      name: 'rejected client credentials',
      response: {
        success: false,
        response: {
          response: {
            status: 401,
            data: { error: 'invalid_client', error_description: 'Bad client credentials' },
          },
        },
      },
      expected: { statusCode: 401, error: 'Marketo rejected the access token request' },
    },
    {
      name: 'a rate-limit code whose message Marketo wrote',
      response: {
        success: true,
        response: {
          status: 200,
          data: {
            success: false,
            errors: [{ code: '606', message: 'Max rate limit exceeded for bob@acme.io' }],
          },
        },
      },
      expected: {
        statusCode: 429,
        error: 'Marketo rate limit reached on the access token request',
      },
    },
  ];

  it.each(tokenFailureCases)(
    'fails every row with a fixed reason when the token call fails: $name',
    async ({ response, expected }) => {
      mockHttpGet.mockResolvedValue(response);

      const results = await run([row(1, { id: '101' }), row(2, { email: 'bob@acme.io' })]);

      expect([failure(results, 1), failure(results, 2)]).toEqual([expected, expected]);
    },
  );

  const tokenNamed = (accessToken: string) => ({
    success: true,
    response: {
      status: 200,
      data: { access_token: accessToken, token_type: 'bearer', expires_in: 3599, scope: 'x' },
    },
  });

  it('fetches a new token for a dontBatch row after a 602 evicted the first one', async () => {
    mockHttpGet
      .mockResolvedValueOnce(tokenNamed('token-a'))
      .mockResolvedValueOnce(tokenNamed('token-b'));
    mockHttpPost.mockResolvedValue({
      success: true,
      response: {
        status: 200,
        data: { success: false, errors: [{ code: '602', message: 'Access token expired' }] },
      },
    });

    const results = await run([row(1, { email: 'bob@acme.io' }), unbatched(2, { id: '202' })]);

    expect(mockHttpGet).toHaveBeenCalledTimes(2);
    expect(membership(forJob(results, 2)).headers).toEqual({
      Authorization: 'Bearer token-b',
      'Content-Type': 'application/json',
    });
  });

  it('reuses the token for a dontBatch row when nothing evicted it', async () => {
    mockHttpGet.mockResolvedValue(tokenNamed('token-a'));

    const results = await run([row(1, { id: '101' }), unbatched(2, { id: '202' })]);

    expect(mockHttpGet).toHaveBeenCalledTimes(1);
    expect(membership(forJob(results, 2)).headers).toEqual({
      Authorization: 'Bearer token-a',
      'Content-Type': 'application/json',
    });
  });

  it('skips the token call when no row is deliverable', async () => {
    const results = await run([row(1, { id: 'abc' }), row(2, {})]);

    expect(mockHttpGet).not.toHaveBeenCalled();
    expect([failure(results, 1), failure(results, 2)]).toEqual([
      { statusCode: 400, error: 'Invalid Marketo Lead ID' },
      { statusCode: 400, error: 'No identifier mapped' },
    ]);
  });

  it('routes every row to the list of its own connection', async () => {
    const results = await run([
      row(1, { id: '101' }, { audienceId: '1234' }),
      row(2, { id: '102' }, { audienceId: 5678 }),
    ]);

    expect(results.map(membership)).toEqual([
      expect.objectContaining({ endpoint: listEndpoint('1234'), endpointPath: ENDPOINT_PATH }),
      expect.objectContaining({ endpoint: listEndpoint('5678'), endpointPath: ENDPOINT_PATH }),
    ]);
  });

  const rowErrorCases = [
    {
      name: 'a missing list ID',
      input: row(1, { id: '101' }, { audienceId: null }),
      expected: { statusCode: 400, error: 'Marketo static list ID is required' },
    },
    {
      name: 'a non-numeric list ID',
      input: row(1, { id: '101' }, { audienceId: 'list-a' }),
      expected: { statusCode: 400, error: 'Marketo static list ID is invalid' },
    },
    {
      name: 'a malformed lead ID next to a valid email',
      input: row(1, { id: '1.5', email: 'bob@acme.io' }),
      expected: { statusCode: 400, error: 'Invalid Marketo Lead ID' },
    },
    {
      name: 'an invalid email',
      input: row(1, { email: 'a,b@acme.io' }),
      expected: { statusCode: 400, error: 'Invalid email identifier' },
    },
    {
      name: 'no identifier',
      input: row(1, { id: null, email: '' }),
      expected: { statusCode: 400, error: 'No identifier mapped' },
    },
  ];

  it.each(rowErrorCases)('fails only the row with $name', async ({ input, expected }) => {
    const results = await run([input, row(2, { id: '202' })]);

    expect(failure(results, 1)).toEqual(expected);
    expect(membership(forJob(results, 2)).body).toEqual({ input: [{ id: 202 }] });
    expect(mockHttpPost).not.toHaveBeenCalled();
  });

  it('looks up distinct emails once and adds the leads it finds', async () => {
    mockHttpPost.mockResolvedValue(
      leadsResponse([
        { id: 501, email: 'bob@acme.io' },
        { id: 601, email: 'dan@acme.io' },
        { id: 602, email: 'dan@acme.io' },
      ]),
    );

    const results = await run([
      row(1, { id: '101' }),
      row(2, { email: ' Bob@Acme.io ' }),
      row(3, { email: 'bob@acme.io' }, { audienceId: '5678' }),
      row(4, { email: 'eve@acme.io' }),
      row(5, { email: 'dan@acme.io' }),
      row(6, { email: 'eve@acme.io' }, { action: 'delete' }),
    ]);

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(new URLSearchParams(mockHttpPost.mock.calls[0][1]).get('filterValues')).toBe(
      'bob@acme.io,eve@acme.io,dan@acme.io',
    );
    expect(membership(forJob(results, 1))).toEqual(
      expect.objectContaining({
        endpoint: listEndpoint('1234'),
        body: { input: [{ id: 101 }, { id: 501 }] },
        jobIds: [1, 2],
      }),
    );
    expect(membership(forJob(results, 3))).toEqual(
      expect.objectContaining({ endpoint: listEndpoint('5678'), body: { input: [{ id: 501 }] } }),
    );
    expect([failure(results, 4), failure(results, 5), failure(results, 6)]).toEqual([
      { statusCode: 400, error: 'Lead not found in Marketo' },
      {
        statusCode: 400,
        error:
          'Email matches more than one Marketo lead; merge the duplicates in Marketo or map the Marketo Lead ID',
      },
      {
        statusCode: 400,
        error: 'Removal could not be confirmed: Marketo lead not found by email',
      },
    ]);
  });

  it('fails email rows with the classified lookup error and keeps lead-ID rows', async () => {
    mockHttpPost.mockResolvedValue({
      success: true,
      response: {
        status: 200,
        data: { success: false, errors: [{ code: '606', message: 'Max rate limit exceeded' }] },
      },
    });

    const results = await run([row(1, { email: 'bob@acme.io' }), row(2, { id: '202' })]);

    expect(failure(results, 1)).toEqual({
      statusCode: 429,
      error: 'Marketo rate limit reached (code 606)',
    });
    expect(membership(forJob(results, 2)).body).toEqual({ input: [{ id: 202 }] });
  });

  const crossCallConflicts = [
    {
      name: 'a batched insert and a dontBatch delete',
      inputs: () => [row(1, { id: '101' }), unbatched(2, { id: '101' }, 'delete')],
    },
    {
      name: 'two dontBatch rows',
      inputs: () => [unbatched(1, { id: '101' }), unbatched(2, { id: '101' }, 'delete')],
    },
  ];

  it.each(crossCallConflicts)(
    'fails both rows of a lead added and removed across transform calls: $name',
    async ({ inputs }) => {
      const results = await run([...inputs(), row(3, { id: '102' })]);

      const conflict = {
        statusCode: 400,
        error: 'Conflicting membership operations for Marketo lead',
      };
      expect([failure(results, 1), failure(results, 2)]).toEqual([conflict, conflict]);
      expect(results.filter((result) => result.batchedRequest).map(membership)).toEqual([
        expect.objectContaining({ body: { input: [{ id: 102 }] }, jobIds: [3] }),
      ]);
      expect(results.flatMap(jobIds).sort()).toEqual([1, 2, 3]);
    },
  );

  it('fails every row of a lead that is both added and removed on one list', async () => {
    mockHttpPost.mockResolvedValue(leadsResponse([{ id: 101, email: 'bob@acme.io' }]));

    const results = await run([
      row(1, { id: '101' }),
      row(2, { email: 'bob@acme.io' }, { action: 'delete' }),
      row(3, { id: '101' }, { audienceId: '5678', action: 'delete' }),
      row(4, { id: '102' }),
    ]);

    const conflict = {
      statusCode: 400,
      error: 'Conflicting membership operations for Marketo lead',
    };
    expect([failure(results, 1), failure(results, 2)]).toEqual([conflict, conflict]);
    expect(membership(forJob(results, 3))).toEqual(
      expect.objectContaining({ method: 'DELETE', body: { input: [{ id: 101 }] } }),
    );
    expect(membership(forJob(results, 4)).body).toEqual({ input: [{ id: 102 }] });
  });

  const repeatedLeadCases = [
    {
      name: 'the same lead ID twice',
      inputs: () => [row(1, { id: '101' }), row(2, { id: 101 }), row(3, { id: '102' })],
    },
    {
      name: 'a lead ID and an email that resolves to the same lead',
      inputs: () => [
        row(1, { id: '101' }),
        row(2, { email: 'bob@acme.io' }),
        row(3, { id: '102' }),
      ],
    },
    {
      name: 'the same email twice',
      inputs: () => [
        row(1, { email: 'bob@acme.io' }),
        row(2, { email: 'Bob@acme.io' }),
        row(3, { id: '102' }),
      ],
    },
  ];

  it.each(repeatedLeadCases)(
    'sends each copy of a repeated lead in its own request: $name',
    async ({ inputs }) => {
      mockHttpPost.mockResolvedValue(leadsResponse([{ id: 101, email: 'bob@acme.io' }]));

      const results = await run(inputs());

      expect(results.map((result) => membership(result))).toEqual([
        expect.objectContaining({ method: 'POST', body: { input: [{ id: 101 }, { id: 102 }] } }),
        expect.objectContaining({ method: 'POST', body: { input: [{ id: 101 }] } }),
      ]);
      expect(results.map(jobIds)).toEqual([[1, 3], [2]]);
    },
  );

  it('keeps a repeated lead on another list or operation in the same request as the rest', async () => {
    const results = await run([
      row(1, { id: '101' }),
      row(2, { id: '101' }, { audienceId: '5678' }),
      row(3, { id: '102' }, { audienceId: '5678' }),
    ]);

    expect(results.map(jobIds)).toEqual([[1], [2, 3]]);
  });

  it('logs the name and stack frames of an unexpected pre-stage error, never its message', async () => {
    const lookup = jest
      .spyOn(lookupModule, 'lookupLeadsByEmail')
      .mockRejectedValueOnce(new Error('lookup broke for bob@acme.io\nand for eve@acme.io'));
    const logError = jest.spyOn(logger, 'error').mockImplementation(() => {});

    const results = await run([row(1, { id: '101' }), row(2, { email: 'bob@acme.io' })]);

    const logged = [...logError.mock.calls];
    lookup.mockRestore();
    logError.mockRestore();
    expect(logged).toEqual([
      [
        'Marketo Audience pre-stage failed',
        {
          destType: 'MARKETO_AUDIENCE',
          destinationId: 'dest-1',
          workspaceId: 'ws-1',
          errorName: 'Error',
          stack: expect.stringMatching(/^\s+at /),
        },
      ],
    ]);
    expect(JSON.stringify(logged)).not.toMatch(/acme\.io|lookup broke/);
    expect([failure(results, 1), failure(results, 2)]).toEqual([
      { statusCode: 500, error: 'Marketo Audience could not prepare the row' },
      { statusCode: 500, error: 'Marketo Audience could not prepare the row' },
    ]);
  });

  it('keeps a message line that looks like a stack frame out of the log', async () => {
    const lookup = jest
      .spyOn(lookupModule, 'lookupLeadsByEmail')
      .mockRejectedValueOnce(new Error('lookup bug for\n    at alice@example.com'));
    const logError = jest.spyOn(logger, 'error').mockImplementation(() => {});

    await run([row(1, { email: 'bob@acme.io' })]);

    const logged = [...logError.mock.calls];
    lookup.mockRestore();
    logError.mockRestore();
    expect(logged).toHaveLength(1);
    expect(logged[0][1]).toEqual(
      expect.objectContaining({ stack: expect.stringMatching(/^\s+at /) }),
    );
    expect(JSON.stringify(logged)).not.toContain('alice@example.com');
  });

  it('fails each pending row with a typed error when the pre-stage throws unexpectedly', async () => {
    const lookup = jest
      .spyOn(lookupModule, 'lookupLeadsByEmail')
      .mockRejectedValueOnce(new Error('boom'));

    const results = await run([
      row(1, { id: 'abc' }),
      row(2, { id: '101' }),
      row(3, { email: 'bob@acme.io' }),
    ]);

    lookup.mockRestore();
    expect([failure(results, 1), failure(results, 2), failure(results, 3)]).toEqual([
      { statusCode: 400, error: 'Invalid Marketo Lead ID' },
      { statusCode: 500, error: 'Marketo Audience could not prepare the row' },
      { statusCode: 500, error: 'Marketo Audience could not prepare the row' },
    ]);
  });

  it('splits 301 additions to one list into 300 + 1', async () => {
    const inputs = Array.from({ length: 301 }, (_, i) => row(i + 1, { id: String(i + 1) }));

    const results = await run(inputs);

    expect(results.map((result) => requestOf(result)?.body.JSON.input.length)).toEqual([300, 1]);
  });

  const validationCases = [
    {
      name: 'a non-record message',
      input: row(1, { id: '101' }, { type: 'track' }),
      errorMatch: /^message\.type: /,
    },
    {
      name: 'an unknown action',
      input: row(1, { id: '101' }, { action: 'upsert' }),
      errorMatch: /^message\.action: /,
    },
    {
      name: 'an accountId that is not a Munchkin ID',
      input: row(1, { id: '101' }, { config: { accountId: 'evil.example/x?' } }),
      errorMatch: /^destination\.Config\.accountId: /,
    },
    {
      name: 'a missing client secret',
      input: row(1, { id: '101' }, { config: { clientSecret: '' } }),
      errorMatch: /^destination\.Config\.clientSecret: /,
    },
  ];

  it.each(validationCases)('rejects $name before any call', async ({ input, errorMatch }) => {
    const results = await run([input]);

    expect(results).toHaveLength(1);
    expect(results[0].statusCode).toBe(400);
    expect(results[0].error).toMatch(errorMatch);
    expect(mockHttpGet).not.toHaveBeenCalled();
  });
});
