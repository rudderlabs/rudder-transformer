import { dummySourceConfig, dummyContext } from '../constants';

export const newpixelCheckoutStepsScenarios = [
  {
    name: 'shopify',
    description: 'Track Call -> address_info_submitted event from web pixel',
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
                name: 'checkout_address_info_submitted',
                clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                data: {
                  checkout: {
                    buyerAcceptsEmailMarketing: false,
                    buyerAcceptsSmsMarketing: false,
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
                    token: '5f7028e0bd5225c17b24bdaa0c09f914',
                    currencyCode: 'USD',
                    discountApplications: [],
                    discountsAmount: {
                      amount: 0,
                      currencyCode: 'USD',
                    },
                    email: 'test-user@sampleemail.com',
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
                      selectedDeliveryOptions: [
                        {
                          cost: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          costAfterDiscounts: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          description: null,
                          handle:
                            '5f7028e0bd5225c17b24bdaa0c09f914-8388085074acab7e91de633521be86f0',
                          title: 'Economy',
                          type: 'shipping',
                        },
                      ],
                    },
                    shippingAddress: {
                      address1: 'Queens Center',
                      address2: null,
                      city: 'Elmhurst',
                      country: 'US',
                      countryCode: 'US',
                      firstName: 'test',
                      lastName: 'user',
                      phone: null,
                      province: 'NY',
                      provinceCode: 'NY',
                      zip: '11373',
                    },
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
                id: 'sh-f7d2154d-7525-47A4-87FA-E54D2322E129',
                timestamp: '2024-09-15T21:45:50.523Z',
                context: dummyContext,
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
                  event: 'Checkout Address Info Submitted',
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  properties: {
                    checkout_id: '5f7028e0bd5225c17b24bdaa0c09f914',
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
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
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
                            selectedDeliveryOptions: [
                              {
                                cost: {
                                  amount: 0,
                                  currencyCode: 'USD',
                                },
                                costAfterDiscounts: {
                                  amount: 0,
                                  currencyCode: 'USD',
                                },
                                description: null,
                                handle:
                                  '5f7028e0bd5225c17b24bdaa0c09f914-8388085074acab7e91de633521be86f0',
                                title: 'Economy',
                                type: 'shipping',
                              },
                            ],
                          },
                          discountApplications: [],
                          discountsAmount: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          email: 'test-user@sampleemail.com',
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
                            address1: 'Queens Center',
                            address2: null,
                            city: 'Elmhurst',
                            country: 'US',
                            countryCode: 'US',
                            firstName: 'test',
                            lastName: 'user',
                            phone: null,
                            province: 'NY',
                            provinceCode: 'NY',
                            zip: '11373',
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
                      context: dummyContext,
                      id: 'sh-f7d2154d-7525-47A4-87FA-E54D2322E129',
                      name: 'checkout_address_info_submitted',
                      timestamp: '2024-09-15T21:45:50.523Z',
                      type: 'standard',
                    },
                    topic: 'checkout_address_info_submitted',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  timestamp: '2024-09-15T21:45:50.523Z',
                  messageId: 'sh-f7d2154d-7525-47A4-87FA-E54D2322E129',
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
    description: 'Track Call -> contact_info_submitted event from web pixel',
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
                name: 'checkout_contact_info_submitted',
                clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                data: {
                  checkout: {
                    buyerAcceptsEmailMarketing: false,
                    buyerAcceptsSmsMarketing: false,
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
                    token: '5f7028e0bd5225c17b24bdaa0c09f914',
                    currencyCode: 'USD',
                    discountApplications: [],
                    discountsAmount: {
                      amount: 0,
                      currencyCode: 'USD',
                    },
                    email: 'test-user@sampleemail.com',
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
                id: 'sh-f7c8416f-1D35-4304-EF29-78666678C4E9',
                timestamp: '2024-09-15T21:40:28.498Z',
                context: dummyContext,
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
                  event: 'Checkout Contact Info Submitted',
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  properties: {
                    checkout_id: '5f7028e0bd5225c17b24bdaa0c09f914',
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
                    shopifyDetails: {
                      clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
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
                          email: 'test-user@sampleemail.com',
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
                      context: dummyContext,
                      id: 'sh-f7c8416f-1D35-4304-EF29-78666678C4E9',
                      name: 'checkout_contact_info_submitted',
                      timestamp: '2024-09-15T21:40:28.498Z',
                      type: 'standard',
                    },
                    topic: 'checkout_contact_info_submitted',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  timestamp: '2024-09-15T21:40:28.498Z',
                  messageId: 'sh-f7c8416f-1D35-4304-EF29-78666678C4E9',
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
    description: 'Track Call -> shipping_info_submitted event from web pixel',
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
                clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                name: 'checkout_shipping_info_submitted',
                data: {
                  checkout: {
                    buyerAcceptsEmailMarketing: false,
                    buyerAcceptsSmsMarketing: false,
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
                    token: '5f7028e0bd5225c17b24bdaa0c09f914',
                    currencyCode: 'USD',
                    discountApplications: [],
                    discountsAmount: {
                      amount: 0,
                      currencyCode: 'USD',
                    },
                    email: 'test-user@sampleemail.com',
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
                      selectedDeliveryOptions: [
                        {
                          cost: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          costAfterDiscounts: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          description: null,
                          handle:
                            '5f7028e0bd5225c17b24bdaa0c09f914-8388085074acab7e91de633521be86f0',
                          title: 'Economy',
                          type: 'shipping',
                        },
                      ],
                    },
                    shippingAddress: {
                      address1: 'Queens Center',
                      address2: null,
                      city: 'Elmhurst',
                      country: 'US',
                      countryCode: 'US',
                      firstName: 'test',
                      lastName: 'user',
                      phone: null,
                      province: 'NY',
                      provinceCode: 'NY',
                      zip: '11373',
                    },
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
                id: 'sh-f7d5618e-404A-4E6D-4662-599A4BCC9E7C',
                timestamp: '2024-09-15T21:47:38.576Z',
                context: dummyContext,
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
                  event: 'Checkout Shipping Info Submitted',
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  properties: {
                    checkout_id: '5f7028e0bd5225c17b24bdaa0c09f914',
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
                            selectedDeliveryOptions: [
                              {
                                cost: {
                                  amount: 0,
                                  currencyCode: 'USD',
                                },
                                costAfterDiscounts: {
                                  amount: 0,
                                  currencyCode: 'USD',
                                },
                                description: null,
                                handle:
                                  '5f7028e0bd5225c17b24bdaa0c09f914-8388085074acab7e91de633521be86f0',
                                title: 'Economy',
                                type: 'shipping',
                              },
                            ],
                          },
                          discountApplications: [],
                          discountsAmount: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          email: 'test-user@sampleemail.com',
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
                            address1: 'Queens Center',
                            address2: null,
                            city: 'Elmhurst',
                            country: 'US',
                            countryCode: 'US',
                            firstName: 'test',
                            lastName: 'user',
                            phone: null,
                            province: 'NY',
                            provinceCode: 'NY',
                            zip: '11373',
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
                      id: 'sh-f7d5618e-404A-4E6D-4662-599A4BCC9E7C',
                      name: 'checkout_shipping_info_submitted',
                      timestamp: '2024-09-15T21:47:38.576Z',
                      type: 'standard',
                    },
                    topic: 'checkout_shipping_info_submitted',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  timestamp: '2024-09-15T21:47:38.576Z',
                  messageId: 'sh-f7d5618e-404A-4E6D-4662-599A4BCC9E7C',
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
    description: 'Track Call -> payment_info_submitted event from web pixel',
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
                name: 'payment_info_submitted',
                clientId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                id: 'sh-f7d843ea-ED11-4A12-F32F-C5A45BED0413',
                data: {
                  checkout: {
                    buyerAcceptsEmailMarketing: false,
                    buyerAcceptsSmsMarketing: false,
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
                    token: '5f7028e0bd5225c17b24bdaa0c09f914',
                    currencyCode: 'USD',
                    discountApplications: [],
                    discountsAmount: {
                      amount: 0,
                      currencyCode: 'USD',
                    },
                    email: 'test-user@sampleemail.com',
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
                      selectedDeliveryOptions: [
                        {
                          cost: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          costAfterDiscounts: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          description: null,
                          handle:
                            '5f7028e0bd5225c17b24bdaa0c09f914-8388085074acab7e91de633521be86f0',
                          title: 'Economy',
                          type: 'shipping',
                        },
                      ],
                    },
                    shippingAddress: {
                      address1: 'Queens Center',
                      address2: null,
                      city: 'Elmhurst',
                      country: 'US',
                      countryCode: 'US',
                      firstName: 'test',
                      lastName: 'user',
                      phone: null,
                      province: 'NY',
                      provinceCode: 'NY',
                      zip: '11373',
                    },
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
                timestamp: '2024-09-15T21:49:13.092Z',
                context: dummyContext,
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
                  event: 'Payment Info Entered',
                  anonymousId: 'c7b3f99b-4d34-463b-835f-c879482a7750',
                  properties: {
                    checkout_id: '5f7028e0bd5225c17b24bdaa0c09f914',
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
                            selectedDeliveryOptions: [
                              {
                                cost: {
                                  amount: 0,
                                  currencyCode: 'USD',
                                },
                                costAfterDiscounts: {
                                  amount: 0,
                                  currencyCode: 'USD',
                                },
                                description: null,
                                handle:
                                  '5f7028e0bd5225c17b24bdaa0c09f914-8388085074acab7e91de633521be86f0',
                                title: 'Economy',
                                type: 'shipping',
                              },
                            ],
                          },
                          discountApplications: [],
                          discountsAmount: {
                            amount: 0,
                            currencyCode: 'USD',
                          },
                          email: 'test-user@sampleemail.com',
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
                            address1: 'Queens Center',
                            address2: null,
                            city: 'Elmhurst',
                            country: 'US',
                            countryCode: 'US',
                            firstName: 'test',
                            lastName: 'user',
                            phone: null,
                            province: 'NY',
                            provinceCode: 'NY',
                            zip: '11373',
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
                      id: 'sh-f7d843ea-ED11-4A12-F32F-C5A45BED0413',
                      name: 'payment_info_submitted',
                      timestamp: '2024-09-15T21:49:13.092Z',
                      type: 'standard',
                    },
                    topic: 'payment_info_submitted',
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  timestamp: '2024-09-15T21:49:13.092Z',
                  messageId: 'sh-f7d843ea-ED11-4A12-F32F-C5A45BED0413',
                },
              ],
            },
          },
        ],
      },
    },
  },
];
