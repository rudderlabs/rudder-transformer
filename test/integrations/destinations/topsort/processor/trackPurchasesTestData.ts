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
    apiKey: 'test-api',
    connectionMode: {
      web: 'cloud',
    },
    consentManagement: {},
    oneTrustCookieCategories: {},
    ketchConsentPurposes: {},
    topsortEvents: [
      {
        from: 'Order Completed',
        to: 'purchases',
      },
      {
        from: 'Product Added',
        to: 'purchases',
      },
    ],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

export const trackPurchasesTestData: ProcessorTestData[] = [
  {
    id: 'Test 0',
    name: 'topsort',
    description:
      'Verifies that a Product Added event is correctly mapped and ingested as a purchase event in Topsort with the appropriate product details.',
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
              event: 'Product Added', // The RudderStack event
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
                Authorization: 'Bearer test-api',
              },
              params: {},
              userId: '',
              JSON: {
                purchases: [
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
                    items: [
                      {
                        productId: '622c6f5d5cf86a4c77358033',
                        quantity: 5,
                        unitPrice: 49.99,
                      },
                    ],
                    id: 'test-msg-id',
                  },
                ],
                clicks: [],
                impressions: [],
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
      'Verifies that a Checkout Started event with multiple products is correctly mapped with items.',
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
                Authorization: 'Bearer test-api',
              },
              params: {},
              userId: '',
              JSON: {
                purchases: [
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
                    items: [
                      {
                        productId: '622c6f5d5cf86a4c77358033',
                        unitPrice: 40,
                      },
                      {
                        productId: '577c6f5d5cf86a4c7735ba03',
                        unitPrice: 5,
                      },
                    ],
                    id: 'test-id-123-123-123',
                  },
                ],
                clicks: [],
                impressions: [],
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
      'Verifies that both a Product Added and an Order Completed event are correctly mapped and ingested into Topsort as purchase events',
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
              event: 'Product Added', // The RudderStack event
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
                Authorization: 'Bearer test-api',
              },
              params: {},
              userId: '',
              JSON: {
                purchases: [
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
                    items: [
                      {
                        productId: '622c6f5d5cf86a4c77358033',
                        quantity: 5,
                        unitPrice: 49.99,
                      },
                    ],
                    id: 'test-msg-id',
                  },
                ],
                clicks: [],
                impressions: [],
              },
              JSON_ARRAY: {},
              XML: {},
              FORM: {},
            }),
            metadata: generateMetadata(1),
            statusCode: 200,
          },
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://api.topsort.com/v2/events',
              headers: {
                'content-type': 'application/json',
                Authorization: 'Bearer test-api',
              },
              params: {},
              userId: '',
              JSON: {
                purchases: [
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
                    items: [
                      {
                        productId: '622c6f5d5cf86a4c77358033',
                        quantity: 5,
                        unitPrice: 49.99,
                      },
                    ],
                    id: 'test-msg-id',
                  },
                ],
                clicks: [],
                impressions: [],
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
];
