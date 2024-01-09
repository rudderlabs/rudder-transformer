export const data = [
  {
    name: 'bluecore',
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
                  token: 'bluestore',
                },
              },
              metadata: {
                jobId: 1,
              },
              
              message: {
                context: {
                  device: {
                    model: 'mobile/iPad',
                  },
                  app: {
                    version: '4.0',
                  },
                  traits: {
                    email: 'xyz@example.com',
                  },
                },
                type: 'TRACK',
                event: 'Product Viewed', 
                userId: '27340af5c8819',
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
                  currency: 'USD',
                  position: 1,
                  url: 'https://www.website.com/product/path',
                  image_url: 'https://www.website.com/product/path.webp',
                },
              },
            },


          ],
          destType: 'bluecore',
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
              // "response": {
              //   "status": 200,
              //   "body": {
              //     "output": [
              //       {
                      "batchedRequest": {
                        "version": "1",
                        "type": "REST",
                        "method": "POST",
                        "endpoint": "https://api.bluecore.com/api/track/mobile/v1",
                        "headers": {
                          "Authorization": "Basic ZWZlYjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q2MjBlYzE=",
                          "Content-Type": "application/json"
                        },
                        "params": {},
                        "body": {
                          "JSON": {
                            "event": "viewed_product",
                            "properties": {
                              "products": [
                                {
                                  "id": "622c6f5d5cf86a4c77358033",
                                  "name": "Cones of Dunshire",
                                  "price": 49.99,
                                  "sku": "8472-998-0112",
                                  "category": "Games",
                                  "brand": "Wyatt Games",
                                  "variant": "exapansion pack",
                                  "quantity": 5,
                                  "coupon": "PREORDER15",
                                  "currency": "USD",
                                  "position": 1,
                                  "url": "https://www.website.com/product/path",
                                  "image_url": "https://www.website.com/product/path.webp"
                                }
                              ],
                              "distinct_id": "xyz@example.com",
                              "token": "bluestore",
                              "client": "4.0",
                              "device": "mobile/iPad"
                            }
                          },
                          "JSON_ARRAY": {},
                          "XML": {},
                          "FORM": {}
                        },
                        "files": {}
                      },
                      "metadata": [
                        {
                          "jobId": 1
                        }
                      ],
                      "batched": false,
                      "statusCode": 200,
  //                   },
  //        ],
  //      },
  //  "status": 200,
  //    },
                      "destination": {
                        "Config": {
                          token: 'bluestore',
                        }
                      }
                    }
                  ]
                }
              }
            },            
          // ],
  },
  {
    name: 'bluecore',
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
                  token: 'bluestore',
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                type: 'TRACK',
                event: 'Products Searched',
                userId: '27340af5c8819',
                context: {
                  device: {
                    model: 'mobile/iPad',
                  },
                  app: {
                    version: '4.0',
                  },
                  traits: {
                    email: 'xyz@example.com',
                  },
                },
                properties: {
                  query: 'logo design',
                  distinct_id: 'xyz@example.com',
                  token: 'bluestore',
                  client: '4.0',
                  device: 'mobile/iPad',
                },
              },
            },
          ],
          destType: 'bluecore',
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
                endpoint: 'https://api.bluecore.com/api/track/mobile/v1',
                headers: {
                  Authorization: 'Basic Ymx1ZXN0b3Jl',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event: 'search',
                    properties: {
                      search_term: 'logo design',
                      distinct_id: 'xyz@example.com',
                      token: 'bluestore',
                      client: '4.0',
                      device: 'mobile/iPad',
                    },
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
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  token: 'bluestore',
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'bluecore',
    description: 'Test 2',
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
                  token: 'bluestore',
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                type: 'TRACK',
                event: 'Order Completed',
                userId: '27340af5c8819',
                context: {
                  device: {
                    model: 'mobile/iPad',
                  },
                  app: {
                    version: '4.0',
                  },
                  traits: {
                    email: 'xyz@example.com',
                  },
                },
                properties: {
                  checkout_id: '70324a1f0eaf000000000000',
                  order_id: '40684e8f0eaf000000000000',
                  total: 52.0,
                  products: [
                    {
                      product_id: '622c6f5d5cf86a4c77358033',
                      sku: '8472-998-0112',
                      name: 'Cones of Dunshire',
                      price: 40,
                      position: 1,
                      category: 'Games',
                      url: 'https://www.website.com/product/path',
                      image_url: 'https://www.website.com/product/path.jpg',
                    },
                    {
                      product_id: '577c6f5d5cf86a4c7735ba03',
                      sku: '3309-483-2201',
                      name: 'Five Crowns',
                      price: 5,
                      position: 2,
                      category: 'Games',
                    },
                  ],
                },
              },
            },
          ],
          destType: 'bluecore',
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
                endpoint: 'https://api.bluecore.com/api/track/mobile/v1',
                headers: {
                  "Authorization": "Basic Ymx1ZXN0b3Jl",
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    event: 'purchase',
                    properties: {
                      products: [
                        {
                          id: '622c6f5d5cf86a4c77358033',
                          sku: '8472-998-0112',
                          name: 'Cones of Dunshire',
                          price: 40,
                          category: 'Games',
                          position: 1,
                          url: 'https://www.website.com/product/path',
                          image_url: 'https://www.website.com/product/path.jpg',
                        },
                        {
                          id: '577c6f5d5cf86a4c7735ba03',
                          sku: '3309-483-2201',
                          name: 'Five Crowns',
                          price: 5,
                          category: 'Games',
                          position: 2,
                        },
                      ],
                      distinct_id: '27340af5c8819',
                      token: 'bluestore',
                      client: '4.0',
                      device: 'mobile/iPad',
                      total: 52.0,
                      order_id: '40684e8f0eaf000000000000',
                    },
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
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  token: 'bluestore',
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'bluecore',
    description: 'Test 3',
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
                  token: 'bluestore',
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                type: 'Identify',
                userId: '27340af5c8819',
                context: {
                  device: {
                    model: 'mobile/iPad',
                  },
                  app: {
                    version: '4.0',
                  },
                  traits: {
                    email: 'rhedricks@example.com',
                  },
                },
                properties: {
                  query: 'logo design',
                },
              },
            },
          ],
          destType: 'bluecore',
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
                endpoint: 'https://api.bluecore.com/api/track/mobile/v1',
                headers: {
                  Authorization: 'Basic Ymx1ZXN0b3Jl',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    "event": "identify",
                    "properties": {
                        "distinct_id": "27340af5c8819",
                        "token": "bluestore",
                        "client": "4.0",
                        "device": "mobile/iPad",
                        "customer": {
                            "email": "rhedricks@example.com"
                        },
                    },
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
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  token: 'bluestore',
                },
              },
            },
          ],
        },
      },
    },
  },
  ];
