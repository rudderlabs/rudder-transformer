/**
 * Main processor test data file for rudder_test destination
 */

import { ProcessorTestData } from '../../../testTypes';
import { destination, metadata } from '../commonConfig';
import {
  generateSimplifiedTrackPayload,
  generateSimplifiedIdentifyPayload,
  transformResultBuilder,
} from '../../../testUtils';

// Test data for processor transformation
export const data: ProcessorTestData[] = [
  {
    id: 'rudder_test-processor-test-1',
    name: 'rudder_test',
    description: 'Process basic track event with minimal transformation',
    scenario: 'Basic event processing',
    successCriteria: 'Event should be transformed with original message preserved',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://rudder-platform.example.com/api',
              userId: 'test-user-id',
              JSON: {
                type: 'track',
                userId: 'test-user-id',
              },
            }),
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'rudder_test-processor-test-2',
    name: 'rudder_test',
    description: 'Process basic identify event with minimal transformation',
    scenario: 'Basic event processing',
    successCriteria: 'Event should be transformed with original message preserved',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: generateSimplifiedIdentifyPayload({
              userId: 'test-user-id',
              traits: {
                email: 'test@example.com',
                name: 'Test User',
                plan: 'premium',
              },
              context: {
                traits: {},
              },
              timestamp: '2023-01-01T12:00:00.000Z',
            }),
            destination,
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://rudder-platform.example.com/api',
              userId: 'test-user-id',
              JSON: {
                type: 'identify',
                userId: 'test-user-id',
              },
            }),
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
];
