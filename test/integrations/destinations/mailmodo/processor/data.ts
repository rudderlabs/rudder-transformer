export const data = [
  {
    name: 'mailmodo',
    description: 'Track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { Config: { apiKey: 'dummyApiKey' } },
            message: {
              event: 'trackevent',
              type: 'track',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: { width: 1440, height: 900, density: 2, innerWidth: 536, innerHeight: 689 },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.2.20' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: { All: true },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://api.mailmodo.com/api/v1/addEvent',
              headers: { mmApiKey: 'dummyApiKey', 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: { email: 'firstUser@testmail.com', event_name: 'trackevent' },
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
    name: 'mailmodo',
    description: 'Providing empty API Key',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { Config: { apiKey: '' } },
            message: {
              event: 'trackevent',
              type: 'track',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: { width: 1440, height: 900, density: 2, innerWidth: 536, innerHeight: 689 },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.2.20' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: { All: true },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'API Key is not present, Aborting event',
            statTags: {
              destType: 'MAILMODO',
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
    name: 'mailmodo',
    description: 'Not providing event type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { Config: { apiKey: 'ahj' } },
            message: {
              event: 'trackevent',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: { width: 1440, height: 900, density: 2, innerWidth: 536, innerHeight: 689 },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.2.20' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: { All: true },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type is required',
            statTags: {
              destType: 'MAILMODO',
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
    name: 'mailmodo',
    description: 'Page call- not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { Config: { apiKey: 'dummyApiKey', listName: 'abcdef' } },
            message: {
              type: 'page',
              event: 'Email Opened',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: { library: { name: 'analytics-node', version: '0.0.3' } },
              _metadata: { nodeVersion: '10.22.0' },
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
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type page is not supported',
            statTags: {
              destType: 'MAILMODO',
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
    name: 'mailmodo',
    description: 'Identify call- with empty listName',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { Config: { apiKey: 'dummyApiKey', listName: '' } },
            message: {
              type: 'identify',
              event: 'Email Opened',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: { library: { name: 'analytics-node', version: '0.0.3' } },
              _metadata: { nodeVersion: '10.22.0' },
              messageId:
                'node-570110489d3e99b234b18af9a9eca9d4-6009779e-82d7-469d-aaeb-5ccf162b0453',
              properties: {
                email: 'test3@abc.com',
                subject: 'resume validate',
                sendtime: '2020-01-01',
                sendlocation: 'akashdeep@gmail.com',
              },
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://api.mailmodo.com/api/v1/addToList/batch',
              headers: { mmApiKey: 'dummyApiKey', 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: { listName: 'Rudderstack', values: [{ email: 'test3@abc.com' }] },
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
    name: 'mailmodo',
    description: 'Identify call- with listName',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { Config: { apiKey: 'dummyApiKey', listName: 'abcdef' } },
            message: {
              type: 'identify',
              event: 'Email Opened',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: { library: { name: 'analytics-node', version: '0.0.3' } },
              _metadata: { nodeVersion: '10.22.0' },
              messageId:
                'node-570110489d3e99b234b18af9a9eca9d4-6009779e-82d7-469d-aaeb-5ccf162b0453',
              properties: {
                email: 'test3@abc.com',
                subject: 'resume validate',
                sendtime: '2020-01-01',
                sendlocation: 'akashdeep@gmail.com',
              },
              anonymousId: 'abcdeeeeeeeexxxx102',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://api.mailmodo.com/api/v1/addToList/batch',
              headers: { mmApiKey: 'dummyApiKey', 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: { listName: 'abcdef', values: [{ email: 'test3@abc.com' }] },
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
    name: 'mailmodo',
    description: 'Identify call- without email',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { Config: { apiKey: 'dummyApiKey', listName: 'abcdef' } },
            message: {
              type: 'identify',
              event: 'Email Opened',
              sentAt: '2020-08-28T16:26:16.473Z',
              context: { library: { name: 'analytics-node', version: '0.0.3' } },
              _metadata: { nodeVersion: '10.22.0' },
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
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Missing required value from ["traits.email","context.traits.email","properties.email"]',
            statTags: {
              destType: 'MAILMODO',
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
    name: 'mailmodo',
    description: 'Identify call- with user properties(address as an object)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { Config: { apiKey: 'dummyApiKey', listName: 'abcdef' } },
            message: {
              type: 'identify',
              userId: 'identified user id',
              anonymousId: 'anon-id-new',
              context: {
                traits: { trait1: 'new-val' },
                ip: '14.5.67.21',
                library: { name: 'http' },
              },
              traits: {
                email: 'testabc2@abcd.com',
                name: 'Rudder Test',
                firstName: 'Test',
                lastName: 'Rudderlabs',
                age: 21,
                phone: '9876543210',
                address: { street: 'A street', city: 'Vijayawada', country: 'India' },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://api.mailmodo.com/api/v1/addToList/batch',
              headers: { mmApiKey: 'dummyApiKey', 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  listName: 'abcdef',
                  values: [
                    {
                      email: 'testabc2@abcd.com',
                      data: {
                        age: 21,
                        first_name: 'Test',
                        last_name: 'Rudderlabs',
                        name: 'Rudder Test',
                        phone: '9876543210',
                        trait1: 'new-val',
                        city: 'Vijayawada',
                        country: 'India',
                        address1: 'A street Vijayawada India ',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailmodo',
    description: 'Identify call- with user properties(address as a string)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { Config: { apiKey: 'dummyApiKey', listName: 'abcdef' } },
            message: {
              type: 'identify',
              userId: 'identified user id',
              anonymousId: 'anon-id-new',
              context: {
                traits: { trait1: 'new-val' },
                ip: '14.5.67.21',
                library: { name: 'http' },
              },
              traits: {
                email: 'testabc2@abcd.com',
                name: 'Rudder Test',
                firstName: 'Test',
                lastName: 'Rudderlabs',
                age: 21,
                phone: '9876543210',
                address: 'welcome to home',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://api.mailmodo.com/api/v1/addToList/batch',
              headers: { mmApiKey: 'dummyApiKey', 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  listName: 'abcdef',
                  values: [
                    {
                      email: 'testabc2@abcd.com',
                      data: {
                        age: 21,
                        first_name: 'Test',
                        last_name: 'Rudderlabs',
                        name: 'Rudder Test',
                        phone: '9876543210',
                        trait1: 'new-val',
                        address1: 'welcome to home',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
];
