import { deliveryHeaders, endpoint } from './common';

export const acceptedRequest = [
  {
    schema_version: 2,
    environment: 'production',
    user_identities: { customerid: 'synthetic-customer-1' },
    events: [
      {
        event_type: 'custom_event',
        data: {
          event_name: 'conversion',
          custom_event_type: 'transaction',
          timestamp_unixtime_ms: 1790640000000,
          source_message_id: 'message-1',
          custom_attributes: { conversiontype: 'purchase' },
        },
      },
    ],
  },
];

export const rejectedRequest = [
  {
    schema_version: 2,
    environment: 'production',
    user_identities: { customerid: 'synthetic-customer-2' },
    events: [
      {
        event_type: 'custom_event',
        data: {
          event_name: 'conversion',
          custom_event_type: 'transaction',
          timestamp_unixtime_ms: 1790640000000,
          source_message_id: 'message-2',
          custom_attributes: { conversiontype: 'purchase' },
        },
      },
    ],
  },
];

const requestForCustomer = (customerid: string) => [
  {
    ...acceptedRequest[0],
    user_identities: { customerid },
  },
];

export const unexpectedSuccessRequest = requestForCustomer('synthetic-customer-3');
export const throttledRequest = requestForCustomer('synthetic-customer-4');
export const retryableRequest = [
  ...requestForCustomer('synthetic-customer-5'),
  ...requestForCustomer('synthetic-customer-6'),
];

export const networkCallsData = [
  {
    description: 'mParticle accepts a ROKT bulk request',
    httpReq: { method: 'POST', url: endpoint, headers: deliveryHeaders, data: acceptedRequest },
    httpRes: { data: {}, status: 202 },
  },
  {
    description: 'mParticle rejects a ROKT bulk request with an unsafe response body',
    httpReq: { method: 'POST', url: endpoint, headers: deliveryHeaders, data: rejectedRequest },
    httpRes: {
      data: { message: 'unsafe echoed value synthetic-customer-2' },
      status: 400,
    },
  },
  {
    description: 'mParticle returns an undocumented HTTP 200 for a ROKT bulk request',
    httpReq: {
      method: 'POST',
      url: endpoint,
      headers: deliveryHeaders,
      data: unexpectedSuccessRequest,
    },
    httpRes: { data: {}, status: 200 },
  },
  {
    description: 'mParticle throttles a ROKT bulk request',
    httpReq: { method: 'POST', url: endpoint, headers: deliveryHeaders, data: throttledRequest },
    httpRes: { data: {}, status: 429 },
  },
  {
    description: 'mParticle returns a server error for a ROKT bulk request',
    httpReq: {
      method: 'POST',
      url: endpoint,
      headers: deliveryHeaders,
      data: retryableRequest,
    },
    httpRes: { data: null, status: 503 },
  },
];
