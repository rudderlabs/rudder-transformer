export const data = [
  {
    name: 'dynamic_yield',
    description: 'Identify call without hashed email 21313123',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              context: {
                ip: '54.100.200.255',
                sessionId: '16733896350494',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: {
                All: true,
              },
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
                apiKey: 'dummyApiKey',
                hashEmail: true,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://dy-api.com/v2/collect/user/event',
              headers: {
                'Content-Type': 'application/json',
                'DY-API-Key': 'dummyApiKey',
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
          },
        ],
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Identify call with hashed email',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              context: {
                ip: '54.100.200.255',
                sessionId: '16733896350494',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                email: 'f111db891a36b76df28abc74867e6c7248f796e045117f0cff27b6e2be25d2df',
              },
              type: 'identify',
              userId: 'user0',
              version: '1',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://dy-api.com/v2/collect/user/event',
              headers: {
                'Content-Type': 'application/json',
                'DY-API-Key': 'dummyApiKey',
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
          },
        ],
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Track call with Product Added event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              context: {
                traits: {
                  email: 'testone@gmail.com',
                },
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
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://dy-api.com/v2/collect/user/event',
              headers: {
                'Content-Type': 'application/json',
                'DY-API-Key': 'dummyApiKey',
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
          },
        ],
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Identify call without email',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              context: {
                ip: '54.100.200.255',
                sessionId: '16733896350494',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {},
              type: 'identify',
              userId: 'user0',
              version: '1',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://dy-api.com/v2/collect/user/event',
              headers: {
                'Content-Type': 'application/json',
                'DY-API-Key': 'dummyApiKey',
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
                        cuid: 'user0',
                        cuidType: 'userId',
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
          },
        ],
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Track call with Product Removed event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              context: {
                traits: {
                  email: 'testone@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                ip: '54.100.200.255',
              },
              type: 'track',
              session_id: '16733896350494',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Product Removed',
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
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://dy-api.com/v2/collect/user/event',
              headers: {
                'Content-Type': 'application/json',
                'DY-API-Key': 'dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  user: { id: 'testuserId1' },
                  session: { custom: '16733896350494' },
                  context: { device: { ip: '54.100.200.255' } },
                  events: [
                    {
                      name: 'Remove from Cart',
                      properties: {
                        dyType: 'remove-from-cart-v1',
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
          },
        ],
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Track call with Product Added to Wishlist event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              context: {
                traits: {
                  email: 'testone@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                ip: '54.100.200.255',
              },
              type: 'track',
              session_id: '16733896350494',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Product Added to Wishlist',
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
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://dy-api.com/v2/collect/user/event',
              headers: {
                'Content-Type': 'application/json',
                'DY-API-Key': 'dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  user: { id: 'testuserId1' },
                  session: { custom: '16733896350494' },
                  context: { device: { ip: '54.100.200.255' } },
                  events: [
                    {
                      name: 'Add to Wishlist',
                      properties: {
                        dyType: 'add-to-wishlist-v1',
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
          },
        ],
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Track call with order completed event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              context: {
                traits: {
                  email: 'testone@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                ip: '54.100.200.255',
              },
              type: 'track',
              session_id: '16733896350494',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Order Completed',
              userId: 'testuserId1',
              properties: {
                checkout_id: '12345',
                order_id: '1234',
                affiliation: 'Apple Store',
                total: 20,
                revenue: 15,
                shipping: 4,
                tax: 1,
                discount: 1.5,
                coupon: 'ImagePro',
                currency: 'USD',
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
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://dy-api.com/v2/collect/user/event',
              headers: {
                'Content-Type': 'application/json',
                'DY-API-Key': 'dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  user: { id: 'testuserId1' },
                  session: { custom: '16733896350494' },
                  context: { device: { ip: '54.100.200.255' } },
                  events: [
                    {
                      name: 'Purchase',
                      properties: {
                        dyType: 'purchase-v1',
                        uniqueTransactionId: '1234',
                        value: 15,
                        currency: 'USD',
                        cart: [
                          {
                            itemPrice: 14,
                            productId: 'G-32',
                            quantity: 1,
                          },
                          {
                            itemPrice: 3.45,
                            productId: 'F-32',
                            quantity: 2,
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
              userId: '',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Unsupported group call check',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              context: {
                ip: '54.100.200.255',
                sessionId: '16733896350494',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                email: 'peter@example.com',
              },
              type: 'group',
              userId: 'user0',
              version: '1',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'message type group is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type group is not supported',
            statTags: {
              destType: 'DYNAMIC_YIELD',
              destinationId: 'destId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Event type not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              context: {
                ip: '54.100.200.255',
                sessionId: '16733896350494',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                email: 'peter@example.com',
              },
              userId: 'user0',
              version: '1',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'message Type is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message Type is not present. Aborting message.',
            statTags: {
              destType: 'DYNAMIC_YIELD',
              destinationId: 'destId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'API Key not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              type: 'identify',
              context: {
                ip: '54.100.200.255',
                sessionId: '16733896350494',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                email: 'peter@example.com',
              },
              userId: 'user0',
              version: '1',
            },
            destination: {
              Config: {},
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'Api Key is not present: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Api Key is not present',
            statTags: {
              destType: 'DYNAMIC_YIELD',
              destinationId: 'destId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dynamic_yield',
    description: 'Event is not there in input',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              context: {
                traits: {
                  email: 'testone@gmail.com',
                },
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
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'event is not present. Aborting.: Workflow: procWorkflow, Step: validateInputForTrack, ChildStep: undefined, OriginalError: event is not present. Aborting.',
            statTags: {
              destType: 'DYNAMIC_YIELD',
              destinationId: 'destId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
];
