import sha256 from 'sha256';
import { RouterTestData } from '../../../testTypes';
import { destination, endpoint, metadata } from '../common';

const batchedRequest = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint,
  endpointPath: '/v1/events',
  headers: { Authorization: 'Bearer test-api-key', 'Content-Type': 'application/json' },
  params: { pid: 'pixel-123' },
  body: {
    JSON: {
      events: [
        {
          id: 'msg-1',
          type: 'contents_viewed',
          timestamp_ms: 1704067200000,
          action_source: 'offline',
          data: { type: 'contents' },
        },
        {
          id: 'msg-2',
          type: 'lead_created',
          timestamp_ms: 1704067201000,
          action_source: 'offline',
          data: { type: 'customer_action' },
        },
      ],
    },
    JSON_ARRAY: {},
    XML: {},
    FORM: {},
  },
  files: {},
};

export const data: RouterTestData[] = [
  {
    id: 'openai-ads-router-batching',
    name: 'openai_ads',
    description:
      'Batching Framework: mapped track events are batched into one OpenAI /v1/events request',
    scenario: 'Native batching cloud CAPI',
    successCriteria: 'Two compatible mapped events collapse into one request-level pid/auth group',
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
                event: 'Product Viewed',
                messageId: 'msg-1',
                timestamp: '2024-01-01T00:00:00.000Z',
                properties: {},
              },
              metadata: metadata(1),
              destination,
            },
            {
              message: {
                type: 'track',
                event: 'Lead Created',
                messageId: 'msg-2',
                timestamp: '2024-01-01T00:00:01.000Z',
                properties: {},
              },
              metadata: metadata(2),
              destination,
            },
          ],
          destType: 'openai_ads',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest,
              metadata: [metadata(1), metadata(2)],
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
    id: 'openai-ads-router-standard-pii-payload',
    name: 'openai_ads',
    description: 'Mapped track event builds an OpenAI event with hashed PII and raw match fields',
    scenario: 'Native batching cloud CAPI',
    successCriteria: 'User matching fields follow OpenAI hashing/plaintext rules',
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
                event: 'Product Viewed',
                messageId: 'msg-4',
                userId: 'User-4',
                timestamp: '2024-01-01T00:00:00.000Z',
                context: {
                  ip: '203.0.113.10',
                  userAgent: 'Mozilla/5.0',
                  traits: {
                    email: ' USER@EXAMPLE.COM ',
                    phone: '001 (555) 123-4567',
                    firstName: 'Jöhn!',
                    lastName: "O'Connor",
                    city: 'New York',
                    region: 'NY',
                    postalCode: '12345',
                    country: 'US',
                    obref: 'obref-value',
                  },
                  page: { url: 'https://example.com/path?secret=1#hash' },
                },
                properties: {
                  amount: '12.50',
                  currency: 'EUR',
                  action_source: 'web',
                  opt_out: true,
                  oppref: 'property-oppref',
                  products: [
                    {
                      product_id: 'sku-1',
                      name: 'Sample Product',
                      group_id: 'bundle-1',
                      variant_dict: { color: 'red' },
                      price: '10.25',
                      quantity: 2,
                    },
                  ],
                },
              },
              metadata: metadata(4),
              destination,
            },
          ],
          destType: 'openai_ads',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                ...batchedRequest,
                body: {
                  ...batchedRequest.body,
                  JSON: {
                    events: [
                      {
                        id: 'msg-4',
                        type: 'contents_viewed',
                        timestamp_ms: 1704067200000,
                        opt_out: true,
                        action_source: 'web',
                        source_url: 'https://example.com/path?secret=1#hash',
                        oppref: 'property-oppref',
                        user: {
                          obref: 'obref-value',
                          emails_sha256: [sha256('user@example.com')],
                          phone_numbers_sha256: [sha256('15551234567')],
                          external_ids_sha256: [sha256('user-4')],
                          first_names_sha256: [sha256('jöhn')],
                          last_names_sha256: [sha256('oconnor')],
                          regions: ['NY'],
                          postal_codes: ['12345'],
                          cities: ['New York'],
                          countries: ['US'],
                          ip_address: '203.0.113.10',
                          user_agent: 'Mozilla/5.0',
                        },
                        data: {
                          type: 'contents',
                          amount: 1250,
                          currency: 'EUR',
                          contents: [
                            {
                              id: 'sku-1',
                              name: 'Sample Product',
                              group_id: 'bundle-1',
                              variant_dict: { color: 'red' },
                              quantity: 2,
                              amount: 1025,
                              currency: 'EUR',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              },
              metadata: [metadata(4)],
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
    id: 'openai-ads-router-unmapped',
    name: 'openai_ads',
    description: 'Unmapped non-standard events fail before delivery',
    scenario: 'Event mapping validation',
    successCriteria: 'The event returns a per-event instrumentation error',
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
                event: 'Unknown Event',
                messageId: 'msg-3',
                timestamp: '2024-01-01T00:00:00.000Z',
                properties: {},
              },
              metadata: metadata(3),
              destination,
            },
          ],
          destType: 'openai_ads',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [metadata(3)],
              batched: false,
              statusCode: 400,
              error: 'OpenAI Ads event mapping not found for Unknown Event',
              destination,
              statTags: {
                destType: 'OPENAI_ADS',
                destinationId: 'openai-ads-dest-1',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-1',
              },
            },
          ],
        },
      },
    },
  },
];
