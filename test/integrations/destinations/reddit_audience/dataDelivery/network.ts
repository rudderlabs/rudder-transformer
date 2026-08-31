// Mock Reddit responses for reddit_audience proxy (v1 delivery).
// Auto-discovered by the component test runner (glob `**/network.ts`).
//
// Reddit answers PATCH /custom_audiences/{id}/users with 204 No Content — there
// is no partial-failure envelope, so every scenario below is a whole-request
// outcome keyed purely on the HTTP status.

import { ALICE_EMAIL_SHA256, endpoint, endpointPath, headers } from '../common';

export { endpoint, endpointPath, headers };

const row = (hex: string) => [hex];

const body = (actionType: 'ADD' | 'REMOVE', rows: string[][]) => ({
  data: { action_type: actionType, column_order: ['EMAIL_SHA256'], user_data: rows },
});

// --- request bodies -------------------------------------------------------

export const successBody = body('ADD', [row(ALICE_EMAIL_SHA256), row('b'.repeat(64))]);
export const removeBody = body('REMOVE', [row(ALICE_EMAIL_SHA256)]);
export const badRequestBody = body('ADD', [row('c'.repeat(64))]);
export const authExpiredBody = body('ADD', [row('d'.repeat(64))]);
export const scopeErrorBody = body('ADD', [row('e'.repeat(64))]);
export const notFoundBody = body('ADD', [row('f'.repeat(64))]);
export const rateLimitBody = body('ADD', [row('1'.repeat(64))]);
export const serverErrorBody = body('ADD', [row('2'.repeat(64))]);

// --- Reddit responses -----------------------------------------------------

/** 204 carries no body at all. */
export const successResponse = '';

export const badRequestResponse = {
  error: {
    code: 400,
    message: 'Bad request.',
    fields: [{ field: 'user_data', message: 'Invalid value.' }],
  },
};

/** The auth shape the event-stream Reddit handler already keys on. */
export const authExpiredResponse = {
  error: { code: 401, reason: 'UNAUTHORIZED', message: 'Request is not authenticated' },
};

export const scopeErrorResponse = {
  error: { code: 403, message: 'Insufficient authentication scopes.' },
};

export const notFoundResponse = {
  error: { code: 404, message: 'The specified resource was not found.' },
};

export const rateLimitResponse = {
  error: { code: 429, message: 'Too many requests.' },
};

export const serverErrorResponse = {
  error: { code: 500, message: 'Server error.' },
};

// --- mock registrations ---------------------------------------------------

const patch = (data: Record<string, unknown>) => ({
  method: 'PATCH',
  url: endpoint,
  data,
});

export const networkCallsData = [
  { httpReq: patch(successBody), httpRes: { data: successResponse, status: 204 } },
  { httpReq: patch(removeBody), httpRes: { data: successResponse, status: 204 } },
  { httpReq: patch(badRequestBody), httpRes: { data: badRequestResponse, status: 400 } },
  { httpReq: patch(authExpiredBody), httpRes: { data: authExpiredResponse, status: 401 } },
  { httpReq: patch(scopeErrorBody), httpRes: { data: scopeErrorResponse, status: 403 } },
  { httpReq: patch(notFoundBody), httpRes: { data: notFoundResponse, status: 404 } },
  { httpReq: patch(rateLimitBody), httpRes: { data: rateLimitResponse, status: 429 } },
  { httpReq: patch(serverErrorBody), httpRes: { data: serverErrorResponse, status: 500 } },
];
