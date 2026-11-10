import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import { Integration } from './routerTransform';
import { requestFieldExpression } from './utils';
import { prepareProxyRequest } from '../../../adapters/network';
import type { RouterTransformationRequestData } from '../../../types';

type NativeResponse = {
  batchedRequest: {
    endpoint: string;
    headers: Record<string, unknown>;
    body: { JSON_ARRAY: { batch: string } };
  };
  metadata: { jobId: number }[];
};

const destination = {
  ID: 'http-test',
  Name: 'HTTP',
  Enabled: true,
  WorkspaceID: 'ws-http',
  Transformations: [],
  version: 2,
  DestinationDefinition: { ID: 'http', Name: 'HTTP', DisplayName: 'HTTP', Config: {} },
  Config: {
    apiUrl: 'https://example.org/events',
    method: 'POST',
    maxBatchSize: 2,
    requestBodyTemplate: '{ "payload": [$$.events.{ "id": id, "nested": { "value": value } }] }',
    headers: [{ to: '$.X-Token', from: 'static-token' }],
    pathParams: [{ path: '$.id' }],
  },
};

const input = (id: string, jobId: number): RouterTransformationRequestData => ({
  message: { type: 'track' as const, id, value: jobId },
  metadata: {
    jobId,
    workspaceId: 'ws-http',
    sourceId: 'src',
    messageId: `msg-${jobId}`,
    sourceType: 'js',
    sourceCategory: 'web',
    destinationId: 'http-test',
    destinationType: 'HTTP',
  },
  destination,
});

describe('HTTP v2 native router', () => {
  it.each([
    { value: 'a"b', expression: '"a\\"b"' },
    { value: '$.id', expression: '$$.message.id' },
    { value: '$$.message.id', expression: '$$.message.id' },
    { value: 'price$usd', expression: '"price$usd"' },
    { value: "'val1'", expression: "'val1'" },
  ])('quotes or retains $value', ({ value, expression }) => {
    expect(requestFieldExpression(value)).toBe(expression);
  });

  it('defaults method to POST and batches up to 5000 when unset', async () => {
    const { method, maxBatchSize, ...config } = destination.Config;
    const events = [input('1', 1), input('2', 2), input('3', 3)].map((event) => ({
      ...event,
      destination: { ...destination, Config: { ...config, pathParams: [] } },
    }));
    const responses = await processDestinationIntegration(events, Integration, {});
    expect(responses).toHaveLength(1);
    expect(responses[0]).toMatchObject({
      batchedRequest: { method: 'POST' },
      metadata: [{ jobId: 1 }, { jobId: 2 }, { jobId: 3 }],
    });
  });

  it.each([
    { config: { authenticationEnabled: true }, message: 'rudderAccountId' },
    {
      config: { headers: [{ to: '$.a.b[0]', from: 'x' }] },
      message: 'Invalid request field name: $.a.b[0]',
    },
  ])('rejects invalid config per job: $message', async ({ config, message }) => {
    const event = {
      ...input('1', 1),
      destination: { ...destination, Config: { ...destination.Config, ...config } },
    };
    const [response] = await processDestinationIntegration([event], Integration, {});
    expect(response).toMatchObject({ statusCode: 400, metadata: [{ jobId: 1 }] });
    expect(response.error).toContain(message);
  });

  it('resolves request fields and isolates an invalid path from successful requests', async () => {
    const results = await processDestinationIntegration(
      [input('ok/1', 1), input('ok2', 2), input(undefined as unknown as string, 3)],
      Integration,
      {},
    );
    expect(results.filter((result) => result.error)).toHaveLength(1);
    const successes = results.filter((result) => result.batched) as unknown as NativeResponse[];
    expect(successes).toHaveLength(2);
    expect(successes[0].batchedRequest.endpoint).toBe('https://example.org/events/ok%2F1');
    expect(successes[0].batchedRequest.headers).toMatchObject({ 'X-Token': 'static-token' });
    expect(JSON.parse(successes[0].batchedRequest.body.JSON_ARRAY.batch)).toEqual({
      payload: [{ id: 'ok/1', nested: { value: 1 } }],
    });
  });

  const accountCases = [
    {
      name: 'basic auth',
      definition: 'DESTINATION_HTTP_BASIC_AUTH',
      options: { username: 'user' },
      secret: { password: 'pass' },
      expected: { Authorization: 'Basic dXNlcjpwYXNz' },
    },
    {
      name: 'basic auth with an empty password',
      definition: 'DESTINATION_HTTP_BASIC_AUTH',
      options: { username: 'user' },
      secret: { password: '' },
      expected: { Authorization: 'Basic dXNlcjo=' },
    },
    {
      name: 'basic auth with no password',
      definition: 'DESTINATION_HTTP_BASIC_AUTH',
      options: { username: 'user' },
      secret: {},
      expected: { Authorization: 'Basic dXNlcjo=' },
    },
    {
      name: 'bearer token',
      definition: 'DESTINATION_HTTP_BEARER_TOKEN',
      options: {},
      secret: { bearerToken: 'secret' },
      expected: { Authorization: 'Bearer secret' },
    },
    {
      name: 'API key',
      definition: 'DESTINATION_HTTP_API_KEY',
      options: { apiKeyName: 'X-Key' },
      secret: { apiKeyValue: 'secret' },
      expected: { 'X-Key': 'secret' },
    },
    {
      name: 'API key in the Content-Type header',
      definition: 'DESTINATION_HTTP_API_KEY',
      options: { apiKeyName: 'Content-Type' },
      secret: { apiKeyValue: 'secret' },
      expected: { 'Content-Type': 'secret' },
    },
    {
      name: 'API key in a lowercase content-type header',
      definition: 'DESTINATION_HTTP_API_KEY',
      options: { apiKeyName: 'content-type' },
      secret: { apiKeyValue: 'secret' },
      expected: { 'content-type': 'secret' },
    },
  ];

  it.each(accountCases)(
    'adds $name headers from the linked account',
    async ({ definition, options, secret, expected }) => {
      const account = { id: 'account-id', accountDefinitionName: definition, options, secret };
      const event = input('one', 1);
      event.destination = {
        ...destination,
        Config: { ...destination.Config, authenticationEnabled: true, rudderAccountId: account.id },
        deliveryAccount: account,
      };
      const [response] = await processDestinationIntegration([event], Integration, {});
      const headers = (response as unknown as NativeResponse).batchedRequest.headers;
      expect(headers).toMatchObject(expected);
      if (Object.keys(expected).some((name) => name.toLowerCase() === 'content-type')) {
        expect(
          Object.keys(headers).filter((name) => name.toLowerCase() === 'content-type'),
        ).toHaveLength(1);
      }
    },
  );

  it.each([
    { name: 'missing account', account: undefined, message: 'deliveryAccount is missing' },
    {
      name: 'incompatible account',
      account: {
        accountDefinitionName: 'DESTINATION_CUSTOM_AUDIENCE_API_KEY',
        options: {},
        secret: {},
      },
      message: 'unsupported accountDefinitionName',
    },
    {
      name: 'missing basic username',
      account: {
        accountDefinitionName: 'DESTINATION_HTTP_BASIC_AUTH',
        options: {},
        secret: { password: '' },
      },
      message: 'options.username',
    },
    {
      name: 'invalid basic password',
      account: {
        accountDefinitionName: 'DESTINATION_HTTP_BASIC_AUTH',
        options: { username: 'user' },
        secret: { password: null },
      },
      message: 'secret.password',
    },
    {
      name: 'missing bearer token',
      account: { accountDefinitionName: 'DESTINATION_HTTP_BEARER_TOKEN', options: {}, secret: {} },
      message: 'secret.bearerToken',
    },
    {
      name: 'missing API key name',
      account: {
        accountDefinitionName: 'DESTINATION_HTTP_API_KEY',
        options: {},
        secret: { apiKeyValue: 'value' },
      },
      message: 'options.apiKeyName',
    },
    {
      name: 'missing API key value',
      account: {
        accountDefinitionName: 'DESTINATION_HTTP_API_KEY',
        options: { apiKeyName: 'X-Key' },
        secret: {},
      },
      message: 'secret.apiKeyValue',
    },
  ])('rejects $name with a configuration error', async ({ account, message }) => {
    const event = input('one', 1);
    event.destination = {
      ...destination,
      Config: { ...destination.Config, authenticationEnabled: true, rudderAccountId: 'account-id' },
      deliveryAccount: account && { id: 'account-id', ...account },
    };
    const [response] = await processDestinationIntegration([event], Integration, {});
    expect(response).toMatchObject({ statusCode: 400, metadata: [{ jobId: 1 }] });
    expect(response.error).toContain(message);
    expect(response.statTags).toMatchObject({ errorType: 'configuration' });
  });

  it('ignores an attached account and stale inline credentials when authentication is disabled', async () => {
    const event = input('one', 1);
    event.destination = {
      ...destination,
      Config: {
        ...destination.Config,
        authenticationEnabled: false,
        auth: 'bearerTokenAuth',
        bearerToken: 'stale',
      },
      deliveryAccount: {
        id: 'account-id',
        accountDefinitionName: 'DESTINATION_HTTP_BEARER_TOKEN',
        options: {},
        secret: { bearerToken: 'secret' },
      },
    };
    const [response] = await processDestinationIntegration([event], Integration, {});
    expect((response as unknown as NativeResponse).batchedRequest.headers).toEqual({
      'X-Token': 'static-token',
      'Content-Type': 'application/json',
    });
  });

  it('rejects an undefined body instead of shipping a non-JSON request', async () => {
    const result = await processDestinationIntegration(
      [
        {
          ...input('ok', 1),
          destination: {
            ...destination,
            Config: {
              ...destination.Config,
              requestBodyTemplate: '$$.notPresent',
              pathParams: [],
            },
          },
        },
      ],
      Integration,
      {},
    );
    expect(result).toMatchObject([
      { statusCode: 400, error: 'Request body template did not produce JSON' },
    ]);
  });

  it('returns per-event errors for an invalid request field and does not send its message', async () => {
    const events = [input('1', 1), input('bad', 2), input('3', 3)].map((event) => ({
      ...event,
      destination: {
        ...destination,
        Config: {
          ...destination.Config,
          pathParams: [],
          queryParams: [{ to: 'count', from: '$number($$.message.id)' }],
          requestBodyTemplate: '$$.events',
        },
      },
    }));
    const responses = await processDestinationIntegration(events, Integration, {});
    expect(responses.find((r) => r.error)?.error).toContain('Request field evaluation failed');
    const successful = responses.filter((r) => r.batched) as unknown as NativeResponse[];
    expect(successful.map((r) => r.metadata[0].jobId)).toEqual([1, 3]);
    expect(successful.map((r) => JSON.parse(r.batchedRequest.body.JSON_ARRAY.batch))).toEqual([
      [events[0].message],
      [events[2].message],
    ]);
  });

  it('groups matching request fields, chunks at the configured size, and keeps distinct fields apart', async () => {
    const settings = {
      ...destination.Config,
      pathParams: [],
      headers: [{ to: 'X-Group', from: '$.group' }],
      queryParams: [{ to: '$.token', from: '$.group' }],
      requestBodyTemplate: '$$.events',
    };
    const events = [1, 2, 3, 4].map((id) => ({
      ...input(String(id), id),
      message: { type: 'track' as const, id: String(id), group: id === 4 ? 'B' : 'A' },
      destination: { ...destination, Config: settings },
    }));
    const responses = await processDestinationIntegration(events, Integration, {});
    const batches = responses as unknown as NativeResponse[];
    expect(
      batches.map((r) => ({
        jobIds: r.metadata.map((m) => m.jobId),
        events: JSON.parse(r.batchedRequest.body.JSON_ARRAY.batch),
        group: r.batchedRequest.headers['X-Group'],
      })),
    ).toEqual([
      { jobIds: [1, 2], events: events.slice(0, 2).map((e) => e.message), group: 'A' },
      { jobIds: [3], events: [events[2].message], group: 'A' },
      { jobIds: [4], events: [events[3].message], group: 'B' },
    ]);
  });

  it('preserves migrated literal values and bracketed query names', async () => {
    const migrated = {
      ...input('one', 1),
      destination: {
        ...destination,
        Config: {
          ...destination.Config,
          pathParams: [],
          headers: [{ to: '$.X-Test', from: "'val1'" }],
          queryParams: [{ to: "$['q1']", from: "'val2'" }],
        },
      },
    };
    const responses = await processDestinationIntegration([migrated], Integration, {});
    const request = (responses[0] as unknown as NativeResponse)
      .batchedRequest as NativeResponse['batchedRequest'] & { params: Record<string, unknown> };
    expect(request.headers['X-Test']).toBe('val1');
    expect(request.params).toEqual({ q1: 'val2' });
  });

  it('drops mapped headers whose source is missing or null, like v1', async () => {
    const config = {
      ...destination.Config,
      pathParams: [],
      headers: [
        { to: 'x-missing', from: '$.notThere' },
        { to: 'x-null', from: '$.nothing' },
        { to: 'x-num', from: '$.value' },
      ],
    };
    const withNull = (id: string, jobId: number, value: unknown) => ({
      ...input(id, jobId),
      message: { type: 'track' as const, id, nothing: null, value },
      destination: { ...destination, Config: config },
    });
    const responses = await processDestinationIntegration(
      [withNull('a', 1, 'str'), withNull('b', 2, 5)],
      Integration,
      {},
    );
    const delivered = responses.find((r) => r.metadata[0].jobId === 1) as unknown as NativeResponse;
    expect(delivered.batchedRequest.headers).toEqual({
      'x-num': 'str',
      'Content-Type': 'application/json',
    });
    expect(responses.find((r) => r.metadata[0].jobId === 2)).toMatchObject({
      statusCode: 400,
      error: 'Header "x-num" must resolve to a string',
    });
  });

  it('fails only the body chunk with a bad cast', async () => {
    const events = [input('1', 1), input('bad', 2), input('3', 3)].map((event) => ({
      ...event,
      destination: {
        ...destination,
        Config: {
          ...destination.Config,
          pathParams: [],
          maxBatchSize: 1,
          requestBodyTemplate: '{ "id": $number($$.events.id) }',
        },
      },
    }));
    const responses = await processDestinationIntegration(events, Integration, {});
    expect(responses.filter((r) => r.error).map((r) => r.metadata[0].jobId)).toEqual([2]);
    expect(responses.filter((r) => r.batched).map((r) => r.metadata[0].jobId)).toEqual([1, 3]);
  });

  it.each([
    { template: '$$.events', expected: [{ type: 'track', id: 'one', value: 1 }] },
    {
      template: '{ "events": $$.events }',
      expected: { events: [{ type: 'track', id: 'one', value: 1 }] },
    },
    {
      template: '{ "data": { "items": [$$.events.{ "id": id }] } }',
      expected: { data: { items: [{ id: 'one' }] } },
    },
  ])('delivers the evaluated root without wrapping it twice', async ({ template, expected }) => {
    const result = await processDestinationIntegration(
      [
        {
          ...input('one', 1),
          destination: {
            ...destination,
            Config: { ...destination.Config, pathParams: [], requestBodyTemplate: template },
          },
        },
      ],
      Integration,
      {},
    );
    const output = (result[0] as unknown as NativeResponse).batchedRequest;
    expect(JSON.parse(output.body.JSON_ARRAY.batch)).toEqual(expected);
    const wire = await prepareProxyRequest(output);
    expect(wire.data).toBe(JSON.stringify(expected));
  });
});
