import { generateTrackPayload, generateMetadata, transformResultBuilder } from '../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';

const commonDestination: Destination = {
  ID: '12335',
  Name: 'sample-destination',
  DestinationDefinition: {
    ID: '123',
    Name: 'facebook_pixel',
    DisplayName: 'Facebook Pixel',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: {
    blacklistPiiProperties: [
      {
        blacklistPiiProperties: '',
        blacklistPiiHash: false,
      },
    ],
    accessToken: '09876',
    pixelId: 'dummyPixelId',
    eventsToEvents: [
      {
        from: 'ABC Started',
        to: 'InitiateCheckout',
      },
    ],
    eventCustomProperties: [
      {
        eventCustomProperties: '',
      },
    ],
    valueFieldIdentifier: '',
    advancedMapping: false,
    whitelistPiiProperties: [
      {
        whitelistPiiProperties: 'email',
      },
    ],
  },
  Enabled: true,
};

const commonUserTraits = {
  email: 'abc@gmail.com',
  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
  event_id: '12345',
};

const commonPropertiesWithoutProductArray = {
  category: 'dummy',
  quantity: 10,
  value: 100,
  product_id: '12345',
};

const commonPropertiesWithProductArray = {
  products: [
    {
      product_id: '017c6f5d5cf86a4b22432066',
      sku: '8732-98',
      name: 'Just Another Game',
      price: 22,
      position: 2,
      category: 'Games and Entertainment',
      url: 'https://www.myecommercewebsite.com/product',
      image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
    },
    {
      product_id: '89ac6f5d5cf86a4b64eac145',
      sku: '1267-01',
      name: 'Wrestling Trump Cards',
      price: 4,
      position: 21,
      category: 'Card Games',
    },
  ],
  category: 'dummy',
  quantity: 10,
  revenue: 100,
  price: 50,
  product_id: '12345',
  order_id: '23456',
};
const commonTimestamp = new Date('2023-10-14');
const commonStatTags = {
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  destType: 'FACEBOOK_PIXEL',
  module: 'destination',
  implementation: 'native',
  feature: 'processor',
};

export const ecommTestData: ProcessorTestData[] = [
  {
    id: 'facebook_pixel-ecomm-test-1',
    name: 'facebook_pixel',
    description:
      'Track call : product list viewed event call with properties without product array',
    scenario: 'ecommerce',
    successCriteria:
      'It should be internally mapped to ViewContent, with necessary mapping from message.properties and should be sent to the destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product list viewed',
              properties: commonPropertiesWithoutProductArray,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'ViewContent',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      category: 'dummy',
                      quantity: 10,
                      value: 100,
                      product_id: '12345',
                      content_ids: ['dummy'],
                      content_type: 'product_group',
                      contents: [
                        {
                          id: 'dummy',
                          quantity: 1,
                        },
                      ],
                      content_category: 'dummy',
                      currency: 'USD',
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'facebook_pixel-ecomm-test-2',
    name: 'facebook_pixel',
    description: 'Track call : product list viewed event call with properties with product array',
    successCriteria:
      'It should be internally mapped to ViewContent, with necessary mapping from message.properties and from products array and should be sent to the destination',
    scenario: 'ecommerce',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product list viewed',
              properties: commonPropertiesWithProductArray,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'ViewContent',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      'products[0].product_id': '017c6f5d5cf86a4b22432066',
                      'products[0].sku': '8732-98',
                      'products[0].name': 'Just Another Game',
                      'products[0].price': 22,
                      'products[0].position': 2,
                      'products[0].category': 'Games and Entertainment',
                      'products[0].url': 'https://www.myecommercewebsite.com/product',
                      'products[0].image_url':
                        'https://www.myecommercewebsite.com/product/path.jpg',
                      'products[1].product_id': '89ac6f5d5cf86a4b64eac145',
                      'products[1].sku': '1267-01',
                      'products[1].name': 'Wrestling Trump Cards',
                      'products[1].price': 4,
                      'products[1].position': 21,
                      'products[1].category': 'Card Games',
                      category: 'dummy',
                      quantity: 10,
                      revenue: 100,
                      price: 50,
                      product_id: '12345',
                      order_id: '23456',
                      content_ids: ['017c6f5d5cf86a4b22432066', '89ac6f5d5cf86a4b64eac145'],
                      content_type: 'product',
                      contents: [
                        {
                          id: '017c6f5d5cf86a4b22432066',
                          quantity: 10,
                          item_price: 22,
                        },
                        {
                          id: '89ac6f5d5cf86a4b64eac145',
                          quantity: 10,
                          item_price: 4,
                        },
                      ],
                      content_category: 'dummy',
                      value: 0,
                      currency: 'USD',
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'facebook_pixel-ecomm-test-3',
    name: 'facebook_pixel',
    description: 'Track call : product viewed event call with properties without product array',
    scenario: 'ecommerce',
    successCriteria:
      'It should be internally mapped to ViewContent, with necessary mapping from message.properties and should be sent to the destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product viewed',
              properties: commonPropertiesWithoutProductArray,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'ViewContent',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      category: 'dummy',
                      quantity: 10,
                      value: 0,
                      product_id: '12345',
                      content_ids: ['12345'],
                      content_type: 'product',
                      content_name: '',
                      content_category: 'dummy',
                      currency: 'USD',
                      contents: [
                        {
                          id: '12345',
                          quantity: 10,
                        },
                      ],
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'facebook_pixel-ecomm-test-4',
    name: 'facebook_pixel',
    description: 'Track call : product added event call with properties without product array',
    scenario: 'ecommerce',
    successCriteria:
      'It should be internally mapped to AddToCart, with necessary mapping from message.properties and should be sent to the destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product added',
              properties: commonPropertiesWithoutProductArray,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'AddToCart',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      category: 'dummy',
                      quantity: 10,
                      value: 0,
                      product_id: '12345',
                      content_ids: ['12345'],
                      content_type: 'product',
                      content_name: '',
                      content_category: 'dummy',
                      currency: 'USD',
                      contents: [
                        {
                          id: '12345',
                          quantity: 10,
                        },
                      ],
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'facebook_pixel-ecomm-test-5',
    name: 'facebook_pixel',
    description: 'Track call : order completed event call with properties without product array',
    scenario: 'ecommerce',
    successCriteria:
      'It should be internally mapped to purchase, with necessary mapping from message.properties and should be sent to the destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'order completed',
              properties: commonPropertiesWithoutProductArray,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'Purchase',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      category: 'dummy',
                      quantity: 10,
                      value: 0,
                      product_id: '12345',
                      content_category: 'dummy',
                      content_ids: [],
                      content_type: 'product',
                      currency: 'USD',
                      contents: [],
                      num_items: 0,
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'facebook_pixel-ecomm-test-6',
    name: 'facebook_pixel',
    description: 'Track call : order completed event call with properties with product array',
    scenario: 'ecommerce',
    successCriteria:
      'It should be internally mapped to purchase, with necessary mapping from message.properties and should be sent to the destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'order completed',
              properties: commonPropertiesWithProductArray,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'Purchase',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      'products[0].product_id': '017c6f5d5cf86a4b22432066',
                      'products[0].sku': '8732-98',
                      'products[0].name': 'Just Another Game',
                      'products[0].price': 22,
                      'products[0].position': 2,
                      'products[0].category': 'Games and Entertainment',
                      'products[0].url': 'https://www.myecommercewebsite.com/product',
                      'products[0].image_url':
                        'https://www.myecommercewebsite.com/product/path.jpg',
                      'products[1].product_id': '89ac6f5d5cf86a4b64eac145',
                      'products[1].sku': '1267-01',
                      'products[1].name': 'Wrestling Trump Cards',
                      'products[1].price': 4,
                      'products[1].position': 21,
                      'products[1].category': 'Card Games',
                      category: 'dummy',
                      quantity: 10,
                      revenue: 100,
                      price: 50,
                      product_id: '12345',
                      order_id: '23456',
                      content_category: 'dummy',
                      content_ids: ['017c6f5d5cf86a4b22432066', '89ac6f5d5cf86a4b64eac145'],
                      content_type: 'product',
                      currency: 'USD',
                      value: 100,
                      contents: [
                        {
                          id: '017c6f5d5cf86a4b22432066',
                          quantity: 10,
                          item_price: 22,
                        },
                        {
                          id: '89ac6f5d5cf86a4b64eac145',
                          quantity: 10,
                          item_price: 4,
                        },
                      ],
                      num_items: 2,
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'facebook_pixel-ecomm-test-7',
    name: 'facebook_pixel',
    description: 'Track call : products searched event call with properties',
    scenario: 'ecommerce',
    successCriteria:
      'It should be internally mapped to Search, with necessary mapping from message.properties and should be sent to the destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'products searched',
              properties: { ...commonPropertiesWithoutProductArray, query: 'dummy' },
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'Search',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      category: 'dummy',
                      quantity: 10,
                      value: 100,
                      product_id: '12345',
                      query: 'dummy',
                      content_ids: ['12345'],
                      content_category: 'dummy',
                      contents: [
                        {
                          id: '12345',
                          quantity: 10,
                        },
                      ],
                      search_string: 'dummy',
                      currency: 'USD',
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'facebook_pixel-ecomm-test-8',
    name: 'facebook_pixel',
    description:
      'Track call : products searched event call with properties and unsupported query type',
    scenario: 'ecommerce',
    successCriteria:
      'Error : It should throw an error as the query is not a string or an array of strings',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'products searched',
              properties: { ...commonPropertiesWithoutProductArray, query: ['dummy'] },
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            statusCode: 400,
            error: "'query' should be in string format only",
            statTags: {
              ...commonStatTags,
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-ecomm-test-9',
    name: 'facebook_pixel',
    description: 'Track call : checkout started event call with properties without product array',
    scenario: 'ecommerce',
    successCriteria:
      'It should be internally mapped to InitiateCheckout, with necessary mapping from message.properties and should be sent to the destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'checkout started',
              properties: commonPropertiesWithoutProductArray,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'InitiateCheckout',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      category: 'dummy',
                      quantity: 10,
                      value: 0,
                      product_id: '12345',
                      content_category: 'dummy',
                      content_ids: [],
                      content_type: 'product',
                      currency: 'USD',
                      contents: [],
                      num_items: 0,
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'facebook_pixel-ecomm-test-10',
    name: 'facebook_pixel',
    description: 'Track call : checkout started event call with properties with product array',
    scenario: 'ecommerce',
    successCriteria:
      'It should be internally mapped to InitiateCheckout, with necessary mapping from message.properties and should be sent to the destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'checkout started',
              properties: commonPropertiesWithProductArray,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'InitiateCheckout',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      'products[0].product_id': '017c6f5d5cf86a4b22432066',
                      'products[0].sku': '8732-98',
                      'products[0].name': 'Just Another Game',
                      'products[0].price': 22,
                      'products[0].position': 2,
                      'products[0].category': 'Games and Entertainment',
                      'products[0].url': 'https://www.myecommercewebsite.com/product',
                      'products[0].image_url':
                        'https://www.myecommercewebsite.com/product/path.jpg',
                      'products[1].product_id': '89ac6f5d5cf86a4b64eac145',
                      'products[1].sku': '1267-01',
                      'products[1].name': 'Wrestling Trump Cards',
                      'products[1].price': 4,
                      'products[1].position': 21,
                      'products[1].category': 'Card Games',
                      category: 'dummy',
                      quantity: 10,
                      revenue: 100,
                      price: 50,
                      product_id: '12345',
                      order_id: '23456',
                      content_category: 'dummy',
                      content_ids: ['017c6f5d5cf86a4b22432066', '89ac6f5d5cf86a4b64eac145'],
                      content_type: 'product',
                      currency: 'USD',
                      value: 100,
                      contents: [
                        {
                          id: '017c6f5d5cf86a4b22432066',
                          quantity: 10,
                          item_price: 22,
                        },
                        {
                          id: '89ac6f5d5cf86a4b64eac145',
                          quantity: 10,
                          item_price: 4,
                        },
                      ],
                      num_items: 2,
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'facebook_pixel-ecomm-test-11',
    name: 'facebook_pixel',
    description:
      'Track call : custom event ABC Started event call with properties with product array',
    scenario: 'ecommerce',
    successCriteria:
      'It should be internally mapped to InitiateCheckout, with necessary mapping from message.properties and should be sent to the destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'ABC Started',
              properties: commonPropertiesWithProductArray,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'InitiateCheckout',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      'products[0].product_id': '017c6f5d5cf86a4b22432066',
                      'products[0].sku': '8732-98',
                      'products[0].name': 'Just Another Game',
                      'products[0].price': 22,
                      'products[0].position': 2,
                      'products[0].category': 'Games and Entertainment',
                      'products[0].url': 'https://www.myecommercewebsite.com/product',
                      'products[0].image_url':
                        'https://www.myecommercewebsite.com/product/path.jpg',
                      'products[1].product_id': '89ac6f5d5cf86a4b64eac145',
                      'products[1].sku': '1267-01',
                      'products[1].name': 'Wrestling Trump Cards',
                      'products[1].price': 4,
                      'products[1].position': 21,
                      'products[1].category': 'Card Games',
                      category: 'dummy',
                      quantity: 10,
                      revenue: 100,
                      price: 50,
                      product_id: '12345',
                      order_id: '23456',
                      content_category: 'dummy',
                      content_ids: ['017c6f5d5cf86a4b22432066', '89ac6f5d5cf86a4b64eac145'],
                      content_type: 'product',
                      currency: 'USD',
                      value: 100,
                      contents: [
                        {
                          id: '017c6f5d5cf86a4b22432066',
                          quantity: 10,
                          item_price: 22,
                        },
                        {
                          id: '89ac6f5d5cf86a4b64eac145',
                          quantity: 10,
                          item_price: 4,
                        },
                      ],
                      num_items: 2,
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'facebook_pixel-ecomm-test-12',
    name: 'facebook_pixel',
    description:
      'Track call : product list viewed event call with properties without product array and revenue as string',
    scenario: 'ecommerce',
    successCriteria:
      'Error : It should throw an error as revenue is not a number and should not be sent to the destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product list viewed',
              properties: { ...commonPropertiesWithoutProductArray, value: '$20' },
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            error: 'Revenue could not be converted to number',
            metadata: generateMetadata(1),
            statTags: {
              ...commonStatTags,
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
];
