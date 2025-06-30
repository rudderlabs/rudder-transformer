// Support environment variable override for testing purposes
// Use a function to evaluate at runtime instead of module load time
export const getBaseEndpoint = (): string =>
  process.env.RUDDER_TEST_API_ENDPOINT || 'https://test.rudderstack.com/v1/record';

// That's it! Keep it minimal
