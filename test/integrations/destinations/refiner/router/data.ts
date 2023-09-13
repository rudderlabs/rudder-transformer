export const data = [
  {
    name: 'refiner',
    description:
      'Successfull Identify Call eventDelivery set to True and with userAttributesMapping from config ',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                sentAt: '2022-10-11T13:10:54.877+05:30',
                userId: 'user@45',
                context: {
                  traits: {
                    age: '30',
                    city: 'Banglore',
                    email: 'test@user.com',
                    phone: '7267286346802347827',
                    address: {
                      city: 'ahmedabad',
                      state: 'india',
                    },
                    lastName: 'user',
                    username: 'testUser',
                    firstName: 'test',
                    userCountry: 'india',
                  },
                },
                rudderId: 'caae04c5-959f-467b-a293-86f6c62d59e6',
                messageId: 'b6ce7f31-5d76-4240-94d2-3eea020ef791',
                timestamp: '2022-10-11T13:10:52.137+05:30',
                receivedAt: '2022-10-11T13:10:52.138+05:30',
                request_ip: '[::1]',
                originalTimestamp: '2022-10-11T13:10:54.877+05:30',
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  blacklistedEvents: [{ eventName: '' }],
                  eventDelivery: true,
                  eventDeliveryTS: 1665475307930,
                  eventFilteringOption: 'disable',
                  userAttributesMapping: [{ from: 'address', to: 'userAddress' }],
                  whitelistedEvents: [{ eventName: '' }],
                },
              },
            },
          ],
          destType: 'refiner',
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
              batchedRequest: {
                body: {
                  FORM: {
                    age: '30',
                    city: 'Banglore',
                    email: 'test@user.com',
                    firstName: 'test',
                    lastName: 'user',
                    phone: '7267286346802347827',
                    userAddress: {
                      city: 'ahmedabad',
                      state: 'india',
                    },
                    userCountry: 'india',
                    userId: 'user@45',
                    username: 'testUser',
                  },
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.refiner.io/v1/identify-user',
                files: {},
                headers: {
                  Authorization: 'Bearer dummyApiKey',
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  blacklistedEvents: [{ eventName: '' }],
                  eventDelivery: true,
                  eventDeliveryTS: 1665475307930,
                  eventFilteringOption: 'disable',
                  userAttributesMapping: [{ from: 'address', to: 'userAddress' }],
                  whitelistedEvents: [{ eventName: '' }],
                },
              },
              metadata: [{ jobId: 1 }],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'refiner',
    description: 'Successfull Track Call of event Product Searched',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Product Searched',
                sentAt: '2022-10-11T13:38:31.827+05:30',
                userId: 'user@45',
                channel: 'web',
                context: {
                  os: { name: '', version: '' },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.2',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  page: {
                    url: 'http://0.0.0.0:1112/tests/html/ecomm_test.html',
                    path: '/tests/html/ecomm_test.html',
                    title: 'Fb Offline Conversion Ecommerce Test',
                    search: '',
                    referrer: 'http://0.0.0.0:1112/tests/html/',
                  },
                  locale: 'en-GB',
                  screen: { density: 2 },
                  traits: {
                    age: '30',
                    city: 'Banglore',
                    email: 'test@user.com',
                    phone: '7267286346802347827',
                    lastName: 'user',
                    username: 'testUser',
                    firstName: 'test',
                    userCountry: 'india',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.2',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
                },
                rudderId: 'caae04c5-959f-467b-a293-86f6c62d59e6',
                messageId: '9116b734-7e6b-4497-ab51-c16744d4487e',
                timestamp: '2022-10-11T13:38:29.177+05:30',
                properties: {
                  coupon: 'APPARELSALE',
                  currency: 'IND',
                  order_id: '5241735',
                  products: [
                    {
                      id: 'product-bacon-jam',
                      category: 'Merch',
                      brand: '',
                    },
                    {
                      id: 'product-t-shirt',
                      category: 'Merch',
                      brand: 'Levis',
                    },
                    {
                      id: 'offer-t-shirt',
                      category: 'Merch',
                      brand: 'Levis',
                    },
                  ],
                },
                receivedAt: '2022-10-11T13:38:29.178+05:30',
                request_ip: '[::1]',
                originalTimestamp: '2022-10-11T13:38:31.827+05:30',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  blacklistedEvents: [{ eventName: '' }],
                  eventDelivery: true,
                  eventDeliveryTS: 1665475307930,
                  eventFilteringOption: 'disable',
                  userAttributesMapping: [{ from: 'address', to: 'userAddress' }],
                  whitelistedEvents: [{ eventName: '' }],
                },
              },
            },
          ],
          destType: 'refiner',
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
              batchedRequest: {
                body: {
                  FORM: {
                    email: 'test@user.com',
                    event: 'Product Searched',
                    id: 'user@45',
                  },
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.refiner.io/v1/track',
                files: {},
                headers: {
                  Authorization: 'Bearer dummyApiKey',
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  blacklistedEvents: [{ eventName: '' }],
                  eventDelivery: true,
                  eventDeliveryTS: 1665475307930,
                  eventFilteringOption: 'disable',
                  userAttributesMapping: [{ from: 'address', to: 'userAddress' }],
                  whitelistedEvents: [{ eventName: '' }],
                },
              },
              metadata: [{ jobId: 2 }],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'refiner',
    description: 'Successfull Group Call based in email from traits',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                sentAt: '2015-02-23T22:28:55.111Z',
                traits: {
                  name: 'rudder ventures',
                  email: 'business@rudderstack.com',
                },
                userId: 'test@12',
                channel: 'browser',
                context: {
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
                },
                groupId: 'group@123',
                rudderId: 'd944be7a-c870-41ba-9fa5-f3c9dbf5f7e0',
                messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
                request_ip: '[::1]',
                integrations: { All: true },
                originalTimestamp: '2022-10-11T13:51:00.906+05:30',
              },
              metadata: {
                jobId: 3,
              },
              destination: {
                Config: {
                  accountAttributesMapping: [{ from: 'email', to: 'businessEmail' }],
                  apiKey: 'dummyApiKey',
                  blacklistedEvents: [{ eventName: '' }],
                  eventDelivery: true,
                  eventDeliveryTS: 1665476456112,
                  eventFilteringOption: 'disable',
                  userAttributesMapping: [{ from: 'address', to: 'userAddress' }],
                  whitelistedEvents: [{ eventName: '' }],
                },
              },
            },
          ],
          destType: 'refiner',
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
              batchedRequest: {
                body: {
                  FORM: {
                    'account[businessEmail]': 'business@rudderstack.com',
                    'account[id]': 'group@123',
                    'account[name]': 'rudder ventures',
                    id: 'test@12',
                  },
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.refiner.io/v1/identify-user',
                files: {},
                headers: {
                  Authorization: 'Bearer dummyApiKey',
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  accountAttributesMapping: [{ from: 'email', to: 'businessEmail' }],
                  apiKey: 'dummyApiKey',
                  blacklistedEvents: [{ eventName: '' }],
                  eventDelivery: true,
                  eventDeliveryTS: 1665476456112,
                  eventFilteringOption: 'disable',
                  userAttributesMapping: [{ from: 'address', to: 'userAddress' }],
                  whitelistedEvents: [{ eventName: '' }],
                },
              },
              metadata: [{ jobId: 3 }],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
