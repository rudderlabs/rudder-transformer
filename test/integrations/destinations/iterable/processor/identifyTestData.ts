import {
  generateMetadata,
  transformResultBuilder,
  generateIndentifyPayload,
  overrideDestination,
} from './../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';

const destination: Destination = {
  ID: '123',
  Name: 'iterable',
  DestinationDefinition: {
    ID: '123',
    Name: 'iterable',
    DisplayName: 'Iterable',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: {
    apiKey: 'testApiKey',
    dataCenter: 'USDC',
    preferUserId: false,
    trackAllPages: true,
    trackNamedPages: false,
    mapToSingleEvent: false,
    trackCategorisedPages: false,
  },
  Enabled: true,
};

const headers = {
  api_key: 'testApiKey',
  'Content-Type': 'application/json',
};

const user1Traits = {
  name: 'manashi',
  country: 'India',
  city: 'Bangalore',
  email: 'manashi@website.com',
};

const user2Traits = {
  am_pm: 'AM',
  pPower: 'AM',
  boolean: true,
  userId: 'Jacqueline',
  firstname: 'Jacqueline',
  administrative_unit: 'Minnesota',
};

const userId = 'userId';
const anonymousId = 'anonId';
const sentAt = '2020-08-28T16:26:16.473Z';
const originalTimestamp = '2020-08-28T16:26:06.468Z';

const updateUserEndpoint = 'https://api.iterable.com/api/users/update';
const updateUserEndpointEUDC = 'https://api.eu.iterable.com/api/users/update';

export const identifyTestData: ProcessorTestData[] = [
  {
    id: 'iterable-identify-test-1',
    name: 'iterable',
    description: 'Indentify call to update user in iterable with user traits',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update user payload with all user traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              anonymousId,
              context: {
                traits: user1Traits,
              },
              traits: user1Traits,
              type: 'identify',
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: updateUserEndpoint,
              JSON: {
                email: user1Traits.email,
                userId: anonymousId,
                dataFields: user1Traits,
                preferUserId: false,
                mergeNestedObjects: true,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-identify-test-2',
    name: 'iterable',
    description: 'Indentify call to update user email',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update user payload with new email sent in payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateIndentifyPayload({
              userId,
              anonymousId,
              context: {
                traits: { email: 'ruchira@rudderlabs.com' },
              },
              type: 'identify',
              sentAt,
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: updateUserEndpoint,
              JSON: {
                email: 'ruchira@rudderlabs.com',
                userId,
                dataFields: {
                  email: 'ruchira@rudderlabs.com',
                },
                preferUserId: false,
                mergeNestedObjects: true,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-identify-test-3',
    name: 'iterable',
    description: 'Indentify call to update user email with preferUserId config set to true',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update user payload with new email sent in payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { ...destination, Config: { ...destination.Config, preferUserId: true } },
            message: generateIndentifyPayload({
              userId,
              anonymousId,
              context: {
                traits: { email: 'ruchira@rudderlabs.com' },
              },
              type: 'identify',
              sentAt,
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: updateUserEndpoint,
              JSON: {
                email: 'ruchira@rudderlabs.com',
                userId,
                dataFields: {
                  email: 'ruchira@rudderlabs.com',
                },
                preferUserId: true,
                mergeNestedObjects: true,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-identify-test-4',
    name: 'iterable',
    description:
      'Indentify call to update user email with traits present at root instead of context.traits',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update user payload with new email sent in payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { ...destination, Config: { ...destination.Config, preferUserId: true } },
            message: generateIndentifyPayload({
              userId,
              anonymousId,
              context: {
                traits: {},
              },
              traits: { email: 'ruchira@rudderlabs.com' },
              type: 'identify',
              sentAt,
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: updateUserEndpoint,
              JSON: {
                email: 'ruchira@rudderlabs.com',
                userId,
                dataFields: {
                  email: 'ruchira@rudderlabs.com',
                },
                preferUserId: true,
                mergeNestedObjects: true,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-identify-test-5',
    name: 'iterable',
    description: 'Iterable rEtl test to update user',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update user payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { ...destination, Config: { ...destination.Config, preferUserId: true } },
            message: {
              userId,
              anonymousId,
              context: {
                externalId: [
                  {
                    id: 'lynnanderson@smith.net',
                    identifierType: 'email',
                    type: 'ITERABLE-users',
                  },
                ],
                mappedToDestination: 'true',
              },
              traits: user2Traits,
              type: 'identify',
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: updateUserEndpoint,
              JSON: {
                email: 'lynnanderson@smith.net',
                userId,
                dataFields: { ...user2Traits, email: 'lynnanderson@smith.net' },
                preferUserId: true,
                mergeNestedObjects: true,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-identify-test-6',
    name: 'iterable',
    description: 'Iterable rEtl test to update user traits',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update user payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              userId: 'Matthew',
              anonymousId,
              context: {
                externalId: [
                  {
                    id: 'Matthew',
                    identifierType: 'userId',
                    type: 'ITERABLE-users',
                  },
                ],
                mappedToDestination: 'true',
              },
              traits: user2Traits,
              type: 'identify',
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: updateUserEndpoint,
              JSON: {
                userId: 'Matthew',
                dataFields: { ...user2Traits, userId: 'Matthew' },
                preferUserId: false,
                mergeNestedObjects: true,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-identify-test-7',
    name: 'iterable',
    description: 'Indentify call to update user in iterable with EUDC dataCenter',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update user payload with all user traits and updateUserEndpointEUDC',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { dataCenter: 'EUDC' }),
            message: {
              anonymousId,
              context: {
                traits: user1Traits,
              },
              traits: user1Traits,
              type: 'identify',
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: updateUserEndpointEUDC,
              JSON: {
                email: user1Traits.email,
                userId: anonymousId,
                dataFields: user1Traits,
                preferUserId: false,
                mergeNestedObjects: true,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
