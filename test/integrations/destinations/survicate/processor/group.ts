/**
 * Test data for Survicate group events
 * Tests group association functionality
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
    description: 'Complete group event with nested traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  nested_settings_notifications: true,
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
              endpoint: 'https://integrations.survicate.com/endpoint/rudder-stack/group',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <destination-key>',
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
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              endpoint: 'https://integrations.survicate.com/endpoint/rudder-stack/group',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <destination-key>',
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
    description: 'Group event without group_id - should fail',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              messageId: 'msg-missing-group_id',
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
            error: 'group_id is required for group events.',
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
    description: 'Anonymous group event - should fail',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              anonymous_id: 'anon-123',
              groupId: 'company-B',
              messageId: 'msg-anon-group',
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
            error: 'Anonymous group calls are not supported. user_id is required.',
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
    description: 'Group event missing messageId - should fail',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
    description: 'Group event missing originalTimestamp - should fail',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
