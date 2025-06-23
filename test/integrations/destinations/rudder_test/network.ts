const networkCallsData = [
  // Proxy v0 Success - default behavior
  {
    httpReq: {
      url: 'https://test.rudderstack.com/v1/record',
      method: 'POST',
    },
    httpRes: {
      data: {
        success: true,
        message: 'Request processed successfully',
      },
      status: 200,
    },
  },

  // Proxy v0 with testBehavior in body - 400 error
  {
    httpReq: {
      url: 'https://test.rudderstack.com/v1/record',
      method: 'POST',
      data: {
        action: 'upsert',
        fields: { name: 'Test User', email: 'test@example.com' },
        identifiers: { userId: 'user123' },
        recordId: 'rec123',
        timestamp: '2024-01-01T12:00:00Z',
        testBehavior: {
          statusCode: 400,
          errorMessage: 'Bad request - validation failed',
        },
      },
    },
    httpRes: {
      data: {
        error: 'Bad request - validation failed',
        code: 400,
      },
      status: 400,
    },
  },

  // Proxy v0 with testBehavior in body - 401 error
  {
    httpReq: {
      url: 'https://test.rudderstack.com/v1/record',
      method: 'POST',
      data: {
        action: 'upsert',
        fields: { name: 'Test User', email: 'test@example.com' },
        identifiers: { userId: 'user123' },
        recordId: 'rec123',
        timestamp: '2024-01-01T12:00:00Z',
        testBehavior: {
          statusCode: 401,
          errorMessage: 'Unauthorized - invalid credentials',
        },
      },
    },
    httpRes: {
      data: {
        error: 'Unauthorized - invalid credentials',
        code: 401,
      },
      status: 401,
    },
  },

  // Proxy v0 with testBehavior in body - 500 error
  {
    httpReq: {
      url: 'https://test.rudderstack.com/v1/record',
      method: 'POST',
      data: {
        action: 'upsert',
        fields: { name: 'Test User', email: 'test@example.com' },
        identifiers: { userId: 'user123' },
        recordId: 'rec123',
        timestamp: '2024-01-01T12:00:00Z',
        testBehavior: {
          statusCode: 500,
          errorMessage: 'Internal server error - please retry',
        },
      },
    },
    httpRes: {
      data: {
        error: 'Internal server error - please retry',
        code: 500,
      },
      status: 500,
    },
  },

  // Proxy v0 with testBehavior in body - 429 error
  {
    httpReq: {
      url: 'https://test.rudderstack.com/v1/record',
      method: 'POST',
      data: {
        action: 'upsert',
        fields: { name: 'Test User', email: 'test@example.com' },
        identifiers: { userId: 'user123' },
        recordId: 'rec123',
        timestamp: '2024-01-01T12:00:00Z',
        testBehavior: {
          statusCode: 429,
          errorMessage: 'Rate limit exceeded - too many requests',
        },
      },
    },
    httpRes: {
      data: {
        error: 'Rate limit exceeded - too many requests',
        code: 429,
      },
      status: 429,
    },
  },

  // Proxy v0 with testBehavior in headers - 422 error
  {
    httpReq: {
      url: 'https://test.rudderstack.com/v1/record',
      method: 'POST',
      headers: {
        'x-test-behavior': JSON.stringify({
          statusCode: 422,
          errorMessage: 'Unprocessable entity - invalid data format',
        }),
      },
    },
    httpRes: {
      data: {
        error: 'Unprocessable entity - invalid data format',
        code: 422,
      },
      status: 422,
    },
  },

  // Proxy v0 with mutation behavior - success
  {
    httpReq: {
      url: 'https://test.rudderstack.com/v1/record',
      method: 'POST',
      data: {
        action: 'upsert',
        fields: { name: 'Test User', email: 'test@example.com' },
        identifiers: { userId: 'user123' },
        recordId: 'rec123',
        timestamp: '2024-01-01T12:00:00Z',
        testBehavior: {
          mutateDestinationConfig: true,
        },
      },
    },
    httpRes: {
      data: {
        success: true,
        message: 'Request processed successfully with mutation',
      },
      status: 200,
    },
  },
];

export { networkCallsData };
