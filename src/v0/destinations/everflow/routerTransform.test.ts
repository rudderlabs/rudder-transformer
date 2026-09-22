import type { Destination, RouterTransformationRequestData } from '../../../types';
import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import { Integration } from './routerTransform';

const destination: Destination = {
  ID: 'everflow-dest-1',
  Name: 'EVERFLOW',
  DestinationDefinition: {
    ID: 'everflow-def-1',
    Name: 'EVERFLOW',
    DisplayName: 'Everflow',
    Config: {},
  },
  Config: {
    postbackUrl: 'https://www.example.com/postback',
    networkId: 'network-1',
    verificationToken: 'token-1',
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

const input = (
  message: RouterTransformationRequestData['message'],
  jobId = 1,
): RouterTransformationRequestData =>
  ({
    message,
    destination,
    metadata: {
      jobId,
      workspaceId: 'ws-1',
      destinationId: 'everflow-dest-1',
      sourceId: 'source-1',
      sourceType: 'javascript',
      sourceCategory: 'web',
      destinationType: 'EVERFLOW',
      messageId: `message-${jobId}`,
    },
  }) as RouterTransformationRequestData;

const track = (
  overrides: Record<string, unknown> = {},
): RouterTransformationRequestData['message'] => ({
  type: 'track',
  event: 'Order Completed',
  messageId: 'message-1',
  anonymousId: 'anonymous-1',
  userId: 'user-1',
  timestamp: '2026-05-20T12:34:56.789Z',
  properties: { transactionId: 'transaction-1' },
  ...overrides,
});

const transform = (message = track()) =>
  new Integration(destination).transformEvent(
    input(message) as unknown as Parameters<InstanceType<typeof Integration>['transformEvent']>[0],
  );

describe('EverflowIntegration', () => {
  it('builds a GET request with raw query parameters and no payload body', () => {
    expect(
      transform(
        track({
          properties: {
            transactionId: 'transaction & 1',
            revenue: '99.95',
            currency: 'usd',
            coupon: 'SPRING SALE',
            eventId: 7,
            advEventId: 'advertiser-event',
            orderId: 'order-1',
            email: 'property@example.com',
            adv1: 42,
            adv10: false,
            oid: 'offer-1',
            affid: 'affiliate-1',
          },
          traits: { email: 'trait@example.com' },
          context: {
            traits: { email: 'user@example.com' },
            ip: '203.0.113.1',
            userAgent: 'Test Agent',
            device: { type: 'IPadOS', advertisingId: 'apple-ad-id' },
            app: { namespace: 'com.example.app' },
          },
        }),
      ),
    ).toEqual({
      body: {},
      endpoint: 'https://www.example.com/postback',
      endpointPath: 'postback',
      method: 'GET',
      params: {
        nid: 'network-1',
        transaction_id: 'transaction & 1',
        verification_token: 'token-1',
        amount: 99.95,
        currency: 'USD',
        coupon_code: 'SPRING SALE',
        event_id: 7,
        adv_event_id: 'advertiser-event',
        event_name: 'Order Completed',
        order_id: 'order-1',
        email: 'user@example.com',
        user_id: 'user-1',
        user_ip: '203.0.113.1',
        user_agent: 'Test Agent',
        timestamp: 1779280496,
        oid: 'offer-1',
        affid: 'affiliate-1',
        idfa: 'apple-ad-id',
        app_id: 'com.example.app',
        adv1: '42',
        adv10: 'false',
      },
    });
  });

  it.each([
    ['transactionId', { transactionId: 'camel' }, 'camel'],
    ['transaction_id', { transaction_id: 'snake' }, 'snake'],
    ['tid', { tid: 'short' }, 'short'],
  ])('resolves the %s transaction id alias', (_name, properties, expected) => {
    expect(transform(track({ properties })).params).toMatchObject({ transaction_id: expected });
  });

  it.each([
    ['revenue', { revenue: 1 }, 1],
    ['total', { total: '2.5' }, 2.5],
    ['value', { value: 0 }, 0],
    ['price', { price: '-3.25' }, -3.25],
  ])('resolves and parses the %s amount alias', (_name, properties, expected) => {
    expect(
      transform(track({ properties: { transactionId: 'transaction-1', ...properties } })).params,
    ).toMatchObject({ amount: expected });
  });

  it.each(['$99.99', '99,99', 'not-a-number', Infinity])(
    'rejects an uncastable amount: %s',
    (amount) => {
      expect(() =>
        transform(track({ properties: { transactionId: 'transaction-1', revenue: amount } })),
      ).toThrow('Everflow amount must be a valid decimal number.');
    },
  );

  it('omits invalid currency and all unresolved optional parameters', () => {
    expect(
      transform(
        track({ event: '', properties: { transactionId: 'transaction-1', currency: 'US' } }),
      ),
    ).toEqual({
      body: {},
      endpoint: 'https://www.example.com/postback',
      endpointPath: 'postback',
      method: 'GET',
      params: {
        nid: 'network-1',
        transaction_id: 'transaction-1',
        verification_token: 'token-1',
        user_id: 'user-1',
        timestamp: 1779280496,
      },
    });
  });

  it.each(['ios', 'IPADOS', 'watchOS', 'TvOs'])(
    'maps advertisingId to idfa for Apple family type %s',
    (type) => {
      const params = transform(
        track({
          context: { device: { type, advertisingId: 'apple-id', id: 'device-id' } },
        }),
      ).params;
      expect(params).toMatchObject({ idfa: 'apple-id' });
      expect(params).not.toHaveProperty('google_aid');
      expect(params).not.toHaveProperty('android_id');
    },
  );

  it('maps Android identifiers conditionally while retaining explicit hashed identifiers', () => {
    const params = transform(
      track({
        context: { device: { type: 'ANDROID', advertisingId: 'google-id', id: 'android-id' } },
        properties: {
          transactionId: 'transaction-1',
          idfa_md5: 'idfa-md5',
          idfaSha1: 'idfa-sha1',
          google_aid_md5: 'google-md5',
          googleAidSha1: 'google-sha1',
        },
      }),
    ).params;
    expect(params).toMatchObject({
      google_aid: 'google-id',
      android_id: 'android-id',
      idfa_md5: 'idfa-md5',
      idfa_sha1: 'idfa-sha1',
      google_aid_md5: 'google-md5',
      google_aid_sha1: 'google-sha1',
    });
    expect(params).not.toHaveProperty('idfa');
  });

  it('does not infer advertising or app identifiers from forbidden properties', () => {
    const params = transform(
      track({
        context: { device: { advertisingId: 'untyped-ad-id', id: 'untyped-device-id' } },
        properties: {
          transactionId: 'transaction-1',
          idfa: 'property-idfa',
          google_aid: 'property-google-aid',
          googleAid: 'property-google-aid-camel',
          app_id: 'property-app-id',
          appId: 'property-app-id-camel',
        },
      }),
    ).params;
    ['idfa', 'google_aid', 'android_id', 'app_id'].forEach((key) =>
      expect(params).not.toHaveProperty(key),
    );
  });

  it('rejects missing transaction ids without synthetic fallbacks', () => {
    expect(() =>
      transform(
        track({
          messageId: 'fallback-message',
          anonymousId: 'fallback-anonymous',
          context: { referrer: { id: 'fallback-referrer' } },
          properties: {},
        }),
      ),
    ).toThrow(
      'Missing required value from ["properties.transactionId","properties.transaction_id","properties.tid"]',
    );
  });

  it.each([
    'https://localhost/postback?nid=1',
    'https://sub.LOCALHOST/postback',
    'https://example.NGROK.IO/postback',
  ])('rejects unsafe or non-base postback URL %s at runtime', async (postbackUrl) => {
    const unsafeDestination = {
      ...destination,
      Config: { ...destination.Config, postbackUrl },
    };
    const [result] = await processDestinationIntegration(
      [{ ...input(track()), destination: unsafeDestination }],
      Integration,
      {},
    );
    expect(result).toMatchObject({
      statusCode: 400,
      error: expect.stringContaining('Paste only the base Global Postback URL'),
      statTags: expect.objectContaining({ errorType: 'configuration' }),
    });
  });

  it('rejects every non-track message type through input validation', async () => {
    const results = await processDestinationIntegration(
      (['identify', 'page', 'screen', 'group', 'alias'] as const).map((type, index) =>
        input({ type, properties: { transactionId: `transaction-${index}` } }, index + 1),
      ),
      Integration,
      {},
    );
    expect(results).toHaveLength(5);
    results.forEach((result) => {
      expect(result).toMatchObject({ statusCode: 400 });
      expect(result.error).toContain('message.type');
    });
  });

  it('emits one request per track event', async () => {
    const results = await processDestinationIntegration(
      [input(track(), 1), input(track({ messageId: 'message-2' }), 2)],
      Integration,
      {},
    );
    expect(results).toHaveLength(2);
    results.forEach((result) => {
      expect(result).toMatchObject({ statusCode: 200, batched: true });
      expect(result.metadata).toHaveLength(1);
    });
  });
});
