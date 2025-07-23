const { InstrumentationError } = require('@rudderstack/integrations-lib');

const { trackResponseBuilder } = require('./transformV2');

describe('trackResponseBuilder', () => {
  const baseConfig = {
    eventsToStandard: [],
    sendCustomEvents: false,
    accessToken: 'dummyAccessToken',
    pixelCode: 'dummyPixelCode',
    hashUserProperties: false,
  };

  const baseMessage = {
    properties: {},
    user: { email: 'test@example.com' },
    timestamp: '2023-10-01T00:00:00Z',
  };

  const baseOutputMessage = {
    headers: {
      'Access-Token': 'dummyAccessToken',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
  };

  const testCases = [
    {
      name: 'should throw error if event name is missing',
      message: { event: '' },
      config: baseConfig,
      shouldThrow: true,
      expectedError: InstrumentationError,
    },
    {
      name: 'should throw error if event is not mapped and custom events not allowed',
      message: { event: 'unknownEvent' },
      config: { ...baseConfig, eventsToStandard: [], sendCustomEvents: false },
      shouldThrow: true,
      expectedError:
        'Event name (unknownevent) is not valid, must be mapped to one of standard events',
    },
    {
      name: 'should build response for standard mapped event',
      message: {
        ...baseMessage,
        event: 'purchase',
        properties: { testEventCode: 'test123' },
      },
      config: {
        ...baseConfig,
        eventsToStandard: [{ from: 'purchase', to: 'CompletePayment' }],
        sendCustomEvents: false,
      },
      shouldThrow: false,
      expectedResponse: {
        ...baseOutputMessage,
        body: {
          event_source: 'web',
          event_source_id: 'dummyPixelCode',
          partner_name: 'RudderStack',
          test_event_code: 'test123',
          eventName: 'CompletePayment',
        },
      },
    },
    {
      name: 'should build response for custom event if sendCustomEvents is true',
      message: {
        ...baseMessage,
        event: 'start trial',
      },
      config: {
        ...baseConfig,
        eventsToStandard: [],
        sendCustomEvents: true,
      },
      shouldThrow: false,
      expectedResponse: {
        ...baseOutputMessage,
        body: {
          event_source: 'web',
          event_source_id: 'dummyPixelCode',
          partner_name: 'RudderStack',
          eventName: 'StartTrial',
        },
      },
    },
    {
      name: 'should build response for event mapped in eventNameMapping',
      message: {
        ...baseMessage,
        event: 'submit application',
      },
      config: {
        ...baseConfig,
        eventsToStandard: [],
        sendCustomEvents: false,
      },
      shouldThrow: false,
      expectedResponse: {
        ...baseOutputMessage,
        body: {
          event_source: 'web',
          event_source_id: 'dummyPixelCode',
          partner_name: 'RudderStack',
          eventName: 'SubmitApplication',
        },
      },
    },
  ];

  testCases.forEach(({ name, message, config, shouldThrow, expectedError, expectedResponse }) => {
    it(name, async () => {
      if (shouldThrow) {
        await expect(trackResponseBuilder(message, { Config: config })).rejects.toThrow(
          expectedError,
        );
      } else {
        const resp = await trackResponseBuilder(message, { Config: config });
        expect(resp.headers).toMatchObject(expectedResponse.headers);
        expect(resp.method).toBe(expectedResponse.method);
        expect(resp.endpoint).toBe(expectedResponse.endpoint);
        expect(resp.body.JSON).toMatchObject({
          event_source: expectedResponse.body.event_source,
          event_source_id: expectedResponse.body.event_source_id,
          partner_name: expectedResponse.body.partner_name,
          data: [
            {
              event: expectedResponse.body.eventName,
              event_time: 1696118400,
            },
          ],
          ...(expectedResponse.body.test_event_code && {
            test_event_code: expectedResponse.body.test_event_code,
          }),
        });
      }
    });
  });

  it('should include contents_ids and num_items in properties if contents are present', async () => {
    const message = {
      event: 'purchase',
      properties: {
        products: [
          { product_id: '123', name: 'Product1', price: 10, quantity: 2 },
          { product_id: '456', name: 'Product2', price: 20, quantity: 1 },
        ],
      },
      timestamp: '2023-10-01T00:00:00Z',
    };
    const config = {
      eventsToStandard: [{ from: 'purchase', to: 'CompletePayment' }],
      sendCustomEvents: false,
      accessToken: 'dummyAccessToken',
      pixelCode: 'dummyPixelCode',
      hashUserProperties: false,
    };
    const resp = await trackResponseBuilder(message, { Config: config });
    const data = resp.body.JSON.data[0];
    expect(data.properties.contents_ids).toEqual(['123', '456']);
    expect(data.properties.num_items).toBe(2);
  });

  it('should remove gaid for Apple family OS', async () => {
    const message = {
      event: 'purchase',
      properties: {
        products: [{ product_id: '123', name: 'Product1', price: 10, quantity: 2 }],
      },
      context: { os: { name: 'ios' }, device: { advertisingId: 'some-idfa' } },
      timestamp: '2023-10-01T00:00:00Z',
    };
    const config = {
      eventsToStandard: [{ from: 'purchase', to: 'CompletePayment' }],
      sendCustomEvents: false,
      accessToken: 'dummyAccessToken',
      pixelCode: 'dummyPixelCode',
      hashUserProperties: false,
    };
    const resp = await trackResponseBuilder(message, { Config: config });
    const data = resp.body.JSON.data[0];
    expect(data.user.gaid).toBeUndefined();
    expect(data.user.idfa).toBeDefined();
  });

  it('should remove idfa and idfv for Android OS', async () => {
    const message = {
      event: 'purchase',
      properties: {
        products: [{ product_id: '123', name: 'Product1', price: 10, quantity: 2 }],
      },
      context: { os: { name: 'android' }, device: { advertisingId: 'some-gaid' } },
      timestamp: '2023-10-01T00:00:00Z',
    };
    const config = {
      eventsToStandard: [{ from: 'purchase', to: 'CompletePayment' }],
      sendCustomEvents: false,
      accessToken: 'dummyAccessToken',
      pixelCode: 'dummyPixelCode',
      hashUserProperties: false,
    };
    const resp = await trackResponseBuilder(message, { Config: config });
    const data = resp.body.JSON.data[0];
    expect(data.user.idfa).toBeUndefined();
    expect(data.user.idfv).toBeUndefined();
    expect(data.user.gaid).toBeDefined();
  });

  it('should use event_source (snake_case) if present in properties', async () => {
    const message = {
      event: 'purchase',
      properties: {
        event_source: 'app',
        products: [{ product_id: '123', name: 'Product1', price: 10, quantity: 2 }],
      },
      timestamp: '2023-10-01T00:00:00Z',
    };
    const config = {
      eventsToStandard: [{ from: 'purchase', to: 'CompletePayment' }],
      sendCustomEvents: false,
      accessToken: 'dummyAccessToken',
      pixelCode: 'dummyPixelCode',
      hashUserProperties: false,
    };
    const resp = await trackResponseBuilder(message, { Config: config });
    expect(resp.body.JSON.event_source).toBe('app');
  });
});
