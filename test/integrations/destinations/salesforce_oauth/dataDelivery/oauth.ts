import { ProxyMetdata } from '../../../../../src/types';
import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';

const commonHeadersForWrongToken = {
  Authorization: 'Bearer expiredAccessToken',
  'Content-Type': 'application/json',
};
const params = { destination: 'salesforce_oauth' };

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
    destType: 'SALESFORCE_OAUTH',
    destinationId: 'dummyDestinationId',
    errorCategory: 'network',
    errorType: 'retryable',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'dummyWorkspaceId',
  },
};

const commonRequestParameters = {
  headers: commonHeadersForWrongToken,
  JSON: users[0],
  params,
};

export const proxyMetdataWithSecret: ProxyMetdata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {
    access_token: 'expiredAccessToken',
    instanceUrl: 'https://rudderstack.my.salesforce_oauth.com',
  },
  destInfo: { authKey: 'dummyDestinationId' },
  dontBatch: false,
};

export const reqMetadataArrayWithSecret = [proxyMetdataWithSecret];

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'salesforce_v1_scenario_1',
    name: 'salesforce_oauth',
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
            ...commonRequestParameters,
            endpoint:
              'https://rudderstack.my.salesforce_oauth.com/services/data/v50.0/sobjects/Lead/20',
          },
          reqMetadataArrayWithSecret,
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
                metadata: proxyMetdataWithSecret,
                statusCode: 500,
              },
            ],
            statTags: statTags.retryable,
          },
        },
      },
    },
  },
];
