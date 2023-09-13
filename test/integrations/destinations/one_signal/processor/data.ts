export const data = [
  {
    name: 'one_signal',
    description:
      'Identify call for creating new device (phone and playerId is not available in the payload). Integrations object is also not available.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              context: {
                os: { name: '', version: '1.12.3' },
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
                device: { token: 'token', id: 'id', type: 'ios' },
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
              endpoint: 'https://onesignal.com/api/v1/players',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
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
              userId: '',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://onesignal.com/api/v1/players',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    description:
      'Identify call for creating new device (playerId is not available in the payload). Integrations object is also not available. Email and phone both are available in the payload.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              context: {
                os: { name: '', version: '1.12.3' },
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
                  phone: '+917836362334',
                  userId: 'user@27',
                },
                locale: 'en-US',
                device: { token: 'token', id: 'id', type: 'ios' },
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
              endpoint: 'https://onesignal.com/api/v1/players',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
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
                    phone: '+917836362334',
                    userId: 'user@27',
                    anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                  },
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
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://onesignal.com/api/v1/players',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  device_os: '1.12.3',
                  laguage: 'en-US',
                  created_at: 1609693373,
                  last_active: 1609693373,
                  external_user_id: 'user@27',
                  app_id: 'random-818c-4a28-b98e-6cd8a994eb22',
                  device_type: 14,
                  identifier: '+917836362334',
                  tags: {
                    brand: 'John Players',
                    price: '15000',
                    firstName: 'Test',
                    email: 'test@rudderstack.com',
                    phone: '+917836362334',
                    userId: 'user@27',
                    anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                  },
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
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://onesignal.com/api/v1/players',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
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
                    phone: '+917836362334',
                    userId: 'user@27',
                    anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                  },
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
    name: 'one_signal',
    description:
      'Identify call for creating a new device(deviceType and identifier is present in the integrations object, playerId not present)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: false,
                allowedProperties: [],
              },
            },
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              context: {
                os: { name: '', version: '1.12.3' },
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
                  phone: '+917836362334',
                  userId: 'user@27',
                },
                locale: 'en-US',
                device: { token: 'token', id: 'id', type: 'ios' },
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              integrations: { one_signal: { deviceType: '5', identifier: 'random_id' } },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              endpoint: 'https://onesignal.com/api/v1/players',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  device_os: '1.12.3',
                  laguage: 'en-US',
                  created_at: 1609693373,
                  last_active: 1609693373,
                  external_user_id: 'user@27',
                  app_id: 'random-818c-4a28-b98e-6cd8a994eb22',
                  device_type: 5,
                  identifier: 'random_id',
                  tags: {
                    brand: 'John Players',
                    price: '15000',
                    firstName: 'Test',
                    email: 'test@rudderstack.com',
                    phone: '+917836362334',
                    userId: 'user@27',
                    anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                  },
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
    name: 'one_signal',
    description:
      'Identify call for creating a new device(channel is mobile and integrations object is not present, playerId not present)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: false,
                allowedProperties: [],
              },
            },
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'mobile',
              context: {
                os: { name: '', version: '1.12.3' },
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
                  phone: '+917836362334',
                  userId: 'user@27',
                },
                locale: 'en-US',
                device: { token: 'token', id: 'id', type: 'android' },
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
              endpoint: 'https://onesignal.com/api/v1/players',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  device_os: '1.12.3',
                  laguage: 'en-US',
                  created_at: 1609693373,
                  last_active: 1609693373,
                  external_user_id: 'user@27',
                  app_id: 'random-818c-4a28-b98e-6cd8a994eb22',
                  device_type: 1,
                  identifier: 'token',
                  tags: {
                    brand: 'John Players',
                    price: '15000',
                    firstName: 'Test',
                    email: 'test@rudderstack.com',
                    phone: '+917836362334',
                    userId: 'user@27',
                    anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                  },
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
    name: 'one_signal',
    description: 'Identify call for Editing a device using playerId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: false,
                allowedProperties: [],
              },
            },
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'mobile',
              context: {
                externalId: [{ type: 'playerId', id: '85be324d-6dab-4293-ad1f-42199d4c455b' }],
                os: { name: '', version: '1.12.3' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  brand: 'Raymonds',
                  price: '14000',
                  firstName: 'Test',
                  email: 'test@rudderstack.com',
                  phone: '+917836362334',
                  userId: 'user@27',
                },
                locale: 'en-US',
                device: { token: 'token', id: 'id', type: 'android' },
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
              method: 'PUT',
              endpoint: 'https://onesignal.com/api/v1/players/85be324d-6dab-4293-ad1f-42199d4c455b',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  device_os: '1.12.3',
                  laguage: 'en-US',
                  created_at: 1609693373,
                  last_active: 1609693373,
                  external_user_id: 'user@27',
                  app_id: 'random-818c-4a28-b98e-6cd8a994eb22',
                  tags: {
                    brand: 'Raymonds',
                    price: '14000',
                    firstName: 'Test',
                    email: 'test@rudderstack.com',
                    phone: '+917836362334',
                    userId: 'user@27',
                    anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                  },
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
    name: 'one_signal',
    description: 'Track call for updating tags using external_user_id',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: false,
                allowedProperties: [{ propertyName: 'brand' }, { propertyName: 'price' }],
              },
            },
            message: {
              event: 'add_to_Cart',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: { brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
              body: {
                XML: {},
                FORM: {},
                JSON: { tags: { brand: 'Zara', price: '12000', add_to_Cart: true } },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              version: '1',
              endpoint:
                'https://onesignal.com/api/v1/apps/random-818c-4a28-b98e-6cd8a994eb22/users/user@27',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    description:
      'Track call for updating tags using external_user_id (with concatenated event name)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: true,
                allowedProperties: [{ propertyName: 'brand' }, { propertyName: 'price' }],
              },
            },
            message: {
              event: 'add_to_Cart',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: { brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  tags: {
                    add_to_Cart: true,
                    add_to_Cart_brand: 'Zara',
                    add_to_Cart_price: '12000',
                  },
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              version: '1',
              endpoint:
                'https://onesignal.com/api/v1/apps/random-818c-4a28-b98e-6cd8a994eb22/users/user@27',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    description:
      'Track call with tags key having empty value( Output Behaviour: Those keys will be deleted)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: true,
                allowedProperties: [{ propertyName: 'brand' }, { propertyName: 'price' }],
              },
            },
            message: {
              event: 'add_to_Cart',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: { brand: '', price: '' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
              body: {
                XML: {},
                FORM: {},
                JSON: { tags: { add_to_Cart: true, add_to_Cart_brand: '', add_to_Cart_price: '' } },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              version: '1',
              endpoint:
                'https://onesignal.com/api/v1/apps/random-818c-4a28-b98e-6cd8a994eb22/users/user@27',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    description: 'Track call having no allowed properties)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: false,
                allowedProperties: [],
              },
            },
            message: {
              event: 'add_to_Cart',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: { brand: 'zara', price: '10000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
              body: { XML: {}, FORM: {}, JSON: { tags: { add_to_Cart: true } }, JSON_ARRAY: {} },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              version: '1',
              endpoint:
                'https://onesignal.com/api/v1/apps/random-818c-4a28-b98e-6cd8a994eb22/users/user@27',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    description: 'Group call ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: true,
                allowedProperties: [{ propertyName: 'brand' }, { propertyName: 'price' }],
              },
            },
            message: {
              type: 'group',
              groupId: 'players111',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: { brand: '', price: '10000' },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
              body: {
                XML: {},
                FORM: {},
                JSON: { tags: { brand: '', price: '10000', groupId: 'players111' } },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              version: '1',
              endpoint:
                'https://onesignal.com/api/v1/apps/random-818c-4a28-b98e-6cd8a994eb22/users/user@27',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    description: 'Check for appId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: '',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: true,
                allowedProperties: [{ propertyName: 'brand' }, { propertyName: 'price' }],
              },
            },
            message: {
              type: 'group',
              groupId: 'players111',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: { brand: '', price: '10000' },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'appId is a required field',
            statTags: {
              destType: 'ONE_SIGNAL',
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
    name: 'one_signal',
    description: 'Check for message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: true,
                allowedProperties: [{ propertyName: 'brand' }, { propertyName: 'price' }],
              },
            },
            message: {
              type: 'page',
              groupId: 'players111',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: { brand: '', price: '10000' },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Message type page is not supported',
            statTags: {
              destType: 'ONE_SIGNAL',
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
    name: 'one_signal',
    description: 'Validating deviceType',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: false,
                allowedProperties: [],
              },
            },
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              context: {
                os: { name: '', version: '1.12.3' },
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
                  phone: '+917836362334',
                  userId: 'user@27',
                },
                locale: 'en-US',
                device: { token: 'token', id: 'id', type: 'ios' },
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              integrations: { one_signal: { deviceType: '15', identifier: 'random_id' } },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: 'device_type 15 is not a valid device_type',
            statTags: {
              destType: 'ONE_SIGNAL',
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
    name: 'one_signal',
    description: 'check for Message type not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: false,
                allowedProperties: [{ propertyName: 'brand' }, { propertyName: 'price' }],
              },
            },
            message: {
              event: 'add_to_Cart',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: { brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
              destType: 'ONE_SIGNAL',
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
    name: 'one_signal',
    description: 'Check for event name in the track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: false,
                allowedProperties: [{ propertyName: 'brand' }, { propertyName: 'price' }],
              },
            },
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: { brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event is not present in the input payloads',
            statTags: {
              destType: 'ONE_SIGNAL',
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
    name: 'one_signal',
    description: 'Check for groupId ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: true,
                allowedProperties: [{ propertyName: 'brand' }, { propertyName: 'price' }],
              },
            },
            message: {
              type: 'group',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: { brand: '', price: '10000' },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'groupId is required for group events',
            statTags: {
              destType: 'ONE_SIGNAL',
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
    name: 'one_signal',
    description: 'Check for user Id (required field to update the device) for track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                appId: 'random-818c-4a28-b98e-6cd8a994eb22',
                emailDeviceType: false,
                smsDeviceType: false,
                eventAsTags: false,
                allowedProperties: [{ propertyName: 'brand' }, { propertyName: 'price' }],
              },
            },
            message: {
              event: 'add_to_Cart',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'userId is required for track events/updating a device',
            statTags: {
              destType: 'ONE_SIGNAL',
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
];
