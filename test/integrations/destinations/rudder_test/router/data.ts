/**
 * Auto-migrated and optimized test cases
 * Generated on: 2025-05-26T16:25:28.201Z
 * Optimized following best practices from test migration guide
 */

import { RouterTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import {
  destination,
  destinationWithDynamicConfig,
  destinationWithoutDynamicConfig,
  testConnection,
  buildMessage,
  buildDynamicConfigMessage,
  buildRouterInput,
  buildCompactedRouterInput,
  buildRouterOutput,
  baseSources,
  baseTestBehavior,
} from '../common';

export const data: RouterTestData[] = [
  {
    id: 'rudder-test-router-1',
    name: 'rudder_test',
    description: 'Test record INSERT operation with success response',
    scenario: 'Basic record event processing',
    successCriteria: 'Should return 200 with event data echoed back',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
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
          destType: 'rudder_test',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
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
              },
              metadata: [generateMetadata(1, 'u1')],
              statusCode: 200,
              destination,
              batched: false,
            },
          ],
        },
      },
    },
  },
  {
    id: 'rudder-test-router-2',
    name: 'rudder_test',
    description: 'Test record event with error response via testBehavior',
    scenario: 'Error response controlled by testBehavior',
    successCriteria: 'Should return 400 error with custom message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
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
          destType: 'rudder_test',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [generateMetadata(2, 'u2')],
              statusCode: 400,
              destination,
              batched: false,
              error: 'Test validation error',
              statTags: {
                destType: 'RUDDER_TEST',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
            },
          ],
        },
      },
    },
  },
  {
    id: 'rudder-test-router-3',
    name: 'rudder_test',
    description: 'Test unsupported message type',
    scenario: 'Non-record message type should be rejected',
    successCriteria: 'Should return 400 error for unsupported message type',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
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
          destType: 'rudder_test',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [generateMetadata(3, 'u3')],
              statusCode: 400,
              destination,
              batched: false,
              error: 'Message type "track" is not supported. Only \'record\' type is supported.',
              statTags: {
                destType: 'RUDDER_TEST',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
            },
          ],
        },
      },
    },
  },
  // Dynamic Config Test Cases
  {
    id: 'rudder-test-router-4',
    name: 'rudder_test',
    description: 'Test dynamic config processing without compaction',
    scenario: 'Dynamic config with handlebars templates should be processed',
    successCriteria: 'Should process dynamic config and return 200 with resolved values',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            buildRouterInput(
              buildDynamicConfigMessage('https://custom.endpoint.com', 'custom-app-id'),
              generateMetadata(4, 'u4'),
              destinationWithDynamicConfig,
            ),
          ],
          destType: 'rudder_test',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            buildRouterOutput(
              generateMetadata(4, 'u4'),
              {
                ...destinationWithDynamicConfig,
                Config: {
                  apiKey: 'custom-app-id',
                  endpoint: 'https://custom.endpoint.com',
                  staticValue: 'static-value',
                },
              },
              {
                endpoint: 'https://custom.endpoint.com',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': 'custom-app-id',
                },
              },
            ),
          ],
        },
      },
    },
  },
  // Payload Compaction Test Cases
  {
    id: 'rudder-test-router-5',
    name: 'rudder_test',
    description: 'Test payload compaction without dynamic config',
    scenario: 'RouterCompactedTransformationRequest should be processed correctly',
    successCriteria: 'Should handle compacted payload format and return 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: [
            buildCompactedRouterInput(buildMessage(), {
              ...generateMetadata(5, 'u5'),
              destinationId: 'test-destination-id',
              sourceId: 'test-source-id',
            }),
          ],
          destType: 'rudder_test',
          destinations: {
            'test-destination-id': destination,
          },
          connections: {
            'test-source-id:test-destination-id': testConnection,
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            buildRouterOutput(
              {
                ...generateMetadata(5, 'u5'),
                destinationId: 'test-destination-id',
                sourceId: 'test-source-id',
              },
              destination,
            ),
          ],
        },
      },
    },
  },
  // Combined Dynamic Config and Payload Compaction Test Cases
  {
    id: 'rudder-test-router-6',
    name: 'rudder_test',
    description: 'Test both dynamic config and payload compaction together',
    scenario: 'Dynamic config should be processed with compaction support',
    successCriteria:
      'Should process dynamic config and handle compaction, returning 200 with resolved values',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: [
            buildCompactedRouterInput(
              buildDynamicConfigMessage('https://combined.endpoint.com', 'combined-app-id'),
              {
                ...generateMetadata(6, 'u6'),
                destinationId: 'dynamic-123',
                sourceId: 'test-source-id',
              },
            ),
          ],
          destType: 'rudder_test',
          destinations: {
            'dynamic-123': destinationWithDynamicConfig,
          },
          connections: {
            'test-source-id:dynamic-123': testConnection,
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            buildRouterOutput(
              {
                ...generateMetadata(6, 'u6'),
                destinationId: 'dynamic-123',
                sourceId: 'test-source-id',
              },
              {
                ...destinationWithDynamicConfig,
                Config: {
                  apiKey: 'combined-app-id',
                  endpoint: 'https://combined.endpoint.com',
                  staticValue: 'static-value',
                },
              },
              {
                endpoint: 'https://combined.endpoint.com',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': 'combined-app-id',
                },
              },
            ),
          ],
        },
      },
    },
  },
  // Without Dynamic Config Test Case
  {
    id: 'rudder-test-router-7',
    name: 'rudder_test',
    description: 'Test destination without dynamic config (static config only)',
    scenario: 'Destination with static config should work normally',
    successCriteria: 'Should return 200 with static config values unchanged',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            buildRouterInput(
              buildMessage({
                context: {
                  endpoint: 'https://some-endpoint.com',
                  sources: baseSources,
                  testBehavior: baseTestBehavior,
                },
                traits: {
                  appId: 'some-app-id',
                },
              }),
              generateMetadata(7, 'u7'),
              destinationWithoutDynamicConfig,
            ),
          ],
          destType: 'rudder_test',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            buildRouterOutput(generateMetadata(7, 'u7'), destinationWithoutDynamicConfig, {
              endpoint: 'https://static.endpoint.com',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'static-api-key',
              },
            }),
          ],
        },
      },
    },
  },
  // Multi-Event Dynamic Config Test Cases for Router
  {
    id: 'rudder-test-router-8',
    name: 'rudder_test',
    description: 'Test multiple events with different dynamic config values in router',
    scenario: 'Multiple events should resolve to different dynamic config values',
    successCriteria: 'Should process each event with its own resolved dynamic config values',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            buildRouterInput(
              buildDynamicConfigMessage('https://endpoint1.com', 'app-id-1'),
              generateMetadata(8, 'u8'),
              destinationWithDynamicConfig,
            ),
            buildRouterInput(
              buildDynamicConfigMessage('https://endpoint2.com', 'app-id-2'),
              generateMetadata(9, 'u9'),
              destinationWithDynamicConfig,
            ),
            buildRouterInput(
              buildDynamicConfigMessage('https://endpoint3.com', 'app-id-3'),
              generateMetadata(10, 'u10'),
              destinationWithDynamicConfig,
            ),
          ],
          destType: 'rudder_test',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            buildRouterOutput(
              generateMetadata(8, 'u8'),
              {
                ...destinationWithDynamicConfig,
                Config: {
                  apiKey: 'app-id-1',
                  endpoint: 'https://endpoint1.com',
                  staticValue: 'static-value',
                },
              },
              {
                endpoint: 'https://endpoint1.com',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': 'app-id-1',
                },
              },
            ),
            buildRouterOutput(
              generateMetadata(9, 'u9'),
              {
                ...destinationWithDynamicConfig,
                Config: {
                  apiKey: 'app-id-2',
                  endpoint: 'https://endpoint2.com',
                  staticValue: 'static-value',
                },
              },
              {
                endpoint: 'https://endpoint2.com',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': 'app-id-2',
                },
              },
            ),
            buildRouterOutput(
              generateMetadata(10, 'u10'),
              {
                ...destinationWithDynamicConfig,
                Config: {
                  apiKey: 'app-id-3',
                  endpoint: 'https://endpoint3.com',
                  staticValue: 'static-value',
                },
              },
              {
                endpoint: 'https://endpoint3.com',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': 'app-id-3',
                },
              },
            ),
          ],
        },
      },
    },
  },
  // Mixed Dynamic Config Test Case for Router (Different Destination IDs)
  {
    id: 'rudder-test-router-9',
    name: 'rudder_test',
    description: 'Test mixed dynamic config scenarios with different destination IDs in router',
    scenario:
      'Events from different destination IDs with different hasDynamicConfig flags should be processed correctly',
    successCriteria:
      'Should handle different destination IDs with different dynamic config settings',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            buildRouterInput(
              buildDynamicConfigMessage('https://dynamic1.com', 'dynamic-app-1'),
              { ...generateMetadata(11, 'u11'), destinationId: 'dynamic-dest-1' },
              { ...destinationWithDynamicConfig, ID: 'dynamic-dest-1' },
            ),
            buildRouterInput(
              buildMessage({
                context: {
                  endpoint: 'https://should-not-be-used.com',
                  sources: baseSources,
                  testBehavior: baseTestBehavior,
                },
                traits: {
                  appId: 'should-not-be-used',
                },
              }),
              { ...generateMetadata(12, 'u12'), destinationId: 'static-dest-1' },
              { ...destinationWithoutDynamicConfig, ID: 'static-dest-1' },
            ),
            buildRouterInput(
              buildDynamicConfigMessage('https://dynamic2.com', 'dynamic-app-2'),
              { ...generateMetadata(13, 'u13'), destinationId: 'dynamic-dest-2' },
              { ...destinationWithDynamicConfig, ID: 'dynamic-dest-2' },
            ),
          ],
          destType: 'rudder_test',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            buildRouterOutput(
              { ...generateMetadata(11, 'u11'), destinationId: 'dynamic-dest-1' },
              {
                ...destinationWithDynamicConfig,
                ID: 'dynamic-dest-1',
                Config: {
                  apiKey: 'dynamic-app-1',
                  endpoint: 'https://dynamic1.com',
                  staticValue: 'static-value',
                },
              },
              {
                endpoint: 'https://dynamic1.com',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': 'dynamic-app-1',
                },
              },
            ),
            buildRouterOutput(
              { ...generateMetadata(12, 'u12'), destinationId: 'static-dest-1' },
              {
                ...destinationWithoutDynamicConfig,
                ID: 'static-dest-1',
              },
              {
                endpoint: 'https://static.endpoint.com',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': 'static-api-key',
                },
              },
            ),
            buildRouterOutput(
              { ...generateMetadata(13, 'u13'), destinationId: 'dynamic-dest-2' },
              {
                ...destinationWithDynamicConfig,
                ID: 'dynamic-dest-2',
                Config: {
                  apiKey: 'dynamic-app-2',
                  endpoint: 'https://dynamic2.com',
                  staticValue: 'static-value',
                },
              },
              {
                endpoint: 'https://dynamic2.com',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': 'dynamic-app-2',
                },
              },
            ),
          ],
        },
      },
    },
  },
  // Multi-Event Compaction with Dynamic Config Test Case for Router
  {
    id: 'rudder-test-router-10',
    name: 'rudder_test',
    description:
      'Test multiple events with compaction and different dynamic config values in router',
    scenario: 'Multiple events with compaction should resolve to different dynamic config values',
    successCriteria:
      'Should process compacted payload with multiple events having different dynamic configs',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: [
            buildCompactedRouterInput(
              {
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
              {
                ...generateMetadata(14, 'u14'),
                destinationId: 'dynamic-dest-1',
                sourceId: 'test-source-1',
              },
            ),
            buildCompactedRouterInput(
              {
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
              {
                ...generateMetadata(15, 'u15'),
                destinationId: 'dynamic-dest-2',
                sourceId: 'test-source-2',
              },
            ),
          ],
          destType: 'rudder_test',
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
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            buildRouterOutput(
              {
                ...generateMetadata(14, 'u14'),
                destinationId: 'dynamic-dest-1',
                sourceId: 'test-source-1',
              },
              {
                ...destinationWithDynamicConfig,
                ID: 'dynamic-dest-1',
                Config: {
                  apiKey: 'app-id-1',
                  endpoint: 'https://endpoint1.com',
                  staticValue: 'static-value',
                },
              },
              {
                endpoint: 'https://endpoint1.com',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': 'app-id-1',
                },
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
              },
            ),
            buildRouterOutput(
              {
                ...generateMetadata(15, 'u15'),
                destinationId: 'dynamic-dest-2',
                sourceId: 'test-source-2',
              },
              {
                ...destinationWithDynamicConfig,
                ID: 'dynamic-dest-2',
                Config: {
                  apiKey: 'app-id-2',
                  endpoint: 'https://endpoint2.com',
                  staticValue: 'static-value',
                },
              },
              {
                endpoint: 'https://endpoint2.com',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': 'app-id-2',
                },
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
              },
            ),
          ],
        },
      },
    },
  },
  // Payload Compaction Test Cases
  {
    id: 'rudder-test-router-mutation-error',
    name: 'rudder_test',
    description: 'Test mutation of frozen destination config in compacted payload',
    scenario: 'Mutation attempt should throw error when config is frozen',
    successCriteria: 'Should return error about read-only/frozen config',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: [
            buildCompactedRouterInput(
              buildMessage({
                context: {
                  testBehavior: {
                    statusCode: 200,
                    mutateDestinationConfig: true,
                  },
                  sources: baseSources,
                },
              }),
              {
                ...generateMetadata(100, 'u100'),
                destinationId: 'static-123',
                sourceId: 'test-source-id',
              },
            ),
          ],
          destType: 'rudder_test',
          destinations: {
            'static-123': destinationWithoutDynamicConfig,
          },
          connections: {
            'test-source-id:static-123': testConnection,
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [
                {
                  ...generateMetadata(100, 'u100'),
                  destinationId: 'static-123',
                  sourceId: 'test-source-id',
                },
              ],
              statusCode: 500,
              destination: destinationWithoutDynamicConfig,
              batched: false,
              error: 'Cannot add property mutatedByTest, object is not extensible',
              statTags: {
                destType: 'RUDDER_TEST',
                destinationId: 'static-123',
                errorCategory: 'transformation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
            },
          ],
        },
      },
    },
  },
  {
    id: 'rudder-test-router-replace-config-error',
    name: 'rudder_test',
    description: 'Test replacing frozen destination config object in compacted payload',
    scenario: 'Config reference replacement should throw error when config is frozen',
    successCriteria: 'Should return error about assignment to read-only/frozen config',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: [
            buildCompactedRouterInput(
              buildMessage({
                context: {
                  testBehavior: {
                    statusCode: 200,
                    replaceDestinationConfig: true,
                  },
                  sources: baseSources,
                },
              }),
              {
                ...generateMetadata(101, 'u101'),
                destinationId: 'static-123',
                sourceId: 'test-source-id',
              },
            ),
          ],
          destType: 'rudder_test',
          destinations: {
            'static-123': destinationWithoutDynamicConfig,
          },
          connections: {
            'test-source-id:static-123': testConnection,
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [
                {
                  ...generateMetadata(101, 'u101'),
                  destinationId: 'static-123',
                  sourceId: 'test-source-id',
                },
              ],
              statusCode: 500,
              destination: destinationWithoutDynamicConfig,
              batched: false,
              error: expect.stringMatching(
                /(Cannot assign to read only property|frozen|read[- ]?only|object is not extensible|Cannot set property)/i,
              ),
              statTags: {
                destType: 'RUDDER_TEST',
                destinationId: 'static-123',
                errorCategory: 'transformation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
            },
          ],
        },
      },
    },
  },
];
