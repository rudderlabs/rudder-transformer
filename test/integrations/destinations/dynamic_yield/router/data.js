const data = [
  {
    name: 'dynamic_yield',
    description: 'Identify Event',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '507f191e810c19729de860ea',
                context: {
                  ip: '54.100.200.255',
                  sessionId: '16733896350494',
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
                },
                integrations: { All: true },
                receivedAt: '2015-02-23T22:28:55.387Z',
                sentAt: '2015-02-23T22:28:55.111Z',
                timestamp: '2015-02-23T22:28:55.111Z',
                traits: {
                  email: 'peter@example.com',
                },
                type: 'identify',
                userId: 'user0',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: '34d8efa09c5b048bbacc6af157f2e687',
                  hashEmail: true,
                },
              },
              metadata: {
                jobId: 1,
              },
            },
          ],
          destType: 'dynamic_yield',
        },
        method: 'POST',
      },
      pathSuffix: '',
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
                endpoint: 'https://dy-api.com/v2/collect/user/event',
                headers: {
                  'Content-Type': 'application/json',
                  'DY-API-Key': '34d8efa09c5b048bbacc6af157f2e687',
                },
                params: {},
                body: {
                  JSON: {
                    user: { id: 'user0' },
                    session: { custom: '16733896350494' },
                    context: { device: { ip: '54.100.200.255' } },
                    events: [
                      {
                        name: 'Identify User',
                        properties: {
                          dyType: 'identify-v1',
                          hashedEmail:
                            'f111db891a36b76df28abc74867e6c7248f796e045117f0cff27b6e2be25d2df',
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
              destination: {
                Config: {
                  apiKey: '34d8efa09c5b048bbacc6af157f2e687',
                  hashEmail: true,
                },
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Track Event',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                context: {
                  traits: { email: 'testone@gmail.com' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  ip: '54.100.200.255',
                },
                type: 'track',
                session_id: '16733896350494',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'Product Added',
                userId: 'testuserId1',
                properties: {
                  product_id: '123',
                  sku: 'item-34454ga',
                  category: 'Games',
                  name: 'Game',
                  brand: 'Gamepro',
                  variant: '111',
                  price: 39.95,
                  quantity: 1,
                  coupon: 'DISC21',
                  position: 1,
                  url: 'https://www.website.com/product/path',
                  image_url: 'https://www.website.com/product/path.png',
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  apiKey: '34d8efa09c5b048bbacc6af157f2e687',
                },
              },
              metadata: {
                jobId: 2,
              },
            },
          ],
          destType: 'dynamic_yield',
        },
        method: 'POST',
      },
      pathSuffix: '',
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
                endpoint: 'https://dy-api.com/v2/collect/user/event',
                headers: {
                  'Content-Type': 'application/json',
                  'DY-API-Key': '34d8efa09c5b048bbacc6af157f2e687',
                },
                params: {},
                body: {
                  JSON: {
                    user: { id: 'testuserId1' },
                    session: { custom: '16733896350494' },
                    context: { device: { ip: '54.100.200.255' } },
                    events: [
                      {
                        name: 'Add to Cart',
                        properties: {
                          dyType: 'add-to-cart-v1',
                          value: 39.95,
                          productId: 'item-34454ga',
                          quantity: 1,
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
              destination: {
                Config: {
                  apiKey: '34d8efa09c5b048bbacc6af157f2e687',
                },
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Event is not there in input for track call',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                context: {
                  traits: { email: 'testone@gmail.com' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  ip: '54.100.200.255',
                },
                type: 'track',
                session_id: '16733896350494',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                userId: 'testuserId1',
                properties: {
                  product_id: '123',
                  sku: 'item-34454ga',
                  category: 'Games',
                  name: 'Game',
                  brand: 'Gamepro',
                  variant: '111',
                  price: 39.95,
                  quantity: 1,
                  coupon: 'DISC21',
                  position: 1,
                  url: 'https://www.website.com/product/path',
                  image_url: 'https://www.website.com/product/path.png',
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  apiKey: '34d8efa09c5b048bbacc6af157f2e687',
                  hashEmail: true,
                },
              },
              metadata: {
                jobId: 3,
              },
            },
          ],
          destType: 'dynamic_yield',
        },
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              error: 'Event is not present in the input payload',
              destination: {
                Config: {
                  apiKey: '34d8efa09c5b048bbacc6af157f2e687',
                  hashEmail: true,
                },
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              batched: false,
              statTags: {
                destType: 'DYNAMIC_YIELD',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
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

module.exports = {
  data,
};
