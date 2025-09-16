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
    publicApiKey: 'dummyPublicApiKey',
    privateApiKey: secret1,
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
  revision: '2023-02-22',
};

const eventEndPoint = 'https://a.klaviyo.com/api/events';

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'klaviyo-track-test-1',
    name: 'klaviyo',
    description: 'Track event call with flatten properties enabled in destination config',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain flattened properties in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { flattenProperties: true }),
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'TestEven001',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              context: {
                traits: {
                  ...commonTraits,
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                  plan_details: {
                    plan_type: 'gold',
                    duration: '3 months',
                  },
                },
              },
              properties: {
                vicePresdentInfo: commonProps,
              },
              messageId: 'someMessageId',
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'event',
                  attributes: {
                    metric: {
                      name: 'TestEven001',
                    },
                    properties: {
                      'vicePresdentInfo.PreviouslVicePresident': true,
                      'vicePresdentInfo.VicePresidents': ['AaronBurr', 'GeorgeClinton'],
                      'vicePresdentInfo.YearElected': 1801,
                    },
                    profile: {
                      $email: 'test@rudderstack.com',
                      $phone_number: '9112340375',
                      $id: 'sajal12',
                      age: '22',
                      'plan_details.plan_type': 'gold',
                      'plan_details.duration': '3 months',
                    },
                  },
                },
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-track-test-2',
    name: 'klaviyo',
    description: 'Simple track event call',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain contextual traits and properties in the payload',
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
                  phone: '9112340375',
                  description: 'Sample description',
                },
              },
              properties: {
                ...commonProps,
                revenue: 3000,
              },
              anonymousId: '9c6bd77ea9da3e68',
              messageId: 'someMessageId',
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
                      name: 'TestEven002',
                    },
                    properties: commonProps,
                    profile: {
                      $email: 'test@rudderstack.com',
                      $phone_number: '9112340375',
                      $id: 'sajal12',
                      age: '22',
                      name: 'Test',
                      description: 'Sample description',
                    },
                    value: 3000,
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
    id: 'klaviyo-track-test-3',
    name: 'klaviyo',
    description: 'Track event call, with make email or phone as primary identifier toggle on',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain contextual traits and properties in the payload, and email should be mapped to $email and userId should be mapped to _id',
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
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
              },
              properties: commonProps,
              anonymousId: '9c6bd77ea9da3e68',
              messageId: 'someMessageId',
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
                      name: 'TestEven001',
                    },
                    properties: commonProps,
                    profile: {
                      $email: 'test@rudderstack.com',
                      $phone_number: '9112340375',
                      age: '22',
                      _id: 'sajal12',
                    },
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
    id: 'klaviyo-track-test-4',
    name: 'klaviyo',
    description:
      'Track event call, without email and phone & with (make email or phone as primary identifier) toggle on',
    scenario: 'Business',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are not sending email and phone in the payload and enforceEmailAsPrimary is enabled from UI',
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
                traits: commonTraits,
              },
              properties: commonProps,
              anonymousId: '9c6bd77ea9da3e68',
              messageId: 'someMessageId',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
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
            error: 'None of email and phone are present in the payload',
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
            metadata: generateMetadata(4),
          },
        ],
      },
    },
  },
];
