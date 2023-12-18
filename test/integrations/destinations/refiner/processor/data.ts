export const data = [
  {
    name: 'refiner',
    description: 'No Message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2022-10-11T13:10:54.877+05:30',
              userId: 'user@45',
              context: {
                traits: {
                  age: '30',
                  city: 'Banglore',
                  email: 'test@user.com',
                  phone: '9876543210',
                  address: { city: 'ahmedabad', state: 'india' },
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
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                blacklistedEvents: [{ eventName: '' }],
                eventDelivery: true,
                eventDeliveryTS: 1665474171943,
                eventFilteringOption: 'disable',
                whitelistedEvents: [{ eventName: '' }],
              },
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
            error: 'Event type is required',
            statTags: {
              destType: 'REFINER',
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
    name: 'refiner',
    description: 'Unsupported Event type ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'alias',
              sentAt: '2022-10-11T13:10:54.877+05:30',
              userId: 'user@45',
              context: {
                traits: {
                  age: '30',
                  city: 'Banglore',
                  email: 'test@user.com',
                  phone: '9876543210',
                  address: { city: 'ahmedabad', state: 'india' },
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
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                blacklistedEvents: [{ eventName: '' }],
                eventDelivery: true,
                eventDeliveryTS: 1665474171943,
                eventFilteringOption: 'disable',
                whitelistedEvents: [{ eventName: '' }],
              },
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
            error: 'Event type "alias" is not supported',
            statTags: {
              destType: 'REFINER',
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
    name: 'refiner',
    description: 'userId and email is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2022-10-11T13:10:54.877+05:30',
              context: {
                traits: {
                  age: '30',
                  city: 'Banglore',
                  phone: '9876543210',
                  address: { city: 'ahmedabad', state: 'india' },
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
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                blacklistedEvents: [{ eventName: '' }],
                eventDelivery: true,
                eventDeliveryTS: 1665474171943,
                eventFilteringOption: 'disable',
                whitelistedEvents: [{ eventName: '' }],
              },
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
            error: 'At least one of `userId` or `email` is required',
            statTags: {
              destType: 'REFINER',
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
    name: 'refiner',
    description: 'event name is not present',
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
                  version: '1.1.2',
                },
                traits: {
                  age: '30',
                  email: 'test@user.com',
                  phone: '9876543210',
                  city: 'Banglore',
                  userCountry: 'india',
                  lastName: 'user',
                  username: 'testUser',
                  firstName: 'test',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.2' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/tests/html/ecomm_test.html',
                  referrer: 'http://0.0.0.0:1112/tests/html/',
                  search: '',
                  title: 'Fb Offline Conversion Ecommerce Test',
                  url: 'http://0.0.0.0:1112/tests/html/ecomm_test.html',
                },
              },
              type: 'track',
              messageId: '9116b734-7e6b-4497-ab51-c16744d4487e',
              userId: 'user@45',
              properties: {
                order_id: '5241735',
                coupon: 'APPARELSALE',
                currency: 'IND',
                products: [
                  { id: 'product-bacon-jam', category: 'Merch', brand: '' },
                  { id: 'product-t-shirt', category: 'Merch', brand: 'Levis' },
                  { id: 'offer-t-shirt', category: 'Merch', brand: 'Levis' },
                ],
              },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                blacklistedEvents: [{ eventName: '' }],
                eventDelivery: true,
                eventDeliveryTS: 1665474171943,
                eventFilteringOption: 'disable',
                whitelistedEvents: [{ eventName: '' }],
              },
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
            error: 'Event name is required',
            statTags: {
              destType: 'REFINER',
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
    name: 'refiner',
    description: 'successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  phone: '9876543210',
                  address: { city: 'ahmedabad', state: 'india' },
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
              endpoint: 'https://api.refiner.io/v1/identify-user',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  age: '30',
                  city: 'Banglore',
                  email: 'test@user.com',
                  phone: '9876543210',
                  userId: 'user@45',
                  lastName: 'user',
                  username: 'testUser',
                  firstName: 'test',
                  userAddress: { city: 'ahmedabad', state: 'india' },
                  userCountry: 'india',
                },
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
    name: 'refiner',
    description: 'successful track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  phone: '9876543210',
                  lastName: 'user',
                  username: 'testUser',
                  firstName: 'test',
                  userCountry: 'india',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.2' },
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
                  { id: 'product-bacon-jam', category: 'Merch', brand: '' },
                  { id: 'product-t-shirt', category: 'Merch', brand: 'Levis' },
                  { id: 'offer-t-shirt', category: 'Merch', brand: 'Levis' },
                ],
              },
              receivedAt: '2022-10-11T13:38:29.178+05:30',
              request_ip: '[::1]',
              originalTimestamp: '2022-10-11T13:38:31.827+05:30',
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
        method: 'POST',
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
                FORM: { id: 'user@45', email: 'test@user.com', event: 'Product Searched' },
                JSON: {},
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Bearer dummyApiKey',
              },
              version: '1',
              endpoint: 'https://api.refiner.io/v1/track',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'refiner',
    description: 'successful group call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              sentAt: '2015-02-23T22:28:55.111Z',
              traits: { name: 'rudder ventures', email: 'business@rudderstack.com' },
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
              endpoint: 'https://api.refiner.io/v1/identify-user',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  id: 'test@12',
                  'account[businessEmail]': 'business@rudderstack.com',
                  'account[id]': 'group@123',
                  'account[name]': 'rudder ventures',
                },
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
    name: 'refiner',
    description: 'Refiner page call',
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
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: 'xyz',
                search: 'def',
                title: 'ghi',
                url: 'jkl',
              },
              integrations: { All: true },
              name: 'pageviewed',
              sentAt: '2019-10-14T11:15:53.296Z',
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
        method: 'POST',
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
                FORM: { id: '12345', event: 'Viewed pageviewed Page' },
                JSON: {},
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Bearer dummyApiKey',
              },
              version: '1',
              endpoint: 'https://api.refiner.io/v1/track',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
