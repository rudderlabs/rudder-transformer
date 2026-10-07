import { accessToken } from '../maskedSecrets';

const membershipUrl = 'https://api.hubapi.com/crm/v3/lists/10/memberships/add-and-remove';

const authHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${accessToken}`,
};

export const addSuccessBody = {
  recordIdsToAdd: ['11', '12'],
  recordIdsToRemove: [],
};

export const addSuccessResponse = {
  recordIdsMissing: [],
  recordsIdsAdded: ['12', '11'],
  recordIdsRemoved: [],
};

export const missingAddBody = {
  recordIdsToAdd: ['21', '22'],
  recordIdsToRemove: [],
};

export const missingAddResponse = {
  recordIdsMissing: ['22'],
  recordsIdsAdded: ['21'],
  recordIdsRemoved: [],
  message: 'raw-body-sentinel',
  correlationId: 'corr-missing-add',
};

export const missingRemoveBody = {
  recordIdsToAdd: [],
  recordIdsToRemove: ['31'],
};

export const missingRemoveResponse = {
  recordIdsMissing: ['31'],
  recordsIdsAdded: [],
  recordIdsRemoved: [],
  message: 'raw-body-sentinel',
};

export const rejectedTokenBody = {
  recordIdsToAdd: ['41'],
  recordIdsToRemove: [],
};

export const rejectedTokenResponse = {
  status: 'error',
  message: 'raw-body-sentinel',
  correlationId: 'corr-rejected-token',
  category: 'INVALID_AUTHENTICATION',
};

export const rateLimitBody = {
  recordIdsToAdd: ['51'],
  recordIdsToRemove: [],
};

export const rateLimitResponse = {
  status: 'error',
  message: 'raw-body-sentinel',
  correlationId: 'corr-rate-limit',
  category: 'RATE_LIMIT',
};

const put = (data: object) => ({
  url: membershipUrl,
  method: 'PUT',
  headers: authHeaders,
  data,
});

export const networkCallsData = [
  {
    httpReq: put(addSuccessBody),
    httpRes: { status: 200, data: addSuccessResponse },
  },
  {
    httpReq: put(missingAddBody),
    httpRes: { status: 200, data: missingAddResponse },
  },
  {
    httpReq: put(missingRemoveBody),
    httpRes: { status: 200, data: missingRemoveResponse },
  },
  {
    httpReq: put(rejectedTokenBody),
    httpRes: { status: 401, data: rejectedTokenResponse },
  },
  {
    httpReq: put(rateLimitBody),
    httpRes: { status: 429, data: rateLimitResponse },
  },
];
