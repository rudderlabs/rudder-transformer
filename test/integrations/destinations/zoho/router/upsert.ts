import { defaultMockFns } from '../mocks';
import {
  commonOutput1,
  commonUpsertDestConfig,
  commonUpsertDestConfig2,
  commonUpsertDestConfig2CustomModule,
  commonUpsertDestConfig3,
  destType,
  upsertPayload1,
  upsertPayload2,
  upsertPayload3,
} from '../common';

export const upsertData = [
  {
    name: destType,
    description: 'Happy flow with Leads module',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload1,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig,
            },
            {
              message: upsertPayload2,
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig,
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
    description: 'Happy flow with Trigger None',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload1,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig2,
            },
            {
              message: upsertPayload2,
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig2,
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
    description: 'Happy flow with custom Module',
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
                  externalId: [
                    {
                      type: 'ZOHO-CUSTOM',
                      identifierType: 'Email',
                    },
                  ],
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
                  Email: 'subscribed@eewrfrd.com',
                  First_Name: 'subcribed',
                  Last_Name: ' User',
                  Name: 'ABC',
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
            },
            {
              message: {
                action: 'insert',
                context: {
                  externalId: [
                    {
                      type: 'ZOHO-CUSTOM',
                      identifierType: 'Email',
                    },
                  ],
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
                  Email: 'subscribed@eewrfrd.com',
                  First_Name: 'subcribed',
                  Last_Name: ' User',
                  'multi-language': 'Bengali',
                  Name: 'ABC',
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
    description: 'If module specific mandatory field is absent, event will fail',
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
                  externalId: [
                    {
                      type: 'ZOHO-Leads',
                      identifierType: 'Email',
                    },
                  ],
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
                  Email: 'subscribed@eewrfrd.com',
                  First_Name: 'subcribed',
                  Last_Name: ' User',
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
              destination: commonUpsertDestConfig,
            },
            {
              message: {
                action: 'insert',
                context: {
                  externalId: [
                    {
                      type: 'ZOHO-Leads',
                      identifierType: 'Email',
                    },
                  ],
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
      'If multiselect key decision is not set from UI, Rudderstack will consider those as normal fields',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload3,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig3,
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
    description: 'Test Batching',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload3,
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig3,
            },
            {
              message: upsertPayload3,
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig3,
            },
            {
              message: upsertPayload3,
              metadata: {
                jobId: 3,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonUpsertDestConfig3,
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
];
