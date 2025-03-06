import { ProxyMetdata } from '../../../../../src/types';
import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';
import { authHeader1 } from '../maskedSecrets';

const statTags = {
  aborted: {
    destType: 'MARKETO',
    destinationId: 'dummyDestinationId',
    errorCategory: 'network',
    errorType: 'aborted',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'dummyWorkspaceId',
  },
  retryable: {
    destType: 'MARKETO',
    destinationId: 'dummyDestinationId',
    errorCategory: 'network',
    errorType: 'retryable',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'dummyWorkspaceId',
  },
  throttled: {
    destType: 'MARKETO',
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
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {},
  dontBatch: false,
};

export const reqMetadataArray = [proxyMetdata];
const params = {
  destination: 'marketo',
};

const commonRequestParameters = {
  JSON: {
    action: 'createOrUpdate',
    input: [
      {
        City: 'Tokyo',
        Country: 'JP',
        Email: 'gabi29@gmail.com',
        PostalCode: '100-0001',
        Title: 'Owner',
        id: 1328328,
        userId: 'gabi_userId_45',
      },
    ],
    lookupField: 'id',
  },
  params,
};

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'marketo_v1_scenario_1',
    name: 'marketo',
    description: '[Proxy v1 API] :: Test for a successful update request',
    successCriteria: 'Should return a 200 status code with status updated and record id',
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
              Authorization: authHeader1,
              'Content-Type': 'application/json',
              'User-Agent': 'RudderLabs',
            },
            endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test1',
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
                error: JSON.stringify({
                  requestId: '664#17dae8c3d48',
                  result: [{ id: 1328328, status: 'updated' }],
                  success: true,
                }),
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
    id: 'marketo_v1_scenario_2',
    name: 'marketo',
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
              Authorization: authHeader1,
              'Content-Type': 'application/json',
            },
            endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test2',
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
              'Request Failed for marketo, Access token invalid (Retryable).during Marketo Response Handling',
            response: [
              {
                error: JSON.stringify({
                  requestId: 'a61c#17daea5968a',
                  success: false,
                  errors: [{ code: '601', message: 'Access token invalid' }],
                }),
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
    id: 'marketo_v1_scenario_3',
    name: 'marketo',
    description: '[Proxy v1 API] :: Test for Requested resource not found scenario',
    successCriteria: 'Should return a 400 status code with message Requested resource not found',
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
              Authorization: authHeader1,
              'Content-Type': 'application/json',
            },
            endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test3',
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
            status: 400,
            statTags: statTags.aborted,
            message:
              'Request Failed for marketo, Requested resource not found (Aborted).during Marketo Response Handling',
            response: [
              {
                error: JSON.stringify({
                  requestId: 'a61c#17daea5968a',
                  success: false,
                  errors: [{ code: '610', message: 'Requested resource not found' }],
                }),
                metadata: proxyMetdata,
                statusCode: 400,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'marketo_v1_scenario_4',
    name: 'marketo',
    description: '[Proxy v1 API] :: Test for Unknown error with empty response',
    successCriteria: 'Should return a 500 status code with empty response',
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
              Authorization: authHeader1,
              'Content-Type': 'application/json',
            },
            endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test4',
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
  {
    id: 'marketo_v1_scenario_5',
    name: 'marketo',
    description: '[Proxy v1 API] :: Test for missing content type header scenario',
    successCriteria: 'Should return a 612 status code with Invalid Content Type	',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: {
              Authorization: authHeader1,
              'Content-Type': 'invalid',
              'User-Agent': 'RudderLabs',
            },
            endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test_invalid_header',
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
            status: 400,
            statTags: statTags.aborted,
            message:
              'Request Failed for marketo, Invalid Content Type (Aborted).during Marketo Response Handling',
            response: [
              {
                error: JSON.stringify({
                  success: false,
                  errors: [{ code: '612', message: 'Invalid Content Type' }],
                }),
                metadata: proxyMetdata,
                statusCode: 400,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'marketo_v1_scenario_6',
    name: 'marketo',
    description: '[Proxy v1 API] :: Test for a passed field exceeding max length',
    successCriteria: 'Should return a 1077 status code with Value for field exceeds max length',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: {
              Authorization: authHeader1,
              'Content-Type': 'application/json',
              'User-Agent': 'RudderLabs',
            },
            endpoint: 'https://mktId.mktorest.com/rest/v1/leads.json/test_exceeded_length',
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
            status: 400,
            statTags: statTags.aborted,
            message: 'Request failed  with status: 400',
            response: [
              {
                error: JSON.stringify({
                  success: false,
                  errors: [{ code: '1077', message: 'Value for field exceeds max length' }],
                }),
                metadata: proxyMetdata,
                statusCode: 400,
              },
            ],
          },
        },
      },
    },
  },
];
