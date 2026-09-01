import { endpoint } from './common';

export const partialBatchValidationRequest = {
  events: [
    {
      id: 'id',
      type: 'order_created',
      timestamp_ms: 1788152197000,
      data: {
        type: 'contents',
        amount: 2599,
        currency: 'USD',
        contents: [{ id: 'sku_123', name: 'Starter bundle', content_type: 'product', quantity: 1 }],
      },
    },
    {
      id: 'id',
      type: 'custom',
      custom_event_name: 'ccd',
      timestamp_ms: 1788152197000,
      data: {
        amount: 2599,
        currency: 'USD',
        contents: [{ id: 'sku_123', name: 'Starter bundle', content_type: 'product', quantity: 1 }],
      },
    },
  ],
};

export const partialBatchValidationResponse = {
  error: {
    message: 'Invalid event at events[1]. See errors for details.',
    type: 'invalid_request_error',
    param: 'events[1]',
    code: 'invalid_event',
    errors: [
      {
        message: 'events[1].data.type must be a supported data type.',
        param: 'events[1].data.type',
        code: 'missing_event_data_type',
      },
    ],
  },
};

export const staleTimestampRequest = {
  events: [
    {
      id: 'id',
      type: 'order_created',
      timestamp_ms: 178815219700,
      data: {
        type: 'contents',
        amount: 2599,
        currency: 'USD',
        contents: [{ id: 'sku_123', name: 'Starter bundle', content_type: 'product', quantity: 1 }],
      },
    },
  ],
};

export const staleTimestampResponse = {
  error: {
    message: 'event_timestamp_ms must be within the last 7 days.',
    type: 'invalid_request_error',
    param: 'events[0].timestamp_ms',
    code: 'event_timestamp_too_old',
    errors: [
      {
        message: 'event_timestamp_ms must be within the last 7 days.',
        param: 'events[0].timestamp_ms',
        code: 'event_timestamp_too_old',
      },
    ],
  },
};

export const invalidApiKeyRequest = {
  events: [{ ...staleTimestampRequest.events[0], id: 'invalid-api-key' }],
};
export const invalidApiKeyResponse = {
  error: {
    message: 'Unauthorized',
    type: 'invalid_request_error',
    param: null,
    code: null,
  },
};

export const invalidPixelIdRequest = {
  events: [{ ...staleTimestampRequest.events[0], id: 'invalid-pixel-id' }],
};
export const invalidPixelIdResponse = {
  error: {
    message: '403: unknown pid',
    type: 'server_error',
    param: null,
    code: null,
  },
};

export const missingPidRequest = {
  events: [{ ...staleTimestampRequest.events[0], id: 'missing-pid' }],
};
export const missingPidResponse = {
  error: {
    message: "[{'type': 'missing', 'loc': ('query', 'pid'), 'msg': 'Field required', 'input': None}]",
    type: 'invalid_request_error',
    param: null,
    code: null,
  },
};

const headers = { Authorization: 'Bearer test-api-key', 'Content-Type': 'application/json' };
const params = { pid: 'pixel-123' };

export const networkCallsData = [
  {
    description: 'OpenAI Ads partial-batch validation failure',
    httpReq: {
      method: 'POST',
      url: endpoint,
      headers,
      params,
      data: partialBatchValidationRequest,
    },
    httpRes: { data: partialBatchValidationResponse, status: 400 },
  },
  {
    description: 'OpenAI Ads stale timestamp validation failure',
    httpReq: {
      method: 'POST',
      url: endpoint,
      headers,
      params,
      data: staleTimestampRequest,
    },
    httpRes: { data: staleTimestampResponse, status: 422 },
  },
  {
    description: 'OpenAI Ads invalid apiKey',
    httpReq: {
      method: 'POST',
      url: endpoint,
      headers: { ...headers, Authorization: 'Bearer invalid-api-key' },
      params,
      data: invalidApiKeyRequest,
    },
    httpRes: { data: invalidApiKeyResponse, status: 401 },
  },
  {
    description: 'OpenAI Ads invalid pixelId',
    httpReq: {
      method: 'POST',
      url: endpoint,
      headers,
      params: { pid: 'invalid-pixel' },
      data: invalidPixelIdRequest,
    },
    httpRes: { data: invalidPixelIdResponse, status: 403 },
  },
  {
    description: 'OpenAI Ads missing pid',
    httpReq: {
      method: 'POST',
      url: endpoint,
      headers,
      params: {},
      data: missingPidRequest,
    },
    httpRes: { data: missingPidResponse, status: 400 },
  },
];
