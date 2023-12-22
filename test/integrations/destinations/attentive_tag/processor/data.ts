export const mockFns = (_) => {
  jest.useFakeTimers().setSystemTime(new Date('2023-10-14'));
};

export const data = [
  {
    name: 'attentive_tag',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                traits: {
                  email: 'a@gmail.com',
                  phone: '+16405273911',
                  customIdentifiers: [
                    {
                      name: 'string',
                      value: 'string',
                    },
                  ],
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2023-10-14T09:03:17.562Z',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                signUpSourceId: '241654',
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
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions',
              headers: {
                Authorization: 'Bearer dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+16405273911',
                    email: 'a@gmail.com',
                  },
                  signUpSourceId: '241654',
                  externalIdentifiers: {
                    customIdentifiers: [
                      {
                        name: 'string',
                        value: 'string',
                      },
                    ],
                  },
                },
                JSON_ARRAY: {},
                XML: {},
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
    name: 'attentive_tag',
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
                  email: 'test@rudderstack.com',
                  phone: '+16465053911',
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '224',
                  },
                  {
                    type: 'klaviyoId',
                    id: '132',
                  },
                ],
              },
              type: 'track',
              properties: {
                price: '12',
                currency: 'USD',
                'product,id': 'r494',
                quantity: '34',
                variant: 'f',
              },
              event: 'Order Shipped',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2023-10-14T09:03:17.562Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: {
              destType: 'ATTENTIVE_TAG',
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
    name: 'attentive_tag',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                traits: {
                  company: {
                    id: 'abc123',
                  },
                  createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  phone: '+16465453911',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                  identifyOperation: 'unsubscribe',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2020-10-16T13:56:14.945+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                signUpSourceId: '241654',
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
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions/unsubscribe',
              headers: {
                Authorization: 'Bearer dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+16465453911',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
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
    name: 'attentive_tag',
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
                  email: 'test@rudderstack.com',
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '143',
                  },
                  {
                    type: 'klaviyoId',
                    id: '142',
                  },
                ],
              },
              type: 'track',
              properties: {
                price: '12',
                currency: 'USD',
                product_id: 'r494',
                quantity: '34',
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    name: 'MOBILE',
                    variant: 'green',
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
              event: 'Order Completed',
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
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: {
              destType: 'ATTENTIVE_TAG',
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
    name: 'attentive_tag',
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
                  email: 'test@rudderstack.com',
                  phone: '+16465053911',
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: 1,
                  },
                  {
                    type: 'shopifyId',
                    id: 1,
                  },
                  {
                    type: 'klaviyoId',
                    id: 1,
                  },
                ],
              },
              type: 'track',
              properties: {
                price: '12',
                currency: 'USD',
                product_id: 'r494',
                quantity: '34',
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    name: 'MOBILE',
                    variant: 'green',
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
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
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
            error: '[Attentive Tag] :: Event name is not present',
            statTags: {
              destType: 'ATTENTIVE_TAG',
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
    name: 'attentive_tag',
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
                  phone: '+16465053911',
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '143',
                  },
                  {
                    type: 'klaviyoId',
                    id: '142',
                  },
                ],
              },
              type: 'track',
              properties: {
                price: '12',
                currency: 'USD',
                product_id: 'r494',
                quantity: '34',
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    name: 'MOBILE',
                    variant: 'green',
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
              event: 'Product List Viewed',
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
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: {
              destType: 'ATTENTIVE_TAG',
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
    name: 'attentive_tag',
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
                  phone: '+16465053911',
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '143',
                  },
                  {
                    type: 'klaviyoId',
                    id: '142',
                  },
                ],
              },
              type: 'track',
              properties: {
                price: '12',
                currency: 'USD',
                product_id: 'r494',
                quantity: '34',
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    name: 'MOBILE',
                    variant: 'green',
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
              event: 'Product Viewed',
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
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: {
              destType: 'ATTENTIVE_TAG',
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
    name: 'attentive_tag',
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
                  phone: '+16465053911',
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '224',
                  },
                  {
                    type: 'klaviyoId',
                    id: '132',
                  },
                ],
              },
              type: 'track',
              properties: {
                price: '12',
                currency: 'USD',
                product_id: 'r494',
                quantity: '34',
              },
              event: 'Order Shipped',
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
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: {
              destType: 'ATTENTIVE_TAG',
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
    name: 'attentive_tag',
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
                  email: 'test@rudderstack.com',
                  phone: '+16465053911',
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: 1,
                  },
                  {
                    type: 'shopifyId',
                    id: 1,
                  },
                  {
                    type: 'klaviyoId',
                    id: 1,
                  },
                ],
              },
              properties: {
                price: '12',
                currency: 'USD',
                product_id: 'r494',
                quantity: '34',
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    name: 'MOBILE',
                    variant: 'green',
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
              event: 'Order Completed',
              originalTimestamp: '2023-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2023-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
              destType: 'ATTENTIVE_TAG',
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
    name: 'attentive_tag',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                traits: {
                  company: {
                    id: 'abc123',
                  },
                  createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  email: 'test0@gmail.com',
                  phone: '+16465453911',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                  identifyOperation: 'subscribe',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2023-10-14T13:56:14.945+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                signUpSourceId: '241654',
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
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions',
              headers: {
                Authorization: 'Bearer dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+16465453911',
                    email: 'test0@gmail.com',
                  },
                  signUpSourceId: '241654',
                },
                JSON_ARRAY: {},
                XML: {},
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
    name: 'attentive_tag',
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
                traits: {},
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '143',
                  },
                  {
                    type: 'klaviyoId',
                    id: '142',
                  },
                ],
              },
              type: 'track',
              properties: {
                price: '12',
                currency: 'USD',
                product_id: 'r494',
                quantity: '34',
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    name: 'MOBILE',
                    variant: 'green',
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
              event: 'Product Viewed',
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
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: {
              destType: 'ATTENTIVE_TAG',
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
    name: 'attentive_tag',
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
                  email: 'test@rudderstack.com',
                  phone: '+16465053911',
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '143',
                  },
                  {
                    type: 'klaviyoId',
                    id: '142',
                  },
                ],
              },
              type: 'track',
              properties: {
                price: '12',
                currency: 'USD',
                quantity: '34',
                products: [
                  {
                    name: 'MOBILE',
                    variant: 'green',
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
              event: 'Product Viewed',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
            error: 'Missing required value from "product_id"',
            statTags: {
              destType: 'ATTENTIVE_TAG',
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
    name: 'attentive_tag',
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
                  email: 'test@rudderstack.com',
                  phone: '+16465053911',
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '143',
                  },
                  {
                    type: 'klaviyoId',
                    id: '142',
                  },
                ],
              },
              type: 'track',
              properties: {
                price: '12',
                currency: 'USD',
                product_id: 'r494',
                quantity: '34',
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    name: 'MOBILE',
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
              event: 'Product Viewed',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
            statusCode: 400,
            error: 'Missing required value from "variant"',
            statTags: {
              destType: 'ATTENTIVE_TAG',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
          },
        ],
      },
    },
  },
  {
    name: 'attentive_tag',
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
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '+16465053911',
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
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '143',
                  },
                  {
                    type: 'klaviyoId',
                    id: '142',
                  },
                ],
              },
              type: 'track',
              properties: {
                price: '12',
                'curre,ncy': 'USD',
                product_id: 'r494',
                quantity: '34',
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    name: 'MOBILE',
                    variant: 'green',
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
              event: 'Order Shipped',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
            statusCode: 400,
            error: '[Attentive Tag]:The event name contains characters which is not allowed',
            statTags: {
              destType: 'ATTENTIVE_TAG',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
          },
        ],
      },
    },
  },
  {
    name: 'attentive_tag',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                traits: {
                  company: {
                    id: 'abc123',
                  },
                  createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  email: 'test0@gmail.com',
                  phone: '+16465453911',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2020-10-16T13:56:14.945+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                signUpSourceId: '241654',
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
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions',
              headers: {
                Authorization: 'Bearer dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+16465453911',
                    email: 'test0@gmail.com',
                  },
                  signUpSourceId: '241654',
                },
                JSON_ARRAY: {},
                XML: {},
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
    name: 'attentive_tag',
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
                traits: {},
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
              type: 'track',
              properties: {
                price: '12',
                currency: 'USD',
                product_id: 'r494',
                quantity: '34',
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    name: 'MOBILE',
                    variant: 'green',
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
              event: 'Product Viewed',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                signUpSourceId: '240654',
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
              endpoint: 'https://api.attentivemobile.com/v1/events/ecommerce/product-view',
              headers: {
                Authorization: 'Bearer dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user: {},
                  items: [
                    {
                      productId: '507f1f77bcf86cd799439011',
                      name: 'MOBILE',
                      productVariantId: 'green',
                      quantity: '2',
                      price: [
                        {
                          value: 19,
                          currency: 'USD',
                        },
                      ],
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
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
];
