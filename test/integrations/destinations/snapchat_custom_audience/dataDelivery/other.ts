import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

const expectedStatTags = {
  destType: 'SNAPCHAT_CUSTOM_AUDIENCE',
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
    id: 'snapchat_custom_audience_v1_other_scenario_1',
    name: 'snapchat_custom_audience',
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
                error: JSON.stringify({
                  error: {
                    message: 'Service Unavailable',
                    description:
                      'The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later.',
                  },
                }),
                statusCode: 503,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            status: 503,
            message: 'Service Unavailable during snapchat_custom_audience response transformation',
          },
        },
      },
    },
  },
  {
    id: 'snapchat_custom_audience_v1_other_scenario_2',
    name: 'snapchat_custom_audience',
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
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            status: 500,
            message: 'undefined during snapchat_custom_audience response transformation',
          },
        },
      },
    },
  },
  {
    id: 'snapchat_custom_audience_v1_other_scenario_3',
    name: 'snapchat_custom_audience',
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
                error: '"Gateway Timeout"',
                statusCode: 504,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            status: 504,
            message: 'undefined during snapchat_custom_audience response transformation',
          },
        },
      },
    },
  },
  {
    id: 'snapchat_custom_audience_v1_other_scenario_4',
    name: 'snapchat_custom_audience',
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
                error: '""',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            status: 500,
            message: 'undefined during snapchat_custom_audience response transformation',
          },
        },
      },
    },
  },
  {
    id: 'snapchat_custom_audience_v1_other_scenario_5',
    name: 'snapchat_custom_audience',
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
                error: '""',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            status: 500,
            message: 'undefined during snapchat_custom_audience response transformation',
          },
        },
      },
    },
  },
];
