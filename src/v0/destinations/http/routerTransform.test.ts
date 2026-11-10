import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import { Integration } from './routerTransform';
import { requestFieldExpression } from './utils';
import { prepareProxyRequest } from '../../../adapters/network';
import type { RouterTransformationRequestData } from '../../../types';

type NativeResponse = {
  batchedRequest: {
    endpoint: string;
    headers: Record<string, unknown>;
    body: {
      JSON_ARRAY: { batch: string };
      XML: { payload?: string };
      FORM: Record<string, string>;
    };
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

  const withFormat = (config: Record<string, unknown>, ids = ['one']) =>
    ids.map((id, i) => ({
      ...input(id, i + 1),
      destination: {
        ...destination,
        Config: {
          ...destination.Config,
          pathParams: [],
          headers: [{ to: 'Content-Type', from: 'text/plain' }],
          ...config,
        },
      },
    }));

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
    { config: { auth: 'basicAuth' }, message: 'Username is required for Basic Authentication' },
    {
      config: { auth: 'bearerTokenAuth' },
      message: 'Token is required for Bearer Token Authentication',
    },
    { config: { auth: 'apiKeyAuth', apiKeyName: 'X-Key' }, message: 'API key value is required' },
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

  it.each([
    {
      auth: 'basicAuth',
      credentials: { username: 'user', password: 'pass' },
      expected: { Authorization: 'Basic dXNlcjpwYXNz' },
    },
    {
      auth: 'bearerTokenAuth',
      credentials: { bearerToken: 'secret' },
      expected: { Authorization: 'Bearer secret' },
    },
    {
      auth: 'apiKeyAuth',
      credentials: { apiKeyName: 'X-Key', apiKeyValue: 'secret' },
      expected: { 'X-Key': 'secret' },
    },
  ])('adds $auth headers', async ({ auth, credentials, expected }) => {
    const result = await processDestinationIntegration(
      [
        {
          ...input('one', 1),
          destination: { ...destination, Config: { ...destination.Config, auth, ...credentials } },
        },
      ],
      Integration,
      {},
    );
    expect((result[0] as unknown as NativeResponse).batchedRequest.headers).toMatchObject(expected);
  });

  const serializeEdgeCases = async (format: string, requestBodyTemplate: string) => {
    const events = withFormat({ format, requestBodyTemplate });
    events[0].message = {
      ...events[0].message,
      'first name': 'Ada',
      '1abc': 1,
      empty: '',
      absent: null,
      nested: { a: 1 },
      count: 1,
      active: true,
    };
    const [response] = await processDestinationIntegration(events, Integration, {});
    return (response as unknown as NativeResponse).batchedRequest;
  };

  it('serializes XML with sanitized keys and nulls dropped, overriding mapped Content-Type', async () => {
    const request = await serializeEdgeCases('XML', '{"Envelope": [$$.events][0]}');
    expect(request.headers['Content-Type']).toBe('application/xml');
    expect(request.body.XML.payload).toContain(
      '<Envelope><type>track</type><id>one</id><value>1</value><first_name>Ada</first_name><_abc>1</_abc><empty/>',
    );
    expect(request.body.XML.payload).not.toContain('absent');
    expect(request.body.JSON_ARRAY).toEqual({});
  });

  it('serializes FORM with stringified first-level values and nulls dropped, overriding mapped Content-Type', async () => {
    const request = await serializeEdgeCases('FORM', '[$$.events][0]');
    expect(request.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    expect(request.body.FORM).toMatchObject({
      'first name': 'Ada',
      '1abc': '1',
      empty: '',
      nested: '{"a":1}',
      count: '1',
      active: 'true',
    });
    expect(request.body.FORM.absent).toBeUndefined();
    expect(request.body.JSON_ARRAY).toEqual({});
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

  it.each([
    { format: 'XML', template: '{"root": {}}' },
    { format: 'FORM', template: '{}' },
  ])('sends an empty $format body without inventing a payload', async ({ format, template }) => {
    const [result] = await processDestinationIntegration(
      withFormat({ format, requestBodyTemplate: template }),
      Integration,
      {},
    );
    expect((result as unknown as NativeResponse).batchedRequest.body[format]).toEqual({});
  });

  it('sanitizes the XML root key like nested keys', async () => {
    const [result] = await processDestinationIntegration(
      withFormat({
        format: 'XML',
        requestBodyTemplate: '{"1 my root": [$$.events.{"id": id}][0]}',
      }),
      Integration,
      {},
    );
    expect((result as unknown as NativeResponse).batchedRequest.body.XML.payload).toBe(
      '<?xml version="1.0" encoding="UTF-8"?><__my_root><id>one</id></__my_root>',
    );
  });

  const notObject = 'Request body template must produce an object for XML/FORM format';
  const notOneRoot =
    'Request body template must produce exactly one top-level key holding an object for XML format; that key becomes the root element';
  it.each([
    ...['XML', 'FORM'].flatMap((format) =>
      ['$$.missing', '1', 'null', '$$.events'].map((template) => ({
        format,
        template,
        error: notObject,
      })),
    ),
    ...['{}', '{"": {"a": 1}}', '{"a": {}, "b": {}}', '{"root": 1}', '{"root": [$$.events]}'].map(
      (template) => ({ format: 'XML', template, error: notOneRoot }),
    ),
  ])('rejects $format result from $template', async ({ format, template, error }) => {
    const [result] = await processDestinationIntegration(
      withFormat({ format, requestBodyTemplate: template }),
      Integration,
      {},
    );
    expect(result).toMatchObject({ statusCode: 400, error });
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
