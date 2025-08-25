import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import {
  correctSubscriberCreateData,
  correctSubscriberUpdateData,
  correctCustomEventData,
  serviceUnavailableCustomEventData,
  headerBlockWithCorrectApiKey,
  headerBlockWithWrongApiKey,
  invalidPhoneSubscriberData,
  missingRequiredFieldsData,
  rateLimitTestData,
  serverErrorTestData,
} from './network';

const statTags = {
  destType: 'POSTSCRIPT',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

const retryableStatTags = {
  ...statTags,
  errorType: 'retryable',
};

const throttledStatTags = {
  ...statTags,
  errorType: 'throttled',
};

const metadata = [generateMetadata(1), generateMetadata(2)];

const singleMetadata = [
  {
    jobId: 1,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      apiKey: 'ps_test_api_key_12345',
    },
    dontBatch: false,
  },
];

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'postscript_v1_scenario_1',
    name: 'postscript',
    description: '[Proxy v1 API] :: Successful subscriber creation (identify event)',
    successCriteria: 'Should return 201 status code with success',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: correctSubscriberCreateData,
            headers: headerBlockWithCorrectApiKey,
            endpoint: 'https://api.postscript.io/api/v2/subscribers',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 201,
            message: '[POSTSCRIPT Response Handler] - Request processed successfully',
            destinationResponse: {
              status: 201,
              response: {
                subscriber: {
                  id: 'sub_12345',
                  phone_number: '+1234567890',
                  email: 'test@example.com',
                  first_name: 'John',
                  last_name: 'Doe',
                  keyword: 'WELCOME',
                  tags: ['new-customer', 'vip'],
                  created_at: '2025-01-15T10:00:00.000Z',
                  status: 'active',
                },
              },
            },
            response: [
              {
                statusCode: 201,
                metadata: singleMetadata[0],
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'postscript_v1_scenario_2',
    name: 'postscript',
    description: '[Proxy v1 API] :: Successful subscriber update (identify event)',
    successCriteria: 'Should return 200 status code with success',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: correctSubscriberUpdateData,
            headers: headerBlockWithCorrectApiKey,
            endpoint: 'https://api.postscript.io/api/v2/subscribers/sub_12345',
          },
          singleMetadata,
        ),
        method: 'PATCH',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[POSTSCRIPT Response Handler] - Request processed successfully',
            destinationResponse: {
              status: 200,
              response: {
                subscriber: {
                  id: 'sub_12345',
                  phone_number: '+1234567890',
                  email: 'updated@example.com',
                  first_name: 'John',
                  last_name: 'Smith',
                  tags: ['updated-customer', 'loyalty'],
                  updated_at: '2025-01-15T10:05:00.000Z',
                  status: 'active',
                },
              },
            },
            response: [
              {
                statusCode: 200,
                metadata: singleMetadata[0],
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'postscript_v1_scenario_3',
    name: 'postscript',
    description: '[Proxy v1 API] :: Successful custom event creation (track event)',
    successCriteria: 'Should return 201 status code with success',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: correctCustomEventData,
            headers: headerBlockWithCorrectApiKey,
            endpoint: 'https://api.postscript.io/api/v2/custom-events',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 201,
            message: '[POSTSCRIPT Response Handler] - Request processed successfully',
            destinationResponse: {
              status: 201,
              response: {
                event: {
                  id: 'event_12345',
                  type: 'Purchase Completed',
                  subscriber_id: 'sub_12345',
                  occurred_at: '2025-01-15T10:00:00.000Z',
                  properties: {
                    order_id: 'order_123',
                    total_amount: 99.99,
                    currency: 'USD',
                    items: ['item1', 'item2'],
                  },
                  created_at: '2025-01-15T10:00:01.000Z',
                },
              },
            },
            response: [
              {
                statusCode: 201,
                metadata: singleMetadata[0],
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'postscript_v1_scenario_4',
    name: 'postscript',
    description: '[Proxy v1 API] :: Invalid API key error',
    successCriteria: 'Should return 401 status code with authentication error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: correctSubscriberCreateData,
            headers: headerBlockWithWrongApiKey,
            endpoint: 'https://api.postscript.io/api/v2/subscribers',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 401,
            message: '[POSTSCRIPT] Request failed with status: 401',
            statTags: {
              ...statTags,
              errorType: 'aborted',
            },
            response: [
              {
                statusCode: 401,
                metadata: singleMetadata[0],
                error: JSON.stringify({
                  error: {
                    type: 'authentication_error',
                    message: 'Invalid API key provided',
                    code: 'invalid_api_key',
                  },
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'postscript_v1_scenario_5',
    name: 'postscript',
    description: '[Proxy v1 API] :: Rate limit exceeded error',
    successCriteria: 'Should return 429 status code with throttled error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: rateLimitTestData,
            headers: headerBlockWithCorrectApiKey,
            endpoint: 'https://api.postscript.io/api/v2/subscribers',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 429,
            message: '[POSTSCRIPT] Rate limit exceeded',
            statTags: {
              ...statTags,
              errorType: 'throttled',
            },
            response: [
              {
                statusCode: 429,
                metadata: singleMetadata[0],
                error: JSON.stringify({
                  error: {
                    type: 'rate_limit_error',
                    message: 'Too many requests. Please try again later.',
                    code: 'rate_limit_exceeded',
                  },
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'postscript_v1_scenario_6',
    name: 'postscript',
    description: '[Proxy v1 API] :: Invalid phone number format error',
    successCriteria: 'Should return 400 status code with validation error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: invalidPhoneSubscriberData,
            headers: headerBlockWithCorrectApiKey,
            endpoint: 'https://api.postscript.io/api/v2/subscribers',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: '[POSTSCRIPT] Request failed with status: 400',
            statTags: {
              ...statTags,
              errorType: 'aborted',
            },
            response: [
              {
                statusCode: 400,
                metadata: singleMetadata[0],
                error: JSON.stringify({
                  error: {
                    type: 'validation_error',
                    message: 'Invalid phone number format',
                    code: 'invalid_phone_number',
                    details: {
                      field: 'phone_number',
                      value: 'invalid-phone',
                    },
                  },
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'postscript_v1_scenario_7',
    name: 'postscript',
    description: '[Proxy v1 API] :: Missing required fields error',
    successCriteria: 'Should return 400 status code with validation error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: missingRequiredFieldsData,
            headers: headerBlockWithCorrectApiKey,
            endpoint: 'https://api.postscript.io/api/v2/subscribers',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: '[POSTSCRIPT] Request failed with status: 400',
            statTags: {
              ...statTags,
              errorType: 'aborted',
            },
            response: [
              {
                statusCode: 400,
                metadata: singleMetadata[0],
                error: JSON.stringify({
                  error: {
                    type: 'validation_error',
                    message: 'Missing required fields: phone_number, keyword',
                    code: 'missing_required_fields',
                    details: {
                      missing_fields: ['phone_number', 'keyword'],
                    },
                  },
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'postscript_v1_scenario_8',
    name: 'postscript',
    description: '[Proxy v1 API] :: Server error',
    successCriteria: 'Should return 500 status code with retryable error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: serverErrorTestData,
            headers: headerBlockWithCorrectApiKey,
            endpoint: 'https://api.postscript.io/api/v2/subscribers',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 500,
            message: '[POSTSCRIPT] Server error occurred',
            statTags: {
              ...statTags,
              errorType: 'retryable',
            },
            response: [
              {
                statusCode: 500,
                metadata: singleMetadata[0],
                error: JSON.stringify({
                  error: {
                    type: 'server_error',
                    message: 'Internal server error occurred',
                    code: 'internal_server_error',
                  },
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'postscript_v1_scenario_9',
    name: 'postscript',
    description: '[Proxy v1 API] :: Service unavailable error',
    successCriteria: 'Should return 503 status code with retryable error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: serviceUnavailableCustomEventData,
            headers: headerBlockWithCorrectApiKey,
            endpoint: 'https://api.postscript.io/api/v2/custom-events',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 500,
            message: '[POSTSCRIPT] Server error occurred',
            statTags: {
              ...statTags,
              errorType: 'retryable',
            },
            response: [
              {
                statusCode: 500,
                metadata: singleMetadata[0],
                error: JSON.stringify({
                  error: {
                    type: 'service_unavailable',
                    message: 'Service temporarily unavailable',
                    code: 'service_unavailable',
                  },
                }),
              },
            ],
          },
        },
      },
    },
  },
];
