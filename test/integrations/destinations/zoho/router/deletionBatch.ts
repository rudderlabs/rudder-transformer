import { defaultMockFns, deletionBatchMock } from '../mocks';
import {
  commonDeletionDestConfig,
  commonDeletionDestConfig2,
  deletionPayload1V2,
  commonDeletionConnectionConfigV2,
  commonConnectionConfigV2_4,
  commonDeletionConnectionConfigV2_MultipleIdentifiers,
  destType,
} from '../common';

export const deleteDataBatch = [
  {
    name: destType,
    id: 'zoho_deletion_batch_1',
    description:
      'Successful batch deletion of single Contact record using V6 API with workspace-specific batching enabled',
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
                workspaceId: 'workspaceId2',
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
                  workspaceId: 'workspaceId2',
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
    envOverrides: {
      DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS: 'workspaceId2',
    },
  },
  {
    name: destType,
    id: 'zoho_deletion_batch_2',
    description:
      'Successful batch deletion of multiple Lead records (2 records batched into single DELETE request with comma-separated IDs)',
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
                workspaceId: 'workspaceId2',
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
                workspaceId: 'workspaceId2',
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
                  workspaceId: 'workspaceId2',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
                {
                  jobId: 2,
                  userId: 'u1',
                  workspaceId: 'workspaceId2',
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
    envOverrides: {
      DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS: 'workspaceId2',
    },
  },
  {
    name: destType,
    id: 'zoho_deletion_batch_3',
    description:
      'Partial batch success: one existing record deleted successfully, one non-existent record fails with 400 instrumentation error',
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
                workspaceId: 'workspaceId2',
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
                workspaceId: 'workspaceId2',
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
                  workspaceId: 'workspaceId2',
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
                  workspaceId: 'workspaceId2',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'failed to fetch zoho id for record: No Leads is found for record identifier Email:tobedeleted3@gmail.com',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'ZOHO',
                module: 'destination',
                implementation: 'cdkV2',
                feature: 'router',
                workspaceId: 'workspaceId2',
              },
              destination: commonDeletionDestConfig,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
    envOverrides: {
      DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS: 'workspaceId2',
    },
  },
  {
    name: destType,
    id: 'zoho_deletion_batch_4',
    description:
      'Authentication failure during record lookup: expired access token returns 500 retryable error with REFRESH_TOKEN auth category',
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
                workspaceId: 'workspaceId2',
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
                  workspaceId: 'workspaceId2',
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
                workspaceId: 'workspaceId2',
              },
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
    envOverrides: {
      DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS: 'workspaceId2',
    },
  },
  {
    name: destType,
    id: 'zoho_deletion_batch_5',
    description:
      'Validation error: empty identifiers object (no Email field) returns 400 error with dataValidation category',
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
                workspaceId: 'workspaceId2',
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
                  workspaceId: 'workspaceId2',
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
                workspaceId: 'workspaceId2',
              },
              destination: commonDeletionDestConfig,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
    envOverrides: {
      DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS: 'workspaceId2',
    },
  },
  {
    name: destType,
    id: 'zoho_deletion_batch_6',
    description:
      'Validation error: identifiers present but with empty Email value returns 400 error (identifier values not provided)',
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
                workspaceId: 'workspaceId2',
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
                  workspaceId: 'workspaceId2',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'failed to fetch zoho id for record: Identifier values are not provided for Leads',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'ZOHO',
                module: 'destination',
                implementation: 'cdkV2',
                feature: 'router',
                workspaceId: 'workspaceId2',
              },
              destination: commonDeletionDestConfig,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
    envOverrides: {
      DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS: 'workspaceId2',
    },
  },
  {
    name: destType,
    id: 'zoho_deletion_batch_7',
    description:
      'Partial batch deletion failure: 5 Lead records where record 3 is not found in Zoho, resulting in 3 successful batched deletions and 1 failed record',
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
                recordId: '1',
                rudderId: '1',
                identifiers: {
                  Email: 'tobedeleted1@gmail.com',
                  Phone: '+1234567801',
                  Company: 'Company One',
                  Website: 'https://company1.com',
                  Lead_Source: 'Direct',
                },
                fields: {
                  First_Name: 'User',
                  Last_Name: 'One',
                },
                type: 'record',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
                workspaceId: 'workspaceId2',
                secret: {
                  accessToken: 'correct-access-token-partial',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2_MultipleIdentifiers,
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
                identifiers: {
                  Email: 'tobedeleted2@gmail.com',
                  Phone: '+1234567802',
                  Company: 'Company Two',
                  Website: 'https://company2.com',
                  Lead_Source: 'Advertisement',
                },
                fields: {
                  First_Name: 'User',
                  Last_Name: 'Two',
                },
                type: 'record',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
                workspaceId: 'workspaceId2',
                secret: {
                  accessToken: 'correct-access-token-partial',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2_MultipleIdentifiers,
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
                recordId: '3',
                rudderId: '3',
                identifiers: {
                  Email: 'tobedeleted3@gmail.com',
                  Phone: '+1234567803',
                  Company: 'Company Three',
                  Website: 'https://company3.com',
                  Lead_Source: 'Referral',
                },
                fields: {
                  First_Name: 'User',
                  Last_Name: 'Three',
                },
                type: 'record',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
                workspaceId: 'workspaceId2',
                secret: {
                  accessToken: 'correct-access-token-partial',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2_MultipleIdentifiers,
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
                recordId: '4',
                rudderId: '4',
                identifiers: {
                  Email: 'tobedeleted4@gmail.com',
                  Phone: '+1234567804',
                  Company: 'Company Four',
                  Website: 'https://company4.com',
                  Lead_Source: 'Social Media',
                },
                fields: {
                  First_Name: 'User',
                  Last_Name: 'Four',
                },
                type: 'record',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
                workspaceId: 'workspaceId2',
                secret: {
                  accessToken: 'correct-access-token-partial',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2_MultipleIdentifiers,
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
                recordId: '5',
                rudderId: '5',
                identifiers: {
                  Email: 'tobedeleted5@gmail.com',
                  Phone: '+1234567805',
                  Company: 'Company Five',
                  Website: 'https://company5.com',
                  Lead_Source: 'Partner',
                },
                fields: {
                  First_Name: 'User',
                  Last_Name: 'Five',
                },
                type: 'record',
              },
              metadata: {
                jobId: 5,
                userId: 'u1',
                workspaceId: 'workspaceId2',
                secret: {
                  accessToken: 'correct-access-token-partial',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2_MultipleIdentifiers,
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
                  'https://www.zohoapis.in/crm/v6/Leads?ids=<RECORD_ID_1>,<RECORD_ID_2>,<RECORD_ID_4>&wf_trigger=false',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token-partial',
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
                  workspaceId: 'workspaceId2',
                  secret: {
                    accessToken: 'correct-access-token-partial',
                  },
                },
                {
                  jobId: 2,
                  userId: 'u1',
                  workspaceId: 'workspaceId2',
                  secret: {
                    accessToken: 'correct-access-token-partial',
                  },
                },
                {
                  jobId: 4,
                  userId: 'u1',
                  workspaceId: 'workspaceId2',
                  secret: {
                    accessToken: 'correct-access-token-partial',
                  },
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonDeletionDestConfig,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'DELETE',
                endpoint: 'https://www.zohoapis.in/crm/v6/Leads?ids=<RECORD_ID_5>&wf_trigger=false',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token-partial',
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
                  jobId: 5,
                  userId: 'u1',
                  workspaceId: 'workspaceId2',
                  secret: {
                    accessToken: 'correct-access-token-partial',
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
                  jobId: 3,
                  userId: 'u1',
                  workspaceId: 'workspaceId2',
                  secret: {
                    accessToken: 'correct-access-token-partial',
                  },
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'failed to fetch zoho id for record: No Leads is found for record identifier Company:Company Three|Email:tobedeleted3@gmail.com|Lead_Source:Referral|Phone:+1234567803|Website:https://company3.com',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'ZOHO',
                module: 'destination',
                implementation: 'cdkV2',
                feature: 'router',
                workspaceId: 'workspaceId2',
              },
              destination: commonDeletionDestConfig,
            },
          ],
        },
      },
    },
    mockFns: deletionBatchMock,
    envOverrides: {
      DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS: 'workspaceId2',
    },
  },
];
