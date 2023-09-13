export const data = [
  {
    name: 'airship',
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
                  apiKey: 'dummyApiKey',
                  appKey: 'O2YARRI15I',
                  dataCenter: false,
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'testone@gmail.com',
                    firstName: 'test',
                    lastName: 'one',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                type: 'track',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'Product Clicked',
                userId: 'testuserId1',
                properties: {
                  description: 'Sneaker purchase',
                  brand: 'Victory Sneakers',
                  colors: ['red', 'blue'],
                  items: [
                    {
                      text: 'New Line Sneakers',
                      price: '$ 79.95',
                    },
                    {
                      text: 'Old Line Sneakers',
                      price: '$ 79.95',
                    },
                    {
                      text: 'Blue Line Sneakers',
                      price: '$ 79.95',
                    },
                  ],
                  name: 'Hugh Manbeing',
                  userLocation: {
                    state: 'CO',
                    zip: '80202',
                  },
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
          ],
          destType: 'airship',
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
                endpoint: 'https://go.urbanairship.com/api/custom-events',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/vnd.urbanairship+json; version=3',
                  'X-UA-Appkey': 'O2YARRI15I',
                  Authorization: 'Bearer dummyApiKey',
                },
                params: {},
                body: {
                  JSON: {
                    occured: '2019-10-14T09:03:17.562Z',
                    user: {
                      named_user_id: 'testuserId1',
                    },
                    body: {
                      name: 'product_clicked',
                      properties: {
                        description: 'Sneaker purchase',
                        brand: 'Victory Sneakers',
                        colors: ['red', 'blue'],
                        items: [
                          {
                            text: 'New Line Sneakers',
                            price: '$ 79.95',
                          },
                          {
                            text: 'Old Line Sneakers',
                            price: '$ 79.95',
                          },
                          {
                            text: 'Blue Line Sneakers',
                            price: '$ 79.95',
                          },
                        ],
                        name: 'Hugh Manbeing',
                        userLocation: {
                          state: 'CO',
                          zip: '80202',
                        },
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
                  apiKey: 'dummyApiKey',
                  appKey: 'O2YARRI15I',
                  dataCenter: false,
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'airship',
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
                  apiKey: 'dummyApiKey',
                  appKey: 'O2YARRI15I',
                  dataCenter: false,
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                anonymousId: '507f191e810c19729de860ea',
                channel: 'browser',
                context: {
                  ip: '8.8.8.8',
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
                receivedAt: '2015-02-23T22:28:55.387Z',
                sentAt: '2015-02-23T22:28:55.111Z',
                timestamp: '2015-02-23T22:28:55.111Z',
                traits: {
                  name: 'Peter Gibbons',
                  age: 34,
                  email: 'peter@example.com',
                  plan: 'premium',
                  logins: 5,
                  address: {
                    street: '6th St',
                    city: 'San Francisco',
                    state: 'CA',
                    postalCode: '94103',
                    country: 'USA',
                  },
                  firstName: true,
                  lastName: false,
                  favColor: true,
                },
                type: 'identify',
                userId: '97980cfea0067',
                version: '1',
              },
            },
          ],
          destType: 'airship',
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
                  endpoint: 'https://go.urbanairship.com/api/named_users/tags',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.urbanairship+json; version=3',
                    Authorization: 'Bearer dummyApiKey',
                  },
                  params: {},
                  body: {
                    JSON: {
                      audience: {
                        named_user_id: '97980cfea0067',
                      },
                      add: {
                        rudderstack_integration: ['firstname', 'favcolor'],
                      },
                      remove: {
                        rudderstack_integration: ['lastname'],
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://go.urbanairship.com/api/named_users/97980cfea0067/attributes',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.urbanairship+json; version=3',
                    Authorization: 'Bearer dummyApiKey',
                  },
                  params: {},
                  body: {
                    JSON: {
                      attributes: [
                        {
                          action: 'set',
                          key: 'full_name',
                          value: 'Peter Gibbons',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'age',
                          value: 34,
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'email',
                          value: 'peter@example.com',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'plan',
                          value: 'premium',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'logins',
                          value: 5,
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'address_street',
                          value: '6th St',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'city',
                          value: 'San Francisco',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'region',
                          value: 'CA',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'zipcode',
                          value: '94103',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'country',
                          value: 'USA',
                          timestamp: '2015-02-23T22:28:55Z',
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
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  appKey: 'O2YARRI15I',
                  dataCenter: false,
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'airship',
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
                  apiKey: 'dummyApiKey',
                  dataCenter: false,
                },
              },
              metadata: {
                jobId: 3,
              },
              message: {
                anonymousId: '507f191e810c19729de860ea',
                channel: 'browser',
                context: {
                  ip: '8.8.8.8',
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
                receivedAt: '2015-02-23T22:28:55.387Z',
                sentAt: '2015-02-23T22:28:55.111Z',
                timestamp: '2015-02-23T22:28:55.111Z',
                traits: {
                  name: 'Peter Gibbons',
                  age: 34,
                  email: 'peter@example.com',
                  plan: 'premium',
                  logins: 5,
                  address: {
                    street: '6th St',
                    city: 'San Francisco',
                    state: 'CA',
                    postalCode: '94103',
                    country: 'USA',
                  },
                  firstName: true,
                  lastName: false,
                  favColor: true,
                },
                type: 'group',
                userId: '97980cfea0067',
                version: '1',
              },
            },
          ],
          destType: 'airship',
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
                  endpoint: 'https://go.urbanairship.com/api/named_users/tags',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.urbanairship+json; version=3',
                    Authorization: 'Bearer dummyApiKey',
                  },
                  params: {},
                  body: {
                    JSON: {
                      audience: {
                        named_user_id: '97980cfea0067',
                      },
                      add: {
                        rudderstack_integration_group: ['firstname', 'favcolor'],
                      },
                      remove: {
                        rudderstack_integration_group: ['lastname'],
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://go.urbanairship.com/api/named_users/97980cfea0067/attributes',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.urbanairship+json; version=3',
                    Authorization: 'Bearer dummyApiKey',
                  },
                  params: {},
                  body: {
                    JSON: {
                      attributes: [
                        {
                          action: 'set',
                          key: 'full_name',
                          value: 'Peter Gibbons',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'age',
                          value: 34,
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'email',
                          value: 'peter@example.com',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'plan',
                          value: 'premium',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'logins',
                          value: 5,
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'address_street',
                          value: '6th St',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'city',
                          value: 'San Francisco',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'region',
                          value: 'CA',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'zipcode',
                          value: '94103',
                          timestamp: '2015-02-23T22:28:55Z',
                        },
                        {
                          action: 'set',
                          key: 'country',
                          value: 'USA',
                          timestamp: '2015-02-23T22:28:55Z',
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
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  dataCenter: false,
                },
              },
            },
          ],
        },
      },
    },
  },
];
