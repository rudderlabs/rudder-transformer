/**
 * Auto-migrated and optimized test cases
 * Generated on: 2025-06-27T06:24:57.526Z
 */

import { ProcessorStreamTestData } from '../../../testTypes';

export const data: ProcessorStreamTestData[] = [
  {
    id: 'processor-1751005497524',
    name: 'kafka',
    description: 'Test case with null destination config',
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
              anonymousId: 'anonymousId',
              context: {
                library: {
                  name: 'analytics-go',
                  version: '3.0.0',
                },
              },
              event: 'event',
              integrations: {
                Kafka: true,
              },
              messageId: 'messageId',
              originalTimestamp: '2019-07-18T15:00:00Z',
              properties: {
                key: 'value',
              },
              receivedAt: '2019-07-18T15:00:00Z',
              sentAt: '2019-07-18T15:00:00Z',
              timestamp: '2019-07-18T15:00:00Z',
              type: 'track',
              userId: 'userId',
            },
            metadata: {
              jobId: 1,
              rudderId: 'randomRudderId',
            },
            destination: {
              ID: 'kafkadestinationid',
              Name: 'Kafka',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {},
              },
              Config: {},
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
              message: {
                anonymousId: 'anonymousId',
                context: {
                  library: {
                    name: 'analytics-go',
                    version: '3.0.0',
                  },
                },
                event: 'event',
                integrations: {
                  Kafka: true,
                },
                messageId: 'messageId',
                originalTimestamp: '2019-07-18T15:00:00Z',
                properties: {
                  key: 'value',
                },
                receivedAt: '2019-07-18T15:00:00Z',
                sentAt: '2019-07-18T15:00:00Z',
                timestamp: '2019-07-18T15:00:00Z',
                type: 'track',
                userId: 'userId',
              },
              userId: 'userId',
            },
            metadata: {
              jobId: 1,
              rudderId: 'randomRudderId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751005497524',
    name: 'kafka',
    description: 'Test case without userId',
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
              anonymousId: 'anonymousId',
              context: {
                library: {
                  name: 'analytics-go',
                  version: '3.0.0',
                },
              },
              event: 'event',
              integrations: {
                Kafka: true,
              },
              messageId: 'messageId',
              originalTimestamp: '2019-07-18T15:00:00Z',
              properties: {
                key: 'value',
              },
              receivedAt: '2019-07-18T15:00:00Z',
              sentAt: '2019-07-18T15:00:00Z',
              timestamp: '2019-07-18T15:00:00Z',
              type: 'track',
            },
            metadata: {
              jobId: 2,
              rudderId: 'randomRudderId',
            },
            destination: {
              ID: 'kafkadestinationid',
              Name: 'Kafka',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {},
              },
              Config: {},
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
              message: {
                anonymousId: 'anonymousId',
                context: {
                  library: {
                    name: 'analytics-go',
                    version: '3.0.0',
                  },
                },
                event: 'event',
                integrations: {
                  Kafka: true,
                },
                messageId: 'messageId',
                originalTimestamp: '2019-07-18T15:00:00Z',
                properties: {
                  key: 'value',
                },
                receivedAt: '2019-07-18T15:00:00Z',
                sentAt: '2019-07-18T15:00:00Z',
                timestamp: '2019-07-18T15:00:00Z',
                type: 'track',
              },
              userId: 'anonymousId',
            },
            metadata: {
              jobId: 2,
              rudderId: 'randomRudderId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751005497524',
    name: 'kafka',
    description: 'Test case with null dest config and avro schema',
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
              anonymousId: 'anonymousId',
              context: {
                library: {
                  name: 'analytics-go',
                  version: '3.0.0',
                },
              },
              event: 'event',
              integrations: {
                Kafka: {
                  schemaId: 'schema001',
                },
              },
              messageId: 'messageId',
              originalTimestamp: '2019-07-18T15:00:00Z',
              properties: {
                key: 'value',
              },
              receivedAt: '2019-07-18T15:00:00Z',
              sentAt: '2019-07-18T15:00:00Z',
              timestamp: '2019-07-18T15:00:00Z',
              type: 'track',
              userId: 'userId',
            },
            metadata: {
              jobId: 3,
              rudderId: 'randomRudderId',
            },
            destination: {
              ID: 'kafkadestinationid',
              Name: 'Kafka',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {},
              },
              Config: {},
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
              message: {
                anonymousId: 'anonymousId',
                context: {
                  library: {
                    name: 'analytics-go',
                    version: '3.0.0',
                  },
                },
                event: 'event',
                integrations: {
                  Kafka: {
                    schemaId: 'schema001',
                  },
                },
                messageId: 'messageId',
                originalTimestamp: '2019-07-18T15:00:00Z',
                properties: {
                  key: 'value',
                },
                receivedAt: '2019-07-18T15:00:00Z',
                sentAt: '2019-07-18T15:00:00Z',
                timestamp: '2019-07-18T15:00:00Z',
                type: 'track',
                userId: 'userId',
              },
              userId: 'userId',
              schemaId: 'schema001',
            },
            metadata: {
              jobId: 3,
              rudderId: 'randomRudderId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751005497524',
    name: 'kafka',
    description: 'Test case with null dest config and integrations topic',
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
              anonymousId: 'anonymousId',
              context: {
                library: {
                  name: 'analytics-go',
                  version: '3.0.0',
                },
              },
              event: 'event',
              integrations: {
                Kafka: {
                  topic: 'specific-topic',
                },
              },
              messageId: 'messageId',
              originalTimestamp: '2019-07-18T15:00:00Z',
              properties: {
                key: 'value',
              },
              receivedAt: '2019-07-18T15:00:00Z',
              sentAt: '2019-07-18T15:00:00Z',
              timestamp: '2019-07-18T15:00:00Z',
              type: 'track',
              userId: 'userId',
            },
            metadata: {
              jobId: 4,
              rudderId: 'randomRudderId',
            },
            destination: {
              ID: 'kafkadestinationid',
              Name: 'Kafka',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {},
              },
              Config: {},
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
              message: {
                anonymousId: 'anonymousId',
                context: {
                  library: {
                    name: 'analytics-go',
                    version: '3.0.0',
                  },
                },
                event: 'event',
                integrations: {
                  Kafka: {
                    topic: 'specific-topic',
                  },
                },
                messageId: 'messageId',
                originalTimestamp: '2019-07-18T15:00:00Z',
                properties: {
                  key: 'value',
                },
                receivedAt: '2019-07-18T15:00:00Z',
                sentAt: '2019-07-18T15:00:00Z',
                timestamp: '2019-07-18T15:00:00Z',
                type: 'track',
                userId: 'userId',
              },
              userId: 'userId',
              topic: 'specific-topic',
            },
            metadata: {
              jobId: 4,
              rudderId: 'randomRudderId<<>>specific-topic',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751005497524',
    name: 'kafka',
    description: 'Test case with dest config with default topic',
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
              anonymousId: 'anonymousId',
              context: {
                library: {
                  name: 'analytics-go',
                  version: '3.0.0',
                },
              },
              event: 'event',
              messageId: 'messageId',
              originalTimestamp: '2019-07-18T15:00:00Z',
              properties: {
                key: 'value',
              },
              receivedAt: '2019-07-18T15:00:00Z',
              sentAt: '2019-07-18T15:00:00Z',
              timestamp: '2019-07-18T15:00:00Z',
              type: 'track',
              userId: 'userId',
            },
            metadata: {
              jobId: 5,
              rudderId: 'randomRudderId',
            },
            destination: {
              ID: 'kafkadestinationid',
              Name: 'Kafka',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {},
              },
              Config: {
                topic: 'default-topic',
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
              message: {
                anonymousId: 'anonymousId',
                context: {
                  library: {
                    name: 'analytics-go',
                    version: '3.0.0',
                  },
                },
                event: 'event',
                messageId: 'messageId',
                originalTimestamp: '2019-07-18T15:00:00Z',
                properties: {
                  key: 'value',
                },
                receivedAt: '2019-07-18T15:00:00Z',
                sentAt: '2019-07-18T15:00:00Z',
                timestamp: '2019-07-18T15:00:00Z',
                type: 'track',
                userId: 'userId',
              },
              userId: 'userId',
              topic: 'default-topic',
            },
            metadata: {
              jobId: 5,
              rudderId: 'randomRudderId<<>>default-topic',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751005497524',
    name: 'kafka',
    description: 'Test case with dest config with event type topic',
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
              anonymousId: 'anonymousId',
              context: {
                library: {
                  name: 'analytics-go',
                  version: '3.0.0',
                },
              },
              messageId: 'messageId',
              originalTimestamp: '2019-07-18T15:00:00Z',
              properties: {
                key: 'value',
              },
              receivedAt: '2019-07-18T15:00:00Z',
              sentAt: '2019-07-18T15:00:00Z',
              timestamp: '2019-07-18T15:00:00Z',
              type: 'identify',
              userId: 'userId',
            },
            metadata: {
              jobId: 6,
              rudderId: 'randomRudderId',
            },
            destination: {
              ID: 'kafkadestinationid',
              Name: 'Kafka',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {},
              },
              Config: {
                topic: 'default-topic',
                enableMultiTopic: true,
                eventTypeToTopicMap: [
                  {
                    from: 'identify',
                    to: 'identify-topic',
                  },
                  {
                    from: 'page',
                    to: 'page-topic',
                  },
                  {
                    from: 'screen',
                    to: 'screen-topic',
                  },
                  {
                    from: 'group',
                    to: 'group-topic',
                  },
                  {
                    from: 'alias',
                    to: 'alias-topic',
                  },
                ],
                eventToTopicMap: [
                  {
                    from: 'Product Added',
                    to: 'product-added',
                  },
                ],
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
              message: {
                anonymousId: 'anonymousId',
                context: {
                  library: {
                    name: 'analytics-go',
                    version: '3.0.0',
                  },
                },
                messageId: 'messageId',
                originalTimestamp: '2019-07-18T15:00:00Z',
                properties: {
                  key: 'value',
                },
                receivedAt: '2019-07-18T15:00:00Z',
                sentAt: '2019-07-18T15:00:00Z',
                timestamp: '2019-07-18T15:00:00Z',
                type: 'identify',
                userId: 'userId',
              },
              userId: 'userId',
              topic: 'identify-topic',
            },
            metadata: {
              jobId: 6,
              rudderId: 'randomRudderId<<>>identify-topic',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751005497524',
    name: 'kafka',
    description: 'Test case with dest config with event name topic',
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
              anonymousId: 'anonymousId',
              context: {
                library: {
                  name: 'analytics-go',
                  version: '3.0.0',
                },
              },
              event: 'Product Added',
              messageId: 'messageId',
              originalTimestamp: '2019-07-18T15:00:00Z',
              properties: {
                key: 'value',
              },
              receivedAt: '2019-07-18T15:00:00Z',
              sentAt: '2019-07-18T15:00:00Z',
              timestamp: '2019-07-18T15:00:00Z',
              type: 'track',
              userId: 'userId',
            },
            metadata: {
              jobId: 7,
              rudderId: 'randomRudderId',
            },
            destination: {
              ID: 'kafkadestinationid',
              Name: 'Kafka',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {},
              },
              Config: {
                topic: 'default-topic',
                enableMultiTopic: true,
                eventTypeToTopicMap: [
                  {
                    from: 'identify',
                    to: 'identify-topic',
                  },
                  {
                    from: 'page',
                    to: 'page-topic',
                  },
                  {
                    from: 'screen',
                    to: 'screen-topic',
                  },
                  {
                    from: 'group',
                    to: 'group-topic',
                  },
                  {
                    from: 'alias',
                    to: 'alias-topic',
                  },
                ],
                eventToTopicMap: [
                  {
                    from: 'Product Added',
                    to: 'product-added',
                  },
                ],
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
              message: {
                anonymousId: 'anonymousId',
                context: {
                  library: {
                    name: 'analytics-go',
                    version: '3.0.0',
                  },
                },
                event: 'Product Added',
                messageId: 'messageId',
                originalTimestamp: '2019-07-18T15:00:00Z',
                properties: {
                  key: 'value',
                },
                receivedAt: '2019-07-18T15:00:00Z',
                sentAt: '2019-07-18T15:00:00Z',
                timestamp: '2019-07-18T15:00:00Z',
                type: 'track',
                userId: 'userId',
              },
              userId: 'userId',
              topic: 'product-added',
            },
            metadata: {
              jobId: 7,
              rudderId: 'randomRudderId<<>>product-added',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751005497524',
    name: 'kafka',
    description: 'Test case with dest config with event name topic no match',
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
              anonymousId: 'anonymousId',
              context: {
                library: {
                  name: 'analytics-go',
                  version: '3.0.0',
                },
              },
              event: 'Product Added No match',
              messageId: 'messageId',
              originalTimestamp: '2019-07-18T15:00:00Z',
              properties: {
                key: 'value',
              },
              receivedAt: '2019-07-18T15:00:00Z',
              sentAt: '2019-07-18T15:00:00Z',
              timestamp: '2019-07-18T15:00:00Z',
              type: 'track',
              userId: 'userId',
            },
            metadata: {
              jobId: 8,
              rudderId: 'randomRudderId',
            },
            destination: {
              ID: 'kafkadestinationid',
              Name: 'Kafka',
              DestinationDefinition: {
                ID: 'default-dest-def-id',
                Name: 'Default Destination Definition',
                DisplayName: 'Default Display Name',
                Config: {},
              },
              Config: {
                topic: 'default-topic',
                enableMultiTopic: true,
                eventTypeToTopicMap: [
                  {
                    from: 'identify',
                    to: 'identify-topic',
                  },
                  {
                    from: 'page',
                    to: 'page-topic',
                  },
                  {
                    from: 'screen',
                    to: 'screen-topic',
                  },
                  {
                    from: 'group',
                    to: 'group-topic',
                  },
                  {
                    from: 'alias',
                    to: 'alias-topic',
                  },
                ],
                eventToTopicMap: [
                  {
                    from: 'Product Added',
                    to: 'product-added',
                  },
                ],
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
              message: {
                anonymousId: 'anonymousId',
                context: {
                  library: {
                    name: 'analytics-go',
                    version: '3.0.0',
                  },
                },
                event: 'Product Added No match',
                messageId: 'messageId',
                originalTimestamp: '2019-07-18T15:00:00Z',
                properties: {
                  key: 'value',
                },
                receivedAt: '2019-07-18T15:00:00Z',
                sentAt: '2019-07-18T15:00:00Z',
                timestamp: '2019-07-18T15:00:00Z',
                type: 'track',
                userId: 'userId',
              },
              userId: 'userId',
              topic: 'default-topic',
            },
            metadata: {
              jobId: 8,
              rudderId: 'randomRudderId<<>>default-topic',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
