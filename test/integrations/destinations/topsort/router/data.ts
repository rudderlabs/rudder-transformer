import type { RudderMessage } from '../../../../../src/types';
import { RouterTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import { destination, endpoint, endpointPath, headers, missingApiKeyDestination } from '../common';

const TIMESTAMP = '2024-11-05T15:19:08+00:00';

const products = [
  { product_id: 'product-a', price: 40, quantity: 2, position: 1 },
  { product_id: 'product-b', price: 5, quantity: 1, position: 2 },
];

const trackMessage = (
  event: string,
  messageId: string,
  properties: Record<string, unknown> = {},
): RudderMessage => ({
  type: 'track',
  event,
  messageId,
  anonymousId: 'anon-1',
  originalTimestamp: TIMESTAMP,
  context: { page: { path: '/category/123' } },
  properties: {
    product_id: 'product-top',
    price: 49.99,
    quantity: 5,
    position: 3,
    resolvedBidId: 'bid-1',
    pageSize: 15,
    category_id: 'category-1',
    entity: { id: '235', type: 'product' },
    ...properties,
  },
});

// Fields every Topsort event maps from the message itself (TopsortTrackConfig.json).
const baseEvent = {
  occurredAt: TIMESTAMP,
  opaqueUserId: 'anon-1',
  resolvedBidId: 'bid-1',
  entity: { id: '235', type: 'product' },
};

// Placement fields mapped from the message (TopsortPlacementConfig.json).
const placement = { path: '/category/123', pageSize: 15, categoryIds: ['category-1'] };

const batchedRequest = (json: Record<string, unknown>) => ({
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint,
  endpointPath,
  headers,
  params: {},
  body: { JSON: json, JSON_ARRAY: {}, XML: {}, FORM: {} },
  files: {},
});

const statTags = (errorCategory: string, errorType: string) => ({
  destType: 'TOPSORT',
  destinationId: 'default-destinationId',
  errorCategory,
  errorType,
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
});

export const data: RouterTestData[] = [
  {
    id: 'topsort-router-mixed-types',
    name: 'topsort',
    description: 'A click, an impression and a purchase are sent together in one request',
    scenario: 'Business',
    successCriteria:
      'One request carries the clicks, impressions and purchases arrays, each mapped from the single product in the top-level properties',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: trackMessage('Product Clicked', 'msg-1'),
              metadata: generateMetadata(1),
              destination,
            },
            {
              message: trackMessage('Product Viewed', 'msg-2'),
              metadata: generateMetadata(2),
              destination,
            },
            {
              message: trackMessage('Product Added', 'msg-3'),
              metadata: generateMetadata(3),
              destination,
            },
          ],
          destType: 'topsort',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: batchedRequest({
                impressions: [
                  {
                    ...baseEvent,
                    placement: { ...placement, position: 3, productId: 'product-top' },
                    id: 'msg-2',
                  },
                ],
                clicks: [
                  {
                    ...baseEvent,
                    placement: { ...placement, position: 3, productId: 'product-top' },
                    id: 'msg-1',
                  },
                ],
                purchases: [
                  {
                    ...baseEvent,
                    items: [{ productId: 'product-top', unitPrice: 49.99, quantity: 5 }],
                    id: 'msg-3',
                  },
                ],
              }),
              metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
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
    id: 'topsort-router-product-array-fan-out',
    name: 'topsort',
    description:
      'Impressions and clicks with a products array fan out to one event per product, with index-suffixed ids',
    scenario: 'Business',
    successCriteria:
      'Each product becomes its own event whose id is `<messageId>-<index>`, so retries resend the same ids',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: trackMessage('Checkout Started', 'msg-1', { products }),
              metadata: generateMetadata(1),
              destination,
            },
            {
              message: trackMessage('Order Refunded', 'msg-2', { products }),
              metadata: generateMetadata(2),
              destination,
            },
          ],
          destType: 'topsort',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: batchedRequest({
                impressions: [
                  {
                    ...baseEvent,
                    placement: { ...placement, position: 1, productId: 'product-a' },
                    id: 'msg-1-0',
                  },
                  {
                    ...baseEvent,
                    placement: { ...placement, position: 2, productId: 'product-b' },
                    id: 'msg-1-1',
                  },
                ],
                clicks: [
                  {
                    ...baseEvent,
                    placement: { ...placement, position: 1, productId: 'product-a' },
                    id: 'msg-2-0',
                  },
                  {
                    ...baseEvent,
                    placement: { ...placement, position: 2, productId: 'product-b' },
                    id: 'msg-2-1',
                  },
                ],
              }),
              metadata: [generateMetadata(1), generateMetadata(2)],
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
    id: 'topsort-router-purchase-items',
    name: 'topsort',
    description:
      'A purchase with a products array is one event carrying every product as an item; a non-ecommerce event ignores the array',
    scenario: 'Business',
    successCriteria:
      'Order Completed maps each product to an item; Product Added is not a product-array event, so it maps the top-level product',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: trackMessage('Order Completed', 'msg-1', { products }),
              metadata: generateMetadata(1),
              destination,
            },
            {
              message: trackMessage('Product Added', 'msg-2', { products }),
              metadata: generateMetadata(2),
              destination,
            },
          ],
          destType: 'topsort',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: batchedRequest({
                purchases: [
                  {
                    ...baseEvent,
                    items: [
                      { productId: 'product-a', unitPrice: 40, quantity: 2 },
                      { productId: 'product-b', unitPrice: 5, quantity: 1 },
                    ],
                    id: 'msg-1',
                  },
                  {
                    ...baseEvent,
                    items: [{ productId: 'product-top', unitPrice: 49.99, quantity: 5 }],
                    id: 'msg-2',
                  },
                ],
              }),
              metadata: [generateMetadata(1), generateMetadata(2)],
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
    id: 'topsort-router-invalid-events',
    name: 'topsort',
    description:
      'Invalid events fail on their own while the valid event in the same batch is still sent',
    scenario: 'Validation',
    successCriteria:
      'Non-track, unmapped, unsupported-type and missing-messageId events each return a 400; the valid click is delivered',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: trackMessage('Product Clicked', 'msg-1'),
              metadata: generateMetadata(1),
              destination,
            },
            {
              message: { ...trackMessage('Product Clicked', 'msg-2'), type: 'identify' },
              metadata: generateMetadata(2),
              destination,
            },
            {
              message: trackMessage('Order Updated2', 'msg-3'),
              metadata: generateMetadata(3),
              destination,
            },
            {
              message: trackMessage('Cart Viewed', 'msg-4'),
              metadata: generateMetadata(4),
              destination,
            },
            {
              message: { ...trackMessage('Product Clicked', 'msg-5'), messageId: undefined },
              metadata: generateMetadata(5),
              destination,
            },
          ],
          destType: 'topsort',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: batchedRequest({
                clicks: [
                  {
                    ...baseEvent,
                    placement: { ...placement, position: 3, productId: 'product-top' },
                    id: 'msg-1',
                  },
                ],
              }),
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 400,
              error: 'message: Only "track" events are supported. Dropping event.',
              destination,
              statTags: statTags('dataValidation', 'instrumentation'),
            },
            // Schema failures are reported before per-event transform failures.
            {
              metadata: [generateMetadata(5)],
              batched: false,
              statusCode: 400,
              error: 'message.messageId: Required',
              destination,
              statTags: statTags('dataValidation', 'instrumentation'),
            },
            {
              metadata: [generateMetadata(3)],
              batched: false,
              statusCode: 400,
              error: "Event 'order updated2' not found in Topsort event mappings",
              destination,
              statTags: statTags('dataValidation', 'configuration'),
            },
            {
              metadata: [generateMetadata(4)],
              batched: false,
              statusCode: 400,
              error: 'Event not mapped: bids',
              destination,
              statTags: statTags('dataValidation', 'instrumentation'),
            },
          ],
        },
      },
    },
  },
  {
    id: 'topsort-router-missing-api-key',
    name: 'topsort',
    description: 'An empty API key fails every event at validation, before any request is built',
    scenario: 'Validation',
    successCriteria: 'The event returns a 400 naming the apiKey config field',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: trackMessage('Product Clicked', 'msg-1'),
              metadata: generateMetadata(1),
              destination: missingApiKeyDestination,
            },
          ],
          destType: 'topsort',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error: 'destination.Config.apiKey: String must contain at least 1 character(s)',
              destination: missingApiKeyDestination,
              statTags: statTags('dataValidation', 'configuration'),
            },
          ],
        },
      },
    },
  },
];
