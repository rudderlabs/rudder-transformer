import type { RouterTestData } from '../../../testTypes';
import { destination, endpoint, headers, metadata } from '../common';

const timestamp = '2026-09-29T00:00:00.000Z';
const timestampMs = 1790640000000;

const trackBatch = {
  schema_version: 2,
  environment: 'production',
  user_identities: {
    email: 'synthetic@example.test',
    customerid: 'synthetic-customer-1',
    other2: 'synthetic-click-1',
  },
  ip: '198.51.100.10',
  user_attributes: {
    firstname: 'Synthetic',
    dob: '20000102',
  },
  device_info: {
    http_header_user_agent: 'synthetic-agent',
    ios_advertising_id: 'synthetic-ios-ad-id',
  },
  integration_attributes: {
    '1277': { passbackconversiontrackingid: 'synthetic-click-1' },
  },
  events: [
    {
      event_type: 'custom_event',
      data: {
        event_name: 'conversion',
        custom_event_type: 'transaction',
        timestamp_unixtime_ms: timestampMs,
        source_message_id: 'message-1',
        custom_attributes: {
          confirmationref: 'synthetic-order-1',
          amount: '25.5',
          currency: 'USD',
          screen_name: '/checkout',
          url: 'https://example.test/checkout',
          conversiontype: 'mapped-purchase',
        },
      },
    },
  ],
};

const identityFreeBatch = {
  schema_version: 2,
  environment: 'production',
  user_identities: {},
  events: [
    {
      event_type: 'custom_event',
      data: {
        event_name: 'conversion',
        custom_event_type: 'transaction',
        timestamp_unixtime_ms: timestampMs,
        source_message_id: 'message-6',
        custom_attributes: { conversiontype: 'mapped-purchase' },
      },
    },
  ],
};

const errorStatTags = {
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  destType: 'ROKT',
  destinationId: 'rokt-dest-1',
  workspaceId: 'ws-1',
  module: 'destination',
  implementation: 'native',
  feature: 'router',
};

const batchedRequest = (batches: Record<string, unknown>[]) => ({
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint,
  endpointPath: '/v2/bulkevents',
  headers,
  params: {},
  body: {
    JSON: {},
    JSON_ARRAY: { batch: JSON.stringify(batches) },
    XML: {},
    FORM: {},
  },
  files: {},
});

export const data: RouterTestData[] = [
  {
    id: 'rokt-router-supported-events',
    name: 'rokt',
    description: 'ROKT maps configured track conversions into Rokt per-user batches',
    scenario: 'Native JSON-array batching',
    successCriteria: 'Mapped track messages produce a bulk request with traits and device context',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'purchase',
                messageId: 'message-1',
                userId: 'synthetic-customer-1',
                timestamp,
                context: {
                  ip: '198.51.100.10',
                  userAgent: 'synthetic-agent',
                  device: { type: 'ios', advertisingId: 'synthetic-ios-ad-id' },
                  traits: {
                    email: ' SYNTHETIC@EXAMPLE.TEST ',
                    firstName: 'Synthetic',
                    birthday: '2000-01-02',
                  },
                  page: { path: '/checkout', url: 'https://example.test/checkout' },
                },
                properties: {
                  roktClickId: 'synthetic-click-1',
                  orderId: 'synthetic-order-1',
                  amount: 25.5,
                  currency: 'USD',
                },
              },
              metadata: metadata(1),
              destination,
            },
          ],
          destType: 'rokt',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: batchedRequest([trackBatch]),
              metadata: [metadata(1)],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'rokt-router-invalid-conversion',
    name: 'rokt',
    description: 'ROKT rejects unsupported messages and unmapped track events',
    scenario: 'Instrumentation validation',
    successCriteria: 'Only mapped track messages are delivered',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: { type: 'page', event: 'purchase', messageId: 'message-4' },
              metadata: metadata(4),
              destination,
            },
            {
              message: {
                type: 'track',
                event: 'unmapped',
                messageId: 'message-5',
                timestamp,
                properties: {},
              },
              metadata: metadata(5),
              destination,
            },
            {
              message: {
                type: 'track',
                event: 'purchase',
                messageId: 'message-6',
                timestamp,
                properties: {},
              },
              metadata: metadata(6),
              destination,
            },
          ],
          destType: 'rokt',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: batchedRequest([identityFreeBatch]),
              metadata: [metadata(6)],
              destination,
              batched: true,
              statusCode: 200,
            },
            {
              metadata: [metadata(4)],
              destination,
              batched: false,
              statusCode: 400,
              error: 'message.type: Unsupported message type. ROKT supports track.',
              statTags: errorStatTags,
            },
            {
              metadata: [metadata(5)],
              destination,
              batched: false,
              statusCode: 400,
              error:
                'Event "unmapped" is not present in the Rokt events mapping. Dropping the event.',
              statTags: errorStatTags,
            },
          ],
        },
      },
    },
  },
];
