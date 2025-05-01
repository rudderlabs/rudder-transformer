import { destType } from '../common';
import { secret1 } from '../maskedSecrets';
import MockAdapter from 'axios-mock-adapter';
import { generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';

export const proxyV1: ProxyV1TestData[] = [
  {
    id: 'dummy-proxy-v1-test-1',
    name: destType,
    description: 'Basic Proxy v1 Test - Success',
    scenario: 'Business',
    successCriteria: 'The response should have a status code of 200 with individual event statuses',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: 'https://dummy-destination.example.com/api',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': secret1,
          },
          JSON: {
            events: [
              {
                userId: 'test-user-id-1',
                event: 'test-event-1',
                properties: {
                  key1: 'value1',
                },
              },
              {
                userId: 'test-user-id-2',
                event: 'test-event-2',
                properties: {
                  key2: 'value2',
                },
              },
            ],
          },
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
            message: '[DUMMY] Request processed successfully',
            destinationResponse: {
              status: 200,
              response: {
                success: true,
                message: 'Events received',
              },
            },
            response: [
              {
                statusCode: 200,
                metadata: expect.any(Object),
                error: 'success',
              },
            ],
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter.onPost('https://dummy-destination.example.com/api').replyOnce(200, {
        success: true,
        message: 'Events received',
      });
    },
  },
  {
    id: 'dummy-proxy-v1-test-2',
    name: destType,
    description: 'Proxy v1 Test - Rate Limit Error',
    scenario: 'Framework',
    successCriteria: 'The response should have a status code of 429 with individual event errors',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: 'https://dummy-destination.example.com/api',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': secret1,
          },
          JSON: {
            events: [
              {
                userId: 'test-user-id-1',
                event: 'test-event-1',
                properties: {
                  key1: 'value1',
                },
              },
              {
                userId: 'test-user-id-2',
                event: 'test-event-2',
                properties: {
                  key2: 'value2',
                },
              },
            ],
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 429,
            message: '[DUMMY] Rate limit exceeded. Please try again later.',

            statTags: {
              destType: 'DUMMY',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            response: [
              {
                statusCode: 429,
                metadata: expect.any(Object),
                error: '{\"error\":\"Rate limit exceeded\",\"retry_after\":60}',
              },
            ],
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter.onPost('https://dummy-destination.example.com/api').replyOnce(429, {
        error: 'Rate limit exceeded',
        retry_after: 60,
      });
    },
  },
  {
    id: 'dummy-proxy-v1-test-3',
    name: destType,
    description: 'Proxy v1 Test - Partial Batch Failure',
    scenario: 'Framework',
    successCriteria:
      'The response should indicate partial batch failure with individual event statuses',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: 'https://dummy-destination.example.com/api',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': secret1,
          },
          JSON: {
            events: [
              {
                userId: 'test-user-id-1',
                event: 'test-event-1',
                properties: {
                  key1: 'value1',
                },
              },
              {
                userId: 'invalid-user',
                event: 'test-event-2',
                properties: {
                  key2: 'value2',
                },
              },
            ],
          },
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
            message: '[DUMMY] Request failed with status 400: Partial batch failure',

            statTags: {
              destType: 'DUMMY',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            response: [
              {
                statusCode: 400,
                metadata: expect.any(Object),
                error:
                  '{\"error\":\"Partial batch failure\",\"details\":[{\"index\":0,\"status\":\"success\"},{\"index\":1,\"status\":\"error\",\"message\":\"Invalid user ID\"}]}',
              },
            ],
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter.onPost('https://dummy-destination.example.com/api').replyOnce(400, {
        error: 'Partial batch failure',
        details: [
          { index: 0, status: 'success' },
          { index: 1, status: 'error', message: 'Invalid user ID' },
        ],
      });
    },
  },
];
