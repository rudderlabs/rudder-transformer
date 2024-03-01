import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';

const statTags = {
  errorCategory: 'network',
  errorType: 'retryable',
  destType: 'SALESFORCE',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};
const metadata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'default-userId',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  sourceId: 'default-sourceId',
  secret: {
    accessToken: 'default-accessToken',
  },
  dontBatch: false,
};

export const otherSalesforceScenariosV1: ProxyV1TestData[] = [
  {
    id: 'salesforce_v1_other_scenario_1',
    name: 'salesforce',
    description:
      '[Proxy v1 API] :: Scenario for testing Service Unavailable error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: 'https://sf_test_url/test_for_service_not_available',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error:
                  '{"error":{"message":"Service Unavailable","description":"The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later."}}',
                statusCode: 500,
                metadata,
              },
            ],
            statTags,
            message:
              'Salesforce Request Failed - due to "{"error":{"message":"Service Unavailable","description":"The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later."}}", (Retryable) during Salesforce Response Handling',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'salesforce_v1_other_scenario_2',
    name: 'salesforce',
    description: '[Proxy v1 API] :: Scenario for testing Internal Server error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: 'https://random_test_url/test_for_internal_server_error',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: '"Internal Server Error"',
                statusCode: 500,
                metadata,
              },
            ],
            statTags,
            message:
              'Salesforce Request Failed - due to ""Internal Server Error"", (Retryable) during Salesforce Response Handling',
            status: 500,
          },
        },
      },
    },
  },
];
