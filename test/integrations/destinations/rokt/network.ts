import { endpoint, headers } from './common';

const requestForCustomer = (customerid: string, messageId = 'message-1') => [
  {
    schema_version: 2,
    environment: 'production',
    user_identities: { customerid },
    events: [
      {
        event_type: 'custom_event',
        data: {
          event_name: 'conversion',
          custom_event_type: 'transaction',
          timestamp_unixtime_ms: 1790640000000,
          source_message_id: messageId,
          custom_attributes: { conversiontype: 'purchase' },
        },
      },
    ],
  },
];

export const acceptedRequest = requestForCustomer('synthetic-customer-1');
export const rejectedRequest = requestForCustomer('synthetic-customer-2', 'message-2');
export const unexpectedSuccessRequest = requestForCustomer('synthetic-customer-3');
export const throttledRequest = requestForCustomer('synthetic-customer-4');
export const retryableRequest = [
  ...requestForCustomer('synthetic-customer-5'),
  ...requestForCustomer('synthetic-customer-6'),
];

export const networkCallsData = [
  {
    description: 'Rokt accepts a ROKT bulk request',
    httpReq: { method: 'POST', url: endpoint, headers, data: acceptedRequest },
    httpRes: { data: {}, status: 202 },
  },
  {
    description: 'Rokt rejects a ROKT bulk request with an unsafe response body',
    httpReq: { method: 'POST', url: endpoint, headers, data: rejectedRequest },
    httpRes: {
      data: { message: 'unsafe echoed value synthetic-customer-2' },
      status: 400,
    },
  },
  {
    description: 'Rokt returns an undocumented HTTP 200 for a ROKT bulk request',
    httpReq: {
      method: 'POST',
      url: endpoint,
      headers,
      data: unexpectedSuccessRequest,
    },
    httpRes: { data: {}, status: 200 },
  },
  {
    description: 'Rokt throttles a ROKT bulk request',
    httpReq: { method: 'POST', url: endpoint, headers, data: throttledRequest },
    httpRes: { data: {}, status: 429 },
  },
  {
    description: 'Rokt returns a server error for a ROKT bulk request',
    httpReq: {
      method: 'POST',
      url: endpoint,
      headers,
      data: retryableRequest,
    },
    httpRes: { data: null, status: 503 },
  },
];
