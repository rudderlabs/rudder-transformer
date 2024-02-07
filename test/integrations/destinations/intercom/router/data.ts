export const data = [
  {
    name: 'intercom',
    description: 'Intercom router tests',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                userId: 'user@1',
                channel: 'web',
                context: {
                  traits: {
                    age: 23,
                    email: 'test@rudderlabs.com',
                    phone: '+91 9999999999',
                    firstName: 'Test',
                    lastName: 'Rudderlabs',
                    address: 'california usa',
                    ownerId: '13',
                  },
                },
                type: 'identify',
                integrations: { All: true },
                originalTimestamp: '2023-11-10T14:42:44.724Z',
                timestamp: '2023-11-22T10:12:44.757+05:30',
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  apiKey: 'testApiKey',
                  apiServer: 'standard',
                  apiVersion: 'v2',
                  sendAnonymousId: false,
                  updateLastRequestAt: true,
                },
              },
              metadata: { jobId: 1 },
            },
            {
              message: {
                userId: 'user@3',
                channel: 'web',
                context: {
                  traits: {
                    age: 32,
                    email: 'test+3@rudderlabs.com',
                    phone: '+91 9399999999',
                    firstName: 'Test',
                    lastName: 'RudderStack',
                    ownerId: '15',
                  },
                },
                properties: {
                  revenue: {
                    amount: 1232,
                    currency: 'inr',
                    test: 123,
                  },
                  price: {
                    amount: 3000,
                    currency: 'USD',
                  },
                },
                event: 'Product Viewed',
                type: 'track',
                originalTimestamp: '2023-11-10T14:42:44.724Z',
                timestamp: '2023-11-22T10:12:44.757+05:30',
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  apiKey: 'testApiKey',
                  apiServer: 'standard',
                  apiVersion: 'v2',
                  sendAnonymousId: false,
                  updateLastRequestAt: false,
                },
              },
              metadata: {
                jobId: 2,
              },
            },
            {
              message: {
                userId: 'user@5',
                groupId: 'rudderlabs',
                channel: 'web',
                context: {
                  traits: {
                    email: 'test+5@rudderlabs.com',
                    phone: '+91 9599999999',
                    firstName: 'John',
                    lastName: 'Snow',
                    ownerId: '17',
                  },
                },
                traits: {
                  name: 'RudderStack',
                  size: 500,
                  website: 'www.rudderstack.com',
                  industry: 'CDP',
                  plan: 'enterprise',
                },
                type: 'group',
                originalTimestamp: '2023-11-10T14:42:44.724Z',
                timestamp: '2023-11-22T10:12:44.757+05:30',
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  apiKey: 'testApiKey',
                  apiVersion: 'v2',
                  apiServer: 'eu',
                  sendAnonymousId: false,
                },
              },
              metadata: {
                jobId: 3,
              },
            },
            {
              message: {
                userId: 'user@6',
                groupId: 'rudderlabs',
                channel: 'web',
                context: {
                  traits: {
                    email: 'test+5@rudderlabs.com',
                    phone: '+91 9599999999',
                    firstName: 'John',
                    lastName: 'Snow',
                    ownerId: '17',
                  },
                },
                traits: {
                  name: 'RudderStack',
                  size: 500,
                  website: 'www.rudderstack.com',
                  industry: 'CDP',
                  plan: 'enterprise',
                  isOpenSource: true,
                },
                type: 'group',
                originalTimestamp: '2023-11-10T14:42:44.724Z',
                timestamp: '2023-11-22T10:12:44.757+05:30',
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  apiKey: 'testApiKey',
                  apiVersion: 'v2',
                  apiServer: 'eu',
                  sendAnonymousId: false,
                },
              },
              metadata: {
                jobId: 4,
              },
            },
          ],
          destType: 'intercom',
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
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    email: 'test@rudderlabs.com',
                    external_id: 'user@1',
                    name: 'Test Rudderlabs',
                    owner_id: 13,
                    phone: '+91 9999999999',
                    custom_attributes: {
                      address: 'california usa',
                      age: 23,
                    },
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint: 'https://api.intercom.io/contacts',
                files: {},
                headers: {
                  Authorization: 'Bearer testApiKey',
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'Intercom-Version': '2.10',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'testApiKey',
                  apiServer: 'standard',
                  apiVersion: 'v2',
                  sendAnonymousId: false,
                  updateLastRequestAt: true,
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [{ jobId: 1 }],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    created_at: 1700628164,
                    email: 'test+3@rudderlabs.com',
                    event_name: 'Product Viewed',
                    metadata: {
                      price: {
                        amount: 3000,
                        currency: 'USD',
                      },
                      revenue: {
                        amount: 1232,
                        currency: 'inr',
                        test: 123,
                      },
                    },
                    user_id: 'user@3',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.intercom.io/events',
                files: {},
                headers: {
                  Authorization: 'Bearer testApiKey',
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'Intercom-Version': '2.10',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'testApiKey',
                  apiServer: 'standard',
                  apiVersion: 'v2',
                  sendAnonymousId: false,
                  updateLastRequestAt: false,
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [{ jobId: 2 }],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  JSON: {
                    id: '657264e9018c0a647s45',
                  },
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                },
                endpoint: 'https://api.eu.intercom.io/contacts/70701240741e45d040/companies',
                files: {},
                headers: {
                  Authorization: 'Bearer testApiKey',
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'Intercom-Version': '2.10',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'testApiKey',
                  apiServer: 'eu',
                  apiVersion: 'v2',
                  sendAnonymousId: false,
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              error:
                '{"message":"Unable to Create or Update Company due to : [{\\"code\\":\\"parameter_invalid\\",\\"message\\":\\"Custom attribute \'isOpenSource\' does not exist\\"}]","destinationResponse":{"response":{"type":"error.list","request_id":"request_1","errors":[{"code":"parameter_invalid","message":"Custom attribute \'isOpenSource\' does not exist"}]},"status":401}}',
              statTags: {
                destType: 'INTERCOM',
                errorCategory: 'network',
                errorType: 'aborted',
                feature: 'router',
                implementation: 'cdkV2',
                module: 'destination',
              },
              destination: {
                Config: {
                  apiKey: 'testApiKey',
                  apiServer: 'eu',
                  apiVersion: 'v2',
                  sendAnonymousId: false,
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [
                {
                  jobId: 4,
                },
              ],
              statusCode: 401,
            },
          ],
        },
      },
    },
  },
  {
    name: 'intercom',
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
                anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                channel: 'mobile',
                context: {
                  app: {
                    build: '1.0',
                    name: 'Test_Example',
                    namespace: 'com.example.testapp',
                    version: '1.0',
                  },
                  device: {
                    id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    manufacturer: 'Apple',
                    model: 'iPhone',
                    name: 'iPod touch (7th generation)',
                    type: 'iOS',
                  },
                  library: {
                    name: 'test-ios-library',
                    version: '1.0.7',
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
                    version: '14.0',
                  },
                  screen: {
                    density: 2,
                    height: 320,
                    width: 568,
                  },
                  timezone: 'Asia/Kolkata',
                  traits: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    name: 'Test Name',
                    firstName: 'Test',
                    lastName: 'Name',
                    createdAt: '2020-09-30T19:11:00.337Z',
                    userId: 'test_user_id_1',
                    email: 'test_1@test.com',
                    phone: '9876543210',
                    key1: 'value1',
                  },
                  userAgent: 'unknown',
                },
                event: 'Test Event 2',
                integrations: {
                  All: true,
                },
                messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
                originalTimestamp: '2020-09-30T19:11:00.337Z',
                receivedAt: '2020-10-01T00:41:11.369+05:30',
                request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
                sentAt: '2020-09-30T19:11:10.382Z',
                timestamp: '2020-10-01T00:41:01.324+05:30',
                type: 'identify',
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  apiKey: 'testApiKey',
                  apiVersion: 'v1',
                  sendAnonymousId: false,
                  updateLastRequestAt: false,
                  collectContext: false,
                },
              },
            },
            {
              message: {
                anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                channel: 'mobile',
                context: {
                  app: {
                    build: '1.0',
                    name: 'Test_Example',
                    namespace: 'com.example.testapp',
                    version: '1.0',
                  },
                  device: {
                    id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    manufacturer: 'Apple',
                    model: 'iPhone',
                    name: 'iPod touch (7th generation)',
                    type: 'iOS',
                  },
                  library: {
                    name: 'test-ios-library',
                    version: '1.0.7',
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
                    version: '14.0',
                  },
                  screen: {
                    density: 2,
                    height: 320,
                    width: 568,
                  },
                  timezone: 'Asia/Kolkata',
                  traits: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    firstName: 'Test',
                    lastName: 'Name',
                    createdAt: '2020-09-30T19:11:00.337Z',
                    email: 'test_1@test.com',
                    phone: '9876543210',
                    key1: 'value1',
                  },
                  userAgent: 'unknown',
                },
                event: 'Test Event 2',
                integrations: {
                  All: true,
                },
                messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
                originalTimestamp: '2020-09-30T19:11:00.337Z',
                receivedAt: '2020-10-01T00:41:11.369+05:30',
                request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
                sentAt: '2020-09-30T19:11:10.382Z',
                timestamp: '2020-10-01T00:41:01.324+05:30',
                type: 'identify',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  apiKey: 'testApiKey',
                  apiVersion: 'v1',
                  sendAnonymousId: false,
                  updateLastRequestAt: false,
                  collectContext: false,
                },
              },
            },
            {
              message: {
                userId: 'user@5',
                groupId: 'rudderlabs',
                channel: 'web',
                context: {
                  traits: {
                    email: 'test+5@rudderlabs.com',
                    phone: '+91 9599999999',
                    firstName: 'John',
                    lastName: 'Snow',
                    ownerId: '17',
                  },
                },
                traits: {
                  name: 'RudderStack',
                  size: 500,
                  website: 'www.rudderstack.com',
                  industry: 'CDP',
                  plan: 'enterprise',
                },
                type: 'group',
                originalTimestamp: '2023-11-10T14:42:44.724Z',
                timestamp: '2023-11-22T10:12:44.757+05:30',
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  apiKey: 'testApiKey',
                  apiVersion: 'v1',
                  sendAnonymousId: false,
                  collectContext: false,
                },
              },
              metadata: {
                jobId: 3,
              },
            },
          ],
          destType: 'intercom',
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
                endpoint: 'https://api.intercom.io/users',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer testApiKey',
                  Accept: 'application/json',
                  'Intercom-Version': '1.4',
                },
                params: {},
                body: {
                  JSON: {
                    email: 'test_1@test.com',
                    phone: '9876543210',
                    name: 'Test Name',
                    signed_up_at: 1601493060,
                    last_seen_user_agent: 'unknown',
                    update_last_request_at: false,
                    user_id: 'test_user_id_1',
                    custom_attributes: {
                      anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                      key1: 'value1',
                    },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
                userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
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
                  apiKey: 'testApiKey',
                  apiVersion: 'v1',
                  collectContext: false,
                  sendAnonymousId: false,
                  updateLastRequestAt: false,
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.intercom.io/users',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer testApiKey',
                  Accept: 'application/json',
                  'Intercom-Version': '1.4',
                },
                params: {},
                body: {
                  JSON: {
                    email: 'test_1@test.com',
                    phone: '9876543210',
                    signed_up_at: 1601493060,
                    name: 'Test Name',
                    last_seen_user_agent: 'unknown',
                    update_last_request_at: false,
                    custom_attributes: {
                      anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                      key1: 'value1',
                    },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
                userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  apiKey: 'testApiKey',
                  apiVersion: 'v1',
                  collectContext: false,
                  sendAnonymousId: false,
                  updateLastRequestAt: false,
                },
              },
            },
            {
              batched: false,
              batchedRequest: [
                {
                  body: {
                    FORM: {},
                    JSON: {
                      company_id: 'rudderlabs',
                      industry: 'CDP',
                      name: 'RudderStack',
                      plan: 'enterprise',
                      size: 500,
                      website: 'www.rudderstack.com',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                  },
                  endpoint: 'https://api.intercom.io/companies',
                  files: {},
                  headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer testApiKey',
                    'Content-Type': 'application/json',
                    'Intercom-Version': '1.4',
                  },
                  method: 'POST',
                  params: {},
                  type: 'REST',
                  version: '1',
                },
                {
                  body: {
                    FORM: {},
                    JSON: {
                      companies: [
                        {
                          company_id: 'rudderlabs',
                          name: 'RudderStack',
                        },
                      ],
                      email: 'test+5@rudderlabs.com',
                      user_id: 'user@5',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                  },
                  endpoint: 'https://api.intercom.io/users',
                  files: {},
                  headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer testApiKey',
                    'Content-Type': 'application/json',
                    'Intercom-Version': '1.4',
                  },
                  method: 'POST',
                  params: {},
                  type: 'REST',
                  version: '1',
                },
              ],
              destination: {
                Config: {
                  apiKey: 'testApiKey',
                  apiVersion: 'v1',
                  collectContext: false,
                  sendAnonymousId: false,
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
