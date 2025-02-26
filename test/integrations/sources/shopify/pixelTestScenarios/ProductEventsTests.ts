// This file contains the test scenarios related to Shopify pixel events, emitted from web pixel on the browser.
import { mockFns } from '../mocks';
import {
  dummyContext,
  dummyContextwithCampaign,
  dummySourceConfig,
  responseDummyContext,
  responseDummyContextwithCampaign,
} from '../constants';

export const pixelEventsTestScenarios = [
  {
    name: 'shopify',
    description: 'Page Call -> page_view event from web pixel',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              id: 'sh-f6b6f548-5FEF-4DAE-9CAB-39EE6F94E09B',
              name: 'page_viewed',
              data: {},
              type: 'standard',
              clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
              timestamp: '2024-09-15T17:24:30.373Z',
              context: dummyContextwithCampaign,
              pixelEventLabel: true,
              query_parameters: {
                topic: ['page_viewed'],
                writeKey: ['dummy-write-key'],
              },
            },
            source: dummySourceConfig,
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    ...responseDummyContextwithCampaign,
                    campaign: {
                      content: 'web',
                      medium: 'checkout',
                      name: 'shopifySale',
                      term: 'term_checkout',
                      utm_custom1: 'customutm',
                    },
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                      data: {},
                      id: 'sh-f6b6f548-5FEF-4DAE-9CAB-39EE6F94E09B',
                      name: 'page_viewed',
                      timestamp: '2024-09-15T17:24:30.373Z',
                      type: 'standard',
                    },
                    topic: 'page_viewed',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['page.context.shopifyDetails'],
                      },
                    },
                  },
                  name: 'Page View',
                  type: 'page',
                  userId: 'test-user-id',
                  properties: {},
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  messageId: 'sh-f6b6f548-5FEF-4DAE-9CAB-39EE6F94E09B',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'shopify',
    description: 'Track Call -> product_viewed event from web pixel',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              id: 'sh-f6c07b5a-D20A-4E5F-812E-337299B56C34',
              name: 'product_viewed',
              data: {
                productVariant: {
                  price: {
                    amount: 749.95,
                    currencyCode: 'USD',
                  },
                  product: {
                    title: 'The Collection Snowboard: Liquid',
                    vendor: 'Hydrogen Vendor',
                    id: '7234590834801',
                    untranslatedTitle: 'The Collection Snowboard: Liquid',
                    url: '/products/the-collection-snowboard-liquid',
                    type: 'snowboard',
                  },
                  id: '41327143321713',
                  image: {
                    src: '//store.myshopify.com/cdn/shop/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
                  },
                  sku: '',
                  title: 'Default Title',
                  untranslatedTitle: 'Default Title',
                },
              },
              type: 'standard',
              clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
              timestamp: '2024-09-15T17:34:54.889Z',
              context: dummyContext,
              pixelEventLabel: true,
              query_parameters: {
                topic: ['product_viewed'],
                writeKey: ['dummy-write-key'],
              },
            },
            source: dummySourceConfig,
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    ...responseDummyContext,
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                      data: {
                        productVariant: {
                          id: '41327143321713',
                          image: {
                            src: '//store.myshopify.com/cdn/shop/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
                          },
                          price: {
                            amount: 749.95,
                            currencyCode: 'USD',
                          },
                          product: {
                            id: '7234590834801',
                            title: 'The Collection Snowboard: Liquid',
                            type: 'snowboard',
                            untranslatedTitle: 'The Collection Snowboard: Liquid',
                            url: '/products/the-collection-snowboard-liquid',
                            vendor: 'Hydrogen Vendor',
                          },
                          sku: '',
                          title: 'Default Title',
                          untranslatedTitle: 'Default Title',
                        },
                      },
                      id: 'sh-f6c07b5a-D20A-4E5F-812E-337299B56C34',
                      name: 'product_viewed',
                      timestamp: '2024-09-15T17:34:54.889Z',
                      type: 'standard',
                    },
                    topic: 'product_viewed',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  type: 'track',
                  userId: 'test-user-id',
                  event: 'Product Viewed',
                  properties: {
                    product_id: '7234590834801',
                    variant: 'The Collection Snowboard: Liquid',
                    brand: 'Hydrogen Vendor',
                    category: 'snowboard',
                    price: 749.95,
                    currency: 'USD',
                    url: '/products/the-collection-snowboard-liquid',
                    name: 'The Collection Snowboard: Liquid',
                  },
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  messageId: 'sh-f6c07b5a-D20A-4E5F-812E-337299B56C34',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'shopify',
    description: 'Track Call -> cart_viewed event from web pixel',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              id: 'shu-f6eecef1-4132-459F-CDB5-681DA3DD61CD',
              name: 'cart_viewed',
              data: {
                cart: {
                  cost: {
                    totalAmount: {
                      amount: 1259.9,
                      currencyCode: 'USD',
                    },
                  },
                  lines: [
                    {
                      cost: {
                        totalAmount: {
                          amount: 1259.9,
                          currencyCode: 'USD',
                        },
                      },
                      merchandise: {
                        price: {
                          amount: 629.95,
                          currencyCode: 'USD',
                        },
                        product: {
                          title: 'The Multi-managed Snowboard',
                          vendor: 'Multi-managed Vendor',
                          id: '7234590736497',
                          untranslatedTitle: 'The Multi-managed Snowboard',
                          url: '/products/the-multi-managed-snowboard',
                          type: 'snowboard',
                        },
                        id: '41327143157873',
                        image: {
                          src: '//store.myshopify.com/cdn/shop/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a.jpg?v=1724736597',
                        },
                        sku: 'sku-managed-1',
                        title: 'Default Title',
                        untranslatedTitle: 'Default Title',
                      },
                      quantity: 2,
                    },
                  ],
                  totalQuantity: 2,
                  attributes: [],
                  id: 'Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                },
              },
              type: 'standard',
              clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
              timestamp: '2024-09-15T18:25:30.125Z',
              context: dummyContext,
              pixelEventLabel: true,
              query_parameters: {
                topic: ['cart_viewed'],
                writeKey: ['dummy-write-key'],
              },
            },
            source: dummySourceConfig,
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    ...responseDummyContext,
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                      data: {
                        cart: {
                          attributes: [],
                          cost: {
                            totalAmount: {
                              amount: 1259.9,
                              currencyCode: 'USD',
                            },
                          },
                          id: 'Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                          lines: [
                            {
                              cost: {
                                totalAmount: {
                                  amount: 1259.9,
                                  currencyCode: 'USD',
                                },
                              },
                              merchandise: {
                                id: '41327143157873',
                                image: {
                                  src: '//store.myshopify.com/cdn/shop/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a.jpg?v=1724736597',
                                },
                                price: {
                                  amount: 629.95,
                                  currencyCode: 'USD',
                                },
                                product: {
                                  id: '7234590736497',
                                  title: 'The Multi-managed Snowboard',
                                  type: 'snowboard',
                                  untranslatedTitle: 'The Multi-managed Snowboard',
                                  url: '/products/the-multi-managed-snowboard',
                                  vendor: 'Multi-managed Vendor',
                                },
                                sku: 'sku-managed-1',
                                title: 'Default Title',
                                untranslatedTitle: 'Default Title',
                              },
                              quantity: 2,
                            },
                          ],
                          totalQuantity: 2,
                        },
                      },
                      id: 'shu-f6eecef1-4132-459F-CDB5-681DA3DD61CD',
                      name: 'cart_viewed',
                      timestamp: '2024-09-15T18:25:30.125Z',
                      type: 'standard',
                    },
                    topic: 'cart_viewed',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  type: 'track',
                  userId: 'test-user-id',
                  event: 'Cart Viewed',
                  properties: {
                    products: [
                      {
                        quantity: 2,
                        product_id: '7234590736497',
                        variant: 'The Multi-managed Snowboard',
                        image_url:
                          '//store.myshopify.com/cdn/shop/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a.jpg?v=1724736597',
                        price: 629.95,
                        category: 'snowboard',
                        url: '/products/the-multi-managed-snowboard',
                        brand: 'Multi-managed Vendor',
                        sku: 'sku-managed-1',
                        name: 'Default Title',
                      },
                    ],
                    cart_id: 'Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                    total: 1259.9,
                  },
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  messageId: 'shu-f6eecef1-4132-459F-CDB5-681DA3DD61CD',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'shopify',
    description: 'Track Call -> collection_viewed event from web pixel',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              id: 'sh-f6f0c6be-43F8-47D2-5F94-C22AD5ED3E79',
              name: 'collection_viewed',
              data: {
                collection: {
                  id: '',
                  title: 'Products',
                  productVariants: [
                    {
                      price: {
                        amount: 10,
                        currencyCode: 'USD',
                      },
                      product: {
                        title: 'Gift Card',
                        vendor: 'Snowboard Vendor',
                        id: '7234590605425',
                        untranslatedTitle: 'Gift Card',
                        url: '/products/gift-card',
                        type: 'giftcard',
                      },
                      id: '41327142895729',
                      image: {
                        src: '//store.myshopify.com/cdn/shop/files/gift_card.png?v=1724736596',
                      },
                      sku: '',
                      title: '$10',
                      untranslatedTitle: '$10',
                    },
                    {
                      price: {
                        amount: 24.95,
                        currencyCode: 'USD',
                      },
                      product: {
                        title: 'Selling Plans Ski Wax',
                        vendor: 'pixel-testing-rs',
                        id: '7234590802033',
                        untranslatedTitle: 'Selling Plans Ski Wax',
                        url: '/products/selling-plans-ski-wax',
                        type: 'accessories',
                      },
                      id: '41327143223409',
                      image: {
                        src: '//store.myshopify.com/cdn/shop/files/snowboard_wax.png?v=1724736599',
                      },
                      sku: '',
                      title: 'Selling Plans Ski Wax',
                      untranslatedTitle: 'Selling Plans Ski Wax',
                    },
                    {
                      price: {
                        amount: 2629.95,
                        currencyCode: 'USD',
                      },
                      product: {
                        title: 'The 3p Fulfilled Snowboard',
                        vendor: 'pixel-testing-rs',
                        id: '7234590703729',
                        untranslatedTitle: 'The 3p Fulfilled Snowboard',
                        url: '/products/the-3p-fulfilled-snowboard',
                        type: 'snowboard',
                      },
                      id: '41327143125105',
                      image: {
                        src: '//store.myshopify.com/cdn/shop/files/Main_b9e0da7f-db89-4d41-83f0-7f417b02831d.jpg?v=1724736597',
                      },
                      sku: 'sku-hosted-1',
                      title: 'Default Title',
                      untranslatedTitle: 'Default Title',
                    },
                  ],
                },
              },
              type: 'standard',
              clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
              timestamp: '2024-09-15T18:27:39.197Z',
              context: dummyContext,
              pixelEventLabel: true,
              query_parameters: {
                topic: ['collection_viewed'],
                writeKey: ['dummy-write-key'],
              },
            },
            source: dummySourceConfig,
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    ...responseDummyContext,
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                      data: {
                        collection: {
                          id: '',
                          productVariants: [
                            {
                              id: '41327142895729',
                              image: {
                                src: '//store.myshopify.com/cdn/shop/files/gift_card.png?v=1724736596',
                              },
                              price: {
                                amount: 10,
                                currencyCode: 'USD',
                              },
                              product: {
                                id: '7234590605425',
                                title: 'Gift Card',
                                type: 'giftcard',
                                untranslatedTitle: 'Gift Card',
                                url: '/products/gift-card',
                                vendor: 'Snowboard Vendor',
                              },
                              sku: '',
                              title: '$10',
                              untranslatedTitle: '$10',
                            },
                            {
                              id: '41327143223409',
                              image: {
                                src: '//store.myshopify.com/cdn/shop/files/snowboard_wax.png?v=1724736599',
                              },
                              price: {
                                amount: 24.95,
                                currencyCode: 'USD',
                              },
                              product: {
                                id: '7234590802033',
                                title: 'Selling Plans Ski Wax',
                                type: 'accessories',
                                untranslatedTitle: 'Selling Plans Ski Wax',
                                url: '/products/selling-plans-ski-wax',
                                vendor: 'pixel-testing-rs',
                              },
                              sku: '',
                              title: 'Selling Plans Ski Wax',
                              untranslatedTitle: 'Selling Plans Ski Wax',
                            },
                            {
                              id: '41327143125105',
                              image: {
                                src: '//store.myshopify.com/cdn/shop/files/Main_b9e0da7f-db89-4d41-83f0-7f417b02831d.jpg?v=1724736597',
                              },
                              price: {
                                amount: 2629.95,
                                currencyCode: 'USD',
                              },
                              product: {
                                id: '7234590703729',
                                title: 'The 3p Fulfilled Snowboard',
                                type: 'snowboard',
                                untranslatedTitle: 'The 3p Fulfilled Snowboard',
                                url: '/products/the-3p-fulfilled-snowboard',
                                vendor: 'pixel-testing-rs',
                              },
                              sku: 'sku-hosted-1',
                              title: 'Default Title',
                              untranslatedTitle: 'Default Title',
                            },
                          ],
                          title: 'Products',
                        },
                      },
                      id: 'sh-f6f0c6be-43F8-47D2-5F94-C22AD5ED3E79',
                      name: 'collection_viewed',
                      timestamp: '2024-09-15T18:27:39.197Z',
                      type: 'standard',
                    },
                    topic: 'collection_viewed',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  type: 'track',
                  userId: 'test-user-id',
                  event: 'Product List Viewed',
                  properties: {
                    cart_id: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                    list_id: 'sh-f6f0c6be-43F8-47D2-5F94-C22AD5ED3E79',
                    products: [
                      {
                        price: 10,
                        sku: '',
                        image_url:
                          '//store.myshopify.com/cdn/shop/files/gift_card.png?v=1724736596',
                        product_id: '7234590605425',
                        variant: 'Gift Card',
                        category: 'giftcard',
                        url: '/products/gift-card',
                        brand: 'Snowboard Vendor',
                        name: '$10',
                      },
                      {
                        price: 24.95,
                        sku: '',
                        image_url:
                          '//store.myshopify.com/cdn/shop/files/snowboard_wax.png?v=1724736599',
                        product_id: '7234590802033',
                        variant: 'Selling Plans Ski Wax',
                        category: 'accessories',
                        url: '/products/selling-plans-ski-wax',
                        brand: 'pixel-testing-rs',
                        name: 'Selling Plans Ski Wax',
                      },
                      {
                        price: 2629.95,
                        sku: 'sku-hosted-1',
                        image_url:
                          '//store.myshopify.com/cdn/shop/files/Main_b9e0da7f-db89-4d41-83f0-7f417b02831d.jpg?v=1724736597',
                        product_id: '7234590703729',
                        variant: 'The 3p Fulfilled Snowboard',
                        category: 'snowboard',
                        url: '/products/the-3p-fulfilled-snowboard',
                        brand: 'pixel-testing-rs',
                        name: 'Default Title',
                      },
                    ],
                  },
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  messageId: 'sh-f6f0c6be-43F8-47D2-5F94-C22AD5ED3E79',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'shopify',
    description: 'Track Call -> product_added_to_cart event from web pixel',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              id: 'sh-f6f828db-F77B-43E8-96C4-1D51DACD52A3',
              name: 'product_added_to_cart',
              data: {
                cartLine: {
                  cost: {
                    totalAmount: {
                      amount: 749.95,
                      currencyCode: 'USD',
                    },
                  },
                  merchandise: {
                    id: '41327143321713',
                    image: {
                      src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
                    },
                    price: {
                      amount: 749.95,
                      currencyCode: 'USD',
                    },
                    product: {
                      id: '7234590834801',
                      title: 'The Collection Snowboard: Liquid',
                      vendor: 'Hydrogen Vendor',
                      type: 'snowboard',
                      untranslatedTitle: 'The Collection Snowboard: Liquid',
                      url: '/products/the-collection-snowboard-liquid?variant=41327143321713',
                    },
                    sku: '',
                    title: null,
                    untranslatedTitle: null,
                  },
                  quantity: 1,
                },
              },
              type: 'standard',
              clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
              timestamp: '2024-09-15T18:34:42.625Z',
              context: dummyContext,
              pixelEventLabel: true,
              query_parameters: {
                topic: ['carts_update'],
                writeKey: ['dummy-write-key'],
              },
            },
            source: dummySourceConfig,
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    ...responseDummyContext,
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                      data: {
                        cartLine: {
                          cost: {
                            totalAmount: {
                              amount: 749.95,
                              currencyCode: 'USD',
                            },
                          },
                          merchandise: {
                            id: '41327143321713',
                            image: {
                              src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
                            },
                            price: {
                              amount: 749.95,
                              currencyCode: 'USD',
                            },
                            product: {
                              id: '7234590834801',
                              title: 'The Collection Snowboard: Liquid',
                              type: 'snowboard',
                              untranslatedTitle: 'The Collection Snowboard: Liquid',
                              url: '/products/the-collection-snowboard-liquid?variant=41327143321713',
                              vendor: 'Hydrogen Vendor',
                            },
                            sku: '',
                            title: null,
                            untranslatedTitle: null,
                          },
                          quantity: 1,
                        },
                      },
                      id: 'sh-f6f828db-F77B-43E8-96C4-1D51DACD52A3',
                      name: 'product_added_to_cart',
                      timestamp: '2024-09-15T18:34:42.625Z',
                      type: 'standard',
                    },
                    topic: 'product_added_to_cart',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  type: 'track',
                  userId: 'test-user-id',
                  event: 'Product Added',
                  properties: {
                    image_url:
                      'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
                    price: 749.95,
                    product_id: '7234590834801',
                    variant: 'The Collection Snowboard: Liquid',
                    category: 'snowboard',
                    brand: 'Hydrogen Vendor',
                    url: '/products/the-collection-snowboard-liquid?variant=41327143321713',
                    sku: '',
                    name: null,
                    quantity: 1,
                  },
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  messageId: 'sh-f6f828db-F77B-43E8-96C4-1D51DACD52A3',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'shopify',
    description: 'Track Call -> product_removed_from_cart event from web pixel',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              id: 'shu-f778d1eb-9B83-4832-9DC0-5C3B33A809F0',
              name: 'product_removed_from_cart',
              data: {
                cartLine: {
                  cost: {
                    totalAmount: {
                      amount: 749.95,
                      currencyCode: 'USD',
                    },
                  },
                  merchandise: {
                    id: '41327143321713',
                    image: {
                      src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
                    },
                    price: {
                      amount: 749.95,
                      currencyCode: 'USD',
                    },
                    product: {
                      id: '7234590834801',
                      title: 'The Collection Snowboard: Liquid',
                      vendor: 'Hydrogen Vendor',
                      type: 'snowboard',
                      untranslatedTitle: 'The Collection Snowboard: Liquid',
                      url: '/products/the-collection-snowboard-liquid?variant=41327143321713',
                    },
                    sku: '',
                    title: null,
                    untranslatedTitle: null,
                  },
                  quantity: 1,
                },
              },
              type: 'standard',
              clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
              timestamp: '2024-09-15T20:56:00.125Z',
              context: dummyContext,
              pixelEventLabel: true,
              query_parameters: {
                topic: ['carts_update'],
                writeKey: ['dummy-write-key'],
              },
            },
            source: dummySourceConfig,
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    ...responseDummyContext,
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                      data: {
                        cartLine: {
                          cost: {
                            totalAmount: {
                              amount: 749.95,
                              currencyCode: 'USD',
                            },
                          },
                          merchandise: {
                            id: '41327143321713',
                            image: {
                              src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
                            },
                            price: {
                              amount: 749.95,
                              currencyCode: 'USD',
                            },
                            product: {
                              id: '7234590834801',
                              title: 'The Collection Snowboard: Liquid',
                              type: 'snowboard',
                              untranslatedTitle: 'The Collection Snowboard: Liquid',
                              url: '/products/the-collection-snowboard-liquid?variant=41327143321713',
                              vendor: 'Hydrogen Vendor',
                            },
                            sku: '',
                            title: null,
                            untranslatedTitle: null,
                          },
                          quantity: 1,
                        },
                      },
                      id: 'shu-f778d1eb-9B83-4832-9DC0-5C3B33A809F0',
                      name: 'product_removed_from_cart',
                      timestamp: '2024-09-15T20:56:00.125Z',
                      type: 'standard',
                    },
                    topic: 'product_removed_from_cart',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  type: 'track',
                  userId: 'test-user-id',
                  event: 'Product Removed',
                  properties: {
                    image_url:
                      'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
                    price: 749.95,
                    product_id: '7234590834801',
                    variant: 'The Collection Snowboard: Liquid',
                    category: 'snowboard',
                    brand: 'Hydrogen Vendor',
                    url: '/products/the-collection-snowboard-liquid?variant=41327143321713',
                    sku: '',
                    name: null,
                    quantity: 1,
                  },
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  messageId: 'shu-f778d1eb-9B83-4832-9DC0-5C3B33A809F0',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'shopify',
    description: 'Track Call -> search_submitted event from web pixel',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              id: 'sh-f7d599b4-D80F-4D05-C4CE-B980D5444596',
              name: 'search_submitted',
              data: {
                searchResult: {
                  query: 'skate',
                  productVariants: [],
                },
              },
              type: 'standard',
              clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
              timestamp: '2024-09-15T22:37:35.869Z',
              context: dummyContext,
              pixelEventLabel: true,
              query_parameters: {
                topic: ['search_submitted'],
                writeKey: ['dummy-write-key'],
              },
            },
            source: dummySourceConfig,
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    ...responseDummyContext,
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                      data: {
                        searchResult: {
                          productVariants: [],
                          query: 'skate',
                        },
                      },
                      id: 'sh-f7d599b4-D80F-4D05-C4CE-B980D5444596',
                      name: 'search_submitted',
                      timestamp: '2024-09-15T22:37:35.869Z',
                      type: 'standard',
                    },
                    topic: 'search_submitted',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  type: 'track',
                  userId: 'test-user-id',
                  event: 'Search Submitted',
                  properties: {
                    query: 'skate',
                  },
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  messageId: 'sh-f7d599b4-D80F-4D05-C4CE-B980D5444596',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'shopify',
    description: 'Track Call -> unknown event from web pixel, should not be sent to Shopify',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              id: 'sh-f7d599b4-D80F-4D05-C4CE-B980D5444596',
              name: 'unknown_event',
              data: {
                searchResult: {
                  query: 'skate',
                  productVariants: [],
                },
              },
              type: 'standard',
              clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
              timestamp: '2024-09-15T22:37:35.869Z',
              context: dummyContext,
              pixelEventLabel: true,
              query_parameters: {
                topic: ['search_submitted'],
                writeKey: ['dummy-write-key'],
              },
            },
            source: dummySourceConfig,
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            outputToSource: {
              body: 'T0s=',
              contentType: 'text/plain',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
].map((p1) => ({ ...p1, mockFns }));
