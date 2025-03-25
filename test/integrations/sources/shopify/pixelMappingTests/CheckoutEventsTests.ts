// This file contains the test scenarios for the pixel checkout events
import { dummySourceConfig, dummyBillingAddresses, dummyContext } from '../constants';

export const newpixelCheckoutEventsTestScenarios = [
  {
    name: 'shopify',
    description: 'Track Call -> [ECOM] checkout_started event from web pixel',
    module: 'source',
    skip: true,
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                type: 'standard',
                name: 'checkout_started',
                clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                data: {
                  checkout: {
                    buyerAcceptsEmailMarketing: false,
                    buyerAcceptsSmsMarketing: false,
                    attributes: [],
                    billingAddress: dummyBillingAddresses[0],
                    token: '5f7028e0bd5225c17b24bdaa0c09f914',
                    currencyCode: 'USD',
                    discountApplications: [],
                    discountsAmount: {
                      amount: 0,
                      currencyCode: 'USD',
                    },
                    email: '',
                    phone: '',
                    lineItems: [
                      {
                        discountAllocations: [],
                        id: '41327143321713',
                        quantity: 2,
                        title: 'The Collection Snowboard: Liquid',
                        variant: {
                          id: '41327143321713',
                          image: {
                            src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6_64x64.jpg?v=1724736600',
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
                            url: '/products/the-collection-snowboard-liquid',
                          },
                          sku: null,
                          title: null,
                          untranslatedTitle: null,
                        },
                        finalLinePrice: {
                          amount: 1499.9,
                          currencyCode: 'USD',
                        },
                        sellingPlanAllocation: null,
                        properties: [],
                      },
                    ],
                    localization: {
                      country: {
                        isoCode: 'US',
                      },
                      language: {
                        isoCode: 'en-US',
                      },
                      market: {
                        id: 'gid://shopify/Market/23505895537',
                        handle: 'us',
                      },
                    },
                    order: {
                      id: null,
                      customer: {
                        id: null,
                        isFirstOrder: null,
                      },
                    },
                    delivery: {
                      selectedDeliveryOptions: [],
                    },
                    shippingAddress: dummyBillingAddresses[0],
                    subtotalPrice: {
                      amount: 2759.8,
                      currencyCode: 'USD',
                    },
                    shippingLine: {
                      price: {
                        amount: 0,
                        currencyCode: 'USD',
                      },
                    },
                    smsMarketingPhone: null,
                    totalTax: {
                      amount: 0,
                      currencyCode: 'USD',
                    },
                    totalPrice: {
                      amount: 2759.8,
                      currencyCode: 'USD',
                    },
                    transactions: [],
                  },
                },
                id: 'sh-f77a78f1-C1D8-4ED4-9C9B-0D352CF6F3BF',
                context: dummyContext,
                timestamp: '2024-09-15T20:57:59.674Z',
                pixelEventLabel: true,
              }),
              query_parameters: {
                topic: ['checkouts_update'],
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
                  type: 'track',
                  event: 'Checkout Started',
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  properties: {
                    products: [
                      {
                        quantity: 2,
                        variant: 'The Collection Snowboard: Liquid',
                        name: 'The Collection Snowboard: Liquid',
                        image_url:
                          'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6_64x64.jpg?v=1724736600',
                        price: 749.95,
                        product_id: '7234590834801',
                        category: 'snowboard',
                        url: '/products/the-collection-snowboard-liquid',
                        brand: 'Hydrogen Vendor',
                      },
                    ],
                    checkout_id: '5f7028e0bd5225c17b24bdaa0c09f914',
                    total: 2759.8,
                    currency: 'USD',
                    discount: 0,
                    shipping: 0,
                    revenue: 2759.8,
                    value: 2759.8,
                    tax: 0,
                  },
                  context: {
                    page: {
                      title: 'Checkout - pixel-testing-rs',
                      url: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                      path: '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                      search: '',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                    screen: {
                      height: 1117,
                      width: 1728,
                    },
                    library: {
                      name: 'RudderStack Shopify Cloud',
                      eventOrigin: 'client',
                      version: '2.0.0',
                    },
                    topic: 'checkout_started',
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                      context: dummyContext,
                      data: {
                        checkout: {
                          attributes: [],
                          billingAddress: {
                            address1: null,
                            address2: null,
                            city: null,
                            country: 'US',
                            countryCode: 'US',
                            firstName: null,
                            lastName: null,
                            phone: null,
                            province: null,
                            provinceCode: null,
                            zip: null,
                          },
                          buyerAcceptsEmailMarketing: false,
                          buyerAcceptsSmsMarketing: false,
                          currencyCode: 'USD',
                          delivery: {
                            selectedDeliveryOptions: [],
                          },
                          discountApplications: [],
                          discountsAmount: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          email: '',
                          lineItems: [
                            {
                              discountAllocations: [],
                              finalLinePrice: {
                                amount: 1499.9,
                                currencyCode: 'USD',
                              },
                              id: '41327143321713',
                              properties: [],
                              quantity: 2,
                              sellingPlanAllocation: null,
                              title: 'The Collection Snowboard: Liquid',
                              variant: {
                                id: '41327143321713',
                                image: {
                                  src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6_64x64.jpg?v=1724736600',
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
                                sku: null,
                                title: null,
                                untranslatedTitle: null,
                              },
                            },
                          ],
                          localization: {
                            country: {
                              isoCode: 'US',
                            },
                            language: {
                              isoCode: 'en-US',
                            },
                            market: {
                              handle: 'us',
                              id: 'gid://shopify/Market/23505895537',
                            },
                          },
                          order: {
                            customer: {
                              id: null,
                              isFirstOrder: null,
                            },
                            id: null,
                          },
                          phone: '',
                          shippingAddress: {
                            address1: null,
                            address2: null,
                            city: null,
                            country: 'US',
                            countryCode: 'US',
                            firstName: null,
                            lastName: null,
                            phone: null,
                            province: null,
                            provinceCode: null,
                            zip: null,
                          },
                          shippingLine: {
                            price: {
                              amount: 0,
                              currencyCode: 'USD',
                            },
                          },
                          smsMarketingPhone: null,
                          subtotalPrice: {
                            amount: 2759.8,
                            currencyCode: 'USD',
                          },
                          token: '5f7028e0bd5225c17b24bdaa0c09f914',
                          totalPrice: {
                            amount: 2759.8,
                            currencyCode: 'USD',
                          },
                          totalTax: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          transactions: [],
                        },
                      },
                      id: 'sh-f77a78f1-C1D8-4ED4-9C9B-0D352CF6F3BF',
                      name: 'checkout_started',
                      timestamp: '2024-09-15T20:57:59.674Z',
                      type: 'standard',
                    },
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  timestamp: '2024-09-15T20:57:59.674Z',
                  messageId: 'sh-f77a78f1-C1D8-4ED4-9C9B-0D352CF6F3BF',
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
    description: 'Track Call -> [ECOM] checkout_completed event from web pixel',
    module: 'source',
    skip: true,
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                type: 'standard',
                name: 'checkout_completed',
                clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                data: {
                  checkout: {
                    buyerAcceptsEmailMarketing: false,
                    buyerAcceptsSmsMarketing: false,
                    attributes: [],
                    billingAddress: dummyBillingAddresses[0],
                    token: '5f7028e0bd5225c17b24bdaa0c09f914',
                    currencyCode: 'USD',
                    discountApplications: [],
                    discountsAmount: {
                      amount: 0,
                      currencyCode: 'USD',
                    },
                    email: '',
                    phone: '',
                    lineItems: [
                      {
                        discountAllocations: [],
                        id: '41327143321713',
                        quantity: 2,
                        title: 'The Collection Snowboard: Liquid',
                        variant: {
                          id: '41327143321713',
                          image: {
                            src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6_64x64.jpg?v=1724736600',
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
                            url: '/products/the-collection-snowboard-liquid',
                          },
                        },
                        finalLinePrice: {
                          amount: 1499.9,
                          currencyCode: 'USD',
                        },
                        properties: [],
                      },
                      {
                        discountAllocations: [],
                        id: '41327143157873',
                        quantity: 2,
                        title: 'The Multi-managed Snowboard',
                        variant: {
                          id: '41327143157873',
                          image: {
                            src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a_64x64.jpg?v=1724736597',
                          },
                          price: {
                            amount: 629.95,
                            currencyCode: 'USD',
                          },
                          product: {
                            id: '7234590736497',
                            title: 'The Multi-managed Snowboard',
                            vendor: 'Multi-managed Vendor',
                            type: 'snowboard',
                            untranslatedTitle: 'The Multi-managed Snowboard',
                            url: '/products/the-multi-managed-snowboard',
                          },
                          sku: 'sku-managed-1',
                          title: null,
                          untranslatedTitle: null,
                        },
                        finalLinePrice: {
                          amount: 1259.9,
                          currencyCode: 'USD',
                        },
                        sellingPlanAllocation: null,
                        properties: [],
                      },
                    ],
                    localization: {
                      country: {
                        isoCode: 'US',
                      },
                      language: {
                        isoCode: 'en-US',
                      },
                      market: {
                        id: 'gid://shopify/Market/23505895537',
                        handle: 'us',
                      },
                    },
                    order: {
                      id: null,
                      customer: {
                        id: null,
                        isFirstOrder: null,
                      },
                    },
                    delivery: {
                      selectedDeliveryOptions: [],
                    },
                    shippingAddress: dummyBillingAddresses[0],
                    subtotalPrice: {
                      amount: 2759.8,
                      currencyCode: 'USD',
                    },
                    shippingLine: {
                      price: {
                        amount: 0,
                        currencyCode: 'USD',
                      },
                    },
                    smsMarketingPhone: null,
                    totalTax: {
                      amount: 0,
                      currencyCode: 'USD',
                    },
                    totalPrice: {
                      amount: 2759.8,
                      currencyCode: 'USD',
                    },
                    transactions: [],
                  },
                },
                id: 'sh-f77a78f1-C1D8-4ED4-9C9B-0D352CF6F3BF',
                context: dummyContext,
                timestamp: '2024-09-15T20:57:59.674Z',
                pixelEventLabel: true,
              }),
              query_parameters: {
                topic: ['checkouts_update'],
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
                  type: 'track',
                  event: 'Order Completed',
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  properties: {
                    products: [
                      {
                        quantity: 2,
                        variant: 'The Collection Snowboard: Liquid',
                        name: 'The Collection Snowboard: Liquid',
                        image_url:
                          'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6_64x64.jpg?v=1724736600',
                        price: 749.95,
                        product_id: '7234590834801',
                        category: 'snowboard',
                        url: '/products/the-collection-snowboard-liquid',
                        brand: 'Hydrogen Vendor',
                      },
                      {
                        quantity: 2,
                        variant: 'The Multi-managed Snowboard',
                        name: 'The Multi-managed Snowboard',
                        image_url:
                          'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a_64x64.jpg?v=1724736597',
                        price: 629.95,
                        sku: 'sku-managed-1',
                        product_id: '7234590736497',
                        category: 'snowboard',
                        url: '/products/the-multi-managed-snowboard',
                        brand: 'Multi-managed Vendor',
                      },
                    ],
                    checkout_id: '5f7028e0bd5225c17b24bdaa0c09f914',
                    total: 2759.8,
                    currency: 'USD',
                    discount: 0,
                    shipping: 0,
                    revenue: 2759.8,
                    value: 2759.8,
                    tax: 0,
                  },
                  context: {
                    page: {
                      title: 'Checkout - pixel-testing-rs',
                      url: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                      path: '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                      search: '',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                    screen: {
                      height: 1117,
                      width: 1728,
                    },
                    library: {
                      name: 'RudderStack Shopify Cloud',
                      eventOrigin: 'client',
                      version: '2.0.0',
                    },
                    topic: 'checkout_completed',
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                      context: {
                        document: {
                          characterSet: 'UTF-8',
                          location: {
                            hash: '',
                            host: 'store.myshopify.com',
                            hostname: 'store.myshopify.com',
                            href: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                            origin: 'https://store.myshopify.com',
                            pathname:
                              '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                            port: '',
                            protocol: 'https:',
                            search: '',
                          },
                          referrer: 'https://store.myshopify.com/cart',
                          title: 'Checkout - pixel-testing-rs',
                        },
                        navigator: {
                          cookieEnabled: true,
                          language: 'en-US',
                          languages: ['en-US', 'en'],
                          userAgent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                        },
                        window: {
                          innerHeight: 1028,
                          innerWidth: 1362,
                          location: {
                            hash: '',
                            host: 'store.myshopify.com',
                            hostname: 'store.myshopify.com',
                            href: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                            origin: 'https://store.myshopify.com',
                            pathname:
                              '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
                            port: '',
                            protocol: 'https:',
                            search: '',
                          },
                          origin: 'https://store.myshopify.com',
                          outerHeight: 1080,
                          outerWidth: 1728,
                          pageXOffset: 0,
                          pageYOffset: 0,
                          screen: {
                            height: 1117,
                            width: 1728,
                          },
                          screenX: 0,
                          screenY: 37,
                          scrollX: 0,
                          scrollY: 0,
                        },
                      },
                      data: {
                        checkout: {
                          attributes: [],
                          billingAddress: {
                            address1: null,
                            address2: null,
                            city: null,
                            country: 'US',
                            countryCode: 'US',
                            firstName: null,
                            lastName: null,
                            phone: null,
                            province: null,
                            provinceCode: null,
                            zip: null,
                          },
                          buyerAcceptsEmailMarketing: false,
                          buyerAcceptsSmsMarketing: false,
                          currencyCode: 'USD',
                          delivery: {
                            selectedDeliveryOptions: [],
                          },
                          discountApplications: [],
                          discountsAmount: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          email: '',
                          lineItems: [
                            {
                              discountAllocations: [],
                              finalLinePrice: {
                                amount: 1499.9,
                                currencyCode: 'USD',
                              },
                              id: '41327143321713',
                              properties: [],
                              quantity: 2,
                              title: 'The Collection Snowboard: Liquid',
                              variant: {
                                id: '41327143321713',
                                image: {
                                  src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6_64x64.jpg?v=1724736600',
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
                              },
                            },
                            {
                              discountAllocations: [],
                              finalLinePrice: {
                                amount: 1259.9,
                                currencyCode: 'USD',
                              },
                              id: '41327143157873',
                              properties: [],
                              quantity: 2,
                              sellingPlanAllocation: null,
                              title: 'The Multi-managed Snowboard',
                              variant: {
                                id: '41327143157873',
                                image: {
                                  src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a_64x64.jpg?v=1724736597',
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
                                title: null,
                                untranslatedTitle: null,
                              },
                            },
                          ],
                          localization: {
                            country: {
                              isoCode: 'US',
                            },
                            language: {
                              isoCode: 'en-US',
                            },
                            market: {
                              handle: 'us',
                              id: 'gid://shopify/Market/23505895537',
                            },
                          },
                          order: {
                            customer: {
                              id: null,
                              isFirstOrder: null,
                            },
                            id: null,
                          },
                          phone: '',
                          shippingAddress: {
                            address1: null,
                            address2: null,
                            city: null,
                            country: 'US',
                            countryCode: 'US',
                            firstName: null,
                            lastName: null,
                            phone: null,
                            province: null,
                            provinceCode: null,
                            zip: null,
                          },
                          shippingLine: {
                            price: {
                              amount: 0,
                              currencyCode: 'USD',
                            },
                          },
                          smsMarketingPhone: null,
                          subtotalPrice: {
                            amount: 2759.8,
                            currencyCode: 'USD',
                          },
                          token: '5f7028e0bd5225c17b24bdaa0c09f914',
                          totalPrice: {
                            amount: 2759.8,
                            currencyCode: 'USD',
                          },
                          totalTax: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          transactions: [],
                        },
                      },
                      id: 'sh-f77a78f1-C1D8-4ED4-9C9B-0D352CF6F3BF',
                      name: 'checkout_completed',
                      timestamp: '2024-09-15T20:57:59.674Z',
                      type: 'standard',
                    },
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  timestamp: '2024-09-15T20:57:59.674Z',
                  messageId: 'sh-f77a78f1-C1D8-4ED4-9C9B-0D352CF6F3BF',
                },
              ],
            },
          },
        ],
      },
    },
  },
];
