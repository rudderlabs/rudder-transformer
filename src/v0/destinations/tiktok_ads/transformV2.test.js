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
        headers: {
          'Access-Token': 'dummyAccessToken',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
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
        eventName: 'StartTrial',
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
        eventName: 'SubmitApplication',
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

        if (expectedResponse.headers) {
          expect(resp.headers['Access-Token']).toBe(expectedResponse.headers['Access-Token']);
          expect(resp.headers['Content-Type']).toBe(expectedResponse.headers['Content-Type']);
        }

        if (expectedResponse.method) {
          expect(resp.method).toBe(expectedResponse.method);
        }

        if (expectedResponse.endpoint) {
          expect(resp.endpoint).toBe(expectedResponse.endpoint);
        }

        if (expectedResponse.body) {
          expect(resp.body.JSON.event_source).toBe(expectedResponse.body.event_source);
          expect(resp.body.JSON.event_source_id).toBe(expectedResponse.body.event_source_id);
          expect(resp.body.JSON.partner_name).toBe(expectedResponse.body.partner_name);
          if (expectedResponse.body.test_event_code) {
            expect(resp.body.JSON.test_event_code).toBe(expectedResponse.body.test_event_code);
          }
          expect(Array.isArray(resp.body.JSON.data)).toBe(true);
        }

        if (expectedResponse.eventName) {
          expect(resp.body.JSON.data[0].event).toBe(expectedResponse.eventName);
        }
      }
    });
  });
});
