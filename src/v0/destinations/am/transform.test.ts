import { InstrumentationError } from '@rudderstack/integrations-lib';
import { gunzipSync } from 'zlib';

const { process: transformEvent, processRouterDest } = require('./transform');
const { getFormData, prepareProxyRequest } = require('../../../adapters/network');

const destination = {
  ID: '2HMA5LQopuVYs8sCJEvXYYim38M',
  Name: 'Amplitude',
  DestinationDefinition: { Name: 'AM' },
  Config: {
    apiKey: 'test-api-key',
    residencyServer: 'standard',
  },
  Enabled: true,
};

const buildIdentify = (traits) => ({
  message: {
    type: 'identify',
    userId: 'user-1',
    anonymousId: 'anon-1',
    context: { traits },
    timestamp: '2026-09-02T17:51:13.000Z',
  },
  destination,
});

describe('AM userPropertiesHandler - trait keys that set-value refuses to write', () => {
  // Reproduces the production crash reported by Bugsnag: a trait literally named
  // `constructor` was passed straight into `set-value`, which threw
  // `Cannot set unsafe key: "constructor"`. That plain Error was classified as a
  // retryable 500, so the job was retried until its TTL even though the payload could
  // never succeed. It is now an InstrumentationError, which aborts as a 4xx.
  it.each(['constructor', '__proto__', 'prototype'])(
    'raises an InstrumentationError for a trait named "%s"',
    (reservedKey) => {
      const input = buildIdentify({ email: 'a@b.com', [reservedKey]: 'boom' });

      expect(() => transformEvent(input)).toThrow(InstrumentationError);
    },
  );

  it('reports the offending key path in the error message', () => {
    const input = buildIdentify({ email: 'a@b.com', constructor: 'boom' });

    expect(() => transformEvent(input)).toThrow(/user_properties\.constructor/);
    expect(() => transformEvent(input)).toThrow(/Cannot set unsafe key: "constructor"/);
  });

  it('raises an InstrumentationError for a nested reserved key such as "address.constructor"', () => {
    const input = buildIdentify({ email: 'a@b.com', 'address.constructor': 'boom' });

    expect(() => transformEvent(input)).toThrow(InstrumentationError);
  });

  it('raises an InstrumentationError for a group call with a reserved group_type', () => {
    const input = {
      message: {
        type: 'group',
        userId: 'user-1',
        groupId: 'group-1',
        integrations: {
          Amplitude: { groups: { group_type: 'constructor', group_value: 'acme' } },
        },
        timestamp: '2026-09-02T17:51:13.000Z',
      },
      destination,
    };

    expect(() => transformEvent(input)).toThrow(InstrumentationError);
  });

  it('leaves ordinary traits alone', () => {
    const input = buildIdentify({ email: 'a@b.com', plan: 'pro', tier: 'gold' });

    const [{ body }] = transformEvent(input);
    const [event] = body.JSON.events;

    expect(event.user_properties).toMatchObject({
      email: 'a@b.com',
      plan: 'pro',
      tier: 'gold',
    });
  });

  it('does not pollute Object.prototype via a __proto__ trait', () => {
    // JSON.parse creates `__proto__` as a real own property rather than invoking the
    // setter, which is exactly how such a trait reaches us off the wire.
    const traits = JSON.parse('{"email":"a@b.com","__proto__":{"polluted":"yes"}}');

    expect(() => transformEvent(buildIdentify(traits))).toThrow(InstrumentationError);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});

describe('AM router delivery gzip', () => {
  const flags = {
    '2/httpapi': 'AM_GZIP_HTTPAPI_ENABLED_WORKSPACE_IDS',
    batch: 'AM_GZIP_BATCH_ENABLED_WORKSPACE_IDS',
    groupidentify: 'AM_GZIP_GROUPIDENTIFY_ENABLED_WORKSPACE_IDS',
    usermap: 'AM_GZIP_USERMAP_ENABLED_WORKSPACE_IDS',
  };
  const originalFlags = Object.fromEntries(
    Object.values(flags).map((flag) => [flag, process.env[flag]]),
  );
  const workspaceId = 'am-gzip-workspace';
  const input = (jobId: number, message: Record<string, unknown>, workspace = workspaceId) => ({
    message: {
      userId: 'am-user-12345',
      anonymousId: 'am-device-12345',
      timestamp: '2026-09-02T17:51:13.000Z',
      ...message,
    },
    destination,
    metadata: { jobId, userId: 'am-user-12345', workspaceId: workspace },
  });
  const track = (jobId: number, workspace = workspaceId) =>
    input(jobId, { type: 'track', event: `Test ${jobId}` }, workspace);
  const group = () =>
    input(1, {
      type: 'group',
      traits: { email: 'company', age: 'acme' },
      integrations: { Amplitude: { groups: { group_type: 'company', group_value: 'acme' } } },
    });
  const alias = () => input(1, { type: 'alias', previousId: 'old-user-12345' });
  const run = (events: ReturnType<typeof input>[]) => processRouterDest(events, {});

  beforeEach(() => Object.values(flags).forEach((flag) => delete process.env[flag]));

  afterEach(() => {
    Object.entries(originalFlags).forEach(([flag, value]) => {
      if (value === undefined) delete process.env[flag];
      else process.env[flag] = value;
    });
  });

  const endpointCases = [
    { endpoint: '2/httpapi', flag: flags['2/httpapi'], events: [track(1)], format: 'JSON' },
    { endpoint: 'batch', flag: flags.batch, events: [track(1), track(2)], format: 'JSON' },
    { endpoint: 'groupidentify', flag: flags.groupidentify, events: [group()], format: 'FORM' },
    { endpoint: 'usermap', flag: flags.usermap, events: [alias()], format: 'FORM' },
  ];

  it.each(endpointCases)(
    'converts $endpoint only for its enabled workspace',
    async ({ endpoint, flag, events, format }) => {
      const baseline = await run(structuredClone(events));
      process.env[flag] = `other-workspace, ${workspaceId}`;
      const enabled = await run(structuredClone(events));
      const before = baseline.flatMap(({ batchedRequest }: any) =>
        Array.isArray(batchedRequest) ? batchedRequest : [batchedRequest],
      );
      const after = enabled.flatMap(({ batchedRequest }: any) =>
        Array.isArray(batchedRequest) ? batchedRequest : [batchedRequest],
      );
      const index = before.findIndex(({ endpointPath }: any) => endpointPath === endpoint);
      const originalRequest = before[index];
      const zippedRequest = after[index];
      const payload =
        format === 'JSON'
          ? JSON.stringify(originalRequest.body.JSON)
          : getFormData(originalRequest.body.FORM).toString();

      expect(zippedRequest).toEqual({
        ...originalRequest,
        body: { ...originalRequest.body, [format]: {}, GZIP: { payload } },
        headers:
          format === 'FORM'
            ? { ...originalRequest.headers, 'Content-Type': 'application/x-www-form-urlencoded' }
            : originalRequest.headers,
      });
      expect(
        Object.entries(zippedRequest.body).filter(
          ([, value]) => Object.keys(value as object).length,
        ),
      ).toHaveLength(1);
      if (format === 'FORM') {
        const key = endpoint === 'usermap' ? 'mapping' : 'identification';
        expect(decodeURIComponent(payload)).toContain(`${key}=[{`);
      }
      expect(after.filter((_: any, i: number) => i !== index)).toEqual(
        before.filter((_: any, i: number) => i !== index),
      );
      if (endpoint === 'batch') {
        expect(enabled).toHaveLength(1);
        expect(enabled[0].batched).toBe(true);
        expect(enabled[0].metadata).toHaveLength(2);
        expect(JSON.parse(payload).events).toHaveLength(2);
      }
      if (endpoint === 'groupidentify') {
        expect(enabled[0].batchedRequest).toHaveLength(2);
      }
    },
  );

  it('gates both requests of a group independently', async () => {
    process.env[flags['2/httpapi']] = 'ALL';
    process.env[flags.groupidentify] = 'another-workspace';
    const [first] = await run([group()]);
    const [httpapi, groupidentify] = first.batchedRequest;
    expect(httpapi.body.GZIP.payload).toBeDefined();
    expect(httpapi.body.JSON).toEqual({});
    expect(groupidentify.body.FORM.identification).toHaveLength(1);
    expect(groupidentify.body.GZIP).toBeUndefined();
    expect(groupidentify.headers).toEqual({});
  });

  it.each(['unset', 'unlisted', 'missing workspace'])(
    'leaves disabled requests untouched (%s)',
    async (reason) => {
      const events = [group(), alias(), track(2), track(3)];
      if (reason === 'missing workspace') {
        events.forEach(({ metadata }) => {
          delete (metadata as { workspaceId?: string }).workspaceId;
        });
      }
      const baseline = await run(structuredClone(events));
      if (reason !== 'unset') {
        Object.values(flags).forEach((flag) => {
          process.env[flag] = reason === 'unlisted' ? 'other-workspace' : 'ALL';
        });
      }
      expect(await run(structuredClone(events))).toEqual(baseline);
    },
  );

  it('lets the shared proxy compress the exact FORM wire bytes and set encoding', async () => {
    process.env[flags.usermap] = 'ALL';
    const [response] = await run([alias()]);
    const [request] = response.batchedRequest;
    const proxy = await prepareProxyRequest(request);
    expect(Buffer.isBuffer(proxy.data)).toBe(true);
    expect(gunzipSync(proxy.data).toString()).toBe(request.body.GZIP.payload);
    expect(proxy.headers).toMatchObject({
      'Content-Encoding': 'gzip',
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  });
});
