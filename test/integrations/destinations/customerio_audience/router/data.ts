import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { defaultMockFns } from '../mocks';
import * as config from '../../../../../src/v0/destinations/customerio_audience/config';
import {
  destType,
  destination,
  headers,
  RouterInstrumentationErrorStatTags,
  insertOrUpdateEndpoint,
  deleteEndpoint,
  connection,
  params,
  inValidConnection,
  RouterConfigurationErrorStatTags,
} from '../common';
import { RouterTestData } from '../../../testTypes';

export const data: RouterTestData[] = [
  /**
   * Test Case 1: Comprehensive Router Functionality Test
   *
   * Purpose: Tests the complete router functionality including:
   * - Successful batching of events by action type (insert/update vs delete)
   * - Proper error handling for invalid events
   * - Validation of message structure and connection configuration
   *
   * Expected Behavior:
   * - Insert and update events should be batched together in separate batches
   * - Delete events should be batched separately
   * - Invalid events should return individual error responses
   * - Batch size should respect the configured limits
   */
  {
    id: 'customerio-audience-router-comprehensive-test',
    name: destType,
    description:
      'Comprehensive router test covering batching, error handling, and validation scenarios',
    scenario: 'Framework+Business',
    successCriteria:
      'Valid events should be batched correctly, invalid events should return appropriate errors',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            // Valid insert events - should be batched together (batch 1)
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-1',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-2',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(2),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-3',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(3),
              destination,
              connection,
            },
            // Valid insert and update events - should be batched together (batch 2)
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-4',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(4),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-5',
                },
                action: 'update',
              }),
              metadata: generateMetadata(5),
              destination,
              connection,
            },
            // Valid delete events - should be batched together (batch 3)
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-6',
                },
                action: 'delete',
              }),
              metadata: generateMetadata(6),
              destination,
              connection,
            },
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-7',
                },
                action: 'delete',
              }),
              metadata: generateMetadata(7),
              destination,
              connection,
            },
            // Invalid action - should result in error
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-8',
                },
                action: 'dummy-action',
              }),
              metadata: generateMetadata(8),
              destination,
              connection,
            },
            // Invalid message type - should result in error
            {
              message: {
                type: 'identify', // Should be 'record'
                action: 'insert',
                identifiers: {
                  id: 'test-id-9',
                },
                anonymousId: 'anonId1',
                userId: 'userId1',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2024-03-04T15:32:56.409Z',
              } as any,
              metadata: generateMetadata(9),
              destination,
              connection,
            },
            // Missing identifiers - should result in error
            {
              message: generateRecordPayload({
                action: 'insert',
              }),
              metadata: generateMetadata(10),
              destination,
              connection,
            },
            // Multiple identifiers - should result in error (only one identifier allowed)
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-7',
                  email: 'test@gmail.com',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(11),
              destination,
              connection,
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            // Batch 1: Insert events (test-id-1, test-id-2, test-id-3)
            // These events should be batched together as they are all insert actions
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertOrUpdateEndpoint, // Uses add_customers endpoint
                headers,
                params,
                body: {
                  JSON: {
                    ids: ['test-id-1', 'test-id-2', 'test-id-3'], // Batched IDs
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
              batched: true,
              statusCode: 200,
              destination,
            },
            // Batch 2: Mixed insert and update events (test-id-4, test-id-5)
            // Insert and update actions are batched together as they use the same endpoint
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertOrUpdateEndpoint, // Uses add_customers endpoint for both insert and update
                headers,
                params,
                body: {
                  JSON: {
                    ids: ['test-id-4', 'test-id-5'], // Batched IDs for insert and update
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(4), generateMetadata(5)],
              batched: true,
              statusCode: 200,
              destination,
            },
            // Batch 3: Delete events (test-id-6, test-id-7)
            // Delete actions are batched separately and use the remove_customers endpoint
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: deleteEndpoint, // Uses remove_customers endpoint
                headers,
                params,
                body: {
                  JSON: {
                    ids: ['test-id-6', 'test-id-7'], // Batched IDs for delete
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(6), generateMetadata(7)],
              batched: true,
              statusCode: 200,
              destination,
            },
            // Error Case 1: Invalid action value
            // Event with 'dummy-action' should fail validation
            {
              metadata: [generateMetadata(8)],
              batched: false,
              statusCode: 400,
              error:
                "action: Invalid enum value. Expected 'insert' | 'update' | 'delete', received 'dummy-action'",
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            // Error Case 2: Invalid message type
            // Event with type 'identify' instead of 'record' should fail validation
            {
              metadata: [generateMetadata(9)],
              batched: false,
              statusCode: 400,
              error: 'type: Invalid literal value, expected "record"',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            // Error Case 3: Missing identifiers
            // Event without identifiers should fail validation
            {
              metadata: [generateMetadata(10)],
              batched: false,
              statusCode: 400,
              error: 'identifiers: exactly one identifier is supported',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            // Error Case 4: Multiple identifiers
            // Event with multiple identifiers should fail validation (only one allowed)
            {
              metadata: [generateMetadata(11)],
              batched: false,
              statusCode: 400,
              error: 'identifiers: exactly one identifier is supported',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  /**
   * Test Case 2: Connection Configuration Error Handling
   *
   * Purpose: Tests router behavior with invalid connection configurations:
   * - Missing required configuration fields (audienceId, identifierMappings)
   * - Invalid identifier values
   * - Partial configuration scenarios
   *
   * Expected Behavior:
   * - All events should fail with configuration errors
   * - Appropriate error messages should be returned
   * - No batching should occur for invalid configurations
   */
  {
    id: 'customerio-audience-router-config-error-test',
    name: destType,
    description: 'Router test for connection configuration validation and error handling',
    scenario: 'Framework',
    successCriteria: 'All events should return configuration errors with appropriate messages',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            // Invalid identifier type (array instead of string/number) with invalid connection
            {
              message: generateRecordPayload({
                identifiers: {
                  id: [], // Invalid: should be string or number
                },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination,
              connection: inValidConnection, // Missing audienceId and identifierMappings
            },
            // Valid message but invalid connection (missing required fields)
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-1',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(2),
              destination,
              connection: inValidConnection, // Missing audienceId and identifierMappings
            },
            // Valid message but partially invalid connection (missing identifierMappings)
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'test-id-1',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(3),
              destination,
              connection: {
                ...connection,
                config: {
                  ...connection.config,
                  destination: {
                    audienceId: 'test-audience-id', // Valid audienceId
                    // Missing identifierMappings - should cause error
                  },
                },
              },
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            // Configuration Error 1: Invalid identifier type + missing config
            // Event with array identifier and completely invalid connection
            {
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error:
                'audienceId: String must contain at least 1 character(s); identifierMappings: Required',
              statTags: RouterConfigurationErrorStatTags,
              destination,
            },
            // Configuration Error 2: Valid message but invalid connection
            // Event with valid message structure but missing connection config
            {
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 400,
              error:
                'audienceId: String must contain at least 1 character(s); identifierMappings: Required',
              statTags: RouterConfigurationErrorStatTags,
              destination,
            },
            // Configuration Error 3: Partial configuration
            // Event with valid audienceId but missing identifierMappings
            {
              metadata: [generateMetadata(3)],
              batched: false,
              statusCode: 400,
              error: 'identifierMappings: Required',
              statTags: RouterConfigurationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },

  /**
   * Test Case 3: Mixed Action Type Batching
   *
   * Purpose: Tests router behavior with mixed insert/update/delete actions:
   * - Validates proper separation of actions into appropriate batches
   * - Tests that insert and update actions are batched together
   * - Tests that delete actions are batched separately
   * - Ensures proper endpoint selection for different action types
   *
   * Expected Behavior:
   * - Insert and update events should be batched together using add_customers endpoint
   * - Delete events should be batched separately using remove_customers endpoint
   * - Batch ordering should be maintained
   */
  {
    id: 'customerio-audience-router-mixed-actions-test',
    name: destType,
    description: 'Router test for mixed action type batching and endpoint selection',
    scenario: 'Framework+Business',
    successCriteria: 'Events should be batched by action type with correct endpoint selection',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            // Insert actions - should be batched together
            ...Array.from({ length: 5 }, (_, index) => ({
              message: generateRecordPayload({
                identifiers: {
                  id: `mixed-insert-${index + 1}`,
                },
                action: 'insert',
              }),
              metadata: generateMetadata(index + 1),
              destination,
              connection,
            })),
            // Update actions - should be batched with inserts
            ...Array.from({ length: 3 }, (_, index) => ({
              message: generateRecordPayload({
                identifiers: {
                  id: `mixed-update-${index + 1}`,
                },
                action: 'update',
              }),
              metadata: generateMetadata(index + 6),
              destination,
              connection,
            })),
            // Delete actions - should be batched separately
            ...Array.from({ length: 4 }, (_, index) => ({
              message: generateRecordPayload({
                identifiers: {
                  id: `mixed-delete-${index + 1}`,
                },
                action: 'delete',
              }),
              metadata: generateMetadata(index + 9),
              destination,
              connection,
            })),
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            // Batch 1: Insert and update actions combined
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertOrUpdateEndpoint,
                headers,
                params,
                body: {
                  JSON: {
                    ids: [
                      'mixed-insert-1',
                      'mixed-insert-2',
                      'mixed-insert-3',
                      'mixed-insert-4',
                      'mixed-insert-5',
                      'mixed-update-1',
                      'mixed-update-2',
                      'mixed-update-3',
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: Array.from({ length: 8 }, (_, i) => generateMetadata(i + 1)),
              batched: true,
              statusCode: 200,
              destination,
            },
            // Batch 2: Delete actions
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: deleteEndpoint,
                headers,
                params,
                body: {
                  JSON: {
                    ids: ['mixed-delete-1', 'mixed-delete-2', 'mixed-delete-3', 'mixed-delete-4'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: Array.from({ length: 4 }, (_, i) => generateMetadata(i + 9)),
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
    mockFns: () => {
      jest.replaceProperty(config, 'MAX_ITEMS', 100 as typeof config.MAX_ITEMS);
    },
  },
  /**
   * Test Case 4: Batch Processing with Error Handling
   *
   * Purpose: Tests router behavior when some events are invalid during batch processing:
   * - Validates that valid events are still batched correctly
   * - Tests that invalid events are handled individually with appropriate errors
   * - Ensures error handling doesn't affect valid event processing
   *
   * Expected Behavior:
   * - Valid events should be batched normally
   * - Invalid events should return individual error responses
   * - Processing should continue despite individual event errors
   */
  {
    id: 'customerio-audience-router-batch-with-errors-test',
    name: destType,
    description: 'Router test for batch processing with mixed valid and invalid events',
    scenario: 'Framework+Business',
    successCriteria:
      'Valid events should be batched, invalid events should return individual errors',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            // Valid events that should be batched
            ...Array.from({ length: 3 }, (_, index) => ({
              message: generateRecordPayload({
                identifiers: {
                  id: `batch-valid-${index + 1}`,
                },
                action: 'insert',
              }),
              metadata: generateMetadata(index + 1),
              destination,
              connection,
            })),
            // Invalid event - should cause individual error
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'batch-invalid-1',
                },
                action: 'invalid-action', // Invalid action
              }),
              metadata: generateMetadata(4),
              destination,
              connection,
            },
            // More valid events that should be batched
            ...Array.from({ length: 2 }, (_, index) => ({
              message: generateRecordPayload({
                identifiers: {
                  id: `batch-valid-${index + 4}`,
                },
                action: 'delete',
              }),
              metadata: generateMetadata(index + 5),
              destination,
              connection,
            })),
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            // Batch 1: Valid insert events
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertOrUpdateEndpoint,
                headers,
                params,
                body: {
                  JSON: {
                    ids: ['batch-valid-1', 'batch-valid-2', 'batch-valid-3'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
              batched: true,
              statusCode: 200,
              destination,
            },
            // Batch 2: Valid delete events
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: deleteEndpoint,
                headers,
                params,
                body: {
                  JSON: {
                    ids: ['batch-valid-4', 'batch-valid-5'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(5), generateMetadata(6)],
              batched: true,
              statusCode: 200,
              destination,
            },
            // Error: Invalid action
            {
              metadata: [generateMetadata(4)],
              batched: false,
              statusCode: 400,
              error:
                "action: Invalid enum value. Expected 'insert' | 'update' | 'delete', received 'invalid-action'",
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  /**
   * Test Case 5: Different Identifier Types
   *
   * Purpose: Tests router behavior with different identifier value types:
   * - Validates handling of string identifiers
   * - Validates handling of numeric identifiers
   * - Tests batching with mixed identifier types
   *
   * Expected Behavior:
   * - Both string and numeric identifiers should be accepted
   * - Events with different identifier types should be batched together
   * - Identifier values should be preserved correctly in batches
   */
  {
    id: 'customerio-audience-router-different-identifier-types-test',
    name: destType,
    description: 'Router test for handling different identifier value types (string vs number)',
    scenario: 'Framework+Business',
    successCriteria: 'Events with string and numeric identifiers should be batched correctly',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            // String identifiers
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'string-id-1',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination,
              connection,
            },
            // Numeric identifiers
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 12345,
                },
                action: 'insert',
              }),
              metadata: generateMetadata(2),
              destination,
              connection,
            },
            // More string identifiers
            {
              message: generateRecordPayload({
                identifiers: {
                  id: 'string-id-2',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(3),
              destination,
              connection,
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            // Batch: Mixed string and numeric identifiers
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: insertOrUpdateEndpoint,
                headers,
                params,
                body: {
                  JSON: {
                    ids: ['string-id-1', 12345, 'string-id-2'], // Mixed types preserved
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
