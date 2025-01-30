import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { defaultMockFns } from '../mocks';
import {
  destType,
  destination,
  headers,
  RouterInstrumentationErrorStatTags,
  insertOrUpdateEndpoint,
  deleteEndpoint,
  connection,
  params,
} from '../common';

const routerRequest = {
  input: [
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-1',
        },
        action: 'insert',
      }),
      metadata: generateMetadata(1),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-2',
        },
        action: 'insert',
      }),
      metadata: generateMetadata(2),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-3',
        },
        action: 'insert',
      }),
      metadata: generateMetadata(3),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-4',
        },
        action: 'insert',
      }),
      metadata: generateMetadata(4),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-5',
        },
        action: 'update',
      }),
      metadata: generateMetadata(5),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-6',
        },
        action: 'delete',
      }),
      metadata: generateMetadata(6),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-7',
        },
        action: 'delete',
      }),
      metadata: generateMetadata(7),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-8',
        },
        action: 'dummy-action',
      }),
      metadata: generateMetadata(8),
      destination,
      connection,
    },
    {
      message: {
        type: 'identify',
        anonymousId: 'anonId1',
        userId: 'userId1',
        integrations: {
          All: true,
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(9),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        action: 'insert',
      }),
      metadata: generateMetadata(10),
      destination,
      connection,
    },
  ],
  destType,
};

export const data = [
  {
    id: 'customerio-segment-router-test-1',
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
                method: 'POST',
                endpoint: insertOrUpdateEndpoint,
                headers,
                params,
                body: {
                  JSON: {
                    ids: ['test-id-1', 'test-id-2', 'test-id-3'],
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
                endpoint: insertOrUpdateEndpoint,
                headers,
                params,
                body: {
                  JSON: {
                    ids: ['test-id-4', 'test-id-5'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(4), generateMetadata(5)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: deleteEndpoint,
                headers,
                params,
                body: {
                  JSON: {
                    ids: ['test-id-6', 'test-id-7'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(6), generateMetadata(7)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(8)],
              batched: false,
              statusCode: 400,
              error: 'action dummy-action is not supported',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(9)],
              batched: false,
              statusCode: 400,
              error: 'message type identify is not supported',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(10)],
              batched: false,
              statusCode: 400,
              error: 'identifiers cannot be empty',
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
