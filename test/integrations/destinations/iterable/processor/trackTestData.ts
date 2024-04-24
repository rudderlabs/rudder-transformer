import {
  generateMetadata,
  generateTrackPayload,
  transformResultBuilder,
} from './../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';

const destination: Destination = {
  ID: '123',
  Name: 'iterable',
  DestinationDefinition: {
    ID: '123',
    Name: 'iterable',
    DisplayName: 'Iterable',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: {
    apiKey: 'testApiKey',
    preferUserId: false,
    trackAllPages: true,
    trackNamedPages: false,
    mapToSingleEvent: false,
    trackCategorisedPages: false,
  },
  Enabled: true,
};

const headers = {
  api_key: 'testApiKey',
  'Content-Type': 'application/json',
};

const properties = {
  subject: 'resume validate',
  sendtime: '2020-01-01',
  sendlocation: 'akashdeep@gmail.com',
};

const customEventProperties = {
  campaignId: '1',
  templateId: '0',
  user_actual_id: 12345,
  category: 'test-category',
  email: 'ruchira@rudderlabs.com',
  user_actual_role: 'system_admin, system_user',
};

const productInfo = {
  price: 797,
  variant: 'Oak',
  quantity: 1,
  quickship: true,
  full_price: 1328,
  product_id: 10606,
  non_interaction: 1,
  sku: 'JB24691400-W05',
  name: 'Vira Console Cabinet',
  cart_id: 'bd9b8dbf4ef8ee01d4206b04fe2ee6ae',
};

const orderCompletedProductInfo = {
  price: 45,
  quantity: 1,
  total: '1000',
  name: 'Shoes',
  orderId: 10000,
  product_id: 1234,
  campaignId: '123456',
  templateId: '1213458',
};

const products = [
  {
    product_id: '507f1f77bcf86cd799439011',
    sku: '45790-32',
    name: 'Monopoly: 3rd Edition',
    price: '19',
    position: '1',
    category: 'cars',
    url: 'https://www.example.com/product/path',
    image_url: 'https://www.example.com/product/path.jpg',
    quantity: '2',
  },
  {
    product_id: '507f1f77bcf86cd7994390112',
    sku: '45790-322',
    name: 'Monopoly: 3rd Edition2',
    price: '192',
    quantity: 22,
    position: '12',
    category: 'Cars2',
    url: 'https://www.example.com/product/path2',
    image_url: 'https://www.example.com/product/path.jpg2',
  },
];

const items = [
  {
    id: '507f1f77bcf86cd799439011',
    sku: '45790-32',
    name: 'Monopoly: 3rd Edition',
    categories: ['cars'],
    price: 19,
    quantity: 2,
    imageUrl: 'https://www.example.com/product/path.jpg',
    url: 'https://www.example.com/product/path',
  },
  {
    id: '507f1f77bcf86cd7994390112',
    sku: '45790-322',
    name: 'Monopoly: 3rd Edition2',
    categories: ['Cars2'],
    price: 192,
    quantity: 22,
    imageUrl: 'https://www.example.com/product/path.jpg2',
    url: 'https://www.example.com/product/path2',
  },
];

const userId = 'userId';
const anonymousId = 'anonId';
const sentAt = '2020-08-28T16:26:16.473Z';
const originalTimestamp = '2020-08-28T16:26:06.468Z';

const endpoint = 'https://api.iterable.com/api/events/track';
const updateCartEndpoint = 'https://api.iterable.com/api/commerce/updateCart';
const trackPurchaseEndpoint = 'https://api.iterable.com/api/commerce/trackPurchase';

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'iterable-track-test-1',
    name: 'iterable',
    description: 'Track call to add event with user',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain event properties and event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              anonymousId,
              event: 'Email Opened',
              type: 'track',
              context: {},
              properties,
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
              userId: '',
              headers,
              endpoint,
              JSON: {
                userId: 'anonId',
                createdAt: 1598631966468,
                eventName: 'Email Opened',
                dataFields: properties,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-track-test-2',
    name: 'iterable',
    description: 'Track call for product added event with all properties',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain event name and all properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateTrackPayload({
              userId,
              anonymousId,
              event: 'product added',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: {
                campaignId: '1',
                templateId: '0',
                orderId: 10000,
                total: 1000,
                products,
              },
              sentAt,
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
              userId: '',
              headers,
              endpoint: updateCartEndpoint,
              JSON: {
                user: {
                  email: 'sayan@gmail.com',
                  dataFields: {
                    email: 'sayan@gmail.com',
                  },
                  userId,
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
                items,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-track-test-3',
    name: 'iterable',
    description: 'Track call for order completed event with all properties',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain event name and all properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateTrackPayload({
              userId,
              anonymousId,
              event: 'order completed',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: {
                orderId: 10000,
                total: '1000',
                campaignId: '123456',
                templateId: '1213458',
                products,
              },
              sentAt,
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
              userId: '',
              headers,
              endpoint: trackPurchaseEndpoint,
              JSON: {
                dataFields: {
                  orderId: 10000,
                  total: '1000',
                  campaignId: '123456',
                  templateId: '1213458',
                  products,
                },
                id: '10000',
                createdAt: 1598631966468,
                campaignId: 123456,
                templateId: 1213458,
                total: 1000,
                user: {
                  email: 'sayan@gmail.com',
                  dataFields: {
                    email: 'sayan@gmail.com',
                  },
                  userId,
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
                items,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-track-test-4',
    name: 'iterable',
    description: 'Track call for custom event with all properties',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain custom event name and all properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateTrackPayload({
              userId,
              anonymousId,
              event: 'test track event GA3',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: customEventProperties,
              sentAt,
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
              userId: '',
              headers,
              endpoint,
              JSON: {
                email: 'ruchira@rudderlabs.com',
                dataFields: customEventProperties,
                userId,
                eventName: 'test track event GA3',
                createdAt: 1598631966468,
                campaignId: 1,
                templateId: 0,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-track-test-5',
    name: 'iterable',
    description: 'Track call for product added event with product info as properties',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain event name and all properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateTrackPayload({
              userId,
              anonymousId,
              event: 'product added',
              context: {
                traits: {
                  email: 'jessica@jlpdesign.net',
                },
              },
              properties: productInfo,
              sentAt,
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
              userId: '',
              headers,
              endpoint: updateCartEndpoint,
              JSON: {
                user: {
                  email: 'jessica@jlpdesign.net',
                  dataFields: {
                    email: 'jessica@jlpdesign.net',
                  },
                  userId,
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
                items: [
                  {
                    id: productInfo.product_id,
                    sku: productInfo.sku,
                    name: productInfo.name,
                    price: productInfo.price,
                    quantity: productInfo.quantity,
                  },
                ],
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-track-test-6',
    name: 'iterable',
    description: 'Track call for product added event with product info as properties',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain event name and all properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateTrackPayload({
              userId,
              anonymousId,
              event: 'product added',
              context: {
                traits: {
                  email: 'jessica@jlpdesign.net',
                },
              },
              properties: {
                campaignId: '1',
                templateId: '0',
                orderId: 10000,
                total: 1000,
                ...products[1],
              },
              sentAt,
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
              userId: '',
              headers,
              endpoint: updateCartEndpoint,
              JSON: {
                user: {
                  email: 'jessica@jlpdesign.net',
                  dataFields: {
                    email: 'jessica@jlpdesign.net',
                  },
                  userId,
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
                items: [
                  {
                    price: 192,
                    url: products[1].url,
                    sku: products[1].sku,
                    name: products[1].name,
                    id: products[1].product_id,
                    quantity: products[1].quantity,
                    imageUrl: products[1].image_url,
                    categories: [products[1].category],
                  },
                ],
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-track-test-7',
    name: 'iterable',
    description: 'Track call for order completed event with product info as properties',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain event name and all properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateTrackPayload({
              userId,
              anonymousId,
              event: 'order completed',
              context: {
                traits: {
                  email: 'jessica@jlpdesign.net',
                },
              },
              properties: orderCompletedProductInfo,
              sentAt,
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
              userId: '',
              headers,
              endpoint: trackPurchaseEndpoint,
              JSON: {
                dataFields: orderCompletedProductInfo,
                user: {
                  email: 'jessica@jlpdesign.net',
                  dataFields: {
                    email: 'jessica@jlpdesign.net',
                  },
                  userId,
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
                id: '10000',
                total: 1000,
                campaignId: 123456,
                templateId: 1213458,
                createdAt: 1598631966468,
                items: [
                  {
                    id: orderCompletedProductInfo.product_id,
                    name: orderCompletedProductInfo.name,
                    price: orderCompletedProductInfo.price,
                    quantity: orderCompletedProductInfo.quantity,
                  },
                ],
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-track-test-8',
    name: 'iterable',
    description: 'Track call without event name and userId',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain event properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              anonymousId,
              type: 'track',
              context: {},
              properties,
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
              userId: '',
              headers,
              endpoint,
              JSON: {
                userId: anonymousId,
                createdAt: 1598631966468,
                dataFields: properties,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-track-test-8',
    name: 'iterable',
    description: 'Track call without event name',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain event properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              userId,
              anonymousId,
              type: 'track',
              context: {},
              properties,
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
              userId: '',
              headers,
              endpoint,
              JSON: {
                userId,
                createdAt: 1598631966468,
                dataFields: properties,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
