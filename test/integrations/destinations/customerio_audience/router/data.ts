import { generateMetadata, generateRecordPayload, overrideDestination } from '../../../testUtils';
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
  inValidConnection,
  RouterConfigurationErrorStatTags,
} from '../common';

const routerRequest1 = {
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
        action: 'insert',
        identifiers: {
          id: 'test-id-9',
        },
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
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-7',
          email: 'test@gmail.com',
        },
        action: 'insert',
      }),
      metadata: generateMetadata(11),
      destination,
      connection,
    },
  ],
  destType,
};

// scenario when all the events are malfunctioned
const routerRequest2 = {
  input: [
    {
      message: generateRecordPayload({
        identifiers: {
          id: [],
        },
        action: 'insert',
      }),
      metadata: generateMetadata(1),
      destination,
      connection: inValidConnection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-1',
        },
        action: 'insert',
      }),
      metadata: generateMetadata(2),
      destination,
      connection: inValidConnection,
    },
    {
      message: generateRecordPayload({
        identifiers: {
          id: 'test-id-1',
        },
        action: 'insert',
      }),
      metadata: generateMetadata(3),
      destination,
      connection: {
        ...connection,
        config: {
          ...connection.config,
          destination: {
            audienceId: 'test-audience-id',
          },
        },
      },
    },
  ],
  destType,
};

export const data = [
  {
    id: 'customerio-segment-router-test-1',
    name: destType,
    description: 'Basic Router Test to test correct record payloads',
    scenario: 'Framework+Business',
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
              error:
                "action: Invalid enum value. Expected 'insert' | 'update' | 'delete', received 'dummy-action'",
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(9)],
              batched: false,
              statusCode: 400,
              error: 'type: Invalid literal value, expected "record"',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(10)],
              batched: false,
              statusCode: 400,
              error: 'identifiers: cannot be empty',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(11)],
              batched: false,
              statusCode: 400,
              error: 'identifiers: only one identifier is supported',
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
    id: 'customerio-segment-router-test-2',
    name: destType,
    description: 'Basic Router Test to test incorrect connection config',
    scenario: 'Framework',
    successCriteria: 'All events should throw error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest2,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error:
                'audienceId: String must contain at least 1 character(s); identifierMappings: Required',
              statTags: RouterConfigurationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 400,
              error:
                'audienceId: String must contain at least 1 character(s); identifierMappings: Required',
              statTags: RouterConfigurationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(3)],
              batched: false,
              statusCode: 400,
              error: 'identifierMappings: Required',
              statTags: RouterConfigurationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
