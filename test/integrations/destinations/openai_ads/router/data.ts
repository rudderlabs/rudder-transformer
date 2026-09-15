import sha256 from 'sha256';
import { RouterTestData } from '../../../testTypes';
import { destination, endpoint, metadata, pageScreenTypeMappingDestination } from '../common';

// OpenAI only ingests events from the last 7 days, so these are stamped relative to now rather
// than at a fixed date that would age out of the window.
const EVENT_TIMESTAMP = new Date(Date.now() - 60_000).toISOString();
const EVENT_TIMESTAMP_MS = new Date(EVENT_TIMESTAMP).getTime();
const EVENT_TIMESTAMP_NEXT = new Date(EVENT_TIMESTAMP_MS + 1000).toISOString();
const EVENT_TIMESTAMP_NEXT_MS = EVENT_TIMESTAMP_MS + 1000;

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
          timestamp_ms: EVENT_TIMESTAMP_MS,
          action_source: 'offline',
          data: { type: 'contents' },
        },
        {
          id: 'msg-2',
          type: 'lead_created',
          timestamp_ms: EVENT_TIMESTAMP_NEXT_MS,
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
                timestamp: EVENT_TIMESTAMP,
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
                timestamp: EVENT_TIMESTAMP_NEXT,
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
    id: 'openai-ads-router-page-screen-fallbacks',
    name: 'openai_ads',
    description:
      'Page and screen events preserve mappings and fall back to page_viewed when unmapped',
    scenario: 'Event mapping validation',
    successCriteria:
      'Mapped page names keep their configured OpenAI event while unmapped page/screen names become page_viewed',
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
                type: 'page',
                name: 'Product Viewed',
                messageId: 'msg-8',
                timestamp: EVENT_TIMESTAMP,
                properties: {},
              },
              metadata: metadata(8),
              destination,
            },
            {
              message: {
                type: 'page',
                name: 'Unmapped Marketing Page',
                messageId: 'msg-9',
                timestamp: EVENT_TIMESTAMP,
                properties: {},
              },
              metadata: metadata(9),
              destination,
            },
            {
              message: {
                type: 'page',
                messageId: 'msg-10',
                timestamp: EVENT_TIMESTAMP,
                properties: {},
              },
              metadata: metadata(10),
              destination,
            },
            {
              message: {
                type: 'screen',
                name: 'Unmapped Onboarding Screen',
                messageId: 'msg-11',
                timestamp: EVENT_TIMESTAMP,
                properties: {},
              },
              metadata: metadata(11),
              destination,
            },
            {
              message: {
                type: 'screen',
                messageId: 'msg-12',
                timestamp: EVENT_TIMESTAMP,
                properties: {},
              },
              metadata: metadata(12),
              destination,
            },
            {
              message: {
                type: 'screen',
                name: 'page_viewed',
                messageId: 'msg-13',
                timestamp: EVENT_TIMESTAMP,
                properties: {},
              },
              metadata: metadata(13),
              destination,
            },
            {
              message: {
                type: 'page',
                name: 'lead_created',
                messageId: 'msg-14',
                timestamp: EVENT_TIMESTAMP,
                properties: {},
              },
              metadata: metadata(14),
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
                        id: 'msg-8',
                        type: 'contents_viewed',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        data: { type: 'contents' },
                      },
                      {
                        id: 'msg-9',
                        type: 'page_viewed',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        data: { type: 'contents' },
                      },
                      {
                        id: 'msg-10',
                        type: 'page_viewed',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        data: { type: 'contents' },
                      },
                      {
                        id: 'msg-11',
                        type: 'page_viewed',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        data: { type: 'contents' },
                      },
                      {
                        id: 'msg-12',
                        type: 'page_viewed',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        data: { type: 'contents' },
                      },
                      {
                        id: 'msg-13',
                        type: 'page_viewed',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        data: { type: 'contents' },
                      },
                      {
                        id: 'msg-14',
                        type: 'lead_created',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        data: { type: 'customer_action' },
                      },
                    ],
                  },
                },
              },
              metadata: [
                metadata(8),
                metadata(9),
                metadata(10),
                metadata(11),
                metadata(12),
                metadata(13),
                metadata(14),
              ],
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
    id: 'openai-ads-router-unnamed-page-screen-type-mapping-fallbacks',
    name: 'openai_ads',
    description:
      'Unnamed page and screen events ignore synthetic page/screen mapping keys and fall back to page_viewed',
    scenario: 'Event mapping validation',
    successCriteria:
      'Synthetic page/screen source keys are not used for eventMapping lookups when message.name is absent',
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
                type: 'page',
                messageId: 'msg-15',
                timestamp: EVENT_TIMESTAMP,
                properties: {},
              },
              metadata: metadata(15),
              destination: pageScreenTypeMappingDestination,
            },
            {
              message: {
                type: 'screen',
                messageId: 'msg-16',
                timestamp: EVENT_TIMESTAMP,
                properties: {},
              },
              metadata: metadata(16),
              destination: pageScreenTypeMappingDestination,
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
                        id: 'msg-15',
                        type: 'page_viewed',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        data: { type: 'contents' },
                      },
                      {
                        id: 'msg-16',
                        type: 'page_viewed',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        data: { type: 'contents' },
                      },
                    ],
                  },
                },
              },
              metadata: [metadata(15), metadata(16)],
              batched: true,
              statusCode: 200,
              destination: pageScreenTypeMappingDestination,
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
                timestamp: EVENT_TIMESTAMP,
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
                    {
                      product_id: 'sku-no-amount',
                      currency: 'US',
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
                        timestamp_ms: EVENT_TIMESTAMP_MS,
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
                            {
                              id: 'sku-no-amount',
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
    id: 'openai-ads-router-anonymous-id-fallback',
    name: 'openai_ads',
    description: 'Mapped track event uses anonymousId as external_ids_sha256 fallback',
    scenario: 'Native batching cloud CAPI',
    successCriteria: 'external_ids_sha256 is hashed from anonymousId when userId is absent',
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
                messageId: 'msg-6',
                anonymousId: 'Anon-Only-6',
                timestamp: EVENT_TIMESTAMP,
                properties: {},
              },
              metadata: metadata(6),
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
                        id: 'msg-6',
                        type: 'contents_viewed',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        user: {
                          external_ids_sha256: [sha256('anon-only-6')],
                        },
                        data: { type: 'contents' },
                      },
                    ],
                  },
                },
              },
              metadata: [metadata(6)],
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
    id: 'openai-ads-router-no-external-id-source',
    name: 'openai_ads',
    description: 'Mapped track event ignores trait external IDs for external_ids_sha256',
    scenario: 'Native batching cloud CAPI',
    successCriteria: 'external_ids_sha256 is omitted unless userId or anonymousId is present',
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
                messageId: 'msg-7',
                timestamp: EVENT_TIMESTAMP,
                context: {
                  traits: {
                    email: 'match@example.com',
                    externalId: 'Trait-External-7',
                    external_ids: ['Trait-External-Ids-7'],
                  },
                },
                properties: {},
              },
              metadata: metadata(7),
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
                        id: 'msg-7',
                        type: 'contents_viewed',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        user: {
                          emails_sha256: [sha256('match@example.com')],
                        },
                        data: { type: 'contents' },
                      },
                    ],
                  },
                },
              },
              metadata: [metadata(7)],
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
    id: 'openai-ads-router-custom-extras',
    name: 'openai_ads',
    description: 'Mapped custom event preserves unmapped custom properties',
    scenario: 'Native batching cloud CAPI',
    successCriteria: 'Custom event properties id and name are not over-reserved',
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
                event: 'Custom Checkout Data',
                messageId: 'msg-5',
                timestamp: EVENT_TIMESTAMP,
                properties: {
                  id: 'custom-id',
                  name: 'Custom Name',
                  click_id: 'click-123',
                  source_url: 'https://example.com/custom',
                },
              },
              metadata: metadata(5),
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
                        id: 'msg-5',
                        type: 'custom',
                        custom_event_name: 'ccd',
                        timestamp_ms: EVENT_TIMESTAMP_MS,
                        action_source: 'offline',
                        source_url: 'https://example.com/custom',
                        data: {
                          type: 'custom',
                          id: 'custom-id',
                          name: 'Custom Name',
                          click_id: 'click-123',
                        },
                      },
                    ],
                  },
                },
              },
              metadata: [metadata(5)],
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
                timestamp: EVENT_TIMESTAMP,
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
