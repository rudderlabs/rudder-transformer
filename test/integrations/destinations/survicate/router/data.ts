/**
 * Router test data for Survicate destination
 * Tests all event types (identify, group, track) in router format
 */

type RouterTestData = {
  name: string;
  description?: string;
  feature?: string;
  module?: string;
  version?: string;
  input?: any;
  output?: any;
};

export const data: RouterTestData[] = [
  {
    name: 'survicate',
    description: 'Router Test: Multiple identify events in batch',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'msg-1',
                userId: 'user-1',
                originalTimestamp: '2020-04-22T08:06:20.337Z',
                context: {
                  traits: {
                    name: 'User 1',
                    email: 'user1@example.com',
                  },
                  locale: 'en-US',
                },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: {
                  Config: {},
                },
                Config: {
                  destinationKey: 'test-key-123',
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              message: {
                type: 'identify',
                messageId: 'msg-2',
                userId: 'user-2',
                originalTimestamp: '2020-04-22T08:06:20.337Z',
                context: {
                  traits: {
                    name: 'User 2',
                    email: 'user2@example.com',
                    company: {
                      id: 'comp-2',
                    },
                  },
                  locale: 'en-GB',
                },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: {
                  Config: {},
                },
                Config: {
                  destinationKey: 'test-key-123',
                },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
        },
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
                  user_id: 'user-1',
                  name: 'User 1',
                  email: 'user1@example.com',
                  context: {
                    locale: 'en-US',
                  },
                  timestamp: '2020-04-22T08:06:20.337Z',
                  message_id: 'msg-1',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/identify',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key-123',
              },
              params: {},
              files: {},
              user_id: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
          {
            output: {
              body: {
                JSON: {
                  user_id: 'user-2',
                  name: 'User 2',
                  email: 'user2@example.com',
                  company: { id: 'comp-2' },
                  context: {
                    locale: 'en-GB',
                  },
                  timestamp: '2020-04-22T08:06:20.337Z',
                  message_id: 'msg-2',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/identify',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key-123',
              },
              params: {},
              files: {},
              user_id: '',
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
    description: 'Router Test: Mixed event types in batch',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'msg-identify',
                userId: 'user-123',
                originalTimestamp: '2020-04-22T08:06:20.337Z',
                context: {
                  traits: {
                    name: 'John Doe',
                  },
                },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
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
            },
            {
              message: {
                type: 'track',
                messageId: 'msg-track',
                userId: 'user-123',
                event: 'Purchase',
                originalTimestamp: '2020-04-22T08:06:21.337Z',
                properties: {
                  amount: 100,
                },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
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
            },
            {
              message: {
                type: 'group',
                messageId: 'msg-group',
                userId: 'user-123',
                groupId: 'group-456',
                originalTimestamp: '2020-04-22T08:06:22.337Z',
                traits: {
                  name: 'Company ABC',
                },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
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
            },
          ],
        },
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
                  user_id: 'user-123',
                  name: 'John Doe',
                  timestamp: '2020-04-22T08:06:20.337Z',
                  message_id: 'msg-identify',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/identify',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
          {
            output: {
              body: {
                JSON: {
                  user_id: 'user-123',
                  event: 'Purchase',
                  properties: {
                    amount: 100,
                  },
                  timestamp: '2020-04-22T08:06:21.337Z',
                  message_id: 'msg-track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
          {
            output: {
              body: {
                JSON: {
                  user_id: 'user-123',
                  group_id: 'group-456',
                  name: 'Company ABC',
                  timestamp: '2020-04-22T08:06:22.337Z',
                  message_id: 'msg-group',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/group',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
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
    description: 'Incoming snake_case keys are normalized',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                message_id: 'snake-1',
                user_id: 'user-snake',
                originalTimestamp: '2021-05-05T05:05:05.000Z',
                context: { traits: { foo: 'bar' } },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
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
            },
          ],
        },
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
                  user_id: 'user-snake',
                  foo: 'bar',
                  timestamp: '2021-05-05T05:05:05.000Z',
                  message_id: 'snake-1',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/identify',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
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
    description: 'Reserved keys in context.traits should not overwrite canonical fields',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'msg-reserved',
                userId: 'user-reserved',
                originalTimestamp: '2021-01-01T00:00:00.000Z',
                context: {
                  traits: {
                    user_id: 'bad',
                    userId: 'bad2',
                    group_id: 'bad',
                    groupId: 'bad2',
                    timestamp: 'bad',
                    originalTimestamp: 'bad2',
                    message_id: 'bad',
                    messageId: 'bad2',
                    extra: 'value1',
                  },
                },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
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
            },
            {
              message: {
                type: 'group',
                messageId: 'msg-res-g',
                userId: 'user-reserved',
                groupId: 'group-reserved',
                originalTimestamp: '2021-01-01T01:00:00.000Z',
                traits: {
                  foo: 'bar',
                },
                context: {
                  traits: {
                    user_id: 'override',
                    userId: 'override2',
                    group_id: 'override',
                    groupId: 'override2',
                    timestamp: 'override',
                    originalTimestamp: 'override2',
                    message_id: 'override',
                    messageId: 'override2',
                    other: 'value2',
                  },
                },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
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
            },
          ],
        },
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
                  user_id: 'user-reserved',
                  extra: 'value1',
                  timestamp: '2021-01-01T00:00:00.000Z',
                  message_id: 'msg-reserved',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/identify',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
          {
            output: {
              body: {
                JSON: {
                  user_id: 'user-reserved',
                  group_id: 'group-reserved',
                  foo: 'bar',
                  other: 'value2',
                  timestamp: '2021-01-01T01:00:00.000Z',
                  message_id: 'msg-res-g',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/group',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
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
    description: 'Track events include filtered context properties and traits',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: 'msg-track2',
                userId: 'user-track',
                event: 'Clicked',
                originalTimestamp: '2022-02-02T02:02:02.000Z',
                properties: { foo: 'bar' },
                context: {
                  traits: {
                    alice: 'wonderland',
                    user_id: 'should-not',
                    timestamp: 'nope',
                  },
                  locale: 'fr-FR',
                  campaign: { id: 'cmp-123' },
                  userAgent: 'UA-1',
                },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
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
            },
          ],
        },
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
                  user_id: 'user-track',
                  event: 'Clicked',
                  properties: {
                    foo: 'bar',
                    alice: 'wonderland',
                  },
                  timestamp: '2022-02-02T02:02:02.000Z',
                  message_id: 'msg-track2',
                  context: {
                    locale: 'fr-FR',
                    campaign: { id: 'cmp-123' },
                    userAgent: 'UA-1',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
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
  // audit field validation
  {
    name: 'survicate',
    description: 'Missing messageId results in validation error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                userId: 'user-noid',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
                context: { traits: { name: 'Alice' } },
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 400,
            error: 'messageId is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
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
    description: 'Missing userId results in validation error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'no-id',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 400,
            error: 'Anonymous identify calls are not supported. userId is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
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
    description: 'Missing originalTimestamp results in validation error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: 'msg-no-ts',
                userId: 'user-nots',
                event: 'Test',
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 400,
            error: 'originalTimestamp is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },

  // ─── Identify ─────────────────────────────────────────────────────────────

  {
    name: 'survicate',
    description: 'Complete identify event with nested traits',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: '508d5e8c-96e4-4301-bd46-1890dba5c866',
                originalTimestamp: '2020-04-22T08:06:20.337Z',
                sentAt: '2020-04-22T08:06:20.337Z',
                userId: 'my-user-id',
                anonymous_id: '21b43de4-3b9b-423f-b51f-794eae31fc03',
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
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                JSON: {
                  user_id: 'my-user-id',
                  name: 'User name',
                  email: 'user@domain.com',
                  plan: 'Enterprise',
                  company: { id: 'company-A' },
                  createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  context: {
                    locale: 'en-US',
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                  },
                  timestamp: '2020-04-22T08:06:20.337Z',
                  message_id: '508d5e8c-96e4-4301-bd46-1890dba5c866',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/identify',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-destination-key-12345',
              },
              params: {},
              files: {},
              user_id: '',
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
    description: 'Identify using snake_case keys',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                message_id: 'snake-2',
                user_id: 'user-snake2',
                originalTimestamp: '2022-02-02T02:02:02.000Z',
                context: { traits: { x: 'y' } },
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            },
          ],
        },
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
                  user_id: 'user-snake2',
                  x: 'y',
                  timestamp: '2022-02-02T02:02:02.000Z',
                  message_id: 'snake-2',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/identify',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
            },
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'survicate',
    description: 'Identify event with deeply nested attributes',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
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
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                JSON: {
                  user_id: 'user-456',
                  name: 'John Doe',
                  subscription: {
                    plan: {
                      tier: 'pro',
                      renewal: {
                        date: '2025-12-01',
                      },
                    },
                  },
                  context: {
                    locale: 'en-GB',
                  },
                  timestamp: '2020-04-22T08:06:20.337Z',
                  message_id: 'msg-456',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/identify',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
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
    description: 'Identify event missing messageId - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                originalTimestamp: '2021-01-01T00:00:00.000Z',
                userId: 'user-1',
                context: { traits: { foo: 'bar' } },
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 400,
            error: 'messageId is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
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
    description: 'Identify event missing originalTimestamp - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'msg-missing-ts',
                userId: 'user-2',
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 400,
            error: 'originalTimestamp is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
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
    description: 'Anonymous identify event - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                anonymous_id: '21b43de4-3b9b-423f-b51f-794eae31fc03',
                message_id: 'msg-anonymous',
                originalTimestamp: '2024-01-01T00:00:00.000Z',
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
              feature: 'router',
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
    description: 'Identify event missing userId - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'no-id',
                originalTimestamp: '2024-01-01T00:00:00.000Z',
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
              feature: 'router',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },

  // ─── Group ────────────────────────────────────────────────────────────────

  {
    name: 'survicate',
    description: 'Complete group event with nested traits',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                messageId: '0b0e-test-cafe',
                originalTimestamp: '2025-11-07T10:15:00.000Z',
                sentAt: '2025-11-07T10:15:02.000Z',
                userId: 'my-user-id',
                groupId: 'company-A',
                anonymous_id: '21b4-test-fc03',
                traits: {
                  name: 'Acme Inc.',
                  industry: 'SaaS',
                  employees: 1200,
                  plan: 'Enterprise',
                  nested: {
                    settings: {
                      notifications: true,
                    },
                  },
                },
                context: {
                  locale: 'en-US',
                  campaign: {
                    name: 'autumn',
                    source: 'referral',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36',
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
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                JSON: {
                  user_id: 'my-user-id',
                  group_id: 'company-A',
                  name: 'Acme Inc.',
                  industry: 'SaaS',
                  employees: 1200,
                  plan: 'Enterprise',
                  nested: {
                    settings: {
                      notifications: true,
                    },
                  },
                  context: {
                    locale: 'en-US',
                    campaign: {
                      name: 'autumn',
                      source: 'referral',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36',
                  },
                  timestamp: '2025-11-07T10:15:00.000Z',
                  message_id: '0b0e-test-cafe',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/group',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-destination-key-12345',
              },
              params: {},
              files: {},
              user_id: '',
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
    description: 'Group event with snake_case keys',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                message_id: 'snake-group',
                user_id: 'user-snake-group',
                group_id: 'company-S',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
                traits: { name: 'Snake Corp' },
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            },
          ],
        },
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
                  user_id: 'user-snake-group',
                  group_id: 'company-S',
                  name: 'Snake Corp',
                  timestamp: '2023-01-01T00:00:00.000Z',
                  message_id: 'snake-group',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/group',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
            },
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'survicate',
    description: 'Group event without groupId - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                messageId: 'msg-missing-group_id',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
                userId: 'user-123',
                traits: {
                  name: 'Company Name',
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
            error: 'groupId is required for group events.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
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
    description: 'Anonymous group event - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                anonymous_id: 'anon-123',
                groupId: 'company-B',
                messageId: 'msg-anon-group',
                originalTimestamp: '2024-01-01T00:00:00.000Z',
                traits: {
                  name: 'Company B',
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
            error: 'Anonymous group calls are not supported. userId is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
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
    description: 'Group event missing messageId - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                userId: 'user-1',
                groupId: 'company-X',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 400,
            error: 'messageId is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
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
    description: 'Group event missing originalTimestamp - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                messageId: 'msg-missing-ts',
                userId: 'user-2',
                groupId: 'company-Y',
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 400,
            error: 'originalTimestamp is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },

  // ─── Track ────────────────────────────────────────────────────────────────

  {
    name: 'survicate',
    description: 'Complete track event with nested properties',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: '04a303b1-a466-4e66-9022-2a24edaca4fc',
                originalTimestamp: '2020-04-22T08:06:20.338Z',
                sentAt: '2020-04-22T08:06:20.338Z',
                userId: 'my-user-id',
                anonymous_id: '21b43de4-3b9b-423f-b51f-794eae31fc03',
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
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                JSON: {
                  user_id: 'my-user-id',
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
                    name: 'User name',
                    email: 'user@domain.com',
                    plan: 'Enterprise',
                    company: { id: 'company-A' },
                    createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  },
                  timestamp: '2020-04-22T08:06:20.338Z',
                  message_id: '04a303b1-a466-4e66-9022-2a24edaca4fc',
                  context: {
                    locale: 'en-US',
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-destination-key-12345',
              },
              params: {},
              files: {},
              user_id: '',
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
    description: 'Track event with snake_case keys',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                message_id: 'snake-track',
                user_id: 'user-snake-track',
                originalTimestamp: '2022-02-02T02:02:02.000Z',
                event: 'Clicked',
                properties: { foo: 'bar' },
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            },
          ],
        },
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
                  user_id: 'user-snake-track',
                  event: 'Clicked',
                  properties: { foo: 'bar' },
                  timestamp: '2022-02-02T02:02:02.000Z',
                  message_id: 'snake-track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
            },
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'survicate',
    description: 'Track event with simple properties',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
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
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                JSON: {
                  user_id: 'user-123',
                  event: 'Page View',
                  properties: {
                    page: '/checkout',
                    referrer: '/home',
                  },
                  timestamp: '2020-04-22T08:06:20.338Z',
                  message_id: 'msg-simple',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://hv.survicate.com/integrations/partners/rudder-stack/track',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-key',
              },
              params: {},
              files: {},
              user_id: '',
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
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: 'msg-no-event',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
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
              feature: 'router',
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
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                anonymous_id: 'anon-456',
                messageId: 'msg-anon-track',
                originalTimestamp: '2024-01-01T00:00:00.000Z',
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
              feature: 'router',
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
    description: 'Track event missing messageId - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
                userId: 'user-1',
                event: 'Test',
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 400,
            error: 'messageId is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
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
    description: 'Track event missing originalTimestamp - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: 'msg-missing-ts',
                userId: 'user-2',
                event: 'Test',
              },
              destination: {
                ID: 'survicate-dest-id',
                Name: 'Survicate',
                DestinationDefinition: { Config: {} },
                Config: { destinationKey: 'test-key' },
                Enabled: true,
                Transformations: [],
              },
              metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: { destinationId: 'destId', workspaceId: 'wspId' },
            statusCode: 400,
            error: 'originalTimestamp is required.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SURVICATE',
              module: 'destination',
              feature: 'router',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
];
