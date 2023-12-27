export const data = [
  {
    name: 'kustomer',
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
                type: 'identify',
                sentAt: '2021-01-03T17:02:53.195Z',
                userId: 'testc',
                channel: 'web',
                context: {
                  os: { name: '', version: '' },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  traits: {
                    name: 'test Rudderlabs',
                    email: 'test@rudderstack.com',
                    phone: '+12345578900',
                    birthday: '2005-01-01T23:28:56.782Z',
                    userId: 'testc',
                    address: {
                      street: '24 Dovers Lane',
                      city: 'Miami',
                      state: 'Florida',
                      postalCode: '1890001',
                    },
                    userName: 'testc47',
                    company: 'Rudderstack',
                    createdAt: '2015-04-17T12:37:42.146Z',
                    lastActivityAt: '2016-04-17T12:37:42.146Z',
                    lastCustomerActivityAt: '2017-04-17T12:37:42.146Z',
                    lastSeenAt: '2017-04-17T12:37:42.146Z',
                    avatar: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
                    gender: 'm',
                    tags: ['happy', 'satisfied'],
                    website: 'www.mattertoast873.com',
                    socials: [
                      {
                        verified: true,
                        userid: '100',
                        type: 'twitter',
                        username: '@testc',
                        url: 'http://twitter.com/testc',
                      },
                      {
                        verified: false,
                        userid: '200',
                        type: 'facebook',
                        username: 'testc',
                        url: 'http://facebook.com/testc',
                      },
                    ],
                  },
                  locale: 'en-US',
                  screen: { density: 2 },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                integrations: { All: true },
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  genericPage: false,
                  genericScreen: false,
                },
              },
            },
            {
              message: {
                type: 'track',
                event: 'Tracking-Weekender',
                sentAt: '2021-01-03T17:02:53.197Z',
                userId: 'user@doe',
                channel: 'web',
                context: {
                  os: { name: '', version: '' },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  page: {
                    url: 'http://morkey.in',
                    path: '/cart',
                    title: 'miphone',
                    search: 'MI',
                    referrer: 'morkey',
                  },
                  locale: 'en-US',
                  screen: { density: 2 },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '15129730-eb00-4db7-8db2-799566ccb2ef',
                properties: {
                  YearServicedNum: 211,
                  region: 'strapis',
                  kustomerTrackingId: 'sahetwiac',
                  kustomerSessionId: '63nsa22',
                },
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                locale: 'en-US',
                integrations: { All: true },
                originalTimestamp: '2021-01-03T17:02:53.195Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  genericPage: false,
                  genericScreen: false,
                },
              },
            },
            {
              message: {
                type: 'track',
                event: 'Tracking-Weekender',
                sentAt: '2021-01-03T17:02:53.197Z',
                userId: 'user@doe',
                channel: 'web',
                context: {
                  os: { name: '', version: '' },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  page: {
                    url: 'http://morkey.in',
                    path: '/cart',
                    title: 'miphone',
                    search: 'MI',
                    referrer: 'morkey',
                  },
                  locale: 'en-US',
                  screen: { density: 2 },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '15129730-eb00-4db7-8db2-799566ccb2ef',
                properties: {
                  YearServicedNum: 211,
                  region: 'strapis',
                  kustomerTrackingId: 'sahetwiac',
                  kustomerSessionId: '63nsa22',
                },
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                locale: 'en-US',
                integrations: { All: true },
                originalTimestamp: '2021-01-03T17:02:53.195Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  baseEndpoint: 'https://api.prod2.kustomerapp.com',
                  apiKey: 'dummyApiKey',
                  genericPage: false,
                  genericScreen: false,
                },
              },
            },
          ],
          destType: 'kustomer',
        },
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
                endpoint: 'https://api.kustomerapp.com/v1/customers',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummyApiKey',
                },
                params: {},
                body: {
                  JSON: {
                    name: 'test Rudderlabs',
                    externalId: 'testc',
                    username: 'testc47',
                    company: 'Rudderstack',
                    signedUpAt: '2015-04-17T12:37:42.146Z',
                    lastActivityAt: '2016-04-17T12:37:42.146Z',
                    lastCustomerActivityAt: '2017-04-17T12:37:42.146Z',
                    lastSeenAt: '2017-04-17T12:37:42.146Z',
                    avatarUrl: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
                    gender: 'm',
                    tags: ['happy', 'satisfied'],
                    locale: 'en-US',
                    socials: [
                      {
                        verified: true,
                        userid: '100',
                        type: 'twitter',
                        username: '@testc',
                        url: 'http://twitter.com/testc',
                      },
                      {
                        verified: false,
                        userid: '200',
                        type: 'facebook',
                        username: 'testc',
                        url: 'http://facebook.com/testc',
                      },
                    ],
                    birthdayAt: '2005-01-01T23:28:56.782Z',
                    emails: [
                      {
                        type: 'home',
                        email: 'test@rudderstack.com',
                      },
                    ],
                    phones: [
                      {
                        type: 'home',
                        phone: '+12345578900',
                      },
                    ],
                    urls: [
                      {
                        url: 'www.mattertoast873.com',
                      },
                    ],
                    locations: [
                      {
                        type: 'home',
                        address: '24 Dovers Lane Miami Florida 1890001',
                      },
                    ],
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
                  apiKey: 'dummyApiKey',
                  genericPage: false,
                  genericScreen: false,
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.kustomerapp.com/v1/tracking/identityEvent',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummyApiKey',
                },
                params: {},
                body: {
                  JSON: {
                    identity: {
                      externalId: 'user@doe',
                    },
                    event: {
                      name: 'Tracking-Weekender',
                      sessionId: '63nsa22',
                      trackingId: 'sahetwiac',
                      meta: {
                        YearServicedNum: 211,
                        region: 'strapis',
                      },
                    },
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
                  apiKey: 'dummyApiKey',
                  genericPage: false,
                  genericScreen: false,
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.prod2.kustomerapp.com/v1/tracking/identityEvent',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummyApiKey',
                },
                params: {},
                body: {
                  JSON: {
                    identity: {
                      externalId: 'user@doe',
                    },
                    event: {
                      name: 'Tracking-Weekender',
                      sessionId: '63nsa22',
                      trackingId: 'sahetwiac',
                      meta: {
                        YearServicedNum: 211,
                        region: 'strapis',
                      },
                    },
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
                  baseEndpoint: 'https://api.prod2.kustomerapp.com',
                  apiKey: 'dummyApiKey',
                  genericPage: false,
                  genericScreen: false,
                },
              },
            },
          ],
        },
      },
    },
  },
];
