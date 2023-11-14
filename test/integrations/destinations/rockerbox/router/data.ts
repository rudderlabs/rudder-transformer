export const data = [
  {
    name: 'rockerbox',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  advertiserId: 'test id',
                  eventFilteringOption: 'disable',
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  eventsMap: [
                    {
                      from: 'Product Added',
                      to: 'conv.add_to_cart',
                    },
                  ],
                  useNativeSDK: {
                    web: false,
                  },
                  clientAuthId: {
                    web: 'test-client-auth-id',
                  },
                  oneTrustCookieCategories: {
                    web: [
                      {
                        oneTrustCookieCategory: 'Marketing Sample',
                      },
                    ],
                  },
                  customDomain: {
                    web: 'https://cookiedomain.com',
                  },
                  enableCookieSync: {
                    web: true,
                  },
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                type: 'track',
                event: 'Product Added',
                sentAt: '2022-08-07T20:02:19.352Z',
                userId: 'userSampleX138',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  locale: 'en-IN',
                  traits: {
                    email: 'userSampleX120@gmail.com',
                    phone: '9878764736',
                    last_name: 'Stack',
                    first_name: 'Rudder',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                },
                rudderId: '4a47e99b-2afc-45c6-b902-ed69282ca805',
                messageId: '1659902539347900-c622426c-a1dd-44c0-ac6d-d4dbee3f4a93',
                properties: {
                  checkout_id: '12345',
                  product_url: 'http://www.yourdomain.com/products/red-t-shirt',
                  product_name: 'Red T-shirt',
                },
                anonymousId: '5f093403-1457-4a2c-b4e4-c61ec3bacf56',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2022-08-07T20:02:19.347Z',
              },
              writeKey: '2D0yaayoBD7bp8uFomnBONdedcA',
              requestIP: '[::1]',
              receivedAt: '2022-08-08T01:32:19.369+05:30',
            },
          ],
          destType: 'rockerbox',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    action: 'conv.add_to_cart',
                    anonymous_id: '5f093403-1457-4a2c-b4e4-c61ec3bacf56',
                    checkout_id: '12345',
                    conversion_source: 'RudderStack',
                    customer_id: 'userSampleX138',
                    email: 'userSampleX120@gmail.com',
                    phone: '9878764736',
                    product_name: 'Red T-shirt',
                    product_url: 'http://www.yourdomain.com/products/red-t-shirt',
                    timestamp: 1659902539,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://webhooks.getrockerbox.com/rudderstack',
                files: {},
                headers: {},
                method: 'POST',
                params: { advertiser: 'test id' },
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  advertiserId: 'test id',
                  blacklistedEvents: [{ eventName: '' }],
                  clientAuthId: { web: 'test-client-auth-id' },
                  customDomain: { web: 'https://cookiedomain.com' },
                  enableCookieSync: { web: true },
                  eventFilteringOption: 'disable',
                  eventsMap: [{ from: 'Product Added', to: 'conv.add_to_cart' }],
                  oneTrustCookieCategories: {
                    web: [{ oneTrustCookieCategory: 'Marketing Sample' }],
                  },
                  useNativeSDK: { web: false },
                  whitelistedEvents: [{ eventName: '' }],
                },
              },
              metadata: [{ jobId: 1 }],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'rockerbox',
    description: 'Test 1',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  advertiserId: 'test id',
                  eventFilteringOption: 'disable',
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  eventsMap: [
                    {
                      from: 'Product Viewed',
                      to: 'conv.add_to_cart',
                    },
                  ],
                  useNativeSDK: {
                    web: false,
                  },
                  clientAuthId: {
                    web: 'test-client-auth-id',
                  },
                  oneTrustCookieCategories: {
                    web: [
                      {
                        oneTrustCookieCategory: 'Marketing Sample',
                      },
                    ],
                  },
                  customDomain: {
                    web: 'https://cookiedomain.com',
                  },
                  enableCookieSync: {
                    web: true,
                  },
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                type: 'track',
                event: 'Product Viewed',
                sentAt: '2022-08-07T20:02:19.352Z',
                userId: 'userSampleX138',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  locale: 'en-IN',
                  traits: {
                    email: 'userSampleX120@gmail.com',
                    phone: '9878764736',
                    last_name: 'Stack',
                    first_name: 'Rudder',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                },
                rudderId: '4a47e99b-2afc-45c6-b902-ed69282ca805',
                messageId: '1659902539347900-c622426c-a1dd-44c0-ac6d-d4dbee3f4a93',
                properties: {
                  checkout_id: '12345',
                  product_url: 'http://www.yourdomain.com/products/red-t-shirt',
                  product_name: 'Red T-shirt',
                },
                anonymousId: '5f093403-1457-4a2c-b4e4-c61ec3bacf56',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2022-08-07T20:02:19.347Z',
              },
              writeKey: '2D0yaayoBD7bp8uFomnBONdedcA',
              requestIP: '[::1]',
              receivedAt: '2022-08-08T01:32:19.369+05:30',
            },
          ],
          destType: 'rockerbox',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    action: 'conv.add_to_cart',
                    anonymous_id: '5f093403-1457-4a2c-b4e4-c61ec3bacf56',
                    checkout_id: '12345',
                    conversion_source: 'RudderStack',
                    customer_id: 'userSampleX138',
                    email: 'userSampleX120@gmail.com',
                    phone: '9878764736',
                    product_name: 'Red T-shirt',
                    product_url: 'http://www.yourdomain.com/products/red-t-shirt',
                    timestamp: 1659902539,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://webhooks.getrockerbox.com/rudderstack',
                files: {},
                headers: {},
                method: 'POST',
                params: { advertiser: 'test id' },
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  advertiserId: 'test id',
                  blacklistedEvents: [{ eventName: '' }],
                  clientAuthId: { web: 'test-client-auth-id' },
                  customDomain: { web: 'https://cookiedomain.com' },
                  enableCookieSync: { web: true },
                  eventFilteringOption: 'disable',
                  eventsMap: [{ from: 'Product Viewed', to: 'conv.add_to_cart' }],
                  oneTrustCookieCategories: {
                    web: [{ oneTrustCookieCategory: 'Marketing Sample' }],
                  },
                  useNativeSDK: { web: false },
                  whitelistedEvents: [{ eventName: '' }],
                },
              },
              metadata: [{ jobId: 2 }],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
