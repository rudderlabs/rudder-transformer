import { authHeader1, secret1 } from '../maskedSecrets';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedTrackPayload,
  transformResultBuilder,
} from '../../../testUtils';
import { defaultMockFns } from '../mocks';

const destination: Destination = {
  ID: '123',
  Name: 'topsort',
  DestinationDefinition: {
    ID: '123',
    Name: 'topsort',
    DisplayName: 'topsort',
    Config: {
      endpoint: 'https://api.topsort.com/v2/events', // Base URL for Topsort API
    },
  },
  Config: {
    apiKey: secret1,
    connectionMode: {
      web: 'cloud',
    },
    consentManagement: {},
    oneTrustCookieCategories: {},
    ketchConsentPurposes: {},
    topsortEvents: [
      {
        from: 'Product Clicked',
        to: 'clicks',
      },
      {
        from: 'Order Completed',
        to: 'clicks',
      },
      {
        from: 'Order Refunded',
        to: 'clicks',
      },
    ],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

export const trackClicksTestData: ProcessorTestData[] = [
  {
    id: 'Test 0',
    name: 'topsort',
    description:
      'Verifies that a Product Clicked event with all necessary properties is successfully processed and mapped correctly by Topsort.',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200 and correctly map the properties to the specified parameters.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'Product Clicked', // The RudderStack event
              originalTimestamp: '2024-11-05T15:19:08+00:00',
              messageId: 'test-msg-id',
              properties: {
                product_id: '622c6f5d5cf86a4c77358033',
                price: 49.99,
                quantity: 5,
                position: 1,
                resolvedBidId: '13841873482r7903r823',
                page: 1,
                pageSize: 15,
                category_id: '9BLIe',
                url: 'https://www.website.com/product/path',
                additionalAttribution: {
                  id: 'a13362',
                  type: 'product',
                },
                entity: {
                  id: '235',
                  type: 'product',
                },
              },
              context: {
                page: {
                  path: '/categories/dairy',
                },
              },
              anonymousId: 'david_bowie_anonId',
            }),
            metadata: generateMetadata(1),
            destination,
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://api.topsort.com/v2/events',
              headers: {
                'content-type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              userId: '',
              JSON: {
                impressions: [],
                clicks: [
                  {
                    occurredAt: '2024-11-05T15:19:08+00:00',
                    opaqueUserId: 'david_bowie_anonId',
                    resolvedBidId: '13841873482r7903r823',
                    entity: {
                      id: '235',
                      type: 'product',
                    },
                    additionalAttribution: {
                      id: 'a13362',
                      type: 'product',
                    },
                    placement: {
                      path: '/categories/dairy',
                      pageSize: 15,
                      categoryIds: ['9BLIe'],
                      position: 1,
                      productId: '622c6f5d5cf86a4c77358033',
                    },
                    id: 'test-msg-id',
                  },
                ],
                purchases: [],
              },
              JSON_ARRAY: {},
              XML: {},
              FORM: {},
            }),
            metadata: generateMetadata(1),
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'Test 1',
    name: 'topsort',
    description:
      'Validates the correct processing and mapping of an Order Completed event with multiple products.',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200 and correctly map the properties to the specified parameters.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'Order Completed', // The RudderStack event
              originalTimestamp: '2024-11-05T15:19:08+00:00',
              messageId: 'test-msg-id',
              properties: {
                product_id: '622c6f5d5cf86a4c77358033',
                price: 49.99,
                quantity: 5,
                position: 1,
                resolvedBidId: '13841873482r7903r823',
                page: 1,
                pageSize: 15,
                category_id: '9BLIe',
                url: 'https://www.website.com/product/path',
                additionalAttribution: {
                  id: 'a13362',
                  type: 'product',
                },
                entity: {
                  id: '235',
                  type: 'product',
                },
                products: [
                  {
                    product_id: '622c6f5d5cf86a4c77358033',
                    sku: '8472-998-0112',
                    price: 40,
                    position: 1,
                  },
                  {
                    product_id: '577c6f5d5cf86a4c7735ba03',
                    sku: '3309-483-2201',
                    price: 5,
                    position: 2,
                  },
                ],
              },
              context: {
                page: {
                  path: '/categories/dairy',
                },
              },
              anonymousId: 'david_bowie_anonId',
            }),
            metadata: generateMetadata(1),
            destination,
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://api.topsort.com/v2/events',
              headers: {
                'content-type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              userId: '',
              JSON: {
                impressions: [],
                clicks: [
                  {
                    occurredAt: '2024-11-05T15:19:08+00:00',
                    opaqueUserId: 'david_bowie_anonId',
                    resolvedBidId: '13841873482r7903r823',
                    entity: {
                      id: '235',
                      type: 'product',
                    },
                    additionalAttribution: {
                      id: 'a13362',
                      type: 'product',
                    },
                    placement: {
                      path: '/categories/dairy',
                      pageSize: 15,
                      categoryIds: ['9BLIe'],
                      position: 1,
                      productId: '622c6f5d5cf86a4c77358033',
                    },
                    id: 'test-id-123-123-123',
                  },
                  {
                    occurredAt: '2024-11-05T15:19:08+00:00',
                    opaqueUserId: 'david_bowie_anonId',
                    resolvedBidId: '13841873482r7903r823',
                    entity: {
                      id: '235',
                      type: 'product',
                    },
                    additionalAttribution: {
                      id: 'a13362',
                      type: 'product',
                    },
                    placement: {
                      path: '/categories/dairy',
                      pageSize: 15,
                      categoryIds: ['9BLIe'],
                      position: 2,
                      productId: '577c6f5d5cf86a4c7735ba03',
                    },
                    id: 'test-id-123-123-123',
                  },
                ],
                purchases: [],
              },
              JSON_ARRAY: {},
              XML: {},
              FORM: {},
            }),
            metadata: generateMetadata(1),
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'Test 2',
    name: 'topsort',
    description:
      'Tests the handling of an invalid event type (abc) and ensures that Topsort correctly drops the event with a 400 error indicating unsupported event type.',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200 and correctly map the properties to the specified parameters.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'abc',
              event: 'Order Refunded', // The RudderStack event
              originalTimestamp: '2024-11-05T15:19:08+00:00',
              messageId: 'test-msg-id',
              properties: {
                product_id: '622c6f5d5cf86a4c77358033',
                price: 49.99,
                quantity: 5,
                position: 1,
                resolvedBidId: '13841873482r7903r823',
                page: 1,
                pageSize: 15,
                category_id: '9BLIe',
                url: 'https://www.website.com/product/path',
                additionalAttribution: {
                  id: 'a13362',
                  type: 'product',
                },
                entity: {
                  id: '235',
                  type: 'product',
                },
                products: [
                  {
                    product_id: '622c6f5d5cf86a4c77358033',
                    sku: '8472-998-0112',
                    price: 40,
                    position: 1,
                  },
                  {
                    product_id: '577c6f5d5cf86a4c7735ba03',
                    sku: '3309-483-2201',
                    price: 5,
                    position: 2,
                  },
                ],
              },
              context: {
                page: {
                  path: '/categories/dairy',
                },
              },
              anonymousId: 'david_bowie_anonId',
            },
            metadata: generateMetadata(1),
            destination,
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Only "track" events are supported. Dropping event.',
            statTags: {
              destType: 'TOPSORT',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            metadata: generateMetadata(1),
            statusCode: 400,
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'Test 3',
    name: 'topsort',
    description:
      'Verifies the correct processing of an Order Completed event with multiple products and handles an error for an unrecognized Order Updated2 event in Topsort.',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200 and correctly map the properties to the specified parameters.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'Order Completed', // The RudderStack event
              originalTimestamp: '2024-11-05T15:19:08+00:00',
              messageId: 'test-msg-id',
              properties: {
                product_id: '622c6f5d5cf86a4c77358033',
                price: 49.99,
                quantity: 5,
                position: 1,
                resolvedBidId: '13841873482r7903r823',
                page: 1,
                pageSize: 15,
                category_id: '9BLIe',
                url: 'https://www.website.com/product/path',
                additionalAttribution: {
                  id: 'a13362',
                  type: 'product',
                },
                entity: {
                  id: '235',
                  type: 'product',
                },
                products: [
                  {
                    product_id: '622c6f5d5cf86a4c77358033',
                    sku: '8472-998-0112',
                    price: 40,
                    position: 1,
                  },
                  {
                    product_id: '577c6f5d5cf86a4c7735ba03',
                    sku: '3309-483-2201',
                    price: 5,
                    position: 2,
                  },
                ],
              },
              context: {
                page: {
                  path: '/categories/dairy',
                },
              },
              anonymousId: 'david_bowie_anonId',
            }),
            metadata: generateMetadata(1),
            destination,
          },
          {
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'Order Updated2',
              originalTimestamp: '2024-11-05T15:19:08+00:00',
              messageId: 'test-msg-id',
              properties: {
                product_id: '622c6f5d5cf86a4c77358033',
                price: 49.99,
                quantity: 5,
                position: 1,
                resolvedBidId: '13841873482r7903r823',
                products: [
                  {
                    product_id: '622c6f5d5cf86a4c77358033',
                    sku: '8472-998-0112',
                    price: 40,
                    position: 1,
                  },
                ],
              },
              context: {
                page: {
                  path: '/categories/dairy',
                },
              },
              anonymousId: 'david_bowie_anonId',
            }),
            metadata: generateMetadata(1),
            destination,
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://api.topsort.com/v2/events',
              headers: {
                'content-type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              userId: '',
              JSON: {
                impressions: [],
                clicks: [
                  {
                    occurredAt: '2024-11-05T15:19:08+00:00',
                    opaqueUserId: 'david_bowie_anonId',
                    resolvedBidId: '13841873482r7903r823',
                    entity: {
                      id: '235',
                      type: 'product',
                    },
                    additionalAttribution: {
                      id: 'a13362',
                      type: 'product',
                    },
                    placement: {
                      path: '/categories/dairy',
                      pageSize: 15,
                      categoryIds: ['9BLIe'],
                      position: 1,
                      productId: '622c6f5d5cf86a4c77358033',
                    },
                    id: 'test-id-123-123-123',
                  },
                  {
                    occurredAt: '2024-11-05T15:19:08+00:00',
                    opaqueUserId: 'david_bowie_anonId',
                    resolvedBidId: '13841873482r7903r823',
                    entity: {
                      id: '235',
                      type: 'product',
                    },
                    additionalAttribution: {
                      id: 'a13362',
                      type: 'product',
                    },
                    placement: {
                      path: '/categories/dairy',
                      pageSize: 15,
                      categoryIds: ['9BLIe'],
                      position: 2,
                      productId: '577c6f5d5cf86a4c7735ba03',
                    },
                    id: 'test-id-123-123-123',
                  },
                ],
                purchases: [],
              },
              JSON_ARRAY: {},
              XML: {},
              FORM: {},
            }),
            metadata: generateMetadata(1),
            statusCode: 200,
          },
          {
            error: "Event 'order updated2' not found in Topsort event mappings",
            statTags: {
              destType: 'TOPSORT',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            metadata: generateMetadata(1),
            statusCode: 400,
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
];
