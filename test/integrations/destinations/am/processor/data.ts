export const data = [
  {
    name: 'am',
    description: 'Test 0: ERROR - Event not present. Please send event field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                revenue_type: 'Purchased',
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
            error: 'Event not present. Please send event field',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AM',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 1: ERROR - message type not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'UNSUPPORTED-TYPE',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {},
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {},
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                groupTypeTrait: 'email',
                apiKey: 'abcde',
                groupValueTrait: 'age',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
            error: 'message type not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AM',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 2: ERROR - No API Key is Found. Please Configure API key from dashbaord',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {},
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {},
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
            error: 'No API Key is Found. Please Configure API key from dashbaord',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'AM',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                revenue_type: 'Purchased',
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      quantity: 1,
                      revenue: 48,
                      revenueType: 'Purchased',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        revenue_type: 'Purchased',
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      price: 48,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        products: [
                          {
                            sku: '45790-32',
                            url: 'https://www.example.com/product/path',
                            name: 'Monopoly: 3rd Edition',
                            price: 19,
                            category: 'Games',
                            quantity: 1,
                            image_url: 'https:///www.example.com/product/path.jpg',
                            product_id: '507f1f77bcf86cd799439011',
                          },
                          {
                            sku: '46493-32',
                            name: 'Uno Card Game',
                            price: 3,
                            category: 'Games',
                            quantity: 2,
                            product_id: '505bd76785ebb509fc183733',
                          },
                        ],
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      revenueType: 'Purchased',
                      price: 48,
                      quantity: 1,
                      revenue: 48,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
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
                externalId: [
                  {
                    id: 'lynnanderson@smith.net',
                    identifierType: 'device_id',
                    type: 'AM-users',
                  },
                ],
                mappedToDestination: 'true',
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
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                    os_version: 'test os',
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
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              traits: {
                anonymousId: '123456',
                email: 'test@rudderstack.com',
                city: 'kolkata',
                address: {
                  country: 'India',
                  postalCode: 712136,
                  state: 'WB',
                  street: '',
                },
                os_version: 'test os',
                ip: '0.0.0.0',
                age: 26,
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              jobId: 2,
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                traitsToIncrement: [
                  {
                    traits: '',
                  },
                ],
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: 'test os',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: 'lynnanderson@smith.net',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      insert_id: '84e26acc-56a5-4835-8233-591137fca468',
                      ip: '0.0.0.0',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        anonymousId: '123456',
                        email: 'test@rudderstack.com',
                        postalCode: 712136,
                        state: 'WB',
                        street: '',
                        ip: '0.0.0.0',
                        age: 26,
                        device_id: 'lynnanderson@smith.net',
                      },
                      event_type: '$identify',
                      time: 1571043797562,
                      user_id: '123456',
                      session_id: -1,
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            metadata: {
              jobId: 2,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
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
                externalId: [
                  {
                    id: 'lynnanderson@smith.net',
                    identifierType: 'device_id',
                    type: 'AM-users',
                  },
                ],
                mappedToDestination: 'true',
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
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                    os_version: 'test os',
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
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              traits: {
                anonymousId: '123456',
                email: 'test@rudderstack.com',
                city: 'kolkata',
                address: {
                  country: 'India',
                  postalCode: 712136,
                  state: 'WB',
                  street: '',
                },
                os_version: 'test os',
                ip: '0.0.0.0',
                age: 26,
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              jobId: 2,
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: 'test os',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: 'lynnanderson@smith.net',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      insert_id: '84e26acc-56a5-4835-8233-591137fca468',
                      ip: '0.0.0.0',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        anonymousId: '123456',
                        email: 'test@rudderstack.com',
                        postalCode: 712136,
                        state: 'WB',
                        street: '',
                        ip: '0.0.0.0',
                        age: 26,
                        device_id: 'lynnanderson@smith.net',
                      },
                      event_type: '$identify',
                      time: 1571043797562,
                      user_id: '123456',
                      session_id: -1,
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            metadata: {
              jobId: 2,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
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
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
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
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '123456',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      insert_id: '84e26acc-56a5-4835-8233-591137fca468',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        anonymousId: '123456',
                        email: 'test@rudderstack.com',
                        postalCode: 712136,
                        state: 'WB',
                        street: '',
                        ip: '0.0.0.0',
                        age: 26,
                      },
                      event_type: '$identify',
                      time: 1571043797562,
                      user_id: '123456',
                      session_id: -1,
                      country: 'India',
                      city: 'kolkata',
                      ip: '0.0.0.0',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
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
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              request_ip: '1.1.1.1',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/destinations/amplitude',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/amplitude',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '00000000000000000000000000',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      event_type: 'Viewed ApplicationLoaded Page',
                      event_properties: {
                        path: '/destinations/amplitude',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'https://docs.rudderstack.com/destinations/amplitude',
                        category: 'destination',
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        name: 'ApplicationLoaded',
                      },
                      insert_id: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                      ip: '1.1.1.1',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        email: 'test@rudderstack.com',
                        anonymousId: '12345',
                      },
                      user_id: '12345',
                      time: 1571051718299,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '00000000000000000000000000',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
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
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              request_ip: '1.1.1.1',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/destinations/amplitude',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/amplitude',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              integrations: {
                All: false,
                Amplitude: {
                  groups: {
                    Company: 'ABC',
                  },
                },
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '00000000000000000000000000',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      event_type: 'Viewed ApplicationLoaded Page',
                      event_properties: {
                        path: '/destinations/amplitude',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'https://docs.rudderstack.com/destinations/amplitude',
                        category: 'destination',
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        name: 'ApplicationLoaded',
                      },
                      insert_id: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                      ip: '1.1.1.1',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        email: 'test@rudderstack.com',
                        anonymousId: '12345',
                      },
                      user_id: '12345',
                      groups: {
                        Company: 'ABC',
                      },
                      time: 1571051718299,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '00000000000000000000000000',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
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
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: '00000000000000000000000000',
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
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '00000000000000000000000000',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      insert_id: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        email: 'test@rudderstack.com',
                        anonymousId: '12345',
                      },
                      event_properties: {
                        user_actual_role: 'system_admin',
                        user_actual_id: 12345,
                        user_time_spent: 50000,
                      },
                      event_type: 'test track event',
                      user_id: '12345',
                      time: 1571051718300,
                      session_id: -1,
                      ip: '0.0.0.0',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '00000000000000000000000000',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
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
                  address: {
                    city: 'Sealdah',
                    country: 'India',
                    postalCode: 700014,
                    state: 'WB',
                    street: '',
                  },
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
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
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
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '123456',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      insert_id: '84e26acc-56a5-4835-8233-591137fca468',
                      ip: '0.0.0.0',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        anonymousId: '123456',
                        email: 'test@rudderstack.com',
                        postalCode: 712136,
                        state: 'WB',
                        street: '',
                        ip: '0.0.0.0',
                        age: 26,
                      },
                      event_type: '$identify',
                      time: 1571043797562,
                      user_id: '123456',
                      session_id: -1,
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              userId: 'ubcdfghi0001',
              anonymousId: '123456',
              session_id: '1598597129',
              context: {
                traits: {
                  device_id: 'adddd0001',
                  device_os: 'ios',
                  device_make: 'apple iphone',
                  app_version: 'v1.0',
                  timestamp: '2020-08-28 09:00:00',
                },
                library: {
                  name: 'http',
                },
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '123456',
                      user_properties: {
                        device_id: 'adddd0001',
                        device_os: 'ios',
                        device_make: 'apple iphone',
                        app_version: 'v1.0',
                        timestamp: '2020-08-28 09:00:00',
                      },
                      event_type: '$identify',
                      time: 0,
                      user_id: 'ubcdfghi0001',
                      session_id: 1598597129,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              userId: 'ubcdfghi0001',
              anonymousId: '123456',
              session_id: 'user:1598597129',
              context: {
                traits: {
                  device_id: 'adddd0001',
                  device_os: 'ios',
                  device_make: 'apple iphone',
                  app_version: 'v1.0',
                  timestamp: '2020-08-28 09:00:00',
                },
                library: {
                  name: 'http',
                },
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '123456',
                      user_properties: {
                        device_id: 'adddd0001',
                        device_os: 'ios',
                        device_make: 'apple iphone',
                        app_version: 'v1.0',
                        timestamp: '2020-08-28 09:00:00',
                      },
                      event_type: '$identify',
                      time: 0,
                      user_id: 'ubcdfghi0001',
                      session_id: 1598597129,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              userId: 'ubcdfghi0001',
              anonymousId: '123456',
              session_id: 1598597129,
              context: {
                traits: {
                  device_id: 'adddd0001',
                  device_os: 'ios',
                  device_make: 'apple iphone',
                  app_version: 'v1.0',
                  timestamp: '2020-08-28 09:00:00',
                },
                library: {
                  name: 'http',
                },
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '123456',
                      user_properties: {
                        device_id: 'adddd0001',
                        device_os: 'ios',
                        device_make: 'apple iphone',
                        app_version: 'v1.0',
                        timestamp: '2020-08-28 09:00:00',
                      },
                      event_type: '$identify',
                      time: 0,
                      user_id: 'ubcdfghi0001',
                      session_id: 1598597129,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              userId: 'ubcdfghi0001',
              anonymousId: '123456',
              context: {
                traits: {
                  device_id: 'adddd0001',
                  device_os: 'ios',
                  device_make: 'apple iphone',
                  app_version: 'v1.0',
                  timestamp: '2020-08-28 09:00:00',
                },
                library: {
                  name: 'http',
                },
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '123456',
                      user_properties: {
                        device_id: 'adddd0001',
                        device_os: 'ios',
                        device_make: 'apple iphone',
                        app_version: 'v1.0',
                        timestamp: '2020-08-28 09:00:00',
                      },
                      event_type: '$identify',
                      time: 0,
                      user_id: 'ubcdfghi0001',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 16',
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
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'group',
              messageId: 'e5034df0-a404-47b4-a463-76df99934fea',
              originalTimestamp: '2020-10-20T07:54:58.983Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'sampleusrRudder3',
              integrations: {
                All: true,
                Amplitude: {
                  groups: {
                    group_type: 'Company',
                    group_value: 'ABC',
                  },
                },
              },
              groupId: 'Sample_groupId23',
              traits: {
                KEY_3: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                KEY_2: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                name_trait: 'Company',
                value_trait: 'ABC',
              },
              sentAt: '2020-10-20T07:54:58.983Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '85.0.4183.121',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: 'my-anonymous-id-new',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.1.5',
                      language: 'en-US',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        utm_source: 'google',
                        utm_medium: 'medium',
                        utm_term: 'keyword',
                        utm_content: 'some content',
                        utm_name: 'some campaign',
                        utm_test: 'other value',
                        Company: 'ABC',
                      },
                      event_type: '$identify',
                      groups: {
                        Company: 'ABC',
                      },
                      time: 1603180498983,
                      user_id: 'sampleusrRudder3',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/groupidentify',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  api_key: 'abcde',
                  identification: ['{"group_type":"Company","group_value":"ABC"}'],
                },
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 17',
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
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'group',
              messageId: 'e5034df0-a404-47b4-a463-76df99934fea',
              originalTimestamp: '2020-10-20T07:54:58.983Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'sampleusrRudder3',
              integrations: {
                All: true,
              },
              groupId: 'Sample_groupId23',
              traits: {
                KEY_3: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                KEY_2: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                name_trait: 'Company',
                value_trait: 'ABC',
              },
              sentAt: '2020-10-20T07:54:58.983Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'name_trait',
                groupValueTrait: 'value_trait',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '85.0.4183.121',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: 'my-anonymous-id-new',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.1.5',
                      language: 'en-US',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        utm_source: 'google',
                        utm_medium: 'medium',
                        utm_term: 'keyword',
                        utm_content: 'some content',
                        utm_name: 'some campaign',
                        utm_test: 'other value',
                        Company: 'ABC',
                      },
                      event_type: '$identify',
                      groups: {
                        Company: 'ABC',
                      },
                      time: 1603180498983,
                      user_id: 'sampleusrRudder3',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/groupidentify',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  api_key: 'abcde',
                  identification: [
                    '{"group_type":"Company","group_value":"ABC","group_properties":{"KEY_3":{"CHILD_KEY_92":"value_95","CHILD_KEY_102":"value_103"},"KEY_2":{"CHILD_KEY_92":"value_95","CHILD_KEY_102":"value_103"},"name_trait":"Company","value_trait":"ABC"}}',
                  ],
                },
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 18: ERROR - Group call parameters are not valid',
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
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'group',
              messageId: 'e5034df0-a404-47b4-a463-76df99934fea',
              originalTimestamp: '2020-10-20T07:54:58.983Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'sampleusrRudder3',
              integrations: {
                All: true,
              },
              groupId: 'Sample_groupId23',
              traits: {
                KEY_3: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                KEY_2: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                name_trait: 'Company',
                value_trait: ['ABC'],
              },
              sentAt: '2020-10-20T07:54:58.983Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'name_trait',
                groupValueTrait: 'value_trait',
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
            error: 'Group call parameters are not valid',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AM',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 19',
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
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'alias',
              messageId: 'dd46338d-5f83-493b-bd28-3b48f55d0be8',
              originalTimestamp: '2020-10-20T08:14:28.778Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'newUserIdAlias',
              integrations: {
                All: true,
              },
              previousId: 'sampleusrRudder3',
              sentAt: '2020-10-20T08:14:28.778Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/usermap',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  api_key: 'abcde',
                  mapping: [
                    '{"global_user_id":"newUserIdAlias","user_id":"sampleusrRudder3","user_properties":{"initial_referrer":"https://docs.rudderstack.com","initial_referring_domain":"docs.rudderstack.com","utm_source":"google","utm_medium":"medium","utm_term":"keyword","utm_content":"some content","utm_name":"some campaign","utm_test":"other value"}}',
                  ],
                },
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 20',
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
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'alias',
              messageId: 'dd46338d-5f83-493b-bd28-3b48f55d0be8',
              originalTimestamp: '2020-10-20T08:14:28.778Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'newUserIdAlias',
              integrations: {
                All: false,
                Amplitude: {
                  unmap: 'sampleusrRudder3',
                },
              },
              previousId: 'sampleusrRudder3',
              sentAt: '2020-10-20T08:14:28.778Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/usermap',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  api_key: 'abcde',
                  mapping: [
                    '{"user_id":"sampleusrRudder3","user_properties":{"initial_referrer":"https://docs.rudderstack.com","initial_referring_domain":"docs.rudderstack.com","utm_source":"google","utm_medium":"medium","utm_term":"keyword","utm_content":"some content","utm_name":"some campaign","utm_test":"other value"},"unmap":true}',
                  ],
                },
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 21',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Sample track event BEFORE IDENTIFY1**',
              sentAt: '2020-09-17T15:07:13.171Z',
              userId: '0572f78fa49c648e',
              channel: 'mobile',
              context: {
                os: {
                  name: 'Android',
                  version: '9',
                },
                app: {
                  name: 'AMTestProject',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                locale: 'en-US',
                screen: {
                  width: 1080,
                  height: 2088,
                  density: 440,
                },
                traits: {
                  id: '0572f78fa49c648e',
                  userId: '0572f78fa49c648e',
                  address: {},
                  company: {},
                  anonymousId: '0572f78fa49c648e',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.4',
                },
                network: {
                  wifi: true,
                  carrier: 'Android',
                  cellular: true,
                  bluetooth: false,
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              messageId: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
              anonymousId: '0572f78fa49c648e',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-17T15:07:03.515Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '9',
                      device_id: '0572f78fa49c648e',
                      carrier: 'Android',
                      app_name: 'AMTestProject',
                      app_version: '1.0',
                      language: 'en-US',
                      insert_id: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        id: '0572f78fa49c648e',
                        userId: '0572f78fa49c648e',
                        address: {},
                        company: {},
                        anonymousId: '0572f78fa49c648e',
                      },
                      event_type: 'Sample track event BEFORE IDENTIFY1**',
                      user_id: '0572f78fa49c648e',
                      time: 1600355223515,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '0572f78fa49c648e',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Sample track event BEFORE IDENTIFY1**',
              sentAt: '2020-09-17T15:07:13.171Z',
              userId: '0572f78fa49c648e',
              channel: 'mobile',
              context: {
                os: {
                  name: 'Android',
                  version: '9',
                },
                app: {
                  name: 'AMTestProject',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: false,
                },
                locale: 'en-US',
                screen: {
                  width: 1080,
                  height: 2088,
                  density: 440,
                },
                traits: {
                  id: '0572f78fa49c648e',
                  userId: '0572f78fa49c648e',
                  address: {},
                  company: {},
                  anonymousId: '0572f78fa49c648e',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.4',
                },
                network: {
                  wifi: true,
                  carrier: 'Android',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              messageId: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
              anonymousId: '0572f78fa49c648e',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-17T15:07:03.515Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '9',
                      device_model: 'AOSP on IA Emulator',
                      device_manufacturer: 'Google',
                      platform: 'Android',
                      device_id: '0572f78fa49c648e',
                      carrier: 'Android',
                      app_name: 'AMTestProject',
                      app_version: '1.0',
                      language: 'en-US',
                      insert_id: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
                      user_properties: {
                        id: '0572f78fa49c648e',
                        userId: '0572f78fa49c648e',
                        address: {},
                        company: {},
                        anonymousId: '0572f78fa49c648e',
                      },
                      event_type: 'Sample track event BEFORE IDENTIFY1**',
                      user_id: '0572f78fa49c648e',
                      device_brand: 'Google',
                      time: 1600355223515,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '0572f78fa49c648e',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 23',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Sample track event BEFORE IDENTIFY1**',
              sentAt: '2020-09-17T15:07:13.171Z',
              userId: '0572f78fa49c648e',
              channel: 'mobile',
              context: {
                os: {
                  name: 'Android',
                  version: '9',
                },
                app: {
                  name: 'AMTestProject',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                locale: 'en-US',
                screen: {
                  width: 1080,
                  height: 2088,
                  density: 440,
                },
                traits: {
                  id: '0572f78fa49c648e',
                  userId: '0572f78fa49c648e',
                  address: {},
                  company: {},
                  anonymousId: '0572f78fa49c648e',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.4',
                },
                network: {
                  wifi: true,
                  carrier: 'Android',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              messageId: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
              anonymousId: '0572f78fa49c648e',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-17T15:07:03.515Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '9',
                      device_model: 'AOSP on IA Emulator',
                      device_manufacturer: 'Google',
                      platform: 'Android',
                      device_id: '0572f78fa49c648e',
                      carrier: 'Android',
                      app_name: 'AMTestProject',
                      app_version: '1.0',
                      language: 'en-US',
                      insert_id: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
                      user_properties: {
                        id: '0572f78fa49c648e',
                        userId: '0572f78fa49c648e',
                        address: {},
                        company: {},
                        anonymousId: '0572f78fa49c648e',
                      },
                      event_type: 'Sample track event BEFORE IDENTIFY1**',
                      user_id: '0572f78fa49c648e',
                      device_brand: 'Google',
                      adid: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                      time: 1600355223515,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '0572f78fa49c648e',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 24',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Sample track event BEFORE IDENTIFY1**',
              sentAt: '2020-09-17T15:07:13.171Z',
              userId: '0572f78fa49c648e',
              channel: 'mobile',
              context: {
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                app: {
                  name: 'AMTestProject',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'iphone_xr_64',
                  type: 'iOS',
                  model: 'iPhone XR',
                  manufacturer: 'Apple',
                  adTrackingEnabled: false,
                },
                locale: 'en-US',
                screen: {
                  width: 1080,
                  height: 2088,
                  density: 440,
                },
                traits: {
                  id: '0572f78fa49c648e',
                  userId: '0572f78fa49c648e',
                  address: {},
                  company: {},
                  anonymousId: '0572f78fa49c648e',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.4',
                },
                network: {
                  wifi: true,
                  carrier: 'AT&T',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              messageId: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
              anonymousId: '0572f78fa49c648e',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-17T15:07:03.515Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'iOS',
                      os_version: '14.4.1',
                      device_model: 'iPhone XR',
                      device_manufacturer: 'Apple',
                      platform: 'iOS',
                      device_id: '0572f78fa49c648e',
                      carrier: 'AT&T',
                      app_name: 'AMTestProject',
                      app_version: '1.0',
                      language: 'en-US',
                      insert_id: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
                      user_properties: {
                        id: '0572f78fa49c648e',
                        userId: '0572f78fa49c648e',
                        address: {},
                        company: {},
                        anonymousId: '0572f78fa49c648e',
                      },
                      event_type: 'Sample track event BEFORE IDENTIFY1**',
                      user_id: '0572f78fa49c648e',
                      device_brand: 'Apple',
                      idfv: '0572f78fa49c648e',
                      time: 1600355223515,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '0572f78fa49c648e',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 25',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Sample track event BEFORE IDENTIFY1**',
              sentAt: '2020-09-17T15:07:13.171Z',
              userId: '0572f78fa49c648e',
              channel: 'mobile',
              context: {
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                app: {
                  name: 'AMTestProject',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'iphone_xr_64',
                  type: 'iOS',
                  model: 'iPhone XR',
                  manufacturer: 'Apple',
                  adTrackingEnabled: true,
                  advertisingId: '1606e649-c97e-4d5f-a2ef-b81dbc66741a',
                },
                locale: 'en-US',
                screen: {
                  width: 1080,
                  height: 2088,
                  density: 440,
                },
                traits: {
                  id: '0572f78fa49c648e',
                  userId: '0572f78fa49c648e',
                  address: {},
                  company: {},
                  anonymousId: '0572f78fa49c648e',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.4',
                },
                network: {
                  wifi: true,
                  carrier: 'AT&T',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              messageId: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
              anonymousId: '0572f78fa49c648e',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-17T15:07:03.515Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'iOS',
                      os_version: '14.4.1',
                      device_model: 'iPhone XR',
                      device_manufacturer: 'Apple',
                      platform: 'iOS',
                      device_id: '0572f78fa49c648e',
                      carrier: 'AT&T',
                      app_name: 'AMTestProject',
                      app_version: '1.0',
                      language: 'en-US',
                      insert_id: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
                      user_properties: {
                        id: '0572f78fa49c648e',
                        userId: '0572f78fa49c648e',
                        address: {},
                        company: {},
                        anonymousId: '0572f78fa49c648e',
                      },
                      event_type: 'Sample track event BEFORE IDENTIFY1**',
                      user_id: '0572f78fa49c648e',
                      device_brand: 'Apple',
                      idfa: '1606e649-c97e-4d5f-a2ef-b81dbc66741a',
                      idfv: '0572f78fa49c648e',
                      time: 1600355223515,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '0572f78fa49c648e',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 26',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              userId: 'identified user id',
              anonymousId: 'anon-id-new',
              event: 'Screen View',
              properties: {
                prop1: '5',
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: 'anon-id-new',
                      event_properties: {
                        prop1: '5',
                        name: 'Screen View',
                      },
                      user_properties: {},
                      event_type: 'Viewed Screen View Screen',
                      user_id: 'identified user id',
                      time: 1580602989544,
                      session_id: -1,
                      ip: '14.5.67.21',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 27',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: false,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      revenueType: 'Purchased',
                      price: 25,
                      quantity: 2,
                      revenue: 48,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      event_type: 'Product Purchased',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9-1',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        sku: '45790-32',
                        url: 'https://www.example.com/product/path',
                        name: 'Monopoly: 3rd Edition',
                        price: 19,
                        category: 'Games',
                        quantity: 1,
                        image_url: 'https:///www.example.com/product/path.jpg',
                        product_id: '507f1f77bcf86cd799439011',
                      },
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      event_type: 'Product Purchased',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9-2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        sku: '46493-32',
                        name: 'Uno Card Game',
                        price: 3,
                        category: 'Games',
                        quantity: 2,
                        product_id: '505bd76785ebb509fc183733',
                      },
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 28',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        products: [
                          {
                            sku: '45790-32',
                            url: 'https://www.example.com/product/path',
                            name: 'Monopoly: 3rd Edition',
                            price: 19,
                            category: 'Games',
                            quantity: 1,
                            image_url: 'https:///www.example.com/product/path.jpg',
                            product_id: '507f1f77bcf86cd799439011',
                          },
                          {
                            sku: '46493-32',
                            name: 'Uno Card Game',
                            price: 3,
                            category: 'Games',
                            quantity: 2,
                            product_id: '505bd76785ebb509fc183733',
                          },
                        ],
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      revenueType: 'Purchased',
                      price: 25,
                      quantity: 2,
                      revenue: 48,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 29',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: false,
                trackRevenuePerProduct: true,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        revenue: 48,
                        price: 25,
                        quantity: 2,
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      event_type: 'Product Purchased',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9-1',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        sku: '45790-32',
                        url: 'https://www.example.com/product/path',
                        name: 'Monopoly: 3rd Edition',
                        category: 'Games',
                        image_url: 'https:///www.example.com/product/path.jpg',
                      },
                      productId: '507f1f77bcf86cd799439011',
                      revenueType: 'Purchased',
                      price: 19,
                      quantity: 1,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      event_type: 'Product Purchased',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9-2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        sku: '46493-32',
                        name: 'Uno Card Game',
                        category: 'Games',
                      },
                      productId: '505bd76785ebb509fc183733',
                      revenueType: 'Purchased',
                      price: 3,
                      quantity: 2,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 30',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: true,
                trackRevenuePerProduct: true,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        revenue: 48,
                        price: 25,
                        quantity: 2,
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        products: [
                          {
                            sku: '45790-32',
                            url: 'https://www.example.com/product/path',
                            name: 'Monopoly: 3rd Edition',
                            price: 19,
                            category: 'Games',
                            quantity: 1,
                            image_url: 'https:///www.example.com/product/path.jpg',
                            product_id: '507f1f77bcf86cd799439011',
                          },
                          {
                            sku: '46493-32',
                            name: 'Uno Card Game',
                            price: 3,
                            category: 'Games',
                            quantity: 2,
                            product_id: '505bd76785ebb509fc183733',
                          },
                        ],
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      event_type: 'Product Purchased',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9-1',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        sku: '45790-32',
                        url: 'https://www.example.com/product/path',
                        name: 'Monopoly: 3rd Edition',
                        category: 'Games',
                        image_url: 'https:///www.example.com/product/path.jpg',
                      },
                      productId: '507f1f77bcf86cd799439011',
                      revenueType: 'Purchased',
                      price: 19,
                      quantity: 1,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      event_type: 'Product Purchased',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9-2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        sku: '46493-32',
                        name: 'Uno Card Game',
                        category: 'Games',
                      },
                      productId: '505bd76785ebb509fc183733',
                      revenueType: 'Purchased',
                      price: 3,
                      quantity: 2,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 31',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: true,
                trackRevenuePerProduct: true,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      revenueType: 'Purchased',
                      price: 25,
                      quantity: 2,
                      revenue: 48,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 32',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      revenueType: 'Purchased',
                      price: 25,
                      quantity: 2,
                      revenue: 48,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 33',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: false,
                trackRevenuePerProduct: true,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      revenueType: 'Purchased',
                      price: 25,
                      quantity: 2,
                      revenue: 48,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 34',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
              },
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: false,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      revenueType: 'Purchased',
                      price: 25,
                      quantity: 2,
                      revenue: 48,
                      time: 1597383030118,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 35',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-11-20T06:18:22.342Z',
              userId: 'User_111',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.8',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                locale: 'en-GB',
                screen: {
                  density: 2.5,
                },
                traits: {
                  city: 'Durgapur',
                  name: 'Manashi',
                  phone: '990099009900',
                  friends: 3,
                  age: 12,
                  subjects: 5,
                  experience: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.8',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
              },
              rudderId: '7e00bf3d-5357-4448-886d-f8fc8abf932d',
              messageId: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
              anonymousId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-11-20T06:18:22.342Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                traitsToIncrement: [
                  {
                    traits: 'age',
                  },
                  {
                    traits: 'friends',
                  },
                ],
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '86.0.4240.198',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.1.8',
                      language: 'en-GB',
                      insert_id: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        name: 'Manashi',
                        phone: '990099009900',
                        subjects: 5,
                        experience: 2,
                        $add: {
                          age: 12,
                          friends: 3,
                        },
                      },
                      event_type: '$identify',
                      time: 1605853102342,
                      user_id: 'User_111',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 36',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-11-20T06:18:22.342Z',
              userId: 'User_111',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.8',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://localhost:1111/RudderAmplitude.html',
                  path: '/RudderAmplitude.html',
                  title: 'Amplitude Testing By Rudder',
                  search: '',
                  referrer: 'http://localhost:1111/',
                },
                locale: 'en-GB',
                screen: {
                  density: 2.5,
                },
                traits: {
                  city: 'Durgapur',
                  name: 'Manashi',
                  phone: '990099009900',
                  friends: 3,
                  age: 12,
                  subjects: 5,
                  experience: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.8',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
              },
              rudderId: '7e00bf3d-5357-4448-886d-f8fc8abf932d',
              messageId: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
              anonymousId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-11-20T06:18:22.342Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                traitsToSetOnce: [
                  {
                    traits: 'subjects',
                  },
                  {
                    traits: '',
                  },
                ],
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '86.0.4240.198',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.1.8',
                      language: 'en-GB',
                      insert_id: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
                      user_properties: {
                        name: 'Manashi',
                        phone: '990099009900',
                        friends: 3,
                        age: 12,
                        experience: 2,
                        $setOnce: {
                          subjects: 5,
                        },
                      },
                      event_type: '$identify',
                      time: 1605853102342,
                      user_id: 'User_111',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 37',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-11-20T06:18:22.342Z',
              userId: 'User_111',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.8',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://localhost:1111/RudderAmplitude.html',
                  path: '/RudderAmplitude.html',
                  title: 'Amplitude Testing By Rudder',
                  search: '',
                  referrer: 'http://localhost:1111/',
                },
                locale: 'en-GB',
                screen: {
                  density: 2.5,
                },
                traits: {
                  city: 'Durgapur',
                  name: 'Manashi',
                  phone: '990099009900',
                  friends: 3,
                  age: 12,
                  subjects: 5,
                  experience: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.8',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
              },
              rudderId: '7e00bf3d-5357-4448-886d-f8fc8abf932d',
              messageId: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
              anonymousId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-11-20T06:18:22.342Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                traitsToAppend: [
                  {
                    traits: 'name',
                  },
                  {
                    traits: '',
                  },
                ],
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '86.0.4240.198',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.1.8',
                      language: 'en-GB',
                      insert_id: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
                      user_properties: {
                        phone: '990099009900',
                        friends: 3,
                        age: 12,
                        subjects: 5,
                        experience: 2,
                        $append: {
                          name: 'Manashi',
                        },
                      },
                      event_type: '$identify',
                      time: 1605853102342,
                      user_id: 'User_111',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 38',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-11-20T06:18:22.342Z',
              userId: 'User_111',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.8',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://localhost:1111/RudderAmplitude.html',
                  path: '/RudderAmplitude.html',
                  title: 'Amplitude Testing By Rudder',
                  search: '',
                  referrer: 'http://localhost:1111/',
                },
                locale: 'en-GB',
                screen: {
                  density: 2.5,
                },
                traits: {
                  city: 'Durgapur',
                  name: 'Manashi',
                  phone: '990099009900',
                  friends: 3,
                  age: 12,
                  subjects: 5,
                  experience: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.8',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
              },
              rudderId: '7e00bf3d-5357-4448-886d-f8fc8abf932d',
              messageId: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
              anonymousId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-11-20T06:18:22.342Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                traitsToPrepend: [
                  {
                    traits: 'experience',
                  },
                  {
                    traits: '',
                  },
                ],
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '86.0.4240.198',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.1.8',
                      language: 'en-GB',
                      insert_id: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
                      user_properties: {
                        name: 'Manashi',
                        phone: '990099009900',
                        friends: 3,
                        age: 12,
                        subjects: 5,
                        $prepend: {
                          experience: 2,
                        },
                      },
                      event_type: '$identify',
                      time: 1605853102342,
                      user_id: 'User_111',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 39',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-11-20T06:18:22.342Z',
              userId: 'User_111',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.8',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://localhost:1111/RudderAmplitude.html',
                  path: '/RudderAmplitude.html',
                  title: 'Amplitude Testing By Rudder',
                  search: '',
                  referrer: 'http://localhost:1111/',
                },
                locale: 'en-GB',
                screen: {
                  density: 2.5,
                },
                traits: {
                  city: 'Durgapur',
                  name: 'Manashi',
                  phone: '990099009900',
                  friends: 3,
                  age: 12,
                  subjects: 5,
                  experience: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.8',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
              },
              rudderId: '7e00bf3d-5357-4448-886d-f8fc8abf932d',
              messageId: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
              anonymousId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-11-20T06:18:22.342Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                traitsToIncrement: [
                  {
                    traits: 'age',
                  },
                  {
                    traits: 'friends',
                  },
                ],
                traitsToSetOnce: [
                  {
                    traits: 'subjects',
                  },
                  {
                    traits: '',
                  },
                ],
                traitsToAppend: [
                  {
                    traits: 'name',
                  },
                  {
                    traits: '',
                  },
                ],
                traitsToPrepend: [
                  {
                    traits: 'experience',
                  },
                  {
                    traits: '',
                  },
                ],
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '86.0.4240.198',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.1.8',
                      language: 'en-GB',
                      insert_id: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
                      user_properties: {
                        phone: '990099009900',
                        $add: {
                          age: 12,
                          friends: 3,
                        },
                        $setOnce: {
                          subjects: 5,
                        },
                        $append: {
                          name: 'Manashi',
                        },
                        $prepend: {
                          experience: 2,
                        },
                      },
                      event_type: '$identify',
                      time: 1605853102342,
                      user_id: 'User_111',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 40',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              userId: 'userID123',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                },
                locale: 'en-US',
                network: {
                  carrier: 'T-Mobile',
                },
                location: {
                  country: 'United States',
                  city: 'San Francisco',
                  region: 'California',
                  latitude: '37.7672319',
                  longitude: '-122.4021353',
                  dma: 'San Francisco-Oakland-San Jose, CA',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
                os: {
                  name: 'Android',
                  version: '11',
                },
                app: {
                  version: '2.6.0 v3',
                },
                device: {
                  type: 'Android',
                  model: 'SM-A025M',
                  manufacturer: 'samsung',
                },
              },
              messageId: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                trackProductsOnce: false,
                trackRevenuePerProduct: true,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      device_id: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        revenue: 48,
                        price: 25,
                        quantity: 2,
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      user_id: 'userID123',
                      time: 1597383030118,
                      session_id: -1,
                      region: 'California',
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'United States',
                      city: 'San Francisco',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      device_id: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      event_type: 'Product Purchased',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2-1',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        sku: '45790-32',
                        url: 'https://www.example.com/product/path',
                        name: 'Monopoly: 3rd Edition',
                        category: 'Games',
                        image_url: 'https:///www.example.com/product/path.jpg',
                      },
                      user_id: 'userID123',
                      productId: '507f1f77bcf86cd799439011',
                      revenueType: 'Purchased',
                      price: 19,
                      quantity: 1,
                      time: 1597383030118,
                      session_id: -1,
                      region: 'California',
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'United States',
                      city: 'San Francisco',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      device_id: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      event_type: 'Product Purchased',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2-2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        sku: '46493-32',
                        name: 'Uno Card Game',
                        category: 'Games',
                      },
                      user_id: 'userID123',
                      productId: '505bd76785ebb509fc183733',
                      revenueType: 'Purchased',
                      price: 3,
                      quantity: 2,
                      time: 1597383030118,
                      session_id: -1,
                      region: 'California',
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'United States',
                      city: 'San Francisco',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 41',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              userId: 'userID123',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                },
                locale: 'en-US',
                network: {
                  carrier: 'T-Mobile',
                },
                location: {
                  latitude: '37.7672319',
                  longitude: '-122.4021353',
                  dma: 'San Francisco-Oakland-San Jose, CA',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
                os: {
                  name: 'Android',
                  version: '11',
                },
                app: {
                  version: '2.6.0 v3',
                },
                device: {
                  type: 'Android',
                  model: 'SM-A025M',
                  manufacturer: 'samsung',
                },
              },
              messageId: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      device_id: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        products: [
                          {
                            sku: '45790-32',
                            url: 'https://www.example.com/product/path',
                            name: 'Monopoly: 3rd Edition',
                            price: 19,
                            category: 'Games',
                            quantity: 1,
                            image_url: 'https:///www.example.com/product/path.jpg',
                            product_id: '507f1f77bcf86cd799439011',
                          },
                          {
                            sku: '46493-32',
                            name: 'Uno Card Game',
                            price: 3,
                            category: 'Games',
                            quantity: 2,
                            product_id: '505bd76785ebb509fc183733',
                          },
                        ],
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      user_id: 'userID123',
                      revenueType: 'Purchased',
                      price: 25,
                      quantity: 2,
                      revenue: 48,
                      time: 1597383030118,
                      session_id: -1,
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 42',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'App_Opened',
              sentAt: '2021-11-17T19:13:52.106Z',
              userId: 'ab419c3a-47ce-11ec-82ac-16a1bb813a59',
              channel: 'mobile',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                },
                locale: 'en-US',
                network: {
                  carrier: 'T-Mobile',
                },
                location: {
                  country: 'United States',
                  city: 'San Francisco',
                  latitude: '37.7672319',
                  longitude: '-122.4021353',
                  dma: 'San Francisco-Oakland-San Jose, CA',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
                os: {
                  name: 'Android',
                  version: '11',
                },
                app: {
                  version: '2.6.0 v3',
                },
                device: {
                  type: 'Android',
                  model: 'SM-A025M',
                  manufacturer: 'samsung',
                },
              },
              messageId: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                externalID: '1637170658229-3961832492194264209',
              },
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-11-17T19:13:51.143Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        externalID: '1637170658229-3961832492194264209',
                      },
                      event_type: 'App_Opened',
                      user_id: 'ab419c3a-47ce-11ec-82ac-16a1bb813a59',
                      device_brand: 'samsung',
                      time: 1597383030118,
                      session_id: -1,
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'United States',
                      city: 'San Francisco',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
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
    name: 'am',
    description: 'Test 43',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2020-11-20T06:18:22.342Z',
              userId: 'User_111',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.8',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                locale: 'en-GB',
                screen: {
                  density: 2.5,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.8',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
              },
              rudderId: '7e00bf3d-5357-4448-886d-f8fc8abf932d',
              messageId: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
              anonymousId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-11-20T06:18:22.342Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                traitsToIncrement: [
                  {
                    traits: 'age',
                  },
                  {
                    traits: 'friends',
                  },
                ],
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '86.0.4240.198',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.1.8',
                      language: 'en-GB',
                      insert_id: '6f08cc45-95c3-40c1-90f2-2f44a92947ef',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                      },
                      event_type: '$identify',
                      time: 1605853102342,
                      user_id: 'User_111',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '2f8b0ba7-d76e-4b91-9577-d1b6ebd68946',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 44',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              userId: 'userID123',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                },
                locale: 'en-US',
                network: {
                  carrier: 'T-Mobile',
                },
                location: {
                  latitude: '37.7672319',
                  longitude: '-122.4021353',
                  dma: 'San Francisco-Oakland-San Jose, CA',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
                os: {
                  name: 'Android',
                  version: '11',
                },
                app: {
                  version: '2.6.0 v3',
                },
                device: {
                  type: 'Android',
                  model: 'SM-A025M',
                  manufacturer: 'samsung',
                },
              },
              messageId: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 0,
                price: 25,
                quantity: 2,
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
              integrations: {
                S3: false,
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                trackProductsOnce: true,
                trackRevenuePerProduct: true,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      device_id: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        tax: 2,
                        total: 27.5,
                        coupon: 'hasbros',
                        revenue: 0,
                        price: 25,
                        quantity: 2,
                        currency: 'USD',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        products: [
                          {
                            sku: '45790-32',
                            url: 'https://www.example.com/product/path',
                            name: 'Monopoly: 3rd Edition',
                            price: 19,
                            category: 'Games',
                            quantity: 1,
                            image_url: 'https:///www.example.com/product/path.jpg',
                            product_id: '507f1f77bcf86cd799439011',
                          },
                          {
                            sku: '46493-32',
                            name: 'Uno Card Game',
                            price: 3,
                            category: 'Games',
                            quantity: 2,
                            product_id: '505bd76785ebb509fc183733',
                          },
                        ],
                        shipping: 3,
                        subtotal: 22.5,
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                      },
                      event_type: 'Order Completed',
                      user_id: 'userID123',
                      time: 1597383030118,
                      session_id: -1,
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      device_id: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      event_type: 'Product Purchased',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2-1',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        sku: '45790-32',
                        url: 'https://www.example.com/product/path',
                        name: 'Monopoly: 3rd Edition',
                        category: 'Games',
                        image_url: 'https:///www.example.com/product/path.jpg',
                      },
                      user_id: 'userID123',
                      productId: '507f1f77bcf86cd799439011',
                      revenueType: 'Purchased',
                      price: 19,
                      quantity: 1,
                      time: 1597383030118,
                      session_id: -1,
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      device_id: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      event_type: 'Product Purchased',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2-2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        sku: '46493-32',
                        name: 'Uno Card Game',
                        category: 'Games',
                      },
                      user_id: 'userID123',
                      productId: '505bd76785ebb509fc183733',
                      revenueType: 'Purchased',
                      price: 3,
                      quantity: 2,
                      time: 1597383030118,
                      session_id: -1,
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 45',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              event: 'Home',
              sentAt: '2021-12-09T14:55:17.074Z',
              userId: '9e187bff-2867-11ec-82ac-02cdd434d6bf',
              channel: 'mobile',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                },
                locale: 'en-US',
                network: {
                  carrier: 'T-Mobile',
                },
                location: {
                  country: 'United States',
                  city: 'San Francisco',
                  region: 'California',
                  latitude: '37.7672319',
                  longitude: '-122.4021353',
                  dma: 'San Francisco-Oakland-San Jose, CA',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
                os: {
                  name: 'Android',
                  version: '11',
                },
                app: {
                  version: '2.6.0 v3',
                },
                device: {
                  type: 'Android',
                  model: 'SM-A025M',
                  manufacturer: 'samsung',
                },
              },
              rudderId: '004670a6-4559-4f2b-aa2a-f35cf81a9423',
              messageId: '1639061715808-a934f1c2-7b55-4e78-bd4d-df209c30c8a1',
              timestamp: '2021-12-09T14:55:15.914Z',
              properties: {
                name: 'Home',
                externalID: '1637763064335-7225034711957140329',
              },
              receivedAt: '2021-12-09T14:55:17.180Z',
              request_ip: '186.54.216.75',
              anonymousId: '066a37dc92b16284',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-12-09T14:55:15.808Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      device_id: '066a37dc92b16284',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      platform: 'Android',
                      language: 'en-US',
                      event_properties: {
                        name: 'Home',
                        externalID: '1637763064335-7225034711957140329',
                      },
                      insert_id: '1639061715808-a934f1c2-7b55-4e78-bd4d-df209c30c8a1',
                      ip: '186.54.216.75',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_type: 'Viewed Home Screen',
                      user_id: '9e187bff-2867-11ec-82ac-02cdd434d6bf',
                      device_brand: 'samsung',
                      time: 1639061715914,
                      session_id: -1,
                      region: 'California',
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'United States',
                      city: 'San Francisco',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '066a37dc92b16284',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 46',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              event: 'Home',
              sentAt: '2021-12-09T14:55:17.074Z',
              userId: 'abcdef123456cf',
              channel: 'mobile',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c79-6c3f-4b60-be84-97805a32aaa1',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                },
                locale: 'en-US',
                network: {
                  carrier: 'T-Mobile',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
                os: {
                  name: 'Android',
                  version: '11',
                },
                app: {
                  version: '2.6.0 v3',
                },
                device: {
                  type: 'Android',
                  model: 'SM-A025M',
                  manufacturer: 'samsung',
                },
              },
              rudderId: '004670a6-4559-4f2b-aa1a-f12cf81a9423',
              messageId: '1639061715808-a934f1c2-7b55-5e78-bd4d-df209c31d8a2',
              timestamp: '2021-12-09T14:55:15.914Z',
              properties: {
                name: 'Home',
                externalID: '1637763064336-7225034711957140329',
              },
              receivedAt: '2021-12-09T14:55:17.180Z',
              request_ip: '186.54.216.75',
              anonymousId: '066a37dc92b16284',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-12-09T14:55:15.808Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      device_id: '066a37dc92b16284',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      platform: 'Android',
                      language: 'en-US',
                      event_properties: {
                        name: 'Home',
                        externalID: '1637763064336-7225034711957140329',
                      },
                      insert_id: '1639061715808-a934f1c2-7b55-5e78-bd4d-df209c31d8a2',
                      ip: '186.54.216.75',
                      user_properties: {
                        anonymousId: '50be5c79-6c3f-4b60-be84-97805a32aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_type: 'Viewed Home Screen',
                      user_id: 'abcdef123456cf',
                      device_brand: 'samsung',
                      time: 1639061715914,
                      session_id: -1,
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '066a37dc92b16284',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 47',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Sample track event BEFORE IDENTIFY1**',
              sentAt: '2020-09-17T15:07:13.171Z',
              userId: '0572f78fa49c648e',
              channel: 'mobile',
              context: {
                app: {
                  name: 'AMTestProject',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '0572f78fa49c648e',
                  type: 'watchos',
                  manufacturer: 'Apple',
                  adTrackingEnabled: true,
                  advertisingId: '1606e649-c97e-4d5f-a2ef-b81dbc66741a',
                },
                locale: 'en-US',
                screen: {
                  width: 1080,
                  height: 2088,
                  density: 440,
                },
                traits: {
                  id: '0572f78fa49c648e',
                  userId: '0572f78fa49c648e',
                  address: {},
                  company: {},
                  anonymousId: '0572f78fa49c648e',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.4',
                },
                network: {
                  wifi: true,
                  carrier: 'AT&T',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              messageId: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
              anonymousId: '0572f78fa49c648e',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-17T15:07:03.515Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_manufacturer: 'Apple',
                      platform: 'watchos',
                      device_id: '0572f78fa49c648e',
                      carrier: 'AT&T',
                      app_name: 'AMTestProject',
                      app_version: '1.0',
                      language: 'en-US',
                      insert_id: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
                      user_properties: {
                        id: '0572f78fa49c648e',
                        userId: '0572f78fa49c648e',
                        address: {},
                        company: {},
                        anonymousId: '0572f78fa49c648e',
                      },
                      event_type: 'Sample track event BEFORE IDENTIFY1**',
                      user_id: '0572f78fa49c648e',
                      device_brand: 'Apple',
                      idfa: '1606e649-c97e-4d5f-a2ef-b81dbc66741a',
                      idfv: '0572f78fa49c648e',
                      time: 1600355223515,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '0572f78fa49c648e',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 48',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Sample track event BEFORE IDENTIFY1**',
              sentAt: '2020-09-17T15:07:13.171Z',
              userId: '0572f78fa49c648e',
              channel: 'mobile',
              context: {
                app: {
                  name: 'AMTestProject',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '0572f78fa49c648e',
                  type: 'ipados',
                  manufacturer: 'Apple',
                  adTrackingEnabled: true,
                  advertisingId: '1606e649-c97e-4d5f-a2ef-b81dbc66741a',
                },
                locale: 'en-US',
                screen: {
                  width: 1080,
                  height: 2088,
                  density: 440,
                },
                traits: {
                  id: '0572f78fa49c648e',
                  userId: '0572f78fa49c648e',
                  address: {},
                  company: {},
                  anonymousId: '0572f78fa49c648e',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.4',
                },
                network: {
                  wifi: true,
                  carrier: 'AT&T',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              messageId: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
              anonymousId: '0572f78fa49c648e',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-17T15:07:03.515Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_manufacturer: 'Apple',
                      platform: 'ipados',
                      device_id: '0572f78fa49c648e',
                      carrier: 'AT&T',
                      app_name: 'AMTestProject',
                      app_version: '1.0',
                      language: 'en-US',
                      insert_id: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
                      user_properties: {
                        id: '0572f78fa49c648e',
                        userId: '0572f78fa49c648e',
                        address: {},
                        company: {},
                        anonymousId: '0572f78fa49c648e',
                      },
                      event_type: 'Sample track event BEFORE IDENTIFY1**',
                      user_id: '0572f78fa49c648e',
                      device_brand: 'Apple',
                      idfa: '1606e649-c97e-4d5f-a2ef-b81dbc66741a',
                      idfv: '0572f78fa49c648e',
                      time: 1600355223515,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '0572f78fa49c648e',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 49',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Sample track event BEFORE IDENTIFY1**',
              sentAt: '2020-09-17T15:07:13.171Z',
              userId: '0572f78fa49c648e',
              channel: 'mobile',
              context: {
                app: {
                  name: 'AMTestProject',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                device: {
                  id: '0572f78fa49c648e',
                  type: 'tvos',
                  manufacturer: 'Apple',
                  adTrackingEnabled: true,
                  advertisingId: '1606e649-c97e-4d5f-a2ef-b81dbc66741a',
                },
                locale: 'en-US',
                screen: {
                  width: 1080,
                  height: 2088,
                  density: 440,
                },
                traits: {
                  id: '0572f78fa49c648e',
                  userId: '0572f78fa49c648e',
                  address: {},
                  company: {},
                  anonymousId: '0572f78fa49c648e',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.4',
                },
                network: {
                  wifi: true,
                  carrier: 'AT&T',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              messageId: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
              anonymousId: '0572f78fa49c648e',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-17T15:07:03.515Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_manufacturer: 'Apple',
                      platform: 'tvos',
                      device_id: '0572f78fa49c648e',
                      carrier: 'AT&T',
                      app_name: 'AMTestProject',
                      app_version: '1.0',
                      language: 'en-US',
                      insert_id: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
                      user_properties: {
                        id: '0572f78fa49c648e',
                        userId: '0572f78fa49c648e',
                        address: {},
                        company: {},
                        anonymousId: '0572f78fa49c648e',
                      },
                      event_type: 'Sample track event BEFORE IDENTIFY1**',
                      user_id: '0572f78fa49c648e',
                      device_brand: 'Apple',
                      idfa: '1606e649-c97e-4d5f-a2ef-b81dbc66741a',
                      idfv: '0572f78fa49c648e',
                      time: 1600355223515,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '0572f78fa49c648e',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 50',
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
                device: {
                  brand: 'testBrand',
                  manufacturer: 'testManufacturer',
                },
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
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
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
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                mapDeviceBrand: true,
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      device_manufacturer: 'testManufacturer',
                      platform: 'Web',
                      device_brand: 'testBrand',
                      device_id: '123456',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      insert_id: '84e26acc-56a5-4835-8233-591137fca468',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        anonymousId: '123456',
                        email: 'test@rudderstack.com',
                        postalCode: 712136,
                        state: 'WB',
                        street: '',
                        ip: '0.0.0.0',
                        age: 26,
                      },
                      event_type: '$identify',
                      time: 1571043797562,
                      user_id: '123456',
                      session_id: -1,
                      country: 'India',
                      city: 'kolkata',
                      ip: '0.0.0.0',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 51',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Sample track event BEFORE IDENTIFY1**',
              sentAt: '2020-09-17T15:07:13.171Z',
              userId: '0572f78fa49c648e',
              channel: 'mobile',
              context: {
                device: {
                  brand: 'testBrand',
                  manufacturer: 'testManufacturer',
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                app: {
                  name: 'AMTestProject',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                },
                locale: 'en-US',
                screen: {
                  width: 1080,
                  height: 2088,
                  density: 440,
                },
                traits: {
                  id: '0572f78fa49c648e',
                  userId: '0572f78fa49c648e',
                  address: {},
                  company: {},
                  anonymousId: '0572f78fa49c648e',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.4',
                },
                network: {
                  wifi: true,
                  carrier: 'Android',
                  cellular: true,
                  bluetooth: false,
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              messageId: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
              anonymousId: '0572f78fa49c648e',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-17T15:07:03.515Z',
            },
            destination: {
              Config: {
                mapDeviceBrand: true,
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '9',
                      device_manufacturer: 'testManufacturer',
                      device_brand: 'testBrand',
                      device_id: '0572f78fa49c648e',
                      carrier: 'Android',
                      app_name: 'AMTestProject',
                      app_version: '1.0',
                      language: 'en-US',
                      insert_id: '1600355223510-93e866a7-dc74-4256-a5f4-a41f54532466',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        id: '0572f78fa49c648e',
                        userId: '0572f78fa49c648e',
                        address: {},
                        company: {},
                        anonymousId: '0572f78fa49c648e',
                      },
                      event_type: 'Sample track event BEFORE IDENTIFY1**',
                      user_id: '0572f78fa49c648e',
                      time: 1600355223515,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '0572f78fa49c648e',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 52',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              userId: 'identified user id',
              anonymousId: 'anon-id-new',
              event: 'Screen View',
              channel: 'web',
              properties: {
                prop1: '5',
              },
              context: {
                ip: '14.5.67.21',
                device: {
                  brand: 'testBrand',
                  manufacturer: 'testManufacturer',
                },
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                mapDeviceBrand: true,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_manufacturer: 'testManufacturer',
                      device_brand: 'testBrand',
                      device_id: 'anon-id-new',
                      event_properties: {
                        prop1: '5',
                        name: 'Screen View',
                      },
                      user_properties: {},
                      event_type: 'Viewed Screen View Screen',
                      user_id: 'identified user id',
                      time: 1580602989544,
                      session_id: -1,
                      ip: '14.5.67.21',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 53',
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
                externalId: [
                  {
                    id: 'lynnanderson@smith.net',
                    identifierType: 'device_id',
                    type: 'AM-users',
                  },
                ],
                mappedToDestination: 'true',
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
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                    os_version: 'test os',
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
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              traits: {
                anonymousId: '123456',
                email: 'test@rudderstack.com',
                city: 'kolkata',
                address: {
                  country: 'India',
                  postalCode: 712136,
                  state: 'WB',
                  street: '',
                },
                os_version: 'test os',
                ip: '0.0.0.0',
                age: 26,
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              jobId: 2,
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                residencyServer: 'EU',
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
              endpoint: 'https://api.eu.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: 'test os',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: 'lynnanderson@smith.net',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      insert_id: '84e26acc-56a5-4835-8233-591137fca468',
                      ip: '0.0.0.0',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        anonymousId: '123456',
                        email: 'test@rudderstack.com',
                        postalCode: 712136,
                        state: 'WB',
                        street: '',
                        ip: '0.0.0.0',
                        age: 26,
                        device_id: 'lynnanderson@smith.net',
                      },
                      event_type: '$identify',
                      time: 1571043797562,
                      user_id: '123456',
                      session_id: -1,
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            metadata: {
              jobId: 2,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 54',
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
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'group',
              messageId: 'e5034df0-a404-47b4-a463-76df99934fea',
              originalTimestamp: '2020-10-20T07:54:58.983Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'sampleusrRudder3',
              integrations: {
                All: true,
              },
              groupId: 'Sample_groupId23',
              traits: {
                KEY_3: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                KEY_2: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                name_trait: 'Company',
                value_trait: 'ABC',
              },
              sentAt: '2020-10-20T07:54:58.983Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'name_trait',
                groupValueTrait: 'value_trait',
                residencyServer: 'EU',
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
              endpoint: 'https://api.eu.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '85.0.4183.121',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: 'my-anonymous-id-new',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.1.5',
                      language: 'en-US',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        utm_source: 'google',
                        utm_medium: 'medium',
                        utm_term: 'keyword',
                        utm_content: 'some content',
                        utm_name: 'some campaign',
                        utm_test: 'other value',
                        Company: 'ABC',
                      },
                      event_type: '$identify',
                      groups: {
                        Company: 'ABC',
                      },
                      time: 1603180498983,
                      user_id: 'sampleusrRudder3',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.eu.amplitude.com/groupidentify',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  api_key: 'abcde',
                  identification: [
                    '{"group_type":"Company","group_value":"ABC","group_properties":{"KEY_3":{"CHILD_KEY_92":"value_95","CHILD_KEY_102":"value_103"},"KEY_2":{"CHILD_KEY_92":"value_95","CHILD_KEY_102":"value_103"},"name_trait":"Company","value_trait":"ABC"}}',
                  ],
                },
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 55',
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
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'alias',
              messageId: 'dd46338d-5f83-493b-bd28-3b48f55d0be8',
              originalTimestamp: '2020-10-20T08:14:28.778Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'newUserIdAlias',
              integrations: {
                All: true,
              },
              previousId: 'sampleusrRudder3',
              sentAt: '2020-10-20T08:14:28.778Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                residencyServer: 'EU',
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
              endpoint: 'https://api.eu.amplitude.com/usermap',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  api_key: 'abcde',
                  mapping: [
                    '{"global_user_id":"newUserIdAlias","user_id":"sampleusrRudder3","user_properties":{"initial_referrer":"https://docs.rudderstack.com","initial_referring_domain":"docs.rudderstack.com","utm_source":"google","utm_medium":"medium","utm_term":"keyword","utm_content":"some content","utm_name":"some campaign","utm_test":"other value"}}',
                  ],
                },
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 56',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'App_Opened',
              sentAt: '2021-11-17T19:13:52.106Z',
              userId: 'ab419c3a-47ce-11ec-82ac-16a1bb813a59',
              channel: 'mobile',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                },
                locale: 'en-US',
                network: {
                  carrier: 'T-Mobile',
                },
                location: {
                  country: 'United States',
                  city: 'San Francisco',
                  latitude: '37.7672319',
                  longitude: '-122.4021353',
                  dma: 'San Francisco-Oakland-San Jose, CA',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
                os: {
                  name: 'Android',
                  version: '11',
                },
                app: {
                  version: '2.6.0 v3',
                },
                device: {
                  type: 'Android',
                  model: 'SM-A025M',
                  manufacturer: 'samsung',
                },
              },
              messageId: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                externalID: '1637170658229-3961832492194264209',
              },
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 3,
                },
              },
              originalTimestamp: '2021-11-17T19:13:51.143Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      event_id: 3,
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        externalID: '1637170658229-3961832492194264209',
                      },
                      event_type: 'App_Opened',
                      user_id: 'ab419c3a-47ce-11ec-82ac-16a1bb813a59',
                      device_brand: 'samsung',
                      time: 1597383030118,
                      session_id: -1,
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'United States',
                      city: 'San Francisco',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
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
    name: 'am',
    description: 'Test 57',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'App_Opened',
              sentAt: '2021-11-17T19:13:52.106Z',
              userId: 'ab419c3a-47ce-11ec-82ac-16a1bb813a59',
              channel: 'mobile',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                },
                locale: 'en-US',
                network: {
                  carrier: 'T-Mobile',
                },
                location: {
                  country: 'United States',
                  city: 'San Francisco',
                  latitude: '37.7672319',
                  longitude: '-122.4021353',
                  dma: 'San Francisco-Oakland-San Jose, CA',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
                os: {
                  name: 'Android',
                  version: '11',
                },
                app: {
                  version: '2.6.0 v3',
                },
                device: {
                  type: 'Android',
                  model: 'SM-A025M',
                  manufacturer: 'samsung',
                },
              },
              messageId: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                externalID: '1637170658229-3961832492194264209',
              },
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 0,
                },
              },
              originalTimestamp: '2021-11-17T19:13:51.143Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      event_id: 0,
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        externalID: '1637170658229-3961832492194264209',
                      },
                      event_type: 'App_Opened',
                      user_id: 'ab419c3a-47ce-11ec-82ac-16a1bb813a59',
                      device_brand: 'samsung',
                      time: 1597383030118,
                      session_id: -1,
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'United States',
                      city: 'San Francisco',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
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
    name: 'am',
    description: 'Test 58',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'App_Opened',
              sentAt: '2021-11-17T19:13:52.106Z',
              userId: 'ab419c3a-47ce-11ec-82ac-16a1bb813a59',
              channel: 'mobile',
              context: {
                source: 'test',
                traits: {
                  anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                },
                locale: 'en-US',
                network: {
                  carrier: 'T-Mobile',
                },
                location: {
                  country: 'United States',
                  city: 'San Francisco',
                  latitude: '37.7672319',
                  longitude: '-122.4021353',
                  dma: 'San Francisco-Oakland-San Jose, CA',
                },
                library: {
                  name: 'rudder-sdk-ruby-sync',
                  version: '1.0.6',
                },
                os: {
                  name: 'Android',
                  version: '11',
                },
                app: {
                  version: '2.6.0 v3',
                },
                device: {
                  type: 'Android',
                  model: 'SM-A025M',
                  manufacturer: 'samsung',
                },
              },
              messageId: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                externalID: '1637170658229-3961832492194264209',
              },
              integrations: {
                All: true,
                Amplitude: {
                  event_id: '0',
                },
              },
              originalTimestamp: '2021-11-17T19:13:51.143Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                trackProductsOnce: true,
                trackRevenuePerProduct: false,
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '11',
                      device_model: 'SM-A025M',
                      device_manufacturer: 'samsung',
                      platform: 'Android',
                      carrier: 'T-Mobile',
                      app_version: '2.6.0 v3',
                      language: 'en-US',
                      insert_id: '7208abb6-2c4e-45bb-bf5b-aa426f3593a2',
                      user_properties: {
                        anonymousId: '50be5c78-6c3f-4b60-be84-97805a31aaa1',
                        address: {
                          postalCode: 712136,
                          state: 'WB',
                          street: '',
                        },
                      },
                      event_properties: {
                        externalID: '1637170658229-3961832492194264209',
                      },
                      event_type: 'App_Opened',
                      user_id: 'ab419c3a-47ce-11ec-82ac-16a1bb813a59',
                      device_brand: 'samsung',
                      time: 1597383030118,
                      session_id: -1,
                      location_lat: '37.7672319',
                      location_lng: '-122.4021353',
                      dma: 'San Francisco-Oakland-San Jose, CA',
                      country: 'United States',
                      city: 'San Francisco',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
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
    name: 'am',
    description: 'Test 59',
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
                externalId: [
                  {
                    id: 'lynnanderson@smith.net',
                    identifierType: 'device_id',
                    type: 'AM-users',
                  },
                ],
                mappedToDestination: 'true',
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
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                    os_version: 'test os',
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
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              traits: {
                anonymousId: '123456',
                email: 'test@rudderstack.com',
                city: 'kolkata',
                address: {
                  country: 'India',
                  postalCode: 712136,
                  state: 'WB',
                  street: '',
                },
                os_version: 'test os',
                ip: '0.0.0.0',
                age: 26,
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 6,
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              jobId: 2,
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: 'test os',
                      device_model: 'Mac',
                      platform: 'Web',
                      event_id: 6,
                      device_id: 'lynnanderson@smith.net',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      insert_id: '84e26acc-56a5-4835-8233-591137fca468',
                      ip: '0.0.0.0',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        anonymousId: '123456',
                        email: 'test@rudderstack.com',
                        postalCode: 712136,
                        state: 'WB',
                        street: '',
                        ip: '0.0.0.0',
                        age: 26,
                        device_id: 'lynnanderson@smith.net',
                      },
                      event_type: '$identify',
                      time: 1571043797562,
                      user_id: '123456',
                      session_id: -1,
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            metadata: {
              jobId: 2,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 60',
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
                externalId: [
                  {
                    id: 'lynnanderson@smith.net',
                    identifierType: 'device_id',
                    type: 'AM-users',
                  },
                ],
                mappedToDestination: 'true',
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
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                    os_version: 'test os',
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
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              traits: {
                anonymousId: '123456',
                email: 'test@rudderstack.com',
                city: 'kolkata',
                address: {
                  country: 'India',
                  postalCode: 712136,
                  state: 'WB',
                  street: '',
                },
                os_version: 'test os',
                ip: '0.0.0.0',
                age: 26,
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 6,
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              jobId: 2,
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: 'test os',
                      device_model: 'Mac',
                      platform: 'Web',
                      event_id: 6,
                      device_id: 'lynnanderson@smith.net',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      insert_id: '84e26acc-56a5-4835-8233-591137fca468',
                      ip: '0.0.0.0',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        anonymousId: '123456',
                        email: 'test@rudderstack.com',
                        postalCode: 712136,
                        state: 'WB',
                        street: '',
                        ip: '0.0.0.0',
                        age: 26,
                        device_id: 'lynnanderson@smith.net',
                      },
                      event_type: '$identify',
                      time: 1571043797562,
                      user_id: '123456',
                      session_id: -1,
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            metadata: {
              jobId: 2,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 61',
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
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'group',
              messageId: 'e5034df0-a404-47b4-a463-76df99934fea',
              originalTimestamp: '2020-10-20T07:54:58.983Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'sampleusrRudder3',
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 3,
                },
              },
              groupId: 'Sample_groupId23',
              traits: {
                KEY_3: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                KEY_2: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                name_trait: 'Company',
                value_trait: 'ABC',
              },
              sentAt: '2020-10-20T07:54:58.983Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'name_trait',
                groupValueTrait: 'value_trait',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '85.0.4183.121',
                      device_model: 'Mac',
                      platform: 'Web',
                      event_id: 3,
                      device_id: 'my-anonymous-id-new',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.1.5',
                      language: 'en-US',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        utm_source: 'google',
                        utm_medium: 'medium',
                        utm_term: 'keyword',
                        utm_content: 'some content',
                        utm_name: 'some campaign',
                        utm_test: 'other value',
                        Company: 'ABC',
                      },
                      event_type: '$identify',
                      groups: {
                        Company: 'ABC',
                      },
                      time: 1603180498983,
                      user_id: 'sampleusrRudder3',
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api2.amplitude.com/groupidentify',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  api_key: 'abcde',
                  identification: [
                    '{"group_type":"Company","group_value":"ABC","group_properties":{"KEY_3":{"CHILD_KEY_92":"value_95","CHILD_KEY_102":"value_103"},"KEY_2":{"CHILD_KEY_92":"value_95","CHILD_KEY_102":"value_103"},"name_trait":"Company","value_trait":"ABC"}}',
                  ],
                },
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 62',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              userId: 'identified user id',
              anonymousId: 'anon-id-new',
              event: 'Screen View',
              properties: {
                prop1: '5',
                event_id: 7,
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 7,
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      event_id: 7,
                      device_id: 'anon-id-new',
                      event_properties: {
                        prop1: '5',
                        event_id: 7,
                        name: 'Screen View',
                      },
                      user_properties: {},
                      event_type: 'Viewed Screen View Screen',
                      user_id: 'identified user id',
                      time: 1580602989544,
                      session_id: -1,
                      ip: '14.5.67.21',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
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
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              request_ip: '1.1.1.1',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/destinations/amplitude',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/amplitude',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 2,
                },
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '00000000000000000000000000',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      event_type: 'Viewed ApplicationLoaded Page',
                      event_properties: {
                        path: '/destinations/amplitude',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'https://docs.rudderstack.com/destinations/amplitude',
                        category: 'destination',
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        name: 'ApplicationLoaded',
                      },
                      insert_id: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                      ip: '1.1.1.1',
                      event_id: 2,
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        email: 'test@rudderstack.com',
                        anonymousId: '12345',
                      },
                      user_id: '12345',
                      time: 1571051718299,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '00000000000000000000000000',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
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
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'alias',
              messageId: 'dd46338d-5f83-493b-bd28-3b48f55d0be8',
              originalTimestamp: '2020-10-20T08:14:28.778Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'newUserIdAlias',
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 67,
                },
              },
              previousId: 'sampleusrRudder3',
              sentAt: '2020-10-20T08:14:28.778Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/usermap',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  api_key: 'abcde',
                  mapping: [
                    '{"global_user_id":"newUserIdAlias","user_id":"sampleusrRudder3","event_id":67,"user_properties":{"initial_referrer":"https://docs.rudderstack.com","initial_referring_domain":"docs.rudderstack.com","utm_source":"google","utm_medium":"medium","utm_term":"keyword","utm_content":"some content","utm_name":"some campaign","utm_test":"other value"}}',
                  ],
                },
              },
              files: {},
              userId: 'my-anonymous-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 65',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d205961641ee6c5',
              channel: 'mobile',
              context: {
                app: {
                  build: '6',
                  name: 'Sample Kotlin',
                  namespace: 'com.example.testapp1mg',
                  version: '1.2',
                },
                device: {
                  id: '5d205961641ee6c5',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'Android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.7.0',
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
                  version: '7.1.1',
                },
                screen: {
                  density: 440,
                  height: 2148,
                  width: 1080,
                },
                sessionId: '1662393792',
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d205961641ee6c5',
                  id: 'User Android',
                  userId: 'User Android',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 7.1.1; Android SDK built for x86 Build/NYC)',
              },
              event: 'Screen event',
              integrations: {
                All: true,
              },
              messageId: '1662393883248-509420bf-b812-4f8d-bdb2-8c811bfde87f',
              properties: {
                name: 'Screen event',
              },
              originalTimestamp: '2022-09-05T16:04:43.250Z',
              type: 'screen',
              userId: 'User Android',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '7.1.1',
                      device_model: 'Android SDK built for x86',
                      device_manufacturer: 'Google',
                      device_id: '5d205961641ee6c5',
                      carrier: 'Android',
                      app_name: 'Sample Kotlin',
                      app_version: '1.2',
                      platform: 'Android',
                      language: 'en-US',
                      event_properties: {
                        name: 'Screen event',
                      },
                      insert_id: '1662393883248-509420bf-b812-4f8d-bdb2-8c811bfde87f',
                      user_properties: {
                        anonymousId: '5d205961641ee6c5',
                        id: 'User Android',
                        userId: 'User Android',
                      },
                      event_type: 'Viewed Screen event Screen',
                      user_id: 'User Android',
                      device_brand: 'Google',
                      time: 1662393883250,
                      session_id: 1662393792,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '5d205961641ee6c5',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 66',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d205961641ee6c5',
              channel: 'mobile',
              context: {
                app: {
                  build: '6',
                  name: 'Sample Kotlin',
                  namespace: 'com.example.testapp1mg',
                  version: '1.2',
                },
                device: {
                  id: '5d205961641ee6c5',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'Android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.7.0',
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
                  version: '7.1.1',
                },
                screen: {
                  density: 440,
                  height: 2148,
                  width: 1080,
                },
                sessionId: '1662393792',
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d205961641ee6c5',
                  id: 'User Android',
                  userId: 'User Android',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 7.1.1; Android SDK built for x86 Build/NYC)',
              },
              integrations: {
                All: true,
              },
              messageId: '1662393883248-509420bf-b812-4f8d-bdb2-8c811bfde87f',
              properties: {},
              originalTimestamp: '2022-09-05T16:04:43.250Z',
              type: 'screen',
              userId: 'User Android',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '7.1.1',
                      device_model: 'Android SDK built for x86',
                      device_manufacturer: 'Google',
                      device_id: '5d205961641ee6c5',
                      carrier: 'Android',
                      app_name: 'Sample Kotlin',
                      app_version: '1.2',
                      platform: 'Android',
                      language: 'en-US',
                      event_properties: {},
                      insert_id: '1662393883248-509420bf-b812-4f8d-bdb2-8c811bfde87f',
                      user_properties: {
                        anonymousId: '5d205961641ee6c5',
                        id: 'User Android',
                        userId: 'User Android',
                      },
                      event_type: 'Viewed  Screen',
                      user_id: 'User Android',
                      device_brand: 'Google',
                      time: 1662393883250,
                      session_id: 1662393792,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '5d205961641ee6c5',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 67',
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
                externalId: [
                  {
                    id: 'lynnanderson@smith.net',
                    identifierType: 'device_id',
                    type: 'AM-users',
                  },
                ],
                mappedToDestination: 'true',
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
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                    os_version: 'test os',
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
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                sessionId: '1662393792',
              },
              traits: {
                anonymousId: '123456',
                email: 'test@rudderstack.com',
                city: 'kolkata',
                address: {
                  country: 'India',
                  postalCode: 712136,
                  state: 'WB',
                  street: '',
                },
                os_version: 'test os',
                ip: '0.0.0.0',
                age: 26,
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: 'test os',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: 'lynnanderson@smith.net',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      insert_id: '84e26acc-56a5-4835-8233-591137fca468',
                      ip: '0.0.0.0',
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        anonymousId: '123456',
                        email: 'test@rudderstack.com',
                        postalCode: 712136,
                        state: 'WB',
                        street: '',
                        ip: '0.0.0.0',
                        age: 26,
                        device_id: 'lynnanderson@smith.net',
                      },
                      event_type: '$identify',
                      time: 1571043797562,
                      user_id: '123456',
                      session_id: 1662393792,
                      country: 'India',
                      city: 'kolkata',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '123456',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 68',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d205961641ee6c5',
              channel: 'mobile',
              context: {
                app: {
                  build: '6',
                  name: 'Sample Kotlin',
                  namespace: 'com.example.testapp1mg',
                  version: '1.2',
                },
                device: {
                  id: '5d205961641ee6c5',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'Android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.7.0',
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
                  version: '7.1.1',
                },
                screen: {
                  density: 440,
                  height: 2148,
                  width: 1080,
                },
                sessionId: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5d205961641ee6c5',
                  id: 'User Android',
                  userId: 'User Android',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 7.1.1; Android SDK built for x86 Build/NYC)',
              },
              event: 'Screen event',
              integrations: {
                All: true,
              },
              messageId: '1662393883248-509420bf-b812-4f8d-bdb2-8c811bfde87f',
              properties: {
                name: 'Screen event',
              },
              originalTimestamp: '2022-09-05T16:04:43.250Z',
              type: 'screen',
              userId: 'User Android',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Android',
                      os_version: '7.1.1',
                      device_model: 'Android SDK built for x86',
                      device_manufacturer: 'Google',
                      device_id: '5d205961641ee6c5',
                      carrier: 'Android',
                      app_name: 'Sample Kotlin',
                      app_version: '1.2',
                      platform: 'Android',
                      language: 'en-US',
                      event_properties: {
                        name: 'Screen event',
                      },
                      insert_id: '1662393883248-509420bf-b812-4f8d-bdb2-8c811bfde87f',
                      user_properties: {
                        anonymousId: '5d205961641ee6c5',
                        id: 'User Android',
                        userId: 'User Android',
                      },
                      event_type: 'Viewed Screen event Screen',
                      user_id: 'User Android',
                      device_brand: 'Google',
                      time: 1662393883250,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '5d205961641ee6c5',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 69: ERROR - Either of user ID or device ID fields must be specified',
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
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'group',
              messageId: 'e5034df0-a404-47b4-a463-76df99934fea',
              originalTimestamp: '2020-10-20T07:54:58.983Z',
              integrations: {
                All: true,
              },
              groupId: 'Sample_groupId23',
              traits: {
                KEY_3: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                KEY_2: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                name_trait: 'Company',
                value_trait: 'ABC',
              },
              sentAt: '2020-10-20T07:54:58.983Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                groupTypeTrait: 'name_trait',
                groupValueTrait: 'value_trait',
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
            error: 'Either of user ID or device ID fields must be specified',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AM',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 70',
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
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              request_ip: '1.1.1.1',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/destinations/amplitude',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/amplitude',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 2,
                },
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                useUserDefinedPageEventName: true,
                userProvidedPageEventString: 'My custom Page Name is {{ name }} . Custom Name.',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '00000000000000000000000000',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      event_type: 'My custom Page Name is ApplicationLoaded . Custom Name.',
                      event_properties: {
                        path: '/destinations/amplitude',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'https://docs.rudderstack.com/destinations/amplitude',
                        category: 'destination',
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        name: 'ApplicationLoaded',
                      },
                      insert_id: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                      ip: '1.1.1.1',
                      event_id: 2,
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        email: 'test@rudderstack.com',
                        anonymousId: '12345',
                      },
                      user_id: '12345',
                      time: 1571051718299,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '00000000000000000000000000',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 71',
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
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              request_ip: '1.1.1.1',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/destinations/amplitude',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/amplitude',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 2,
                },
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                useUserDefinedPageEventName: true,
                userProvidedPageEventString: '{{name}}',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '00000000000000000000000000',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      event_type: 'ApplicationLoaded',
                      event_properties: {
                        path: '/destinations/amplitude',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'https://docs.rudderstack.com/destinations/amplitude',
                        category: 'destination',
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        name: 'ApplicationLoaded',
                      },
                      insert_id: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                      ip: '1.1.1.1',
                      event_id: 2,
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        email: 'test@rudderstack.com',
                        anonymousId: '12345',
                      },
                      user_id: '12345',
                      time: 1571051718299,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '00000000000000000000000000',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 72',
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
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              request_ip: '1.1.1.1',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/destinations/amplitude',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/amplitude',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 2,
                },
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                useUserDefinedPageEventName: true,
                userProvidedPageEventString: '',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '00000000000000000000000000',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      event_type: 'ApplicationLoaded',
                      event_properties: {
                        path: '/destinations/amplitude',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'https://docs.rudderstack.com/destinations/amplitude',
                        category: 'destination',
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        name: 'ApplicationLoaded',
                      },
                      insert_id: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                      ip: '1.1.1.1',
                      event_id: 2,
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        email: 'test@rudderstack.com',
                        anonymousId: '12345',
                      },
                      user_id: '12345',
                      time: 1571051718299,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '00000000000000000000000000',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 73',
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
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: 'Home Page',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              request_ip: '1.1.1.1',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/destinations/amplitude',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/amplitude',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              integrations: {
                All: true,
                Amplitude: {
                  event_id: 2,
                },
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                useUserDefinedPageEventName: false,
                userProvidedPageEventString: 'Viewed {{context.page.title}} event.',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      os_name: 'Chrome',
                      os_version: '77.0.3865.90',
                      device_model: 'Mac',
                      platform: 'Web',
                      device_id: '00000000000000000000000000',
                      app_name: 'RudderLabs JavaScript SDK',
                      app_version: '1.0.0',
                      language: 'en-US',
                      event_properties: {
                        path: '/destinations/amplitude',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'https://docs.rudderstack.com/destinations/amplitude',
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                      },
                      insert_id: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                      ip: '1.1.1.1',
                      event_id: 2,
                      user_properties: {
                        initial_referrer: 'https://docs.rudderstack.com',
                        initial_referring_domain: 'docs.rudderstack.com',
                        email: 'test@rudderstack.com',
                        anonymousId: '12345',
                      },
                      event_type: 'Viewed  Page',
                      user_id: '12345',
                      time: 1571051718299,
                      session_id: -1,
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '00000000000000000000000000',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 74',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              userId: 'identified user id',
              anonymousId: 'anon-id-new',
              event: 'Screen View',
              properties: {
                prop1: '5',
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                useUserDefinedScreenEventName: true,
                userProvidedScreenEventString: 'My {{ event }} event.',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: 'anon-id-new',
                      event_properties: {
                        prop1: '5',
                        name: 'Screen View',
                      },
                      user_properties: {},
                      event_type: 'My Screen View event.',
                      user_id: 'identified user id',
                      time: 1580602989544,
                      session_id: -1,
                      ip: '14.5.67.21',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 75',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              userId: 'identified user id',
              anonymousId: 'anon-id-new',
              event: 'Screen View',
              properties: {
                prop1: '5',
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                useUserDefinedScreenEventName: false,
                userProvidedScreenEventString: 'My {{ event }} event.',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: 'anon-id-new',
                      event_properties: {
                        prop1: '5',
                        name: 'Screen View',
                      },
                      user_properties: {},
                      event_type: 'Viewed Screen View Screen',
                      user_id: 'identified user id',
                      time: 1580602989544,
                      session_id: -1,
                      ip: '14.5.67.21',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 76',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              userId: 'identified user id',
              anonymousId: 'anon-id-new',
              event: 'Screen same as event',
              properties: {
                prop1: '5',
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                useUserDefinedScreenEventName: true,
                userProvidedScreenEventString: '{{ event }}',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: 'anon-id-new',
                      event_properties: {
                        prop1: '5',
                        name: 'Screen same as event',
                      },
                      user_properties: {},
                      event_type: 'Screen same as event',
                      user_id: 'identified user id',
                      time: 1580602989544,
                      session_id: -1,
                      ip: '14.5.67.21',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 77',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              userId: 'identified user id',
              anonymousId: 'anon-id-new',
              name: 'Screen',
              properties: {
                prop1: '5',
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                apiKey: 'abcde',
                useUserDefinedScreenEventName: true,
                userProvidedScreenEventString: '',
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
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  api_key: 'abcde',
                  events: [
                    {
                      device_id: 'anon-id-new',
                      event_properties: {
                        prop1: '5',
                        name: 'Screen',
                      },
                      user_properties: {},
                      event_type: 'Screen',
                      user_id: 'identified user id',
                      time: 1580602989544,
                      session_id: -1,
                      ip: '14.5.67.21',
                      library: 'rudderstack',
                    },
                  ],
                  options: {
                    min_id_length: 1,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon-id-new',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
