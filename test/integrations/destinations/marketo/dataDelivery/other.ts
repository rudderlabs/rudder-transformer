import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';

const statTags = {
  aborted: {
    destType: 'MARKETO',
    destinationId: 'default-destinationId',
    errorCategory: 'network',
    errorType: 'aborted',
    feature: 'dataDelivery',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'default-workspaceId',
  },
  retryable: {
    errorCategory: 'network',
    errorType: 'retryable',
    destType: 'MARKETO',
    module: 'destination',
    implementation: 'native',
    feature: 'dataDelivery',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
  },
};

const metadata = {
  jobId: 1,
  secret: {
    accessToken: 'default-accessToken',
  },
  attemptNum: 1,
  userId: 'default-userId',
  sourceId: 'default-sourceId',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  dontBatch: false,
};

export const otheMarketoScenariosV1: ProxyV1TestData[] = [
  {
    id: 'marketo_v1_other_scenario_1',
    name: 'marketo',
    description:
      '[Proxy v1 API] :: Scenario for testing Service Unavailable error from destination',
    successCriteria: 'Should return 503 status code with error message',
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
                  '{"error":{"message":"Service Unavailable","description":"The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later."}}',
                statusCode: 503,
                metadata,
              },
            ],
            statTags: statTags.retryable,
            message: 'Request failed  with status: 503',
            status: 503,
          },
        },
      },
    },
  },
  {
    id: 'marketo_v1_other_scenario_2',
    name: 'marketo',
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
            statTags: statTags.retryable,
            message: 'Request failed  with status: 500',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'marketo_v1_other_scenario_3',
    name: 'marketo',
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
                metadata,
              },
            ],
            statTags: statTags.retryable,
            message: 'Request failed  with status: 504',
            status: 504,
          },
        },
      },
    },
  },
  {
    id: 'marketo_v1_other_scenario_4',
    name: 'marketo',
    description: '[Proxy v1 API] :: Scenario for testing null response from destination',
    successCriteria: 'Should return 500 status code with empty error message',
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
                metadata,
              },
            ],
            statTags: statTags.retryable,
            message: 'Request failed  with status: 500',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'marketo_v1_other_scenario_5',
    name: 'marketo',
    description:
      '[Proxy v1 API] :: Scenario for testing null and no status response from destination',
    successCriteria: 'Should return 500 status code with empty error message',
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
                metadata,
              },
            ],
            statTags: statTags.retryable,
            message: 'Request failed  with status: 500',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'marketo_v1_scenario_6',
    name: 'marketo',
    description: '[Proxy v1 API] :: Test for DNS lookup failed scenario',
    successCriteria: 'Should return a 400 status code with empty response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: 'https://random_test_url/dns_lookup_failure',
        }),
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
                error: '{}',
                metadata,
                statusCode: 400,
              },
            ],
          },
        },
      },
    },
  },
];
