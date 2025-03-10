import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { defaultAccessToken } from '../../../common/secrets';

export const headerBlockWithCorrectAccessToken = {
  'Content-Type': 'application/json',
  Authorization: 'Zoho-oauthtoken dummy-key',
};

export const contactPayload = {
  duplicate_check_fields: ['Email'],
  data: [
    {
      Email: 'subscribed@eewrfrd.com',
      First_Name: 'subcribed',
      Last_Name: ' User',
    },
  ],
  $append_values: {},
  trigger: ['workflow'],
};

export const statTags = {
  destType: 'ZOHO',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

export const metadata = [
  {
    jobId: 1,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      accessToken: defaultAccessToken,
    },
    dontBatch: false,
  },
  {
    jobId: 2,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      accessToken: defaultAccessToken,
    },
    dontBatch: false,
  },
  {
    jobId: 3,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      accessToken: defaultAccessToken,
    },
    dontBatch: false,
  },
];

export const singleMetadata = [
  {
    jobId: 1,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      accessToken: defaultAccessToken,
    },
    dontBatch: false,
  },
];

const commonRecordParameters = {
  method: 'POST',
  headers: headerBlockWithCorrectAccessToken,
  JSON: { ...contactPayload },
};

const commonRecordParametersWithWrongToken = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: 'Zoho-oauthtoken wrong-token' },
  JSON: {
    duplicate_check_fields: ['Email'],
    data: [
      {
        Email: 'subscribed@eewrfrd.com',
        First_Name: 'subcribed',
        Last_Name: ' User',
      },
    ],
    $append_values: {},
    trigger: ['workflow'],
  },
};

const multiContactPayload = {
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
    {
      Random: 'subscribed@eewrfrd.com',
    },
  ],
  $append_values: {},
  trigger: ['workflow'],
};

const commonMultiRecordParameters = {
  method: 'POST',
  headers: headerBlockWithCorrectAccessToken,
  JSON: { ...multiContactPayload },
};

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'zoho_v1_scenario_1',
    name: 'zoho',
    description: 'Upserting Leads successfully',
    successCriteria: 'Should return 200 and success',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://www.zohoapis.in/crm/v6/Leads/upsert',
            ...commonRecordParameters,
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[ZOHO Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                data: [
                  {
                    code: 'SUCCESS',
                    duplicate_field: null,
                    action: 'insert',
                    details: {
                      Modified_Time: '2024-07-16T09:39:27+05:30',
                      Modified_By: {
                        name: 'Dummy-User',
                        id: '724445000000323001',
                      },
                      Created_Time: '2024-07-16T09:39:27+05:30',
                      id: '724445000000424003',
                      Created_By: {
                        name: 'Dummy-User',
                        id: '724445000000323001',
                      },
                      $approval_state: 'approved',
                    },
                    message: 'record added',
                    status: 'success',
                  },
                ],
              },
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'zoho_v1_scenario_2',
    name: 'zoho',
    description: 'Trying to upsert in wrong module name',
    successCriteria: 'Should return 400 and should be aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://www.zohoapis.in/crm/v6/Wrong/upsert',
            ...commonRecordParameters,
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            statTags,
            message: 'ZOHO: Error encountered in transformer proxy V1',
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: JSON.stringify({
                  code: 'INVALID_MODULE',
                  details: { resource_path_index: 0 },
                  message: 'the module name given seems to be invalid',
                  status: 'error',
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'zoho_v1_scenario_3',
    name: 'zoho',
    description: 'Trying to upsert using invalid access token',
    successCriteria: 'Should return 500 and try for refreshed token',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://www.zohoapis.in/crm/v6/Leads/upsert',
            ...commonRecordParametersWithWrongToken,
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            statTags: { ...statTags, errorType: 'retryable' },
            message:
              'Zoho: Error transformer proxy v1 during Zoho response transformation. invalid oauth token',
            authErrorCategory: 'REFRESH_TOKEN',
            response: [
              {
                error: JSON.stringify({
                  code: 'INVALID_TOKEN',
                  details: {},
                  message: 'invalid oauth token',
                  status: 'error',
                }),
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'zoho_v1_scenario_4',
    name: 'zoho',
    description: 'testing partial failure',
    successCriteria: 'Should return 200 and success for successful and 400 for failed payloads',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://www.zohoapis.in/crm/v6/Leads/upsert',
            ...commonMultiRecordParameters,
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[ZOHO Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                data: [
                  {
                    code: 'SUCCESS',
                    duplicate_field: 'Email',
                    action: 'update',
                    details: {
                      Modified_Time: '2024-07-16T15:01:02+05:30',
                      Modified_By: {
                        name: 'dummy-user',
                        id: '724445000000323001',
                      },
                      Created_Time: '2024-07-16T09:39:27+05:30',
                      id: '724445000000424003',
                      Created_By: {
                        name: 'dummy-user',
                        id: '724445000000323001',
                      },
                    },
                    message: 'record updated',
                    status: 'success',
                  },
                  {
                    code: 'SUCCESS',
                    duplicate_field: 'Email',
                    action: 'update',
                    details: {
                      Modified_Time: '2024-07-16T15:01:02+05:30',
                      Modified_By: {
                        name: 'dummy-user',
                        id: '724445000000323001',
                      },
                      Created_Time: '2024-07-16T09:39:27+05:30',
                      id: '724445000000424003',
                      Created_By: {
                        name: 'dummy-user',
                        id: '724445000000323001',
                      },
                    },
                    message: 'record updated',
                    status: 'success',
                  },
                  {
                    code: 'MANDATORY_NOT_FOUND',
                    details: {
                      api_name: 'Last_Name',
                      json_path: '$.data[2].Last_Name',
                    },
                    message: 'required field not found',
                    status: 'error',
                  },
                ],
              },
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
              {
                error: 'success',
                metadata: generateMetadata(2),
                statusCode: 200,
              },
              {
                error:
                  'message: undefined {"api_name":"Last_Name","json_path":"$.data[2].Last_Name"}',
                metadata: generateMetadata(3),
                statusCode: 400,
              },
            ],
          },
        },
      },
    },
  },
];

export const data = [...testScenariosForV1API];
