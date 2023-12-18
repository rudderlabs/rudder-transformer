export const data = [
  {
    name: 'one_signal',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                  emailDeviceType: true,
                  smsDeviceType: true,
                  eventAsTags: false,
                  allowedProperties: [],
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                type: 'identify',
                sentAt: '2021-01-03T17:02:53.195Z',
                userId: 'user@27',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '1.12.3',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  traits: {
                    brand: 'John Players',
                    price: '15000',
                    firstName: 'Test',
                    email: 'test@rudderstack.com',
                    userId: 'user@27',
                  },
                  locale: 'en-US',
                  device: {
                    token: 'token',
                    id: 'id',
                    type: 'ios',
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
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
            },
            {
              destination: {
                Config: {
                  appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                  emailDeviceType: false,
                  smsDeviceType: false,
                  eventAsTags: false,
                  allowedProperties: [
                    {
                      propertyName: 'brand',
                    },
                    {
                      propertyName: 'price',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                event: 'add_to_Cart',
                type: 'track',
                sentAt: '2021-01-03T17:02:53.195Z',
                userId: 'user@27',
                channel: 'web',
                properties: {
                  brand: 'Zara',
                  price: '12000',
                },
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
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
            },
          ],
          destType: 'one_signal',
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://onesignal.com/api/v1/players',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  params: {},
                  body: {
                    JSON: {
                      device_os: '1.12.3',
                      laguage: 'en-US',
                      created_at: 1609693373,
                      last_active: 1609693373,
                      external_user_id: 'user@27',
                      app_id: 'random-818c-4a28-b98e-6cd8a994eb22',
                      device_type: 11,
                      identifier: 'test@rudderstack.com',
                      tags: {
                        brand: 'John Players',
                        price: '15000',
                        firstName: 'Test',
                        email: 'test@rudderstack.com',
                        userId: 'user@27',
                        anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://onesignal.com/api/v1/players',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  params: {},
                  body: {
                    JSON: {
                      device_os: '1.12.3',
                      laguage: 'en-US',
                      created_at: 1609693373,
                      last_active: 1609693373,
                      external_user_id: 'user@27',
                      app_id: 'random-818c-4a28-b98e-6cd8a994eb22',
                      device_type: 8,
                      identifier: '97c46c81-3140-456d-b2a9-690d70aaca35',
                      tags: {
                        brand: 'John Players',
                        price: '15000',
                        firstName: 'Test',
                        email: 'test@rudderstack.com',
                        userId: 'user@27',
                        anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                  emailDeviceType: true,
                  smsDeviceType: true,
                  eventAsTags: false,
                  allowedProperties: [],
                },
              },
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  FORM: {},
                  JSON: {
                    tags: {
                      brand: 'Zara',
                      price: '12000',
                      add_to_Cart: true,
                    },
                  },
                  JSON_ARRAY: {},
                },
                type: 'REST',
                files: {},
                method: 'PUT',
                params: {},
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint:
                  'https://onesignal.com/api/v1/apps/random-818c-4a28-b98e-6cd8a994eb22/users/user@27',
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
                  appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                  emailDeviceType: false,
                  smsDeviceType: false,
                  eventAsTags: false,
                  allowedProperties: [
                    {
                      propertyName: 'brand',
                    },
                    {
                      propertyName: 'price',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
];
