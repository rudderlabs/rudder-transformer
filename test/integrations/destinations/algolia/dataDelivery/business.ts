import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV0Payload, generateProxyV1Payload } from '../../../testUtils';
import { abortStatTags, commonRequestProperties, metadataArray, retryStatTags } from './constant';
const proxyMetdata3 = {
  jobId: 3,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {},
  dontBatch: false,
};
export const testScenariosForV0API = [
  {
    id: 'algolia_v0_bussiness_scenario_1',
    name: 'algolia',
    description: '[Proxy v0 API] :: algolia all valid events',
    successCriteria: 'Proper response from destination is received',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestProperties.commonHeaders,
          endpoint: 'https://insights.algolia.io/1/events',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message:
              '[Generic Response Handler] Request for destination: algolia Processed Successfully',
            destinationResponse: {
              response: {
                message: 'OK',
                status: 200,
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    id: 'algolia_v0_bussiness_scenario_2',
    name: 'algolia',
    description: '[Proxy v0 API] :: algolia with invalid event',
    successCriteria: 'Error Response from destination is received',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestProperties.commonHeaders,
          endpoint: 'https://insights.algolia.io/1/events',
          JSON: commonRequestProperties.singleInValidEvent,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 422,
        body: {
          output: {
            status: 422,
            message:
              '[Generic Response Handler] Request failed for destination algolia with status: 422',
            destinationResponse: {
              response: {
                status: 422,
                message: 'EventType must be one of "click", "conversion" or "view"',
              },
              status: 422,
            },
            statTags: abortStatTags,
          },
        },
      },
    },
  },
  {
    id: 'algolia_v0_bussiness_scenario_3',
    name: 'algolia',
    description: '[Proxy v0 API] :: algolia with invalid events in batch',
    successCriteria: 'Error Response from destination is received',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestProperties.commonHeaders,
          endpoint: 'https://insights.algolia.io/1/events',
          JSON: commonRequestProperties.combinedValidInvalidEvents,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 422,
        body: {
          output: {
            status: 422,
            message:
              '[Generic Response Handler] Request failed for destination algolia with status: 422',
            destinationResponse: {
              response: {
                status: 422,
                message: 'EventType must be one of "click", "conversion" or "view"',
              },
              status: 422,
            },
            statTags: abortStatTags,
          },
        },
      },
    },
  },
];

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'algolia_v1_bussiness_scenario_1',
    name: 'algolia',
    description: '[Proxy v1 API] :: algolia all valid events in batch',
    successCriteria: 'Success response from destination is received',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestProperties.commonHeaders,
            endpoint: 'https://insights.algolia.io/1/events',
            JSON: commonRequestProperties.multipleValidEvent,
          },
          metadataArray,
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
            message: '[ALGOLIA Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                message: 'OK',
                status: 200,
              },
              status: 200,
            },
            response: [
              {
                error: 'success',
                metadata: metadataArray[0],
                statusCode: 200,
              },
              {
                error: 'success',
                metadata: metadataArray[1],
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'algolia_v1_bussiness_scenario_2',
    name: 'algolia',
    description: '[Proxy v1 API] :: algolia all invalid events in batch',
    successCriteria: 'Send response with dontBatch as true',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestProperties.commonHeaders,
          endpoint: 'https://insights.algolia.io/1/events',
          JSON: commonRequestProperties.singleInValidEvent,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 500,
            message: 'ALGOLIA: Error transformer proxy v1 during ALGOLIA response transformation',
            response: [
              {
                error:
                  '{"status":422,"message":"EventType must be one of \\"click\\", \\"conversion\\" or \\"view\\""}',
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'default-workspaceId',
                  sourceId: 'default-sourceId',
                  secret: {
                    accessToken: 'default-accessToken',
                  },
                  dontBatch: true,
                },
                statusCode: 500,
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'ALGOLIA',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
          },
        },
      },
    },
  },
  {
    id: 'algolia_v1_bussiness_scenario_3',
    name: 'algolia',
    description: '[Proxy v1 API] :: algolia combination of valid and invalid events in batch',
    successCriteria: 'Should use dontBatch true and proper response returned',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestProperties.commonHeaders,
            endpoint: 'https://insights.algolia.io/1/events',
            JSON: commonRequestProperties.combinedValidInvalidEvents,
          },
          [...metadataArray, proxyMetdata3],
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
            message: 'ALGOLIA: Error transformer proxy v1 during ALGOLIA response transformation',
            response: [
              {
                error:
                  '{"status":422,"message":"EventType must be one of \\"click\\", \\"conversion\\" or \\"view\\""}',
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'dummyUserId',
                  sourceId: 'dummySourceId',
                  destinationId: 'dummyDestinationId',
                  workspaceId: 'dummyWorkspaceId',
                  secret: {},
                  dontBatch: true,
                },
                statusCode: 500,
              },
              {
                error:
                  '{"status":422,"message":"EventType must be one of \\"click\\", \\"conversion\\" or \\"view\\""}',
                metadata: {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'dummyUserId',
                  sourceId: 'dummySourceId',
                  destinationId: 'dummyDestinationId',
                  workspaceId: 'dummyWorkspaceId',
                  secret: {},
                  dontBatch: true,
                },
                statusCode: 500,
              },
              {
                error:
                  '{"status":422,"message":"EventType must be one of \\"click\\", \\"conversion\\" or \\"view\\""}',
                metadata: {
                  jobId: 3,
                  attemptNum: 1,
                  userId: 'dummyUserId',
                  sourceId: 'dummySourceId',
                  destinationId: 'dummyDestinationId',
                  workspaceId: 'dummyWorkspaceId',
                  secret: {},
                  dontBatch: true,
                },
                statusCode: 500,
              },
            ],
            statTags: retryStatTags,
          },
        },
      },
    },
  },
];
