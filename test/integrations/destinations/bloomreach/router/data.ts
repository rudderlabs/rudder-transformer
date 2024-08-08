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
  insertEndpoint,
  updateEndpoint,
  deleteEndpoint,
  sampleContext,
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

const routerRequest1 = {
  input: [
    {
      message: {
        type: 'record',
        action: 'insert',
        fields: {
          item_id: 'test-item-id',
          title: 'Hardcover Monthbooks',
          status: 'up to date',
          unprinted: 1,
        },
        channel: 'sources',
        context: sampleContext,
        recordId: '1',
      },
      metadata: generateMetadata(1),
      destination,
    },
    {
      message: {
        type: 'record',
        action: 'insert',
        fields: {
          item_id: 'test-item-id-7',
          title: 'Hardcover Monthbooks',
          status: 'up to date',
          unprinted: 1,
          test_empty: '',
          test_null: null,
          test_empty_array: [],
        },
        channel: 'sources',
        context: sampleContext,
        recordId: '2',
      },
      metadata: generateMetadata(2),
      destination,
    },
    {
      message: {
        type: 'record',
        action: 'update',
        fields: {
          item_id: 'test-item-id',
          title: 'Hardcover Monthbooks',
          status: 'up to date',
          unprinted: 3,
        },
        channel: 'sources',
        context: sampleContext,
        recordId: '3',
      },
      metadata: generateMetadata(3),
      destination,
    },
    {
      message: {
        type: 'record',
        action: 'update',
        fields: {
          item_id: 'test-item-id',
          title: 'Hardcover Monthbooks',
          status: 'up to date',
          unprinted: 2,
        },
        channel: 'sources',
        context: sampleContext,
        recordId: '4',
      },
      metadata: generateMetadata(4),
      destination,
    },
    {
      message: {
        type: 'record',
        action: 'delete',
        fields: {
          item_id: 'test-item-id-1',
          title: 'Hardcover Monthbooks',
          status: 'up to date',
          unprinted: 1,
        },
        channel: 'sources',
        context: sampleContext,
        recordId: '5',
      },
      metadata: generateMetadata(5),
      destination,
    },
    {
      message: {
        type: 'record',
        action: 'delete',
        fields: {
          item_id: 'test-item-id-2',
          title: 'Hardcover Monthbooks',
          status: 'up to date',
          unprinted: 1,
        },
        channel: 'sources',
        context: sampleContext,
        recordId: '6',
      },
      metadata: generateMetadata(6),
      destination,
    },
    {
      message: {
        type: 'record',
        action: 'delete',
        fields: {
          item_id: 'test-item-id-3',
          title: 'Hardcover Monthbooks',
          status: 'up to date',
          unprinted: 1,
        },
        channel: 'sources',
        context: sampleContext,
        recordId: '7',
      },
      metadata: generateMetadata(7),
      destination,
    },
    {
      message: {
        type: 'record',
        action: 'insert',
        fields: {},
        channel: 'sources',
        context: sampleContext,
        recordId: '8',
      },
      metadata: generateMetadata(8),
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
  {
    id: 'bloomreach-router-test-2',
    name: destType,
    description: 'Basic Router Test to test record payloads',
    scenario: 'Framework',
    successCriteria: 'All events should be transformed successfully and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest1,
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
                method: 'PUT',
                endpoint: insertEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch:
                      '[{"item_id":"test-item-id","properties":{"title":"Hardcover Monthbooks","status":"up to date","unprinted":1}},{"item_id":"test-item-id-7","properties":{"title":"Hardcover Monthbooks","status":"up to date","unprinted":1,"test_empty":"","test_null":null,"test_empty_array":[]}}]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: updateEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch:
                      '[{"item_id":"test-item-id","properties":{"title":"Hardcover Monthbooks","status":"up to date","unprinted":3}},{"item_id":"test-item-id","properties":{"title":"Hardcover Monthbooks","status":"up to date","unprinted":2}}]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(3), generateMetadata(4)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'DELETE',
                endpoint: deleteEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch: '["test-item-id-1","test-item-id-2"]',
                  },
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
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'DELETE',
                endpoint: deleteEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch: '["test-item-id-3"]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(7)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(8)],
              batched: false,
              statusCode: 400,
              error: 'Item Id is required. Aborting',
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
