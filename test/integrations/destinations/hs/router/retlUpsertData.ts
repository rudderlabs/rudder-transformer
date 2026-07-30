import { authHeader1, authHeader3, secret1, secret3 } from '../maskedSecrets';
import { HS_RETL_SPLIT_TEST_WORKSPACE_ID } from './retlSplitData';

/**
 * Component coverage for the gated rETL upsert path (v3 endpoint).
 *
 * These are self-contained fixtures appended AFTER `withRetlSplitCases(...)` in
 * data.ts, so they are NOT auto-duplicated as behaviour-preservation split cases.
 *
 * Flow exercised: `retl-transform.processBatchRouterRetl` -> uniqueness gate
 * (`util.isLookupFieldUnique`, objectType-aware) -> tag `upsertObject` and SKIP
 * `splitEventsForCreateUpdate` (no Search chain) ->
 * `retl-hs-transform-v3.processRetlIdentify` (upsert payload) ->
 * `retl-hs-transform-v3.batchRetlEvents` (upsert bucket, dedup by id+idProperty).
 *
 * Preconditions provided by the shared mocks:
 * - `metadata.workspaceId = HS_RETL_SPLIT_TEST_WORKSPACE_ID` -> gated split path is on
 *   (DEST_HS_RETL_SPLIT_WORKSPACE_IDS is set in test/setup.ts).
 * - objectType `contacts` + identifierType `email`, which the shared
 *   `/crm/v3/properties/contacts` mock reports as `hasUniqueValue: true`, so the
 *   gate resolves to upsert. The identifier lives in `externalId.id` and is NOT
 *   copied into `properties` (mirrors event-stream `processUpsertIdentify`).
 * - A dedicated fallback fixture below uses `secret3`, whose shared
 *   `/crm/v3/properties/contacts` mock reports `email.hasUniqueValue = false`; that
 *   proves the gated path falls back to `splitEventsForCreateUpdate` and the normal
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
    description:
      'rETL (gated split, v3): unique identifierType -> batch upsert for objectType (single event)',
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
                workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
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
                  workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
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
    description:
      'rETL (gated split, v3): numeric external id is stringified for batch upsert payload id',
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
                workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
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
                  workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
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
      'rETL (gated split, v3): unique identifierType -> single batch upsert with multiple events',
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
                workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
              },
            },
            {
              destination: retlDestination,
              message: identifyMessage('carol@example.com', { firstname: 'Carol' }),
              metadata: {
                jobId: 5003,
                userId: 'u2',
                workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
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
                  workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
                },
                {
                  jobId: 5003,
                  userId: 'u2',
                  workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
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
      'rETL (gated split, v3): duplicate id in batch is deduplicated (properties merged, first jobId kept as objectWriteTraceId)',
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
                workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
              },
            },
            {
              destination: retlDestination,
              message: identifyMessage('dup@example.com', { firstname: 'Updated' }),
              metadata: {
                jobId: 5005,
                userId: 'u2',
                workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
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
                  workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
                },
                {
                  jobId: 5005,
                  userId: 'u2',
                  workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
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
      'rETL (gated split, v3): non-unique identifierType falls back to search-driven update flow instead of batch upsert',
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
                workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
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
                  workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID,
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
