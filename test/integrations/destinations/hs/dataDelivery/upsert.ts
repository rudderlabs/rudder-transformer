import { authHeader1 } from '../maskedSecrets';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

const UPSERT_ENDPOINT = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert';

/**
 * Test data for HubSpot batch upsert API 207 Multi-Status response handling
 *
 * Logic:
 * - Events with objectWriteTraceId in errors array are marked as failed (400)
 * - All other events are marked as success (200)
 *
 * Tests cover:
 * - 207 response with all contacts upserted successfully
 * - 207 response with all contacts failed to upsert
 * - 207 response with mixed success and failure (partial success)
 * - 207 response with custom lookup field
 */
export const upsertData = [
  {
    name: 'hs',
    id: 'hs_upsert_207_all_success',
    description: '207 Multi-Status response with all contacts upserted successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: UPSERT_ENDPOINT,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [
                {
                  id: 'user1@test.com',
                  idProperty: 'email',
                  properties: {
                    email: 'user1@test.com',
                    firstname: 'John',
                    lastname: 'Doe',
                  },
                  objectWriteTraceId: '1',
                },
                {
                  id: 'user2@test.com',
                  idProperty: 'email',
                  properties: {
                    email: 'user2@test.com',
                    firstname: 'Jane',
                    lastname: 'Smith',
                  },
                  objectWriteTraceId: '2',
                },
              ],
            },
          },
          [generateMetadata(1), generateMetadata(2)],
          {
            apiVersion: 'newApi',
          },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 207,
            message: '[HUBSPOT Response V1 Handler] - Batch upsert completed with partial results',
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
              {
                statusCode: 200,
                metadata: generateMetadata(2),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_upsert_207_all_failure',
    description: '207 Multi-Status response with all contacts failed to upsert',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: UPSERT_ENDPOINT,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [
                {
                  id: 'invalid-email',
                  idProperty: 'email',
                  properties: {
                    email: 'invalid-email',
                    firstname: 'Invalid',
                  },
                  objectWriteTraceId: '3',
                },
                {
                  id: 'another-invalid',
                  idProperty: 'email',
                  properties: {
                    email: 'another-invalid',
                    firstname: 'Also Invalid',
                  },
                  objectWriteTraceId: '4',
                },
              ],
            },
          },
          [generateMetadata(3), generateMetadata(4)],
          {
            apiVersion: 'newApi',
          },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 207,
            message: '[HUBSPOT Response V1 Handler] - Batch upsert completed with partial results',
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(3),
                error: 'Property value "invalid-email" is not a valid email',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(4),
                error: 'Property value "another-invalid" is not a valid email',
              },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_upsert_207_mixed_results',
    description: '207 Multi-Status response with mixed success and failure',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: UPSERT_ENDPOINT,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [
                {
                  id: 'valid@test.com',
                  idProperty: 'email',
                  properties: {
                    email: 'valid@test.com',
                    firstname: 'Valid',
                    lastname: 'User',
                  },
                  objectWriteTraceId: '5',
                },
                {
                  id: 'invalid-format',
                  idProperty: 'email',
                  properties: {
                    email: 'invalid-format',
                    firstname: 'Invalid',
                  },
                  objectWriteTraceId: '6',
                },
                {
                  id: 'another-valid@test.com',
                  idProperty: 'email',
                  properties: {
                    email: 'another-valid@test.com',
                    firstname: 'Another Valid',
                  },
                  objectWriteTraceId: '7',
                },
              ],
            },
          },
          [generateMetadata(5), generateMetadata(6), generateMetadata(7)],
          {
            apiVersion: 'newApi',
          },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 207,
            message: '[HUBSPOT Response V1 Handler] - Batch upsert completed with partial results',
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(5),
                error: 'success',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(6),
                error: 'Property value "invalid-format" is not a valid email',
              },
              {
                statusCode: 200,
                metadata: generateMetadata(7),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_upsert_207_custom_lookup_field',
    description: '207 Multi-Status response with custom lookup field (hs_object_id)',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: UPSERT_ENDPOINT,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [
                {
                  id: '12345',
                  idProperty: 'hs_object_id',
                  properties: {
                    firstname: 'John',
                    lastname: 'Doe',
                  },
                  objectWriteTraceId: '8',
                },
              ],
            },
          },
          [generateMetadata(8)],
          {
            apiVersion: 'newApi',
          },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 207,
            message: '[HUBSPOT Response V1 Handler] - Batch upsert completed with partial results',
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(8),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_upsert_207_no_errors_in_response',
    description: '207 Multi-Status response with no errors - all events marked as success',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: UPSERT_ENDPOINT,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [
                {
                  id: 'user@test.com',
                  idProperty: 'email',
                  properties: {
                    email: 'user@test.com',
                    firstname: 'Test',
                  },
                  objectWriteTraceId: '9',
                },
              ],
            },
          },
          [generateMetadata(9)],
          {
            apiVersion: 'newApi',
          },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 207,
            message: '[HUBSPOT Response V1 Handler] - Batch upsert completed with partial results',
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(9),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
];
