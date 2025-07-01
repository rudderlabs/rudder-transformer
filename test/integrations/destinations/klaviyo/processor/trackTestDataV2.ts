import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedTrackPayload,
  generateTrackPayload,
  overrideDestination,
  transformResultBuilder,
} from '../../../testUtils';
import { secret1, authHeader1 } from '../maskedSecrets';
const destination: Destination = {
  ID: '123',
  Name: 'klaviyo',
  DestinationDefinition: {
    ID: '123',
    Name: 'klaviyo',
    DisplayName: 'klaviyo',
    Config: {},
  },
  Config: {
    privateApiKey: secret1,
    apiVersion: 'v2',
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const commonTraits = {
  id: 'user@1',
  age: '22',
  anonymousId: '9c6bd77ea9da3e68',
};

const commonProps = {
  PreviouslVicePresident: true,
  YearElected: 1801,
  VicePresidents: ['AaronBurr', 'GeorgeClinton'],
};

const commonOutputHeaders = {
  Accept: 'application/json',
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  revision: '2024-10-15',
};
const profileAttributes = {
  email: 'test@rudderstack.com',
  phone_number: '+9112340375',
  anonymous_id: '9c6bd77ea9da3e68',
  properties: {
    age: '22',
    name: 'Test',
    description: 'Sample description',
    id: 'user@1',
  },
  meta: {
    patch_properties: {},
  },
};
const eventEndPoint = 'https://a.klaviyo.com/api/events';

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'klaviyo-track-150624-test-1',
    name: 'klaviyo',
    description: '150624 -> Simple track event call',
    scenario: 'Business',
    successCriteria:
      'Response should contain profile and event payload and status code should be 200, for the event payload should contain contextual traits and properties in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'TestEven002',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  name: 'Test',
                  email: 'test@rudderstack.com',
                  phone: '+9112340375',
                  description: 'Sample description',
                },
              },
              properties: {
                ...commonProps,
                revenue: 3000,
                currency: 'USD',
              },
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
            metadata: generateMetadata(2),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'event',
                  attributes: {
                    metric: {
                      data: {
                        type: 'metric',
                        attributes: {
                          name: 'TestEven002',
                        },
                      },
                    },
                    profile: {
                      data: {
                        type: 'profile',
                        attributes: { ...profileAttributes, external_id: 'sajal12' },
                      },
                    },
                    properties: commonProps,
                    value: 3000,
                    value_currency: 'USD',
                    time: '2021-01-25T15:32:56.409Z',
                  },
                },
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(2),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-track-150624-test-2',
    name: 'klaviyo',
    description:
      '150624 -> Track event call, with make email or phone as primary identifier toggle on',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload with profile object and status code should be 200, for the event payload should contain contextual traits and properties in the payload, and email should be mapped to email and userId should be mapped to external_id as usual',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { enforceEmailAsPrimary: true }),
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'TestEven001',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  description: 'Sample description',
                  name: 'Test',
                  email: 'test@rudderstack.com',
                  phone: '+9112340375',
                },
              },
              properties: commonProps,
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
            metadata: generateMetadata(3),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'event',
                  attributes: {
                    metric: {
                      data: {
                        type: 'metric',
                        attributes: {
                          name: 'TestEven001',
                        },
                      },
                    },
                    properties: commonProps,
                    profile: {
                      data: {
                        type: 'profile',
                        attributes: {
                          ...profileAttributes,
                          properties: { ...profileAttributes.properties, _id: 'sajal12' },
                        },
                      },
                    },
                    time: '2021-01-25T15:32:56.409Z',
                  },
                },
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(3),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-track-150624-test-3',
    name: 'klaviyo',
    description: '150624 -> Invalid `value` Field Format',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload with vallue field as object and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { enforceEmailAsPrimary: true }),
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'TestEven001',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  description: 'Sample description',
                  name: 'Test',
                  email: 'test@rudderstack.com',
                  phone: '+9112340375',
                },
              },
              properties: { ...commonProps, value: { price: 9.99 } },
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            }),
            metadata: generateMetadata(1),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Invalid float value',
            statTags: {
              destType: 'KLAVIYO',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-track-150624-test-4',
    name: 'klaviyo',
    description: '150624 -> Track event call, with phone not in E.164 format',
    scenario: 'Business',
    successCriteria:
      'Response should an error message and status code should be 400, as Phone number is not in E.164 format.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { enforceEmailAsPrimary: true }),
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'TestEven001',
              sentAt: '2025-01-01T11:11:11.111Z',
              userId: 'invalidPhoneUser',
              context: {
                traits: {
                  ...commonTraits,
                  description: 'Sample description',
                  name: 'Test',
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
              },
              properties: commonProps,
              originalTimestamp: '2025-01-01T11:11:11.111Z',
            }),
            metadata: generateMetadata(4),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Phone number is not in E.164 format.',
            statTags: {
              destType: 'KLAVIYO',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(4),
          },
        ],
      },
    },
  },
];
