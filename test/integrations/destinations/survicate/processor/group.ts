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
              anonymousId: '21b4-test-fc03',
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
                  userId: 'my-user-id',
                  groupId: 'company-A',
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
                  messageId: '0b0e-test-cafe',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://integrations.survicate.com/endpoint/rudder_stack/group',
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
    description: 'Group event without groupId - should fail',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              messageId: 'msg-missing-groupid',
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
            error: 'groupId is required for group events.',
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
              anonymousId: 'anon-123',
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
            error: 'Anonymous group calls are not supported. userId is required.',
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
