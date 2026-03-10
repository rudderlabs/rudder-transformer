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
              message_id: '0b0e-test-cafe',
              originalTimestamp: '2025-11-07T10:15:00.000Z',
              sentAt: '2025-11-07T10:15:02.000Z',
              user_id: 'my-user-id',
              group_id: 'company-A',
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
              message_id: 'msg-missing-group_id',
              user_id: 'user-123',
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
              group_id: 'company-B',
              message_id: 'msg-anon-group',
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
];
