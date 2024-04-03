import { timestampMock } from '../mocks';
export const data = [
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  phone: 'alex@example.com',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Promotion Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gbraid: 'gbraid',
                wbraid: 'wbraid',
                externalAttributionCredit: 10,
                externalAttributionModel: 'externalAttributionModel',
                conversionCustomVariable: 'conversionCustomVariable',
                value: 'value',
                merchantId: '9876merchantId',
                feedCountryCode: 'feedCountryCode',
                feedLanguageCode: 'feedLanguageCode',
                localTransactionCost: 20,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: '2',
                    price: '50',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                ],
                userIdentifierSource: 'FIRST_PARTY',
                conversionEnvironment: 'WEB',
                gclid: 'gclid',
                conversionValue: '1',
                currency: 'GBP',
                orderId: 'PL-123QR',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  gbraid: 'gbraid',
                  wbraid: 'wbraid',
                  externalAttributionCredit: 10,
                  externalAttributionModel: 'externalAttributionModel',
                  conversionCustomVariable: 'conversionCustomVariable',
                  value: 'value',
                  merchantId: '9876merchantId',
                  feedCountryCode: 'feedCountryCode',
                  feedLanguageCode: 'feedLanguageCode',
                  localTransactionCost: 20,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      quantity: '2',
                      price: '50',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                  ],
                  userIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'WEB',
                  gclid: 'gclid',
                  conversionValue: '1',
                  currency: 'GBP',
                  orderId: 'PL-123QR',
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      gbraid: 'gbraid',
                      wbraid: 'wbraid',
                      externalAttributionData: {
                        externalAttributionCredit: 10,
                        externalAttributionModel: 'externalAttributionModel',
                      },
                      cartData: {
                        merchantId: 9876,
                        feedCountryCode: 'feedCountryCode',
                        feedLanguageCode: 'feedLanguageCode',
                        localTransactionCost: 20,
                        items: [
                          {
                            productId: '507f1f77bcf86cd799439011',
                            quantity: 2,
                            unitPrice: 50,
                          },
                        ],
                      },
                      userIdentifiers: [
                        {
                          userIdentifierSource: 'FIRST_PARTY',
                          hashedPhoneNumber:
                            '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                        },
                      ],
                      conversionEnvironment: 'WEB',
                      gclid: 'gclid',
                      conversionDateTime: '2019-10-14 16:45:18+05:30',
                      conversionValue: 1,
                      currencyCode: 'GBP',
                      orderId: 'PL-123QR',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: timestampMock,
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Promotion Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              timestamp: 1675692865495,
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gbraid: 'gbraid',
                wbraid: 'wbraid',
                externalAttributionCredit: 10,
                externalAttributionModel: 'externalAttributionModel',
                conversionCustomVariable: 'conversionCustomVariable',
                value: 'value',
                merchantId: '9876merchantId',
                feedCountryCode: 'feedCountryCode',
                feedLanguageCode: 'feedLanguageCode',
                localTransactionCost: 20,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: '2',
                    price: '50',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                ],
                userIdentifierSource: 'FIRST_PARTY',
                conversionEnvironment: 'WEB',
                gclid: 'gclid',
                conversionValue: '1',
                currency: 'GBP',
                orderId: 'PL-123QR',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  gbraid: 'gbraid',
                  wbraid: 'wbraid',
                  externalAttributionCredit: 10,
                  externalAttributionModel: 'externalAttributionModel',
                  conversionCustomVariable: 'conversionCustomVariable',
                  value: 'value',
                  merchantId: '9876merchantId',
                  feedCountryCode: 'feedCountryCode',
                  feedLanguageCode: 'feedLanguageCode',
                  localTransactionCost: 20,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      quantity: '2',
                      price: '50',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                  ],
                  userIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'WEB',
                  gclid: 'gclid',
                  conversionValue: '1',
                  currency: 'GBP',
                  orderId: 'PL-123QR',
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      gbraid: 'gbraid',
                      wbraid: 'wbraid',
                      externalAttributionData: {
                        externalAttributionCredit: 10,
                        externalAttributionModel: 'externalAttributionModel',
                      },
                      cartData: {
                        merchantId: 9876,
                        feedCountryCode: 'feedCountryCode',
                        feedLanguageCode: 'feedLanguageCode',
                        localTransactionCost: 20,
                        items: [
                          {
                            productId: '507f1f77bcf86cd799439011',
                            quantity: 2,
                            unitPrice: 50,
                          },
                        ],
                      },
                      userIdentifiers: [
                        {
                          userIdentifierSource: 'FIRST_PARTY',
                          hashedEmail:
                            '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                        },
                      ],
                      conversionEnvironment: 'WEB',
                      gclid: 'gclid',
                      conversionDateTime: '2023-02-06 19:44:25+05:30',
                      conversionValue: 1,
                      currencyCode: 'GBP',
                      orderId: 'PL-123QR',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: (_) => timestampMock(_, '2023-02-06 19:44:25+05:30'),
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'sign up completed',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              type: 'track',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gbraid: 'gbraid',
                wbraid: 'wbraid',
                externalAttributionCredit: 10,
                externalAttributionModel: 'externalAttributionModel',
                conversionCustomVariable: 'conversionCustomVariable',
                value: '10',
                orderId: 'PL-123QR',
                merchantId: '123123Mpowi',
                feedCountryCode: 'feedCountryCode',
                feedLanguageCode: 'feedLanguageCode',
                localTransactionCost: 20,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: '2',
                    price: '50',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                ],
                gclid: 'gclid',
                conversionAction: 'customer',
                conversionValue: '1',
                currency: 'GBP',
                total: 555,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  gbraid: 'gbraid',
                  wbraid: 'wbraid',
                  externalAttributionCredit: 10,
                  externalAttributionModel: 'externalAttributionModel',
                  conversionCustomVariable: 'conversionCustomVariable',
                  value: '10',
                  orderId: 'PL-123QR',
                  merchantId: '123123Mpowi',
                  feedCountryCode: 'feedCountryCode',
                  feedLanguageCode: 'feedLanguageCode',
                  localTransactionCost: 20,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      quantity: '2',
                      price: '50',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                  ],
                  gclid: 'gclid',
                  conversionAction: 'customer',
                  conversionValue: '1',
                  currency: 'GBP',
                  total: 555,
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      gbraid: 'gbraid',
                      wbraid: 'wbraid',
                      externalAttributionData: {
                        externalAttributionCredit: 10,
                        externalAttributionModel: 'externalAttributionModel',
                      },
                      cartData: {
                        merchantId: 123123,
                        feedCountryCode: 'feedCountryCode',
                        feedLanguageCode: 'feedLanguageCode',
                        localTransactionCost: 20,
                        items: [
                          {
                            productId: '507f1f77bcf86cd799439011',
                            quantity: 2,
                            unitPrice: 50,
                          },
                        ],
                      },
                      gclid: 'gclid',
                      conversionDateTime: '2019-10-14 16:45:18+05:30',
                      conversionValue: 1,
                      currencyCode: 'GBP',
                      orderId: 'PL-123QR',
                      userIdentifiers: [
                        {
                          userIdentifierSource: 'THIRD_PARTY',
                          hashedEmail:
                            '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                        },
                      ],
                      conversionEnvironment: 'WEB',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: timestampMock,
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Product Searched',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                externalAttributionCredit: 10,
                externalAttributionModel: 'externalAttributionModel',
                merchantId: 'merchantId',
                feedCountryCode: 'feedCountryCode',
                feedLanguageCode: 'feedLanguageCode',
                localTransactionCost: 20,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: '2',
                    price: '50',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                ],
                userIdentifierSource: 'FIRST_PARTY',
                conversionEnvironment: 'WEB',
                gclid: 'gclid',
                conversionCustomVariable: 'conversionCustomVariable',
                value: 'value',
                callerId: 'callerId',
                callStartDateTime: '2022-08-28 15:01:30+05:30',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                conversionValue: '1',
                currency: 'GBP',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadCallConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
              },
              params: {
                event: 'search',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  externalAttributionCredit: 10,
                  externalAttributionModel: 'externalAttributionModel',
                  merchantId: 'merchantId',
                  feedCountryCode: 'feedCountryCode',
                  feedLanguageCode: 'feedLanguageCode',
                  localTransactionCost: 20,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      quantity: '2',
                      price: '50',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                  ],
                  userIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'WEB',
                  gclid: 'gclid',
                  conversionCustomVariable: 'conversionCustomVariable',
                  value: 'value',
                  callerId: 'callerId',
                  callStartDateTime: '2022-08-28 15:01:30+05:30',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                  conversionValue: '1',
                  currency: 'GBP',
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      callerId: 'callerId',
                      callStartDateTime: '2022-08-28 15:01:30+05:30',
                      conversionDateTime: '2022-01-01 12:32:45-08:00',
                      conversionValue: 1,
                      currencyCode: 'GBP',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Promotion Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gbraid: 'gbraid',
                wbraid: 'wbraid',
                externalAttributionCredit: 10,
                externalAttributionModel: 'externalAttributionModel',
                conversionCustomVariable: 'conversionCustomVariable',
                value: 'value',
                merchantId: 'merchantId',
                feedCountryCode: 'feedCountryCode',
                feedLanguageCode: 'feedLanguageCode',
                localTransactionCost: 20,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: '2',
                    price: '50',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                ],
                userIdentifierSource: 'FIRST_PARTY',
                conversionEnvironment: 'WEB',
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                conversionValue: '1',
                currency: 'GBP',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: null,
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: null,
            },
            statusCode: 500,
            error: 'OAuth - access token not found',
            statTags: {
              errorCategory: 'platform',
              errorType: 'oAuthSecret',
              destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Promotion Clicked',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gbraid: 'gbraid',
                wbraid: 'wbraid',
                externalAttributionCredit: 10,
                externalAttributionModel: 'externalAttributionModel',
                conversionCustomVariable: 'conversionCustomVariable',
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                conversionValue: '1',
                currency: 'GBP',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error: 'Message type is not present. Aborting message.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gbraid: 'gbraid',
                wbraid: 'wbraid',
                externalAttributionCredit: 10,
                externalAttributionModel: 'externalAttributionModel',
                conversionCustomVariable: 'conversionCustomVariable',
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                conversionValue: '1',
                currency: 'GBP',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error: 'Event name is not present',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'purchase',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gbraid: 'gbraid',
                wbraid: 'wbraid',
                externalAttributionCredit: 10,
                externalAttributionModel: 'externalAttributionModel',
                conversionCustomVariable: 'conversionCustomVariable',
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                conversionValue: '1',
                currency: 'GBP',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error: "Event name 'purchase' is not present in the mapping provided in the dashboard.",
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'download',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gbraid: 'gbraid',
                wbraid: 'wbraid',
                externalAttributionCredit: 10,
                externalAttributionModel: 'externalAttributionModel',
                conversionCustomVariable: 'conversionCustomVariable',
                value: 'value',
                merchantId: 'merchantId',
                feedCountryCode: 'feedCountryCode',
                feedLanguageCode: 'feedLanguageCode',
                localTransactionCost: 20,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: '2',
                    price: '50',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                ],
                userIdentifierSource: 'FIRST_PARTY',
                conversionEnvironment: 'WEB',
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                conversionValue: '1',
                currency: 'GBP',
                callerId: 'callerId',
                callStartDateTime: '2022-08-28 15:01:30+05:30',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'phone',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
              },
              params: {
                event: 'Page view',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  gbraid: 'gbraid',
                  wbraid: 'wbraid',
                  externalAttributionCredit: 10,
                  externalAttributionModel: 'externalAttributionModel',
                  conversionCustomVariable: 'conversionCustomVariable',
                  value: 'value',
                  merchantId: 'merchantId',
                  feedCountryCode: 'feedCountryCode',
                  feedLanguageCode: 'feedLanguageCode',
                  localTransactionCost: 20,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      quantity: '2',
                      price: '50',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                  ],
                  userIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'WEB',
                  gclid: 'gclid',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                  conversionValue: '1',
                  currency: 'GBP',
                  callerId: 'callerId',
                  callStartDateTime: '2022-08-28 15:01:30+05:30',
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      gbraid: 'gbraid',
                      wbraid: 'wbraid',
                      externalAttributionData: {
                        externalAttributionCredit: 10,
                        externalAttributionModel: 'externalAttributionModel',
                      },
                      cartData: {
                        feedCountryCode: 'feedCountryCode',
                        feedLanguageCode: 'feedLanguageCode',
                        localTransactionCost: 20,
                        items: [
                          {
                            productId: '507f1f77bcf86cd799439011',
                            quantity: 2,
                            unitPrice: 50,
                          },
                        ],
                      },
                      userIdentifiers: [
                        {
                          userIdentifierSource: 'FIRST_PARTY',
                          hashedPhoneNumber:
                            '04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd',
                        },
                      ],
                      conversionEnvironment: 'WEB',
                      gclid: 'gclid',
                      conversionDateTime: '2022-01-01 12:32:45-08:00',
                      conversionValue: 1,
                      currencyCode: 'GBP',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadCallConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
              },
              params: {
                event: 'Page view',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  gbraid: 'gbraid',
                  wbraid: 'wbraid',
                  externalAttributionCredit: 10,
                  externalAttributionModel: 'externalAttributionModel',
                  conversionCustomVariable: 'conversionCustomVariable',
                  value: 'value',
                  merchantId: 'merchantId',
                  feedCountryCode: 'feedCountryCode',
                  feedLanguageCode: 'feedLanguageCode',
                  localTransactionCost: 20,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      quantity: '2',
                      price: '50',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                  ],
                  userIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'WEB',
                  gclid: 'gclid',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                  conversionValue: '1',
                  currency: 'GBP',
                  callerId: 'callerId',
                  callStartDateTime: '2022-08-28 15:01:30+05:30',
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      callerId: 'callerId',
                      callStartDateTime: '2022-08-28 15:01:30+05:30',
                      conversionDateTime: '2022-01-01 12:32:45-08:00',
                      conversionValue: 1,
                      currencyCode: 'GBP',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {},
                traits: {
                  email: 'alex@example.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Promotion Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: true,
                loginCustomerId: '861-785-9087',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'phone',
                '': 'phone',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '8617859087',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  gclid: 'gclid',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      gclid: 'gclid',
                      conversionDateTime: '2022-01-01 12:32:45-08:00',
                      userIdentifiers: [
                        {
                          userIdentifierSource: 'THIRD_PARTY',
                          hashedEmail:
                            '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                        },
                      ],
                      conversionEnvironment: 'WEB',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {},
                traits: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Product Searched',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                callerId: 'callerId',
                callStartDateTime: '2022-08-28 15:01:30+05:30',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadCallConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
              },
              params: {
                event: 'search',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  callerId: 'callerId',
                  callStartDateTime: '2022-08-28 15:01:30+05:30',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      callerId: 'callerId',
                      callStartDateTime: '2022-08-28 15:01:30+05:30',
                      conversionDateTime: '2022-01-01 12:32:45-08:00',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Product Searched',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2022-09-20T03:20:04.000Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                externalAttributionCredit: 10,
                externalAttributionModel: 'externalAttributionModel',
                merchantId: 'merchantId',
                feedCountryCode: 'feedCountryCode',
                feedLanguageCode: 'feedLanguageCode',
                localTransactionCost: 20,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: '2',
                    price: '50',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                ],
                userIdentifierSource: 'FIRST_PARTY',
                conversionEnvironment: 'WEB',
                gclid: 'gclid',
                conversionCustomVariable: 'conversionCustomVariable',
                value: 'value',
                callerId: 'callerId',
                callStartDateTime: '2022-08-28 15:01:30+05:30',
                conversionValue: '1',
                currency: 'GBP',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadCallConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
              },
              params: {
                event: 'search',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  externalAttributionCredit: 10,
                  externalAttributionModel: 'externalAttributionModel',
                  merchantId: 'merchantId',
                  feedCountryCode: 'feedCountryCode',
                  feedLanguageCode: 'feedLanguageCode',
                  localTransactionCost: 20,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      quantity: '2',
                      price: '50',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                  ],
                  userIdentifierSource: 'FIRST_PARTY',
                  conversionEnvironment: 'WEB',
                  gclid: 'gclid',
                  conversionCustomVariable: 'conversionCustomVariable',
                  value: 'value',
                  callerId: 'callerId',
                  callStartDateTime: '2022-08-28 15:01:30+05:30',
                  conversionValue: '1',
                  currency: 'GBP',
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      callerId: 'callerId',
                      callStartDateTime: '2022-08-28 15:01:30+05:30',
                      conversionDateTime: '2022-09-20 08:50:04+05:30',
                      conversionValue: 1,
                      currencyCode: 'GBP',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: (_) => timestampMock(_, '2022-09-20 08:50:04+05:30'),
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {},
                traits: {
                  email: 'alex@example.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Promotion Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                loginCustomerId: '',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: false,
                defaultUserIdentifier: 'phone',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  gclid: 'gclid',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      gclid: 'gclid',
                      conversionDateTime: '2022-01-01 12:32:45-08:00',
                      userIdentifiers: [
                        {
                          userIdentifierSource: 'THIRD_PARTY',
                          hashedEmail: 'alex@example.com',
                        },
                      ],
                      conversionEnvironment: 'WEB',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {},
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Promotion Clicked',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: false,
                loginCustomerId: '',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: false,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error: 'Message type page not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {},
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Promotion Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: true,
                loginCustomerId: '',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Promotion Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: false,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error: '"Login Customer ID" is required as "Sub Account" is enabled',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {},
                traits: {
                  email: 'alex@example.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Product Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                product_id: '123445',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: true,
                loginCustomerId: '861-785-9087',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'phone',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '8617859087',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  gclid: 'gclid',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                  product_id: '123445',
                  quantity: 123,
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      cartData: {
                        items: [
                          {
                            productId: '123445',
                            quantity: 123,
                          },
                        ],
                      },
                      gclid: 'gclid',
                      conversionDateTime: '2022-01-01 12:32:45-08:00',
                      userIdentifiers: [
                        {
                          userIdentifierSource: 'THIRD_PARTY',
                          hashedEmail:
                            '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                        },
                      ],
                      conversionEnvironment: 'WEB',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {},
                traits: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Product Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                product_id: '123445',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: true,
                loginCustomerId: '861-785-9087',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'THIRD_PARTY',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error: 'Either of email or phone is required for user identifier',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {},
                traits: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Product Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                product_id: '123445',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '962-581-2972',
                subAccount: true,
                loginCustomerId: '861-785-9087',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'none',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '8617859087',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '9625812972',
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                properties: {
                  gclid: 'gclid',
                  conversionDateTime: '2022-01-01 12:32:45-08:00',
                  product_id: '123445',
                  quantity: 123,
                },
              },
              body: {
                JSON: {
                  conversions: [
                    {
                      cartData: {
                        items: [
                          {
                            productId: '123445',
                            quantity: 123,
                          },
                        ],
                      },
                      gclid: 'gclid',
                      conversionDateTime: '2022-01-01 12:32:45-08:00',
                      conversionEnvironment: 'WEB',
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 18',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  firstName: 'John',
                },
              },
              event: 'Product Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                loyaltyFraction: 1,
                order_id: 'order id',
                currency: 'INR',
                revenue: '100',
                store_code: 'store code',
                email: 'alex@example.com',
                gclid: 'gclid',
                product_id: '123445',
                custom_key: 'CUSTOM_KEY',
                CUSTOM_KEY: 'CUSTOM_VALUE',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '111-222-3333',
                subAccount: true,
                loginCustomerId: 'login-customer-id',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'store',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                UserIdentifierSource: 'phone',
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': 'logincustomerid',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '1112223333',
              },
              body: {
                JSON: {
                  event: '1112223333',
                  isStoreConversion: true,
                  createJobPayload: {
                    job: {
                      storeSalesMetadata: {
                        loyaltyFraction: 1,
                        custom_key: 'CUSTOM_KEY',
                        transaction_upload_fraction: '1',
                      },
                      type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
                    },
                  },
                  addConversionPayload: {
                    operations: {
                      create: {
                        transaction_attribute: {
                          store_attribute: {
                            store_code: 'store code',
                          },
                          transaction_amount_micros: '100000000',
                          order_id: 'order id',
                          currency_code: 'INR',
                          transaction_date_time: '2019-10-14 16:45:18+05:30',
                          CUSTOM_KEY: 'CUSTOM_VALUE',
                        },
                        userIdentifiers: [
                          {
                            hashedEmail:
                              '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                          },
                        ],
                      },
                    },
                    enable_partial_failure: false,
                    enable_warnings: false,
                    validate_only: false,
                  },
                  executeJobPayload: {
                    validate_only: false,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: timestampMock,
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 19',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  firstName: 'John',
                },
              },
              event: 'Product Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                loyaltyFraction: 1,
                order_id: 'order id',
                currency: 'INR',
                store_code: 'store code',
                userIdentifierSource: 'FIRST_PARTY',
                email: 'alex@example.com',
                gclid: 'gclid',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                product_id: '123445',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                customerId: '111-222-3333',
                subAccount: true,
                loginCustomerId: 'login-customer-id',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'store',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error:
              'Missing required value from ["properties.conversionValue","properties.total","properties.value","properties.revenue"]',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  firstName: 'John',
                },
              },
              event: 'Product Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                loyaltyFraction: 1,
                item_id: 'item id',
                merchant_id: 'merchant id',
                currency: 'INR',
                revenue: '100',
                store_code: 'store code',
                gclid: 'gclid',
                product_id: '123445',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                isCustomerAllowed: true,
                customerId: '111-222-3333',
                subAccount: true,
                loginCustomerId: 'login-customer-id',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'store',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': 'logincustomerid',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '1112223333',
              },
              body: {
                JSON: {
                  event: '1112223333',
                  isStoreConversion: true,
                  createJobPayload: {
                    job: {
                      storeSalesMetadata: {
                        loyaltyFraction: 1,
                        transaction_upload_fraction: '1',
                      },
                      type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
                    },
                  },
                  addConversionPayload: {
                    operations: {
                      create: {
                        transaction_attribute: {
                          store_attribute: {
                            store_code: 'store code',
                          },
                          transaction_amount_micros: '100000000',
                          currency_code: 'INR',
                          transaction_date_time: '2019-10-14 16:45:18+05:30',
                        },
                        userIdentifiers: [
                          {
                            address_info: {
                              hashed_first_name:
                                '96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a',
                            },
                          },
                        ],
                      },
                    },
                    enable_partial_failure: false,
                    enable_warnings: false,
                    validate_only: false,
                  },
                  executeJobPayload: {
                    validate_only: false,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: timestampMock,
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 21',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  firstName: 'first_name',
                  streetAddress: 'street_address',
                  state: 'England',
                },
              },
              event: 'Product Clicked',
              type: 'track',
              timestamp: 1675692865495,
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                item_id: 'item id',
                merchant_id: 'merchant id',
                currency: 'INR',
                revenue: '100',
                store_code: 'store code',
                gclid: 'gclid',
                product_id: '123445',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                isCustomerAllowed: false,
                customerId: '111-222-3333',
                subAccount: true,
                loginCustomerId: 'login-customer-id',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'store',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                conversionEnvironment: 'WEB',
                hashUserIdentifier: false,
                defaultUserIdentifier: 'email',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': 'logincustomerid',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '1112223333',
              },
              body: {
                JSON: {
                  event: '1112223333',
                  isStoreConversion: true,
                  createJobPayload: {
                    job: {
                      type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
                      storeSalesMetadata: {
                        loyaltyFraction: '1',
                        transaction_upload_fraction: '1',
                      },
                    },
                  },
                  addConversionPayload: {
                    operations: {
                      create: {
                        transaction_attribute: {
                          store_attribute: {
                            store_code: 'store code',
                          },
                          transaction_amount_micros: '100000000',
                          currency_code: 'INR',
                          transaction_date_time: '2023-02-06 19:44:25+05:30',
                        },
                        userIdentifiers: [
                          {
                            address_info: {
                              state: 'England',
                              hashed_first_name: 'first_name',
                              hashed_street_address: 'street_address',
                            },
                          },
                        ],
                      },
                    },
                    enable_partial_failure: false,
                    enable_warnings: false,
                    validate_only: false,
                  },
                  executeJobPayload: {
                    validate_only: false,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: (_) => timestampMock(_, '2023-02-06 19:44:25+05:30'),
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  firstName: 'John',
                  lastName: 'Gomes',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                  state: 'England',
                },
              },
              event: 'Product Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              timestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                item_id: 'item id',
                merchant_id: 'merchant id',
                currency: 'INR',
                revenue: '100',
                store_code: 'store code',
                phone: '+1-202-555-0146',
                gclid: 'gclid',
                product_id: '123445',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                isCustomerAllowed: false,
                customerId: '111-222-3333',
                subAccount: true,
                loginCustomerId: 'login-customer-id',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'click',
                  },
                  {
                    from: 'Download',
                    to: 'call',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'store',
                  },
                  {
                    from: 'Product Searched',
                    to: 'call',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Sign up completed',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Download',
                    to: 'Page view',
                  },
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                  {
                    from: 'Product Searched',
                    to: 'search',
                  },
                ],
                customVariables: [
                  {
                    from: 'value',
                    to: 'revenue',
                  },
                  {
                    from: 'total',
                    to: 'cost',
                  },
                ],
                conversionEnvironment: 'WEB',
                hashUserIdentifier: true,
                defaultUserIdentifier: 'phone',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': 'logincustomerid',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '1112223333',
              },
              body: {
                JSON: {
                  event: '1112223333',
                  isStoreConversion: true,
                  createJobPayload: {
                    job: {
                      type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
                      storeSalesMetadata: {
                        loyaltyFraction: '1',
                        transaction_upload_fraction: '1',
                      },
                    },
                  },
                  addConversionPayload: {
                    operations: {
                      create: {
                        transaction_attribute: {
                          store_attribute: {
                            store_code: 'store code',
                          },
                          transaction_amount_micros: '100000000',
                          currency_code: 'INR',
                          transaction_date_time: '2019-10-14 16:45:18+05:30',
                        },
                        userIdentifiers: [
                          {
                            hashedPhoneNumber:
                              '04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd',
                          },
                        ],
                      },
                    },
                    enable_partial_failure: false,
                    enable_warnings: false,
                    validate_only: false,
                  },
                  executeJobPayload: {
                    validate_only: false,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: timestampMock,
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 23',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  firstName: 'John',
                  lastName: 'Gomes',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                  state: 'England',
                },
              },
              event: 'Product Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                item_id: 'item id',
                merchant_id: 'merchant id',
                currency: 'INR',
                revenue: '100',
                store_code: 'store code',
                phone: '+1-202-555-0146',
                gclid: 'gclid',
                product_id: '123445',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                isCustomerAllowed: false,
                customerId: '111-222-3333',
                subAccount: true,
                loginCustomerId: 'login-customer-id',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Product Clicked',
                    to: 'store',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                ],
                hashUserIdentifier: true,
                defaultUserIdentifier: 'phone',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNkgr4t3u4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': 'logincustomerid',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '1112223333',
              },
              body: {
                JSON: {
                  event: '1112223333',
                  isStoreConversion: true,
                  createJobPayload: {
                    job: {
                      type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
                      storeSalesMetadata: {
                        loyaltyFraction: '1',
                        transaction_upload_fraction: '1',
                      },
                    },
                  },
                  addConversionPayload: {
                    operations: {
                      create: {
                        transaction_attribute: {
                          store_attribute: {
                            store_code: 'store code',
                          },
                          transaction_amount_micros: '100000000',
                          currency_code: 'INR',
                          transaction_date_time: '2019-10-14 16:45:18+05:30',
                        },
                        userIdentifiers: [
                          {
                            hashedPhoneNumber:
                              '04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd',
                          },
                        ],
                      },
                    },
                    enable_partial_failure: false,
                    enable_warnings: false,
                    validate_only: false,
                  },
                  executeJobPayload: {
                    validate_only: false,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: timestampMock,
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 24',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'alex@example.com',
                },
              },
              event: 'Product Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                item_id: 'item id',
                merchant_id: 'merchant id',
                currency: 'INR',
                revenue: '100',
                store_code: 'store code',
                gclid: 'gclid',
                transaction_date_time: '2022-01-01 12:32:45-08:00Z',
                product_id: '123445',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                isCustomerAllowed: false,
                customerId: '111-222-3333',
                subAccount: true,
                loginCustomerId: 'login-customer-id',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Product Clicked',
                    to: 'store',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                ],
                hashUserIdentifier: true,
                defaultUserIdentifier: 'phone',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNkgr4t3u4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': 'logincustomerid',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '1112223333',
              },
              body: {
                JSON: {
                  event: '1112223333',
                  isStoreConversion: true,
                  createJobPayload: {
                    job: {
                      type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
                      storeSalesMetadata: {
                        loyaltyFraction: '1',
                        transaction_upload_fraction: '1',
                      },
                    },
                  },
                  addConversionPayload: {
                    operations: {
                      create: {
                        transaction_attribute: {
                          store_attribute: {
                            store_code: 'store code',
                          },
                          transaction_amount_micros: '100000000',
                          currency_code: 'INR',
                          transaction_date_time: '2022-01-01 18:02:45+05:30',
                        },
                        userIdentifiers: [
                          {
                            hashedEmail:
                              '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                          },
                        ],
                      },
                    },
                    enable_partial_failure: false,
                    enable_warnings: false,
                    validate_only: false,
                  },
                  executeJobPayload: {
                    validate_only: false,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: (_) => timestampMock(_, '2022-01-01 18:02:45+05:30'),
  },
  {
    name: 'google_adwords_offline_conversions',
    description: 'Test 25',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {},
              },
              event: 'Product Clicked',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                item_id: 'item id',
                merchant_id: 'merchant id',
                currency: 'INR',
                revenue: '100',
                store_code: 'store code',
                gclid: 'gclid',
                conversionDateTime: '2019-10-14T11:15:18.299Z',
                product_id: '123445',
                quantity: 123,
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                isCustomerAllowed: false,
                customerId: '111-222-3333',
                subAccount: true,
                loginCustomerId: 'login-customer-id',
                eventsToOfflineConversionsTypeMapping: [
                  {
                    from: 'Product Clicked',
                    to: 'store',
                  },
                ],
                eventsToConversionsNamesMapping: [
                  {
                    from: 'Product Clicked',
                    to: 'Sign-up - click',
                  },
                ],
                hashUserIdentifier: true,
                defaultUserIdentifier: 'phone',
                validateOnly: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNkgr4t3u4fGYKkRK',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': 'logincustomerid',
              },
              params: {
                event: 'Sign-up - click',
                customerId: '1112223333',
              },
              body: {
                JSON: {
                  event: '1112223333',
                  isStoreConversion: true,
                  createJobPayload: {
                    job: {
                      type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
                      storeSalesMetadata: {
                        loyaltyFraction: '1',
                        transaction_upload_fraction: '1',
                      },
                    },
                  },
                  addConversionPayload: {
                    operations: {
                      create: {
                        transaction_attribute: {
                          store_attribute: {
                            store_code: 'store code',
                          },
                          transaction_amount_micros: '100000000',
                          currency_code: 'INR',
                          transaction_date_time: '2019-10-14 16:45:18+05:30',
                        },
                        userIdentifiers: [{}],
                      },
                    },
                    enable_partial_failure: false,
                    enable_warnings: false,
                    validate_only: false,
                  },
                  executeJobPayload: {
                    validate_only: false,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: timestampMock,
  },
];
