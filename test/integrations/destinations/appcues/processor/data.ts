export const data = [
  {
    name: 'appcues',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '33787665-4168-4acc-8df7-17ba79325332',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                campaign: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/rudder-sdk-js/tests/html/script-test.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost:4321/rudder-sdk-js/tests/html/script-test.html',
                },
                screen: {
                  density: 2,
                },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-01-04T13:55:04.798+05:30',
              type: 'identify',
              userId: 'onlyUserId',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  request_id: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
                  profile_update: {},
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              userId: '',
              params: {},
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.appcues.com/v1/accounts/86086/users/onlyUserId/activity',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '33787665-4168-4acc-8df7-17ba79325332',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                campaign: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/rudder-sdk-js/tests/html/script-test.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost:4321/rudder-sdk-js/tests/html/script-test.html',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  'first name': 'John',
                  'last name': 'Abraham',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '57494c6a-3c62-4b30-83aa-6e821d37ac75',
              originalTimestamp: '2021-01-04T08:25:04.786Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: 'ed2ed08a-3cd9-4b2c-9b04-7e3d3501fab7',
              sentAt: '2021-01-04T08:25:04.787Z',
              timestamp: '2021-01-04T13:55:04.798+05:30',
              type: 'identify',
              userId: 'userIdWithProperties',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  request_id: '57494c6a-3c62-4b30-83aa-6e821d37ac75',
                  profile_update: {
                    'last name': 'Abraham',
                    'first name': 'John',
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              userId: '',
              params: {},
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint:
                'https://api.appcues.com/v1/accounts/86086/users/userIdWithProperties/activity',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '59f2911c-f050-497d-9f80-e1696a3c56aa',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                campaign: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/rudder-sdk-js/tests/html/script-test.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost:4321/rudder-sdk-js/tests/html/script-test.html',
                },
                screen: {
                  density: 2,
                },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              event: 'eventWithoutProperties',
              integrations: {
                All: true,
              },
              messageId: '045f5107-6036-4557-ae17-6ddf5ee57eb6',
              originalTimestamp: '2021-01-04T08:33:07.004Z',
              properties: {},
              receivedAt: '2021-01-04T14:03:07.009+05:30',
              request_ip: '[::1]',
              rudderId: '9b6b8204-292c-493b-9c08-2c3ec0ade688',
              sentAt: '2021-01-04T08:33:07.005Z',
              timestamp: '2021-01-04T14:03:07.008+05:30',
              type: 'track',
              userId: 'sampleId',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      name: 'eventWithoutProperties',
                      timestamp: 1609749187,
                      attributes: {},
                    },
                  ],
                  request_id: '045f5107-6036-4557-ae17-6ddf5ee57eb6',
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              userId: '',
              params: {},
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.appcues.com/v1/accounts/86086/users/sampleId/activity',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '59f2911c-f050-497d-9f80-e1696a3c56aa',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                campaign: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/rudder-sdk-js/tests/html/script-test.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost:4321/rudder-sdk-js/tests/html/script-test.html',
                },
                screen: {
                  density: 2,
                },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              event: 'eventWithProperties',
              integrations: {
                All: true,
              },
              messageId: '4b99c45d-8591-473c-b79d-abd466f6f4d5',
              originalTimestamp: '2021-01-04T08:33:07.006Z',
              properties: {
                category: 'blah',
              },
              receivedAt: '2021-01-04T14:03:07.026+05:30',
              request_ip: '[::1]',
              rudderId: '9b6b8204-292c-493b-9c08-2c3ec0ade688',
              sentAt: '2021-01-04T08:33:07.006Z',
              timestamp: '2021-01-04T14:03:07.026+05:30',
              type: 'track',
              userId: 'sampleId',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      name: 'eventWithProperties',
                      timestamp: 1609749187,
                      attributes: {
                        category: 'blah',
                      },
                    },
                  ],
                  request_id: '4b99c45d-8591-473c-b79d-abd466f6f4d5',
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              userId: '',
              params: {},
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.appcues.com/v1/accounts/86086/users/sampleId/activity',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'a4a6304a-df41-4ca9-b2b7-4b0009dfddaa',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                campaign: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/rudder-sdk-js/tests/html/script-test.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost:4321/rudder-sdk-js/tests/html/script-test.html',
                },
                screen: {
                  density: 2,
                },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '75a9e08b-955a-4dc7-8a39-3f6fba9d7497',
              originalTimestamp: '2021-01-04T08:43:05.783Z',
              properties: {
                path: '/rudder-sdk-js/tests/html/script-test.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost:4321/rudder-sdk-js/tests/html/script-test.html',
              },
              receivedAt: '2021-01-04T14:13:05.800+05:30',
              request_ip: '[::1]',
              rudderId: '2d03081c-8053-4cce-9abf-bb024f747900',
              sentAt: '2021-01-04T08:43:05.783Z',
              timestamp: '2021-01-04T14:13:05.799+05:30',
              type: 'page',
              userId: 'sampleId',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      name: 'Visited a Page',
                      context: {
                        url: 'http://localhost:4321/rudder-sdk-js/tests/html/script-test.html',
                      },
                      timestamp: 1609749785,
                      attributes: {
                        url: 'http://localhost:4321/rudder-sdk-js/tests/html/script-test.html',
                        path: '/rudder-sdk-js/tests/html/script-test.html',
                        _identity: {
                          userId: 'sampleId',
                        },
                      },
                    },
                  ],
                  request_id: '75a9e08b-955a-4dc7-8a39-3f6fba9d7497',
                  profile_update: {
                    _appcuesId: '86086',
                    _updatedAt: '2021-01-04T14:13:05.799+05:30',
                    _userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                    _currentPageUrl:
                      'http://localhost:4321/rudder-sdk-js/tests/html/script-test.html',
                    _lastBrowserLanguage: 'en-GB',
                    userId: 'sampleId',
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              userId: '',
              params: {},
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.appcues.com/v1/accounts/86086/users/sampleId/activity',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'a4a6304a-df41-4ca9-b2b7-4b0009dfddaa',
              category: 'page category',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                campaign: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/testing',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://pagecall.com/testing',
                },
                screen: {
                  density: 2,
                },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '397fdf96-daee-46c8-ac38-5d717cd8cabd',
              name: 'page name',
              originalTimestamp: '2021-01-04T08:43:05.784Z',
              properties: {
                category: 'page category',
                name: 'page name',
                path: '/testing',
                referrer: '',
                search: '',
                title: '',
                url: 'https://pagecall.com/testing',
              },
              receivedAt: '2021-01-04T14:13:05.801+05:30',
              request_ip: '[::1]',
              rudderId: '2d03081c-8053-4cce-9abf-bb024f747900',
              sentAt: '2021-01-04T08:43:05.784Z',
              timestamp: '2021-01-04T14:13:05.801+05:30',
              type: 'page',
              userId: 'sampleId',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      name: 'Visited a Page',
                      context: {
                        url: 'https://pagecall.com/testing',
                      },
                      timestamp: 1609749785,
                      attributes: {
                        url: 'https://pagecall.com/testing',
                        name: 'page name',
                        path: '/testing',
                        category: 'page category',
                        _identity: {
                          userId: 'sampleId',
                        },
                      },
                    },
                  ],
                  request_id: '397fdf96-daee-46c8-ac38-5d717cd8cabd',
                  profile_update: {
                    _appcuesId: '86086',
                    _updatedAt: '2021-01-04T14:13:05.801+05:30',
                    _userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                    _currentPageUrl: 'https://pagecall.com/testing',
                    _lastBrowserLanguage: 'en-GB',
                    userId: 'sampleId',
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              userId: '',
              params: {},
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.appcues.com/v1/accounts/86086/users/sampleId/activity',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'a4a6304a-df41-4ca9-b2b7-4b0009dfddaa',
              category: 'page category',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                campaign: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/testing',
                  referrer: '',
                  search: '',
                },
                screen: {
                  density: 2,
                },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '397fdf96-daee-46c8-ac38-5d717cd8cabd',
              name: 'page name',
              originalTimestamp: '2021-01-04T08:43:05.784Z',
              properties: {
                category: 'page category',
                name: 'page name',
                path: '/testing',
                referrer: '',
                search: '',
                title: 'properties title',
                url: 'https://pagecall.com/properties_url',
              },
              receivedAt: '2021-01-04T14:13:05.801+05:30',
              request_ip: '[::1]',
              rudderId: '2d03081c-8053-4cce-9abf-bb024f747900',
              sentAt: '2021-01-04T08:43:05.784Z',
              timestamp: '2021-01-04T14:13:05.801+05:30',
              type: 'page',
              userId: 'sampleId',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
              userId: '',
              method: 'POST',
              endpoint: 'https://api.appcues.com/v1/accounts/86086/users/sampleId/activity',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  request_id: '397fdf96-daee-46c8-ac38-5d717cd8cabd',
                  profile_update: {
                    userId: 'sampleId',
                    _lastBrowserLanguage: 'en-GB',
                    _updatedAt: '2021-01-04T14:13:05.801+05:30',
                    _userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                    _currentPageTitle: 'properties title',
                    _currentPageUrl: 'https://pagecall.com/properties_url',
                    _appcuesId: '86086',
                  },
                  events: [
                    {
                      timestamp: 1609749785,
                      attributes: {
                        category: 'page category',
                        name: 'page name',
                        path: '/testing',
                        title: 'properties title',
                        url: 'https://pagecall.com/properties_url',
                        _identity: {
                          userId: 'sampleId',
                        },
                      },
                      name: 'Visited a Page',
                      context: {
                        url: 'https://pagecall.com/properties_url',
                      },
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'a4a6304a-df41-4ca9-b2b7-4b0009dfddaa',
              category: 'page category',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                campaign: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/testing',
                  referrer: '',
                  search: '',
                  title: 'context title',
                  url: 'https://pagecall.com/context_url',
                },
                screen: {
                  density: 2,
                },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '397fdf96-daee-46c8-ac38-5d717cd8cabd',
              name: 'page name',
              originalTimestamp: '2021-01-04T08:43:05.784Z',
              properties: {
                category: 'page category',
                name: 'page name',
                path: '/testing',
                referrer: '',
                search: '',
              },
              receivedAt: '2021-01-04T14:13:05.801+05:30',
              request_ip: '[::1]',
              rudderId: '2d03081c-8053-4cce-9abf-bb024f747900',
              sentAt: '2021-01-04T08:43:05.784Z',
              timestamp: '2021-01-04T14:13:05.801+05:30',
              type: 'page',
              userId: 'sampleId',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
              userId: '',
              endpoint: 'https://api.appcues.com/v1/accounts/86086/users/sampleId/activity',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  request_id: '397fdf96-daee-46c8-ac38-5d717cd8cabd',
                  profile_update: {
                    userId: 'sampleId',
                    _lastBrowserLanguage: 'en-GB',
                    _updatedAt: '2021-01-04T14:13:05.801+05:30',
                    _userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                    _currentPageTitle: 'context title',
                    _currentPageUrl: 'https://pagecall.com/context_url',
                    _appcuesId: '86086',
                  },
                  events: [
                    {
                      timestamp: 1609749785,
                      attributes: {
                        category: 'page category',
                        name: 'page name',
                        path: '/testing',
                        _identity: {
                          userId: 'sampleId',
                        },
                      },
                      name: 'Visited a Page',
                      context: {
                        url: 'https://pagecall.com/context_url',
                      },
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5094f5704b9cf2b3',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'AppcuesIntegration',
                  namespace: 'com.Appcues',
                  version: '1.0',
                },
                device: {
                  id: '5094f5704b9cf2b3',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5094f5704b9cf2b3',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'MainActivity',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                name: 'MainActivity',
                automatic: true,
              },
              originalTimestamp: '2020-03-12T09:05:03.421Z',
              type: 'screen',
              userId: 'sampleId',
              sentAt: '2020-03-12T09:05:13.042Z',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
              userId: '',
              endpoint: 'https://api.appcues.com/v1/accounts/86086/users/sampleId/activity',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  request_id: 'id1',
                  events: [
                    {
                      name: 'Viewed a Screen',
                      timestamp: 1584003903,
                      attributes: {
                        name: 'MainActivity',
                        automatic: true,
                      },
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5094f5704b9cf2b3',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'AppcuesIntegration',
                  namespace: 'com.Appcues',
                  version: '1.0',
                },
                device: {
                  id: '5094f5704b9cf2b3',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5094f5704b9cf2b3',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'MainActivity',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                name: 'MainActivity',
                automatic: true,
              },
              originalTimestamp: '2020-03-12T09:05:03.421Z',
              type: 'screen',
              sentAt: '2020-03-12T09:05:13.042Z',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
            error: "User id is absent. Aborting event as userId is mandatory for Appcues",
            statTags: {
              destType: 'APPCUES',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
			statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5094f5704b9cf2b3',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'AppcuesIntegration',
                  namespace: 'com.Appcues',
                  version: '1.0',
                },
                device: {
                  id: '5094f5704b9cf2b3',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5094f5704b9cf2b3',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'MainActivity',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                name: 'MainActivity',
                automatic: true,
              },
              originalTimestamp: '2020-03-12T09:05:03.421Z',
              type: '',
              userId: 'sampleId',
              sentAt: '2020-03-12T09:05:13.042Z',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
			error: 'Message Type is not present. Aborting message.',
            statTags: {
              destType: 'APPCUES',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
			statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'appcues',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/html/sajal.html',
                  referrer: '',
                  search:
                    '?utm_source=google&utm_medium=medium&utm_term=keyword&utm_content=some%20content&utm_campaign=some%20campaign&utm_test=other%20value',
                  title: '',
                  url: 'http://localhost:9116/html/sajal.html?utm_source=google&utm_medium=medium&utm_term=keyword&utm_content=some%20content&utm_campaign=some%20campaign&utm_test=other%20value',
                },
              },
              type: 'group',
              messageId: 'e5034df0-a404-47b4-a463-76df99934fea',
              originalTimestamp: '2020-10-20T07:54:58.983Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'sampleusrRudder3',
              integrations: {
                All: true,
              },
              groupId: 'Sample_groupId23',
              traits: {
                KEY_3: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                KEY_2: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                name_trait: 'Company',
                value_trait: 'Comapny-ABC',
              },
              sentAt: '2020-10-20T07:54:58.983Z',
            },
            destination: {
              Config: {
                accountId: '86086',
                useNativeSDK: false,
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
			error: 'Message type is not supported',
            statTags: {
              destType: 'APPCUES',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
			statusCode: 400,
          },
        ],
      },
    },
  },
];
