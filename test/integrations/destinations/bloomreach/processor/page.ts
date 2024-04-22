import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import { destType, destination, headers, endpoint } from '../common';

const properties = {
  category: 'Docs',
  path: '',
  referrer: '',
  search: '',
  title: '',
  url: '',
};

export const page: ProcessorTestData[] = [
  {
    id: 'bloomreach-page-test-1',
    name: destType,
    description: 'Page call with category from properties and root-level name',
    scenario: 'Framework+Business',
    successCriteria:
      'Response should contain event_name = "Viewed {{ category }} {{ name }} Page" and properties and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'page',
              anonymousId: 'anonId123',
              name: 'Integration',
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
                  event_type: 'Viewed Docs Integration Page',
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
    id: 'bloomreach-page-test-2',
    name: destType,
    description: 'Page call with category, name from properties',
    scenario: 'Framework+Business',
    successCriteria:
      'Response should contain event_name = "Viewed {{ category }} {{ name }} Page" and properties and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'page',
              anonymousId: 'anonId123',
              name: '',
              properties: { ...properties, name: 'Integration' },
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
                  properties: { ...properties, name: 'Integration' },
                  timestamp: 1709566376,
                  event_type: 'Viewed Docs Integration Page',
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
