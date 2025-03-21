import { authHeader1, secret1 } from '../maskedSecrets';
import { Destination } from '../../../../../src/types';
import { RouterTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';

const destination: Destination = {
  ID: '123',
  Name: 'topsort',
  DestinationDefinition: {
    ID: '123',
    Name: 'topsort',
    DisplayName: 'topsort',
    Config: {
      endpoint: 'https://api.topsort.com/v2/events',
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
        from: 'Product Added',
        to: 'purchases',
      },
      {
        from: 'Product Removed',
        to: 'impressions',
      },
    ],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

export const data: RouterTestData[] = [
  {
    id: 'topsort-router-test-1',
    name: 'topsort',
    description: 'Basic Router Test for track call having clicks event',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200, and the output should correctly map the properties.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              metadata: generateMetadata(1),
              message: {
                type: 'track',
                event: 'Product Clicked',
                originalTimestamp: '2024-11-05T15:19:08+00:00',
                messageId: 'test-msg-id',
                anonymousId: 'sampath',
                channel: 'web',
                context: {
                  page: {
                    path: '/category/123',
                  },
                  ip: '0.0.0.0',
                },
                integrations: { All: true },
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
              },
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.topsort.com/v2/events',
                headers: {
                  'content-type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    impressions: [],
                    clicks: [
                      {
                        occurredAt: '2024-11-05T15:19:08+00:00',
                        opaqueUserId: 'sampath',
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
                          path: '/category/123',
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
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
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
    id: 'topsort-router-test-2',
    name: 'topsort',
    description: 'Basic Router Test for track call having impressions event',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200, and the output should correctly map the properties.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              metadata: generateMetadata(1),
              message: {
                type: 'track',
                event: 'Product Removed',
                originalTimestamp: '2024-11-05T15:19:08+00:00',
                messageId: 'test-msg-id',
                anonymousId: 'sampath',
                channel: 'web',
                context: {
                  page: {
                    path: '/category/123',
                  },
                  ip: '0.0.0.0',
                },
                integrations: { All: true },
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
              },
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.topsort.com/v2/events',
                headers: {
                  'content-type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    impressions: [
                      {
                        occurredAt: '2024-11-05T15:19:08+00:00',
                        opaqueUserId: 'sampath',
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
                          path: '/category/123',
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
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
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
    id: 'topsort-router-test-3',
    name: 'topsort',
    description: 'Basic Router Test for track call having purchases event',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200, and the output should correctly map the properties.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              metadata: generateMetadata(1),
              message: {
                type: 'track',
                event: 'Product Added',
                originalTimestamp: '2024-11-05T15:19:08+00:00',
                messageId: 'test-msg-id',
                anonymousId: 'sampath',
                channel: 'web',
                context: {
                  page: {
                    path: '/category/123',
                  },
                  ip: '0.0.0.0',
                },
                integrations: { All: true },
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
                  ],
                },
              },
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.topsort.com/v2/events',
                headers: {
                  'content-type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    purchases: [
                      {
                        occurredAt: '2024-11-05T15:19:08+00:00',
                        opaqueUserId: 'sampath',
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
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
];
