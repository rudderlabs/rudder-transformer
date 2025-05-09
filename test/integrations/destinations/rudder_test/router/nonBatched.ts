/**
 * Router test data file for rudder_test destination
 */

import { RouterTestData } from '../../../testTypes';
import { destination } from '../commonConfig';
import {
  generateSimplifiedTrackPayload,
  generateSimplifiedIdentifyPayload,
  transformResultBuilder,
  generateMetadata,
} from '../../../testUtils';

// Test data for router transformation
export const nonBatched: RouterTestData[] = [
  {
    id: 'rudder_test-router-test-1',
    name: 'rudder_test',
    description: 'Router transformation with batching disabled',
    scenario: 'Basic event batching',
    successCriteria: 'Events should be transformed with batching disabled',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateSimplifiedTrackPayload({
                userId: 'test-user-id',
                event: 'test-event',
                properties: {
                  testProperty: 'test-value',
                  numericProperty: 123,
                },
                context: {
                  traits: {
                    email: 'test@example.com',
                    name: 'Test User',
                  },
                },
                timestamp: '2023-01-01T12:00:00.000Z',
              }),
              destination,
              metadata: generateMetadata(1),
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
              batchedRequest: transformResultBuilder({
                method: 'POST',
                endpoint: 'https://rudder-platform.example.com/api',
                userId: 'test-user-id',
                JSON: {
                  type: 'track',
                  userId: 'test-user-id',
                },
              }),
              metadata: [generateMetadata(1)],
              destination,
              batched: false,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'rudder_test-router-test-2',
    name: 'rudder_test',
    description: 'Router transformation with batching enabled',
    scenario: 'Basic event batching',
    successCriteria: 'Events should be transformed with batching enabled',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: generateSimplifiedTrackPayload({
                userId: 'test-user-id-1',
                event: 'test-event-1',
                properties: {
                  testProperty: 'test-value-1',
                  numericProperty: 123,
                },
                context: {
                  traits: {
                    email: 'test1@example.com',
                    name: 'Test User 1',
                  },
                },
                timestamp: '2023-01-01T12:00:00.000Z',
              }),
              destination: {
                ...destination,
                Config: {
                  ...destination.Config,
                  enableBatching: 'true',
                },
              },
              metadata: generateMetadata(1),
            },
            {
              message: generateSimplifiedIdentifyPayload({
                userId: 'test-user-id-2',
                traits: {
                  email: 'test2@example.com',
                  name: 'Test User 2',
                  plan: 'premium',
                },
                context: {
                  traits: {},
                },
                timestamp: '2023-01-01T12:00:00.000Z',
              }),
              destination: {
                ...destination,
                Config: {
                  ...destination.Config,
                  enableBatching: 'true',
                },
              },
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
                  userId: 'test-user-id-1',
                  JSON: {
                    type: 'track',
                    userId: 'test-user-id-1',
                  },
                }),
                transformResultBuilder({
                  method: 'POST',
                  endpoint: 'https://rudder-platform.example.com/api',
                  userId: 'test-user-id-2',
                  JSON: {
                    type: 'identify',
                    userId: 'test-user-id-2',
                  },
                }),
              ],
              metadata: [generateMetadata(1), generateMetadata(2)],
              destination: {
                ...destination,
                Config: {
                  ...destination.Config,
                  enableBatching: 'true',
                },
              },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
