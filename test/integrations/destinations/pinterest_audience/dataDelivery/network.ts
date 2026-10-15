// Pinterest responses for PATCH /v5/ad_accounts/{ad}/customer_lists/{list}.
// Shapes: OpenAPI v5.28.0 `CustomerList` (200) and `Pinterest.Lib.Error` {code, message}.
// Replaced by live captures from probes P1/P5 (spec §9).
import { EMAIL_SHA256, adAccountId, customerListId, endpoint, endpointPath, headers } from '../common';

export { endpoint, endpointPath, headers };

const body = (operationType: 'ADD' | 'REMOVE', emails: string[]) => ({
  operation_type: operationType,
  records_v2: emails.map((email) => ({ email })),
});

// --- request bodies (one distinct body per scenario so each mock matches exactly one) ---
export const successBody = body('ADD', [EMAIL_SHA256, 'b'.repeat(64)]);
export const removeBody = body('REMOVE', [EMAIL_SHA256]);
export const authExpiredBody = body('ADD', ['c'.repeat(64)]);
export const forbiddenBody = body('ADD', ['d'.repeat(64)]);
export const notFoundBody = body('ADD', ['e'.repeat(64)]);
export const malformedBody = body('ADD', ['f'.repeat(64)]);
export const rateLimitBody = body('ADD', ['1'.repeat(64)]);
export const serverErrorBody = body('ADD', ['2'.repeat(64)]);

// --- Pinterest responses ---
export const customerListResponse = {
  ad_account_id: adAccountId,
  created_time: 1452208622,
  exceptions: {},
  id: customerListId,
  name: 'The Glengarry Glen Ross leads',
  num_batches: 2,
  num_removed_user_records: 0,
  num_uploaded_user_records: 11,
  status: 'PROCESSING',
  type: 'customerlist',
  updated_time: 1461269616,
};
// pinned by probe P5 (spec §9)
export const authExpiredResponse = { code: 2, message: 'Authentication failed.' };
export const forbiddenResponse = { code: 29, message: 'You are not permitted to access that resource.' };
export const notFoundResponse = { code: 1018, message: 'Customer list not found.' };
export const malformedResponse = { code: 2740, message: 'Malformatted user list.' };
export const rateLimitResponse = { code: 8, message: 'Rate limit exceeded.' };
export const serverErrorResponse = { code: 1, message: 'Something went wrong on our end.' };

const patch = (data: Record<string, unknown>) => ({ method: 'PATCH', url: endpoint, data });

export const networkCallsData = [
  { httpReq: patch(successBody), httpRes: { data: customerListResponse, status: 200 } },
  { httpReq: patch(removeBody), httpRes: { data: customerListResponse, status: 200 } },
  { httpReq: patch(authExpiredBody), httpRes: { data: authExpiredResponse, status: 401 } },
  { httpReq: patch(forbiddenBody), httpRes: { data: forbiddenResponse, status: 403 } },
  { httpReq: patch(notFoundBody), httpRes: { data: notFoundResponse, status: 404 } },
  { httpReq: patch(malformedBody), httpRes: { data: malformedResponse, status: 400 } },
  { httpReq: patch(rateLimitBody), httpRes: { data: rateLimitResponse, status: 429 } },
  { httpReq: patch(serverErrorBody), httpRes: { data: serverErrorResponse, status: 500 } },
];
