import { ProcessorTestData } from '../../../testTypes';
import { destination, metadata, mockFns, headers, statTags } from '../commonConfig';

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'attentive-tag-track-processor-test-0',
    name: 'attentive_tag',
    description: 'Track event with old timestamp (beyond 12 hours)',
    scenario: 'Order Shipped event with timestamp older than 12 hours',
    successCriteria: 'Should reject event with appropriate error message for old timestamp',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
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
              event: 'Order Shipped',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2023-10-14T09:03:17.562Z',
            },
            metadata,
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-1',
    name: 'attentive_tag',
    description: 'Order Completed event with old timestamp',
    scenario: 'Order Completed event with timestamp older than 12 hours',
    successCriteria: 'Should reject event with appropriate error message for old timestamp',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
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
            metadata,
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-2',
    name: 'attentive_tag',
    description: 'Product List Viewed event with old timestamp',
    scenario: 'Product List Viewed event with timestamp older than 12 hours',
    successCriteria: 'Should reject event with appropriate error message for old timestamp',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
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
            metadata,
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-3',
    name: 'attentive_tag',
    description: 'Product Viewed event with old timestamp',
    scenario: 'Product Viewed event with timestamp older than 12 hours',
    successCriteria: 'Should reject event with appropriate error message for old timestamp',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
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
            metadata,
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-4',
    name: 'attentive_tag',
    description: 'Order Shipped event with old timestamp',
    scenario: 'Order Shipped event with timestamp older than 12 hours',
    successCriteria: 'Should reject event with appropriate error message for old timestamp',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
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
            metadata,
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-5',
    name: 'attentive_tag',
    description: 'Product Viewed event with old timestamp (no traits)',
    scenario: 'Product Viewed event with timestamp older than 12 hours and no user traits',
    successCriteria: 'Should reject event with appropriate error message for old timestamp',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
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
              event: 'Application Backgrounded',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
            },
            metadata,
            destination,
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
              endpoint: 'https://api.attentivemobile.com/v1/events/custom',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {},
                  type: 'Application Backgrounded',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-6',
    name: 'attentive_tag',
    description: 'Product Viewed event with valid data and no traits',
    scenario: 'Product Viewed event with valid product data and no user traits',
    successCriteria: 'Should successfully send product view event to ecommerce endpoint',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
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
            metadata,
            destination,
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
              headers: headers,
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
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-7',
    name: 'attentive_tag',
    description: 'Custom event (Application Backgrounded)',
    scenario: 'Custom track event without product data',
    successCriteria: 'Should successfully send custom event to custom events endpoint',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
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
              event: 'Application Backgrounded',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
            },
            metadata,
            destination,
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
              endpoint: 'https://api.attentivemobile.com/v1/events/custom',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {},
                  type: 'Application Backgrounded',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-8',
    name: 'attentive_tag',
    description: 'Subscription event track call',
    scenario: 'Track event for subscription management (subscribe/unsubscribe)',
    successCriteria:
      'Should successfully send subscription subscribe/unsubscribe event to subscribe endpoint and unsubscribe endpoint',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'test@gmail.com',
                  phone: '+10000000000',
                },
                externalId: [
                  {
                    type: 'clientUserId',
                    id: 'sub123',
                  },
                ],
              },
              type: 'track',
              properties: {
                signUpSourceId: '241654',
                channelConsents: [
                  {
                    // Optional type indicating the desired subscriptions to remove - for unsubscribe only
                    type: 'MARKETING', // "MARKETING" or "TRANSACTIONAL" or "CHECKOUT_ABANDONED"
                    channel: 'sms',
                    consented: false,
                  },
                  {
                    channel: 'email',
                    consented: true,
                  },
                ],
                // Optional notification properties to override - for unsubscribe only
                notification: {
                  language: 'en-US', // "fr-CA",
                  disabled: true,
                },
              },
              event: 'subscription_event',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
            },
            metadata,
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                enableNewIdentifyFlow: true,
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
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    email: 'test@gmail.com',
                  },
                  signUpSourceId: '241654',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              userId: '',
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions/unsubscribe',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+10000000000',
                  },
                  subscriptions: [
                    {
                      type: 'MARKETING',
                      channel: 'TEXT',
                    },
                  ],
                  notification: {
                    language: 'en-US', // "fr-CA",
                    disabled: true,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-9',
    name: 'attentive_tag',
    description: 'Subscription event track call - subscribe to both email and SMS',
    scenario: 'Track event for subscribing to both email and SMS channels',
    successCriteria: 'Should successfully send subscription event to subscribe both email and SMS',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'subscription.test@gmail.com',
                  phone: '+10000000000',
                },
                externalId: [
                  {
                    type: 'clientUserId',
                    id: 'dual123',
                  },
                ],
              },
              type: 'track',
              properties: {
                signUpSourceId: '241654',
                channelConsents: [
                  {
                    channel: 'email',
                    consented: true,
                  },
                  {
                    channel: 'sms',
                    consented: true,
                  },
                ],
              },
              event: 'subscription_event',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
            },
            metadata,
            destination,
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
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+10000000000',
                    email: 'subscription.test@gmail.com',
                  },
                  signUpSourceId: '241654',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-10',
    name: 'attentive_tag',
    description: 'Subscription event track call - unsubscribe from both email and SMS',
    scenario: 'Track event for unsubscribing from both email and SMS channels',
    successCriteria:
      'Should successfully send subscription event to unsubscribe both email and SMS',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'test@gmail.com',
                  phone: '+10000000000',
                },
                externalId: [
                  {
                    type: 'clientUserId',
                    id: 'sub123',
                  },
                ],
              },
              type: 'track',
              properties: {
                signUpSourceId: '241654',
                channelConsents: [
                  {
                    // Optional type indicating the desired subscriptions to remove - for unsubscribe only
                    type: 'MARKETING', // "MARKETING" or "TRANSACTIONAL" or "CHECKOUT_ABANDONED"
                    channel: 'sms',
                    consented: false,
                  },
                  {
                    type: 'TRANSACTIONAL',
                    channel: 'email',
                    consented: false,
                  },
                ],
                // Optional notification properties to override - for unsubscribe only
                notification: {
                  language: 'en-US', // "fr-CA",
                  disabled: true,
                },
              },
              event: 'subscription_event',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
            },
            metadata,
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                enableNewIdentifyFlow: true,
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
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions/unsubscribe',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    email: 'test@gmail.com',
                    phone: '+10000000000',
                  },
                  subscriptions: [
                    {
                      type: 'MARKETING',
                      channel: 'TEXT',
                    },
                    {
                      type: 'TRANSACTIONAL',
                      channel: 'EMAIL',
                    },
                  ],
                  notification: {
                    language: 'en-US', // "fr-CA",
                    disabled: true,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-11',
    name: 'attentive_tag',
    description:
      'Subscription event track call - unsubscribe from email and SMS from all type and channel',
    scenario: 'Track event for unsubscribing from email and SMS channels',
    successCriteria:
      'Should successfully send subscription event to unsubscribe email and SMS from all type and channel',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'test@gmail.com',
                  phone: '+10000000000',
                },
                externalId: [
                  {
                    type: 'clientUserId',
                    id: 'sub123',
                  },
                ],
              },
              type: 'track',
              properties: {
                signUpSourceId: '241654',
                channelConsents: [
                  {
                    channel: 'sms',
                    consented: false,
                  },
                  {
                    channel: 'email',
                    consented: false,
                  },
                ],
              },
              event: 'subscription_event',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
            },
            metadata,
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                enableNewIdentifyFlow: true,
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
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions/unsubscribe',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    email: 'test@gmail.com',
                    phone: '+10000000000',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-track-processor-test-12',
    name: 'attentive_tag',
    description:
      'Subscription event track call - unsubscribe from email if phone is unavailable even channelConsents is present for sms',
    scenario: 'Track event for unsubscribing from email channel if phone is unavailable',
    successCriteria:
      'Should successfully send subscription event to unsubscribe email if phone is unavailable',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'test@gmail.com',
                },
                externalId: [
                  {
                    type: 'clientUserId',
                    id: 'sub123',
                  },
                ],
              },
              type: 'track',
              properties: {
                signUpSourceId: '241654',
                channelConsents: [
                  {
                    channel: 'sms',
                    consented: true,
                  },
                  {
                    channel: 'email',
                    consented: false,
                  },
                ],
              },
              event: 'subscription_event',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
            },
            metadata,
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                enableNewIdentifyFlow: true,
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
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions/unsubscribe',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    email: 'test@gmail.com',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
];
