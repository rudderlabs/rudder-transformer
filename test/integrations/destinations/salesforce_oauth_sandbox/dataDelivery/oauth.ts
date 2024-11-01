import { ProxyMetdata } from '../../../../../src/types';
import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';

const commonHeadersForWrongToken = {
  Authorization: 'Bearer expiredAccessToken',
  'Content-Type': 'application/json',
};

const commonHeadersForRightToken = {
  Authorization: 'Bearer correctAccessToken',
  'Content-Type': 'application/json',
};
const params = { destination: 'salesforce_oauth_sandbox' };

const users = [
  {
    Email: 'danis.archurav@sbermarket.ru',
    Company: 'itus.ru',
    LastName: 'Danis',
    FirstName: 'Archurav',
    LeadSource: 'App Signup',
    account_type__c: 'free_trial',
  },
];

const statTags = {
  retryable: {
    destType: 'SALESFORCE_OAUTH_SANDBOX',
    destinationId: 'dummyDestinationId',
    errorCategory: 'network',
    errorType: 'retryable',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'dummyWorkspaceId',
  },
};

const commonRequestParametersWithWrongToken = {
  headers: commonHeadersForWrongToken,
  JSON: users[0],
  params,
};

const commonRequestParametersWithRightToken = {
  headers: commonHeadersForRightToken,
  JSON: users[0],
  params,
};

export const proxyMetdataWithSecretWithWrongAccessToken: ProxyMetdata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {
    access_token: 'expiredAccessToken',
    instanceUrl: 'https://rudderstack.my.salesforce_oauth_sandbox.com',
  },
  destInfo: { authKey: 'dummyDestinationId' },
  dontBatch: false,
};

export const proxyMetdataWithSecretWithRightAccessToken: ProxyMetdata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {
    access_token: 'expiredRightToken',
    instanceUrl: 'https://rudderstack.my.salesforce_oauth_sandbox.com',
  },
  destInfo: { authKey: 'dummyDestinationId' },
  dontBatch: false,
};

export const reqMetadataArrayWithWrongSecret = [proxyMetdataWithSecretWithWrongAccessToken];
export const reqMetadataArray = [proxyMetdataWithSecretWithRightAccessToken];

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'salesforce_v1_scenario_1',
    name: 'salesforce_oauth_sandbox',
    description: '[Proxy v1 API] :: Test with expired access token scenario',
    successCriteria:
      'Should return 5XX with error category REFRESH_TOKEN and Session expired or invalid, INVALID_SESSION_ID',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParametersWithWrongToken,
            endpoint:
              'https://rudderstack.my.salesforce_oauth_sandbox.com/services/data/v50.0/sobjects/Lead/20',
          },
          reqMetadataArrayWithWrongSecret,
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
            authErrorCategory: 'REFRESH_TOKEN',
            message:
              'Salesforce Request Failed - due to "INVALID_SESSION_ID", (Retryable) during Salesforce Response Handling',
            response: [
              {
                error:
                  '[{"message":"Session expired or invalid","errorCode":"INVALID_SESSION_ID"}]',
                metadata: proxyMetdataWithSecretWithWrongAccessToken,
                statusCode: 500,
              },
            ],
            statTags: statTags.retryable,
          },
        },
      },
    },
  },
  {
    id: 'salesforce_v1_scenario_2',
    name: 'salesforce',
    description:
      '[Proxy v1 API] :: Test for a valid request - Lead creation with existing unchanged leadId and unchanged data',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParametersWithRightToken,
            endpoint:
              'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/existing_unchanged_leadId',
          },
          reqMetadataArray,
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
            message: 'Request for destination: salesforce Processed Successfully',
            response: [
              {
                error: '{"statusText":"No Content"}',
                metadata: proxyMetdataWithSecretWithRightAccessToken,
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
];
