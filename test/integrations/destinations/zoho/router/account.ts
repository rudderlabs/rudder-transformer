import { upsertPayload1V2, upsertPayload2V2, commonConnectionConfigV2 } from '../../zoho/common';
import { defaultMockFns } from '../../zoho/mocks';

const commonDestinaitonConfig = {
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
  },
};

export const accountData = [
  {
    name: 'zoho_dev',
    description: 'Happy flow with deliveryAccount being passed with destination',
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
              destination: commonDestinaitonConfig,
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
              destination: commonDestinaitonConfig,
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://www.zohoapis.eu/crm/v6/Leads/upsert',
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
              destination: commonDestinaitonConfig,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
