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

const UPDATE_ENDPOINT = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update';
const NOT_FOUND_MESSAGE =
  'Could not get some CONTACT objects, they may be deleted or not exist. Check that ids are valid.';
const NOT_UPDATED_MESSAGE =
  '[HUBSPOT] Record not updated: HubSpot left its id out of the batch/update results without an error (e.g. the record was merged into another one).';
const MULTI_STATUS_MESSAGE =
  '[HUBSPOT Response V1 Handler] - Batch upsert completed with partial results';

/**
 * 207 Multi-Status handling for the HubSpot batch update API.
 *
 * batch/update reports a missing record (OBJECT_NOT_FOUND) in errors[], echoing the failed
 * input's objectWriteTraceId in error.context (next to the record id in context.ids). Each update
 * input carries the job id(s) it was built from as objectWriteTraceId (comma-separated when
 * several events were merged into one input), so the handler fails exactly those jobs; every
 * other job in the batch succeeds.
 * Network mocks: network.ts (batch/update, ids 90001 / 90002).
 */
export const updateMultiStatusData = [
  {
    name: 'hs',
    id: 'hs_update_207_record_not_found_merged_input',
    description:
      '207 from batch/update: a missing record id fails every job merged into its input, the rest succeed',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: UPDATE_ENDPOINT,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [
                { id: '90001', properties: { firstname: 'Alive' }, objectWriteTraceId: '1' },
                { id: '90002', properties: { firstname: 'Gone' }, objectWriteTraceId: '2,3' },
              ],
            },
          },
          [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
          { apiVersion: 'newApi' },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 207,
            message: MULTI_STATUS_MESSAGE,
            response: [
              { statusCode: 200, metadata: generateMetadata(1), error: 'success' },
              { statusCode: 400, metadata: generateMetadata(2), error: NOT_FOUND_MESSAGE },
              { statusCode: 400, metadata: generateMetadata(3), error: NOT_FOUND_MESSAGE },
            ],
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_update_200_merged_record_id_left_out',
    description:
      '200 from batch/update that leaves a merged-away record id out of the results: every job merged into that input fails, the rest succeed',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: UPDATE_ENDPOINT,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader1,
            },
            JSON: {
              inputs: [
                { id: '90003', properties: { firstname: 'Alive' }, objectWriteTraceId: '4' },
                { id: '90004', properties: { firstname: 'Merged' }, objectWriteTraceId: '5,6' },
              ],
            },
          },
          [generateMetadata(4), generateMetadata(5), generateMetadata(6)],
          { apiVersion: 'newApi' },
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 207,
            message: MULTI_STATUS_MESSAGE,
            response: [
              { statusCode: 200, metadata: generateMetadata(4), error: 'success' },
              { statusCode: 400, metadata: generateMetadata(5), error: NOT_UPDATED_MESSAGE },
              { statusCode: 400, metadata: generateMetadata(6), error: NOT_UPDATED_MESSAGE },
            ],
          },
        },
      },
    },
  },
];
