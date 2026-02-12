/**
 * Router test data for Survicate destination
 * Tests batch event processing
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
                  userId: 'user-1',
                  name: 'User 1',
                  email: 'user1@example.com',
                  context: {
                    locale: 'en-US',
                  },
                  timestamp: '2020-04-22T08:06:20.337Z',
                  messageId: 'msg-1',
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
                'X-API-Key': 'test-key-123',
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
          {
            output: {
              body: {
                JSON: {
                  userId: 'user-2',
                  name: 'User 2',
                  email: 'user2@example.com',
                  company_id: 'comp-2',
                  context: {
                    locale: 'en-GB',
                  },
                  timestamp: '2020-04-22T08:06:20.337Z',
                  messageId: 'msg-2',
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
                'X-API-Key': 'test-key-123',
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
                  userId: 'user-123',
                  name: 'John Doe',
                  timestamp: '2020-04-22T08:06:20.337Z',
                  messageId: 'msg-identify',
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
          {
            output: {
              body: {
                JSON: {
                  userId: 'user-123',
                  event: 'Purchase',
                  properties: {
                    amount: 100,
                  },
                  timestamp: '2020-04-22T08:06:21.337Z',
                  messageId: 'msg-track',
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
          {
            output: {
              body: {
                JSON: {
                  userId: 'user-123',
                  groupId: 'group-456',
                  name: 'Company ABC',
                  timestamp: '2020-04-22T08:06:22.337Z',
                  messageId: 'msg-group',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.survicate.com/v1/groups/associate',
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
