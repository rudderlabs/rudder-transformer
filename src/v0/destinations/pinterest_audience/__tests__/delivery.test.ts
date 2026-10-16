import {
  handleDeliveryResponse,
  resolveDeliverySpec,
  type DeliveryContext,
} from '../../../../services/destination/destinationIntegration/delivery';
import { Integration } from '../routerTransform';
import { extractPinterestErrorMessage, isAuthErrorBody } from '../delivery';

const AD_ACCOUNT_ID = '549756359984';
const LIST_ID = '643';
const ENDPOINT = `https://api.pinterest.com/v5/ad_accounts/${AD_ACCOUNT_ID}/customer_lists/${LIST_ID}`;

const ctxFor = (status: number, response: unknown): DeliveryContext =>
  ({
    status,
    response,
    jobs: [{ jobId: 1 }, { jobId: 2 }],
    request: {
      method: 'PATCH',
      endpoint: ENDPOINT,
      body: {
        JSON: {
          operation_type: 'ADD',
          records_v2: [{ email: 'a'.repeat(64) }, { email: 'b'.repeat(64) }],
        },
      },
    },
    destinationConfig: {},
  }) as unknown as DeliveryContext;

const verdict = (status: number, response: unknown) =>
  handleDeliveryResponse(Integration, ctxFor(status, response));

const LIST_NOT_FOUND = `Customer list ${LIST_ID} was not found — it may have been deleted. Pick or create the audience again.`;

describe('pinterest_audience delivery — spec', () => {
  it('overrides only 401, 403, 404 and the 4xx list-not-found codes', () => {
    expect(Object.keys(resolveDeliverySpec(Integration).statusOverrides)).toEqual([
      '401',
      '403',
      '404',
      '4xx',
    ]);
  });
});

describe('pinterest_audience delivery — verdicts', () => {
  it.each<[string, number, unknown, unknown]>([
    [
      'D12 200 with the updated CustomerList → success',
      200,
      { id: LIST_ID, type: 'customerlist', num_uploaded_user_records: 2 },
      { kind: 'success' },
    ],
    [
      'D13 401 with an auth body → authExpired (REFRESH_TOKEN)',
      401,
      { code: 2, message: 'Authentication failed.' },
      { kind: 'retry', as: 'authExpired', reason: '2: Authentication failed.' },
    ],
    [
      '401 with no body → retry without a refresh',
      401,
      '',
      { kind: 'retry', reason: 'Pinterest request failed with status 401' },
    ],
    [
      '401 not about auth → retry without a refresh',
      401,
      { code: 29, message: 'You are not permitted to access that resource.' },
      { kind: 'retry', reason: '29: You are not permitted to access that resource.' },
    ],
    [
      '403 → abort naming the ad account',
      403,
      { code: 29, message: 'You are not permitted to access that resource.' },
      {
        kind: 'abort',
        reason: `Pinterest refused the request: You are not permitted to access that resource. Check the connected account still has access to ad account ${AD_ACCOUNT_ID}.`,
      },
    ],
    [
      'D14 404 → abort, customer list not found',
      404,
      { code: 1018, message: 'Customer list not found.' },
      { kind: 'abort', reason: LIST_NOT_FOUND },
    ],
    [
      'D14 400 with code 1001 → abort, customer list not found',
      400,
      { code: 1001, message: 'Customer list not found.' },
      { kind: 'abort', reason: LIST_NOT_FOUND },
    ],
    [
      'D15 400 code 2740 → abort with "code: message"',
      400,
      { code: 2740, message: 'Malformatted user list.' },
      { kind: 'abort', reason: '2740: Malformatted user list.' },
    ],
    [
      'D16 429 → throttled',
      429,
      { code: 8, message: 'Rate limit exceeded.' },
      { kind: 'retry', as: 'throttled', reason: '8: Rate limit exceeded.' },
    ],
    [
      'D17 503 → retry',
      503,
      '',
      { kind: 'retry', reason: 'Pinterest request failed with status 503' },
    ],
  ])('%s', (_name, status, response, expected) => {
    expect(verdict(status, response)).toEqual(expected);
  });
});

describe('extractPinterestErrorMessage', () => {
  it.each<[string, unknown, number, string]>([
    [
      'code and message',
      { code: 2740, message: 'Malformatted user list.' },
      400,
      '2740: Malformatted user list.',
    ],
    ['message only', { message: 'Bad request.' }, 400, 'Bad request.'],
    ['empty body', '', 502, 'Pinterest request failed with status 502'],
  ])('%s', (_name, response, status, expected) => {
    expect(extractPinterestErrorMessage(response, status)).toBe(expected);
  });
});

describe('isAuthErrorBody', () => {
  it.each<[unknown, boolean]>([
    [{ code: 2, message: 'Authentication failed.' }, true],
    [{ code: 3, message: 'Access token expired.' }, true],
    [{ code: 29, message: 'You are not permitted to access that resource.' }, false],
    [{ message: 'Authentication failed.' }, false],
    ['Authentication failed.', false],
  ])('%j → %s', (response, expected) => {
    expect(isAuthErrorBody(response)).toBe(expected);
  });
});
