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
                  eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                  usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
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
                          "eventApiKey": "efeb4a29aba5e75d99c8a18acd620ec1",
                          "usersApiKey": "b4a29aba5e75duic8a18acd920ec1e2e",
                        }
                      }
                    }
                  ]
                }
              }
            },            
          // ],
        },
  //     },
  //   },
  // },
  // {
  //   name: 'bluecore',
  //   description: 'Transform Rudderstack to Bluecore event',
  //   feature: 'router',
  //   module: 'destination',
  //   version: 'v1',
  //   input: {
  //     request: {
  //       body: {
  //         input: [
  //           {
  //             destination: {
  //               Config: {
  //                 eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
  //                 usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
  //               },
  //             },
  //             metadata: {
  //               jobId: 2,
  //             },
  //             message: {
  //               type: 'IDENTIFY',
  //               event: 'identify',
  //               userId: '27340af5c8819',
  //               properties: {
  //                 name: 'Richard Hendricks',
  //                 email: 'rhedricks@example.com',
  //                 logins: 2,
  //               },
  //             },
  //           },
  //         ],
  //         destType: 'bluecore',
  //       },
  //       method: 'POST',
  //     },
  //   },
  //   output: {
  //     response: {
  //       status: 200,
  //       body: {
  //         output: [
  //           {
  //             response: {
  //               status: 200,
  //               body: {
  //                 output: [
  //                   {
  //                     batchedRequest: {
  //                       version: '1',
  //                       type: 'REST',
  //                       method: 'POST',
  //                       endpoint: 'https://api.bluecore.com/api/track/mobile/v1',
  //                       headers: {
  //                         Authorization:
  //                           'Basic ZWZlYjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q2MjBlYzE=',
  //                         'Content-Type': 'application/json',
  //                       },
  //                       params: {},
  //                       body: {
  //                         JSON: {
  //                           event: 'identify',
  //                           properties: {
  //                             distinct_id: '27340af5c8819',
  //                             token: 'bluestore',
  //                             client: '4.0',
  //                             device: 'mobile/iPad',
  //                             customer: {
  //                               email: 'rhedricks@example.com',
  //                             },
  //                           },
  //                         },
  //                         JSON_ARRAY: {},
  //                         XML: {},
  //                         FORM: {},
  //                       },
  //                       files: {},
  //                     },
  //                     metadata: [
  //                       {
  //                         jobId: 2,
  //                       },
  //                     ],
  //                     batched: false,
  //                     statusCode: 200,
  //                     destination: {
  //                       Config: {
  //                         eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
  //                         usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
  //                       },
  //                     },
  //                   },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   },
  // },
];
