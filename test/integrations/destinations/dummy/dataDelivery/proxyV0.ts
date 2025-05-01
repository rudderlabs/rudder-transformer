import { destType } from '../common';
import { secret1 } from '../maskedSecrets';
import MockAdapter from 'axios-mock-adapter';

export const proxyV0 = [
  {
    id: 'dummy-data-delivery-test-1',
    name: destType,
    description: 'Basic Data Delivery Test - Success',
    scenario: 'Business',
    successCriteria: 'The response should have a status code of 200',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://dummy-destination.example.com/api',
          method: 'POST',
          userId: 'test-user-id',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': secret1,
          },
          body: {
            JSON: {
              userId: 'test-user-id',
              event: 'test-event',
              properties: {
                key1: 'value1',
                key2: 'value2',
              },
            },
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: expect.objectContaining({
            status: 200,
            destinationResponse: {
              status: 200,
              response: {
                success: true,
                message: 'Event received',
              },
            },
          }),
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter.onPost('https://dummy-destination.example.com/api').replyOnce(200, {
        success: true,
        message: 'Event received',
      });
    },
  },
  {
    id: 'dummy-data-delivery-test-2',
    name: destType,
    description: 'Data Delivery Test - Rate Limit Error',
    scenario: 'Framework',
    successCriteria: 'The response should have a status code of 429 and be marked as retryable',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://dummy-destination.example.com/api',
          method: 'POST',
          userId: 'test-user-id',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': secret1,
          },
          body: {
            JSON: {
              userId: 'test-user-id',
              event: 'test-event',
              properties: {
                key1: 'value1',
                key2: 'value2',
              },
            },
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 429,
        body: {
          output: {
            status: 429,
            message: '[DUMMY] Rate limit exceeded. Please try again later.',
            destinationResponse: {
              status: 429,
              response: {
                error: 'Rate limit exceeded',
                retry_after: 60,
              },
            },
            statTags: {
              destType: 'DUMMY',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
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
    id: 'dummy-data-delivery-test-3',
    name: destType,
    description: 'Data Delivery Test - Authentication Error',
    scenario: 'Framework',
    successCriteria: 'The response should have a status code of 401 and indicate an auth error',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://dummy-destination.example.com/api',
          method: 'POST',
          userId: 'test-user-id',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': 'invalid-api-key',
          },
          body: {
            JSON: {
              userId: 'test-user-id',
              event: 'test-event',
              properties: {
                key1: 'value1',
                key2: 'value2',
              },
            },
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            status: 401,
            message: '[DUMMY] Authentication failed: Invalid API key',
            destinationResponse: {
              status: 401,
              response: {
                error: 'Invalid API key',
              },
            },
            statTags: {
              destType: 'DUMMY',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter.onPost('https://dummy-destination.example.com/api').replyOnce(401, {
        error: 'Invalid API key',
      });
    },
  },
];
