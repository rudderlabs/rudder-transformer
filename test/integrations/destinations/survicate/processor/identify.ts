/**
 * Test data for Survicate identify events
 * Tests identification of users with traits and attributes
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
    description: 'Complete identify event with nested traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              messageId: '508d5e8c-96e4-4301-bd46-1890dba5c866',
              originalTimestamp: '2020-04-22T08:06:20.337Z',
              sentAt: '2020-04-22T08:06:20.337Z',
              userId: 'my-user-id',
              anonymousId: '21b43de4-3b9b-423f-b51f-794eae31fc03',
              channel: 'web',
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
                  name: 'User name',
                  email: 'user@domain.com',
                  plan: 'Enterprise',
                  company_id: 'company-A',
                  createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  context: {
                    locale: 'en-US',
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                  },
                  timestamp: '2020-04-22T08:06:20.337Z',
                  messageId: '508d5e8c-96e4-4301-bd46-1890dba5c866',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.survicate.com/v1/users/identify',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <destination-key>',
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
    description: 'Identify event with deeply nested attributes',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              messageId: 'msg-456',
              originalTimestamp: '2020-04-22T08:06:20.337Z',
              userId: 'user-456',
              context: {
                traits: {
                  name: 'John Doe',
                  subscription: {
                    plan: {
                      tier: 'pro',
                      renewal: {
                        date: '2025-12-01',
                      },
                    },
                  },
                },
                locale: 'en-GB',
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
                  userId: 'user-456',
                  name: 'John Doe',
                  subscription_plan_tier: 'pro',
                  subscription_plan_renewal_date: '2025-12-01',
                  context: {
                    locale: 'en-GB',
                  },
                  timestamp: '2020-04-22T08:06:20.337Z',
                  messageId: 'msg-456',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.survicate.com/v1/users/identify',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <destination-key>',
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
    description: 'Anonymous identify event - should fail',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              anonymousId: '21b43de4-3b9b-423f-b51f-794eae31fc03',
              messageId: 'msg-anonymous',
              context: {
                traits: {
                  email: 'user@example.com',
                },
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
            error: 'Anonymous identify calls are not supported. userId is required.',
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
];
