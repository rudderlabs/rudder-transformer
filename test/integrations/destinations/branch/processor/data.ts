/**
 * Auto-migrated and optimized test cases
 * Generated on: 2024-12-30T11:04:59.426Z
 */

import { ProcessorTestData } from '../../../testTypes';
import { Metadata } from '../../../../../src/types';

const baseMetadata: Partial<Metadata> = {
  sourceId: 'default-source',
  workspaceId: 'default-workspace',
  namespace: 'default-namespace',
  instanceId: 'default-instance',
  sourceType: 'default-source-type',
  sourceCategory: 'default-category',
  trackingPlanId: 'default-tracking-plan',
  trackingPlanVersion: 1,
  sourceTpConfig: {},
  mergedTpConfig: {},
  destinationId: 'default-destination',
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
  receivedAt: '2024-12-30T11:04:58.693Z',
  eventName: 'default-event',
  eventType: 'default-type',
  sourceDefinitionId: 'default-source-def',
  destinationDefinitionId: 'default-dest-def',
  transformationId: 'default-transform',
  dontBatch: false,
};

export const data: ProcessorTestData[] = [
  {
    id: 'processor-1735556699424',
    name: 'branch',
    description: 'Test 0',
    scenario:
      'Success scenario where the event will be mapped to standard event through default mappings',
    successCriteria: 'Should hit the standard endpoint',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'sampath',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'product added',
              integrations: {
                All: true,
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              properties: {
                name: 'sampath',
              },
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              request_ip: '[::1]:64059',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
              type: 'track',
              userId: 'sampath',
            },
            metadata: baseMetadata,
            destination: {
              ID: '1WTpIHpH7NTBgjeiUPW1kCUgZGI',
              Name: 'branch test',
              DestinationDefinition: {
                DisplayName: 'Branch Metrics',
                ID: '1WTpBSTiL3iAUHUdW7rHT4sawgU',
                Name: 'BRANCH',
                Config: {},
              },
              Config: {
                branchKey: '<branch key goes here>',
                useNativeSDK: false,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.branch.io/v2/event/standard',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  branch_key: '<branch key goes here>',
                  name: 'ADD_TO_CART',
                  content_items: [
                    {
                      $product_name: 'sampath',
                    },
                  ],
                  user_data: {
                    os: 'iOS',
                    os_version: '14.4.1',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1735556699424',
    name: 'branch',
    description: 'Test 1',
    scenario: 'Success scenario with identify event',
    successCriteria: 'Should hit the custom endpoint with userId as event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'sampath',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  attTrackingStatus: 2,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'sampath',
                email: 'sampath@gmail.com',
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              request_ip: '[::1]:64059',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
              type: 'identify',
              userId: 'sampath',
            },
            metadata: baseMetadata,
            destination: {
              ID: '1WTpIHpH7NTBgjeiUPW1kCUgZGI',
              Name: 'branch test',
              DestinationDefinition: {
                DisplayName: 'Branch Metrics',
                ID: '1WTpBSTiL3iAUHUdW7rHT4sawgU',
                Name: 'BRANCH',
                Config: {},
              },
              Config: {
                branchKey: '<branch key goes here>',
                useNativeSDK: false,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.branch.io/v2/event/custom',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  branch_key: '<branch key goes here>',
                  name: 'sampath',
                  custom_data: {
                    anonymousId: 'sampath',
                    email: 'sampath@gmail.com',
                  },
                  content_items: [{}],
                  user_data: {
                    os: 'Android',
                    os_version: '9',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    android_id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    aaid: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: true,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1735556699424',
    name: 'branch',
    description: 'Test 2',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'sampath',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'tvos',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'product added',
              integrations: {
                All: true,
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              properties: {
                name: 'sampath',
              },
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              request_ip: '[::1]:64059',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
              type: 'track',
              userId: 'sampath',
            },
            metadata: baseMetadata,
            destination: {
              ID: '1WTpIHpH7NTBgjeiUPW1kCUgZGI',
              Name: 'branch test',
              DestinationDefinition: {
                DisplayName: 'Branch Metrics',
                ID: '1WTpBSTiL3iAUHUdW7rHT4sawgU',
                Name: 'BRANCH',
                Config: {},
              },
              Config: {
                branchKey: '<branch key goes here>',
                useNativeSDK: false,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.branch.io/v2/event/standard',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  content_items: [
                    {
                      $product_name: 'sampath',
                    },
                  ],
                  user_data: {
                    os: 'tvos',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                  name: 'ADD_TO_CART',
                  branch_key: '<branch key goes here>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1735556699424',
    name: 'branch',
    description: 'Test 3',
    scenario: 'Successful scenario with track event but without any products',
    successCriteria: 'The transformed payload should not contain any content_items',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'sampath',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'product added',
              integrations: {
                All: true,
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              request_ip: '[::1]:64059',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
              type: 'track',
              userId: 'sampath',
            },
            metadata: baseMetadata,
            destination: {
              ID: '1WTpIHpH7NTBgjeiUPW1kCUgZGI',
              Name: 'branch test',
              DestinationDefinition: {
                DisplayName: 'Branch Metrics',
                ID: '1WTpBSTiL3iAUHUdW7rHT4sawgU',
                Name: 'BRANCH',
                Config: {},
              },
              Config: {
                branchKey: '<branch key goes here>',
                useNativeSDK: false,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.branch.io/v2/event/standard',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user_data: {
                    os: 'iOS',
                    os_version: '14.4.1',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                  name: 'ADD_TO_CART',
                  branch_key: '<branch key goes here>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1735556699425',
    name: 'branch',
    description: 'Test 4',
    scenario: 'Failure scenario when event name is not present',
    successCriteria: 'Should return error message for missing event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'sampath',
              channel: 'web',
              context: {
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              request_ip: '[::1]:64059',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
              type: 'track',
              userId: 'sampath',
            },
            metadata: baseMetadata,
            destination: {
              ID: '1WTpIHpH7NTBgjeiUPW1kCUgZGI',
              Name: 'branch test',
              DestinationDefinition: {
                DisplayName: 'Branch Metrics',
                ID: '1WTpBSTiL3iAUHUdW7rHT4sawgU',
                Name: 'BRANCH',
                Config: {},
              },
              Config: {
                branchKey: '<branch key goes here>',
                useNativeSDK: false,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
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
            metadata: baseMetadata,
            statusCode: 400,
            error: 'Event name is required',
            statTags: {
              destType: 'BRANCH',
              destinationId: 'default-destination',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspace',
            },
          },
        ],
      },
    },
  },
  {
    id: 'processor-1735556699425',
    name: 'branch',
    description: 'Test 5',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: 'anonId123',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'anonId123',
                  email: 'test_user@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Some Random Event',
              integrations: {
                All: true,
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              properties: {
                name: 't-shirt',
                revenue: '10',
                currency: 'USD',
                key1: 'value1',
                key2: 'value2',
                order_id: 'order123',
              },
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              request_ip: '[::1]:64059',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
              type: 'track',
              userId: 'userId123',
            },
            metadata: baseMetadata,
            destination: {
              ID: '1WTpIHpH7NTBgjeiUPW1kCUgZGI',
              Name: 'branch test',
              DestinationDefinition: {
                DisplayName: 'Branch Metrics',
                ID: '1WTpBSTiL3iAUHUdW7rHT4sawgU',
                Name: 'BRANCH',
                Config: {},
              },
              Config: {
                branchKey: 'test_branch_key',
                eventsMapping: [
                  {
                    from: 'Some Random Event',
                    to: 'PURCHASE',
                  },
                ],
                useNativeSDK: false,
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
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
              method: 'POST',
              endpoint: 'https://api2.branch.io/v2/event/standard',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  branch_key: 'test_branch_key',
                  name: 'PURCHASE',
                  content_items: [
                    {
                      $product_name: 't-shirt',
                    },
                  ],
                  event_data: {
                    revenue: '10',
                    currency: 'USD',
                  },
                  custom_data: {
                    key1: 'value1',
                    key2: 'value2',
                    order_id: 'order123',
                  },
                  user_data: {
                    os: 'iOS',
                    os_version: '14.4.1',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'userId123',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'anonId123',
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
];
