import { FEATURES } from '../../../../../src/v0/util/tags';

export const data = [
  {
    name: 'tiktok_ads_offline_events',
    description: 'Test 0',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  hashUserProperties: true,
                },
              },
              message: {
                event: 'subscribe',
                context: {
                  traits: {
                    phone: '1234567890',
                  },
                  channel: 'web',
                },
                properties: {
                  eventSetId: '7181537436256731137',
                  eventId: '1616318632825_352',
                  order_id: 'abc_xyz',
                  shop_id: '123abc',
                  currency: 'USD',
                  value: 46.0,
                  price: 8,
                  quantity: 2,
                  content_type: 'product1234',
                  product_id: '1077218',
                  name: 'socks',
                  category: "Men's cloth",
                },
                type: 'track',
                userId: 'eventIdn01',
                timestamp: '2023-01-03',
              },
            },
            {
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  hashUserProperties: true,
                },
              },
              message: {
                event: 'subscribe',
                context: {
                  traits: {
                    phone: '1234567890',
                    email: 'random@mail.com',
                  },
                  channel: 'web',
                },
                properties: {
                  eventSetId: '7181537436256731137',
                  eventId: '1616318632825_352',
                  products: [
                    {
                      price: 8,
                      quantity: 2,
                      content_type: 'product1',
                      product_id: '1077218',
                      name: 'socks',
                      category: "Men's cloth",
                    },
                    {
                      price: 18,
                      quantity: 12,
                      content_type: 'product2',
                      product_id: '1077219',
                      name: 'socks1',
                      category: "Men's cloth1",
                    },
                  ],
                },
                type: 'track',
                userId: 'eventIdn01',
                timestamp: '2023-01-03',
              },
            },
          ],
          destType: 'tiktok_ads_offline_events',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: true,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://business-api.tiktok.com/open_api/v1.3/offline/batch/',
                headers: {
                  'Access-Token': 'dummyAccessToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event_set_id: '7181537436256731137',
                    partner_name: 'RudderStack',
                    batch: [
                      {
                        event_set_id: '7181537436256731137',
                        event: 'Subscribe',
                        event_id: '1616318632825_352',
                        timestamp: '2023-01-03',
                        partner_name: 'RudderStack',
                        context: {
                          user: {
                            phone_numbers: [
                              'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646',
                            ],
                          },
                        },
                        properties: {
                          order_id: 'abc_xyz',
                          shop_id: '123abc',
                          contents: [
                            {
                              price: 8,
                              quantity: 2,
                              content_type: 'product1234',
                              content_id: '1077218',
                              content_name: 'socks',
                              content_category: "Men's cloth",
                            },
                          ],
                          event_channel: 'web',
                          currency: 'USD',
                          value: 46.0,
                        },
                      },
                      {
                        event_set_id: '7181537436256731137',
                        event: 'Subscribe',
                        event_id: '1616318632825_352',
                        timestamp: '2023-01-03',
                        partner_name: 'RudderStack',
                        context: {
                          user: {
                            phone_numbers: [
                              'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646',
                            ],
                            emails: [
                              'd9fcca64ec1b250da4261a3f89a8e0f7749c4e0f5a1a918e5397194c8b5a9f16',
                            ],
                          },
                        },
                        properties: {
                          event_channel: 'web',
                          contents: [
                            {
                              price: 8,
                              quantity: 2,
                              content_type: 'product1',
                              content_id: '1077218',
                              content_name: 'socks',
                              content_category: "Men's cloth",
                            },
                            {
                              price: 18,
                              quantity: 12,
                              content_type: 'product2',
                              content_id: '1077219',
                              content_name: 'socks1',
                              content_category: "Men's cloth1",
                            },
                          ],
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  hashUserProperties: true,
                },
              },
              metadata: [
                {
                  jobId: 1,
                },
                {
                  jobId: 2,
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
    name: 'tiktok_ads_offline_events',
    description: 'Test 1',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: {
                jobId: 3,
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  hashUserProperties: true,
                },
              },
              message: {
                event: 'subscribe',
                context: {
                  traits: {
                    phone: '1234567890',
                  },
                  channel: 'web',
                },
                properties: {
                  eventSetId: '6071537445256731123',
                  eventId: '1616318632825_352',
                  currency: 'USD',
                  value: 46.0,
                  price: 8,
                  content_type: 'product1234',
                },
                type: 'track',
                userId: 'eventIdn01',
                timestamp: '2023-01-03',
              },
            },
          ],
          destType: 'tiktok_ads_offline_events',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: true,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://business-api.tiktok.com/open_api/v1.3/offline/batch/',
                headers: {
                  'Access-Token': 'dummyAccessToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event_set_id: '6071537445256731123',
                    partner_name: 'RudderStack',
                    batch: [
                      {
                        event_set_id: '6071537445256731123',
                        event: 'Subscribe',
                        event_id: '1616318632825_352',
                        timestamp: '2023-01-03',
                        partner_name: 'RudderStack',
                        context: {
                          user: {
                            phone_numbers: [
                              'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646',
                            ],
                          },
                        },
                        properties: {
                          contents: [
                            {
                              price: 8,
                              content_type: 'product1234',
                            },
                          ],
                          event_channel: 'web',
                          currency: 'USD',
                          value: 46.0,
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  hashUserProperties: true,
                },
              },
              metadata: [
                {
                  jobId: 3,
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
    name: 'tiktok_ads_offline_events',
    description: 'Test 2',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: {
                jobId: 4,
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  hashUserProperties: true,
                },
              },
              message: {
                context: {
                  traits: {
                    phone: '1234567890',
                  },
                  channel: 'web',
                },
                properties: {
                  eventSetId: '2345676543',
                  eventId: '1616318632825_352',
                },
                type: 'track',
                userId: 'eventIdn01',
                timestamp: '2023-01-03',
              },
            },
          ],
          destType: 'tiktok_ads_offline_events',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  hashUserProperties: true,
                },
              },
              batched: false,
              error: 'Event name is required',
              metadata: [
                {
                  jobId: 4,
                },
              ],
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'TIKTOK_ADS_OFFLINE_EVENTS',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
];
