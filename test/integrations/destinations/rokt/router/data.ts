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
          conversiontype: 'purchase',
        },
      },
    },
  ],
};

const pageBatch = {
  schema_version: 2,
  environment: 'production',
  user_identities: { other2: 'synthetic-page-click' },
  integration_attributes: {
    '1277': { passbackconversiontrackingid: 'synthetic-page-click' },
  },
  events: [
    {
      event_type: 'custom_event',
      data: {
        event_name: 'conversion',
        custom_event_type: 'transaction',
        timestamp_unixtime_ms: timestampMs,
        source_message_id: 'message-2',
        custom_attributes: { screen_name: '/landing', conversiontype: 'screen_view' },
      },
    },
  ],
};

const identifyBatch = {
  schema_version: 2,
  environment: 'production',
  user_identities: { customerid: 'synthetic-identify-3' },
  user_attributes: { firstname: 'Identify' },
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
    description: 'ROKT maps conversions and identify updates into Rokt per-user batches',
    scenario: 'Native JSON-array batching',
    successCriteria:
      'Track, click-only page, and identify messages produce one bulk request without merging per-user batches',
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
            {
              message: {
                type: 'page',
                messageId: 'message-2',
                timestamp,
                context: {
                  page: { path: '/landing', search: '?rtid=synthetic-page-click' },
                },
                properties: {},
              },
              metadata: metadata(2),
              destination,
            },
            {
              message: {
                type: 'identify',
                messageId: 'message-3',
                userId: 'synthetic-identify-3',
                traits: { firstName: 'Identify' },
              },
              metadata: metadata(3),
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
              batchedRequest: batchedRequest([trackBatch, pageBatch, identifyBatch]),
              metadata: [metadata(1), metadata(2), metadata(3)],
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
    description: 'ROKT rejects unsupported and identity-free conversion events',
    scenario: 'Instrumentation validation',
    successCriteria: 'Invalid messages produce deterministic errors and no outbound request',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: { type: 'group', messageId: 'message-4' },
              metadata: metadata(4),
              destination,
            },
            {
              message: {
                type: 'track',
                event: 'purchase',
                messageId: 'message-5',
                timestamp,
                properties: {},
              },
              metadata: metadata(5),
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
              metadata: [metadata(4)],
              destination,
              batched: false,
              statusCode: 400,
              error:
                'message.type: Unsupported message type. ROKT supports track, page, screen, and identify.',
              statTags: errorStatTags,
            },
            {
              metadata: [metadata(5)],
              destination,
              batched: false,
              statusCode: 400,
              error: 'ROKT conversion requires at least one supported identity signal',
              statTags: errorStatTags,
            },
          ],
        },
      },
    },
  },
];
