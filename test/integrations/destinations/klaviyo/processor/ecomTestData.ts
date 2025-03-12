import { overrideDestination, transformResultBuilder, generateMetadata } from '../../../testUtils';
import { ProcessorTestData } from '../../../testTypes';
import { Destination } from '../../../../../src/types';
import { secret1, authHeader1 } from '../maskedSecrets';

const destination: Destination = {
  ID: '123',
  Name: 'klaviyo',
  DestinationDefinition: {
    ID: '123',
    Name: 'klaviyo',
    DisplayName: 'klaviyo',
    Config: {},
  },
  Config: {
    publicApiKey: 'dummyPublicApiKey',
    privateApiKey: secret1,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const commonTraits = {
  id: 'user@1',
  age: '22',
  name: 'Test',
  email: 'test@rudderstack.com',
  phone: '9112340375',
  anonymousId: '9c6bd77ea9da3e68',
  description: 'Sample description',
};

const eventsEndpoint = 'https://a.klaviyo.com/api/events';

const commonOutputHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  Accept: 'application/json',
  revision: '2023-02-22',
};

export const ecomTestData: ProcessorTestData[] = [
  {
    id: 'klaviyo-ecom-test-1',
    name: 'klaviyo',
    description: 'Track call with Ecom events (Viewed Product)',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain contextual traits and properties in the payload the event name should be Viewed Product and the properties should be mapped to the Klaviyo event properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'product viewed',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              channel: 'mobile',
              context: {
                traits: commonTraits,
              },
              properties: {
                name: 'test product',
                product_id: '1114',
                sku: 'WINNIePuh12',
                image_url: 'http://www.example.com/path/to/product/image.png',
                url: 'http://www.example.com/path/to/product',
                brand: 'Not for Kids',
                price: 9.9,
                categories: ['Fiction', 'Children'],
              },
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata: generateMetadata(1),
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
              endpoint: eventsEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'event',
                  attributes: {
                    metric: {
                      name: 'Viewed Product',
                    },
                    profile: {
                      $email: 'test@rudderstack.com',
                      $phone_number: '9112340375',
                      $id: 'sajal12',
                      age: '22',
                      name: 'Test',
                      description: 'Sample description',
                    },
                    properties: {
                      ProductName: 'test product',
                      ProductID: '1114',
                      SKU: 'WINNIePuh12',
                      ImageURL: 'http://www.example.com/path/to/product/image.png',
                      URL: 'http://www.example.com/path/to/product',
                      Brand: 'Not for Kids',
                      Price: 9.9,
                      Categories: ['Fiction', 'Children'],
                    },
                  },
                },
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-ecom-test-2',
    name: 'klaviyo',
    description: 'Track call with Ecom events (Checkout Started) with enabled flattenProperties',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain contextual traits and properties in the payload the event name should be Started Checkout and the properties should be mapped to the Klaviyo event properties with flattened properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { flattenProperties: true }),
            message: {
              type: 'track',
              event: 'checkout started',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              channel: 'mobile',
              context: {
                traits: commonTraits,
              },
              properties: {
                order_id: '1234',
                affiliation: 'Apple Store',
                value: 20,
                revenue: 15,
                shipping: 4,
                tax: 1,
                discount: 1.5,
                coupon: 'ImagePro',
                currency: 'USD',
                products: [
                  {
                    product_id: '123',
                    sku: 'G-32',
                    name: 'Monopoly',
                    price: 14,
                    quantity: 1,
                    category: 'Games',
                    url: 'https://www.website.com/product/path',
                    image_url: 'https://www.website.com/product/path.jpg',
                  },
                  {
                    product_id: '345',
                    sku: 'F-32',
                    name: 'UNO',
                    price: 3.45,
                    quantity: 2,
                    category: 'Games',
                  },
                ],
              },
              anonymousId: '9c6bd77ea9da3e68',
            },
            metadata: generateMetadata(2),
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
              endpoint: eventsEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'event',
                  attributes: {
                    metric: {
                      name: 'Started Checkout',
                    },
                    properties: {
                      $event_id: '1234',
                      $value: 20,
                      'items[0].ProductID': '123',
                      'items[0].SKU': 'G-32',
                      'items[0].ProductName': 'Monopoly',
                      'items[0].Quantity': 1,
                      'items[0].ItemPrice': 14,
                      'items[0].ProductURL': 'https://www.website.com/product/path',
                      'items[0].ImageURL': 'https://www.website.com/product/path.jpg',
                      'items[1].ProductID': '345',
                      'items[1].SKU': 'F-32',
                      'items[1].ProductName': 'UNO',
                      'items[1].Quantity': 2,
                      'items[1].ItemPrice': 3.45,
                    },
                    profile: {
                      $email: 'test@rudderstack.com',
                      $phone_number: '9112340375',
                      $id: 'sajal12',
                      age: '22',
                      name: 'Test',
                      description: 'Sample description',
                    },
                  },
                },
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(2),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-ecom-test-3',
    name: 'klaviyo',
    description: 'Track call with Ecom events (Added to Cart) with properties.products',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain contextual traits and properties in the payload the event name should be Added to Cart and the properties should be mapped to the Klaviyo event properties with flattened properties and products array should be mapped to items array in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'product added',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              channel: 'mobile',
              context: {
                traits: commonTraits,
              },
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              properties: {
                order_id: '1234',
                value: 12.12,
                categories: ['Fiction3', 'Children3'],
                checkout_url: 'http://www.heythere.com',
                item_names: ['book1', 'book2'],
                products: [
                  {
                    product_id: 'b1pid',
                    sku: '123x',
                    name: 'book1',
                    url: 'heyther.com',
                    price: 12,
                  },
                  {
                    product_id: 'b2pid',
                    sku: '123x',
                    name: 'book2',
                    url: 'heyther2.com',
                    price: 14,
                  },
                ],
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata: generateMetadata(3),
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
              endpoint: 'https://a.klaviyo.com/api/events',
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'event',
                  attributes: {
                    metric: {
                      name: 'Added to Cart',
                    },
                    profile: {
                      $email: 'test@rudderstack.com',
                      $phone_number: '9112340375',
                      $id: 'sajal12',
                      age: '22',
                      name: 'Test',
                      description: 'Sample description',
                    },
                    properties: {
                      $value: 12.12,
                      AddedItemCategories: ['Fiction3', 'Children3'],
                      ItemNames: ['book1', 'book2'],
                      CheckoutURL: 'http://www.heythere.com',
                      items: [
                        {
                          ProductID: 'b1pid',
                          SKU: '123x',
                          ProductName: 'book1',
                          ItemPrice: 12,
                          ProductURL: 'heyther.com',
                        },
                        {
                          ProductID: 'b2pid',
                          SKU: '123x',
                          ProductName: 'book2',
                          ItemPrice: 14,
                          ProductURL: 'heyther2.com',
                        },
                      ],
                    },
                  },
                },
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(3),
          },
        ],
      },
    },
  },
];
