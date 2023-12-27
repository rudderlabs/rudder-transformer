export const data = [
  {
    name: 'kustomer',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'Testc',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  name: 'Test Rudderlabs',
                  email: 'test@rudderstack.com',
                  phone: '+12345578900',
                  birthday: '2005-01-01T23:28:56.782Z',
                  userId: 'Testc',
                  address: {
                    street: '24 Dovers Lane',
                    city: 'Miami',
                    state: 'Florida',
                    postalCode: '1890001',
                  },
                  userName: 'Testc47',
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
                      username: '@Testc',
                      url: 'http://twitter.com/Testc',
                    },
                    {
                      verified: false,
                      userid: '200',
                      type: 'facebook',
                      username: 'Testc',
                      url: 'http://facebook.com/Testc',
                    },
                  ],
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              endpoint: 'https://api.kustomerapp.com/v1/customers',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  name: 'Test Rudderlabs',
                  externalId: 'Testc',
                  username: 'Testc47',
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
                      username: '@Testc',
                      url: 'http://twitter.com/Testc',
                    },
                    {
                      verified: false,
                      userid: '200',
                      type: 'facebook',
                      username: 'Testc',
                      url: 'http://facebook.com/Testc',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'kustomer',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              userId: '58210c3db0f09110006b7953',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  name: 'Ano Domeni',
                  phone: '+12345578000',
                  birthday: '2005-01-01T23:28:56.782Z',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              method: 'PUT',
              endpoint:
                'https://api.kustomerapp.com/v1/customers/58210c3db0f09110006b7953?replace=false',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  name: 'Ano Domeni',
                  externalId: '58210c3db0f09110006b7953',
                  locale: 'en-US',
                  birthdayAt: '2005-01-01T23:28:56.782Z',
                  phones: [
                    {
                      type: 'home',
                      phone: '+12345578000',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'kustomer',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            message: {
              type: 'screen',
              event: 'Test-Event-Screen',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'Testc',
              channel: 'mobile',
              context: {
                os: {
                  name: 'Android',
                  version: '10',
                },
                app: {
                  name: 'KlaviyoTest',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '9c6bd77ea9da3e68',
                  name: 'raphaelin',
                  type: 'android',
                  model: 'Redmi K20 Pro',
                  manufacturer: 'Xiaomi',
                },
                locale: 'en-IN',
                screen: {
                  width: 1080,
                  height: 2210,
                  density: 440,
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                network: {
                  wifi: true,
                  carrier: 'airtel',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)',
              },
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              properties: {
                hasAccount: 'true',
                YearSelectedNum: 1801,
                originalServing: '2021-01-25T15:32:56.409Z',
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
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
              endpoint: 'https://api.kustomerapp.com/v1/tracking/identityEvent',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  identity: {
                    externalId: 'Testc',
                  },
                  event: {
                    name: 'Screen-Viewed-Test-Event-Screen',
                    meta: {
                      hasAccount: 'true',
                      YearSelectedNum: 1801,
                      originalServing: '2021-01-25T15:32:56.409Z',
                    },
                  },
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'kustomer',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            message: {
              name: 'Cart-Viewed',
              type: 'page',
              sentAt: '2021-01-03T17:02:53.197Z',
              userId: 'user@doe',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  density: 2,
                },
                traits: {
                  userId: 'userid',
                  profession: 'Student',
                  anonymousId: 'd80b66d5-b33d-412d-866f-r4fft5841af',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              category: 'Cart',
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '15129730-eb00-4db7-8db2-799566ccb2ef',
              properties: {
                url: 'http://morkey.in',
                name: 'Cart Viewed',
                path: '/cart',
                title: 'miphone',
                search: 'MI',
                category: 'Cart',
                referrer: 'morkey',
                domain: 'morkey.com',
              },
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-03T17:02:53.195Z',
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
                    name: 'Web-Page-Viewed-Cart-Viewed',
                    meta: {
                      url: 'http://morkey.in',
                      name: 'Cart Viewed',
                      path: '/cart',
                      title: 'miphone',
                      search: 'MI',
                      category: 'Cart',
                      referrer: 'morkey',
                      domain: 'morkey.com',
                    },
                  },
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'kustomer',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            message: {
              type: 'page',
              sentAt: '2021-01-03T17:02:53.197Z',
              userId: 'user@doe',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  density: 2,
                },
                traits: {
                  userId: 'userid',
                  profession: 'Student',
                  anonymousId: 'd80b66d5-b33d-412d-866f-r4fft5841af',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              category: 'Cart',
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '15129730-eb00-4db7-8db2-799566ccb2ef',
              properties: {
                url: 'http://morkey.in',
                path: '/cart',
                title: 'miphone',
                search: 'MI',
                category: 'Cart',
                referrer: 'morkey',
                domain: 'morkey.com',
                kustomerTrackingId: '829131sjad',
                kustomerSessionId: 'hsad522',
              },
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-03T17:02:53.195Z',
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
                    name: 'Web-Page-Viewed',
                    sessionId: 'hsad522',
                    trackingId: '829131sjad',
                    meta: {
                      url: 'http://morkey.in',
                      path: '/cart',
                      title: 'miphone',
                      search: 'MI',
                      category: 'Cart',
                      referrer: 'morkey',
                      domain: 'morkey.com',
                    },
                  },
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'kustomer',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            message: {
              type: 'track',
              event: 'Tracking-Weekender',
              sentAt: '2021-01-03T17:02:53.197Z',
              userId: 'user@doe',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
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
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-03T17:02:53.195Z',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'kustomer',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            message: {
              type: 'track',
              event: 'Tracking-Weekender2',
              sentAt: '2021-01-03T17:02:53.197Z',
              userId: 'user@doe',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '15129730-eb00-4db7-8db2-799566ccb2ef',
              properties: {
                YearServicedNum: 211,
                'reg_8-821x': false,
                kustomer_tracking_id: 'sahetwiac',
                kustomer_session_id: '63nsa22',
              },
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
              },
              locale: 'en-US',
              originalTimestamp: '2021-01-03T17:02:53.195Z',
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
              endpoint: 'https://api.kustomerapp.com/v1/tracking/identityEvent',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                FORM: {},
                JSON: {
                  event: {
                    meta: {
                      YearServicedNum: 211,
                      'reg_8-821x': false,
                    },
                    name: 'Tracking-Weekender2',
                    sessionId: '63nsa22',
                    trackingId: 'sahetwiac',
                  },
                  identity: {
                    externalId: 'user@doe',
                  },
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'kustomer',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                genericPage: true,
              },
            },
            message: {
              type: 'page',
              name: 'Unfinished page',
              sentAt: '2021-01-03T17:02:53.197Z',
              userId: 'user@doe',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '15129730-eb00-4db7-8db2-799566ccb2ef',
              properties: {
                url: 'http://morkey.in',
                path: '/cart',
                title: 'miphone',
                search: 'MI',
                category: 'Cart',
                referrer: 'morkey',
                domain: 'morkey.com',
              },
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
              },
              locale: 'en-US',
              originalTimestamp: '2021-01-03T17:02:53.195Z',
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
                    name: 'Web-Page-Viewed',
                    meta: {
                      url: 'http://morkey.in',
                      path: '/cart',
                      title: 'miphone',
                      search: 'MI',
                      category: 'Cart',
                      referrer: 'morkey',
                      domain: 'morkey.com',
                    },
                  },
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'kustomer',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                genericScreen: true,
              },
            },
            message: {
              type: 'screen',
              event: 'Test-Event-Screen',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'Testc',
              channel: 'mobile',
              context: {
                os: {
                  name: 'Android',
                  version: '10',
                },
                app: {
                  name: 'KlaviyoTest',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '9c6bd77ea9da3e68',
                  name: 'raphaelin',
                  type: 'android',
                  model: 'Redmi K20 Pro',
                  manufacturer: 'Xiaomi',
                },
                locale: 'en-IN',
                screen: {
                  width: 1080,
                  height: 2210,
                  density: 440,
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                network: {
                  wifi: true,
                  carrier: 'airtel',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)',
              },
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              properties: {
                hasAccount: 'true',
                YearSelectedNum: 1801,
                originalServing: '2021-01-25T15:32:56.409Z',
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
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
              endpoint: 'https://api.kustomerapp.com/v1/tracking/identityEvent',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  identity: {
                    externalId: 'Testc',
                  },
                  event: {
                    name: 'Screen-Viewed',
                    meta: {
                      hasAccount: 'true',
                      YearSelectedNum: 1801,
                      originalServing: '2021-01-25T15:32:56.409Z',
                    },
                  },
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'kustomer',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'Testc',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                  email: 'test@rudderstack.com',
                  phone: '+12345578900',
                  birthday: '2005-01-01T23:28:56.782Z',
                  userId: 'Testc',
                  address: {
                    street: '24 Dovers Lane',
                    city: 'Miami',
                    state: 'Florida',
                    postalCode: '1890001',
                  },
                  userName: 'Testc47',
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
                      username: '@Testc',
                      url: 'http://twitter.com/Testc',
                    },
                    {
                      verified: false,
                      userid: '200',
                      type: 'facebook',
                      username: 'Testc',
                      url: 'http://facebook.com/Testc',
                    },
                  ],
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              endpoint: 'https://api.kustomerapp.com/v1/customers',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  name: 'Test Rudderlabs',
                  externalId: 'Testc',
                  username: 'Testc47',
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
                      username: '@Testc',
                      url: 'http://twitter.com/Testc',
                    },
                    {
                      verified: false,
                      userid: '200',
                      type: 'facebook',
                      username: 'Testc',
                      url: 'http://facebook.com/Testc',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'kustomer',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'Testc',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
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
                  birthday: '2005-01-01T23:28:56.782Z',
                  userId: 'Testc',
                  address: 'test address string',
                  userName: 'Testc47',
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
                      username: '@Testc',
                      url: 'http://twitter.com/Testc',
                    },
                    {
                      verified: false,
                      userid: '200',
                      type: 'facebook',
                      username: 'Testc',
                      url: 'http://facebook.com/Testc',
                    },
                  ],
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              endpoint: 'https://api.kustomerapp.com/v1/customers',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  name: 'Test Rudderlabs',
                  externalId: 'Testc',
                  username: 'Testc47',
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
                      username: '@Testc',
                      url: 'http://twitter.com/Testc',
                    },
                    {
                      verified: false,
                      userid: '200',
                      type: 'facebook',
                      username: 'Testc',
                      url: 'http://facebook.com/Testc',
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
                      address: 'test address string',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'kustomer',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'Testc',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
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
                  birthday: '2005-01-01T23:28:56.782Z',
                  userId: 'Testc',
                  address: 'test address string',
                  userName: 'Testc47',
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
                      username: '@Testc',
                      url: 'http://twitter.com/Testc',
                    },
                    {
                      verified: false,
                      userid: '200',
                      type: 'facebook',
                      username: 'Testc',
                      url: 'http://facebook.com/Testc',
                    },
                  ],
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                externalId: [
                  {
                    type: 'kustomerId',
                    id: 'abcd1234',
                  },
                ],
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              method: 'PUT',
              endpoint: 'https://api.kustomerapp.com/v1/customers/abcd1234?replace=false',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  name: 'Test Rudderlabs',
                  externalId: 'Testc',
                  username: 'Testc47',
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
                      username: '@Testc',
                      url: 'http://twitter.com/Testc',
                    },
                    {
                      verified: false,
                      userid: '200',
                      type: 'facebook',
                      username: 'Testc',
                      url: 'http://facebook.com/Testc',
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
                      address: 'test address string',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'kustomer',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                genericScreen: true,
              },
            },
            message: {
              type: 'screen',
              event: 'Test-Event-Screen',
              userId: 'utsabc',
              channel: 'mobile',
              context: {
                os: {
                  name: 'Android',
                  version: '10',
                },
                app: {
                  name: 'KlaviyoTest',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '9c6bd77ea9da3e68',
                  name: 'raphaelin',
                  type: 'android',
                  model: 'Redmi K20 Pro',
                  manufacturer: 'Xiaomi',
                },
                locale: 'en-IN',
                screen: {
                  width: 1080,
                  height: 2210,
                  density: 440,
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                network: {
                  wifi: true,
                  carrier: 'airtel',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)',
                sessionId: 'hsad522',
              },
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              properties: {
                hasAccount: 'true',
                YearSelectedNum: 1801,
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2023-01-10T15:32:56.409Z',
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
              endpoint: 'https://api.kustomerapp.com/v1/tracking/identityEvent',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  identity: {
                    externalId: 'utsabc',
                  },
                  event: {
                    name: 'Screen-Viewed',
                    sessionId: 'hsad522',
                    meta: {
                      hasAccount: 'true',
                      YearSelectedNum: 1801,
                    },
                  },
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'kustomer',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                baseEndpoint: 'https://api.prod2.kustomerapp.com',
                genericScreen: true,
              },
            },
            message: {
              type: 'screen',
              event: 'Test-Event-Screen',
              userId: 'Testc',
              channel: 'mobile',
              context: {
                os: {
                  name: 'Android',
                  version: '10',
                },
                app: {
                  name: 'KlaviyoTest',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '9c6bd77ea9da3e68',
                  name: 'raphaelin',
                  type: 'android',
                  model: 'Redmi K20 Pro',
                  manufacturer: 'Xiaomi',
                },
                locale: 'en-IN',
                screen: {
                  width: 1080,
                  height: 2210,
                  density: 440,
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                network: {
                  wifi: true,
                  carrier: 'airtel',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)',
                sessionId: 'hsad522',
              },
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              properties: {
                hasAccount: 'true',
                YearSelectedNum: 1801,
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2023-01-10T15:32:56.409Z',
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
              endpoint: 'https://api.prod2.kustomerapp.com/v1/tracking/identityEvent',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  identity: {
                    externalId: 'Testc',
                  },
                  event: {
                    name: 'Screen-Viewed',
                    sessionId: 'hsad522',
                    meta: {
                      hasAccount: 'true',
                      YearSelectedNum: 1801,
                    },
                  },
                },
                XML: {},
                JSON_ARRAY: {},
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
