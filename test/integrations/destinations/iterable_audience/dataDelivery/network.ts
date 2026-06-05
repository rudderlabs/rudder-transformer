// Mock destination responses for the iterable_audience proxy (v1 delivery).
// These are auto-discovered by the component test runner (glob `**/network.ts`)
// and registered as axios mocks keyed by request method + url + body.
//
// Request bodies and response payloads are exported so dataDelivery/data.ts can
// reference the exact same objects in the expected output — keeping the echoed
// `destinationResponse` in lock-step with what the mock returns.

const subscribeEndpoint = 'https://api.iterable.com/api/lists/subscribe';
const unsubscribeEndpoint = 'https://api.iterable.com/api/lists/unsubscribe';
const listId = 12345;

const emptyFailedUpdates = {
  invalidEmails: [],
  invalidUserIds: [],
  notFoundEmails: [],
  notFoundUserIds: [],
  forgottenEmails: [],
  forgottenUserIds: [],
  conflictEmails: [],
  conflictUserIds: [],
  invalidDataEmails: [],
  invalidDataUserIds: [],
};

// ---------------------------------------------------------------------------
// Request bodies (the JSON proxied to Iterable)
// ---------------------------------------------------------------------------

export const subscribeSuccessBody = {
  listId,
  subscribers: [{ email: 'alice@example.com' }, { email: 'bob@example.com' }],
};

export const subscribeInvalidEmailBody = {
  listId,
  subscribers: [{ email: 'good@example.com' }, { email: 'bad@example.com' }],
};

export const subscribeConflictUserIdBody = {
  listId,
  subscribers: [{ userId: 'conflict_user' }],
};

export const subscribeNotFoundBody = {
  listId,
  subscribers: [{ email: 'missing@example.com' }],
};

export const subscribeForgottenBody = {
  listId,
  subscribers: [{ email: 'forgotten@example.com' }],
};

export const subscribeEmailCaseBody = {
  listId,
  subscribers: [{ email: 'MixedCase@Example.com' }],
};

export const subscribeUserIdCaseBody = {
  listId,
  subscribers: [{ userId: 'User_999' }],
};

export const subscribeMixedBody = {
  listId,
  subscribers: [
    { email: 'forgotten2@example.com' },
    { email: 'invalid2@example.com' },
    { userId: 'conflict_user2' },
    { email: 'clean1@example.com' },
    { email: 'clean2@example.com' },
  ],
};

export const unsubscribeNotFoundEmailBody = {
  listId,
  subscribers: [{ email: 'notonlist@example.com' }],
  channelUnsubscribe: false,
};

export const unsubscribeNotFoundUserIdBody = {
  listId,
  subscribers: [{ userId: 'ghost_user' }],
  channelUnsubscribe: false,
};

export const subscribeInvalidDataBody = {
  listId,
  subscribers: [{ email: 'baddata@example.com' }],
};

export const subscribeBothForgottenBody = {
  listId,
  subscribers: [{ userId: 'dual_user', email: 'dual@example.com' }],
};

export const subscribeAuthErrorBody = {
  listId,
  subscribers: [{ email: 'auth@example.com' }],
};

export const subscribeServerErrorBody = {
  listId,
  subscribers: [{ email: 'one@example.com' }, { email: 'two@example.com' }],
};

// ---------------------------------------------------------------------------
// Destination responses
// ---------------------------------------------------------------------------

export const subscribeSuccessResponse = {
  successCount: 2,
  failCount: 0,
  failedUpdates: { ...emptyFailedUpdates },
};

export const subscribeInvalidEmailResponse = {
  successCount: 1,
  failCount: 1,
  failedUpdates: { ...emptyFailedUpdates, invalidEmails: ['bad@example.com'] },
};

export const subscribeConflictUserIdResponse = {
  successCount: 0,
  failCount: 1,
  failedUpdates: { ...emptyFailedUpdates, conflictUserIds: ['conflict_user'] },
};

export const subscribeNotFoundResponse = {
  successCount: 0,
  failCount: 1,
  failedUpdates: { ...emptyFailedUpdates, notFoundEmails: ['missing@example.com'] },
};

export const subscribeForgottenResponse = {
  successCount: 0,
  failCount: 1,
  failedUpdates: { ...emptyFailedUpdates, forgottenEmails: ['forgotten@example.com'] },
};

export const subscribeEmailCaseResponse = {
  successCount: 0,
  failCount: 1,
  failedUpdates: { ...emptyFailedUpdates, invalidEmails: ['mixedcase@example.com'] },
};

export const subscribeUserIdCaseResponse = {
  successCount: 0,
  failCount: 1,
  failedUpdates: { ...emptyFailedUpdates, invalidUserIds: ['user_999'] },
};

export const subscribeMixedResponse = {
  successCount: 2,
  failCount: 3,
  failedUpdates: {
    ...emptyFailedUpdates,
    forgottenEmails: ['forgotten2@example.com'],
    invalidEmails: ['invalid2@example.com'],
    conflictUserIds: ['conflict_user2'],
  },
};

export const unsubscribeNotFoundEmailResponse = {
  successCount: 0,
  failCount: 1,
  failedUpdates: { ...emptyFailedUpdates, notFoundEmails: ['notonlist@example.com'] },
};

export const unsubscribeNotFoundUserIdResponse = {
  successCount: 0,
  failCount: 1,
  failedUpdates: { ...emptyFailedUpdates, notFoundUserIds: ['ghost_user'] },
};

// `invalidData*` paths are abortable (400). M1 sends identifier-only payloads so
// they should be empty in real traffic, but the shared error checker classifies
// them defensively — this locks that classification in.
export const subscribeInvalidDataResponse = {
  successCount: 0,
  failCount: 1,
  failedUpdates: { ...emptyFailedUpdates, invalidDataEmails: ['baddata@example.com'] },
};

// userId is forgotten but the email on the same subscriber is clean — the
// strategy must still recognise the row as forgotten (match on either field).
export const subscribeBothForgottenResponse = {
  successCount: 0,
  failCount: 1,
  failedUpdates: { ...emptyFailedUpdates, forgottenUserIds: ['dual_user'] },
};

export const authErrorResponse = {
  msg: 'Invalid API key',
  code: 'BadApiKey',
};

export const serverErrorResponse = {
  msg: 'Internal server error',
};

// ---------------------------------------------------------------------------
// Mock registrations
// ---------------------------------------------------------------------------

const post = (url: string, data: Record<string, unknown>) => ({ method: 'POST', url, data });

export const networkCallsData = [
  {
    httpReq: post(subscribeEndpoint, subscribeSuccessBody),
    httpRes: { data: subscribeSuccessResponse, status: 200 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeInvalidEmailBody),
    httpRes: { data: subscribeInvalidEmailResponse, status: 200 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeConflictUserIdBody),
    httpRes: { data: subscribeConflictUserIdResponse, status: 200 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeNotFoundBody),
    httpRes: { data: subscribeNotFoundResponse, status: 200 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeForgottenBody),
    httpRes: { data: subscribeForgottenResponse, status: 200 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeEmailCaseBody),
    httpRes: { data: subscribeEmailCaseResponse, status: 200 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeUserIdCaseBody),
    httpRes: { data: subscribeUserIdCaseResponse, status: 200 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeMixedBody),
    httpRes: { data: subscribeMixedResponse, status: 200 },
  },
  {
    httpReq: post(unsubscribeEndpoint, unsubscribeNotFoundEmailBody),
    httpRes: { data: unsubscribeNotFoundEmailResponse, status: 200 },
  },
  {
    httpReq: post(unsubscribeEndpoint, unsubscribeNotFoundUserIdBody),
    httpRes: { data: unsubscribeNotFoundUserIdResponse, status: 200 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeInvalidDataBody),
    httpRes: { data: subscribeInvalidDataResponse, status: 200 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeBothForgottenBody),
    httpRes: { data: subscribeBothForgottenResponse, status: 200 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeAuthErrorBody),
    httpRes: { data: authErrorResponse, status: 401 },
  },
  {
    httpReq: post(subscribeEndpoint, subscribeServerErrorBody),
    httpRes: { data: serverErrorResponse, status: 500 },
  },
];
