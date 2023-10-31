export const data = [
  {
    name: 'june',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
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
            error: 'Missing required value from "userIdOnly"',
            statTags: {
              destType: 'JUNE',
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
    name: 'june',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
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
              endpoint: 'https://api.june.so/api/identify',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic 93EMyDLvfpbRxxYn',
              },
              params: {},
              body: {
                JSON: {
                  anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
                  userId: '5136633649',
                  traits: {
                    name: 'John Doe',
                    email: 'johndoe@gmail.com',
                    age: 25,
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
    name: 'june',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
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
            error: 'Missing required value from "userIdOnly"',
            statTags: {
              destType: 'JUNE',
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
    name: 'june',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
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
              endpoint: 'https://api.june.so/api/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic 93EMyDLvfpbRxxYn',
              },
              params: {},
              body: {
                JSON: {
                  anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
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
    name: 'june',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
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
              endpoint: 'https://api.june.so/api/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic 93EMyDLvfpbRxxYn',
              },
              params: {},
              body: {
                JSON: {
                  anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
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
    name: 'june',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
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
              endpoint: 'https://api.june.so/api/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic 93EMyDLvfpbRxxYn',
              },
              params: {},
              body: {
                JSON: {
                  anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
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
    name: 'june',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
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
                    type: 'juneGroupId',
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
              endpoint: 'https://api.june.so/api/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic 93EMyDLvfpbRxxYn',
              },
              params: {},
              body: {
                JSON: {
                  anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
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
    name: 'june',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
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
              endpoint: 'https://api.june.so/api/group',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic 93EMyDLvfpbRxxYn',
              },
              params: {},
              body: {
                JSON: {
                  anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
                  userId: '5136633649',
                  groupId: '9230AUbd2138h',
                  traits: {
                    name: 'Initech',
                    employees: 500,
                    headquarters: 'Redwood City, California, United States',
                    ceo: 'John Doe',
                    revenue: 70000000,
                    currency: 'USD',
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
    name: 'june',
    description: 'should fail with no message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
            },
            message: {
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
            error: 'Event type is required',
            statTags: {
              destType: 'JUNE',
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
    name: 'june',
    description: 'should fail for alias message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
            },
            message: {
              type: 'alias',
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
            error: 'Event type "alias" is not supported',
            statTags: {
              destType: 'JUNE',
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
    name: 'june',
    description: 'should transform for page event with fully populated properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '93EMyDLvfpbRxxYn',
              },
              ID: 'june123',
            },
            message: {
              type: 'page',
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.june.so/api/page',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic 93EMyDLvfpbRxxYn',
              },
              params: {},
              body: {
                JSON: {
                  anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
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
];
