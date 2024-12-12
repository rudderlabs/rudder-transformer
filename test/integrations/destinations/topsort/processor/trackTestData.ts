import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import { defaultMockFns } from '../mocks';
import {
  generateMetadata,
  generateSimplifiedTrackPayload,
  transformResultBuilder,
} from '../../../testUtils';

const destination: Destination = {
  ID: '123',
  Name: 'topsort',
  DestinationDefinition: {
    ID: '123',
    Name: 'topsort',
    DisplayName: 'topsort',
    Config: {
      baseURL: 'https://api.topsort.com/v2/events', // Base URL for Topsort API
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
        from: 'Product Clicked',
        to: 'clicks',
      },
      {
        from: 'Product Viewed',
        to: 'impressions',
      },
      {
        from: 'Order Completed',
        to: 'purchases',
      },
    ],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

export const trackTestdata: ProcessorTestData[] = [
  {
    id: 'Test 0',
    name: 'topsort',
    description: 'Track call with standard properties mapping',
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
                    id: '8zrxk16wn66fl1w7zd2f9bzmjhx6r515gxx',
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
];
