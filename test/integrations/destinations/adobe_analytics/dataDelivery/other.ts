import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

const expectedStatTags = {
  errorCategory: 'network',
  errorType: 'retryable',
  destType: 'ADOBE_ANALYTICS',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

export const otherScenariosV1: ProxyV1TestData[] = [
  {
    id: 'adobe_v1_other_scenario_1',
    name: 'adobe_analytics',
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
                  '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics with status code 503',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            message:
              '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics with status code 503',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'adobe_v1_other_scenario_2',
    name: 'adobe_analytics',
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
                error:
                  '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics with status code 500 due to Internal Server Error',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            message:
              '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics with status code 500 due to Internal Server Error',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'adobe_v1_other_scenario_3',
    name: 'adobe_analytics',
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
                error:
                  '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics with status code 504 due to Gateway Timeout',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: expectedStatTags,
            message:
              '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics with status code 504 due to Gateway Timeout',
            status: 500,
          },
        },
      },
    },
  },
];
