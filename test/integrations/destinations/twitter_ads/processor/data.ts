const authHeaderConstant =
  'OAuth oauth_consumer_key="qwe", oauth_nonce="V1kMh028kZLLhfeYozuL0B45Pcx6LvuW", oauth_signature="Di4cuoGv4PnCMMEeqfWTcqhvdwc%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1685603652", oauth_token="dummyAccessToken", oauth_version="1.0"';

export const data = [
  {
    name: 'twitter_ads',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              endpoint: 'https://ads-api.twitter.com/12/measurement/conversions/dummyPixelId',
              headers: {
                Authorization: authHeaderConstant,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  conversions: [
                    {
                      conversion_time: '2023-06-01T06:03:08.739Z',
                      number_items: 2,
                      price_currency: 'USD',
                      user_agent: 'chrome',
                      value: '25',
                      conversion_id: '213123',
                      contents: [
                        {
                          content_id: '12',
                          content_price: 123.3345,
                          num_items: 12,
                        },
                        {
                          content_id: '4',
                          content_price: 200,
                          num_items: 11,
                        },
                      ],
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
                        {
                          twclid: '543',
                        },
                      ],
                    },
                  ],
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
                consumerKey: 'qwe',
                consumerSecret: 'fdghv',
                accessToken: 'dummyAccessToken',
                accessTokenSecret: 'testAccessTokenSecret',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'twitter_ads',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Home Page Viewed',
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
                eventId: '429047995',
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
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
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
                    twitterEventId: 'tw-2dfsdf',
                  },
                ],
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
                consumerKey: 'qwe',
                consumerSecret: 'fdghv',
                accessToken: 'dummyAccessToken',
                accessTokenSecret: 'testAccessTokenSecret',
              },
            },
            statusCode: 400,
            error:
              '[TWITTER ADS]: one of twclid, phone, email, ip_address or user_agent must be present in properties.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TWITTER_ADS',
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
    name: 'twitter_ads',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Home Page Viewed',
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
                pixelId: 'dummyPixelId',
                conversionTime: '2023-06-01T06:03:08.739Z',
                eventId: '429047995',
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25.55,
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
                    twitterEventId: 'tw-324fdsf',
                  },
                ],
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
              endpoint: 'https://ads-api.twitter.com/12/measurement/conversions/dummyPixelId',
              headers: {
                Authorization: authHeaderConstant,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  conversions: [
                    {
                      event_id: '429047995',
                      conversion_time: '2023-06-01T06:03:08.739Z',
                      number_items: 2,
                      price_currency: 'USD',
                      user_agent: 'chrome',
                      value: '25.55',
                      conversion_id: '213123',
                      identifiers: [
                        {
                          hashed_email:
                            '4c3c8a8cba2f3bb1e9e617301f85d1f68e816a01c7b716f482f2ab9adb8181fb',
                        },
                        {
                          hashed_phone_number:
                            'b308962b96b40cce7981493a372db9478edae79f83c2d8ca6cd15a39566f8c56',
                        },
                        {
                          twclid: '543',
                        },
                      ],
                    },
                  ],
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
                consumerKey: 'qwe',
                consumerSecret: 'fdghv',
                accessToken: 'dummyAccessToken',
                accessTokenSecret: 'testAccessTokenSecret',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'twitter_ads',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Home Page',
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
                pixelId: 'dummyPixelId',
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
                    twitterEventId: 'tw-324fdsf',
                  },
                ],
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
                consumerKey: 'qwe',
                consumerSecret: 'fdghv',
                accessToken: 'dummyAccessToken',
                accessTokenSecret: 'testAccessTokenSecret',
              },
            },
            statusCode: 400,
            error:
              "[TWITTER ADS]: Event - 'Home Page' do not have a corresponding eventId in configuration. Aborting",
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'TWITTER_ADS',
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
    name: 'twitter_ads',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Home Page',
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
                pixelId: 'dummyPixelId',
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
                    rudderEventName: '  ',
                    twitterEventId: 'tw-324fdsf',
                  },
                  {
                    rudderEventName: 'Home Page Viewed',
                    twitterEventId: 'tw-324fdsf',
                  },
                ],
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
                consumerKey: 'qwe',
                consumerSecret: 'fdghv',
                accessToken: 'dummyAccessToken',
                accessTokenSecret: 'testAccessTokenSecret',
              },
            },
            statusCode: 400,
            error:
              "[TWITTER ADS]: Event - 'Home Page' do not have a corresponding eventId in configuration. Aborting",
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'TWITTER_ADS',
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
    name: 'twitter_ads',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Home Page Viewed',
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
              endpoint: 'https://ads-api.twitter.com/12/measurement/conversions/dummyPixelId',
              headers: {
                Authorization: authHeaderConstant,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  conversions: [
                    {
                      conversion_time: '2023-06-01T06:03:08.739Z',
                      number_items: 2,
                      price_currency: 'USD',
                      user_agent: 'chrome',
                      value: '25',
                      conversion_id: '213123',
                      contents: [
                        {
                          content_id: '12',
                          content_price: 123.3345,
                          num_items: 12,
                        },
                        {
                          content_id: '4',
                          content_price: 200,
                          num_items: 11,
                        },
                      ],
                      event_id: 'tw-odt2o-odt2q',
                      identifiers: [
                        {
                          hashed_email:
                            '4c3c8a8cba2f3bb1e9e617301f85d1f68e816a01c7b716f482f2ab9adb8181fb',
                        },
                        {
                          hashed_phone_number:
                            'b308962b96b40cce7981493a372db9478edae79f83c2d8ca6cd15a39566f8c56',
                        },
                        {
                          twclid: '543',
                        },
                      ],
                    },
                  ],
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
                consumerKey: 'qwe',
                consumerSecret: 'fdghv',
                accessToken: 'dummyAccessToken',
                accessTokenSecret: 'testAccessTokenSecret',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'twitter_ads',
    description: 'Test case for track event with ip_address as an identifier',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Home Page Viewed',
              channel: 'web',
              context: {
                source: 'test',
                userAgent: 'chrome',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                  email: 'abc@gmail.com',
                  phone: '+1234589947',
                  ge: 'male',
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
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                ip_address: '8.25.197.25',
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
              endpoint: 'https://ads-api.twitter.com/12/measurement/conversions/dummyPixelId',
              headers: {
                Authorization: authHeaderConstant,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  conversions: [
                    {
                      conversion_time: '2020-08-14T05:30:30.118Z',
                      user_agent: 'chrome',
                      event_id: 'tw-odt2o-odt2q',
                      identifiers: [
                        {
                          ip_address: '8.25.197.25',
                        },
                      ],
                    },
                  ],
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
                consumerKey: 'qwe',
                consumerSecret: 'fdghv',
                accessToken: 'dummyAccessToken',
                accessTokenSecret: 'testAccessTokenSecret',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'twitter_ads',
    description: 'Test case for track event with user_agent as an identifier',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Home Page Viewed',
              channel: 'web',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                  email: 'abc@gmail.com',
                  phone: '+1234589947',
                  ge: 'male',
                },
              },
              properties: {
                affiliation: 'Google Store',
                user_agent:
                  '    Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36.',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                All: true,
              },
            },
            metadata: {
              secret: {
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
              endpoint: 'https://ads-api.twitter.com/12/measurement/conversions/dummyPixelId',
              headers: {
                Authorization: authHeaderConstant,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  conversions: [
                    {
                      event_id: 'tw-odt2o-odt2q',
                      identifiers: [
                        {
                          user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36.',
                        },
                      ],
                    },
                  ],
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
                accessTokenSecret: 'testAccessTokenSecret',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
].map((tc) => ({
  ...tc,
  mockFns: (_) => {
    jest.mock('../../../../../src/v0/destinations/twitter_ads/util', () => ({
      getAuthHeaderForRequest: (_a, _b) => {
        return { Authorization: authHeaderConstant };
      },
    }));
  },
}));
