export const data = [
  {
    name: 'sendinblue',
    description: 'Page call without email or phone',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'page',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              name: 'New Page',
              properties: {
                url: 'https://www.google.com/',
                title: 'Google home',
              },
              context: {
                traits: {},
                page: {
                  url: 'http://127.0.0.1:7307/Testing/test/ourSdk.html',
                  path: '/Testing/test/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/test/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/test/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
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
            error: 'At least one of `email` or `phone` is required',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description: 'Page call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'page',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              name: 'New Page',
              properties: {
                url: 'https://www.google.com/',
                title: 'Google home',
              },
              context: {
                traits: {
                  email: 'john_doe@example.com',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/test/ourSdk.html',
                  path: '/Testing/test/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/test/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/test/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                templateId: 3,
                doi: false,
                redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
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
                FORM: {},
                JSON: {
                  email: 'john_doe@example.com',
                  page: 'https://www.google.com/',
                  properties: {
                    ma_path: '/Testing/test/ourSdk.html',
                    ma_referrer: 'http://127.0.0.1:7307/Testing/test/',
                    ma_title: 'Google home',
                    sib_name: 'New Page',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://in-automate.sendinblue.com/api/v2/trackPage',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'ma-key': 'clientKey123',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sendinblue',
    description: 'Track call without email or phone',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              event: 'Order Completed',
              properties: {},
              context: {
                traits: {
                  first_name: 'John',
                  lastName: 'Doe',
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
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
            error: 'At least one of `email` or `phone` is required',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description: 'Track call without event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: {},
              context: {},
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
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
            error: 'Event name is required',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description: 'Track events with sendTraitsInTrack flag set to true',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              event: 'Order Completed',
              properties: {},
              context: {
                traits: {
                  first_name: 'John',
                  lastName: 'Doe',
                  age: 19,
                  email: 'john_doe@example.com',
                  phone: '+919876543210',
                  location: 'Mumbai',
                  role: 'SDE',
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
                sendTraitsInTrack: true,
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
                FORM: {},
                JSON: {
                  email: 'john_doe@example.com',
                  event: 'Order Completed',
                  eventdata: {},
                  properties: {
                    FIRSTNAME: 'John',
                    LASTNAME: 'Doe',
                    SMS: '+919876543210',
                    age: 19,
                    location: 'Mumbai',
                    role: 'SDE',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://in-automate.sendinblue.com/api/v2/trackEvent',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'ma-key': 'clientKey123',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sendinblue',
    description: 'Track events with contactAttributeMapping provided in webapp',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              event: 'Order Completed',
              properties: {},
              context: {
                traits: {
                  first_name: 'John',
                  lastName: 'Doe',
                  age: 19,
                  email: 'john_doe@example.com',
                  phone: '+919876543210',
                  location: 'Mumbai',
                  role: 'SDE',
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
                contactAttributeMapping: [
                  {
                    from: 'location',
                    to: 'LOCATION',
                  },
                ],
                sendTraitsInTrack: true,
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
                FORM: {},
                JSON: {
                  email: 'john_doe@example.com',
                  event: 'Order Completed',
                  eventdata: {},
                  properties: {
                    FIRSTNAME: 'John',
                    LASTNAME: 'Doe',
                    LOCATION: 'Mumbai',
                    SMS: '+919876543210',
                    age: 19,
                    role: 'SDE',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://in-automate.sendinblue.com/api/v2/trackEvent',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'ma-key': 'clientKey123',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sendinblue',
    description: 'Track events with propertiesIdKey provided in integration object',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              event: 'Order Completed',
              properties: {
                orderId: '1341394-3812392190',
                products: [
                  {
                    product_id: 1234,
                    product_name: 'Track Pants',
                    amount: 1,
                    price: 220,
                  },
                  {
                    product_id: 5768,
                    product_name: 'T-Shirt',
                    amount: 5,
                    price: 1058,
                  },
                ],
              },
              context: {
                traits: {
                  first_name: 'John',
                  lastName: 'Doe',
                  age: 19,
                  email: 'john_doe@example.com',
                  phone: '+919876543210',
                  location: 'Mumbai',
                  role: 'SDE',
                },
              },
              integrations: {
                All: true,
                sendinblue: {
                  propertiesIdKey: 'orderId',
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
                contactAttributeMapping: [
                  {
                    from: 'location',
                    to: 'LOCATION',
                  },
                ],
                sendTraitsInTrack: true,
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
                FORM: {},
                JSON: {
                  email: 'john_doe@example.com',
                  event: 'Order Completed',
                  eventdata: {
                    data: {
                      orderId: '1341394-3812392190',
                      products: [
                        {
                          amount: 1,
                          price: 220,
                          product_id: 1234,
                          product_name: 'Track Pants',
                        },
                        {
                          amount: 5,
                          price: 1058,
                          product_id: 5768,
                          product_name: 'T-Shirt',
                        },
                      ],
                    },
                    id: '1341394-3812392190',
                  },
                  properties: {
                    FIRSTNAME: 'John',
                    LASTNAME: 'Doe',
                    LOCATION: 'Mumbai',
                    SMS: '+919876543210',
                    age: 19,
                    role: 'SDE',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://in-automate.sendinblue.com/api/v2/trackEvent',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'ma-key': 'clientKey123',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sendinblue',
    description: 'Track events with eventdata.id taken from messageId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              event: 'Order Completed',
              properties: {
                orderId: '1341394-3812392190',
                products: [
                  {
                    product_id: 1234,
                    product_name: 'Track Pants',
                    amount: 1,
                    price: 220,
                  },
                  {
                    product_id: 5768,
                    product_name: 'T-Shirt',
                    amount: 5,
                    price: 1058,
                  },
                ],
              },
              context: {
                traits: {
                  first_name: 'John',
                  lastName: 'Doe',
                  age: 19,
                  email: 'john_doe@example.com',
                  phone: '+919876543210',
                  location: 'Mumbai',
                  role: 'SDE',
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
                contactAttributeMapping: [
                  {
                    from: 'location',
                    to: 'LOCATION',
                  },
                ],
                sendTraitsInTrack: true,
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
                FORM: {},
                JSON: {
                  email: 'john_doe@example.com',
                  event: 'Order Completed',
                  eventdata: {
                    data: {
                      orderId: '1341394-3812392190',
                      products: [
                        {
                          amount: 1,
                          price: 220,
                          product_id: 1234,
                          product_name: 'Track Pants',
                        },
                        {
                          amount: 5,
                          price: 1058,
                          product_id: 5768,
                          product_name: 'T-Shirt',
                        },
                      ],
                    },
                    id: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                  },
                  properties: {
                    FIRSTNAME: 'John',
                    LASTNAME: 'Doe',
                    LOCATION: 'Mumbai',
                    SMS: '+919876543210',
                    age: 19,
                    role: 'SDE',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://in-automate.sendinblue.com/api/v2/trackEvent',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'ma-key': 'clientKey123',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sendinblue',
    description: 'Track link without email or phone',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              event: 'trackLink',
              properties: {
                link: 'https://www.google.com/gmail/',
                emailCount: 19,
              },
              context: {
                traits: {},
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
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
            error: 'At least one of `email` or `phone` is required',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description: 'Track link without link',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              event: 'trackLink',
              properties: {},
              context: {
                traits: {
                  phone: '+919507545089',
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
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
            error: 'Missing required value from "properties.link"',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description: 'Track link',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              event: 'trackLink',
              properties: {
                link: 'https://www.google.com/gmail/',
                emailCount: 19,
              },
              context: {
                traits: {
                  phone: '+919507545089',
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
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
                FORM: {},
                JSON: {
                  email: '919507545089@mailin-sms.com',
                  link: 'https://www.google.com/gmail/',
                  properties: {
                    emailCount: 19,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://in-automate.sendinblue.com/api/v2/trackLink',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'ma-key': 'clientKey123',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sendinblue',
    description: 'Identify call with invalid email',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              traits: {
                email: 'abc.com',
              },
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
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
            error: 'The provided email is invalid',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description: 'Identify call with invalid phone number',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              traits: {
                phone: '99999999',
              },
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
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
            error: 'The provided phone number is invalid',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description: 'Identify call to create or update a contact without email or phone',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
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
            error: 'At least one of `email` or `phone` is required',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description: 'Identify call to create or update a contact',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              traits: {
                first_name: 'John',
                lastName: 'Doe',
                age: 19,
                email: 'john_doe@example.com',
                phone: '+919876543210',
                location: 'Mumbai',
                newEmail: 'alex_root@example.com',
                role: 'SDE',
              },
              context: {
                externalId: [
                  {
                    type: 'sendinblueIncludeListIds',
                    id: [1, 2],
                  },
                ],
              },
              integrations: {
                All: true,
                sendinblue: {
                  emailBlacklisted: true,
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
                contactAttributeMapping: [
                  {
                    from: 'location',
                    to: 'LOCATION',
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
              body: {
                FORM: {},
                JSON: {
                  attributes: {
                    FIRSTNAME: 'John',
                    LASTNAME: 'Doe',
                    LOCATION: 'Mumbai',
                    SMS: '+919876543210',
                    EMAIL: 'alex_root@example.com',
                    age: 19,
                    role: 'SDE',
                  },
                  email: 'john_doe@example.com',
                  emailBlacklisted: true,
                  listIds: [1, 2],
                  updateEnabled: true,
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.sendinblue.com/v3/contacts',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'api-key': 'apiKey123',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sendinblue',
    description: 'Identify call to create DOI contact with templatedId from externalId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              traits: {
                first_name: 'John',
                lastName: 'Doe',
                age: 19,
                email: 'john_doe@example.com',
                phone: '+919876543210',
                location: 'Mumbai',
                role: 'SDE',
              },
              context: {
                externalId: [
                  {
                    type: 'sendinblueIncludeListIds',
                    id: [1, 2],
                  },
                  {
                    type: 'sendinblueUnlinkListIds',
                    id: [5],
                  },
                  {
                    type: 'sendinblueTemplateId',
                    id: 2,
                  },
                ],
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                templateId: 3,
                doi: true,
                redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
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
                FORM: {},
                JSON: {
                  attributes: {
                    FIRSTNAME: 'John',
                    LASTNAME: 'Doe',
                    SMS: '+919876543210',
                    age: 19,
                    location: 'Mumbai',
                    role: 'SDE',
                  },
                  email: 'john_doe@example.com',
                  includeListIds: [1, 2],
                  redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
                  templateId: 3,
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.sendinblue.com/v3/contacts/doubleOptinConfirmation',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'api-key': 'apiKey123',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sendinblue',
    description: 'Identify call to create DOI contact without include list Ids',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              traits: {
                first_name: 'John',
                lastName: 'Doe',
                age: 19,
                email: 'john_doe@example.com',
                phone: '+919876543210',
                location: 'Mumbai',
                role: 'SDE',
              },
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                templateId: 3,
                doi: true,
                redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
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
            error: 'sendinblueIncludeListIds is required to create a contact using DOI',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description: 'Identify call to create DOI contact without template Id',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              traits: {
                first_name: 'John',
                lastName: 'Doe',
                age: 19,
                email: 'john_doe@example.com',
                phone: '+919876543210',
                location: 'Mumbai',
                role: 'SDE',
              },
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: true,
                redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
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
            error: 'templateId is required to create a contact using DOI',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description: 'Identify call to update a DOI contact without an email or contact ID',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              traits: {
                first_name: 'Gordon',
                lastName: 'Pittman',
                age: 19,
                location: 'Mumbai',
                role: 'SDE',
              },
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                templateId: 3,
                doi: true,
                redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
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
            error:
              'At least one of `email` or `contactId` is required to update the contact using DOI',
            statTags: {
              destType: 'SENDINBLUE',
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
    name: 'sendinblue',
    description:
      'Identify call to update a DOI contact using contactId as an Identifier and without include list Ids',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              traits: {
                age: 36,
                location: 'Mumbai',
                role: 'SDE 2',
              },
              context: {
                externalId: [
                  {
                    type: 'sendinblueContactId',
                    id: 42,
                  },
                ],
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                templateId: 3,
                doi: true,
                redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
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
                FORM: {},
                JSON: {
                  attributes: {
                    age: 36,
                    location: 'Mumbai',
                    role: 'SDE 2',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.sendinblue.com/v3/contacts/42',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'api-key': 'apiKey123',
              },
              method: 'PUT',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sendinblue',
    description:
      'Identify call to update a DOI contact using email as an Identifier and without include list Ids',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              traits: {
                age: 36,
                location: 'Mumbai',
                role: 'SDE 2',
                phone: '+918888888888',
                email: 'gordon_pittman@example.com',
                newEmail: 'gordon_pittman007@example.com',
              },
              context: {
                externalId: [
                  {
                    type: 'sendinblueIncludeListIds',
                    id: [1],
                  },
                  {
                    type: 'sendinblueUnlinkListIds',
                    id: [2],
                  },
                ],
              },
              integrations: {
                All: true,
                sendinblue: {
                  emailBlacklisted: true,
                  smsBlacklisted: false,
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                templateId: 3,
                doi: true,
                redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
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
                FORM: {},
                JSON: {
                  attributes: {
                    age: 36,
                    location: 'Mumbai',
                    role: 'SDE 2',
                    SMS: '+918888888888',
                    EMAIL: 'gordon_pittman007@example.com',
                  },
                  emailBlacklisted: true,
                  smsBlacklisted: false,
                  listIds: [1],
                  unlinkListIds: [2],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.sendinblue.com/v3/contacts/gordon_pittman%40example.com',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'api-key': 'apiKey123',
              },
              method: 'PUT',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sendinblue',
    description: 'Identify call to unlink a contact from given lists',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              traits: {
                email: 'eric_kim@example.com',
              },
              context: {
                externalId: [
                  {
                    type: 'sendinblueUnlinkListIds',
                    id: [2, 5],
                  },
                ],
              },
            },
            destination: {
              Config: {
                apiKey: 'apiKey123',
                clientKey: 'clientKey123',
                doi: false,
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
                FORM: {},
                JSON: {
                  emails: ['eric_kim@example.com'],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.sendinblue.com/v3/contacts/lists/2/contacts/remove',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'api-key': 'apiKey123',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
          {
            output: {
              body: {
                FORM: {},
                JSON: {
                  emails: ['eric_kim@example.com'],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.sendinblue.com/v3/contacts/lists/5/contacts/remove',
              files: {},
              headers: {
                'Content-Type': 'application/json',
                'api-key': 'apiKey123',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
