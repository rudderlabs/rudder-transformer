// Dynamic functions to read environment variables at runtime
export const getBaseEndpoint = (): string =>
  process.env.RUDDER_TEST_API_ENDPOINT ?? 'https://test.rudderstack.com/v1/record';

// Destination name for proxy
export const DESTINATION = 'RUDDER_TEST';

// Dynamic function to read debug mode at runtime
export const isDebugMode = (): boolean => process.env.RUDDER_TEST_DEBUG === 'true';

// Proxy endpoints for testing different scenarios (v0 proxy only)
export const getProxyEndpoints = () => ({
  RECORD: getBaseEndpoint(),
});

// That's it! Keep it minimal but extensible for testing
