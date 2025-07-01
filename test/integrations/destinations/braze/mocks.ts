
/**
 * Mock function for testing with batched identify disabled
 */
export const mockFnsWithBatchedIdentifyDisabled = (mockAdapter: any) => {

  // Mock successful response for individual identify calls
  mockAdapter.onPost(/.*\/users\/identify/).replyOnce(200, {
    message: 'success',
    errors: [],
  });
};

/**
 * Mock function for testing network failures in batched identify
 */
export const mockNetworkFailure = (mockAdapter: any) => {

  // Mock network failure for identify endpoint
  mockAdapter.onPost(/.*\/users\/identify/).networkErrorOnce();
};

/**
 * Mock function for testing HTTP status failures in batched identify
 */
export const mockHttpStatusFailure = (mockAdapter: any) => {

  // Mock HTTP 500 error for identify endpoint
  mockAdapter.onPost(/.*\/users\/identify/).replyOnce(500, {
    message: 'Internal Server Error',
    errors: [
      {
        type: 'server_error',
        input_array: 'aliases_to_identify',
        index: 0,
      },
    ],
  });
};

/**
 * Mock function for testing successful batched identify
 */
export const mockSuccessfulBatchedIdentify = (mockAdapter: any) => {

  // Mock successful response for identify endpoint
  mockAdapter.onPost(/.*\/users\/identify/).replyOnce(200, {
    message: 'success',
    errors: [],
  });
};
