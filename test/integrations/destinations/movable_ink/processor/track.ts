import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import { destType, channel, destination, headers, trackTestProperties } from '../common';

export const track: ProcessorTestData[] = [
  {
    id: 'MovableInk-track-test-1',
    name: destType,
    description: 'Track call: Product Added event',
    scenario: 'Framework+Business',
    successCriteria:
      'Response should contain the input payload with few additional mappings configured in transformer and status code should be 200',
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
              channel,
              anonymousId: 'anonId123',
              userId: 'userId123',
              event: 'Product Added',
              properties: trackTestProperties['Product Added'],
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-03-04T15:32:56.409Z',
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              userId: '',
              endpoint: destination.Config.endpoint,
              headers,
              JSON: {
                type: 'track',
                channel,
                userId: 'userId123',
                anonymousId: 'anonId123',
                event: 'Product Added',
                properties: trackTestProperties['Product Added'],
                integrations: {
                  All: true,
                },
                originalTimestamp: '2024-03-04T15:32:56.409Z',
                timestamp: 1709566376409,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'MovableInk-track-test-2',
    name: destType,
    description: 'Track call: Order Completed event',
    scenario: 'Framework+Business',
    successCriteria:
      'Response should contain the input payload with few additional mappings configured in transformer and status code should be 200',
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
              channel,
              anonymousId: 'anonId123',
              userId: 'userId123',
              event: 'Order Completed',
              properties: trackTestProperties['Order Completed'],
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-03-04T15:32:56.409Z',
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              userId: '',
              endpoint: destination.Config.endpoint,
              headers,
              JSON: {
                type: 'track',
                channel,
                userId: 'userId123',
                anonymousId: 'anonId123',
                event: 'Order Completed',
                properties: trackTestProperties['Order Completed'],
                integrations: {
                  All: true,
                },
                originalTimestamp: '2024-03-04T15:32:56.409Z',
                timestamp: 1709566376409,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'MovableInk-track-test-3',
    name: destType,
    description: 'Track call: Custom event',
    scenario: 'Framework+Business',
    successCriteria:
      'Response should contain the input payload with few additional mappings configured in transformer and status code should be 200',
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
              channel,
              anonymousId: 'anonId123',
              userId: 'userId123',
              event: 'Custom Event',
              properties: trackTestProperties['Custom Event'],
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-03-04T15:32:56.409Z',
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              userId: '',
              endpoint: destination.Config.endpoint,
              headers,
              JSON: {
                type: 'track',
                channel,
                userId: 'userId123',
                anonymousId: 'anonId123',
                event: 'Custom Event',
                properties: trackTestProperties['Custom Event'],
                integrations: {
                  All: true,
                },
                originalTimestamp: '2024-03-04T15:32:56.409Z',
                timestamp: 1709566376409,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
