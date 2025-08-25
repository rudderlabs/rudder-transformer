import { ProcessorTestData } from '../../../testTypes';
import { destination, metadata, mockFns, headers, statTags } from '../commonConfig';

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'attentive-tag-validation-processor-test-0',
    name: 'attentive_tag',
    description: 'Track event missing event name',
    scenario: 'Track event without event name property',
    successCriteria: 'Should reject event with error message about missing event name',
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
    id: 'attentive-tag-validation-processor-test-1',
    name: 'attentive_tag',
    description: 'Track event missing message type',
    scenario: 'Track event without type property',
    successCriteria: 'Should reject event with error message about missing message type',
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
    id: 'attentive-tag-validation-processor-test-2',
    name: 'attentive_tag',
    description: 'Product Viewed event missing product_id',
    scenario: 'Product Viewed event without required product_id field',
    successCriteria: 'Should reject event with error message about missing product_id',
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
              event: 'Product Viewed',
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
            error: 'Missing required value from "product_id"',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-validation-processor-test-3',
    name: 'attentive_tag',
    description: 'Product Viewed event missing variant',
    scenario: 'Product Viewed event without required variant field in products array',
    successCriteria: 'Should reject event with error message about missing variant',
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
                    price: '19',
                    quantity: '2',
                    currency: 'USD',
                  },
                ],
              },
              event: 'Product Viewed',
              originalTimestamp: '2023-10-14T09:03:17.562Z',
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
            metadata,
            statusCode: 400,
            error: 'Missing required value from "variant"',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-validation-processor-test-4',
    name: 'attentive_tag',
    description: 'Order Shipped event with invalid property characters',
    scenario: 'Order Shipped event with properties containing invalid characters',
    successCriteria: 'Should reject event with error message about invalid property characters',
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
                'curre,ncy': 'USD',
                product_id: 'r494',
                quantity: '34',
              },
              event: 'Order Shipped',
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
            metadata,
            statusCode: 400,
            error: '[Attentive Tag]:The properties contains characters which is not allowed',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-validation-processor-test-5',
    name: 'attentive_tag',
    description: 'Identify event with enableNewIdentifyFlow enabled - no email/phone/externalId',
    scenario: "User identification with only traits using Attentive's User Attribute API",
    successCriteria: 'Should reject event with error message about missing email/phone/externalId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
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
                  firstName: 'Jane',
                  lastName: 'Smith',
                  city: 'Los Angeles',
                  country: 'USA',
                  age: 28,
                  gender: 'female',
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
              receivedAt: '2023-10-14T13:56:14.945+05:30',
              type: 'identify',
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
            metadata,
            statusCode: 400,
            error:
              '[Attentive Tag]: Identify payload is not valid, either user or properties is empty',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-validation-processor-test-6',
    name: 'attentive_tag',
    description:
      'Subscription event track call - subscribe to both email and SMS no signUpSourceId',
    scenario: 'Track event for subscribing to both email and SMS channels no signUpSourceId',
    successCriteria: 'Should reject event with error message about missing signUpSourceId',
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
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                signUpSourceId: null,
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
            metadata,
            statusCode: 400,
            error: '[Attentive Tag]: SignUp Source Id is required for subscribe event',
            statTags: { ...statTags, errorType: 'configuration' },
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-validation-processor-test-7',
    name: 'attentive_tag',
    description: 'Subscription event track call - with no valid channel consent',
    scenario: 'Track event for subscribing to no valid channel consent',
    successCriteria: 'Should reject event with error message about no valid channel consent',
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
                channelConsents: [
                  {
                    channel: 'other',
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
            metadata,
            statusCode: 400,
            error: '[Attentive Tag]: No valid consent found for subscription event',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-validation-processor-test-8',
    name: 'attentive_tag',
    description: 'Subscription event track call - with invalid channel consents',
    scenario: 'Track event for subscribing to invalid channel consents',
    successCriteria: 'Should reject event with error message about invalid channel consents',
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
                channelConsents: {
                  channel: 'email',
                  consented: true,
                },
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
            metadata,
            statusCode: 400,
            error: '[Attentive Tag]: Channel consents must be an array',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-validation-processor-test-9',
    name: 'attentive_tag',
    description: 'Subscription event track call - with valid channel consent but no email/phone',
    scenario: 'Track event for subscribing to valid channel consent but no email/phone',
    successCriteria:
      'Should reject event with error message about no valid email/phone found for subscription event',
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
              context: {},
              type: 'track',
              properties: {
                channelConsents: [
                  {
                    channel: 'email',
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
            metadata,
            statusCode: 400,
            error: '[Attentive Tag]: Either email or phone is required for subscription event',
            statTags: statTags,
          },
        ],
      },
    },
    mockFns,
  },
];
