import { authHeader1 } from '../maskedSecrets';
import { ProxyV1TestData } from '../../../testTypes';
import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';

const commonHeaders = {
  'Content-Type': 'application/json',
  Authorization: authHeader1,
  Accept: 'application/json',
  'Intercom-Version': '1.4',
  'User-Agent': 'RudderStack',
};

const createUserPayload = {
  email: 'test_1@test.com',
  phone: '9876543210',
  name: 'Test Name',
  signed_up_at: 1601493060,
  last_seen_user_agent: 'unknown',
  update_last_request_at: true,
  user_id: 'test_user_id_1',
  custom_attributes: {
    'address.city': 'Kolkata',
    'address.state': 'West Bengal',
  },
};

const commonRequestParameters = {
  JSON: createUserPayload,
  headers: commonHeaders,
};

const expectedStatTags = {
  destType: 'INTERCOM',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'retryable',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

const metadataArray = [generateMetadata(1)];

export const otherScenariosV0 = [
  {
    id: 'intercom_v0_other_scenario_1',
    name: 'intercom',
    description: '[Proxy v0 API] :: Request Timeout Error Handling from Destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://api.intercom.io/users/test1',
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
              '[Intercom Response Handler] Request failed for destination intercom with status: 408',
            destinationResponse: {
              response: {
                type: 'error.list',
                request_id: '000on04msi4jpk7d3u60',
                errors: [
                  {
                    code: 'Request Timeout',
                    message: 'The server would not wait any longer for the client',
                  },
                ],
              },
              status: 408,
            },
            statTags: expectedStatTags,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v0_other_scenario_2',
    name: 'intercom',
    description:
      '[Proxy v0 API] :: Scenario for testing Service Unavailable error from destination',
    successCriteria: 'Should return 503 status code with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://api.intercom.io/users/test2',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 503,
        body: {
          output: {
            status: 503,
            message: 'Request Processed Successfully',
            destinationResponse: {
              type: 'error.list',
              request_id: 'request127',
              errors: [
                {
                  code: 'service_unavailable',
                  message: 'Sorry, the API service is temporarily unavailable',
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: 'intercom_v0_other_scenario_3',
    name: 'intercom',
    description: '[Proxy v0 API] :: Scenario for testing Internal Server error from destination',
    successCriteria: 'Should return 500 status code with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://api.intercom.io/users/test3',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            destinationResponse: {
              errors: [
                {
                  code: 'client_error',
                  message: 'Unknown server error',
                },
              ],
              request_id: 'request128',
              type: 'error.list',
            },
            message: 'Request Processed Successfully',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v0_other_scenario_4',
    name: 'intercom',
    description: '[Proxy v0 API] :: Scenario for testing Gateway Time Out error from destination',
    successCriteria: 'Should return 504 status code with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://api.intercom.io/users/test4',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 504,
        body: {
          output: {
            destinationResponse: {
              errors: [
                {
                  code: 'server_timeout',
                  message: 'Server timed out when making request',
                },
              ],
              request_id: 'request129',
              type: 'error.list',
            },
            message: 'Request Processed Successfully',
            status: 504,
          },
        },
      },
    },
  },
];

export const otherScenariosV1: ProxyV1TestData[] = [
  {
    id: 'intercom_v1_other_scenario_1',
    name: 'intercom',
    description: '[Proxy v1 API] :: Request Timeout Error Handling from Destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://api.intercom.io/users/test1',
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
            message:
              '[Intercom Response Handler] Request failed for destination intercom with status: 408',
            response: [
              {
                error: JSON.stringify({
                  type: 'error.list',
                  request_id: '000on04msi4jpk7d3u60',
                  errors: [
                    {
                      code: 'Request Timeout',
                      message: 'The server would not wait any longer for the client',
                    },
                  ],
                }),
                metadata: generateMetadata(1),
                statusCode: 500,
              },
            ],
            statTags: expectedStatTags,
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v1_other_scenario_2',
    name: 'intercom',
    description:
      '[Proxy v1 API] :: Scenario for testing Service Unavailable error from destination',
    successCriteria: 'Should return 503 status code with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://api.intercom.io/users/test2',
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
            message: 'Request Processed Successfully',
            response: [
              {
                error: JSON.stringify({
                  type: 'error.list',
                  request_id: 'request127',
                  errors: [
                    {
                      code: 'service_unavailable',
                      message: 'Sorry, the API service is temporarily unavailable',
                    },
                  ],
                }),
                metadata: generateMetadata(1),
                statusCode: 503,
              },
            ],
            status: 503,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v1_other_scenario_3',
    name: 'intercom',
    description: '[Proxy v1 API] :: Scenario for testing Internal Server error from destination',
    successCriteria: 'Should return 500 status code with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://api.intercom.io/users/test3',
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
            message: 'Request Processed Successfully',
            response: [
              {
                error: JSON.stringify({
                  type: 'error.list',
                  request_id: 'request128',
                  errors: [{ code: 'client_error', message: 'Unknown server error' }],
                }),
                metadata: generateMetadata(1),
                statusCode: 500,
              },
            ],
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v1_other_scenario_4',
    name: 'intercom',
    description: '[Proxy v1 API] :: Scenario for testing Gateway Time Out error from destination',
    successCriteria: 'Should return 504 status code with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://api.intercom.io/users/test4',
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
            message: 'Request Processed Successfully',
            response: [
              {
                error: JSON.stringify({
                  type: 'error.list',
                  request_id: 'request129',
                  errors: [
                    { code: 'server_timeout', message: 'Server timed out when making request' },
                  ],
                }),
                metadata: generateMetadata(1),
                statusCode: 504,
              },
            ],
            status: 504,
          },
        },
      },
    },
  },
];
