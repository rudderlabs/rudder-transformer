// Mock destination responses for braze_audience proxy (v1 delivery).
// Auto-discovered by the component test runner (glob `**/network.ts`).
//
// Request bodies and response payloads are exported so dataDelivery/data.ts can
// reference the same objects in expected output (destinationResponse lock-step).

import { bulkEndpoint, headers, standardEndpoint } from '../common';

export const bulkTrackEndpoint = bulkEndpoint;
export const bulkTrackPath = '/users/track/bulk';
export const standardTrackEndpoint = standardEndpoint;
export const standardTrackPath = '/users/track';
export { headers };

// ---------------------------------------------------------------------------
// Request bodies (JSON proxied to Braze /users/track/bulk)
// ---------------------------------------------------------------------------

export const successBody = {
  attributes: [
    { external_id: 'user-1', rs_high_intent: true },
    { external_id: 'user-2', rs_high_intent: false },
  ],
};

export const partialIdentityBody = {
  attributes: [
    { external_id: 'user-ok', rs_high_intent: true },
    { external_id: 'user-too-large', rs_high_intent: true },
    { external_id: 'user-ok-2', rs_high_intent: false },
  ],
};

export const partialRetryableBody = {
  attributes: [
    { external_id: 'user-transient', rs_high_intent: true },
    { external_id: 'user-ok', rs_high_intent: true },
  ],
};

export const authErrorBody = {
  attributes: [{ external_id: 'auth-user', rs_high_intent: true }],
};

export const rateLimitBody = {
  attributes: [{ external_id: 'rate-user', rs_high_intent: true }],
};

export const serverErrorBody = {
  attributes: [
    { external_id: 'one', rs_high_intent: true },
    { external_id: 'two', rs_high_intent: false },
  ],
};

// Standard (/users/track) request: the `partner` field, and one external_id over Braze's 988-byte
// cap, so the mocked identity error below matches an input Braze would really reject. The live
// scenario `braze-audience-standard-partial-failure` asserts the same case against Braze itself.
export const standardOversizedExternalId = `std-${'x'.repeat(1000)}`;

export const standardPartialBody = {
  partner: 'RudderStack',
  attributes: [
    { external_id: 'std-ok', rs_high_intent: true },
    { external_id: standardOversizedExternalId, rs_high_intent: true },
  ],
};

// ---------------------------------------------------------------------------
// Destination responses
// ---------------------------------------------------------------------------

export const successResponse = {
  message: 'success',
  attributes_processed: 2,
  errors: [],
};

export const partialIdentityResponse = {
  message: 'success',
  attributes_processed: 2,
  errors: [{ type: 'EXTERNAL_USER_ID_TOO_LARGE', index: 1 }],
};

export const partialRetryableResponse = {
  message: 'success',
  attributes_processed: 1,
  errors: [{ type: 'SOME_TRANSIENT_ATTR_ERROR', index: 0 }],
};

// /users/track names the array each error indexes (`input_array`); the index is still positional.
export const standardPartialResponse = {
  message: 'success',
  attributes_processed: 1,
  errors: [{ type: 'EXTERNAL_USER_ID_TOO_LARGE', input_array: 'attributes', index: 1 }],
};

export const authErrorResponse = {
  message: 'Invalid API key',
};

export const rateLimitResponse = {
  message: 'Rate limited',
};

export const serverErrorResponse = {
  message: 'Internal server error',
};

// ---------------------------------------------------------------------------
// Mock registrations
// ---------------------------------------------------------------------------

const post = (data: Record<string, unknown>, url = bulkTrackEndpoint) => ({
  method: 'POST',
  url,
  data,
});

export const networkCallsData = [
  {
    httpReq: post(successBody),
    httpRes: { data: successResponse, status: 201 },
  },
  {
    httpReq: post(partialIdentityBody),
    httpRes: { data: partialIdentityResponse, status: 201 },
  },
  {
    httpReq: post(partialRetryableBody),
    httpRes: { data: partialRetryableResponse, status: 201 },
  },
  {
    httpReq: post(standardPartialBody, standardTrackEndpoint),
    httpRes: { data: standardPartialResponse, status: 201 },
  },
  {
    httpReq: post(authErrorBody),
    httpRes: { data: authErrorResponse, status: 401 },
  },
  {
    httpReq: post(rateLimitBody),
    httpRes: { data: rateLimitResponse, status: 429 },
  },
  {
    httpReq: post(serverErrorBody),
    httpRes: { data: serverErrorResponse, status: 500 },
  },
];
