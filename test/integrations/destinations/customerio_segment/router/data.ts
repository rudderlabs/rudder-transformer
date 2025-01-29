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
        action: 'update',
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
        action: 'update',
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
        action: 'insert',
      }),
      metadata: generateMetadata(8),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-9',
        },
        action: 'delete',
      }),
      metadata: generateMetadata(9),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-10',
        },
        action: 'delete',
      }),
      metadata: generateMetadata(10),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-11',
        },
        action: 'delete',
      }),
      metadata: generateMetadata(11),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-12',
        },
        action: 'dummy-action',
      }),
      metadata: generateMetadata(12),
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
      metadata: generateMetadata(13),
      destination,
      connection,
    },
    {
      message: generateRecordPayload({
        action: 'insert',
      }),
      metadata: generateMetadata(14),
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
                    ids: ['test-id-4', 'test-id-5', 'test-id-6'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(4), generateMetadata(5), generateMetadata(6)],
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
                    ids: ['test-id-11'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(11)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(12)],
              batched: false,
              statusCode: 400,
              error: 'action dummy-action is not supported',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(13)],
              batched: false,
              statusCode: 400,
              error: 'message type identify is not supported',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(14)],
              batched: false,
              statusCode: 400,
              error: 'identifiers cannot be empty',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(10)],
              batched: false,
              statusCode: 400,
              error: "customer with 'id':'test-id-10' is not present in customer io",
              statTags: { ...RouterInstrumentationErrorStatTags, errorType: 'configuration' },
              destination,
            },
            {
              metadata: [generateMetadata(7)],
              batched: false,
              statusCode: 401,
              error:
                '{"message":"error fetching customers : {\\"response\\":{\\"errors\\":[{\\"detail\\":\\"unauthorized\\",\\"status\\":\\"401\\"}]},\\"status\\":401}","destinationResponse":{"response":{"errors":[{"detail":"unauthorized","status":"401"}]},"status":401}}',
              statTags: {
                ...RouterInstrumentationErrorStatTags,
                errorCategory: 'network',
                errorType: 'aborted',
              },
              destination,
            },
            {
              metadata: [generateMetadata(8)],
              batched: false,
              statusCode: 401,
              error:
                '{"message":"error fetching customers : {\\"response\\":{\\"errors\\":[{\\"detail\\":\\"unauthorized\\",\\"status\\":\\"401\\"}]},\\"status\\":401}","destinationResponse":{"response":{"errors":[{"detail":"unauthorized","status":"401"}]},"status":401}}',
              statTags: {
                ...RouterInstrumentationErrorStatTags,
                errorCategory: 'network',
                errorType: 'aborted',
              },
              destination,
            },
            {
              metadata: [generateMetadata(9)],
              batched: false,
              statusCode: 401,
              error:
                '{"message":"error fetching customers : {\\"response\\":{\\"errors\\":[{\\"detail\\":\\"unauthorized\\",\\"status\\":\\"401\\"}]},\\"status\\":401}","destinationResponse":{"response":{"errors":[{"detail":"unauthorized","status":"401"}]},"status":401}}',
              statTags: {
                ...RouterInstrumentationErrorStatTags,
                errorCategory: 'network',
                errorType: 'aborted',
              },
              destination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
