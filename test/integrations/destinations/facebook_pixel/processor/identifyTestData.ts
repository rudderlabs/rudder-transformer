import { removeUndefinedAndNullValues } from '@rudderstack/integrations-lib';
import {
  overrideDestination,
  transformResultBuilder,
  generateSimplifiedIdentifyPayload,
} from '../../../testUtils';

const commonDestination = {
  Config: {
    blacklistPiiProperties: [
      {
        blacklistPiiProperties: '',
        blacklistPiiHash: false,
      },
    ],
    accessToken: '09876',
    pixelId: 'dummyPixelId',
    eventsToEvents: [
      {
        from: '',
        to: '',
      },
    ],
    eventCustomProperties: [
      {
        eventCustomProperties: '',
      },
    ],
    valueFieldIdentifier: '',
    advancedMapping: false,
    whitelistPiiProperties: [
      {
        whitelistPiiProperties: '',
      },
    ],
  },
  Enabled: true,
};


export const identifyData = [
  {
    id: 'fbPixel-identify-test-1',
      name: 'facebook_pixel',
      description: '[Error]: Check if advancedMapping configuration is enabled',
      scenario: 'Framework',
      successCriteria:
        'Response should contain error message and status code should be 400, we are sending identify event with advancedMapping disabled',
      module: 'destination',
      version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  name: 'Test',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              properties: {
                plan: 'standard plan',
                name: 'rudder test',
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: false,
                  },
                ],
                accessToken: '09876',
                pixelId: 'dummyPixelId',
                eventsToEvents: [
                  {
                    from: '',
                    to: '',
                  },
                ],
                eventCustomProperties: [
                  {
                    eventCustomProperties: '',
                  },
                ],
                valueFieldIdentifier: '',
                advancedMapping: false,
                whitelistPiiProperties: [
                  {
                    whitelistPiiProperties: '',
                  },
                ],
              },
              Enabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error:
              'For identify events, "Advanced Mapping" configuration must be enabled on the RudderStack dashboard',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  }, 
];
