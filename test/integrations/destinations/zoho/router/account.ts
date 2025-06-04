import { upsertPayload1V2, upsertPayload2V2, commonConnectionConfigV2 } from '../../zoho/common';
import { defaultMockFns } from '../../zoho/mocks';

export const accountTestData = [
  {
    name: 'zoho',
    description:
      'Happy flow with deliveryAccount being passed with destination and accountDefinition is present inside deliveryAccount',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload2V2,
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                deliveryAccount: {
                  accountDefinition: {},
                  options: {
                    region: 'EU',
                  },
                },
                Config: {},
              },
              connection: commonConnectionConfigV2,
            },
          ],
          destType: 'zoho',
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
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    $append_values: {
                      'multi class': 'false',
                      'multi-language': 'true',
                    },
                    data: [
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                        'multi-language': ['Bengali'],
                      },
                    ],
                    duplicate_check_fields: ['email', 'Email'],
                    trigger: ['workflow'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://www.zohoapis.eu/crm/v6/Leads/upsert',
                files: {},
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {},
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                deliveryAccount: {
                  accountDefinition: {},
                  options: {
                    region: 'EU',
                  },
                },
              },
              metadata: [
                {
                  jobId: 2,
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                  userId: 'u1',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'zoho',
    description:
      'Happy flow with deliveryAccount being passed with destination but accountDefinition is not present inside deliveryAccount',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload2V2,
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                deliveryAccount: {
                  options: {
                    region: 'EU',
                  },
                },
                Config: {
                  region: 'US',
                },
              },
              connection: commonConnectionConfigV2,
            },
          ],
          destType: 'zoho',
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
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    $append_values: {
                      'multi class': 'false',
                      'multi-language': 'true',
                    },
                    data: [
                      {
                        Email: 'subscribed@eewrfrd.com',
                        First_Name: 'subcribed',
                        Last_Name: ' User',
                        'multi-language': ['Bengali'],
                      },
                    ],
                    duplicate_check_fields: ['email', 'Email'],
                    trigger: ['workflow'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://www.zohoapis.com/crm/v6/Leads/upsert',
                files: {},
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  region: 'US',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                deliveryAccount: {
                  options: {
                    region: 'EU',
                  },
                },
              },
              metadata: [
                {
                  jobId: 2,
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                  userId: 'u1',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'zoho',
    description:
      'Negative flow when deliveryAccount is passed with destination but accountDefinition is not present inside deliveryAccount and region is not present inside Config',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: upsertPayload2V2,
              metadata: {
                jobId: 2,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                deliveryAccount: {
                  options: {
                    region: 'EU',
                  },
                },
                Config: {},
              },
              connection: commonConnectionConfigV2,
            },
          ],
          destType: 'zoho',
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
              error: 'Datacentre Region is not present. Aborting',
              metadata: [
                {
                  jobId: 2,
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                  userId: 'u1',
                },
              ],
              statTags: {
                destType: 'ZOHO',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
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
