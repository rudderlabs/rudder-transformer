import { generateMetadata } from '../../../testUtils';
import { defaultMockFns } from '../mocks';
import {
  destType,
  destination,
  headers,
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
    {
      message: {
        type: 'record',
        action: 'dummy-action',
        fields: {
          item_id: 'test-item-id',
        },
        channel: 'sources',
        context: sampleContext,
        recordId: '9',
      },
      metadata: generateMetadata(9),
      destination,
    },
    {
      message: {
        type: 'record',
        action: 'insert',
        fields: {
          item_id: null,
        },
        channel: 'sources',
        context: sampleContext,
        recordId: '10',
      },
      metadata: generateMetadata(10),
      destination,
    },
  ],
  destType,
};

export const data = [
  {
    id: 'bloomreach-catalog-router-test-1',
    name: destType,
    description: 'Basic Router Test to test record payloads',
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
                method: 'PUT',
                endpoint: insertEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch: JSON.stringify([
                      {
                        item_id: 'test-item-id',
                        properties: {
                          title: 'Hardcover Monthbooks',
                          status: 'up to date',
                          unprinted: 1,
                        },
                      },
                      {
                        item_id: 'test-item-id-7',
                        properties: {
                          title: 'Hardcover Monthbooks',
                          status: 'up to date',
                          unprinted: 1,
                          test_empty: '',
                          test_null: null,
                          test_empty_array: [],
                        },
                      },
                    ]),
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
                    batch: JSON.stringify([
                      {
                        item_id: 'test-item-id',
                        properties: {
                          title: 'Hardcover Monthbooks',
                          status: 'up to date',
                          unprinted: 3,
                        },
                      },
                      {
                        item_id: 'test-item-id',
                        properties: {
                          title: 'Hardcover Monthbooks',
                          status: 'up to date',
                          unprinted: 2,
                        },
                      },
                    ]),
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
                    batch: JSON.stringify(['test-item-id-1', 'test-item-id-2']),
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
                    batch: JSON.stringify(['test-item-id-3']),
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
              error: '`fields` cannot be empty',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(9)],
              batched: false,
              statusCode: 400,
              error:
                'Invalid action type dummy-action. You can only add, update or remove items from the catalog',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(10)],
              batched: false,
              statusCode: 400,
              error: '`item_id` cannot be empty',
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
