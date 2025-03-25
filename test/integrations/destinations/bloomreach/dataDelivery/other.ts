import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';
import { destType, proxyV1RetryableErrorStatTags } from '../common';

const metadataArray = [generateMetadata(1)];

// https://documentation.bloomreach.com/engagement/reference/tips-and-best-practices
export const otherProxyV1: ProxyV1TestData[] = [
  {
    id: 'bloomreach_v1_other_scenario_1',
    name: destType,
    description:
      '[Proxy v1 API] :: Scenario for testing Service Unavailable error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://random_test_url/test_for_service_not_available',
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
            statTags: proxyV1RetryableErrorStatTags,
            message: 'BLOOMREACH: Error encountered in transformer proxy V1',
            status: 503,
          },
        },
      },
    },
  },
  {
    id: 'bloomreach_v1_other_scenario_2',
    name: destType,
    description: '[Proxy v1 API] :: Scenario for testing Internal Server error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://random_test_url/test_for_internal_server_error',
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
            response: [
              {
                error: '"Internal Server Error"',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: proxyV1RetryableErrorStatTags,
            message: 'BLOOMREACH: Error encountered in transformer proxy V1',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'bloomreach_v1_other_scenario_3',
    name: destType,
    description: '[Proxy v1 API] :: Scenario for testing Gateway Time Out error from destination',
    successCriteria: 'Should return 504 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://random_test_url/test_for_gateway_time_out',
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
            response: [
              {
                error: '"Gateway Timeout"',
                statusCode: 504,
                metadata: generateMetadata(1),
              },
            ],
            statTags: proxyV1RetryableErrorStatTags,
            message: 'BLOOMREACH: Error encountered in transformer proxy V1',
            status: 504,
          },
        },
      },
    },
  },
  {
    id: 'bloomreach_v1_other_scenario_4',
    name: destType,
    description: '[Proxy v1 API] :: Scenario for testing null response from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://random_test_url/test_for_null_response',
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
            response: [
              {
                error: '""',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: proxyV1RetryableErrorStatTags,
            message: 'BLOOMREACH: Error encountered in transformer proxy V1',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'bloomreach_v1_other_scenario_5',
    name: destType,
    description:
      '[Proxy v1 API] :: Scenario for testing null and no status response from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://random_test_url/test_for_null_and_no_status',
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
            response: [
              {
                error: '""',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: proxyV1RetryableErrorStatTags,
            message: 'BLOOMREACH: Error encountered in transformer proxy V1',
            status: 500,
          },
        },
      },
    },
  },
];
