import { upsertPayload1V2, upsertPayload2V2, commonConnectionConfigV2 } from '../../zoho/common';
import { defaultMockFns } from '../../zoho/mocks';

// Common test case properties
const baseTestCase = {
  name: 'zoho',
  feature: 'router',
  module: 'destination',
  version: 'v0',
  id: 'zoho_account',
  mockFns: defaultMockFns,
};

// Common destination definition structure
const baseDestinationDefinition = {
  DestinationDefinition: {
    Config: {
      cdkV2Enabled: true,
    },
  },
};

// Helper function to create metadata
const createMetadata = (jobId: number, userId = 'u1', accessToken = 'correct-access-token') => ({
  jobId,
  userId,
  secret: {
    accessToken,
  },
});

// Helper function to create destination config
const createDestinationConfig = (
  options: {
    hasAccountDefinition?: boolean;
    hasRegionInOptions?: boolean;
    hasRegionInConfig?: boolean;
  } = {},
) => {
  const {
    hasAccountDefinition = true,
    hasRegionInOptions = true,
    hasRegionInConfig = false,
  } = options;

  const config: any = {
    ...baseDestinationDefinition,
    deliveryAccount: {
      options: hasRegionInOptions ? { region: 'EU' } : {},
      ...(hasAccountDefinition && {
        accountDefinition: {
          config: {
            refreshOauthToken: true,
          },
        },
      }),
    },
    Config: hasRegionInConfig ? { region: 'EU' } : {},
  };

  return config;
};

// Predefined destination configs
const commonDestinaitonConfig = createDestinationConfig();
const destinaitonConfigWithAccountButNotAccountDefinition = createDestinationConfig({
  hasAccountDefinition: false,
  hasRegionInConfig: true,
});
const destinaitonConfigWithAccountAndAccountDefinitionButNotRegion = createDestinationConfig({
  hasRegionInOptions: false,
});

// Helper function to create batched request
const createBatchedRequest = (
  data: any[],
  endpoint = 'https://www.zohoapis.eu/crm/v6/Leads/upsert',
) => ({
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint,
  headers: {
    Authorization: 'Zoho-oauthtoken correct-access-token',
  },
  params: {},
  body: {
    JSON: {
      duplicate_check_fields: ['email', 'Email'],
      data,
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
});

// Helper function to create input item
const createInputItem = (message: any, jobId: number, destination: any) => ({
  message,
  metadata: createMetadata(jobId),
  destination,
  connection: commonConnectionConfigV2,
});

// Helper function to create test request
const createTestRequest = (inputItems: any[]) => ({
  request: {
    body: {
      input: inputItems,
      destType: 'zoho',
    },
    method: 'POST',
  },
});

export const accountData = [
  {
    ...baseTestCase,
    description: 'Happy flow with deliveryAccount being passed with destination',
    input: createTestRequest([
      createInputItem(upsertPayload1V2, 1, commonDestinaitonConfig),
      createInputItem(upsertPayload2V2, 2, commonDestinaitonConfig),
    ]),
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: createBatchedRequest([
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
              ]),
              metadata: [createMetadata(1), createMetadata(2)],
              batched: true,
              statusCode: 200,
              destination: commonDestinaitonConfig,
            },
          ],
        },
      },
    },
  },
  {
    ...baseTestCase,
    description:
      'Happy flow with both deliveryAccount with accountDefiniton and destination with region being passed',
    input: createTestRequest([
      createInputItem(upsertPayload1V2, 1, {
        ...commonDestinaitonConfig,
        Config: { region: 'EU' },
      }),
    ]),
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: true,
              batchedRequest: createBatchedRequest([
                {
                  Email: 'subscribed@eewrfrd.com',
                  First_Name: 'subcribed',
                  Last_Name: ' User',
                },
              ]),
              destination: {
                ...commonDestinaitonConfig,
                Config: { region: 'EU' },
              },
              metadata: [createMetadata(1)],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    ...baseTestCase,
    description:
      'Happy flow with deliveryAccount without accountDefiniton and destination with region being passed',
    input: createTestRequest([
      createInputItem(upsertPayload1V2, 1, destinaitonConfigWithAccountButNotAccountDefinition),
    ]),
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: true,
              batchedRequest: createBatchedRequest([
                {
                  Email: 'subscribed@eewrfrd.com',
                  First_Name: 'subcribed',
                  Last_Name: ' User',
                },
              ]),
              destination: destinaitonConfigWithAccountButNotAccountDefinition,
              metadata: [createMetadata(1)],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    ...baseTestCase,
    description:
      'Failure scenario when deliveryAccount and accountDefinition present but not region inside options',
    input: createTestRequest([
      createInputItem(
        upsertPayload1V2,
        1,
        destinaitonConfigWithAccountAndAccountDefinitionButNotRegion,
      ),
    ]),
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              error: 'Region is not defined in delivery account options',
              metadata: [createMetadata(1)],
              statTags: {
                destType: 'ZOHO',
                errorCategory: 'platform',
                feature: 'router',
                implementation: 'cdkV2',
                module: 'destination',
              },
              statusCode: 500,
            },
          ],
        },
      },
    },
  },
];
