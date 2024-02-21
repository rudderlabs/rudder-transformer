import { destination } from './commonConfig';

export const validationFailures = [
  {
    id: 'Ninetailed-validation-test-1',
    name: 'NINETAILED',
    description: 'Required field anonymousId not present',
    scenario: 'Framework',
    successCriteria: 'Transformationn Error for anonymousId not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'product purchased',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              context: {
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                campaign: {
                  name: 'campign_123',
                  source: 'social marketing',
                  medium: 'facebook',
                  term: '1 year',
                },
                library: {
                  name: 'RudderstackSDK',
                  version: 'Ruddderstack SDK version',
                },
                locale: 'en-US',
                page: {
                  path: '/signup',
                  referrer: 'https://rudderstack.medium.com/',
                  search: '?type=freetrial',
                  url: 'https://app.rudderstack.com/signup?type=freetrial',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                location: {
                  coordinates: {
                    latitude: 40.7128,
                    longitude: -74.006,
                  },
                  city: 'San Francisco',
                  postalCode: '94107',
                  region: 'CA',
                  regionCode: 'CA',
                  country: '  United States',
                  countryCode: 'United States of America',
                  continent: 'North America',
                  timezone: 'America/Los_Angeles',
                },
                type: 'track',
                event: 'product purchased',
                userId: 'sajal12',
                channel: 'mobile',
                messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
                properties: {},
                anonymousId: '9c6bd77ea9da3e68',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-25T15:32:56.409Z',
              },
              properties: {
                products: [{}],
              },
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
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
            error:
              'Missing required value from "anonymousId": Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: Missing required value from "anonymousId"',
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
            statTags: {
              destType: 'NINETAILED',
              destinationId: 'dummyDestId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'Ninetailed-test-4',
    name: 'NINETAILED',
    description: 'Unsupported message type -> Identify',
    scenario: 'Framework',
    successCriteria: 'Transformationn Error for Unsupported message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'group',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              channel: 'mobile',
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              traits: {
                orderId: 'ord 123',
                products: [],
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
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
            error:
              'message type group is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type group is not supported',
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
            statTags: {
              destType: 'NINETAILED',
              errorCategory: 'dataValidation',
              destinationId: 'dummyDestId',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
];
