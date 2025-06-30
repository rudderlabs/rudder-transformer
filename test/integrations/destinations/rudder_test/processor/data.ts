import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import {
  destination,
  destinationWithDynamicConfig,
  destinationWithoutDynamicConfig,
  testConnection,
  buildMessage,
  buildDynamicConfigMessage,
  baseSources,
  baseTestBehavior,
} from '../common';

export const data: ProcessorTestData[] = [
  {
    id: 'rudder-test-processor-1',
    name: 'rudder_test',
    description: 'Test record INSERT operation with success response',
    scenario: 'Basic record event processing',
    successCriteria: 'Should return 200 with event data echoed back',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'record',
              action: 'insert',
              fields: {
                email: 'test@example.com',
                name: 'Test User',
                age: 30,
              },
              identifiers: {
                userId: 'user123',
              },
              recordId: 'record123',
              context: {
                sources: {
                  job_id: 'job123',
                  version: '1.0',
                  job_run_id: 'run123',
                  task_run_id: 'task123',
                },
                testBehavior: {
                  statusCode: 200,
                },
              },
              messageId: 'msg123',
              timestamp: '2023-01-01T00:00:00.000Z',
            },
            metadata: generateMetadata(1, 'u1'),
            destination,
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
              endpoint: 'https://test.rudderstack.com/v1/record',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                    age: 30,
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(1, 'u1'),
          },
        ],
      },
    },
  },
  {
    id: 'rudder-test-processor-2',
    name: 'rudder_test',
    description: 'Test record event with error response via testBehavior',
    scenario: 'Error response controlled by testBehavior',
    successCriteria: 'Should return 400 error with custom message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'record',
              action: 'update',
              fields: {
                email: 'test@example.com',
              },
              identifiers: {
                userId: 'user123',
              },
              recordId: 'record456',
              context: {
                testBehavior: {
                  statusCode: 400,
                  errorMessage: 'Test validation error',
                },
              },
              messageId: 'msg456',
              timestamp: '2023-01-01T00:00:00.000Z',
            },
            metadata: generateMetadata(2, 'u2'),
            destination,
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
            error: 'Test validation error',
            metadata: generateMetadata(2, 'u2'),
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'RUDDER_TEST',
              destinationId: 'default-destinationId',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  {
    id: 'rudder-test-processor-3',
    name: 'rudder_test',
    description: 'Test unsupported message type',
    scenario: 'Non-record message type should be rejected',
    successCriteria: 'Should return 400 error for unsupported message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              event: 'Test Event',
              properties: {
                key: 'value',
              },
              messageId: 'msg789',
              timestamp: '2023-01-01T00:00:00.000Z',
            },
            metadata: generateMetadata(3, 'u3'),
            destination,
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
            error: 'Message type "track" is not supported. Only \'record\' type is supported.',
            metadata: generateMetadata(3, 'u3'),
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'RUDDER_TEST',
              destinationId: 'default-destinationId',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  // Dynamic Config Test Cases for Processor
  {
    id: 'rudder-test-processor-4',
    name: 'rudder_test',
    description: 'Test dynamic config processing in processor without compaction',
    scenario: 'Dynamic config with handlebars templates should be processed',
    successCriteria: 'Should process dynamic config and return 200 with resolved values',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: buildDynamicConfigMessage('https://custom.endpoint.com', 'custom-app-id'),
            metadata: generateMetadata(4, 'u4'),
            destination: destinationWithDynamicConfig,
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
              endpoint: 'https://custom.endpoint.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'custom-app-id',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(4, 'u4'),
          },
        ],
      },
    },
  },
  // Payload Compaction Test Cases for Processor
  {
    id: 'rudder-test-processor-5',
    name: 'rudder_test',
    description: 'Test payload compaction without dynamic config in processor',
    scenario: 'ProcessorCompactedTransformationRequest should be processed correctly',
    successCriteria: 'Should handle compacted payload format and return 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  email: 'test@example.com',
                  name: 'Test User',
                },
                identifiers: {
                  userId: 'user123',
                },
                recordId: 'record123',
                context: {
                  sources: {
                    job_id: 'job123',
                    version: '1.0',
                    job_run_id: 'run123',
                    task_run_id: 'task123',
                  },
                  testBehavior: {
                    statusCode: 200,
                  },
                },
                messageId: 'msg123',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
              metadata: {
                ...generateMetadata(5, 'u5'),
                destinationId: 'test-destination-id',
                sourceId: 'test-source-id',
              },
              // Note: destination and connection are omitted in compacted format
            },
          ],
          destinations: {
            'test-destination-id': destination,
          },
          connections: {
            'test-source-id:test-destination-id': testConnection,
          },
        },
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
              endpoint: 'https://test.rudderstack.com/v1/record',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              ...generateMetadata(5, 'u5'),
              destinationId: 'test-destination-id',
              sourceId: 'test-source-id',
            },
          },
        ],
      },
    },
  },
  // Combined Dynamic Config and Payload Compaction Test Cases for Processor
  {
    id: 'rudder-test-processor-6',
    name: 'rudder_test',
    description: 'Test both dynamic config and payload compaction together in processor',
    scenario: 'Dynamic config should be processed with compaction support',
    successCriteria:
      'Should process dynamic config and handle compaction, returning 200 with resolved values',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  email: 'test@example.com',
                  name: 'Test User',
                },
                identifiers: {
                  userId: 'user123',
                },
                recordId: 'record123',
                context: {
                  endpoint: 'https://combined.endpoint.com',
                  sources: {
                    job_id: 'job123',
                    version: '1.0',
                    job_run_id: 'run123',
                    task_run_id: 'task123',
                  },
                  testBehavior: {
                    statusCode: 200,
                  },
                },
                traits: {
                  appId: 'combined-app-id',
                },
                messageId: 'msg123',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
              metadata: {
                ...generateMetadata(6, 'u6'),
                destinationId: 'dynamic-123',
                sourceId: 'test-source-id',
              },
              // Note: destination and connection are omitted in compacted format
            },
          ],
          destinations: {
            'dynamic-123': destinationWithDynamicConfig,
          },
          connections: {
            'test-source-id:dynamic-123': testConnection,
          },
        },
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
              endpoint: 'https://combined.endpoint.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'combined-app-id',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              ...generateMetadata(6, 'u6'),
              destinationId: 'dynamic-123',
              sourceId: 'test-source-id',
            },
          },
        ],
      },
    },
  },
  // Dynamic Config Disabled Test Case for Processor
  {
    id: 'rudder-test-processor-7',
    name: 'rudder_test',
    description: 'Test dynamic config with hasDynamicConfig flag set to false in processor',
    scenario: 'Dynamic config templates should not be processed when flag is false',
    successCriteria: 'Should return 200 with unprocessed template strings in config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'record',
              action: 'insert',
              fields: {
                email: 'test@example.com',
                name: 'Test User',
              },
              identifiers: {
                userId: 'user123',
              },
              recordId: 'record123',
              context: {
                endpoint: 'https://should-not-be-used.com',
                sources: {
                  job_id: 'job123',
                  version: '1.0',
                  job_run_id: 'run123',
                  task_run_id: 'task123',
                },
                testBehavior: {
                  statusCode: 200,
                },
              },
              traits: {
                appId: 'should-not-be-used',
              },
              messageId: 'msg123',
              timestamp: '2023-01-01T00:00:00.000Z',
            },
            metadata: generateMetadata(7, 'u7'),
            destination: destinationWithoutDynamicConfig,
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
              endpoint: 'https://static.endpoint.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'static-api-key',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(7, 'u7'),
          },
        ],
      },
    },
  },
  // Multi-Event Dynamic Config Test Cases for Processor
  {
    id: 'rudder-test-processor-8',
    name: 'rudder_test',
    description: 'Test multiple events with different dynamic config values in processor',
    scenario: 'Multiple events should resolve to different dynamic config values',
    successCriteria: 'Should process each event with its own resolved dynamic config values',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: buildDynamicConfigMessage('https://endpoint1.com', 'app-id-1'),
            metadata: generateMetadata(8, 'u8'),
            destination: destinationWithDynamicConfig,
          },
          {
            message: buildDynamicConfigMessage('https://endpoint2.com', 'app-id-2'),
            metadata: generateMetadata(9, 'u9'),
            destination: destinationWithDynamicConfig,
          },
          {
            message: buildDynamicConfigMessage('https://endpoint3.com', 'app-id-3'),
            metadata: generateMetadata(10, 'u10'),
            destination: destinationWithDynamicConfig,
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
              endpoint: 'https://endpoint1.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'app-id-1',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(8, 'u8'),
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://endpoint2.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'app-id-2',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(9, 'u9'),
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://endpoint3.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'app-id-3',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(10, 'u10'),
          },
        ],
      },
    },
  },
  // Mixed Dynamic Config Test Case for Processor (Different Destination IDs)
  {
    id: 'rudder-test-processor-9',
    name: 'rudder_test',
    description: 'Test mixed dynamic config scenarios with different destination IDs in processor',
    scenario:
      'Events from different destination IDs with different hasDynamicConfig flags should be processed correctly',
    successCriteria:
      'Should handle different destination IDs with different dynamic config settings',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: buildDynamicConfigMessage('https://dynamic1.com', 'dynamic-app-1'),
            metadata: { ...generateMetadata(11, 'u11'), destinationId: 'dynamic-dest-1' },
            destination: { ...destinationWithDynamicConfig, ID: 'dynamic-dest-1' },
          },
          {
            message: buildMessage({
              context: {
                endpoint: 'https://should-not-be-used.com',
                sources: baseSources,
                testBehavior: baseTestBehavior,
              },
              traits: {
                appId: 'should-not-be-used',
              },
            }),
            metadata: { ...generateMetadata(12, 'u12'), destinationId: 'static-dest-1' },
            destination: { ...destinationWithoutDynamicConfig, ID: 'static-dest-1' },
          },
          {
            message: buildDynamicConfigMessage('https://dynamic2.com', 'dynamic-app-2'),
            metadata: { ...generateMetadata(13, 'u13'), destinationId: 'dynamic-dest-2' },
            destination: { ...destinationWithDynamicConfig, ID: 'dynamic-dest-2' },
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
              endpoint: 'https://dynamic1.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'dynamic-app-1',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: { ...generateMetadata(11, 'u11'), destinationId: 'dynamic-dest-1' },
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://static.endpoint.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'static-api-key',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: { ...generateMetadata(12, 'u12'), destinationId: 'static-dest-1' },
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://dynamic2.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'dynamic-app-2',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: { ...generateMetadata(13, 'u13'), destinationId: 'dynamic-dest-2' },
          },
        ],
      },
    },
  },
  // Multi-Event Compaction with Dynamic Config Test Case for Processor
  {
    id: 'rudder-test-processor-10',
    name: 'rudder_test',
    description:
      'Test multiple events with compaction and different dynamic config values in processor',
    scenario: 'Multiple events with compaction should resolve to different dynamic config values',
    successCriteria:
      'Should process compacted payload with multiple events having different dynamic configs',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  email: 'user1@example.com',
                  name: 'User One',
                },
                identifiers: {
                  userId: 'user1',
                },
                recordId: 'record1',
                context: {
                  endpoint: 'https://endpoint1.com',
                  sources: baseSources,
                  testBehavior: baseTestBehavior,
                },
                traits: {
                  appId: 'app-id-1',
                },
                messageId: 'msg1',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
              metadata: {
                ...generateMetadata(14, 'u14'),
                destinationId: 'dynamic-dest-1',
                sourceId: 'test-source-1',
              },
            },
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  email: 'user2@example.com',
                  name: 'User Two',
                },
                identifiers: {
                  userId: 'user2',
                },
                recordId: 'record2',
                context: {
                  endpoint: 'https://endpoint2.com',
                  sources: baseSources,
                  testBehavior: baseTestBehavior,
                },
                traits: {
                  appId: 'app-id-2',
                },
                messageId: 'msg2',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
              metadata: {
                ...generateMetadata(15, 'u15'),
                destinationId: 'dynamic-dest-2',
                sourceId: 'test-source-2',
              },
            },
          ],
          destinations: {
            'dynamic-dest-1': { ...destinationWithDynamicConfig, ID: 'dynamic-dest-1' },
            'dynamic-dest-2': { ...destinationWithDynamicConfig, ID: 'dynamic-dest-2' },
          },
          connections: {
            'test-source-1:dynamic-dest-1': {
              ...testConnection,
              sourceId: 'test-source-1',
              destinationId: 'dynamic-dest-1',
            },
            'test-source-2:dynamic-dest-2': {
              ...testConnection,
              sourceId: 'test-source-2',
              destinationId: 'dynamic-dest-2',
            },
          },
        },
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
              endpoint: 'https://endpoint1.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'app-id-1',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record1',
                  fields: {
                    email: 'user1@example.com',
                    name: 'User One',
                  },
                  identifiers: {
                    userId: 'user1',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              ...generateMetadata(14, 'u14'),
              destinationId: 'dynamic-dest-1',
              sourceId: 'test-source-1',
            },
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://endpoint2.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'app-id-2',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record2',
                  fields: {
                    email: 'user2@example.com',
                    name: 'User Two',
                  },
                  identifiers: {
                    userId: 'user2',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              ...generateMetadata(15, 'u15'),
              destinationId: 'dynamic-dest-2',
              sourceId: 'test-source-2',
            },
          },
        ],
      },
    },
  },
  // Payload Compaction Mutation Test Case for Processor
  {
    id: 'rudder-test-processor-mutation-error',
    name: 'rudder_test',
    description: 'Test mutation of frozen destination config in compacted payload (processor)',
    scenario: 'Mutation attempt should throw error when config is frozen (processor)',
    successCriteria: 'Should return error about read-only/frozen config (processor)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: [
            {
              message: buildMessage({
                context: {
                  testBehavior: {
                    statusCode: 200,
                    mutateDestinationConfig: true,
                  },
                  sources: baseSources,
                },
              }),
              metadata: {
                ...generateMetadata(200, 'u200'),
                destinationId: 'static-123',
                sourceId: 'test-source-id',
              },
            },
          ],
          destinations: {
            'static-123': destinationWithoutDynamicConfig,
          },
          connections: {
            'test-source-id:static-123': testConnection,
          },
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 500,
            metadata: {
              ...generateMetadata(200, 'u200'),
              destinationId: 'static-123',
              sourceId: 'test-source-id',
            },
            error: expect.stringMatching(
              /(Cannot assign to read only property|frozen|read[- ]?only|object is not extensible|Cannot set property)/i,
            ),
            output: undefined,
            statTags: {
              errorCategory: 'transformation',
            },
          },
        ],
      },
    },
  },
  // Payload Compaction Config Reference Replacement Test Case for Processor
  {
    id: 'rudder-test-processor-replace-config-error',
    name: 'rudder_test',
    description: 'Test replacing frozen destination config object in compacted payload (processor)',
    scenario: 'Config reference replacement should throw error when config is frozen (processor)',
    successCriteria: 'Should return error about assignment to read-only/frozen config (processor)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: [
            {
              message: buildMessage({
                context: {
                  testBehavior: {
                    statusCode: 200,
                    replaceDestinationConfig: true,
                  },
                  sources: baseSources,
                },
              }),
              metadata: {
                ...generateMetadata(201, 'u201'),
                destinationId: 'static-123',
                sourceId: 'test-source-id',
              },
            },
          ],
          destinations: {
            'static-123': destinationWithoutDynamicConfig,
          },
          connections: {
            'test-source-id:static-123': testConnection,
          },
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 500,
            metadata: {
              ...generateMetadata(201, 'u201'),
              destinationId: 'static-123',
              sourceId: 'test-source-id',
            },
            error: expect.stringMatching(
              /(Cannot assign to read only property|frozen|read[- ]?only|object is not extensible|Cannot set property)/i,
            ),
            output: undefined,
            statTags: {
              errorCategory: 'transformation',
            },
          },
        ],
      },
    },
  },
  // Environment Variable Override Example
  {
    id: 'rudder-test-processor-env-override-example',
    name: 'rudder_test',
    description: 'Test with environment variable override for API endpoint',
    scenario: 'Environment variable override functionality demonstration',
    successCriteria: 'Should use endpoint from environment variable override',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    // Environment variable override - this overrides the API endpoint for this test only
    envOverrides: {
      RUDDER_TEST_API_ENDPOINT: 'https://staging.example.com/v1/events',
      DEBUG_MODE: 'true',
    },
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: buildMessage({
              fields: {
                email: 'env-test@example.com',
                name: 'Environment Test User',
              },
              context: {
                testBehavior: {
                  statusCode: 200,
                },
                sources: baseSources,
              },
            }),
            metadata: generateMetadata(999, 'env-test'),
            destination,
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
              // This endpoint comes from the environment variable override
              endpoint: 'https://staging.example.com/v1/events',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  action: 'insert',
                  recordId: 'record123',
                  fields: {
                    email: 'env-test@example.com',
                    name: 'Environment Test User',
                  },
                  identifiers: {
                    userId: 'user123',
                  },
                  timestamp: '2023-01-01T00:00:00.000Z',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(999, 'env-test'),
          },
        ],
      },
    },
  },
];
