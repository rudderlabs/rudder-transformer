import { ProxyMetdata } from '../../../../../src/types';
import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';

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
  {
    Email: 'danis.archurav@sbermarket.ru',
    Company: 'itus.ru',
    LastName: 'Danis',
    FirstName: 'Archurav',
    LeadSource: 'App Signup',
    account_type__c: 'free_trial',
    State: 'San Francisco',
  },
];

const statTags = {
  aborted: {
    destType: 'SALESFORCE_OAUTH_SANDBOX',
    destinationId: 'dummyDestinationId',
    errorCategory: 'network',
    errorType: 'aborted',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'dummyWorkspaceId',
  },
};

export const proxyMetdata: ProxyMetdata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  destInfo: {
    authKey: 'dummyDestinationId',
  },
  secret: {
    access_token: 'expiredRightToken',
    instanceUrl: 'https://rudderstack.my.salesforce_oauth_sandbox.com',
  },
  dontBatch: false,
};

const commonRequestParametersWithWrongState = {
  headers: commonHeadersForRightToken,
  JSON: users[1],
  params,
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

export const reqMetadataArray = [proxyMetdataWithSecretWithRightAccessToken];

export const testScenariosForV1APIBusiness: ProxyV1TestData[] = [
  {
    id: 'salesforce_sandbox_v1_scenario_1',
    name: 'salesforce_oauth_sandbox',
    description: '[Proxy v1 API] :: Test with wrong state change',
    successCriteria: 'Should return 400 with FIELD_INTEGRITY_EXCEPTION',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParametersWithWrongState,
            endpoint:
              'https://rudderstack.my.salesforce_oauth_sandbox.com/services/data/v50.0/sobjects/Lead/21',
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
            message:
              'Salesforce Request Failed: "400" due to "A country/territory must be specified before specifying a state value for field: State/Province", (Aborted) during salesforce_oauth_sandbox Response Handling',
            response: [
              {
                error:
                  '[{"errorCode":"FIELD_INTEGRITY_EXCEPTION","fields":["State"],"message":"A country/territory must be specified before specifying a state value for field: State/Province"}]',
                metadata: proxyMetdata,
                statusCode: 400,
              },
            ],
            statTags: statTags.aborted,
            status: 400,
          },
        },
      },
    },
  },
];
