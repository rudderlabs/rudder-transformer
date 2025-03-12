import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

const expectedStatTags = {
  errorCategory: 'network',
  errorType: 'retryable',
  destType: 'BRAZE',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

export const otherScenariosV1: ProxyV1TestData[] = [
  {
    id: 'braze_v1_other_scenario_1',
    name: 'braze',
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
            message: 'Request failed for braze with status: 503',
            status: 503,
          },
        },
      },
    },
  },
  {
    id: 'braze_v1_other_scenario_2',
    name: 'braze',
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
            message: 'Request failed for braze with status: 500',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'braze_v1_other_scenario_3',
    name: 'braze',
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
            message: 'Request failed for braze with status: 504',
            status: 504,
          },
        },
      },
    },
  },
  {
    id: 'braze_v1_other_scenario_4',
    name: 'braze',
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
            message: 'Request failed for braze with status: 500',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'braze_v1_other_scenario_5',
    name: 'braze',
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
            message: 'Request failed for braze with status: 500',
            status: 500,
          },
        },
      },
    },
  },
];
