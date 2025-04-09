import { defaultMockFns } from '../mocks';
import {
  commonOutput1,
  commonUpsertDestConfig,
  commonConnectionConfigV2,
  commonConnectionConfigV2_2,
  commonConnectionConfigV2_3,
  commonConnectionConfigCustomModuleV2,
  commonUpsertDestConfig2,
  commonUpsertDestConfig2CustomModule,
  commonUpsertDestConfig3,
  destType,
  upsertPayload1V2,
  upsertPayload2V2,
  upsertPayload3V2,
} from '../common';

export const upsertData = [
  {
    name: destType,
    description: 'Happy flow with Leads module V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload1V2,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig,
              connection: commonConnectionConfigV2,
            },
            {
              message: upsertPayload2V2,
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig,
              connection: commonConnectionConfigV2,
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
                method: 'POST',
                endpoint: 'https://www.zohoapis.com/crm/v6/Leads/upsert',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: {
                    duplicate_check_fields: ['email', 'Email'],
                    data: [
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                      },
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                        'multi-language': ['Bengali'],
                      },
                    ],
                    $append_values: {
                      'multi-language': 'true',
                      'multi class': 'false',
                    },
                    trigger: ['workflow'],
                  },
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
              destination: commonUpsertDestConfig,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    description: 'Happy flow with Trigger None V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload1V2,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig2,
              connection: commonConnectionConfigV2_2,
            },
            {
              message: upsertPayload2V2,
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig2,
              connection: commonConnectionConfigV2_2,
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
                method: 'POST',
                endpoint: 'https://www.zohoapis.com/crm/v6/Leads/upsert',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: {
                    duplicate_check_fields: ['email', 'Email'],
                    data: [
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                      },
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                        'multi-language': ['Bengali'],
                      },
                    ],
                    $append_values: {
                      'multi-language': 'true',
                      'multi class': 'false',
                    },
                    trigger: [],
                  },
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
              destination: commonUpsertDestConfig2,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    description: 'Happy flow with custom Module V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                action: 'insert',
                context: {
                  mappedToDestination: 'true',
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
                  First_Name: 'subcribed',
                  Last_Name: ' User',
                  Name: 'ABC',
                },
                identifiers: {
                  Email: 'subscribed@eewrfrd.com',
                },
                type: 'record',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig2CustomModule,
              connection: commonConnectionConfigCustomModuleV2,
            },
            {
              message: {
                action: 'insert',
                context: {
                  mappedToDestination: 'true',
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
                  First_Name: 'subcribed',
                  Last_Name: ' User',
                  'multi-language': 'Bengali',
                  Name: 'ABC',
                },
                identifiers: {
                  Email: 'subscribed@eewrfrd.com',
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
              destination: commonUpsertDestConfig2,
              connection: commonConnectionConfigCustomModuleV2,
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
                method: 'POST',
                endpoint: 'https://www.zohoapis.com/crm/v6/CUSTOM/upsert',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: {
                    duplicate_check_fields: ['Email', 'Name'],
                    data: [
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                        Name: 'ABC',
                      },
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                        'multi-language': ['Bengali'],
                        Name: 'ABC',
                      },
                    ],
                    $append_values: {
                      'multi-language': 'true',
                      'multi class': 'false',
                    },
                    trigger: [],
                  },
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
              destination: commonUpsertDestConfig2CustomModule,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    description: 'If module specific mandatory field is absent, event will fail V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                action: 'insert',
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
                  First_Name: 'subcribed',
                  Last_Name: ' User',
                },
                type: 'record',
                identifiers: {
                  Email: 'subscribed@eewrfrd.com',
                },
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig,
              connection: commonConnectionConfigV2,
            },
            {
              message: {
                action: 'insert',
                context: {
                  mappedToDestination: 'true',
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
                  'multi-language': 'Bengali',
                  First_Name: 'subcribed',
                  Last_Name: null,
                },
                identifiers: {
                  email: 'subscribed@eewrfrd.com',
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
              destination: commonUpsertDestConfig,
              connection: commonConnectionConfigV2,
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
                method: 'POST',
                endpoint: 'https://www.zohoapis.com/crm/v6/Leads/upsert',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: {
                    duplicate_check_fields: ['email', 'Email'],
                    data: [
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                      },
                    ],
                    $append_values: {
                      'multi-language': 'true',
                      'multi class': 'false',
                    },
                    trigger: ['workflow'],
                  },
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
              destination: commonUpsertDestConfig,
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
              error: 'Leads object must have the Last_Name property(ies).',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                destType: 'ZOHO',
                module: 'destination',
                implementation: 'cdkV2',
                feature: 'router',
              },
              destination: commonUpsertDestConfig,
            },
          ],
        },
      },
    },
  },
  {
    name: destType,
    description:
      'If multiselect key decision is not set from UI, Rudderstack will consider those as normal fields V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload3V2,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig3,
              connection: commonConnectionConfigV2_3,
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
                method: 'POST',
                endpoint: 'https://www.zohoapis.com/crm/v6/Leads/upsert',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: commonOutput1,
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
              destination: commonUpsertDestConfig3,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    description: 'Test Batching V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload3V2,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig3,
              connection: commonConnectionConfigV2_3,
            },
            {
              message: upsertPayload3V2,
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig3,
              connection: commonConnectionConfigV2_3,
            },
            {
              message: upsertPayload3V2,
              metadata: {
                jobId: 3,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig3,
              connection: commonConnectionConfigV2_3,
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
                method: 'POST',
                endpoint: 'https://www.zohoapis.com/crm/v6/Leads/upsert',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: {
                    duplicate_check_fields: ['Email'],
                    data: [
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                      },
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                      },
                    ],
                    $append_values: {},
                    trigger: ['workflow'],
                  },
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
              destination: commonUpsertDestConfig3,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://www.zohoapis.com/crm/v6/Leads/upsert',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: commonOutput1,
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 3,
                  userId: 'u1',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonUpsertDestConfig3,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: destType,
    description: 'Test fields can be empty V2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload3V2,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig3,
              connection: commonConnectionConfigV2_3,
            },
            {
              message: {
                action: 'insert',
                context: {},
                fields: {},
                identifiers: {},
                type: 'record',
              },
              metadata: {},
              destination: commonUpsertDestConfig,
              connection: commonConnectionConfigV2_3,
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
                method: 'POST',
                endpoint: 'https://www.zohoapis.com/crm/v6/Leads/upsert',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: commonOutput1,
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
              destination: commonUpsertDestConfig3,
            },
            {
              batched: false,
              destination: commonUpsertDestConfig,
              error: '`fields` cannot be empty',
              metadata: [{}],
              statTags: {
                destType: 'ZOHO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'cdkV2',
                module: 'destination',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
