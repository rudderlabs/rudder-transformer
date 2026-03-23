import { authHeader1, secret1 } from '../maskedSecrets';

/**
 * Test data for HubSpot V3 Upsert functionality
 * Tests cover:
 * - Upsert enabled via feature flag
 * - Upsert disabled (fallback to legacy search flow)
 * - hsContactId provided (uses existing update flow)
 * - Batch upsert with multiple events
 * - idProperty from lookupField mapping
 * - objectWriteTraceId (jobId) inclusion in payload
 */

// Mock environment variables for tests
// Note: These should be set in the test setup or via jest.mock

export const upsertData = [
  {
    name: 'hs',
    description: 'Test: Upsert enabled - single identify event with email as lookupField',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                ID: 'destId123',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'email',
                },
              },
              message: {
                type: 'identify',
                sentAt: '2024-01-15T10:00:00.000Z',
                traits: {
                  email: 'test@example.com',
                  firstname: 'John',
                  lastname: 'Doe',
                  company: 'TestCorp',
                },
                userId: 'user123',
                channel: 'web',
                context: {
                  ip: '192.168.1.1',
                },
                messageId: 'msg-001',
                timestamp: '2024-01-15T10:00:00.000Z',
                originalTimestamp: '2024-01-15T10:00:00.000Z',
              },
              metadata: {
                jobId: 1001,
                userId: 'user123',
                workspaceId: 'ws-upsert-enabled',
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        id: 'test@example.com',
                        idProperty: 'email',
                        properties: {
                          email: 'test@example.com',
                          firstname: 'John',
                          lastname: 'Doe',
                          company: 'TestCorp',
                        },
                        objectWriteTraceId: '1001',
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
                  jobId: 1001,
                  userId: 'user123',
                  workspaceId: 'ws-upsert-enabled',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                ID: 'destId123',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'email',
                },
              },
            },
          ],
        },
      },
    },
    envOverrides: {
      HUBSPOT_UPSERT_ENABLED_WORKSPACES: 'ws-upsert-enabled',
    },
  },
  {
    name: 'hs',
    description: 'Test: Upsert with custom lookupField (user_id)',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                ID: 'destId456',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'user_id',
                },
              },
              message: {
                type: 'identify',
                sentAt: '2024-01-15T10:00:00.000Z',
                traits: {
                  email: 'custom@example.com',
                  user_id: 'custom-uid-12345',
                  firstname: 'Jane',
                  lastname: 'Smith',
                },
                userId: 'user456',
                channel: 'web',
                context: {},
                messageId: 'msg-002',
                timestamp: '2024-01-15T10:00:00.000Z',
                originalTimestamp: '2024-01-15T10:00:00.000Z',
              },
              metadata: {
                jobId: 1002,
                userId: 'user456',
                workspaceId: 'ws-upsert-enabled',
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        id: 'custom-uid-12345',
                        idProperty: 'user_id',
                        properties: {
                          email: 'custom@example.com',
                          firstname: 'Jane',
                          lastname: 'Smith',
                        },
                        objectWriteTraceId: '1002',
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
                  jobId: 1002,
                  userId: 'user456',
                  workspaceId: 'ws-upsert-enabled',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                ID: 'destId456',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'user_id',
                },
              },
            },
          ],
        },
      },
    },
    envOverrides: {
      HUBSPOT_UPSERT_ENABLED_WORKSPACES: 'ws-upsert-enabled',
    },
  },
  {
    name: 'hs',
    description: 'Test: Batch upsert with multiple identify events',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                ID: 'destId789',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'email',
                },
              },
              message: {
                type: 'identify',
                sentAt: '2024-01-15T10:00:00.000Z',
                traits: {
                  email: 'user1@example.com',
                  firstname: 'User',
                  lastname: 'One',
                },
                userId: 'user1',
                channel: 'web',
                context: {},
                messageId: 'msg-batch-001',
                timestamp: '2024-01-15T10:00:00.000Z',
                originalTimestamp: '2024-01-15T10:00:00.000Z',
              },
              metadata: {
                jobId: 2001,
                userId: 'user1',
                workspaceId: 'ws-upsert-enabled',
              },
            },
            {
              destination: {
                ID: 'destId789',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'email',
                },
              },
              message: {
                type: 'identify',
                sentAt: '2024-01-15T10:00:01.000Z',
                traits: {
                  email: 'user2@example.com',
                  firstname: 'User',
                  lastname: 'Two',
                },
                userId: 'user2',
                channel: 'web',
                context: {},
                messageId: 'msg-batch-002',
                timestamp: '2024-01-15T10:00:01.000Z',
                originalTimestamp: '2024-01-15T10:00:01.000Z',
              },
              metadata: {
                jobId: 2002,
                userId: 'user2',
                workspaceId: 'ws-upsert-enabled',
              },
            },
            {
              destination: {
                ID: 'destId789',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'email',
                },
              },
              message: {
                type: 'identify',
                sentAt: '2024-01-15T10:00:02.000Z',
                traits: {
                  email: 'user3@example.com',
                  firstname: 'User',
                  lastname: 'Three',
                },
                userId: 'user3',
                channel: 'web',
                context: {},
                messageId: 'msg-batch-003',
                timestamp: '2024-01-15T10:00:02.000Z',
                originalTimestamp: '2024-01-15T10:00:02.000Z',
              },
              metadata: {
                jobId: 2003,
                userId: 'user3',
                workspaceId: 'ws-upsert-enabled',
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        id: 'user1@example.com',
                        idProperty: 'email',
                        properties: {
                          email: 'user1@example.com',
                          firstname: 'User',
                          lastname: 'One',
                        },
                        objectWriteTraceId: '2001',
                      },
                      {
                        id: 'user2@example.com',
                        idProperty: 'email',
                        properties: {
                          email: 'user2@example.com',
                          firstname: 'User',
                          lastname: 'Two',
                        },
                        objectWriteTraceId: '2002',
                      },
                      {
                        id: 'user3@example.com',
                        idProperty: 'email',
                        properties: {
                          email: 'user3@example.com',
                          firstname: 'User',
                          lastname: 'Three',
                        },
                        objectWriteTraceId: '2003',
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
                  jobId: 2001,
                  userId: 'user1',
                  workspaceId: 'ws-upsert-enabled',
                },
                {
                  jobId: 2002,
                  userId: 'user2',
                  workspaceId: 'ws-upsert-enabled',
                },
                {
                  jobId: 2003,
                  userId: 'user3',
                  workspaceId: 'ws-upsert-enabled',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                ID: 'destId789',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'email',
                },
              },
            },
          ],
        },
      },
    },
    envOverrides: {
      HUBSPOT_UPSERT_ENABLED_WORKSPACES: 'ws-upsert-enabled',
    },
  },
  {
    name: 'hs',
    description: 'Test: Upsert with lookupField fallback to email when custom field not found',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                ID: 'destIdFallback',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'custom_field_not_present',
                },
              },
              message: {
                type: 'identify',
                sentAt: '2024-01-15T10:00:00.000Z',
                traits: {
                  email: 'fallback@example.com',
                  firstname: 'Fallback',
                  lastname: 'User',
                },
                userId: 'userFallback',
                channel: 'web',
                context: {},
                messageId: 'msg-fallback',
                timestamp: '2024-01-15T10:00:00.000Z',
                originalTimestamp: '2024-01-15T10:00:00.000Z',
              },
              metadata: {
                jobId: 3001,
                userId: 'userFallback',
                workspaceId: 'ws-upsert-enabled',
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        id: 'fallback@example.com',
                        idProperty: 'email',
                        properties: {
                          email: 'fallback@example.com',
                          firstname: 'Fallback',
                          lastname: 'User',
                        },
                        objectWriteTraceId: '3001',
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
                  jobId: 3001,
                  userId: 'userFallback',
                  workspaceId: 'ws-upsert-enabled',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                ID: 'destIdFallback',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'custom_field_not_present',
                },
              },
            },
          ],
        },
      },
    },
    envOverrides: {
      HUBSPOT_UPSERT_ENABLED_WORKSPACES: 'ws-upsert-enabled',
    },
  },
  {
    name: 'hs',
    description: 'Test: Upsert deduplication - same email in batch should be deduplicated',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                ID: 'destIdDedup',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'email',
                },
              },
              message: {
                type: 'identify',
                sentAt: '2024-01-15T10:00:00.000Z',
                traits: {
                  email: 'duplicate@example.com',
                  firstname: 'First',
                  lastname: 'Version',
                },
                userId: 'userDedup1',
                channel: 'web',
                context: {},
                messageId: 'msg-dedup-001',
                timestamp: '2024-01-15T10:00:00.000Z',
                originalTimestamp: '2024-01-15T10:00:00.000Z',
              },
              metadata: {
                jobId: 4001,
                userId: 'userDedup1',
                workspaceId: 'ws-upsert-enabled',
              },
            },
            {
              destination: {
                ID: 'destIdDedup',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'email',
                },
              },
              message: {
                type: 'identify',
                sentAt: '2024-01-15T10:00:01.000Z',
                traits: {
                  email: 'duplicate@example.com',
                  firstname: 'Updated',
                  lastname: 'Version',
                },
                userId: 'userDedup2',
                channel: 'web',
                context: {},
                messageId: 'msg-dedup-002',
                timestamp: '2024-01-15T10:00:01.000Z',
                originalTimestamp: '2024-01-15T10:00:01.000Z',
              },
              metadata: {
                jobId: 4002,
                userId: 'userDedup2',
                workspaceId: 'ws-upsert-enabled',
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        id: 'duplicate@example.com',
                        idProperty: 'email',
                        properties: {
                          email: 'duplicate@example.com',
                          firstname: 'Updated',
                          lastname: 'Version',
                        },
                        objectWriteTraceId: '4001',
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
                  jobId: 4001,
                  userId: 'userDedup1',
                  workspaceId: 'ws-upsert-enabled',
                },
                {
                  jobId: 4002,
                  userId: 'userDedup2',
                  workspaceId: 'ws-upsert-enabled',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                ID: 'destIdDedup',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'email',
                },
              },
            },
          ],
        },
      },
    },
    envOverrides: {
      HUBSPOT_UPSERT_ENABLED_WORKSPACES: 'ws-upsert-enabled',
    },
  },
];
