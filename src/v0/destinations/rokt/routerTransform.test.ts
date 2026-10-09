import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import type { DestinationIntegrationConstructor } from '../../../services/destination/destinationIntegration/destinationIntegration';
import type {
  Destination,
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types';
import type { RoktBatch } from './types';
import { Integration } from './routerTransform';

const destination: Destination = {
  ID: 'rokt-dest-1',
  Name: 'ROKT',
  DestinationDefinition: { ID: 'rokt-def-1', Name: 'ROKT', DisplayName: 'Rokt', Config: {} },
  Config: {
    apiEndpoint: 'https://s2s.mparticle.com/',
    serverToServerKey: 'server-key',
    serverToServerSecret: 'server-secret',
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

const makeInput = (
  jobId: number,
  message: Record<string, unknown> = {},
  destinationOverride = destination,
): RouterTransformationRequestData => ({
  message: {
    type: 'track',
    event: 'purchase',
    userId: `user-${jobId}`,
    messageId: `message-${jobId}`,
    timestamp: '2026-09-29T00:00:00.000Z',
    properties: {},
    ...message,
  },
  metadata: {
    jobId,
    workspaceId: 'ws-1',
    destinationId: 'rokt-dest-1',
    sourceId: 'source-1',
    sourceType: 'web',
    sourceCategory: 'cloud',
    destinationType: 'ROKT',
    messageId: `message-${jobId}`,
  },
  destination: destinationOverride,
});

const transform = (input: RouterTransformationRequestData = makeInput(1)) =>
  new Integration(input.destination).transformEvent(
    input as unknown as Parameters<InstanceType<typeof Integration>['transformEvent']>[0],
  );

const route = (inputs: RouterTransformationRequestData[]) =>
  processDestinationIntegration(
    inputs,
    Integration as DestinationIntegrationConstructor<RoktBatch>,
    {},
  );

const batchedRequestOf = (response: RouterTransformationResponse) => {
  const request = response.batchedRequest;
  if (!request || Array.isArray(request)) throw new Error('Expected one batched request');
  return request;
};

const parseBatch = (response: RouterTransformationResponse): RoktBatch[] =>
  JSON.parse(batchedRequestOf(response).body?.JSON_ARRAY?.batch as string) as RoktBatch[];

const batchBody = async (inputs: RouterTransformationRequestData[]): Promise<RoktBatch[]> =>
  parseBatch((await route(inputs))[0]);

describe('RoktIntegration', () => {
  it('builds the Rokt bulk request with Basic auth', () => {
    const result = transform();
    expect(result).toEqual({
      endpoint: 'https://s2s.mparticle.com/v2/bulkevents',
      endpointPath: '/v2/bulkevents',
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from('server-key:server-secret').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: {
        schema_version: 2,
        environment: 'production',
        user_identities: { customerid: 'user-1' },
        events: [
          {
            event_type: 'custom_event',
            data: {
              event_name: 'conversion',
              custom_event_type: 'transaction',
              timestamp_unixtime_ms: 1790640000000,
              source_message_id: 'message-1',
              custom_attributes: { conversiontype: 'purchase' },
            },
          },
        ],
      },
    });
  });

  it.each([
    'http://s2s.mparticle.com',
    'https://attacker.example',
    'https://evilmparticle.com',
    'https://s2s.mparticle.com.attacker.example',
    'https://user@s2s.mparticle.com',
    'https://s2s.mparticle.com:8443',
    'https://s2s.mparticle.com?redirect=1',
    'https://s2s.mparticle.com#fragment',
    'https://127.0.0.1',
    'https://inbound.mparticle.com/../etc',
    'https://inbound.mparticle.com/%2e%2e/etc',
    'https://inbound.mparticle.com//s2s',
    'https://inbound.mparticle.com/s2s%2f..',
    'https://inbound.mparticle.com\\..\\s2s',
    'https://inbound.mparticle.com\\%2e%2e/s2s',
    'https://inbound.mparticle.com\\s2s/path',
    'https:///mparticle.com/s2s',
    'https:///s2s.mparticle.com/path',
  ])('rejects unsafe apiEndpoint %s', (apiEndpoint) => {
    const input = makeInput(
      1,
      {},
      { ...destination, Config: { ...destination.Config, apiEndpoint } },
    );
    expect(() => transform(input)).toThrow(
      'ROKT apiEndpoint must be a valid HTTPS Rokt Events API base URL',
    );
  });

  it.each([
    'https://s2s.mparticle.com',
    'https://s2s.mparticle.com/path',
    'https://s2s.us2.mparticle.com/',
    'https://s2s.eu1.mparticle.com',
    'https://s2s.au1.mparticle.com/',
    'https://s2s.future.mparticle.com',
    'https://inbound.mparticle.com/s2s',
    'https://inbound.mparticle.com/s2s/',
    'https://mparticle.com',
  ])('accepts the Rokt endpoint %s', (apiEndpoint) => {
    const input = makeInput(
      1,
      {},
      { ...destination, Config: { ...destination.Config, apiEndpoint } },
    );
    expect(transform(input).endpoint).toBe(`${apiEndpoint.replace(/\/$/, '')}/v2/bulkevents`);
  });

  it('ignores surrounding whitespace in apiEndpoint', () => {
    const input = makeInput(
      1,
      {},
      {
        ...destination,
        Config: { ...destination.Config, apiEndpoint: ' https://inbound.mparticle.com/s2s/ ' },
      },
    );
    expect(transform(input).endpoint).toBe('https://inbound.mparticle.com/s2s/v2/bulkevents');
  });

  it.each(['apiEndpoint', 'serverToServerKey', 'serverToServerSecret'])(
    'rejects whitespace-only %s configuration',
    async (field) => {
      const input = makeInput(
        1,
        {},
        {
          ...destination,
          Config: { ...destination.Config, [field]: '   ' },
        },
      );
      const responses = await route([input]);

      expect(responses).toHaveLength(1);
      expect(responses[0].error).toContain('Required configuration value cannot be blank');
      expect(responses[0].batchedRequest).toBeUndefined();
    },
  );

  it('maps ordered identity, click-id, event, and root field chains', () => {
    const result = transform(
      makeInput(1, {
        userId: 'customer-1',
        request_ip: '198.51.100.3',
        originalTimestamp: '2026-09-29T00:00:01.000Z',
        sentAt: '2026-09-29T00:00:02.000Z',
        timestamp: undefined,
        context: {
          ip: '198.51.100.1',
          request_ip: '198.51.100.2',
          traits: { email: ' FIRST@EXAMPLE.TEST ' },
          page: { search: '?rclid=query-rclid&rtid=query-rtid' },
        },
        traits: { email: 'second@example.test' },
        event: 'event-fallback',
        properties: {
          email: 'third@example.test',
          roktClickId: 'property-click',
          rokt_click_id: 'ignored-click',
          conversiontype: 'first-type',
          conversionType: 'ignored-type',
          orderId: 'order-first',
          order_id: 'order-second',
          amount: 0,
          revenue: 50,
          currency: 'USD',
        },
      }),
    ).body;

    expect(result).toMatchObject({
      ip: '198.51.100.1',
      user_identities: {
        email: 'first@example.test',
        customerid: 'customer-1',
        other2: 'property-click',
      },
      integration_attributes: {
        '1277': { passbackconversiontrackingid: 'property-click' },
      },
      events: [
        {
          data: {
            timestamp_unixtime_ms: 1790640001000,
            custom_attributes: {
              conversiontype: 'first-type',
              confirmationref: 'order-first',
              amount: '0',
              currency: 'USD',
            },
          },
        },
      ],
    });
  });

  it('skips whitespace aliases without trimming selected fallback values', () => {
    const body = transform(
      makeInput(2, {
        context: {
          ip: '   ',
          request_ip: ' 198.51.100.2 ',
          userAgent: ' ',
          user_agent: ' selected-agent ',
          traits: {
            email: '   ',
            firstName: ' ',
            first_name: ' Selected First ',
            iosAdvertisingId: ' ',
            ios_advertising_id: ' selected-ios-id ',
          },
          page: { path: ' ', url: ' ' },
        },
        traits: { email: ' FALLBACK@EXAMPLE.TEST ' },
        properties: {
          conversiontype: ' ',
          conversionType: ' selected-type ',
          confirmationRef: ' ',
          confirmation_ref: ' selected-confirmation ',
          currency: ' USD ',
          roktClickId: ' ',
          rokt_click_id: ' selected-click-id ',
          name: ' Selected Screen ',
          url: ' selected-url ',
        },
      }),
    ).body;

    expect(body).toMatchObject({
      ip: ' 198.51.100.2 ',
      user_identities: {
        email: 'fallback@example.test',
        customerid: 'user-2',
        other2: ' selected-click-id ',
      },
      integration_attributes: {
        '1277': { passbackconversiontrackingid: ' selected-click-id ' },
      },
      user_attributes: { firstname: ' Selected First ' },
      device_info: {
        http_header_user_agent: ' selected-agent ',
        ios_advertising_id: ' selected-ios-id ',
      },
      events: [
        {
          data: {
            custom_attributes: {
              conversiontype: ' selected-type ',
              confirmationref: ' selected-confirmation ',
              currency: ' USD ',
              screen_name: ' Selected Screen ',
              url: ' selected-url ',
            },
          },
        },
      ],
    });
  });

  it('falls through empty aliases and uses rtid from page search', () => {
    const body = transform(
      makeInput(2, {
        type: 'page',
        userId: undefined,
        event: undefined,
        context: {
          ip: '',
          request_ip: '198.51.100.2',
          traits: { email: ' ' },
          page: { search: '?rclid=&rtid=rtid-value', path: '' },
        },
        traits: { email: '' },
        properties: {
          email: '',
          roktClickId: '',
          rokt_click_id: ' ',
          rclid: '',
          rtid: '',
          name: 'Checkout',
        },
      }),
    ).body;

    expect(body).toMatchObject({
      ip: '198.51.100.2',
      user_identities: { other2: 'rtid-value' },
      integration_attributes: {
        '1277': { passbackconversiontrackingid: 'rtid-value' },
      },
    });
    expect(body.events?.[0].data.custom_attributes).toEqual({
      conversiontype: 'screen_view',
      screen_name: 'Checkout',
    });
  });

  it('maps screen identity and falls back through timestamp, conversion, and URL aliases', () => {
    const body = transform(
      makeInput(3, {
        type: 'screen',
        event: '',
        name: 'Root Screen',
        timestamp: '',
        originalTimestamp: '',
        sentAt: '2026-09-29T00:00:03.000Z',
        context: { page: { path: '', url: '' } },
        properties: {
          conversiontype: '',
          conversionType: '',
          conversion_type: '',
          name: '',
          url: 'https://example.test/screen',
          amount: '',
          revenue: 15,
        },
      }),
    ).body;

    expect(body.events?.[0].data).toMatchObject({
      timestamp_unixtime_ms: 1790640003000,
      custom_attributes: {
        conversiontype: 'screen_view',
        amount: '15',
        screen_name: 'Root Screen',
        url: 'https://example.test/screen',
      },
    });
  });

  it('maps all user attributes and routes typed advertising IDs', () => {
    const body = transform(
      makeInput(3, {
        context: {
          locale: 'en-US',
          userAgent: 'synthetic-agent',
          device: { type: 'iOS', advertisingId: 'ios-device-id' },
          traits: {
            firstName: 'First',
            firstNameSha256: 'first-hash',
            last_name: 'Last',
            last_name_sha256: 'last-hash',
            phone: '+15550000000',
            phone_sha256: 'phone-hash',
            age: 42,
            dateOfBirth: '2000-02-03T10:00:00Z',
            gender: 'x',
            address: { city: 'City', state: 'State', postal_code: '12345' },
            title: 'Engineer',
            androidAdvertisingId: 'android-trait-id',
          },
        },
        properties: { value: 12, predicted_ltv: '99.5' },
      }),
    ).body;

    expect(body.user_attributes).toEqual({
      firstname: 'First',
      firstnamesha256: 'first-hash',
      lastname: 'Last',
      lastnamesha256: 'last-hash',
      mobile: '+15550000000',
      mobilesha256: 'phone-hash',
      age: 42,
      dob: '20000203',
      gender: 'x',
      city: 'City',
      state: 'State',
      zip: '12345',
      title: 'Engineer',
      language: 'en-US',
      value: 12,
      predictedltv: '99.5',
    });
    expect(body.device_info).toEqual({
      http_header_user_agent: 'synthetic-agent',
      ios_advertising_id: 'ios-device-id',
      android_advertising_id: 'android-trait-id',
    });
  });

  it('routes Android advertising IDs and uses explicit iOS trait fallbacks', () => {
    const body = transform(
      makeInput(4, {
        context: {
          device: { type: 'Android', advertisingId: 'android-device-id' },
          traits: { ios_advertising_id: 'ios-trait-id' },
        },
      }),
    ).body;

    expect(body.device_info).toEqual({
      ios_advertising_id: 'ios-trait-id',
      android_advertising_id: 'android-device-id',
    });
  });

  it('does not infer a platform but retains explicit trait fallbacks for unknown devices', () => {
    const body = transform(
      makeInput(5, {
        context: {
          device: { type: 'desktop', advertisingId: 'unknown-platform-id' },
          traits: { androidAdvertisingId: 'explicit-android-id' },
        },
      }),
    ).body;
    expect(body.device_info).toEqual({ android_advertising_id: 'explicit-android-id' });
  });

  it('omits unresolved optional and deliberately unmapped fields', () => {
    const body = transform(
      makeInput(6, {
        messageId: undefined,
        properties: { currency: '', rclid: '', application_info: 'ignored' },
        traits: { birthday: 'not-a-date', mpid: 'ignored' },
        context: {
          sessionId: 'ignored',
          device: { advertisingId: 'untyped-id' },
        },
      }),
    ).body;

    expect(body).toEqual({
      schema_version: 2,
      environment: 'production',
      user_identities: { customerid: 'user-6' },
      events: [
        {
          event_type: 'custom_event',
          data: {
            event_name: 'conversion',
            custom_event_type: 'transaction',
            timestamp_unixtime_ms: 1790640000000,
            custom_attributes: { conversiontype: 'purchase' },
          },
        },
      ],
    });
  });

  it('emits identify attributes without a conversion event', () => {
    const body = transform(
      makeInput(7, {
        type: 'identify',
        event: undefined,
        timestamp: undefined,
        userId: 'identify-user',
        traits: { firstName: 'Identify' },
      }),
    ).body;
    expect(body).toEqual({
      schema_version: 2,
      environment: 'production',
      user_identities: { customerid: 'identify-user' },
      user_attributes: { firstname: 'Identify' },
    });
  });

  it('rejects unsupported message types', async () => {
    const responses = await route([
      makeInput(8, { type: 'group' }),
      makeInput(9, { type: 'alias' }),
    ]);

    expect(responses).toHaveLength(2);
    expect(responses.map((response) => response.error)).toEqual([
      expect.stringContaining('Unsupported message type'),
      expect.stringContaining('Unsupported message type'),
    ]);
    expect(responses.every((response) => response.batchedRequest === undefined)).toBe(true);
  });

  it('rejects a message without a type', async () => {
    const [response] = await route([makeInput(10, { type: undefined })]);

    expect(response.error).toContain('Message Type is not present. Aborting message.');
    expect(response.batchedRequest).toBeUndefined();
  });

  it.each([
    { name: 'missing', timestamp: undefined },
    { name: 'invalid', timestamp: 'not-a-date' },
  ])('omits an $name conversion timestamp', ({ timestamp: timestampValue }) => {
    const body = transform(makeInput(10, { timestamp: timestampValue })).body;

    expect(body.events?.[0].data).toEqual({
      event_name: 'conversion',
      custom_event_type: 'transaction',
      source_message_id: 'message-10',
      custom_attributes: { conversiontype: 'purchase' },
    });
  });

  it.each([
    { name: 'missing', properties: {} },
    { name: 'null', properties: { conversiontype: null } },
  ])(
    'accepts conversions without an identity and with a $name conversion type',
    ({ properties }) => {
      const body = transform(
        makeInput(11, {
          userId: undefined,
          event: undefined,
          timestamp: undefined,
          context: {},
          properties,
        }),
      ).body;

      expect(body).toEqual({
        schema_version: 2,
        environment: 'production',
        user_identities: {},
        events: [
          {
            event_type: 'custom_event',
            data: {
              event_name: 'conversion',
              custom_event_type: 'transaction',
              source_message_id: 'message-11',
              custom_attributes: {},
            },
          },
        ],
      });
    },
  );

  it('converts a numeric userId to a customer ID string', async () => {
    const [response] = await route([makeInput(12, { userId: 123 })]);

    expect(parseBatch(response)[0].user_identities.customerid).toBe('123');
  });

  it('does not impose a client-side per-user payload size limit', () => {
    const largeValue = 'x'.repeat(200 * 1024);
    const body = transform(makeInput(13, { traits: { firstName: largeValue } })).body;

    expect(body.user_attributes?.firstname).toBe(largeValue);
    expect(Buffer.byteLength(JSON.stringify(body), 'utf8')).toBeGreaterThan(200 * 1024);
  });

  it.each([
    { inputCount: 100, expectedChunks: [100] },
    { inputCount: 101, expectedChunks: [100, 1] },
  ])(
    'packs $inputCount per-user batches into $expectedChunks request sizes',
    async ({ inputCount, expectedChunks }) => {
      const inputs = Array.from({ length: inputCount }, (_, index) => makeInput(index + 1));
      const responses = await route(inputs);

      expect(responses).toHaveLength(expectedChunks.length);
      expect(
        responses.map((response) => {
          expect(batchedRequestOf(response).body?.JSON).toEqual({});
          return parseBatch(response).length;
        }),
      ).toEqual(expectedChunks);
    },
  );

  it('preserves one per-user batch object for each input', async () => {
    const bodies = await batchBody([makeInput(15), makeInput(16)]);
    expect(bodies.map((body) => body.user_identities.customerid)).toEqual(['user-15', 'user-16']);
    expect(bodies.every((body) => body.events?.length === 1)).toBe(true);
  });
});
