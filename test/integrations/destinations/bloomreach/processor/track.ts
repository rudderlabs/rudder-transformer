import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import { destType, destination, headers, properties, endpoint } from '../common';

export const track: ProcessorTestData[] = [
  {
    id: 'bloomreach-track-test-1',
    name: destType,
    description: 'Track call with anonymous user',
    scenario: 'Framework+Business',
    successCriteria: 'Response should contain all the mapping and status code should be 200',
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
              anonymousId: 'anonId123',
              event: 'Product Viewed',
              properties,
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-03-04T15:32:56.409Z',
            },
            metadata: generateMetadata(1),
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
              userId: '',
              endpoint,
              headers,
              JSON: {
                data: {
                  customer_ids: { cookie: 'anonId123' },
                  properties,
                  timestamp: 1709566376,
                  event_type: 'Product Viewed',
                },
                name: 'customers/events',
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
    id: 'bloomreach-track-test-2',
    name: destType,
    description: 'Track call with known user',
    scenario: 'Framework+Business',
    successCriteria: 'Response should contain all the mapping and status code should be 200',
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
              userId: 'userId123',
              anonymousId: 'anonId123',
              event: 'Product Added',
              properties,
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-03-04T15:32:56.409Z',
            },
            metadata: generateMetadata(1),
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
              userId: '',
              endpoint,
              headers,
              JSON: {
                data: {
                  customer_ids: { registered: 'userId123', cookie: 'anonId123' },
                  properties,
                  timestamp: 1709566376,
                  event_type: 'Product Added',
                },
                name: 'customers/events',
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
    id: 'bloomreach-track-test-3',
    name: destType,
    description: 'Track call with no properties',
    scenario: 'Framework+Business',
    successCriteria: 'Response should contain all the mapping and status code should be 200',
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
              anonymousId: 'anonId123',
              event: 'test_event',
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-03-04T15:32:56.409Z',
            },
            metadata: generateMetadata(1),
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
              userId: '',
              endpoint,
              headers,
              JSON: {
                data: {
                  customer_ids: { cookie: 'anonId123' },
                  timestamp: 1709566376,
                  event_type: 'test_event',
                },
                name: 'customers/events',
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
