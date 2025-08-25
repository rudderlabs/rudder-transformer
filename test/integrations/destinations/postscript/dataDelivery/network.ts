export const headerBlockWithCorrectApiKey = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ps_test_api_key_12345',
  'X-Postscript-Partner-Key': 'partner_api_key_12345',
};

export const headerBlockWithWrongApiKey = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer invalid_api_key',
  'X-Postscript-Partner-Key': 'partner_api_key_12345',
};

// Mock data for subscriber creation (identify event)
export const correctSubscriberCreateData = {
  phone_number: '+1234567890',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  keyword: 'WELCOME',
  tags: ['new-customer', 'vip'],
  origin: 'api',
};

// Mock data for subscriber update (identify event with existing subscriber)
export const correctSubscriberUpdateData = {
  phone_number: '+1234567890',
  email: 'updated@example.com',
  first_name: 'John',
  last_name: 'Smith',
  tags: ['updated-customer', 'loyalty'],
};

// Mock data for custom event creation (track event)
export const correctCustomEventData = {
  type: 'Purchase Completed',
  subscriber_id: 'sub_12345',
  occurred_at: '2025-01-15T10:00:00.000Z',
  properties: {
    order_id: 'order_123',
    total_amount: 99.99,
    currency: 'USD',
    items: ['item1', 'item2'],
  },
};

// Mock data for service unavailable error scenario
export const serviceUnavailableCustomEventData = {
  type: 'Service Unavailable Test',
  subscriber_id: 'sub_service_unavailable',
  occurred_at: '2025-01-15T10:00:00.000Z',
  properties: {
    test_scenario: 'service_unavailable',
    error_type: 'service_unavailable',
  },
};

// Mock data with invalid phone number
export const invalidPhoneSubscriberData = {
  phone_number: 'invalid-phone',
  email: 'test@example.com',
  keyword: 'WELCOME',
};

// Mock data missing required fields
export const missingRequiredFieldsData = {
  email: 'test@example.com',
  // Missing phone_number and keyword
};

// Mock data for rate limit test scenario
export const rateLimitTestData = {
  phone_number: '+1234567890',
  email: 'rate_limit_test@example.com',
  first_name: 'Rate',
  last_name: 'Limit',
  keyword: 'RATE_LIMIT',
  tags: ['rate-test'],
  origin: 'api',
};

// Mock data for server error test scenario
export const serverErrorTestData = {
  phone_number: '+1234567890',
  email: 'server_error_test@example.com',
  first_name: 'Server',
  last_name: 'Error',
  keyword: 'SERVER_ERROR',
  tags: ['server-error-test'],
  origin: 'api',
};

// MOCK DATA - Network calls for testing
const businessMockData = [
  {
    description: 'Mock response from destination depicting successful subscriber creation',
    httpReq: {
      method: 'POST',
      url: 'https://api.postscript.io/api/v2/subscribers',
      headers: headerBlockWithCorrectApiKey,
      data: correctSubscriberCreateData,
    },
    httpRes: {
      data: {
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
      status: 201,
      statusText: 'Created',
    },
  },
  {
    description: 'Mock response from destination depicting successful subscriber update',
    httpReq: {
      method: 'POST', // Changed from PATCH to POST since test framework normalizes to POST
      url: 'https://api.postscript.io/api/v2/subscribers/sub_12345',
      headers: headerBlockWithCorrectApiKey,
      data: correctSubscriberUpdateData,
    },
    httpRes: {
      data: {
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
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response from destination depicting successful custom event creation',
    httpReq: {
      method: 'POST',
      url: 'https://api.postscript.io/api/v2/custom-events',
      headers: headerBlockWithCorrectApiKey,
      data: correctCustomEventData,
    },
    httpRes: {
      data: {
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
      status: 201,
      statusText: 'Created',
    },
  },
  {
    description: 'Mock response from destination depicting invalid API key error',
    httpReq: {
      method: 'POST',
      url: 'https://api.postscript.io/api/v2/subscribers',
      headers: headerBlockWithWrongApiKey,
      data: correctSubscriberCreateData,
    },
    httpRes: {
      data: {
        error: {
          type: 'authentication_error',
          message: 'Invalid API key provided',
          code: 'invalid_api_key',
        },
      },
      status: 401,
      statusText: 'Unauthorized',
    },
  },
  {
    description: 'Mock response from destination depicting rate limit exceeded',
    httpReq: {
      method: 'POST',
      url: 'https://api.postscript.io/api/v2/subscribers',
      headers: headerBlockWithCorrectApiKey,
      data: rateLimitTestData, // Changed from correctSubscriberCreateData to rateLimitTestData
    },
    httpRes: {
      data: {
        error: {
          type: 'rate_limit_error',
          message: 'Too many requests. Please try again later.',
          code: 'rate_limit_exceeded',
        },
      },
      status: 429,
      statusText: 'Too Many Requests',
      headers: {
        'Retry-After': '60',
      },
    },
  },
  {
    description: 'Mock response from destination depicting invalid phone number format',
    httpReq: {
      method: 'POST',
      url: 'https://api.postscript.io/api/v2/subscribers',
      headers: headerBlockWithCorrectApiKey,
      data: invalidPhoneSubscriberData,
    },
    httpRes: {
      data: {
        error: {
          type: 'validation_error',
          message: 'Invalid phone number format',
          code: 'invalid_phone_number',
          details: {
            field: 'phone_number',
            value: 'invalid-phone',
          },
        },
      },
      status: 400,
      statusText: 'Bad Request',
    },
  },
  {
    description: 'Mock response from destination depicting missing required fields',
    httpReq: {
      method: 'POST',
      url: 'https://api.postscript.io/api/v2/subscribers',
      headers: headerBlockWithCorrectApiKey,
      data: missingRequiredFieldsData,
    },
    httpRes: {
      data: {
        error: {
          type: 'validation_error',
          message: 'Missing required fields: phone_number, keyword',
          code: 'missing_required_fields',
          details: {
            missing_fields: ['phone_number', 'keyword'],
          },
        },
      },
      status: 400,
      statusText: 'Bad Request',
    },
  },
  {
    description: 'Mock response from destination depicting server error',
    httpReq: {
      method: 'POST',
      url: 'https://api.postscript.io/api/v2/subscribers',
      headers: headerBlockWithCorrectApiKey,
      data: serverErrorTestData, // Changed from correctSubscriberCreateData to serverErrorTestData
    },
    httpRes: {
      data: {
        error: {
          type: 'server_error',
          message: 'Internal server error occurred',
          code: 'internal_server_error',
        },
      },
      status: 500,
      statusText: 'Internal Server Error',
    },
  },
  {
    description: 'Mock response from destination depicting service unavailable',
    httpReq: {
      method: 'POST',
      url: 'https://api.postscript.io/api/v2/custom-events',
      headers: headerBlockWithCorrectApiKey,
      data: serviceUnavailableCustomEventData, // Changed from correctCustomEventData to serviceUnavailableCustomEventData
    },
    httpRes: {
      data: {
        error: {
          type: 'service_unavailable',
          message: 'Service temporarily unavailable',
          code: 'service_unavailable',
        },
      },
      status: 503,
      statusText: 'Service Unavailable',
    },
  },
];

export const networkCallsData = [...businessMockData];
