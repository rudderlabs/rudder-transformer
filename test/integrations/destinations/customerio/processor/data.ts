export const data = [
  {
    name: 'customerio',
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
              type: 'identify',
              userId: 'cio_1234',
              integrations: {
                All: true,
              },
              traits: {
                email: 'updated_email@example.com',
                id: 'updated-id-value',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  email: 'updated_email@example.com',
                  id: 'updated-id-value',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/cio_1234',
              userId: 'cio_1234',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
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
                  anonymousId: '123456',
                  email: 'test@rudderstack.com',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                  ip: '0.0.0.0',
                  age: 26,
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
              user_properties: {
                prop1: 'val1',
                prop2: 'val2',
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'anon-id',
                email: 'test@gmail.com',
                'dot.name': 'Arnab Pal',
                address: {
                  city: 'NY',
                  country: 'USA',
                  postalCode: 712136,
                  state: 'CA',
                  street: '',
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
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
            error: 'apiKey not found in Configs',
            statTags: {
              destType: 'CUSTOMERIO',
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
    name: 'customerio',
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
                  anonymousId: '123456',
                  email: 'test@rudderstack.com',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                  ip: '0.0.0.0',
                  age: 26,
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
              user_properties: {
                prop1: 'val1',
                prop2: 'val2',
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'anon-id',
                email: 'test@gmail.com',
                'dot.name': 'Arnab Pal',
                address: {
                  city: 'NY',
                  country: 'USA',
                  postalCode: 712136,
                  state: 'CA',
                  street: '',
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  _timestamp: 1571043797,
                  anonymous_id: '123456',
                  city: 'NY',
                  state: 'CA',
                  street: '',
                  prop1: 'val1',
                  prop2: 'val2',
                  country: 'USA',
                  postalCode: 712136,
                  email: 'test@gmail.com',
                  'dot.name': 'Arnab Pal',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/123456',
              userId: '123456',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
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
                  anonymousId: '123456',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                  ip: '0.0.0.0',
                  age: 26,
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
              user_properties: {
                prop1: 'val1',
                prop2: 'val2',
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'anon-id',
                'dot.name': 'Arnab Pal',
                address: {
                  city: 'NY',
                  country: 'USA',
                  postalCode: 712136,
                  state: 'CA',
                  street: '',
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
            error: 'userId or email is not present',
            statTags: {
              destType: 'CUSTOMERIO',
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
    name: 'customerio',
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
                  anonymousId: '123456',
                  email: 'test@rudderstack.com',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                  ip: '0.0.0.0',
                  age: 26,
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
              user_properties: {
                prop1: 'val1',
                prop2: 'val2',
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'anon-id',
                email: 'test@gmail.com',
                'dot.name': 'Arnab Pal',
                address: {
                  city: 'NY',
                  country: 'USA',
                  postalCode: 712136,
                  state: 'CA',
                  street: '',
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  _timestamp: 1571043797,
                  anonymous_id: '123456',
                  city: 'NY',
                  country: 'USA',
                  'dot.name': 'Arnab Pal',
                  email: 'test@gmail.com',
                  postalCode: 712136,
                  prop1: 'val1',
                  prop2: 'val2',
                  state: 'CA',
                  street: '',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/test@gmail.com',
              userId: '123456',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '12345',
              properties: {
                path: '/test',
                referrer: 'Rudder',
                search: 'abc',
                title: 'Test Page',
                url: 'www.rudderlabs.com',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'page',
                  data: {
                    url: 'www.rudderlabs.com',
                    path: '/test',
                    search: 'abc',
                    referrer: 'Rudder',
                    title: 'Test Page',
                  },
                  timestamp: 1571051718,
                  name: 'ApplicationLoaded',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '12345',
              event: 'test track event',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'event',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  timestamp: 1571051718,
                  name: 'test track event',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '',
              event: 'test track event',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'event',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  timestamp: 1571051718,
                  name: 'test track event',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/test@rudderstack.com/events',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
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
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '',
              event: 'test track event',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'event',
                  anonymous_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  timestamp: 1571051718,
                  name: 'test track event',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/events',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '7e32188a4dab669f',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.torpedolabs.wynn.wscci.dev',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                  token: 'abcxyz',
                },
                library: {
                  name: 'com.rudderlabs.android.sdk.core',
                  version: '0.1.4',
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
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              event: 'Application Installed',
              integrations: {
                All: true,
              },
              messageId: '1578564113557-af022c68-429e-4af4-b99b-2b9174056383',
              properties: {
                review_id: 'some_review_id',
                product_id: 'some_product_id_a',
                rating: 2,
                review_body: 'Some Review Body',
              },
              userId: '12345',
              originalTimestamp: '2020-01-09T10:01:53.558Z',
              type: 'track',
              sentAt: '2020-01-09T10:02:03.257Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  device: {
                    review_body: 'Some Review Body',
                    rating: 2,
                    review_id: 'some_review_id',
                    last_used: 1578564113,
                    platform: 'android',
                    id: 'abcxyz',
                    product_id: 'some_product_id_a',
                  },
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/devices',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '7e32188a4dab669f',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.torpedolabs.wynn.wscci.dev',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                  token: 'abcxyz',
                },
                library: {
                  name: 'com.rudderlabs.android.sdk.core',
                  version: '0.1.4',
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
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              event: 'Application Uninstalled',
              integrations: {
                All: true,
              },
              messageId: '1578564113557-af022c68-429e-4af4-b99b-2b9174056383',
              properties: {
                review_id: 'some_review_id',
                product_id: 'some_product_id_a',
                rating: 2,
                review_body: 'Some Review Body',
              },
              userId: '12345',
              originalTimestamp: '2020-01-09T10:01:53.558Z',
              type: 'track',
              sentAt: '2020-01-09T10:02:03.257Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {},
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/devices/abcxyz',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'DELETE',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '12345',
              event: 'Application Uninstalled',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {},
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/devices/somel',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'DELETE',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Uninstalled',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {},
                FORM: {},
              },
              files: {},
              endpoint:
                'https://track.customer.io/api/v1/customers/test@rudderstack.com/devices/somel',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'DELETE',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Uninstalled',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
            error: 'userId/email or device_token not present',
            statTags: {
              destType: 'CUSTOMERIO',
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
    name: 'customerio',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Installed',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  device: {
                    id: 'somel',
                    last_used: 1571051718,
                    platform: 'mobile',
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/test@rudderstack.com/devices',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Installed',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  anonymous_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  name: 'Application Installed',
                  timestamp: 1571051718,
                  type: 'event',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/events',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Installed',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  device: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    last_used: 1571051718,
                    user_time_spent: 50000,
                    platform: 'mobile',
                    id: 'somel',
                  },
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/devices',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Installed',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'event',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  timestamp: 1571051718,
                  name: 'Application Installed',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 18',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Opened',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'event',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  timestamp: 1571051718,
                  name: 'Application Opened',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 19',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'sample_device_token',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Opened',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  device: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    last_used: 1571051718,
                    user_time_spent: 50000,
                    platform: 'mobile',
                    id: 'sample_device_token',
                  },
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/devices',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'sample_device_token',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Uninstalled',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {},
                FORM: {},
              },
              files: {},
              endpoint:
                'https://track.customer.io/api/v1/customers/12345/devices/sample_device_token',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'DELETE',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 21',
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
                  anonymousId: '123456',
                  email: 'test@rudderstack.com',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                  ip: '0.0.0.0',
                  age: 26,
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
              user_properties: {
                prop1: 'val1',
                prop2: 'val2',
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'anon-id',
                email: 'test@gmail.com',
                address: {
                  city: 'NY',
                  country: 'USA',
                  postalCode: 712136,
                  state: 'CA',
                  street: '',
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  _timestamp: 1571043797,
                  anonymous_id: '123456',
                  city: 'NY',
                  state: 'CA',
                  street: '',
                  prop1: 'val1',
                  prop2: 'val2',
                  country: 'USA',
                  postalCode: 712136,
                  email: 'test@gmail.com',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/123456',
              userId: '123456',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 22',
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '12345',
              properties: {
                path: '/test',
                referrer: 'Rudder',
                search: 'abc',
                title: 'Test Page',
                url: 'www.rudderlabs.com',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'page',
                  data: {
                    url: 'www.rudderlabs.com',
                    path: '/test',
                    search: 'abc',
                    referrer: 'Rudder',
                    title: 'Test Page',
                  },
                  timestamp: 1571051718,
                  name: 'ApplicationLoaded',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 23',
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '12345',
              event: 'test track event',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'event',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  timestamp: 1571051718,
                  name: 'test track event',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
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
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '',
              event: 'test track event',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'event',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  timestamp: 1571051718,
                  name: 'test track event',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/test@rudderstack.com/events',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 25',
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
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '',
              event: 'test track event',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'event',
                  anonymous_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  timestamp: 1571051718,
                  name: 'test track event',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/events',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 26',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '7e32188a4dab669f',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.torpedolabs.wynn.wscci.dev',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                  token: 'abcxyz',
                },
                library: {
                  name: 'com.rudderlabs.android.sdk.core',
                  version: '0.1.4',
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
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              event: 'Application Installed',
              integrations: {
                All: true,
              },
              messageId: '1578564113557-af022c68-429e-4af4-b99b-2b9174056383',
              properties: {
                review_id: 'some_review_id',
                product_id: 'some_product_id_a',
                rating: 2,
                review_body: 'Some Review Body',
              },
              userId: '12345',
              originalTimestamp: '2020-01-09T10:01:53.558Z',
              type: 'track',
              sentAt: '2020-01-09T10:02:03.257Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  device: {
                    review_body: 'Some Review Body',
                    rating: 2,
                    review_id: 'some_review_id',
                    last_used: 1578564113,
                    platform: 'android',
                    id: 'abcxyz',
                    product_id: 'some_product_id_a',
                  },
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/12345/devices',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 27',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '7e32188a4dab669f',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.torpedolabs.wynn.wscci.dev',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                  token: 'abcxyz',
                },
                library: {
                  name: 'com.rudderlabs.android.sdk.core',
                  version: '0.1.4',
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
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              event: 'Application Uninstalled',
              integrations: {
                All: true,
              },
              messageId: '1578564113557-af022c68-429e-4af4-b99b-2b9174056383',
              properties: {
                review_id: 'some_review_id',
                product_id: 'some_product_id_a',
                rating: 2,
                review_body: 'Some Review Body',
              },
              userId: '12345',
              originalTimestamp: '2020-01-09T10:01:53.558Z',
              type: 'track',
              sentAt: '2020-01-09T10:02:03.257Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {},
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/12345/devices/abcxyz',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'DELETE',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 28',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '12345',
              event: 'Application Uninstalled',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {},
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/12345/devices/somel',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'DELETE',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 29',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Uninstalled',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
            error: 'userId/email or device_token not present',
            statTags: {
              destType: 'CUSTOMERIO',
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
    name: 'customerio',
    description: 'Test 30',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Installed',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  device: {
                    id: 'somel',
                    last_used: 1571051718,
                    platform: 'mobile',
                    user_actual_role: 'system_admin',
                    user_actual_id: 12345,
                    user_time_spent: 50000,
                  },
                },
                FORM: {},
              },
              files: {},
              endpoint:
                'https://track-eu.customer.io/api/v1/customers/test@rudderstack.com/devices',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 31',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Installed',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  anonymous_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  data: {
                    user_actual_role: 'system_admin',
                    user_actual_id: 12345,
                    user_time_spent: 50000,
                  },
                  name: 'Application Installed',
                  timestamp: 1571051718,
                  type: 'event',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/events',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 32',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Installed',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  device: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    last_used: 1571051718,
                    user_time_spent: 50000,
                    platform: 'mobile',
                    id: 'somel',
                  },
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/12345/devices',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 33',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Installed',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'event',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  timestamp: 1571051718,
                  name: 'Application Installed',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 34',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Opened',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'event',
                  data: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    user_time_spent: 50000,
                  },
                  timestamp: 1571051718,
                  name: 'Application Opened',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 35',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'sample_device_token',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Opened',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  device: {
                    user_actual_id: 12345,
                    user_actual_role: 'system_admin',
                    last_used: 1571051718,
                    user_time_spent: 50000,
                    platform: 'mobile',
                    id: 'sample_device_token',
                  },
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track-eu.customer.io/api/v1/customers/12345/devices',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 36',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  id: 'sample_device_id',
                  model: 'some_model_device',
                  type: 'mobile',
                  token: 'sample_device_token',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Uninstalled',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {},
                FORM: {},
              },
              files: {},
              endpoint:
                'https://track-eu.customer.io/api/v1/customers/12345/devices/sample_device_token',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'DELETE',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 37',
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
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event:
                'https://www.stoodi.com.br/exershgcios/upe/2019/questao/gregorio-de-matos-poeta-baiano-que-viveu-no-seculo-xvi/',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
              endpoint: 'https://track.customer.io/api/v1/events',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    user_actual_role: 'system_admin',
                    user_actual_id: 12345,
                    user_time_spent: 50,
                  },
                  anonymous_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  name: 'https://www.stoodi.com.br/exershgcios/upe/2019/questao/gregorio-de-matos-poeta-baiano-que-viveu-no-s',
                  type: 'event',
                  timestamp: 1571051718,
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 38',
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event:
                'https://www.stoodi.com.br/exershgcios/upe/2019/questao/gregorio-de-matos-poeta-baiano-que-viveu-no-seculo-xvi/',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
              endpoint: 'https://track.customer.io/api/v1/customers/test@rudderstack.com/events',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    user_actual_role: 'system_admin',
                    user_actual_id: 12345,
                    user_time_spent: 50,
                  },
                  name: 'https://www.stoodi.com.br/exershgcios/upe/2019/questao/gregorio-de-matos-poeta-baiano-que-viveu-no-seculo-xvi/',
                  type: 'event',
                  timestamp: 1571051718,
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 39',
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
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event:
                'https://www.stoodi.com.br/exercicios/upe/2016/questao/gregorio-de-matos-poeta-baiano-que-viveu-no-seculo-xvi/',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
              endpoint: 'https://track.customer.io/api/v1/events',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    user_actual_role: 'system_admin',
                    user_actual_id: 12345,
                    user_time_spent: 50000,
                  },
                  anonymous_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  name: 'Viewed https://www.stoodi.com.br/exercicios/upe/2016/questao/gregorio-de-matos-poeta-baiano-q Screen',
                  type: 'event',
                  timestamp: 1571051718,
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 40',
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event:
                'https://www.stoodi.com.br/exercicios/upe/2016/questao/gregorio-de-matos-poeta-baiano-que-viveu-no-seculo-xvi/',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
              endpoint: 'https://track.customer.io/api/v1/customers/test@rudderstack.com/events',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    user_actual_role: 'system_admin',
                    user_actual_id: 12345,
                    user_time_spent: 50000,
                  },
                  name: 'Viewed https://www.stoodi.com.br/exercicios/upe/2016/questao/gregorio-de-matos-poeta-baiano-que-viveu-no-seculo-xvi/ Screen',
                  type: 'event',
                  timestamp: 1571051718,
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 41',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'dummy-100-anon',
              channel: 'mobile',
              context: {
                app: {
                  build: '173',
                  name: 'MyWallSt Debug',
                  namespace: 'com.rubicoin.Invest',
                  version: '6.2',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '6fdb629d-4f18-4f3e-943a-3f6f482b331e',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: "Ales' iPhone",
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.0.19',
                },
                locale: 'en-DE',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.8',
                },
                screen: {
                  density: 3,
                  height: 375,
                  width: 812,
                },
                timezone: 'Europe/Prague',
                traits: {
                  anonymousId: '6fdb629d-4f18-4f3e-943a-3f6f482b331e',
                  userId: '6a540d50-c4dc-4694-beca-d16de113a1c4-1618384106.8700438',
                },
              },
              event: 'Home: Viewed',
              integrations: {
                All: true,
              },
              messageId: '1632314412-e724167f-13bd-455b-943d-dd765a7810fe',
              originalTimestamp: '2021-09-22T12:40:12.220Z',
              properties: {},
              rudderId: '782cdb50-e2b9-45fc-9d22-07fe792dcfba',
              sentAt: '2021-09-22T12:40:14.453Z',
              type: 'track',
              userId: 'dummy-user-id-100',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: 'abc',
                apiKey: 'xyz',
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
              endpoint: 'https://track.customer.io/api/v1/customers/dummy-user-id-100/events',
              headers: {
                Authorization: 'Basic YWJjOnh5eg==',
              },
              params: {},
              body: {
                JSON: {
                  data: {},
                  name: 'Home: Viewed',
                  type: 'event',
                  timestamp: 1632314412,
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'dummy-user-id-100',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 42',
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
                  anonymousId: '123456',
                  email: 'test@rudderstack.com',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                  ip: '0.0.0.0',
                  age: 26,
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
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: 'dummy-100-anon',
              userId: 'dummy-user-id-100',
              integrations: {
                All: true,
              },
              traits: {
                email: 'test@gmail.com',
                address: {
                  city: 'NY',
                  country: 'USA',
                  postalCode: 712136,
                  state: 'CA',
                  street: '',
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
              method: 'PUT',
              endpoint: 'https://track-eu.customer.io/api/v1/customers/dummy-user-id-100',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              params: {},
              body: {
                JSON: {
                  city: 'NY',
                  country: 'USA',
                  postalCode: 712136,
                  state: 'CA',
                  street: '',
                  email: 'test@gmail.com',
                  _timestamp: 1571043797,
                  anonymous_id: 'dummy-100-anon',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'dummy-user-id-100',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 43',
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
                    id: 'xaviercharles@hotmail.com',
                    identifierType: 'email',
                    type: 'CUSTOMERIO-customers',
                  },
                ],
                mappedToDestination: 'true',
                sources: {
                  batch_id: '3d6f7aa8-9b70-4759-970d-212e6714ad22',
                  job_id: '1zDgnw7ZmHWR7gtY4niHYysL3zS/Syncher',
                  job_run_id: 'c5shebbh9jqg10k8d21g',
                  task_id: 'tt_10_rows',
                  task_run_id: 'c5shebbh9jqg10k8d220',
                  version: 'release.v1.6.8',
                },
              },
              messageId: 'd82a45e1-5a27-4c1d-af89-83bdbc6139d0',
              originalTimestamp: '2021-10-27T09:09:56.673Z',
              receivedAt: '2021-10-27T09:09:56.187Z',
              recordId: '3',
              request_ip: '10.1.85.177',
              rudderId: '5b19a81b-df60-4ccd-abf0-fcfe2b7db054',
              sentAt: '2021-10-27T09:09:56.673Z',
              timestamp: '2021-10-27T09:09:56.186Z',
              traits: {
                last_name: 'xavier',
                first_name: 'charles',
              },
              type: 'identify',
              userId: 'xaviercharles@hotmail.com',
            },
            destination: {
              ID: '1zgXcyv272oZA8HWqe7zInhJjPL',
              Name: 'ere',
              DestinationDefinition: {
                ID: '1iVQr671C0E8MVpzvCEegsLM2J5',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU'],
                    web: ['useNativeSDK'],
                  },
                  excludeKeys: [],
                  includeKeys: ['apiKey', 'siteID', 'datacenterEU'],
                  saveDestinationResponse: true,
                  secretKeys: [],
                  supportedSourceTypes: [
                    'android',
                    'ios',
                    'web',
                    'unity',
                    'amp',
                    'cloud',
                    'warehouse',
                    'reactnative',
                  ],
                  supportsVisualMapper: true,
                  transformAt: 'processor',
                },
                ResponseRules: null,
              },
              Config: {
                apiKey: 'a292d85ac36de15fc219',
                datacenter: 'US',
                siteID: 'eead090ab9e2e35004dc',
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
              method: 'PUT',
              endpoint: 'https://track.customer.io/api/v1/customers/xaviercharles@hotmail.com',
              headers: {
                Authorization: 'Basic ZWVhZDA5MGFiOWUyZTM1MDA0ZGM6YTI5MmQ4NWFjMzZkZTE1ZmMyMTk=',
              },
              params: {},
              body: {
                JSON: {
                  last_name: 'xavier',
                  first_name: 'charles',
                  email: 'xaviercharles@hotmail.com',
                  _timestamp: 1635325796,
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'xaviercharles@hotmail.com',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 44',
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
                    id: 'xaviercharles',
                    identifierType: 'id',
                    type: 'CUSTOMERIO-customers',
                  },
                ],
                mappedToDestination: 'true',
                sources: {
                  batch_id: '3d6f7aa8-9b70-4759-970d-212e6714ad22',
                  job_id: '1zDgnw7ZmHWR7gtY4niHYysL3zS/Syncher',
                  job_run_id: 'c5shebbh9jqg10k8d21g',
                  task_id: 'tt_10_rows',
                  task_run_id: 'c5shebbh9jqg10k8d220',
                  version: 'release.v1.6.8',
                },
              },
              messageId: 'd82a45e1-5a27-4c1d-af89-83bdbc6139d0',
              originalTimestamp: '2021-10-27T09:09:56.673Z',
              receivedAt: '2021-10-27T09:09:56.187Z',
              recordId: '3',
              request_ip: '10.1.85.177',
              rudderId: '5b19a81b-df60-4ccd-abf0-fcfe2b7db054',
              sentAt: '2021-10-27T09:09:56.673Z',
              traits: {
                last_name: 'xavier',
                first_name: 'charles',
              },
              type: 'identify',
              userId: 'xaviercharles',
            },
            destination: {
              ID: '1zgXcyv272oZA8HWqe7zInhJjPL',
              Name: 'ere',
              DestinationDefinition: {
                ID: '1iVQr671C0E8MVpzvCEegsLM2J5',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU'],
                    web: ['useNativeSDK'],
                  },
                  excludeKeys: [],
                  includeKeys: ['apiKey', 'siteID', 'datacenterEU'],
                  saveDestinationResponse: true,
                  secretKeys: [],
                  supportedSourceTypes: [
                    'android',
                    'ios',
                    'web',
                    'unity',
                    'amp',
                    'cloud',
                    'warehouse',
                    'reactnative',
                  ],
                  supportsVisualMapper: true,
                  transformAt: 'processor',
                },
                ResponseRules: null,
              },
              Config: {
                apiKey: 'a292d85ac36de15fc219',
                datacenter: 'US',
                siteID: 'eead090ab9e2e35004dc',
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
              method: 'PUT',
              endpoint: 'https://track.customer.io/api/v1/customers/xaviercharles',
              headers: {
                Authorization: 'Basic ZWVhZDA5MGFiOWUyZTM1MDA0ZGM6YTI5MmQ4NWFjMzZkZTE1ZmMyMTk=',
              },
              params: {},
              body: {
                JSON: {
                  last_name: 'xavier',
                  first_name: 'charles',
                  id: 'xaviercharles',
                  _timestamp: 1635325796,
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'xaviercharles',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 45',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  token: 'deviceToken',
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                  userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
                },
              },
              event: 'Application Opened',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              timestamp: '2022-01-10T10:00:26.513Z',
              properties: {
                from_background: false,
              },
              receivedAt: '2022-01-10T20:35:30.556+05:30',
              request_ip: '[::1]',
              rudderId: '423cdf83-0448-4a99-b14d-36fcc63e6ea0',
              sentAt: '2022-01-10T10:00:26.982Z',
              type: 'track',
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/devices',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  device: {
                    from_background: false,
                    id: 'deviceToken',
                    platform: 'ios',
                    last_used: 1641808826,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 46',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                  userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
                },
              },
              event: 'Application Opened',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              originalTimestamp: '2022-01-10T10:00:26.513Z',
              properties: {
                from_background: false,
              },
              receivedAt: '2022-01-10T20:39:04.424+05:30',
              request_ip: '[::1]',
              rudderId: '423cdf83-0448-4a99-b14d-36fcc63e6ea0',
              sentAt: '2022-01-10T10:00:26.982Z',
              timestamp: '2022-01-10T20:39:03.955+05:30',
              type: 'track',
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint:
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/events',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    from_background: false,
                  },
                  name: 'Application Opened',
                  type: 'event',
                  timestamp: 1641827343,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 47',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  token: 'deviceToken',
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                },
              },
              event: 'Application Opened',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              originalTimestamp: '2022-01-10T10:00:26.513Z',
              properties: {
                from_background: false,
              },
              receivedAt: '2022-01-10T20:41:30.970+05:30',
              request_ip: '[::1]',
              rudderId: '423cdf83-0448-4a99-b14d-36fcc63e6ea0',
              sentAt: '2022-01-10T10:00:26.982Z',
              type: 'track',
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/devices',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  device: {
                    from_background: false,
                    id: 'deviceToken',
                    platform: 'ios',
                    last_used: 1641808826,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 48',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  token: 'deviceToken',
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                  userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
                },
              },
              event: 'Application Opened',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              originalTimestamp: '2022-01-10T10:00:26.513Z',
              properties: {
                from_background: false,
              },
              receivedAt: '2022-01-10T20:44:52.784+05:30',
              request_ip: '[::1]',
              rudderId: '0aef312c-0dc0-4a49-b613-4f33fb4e9b46',
              sentAt: '2022-01-10T10:00:26.982Z',
              type: 'track',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/devices',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  device: {
                    from_background: false,
                    id: 'deviceToken',
                    platform: 'ios',
                    last_used: 1641808826,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 49',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  token: 'deviceToken',
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                  userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
                },
              },
              event: 'Application Opened',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              timestamp: '2022-01-10T10:00:26.513Z',
              receivedAt: '2022-01-10T20:47:36.180+05:30',
              request_ip: '[::1]',
              rudderId: '0aef312c-0dc0-4a49-b613-4f33fb4e9b46',
              sentAt: '2022-01-10T10:00:26.982Z',
              type: 'track',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/devices',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  device: {
                    id: 'deviceToken',
                    platform: 'ios',
                    last_used: 1641808826,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 50',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  token: 'deviceToken',
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                  userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
                },
              },
              event: 'device_token_registered',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              originalTimestamp: '2022-01-10T10:00:26.513Z',
              properties: {
                from_background: false,
              },
              receivedAt: '2022-01-10T20:49:05.795+05:30',
              request_ip: '[::1]',
              rudderId: '423cdf83-0448-4a99-b14d-36fcc63e6ea0',
              sentAt: '2022-01-10T10:00:26.982Z',
              type: 'track',
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/devices',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  device: {
                    from_background: false,
                    id: 'deviceToken',
                    platform: 'ios',
                    last_used: 1641808826,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 51',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                  userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
                },
              },
              event: 'device_token_registered',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              originalTimestamp: '2022-01-10T10:00:26.513Z',
              properties: {
                from_background: false,
              },
              receivedAt: '2022-01-10T20:50:17.090+05:30',
              request_ip: '[::1]',
              rudderId: '423cdf83-0448-4a99-b14d-36fcc63e6ea0',
              sentAt: '2022-01-10T10:00:26.982Z',
              timestamp: '2022-01-10T20:50:16.621+05:30',
              type: 'track',
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint:
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/events',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    from_background: false,
                  },
                  name: 'device_token_registered',
                  type: 'event',
                  timestamp: 1641828016,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 52',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  token: 'deviceToken',
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                },
              },
              event: 'device_token_registered',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              originalTimestamp: '2022-01-10T10:00:26.513Z',
              properties: {
                from_background: false,
              },
              receivedAt: '2022-01-10T20:52:19.147+05:30',
              request_ip: '[::1]',
              rudderId: '423cdf83-0448-4a99-b14d-36fcc63e6ea0',
              sentAt: '2022-01-10T10:00:26.982Z',
              timestamp: '2022-01-10T20:52:18.678+05:30',
              type: 'track',
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/devices',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  device: {
                    from_background: false,
                    id: 'deviceToken',
                    platform: 'ios',
                    last_used: 1641828138,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 53',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  token: 'deviceToken',
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                  userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
                },
              },
              event: 'device_token_registered',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              originalTimestamp: '2022-01-10T10:00:26.513Z',
              properties: {
                from_background: false,
              },
              receivedAt: '2022-01-10T20:53:43.680+05:30',
              request_ip: '[::1]',
              rudderId: '0aef312c-0dc0-4a49-b613-4f33fb4e9b46',
              sentAt: '2022-01-10T10:00:26.982Z',
              type: 'track',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/devices',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  device: {
                    from_background: false,
                    id: 'deviceToken',
                    platform: 'ios',
                    last_used: 1641808826,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 54',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  token: 'deviceToken',
                  type: 'iOS',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                  userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
                },
              },
              event: 'device_token_registered',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              originalTimestamp: '2022-01-10T10:00:26.513Z',
              receivedAt: '2022-01-10T20:55:03.845+05:30',
              request_ip: '[::1]',
              rudderId: '0aef312c-0dc0-4a49-b613-4f33fb4e9b46',
              sentAt: '2022-01-10T10:00:26.982Z',
              type: 'track',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/devices',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  device: {
                    id: 'deviceToken',
                    platform: 'ios',
                    last_used: 1641808826,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 55',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'check for ipados apple family and default it to ios',
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'zx_userid_missing',
                  namespace: 'org.reactjs.native.example.zx-userid-missing',
                  version: '1.0',
                },
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  token: 'deviceToken',
                  type: 'ipados',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.3.1',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '15.2',
                },
                screen: {
                  density: 3,
                  height: 390,
                  width: 844,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                },
              },
              event: 'Application Opened',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              originalTimestamp: '2022-01-10T10:00:26.513Z',
              properties: {
                from_background: false,
              },
              receivedAt: '2022-01-10T20:41:30.970+05:30',
              request_ip: '[::1]',
              rudderId: '423cdf83-0448-4a99-b14d-36fcc63e6ea0',
              sentAt: '2022-01-10T10:00:26.982Z',
              type: 'track',
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'DESAU SAI',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'DESU SAI',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
                'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/devices',
              headers: {
                Authorization: 'Basic REVTVSBTQUk6REVTQVUgU0FJ',
              },
              params: {},
              body: {
                JSON: {
                  device: {
                    from_background: false,
                    id: 'deviceToken',
                    platform: 'ios',
                    last_used: 1641808826,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 56',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'successful group call with identify action',
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.0-beta.2',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.0-beta.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              groupId: 'group@1',
              integrations: {
                All: true,
              },
              traits: {
                domainNames: 'rudderstack.com',
                email: 'help@rudderstack.com',
                name: 'rudderstack',
                action: 'identify',
              },
              type: 'group',
              userId: 'user@1',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'ef32c3f60fb98f39ef35',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'c0efdbd20b9fbe24a7e2',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://track.customer.io/api/v2/batch',
              headers: {
                Authorization: 'Basic YzBlZmRiZDIwYjlmYmUyNGE3ZTI6ZWYzMmMzZjYwZmI5OGYzOWVmMzU=',
              },
              params: {},
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'object',
                  action: 'identify',
                  attributes: {
                    name: 'rudderstack',
                    email: 'help@rudderstack.com',
                    domainNames: 'rudderstack.com',
                  },
                  identifiers: {
                    object_id: 'group@1',
                    object_type_id: '1',
                  },
                  cio_relationships: [
                    {
                      identifiers: {
                        id: 'user@1',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
              },
              files: {},
              userId: 'user@1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 57',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'successful group call with delete action',
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.0-beta.2',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.0-beta.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              groupId: 'group@1',
              integrations: {
                All: true,
              },
              traits: {
                domainNames: 'rudderstack.com',
                email: 'help@rudderstack.com',
                name: 'rudderstack',
                action: 'delete',
              },
              type: 'group',
              userId: 'user@1',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'ef32c3f60fb98f39ef35',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'c0efdbd20b9fbe24a7e2',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://track.customer.io/api/v2/batch',
              headers: {
                Authorization: 'Basic YzBlZmRiZDIwYjlmYmUyNGE3ZTI6ZWYzMmMzZjYwZmI5OGYzOWVmMzU=',
              },
              params: {},
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'object',
                  action: 'delete',
                  attributes: {
                    name: 'rudderstack',
                    email: 'help@rudderstack.com',
                    domainNames: 'rudderstack.com',
                  },
                  identifiers: {
                    object_id: 'group@1',
                    object_type_id: '1',
                  },
                  cio_relationships: [
                    {
                      identifiers: {
                        id: 'user@1',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
              },
              files: {},
              userId: 'user@1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 58',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'successful group call with add_relationships action',
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.0-beta.2',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.0-beta.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'test@rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              groupId: 'group@1',
              integrations: {
                All: true,
              },
              traits: {
                domainNames: 'rudderstack.com',
                email: 'help@rudderstack.com',
                name: 'rudderstack',
                action: 'add_relationships',
              },
              type: 'group',
              userId: 'user@1',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'ef32c3f60fb98f39ef35',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'c0efdbd20b9fbe24a7e2',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://track.customer.io/api/v2/batch',
              headers: {
                Authorization: 'Basic YzBlZmRiZDIwYjlmYmUyNGE3ZTI6ZWYzMmMzZjYwZmI5OGYzOWVmMzU=',
              },
              params: {},
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'object',
                  action: 'add_relationships',
                  attributes: {
                    name: 'rudderstack',
                    email: 'help@rudderstack.com',
                    domainNames: 'rudderstack.com',
                  },
                  identifiers: {
                    object_id: 'group@1',
                    object_type_id: '1',
                  },
                  cio_relationships: [
                    {
                      identifiers: {
                        id: 'user@1',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
              },
              files: {},
              userId: 'user@1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 59',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'successful group call with delete_relationships action',
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.0-beta.2',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.0-beta.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'test@rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              groupId: 'group@1',
              integrations: {
                All: true,
              },
              traits: {
                domainNames: 'rudderstack.com',
                email: 'help@rudderstack.com',
                name: 'rudderstack',
                action: 'delete_relationships',
              },
              type: 'group',
              userId: 'user@1',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'ef32c3f60fb98f39ef35',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'c0efdbd20b9fbe24a7e2',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://track.customer.io/api/v2/batch',
              headers: {
                Authorization: 'Basic YzBlZmRiZDIwYjlmYmUyNGE3ZTI6ZWYzMmMzZjYwZmI5OGYzOWVmMzU=',
              },
              params: {},
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'object',
                  action: 'delete_relationships',
                  attributes: {
                    name: 'rudderstack',
                    email: 'help@rudderstack.com',
                    domainNames: 'rudderstack.com',
                  },
                  identifiers: {
                    object_id: 'group@1',
                    object_type_id: '1',
                  },
                  cio_relationships: [
                    {
                      identifiers: {
                        id: 'user@1',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
              },
              files: {},
              userId: 'user@1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 60',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'successful group call with userId and groupId as an integer',
            message: {
              type: 'group',
              header: {
                'content-type': 'application/json; charset=utf-8',
              },
              sentAt: '2023-03-28T09:36:49.882Z',
              traits: {
                city: 'Frankfurt',
                name: 'rudder test',
                state: 'Hessen',
                isFake: true,
                address: 'Solmsstraße 83',
                country: 'DE',
                website: 'http://www.rudderstack.com',
                industry: 'Waste and recycling',
                postcode: '60486',
                whiteLabel: 'rudderlabs',
                maxNbJobBoards: 2,
                organisationId: 306,
                pricingPackage: 'packageExpert',
                dateProTrialEnd: '2022-08-31T00:00:00+00:00',
                isProTrialActive: true,
                datetimeRegistration: '2020-07-01T10:23:41+00:00',
                isPersonnelServiceProvider: false,
              },
              userId: 432,
              channel: 'server',
              context: {
                library: {
                  name: 'rudder-analytics-php',
                  version: '2.0.1',
                  consumer: 'LibCurl',
                },
              },
              groupId: 306,
              rudderId: 'f5b46a12-2dab-4e24-a127-7316eed414fc',
              messageId: '7032394c-e813-4737-bf52-622dbcefe849',
              receivedAt: '2023-03-28T09:36:48.296Z',
              request_ip: '18.195.235.225',
              originalTimestamp: '2023-03-28T09:36:49.882Z',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'ef32c3f60fb98f39ef35',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'c0efdbd20b9fbe24a7e2',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://track.customer.io/api/v2/batch',
              headers: {
                Authorization: 'Basic YzBlZmRiZDIwYjlmYmUyNGE3ZTI6ZWYzMmMzZjYwZmI5OGYzOWVmMzU=',
              },
              params: {},
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'object',
                  action: 'identify',
                  attributes: {
                    city: 'Frankfurt',
                    name: 'rudder test',
                    state: 'Hessen',
                    isFake: true,
                    address: 'Solmsstraße 83',
                    country: 'DE',
                    website: 'http://www.rudderstack.com',
                    industry: 'Waste and recycling',
                    postcode: '60486',
                    whiteLabel: 'rudderlabs',
                    maxNbJobBoards: 2,
                    organisationId: 306,
                    pricingPackage: 'packageExpert',
                    dateProTrialEnd: '2022-08-31T00:00:00+00:00',
                    isProTrialActive: true,
                    datetimeRegistration: '2020-07-01T10:23:41+00:00',
                    isPersonnelServiceProvider: false,
                  },
                  identifiers: {
                    object_id: '306',
                    object_type_id: '1',
                  },
                  cio_relationships: [
                    {
                      identifiers: {
                        id: '432',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
              },
              files: {},
              userId: '432',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 61',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'successful group call with userId in email format ',
            message: {
              type: 'group',
              header: {
                'content-type': 'application/json; charset=utf-8',
              },
              sentAt: '2023-03-28T09:36:49.882Z',
              traits: {
                city: 'Frankfurt',
                name: 'rudder test',
                state: 'Hessen',
                isFake: true,
                address: 'Solmsstraße 83',
                country: 'DE',
                website: 'http://www.rudderstack.com',
                industry: 'Waste and recycling',
                postcode: '60486',
                whiteLabel: 'rudderlabs',
                maxNbJobBoards: 2,
                organisationId: 306,
                pricingPackage: 'packageExpert',
                dateProTrialEnd: '2022-08-31T00:00:00+00:00',
                isProTrialActive: true,
                datetimeRegistration: '2020-07-01T10:23:41+00:00',
                isPersonnelServiceProvider: false,
              },
              userId: 'abc@xyz.com',
              channel: 'server',
              context: {
                library: {
                  name: 'rudder-analytics-php',
                  version: '2.0.1',
                  consumer: 'LibCurl',
                },
              },
              groupId: 306,
              rudderId: 'f5b46a12-2dab-4e24-a127-7316eed414fc',
              messageId: '7032394c-e813-4737-bf52-622dbcefe849',
              receivedAt: '2023-03-28T09:36:48.296Z',
              request_ip: '18.195.235.225',
              originalTimestamp: '2023-03-28T09:36:49.882Z',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'ef32c3f60fb98f39ef35',
                datacenter: 'US',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'c0efdbd20b9fbe24a7e2',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://track.customer.io/api/v2/batch',
              headers: {
                Authorization: 'Basic YzBlZmRiZDIwYjlmYmUyNGE3ZTI6ZWYzMmMzZjYwZmI5OGYzOWVmMzU=',
              },
              params: {},
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'object',
                  action: 'identify',
                  attributes: {
                    city: 'Frankfurt',
                    name: 'rudder test',
                    state: 'Hessen',
                    isFake: true,
                    address: 'Solmsstraße 83',
                    country: 'DE',
                    website: 'http://www.rudderstack.com',
                    industry: 'Waste and recycling',
                    postcode: '60486',
                    whiteLabel: 'rudderlabs',
                    maxNbJobBoards: 2,
                    organisationId: 306,
                    pricingPackage: 'packageExpert',
                    dateProTrialEnd: '2022-08-31T00:00:00+00:00',
                    isProTrialActive: true,
                    datetimeRegistration: '2020-07-01T10:23:41+00:00',
                    isPersonnelServiceProvider: false,
                  },
                  identifiers: {
                    object_id: '306',
                    object_type_id: '1',
                  },
                  cio_relationships: [
                    {
                      identifiers: {
                        email: 'abc@xyz.com',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
              },
              files: {},
              userId: 'abc@xyz.com',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 62',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'successful group call with eu as data center',
            message: {
              type: 'group',
              header: {
                'content-type': 'application/json; charset=utf-8',
              },
              sentAt: '2023-03-28T09:36:49.882Z',
              traits: {
                city: 'Frankfurt',
                name: 'rudder test',
                state: 'Hessen',
                isFake: true,
                address: 'Solmsstraße 83',
                country: 'DE',
                website: 'http://www.rudderstack.com',
                industry: 'Waste and recycling',
                postcode: '60486',
                whiteLabel: 'rudderlabs',
                maxNbJobBoards: 2,
                organisationId: 306,
                pricingPackage: 'packageExpert',
                dateProTrialEnd: '2022-08-31T00:00:00+00:00',
                isProTrialActive: true,
                datetimeRegistration: '2020-07-01T10:23:41+00:00',
                isPersonnelServiceProvider: false,
              },
              userId: 432,
              channel: 'server',
              context: {
                library: {
                  name: 'rudder-analytics-php',
                  version: '2.0.1',
                  consumer: 'LibCurl',
                },
              },
              groupId: 306,
              rudderId: 'f5b46a12-2dab-4e24-a127-7316eed414fc',
              messageId: '7032394c-e813-4737-bf52-622dbcefe849',
              receivedAt: '2023-03-28T09:36:48.296Z',
              request_ip: '18.195.235.225',
              originalTimestamp: '2023-03-28T09:36:49.882Z',
            },
            destination: {
              ID: '23Mi76khsFhY7bh9ZyRcvR3pHDt',
              Name: 'Customer IO Dev',
              DestinationDefinition: {
                ID: '23MgSlHXsPLsiH7SbW7IzCP32fn',
                Name: 'CUSTOMERIO',
                DisplayName: 'Customer IO',
                Config: {
                  destConfig: {
                    defaultConfig: ['apiKey', 'siteID', 'datacenterEU', 'deviceTokenEventName'],
                    web: ['useNativeSDK', 'blackListedEvents', 'whiteListedEvents'],
                  },
                  excludeKeys: [],
                  includeKeys: [
                    'apiKey',
                    'siteID',
                    'datacenterEU',
                    'blackListedEvents',
                    'whiteListedEvents',
                  ],
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
                ResponseRules: {},
              },
              Config: {
                apiKey: 'ef32c3f60fb98f39ef35',
                datacenter: 'EU',
                deviceTokenEventName: 'device_token_registered',
                siteID: 'c0efdbd20b9fbe24a7e2',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://track-eu.customer.io/api/v2/batch',
              headers: {
                Authorization: 'Basic YzBlZmRiZDIwYjlmYmUyNGE3ZTI6ZWYzMmMzZjYwZmI5OGYzOWVmMzU=',
              },
              params: {},
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'object',
                  action: 'identify',
                  attributes: {
                    city: 'Frankfurt',
                    name: 'rudder test',
                    state: 'Hessen',
                    isFake: true,
                    address: 'Solmsstraße 83',
                    country: 'DE',
                    website: 'http://www.rudderstack.com',
                    industry: 'Waste and recycling',
                    postcode: '60486',
                    whiteLabel: 'rudderlabs',
                    maxNbJobBoards: 2,
                    organisationId: 306,
                    pricingPackage: 'packageExpert',
                    dateProTrialEnd: '2022-08-31T00:00:00+00:00',
                    isProTrialActive: true,
                    datetimeRegistration: '2020-07-01T10:23:41+00:00',
                    isPersonnelServiceProvider: false,
                  },
                  identifiers: {
                    object_id: '306',
                    object_type_id: '1',
                  },
                  cio_relationships: [
                    {
                      identifiers: {
                        id: '432',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
              },
              files: {},
              userId: '432',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 63',
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '12345',
              properties: {
                path: '/test',
                referrer: 'Rudder',
                search: 'abc',
                title: 'Test Page',
                url: 'www.rudderlabs.com',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'page',
                  data: {
                    url: 'www.rudderlabs.com',
                    path: '/test',
                    search: 'abc',
                    referrer: 'Rudder',
                    title: 'Test Page',
                  },
                  timestamp: 1571051718,
                  name: 'www.rudderlabs.com',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 64',
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '12345',
              properties: {
                path: '/test',
                referrer: 'Rudder',
                search: 'abc',
                title: 'Test Page',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'page',
                  data: {
                    path: '/test',
                    search: 'abc',
                    referrer: 'Rudder',
                    title: 'Test Page',
                  },
                  timestamp: 1571051718,
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'Test 65',
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
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
                JSON: {
                  type: 'page',
                  timestamp: 1571051718,
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://track.customer.io/api/v1/customers/12345/events',
              userId: '12345',
              headers: {
                Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
