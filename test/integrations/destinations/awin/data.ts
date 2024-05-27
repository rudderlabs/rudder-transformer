export const data = [
  {
    name: 'awin',
    description: 'Track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '1234',
                eventsToTrack: [
                  {
                    eventName: 'abc',
                  },
                  {
                    eventName: 'prop2',
                  },
                  {
                    eventName: 'prop3',
                  },
                ],
              },
            },
            message: {
              type: 'track',
              event: 'abc',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
                amount: 125,
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
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
              endpoint: 'https://www.awin1.com/sread.php',
              headers: {},
              params: {
                amount: 125,
                ch: 'aw',
                cr: 'INR',
                tt: 'ss',
                tv: '2',
                vc: '1bcu1',
                merchant: '1234',
                parts: 'DEFAULT:125',
                testmode: '0',
              },
              body: {
                JSON: {},
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
    name: 'awin',
    description: 'Track call- with all params',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '1234',
                eventsToTrack: [
                  {
                    eventName: 'abc',
                  },
                  {
                    eventName: 'prop2',
                  },
                  {
                    eventName: 'prop3',
                  },
                ],
              },
            },
            message: {
              type: 'track',
              event: 'prop2',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
                amount: 500,
                commissionGroup: 'sales',
                cks: 'new',
                testMode: '1',
                order_id: 'QW123',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
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
              endpoint: 'https://www.awin1.com/sread.php',
              headers: {},
              params: {
                amount: 500,
                ch: 'aw',
                parts: 'sales:500',
                cr: 'INR',
                tt: 'ss',
                tv: '2',
                vc: '1bcu1',
                cks: 'new',
                merchant: '1234',
                testmode: '1',
                ref: 'QW123',
              },
              body: {
                JSON: {},
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
    name: 'awin',
    description: 'eventsToTrack as an object',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '1234',
                eventsToTrack: {
                  eventName: 'abc',
                },
              },
            },
            message: {
              type: 'track',
              event: 'abc',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
                amount: 125,
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
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
              endpoint: 'https://www.awin1.com/sread.php',
              headers: {},
              params: {},
              body: {
                JSON: {},
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
    name: 'awin',
    description: 'Identify call- not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '1234',
                eventsToTrack: [
                  {
                    eventName: 'abc',
                  },
                  {
                    eventName: 'prop2',
                  },
                  {
                    eventName: 'prop3',
                  },
                ],
              },
            },
            message: {
              type: 'identify',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Message type not supported',
            statTags: {
              destType: 'AWIN',
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
    name: 'awin',
    description: 'AdvertiserId not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                eventsToTrack: [
                  {
                    eventName: 'abc',
                  },
                  {
                    eventName: 'prop2',
                  },
                  {
                    eventName: 'prop3',
                  },
                ],
              },
            },
            message: {
              type: 'track',
              event: 'abc',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Advertiser Id is not present. Aborting message.',
            statTags: {
              destType: 'AWIN',
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
    name: 'awin',
    description: 'Message type not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '1234',
                eventsToTrack: [
                  {
                    eventName: 'abc',
                  },
                  {
                    eventName: 'prop2',
                  },
                  {
                    eventName: 'prop3',
                  },
                ],
              },
            },
            message: {
              event: 'abc',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Message Type is not present. Aborting message.',
            statTags: {
              destType: 'AWIN',
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
    name: 'awin',
    description: 'Unlisted event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '1234',
                eventsToTrack: [
                  {
                    eventName: 'abc',
                  },
                  {
                    eventName: 'prop2',
                  },
                  {
                    eventName: 'prop3',
                  },
                ],
              },
            },
            message: {
              type: 'track',
              event: 'def',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: "Event is not present in 'Events to Track' list. Dropping the event.",
            statTags: {
              destType: 'AWIN',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 298,
          },
        ],
      },
    },
  },
  {
    name: 'awin',
    description: 'Track call- with product array',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '1234',
                eventsToTrack: [
                  {
                    eventName: 'abc',
                  },
                  {
                    eventName: 'prop2',
                  },
                  {
                    eventName: 'prop3',
                  },
                ],
              },
            },
            message: {
              type: 'track',
              event: 'prop2',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
                amount: 500,
                commissionGroup: 'sales',
                cks: 'new',
                testMode: '1',
                order_id: 'QW123',
                products: [
                  {
                    product_id: '123',
                    name: 'Product 1',
                    price: 10,
                    quantity: 1,
                    sku: undefined,
                    category: 'Category 1',
                  },
                  {
                    product_id: '456',
                    name: 'Product 2',
                    price: 20,
                    quantity: 2,
                    sku: 'SKU456',
                    category: undefined,
                  },
                ],
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
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
              endpoint: 'https://www.awin1.com/sread.php',
              headers: {},
              params: {
                amount: 500,
                ch: 'aw',
                parts: 'sales:500',
                cr: 'INR',
                tt: 'ss',
                tv: '2',
                vc: '1bcu1',
                cks: 'new',
                merchant: '1234',
                testmode: '1',
                ref: 'QW123',
                'bd[0]': 'AW:P|1234|QW123|123|Product%201|10|1||sales%3A500|Category%201',
                'bd[1]': 'AW:P|1234|QW123|456|Product%202|20|2|SKU456|sales%3A500|',
              },
              body: {
                JSON: {},
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
    name: 'awin',
    description: 'Track call- with product array where important keys might be missing.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '1234',
                eventsToTrack: [
                  {
                    eventName: 'abc',
                  },
                  {
                    eventName: 'prop2',
                  },
                  {
                    eventName: 'prop3',
                  },
                ],
              },
            },
            message: {
              type: 'track',
              event: 'prop2',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
                amount: 500,
                commissionGroup: 'sales',
                cks: 'new',
                testMode: '1',
                order_id: 'QW123',
                products: [
                  {
                    price: 10,
                    quantity: 1,
                    sku: undefined,
                    category: 'Category 1',
                  },
                  {
                    product_id: '456',
                    name: 'Product 2',
                    price: 20,
                    quantity: 2,
                    sku: 'SKU456',
                    category: undefined,
                  },
                ],
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
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
              endpoint: 'https://www.awin1.com/sread.php',
              headers: {},
              params: {
                amount: 500,
                ch: 'aw',
                parts: 'sales:500',
                cr: 'INR',
                tt: 'ss',
                tv: '2',
                vc: '1bcu1',
                cks: 'new',
                merchant: '1234',
                testmode: '1',
                ref: 'QW123',
                'bd[0]': 'AW:P|1234|QW123|456|Product%202|20|2|SKU456|sales%3A500|',
              },
              body: {
                JSON: {},
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
    name: 'awin',
    description: 'Track call: with custom transaction property',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '1234',
                eventsToTrack: [
                  {
                    eventName: 'abc',
                  },
                  {
                    eventName: 'prop2',
                  },
                  {
                    eventName: 'prop3',
                  },
                ],
                customFieldMap: [
                  {
                    from: 'customTransactionValue1',
                    to: 'p1',
                  },
                  {
                    from: 'customTransactionValue2',
                    to: 'p2',
                  },
                ],
              },
            },
            message: {
              type: 'track',
              event: 'abc',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
                amount: 125,
                customTransactionValue1: 'val1',
                customTransactionValue2: 'val2',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
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
              endpoint: 'https://www.awin1.com/sread.php',
              headers: {},
              params: {
                amount: 125,
                ch: 'aw',
                cr: 'INR',
                tt: 'ss',
                tv: '2',
                vc: '1bcu1',
                merchant: '1234',
                parts: 'DEFAULT:125',
                testmode: '0',
                p1: 'val1',
                p2: 'val2',
              },
              body: {
                JSON: {},
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
    name: 'awin',
    description: 'Track call- with product array, along with transactional custom property',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '1234',
                eventsToTrack: [
                  {
                    eventName: 'abc',
                  },
                  {
                    eventName: 'prop2',
                  },
                  {
                    eventName: 'prop3',
                  },
                ],
                customFieldMap: [
                  {
                    from: 'customTransactionValue1',
                    to: 'p1',
                  },
                  {
                    from: 'customTransactionValue2',
                    to: 'p2',
                  },
                ],
              },
            },
            message: {
              type: 'track',
              event: 'prop2',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                currency: 'INR',
                voucherCode: '1bcu1',
                amount: 500,
                commissionGroup: 'sales',
                cks: 'new',
                testMode: '1',
                order_id: 'QW123',
                customTransactionValue1: 'val1',
                customTransactionValue2: 'val2',
                products: [
                  {
                    price: 10,
                    quantity: 1,
                    sku: undefined,
                    category: 'Category 1',
                  },
                  {
                    product_id: '456',
                    name: 'Product 2',
                    price: 20,
                    quantity: 2,
                    sku: 'SKU456',
                    category: undefined,
                  },
                ],
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
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
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
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
              endpoint: 'https://www.awin1.com/sread.php',
              headers: {},
              params: {
                amount: 500,
                ch: 'aw',
                parts: 'sales:500',
                cr: 'INR',
                tt: 'ss',
                tv: '2',
                vc: '1bcu1',
                cks: 'new',
                merchant: '1234',
                testmode: '1',
                ref: 'QW123',
                'bd[0]': 'AW:P|1234|QW123|456|Product%202|20|2|SKU456|sales%3A500|',
                p1: 'val1',
                p2: 'val2',
              },
              body: {
                JSON: {},
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
