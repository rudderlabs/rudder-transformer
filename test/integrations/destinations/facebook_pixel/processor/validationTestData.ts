import { Destination } from '../../../../../src/types';
import { generateSimplifiedGroupPayload, generateSimplifiedTrackPayload } from '../../../testUtils';
const commonDestination: Destination = {
  ID: '12335',
  Name: 'sample-destination',
  DestinationDefinition: {
    ID: '123',
    Name: 'facebook_pixel',
    DisplayName: 'Facebook Pixel',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: {
    limitedDataUsage: true,
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
    removeExternalId: true,
    valueFieldIdentifier: '',
    advancedMapping: true,
    whitelistPiiProperties: [
      {
        whitelistPiiProperties: '',
      },
    ],
  },
  Enabled: true,
};

const commonStatTags = {
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  destType: 'FACEBOOK_PIXEL',
  module: 'destination',
  implementation: 'native',
  feature: 'processor',
};

export const validationTestData = [
  {
    id: 'fbPixel-validation-test-1',
    name: 'facebook_pixel',
    description: '[Error]: Check for unsupported message type',
    scenario: 'Framework',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are sending a message type which is not supported by facebook pixel destination and the error message should be Event type random is not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: commonDestination,
            message: generateSimplifiedGroupPayload({
              userId: 'user123',
              groupId: 'XUepkK',
              traits: {
                subscribe: true,
              },
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '+12 345 678 900',
                  consent: ['email'],
                },
              },
              timestamp: '2023-10-14T00:21:34.208Z',
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Message type group not supported',
            statTags: commonStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'fbPixel-validation-test-2',
    name: 'facebook_pixel',
    description: '[Error]: validate event date and time',
    scenario: 'Framework + business',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are sending an event which is older than 7 days and the error message should be Events must be sent within seven days of their occurrence or up to one minute in the future.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'TestEven001',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                  plan_details: {
                    plan_type: 'gold',
                    duration: '3 months',
                  },
                },
              },
              properties: {
                revenue: 400,
                additional_bet_index: 0,
              },
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
            destination: commonDestination,
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
              'Events must be sent within seven days of their occurrence or up to one minute in the future.',
            statTags: commonStatTags,
          },
        ],
      },
    },
  },
];
