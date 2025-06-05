const authHeaderConstant =
  'OAuth oauth_consumer_key="qwe", oauth_nonce="V1kMh028kZLLhfeYozuL0B45Pcx6LvuW", oauth_signature="Di4cuoGv4PnCMMEeqfWTcqhvdwc%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1685603652", oauth_token="dummyAccessToken", oauth_version="1.0"';

export const data = [
  {
    name: 'twitter_ads',
    description: 'tests router flow',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'ABC Searched',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  conversionTime: '2023-06-01T06:03:08.739Z',
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  priceCurrency: 'USD',
                  conversionId: '213123',
                  numberItems: '2323',
                  phone: '+919927455678',
                  twclid: '543',
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                  email: 'abc@ax.com',
                  contents: [
                    {
                      price: '123.3345',
                      quantity: '12',
                      id: '12',
                    },
                    {
                      price: 200,
                      quantity: 11,
                      id: '4',
                    },
                  ],
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                secret: {
                  consumerKey: 'qwe',
                  consumerSecret: 'fdghv',
                  accessToken: 'dummyAccessToken',
                  accessTokenSecret: 'testAccessTokenSecret',
                },
              },
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
                  twitterAdsEventNames: [
                    {
                      rudderEventName: 'ABC Searched',
                      twitterEventId: 'tw-234234324234',
                    },
                    {
                      rudderEventName: 'Home Page Viewed',
                      twitterEventId: 'tw-odt2o-odt2q',
                    },
                  ],
                },
              },
            },
          ],
          destType: 'twitter_ads',
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
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    conversions: [
                      {
                        contents: [
                          { content_id: '12', content_price: '123.3345', num_items: 12 },
                          { content_id: '4', content_price: '200.00', num_items: 11 },
                        ],
                        conversion_id: '213123',
                        conversion_time: '2023-06-01T06:03:08.739Z',
                        event_id: 'tw-234234324234',
                        identifiers: [
                          {
                            hashed_email:
                              '4c3c8a8cba2f3bb1e9e617301f85d1f68e816a01c7b716f482f2ab9adb8181fb',
                          },
                          {
                            hashed_phone_number:
                              'b308962b96b40cce7981493a372db9478edae79f83c2d8ca6cd15a39566f8c56',
                          },
                          { twclid: '543' },
                        ],
                        number_items: 2,
                        price_currency: 'USD',
                        user_agent: 'chrome',
                        value: '25',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://ads-api.twitter.com/12/measurement/conversions/dummyPixelId',
                files: {},
                headers: {
                  Authorization:
                    'OAuth oauth_consumer_key="qwe", oauth_nonce="V1kMh028kZLLhfeYozuL0B45Pcx6LvuW", oauth_signature="Di4cuoGv4PnCMMEeqfWTcqhvdwc%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1685603652", oauth_token="dummyAccessToken", oauth_version="1.0"',
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
                  twitterAdsEventNames: [
                    { rudderEventName: 'ABC Searched', twitterEventId: 'tw-234234324234' },
                    { rudderEventName: 'Home Page Viewed', twitterEventId: 'tw-odt2o-odt2q' },
                  ],
                },
              },
              metadata: [
                {
                  secret: {
                    accessToken: 'dummyAccessToken',
                    accessTokenSecret: 'testAccessTokenSecret',
                    consumerKey: 'qwe',
                    consumerSecret: 'fdghv',
                  },
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'twitter_ads',
    description: 'Test case for missing properties in message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Home Page Viewed',
              },
              metadata: {
                secret: {
                  consumerKey: 'qwe',
                  consumerSecret: 'fdghv',
                  accessToken: 'dummyAccessToken',
                  accessTokenSecret: 'testAccessTokenSecret',
                },
              },
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  twitterAdsEventNames: [
                    {
                      rudderEventName: 'Home Page Viewed',
                      twitterEventId: 'tw-odt2o-odt2q',
                    },
                  ],
                },
              },
            },
          ],
          destType: 'twitter_ads',
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
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  twitterAdsEventNames: [
                    { rudderEventName: 'Home Page Viewed', twitterEventId: 'tw-odt2o-odt2q' },
                  ],
                },
              },
              statusCode: 400,
              error: '[TWITTER ADS]: properties must be present in event. Aborting message',
              metadata: [
                {
                  secret: {
                    consumerKey: 'qwe',
                    consumerSecret: 'fdghv',
                    accessToken: 'dummyAccessToken',
                    accessTokenSecret: 'testAccessTokenSecret',
                  },
                },
              ],
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'TWITTER_ADS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'twitter_ads',
    description: 'Test case for missing OAuth secret',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Home Page Viewed',
                properties: {
                  email: 'test@test.com',
                },
              },
              metadata: {}, // Missing secret
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  twitterAdsEventNames: [
                    {
                      rudderEventName: 'Home Page Viewed',
                      twitterEventId: 'tw-odt2o-odt2q',
                    },
                  ],
                },
              },
            },
          ],
          destType: 'twitter_ads',
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
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  twitterAdsEventNames: [
                    { rudderEventName: 'Home Page Viewed', twitterEventId: 'tw-odt2o-odt2q' },
                  ],
                },
              },
              statusCode: 500,
              error: '[TWITTER ADS]:: OAuth - secret not found',
              metadata: [{}],
              statTags: {
                errorCategory: 'platform',
                errorType: 'oAuthSecret',
                destType: 'TWITTER_ADS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'twitter_ads',
    description: 'Test case for unsupported message type',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify', // Unsupported message type
                properties: {
                  email: 'test@test.com',
                },
              },
              metadata: {
                secret: {
                  consumerKey: 'qwe',
                  consumerSecret: 'fdghv',
                  accessToken: 'dummyAccessToken',
                  accessTokenSecret: 'testAccessTokenSecret',
                },
              },
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                },
              },
            },
          ],
          destType: 'twitter_ads',
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
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                },
              },
              statusCode: 400,
              error: 'Message type identify not supported',
              metadata: [
                {
                  secret: {
                    consumerKey: 'qwe',
                    consumerSecret: 'fdghv',
                    accessToken: 'dummyAccessToken',
                    accessTokenSecret: 'testAccessTokenSecret',
                  },
                },
              ],
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'TWITTER_ADS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
              },
            },
          ],
        },
      },
    },
  },
].map((tc) => ({
  ...tc,
  mockFns: (_) => {
    jest.mock('../../../../../src/v0/destinations/twitter_ads/util', () => ({
      ...jest.requireActual('../../../../../src/v0/destinations/twitter_ads/util'),
      getAuthHeaderForRequest: (_a, _b) => {
        return { Authorization: authHeaderConstant };
      },
    }));
  },
}));
