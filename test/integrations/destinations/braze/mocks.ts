/**
 * Mock functions specifically for Braze router tests with batched identify resolution
 */

// We'll use a different approach - directly mocking the config constant
let isBatchedIdentifyEnabled = false;

// Mock the config module at the Jest level - this will only affect router tests
jest.mock('../../../../src/v0/destinations/braze/config', () => {
  const actualConfig = jest.requireActual('../../../../src/v0/destinations/braze/config');
  return {
    ...actualConfig,
    get BRAZE_BATCH_IDENTIFY_RESOLUTION() {
      return isBatchedIdentifyEnabled;
    },
  };
});

/**
 * Mock function to enable batched identify resolution
 */
export const enableBatchedIdentifyResolution = () => {
  isBatchedIdentifyEnabled = true;
};

/**
 * Mock function to disable batched identify resolution
 */
export const disableBatchedIdentifyResolution = () => {
  isBatchedIdentifyEnabled = false;
};

/**
 * Clean up function to restore original environment
 */
export const cleanupBatchedIdentifyMocks = () => {
  isBatchedIdentifyEnabled = false;
};

/**
 * Mock function for testing with batched identify disabled
 */
export const mockFnsWithBatchedIdentifyDisabled = (mockAdapter: any) => {
  disableBatchedIdentifyResolution();

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
  enableBatchedIdentifyResolution();

  // Mock network failure for identify endpoint
  mockAdapter.onPost(/.*\/users\/identify/).networkErrorOnce();
};

/**
 * Mock function for testing HTTP status failures in batched identify
 */
export const mockHttpStatusFailure = (mockAdapter: any) => {
  enableBatchedIdentifyResolution();

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
  enableBatchedIdentifyResolution();

  // Mock successful response for identify endpoint
  mockAdapter.onPost(/.*\/users\/identify/).replyOnce(200, {
    message: 'success',
    errors: [],
  });
};
