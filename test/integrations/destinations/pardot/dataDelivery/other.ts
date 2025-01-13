import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

const expectedStatTags = {
  destType: 'PARDOT',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'retryable',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

export const otherScenariosV1: ProxyV1TestData[] = [
  {
    id: 'pardot_v1_other_scenario_1',
    name: 'pardot',
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
          endpoint: 'https://random_test_url/test_for_service_not_available',
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
                  '{"error":{"message":"Service Unavailable","description":"The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later."}} during Pardot response transformation',
                statusCode: 503,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            status: 503,
            message:
              '{"error":{"message":"Service Unavailable","description":"The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later."}} during Pardot response transformation',
          },
        },
      },
    },
  },
  {
    id: 'pardot_v1_other_scenario_2',
    name: 'pardot',
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
                error: '"Internal Server Error" during Pardot response transformation',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            status: 500,
            message: '"Internal Server Error" during Pardot response transformation',
          },
        },
      },
    },
  },
  {
    id: 'pardot_v1_other_scenario_3',
    name: 'pardot',
    description: '[Proxy v1 API] :: Scenario for testing Gateway Time Out error from destination',
    successCriteria: 'Should return 504 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: 'https://random_test_url/test_for_gateway_time_out',
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
                error: '"Gateway Timeout" during Pardot response transformation',
                statusCode: 504,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            status: 504,
            message: '"Gateway Timeout" during Pardot response transformation',
          },
        },
      },
    },
  },
  {
    id: 'pardot_v1_other_scenario_4',
    name: 'pardot',
    description: '[Proxy v1 API] :: Scenario for testing null response from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: 'https://random_test_url/test_for_null_response',
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
                error: '"" during Pardot response transformation',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            status: 500,
            message: '"" during Pardot response transformation',
          },
        },
      },
    },
  },
  {
    id: 'pardot_v1_other_scenario_5',
    name: 'pardot',
    description:
      '[Proxy v1 API] :: Scenario for testing null and no status response from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: 'https://random_test_url/test_for_null_and_no_status',
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
                error: '"" during Pardot response transformation',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            status: 500,
            message: '"" during Pardot response transformation',
          },
        },
      },
    },
  },
];
