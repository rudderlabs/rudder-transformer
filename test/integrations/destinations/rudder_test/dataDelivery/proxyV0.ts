import { generateProxyV0Payload } from '../../../testUtils';

const destType = 'rudder_test';

// Test data for proxy v0 scenarios
export const testScenariosForV0API = [
  {
    id: 'rudder_test_v0_scenario_1',
    name: destType,
    description: '[Proxy v0 API] :: Test for successful request without test behavior',
    successCriteria: 'Should return 200 with successful response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
          },
          params: {},
          JSON: {
            action: 'upsert',
            fields: { name: 'John Doe', email: 'john@example.com' },
            identifiers: { userId: 'user123' },
            recordId: 'rec123',
            timestamp: '2024-01-01T12:00:00Z',
          },
          endpoint: 'https://test.rudderstack.com/v1/record',
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
            message: 'Request for RUDDER_TEST Processed Successfully',
            destinationResponse: {
              response: {
                message: 'Mock response for RUDDER_TEST',
                recordId: 'rec123',
                timestamp: expect.any(String),
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    id: 'rudder_test_v0_scenario_2',
    name: destType,
    description: '[Proxy v0 API] :: Test for 400 Bad Request error using testBehavior',
    successCriteria: 'Should return 400 with custom error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
          },
          params: {},
          JSON: {
            action: 'upsert',
            fields: { name: 'Invalid User' },
            identifiers: { userId: 'invalid123' },
            testBehavior: {
              statusCode: 400,
              errorMessage: 'Bad Request - Invalid data format',
            },
          },
          endpoint: 'https://test.rudderstack.com/v1/record',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message: 'Bad Request - Invalid data format',
            destinationResponse: {
              response: {
                error: 'Bad Request - Invalid data format',
              },
              status: 400,
            },
            statTags: {
              destType: 'RUDDER_TEST',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
          },
        },
      },
    },
  },
  {
    id: 'rudder_test_v0_scenario_3',
    name: destType,
    description: '[Proxy v0 API] :: Test for 401 Authentication error using testBehavior',
    successCriteria: 'Should return 401 with authentication error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'invalid-key',
          },
          params: {},
          JSON: {
            action: 'upsert',
            fields: { name: 'Test User' },
            identifiers: { userId: 'user123' },
            testBehavior: {
              statusCode: 401,
              errorMessage: 'Authentication failed - Invalid API key',
            },
          },
          endpoint: 'https://test.rudderstack.com/v1/record',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            status: 401,
            message: 'Authentication failed - Invalid API key',
            destinationResponse: {
              response: {
                error: 'Authentication failed - Invalid API key',
              },
              status: 401,
            },
            statTags: {
              destType: 'RUDDER_TEST',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
          },
        },
      },
    },
  },
  {
    id: 'rudder_test_v0_scenario_4',
    name: destType,
    description: '[Proxy v0 API] :: Test for 500 Server error using testBehavior (retryable)',
    successCriteria: 'Should return 500 with retryable error type',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
          },
          params: {},
          JSON: {
            action: 'upsert',
            fields: { name: 'Test User' },
            identifiers: { userId: 'user123' },
            testBehavior: {
              statusCode: 500,
              errorMessage: 'Internal server error - please retry',
            },
          },
          endpoint: 'https://test.rudderstack.com/v1/record',
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
            message: 'Internal server error - please retry',
            destinationResponse: {
              response: {
                error: 'Internal server error - please retry',
              },
              status: 500,
            },
            statTags: {
              destType: 'RUDDER_TEST',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
          },
        },
      },
    },
  },
  {
    id: 'rudder_test_v0_scenario_5',
    name: destType,
    description: '[Proxy v0 API] :: Test for 429 Rate limiting error using testBehavior',
    successCriteria: 'Should return 429 with throttled error type',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
          },
          params: {},
          JSON: {
            action: 'upsert',
            fields: { name: 'Test User' },
            identifiers: { userId: 'user123' },
            testBehavior: {
              statusCode: 429,
              errorMessage: 'Too many requests - rate limit exceeded',
            },
          },
          endpoint: 'https://test.rudderstack.com/v1/record',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 429,
        body: {
          output: {
            status: 429,
            message: 'Too many requests - rate limit exceeded',
            destinationResponse: {
              response: {
                error: 'Too many requests - rate limit exceeded',
              },
              status: 429,
            },
            statTags: {
              destType: 'RUDDER_TEST',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
          },
        },
      },
    },
  },

  {
    id: 'rudder_test_v0_scenario_6',
    name: destType,
    description: '[Proxy v0 API] :: Test with mutation test behavior (existing feature)',
    successCriteria: 'Should return 200 with successful response including mutation test',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
          },
          params: {},
          JSON: {
            action: 'upsert',
            fields: { name: 'Test User' },
            identifiers: { userId: 'user123' },
            testBehavior: {
              statusCode: 200, // Success case
              mutateDestinationConfig: true,
            },
          },
          endpoint: 'https://test.rudderstack.com/v1/record',
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
            message: 'Request for RUDDER_TEST Processed Successfully',
            destinationResponse: {
              response: {
                message: 'Mock response for RUDDER_TEST',
                timestamp: expect.any(String),
              },
              status: 200,
            },
          },
        },
      },
    },
  },
];
