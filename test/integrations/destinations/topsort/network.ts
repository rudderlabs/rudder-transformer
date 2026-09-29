import { endpoint } from './common';
import { authHeader1 } from './maskedSecrets';

// Matched as a subset; axios normalises `content-type`, so only the credential is pinned.
const headers = { Authorization: authHeader1 };

const click = (id: string, occurredAt: string) => ({
  occurredAt,
  opaqueUserId: 'anon-1',
  placement: { path: '/category/123', position: 1, productId: 'product-a' },
  id,
});

export const validBatchRequest = {
  clicks: [
    click('msg-1', '2024-11-05T15:19:08+00:00'),
    click('msg-2', '2024-11-05T15:19:09+00:00'),
  ],
};

// One event is in the future, so Topsort rejects the whole request.
export const futureEventBatchRequest = {
  clicks: [
    click('msg-3', '2024-11-05T15:19:08+00:00'),
    click('msg-4', '2099-01-01T00:00:00+00:00'),
  ],
};

export const futureEventRequest = {
  clicks: [click('msg-4', '2099-01-01T00:00:00+00:00')],
};

// Error envelope and code from https://docs.topsort.com/en/api-reference/errors.
export const futureEventResponse = [
  {
    errCode: 'invalid_event_time',
    docUrl: 'https://docs.topsort.com/en/api-reference/errors',
    message: 'At least one event is in the future',
  },
];

export const networkCallsData = [
  {
    description: 'Topsort accepts every event in the request',
    httpReq: { method: 'POST', url: endpoint, headers, data: validBatchRequest },
    httpRes: { status: 204 },
  },
  {
    description: 'Topsort rejects the whole batch because one event is in the future',
    httpReq: { method: 'POST', url: endpoint, headers, data: futureEventBatchRequest },
    httpRes: { data: futureEventResponse, status: 400 },
  },
  {
    description: 'Topsort rejects the future event when it is sent on its own',
    httpReq: { method: 'POST', url: endpoint, headers, data: futureEventRequest },
    httpRes: { data: futureEventResponse, status: 400 },
  },
];
