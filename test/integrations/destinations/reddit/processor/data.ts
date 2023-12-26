export const data = [
  {
    name: 'reddit',
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
                device: {
                  advertisingId: 'asfds7fdsihf734b34j43f',
                },
                os: {
                  name: 'android',
                },
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
                accountId: 'a2_fsddXXXfsfd',
                hashData: true,
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
              endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
              headers: {
                Authorization: 'Bearer dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  events: [
                    {
                      event_at: '2019-10-14T09:03:17.562Z',
                      event_type: {
                        tracking_type: 'Purchase',
                      },
                      user: {
                        aaid: 'c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a',
                        email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                        external_id:
                          '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                        ip_address:
                          'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                        user_agent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                        screen_dimensions: {},
                      },
                      event_metadata: {
                        item_count: 3,
                        products: [
                          {
                            id: '123',
                            name: 'Monopoly',
                            category: 'Games',
                          },
                          {
                            id: '345',
                            name: 'UNO',
                            category: 'Games',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with product list viewed event',
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
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Product List Viewed',
              userId: 'testuserId1',
              properties: {
                list_id: 'list1',
                category: "What's New",
                products: [
                  {
                    product_id: '017c6f5d5cf86a4b22432066',
                    sku: '8732-98',
                    name: 'Just Another Game',
                    price: 22,
                    position: 2,
                    category: 'Games and Entertainment',
                    url: 'https://www.myecommercewebsite.com/product',
                    image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                  },
                  {
                    product_id: '89ac6f5d5cf86a4b64eac145',
                    sku: '1267-01',
                    name: 'Wrestling Trump Cards',
                    price: 4,
                    position: 21,
                    category: 'Card Games',
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
                accountId: 'a2_fsddXXXfsfd',
                hashData: false,
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
              endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
              headers: {
                Authorization: 'Bearer dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  events: [
                    {
                      event_at: '2019-10-14T09:03:17.562Z',
                      event_type: {
                        tracking_type: 'ViewContent',
                      },
                      user: {
                        email: 'testone@gmail.com',
                        external_id: 'testuserId1',
                        ip_address: '54.100.200.255',
                        user_agent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                        screen_dimensions: {},
                      },
                      event_metadata: {
                        item_count: 0,
                        products: [
                          {
                            id: '017c6f5d5cf86a4b22432066',
                            name: 'Just Another Game',
                            category: 'Games and Entertainment',
                          },
                          {
                            id: '89ac6f5d5cf86a4b64eac145',
                            name: 'Wrestling Trump Cards',
                            category: 'Card Games',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with product added event',
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
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'PRoduct Added    ',
              userId: 'testuserId1',
              properties: {
                product_id: '622c6f5d5cf86a4c77358033',
                sku: '8472-998-0112',
                category: 'Games',
                name: 'Cones of Dunshire',
                brand: 'Wyatt Games',
                variant: 'exapansion pack',
                price: 49.99,
                quantity: 5,
                coupon: 'PREORDER15',
                position: 1,
                url: 'https://www.website.com/product/path',
                image_url: 'https://www.website.com/product/path.webp',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accountId: 'a2_fsddXXXfsfd',
                hashData: true,
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
              endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
              headers: {
                Authorization: 'Bearer dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  events: [
                    {
                      event_at: '2019-10-14T09:03:17.562Z',
                      event_type: {
                        tracking_type: 'AddToCart',
                      },
                      user: {
                        email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                        external_id:
                          '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                        ip_address:
                          'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                        user_agent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                        screen_dimensions: {},
                      },
                      event_metadata: {
                        item_count: 5,
                        products: [
                          {
                            id: '622c6f5d5cf86a4c77358033',
                            name: 'Cones of Dunshire',
                            category: 'Games',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with products searched event',
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
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'products searched',
              userId: 'testuserId1',
              properties: {
                product_id: '622c6f5d5cf86a4c77358033',
                sku: '8472-998-0112',
                category: 'Games',
                name: 'Cones of Dunshire',
                brand: 'Wyatt Games',
                variant: 'exapansion pack',
                price: 49.99,
                quantity: 5,
                coupon: 'PREORDER15',
                position: 1,
                url: 'https://www.website.com/product/path',
                image_url: 'https://www.website.com/product/path.webp',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accountId: 'a2_fsddXXXfsfd',
                hashData: true,
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
              endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
              headers: {
                Authorization: 'Bearer dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  events: [
                    {
                      event_at: '2019-10-14T09:03:17.562Z',
                      event_type: {
                        tracking_type: 'Search',
                      },
                      user: {
                        email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                        external_id:
                          '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                        ip_address:
                          'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                        user_agent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                        screen_dimensions: {},
                      },
                      event_metadata: {
                        item_count: 5,
                        products: [
                          {
                            id: '622c6f5d5cf86a4c77358033',
                            name: 'Cones of Dunshire',
                            category: 'Games',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with products Searched event mapped in UI',
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
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Products Searched',
              userId: 'testuserId1',
              properties: {
                product_id: '622c6f5d5cf86a4c77358033',
                sku: '8472-998-0112',
                category: 'Games',
                name: 'Cones of Dunshire',
                brand: 'Wyatt Games',
                variant: 'exapansion pack',
                price: 49.99,
                quantity: 5,
                coupon: 'PREORDER15',
                position: 1,
                url: 'https://www.website.com/product/path',
                image_url: 'https://www.website.com/product/path.webp',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                accountId: 'a2_fsddXXXfsfd',
                hashData: true,
                eventsMapping: [
                  {
                    from: 'Products Searched',
                    to: 'ViewContent',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
              endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
              headers: {
                Authorization: 'Bearer dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  events: [
                    {
                      event_at: '2019-10-14T09:03:17.562Z',
                      event_type: {
                        tracking_type: 'ViewContent',
                      },
                      user: {
                        email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                        external_id:
                          '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                        ip_address:
                          'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                        user_agent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                        screen_dimensions: {},
                      },
                      event_metadata: {
                        item_count: 5,
                        products: [
                          {
                            id: '622c6f5d5cf86a4c77358033',
                            name: 'Cones of Dunshire',
                            category: 'Games',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with product added to wishlist event',
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
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product added to wishlist',
              userId: 'testuserId1',
              properties: {
                list_id: 'list1',
                category: "What's New",
                products: [
                  {
                    product_id: '017c6f5d5cf86a4b22432066',
                    sku: '8732-98',
                    name: 'Just Another Game',
                    price: 22,
                    position: 2,
                    category: 'Games and Entertainment',
                    url: 'https://www.myecommercewebsite.com/product',
                    image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                  },
                  {
                    product_id: '89ac6f5d5cf86a4b64eac145',
                    sku: '1267-01',
                    name: 'Wrestling Trump Cards',
                    price: 4,
                    position: 21,
                    category: 'Card Games',
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
                accountId: 'a2_fsddXXXfsfd',
                hashData: true,
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
              endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
              headers: {
                Authorization: 'Bearer dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  events: [
                    {
                      event_at: '2019-10-14T09:03:17.562Z',
                      event_type: {
                        tracking_type: 'AddToWishlist',
                      },
                      user: {
                        email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                        external_id:
                          '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                        ip_address:
                          'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                        user_agent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                        screen_dimensions: {},
                      },
                      event_metadata: {
                        item_count: 0,
                        products: [
                          {
                            id: '017c6f5d5cf86a4b22432066',
                            name: 'Just Another Game',
                            category: 'Games and Entertainment',
                          },
                          {
                            id: '89ac6f5d5cf86a4b64eac145',
                            name: 'Wrestling Trump Cards',
                            category: 'Card Games',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with non-standard non-mapped event',
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
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Watch Items',
              userId: 'testuserId1',
              properties: {
                list_id: 'list1',
                category: "What's New",
                products: [
                  {
                    product_id: '017c6f5d5cf86a4b22432066',
                    sku: '8732-98',
                    name: 'Just Another Game',
                    price: 22,
                    position: 2,
                    category: 'Games and Entertainment',
                    url: 'https://www.myecommercewebsite.com/product',
                    image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                  },
                  {
                    product_id: '89ac6f5d5cf86a4b64eac145',
                    sku: '1267-01',
                    name: 'Wrestling Trump Cards',
                    price: 4,
                    position: 21,
                    category: 'Card Games',
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
                accountId: 'a2_fsddXXXfsfd',
                hashData: true,
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
              endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
              headers: {
                Authorization: 'Bearer dummyAccessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  events: [
                    {
                      event_at: '2019-10-14T09:03:17.562Z',
                      event_type: {
                        custom_event_name: 'Watch Items',
                        tracking_type: 'Custom',
                      },
                      user: {
                        email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                        external_id:
                          '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                        ip_address:
                          'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                        user_agent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                        screen_dimensions: {},
                      },
                      event_metadata: {
                        item_count: 0,
                        products: [
                          {
                            id: '017c6f5d5cf86a4b22432066',
                            name: 'Just Another Game',
                            category: 'Games and Entertainment',
                          },
                          {
                            id: '89ac6f5d5cf86a4b64eac145',
                            name: 'Wrestling Trump Cards',
                            category: 'Card Games',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with no accountId in Config',
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
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Watch Items',
              userId: 'testuserId1',
              properties: {
                list_id: 'list1',
                category: "What's New",
                products: [
                  {
                    product_id: '017c6f5d5cf86a4b22432066',
                    sku: '8732-98',
                    name: 'Just Another Game',
                    price: 22,
                    position: 2,
                    category: 'Games and Entertainment',
                    url: 'https://www.myecommercewebsite.com/product',
                    image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                  },
                  {
                    product_id: '89ac6f5d5cf86a4b64eac145',
                    sku: '1267-01',
                    name: 'Wrestling Trump Cards',
                    price: 4,
                    position: 21,
                    category: 'Card Games',
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
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
            error:
              'Account is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Account is not present. Aborting message.',
            statusCode: 400,
            statTags: {
              destType: 'REDDIT',
              destinationId: 'destId',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
            metadata: {
              destinationId: 'destId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with no messageType',
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
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Watch Items',
              userId: 'testuserId1',
              properties: {
                list_id: 'list1',
                category: "What's New",
                products: [
                  {
                    product_id: '017c6f5d5cf86a4b22432066',
                    sku: '8732-98',
                    name: 'Just Another Game',
                    price: 22,
                    position: 2,
                    category: 'Games and Entertainment',
                    url: 'https://www.myecommercewebsite.com/product',
                    image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                  },
                  {
                    product_id: '89ac6f5d5cf86a4b64eac145',
                    sku: '1267-01',
                    name: 'Wrestling Trump Cards',
                    price: 4,
                    position: 21,
                    category: 'Card Games',
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
                accountId: 'a2_fsddXXXfsfd',
                hashData: true,
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
            error:
              'message Type is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message Type is not present. Aborting message.',
            statusCode: 400,
            statTags: {
              destType: 'REDDIT',
              destinationId: 'destId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
            metadata: {
              destinationId: 'destId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with no event',
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
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              type: 'track',
              userId: 'testuserId1',
              properties: {
                list_id: 'list1',
                category: "What's New",
                products: [
                  {
                    product_id: '017c6f5d5cf86a4b22432066',
                    sku: '8732-98',
                    name: 'Just Another Game',
                    price: 22,
                    position: 2,
                    category: 'Games and Entertainment',
                    url: 'https://www.myecommercewebsite.com/product',
                    image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                  },
                  {
                    product_id: '89ac6f5d5cf86a4b64eac145',
                    sku: '1267-01',
                    name: 'Wrestling Trump Cards',
                    price: 4,
                    position: 21,
                    category: 'Card Games',
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
                accountId: 'a2_fsddXXXfsfd',
                hashData: true,
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
            error:
              'Event is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Event is not present. Aborting message.',
            statusCode: 400,
            statTags: {
              destType: 'REDDIT',
              destinationId: 'destId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
            metadata: {
              destinationId: 'destId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with no timestamp',
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
              anonymousId: '123456',
              type: 'track',
              event: 'Watch Items',
              userId: 'testuserId1',
              properties: {
                list_id: 'list1',
                category: "What's New",
                products: [
                  {
                    product_id: '017c6f5d5cf86a4b22432066',
                    sku: '8732-98',
                    name: 'Just Another Game',
                    price: 22,
                    position: 2,
                    category: 'Games and Entertainment',
                    url: 'https://www.myecommercewebsite.com/product',
                    image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                  },
                  {
                    product_id: '89ac6f5d5cf86a4b64eac145',
                    sku: '1267-01',
                    name: 'Wrestling Trump Cards',
                    price: 4,
                    position: 21,
                    category: 'Card Games',
                  },
                ],
              },
              integrations: {
                All: true,
              },
            },
            destination: {
              Config: {
                accountId: 'a2_fsddXXXfsfd',
                hashData: true,
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {
                accessToken: 'dummyAccessToken',
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
            error:
              'Timestamp is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Timestamp is not present. Aborting message.',
            statusCode: 400,
            statTags: {
              destType: 'REDDIT',
              destinationId: 'destId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
            metadata: {
              destinationId: 'destId',
              secret: {
                accessToken: 'dummyAccessToken',
              },
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'reddit',
    description: 'Track call with no accessToken in secret in metadata',
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
              anonymousId: '123456',
              type: 'track',
              event: 'Watch Items',
              userId: 'testuserId1',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              properties: {
                list_id: 'list1',
                category: "What's New",
                products: [
                  {
                    product_id: '017c6f5d5cf86a4b22432066',
                    sku: '8732-98',
                    name: 'Just Another Game',
                    price: 22,
                    position: 2,
                    category: 'Games and Entertainment',
                    url: 'https://www.myecommercewebsite.com/product',
                    image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                  },
                  {
                    product_id: '89ac6f5d5cf86a4b64eac145',
                    sku: '1267-01',
                    name: 'Wrestling Trump Cards',
                    price: 4,
                    position: 21,
                    category: 'Card Games',
                  },
                ],
              },
              integrations: {
                All: true,
              },
            },
            destination: {
              Config: {
                accountId: 'a2_fsddXXXfsfd',
                hashData: true,
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'Purchase',
                  },
                ],
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              secret: {},
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
            error:
              'Secret or accessToken is not present in the metadata: Workflow: procWorkflow, Step: buildResponseForProcessTransformation, ChildStep: undefined, OriginalError: Secret or accessToken is not present in the metadata',
            statusCode: 500,
            statTags: {
              destType: 'REDDIT',
              destinationId: 'destId',
              errorCategory: 'platform',
              errorType: 'oAuthSecret',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
            metadata: {
              destinationId: 'destId',
              secret: {},
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
];
