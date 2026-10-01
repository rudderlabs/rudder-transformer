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
          custom_attributes: {
            currency: { code: 'USD' },
            conversiontype: 'purchase',
          },
        },
      },
    ],
  },
];
export const rejectedResponse = {
  errors: [
    {
      code: 'BAD_REQUEST',
      message:
        "Error reading string. Unexpected token: StartObject. Path 'data.custom_attributes.currency', line 1, position 314.",
    },
  ],
};
export const partialFailureRequest = [
  ...requestForCustomer('synthetic-customer-7', 'message-7'),
  {
    schema_version: 2,
    environment: 'production',
    user_identities: { customerid: 'synthetic-customer-8' },
    events: [
      {
        event_type: 'custom_event',
        data: {
          event_name: 'conversion',
          custom_event_type: 'transaction',
          timestamp_unixtime_ms: 1790640000000,
          source_message_id: 'message-8',
          custom_attributes: {
            currency: { code: 'USD' },
            conversiontype: 'purchase',
          },
        },
      },
    ],
  },
  ...requestForCustomer('synthetic-customer-9', 'message-9'),
];
export const partialFailureResponse = {
  errors: [
    {
      code: 'BAD_REQUEST',
      message:
        "Error reading string. Unexpected token: StartObject. Path 'data.custom_attributes.currency', line 1, position 648.",
    },
  ],
};
export const allInvalidRequest = [
  {
    schema_version: 2,
    environment: 'production',
    user_identities: { customerid: 'synthetic-customer-10' },
    device_info: { ios_advertising_id: 'not-a-guid' },
    events: [
      {
        event_type: 'custom_event',
        data: {
          event_name: 'conversion',
          custom_event_type: 'transaction',
          timestamp_unixtime_ms: 1790640000000,
          source_message_id: 'message-10',
          custom_attributes: { conversiontype: 'purchase' },
        },
      },
    ],
  },
  {
    schema_version: 2,
    environment: 'production',
    user_identities: { customerid: 'synthetic-customer-11' },
    events: [
      {
        event_type: 'custom_event',
        data: {
          event_name: 'conversion',
          custom_event_type: 'transaction',
          timestamp_unixtime_ms: 1790640000000,
          source_message_id: 'message-11',
          custom_attributes: {
            currency: { code: 'USD' },
            conversiontype: 'purchase',
          },
        },
      },
    ],
  },
];
export const allInvalidResponse = {
  errors: [
    {
      code: 'BAD_REQUEST',
      message:
        "Error converting value &quot;not-a-guid&quot; to type 'System.Guid'. Path '[0].device_info.ios_advertising_id', line 1, position 153.",
    },
    {
      code: 'BAD_REQUEST',
      message:
        "Error reading string. Unexpected token: StartObject. Path 'data.custom_attributes.currency', line 1, position 702.",
    },
  ],
};
export const completeFailureRequest = allInvalidRequest.map((batch, index) => ({
  ...batch,
  user_identities: { customerid: `synthetic-customer-${index + 13}` },
  events: batch.events.map((event) => ({
    ...event,
    data: { ...event.data, source_message_id: `message-${index + 13}` },
  })),
}));
export const completeFailureResponse = allInvalidResponse;
export const invalidCredentialsRequest = requestForCustomer('synthetic-customer-12', 'message-12');
export const missingCredentialsRequest = requestForCustomer('synthetic-customer-15', 'message-15');
export const headersWithoutCredentials = { 'Content-Type': 'application/json' };
export const unrecognizedErrorRequest = requestForCustomer('synthetic-customer-16', 'message-16');
export const unrecognizedErrorResponse = { unexpected: true };
export const throttledRequest = requestForCustomer('synthetic-customer-4');
export const retryableRequest = [
  ...requestForCustomer('synthetic-customer-5'),
  ...requestForCustomer('synthetic-customer-6'),
];

export const networkCallsData = [
  {
    description: 'Rokt accepts a ROKT bulk request',
    httpReq: { method: 'POST', url: endpoint, headers, data: acceptedRequest },
    httpRes: { data: '', status: 202 },
  },
  {
    description: 'Rokt rejects an object-valued currency attribute',
    httpReq: { method: 'POST', url: endpoint, headers, data: rejectedRequest },
    httpRes: {
      data: rejectedResponse,
      status: 400,
    },
  },
  {
    description: 'Rokt partially rejects a mixed-validity bulk request',
    httpReq: { method: 'POST', url: endpoint, headers, data: partialFailureRequest },
    httpRes: {
      data: partialFailureResponse,
      status: 202,
    },
  },
  {
    description: 'Rokt rejects every batch in an invalid bulk request',
    httpReq: { method: 'POST', url: endpoint, headers, data: allInvalidRequest },
    httpRes: {
      data: allInvalidResponse,
      status: 400,
    },
  },
  {
    description: 'Rokt reports every batch as failed in an HTTP 202 response',
    httpReq: { method: 'POST', url: endpoint, headers, data: completeFailureRequest },
    httpRes: {
      data: completeFailureResponse,
      status: 202,
    },
  },
  {
    description: 'Rokt rejects invalid credentials with an empty response',
    httpReq: { method: 'POST', url: endpoint, headers, data: invalidCredentialsRequest },
    httpRes: { data: '', status: 403 },
  },
  {
    description: 'Rokt rejects requests without credentials with an empty response',
    httpReq: {
      method: 'POST',
      url: endpoint,
      headers: headersWithoutCredentials,
      data: missingCredentialsRequest,
    },
    httpRes: { data: '', status: 401 },
  },
  {
    description: 'Rokt returns an unrecognized error response',
    httpReq: { method: 'POST', url: endpoint, headers, data: unrecognizedErrorRequest },
    httpRes: { data: unrecognizedErrorResponse, status: 400 },
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
