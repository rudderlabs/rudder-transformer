/**
 * Test data for Survicate track events
 * Tests event tracking functionality
 */

type ProcessorTestData = {
  name: string;
  description?: string;
  feature?: string;
  module?: string;
  version?: string;
  input?: any;
  output?: any;
};

export const data: ProcessorTestData[] = [
  {
    name: 'survicate',
    description: 'Complete track event with nested properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              messageId: '04a303b1-a466-4e66-9022-2a24edaca4fc',
              originalTimestamp: '2020-04-22T08:06:20.338Z',
              sentAt: '2020-04-22T08:06:20.338Z',
              userId: 'my-user-id',
              anonymousId: '21b43de4-3b9b-423f-b51f-794eae31fc03',
              channel: 'web',
              event: 'Product Purchased',
              properties: {
                order_ID: '1',
                category: 'boots',
                product_name: 'new_boots',
                price: 60,
                currency: 'USD',
                product: {
                  sku: 'SKU-123',
                  vendor: {
                    name: 'Vendor Inc.',
                    region: 'North America',
                  },
                },
              },
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                traits: {
                  name: 'User name',
                  email: 'user@domain.com',
                  plan: 'Enterprise',
                  company: {
                    id: 'company-A',
                  },
                  createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 1.600000023841858,
                },
                page: {
                  path: '/tests/html/script-test.html',
                  referrer: 'http://localhost:1111/tests/html/',
                  search: '',
                  title: '',
                  url: 'http://localhost:1111/tests/html/script-test.html',
                },
              },
              integrations: {
                All: true,
              },
            },
            destination: {
              ID: 'survicate-dest-id',
              Name: 'Survicate',
              DestinationDefinition: {
                Config: {},
              },
              Config: {
                destinationKey: 'test-destination-key-12345',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  userId: 'my-user-id',
                  event: 'Product Purchased',
                  properties: {
                    order_ID: '1',
                    category: 'boots',
                    product_name: 'new_boots',
                    price: 60,
                    currency: 'USD',
                    product_sku: 'SKU-123',
                    product_vendor_name: 'Vendor Inc.',
                    product_vendor_region: 'North America',
                  },
                  timestamp: '2020-04-22T08:06:20.338Z',
                  messageId: '04a303b1-a466-4e66-9022-2a24edaca4fc',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://integrations.survicate.com/endpoint/rudder_stack/track',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'test-destination-key-12345',
              },
              params: {},
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'survicate',
    description: 'Track event without event name - should fail',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              messageId: 'msg-no-event',
              userId: 'user-123',
              properties: {
                amount: 100,
              },
            },
            destination: {
              ID: 'survicate-dest-id',
              Name: 'Survicate',
              DestinationDefinition: {
                Config: {},
              },
              Config: {
                destinationKey: 'test-key',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error: 'event name is required for track events.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'survicate',
    description: 'Anonymous track event - should fail',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              anonymousId: 'anon-456',
              messageId: 'msg-anon-track',
              event: 'Purchase',
              properties: {
                amount: 150,
              },
            },
            destination: {
              ID: 'survicate-dest-id',
              Name: 'Survicate',
              DestinationDefinition: {
                Config: {},
              },
              Config: {
                destinationKey: 'test-key',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error: 'Anonymous track calls are not supported. userId is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'survicate',
    description: 'Track event with simple properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              messageId: 'msg-simple',
              originalTimestamp: '2020-04-22T08:06:20.338Z',
              userId: 'user-123',
              event: 'Page View',
              properties: {
                page: '/checkout',
                referrer: '/home',
              },
            },
            destination: {
              ID: 'survicate-dest-id',
              Name: 'Survicate',
              DestinationDefinition: {
                Config: {},
              },
              Config: {
                destinationKey: 'test-key',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  userId: 'user-123',
                  event: 'Page View',
                  properties: {
                    page: '/checkout',
                    referrer: '/home',
                  },
                  timestamp: '2020-04-22T08:06:20.338Z',
                  messageId: 'msg-simple',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.survicate.com/v1/events/track',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'test-key',
              },
              params: {},
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
