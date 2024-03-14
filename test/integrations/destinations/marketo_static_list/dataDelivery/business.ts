import { ProxyMetdata } from '../../../../../src/types';
import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';

export const statTags = {
  aborted: {
    destType: 'MARKETO_STATIC_LIST',
    destinationId: 'dummyDestinationId',
    errorCategory: 'network',
    errorType: 'aborted',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'dummyWorkspaceId',
  },
  retryable: {
    destType: 'MARKETO_STATIC_LIST',
    destinationId: 'default-destinationId',
    errorCategory: 'network',
    errorType: 'retryable',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'default-workspaceId',
  },
  throttled: {
    destType: 'MARKETO_STATIC_LIST',
    destinationId: 'dummyDestinationId',
    errorCategory: 'network',
    errorType: 'throttled',
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
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  secret: {},
  dontBatch: false,
};

export const reqMetadataArray = [proxyMetdata];
const params = {
  destination: 'marketo_static_list',
};

const commonRequestParameters = {
  params,
  userId: '',
  body: {
    FORM: {},
    JSON: {},
    JSON_ARRAY: {},
    XML: {},
  },
  files: {},
};

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'msl_v1_scenario_1',
    name: 'marketo_static_list',
    description: '[Proxy v1 API] :: Test for a partial successful request with multiple ids',
    successCriteria: 'Should return a 200 status code with respective status for each record id',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            headers: {
              Authorization: 'Bearer Incorrect_token',
              'Content-Type': 'application/json',
            },
            endpoint:
              'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=110&id=111&id=112',
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
            message: 'Request Processed Successfully',
            response: [
              {
                error:
                  '{"requestId":"b6d1#18a8d2c10e7","result":[{"id":110,"status":"skipped","reasons":[{"code":"1015","message":"Lead not in list"}]},{"id":111,"status":"removed"},{"id":112,"status":"removed"}],"success":true}',
                metadata: proxyMetdata,
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'msl_v1_scenario_2',
    name: 'marketo_static_list',
    description: '[Proxy v1 API] :: Test for Access token invalid scenario',
    successCriteria: 'Should return a 500 status code with message Access token invalid',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            headers: {
              Authorization: 'Bearer Incorrect_token',
              'Content-Type': 'application/json',
            },
            endpoint:
              'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=1&id=2&id=3',
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
            status: 500,
            statTags: statTags.retryable,
            message:
              'Request Failed for Marketo Static List, Access token invalid (Retryable).during Marketo Static List Response Handling',
            response: [
              {
                error:
                  '{"requestId":"68d8#1846058ee27","success":false,"errors":[{"code":"601","message":"Access token invalid"}]}',
                metadata: proxyMetdata,
                statusCode: 500,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'msl_v1_scenario_3',
    name: 'marketo_static_list',
    description: '[Proxy v1 API] :: Test for a complete successful request with multiple ids',
    successCriteria:
      'Should return a 200 status code with respective added status for each record id',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            headers: {
              Authorization: 'Bearer token',
              'Content-Type': 'application/json',
              'User-Agent': 'RudderLabs',
            },
            endpoint:
              'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=1&id=2',
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
            message: 'Request Processed Successfully',
            response: [
              {
                error:
                  '{"requestId":"12d3c#1846057dce2","result":[{"id":1,"status":"added"},{"id":2,"status":"added"}],"success":true}',
                metadata: proxyMetdata,
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'msl_v1_scenario_4',
    name: 'marketo_static_list',
    description: '[Proxy v1 API] :: Test for DNS lookup failed scenario',
    successCriteria: 'Should return a 400 status code with empty response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            headers: {
              Authorization: 'Bearer test_token_6',
              'Content-Type': 'application/json',
              'User-Agent': 'RudderLabs',
            },
            endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test6',
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
            status: 500,
            statTags: statTags.retryable,
            message: 'Request failed  with status: 500',
            response: [
              {
                error: '""',
                metadata: proxyMetdata,
                statusCode: 500,
              },
            ],
          },
        },
      },
    },
  },
];
