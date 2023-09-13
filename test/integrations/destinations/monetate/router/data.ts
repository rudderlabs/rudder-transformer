export const data = [
  {
    name: 'monetate',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                context: {
                  screen: {
                    height: 22,
                    width: 11,
                  },
                  device: {
                    id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                    manufacturer: 'Xiaomi',
                    model: 'Redmi 6',
                    name: 'xiaomi',
                  },
                  network: {
                    carrier: 'Banglalink',
                  },
                  os: {
                    name: 'android',
                    version: '8.1.0',
                  },
                  traits: {
                    address: {
                      city: 'Dhaka',
                      country: 'Bangladesh',
                    },
                    anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  },
                  ip: '0.0.0.0',
                },
                traits: {
                  address: {
                    city: 'Kol',
                    country: 'Ind',
                  },
                },
                event: 'Product Viewed',
                integrations: {
                  All: true,
                },
                message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                properties: {
                  monetateId: '1234',
                  product_id: 'prodId',
                },
                timestamp: '2019-09-01T15:46:51.693229+05:30',
                type: 'track',
                userId: 'newUser',
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  monetateChannel: 'channel',
                  retailerShortName: 'retailer',
                  apiKey: 'api-key',
                },
              },
            },
            {
              message: {
                anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                context: {
                  screen: {
                    height: 22,
                    width: 11,
                  },
                  device: {
                    id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                    manufacturer: 'Xiaomi',
                    model: 'Redmi 6',
                    name: 'xiaomi',
                  },
                  network: {
                    carrier: 'Banglalink',
                  },
                  os: {
                    name: 'android',
                    version: '8.1.0',
                  },
                  traits: {
                    address: {
                      city: 'Dhaka',
                      country: 'Bangladesh',
                    },
                    anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  },
                  ip: '0.0.0.0',
                },
                traits: {
                  address: {
                    city: 'Kol',
                    country: 'Ind',
                  },
                },
                event: 'Product List Viewed',
                integrations: {
                  All: true,
                },
                message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                properties: {
                  monetateId: '1234',
                  products: [
                    {
                      product_id: 1,
                    },
                    {
                      product_id: 2,
                    },
                  ],
                },
                timestamp: '2019-09-01T15:46:51.693229+05:30',
                type: 'track',
                userId: 'newUser',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  monetateChannel: 'channel',
                  retailerShortName: 'retailer',
                  apiKey: 'api-key',
                },
              },
            },
          ],
          destType: 'monetate',
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
                endpoint: 'https://engine.monetate.net/api/engine/v1/decide/retailer',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    monetateId: '1234',
                    events: [
                      {
                        eventType: 'monetate:context:IpAddress',
                        ipAddress: '0.0.0.0',
                      },
                      {
                        eventType: 'monetate:context:ScreenSize',
                        height: 22,
                        width: 11,
                      },
                      {
                        eventType: 'monetate:context:ProductDetailView',
                        products: [
                          {
                            productId: 'prodId',
                            sku: '',
                          },
                        ],
                      },
                    ],
                    customerId: 'newUser',
                    channel: 'channel',
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  monetateChannel: 'channel',
                  retailerShortName: 'retailer',
                  apiKey: 'api-key',
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://engine.monetate.net/api/engine/v1/decide/retailer',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    monetateId: '1234',
                    events: [
                      {
                        eventType: 'monetate:context:IpAddress',
                        ipAddress: '0.0.0.0',
                      },
                      {
                        eventType: 'monetate:context:ScreenSize',
                        height: 22,
                        width: 11,
                      },
                      {
                        eventType: 'monetate:context:ProductThumbnailView',
                        products: ['1', '2'],
                      },
                    ],
                    customerId: 'newUser',
                    channel: 'channel',
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  monetateChannel: 'channel',
                  retailerShortName: 'retailer',
                  apiKey: 'api-key',
                },
              },
            },
          ],
        },
      },
    },
  },
];
