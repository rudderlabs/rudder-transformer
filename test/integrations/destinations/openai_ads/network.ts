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
];
