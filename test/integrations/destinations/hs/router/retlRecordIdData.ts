import { authHeader1, secret1 } from '../maskedSecrets';

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

const retlDestination = {
  ID: 'hs-retl-record-id-dest',
  Config: {
    authorizationType: 'newPrivateAppApi',
    accessToken: secret1,
    apiVersion: 'newApi',
    lookupField: 'email',
  },
};

// the shared mocks answer the properties call for this token with a 401
const retlUnauthorizedDestination = {
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

const identifyMessage = (
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
  destination: retlDestination,
});

const invalidRecordId = (
  recordId: string,
  metadata: Record<string, unknown>,
  destination: Record<string, unknown> = retlDestination,
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
        destination: retlDestination,
        message: identifyMessage(101, { firstname: 'Alice', hs_object_id: 101 }),
        metadata: { jobId: 6001, userId: 'u1' },
      },
      {
        destination: retlDestination,
        message: identifyMessage('202', { firstname: 'Bob' }),
        metadata: { jobId: 6002, userId: 'u1' },
      },
    ],
    [
      batchUpdate(
        'contacts',
        [
          { id: '101', properties: { firstname: 'Alice' } },
          { id: '202', properties: { firstname: 'Bob' } },
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
        destination: retlDestination,
        message: identifyMessage(303, { firstname: 'Carol' }),
        metadata: { jobId: 6003, userId: 'u1' },
      },
      {
        destination: retlDestination,
        message: identifyMessage(null, { firstname: 'NoId' }),
        metadata: { jobId: 6004, userId: 'u1' },
      },
      {
        destination: retlDestination,
        message: identifyMessage('abc', { firstname: 'BadId' }),
        metadata: { jobId: 6005, userId: 'u1' },
      },
    ],
    [
      batchUpdate(
        'contacts',
        [{ id: '303', properties: { firstname: 'Carol' } }],
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
        destination: retlUnauthorizedDestination,
        message: identifyMessage(707, { firstname: 'Valid' }),
        metadata: { jobId: 6011, userId: 'u1' },
      },
      {
        destination: retlUnauthorizedDestination,
        message: identifyMessage(null, { firstname: 'NoId' }),
        metadata: { jobId: 6009, userId: 'u1' },
      },
      {
        destination: retlUnauthorizedDestination,
        message: identifyMessage('12.5', { firstname: 'FloatId' }),
        metadata: { jobId: 6010, userId: 'u1' },
      },
    ],
    [
      invalidRecordId('', { jobId: 6009, userId: 'u1' }, retlUnauthorizedDestination),
      invalidRecordId('12.5', { jobId: 6010, userId: 'u1' }, retlUnauthorizedDestination),
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
        destination: retlUnauthorizedDestination,
      },
    ],
  ),
  routerCase(
    'hs-retl-record-id-duplicate-ids',
    'rETL (v3): duplicate hs_object_id in a batch is merged into a single update input',
    [
      {
        destination: retlDestination,
        message: identifyMessage(404, { firstname: 'Dan', lastname: 'Old' }),
        metadata: { jobId: 6006, userId: 'u1' },
      },
      {
        destination: retlDestination,
        message: identifyMessage(404, { lastname: 'New' }),
        metadata: { jobId: 6007, userId: 'u1' },
      },
    ],
    [
      batchUpdate(
        'contacts',
        [{ id: '404', properties: { firstname: 'Dan', lastname: 'New' } }],
        [
          { jobId: 6006, userId: 'u1' },
          { jobId: 6007, userId: 'u1' },
        ],
      ),
    ],
  ),
  routerCase(
    'hs-retl-record-id-companies-batch-update',
    'rETL (v3): hs_object_id identifier on a non-contact object -> direct batch update',
    [
      {
        destination: retlDestination,
        message: identifyMessage(505, { name: 'Acme' }, 'companies'),
        metadata: { jobId: 6008, userId: 'u1' },
      },
    ],
    [
      batchUpdate(
        'companies',
        [{ id: '505', properties: { name: 'Acme' } }],
        [{ jobId: 6008, userId: 'u1' }],
      ),
    ],
  ),
];
