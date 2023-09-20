export const data = [
  {
    name: 'ometria',
    description: 'Test 0',
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
                  listingId: 'test1',
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
                  field1: 'val1',
                  ip: '0.0.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              integrations: { Ometria: { listingId: 'test1' } },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                allowMarketing: false,
                allowTransactional: false,
                marketingOptin: 'EXPLICITLY_OPTEDOUT',
              },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"email":"testone@gmail.com","id":"test1","customer_id":"userId1","firstname":"test","lastname":"one","@type":"contact","properties":{"field1":"val1","ip":"0.0.0.0"},"marketing_optin":"EXPLICITLY_OPTEDOUT","channels":{"sms":{"allow_marketing":false,"allow_transactional":false}}}]',
                },
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
    name: 'ometria',
    description: 'Test 1',
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
                  listingId: 'test1',
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
                  field1: 'val1',
                  ip: '0.0.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              integrations: { Ometria: { listingId: 'updatedId1', allowMarketing: true } },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                allowMarketing: false,
                allowTransactional: false,
                marketingOptin: 'EXPLICITLY_OPTEDOUT',
              },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"email":"testone@gmail.com","id":"updatedId1","customer_id":"userId1","firstname":"test","lastname":"one","@type":"contact","properties":{"field1":"val1","ip":"0.0.0.0"},"marketing_optin":"EXPLICITLY_OPTEDOUT","channels":{"sms":{"allow_marketing":true,"allow_transactional":false}}}]',
                },
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
    name: 'ometria',
    description: 'Test 2',
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
                  listingId: 'test1',
                  email: 'testone@gmail.com',
                  name: 'test one two',
                  field1: 'val1',
                  ip: '0.0.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              integrations: { Ometria: { listingId: 'test1' } },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                allowMarketing: false,
                allowTransactional: false,
                marketingOptin: 'EXPLICITLY_OPTEDOUT',
              },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"email":"testone@gmail.com","id":"test1","customer_id":"userId1","@type":"contact","properties":{"field1":"val1","ip":"0.0.0.0"},"marketing_optin":"EXPLICITLY_OPTEDOUT","channels":{"sms":{"allow_marketing":false,"allow_transactional":false}},"firstname":"test","middlename":"one","lastname":"two"}]',
                },
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
    name: 'ometria',
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
                  listingId: 'test1',
                  email: 'testone@gmail.com',
                  name: 'test one',
                  field1: 'val1',
                  marketinOptin: 'NOT_SPECIFIED',
                  phoneNumber: '+911234567890',
                  channels: { sms: {} },
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              integrations: { Ometria: { listingId: 'test1' } },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                allowMarketing: false,
                allowTransactional: false,
                marketingOptin: 'NOT_SPECIFIED',
              },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"email":"testone@gmail.com","id":"test1","phone_number":"+911234567890","customer_id":"userId1","@type":"contact","properties":{"field1":"val1"},"marketing_optin":"NOT_SPECIFIED","channels":{"sms":{"allow_marketing":false,"allow_transactional":false}},"firstname":"test","lastname":"one"}]',
                },
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
    name: 'ometria',
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
                  listingId: 'test1',
                  email: 'testone@gmail.com',
                  name: 'test one',
                  field1: 'val1',
                  marketinOptin: 'NOT_SPECIFIED',
                  phoneNumber: '+911234567890',
                  channels: { sms: {} },
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              integrations: {
                Ometria: { listingId: 'test1', allowMarketing: true, allowTransactional: true },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                allowMarketing: false,
                allowTransactional: false,
                marketingOptin: 'NOT_SPECIFIED',
              },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"email":"testone@gmail.com","id":"test1","phone_number":"+911234567890","customer_id":"userId1","@type":"contact","properties":{"field1":"val1"},"marketing_optin":"NOT_SPECIFIED","channels":{"sms":{"allow_marketing":true,"allow_transactional":true}},"firstname":"test","lastname":"one"}]',
                },
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
    name: 'ometria',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              event: 'event name',
              properties: {
                event_id: 'eventId1',
                timestamp: '2017-05-01T14:00:00Z',
                field1: 'val1',
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: { Config: { apiKey: 'dummyApiKey' } },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"id":"eventId1","timestamp":"2017-05-01T14:00:00Z","identity_email":"testone@gmail.com","identity_account_id":"userId1","@type":"custom_event","event_type":"event name","properties":{"field1":"val1"}}]',
                },
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
    name: 'ometria',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              event: 'order completed',
              properties: {
                order_id: 'orderId1',
                timestamp: '2017-05-01T14:00:00Z',
                grand_total: 1000,
                currency: 'INR',
                field1: 'val1',
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: { Config: { apiKey: 'dummyApiKey' } },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"id":"orderId1","timestamp":"2017-05-01T14:00:00Z","grand_total":1000,"currency":"INR","ip_address":"0.0.0.0","customer":{"id":"userId1","email":"testone@gmail.com","firstname":"test","lastname":"one"},"@type":"order","status":"complete","is_valid":true,"properties":{"field1":"val1"}}]',
                },
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
    name: 'ometria',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              event: 'order completed',
              properties: {
                order_id: 'orderId1',
                timestamp: '2017-05-01T14:00:00Z',
                grand_total: 1000,
                currency: 'INR',
                field1: 'val1',
                products: [{ product_id: 'prod123', quantity: 4, subtotal: 10 }],
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: { Config: { apiKey: 'dummyApiKey' } },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"id":"orderId1","timestamp":"2017-05-01T14:00:00Z","grand_total":1000,"currency":"INR","ip_address":"0.0.0.0","customer":{"id":"userId1","email":"testone@gmail.com","firstname":"test","lastname":"one"},"@type":"order","status":"complete","is_valid":true,"properties":{"field1":"val1"},"lineitems":[{"product_id":"prod123","quantity":4,"subtotal":10}]}]',
                },
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
    name: 'ometria',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              event: 'order completed',
              properties: {
                order_id: 'orderId1',
                timestamp: '2017-05-01T14:00:00Z',
                grand_total: 1000,
                currency: 'INR',
                field1: 'val1',
                products: [
                  {
                    product_id: 'prod123',
                    quantity: 4,
                    subtotal: 10,
                    variant_options: [{ type: 'size', id: 'newid', label: '5' }],
                  },
                ],
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: { Config: { apiKey: 'dummyApiKey' } },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"id":"orderId1","timestamp":"2017-05-01T14:00:00Z","grand_total":1000,"currency":"INR","ip_address":"0.0.0.0","customer":{"id":"userId1","email":"testone@gmail.com","firstname":"test","lastname":"one"},"@type":"order","status":"complete","is_valid":true,"properties":{"field1":"val1"},"lineitems":[{"product_id":"prod123","quantity":4,"subtotal":10,"variant_options":[{"id":"newid","type":"size","label":"5"}]}]}]',
                },
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
    name: 'ometria',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              event: 'order completed',
              properties: {
                order_id: 'orderId1',
                timestamp: '2017-05-01T14:00:00Z',
                grand_total: 1000,
                currency: 'INR',
                field1: 'val1',
                billing_address: 'Ba',
                shipping_address: 'Sa',
                products: [
                  {
                    product_id: 'prod123',
                    quantity: 4,
                    subtotal: 10,
                    variant_options: [{ type: 'size', id: 'newid', label: '5' }],
                  },
                ],
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: { Config: { apiKey: 'dummyApiKey' } },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"id":"orderId1","timestamp":"2017-05-01T14:00:00Z","grand_total":1000,"currency":"INR","ip_address":"0.0.0.0","customer":{"id":"userId1","email":"testone@gmail.com","firstname":"test","lastname":"one"},"@type":"order","status":"complete","is_valid":true,"properties":{"field1":"val1"},"lineitems":[{"product_id":"prod123","quantity":4,"subtotal":10,"variant_options":[{"id":"newid","type":"size","label":"5"}]}]}]',
                },
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
    name: 'ometria',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'userId1',
              event: 'order completed',
              properties: {
                order_id: 'orderId1',
                timestamp: '2017-05-01T14:00:00Z',
                grand_total: 1000,
                currency: 'INR',
                field1: 'val1',
                shipping_address: {
                  city: 'Kolkata',
                  state: 'West Bengal',
                  postcode: '700001',
                  country_code: 'IN',
                },
                products: [
                  {
                    product_id: 'prod123',
                    quantity: 4,
                    subtotal: 10,
                    variant_options: [{ type: 'size', id: 'newid', label: '5' }],
                  },
                ],
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: { Config: { apiKey: 'dummyApiKey' } },
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
              endpoint: 'https://api.ometria.com/v2/push',
              headers: { 'X-Ometria-Auth': 'dummyApiKey' },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"id":"orderId1","timestamp":"2017-05-01T14:00:00Z","grand_total":1000,"currency":"INR","ip_address":"0.0.0.0","shipping_address":{"city":"Kolkata","state":"West Bengal","country_code":"IN","postcode":"700001"},"customer":{"id":"userId1","email":"testone@gmail.com","firstname":"test","lastname":"one"},"@type":"order","status":"complete","is_valid":true,"properties":{"field1":"val1"},"lineitems":[{"product_id":"prod123","quantity":4,"subtotal":10,"variant_options":[{"id":"newid","type":"size","label":"5"}]}]}]',
                },
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
