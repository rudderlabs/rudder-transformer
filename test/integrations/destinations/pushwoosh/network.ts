import {
  eventsEndpoint,
  eventsHeaders,
  pushwooshEvent,
  setTagsBody,
  setTagsEndpoint,
  setTagsHeaders,
} from './common';

// Request/response pairs captured against the live Pushwoosh API.
export const eventsBatchRequest = {
  events: [
    pushwooshEvent('user-1', { device_platform: 'android', device_id: 'device-1' }),
    pushwooshEvent('user-2'),
  ],
};
export const unauthorizedResponse = { message: 'unauthorized' };
export const applicationNotFoundResponse = { message: 'application not found' };
export const decodeFailureRequest = {
  events: [pushwooshEvent('user-1'), pushwooshEvent('user-2', { timestamp: 'bad' })],
};
export const decodeFailureResponse = {
  action: 'post event',
  status: 'failure',
  error: {
    message: 'parsing time "bad" as "2006-01-02T15:04:05Z07:00": cannot parse "bad" as "2006"',
  },
};

export const setTagsRequest = setTagsBody('user-1', { plan: 'pro' });
export const setTagsSuccessResponse = { status_code: 200, status_message: 'OK', response: {} };
export const invalidApplicationRequest = {
  request: { ...setTagsRequest.request, application: 'AAAAA-BBBBB' },
};
export const invalidApplicationResponse = {
  status_code: 210,
  status_message: 'application code is not valid',
  response: null,
};

export const networkCallsData = [
  {
    description: 'Pushwoosh post-events accepts a batch with an empty 200',
    httpReq: {
      method: 'POST',
      url: eventsEndpoint,
      headers: eventsHeaders,
      data: eventsBatchRequest,
    },
    httpRes: { status: 200, data: '' },
  },
  {
    description: 'Pushwoosh post-events rejects an API token that does not match the app code',
    httpReq: {
      method: 'POST',
      url: eventsEndpoint,
      headers: { ...eventsHeaders, Authorization: 'Token invalid-api-token' },
      data: eventsBatchRequest,
    },
    httpRes: { status: 401, data: unauthorizedResponse },
  },
  {
    description: 'Pushwoosh post-events rejects an unknown application code',
    httpReq: {
      method: 'POST',
      url: eventsEndpoint,
      headers: { ...eventsHeaders, 'X-PW-Appcode': 'AAAAA-BBBBB' },
      data: eventsBatchRequest,
    },
    httpRes: { status: 400, data: applicationNotFoundResponse },
  },
  {
    description: 'Pushwoosh post-events rejects the whole batch when one event fails to decode',
    httpReq: {
      method: 'POST',
      url: eventsEndpoint,
      headers: eventsHeaders,
      data: decodeFailureRequest,
    },
    httpRes: { status: 400, data: decodeFailureResponse },
  },
  {
    description: 'Pushwoosh setTags success',
    httpReq: {
      method: 'POST',
      url: setTagsEndpoint,
      headers: setTagsHeaders,
      data: setTagsRequest,
    },
    httpRes: { status: 200, data: setTagsSuccessResponse },
  },
  {
    description: 'Pushwoosh setTags rejects an unknown application code',
    httpReq: {
      method: 'POST',
      url: setTagsEndpoint,
      headers: setTagsHeaders,
      data: invalidApplicationRequest,
    },
    httpRes: { status: 400, data: invalidApplicationResponse },
  },
];
