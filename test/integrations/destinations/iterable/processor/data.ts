export const data = [
  {
    name: 'iterable',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'page',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              _metadata: {
                nodeVersion: '10.22.0',
              },
              messageId:
                'node-6f62b91e789a636929ca38aed01c5f6e-103c720d-81bd-4742-98d6-d45a65aed23e',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            destination: {
              Config: {
                apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                mapToSingleEvent: false,
                trackAllPages: false,
                trackCategorisedPages: true,
                trackNamedPages: false,
              },
              Enabled: true,
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
            error: 'Invalid page call',
            statTags: {
              destType: 'ITERABLE',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
    name: 'iterable',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-08-28T16:26:06.466Z',
              traits: {
                city: 'Bangalore',
                name: 'manashi',
                email: 'manashi@website.com',
                country: 'India',
              },
              context: {
                traits: {
                  city: 'Bangalore',
                  name: 'manashi',
                  email: 'manashi@website.com',
                  country: 'India',
                  preferUserId: false,
                },
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              _metadata: {
                nodeVersion: '10.22.0',
              },
              messageId:
                'node-cc3ef811f686139ee527b806ee0129ef-163a3a88-266f-447e-8cce-34a8f42f8dcd',
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.462Z',
            },
            destination: {
              Config: {
                preferUserId: false,
                apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
                  email: 'manashi@website.com',
                  userId: 'abcdeeeeeeeexxxx102',
                  dataFields: {
                    city: 'Bangalore',
                    name: 'manashi',
                    email: 'manashi@website.com',
                    country: 'India',
                  },
                  preferUserId: false,
                  mergeNestedObjects: true,
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                api_key: '62d12498c37c4fd8a1a546c2d35c2f60',
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.iterable.com/api/users/update',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Email Opened',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              _metadata: {
                nodeVersion: '10.22.0',
              },
              messageId:
                'node-570110489d3e99b234b18af9a9eca9d4-6009779e-82d7-469d-aaeb-5ccf162b0453',
              properties: {
                subject: 'resume validate',
                sendtime: '2020-01-01',
                sendlocation: 'akashdeep@gmail.com',
              },
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            destination: {
              Config: {
                apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
                  userId: 'abcdeeeeeeeexxxx102',
                  createdAt: 1598631966468,
                  eventName: 'Email Opened',
                  dataFields: {
                    subject: 'resume validate',
                    sendtime: '2020-01-01',
                    sendlocation: 'akashdeep@gmail.com',
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                api_key: '62d12498c37c4fd8a1a546c2d35c2f60',
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.iterable.com/api/events/track',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'Test 3',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: false,
                trackCategorisedPages: true,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'sayan@gmail.com',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                  },
                  userId: '12345',
                  eventName: 'ApplicationLoaded page',
                  createdAt: 1571051718299,
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
    name: 'iterable',
    description: 'Test 4',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
                campaignId: '123456',
                templateId: '1213458',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: true,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'sayan@gmail.com',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                    campaignId: '123456',
                    templateId: '1213458',
                  },
                  userId: '12345',
                  eventName: 'Loaded a Page',
                  createdAt: 1571051718299,
                  campaignId: 123456,
                  templateId: 1213458,
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
    name: 'iterable',
    description: 'Test 5',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                name: 'test-name',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: false,
                trackCategorisedPages: false,
                trackNamedPages: true,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'sayan@gmail.com',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    name: 'test-name',
                  },
                  userId: '12345',
                  eventName: 'ApplicationLoaded page',
                  createdAt: 1571051718299,
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
    name: 'iterable',
    description: 'Test 6',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'sayan@gmail.com',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  },
                  userId: '12345',
                  eventName: 'ApplicationLoaded page',
                  createdAt: 1571051718299,
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
    name: 'iterable',
    description: 'Test 7',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              type: 'screen',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: false,
                trackCategorisedPages: true,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'sayan@gmail.com',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                  },
                  userId: '12345',
                  eventName: 'ApplicationLoaded screen',
                  createdAt: 1571051718299,
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
    name: 'iterable',
    description: 'Test 8',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              type: 'screen',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
                campaignId: '123456',
                templateId: '1213458',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: true,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'sayan@gmail.com',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                    campaignId: '123456',
                    templateId: '1213458',
                  },
                  userId: '12345',
                  eventName: 'Loaded a Screen',
                  createdAt: 1571051718299,
                  campaignId: 123456,
                  templateId: 1213458,
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
    name: 'iterable',
    description: 'Test 9',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              type: 'screen',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                name: 'test-name',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: false,
                trackCategorisedPages: false,
                trackNamedPages: true,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'sayan@gmail.com',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    name: 'test-name',
                  },
                  userId: '12345',
                  eventName: 'ApplicationLoaded screen',
                  createdAt: 1571051718299,
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
    name: 'iterable',
    description: 'Test 10',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              type: 'screen',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'sayan@gmail.com',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  },
                  userId: '12345',
                  eventName: 'ApplicationLoaded screen',
                  createdAt: 1571051718299,
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
    name: 'iterable',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'ruchira@rudderlabs.com',
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
                  id: '72e528f869711c3d',
                  manufacturer: 'Google',
                  model: 'sdk_gphone_x86',
                  name: 'generic_x86_arm',
                  token: 'some_device_token',
                  type: 'android',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'group',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
            error: 'Message type group not supported',
            statTags: {
              destType: 'ITERABLE',
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
    name: 'iterable',
    description: 'Test 12',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'ruchira@rudderlabs.com',
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
                  id: '72e528f869711c3d',
                  manufacturer: 'Google',
                  model: 'sdk_gphone_x86',
                  name: 'generic_x86_arm',
                  token: 'some_device_token',
                  type: 'android',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                mergeNestedObjects: false,
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'ruchira@rudderlabs.com',
                  dataFields: {
                    email: 'ruchira@rudderlabs.com',
                  },
                  userId: '123456',
                  preferUserId: true,
                  mergeNestedObjects: false,
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
    name: 'iterable',
    description: 'Test 13',
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
                  version: '1.0.0',
                },
                device: {
                  token: 'sample_push_token',
                  name: 'sample_device_name',
                  model: 'sample_device_model',
                  manufacturer: 'sample_device_manufacturer',
                  type: 'ios',
                },
                traits: {
                  email: 'ruchira@rudderlabs.com',
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
                  id: '72e528f869711c3d',
                  manufacturer: 'Google',
                  model: 'sdk_gphone_x86',
                  name: 'generic_x86_arm',
                  token: 'some_device_token',
                  type: 'android',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'ruchira@rudderlabs.com',
                  dataFields: {
                    email: 'ruchira@rudderlabs.com',
                  },
                  userId: '123456',
                  preferUserId: true,
                  mergeNestedObjects: true,
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
    name: 'iterable',
    description: 'Test 14',
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
                  version: '1.0.0',
                },
                device: {
                  token: 'sample_push_token',
                  name: 'sample_device_name',
                  model: 'sample_device_model',
                  manufacturer: 'sample_device_manufacturer',
                  type: 'android',
                },
                traits: {
                  email: 'ruchira@rudderlabs.com',
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
                  id: '72e528f869711c3d',
                  manufacturer: 'Google',
                  model: 'sdk_gphone_x86',
                  name: 'generic_x86_arm',
                  token: 'some_device_token',
                  type: 'android',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'ruchira@rudderlabs.com',
                  dataFields: {
                    email: 'ruchira@rudderlabs.com',
                  },
                  userId: '123456',
                  preferUserId: true,
                  mergeNestedObjects: true,
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
    name: 'iterable',
    description: 'Test 15',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              event: 'product added',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                campaignId: '1',
                templateId: '0',
                orderId: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/commerce/updateCart',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  user: {
                    email: 'sayan@gmail.com',
                    dataFields: {
                      email: 'sayan@gmail.com',
                    },
                    userId: '12345',
                    preferUserId: true,
                    mergeNestedObjects: true,
                  },
                  items: [
                    {
                      id: '507f1f77bcf86cd799439011',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      categories: ['cars'],
                      price: 19,
                      quantity: 2,
                      imageUrl: 'https://www.example.com/product/path.jpg',
                      url: 'https://www.example.com/product/path',
                    },
                    {
                      id: '507f1f77bcf86cd7994390112',
                      sku: '45790-322',
                      name: 'Monopoly: 3rd Edition2',
                      categories: ['Cars2'],
                      price: 192,
                      quantity: 22,
                      imageUrl: 'https://www.example.com/product/path.jpg2',
                      url: 'https://www.example.com/product/path2',
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
    name: 'iterable',
    description: 'Test 16',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              event: 'order completed',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                orderId: 10000,
                total: '1000',
                campaignId: '123456',
                templateId: '1213458',
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'Cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: 2,
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: '22',
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/commerce/trackPurchase',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  dataFields: {
                    orderId: 10000,
                    total: '1000',
                    campaignId: '123456',
                    templateId: '1213458',
                    products: [
                      {
                        product_id: '507f1f77bcf86cd799439011',
                        sku: '45790-32',
                        name: 'Monopoly: 3rd Edition',
                        price: '19',
                        position: '1',
                        category: 'Cars',
                        url: 'https://www.example.com/product/path',
                        image_url: 'https://www.example.com/product/path.jpg',
                        quantity: 2,
                      },
                      {
                        product_id: '507f1f77bcf86cd7994390112',
                        sku: '45790-322',
                        name: 'Monopoly: 3rd Edition2',
                        price: '192',
                        quantity: '22',
                        position: '12',
                        category: 'Cars2',
                        url: 'https://www.example.com/product/path2',
                        image_url: 'https://www.example.com/product/path.jpg2',
                      },
                    ],
                  },
                  id: '10000',
                  createdAt: 1571051718299,
                  campaignId: 123456,
                  templateId: 1213458,
                  total: 1000,
                  user: {
                    email: 'sayan@gmail.com',
                    dataFields: {
                      email: 'sayan@gmail.com',
                    },
                    userId: '12345',
                    preferUserId: true,
                    mergeNestedObjects: true,
                  },
                  items: [
                    {
                      id: '507f1f77bcf86cd799439011',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      categories: ['Cars'],
                      price: 19,
                      quantity: 2,
                      imageUrl: 'https://www.example.com/product/path.jpg',
                      url: 'https://www.example.com/product/path',
                    },
                    {
                      id: '507f1f77bcf86cd7994390112',
                      sku: '45790-322',
                      name: 'Monopoly: 3rd Edition2',
                      categories: ['Cars2'],
                      price: 192,
                      quantity: 22,
                      imageUrl: 'https://www.example.com/product/path.jpg2',
                      url: 'https://www.example.com/product/path2',
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
    name: 'iterable',
    description: 'Test 17',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event GA3',
              properties: {
                email: 'ruchira@rudderlabs.com',
                campaignId: '1',
                templateId: '0',
                category: 'test-category',
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'ruchira@rudderlabs.com',
                  dataFields: {
                    campaignId: '1',
                    templateId: '0',
                    category: 'test-category',
                    user_actual_role: 'system_admin, system_user',
                    user_actual_id: 12345,
                    email: 'ruchira@rudderlabs.com',
                  },
                  userId: '12345',
                  eventName: 'test track event GA3',
                  createdAt: 1571051718300,
                  campaignId: 1,
                  templateId: 0,
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
    name: 'iterable',
    description: 'Test 18',
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
                  version: '1.0.0',
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
                  id: '72e528f869711c3d',
                  manufacturer: 'Google',
                  model: 'sdk_gphone_x86',
                  name: 'generic_x86_arm',
                  token: 'some_device_token',
                  type: 'android',
                },
                screen: {
                  density: 2,
                },
              },
              traits: {
                email: 'ruchira@rudderlabs.com',
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'ruchira@rudderlabs.com',
                  dataFields: {
                    email: 'ruchira@rudderlabs.com',
                  },
                  userId: '123456',
                  preferUserId: true,
                  mergeNestedObjects: true,
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
    name: 'iterable',
    description: 'Test 19',
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
                  version: '1.0.0',
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
                  id: '72e528f869711c3d',
                  manufacturer: 'Google',
                  model: 'sdk_gphone_x86',
                  name: 'generic_x86_arm',
                  token: 'some_device_token',
                  type: 'android',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
            error: 'userId or email is mandatory for this request',
            statTags: {
              destType: 'ITERABLE',
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
    name: 'iterable',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'page',
              sentAt: '2020-08-28T16:26:16.473Z',
              _metadata: {
                nodeVersion: '10.22.0',
              },
              messageId:
                'node-6f62b91e789a636929ca38aed01c5f6e-103c720d-81bd-4742-98d6-d45a65aed23e',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            destination: {
              Config: {
                apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                mapToSingleEvent: false,
                trackAllPages: false,
                trackCategorisedPages: true,
                trackNamedPages: false,
              },
              Enabled: true,
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
            error: 'Invalid page call',
            statTags: {
              destType: 'ITERABLE',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
    name: 'iterable',
    description: 'Test 21',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Product Added',
              sentAt: '2021-07-09T05:27:17.908Z',
              userId: '8751',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.0.16',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'https://joybird.com/cabinets/vira-console-cabinet/',
                  path: '/cabinets/vira-console-cabinet/',
                  title: 'Vira Console Cabinet | Joybird',
                  search: '',
                  referrer: '$direct',
                  referring_domain: '',
                },
                locale: 'en-us',
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'jessica@jlpdesign.net',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.16',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
              },
              rudderId: '1c42e104-97ec-4f54-a328-2379623583fe',
              messageId: 'e58f6624-a1c3-48f4-a6af-610389602304',
              timestamp: '2021-07-09T05:27:18.131Z',
              properties: {
                sku: 'JB24691400-W05',
                name: 'Vira Console Cabinet',
                price: 797,
                cart_id: 'bd9b8dbf4ef8ee01d4206b04fe2ee6ae',
                variant: 'Oak',
                quantity: 1,
                quickship: true,
                full_price: 1328,
                product_id: 10606,
                non_interaction: 1,
              },
              receivedAt: '2021-07-09T05:27:18.131Z',
              request_ip: '162.224.233.114',
              anonymousId: '8a7ff986-62d8-45ca-9a16-8895b3f9d341',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-07-09T05:27:17.908Z',
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: 'projects/big-query-integration-poc/topics/test',
                  },
                ],
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
              endpoint: 'https://api.iterable.com/api/commerce/updateCart',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user: {
                    email: 'jessica@jlpdesign.net',
                    dataFields: {
                      email: 'jessica@jlpdesign.net',
                    },
                    userId: '8751',
                    preferUserId: true,
                    mergeNestedObjects: true,
                  },
                  items: [
                    {
                      id: 10606,
                      sku: 'JB24691400-W05',
                      name: 'Vira Console Cabinet',
                      price: 797,
                      quantity: 1,
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
    name: 'iterable',
    description: 'Test 22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              context: {
                externalId: [
                  {
                    id: 'lynnanderson@smith.net',
                    identifierType: 'email',
                    type: 'ITERABLE-users',
                  },
                ],
                mappedToDestination: 'true',
                sources: {
                  batch_id: 'f5f240d0-0acb-46e0-b043-57fb0aabbadd',
                  job_id: '1zAj94bEy8komdqnYtSoDp0VmGs/Syncher',
                  job_run_id: 'c5tar6cqgmgmcjvupdhg',
                  task_id: 'tt_10_rows_check',
                  task_run_id: 'c5tar6cqgmgmcjvupdi0',
                  version: 'release.v1.6.8',
                },
              },
              messageId: '2f052f7c-f694-4849-a7ed-a432f7ffa0a4',
              originalTimestamp: '2021-10-28T14:03:50.503Z',
              receivedAt: '2021-10-28T14:03:46.567Z',
              recordId: '8',
              request_ip: '10.1.94.92',
              rudderId: 'c0f6843e-e3d6-4946-9752-fa339fbadef2',
              sentAt: '2021-10-28T14:03:50.503Z',
              timestamp: '2021-10-28T14:03:46.566Z',
              traits: {
                administrative_unit: 'Minnesota',
                am_pm: 'AM',
                boolean: true,
                firstname: 'Jacqueline',
                pPower: 'AM',
                userId: 'Jacqueline',
              },
              type: 'identify',
              userId: 'lynnanderson@smith.net',
            },
            destination: {
              ID: '1zia9wKshXt80YksLmUdJnr7IHI',
              Name: 'test_iterable',
              DestinationDefinition: {
                ID: '1iVQvTRMsPPyJzwol0ifH93QTQ6',
                Name: 'ITERABLE',
                DisplayName: 'Iterable',
                Config: {
                  destConfig: {
                    defaultConfig: [
                      'apiKey',
                      'mapToSingleEvent',
                      'trackAllPages',
                      'trackCategorisedPages',
                      'trackNamedPages',
                    ],
                  },
                  excludeKeys: [],
                  includeKeys: [],
                  saveDestinationResponse: true,
                  secretKeys: [],
                  supportedMessageTypes: ['identify', 'page', 'screen', 'track'],
                  supportedSourceTypes: [
                    'android',
                    'ios',
                    'web',
                    'unity',
                    'amp',
                    'cloud',
                    'warehouse',
                    'reactnative',
                    'flutter',
                    'cordova',
                  ],
                  supportsVisualMapper: true,
                  transformAt: 'processor',
                  transformAtV1: 'processor',
                },
                ResponseRules: null,
              },
              Config: {
                apiKey: '12345',
                mapToSingleEvent: true,
                trackAllPages: false,
                trackCategorisedPages: true,
                trackNamedPages: true,
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            libraries: [],
            request: {
              query: {},
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
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'lynnanderson@smith.net',
                  dataFields: {
                    administrative_unit: 'Minnesota',
                    am_pm: 'AM',
                    boolean: true,
                    firstname: 'Jacqueline',
                    pPower: 'AM',
                    userId: 'Jacqueline',
                    email: 'lynnanderson@smith.net',
                  },
                  userId: 'lynnanderson@smith.net',
                  preferUserId: true,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
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
    name: 'iterable',
    description: 'Test 23',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              context: {
                externalId: [
                  {
                    id: 'Matthew',
                    identifierType: 'userId',
                    type: 'ITERABLE-users',
                  },
                ],
                mappedToDestination: 'true',
                sources: {
                  batch_id: '230d7c79-a2c2-4b2a-90bb-06ba988d3bb4',
                  job_id: '1zjj9aF5UkmavBi4HtM3kWOGvy0/Syncher',
                  job_run_id: 'c5tb4gsqgmgmcjvuplhg',
                  task_id: 'tt_10_rows',
                  task_run_id: 'c5tb4gsqgmgmcjvupli0',
                  version: 'release.v1.6.8',
                },
              },
              messageId: 'c4c97310-463b-4300-9215-5cfddcb2a769',
              originalTimestamp: '2021-10-28T14:23:43.254Z',
              receivedAt: '2021-10-28T14:23:38.300Z',
              recordId: '3',
              request_ip: '10.1.94.92',
              rudderId: '7300f5e3-bdb5-489e-ac7e-47876e487de9',
              sentAt: '2021-10-28T14:23:43.254Z',
              timestamp: '2021-10-28T14:23:38.299Z',
              traits: {
                price: 'GB',
              },
              type: 'identify',
              userId: 'Matthew',
            },
            destination: {
              ID: '1zjjHN4RQ6t4DPj3HVpp0b6XW4A',
              Name: 'test_userId_uniq',
              DestinationDefinition: {
                ID: '1iVQvTRMsPPyJzwol0ifH93QTQ6',
                Name: 'ITERABLE',
                DisplayName: 'Iterable',
                Config: {
                  destConfig: {
                    defaultConfig: [
                      'apiKey',
                      'mapToSingleEvent',
                      'trackAllPages',
                      'trackCategorisedPages',
                      'trackNamedPages',
                    ],
                  },
                  excludeKeys: [],
                  includeKeys: [],
                  saveDestinationResponse: true,
                  secretKeys: [],
                  supportedMessageTypes: ['identify', 'page', 'screen', 'track'],
                  supportedSourceTypes: [
                    'android',
                    'ios',
                    'web',
                    'unity',
                    'amp',
                    'cloud',
                    'warehouse',
                    'reactnative',
                    'flutter',
                    'cordova',
                  ],
                  supportsVisualMapper: true,
                  transformAt: 'processor',
                  transformAtV1: 'processor',
                },
                ResponseRules: null,
              },
              Config: {
                apiKey: '12345',
                mapToSingleEvent: true,
                trackAllPages: false,
                trackCategorisedPages: true,
                trackNamedPages: true,
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            libraries: [],
            request: {
              query: {},
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
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  dataFields: {
                    price: 'GB',
                    userId: 'Matthew',
                  },
                  userId: 'Matthew',
                  preferUserId: true,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
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
    name: 'iterable',
    description: 'Test 24',
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
                  version: '1.0.0',
                },
                device: {
                  token: 'sample_push_token',
                  name: 'sample_device_name',
                  model: 'sample_device_model',
                  manufacturer: 'sample_device_manufacturer',
                  type: 'watchos',
                },
                traits: {
                  email: 'ruchira@rudderlabs.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                screen: {
                  density: 2,
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/users/update',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  email: 'ruchira@rudderlabs.com',
                  dataFields: {
                    email: 'ruchira@rudderlabs.com',
                  },
                  userId: '123456',
                  preferUserId: true,
                  mergeNestedObjects: true,
                },
                JSON_ARRAY: {},
                XML: {},
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
    name: 'iterable',
    description: 'Test 25',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'alias',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              _metadata: {
                nodeVersion: '10.22.0',
              },
              messageId:
                'node-6f62b91e789a636929ca38aed01c5f6e-103c720d-81bd-4742-98d6-d45a65aed23e',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              userId: 'new@email.com',
              previousId: 'old@email.com',
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            destination: {
              Config: {
                apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                mapToSingleEvent: false,
                trackAllPages: false,
                trackCategorisedPages: true,
                trackNamedPages: false,
              },
              Enabled: true,
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
                  currentEmail: 'old@email.com',
                  newEmail: 'new@email.com',
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                api_key: '62d12498c37c4fd8a1a546c2d35c2f60',
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.iterable.com/api/users/updateEmail',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'Test 26',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'alias',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              _metadata: {
                nodeVersion: '10.22.0',
              },
              messageId:
                'node-6f62b91e789a636929ca38aed01c5f6e-103c720d-81bd-4742-98d6-d45a65aed23e',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              userId: 'new@email.com',
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            destination: {
              Config: {
                apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                mapToSingleEvent: false,
                trackAllPages: false,
                trackCategorisedPages: true,
                trackNamedPages: false,
              },
              Enabled: true,
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
            error: 'Missing required value from "previousId"',
            statTags: {
              destType: 'ITERABLE',
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
    name: 'iterable',
    description: 'Test 27',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'alias',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              _metadata: {
                nodeVersion: '10.22.0',
              },
              messageId:
                'node-6f62b91e789a636929ca38aed01c5f6e-103c720d-81bd-4742-98d6-d45a65aed23e',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              previousId: 'old@email.com',
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            destination: {
              Config: {
                apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                mapToSingleEvent: false,
                trackAllPages: false,
                trackCategorisedPages: true,
                trackNamedPages: false,
              },
              Enabled: true,
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
            error: 'Missing required value from "userId"',
            statTags: {
              destType: 'ITERABLE',
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
    name: 'iterable',
    description: 'Test 28',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'john@gmail.com',
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
              event: 'product added',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                campaignId: '1',
                templateId: '0',
                orderId: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: ['bikes', 'cars', 'motors'],
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: ['Bikes2', 'cars2', 'motors2'],
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/commerce/updateCart',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  user: {
                    email: 'john@gmail.com',
                    dataFields: {
                      email: 'john@gmail.com',
                    },
                    userId: '12345',
                    preferUserId: true,
                    mergeNestedObjects: true,
                  },
                  items: [
                    {
                      id: '507f1f77bcf86cd799439011',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      categories: ['bikes', 'cars', 'motors'],
                      price: 19,
                      quantity: 2,
                      imageUrl: 'https://www.example.com/product/path.jpg',
                      url: 'https://www.example.com/product/path',
                    },
                    {
                      id: '507f1f77bcf86cd7994390112',
                      sku: '45790-322',
                      name: 'Monopoly: 3rd Edition2',
                      categories: ['Bikes2', 'cars2', 'motors2'],
                      price: 192,
                      quantity: 22,
                      imageUrl: 'https://www.example.com/product/path.jpg2',
                      url: 'https://www.example.com/product/path2',
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
    name: 'iterable',
    description: 'Test 29',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              event: 'product added',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                campaignId: '1',
                templateId: '0',
                orderId: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'shirts,pants,trousers',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/commerce/updateCart',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  user: {
                    email: 'sayan@gmail.com',
                    dataFields: {
                      email: 'sayan@gmail.com',
                    },
                    userId: '12345',
                    preferUserId: true,
                    mergeNestedObjects: true,
                  },
                  items: [
                    {
                      id: '507f1f77bcf86cd799439011',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      categories: ['shirts', 'pants', 'trousers'],
                      price: 19,
                      quantity: 2,
                      imageUrl: 'https://www.example.com/product/path.jpg',
                      url: 'https://www.example.com/product/path',
                    },
                    {
                      id: '507f1f77bcf86cd7994390112',
                      sku: '45790-322',
                      name: 'Monopoly: 3rd Edition2',
                      categories: ['Cars2'],
                      price: 192,
                      quantity: 22,
                      imageUrl: 'https://www.example.com/product/path.jpg2',
                      url: 'https://www.example.com/product/path2',
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
    name: 'iterable',
    description: 'Test 30',
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
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              event: 'product added',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                campaignId: '1',
                templateId: '0',
                orderId: 10000,
                total: 1000,
                product_id: '507f1f77bcf86cd7994390112',
                sku: '45790-322',
                name: 'Monopoly: 3rd Edition2',
                price: '192',
                quantity: 22,
                position: '12',
                category: 'Cars2',
                url: 'https://www.example.com/product/path2',
                image_url: 'https://www.example.com/product/path.jpg2',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: '12345',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
              endpoint: 'https://api.iterable.com/api/commerce/updateCart',
              headers: {
                'Content-Type': 'application/json',
                api_key: '12345',
              },
              params: {},
              body: {
                JSON: {
                  user: {
                    email: 'sayan@gmail.com',
                    dataFields: {
                      email: 'sayan@gmail.com',
                    },
                    userId: '12345',
                    preferUserId: true,
                    mergeNestedObjects: true,
                  },
                  items: [
                    {
                      id: '507f1f77bcf86cd7994390112',
                      sku: '45790-322',
                      name: 'Monopoly: 3rd Edition2',
                      categories: ['Cars2'],
                      price: 192,
                      quantity: 22,
                      imageUrl: 'https://www.example.com/product/path.jpg2',
                      url: 'https://www.example.com/product/path2',
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
    name: 'iterable',
    description: 'Test 31',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode:
                  'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
              },
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
                  email: 'sayan@gmail.com',
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
              event: 'order completed',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                product_id: 1234,
                name: 'Shoes',
                price: 45,
                quantity: 1,
                orderId: 10000,
                total: '1000',
                campaignId: '123456',
                templateId: '1213458',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              endpoint: 'https://api.iterable.com/api/commerce/trackPurchase',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  dataFields: {
                    product_id: 1234,
                    name: 'Shoes',
                    price: 45,
                    quantity: 1,
                    orderId: 10000,
                    total: '1000',
                    campaignId: '123456',
                    templateId: '1213458',
                  },
                  id: '10000',
                  createdAt: 1571051718299,
                  campaignId: 123456,
                  templateId: 1213458,
                  total: 1000,
                  user: {
                    email: 'sayan@gmail.com',
                    dataFields: {
                      email: 'sayan@gmail.com',
                    },
                    userId: '12345',
                    preferUserId: true,
                    mergeNestedObjects: true,
                  },
                  items: [
                    {
                      id: 1234,
                      name: 'Shoes',
                      price: 45,
                      quantity: 1,
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'Test 32',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              _metadata: {
                nodeVersion: '10.22.0',
              },
              messageId:
                'node-570110489d3e99b234b18af9a9eca9d4-6009779e-82d7-469d-aaeb-5ccf162b0453',
              properties: {
                subject: 'resume validate',
                sendtime: '2020-01-01',
                sendlocation: 'akashdeep@gmail.com',
              },
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            destination: {
              Config: {
                apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
                  userId: 'abcdeeeeeeeexxxx102',
                  createdAt: 1598631966468,
                  dataFields: {
                    subject: 'resume validate',
                    sendtime: '2020-01-01',
                    sendlocation: 'akashdeep@gmail.com',
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                api_key: '62d12498c37c4fd8a1a546c2d35c2f60',
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.iterable.com/api/events/track',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'iterable',
    description: 'Test 33',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: '',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              _metadata: {
                nodeVersion: '10.22.0',
              },
              messageId:
                'node-570110489d3e99b234b18af9a9eca9d4-6009779e-82d7-469d-aaeb-5ccf162b0453',
              properties: {
                subject: 'resume validate',
                sendtime: '2020-01-01',
                sendlocation: 'akashdeep@gmail.com',
              },
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            destination: {
              Config: {
                apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                mapToSingleEvent: false,
                trackAllPages: true,
                trackCategorisedPages: false,
                trackNamedPages: false,
              },
              Enabled: true,
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
                  userId: 'abcdeeeeeeeexxxx102',
                  createdAt: 1598631966468,
                  dataFields: {
                    subject: 'resume validate',
                    sendtime: '2020-01-01',
                    sendlocation: 'akashdeep@gmail.com',
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                api_key: '62d12498c37c4fd8a1a546c2d35c2f60',
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.iterable.com/api/events/track',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
