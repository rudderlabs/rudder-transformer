import { FEATURES } from '../../../../../src/v0/util/tags';
import { defaultMockFns } from '../mocks';
export const data = [
  {
    name: 'tiktok_ads',
    description: 'Test 0 -> Events 1.0 Multiple events in single batch',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  externalId: [
                    {
                      type: 'tiktokExternalId',
                      id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                  ],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46.0,
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                  },
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  locale: 'en-US',
                  ip: '13.57.97.131',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  externalId: [
                    {
                      type: 'tiktokExternalId',
                      id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                  ],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout started',
                properties: {
                  eventId: '1616318632825_357',
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                  },
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46.0,
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  locale: 'en-US',
                  ip: '13.57.97.131',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  externalId: [
                    {
                      type: 'tiktokExternalId',
                      id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                  ],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'download',
                properties: {
                  eventId: '1616318632825_357',
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    userAgent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                    ip: '13.57.97.131',
                  },
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46.0,
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  locale: 'en-US',
                  ip: '13.57.97.131',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  externalId: [
                    {
                      type: 'tiktokExternalId',
                      id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                  ],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'search',
                properties: {
                  eventId: '1616318632825_357',
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    userAgent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                    ip: '13.57.97.131',
                  },
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46.0,
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                },
              },
            },
          ],
          destType: 'tiktok_ads',
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/batch/',
                headers: {
                  'Access-Token': 'dummyAccessToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    pixel_code: 'dummyPixelCode',
                    partner_name: 'RudderStack',
                    batch: [
                      {
                        event: 'CompletePayment',
                        event_id: '1616318632825_357',
                        type: 'track',
                        timestamp: '2020-09-17T19:49:27Z',
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          currency: 'USD',
                          value: 46,
                        },
                        context: {
                          ad: { callback: 'dummyClickId' },
                          page: {
                            url: 'http://demo.mywebsite.com/purchase',
                            referrer: 'http://demo.mywebsite.com',
                          },
                          user: {
                            email:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            external_id:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            phone_number:
                              '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          },
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                        },
                      },
                      {
                        event: 'InitiateCheckout',
                        event_id: '1616318632825_357',
                        type: 'track',
                        timestamp: '2020-09-17T19:49:27Z',
                        context: {
                          ip: '13.57.97.131',
                          page: {
                            url: 'http://demo.mywebsite.com/purchase',
                            referrer: 'http://demo.mywebsite.com',
                          },
                          user: {
                            email:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            external_id:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            phone_number:
                              '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          },
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                        },
                        properties: {
                          value: 46,
                          contents: [
                            { price: 8, quantity: 2, content_id: '1077218', content_type: 'socks' },
                            {
                              price: 30,
                              quantity: 1,
                              content_id: '1197218',
                              content_type: 'dress',
                            },
                          ],
                          currency: 'USD',
                        },
                      },
                      {
                        event: 'Download',
                        event_id: '1616318632825_357',
                        type: 'track',
                        timestamp: '2020-09-17T19:49:27Z',
                        context: {
                          ip: '13.57.97.131',
                          page: {
                            url: 'http://demo.mywebsite.com/purchase',
                            referrer: 'http://demo.mywebsite.com',
                          },
                          user: {
                            email:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            external_id:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            phone_number:
                              '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          },
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                        },
                        properties: {
                          value: 46,
                          contents: [
                            { price: 8, quantity: 2, content_id: '1077218', content_type: 'socks' },
                            {
                              price: 30,
                              quantity: 1,
                              content_id: '1197218',
                              content_type: 'dress',
                            },
                          ],
                          currency: 'USD',
                        },
                      },
                      {
                        event: 'Search',
                        event_id: '1616318632825_357',
                        type: 'track',
                        timestamp: '2020-09-17T19:49:27Z',
                        context: {
                          ip: '13.57.97.131',
                          page: {
                            url: 'http://demo.mywebsite.com/purchase',
                            referrer: 'http://demo.mywebsite.com',
                          },
                          user: {
                            email:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            external_id:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            phone_number:
                              '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          },
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                        },
                        properties: {
                          value: 46,
                          contents: [
                            { price: 8, quantity: 2, content_id: '1077218', content_type: 'socks' },
                            {
                              price: 30,
                              quantity: 1,
                              content_id: '1197218',
                              content_type: 'dress',
                            },
                          ],
                          currency: 'USD',
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
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                },
                {
                  jobId: 3,
                  userId: 'u1',
                },
                {
                  jobId: 4,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 1 -> Events 1.0 Single Event inside batch',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  locale: 'en-US',
                  ip: '13.57.97.131',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  externalId: [{ type: 'tiktokExternalId', id: '1234' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'Product Added to Wishlist',
                properties: {
                  eventId: '1616318632825_357',
                  testEventCode: 'sample rudder test_event_code',
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: { phone_number: '+858987675687', email: 'sample@sample.com' },
                    userAgent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                    ip: '13.57.97.131',
                  },
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46.0,
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: true,
                },
              },
            },
          ],
          destType: 'tiktok_ads',
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
              batchedRequest: [
                {
                  body: {
                    FORM: {},
                    JSON: {
                      context: {
                        ip: '13.57.97.131',
                        page: {
                          referrer: 'http://demo.mywebsite.com',
                          url: 'http://demo.mywebsite.com/purchase',
                        },
                        user: {
                          external_id:
                            '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
                          phone_number:
                            '4443dd476f2be18201447ef046731c1a715accee4edc5192641a3b4c3ba921c7',
                          email: '774efc08cebab8c50c0f0eb2d3a2d2e560872a64f6c1617314c4f03b1c3d4dfa',
                        },
                        user_agent:
                          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                      },
                      event: 'AddToWishlist',
                      event_id: '1616318632825_357',
                      pixel_code: 'dummyPixelCode',
                      partner_name: 'RudderStack',
                      properties: {
                        contents: [
                          { content_id: '1077218', content_type: 'socks', price: 8, quantity: 2 },
                          { content_id: '1197218', content_type: 'dress', price: 30, quantity: 1 },
                        ],
                        currency: 'USD',
                        value: 46,
                      },
                      test_event_code: 'sample rudder test_event_code',
                      timestamp: '2020-09-17T19:49:27Z',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                  },
                  endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
                  files: {},
                  headers: {
                    'Access-Token': 'dummyAccessToken',
                    'Content-Type': 'application/json',
                  },
                  method: 'POST',
                  params: {},
                  type: 'REST',
                  version: '1',
                },
              ],
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: true,
                },
              },
              metadata: [
                {
                  jobId: 3,
                  userId: 'u1',
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
    name: 'tiktok_ads',
    description:
      'Test 2 -> Events 2.0 Single event is mapped to multiple tiktok event in config and exceeding max batch size',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id5' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id1' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'addToCart',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id2' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id4' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
          ],
          destType: 'tiktok_ads',
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                headers: {
                  'Access-Token': 'dummyAccessToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event_source_id: 'dummyPixelCode',
                    event_source: 'web',
                    partner_name: 'RudderStack',
                    data: [
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: {
                          url: 'http://demo.mywebsite.com/purchase',
                          referrer: 'http://demo.mywebsite.com',
                        },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id5',
                        },
                        event: 'CompletePayment',
                      },
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id1',
                        },
                        event: 'CompletePayment',
                      },
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id1',
                        },
                        event: 'download',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                headers: {
                  'Access-Token': 'dummyAccessToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event_source_id: 'dummyPixelCode',
                    event_source: 'web',
                    partner_name: 'RudderStack',
                    data: [
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id2',
                        },
                        event: 'CompletePayment',
                      },
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id4',
                        },
                        event: 'CompletePayment',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 3,
                  userId: 'u1',
                },
                {
                  jobId: 4,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'tiktok_ads',
    description:
      'Test 3 -> Events 2.0 Single event is mapped to single tiktok event in config and over the max batch limit',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id5' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id1' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id2' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id4' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
          ],
          destType: 'tiktok_ads',
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                headers: {
                  'Access-Token': 'dummyAccessToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event_source_id: 'dummyPixelCode',
                    event_source: 'web',
                    partner_name: 'RudderStack',
                    data: [
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: {
                          url: 'http://demo.mywebsite.com/purchase',
                          referrer: 'http://demo.mywebsite.com',
                        },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id5',
                        },
                        event: 'CompletePayment',
                      },
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id1',
                        },
                        event: 'CompletePayment',
                      },
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id2',
                        },
                        event: 'CompletePayment',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                },
                {
                  jobId: 3,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                headers: {
                  'Access-Token': 'dummyAccessToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event_source_id: 'dummyPixelCode',
                    event_source: 'web',
                    partner_name: 'RudderStack',
                    data: [
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id4',
                        },
                        event: 'CompletePayment',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 4,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'tiktok_ads',
    description: 'Test 4 -> One input event is invalid with one event to multiple events',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id5' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id1' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'abc',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id2' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id4' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
          ],
          destType: 'tiktok_ads',
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                headers: {
                  'Access-Token': 'dummyAccessToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event_source_id: 'dummyPixelCode',
                    event_source: 'web',
                    partner_name: 'RudderStack',
                    data: [
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: {
                          url: 'http://demo.mywebsite.com/purchase',
                          referrer: 'http://demo.mywebsite.com',
                        },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id5',
                        },
                        event: 'CompletePayment',
                      },
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id2',
                        },
                        event: 'CompletePayment',
                      },
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id4',
                        },
                        event: 'CompletePayment',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  jobId: 3,
                  userId: 'u1',
                },
                {
                  jobId: 4,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              batched: false,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                  hashUserProperties: false,
                  pixelCode: 'dummyPixelCode',
                  version: 'v2',
                },
              },
              error: 'Event name (abc) is not valid, must be mapped to one of standard events',
              metadata: [
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              statTags: {
                destType: 'TIKTOK_ADS',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'tiktok_ads',
    description: 'Test 5 -> Some input events are test events with one event to multiple events',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id5' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id1' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'addToCart',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id2' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  testEventCode: 'Some test event code for testing setup',
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id4' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
          ],
          destType: 'tiktok_ads',
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                headers: {
                  'Access-Token': 'dummyAccessToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event_source_id: 'dummyPixelCode',
                    event_source: 'web',
                    partner_name: 'RudderStack',
                    data: [
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: {
                          url: 'http://demo.mywebsite.com/purchase',
                          referrer: 'http://demo.mywebsite.com',
                        },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id5',
                        },
                        event: 'CompletePayment',
                      },
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id1',
                        },
                        event: 'CompletePayment',
                      },
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id1',
                        },
                        event: 'download',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                headers: {
                  'Access-Token': 'dummyAccessToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event_source_id: 'dummyPixelCode',
                    event_source: 'web',
                    partner_name: 'RudderStack',
                    data: [
                      {
                        event_id: '1616318632825_357',
                        event_time: 1600372167,
                        properties: {
                          contents: [
                            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                            {
                              price: 30,
                              quantity: 1,
                              content_type: 'dress',
                              content_id: '1197218',
                            },
                          ],
                          content_type: 'product',
                          currency: 'USD',
                          value: 46,
                        },
                        page: { url: 'http://demo.mywebsite.com/purchase' },
                        user: {
                          locale: 'en-US',
                          email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                          phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                          ip: '13.57.97.131',
                          user_agent:
                            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                          external_id: 'id4',
                        },
                        event: 'CompletePayment',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 4,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                  headers: {
                    'Access-Token': 'dummyAccessToken',
                    'Content-Type': 'application/json',
                  },
                  params: {},
                  body: {
                    JSON: {
                      event_source_id: 'dummyPixelCode',
                      event_source: 'web',
                      partner_name: 'RudderStack',
                      test_event_code: 'Some test event code for testing setup',
                      data: [
                        {
                          event_id: '1616318632825_357',
                          event_time: 1600372167,
                          properties: {
                            contents: [
                              {
                                price: 8,
                                quantity: 2,
                                content_type: 'socks',
                                content_id: '1077218',
                              },
                              {
                                price: 30,
                                quantity: 1,
                                content_type: 'dress',
                                content_id: '1197218',
                              },
                            ],
                            content_type: 'product',
                            currency: 'USD',
                            value: 46,
                          },
                          page: { url: 'http://demo.mywebsite.com/purchase' },
                          user: {
                            locale: 'en-US',
                            email:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            phone:
                              '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                            ip: '13.57.97.131',
                            user_agent:
                              'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                            external_id: 'id2',
                          },
                          event: 'CompletePayment',
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 3,
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'tiktok_ads',
    description: 'Test 6 -> All input events are test events',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id5' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  testEventCode: 'TEST_EVENT_CODE',
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                  locale: 'en-US',
                  externalId: [{ type: 'tiktokExternalId', id: 'id2' }],
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                timestamp: '2020-09-17T19:49:27Z',
                type: 'track',
                event: 'checkout step completed',
                properties: {
                  testEventCode: 'TEST_EVENT_CODE',
                  eventId: '1616318632825_357',
                  clickId: 'dummyClickId',
                  contents: [
                    { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
                    { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
                  ],
                  currency: 'USD',
                  value: 46,
                  url: 'http://demo.mywebsite.com/purchase',
                  phone: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
          ],
          destType: 'tiktok_ads',
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                  headers: {
                    'Access-Token': 'dummyAccessToken',
                    'Content-Type': 'application/json',
                  },
                  params: {},
                  body: {
                    JSON: {
                      event_source_id: 'dummyPixelCode',
                      event_source: 'web',
                      partner_name: 'RudderStack',
                      test_event_code: 'TEST_EVENT_CODE',
                      data: [
                        {
                          event_id: '1616318632825_357',
                          event_time: 1600372167,
                          properties: {
                            contents: [
                              {
                                price: 8,
                                quantity: 2,
                                content_type: 'socks',
                                content_id: '1077218',
                              },
                              {
                                price: 30,
                                quantity: 1,
                                content_type: 'dress',
                                content_id: '1197218',
                              },
                            ],
                            content_type: 'product',
                            currency: 'USD',
                            value: 46,
                          },
                          page: { url: 'http://demo.mywebsite.com/purchase' },
                          user: {
                            locale: 'en-US',
                            email:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            phone:
                              '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                            ip: '13.57.97.131',
                            user_agent:
                              'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                            external_id: 'id5',
                          },
                          event: 'CompletePayment',
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                  eventsToStandard: [
                    { from: 'addToCart', to: 'CompletePayment' },
                    { from: 'addToCart', to: 'download' },
                  ],
                },
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                  headers: {
                    'Access-Token': 'dummyAccessToken',
                    'Content-Type': 'application/json',
                  },
                  params: {},
                  body: {
                    JSON: {
                      event_source_id: 'dummyPixelCode',
                      event_source: 'web',
                      partner_name: 'RudderStack',
                      test_event_code: 'TEST_EVENT_CODE',
                      data: [
                        {
                          event_id: '1616318632825_357',
                          event_time: 1600372167,
                          properties: {
                            contents: [
                              {
                                price: 8,
                                quantity: 2,
                                content_type: 'socks',
                                content_id: '1077218',
                              },
                              {
                                price: 30,
                                quantity: 1,
                                content_type: 'dress',
                                content_id: '1197218',
                              },
                            ],
                            content_type: 'product',
                            currency: 'USD',
                            value: 46,
                          },
                          page: { url: 'http://demo.mywebsite.com/purchase' },
                          user: {
                            locale: 'en-US',
                            email:
                              'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                            phone:
                              '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                            ip: '13.57.97.131',
                            user_agent:
                              'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                            external_id: 'id2',
                          },
                          event: 'CompletePayment',
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  accessToken: 'dummyAccessToken',
                  pixelCode: 'dummyPixelCode',
                  hashUserProperties: false,
                  version: 'v2',
                },
              },
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
