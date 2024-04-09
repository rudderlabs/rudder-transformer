import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import { destType, destination, traits, headers, endpoint } from '../common';

export const identify: ProcessorTestData[] = [
  {
    id: 'bloomreach-identify-test-1',
    name: destType,
    description: 'Identify call to create/update customer properties',
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
              type: 'identify',
              userId: 'userId123',
              anonymousId: 'anonId123',
              traits,
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
                  properties: {
                    email: 'test@example.com',
                    first_name: 'John',
                    last_name: 'Doe',
                    phone: '1234567890',
                    city: 'New York',
                    country: 'USA',
                    address: {
                      city: 'New York',
                      country: 'USA',
                      pinCode: '123456',
                    },
                  },
                  update_timestamp: 1709566376,
                },
                name: 'customers',
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
    id: 'bloomreach-identify-test-2',
    name: destType,
    description: 'Identify call with multiple hard and soft identifiers using integration object',
    scenario: 'Framework+Business',
    successCriteria:
      'Response should contain multiple hard and soft identifiers and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              userId: 'userId123',
              anonymousId: 'anonId123',
              traits,
              integrations: {
                All: true,
                bloomreach: {
                  hardID: {
                    hardID1: 'value1',
                  },
                  softID: {
                    google_analytics: 'gaId123',
                    softID2: 'value2',
                  },
                },
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
                  customer_ids: {
                    registered: 'userId123',
                    cookie: 'anonId123',
                    hardID1: 'value1',
                    google_analytics: 'gaId123',
                    softID2: 'value2',
                  },
                  properties: {
                    email: 'test@example.com',
                    first_name: 'John',
                    last_name: 'Doe',
                    phone: '1234567890',
                    city: 'New York',
                    country: 'USA',
                    address: {
                      city: 'New York',
                      country: 'USA',
                      pinCode: '123456',
                    },
                  },
                  update_timestamp: 1709566376,
                },
                name: 'customers',
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
