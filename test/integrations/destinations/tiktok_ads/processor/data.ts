export const data = [
  {
    name: 'tiktok_ads',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
                context: {
                  ad: {
                    callback: '123ATXSfe',
                  },
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'CompletePayment',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    ad: {
                      callback: 'dummyclickId',
                    },
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'InitiateCheckout',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'Product Added to Wishlist',
              properties: {
                eventId: '1616318632825_357',
                testEventCode: 'sample rudder test_event_code',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'AddToWishlist',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
                  test_event_code: 'sample rudder test_event_code',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'Product Added to Wishlist1',
              properties: {
                eventId: '1616318632825_357',
                testEventCode: 'sample rudder test_event_code',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
            statusCode: 400,
            error:
              'Event name (product added to wishlist1) is not valid, must be mapped to one of standard events',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'Product Added to Wishlist',
              properties: {
                eventId: '1616318632825_357',
                testEventCode: 'sample rudder test_event_code',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'AddToWishlist',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
                  test_event_code: 'sample rudder test_event_code',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'Product Added to Wishlist',
              properties: {
                eventId: '1616318632825_357',
                testEventCode: 'sample rudder test_event_code',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'AddToWishlist',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
                  test_event_code: 'sample rudder test_event_code',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'tiktokExternalId',
                    id: '1234',
                  },
                ],
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              timestamp: '2020-09-17T19:49:27Z',
              type: 'track',
              event: 'SubscriBe',
              properties: {
                eventId: '1616318632825_357',
                testEventCode: '',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number: '+868987675687',
                    email: 'sample@sample.com',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: true,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'Subscribe',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '1d96e70d2bf54087e33586457cde2790825bee7b1a3b05d26481cb12ec8e63fd',
                      email: '774efc08cebab8c50c0f0eb2d3a2d2e560872a64f6c1617314c4f03b1c3d4dfa',
                      external_id:
                        '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'payment info entered',
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
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'AddPaymentInfo',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
            statusCode: 400,
            error: 'Event name is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
            statusCode: 400,
            error: 'Event type is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              type: 'track',
              event: 'payment info entered',
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
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'AddPaymentInfo',
                  event_id: '1616318632825_357',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'submitform',
              properties: {
                eventId: '16163186328257',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'SubmitForm',
                  event_id: '16163186328257',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'submitform',
              properties: {
                eventId: '16163186328257',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                  userAgent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  ip: '13.57.97.131',
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'SubmitForm',
                  event_id: '16163186328257',
                  timestamp: '2020-09-17T19:49:27Z',
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'contact',
              properties: {
                eventId: '16163186328257',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'Contact',
                  event_id: '16163186328257',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              type: 'identify',
              event: 'contact',
              properties: {
                eventId: '16163186328257',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
            statusCode: 400,
            error: 'Event type identify is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'CompletePayment',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'order completed',
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
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'PlaceAnOrder',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                traits: {
                  email: 'user@sample.com',
                  phone: '+919912345678',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'SubscriBe',
              properties: {
                eventId: '1616318632825_357',
                testEventCode: 'TEST0000000011',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number: '+918987674657',
                    email: 'sample@rudder.com',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: true,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'Subscribe',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
                  test_event_code: 'TEST0000000011',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '1b6abcebb79b2208929967160ba291656f3fcd4f00e93b6a846c1e56c0e177c6',
                      email: '02e47a94635c1ffd6f6a69fe2c7a92dbfbb9d5e2ebddb54810520b34989b66a7',
                      external_id:
                        'f0f3ec74bbef8580d7de80624dea93c05d828c748715199fe71bc7f5a67aa8b3',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 18',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                traits: {
                  email: 'user@sample.com',
                  phone: '+919912345678',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'SubscriBe',
              properties: {
                eventId: '1616318632825_357',
                testEventCode: 'TEST0000000011',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number: '',
                    email: '',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: true,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'Subscribe',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
                  test_event_code: 'TEST0000000011',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '241102c24fa8a642e3d1346a31fbce3dd312563c015ae577a2253cb8652581eb',
                      email: 'a344da1fac6201ed1c1f20a07e1b55bb896a5ac0abd269c1e9daf1afbbffca3b',
                      external_id:
                        'f0f3ec74bbef8580d7de80624dea93c05d828c748715199fe71bc7f5a67aa8b3',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 19',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  url: 'http://rudder.mywebsite.com/purchase',
                  referrer: 'http://rudder.mywebsite.com',
                },
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
                currency: 'USD',
                value: 46,
                context: {
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'CompletePayment',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://rudder.mywebsite.com/purchase',
                      referrer: 'http://rudder.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'abc',
              properties: {
                eventId: '1616318632825_357',
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
                currency: 'USD',
                value: 46,
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                eventsToStandard: [
                  {
                    from: 'abc',
                    to: 'download',
                  },
                  {
                    from: 'abc',
                    to: 'search',
                  },
                  {
                    from: 'def',
                    to: 'search',
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'download',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'search',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 21',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'abc',
              properties: {
                eventId: '1616318632825_357',
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
                currency: 'USD',
                value: 46,
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                eventsToStandard: [
                  {
                    from: 'def',
                    to: 'download',
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
            statusCode: 400,
            error: 'Event name (abc) is not valid, must be mapped to one of standard events',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'abc',
              properties: {
                eventId: '1616318632825_357',
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
                currency: 'USD',
                value: 46,
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                eventsToStandard: [
                  {
                    from: 'abc',
                    to: 'download',
                  },
                  {
                    from: 'def',
                    to: 'download',
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'download',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 23',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'abc',
              properties: {
                eventId: '1616318632825_357',
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
                currency: 'USD',
                value: 46,
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number: '+371234567890123',
                    email: 'sample@sample.com',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: true,
                eventsToStandard: [
                  {
                    from: 'abc',
                    to: 'download',
                  },
                  {
                    from: 'def',
                    to: 'download',
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'download',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '6080191ec608e10062e9257702cbca694cfe1bfa53944ba5701119d8f8b99ad6',
                      email: '774efc08cebab8c50c0f0eb2d3a2d2e560872a64f6c1617314c4f03b1c3d4dfa',
                      external_id:
                        'f0f3ec74bbef8580d7de80624dea93c05d828c748715199fe71bc7f5a67aa8b3',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 24',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'abc',
              properties: {
                eventId: '1616318632825_357',
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
                currency: 'USD',
                value: 46,
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number: '+3712345678',
                    email: 'sample@sample.com',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: true,
                eventsToStandard: [
                  {
                    from: 'abc',
                    to: 'download',
                  },
                  {
                    from: 'def',
                    to: 'download',
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'download',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '6e6c1bb39126b3ecf537e62847909b1372a1a22de9b28d85960e12c78f322035',
                      email: '774efc08cebab8c50c0f0eb2d3a2d2e560872a64f6c1617314c4f03b1c3d4dfa',
                      external_id:
                        'f0f3ec74bbef8580d7de80624dea93c05d828c748715199fe71bc7f5a67aa8b3',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 25',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
                products: [
                  {
                    product_id: 123,
                    sku: 'G-32',
                    name: 'Monopoly',
                    price: 14,
                    quantity: 1,
                    category: 'Games',
                    url: 'https://www.website.com/product/path',
                    image_url: 'https://www.website.com/product/path.jpg',
                  },
                  {
                    product_id: '345',
                    sku: 'F-32',
                    name: 'UNO',
                    price: 3.45,
                    quantity: 2,
                    category: 'Games',
                  },
                ],
                currency: 'USD',
                value: 46,
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'CompletePayment',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 26',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
                products: [
                  {
                    product_id: 123,
                    sku: 'G-32',
                    name: 'Monopoly',
                    price: 14,
                    quantity: 1,
                    contentType: 'product_group',
                    category: 'Games',
                    url: 'https://www.website.com/product/path',
                    image_url: 'https://www.website.com/product/path.jpg',
                  },
                  {
                    product_id: 345,
                    sku: 'F-32',
                    name: 'UNO',
                    price: 3.45,
                    contentType: 'product_group',
                    quantity: 2,
                  },
                ],
                currency: 'USD',
                value: 46,
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'CompletePayment',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
                  properties: {
                    currency: 'USD',
                    value: 46,
                    contents: [
                      {
                        content_type: 'product_group',
                        content_id: '123',
                        content_category: 'Games',
                        content_name: 'Monopoly',
                        price: 14,
                        quantity: 1,
                      },
                      {
                        content_type: 'product_group',
                        content_id: '345',
                        content_name: 'UNO',
                        price: 3.45,
                        quantity: 2,
                      },
                    ],
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 27',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
                products: [
                  {
                    contentType: 'product_group',
                    product_id: '123',
                    sku: 'G-32',
                    name: 'Monopoly',
                    price: 14,
                    quantity: 1,
                    category: 'Games',
                    url: 'https://www.website.com/product/path',
                    image_url: 'https://www.website.com/product/path.jpg',
                  },
                  {
                    contentType: 'product_group',
                    product_id: '345',
                    sku: 'F-32',
                    name: 'UNO',
                    price: 3.45,
                    quantity: 2,
                    category: 'Games',
                  },
                ],
                currency: 'USD',
                value: 46,
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'CompletePayment',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
                  properties: {
                    currency: 'USD',
                    value: 46,
                    contents: [
                      {
                        content_type: 'product_group',
                        content_id: '123',
                        content_category: 'Games',
                        content_name: 'Monopoly',
                        price: 14,
                        quantity: 1,
                      },
                      {
                        content_type: 'product_group',
                        content_id: '345',
                        content_category: 'Games',
                        content_name: 'UNO',
                        price: 3.45,
                        quantity: 2,
                      },
                    ],
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 28',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
                category: 'Urban',
                status: 'processed',
                name: 'games',
                contentType: 'product_group',
                productId: 'qqw21221341234',
                eventId: '1616318632825_357',
                products: [
                  {
                    product_id: '123',
                    sku: 'G-32',
                    name: 'Monopoly',
                    price: 14,
                    quantity: 1,
                    category: 'Games',
                    url: 'https://www.website.com/product/path',
                    image_url: 'https://www.website.com/product/path.jpg',
                    brand: 'brand_name',
                  },
                  {
                    product_id: '345',
                    sku: 'F-32',
                    name: 'UNO',
                    price: 3.45,
                    quantity: 2,
                    category: 'Games',
                  },
                ],
                currency: 'USD',
                value: 46,
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'CompletePayment',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
                  properties: {
                    content_category: 'Urban',
                    status: 'processed',
                    content_name: 'games',
                    content_id: 'qqw21221341234',
                    content_type: 'product_group',
                    currency: 'USD',
                    value: 46,
                    contents: [
                      {
                        content_type: 'product_group',
                        content_id: '123',
                        content_category: 'Games',
                        content_name: 'Monopoly',
                        price: 14,
                        quantity: 1,
                        brand: 'brand_name',
                      },
                      {
                        content_type: 'product_group',
                        content_id: '345',
                        content_category: 'Games',
                        content_name: 'UNO',
                        price: 3.45,
                        quantity: 2,
                      },
                    ],
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 29 -> custom_event Pass',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'custom_event',
              properties: {
                eventId: '1616318632825_357',
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
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
                context: {
                  ad: {
                    callback: '123ATXSfe',
                  },
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                sendCustomEvents: true,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'custom_event',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    ad: {
                      callback: 'dummyclickId',
                    },
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 30 -> custom_event Failure case for flag set as false',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'custom_event',
              properties: {
                eventId: '1616318632825_357',
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
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
                context: {
                  ad: {
                    callback: '123ATXSfe',
                  },
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                sendCustomEvents: false,
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
            statusCode: 400,
            error:
              'Event name (custom_event) is not valid, must be mapped to one of standard events',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 31 -> Camel Case Custom Event Pass',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'customEvent',
              properties: {
                eventId: '1616318632825_357',
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
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
                context: {
                  ad: {
                    callback: '123ATXSfe',
                  },
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                sendCustomEvents: true,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'customEvent',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
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
                    currency: 'USD',
                    value: 46,
                  },
                  context: {
                    ad: {
                      callback: 'dummyclickId',
                    },
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 32 -> V2 -> Camel Case Custom Event Pass',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              context: {
                traits: {
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f'
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
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
              event: 'customEvent',
              properties: {
                eventId: '1616318632825_357',
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
                url: "http://demo.mywebsite.com/purchase",
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                version: 'v2',
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                sendCustomEvents: true,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_source: 'web',
                  event_source_id: '{{PIXEL-CODE}}',
                  partner_name: 'RudderStack',
                  data: [
                    {
                      event: 'customEvent',
                      event_id: '1616318632825_357',
                      event_time: 1600372167,
                      properties: {
                        content_type: "product",
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
                        currency: 'USD',
                        value: 46,
                      },
                      page: {
                        url: 'http://demo.mywebsite.com/purchase'
                      },
                      user: {
                        locale: "en-US",
                        email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                        external_id:
                          'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                        ip: '13.57.97.131',
                        user_agent:
                          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                      },
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 33 -> V2 -> Event mapped to one standard event with contents present as it is in properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              context: {
                traits: {
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f'
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'addToCart',
              properties: {
                eventId: '1616318632825_357',
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
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                version: 'v2',
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                sendCustomEvents: true,
                eventsToStandard: [
                  {
                    from: 'addToCart',
                    to: 'download',
                  }
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_source: 'web',
                  event_source_id: '{{PIXEL-CODE}}',
                  partner_name: 'RudderStack',
                  data: [
                    {
                      event: 'download',
                      event_id: '1616318632825_357',
                      event_time: 1600372167,
                      properties: {
                        content_type: "product",
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
                        currency: 'USD',
                        value: 46,
                      },
                      page: {
                        url: 'http://demo.mywebsite.com/purchase',
                        referrer: 'http://demo.mywebsite.com',
                      },
                      user: {
                        locale: "en-US",
                        email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                        external_id:
                          'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                        ip: '13.57.97.131',
                        user_agent:
                          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                      },
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 34 -> V2 -> Event mapped to multiple standard events and no phone',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              context: {
                traits: {
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f'
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase'
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'addToCart',
              properties: {
                eventId: '1616318632825_357',
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
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                version: 'v2',
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                sendCustomEvents: true,
                eventsToStandard: [
                  {
                    from: 'addToCart',
                    to: 'download',
                  },
                  {
                    from: 'AddToCart',
                    to: 'AddToWishlist',
                  }
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_source: 'web',
                  event_source_id: '{{PIXEL-CODE}}',
                  partner_name: 'RudderStack',
                  data: [
                    {
                      event: 'download',
                      event_id: '1616318632825_357',
                      event_time: 1600372167,
                      properties: {
                        content_type: "product",
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
                        currency: 'USD',
                        value: 46,
                      },
                      page: {
                        url: 'http://demo.mywebsite.com/purchase',
                      },
                      user: {
                        locale: "en-US",
                        email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                        external_id:
                          'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                        ip: '13.57.97.131',
                        user_agent:
                          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                      },
                    },
                    {
                      event: 'AddToWishlist',
                      event_id: '1616318632825_357',
                      event_time: 1600372167,
                      properties: {
                        content_type: "product",
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
                        currency: 'USD',
                        value: 46,
                      },
                      page: {
                        url: 'http://demo.mywebsite.com/purchase',
                      },
                      user: {
                        locale: "en-US",
                        email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                        external_id:
                          'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                        ip: '13.57.97.131',
                        user_agent:
                          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                      },
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 35 -> V2 -> array of external_id and phone number',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                externalId: [
                  {
                    type: 'tiktokExternalId',
                    id: ['f0e388f53921a51f0bb0fc8a2944109ec188b5', '1f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc'],
                  },
                ],
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              timestamp: '2020-09-17T19:49:27Z',
              type: 'track',
              event: 'addToCart',
              properties: {
                eventId: '1616318632825_357',
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
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
                phone: ['+12345432', '+134234325'],
                email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f'

              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                version: 'v2',
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                sendCustomEvents: true,
                eventsToStandard: [
                  {
                    from: 'addToCart',
                    to: 'download',
                  },
                  {
                    from: 'AddToCart',
                    to: 'AddToWishlist',
                  }
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_source: 'web',
                  event_source_id: '{{PIXEL-CODE}}',
                  partner_name: 'RudderStack',
                  data: [
                    {
                      event: 'download',
                      event_id: '1616318632825_357',
                      event_time: 1600372167,
                      properties: {
                        content_type: "product",
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
                        currency: 'USD',
                        value: 46,
                      },
                      page: {
                        url: 'http://demo.mywebsite.com/purchase',
                        referrer: 'http://demo.mywebsite.com',
                      },
                      user: {
                        phone: ['+12345432', '+134234325'],
                        email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                        external_id: ['f0e388f53921a51f0bb0fc8a2944109ec188b5', '1f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc'],
                        ip: '13.57.97.131',
                        user_agent:
                          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                      },
                    },
                    {
                      event: 'AddToWishlist',
                      event_id: '1616318632825_357',
                      event_time: 1600372167,
                      properties: {
                        content_type: "product",
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
                        currency: 'USD',
                        value: 46,
                      },
                      page: {
                        url: 'http://demo.mywebsite.com/purchase',
                        referrer: 'http://demo.mywebsite.com',
                      },
                      user: {
                        phone: ['+12345432', '+134234325'],
                        email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                        external_id: ['f0e388f53921a51f0bb0fc8a2944109ec188b5', '1f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc'],
                        ip: '13.57.97.131',
                        user_agent:
                          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                      },
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 36-> V2 -> Event not standard and no custom events allowed',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              context: {
                traits: {
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f'
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                locale: 'en-US',
                ip: '13.57.97.131',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
              event: 'Product Added to Wishlist1',
              properties: {
                eventId: '1616318632825_357',
                testEventCode: 'sample rudder test_event_code',
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
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
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                version: 'v2',
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
            statusCode: 400,
            error:
              'Event name (product added to wishlist1) is not valid, must be mapped to one of standard events',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 37-> V2 -> No Message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',

              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              timestamp: '2020-09-17T19:49:27Z',
              event: 'Product Added to Wishlist1',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                version: 'v2'
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
            statusCode: 400,
            error:
              'Event type is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 38-> V2 -> Event not found',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              timestamp: '2020-09-17T19:49:27Z',
              type: 'track',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                version: 'v2',
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
            statusCode: 400,
            error:
              'Event name is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 39-> V2 -> Access Token not found',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              timestamp: '2020-09-17T19:49:27Z',
              type: 'track',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                pixelCode: 'configuration',
                hashUserProperties: false,
                version: 'v2',
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
            statusCode: 400,
            error:
              'Access Token not found. Aborting',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 40-> V2 -> Pixel Code not found. Aborting',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              timestamp: '2020-09-17T19:49:27Z',
              type: 'track',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                hashUserProperties: false,
                version: 'v2',
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
            statusCode: 400,
            error:
              'Pixel Code not found. Aborting',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 41 -> V2 -> One of standard event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              context: {
                traits: {
                  email: 'abc@xyz.com'
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                externalId: [
                  {
                    type: 'tiktokExternalId',
                    id: ['f0e388f53921a51f0bb0fc8a2944109ec188b5', '1f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc'],
                  },
                ],
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              timestamp: '2020-09-17T19:49:27Z',
              type: 'track',
              event: 'viewcontent',
              properties: {
                eventId: '1616318632825_357',
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
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
                phone: ['+12345432', '+134234325']
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                version: 'v2',
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: true,
                sendCustomEvents: false,
                eventsToStandard: [
                  {
                    from: 'addToCart',
                    to: 'download',
                  },
                  {
                    from: 'AddToCart',
                    to: 'AddToWishlist',
                  }
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_source: 'web',
                  event_source_id: '{{PIXEL-CODE}}',
                  partner_name: 'RudderStack',
                  data: [
                    {
                      event: 'ViewContent',
                      event_id: '1616318632825_357',
                      event_time: 1600372167,
                      properties: {
                        content_type: "product",
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
                        currency: 'USD',
                        value: 46,
                      },
                      page: {
                        url: 'http://demo.mywebsite.com/purchase',
                        referrer: 'http://demo.mywebsite.com',
                      },
                      user: {
                        email: 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d',
                        external_id: ["3e0c7a51acd326b87f29596e38c22cbeb732df37bc5c8f5f524c14b55d3472db", "f8be04e62f5a3eba31c8b9380843666f28f3ab5f44a380f47fac04e9ce7b2168",],
                        ip: '13.57.97.131',
                        phone: [
                          "49a15e38bdc2572d362a924c2ddd100baed0fe29db44270d3700fcef03b18c39",
                          "5a6a7a09b18278e220312ce26d711ff7c8263d0965ee3b1d26b1b6f0ac7e71b3",
                        ],
                        user_agent:
                          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                      },
                    }
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 42 -> V2 -> One of standard event and contents from products',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              context: {
                traits: {
                  email: 'abc@xyz.com'
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                externalId: [
                  {
                    type: 'tiktokExternalId',
                    id: ['f0e388f53921a51f0bb0fc8a2944109ec188b5', '1f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc'],
                  },
                ],
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              timestamp: '2020-09-17T19:49:27Z',
              type: 'track',
              event: 'viewcontent',
              properties: {
                order_id: 1234,
                shop_id: 4567,
                description: "Viewed games",
                query: "New age games",
                contentType: 'product_group',
                eventId: '1616318632825_357',
                products: [
                  {
                    product_id: 123,
                    sku: 'G-32',
                    name: 'Monopoly',
                    price: 14,
                    quantity: 1,
                    contentType: 'product_group',
                    category: 'Games',
                    brand: 'adidas',
                    image_url: 'https://www.website.com/product/path.jpg',
                  },
                  {
                    product_id: 345,
                    sku: 'F-32',
                    name: 'UNO',
                    price: 3.45,
                    contentType: 'product_group',
                    quantity: 2,
                  },
                ],
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
                phone: ['+12345432', '+134234325']
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                version: 'v2',
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: true,
                sendCustomEvents: false,
                eventsToStandard: [
                  {
                    from: 'addToCart',
                    to: 'download',
                  },
                  {
                    from: 'AddToCart',
                    to: 'AddToWishlist',
                  }
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_source: 'web',
                  event_source_id: '{{PIXEL-CODE}}',
                  partner_name: 'RudderStack',
                  data: [
                    {
                      event: 'ViewContent',
                      event_id: '1616318632825_357',
                      event_time: 1600372167,
                      properties: {
                        order_id: "1234",
                        shop_id: "4567",
                        description: "Viewed games",
                        query: "New age games",
                        content_type: "product_group",
                        contents: [
                          {
                            price: 14,
                            quantity: 1,
                            content_category: 'Games',
                            content_id: '123',
                            content_name: 'Monopoly',
                            brand: 'adidas'
                          },
                          {
                            price: 3.45,
                            quantity: 2,
                            content_id: '345',
                            content_name: 'UNO'
                          },
                        ],
                        currency: 'USD',
                        value: 46,
                      },
                      page: {
                        url: 'http://demo.mywebsite.com/purchase',
                        referrer: 'http://demo.mywebsite.com',
                      },
                      user: {
                        email: 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d',
                        external_id: ["3e0c7a51acd326b87f29596e38c22cbeb732df37bc5c8f5f524c14b55d3472db", "f8be04e62f5a3eba31c8b9380843666f28f3ab5f44a380f47fac04e9ce7b2168",],
                        ip: '13.57.97.131',
                        phone: [
                          "49a15e38bdc2572d362a924c2ddd100baed0fe29db44270d3700fcef03b18c39",
                          "5a6a7a09b18278e220312ce26d711ff7c8263d0965ee3b1d26b1b6f0ac7e71b3",
                        ],
                        user_agent:
                          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                      },
                    }
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 43 -> V2 -> Contents present as object in properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              context: {
                traits: {
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f'
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
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
              event: 'addToCart',
              properties: {
                eventId: '1616318632825_357',
                contents: {
                  price: 8,
                  quantity: 2,
                  content_type: 'socks',
                  content_id: '1077218',
                },
                clickId: 'dummyclickId',
                currency: 'USD',
                value: 46,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                version: 'v2',
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                sendCustomEvents: true,
                eventsToStandard: [
                  {
                    from: 'addToCart',
                    to: 'download',
                  }
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_source: 'web',
                  event_source_id: '{{PIXEL-CODE}}',
                  partner_name: 'RudderStack',
                  data: [
                    {
                      event: 'download',
                      event_id: '1616318632825_357',
                      event_time: 1600372167,
                      properties: {
                        content_type: "product",
                        contents: [{
                          price: 8,
                          quantity: 2,
                          content_type: 'socks',
                          content_id: '1077218',
                        }],
                        currency: 'USD',
                        value: 46,
                      },
                      page: {
                        url: 'http://demo.mywebsite.com/purchase',
                        referrer: 'http://demo.mywebsite.com',
                      },
                      user: {
                        locale: "en-US",
                        email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                        external_id:
                          'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                        ip: '13.57.97.131',
                        user_agent:
                          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                      },
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 44 -> Events 2.0 Event type identify not suported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'web',
              context: {
                externalId: [
                  {
                    type: 'tiktokExternalId',
                    id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                  },
                ],
              },
              timestamp: '2020-09-17T19:49:27Z',
              type: 'identify',
              event: 'contact',
              properties: {},
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
                version: "v2"
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
            statusCode: 400,
            error: 'Event type identify is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'TIKTOK_ADS',
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
    name: 'tiktok_ads',
    description: 'Test 45-> events 1.0 build contents from properties.product.$ where length of prodicts is 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                ip: '13.57.97.131',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
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
                products: [],
                currency: 'USD',
                value: 46,
                context: {
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accessToken: 'dummyAccessToken',
                pixelCode: '{{PIXEL-CODE}}',
                hashUserProperties: false,
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
              endpoint: 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
              headers: {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  pixel_code: '{{PIXEL-CODE}}',
                  event: 'CompletePayment',
                  event_id: '1616318632825_357',
                  timestamp: '2020-09-17T19:49:27Z',
                  properties: {
                    currency: 'USD',
                    value: 46,
                    contents: [],
                  },
                  context: {
                    page: {
                      url: 'http://demo.mywebsite.com/purchase',
                      referrer: 'http://demo.mywebsite.com',
                    },
                    user: {
                      phone_number:
                        '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                      external_id:
                        'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    },
                    ip: '13.57.97.131',
                    user_agent:
                      'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                  },
                  partner_name: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
