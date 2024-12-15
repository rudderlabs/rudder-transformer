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
        from: 'Product Viewed',
        to: 'impressions',
      },
      {
        from: 'Checkout Started',
        to: 'impressions',
      },
    ],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

export const trackImpressionsTestData: ProcessorTestData[] = [
  {
    id: 'Test 0',
    name: 'topsort',
    description:
      'Track call with impressions event, verifies that a Product Viewed event is correctly mapped',
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
              event: 'Product Viewed', // The RudderStack event
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
                impressions: [
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
                clicks: [],
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
      'Verifies that a Checkout Started event with multiple products is correctly mapped and ingested as impressions in Topsort.',
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
              event: 'Checkout Started', // The RudderStack event
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
                impressions: [
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
                clicks: [],
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
      'Verifies that an invalid event (Checkout done) that is not found in Topsort’s event mappings is handled and returns an error with a status code 400.',
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
              event: 'Checkout done', // The RudderStack event
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
            error: "Event 'checkout done' not found in Topsort event mappings",
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
