import { defaultMockFns } from '../mocks';
import { destType } from '../common';

export const data = [
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
              message: {
                action: 'insert',
                context: {
                  externalId: [
                    {
                      type: 'ZOHO-LEADS',
                      identifierType: 'email',
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
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'workflow',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
              },
            },
            {
              message: {
                action: 'insert',
                context: {
                  externalId: [
                    {
                      type: 'ZOHO-Leads',
                      identifierType: 'email',
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
                },
                type: 'record',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'workflow',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
              },
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://accounts.zoho.com/crm/v6/LEADS/upsert',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      duplicate_check_fields: ['email', 'Name'],
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
              ],
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'workflow',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
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
    description: 'Happy flow with Trigger None',
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
                      type: 'ZOHO-LEADS',
                      identifierType: 'email',
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
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'None',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
              },
            },
            {
              message: {
                action: 'insert',
                context: {
                  externalId: [
                    {
                      type: 'ZOHO-Leads',
                      identifierType: 'email',
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
                },
                type: 'record',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'None',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
              },
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://accounts.zoho.com/crm/v6/LEADS/upsert',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      duplicate_check_fields: ['email', 'Name'],
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
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'None',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
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
                      identifierType: 'email',
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
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'None',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
              },
            },
            {
              message: {
                action: 'insert',
                context: {
                  externalId: [
                    {
                      type: 'ZOHO-CUSTOM',
                      identifierType: 'email',
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
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'None',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
              },
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://accounts.zoho.com/crm/v6/CUSTOM/upsert',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      duplicate_check_fields: ['email', 'Name'],
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
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'None',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
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
                      identifierType: 'email',
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
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'workflow',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
              },
            },
            {
              message: {
                action: 'insert',
                context: {
                  externalId: [
                    {
                      type: 'ZOHO-Leads',
                      identifierType: 'email',
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
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  region: 'US',
                  module: 'Leads',
                  trigger: 'workflow',
                  addDefaultDuplicateCheck: true,
                  multiSelectFieldLevelDecision: [
                    {
                      from: 'multi-language',
                      to: 'true',
                    },
                    {
                      from: 'multi class',
                      to: 'false',
                    },
                  ],
                  oneTrustCookieCategories: [
                    {
                      oneTrustCookieCategory: 'Marketing',
                    },
                  ],
                },
              },
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: [
      {
        batchedRequest: [
          {
            version: '1',
            type: 'REST',
            method: 'POST',
            endpoint: 'https://accounts.zoho.com/crm/v6/Leads/upsert',
            headers: {},
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
        ],
        metadata: [
          {
            jobId: 1,
            userId: 'u1',
          },
          {
            jobId: 2,
            userId: 'u1',
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          DestinationDefinition: {
            Config: {
              cdkV2Enabled: true,
              excludeKeys: [],
              includeKeys: [],
            },
          },
          Config: {
            region: 'US',
            module: 'Leads',
            trigger: 'workflow',
            addDefaultDuplicateCheck: true,
            multiSelectFieldLevelDecision: [
              {
                from: 'multi-language',
                to: 'true',
              },
              {
                from: 'multi class',
                to: 'false',
              },
            ],
            oneTrustCookieCategories: [
              {
                oneTrustCookieCategory: 'Marketing',
              },
            ],
          },
        },
      },
      {
        metadata: [
          {
            jobId: 2,
            userId: 'u1',
          },
        ],
        batched: false,
        statusCode: 400,
        error: 'Last_Name object must have the Last_Name property(ies).',
        statTags: {
          errorCategory: 'dataValidation',
          errorType: 'configuration',
          destType: 'ZOHO',
          module: 'destination',
          implementation: 'cdkV2',
          feature: 'router',
        },
        destination: {
          DestinationDefinition: {
            Config: {
              cdkV2Enabled: true,
              excludeKeys: [],
              includeKeys: [],
            },
          },
          Config: {
            region: 'US',
            module: 'Leads',
            trigger: 'workflow',
            addDefaultDuplicateCheck: true,
            multiSelectFieldLevelDecision: [
              {
                from: 'multi-language',
                to: 'true',
              },
              {
                from: 'multi class',
                to: 'false',
              },
            ],
            oneTrustCookieCategories: [
              {
                oneTrustCookieCategory: 'Marketing',
              },
            ],
          },
        },
      },
    ],
  },
];
