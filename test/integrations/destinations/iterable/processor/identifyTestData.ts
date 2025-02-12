import { ProcessorTestData } from '../../../testTypes';
import { Metadata } from '../../../../../src/types';

const baseMetadata: Metadata = {
  sourceId: 'default-sourceId',
  workspaceId: 'default-workspaceId',
  namespace: 'default-namespace',
  instanceId: 'default-instance',
  sourceType: 'default-source-type',
  sourceCategory: 'default-category',
  trackingPlanId: 'default-tracking-plan',
  trackingPlanVersion: 1,
  sourceTpConfig: {},
  mergedTpConfig: {},
  destinationId: 'default-destinationId',
  jobRunId: 'default-job-run',
  jobId: 1,
  sourceBatchId: 'default-batch',
  sourceJobId: 'default-source-job',
  sourceJobRunId: 'default-source-job-run',
  sourceTaskId: 'default-task',
  sourceTaskRunId: 'default-task-run',
  recordId: {},
  destinationType: 'default-destination-type',
  messageId: 'default-message-id',
  oauthAccessToken: 'default-token',
  messageIds: ['default-message-id'],
  rudderId: 'default-rudder-id',
  receivedAt: '2025-01-06T03:57:13.523Z',
  eventName: 'default-event',
  eventType: 'default-type',
  sourceDefinitionId: 'default-source-def',
  destinationDefinitionId: 'default-dest-def',
  transformationId: 'default-transform',
  dontBatch: false,
};

export const identifyTestData: ProcessorTestData[] = [
  {
    id: 'iterable-identify-test-has-multiple-responses',
    name: 'iterable',
    description: 'Indentify call to verify hasMultipleResponses',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update user payload with new email sent in payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-08-28T16:26:16.473Z',
              userId: 'userId',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '1.12.3',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  email: 'ruchira@rudderlabs.com',
                },
                locale: 'en-US',
                device: {
                  token: 'token',
                  id: 'id',
                  type: 'ios',
                },
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '62amo6xzksaeyupr4y0pfaucwj0upzs6g7yx',
              messageId: 'hk02avz2xijdkid4i0mvncbm478g9lybdpgc',
              anonymousId: 'anonId',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '123',
              Name: 'iterable',
              DestinationDefinition: {
                ID: '123',
                Name: 'iterable',
                DisplayName: 'Iterable',
                Config: {},
              },
              Config: {
                apiKey: 'testApiKey',
                dataCenter: 'USDC',
                registerDeviceOrBrowserApiKey: 'randomApiKey',
                preferUserId: false,
                trackAllPages: true,
                trackNamedPages: false,
                mapToSingleEvent: false,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  email: 'ruchira@rudderlabs.com',
                  userId: 'userId',
                  dataFields: {
                    email: 'ruchira@rudderlabs.com',
                  },
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
          {
            output: {
              body: {
                FORM: {},
                JSON: {
                  device: {
                    platform: 'APNS',
                    token: 'token',
                  },
                  email: 'ruchira@rudderlabs.com',
                  preferUserId: false,
                  userId: 'userId',
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.iterable.com/api/users/registerDeviceToken',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                api_key: 'randomApiKey',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'iterable-identify-test-has-multiple-responses',
    name: 'iterable',
    description: 'Indentify call to verify hasMultipleResponses',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update user payload with new email sent in payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-08-28T16:26:16.473Z',
              userId: 'userId',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '1.12.3',
                  token: 'randomBrowserToken',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  email: 'ruchira@rudderlabs.com',
                },
                locale: 'en-US',
                device: {
                  id: 'id',
                  type: 'ios',
                },
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '62amo6xzksaeyupr4y0pfaucwj0upzs6g7yx',
              messageId: 'hk02avz2xijdkid4i0mvncbm478g9lybdpgc',
              anonymousId: 'anonId',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '123',
              Name: 'iterable',
              DestinationDefinition: {
                ID: '123',
                Name: 'iterable',
                DisplayName: 'Iterable',
                Config: {},
              },
              Config: {
                apiKey: 'testApiKey',
                dataCenter: 'USDC',
                registerDeviceOrBrowserApiKey: 'randomApiKey',
                preferUserId: false,
                trackAllPages: true,
                trackNamedPages: false,
                mapToSingleEvent: false,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
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
            metadata: {
              destinationDefinitionId: 'default-dest-def',
              destinationId: 'default-destinationId',
              destinationType: 'default-destination-type',
              dontBatch: false,
              eventName: 'default-event',
              eventType: 'default-type',
              instanceId: 'default-instance',
              jobId: 1,
              jobRunId: 'default-job-run',
              mergedTpConfig: {},
              messageId: 'default-message-id',
              messageIds: ['default-message-id'],
              namespace: 'default-namespace',
              oauthAccessToken: 'default-token',
              receivedAt: '2025-01-06T03:57:13.523Z',
              recordId: {},
              rudderId: 'default-rudder-id',
              sourceBatchId: 'default-batch',
              sourceCategory: 'default-category',
              sourceDefinitionId: 'default-source-def',
              sourceId: 'default-sourceId',
              sourceJobId: 'default-source-job',
              sourceJobRunId: 'default-source-job-run',
              sourceTaskId: 'default-task',
              sourceTaskRunId: 'default-task-run',
              sourceTpConfig: {},
              sourceType: 'default-source-type',
              trackingPlanId: 'default-tracking-plan',
              trackingPlanVersion: 1,
              transformationId: 'default-transform',
              workspaceId: 'default-workspaceId',
            },
            output: {
              body: {
                FORM: {},
                JSON: {
                  dataFields: {
                    email: 'ruchira@rudderlabs.com',
                  },
                  email: 'ruchira@rudderlabs.com',
                  mergeNestedObjects: true,
                  preferUserId: false,
                  userId: 'userId',
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.iterable.com/api/users/update',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                api_key: 'testApiKey',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
          {
            metadata: {
              destinationDefinitionId: 'default-dest-def',
              destinationId: 'default-destinationId',
              destinationType: 'default-destination-type',
              dontBatch: false,
              eventName: 'default-event',
              eventType: 'default-type',
              instanceId: 'default-instance',
              jobId: 1,
              jobRunId: 'default-job-run',
              mergedTpConfig: {},
              messageId: 'default-message-id',
              messageIds: ['default-message-id'],
              namespace: 'default-namespace',
              oauthAccessToken: 'default-token',
              receivedAt: '2025-01-06T03:57:13.523Z',
              recordId: {},
              rudderId: 'default-rudder-id',
              sourceBatchId: 'default-batch',
              sourceCategory: 'default-category',
              sourceDefinitionId: 'default-source-def',
              sourceId: 'default-sourceId',
              sourceJobId: 'default-source-job',
              sourceJobRunId: 'default-source-job-run',
              sourceTaskId: 'default-task',
              sourceTaskRunId: 'default-task-run',
              sourceTpConfig: {},
              sourceType: 'default-source-type',
              trackingPlanId: 'default-tracking-plan',
              trackingPlanVersion: 1,
              transformationId: 'default-transform',
              workspaceId: 'default-workspaceId',
            },
            output: {
              body: {
                FORM: {},
                JSON: {
                  browserToken: 'randomBrowserToken',
                  email: 'ruchira@rudderlabs.com',
                  userId: 'userId',
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.iterable.com/api/users/registerBrowserToken',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                api_key: 'randomApiKey',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
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
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: 'anonId',
              context: {
                traits: {
                  name: 'manashi',
                  country: 'India',
                  city: 'Bangalore',
                  email: 'manashi@website.com',
                },
              },
              traits: {
                name: 'manashi',
                country: 'India',
                city: 'Bangalore',
                email: 'manashi@website.com',
              },
              type: 'identify',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '123',
              Name: 'iterable',
              DestinationDefinition: {
                ID: '123',
                Name: 'iterable',
                DisplayName: 'Iterable',
                Config: {},
              },
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
              WorkspaceID: '123',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  email: 'manashi@website.com',
                  userId: 'anonId',
                  dataFields: {
                    name: 'manashi',
                    country: 'India',
                    city: 'Bangalore',
                    email: 'manashi@website.com',
                  },
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata: baseMetadata,
            statusCode: 200,
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
        method: 'POST',
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-08-28T16:26:16.473Z',
              userId: 'userId',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '1.12.3',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  email: 'ruchira@rudderlabs.com',
                },
                locale: 'en-US',
                device: {
                  token: 'token',
                  id: 'id',
                  type: 'ios',
                },
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '62amo6xzksaeyupr4y0pfaucwj0upzs6g7yx',
              messageId: 'hk02avz2xijdkid4i0mvncbm478g9lybdpgc',
              anonymousId: 'anonId',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '123',
              Name: 'iterable',
              DestinationDefinition: {
                ID: '123',
                Name: 'iterable',
                DisplayName: 'Iterable',
                Config: {},
              },
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
              WorkspaceID: '123',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  email: 'ruchira@rudderlabs.com',
                  userId: 'userId',
                  dataFields: {
                    email: 'ruchira@rudderlabs.com',
                  },
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata: baseMetadata,
            statusCode: 200,
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
        method: 'POST',
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-08-28T16:26:16.473Z',
              userId: 'userId',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '1.12.3',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  email: 'ruchira@rudderlabs.com',
                },
                locale: 'en-US',
                device: {
                  token: 'token',
                  id: 'id',
                  type: 'ios',
                },
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '1bbuv14fd7e8ogmsx7prcmw6ob37aq1zj6mo',
              messageId: '1y56axyob5fp3lg3b1y1pij50kp15pyc2ubj',
              anonymousId: 'anonId',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '123',
              Name: 'iterable',
              DestinationDefinition: {
                ID: '123',
                Name: 'iterable',
                DisplayName: 'Iterable',
                Config: {},
              },
              Config: {
                apiKey: 'testApiKey',
                dataCenter: 'USDC',
                preferUserId: true,
                trackAllPages: true,
                trackNamedPages: false,
                mapToSingleEvent: false,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  email: 'ruchira@rudderlabs.com',
                  userId: 'userId',
                  dataFields: {
                    email: 'ruchira@rudderlabs.com',
                  },
                  preferUserId: true,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata: baseMetadata,
            statusCode: 200,
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
        method: 'POST',
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-08-28T16:26:16.473Z',
              userId: 'userId',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '1.12.3',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {},
                locale: 'en-US',
                device: {
                  token: 'token',
                  id: 'id',
                  type: 'ios',
                },
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              traits: {
                email: 'ruchira@rudderlabs.com',
              },
              rudderId: 'iakido48935yw0kmw2swvjldsqoaophjzlhe',
              messageId: 'hzycemnjaxr9cuqyyh003x9zlwfqnvbgzv4n',
              anonymousId: 'anonId',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '123',
              Name: 'iterable',
              DestinationDefinition: {
                ID: '123',
                Name: 'iterable',
                DisplayName: 'Iterable',
                Config: {},
              },
              Config: {
                apiKey: 'testApiKey',
                dataCenter: 'USDC',
                preferUserId: true,
                trackAllPages: true,
                trackNamedPages: false,
                mapToSingleEvent: false,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  email: 'ruchira@rudderlabs.com',
                  userId: 'userId',
                  dataFields: {
                    email: 'ruchira@rudderlabs.com',
                  },
                  preferUserId: true,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata: baseMetadata,
            statusCode: 200,
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
        method: 'POST',
        body: [
          {
            message: {
              userId: 'userId',
              anonymousId: 'anonId',
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
              traits: {
                am_pm: 'AM',
                pPower: 'AM',
                boolean: true,
                userId: 'Jacqueline',
                firstname: 'Jacqueline',
                administrative_unit: 'Minnesota',
              },
              type: 'identify',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '123',
              Name: 'iterable',
              DestinationDefinition: {
                ID: '123',
                Name: 'iterable',
                DisplayName: 'Iterable',
                Config: {},
              },
              Config: {
                apiKey: 'testApiKey',
                dataCenter: 'USDC',
                preferUserId: true,
                trackAllPages: true,
                trackNamedPages: false,
                mapToSingleEvent: false,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  email: 'lynnanderson@smith.net',
                  userId: 'userId',
                  dataFields: {
                    am_pm: 'AM',
                    pPower: 'AM',
                    boolean: true,
                    userId: 'Jacqueline',
                    firstname: 'Jacqueline',
                    administrative_unit: 'Minnesota',
                    email: 'lynnanderson@smith.net',
                  },
                  preferUserId: true,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata: baseMetadata,
            statusCode: 200,
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
        method: 'POST',
        body: [
          {
            message: {
              userId: 'Matthew',
              anonymousId: 'anonId',
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
              traits: {
                am_pm: 'AM',
                pPower: 'AM',
                boolean: true,
                userId: 'Jacqueline',
                firstname: 'Jacqueline',
                administrative_unit: 'Minnesota',
              },
              type: 'identify',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '123',
              Name: 'iterable',
              DestinationDefinition: {
                ID: '123',
                Name: 'iterable',
                DisplayName: 'Iterable',
                Config: {},
              },
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
              WorkspaceID: '123',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  userId: 'Matthew',
                  dataFields: {
                    am_pm: 'AM',
                    pPower: 'AM',
                    boolean: true,
                    userId: 'Matthew',
                    firstname: 'Jacqueline',
                    administrative_unit: 'Minnesota',
                  },
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata: baseMetadata,
            statusCode: 200,
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
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: 'anonId',
              context: {
                traits: {
                  name: 'manashi',
                  country: 'India',
                  city: 'Bangalore',
                  email: 'manashi@website.com',
                },
              },
              traits: {
                name: 'manashi',
                country: 'India',
                city: 'Bangalore',
                email: 'manashi@website.com',
              },
              type: 'identify',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '123',
              Name: 'iterable',
              DestinationDefinition: {
                ID: '123',
                Name: 'iterable',
                DisplayName: 'Iterable',
                Config: {},
              },
              Config: {
                apiKey: 'testApiKey',
                dataCenter: 'EUDC',
                preferUserId: false,
                trackAllPages: true,
                trackNamedPages: false,
                mapToSingleEvent: false,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.eu.iterable.com/api/users/update',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  email: 'manashi@website.com',
                  userId: 'anonId',
                  dataFields: {
                    name: 'manashi',
                    country: 'India',
                    city: 'Bangalore',
                    email: 'manashi@website.com',
                  },
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
];
