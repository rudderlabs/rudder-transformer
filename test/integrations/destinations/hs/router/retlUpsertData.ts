import { authHeader1, authHeader3, secret1, secret3 } from '../maskedSecrets';

/**
 * Component coverage for the rETL upsert path (v3 endpoint).
 *
 * These are self-contained fixtures appended after the base fixtures in data.ts.
 *
 * Flow exercised: `retl-transform.processBatchRouterRetl` -> uniqueness gate
 * (`util.isLookupFieldUnique`, objectType-aware) -> tag `upsertObject` and SKIP
 * `splitEventsForCreateUpdate` (no Search chain) ->
 * `retl-v3.processRetlIdentify` (upsert payload) ->
 * `retl-v3.batchRetlEvents` (upsert bucket, dedup by id+idProperty).
 *
 * Preconditions provided by the shared mocks:
 * - rETL (mappedToDestination) identify events, which route to the dedicated rETL
 *   code path.
 * - objectType `contacts` + identifierType `email`, which the shared
 *   `/crm/v3/properties/contacts` mock reports as `hasUniqueValue: true`, so the
 *   gate resolves to upsert. The identifier lives in `externalId.id` and is NOT
 *   copied into `properties` (mirrors event-stream `processUpsertIdentify`).
 * - A dedicated fallback fixture below uses `secret3`, whose shared
 *   `/crm/v3/properties/contacts` mock reports `email.hasUniqueValue = false`; that
 *   proves the path falls back to `splitEventsForCreateUpdate` and the normal
 *   create/update routing instead of the upsert endpoint.
 */

const retlDestination = {
  ID: 'hs-retl-upsert-dest',
  Config: {
    authorizationType: 'newPrivateAppApi',
    accessToken: secret1,
    apiVersion: 'newApi',
    lookupField: 'email',
  },
};

const retlNonUniqueDestination = {
  ID: 'hs-retl-non-unique-dest',
  Config: {
    authorizationType: 'newPrivateAppApi',
    accessToken: secret3,
    apiVersion: 'newApi',
    lookupField: 'email',
  },
};

const retlContext = (identifierValue: string | number, identifierType = 'email') => ({
  mappedToDestination: true,
  externalId: [{ identifierType, id: identifierValue, type: 'HS-contacts' }],
  sources: {
    job_id: 'retl-upsert-job',
    task_id: 'retl-upsert-task',
    version: 'v1.0.0',
  },
});

const identifyMessage = (
  identifierValue: string | number,
  traits: Record<string, unknown>,
  identifierType = 'email',
) => ({
  type: 'identify',
  channel: 'web',
  context: retlContext(identifierValue, identifierType),
  traits,
  userId: '12345',
  messageId: `msg-${identifierValue}`,
  originalTimestamp: '2024-01-15T10:00:00.000Z',
  sentAt: '2024-01-15T10:00:00.000Z',
  integrations: { All: true },
});

const UPSERT_ENDPOINT = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert';
const UPSERT_ENDPOINT_PATH = '/crm/v3/objects/contacts/batch/upsert';

export const retlUpsertData: Record<string, unknown>[] = [
  {
    name: 'hs',
    description: 'rETL (v3): unique identifierType -> batch upsert for objectType (single event)',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: retlDestination,
              message: identifyMessage('alice@example.com', {
                firstname: 'Alice',
                country: 'India',
              }),
              metadata: {
                jobId: 5001,
                userId: 'u1',
              },
            },
          ],
          destType: 'hs',
        },
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
                endpoint: UPSERT_ENDPOINT,
                endpointPath: UPSERT_ENDPOINT_PATH,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        id: 'alice@example.com',
                        idProperty: 'email',
                        properties: {
                          firstname: 'Alice',
                          country: 'India',
                        },
                        objectWriteTraceId: '5001',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 5001,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: retlDestination,
            },
          ],
        },
      },
    },
    envOverrides: {},
  },
  {
    name: 'hs',
    id: 'hs-retl-upsert-numeric-external-id',
    description: 'rETL (v3): numeric external id is stringified for batch upsert payload id',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: retlDestination,
              message: identifyMessage(9868, { firstname: 'Numeric' }, 'user_id'),
              metadata: {
                jobId: 5007,
                userId: 'u1',
              },
            },
          ],
          destType: 'hs',
        },
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
                endpoint: UPSERT_ENDPOINT,
                endpointPath: UPSERT_ENDPOINT_PATH,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        id: '9868',
                        idProperty: 'user_id',
                        properties: { firstname: 'Numeric' },
                        objectWriteTraceId: '5007',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 5007,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: retlDestination,
            },
          ],
        },
      },
    },
    envOverrides: {},
  },
  {
    name: 'hs',
    description: 'rETL (v3): unique identifierType -> single batch upsert with multiple events',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: retlDestination,
              message: identifyMessage('bob@example.com', { firstname: 'Bob' }),
              metadata: {
                jobId: 5002,
                userId: 'u1',
              },
            },
            {
              destination: retlDestination,
              message: identifyMessage('carol@example.com', { firstname: 'Carol' }),
              metadata: {
                jobId: 5003,
                userId: 'u2',
              },
            },
          ],
          destType: 'hs',
        },
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
                endpoint: UPSERT_ENDPOINT,
                endpointPath: UPSERT_ENDPOINT_PATH,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        id: 'bob@example.com',
                        idProperty: 'email',
                        properties: { firstname: 'Bob' },
                        objectWriteTraceId: '5002',
                      },
                      {
                        id: 'carol@example.com',
                        idProperty: 'email',
                        properties: { firstname: 'Carol' },
                        objectWriteTraceId: '5003',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 5002,
                  userId: 'u1',
                },
                {
                  jobId: 5003,
                  userId: 'u2',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: retlDestination,
            },
          ],
        },
      },
    },
    envOverrides: {},
  },
  {
    name: 'hs',
    description:
      'rETL (v3): duplicate id in batch is deduplicated (properties merged, first jobId kept as objectWriteTraceId)',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: retlDestination,
              message: identifyMessage('dup@example.com', {
                firstname: 'First',
                country: 'India',
              }),
              metadata: {
                jobId: 5004,
                userId: 'u1',
              },
            },
            {
              destination: retlDestination,
              message: identifyMessage('dup@example.com', { firstname: 'Updated' }),
              metadata: {
                jobId: 5005,
                userId: 'u2',
              },
            },
          ],
          destType: 'hs',
        },
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
                endpoint: UPSERT_ENDPOINT,
                endpointPath: UPSERT_ENDPOINT_PATH,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        id: 'dup@example.com',
                        idProperty: 'email',
                        // {...First, ...Updated}: firstname overwritten, country retained
                        properties: {
                          firstname: 'Updated',
                          country: 'India',
                        },
                        objectWriteTraceId: '5004',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 5004,
                  userId: 'u1',
                },
                {
                  jobId: 5005,
                  userId: 'u2',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: retlDestination,
            },
          ],
        },
      },
    },
    envOverrides: {},
  },
  {
    name: 'hs',
    description:
      'rETL (v3): non-unique identifierType falls back to search-driven update flow instead of batch upsert',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: retlNonUniqueDestination,
              message: identifyMessage('secondary@email.com', {
                firstname: 'Karen',
                lastname: 'Peñarete',
              }),
              metadata: {
                jobId: 5006,
                userId: 'u1',
              },
            },
          ],
          destType: 'hs',
        },
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update',
                endpointPath: '/crm/v3/objects/contacts/batch/update',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader3,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        id: '103689',
                        properties: {
                          firstname: 'Karen',
                          lastname: 'Peñarete',
                        },
                        objectWriteTraceId: '5006',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 5006,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: retlNonUniqueDestination,
            },
          ],
        },
      },
    },
    envOverrides: {},
  },
];

/**
 * Component coverage for the rETL record id path (v3 endpoint).
 *
 * Flow exercised: `retl-transform.processBatchRouterRetl` -> identifierType is
 * `hs_object_id` -> fail missing/malformed record ids up front (before any hubspot
 * call) -> tag the rest `updateObject` with the record id and SKIP both
 * `isLookupFieldUnique` and `splitEventsForCreateUpdate` (no Search chain) ->
 * `retl-v3.processRetlIdentify` (update payload) ->
 * `retl-v3.batchRetlEvents` (update bucket, dedup by id).
 *
 * No Search mock exists for these record ids, so any Search call would surface as
 * a failed batch instead of the expected batch update.
 */

const recordIdDestination = {
  ID: 'hs-retl-record-id-dest',
  Config: {
    authorizationType: 'newPrivateAppApi',
    accessToken: secret1,
    apiVersion: 'newApi',
    lookupField: 'email',
  },
};

const recordIdLegacyDestination = {
  ID: 'hs-retl-record-id-legacy-dest',
  Config: {
    ...recordIdDestination.Config,
    apiVersion: 'legacyApi',
  },
};

// the shared mocks answer the properties call for this token with a 401
const recordIdUnauthorizedDestination = {
  ID: 'hs-retl-record-id-unauthorized-dest',
  Config: {
    authorizationType: 'newPrivateAppApi',
    accessToken: 'invalid-api-key',
    apiVersion: 'newApi',
    lookupField: 'email',
  },
};

// body of the shared 401 properties mock
const unauthorizedResponse = {
  status: 'error',
  message: 'The access token provided is invalid.',
  correlationId: 'correlation-id',
  category: 'INVALID_AUTHENTICATION',
  links: {},
};

const recordIdMessage = (
  recordId: string | number | null,
  traits: Record<string, unknown>,
  objectType = 'contacts',
) => ({
  type: 'identify',
  channel: 'sources',
  context: {
    mappedToDestination: true,
    externalId: [{ identifierType: 'hs_object_id', id: recordId, type: `HS-${objectType}` }],
    sources: {
      job_id: 'retl-record-id-job',
      task_id: 'retl-record-id-task',
      version: 'v1.0.0',
    },
  },
  traits,
  userId: String(recordId),
  messageId: `msg-${recordId}`,
  originalTimestamp: '2024-01-15T10:00:00.000Z',
  sentAt: '2024-01-15T10:00:00.000Z',
  integrations: { All: true },
});

const batchUpdate = (
  objectType: string,
  inputs: Record<string, unknown>[],
  metadata: Record<string, unknown>[],
  destination: Record<string, unknown> = recordIdDestination,
) => ({
  batchedRequest: {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: `https://api.hubapi.com/crm/v3/objects/${objectType}/batch/update`,
    endpointPath: `/crm/v3/objects/${objectType}/batch/update`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader1,
    },
    params: {},
    body: {
      JSON: { inputs },
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    files: {},
  },
  metadata,
  batched: true,
  statusCode: 200,
  destination,
});

const invalidRecordId = (
  recordId: string,
  metadata: Record<string, unknown>,
  destination: Record<string, unknown> = recordIdDestination,
) => ({
  metadata: [metadata],
  batched: false,
  statusCode: 400,
  error: recordId
    ? `rETL - invalid HubSpot record id "${recordId}"`
    : 'rETL - HubSpot record id (hs_object_id) is empty',
  statTags: {
    destType: 'HS',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
    feature: 'router',
    implementation: 'native',
    module: 'destination',
  },
  destination,
});

const routerCase = (
  id: string,
  description: string,
  input: Record<string, unknown>[],
  output: Record<string, unknown>[],
) => ({
  name: 'hs',
  id,
  description,
  feature: 'router',
  module: 'destination',
  version: 'v0',
  input: {
    request: {
      body: { input, destType: 'hs' },
      method: 'POST',
    },
  },
  output: {
    response: {
      status: 200,
      body: { output },
    },
  },
});

export const retlRecordIdData: Record<string, unknown>[] = [
  routerCase(
    'hs-retl-record-id-contacts-batch-update',
    'rETL (v3): hs_object_id identifier -> direct batch update, no search, record id not sent as a property',
    [
      {
        destination: recordIdDestination,
        message: recordIdMessage(101, { firstname: 'Alice', hs_object_id: 101 }),
        metadata: { jobId: 6001, userId: 'u1' },
      },
      {
        destination: recordIdDestination,
        message: recordIdMessage('202', { firstname: 'Bob' }),
        metadata: { jobId: 6002, userId: 'u1' },
      },
    ],
    [
      batchUpdate(
        'contacts',
        [
          { id: '101', properties: { firstname: 'Alice' }, objectWriteTraceId: '6001' },
          { id: '202', properties: { firstname: 'Bob' }, objectWriteTraceId: '6002' },
        ],
        [
          { jobId: 6001, userId: 'u1' },
          { jobId: 6002, userId: 'u1' },
        ],
      ),
    ],
  ),
  routerCase(
    'hs-retl-record-id-invalid-ids',
    'rETL (v3): missing or non-numeric hs_object_id fails only that record',
    [
      {
        destination: recordIdDestination,
        message: recordIdMessage(303, { firstname: 'Carol' }),
        metadata: { jobId: 6003, userId: 'u1' },
      },
      {
        destination: recordIdDestination,
        message: recordIdMessage(null, { firstname: 'NoId' }),
        metadata: { jobId: 6004, userId: 'u1' },
      },
      {
        destination: recordIdDestination,
        message: recordIdMessage('abc', { firstname: 'BadId' }),
        metadata: { jobId: 6005, userId: 'u1' },
      },
    ],
    [
      batchUpdate(
        'contacts',
        [{ id: '303', properties: { firstname: 'Carol' }, objectWriteTraceId: '6003' }],
        [{ jobId: 6003, userId: 'u1' }],
      ),
      invalidRecordId('', { jobId: 6004, userId: 'u1' }),
      invalidRecordId('abc', { jobId: 6005, userId: 'u1' }),
    ],
  ),
  routerCase(
    'hs-retl-record-id-invalid-fails-before-hubspot',
    'rETL (v3): invalid hs_object_id fails up front, not with the hubspot properties error',
    [
      {
        destination: recordIdUnauthorizedDestination,
        message: recordIdMessage(707, { firstname: 'Valid' }),
        metadata: { jobId: 6011, userId: 'u1' },
      },
      {
        destination: recordIdUnauthorizedDestination,
        message: recordIdMessage(null, { firstname: 'NoId' }),
        metadata: { jobId: 6009, userId: 'u1' },
      },
      {
        destination: recordIdUnauthorizedDestination,
        message: recordIdMessage('12.5', { firstname: 'FloatId' }),
        metadata: { jobId: 6010, userId: 'u1' },
      },
    ],
    [
      invalidRecordId('', { jobId: 6009, userId: 'u1' }, recordIdUnauthorizedDestination),
      invalidRecordId('12.5', { jobId: 6010, userId: 'u1' }, recordIdUnauthorizedDestination),
      {
        metadata: [{ jobId: 6011, userId: 'u1' }],
        batched: false,
        statusCode: 401,
        error: JSON.stringify({
          message: `Failed to get hubspot properties: ${JSON.stringify(unauthorizedResponse)}`,
          destinationResponse: { response: unauthorizedResponse, status: 401 },
        }),
        statTags: {
          destType: 'HS',
          errorCategory: 'network',
          errorType: 'aborted',
          feature: 'router',
          implementation: 'native',
          module: 'destination',
        },
        destination: recordIdUnauthorizedDestination,
      },
    ],
  ),
  routerCase(
    'hs-retl-record-id-duplicate-ids',
    'rETL (v3): duplicate hs_object_id in a batch is merged into a single update input',
    [
      {
        destination: recordIdDestination,
        message: recordIdMessage(404, { firstname: 'Dan', lastname: 'Old' }),
        metadata: { jobId: 6006, userId: 'u1' },
      },
      {
        destination: recordIdDestination,
        message: recordIdMessage(404, { lastname: 'New' }),
        metadata: { jobId: 6007, userId: 'u1' },
      },
    ],
    [
      batchUpdate(
        'contacts',
        [
          {
            id: '404',
            properties: { firstname: 'Dan', lastname: 'New' },
            objectWriteTraceId: '6006,6007',
          },
        ],
        [
          { jobId: 6006, userId: 'u1' },
          { jobId: 6007, userId: 'u1' },
        ],
      ),
    ],
  ),
  routerCase(
    'hs-retl-record-id-legacy-api-batch-update',
    'rETL (legacy API): hs_object_id identifier -> direct batch update with duplicate ids merged, no search',
    [
      {
        destination: recordIdLegacyDestination,
        message: recordIdMessage(606, { firstname: 'Erin', lastname: 'Old' }),
        metadata: { jobId: 6012, userId: 'u1' },
      },
      {
        destination: recordIdLegacyDestination,
        message: recordIdMessage(606, { lastname: 'New' }),
        metadata: { jobId: 6013, userId: 'u1' },
      },
    ],
    [
      batchUpdate(
        'contacts',
        [
          {
            id: '606',
            properties: { firstname: 'Erin', lastname: 'New' },
            objectWriteTraceId: '6012,6013',
          },
        ],
        [
          { jobId: 6012, userId: 'u1' },
          { jobId: 6013, userId: 'u1' },
        ],
        recordIdLegacyDestination,
      ),
    ],
  ),
];
