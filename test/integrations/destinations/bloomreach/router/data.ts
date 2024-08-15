import { generateMetadata } from '../../../testUtils';
import { defaultMockFns } from '../mocks';
import {
  destType,
  destination,
  traits,
  properties,
  headers,
  endpoint,
  RouterInstrumentationErrorStatTags,
} from '../common';

const routerRequest = {
  input: [
    {
      message: {
        type: 'track',
        anonymousId: 'anonId1',
        event: 'test_event_1A',
        properties,
        integrations: {
          All: true,
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(1),
      destination,
    },
    {
      message: {
        type: 'identify',
        anonymousId: 'anonId1',
        userId: 'userId1',
        traits,
        integrations: {
          All: true,
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(2),
      destination,
    },
    {
      message: {
        type: 'track',
        anonymousId: 'anonId2',
        event: 'test_event_2A',
        properties,
        integrations: {
          All: true,
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(3),
      destination,
    },
    {
      message: {
        type: 'track',
        anonymousId: 'anonId1',
        userId: 'userId1',
        event: 'test_event_1B',
        properties,
        integrations: {
          All: true,
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(4),
      destination,
    },
    {
      message: {
        type: 'identify',
        traits,
        integrations: {
          All: true,
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(5),
      destination,
    },
  ],
  destType,
};
export const data = [
  {
    id: 'bloomreach-router-test-1',
    name: destType,
    description: 'Basic Router Test to test multiple payloads',
    scenario: 'Framework',
    successCriteria: 'All events should be transformed successfully and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest,
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
                endpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    commands: [
                      {
                        data: {
                          customer_ids: { cookie: 'anonId1' },
                          properties,
                          timestamp: 1709566376,
                          event_type: 'test_event_1A',
                        },
                        name: 'customers/events',
                      },
                      {
                        data: {
                          customer_ids: {
                            registered: 'userId1',
                            cookie: 'anonId1',
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
                      {
                        data: {
                          customer_ids: { cookie: 'anonId2' },
                          properties,
                          timestamp: 1709566376,
                          event_type: 'test_event_2A',
                        },
                        name: 'customers/events',
                      },
                    ],
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
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    commands: [
                      {
                        data: {
                          customer_ids: { registered: 'userId1', cookie: 'anonId1' },
                          properties,
                          timestamp: 1709566376,
                          event_type: 'test_event_1B',
                        },
                        name: 'customers/events',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(4)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(5)],
              batched: false,
              statusCode: 400,
              error: 'Either one of userId or anonymousId is required. Aborting',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
