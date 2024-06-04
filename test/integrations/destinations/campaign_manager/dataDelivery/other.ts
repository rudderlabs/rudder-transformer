import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV0Payload, generateProxyV1Payload } from '../../../testUtils';

export const otherScenariosV0 = [
  {
    id: 'cm360_v0_other_scenario_1',
    name: 'campaign_manager',
    description:
      '[Proxy v0 API] :: Scenario for testing Service Unavailable error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          endpoint: 'https://random_test_url/test_for_service_not_available',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message:
              'Campaign Manager: Service Unavailable during CAMPAIGN_MANAGER response transformation 3',
            destinationResponse: {
              response: {
                error: {
                  message: 'Service Unavailable',
                  description:
                    'The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later.',
                },
              },
              status: 503,
            },
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'CAMPAIGN_MANAGER',
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
    id: 'cm360_v0_other_scenario_2',
    name: 'campaign_manager',
    description: '[Proxy v0 API] :: Scenario for testing Internal Server error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          endpoint: 'https://random_test_url/test_for_internal_server_error',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message:
              'Campaign Manager: undefined during CAMPAIGN_MANAGER response transformation 3',
            destinationResponse: {
              response: 'Internal Server Error',
              status: 500,
            },
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'CAMPAIGN_MANAGER',
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
    id: 'cm360_v0_other_scenario_3',
    name: 'campaign_manager',
    description: '[Proxy v0 API] :: Scenario for testing Gateway Time Out error from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          endpoint: 'https://random_test_url/test_for_gateway_time_out',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message:
              'Campaign Manager: undefined during CAMPAIGN_MANAGER response transformation 3',
            destinationResponse: {
              response: 'Gateway Timeout',
              status: 504,
            },
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'CAMPAIGN_MANAGER',
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
    id: 'cm360_v0_other_scenario_4',
    name: 'campaign_manager',
    description: '[Proxy v0 API] :: Scenario for testing null response from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          endpoint: 'https://random_test_url/test_for_null_response',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message:
              'Campaign Manager: undefined during CAMPAIGN_MANAGER response transformation 3',
            destinationResponse: {
              response: '',
              status: 500,
            },
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'CAMPAIGN_MANAGER',
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
    id: 'cm360_v0_other_scenario_5',
    name: 'campaign_manager',
    description:
      '[Proxy v0 API] :: Scenario for testing null and no status response from destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          endpoint: 'https://random_test_url/test_for_null_and_no_status',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message:
              'Campaign Manager: undefined during CAMPAIGN_MANAGER response transformation 3',
            destinationResponse: {
              response: '',
              status: 500,
            },
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'CAMPAIGN_MANAGER',
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
];

export const otherScenariosV1: ProxyV1TestData[] = [
  {
    id: 'cm360_v1_other_scenario_1',
    name: 'campaign_manager',
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
                  '{"error":{"message":"Service Unavailable","description":"The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later."}}',
                statusCode: 503,
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
                  dontBatch: false,
                },
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            message:
              'Campaign Manager: Error transformer proxy v1 during CAMPAIGN_MANAGER response transformation',
            status: 503,
          },
        },
      },
    },
  },
  {
    id: 'cm360_v1_other_scenario_2',
    name: 'campaign_manager',
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
                  dontBatch: false,
                },
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            message:
              'Campaign Manager: Error transformer proxy v1 during CAMPAIGN_MANAGER response transformation',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'cm360_v1_other_scenario_3',
    name: 'campaign_manager',
    description: '[Proxy v1 API] :: Scenario for testing Gateway Time Out error from destination',
    successCriteria: 'Should return 500 status code with error message',
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
                  dontBatch: false,
                },
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            message:
              'Campaign Manager: Error transformer proxy v1 during CAMPAIGN_MANAGER response transformation',
            status: 504,
          },
        },
      },
    },
  },
  {
    id: 'cm360_v1_other_scenario_4',
    name: 'campaign_manager',
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
                  dontBatch: false,
                },
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            message:
              'Campaign Manager: Error transformer proxy v1 during CAMPAIGN_MANAGER response transformation',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'cm360_v1_other_scenario_5',
    name: 'campaign_manager',
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
                  dontBatch: false,
                },
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            message:
              'Campaign Manager: Error transformer proxy v1 during CAMPAIGN_MANAGER response transformation',
            status: 500,
          },
        },
      },
    },
  },
];
