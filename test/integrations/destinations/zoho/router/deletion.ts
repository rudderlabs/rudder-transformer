import { defaultMockFns } from '../mocks';
import {
  commonDeletionDestConfig,
  commonDeletionDestConfig2,
  deletionPayload1V2,
  commonDeletionConnectionConfigV2,
  commonConnectionConfigV2_4,
  destType,
} from '../common';

export const deleteData = [
  {
    name: destType,
    id: 'zoho_deletion_1',
    description: 'Happy flow record deletion with Contacts module V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                action: 'delete',
                context: {
                  sources: {
                    job_run_id: 'cgiiurt8um7k7n5dq480',
                    task_run_id: 'cgiiurt8um7k7n5dq48g',
                    job_id: '2MUWghI7u85n91dd1qzGyswpZan',
                    version: '895/merge',
                  },
                },
                recordId: '2',
                rudderId: '2',
                identifiers: {
                  Email: 'tobedeleted2@gmail.com',
                },
                fields: {
                  First_Name: 'subcribed2',
                  Last_Name: ' User2',
                },
                type: 'record',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonDeletionDestConfig2,
              connection: commonConnectionConfigV2_4,
            },
          ],
          destType,
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
                method: 'DELETE',
                endpoint:
                  'https://www.zohoapis.in/crm/v6/Contacts?ids=<RECORD_ID_2>&wf_trigger=false',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 2,
                  userId: 'u1',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonDeletionDestConfig2,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    id: 'zoho_deletion_1_v2',
    description: 'Happy flow record deletion with Leads module V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: deletionPayload1V2,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2,
            },
            {
              message: {
                action: 'delete',
                context: {
                  sources: {
                    job_run_id: 'cgiiurt8um7k7n5dq480',
                    task_run_id: 'cgiiurt8um7k7n5dq48g',
                    job_id: '2MUWghI7u85n91dd1qzGyswpZan',
                    version: '895/merge',
                  },
                },
                recordId: '2',
                rudderId: '2',
                fields: {
                  First_Name: 'subcribed2',
                  Last_Name: ' User2',
                },
                identifiers: {
                  Email: 'tobedeleted2@gmail.com',
                },
                type: 'record',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2,
            },
          ],
          destType,
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
                method: 'DELETE',
                endpoint:
                  'https://www.zohoapis.in/crm/v6/Leads?ids=<RECORD_ID_1>,<RECORD_ID_2>&wf_trigger=false',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
                {
                  jobId: 2,
                  userId: 'u1',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonDeletionDestConfig,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    id: 'zoho_deletion_2_v2',
    description: 'Batch containing already existing and non existing records for deletion V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: deletionPayload1V2,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2,
            },
            {
              message: {
                action: 'delete',
                context: {
                  sources: {
                    job_run_id: 'cgiiurt8um7k7n5dq480',
                    task_run_id: 'cgiiurt8um7k7n5dq48g',
                    job_id: '2MUWghI7u85n91dd1qzGyswpZan',
                    version: '895/merge',
                  },
                },
                recordId: '2',
                rudderId: '2',
                fields: {
                  First_Name: 'subcribed3',
                  Last_Name: ' User3',
                },
                identifiers: {
                  Email: 'tobedeleted3@gmail.com',
                },
                type: 'record',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2,
            },
          ],
          destType,
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
                method: 'DELETE',
                endpoint: 'https://www.zohoapis.in/crm/v6/Leads?ids=<RECORD_ID_1>&wf_trigger=false',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonDeletionDestConfig,
            },
            {
              metadata: [
                {
                  jobId: 2,
                  userId: 'u1',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'failed to fetch zoho id for record for "No Leads is found with record details"',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                destType: 'ZOHO',
                module: 'destination',
                implementation: 'cdkV2',
                feature: 'router',
              },
              destination: commonDeletionDestConfig,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    id: 'zoho_deletion_2_v2',
    description: 'Delete with invalid access token V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                action: 'delete',
                context: {
                  sources: {
                    job_run_id: 'cgiiurt8um7k7n5dq480',
                    task_run_id: 'cgiiurt8um7k7n5dq48g',
                    job_id: '2MUWghI7u85n91dd1qzGyswpZan',
                    version: '895/merge',
                  },
                },
                recordId: '2',
                rudderId: '2',
                fields: {
                  First_Name: 'subcribed3',
                  Last_Name: 'User3',
                },
                identifiers: {
                  Email: 'tobedeleted3@gmail.com',
                },
                type: 'record',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'expired-access-token',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2,
            },
          ],
          destType,
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
              batched: false,
              authErrorCategory: 'REFRESH_TOKEN',
              statusCode: 500,
              error: `{\"message\":\"[Zoho]:: {\\\"code\\\":\\\"INVALID_TOKEN\\\",\\\"details\\\":{},\\\"message\\\":\\\"invalid oauth token\\\",\\\"status\\\":\\\"error\\\"} during zoho record search\",\"destinationResponse\":{\"code\":\"INVALID_TOKEN\",\"details\":{},\"message\":\"invalid oauth token\",\"status\":\"error\"}}`,
              destination: commonDeletionDestConfig,
              metadata: [
                {
                  jobId: 2,
                  userId: 'u1',
                  secret: {
                    accessToken: 'expired-access-token',
                  },
                },
              ],
              statTags: {
                errorType: 'retryable',
                errorCategory: 'network',
                destType: 'ZOHO',
                module: 'destination',
                implementation: 'cdkV2',
                feature: 'router',
              },
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    id: 'zoho_deletion_2_v2',
    description: 'Test empty identifier in deletion payload V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                action: 'delete',
                context: {
                  sources: {
                    job_run_id: 'cgiiurt8um7k7n5dq480',
                    task_run_id: 'cgiiurt8um7k7n5dq48g',
                    job_id: '2MUWghI7u85n91dd1qzGyswpZan',
                    version: '895/merge',
                  },
                },
                recordId: '2',
                rudderId: '2',
                fields: {
                  First_Name: 'subcribed3',
                  Last_Name: ' User3',
                },
                identifiers: {},
                type: 'record',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2,
            },
          ],
          destType,
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
              metadata: [
                {
                  jobId: 2,
                  userId: 'u1',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
              ],
              batched: false,
              statusCode: 400,
              error: '`identifiers` cannot be empty',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'ZOHO',
                module: 'destination',
                implementation: 'cdkV2',
                feature: 'router',
              },
              destination: commonDeletionDestConfig,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    id: 'zoho_deletion_1_v2',
    description: 'Instrumentation error when the identifiers are empty in the payload V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                action: 'delete',
                context: {
                  sources: {
                    job_run_id: 'cgiiurt8um7k7n5dq480',
                    task_run_id: 'cgiiurt8um7k7n5dq48g',
                    job_id: '2MUWghI7u85n91dd1qzGyswpZan',
                    version: '895/merge',
                  },
                },
                recordId: '2',
                rudderId: '2',
                fields: {
                  First_Name: 'subcribed2',
                  Last_Name: ' User2',
                },
                identifiers: {
                  Email: '',
                },
                type: 'record',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2,
            },
          ],
          destType,
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
              metadata: [
                {
                  jobId: 2,
                  userId: 'u1',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'failed to fetch zoho id for record for "Identifier values are not provided for Leads"',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                destType: 'ZOHO',
                module: 'destination',
                implementation: 'cdkV2',
                feature: 'router',
              },
              destination: commonDeletionDestConfig,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
