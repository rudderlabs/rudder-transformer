/**
 * Batch transform test data file for rudder_test destination
 */

import { RouterTestData } from '../../../testTypes';
import { destination } from '../commonConfig';
import {
  generateSimplifiedTrackPayload,
  generateSimplifiedIdentifyPayload,
  transformResultBuilder,
  generateMetadata,
} from '../../../testUtils';

// Test data for batch transform functionality
export const data: RouterTestData[] = [
  {
    id: 'rudder_test-batch-test-1',
    name: 'rudder_test',
    description: 'Batch transform with multiple events',
    scenario: 'Direct batch processing',
    successCriteria:
      'Events should be transformed as a batch without checking enableBatching config',
    feature: 'batch',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateSimplifiedTrackPayload({
                userId: 'batch-user-id-1',
                event: 'batch-event-1',
                properties: {
                  testProperty: 'batch-value-1',
                  numericProperty: 123,
                },
                context: {
                  traits: {
                    email: 'batch1@example.com',
                    name: 'Batch User 1',
                  },
                },
                timestamp: '2023-01-01T12:00:00.000Z',
              }),
              destination,
              metadata: generateMetadata(1),
            },
            {
              message: generateSimplifiedIdentifyPayload({
                userId: 'batch-user-id-2',
                traits: {
                  email: 'batch2@example.com',
                  name: 'Batch User 2',
                  plan: 'premium',
                },
                context: {
                  traits: {},
                },
                timestamp: '2023-01-01T12:00:00.000Z',
              }),
              destination,
              metadata: generateMetadata(2),
            },
          ],
          destType: 'rudder_test',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                transformResultBuilder({
                  method: 'POST',
                  endpoint: 'https://rudder-platform.example.com/api',
                  userId: 'batch-user-id-1',
                  JSON: {
                    type: 'track',
                    userId: 'batch-user-id-1',
                  },
                }),
                transformResultBuilder({
                  method: 'POST',
                  endpoint: 'https://rudder-platform.example.com/api',
                  userId: 'batch-user-id-2',
                  JSON: {
                    type: 'identify',
                    userId: 'batch-user-id-2',
                  },
                }),
              ],
              metadata: [generateMetadata(1), generateMetadata(2)],
              destination,
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'rudder_test-batch-test-2',
    name: 'rudder_test',
    description: 'Batch transform with empty events array',
    scenario: 'Empty batch processing',
    successCriteria: 'Should handle empty events array gracefully',
    feature: 'batch',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [],
          destType: 'rudder_test',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [],
        },
      },
    },
  },
];
