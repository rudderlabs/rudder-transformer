import { Destination } from '../../../../../src/types';
import {
  generateMetadata,
  generateSimplifiedGroupPayload,
  generateSimplifiedTrackPayload,
  generateTrackPayload,
  overrideDestination,
} from '../../../testUtils';
const commonTimestamp = new Date('2023-10-12');
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
            destination: overrideDestination(commonDestination, {
              accessToken: '09876',
              pixelId: 'dummyPixelId',
            }),
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
    description:
      'Track call : error in instrumentation as pixel id is not mentioned in destination object',
    scenario: 'Business',
    successCriteria:
      'Error: Pixel Id not found. Aborting, as we are sending an event without pixel id and the status code should be 400',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'spin_result',
              properties: {
                revenue: 400,
                additional_bet_index: 0,
              },
              context: {
                traits: {
                  email: 'abc@gmail.com',
                },
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
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
            error: 'Pixel Id not found. Aborting',
            metadata: generateMetadata(1),
            statTags: {
              ...commonStatTags,
              destinationId: 'default-destinationId',
              errorType: 'configuration',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'fbPixel-validation-test-3',
    name: 'facebook_pixel',
    description: 'Track call : custom event calls with simple user properties and traits',
    scenario: 'Business',
    successCriteria:
      'event not respecting the internal mapping and as well as UI mapping should be considered as a custom event and should be sent as it is',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'spin_result',
              properties: {
                revenue: 400,
                additional_bet_index: 0,
              },
              context: {
                traits: {
                  email: 'abc@gmail.com',
                },
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, {
              pixelId: 'dummyPixelId',
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
            error: 'Access token not found. Aborting',
            metadata: generateMetadata(1),
            statTags: {
              ...commonStatTags,
              destinationId: 'default-destinationId',
              errorType: 'configuration',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'fbPixel-validation-test-3',
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
            destination: overrideDestination(commonDestination, {
              accessToken: '09876',
              pixelId: 'dummyPixelId',
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
            statusCode: 400,
            error:
              'Events must be sent within 7 days of their occurrence or up to one minute in the future.',
            statTags: commonStatTags,
          },
        ],
      },
    },
  },
  {
    id: 'fbPixel-validation-test-4',
    name: 'facebook_pixel',
    description:
      'Track call : error in instrumentation as event name is not mentioned in track call',
    scenario: 'Business',
    successCriteria:
      'event not respecting the internal mapping and as well as UI mapping should be considered as a custom event and should be sent as it is',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              properties: {
                revenue: 400,
                additional_bet_index: 0,
              },
            },
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, {
              pixelId: 'dummyPixelId',
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
            error: "'event' is required",
            metadata: generateMetadata(1),
            statTags: {
              ...commonStatTags,
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'fbPixel-validation-test-4',
    name: 'facebook_pixel',
    description: 'Track call : error in instrumentation as event name is not a string',
    scenario: 'Business',
    successCriteria:
      'Error message should be event name should be string and status code should be 400, as we are sending an event which is not a string',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 1234,
              properties: {
                revenue: 400,
                additional_bet_index: 0,
              },
            },
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, {
              pixelId: 'dummyPixelId',
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
            error: 'event name should be string',
            metadata: generateMetadata(1),
            statTags: {
              ...commonStatTags,
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'fbPixel-validation-test-5',
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
              // Sun Oct 15 2023
              type: 'track',
              event: 'TestEven001',
              sentAt: '2023-08-25T16:12:02.048Z',
              userId: 'sajal12',
              context: {
                traits: {
                  action_source: 'physical_store',
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                  event_id: 'x9lk3gfte768o1oy08cyaylx5t2j9q2wwfl2',
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
              originalTimestamp: '2023-08-25T15:32:56.409Z',
            }),
            destination: overrideDestination(commonDestination, {
              accessToken: '09876',
              pixelId: 'dummyPixelId',
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
            statusCode: 200,
            output: {
              body: {
                FORM: {
                  data: [
                    JSON.stringify({
                      user_data: {
                        em: '1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd',
                        ph: '820c46baccd33a1664f583b4505a7e39e033197e06e0bd7c87109e33c57c5497',
                      },
                      event_name: 'TestEven001',
                      event_time: 1692977576,
                      event_id: 'x9lk3gfte768o1oy08cyaylx5t2j9q2wwfl2',
                      action_source: 'physical_store',
                      custom_data: { additional_bet_index: 0, value: 400 },
                    }),
                  ],
                },
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://graph.facebook.com/v18.0/dummyPixelId/events?access_token=09876',
              files: {},
              headers: {},
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
          },
        ],
      },
    },
  },
];
