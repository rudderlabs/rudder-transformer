export const data = [
  {
    name: 'stormly',
    description: 'Identify call without userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              ID: 'stormly123',
            },
            message: {
              type: 'identify',
              context: {
                traits: {
                  name: 'John Doe',
                  email: 'johndoe@gmail.com',
                  age: 25,
                },
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              originalTimestamp: '2022-01-20T13:39:21.032Z',
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
            error: 'Missing required value from "userIdOnly"',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'STORMLY',
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
    name: 'stormly',
    description: 'Identify call with userId, traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              ID: 'stormly123',
            },
            message: {
              type: 'identify',
              sentAt: '2022-01-20T13:39:21.033Z',
              channel: 'web',
              userId: '5136633649',
              context: {
                traits: {
                  name: 'John Doe',
                  email: 'johndoe@gmail.com',
                  age: 25,
                },
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              originalTimestamp: '2022-01-20T13:39:21.032Z',
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
              endpoint: 'https://rudderstack.t.stormly.com/webhook/rudderstack/identify',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  userId: '5136633649',
                  timestamp: '2022-01-20T13:39:21.032Z',
                  traits: {
                    name: 'John Doe',
                    email: 'johndoe@gmail.com',
                    age: 25,
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
    name: 'stormly',
    description: 'Track call without userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              ID: 'stormly123',
            },
            message: {
              type: 'track',
              event: 'Product Reviewed',
              properties: {
                review_id: '12345',
                product_id: '123',
                rating: 3,
                review_body: 'Average product, expected much more.',
                groupId: '91Yb32830',
              },
              context: {},
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              originalTimestamp: '2022-01-20T13:39:21.032Z',
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
            error: 'Missing required value from "userIdOnly"',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'STORMLY',
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
    name: 'stormly',
    description: 'Track call without groupId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              ID: 'stormly123',
            },
            message: {
              type: 'track',
              event: 'Product Reviewed',
              userId: '5136633649',
              properties: {
                review_id: '12345',
                product_id: '123',
                rating: 3,
                review_body: 'Average product, expected much more.',
              },
              context: {},
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              originalTimestamp: '2022-01-20T13:39:21.032Z',
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
              endpoint: 'https://rudderstack.t.stormly.com/webhook/rudderstack/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  userId: '5136633649',
                  event: 'Product Reviewed',
                  properties: {
                    review_id: '12345',
                    product_id: '123',
                    rating: 3,
                    review_body: 'Average product, expected much more.',
                  },
                  timestamp: '2022-01-20T13:39:21.032Z',
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
    name: 'stormly',
    description: 'Track call without properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              ID: 'stormly123',
            },
            message: {
              type: 'track',
              event: 'Product Reviewed',
              userId: '5136633649',
              context: {},
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              originalTimestamp: '2022-01-20T13:39:21.032Z',
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
              endpoint: 'https://rudderstack.t.stormly.com/webhook/rudderstack/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  userId: '5136633649',
                  event: 'Product Reviewed',
                  timestamp: '2022-01-20T13:39:21.032Z',
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
    name: 'stormly',
    description: 'Track call with userId, groupId and properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              ID: 'stormly123',
            },
            message: {
              type: 'track',
              event: 'Product Reviewed',
              userId: '5136633649',
              properties: {
                review_id: '12345',
                product_id: '123',
                rating: 3,
                review_body: 'Average product, expected much more.',
                groupId: '91Yb32830',
              },
              context: {},
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              originalTimestamp: '2022-01-20T13:39:21.032Z',
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
              endpoint: 'https://rudderstack.t.stormly.com/webhook/rudderstack/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  userId: '5136633649',
                  event: 'Product Reviewed',
                  properties: {
                    review_id: '12345',
                    product_id: '123',
                    rating: 3,
                    review_body: 'Average product, expected much more.',
                  },
                  timestamp: '2022-01-20T13:39:21.032Z',
                  context: {
                    groupId: '91Yb32830',
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
    name: 'stormly',
    description: 'Track call with userId, groupId (from externalId) and properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              ID: 'stormly123',
            },
            message: {
              type: 'track',
              event: 'Product Reviewed',
              userId: '5136633649',
              properties: {
                review_id: '12345',
                product_id: '123',
                rating: 3,
                review_body: 'Average product, expected much more.',
                groupId: 'test-12345',
              },
              context: {
                externalId: [
                  {
                    type: 'stormlyGroupId',
                    id: '91Yb32830',
                  },
                ],
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              originalTimestamp: '2022-01-20T13:39:21.032Z',
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
              endpoint: 'https://rudderstack.t.stormly.com/webhook/rudderstack/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  userId: '5136633649',
                  event: 'Product Reviewed',
                  properties: {
                    review_id: '12345',
                    product_id: '123',
                    rating: 3,
                    review_body: 'Average product, expected much more.',
                  },
                  timestamp: '2022-01-20T13:39:21.032Z',
                  context: {
                    groupId: '91Yb32830',
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
    name: 'stormly',
    description: 'Group call with userId, groupId and traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
              ID: 'stormly123',
            },
            message: {
              type: 'group',
              userId: '5136633649',
              traits: {
                name: 'Initech',
                employees: 500,
                headquarters: 'Redwood City, California, United States',
                ceo: 'John Doe',
                revenue: 70000000,
                currency: 'USD',
                groupId: '9230AUbd2138h',
              },
              context: {},
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              originalTimestamp: '2022-01-20T13:39:21.032Z',
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
              endpoint: 'https://rudderstack.t.stormly.com/webhook/rudderstack/group',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  userId: '5136633649',
                  groupId: '9230AUbd2138h',
                  timestamp: '2022-01-20T13:39:21.032Z',
                  traits: {
                    name: 'Initech',
                    employees: 500,
                    headquarters: 'Redwood City, California, United States',
                    ceo: 'John Doe',
                    revenue: 70000000,
                    currency: 'USD',
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
];
