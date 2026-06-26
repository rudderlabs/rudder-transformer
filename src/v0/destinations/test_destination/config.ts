// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492).
// `test_destination` exists solely to validate integration definition-versioning dispatch
// end-to-end (control plane + data plane). It must never be shipped or enabled for customers.
// v1 config shape: { restApiKey (secret), dataCenter }. v2 renames these (apiKey, region) and adds
// a required accountId; only v1 is implemented in the transformer today.

// Integration major at which the v2 config/API shape (apiKey/region/accountId) kicks in (INT-6492).
// Single source shared by transform.ts (process dispatch) and networkHandler.ts (proxy dispatch).
export const V2_MAJOR = 2;

// The `.invalid` TLD is reserved (RFC 2606) and never resolves — a deliberate signal that this
// endpoint is fake. The env override keeps it pointable in dev/tests.
export const getV1Endpoint = (dataCenter = 'us'): string =>
  process.env.TEST_DESTINATION_API_ENDPOINT ||
  `https://${dataCenter}.test-destination.invalid/v1/events`;
