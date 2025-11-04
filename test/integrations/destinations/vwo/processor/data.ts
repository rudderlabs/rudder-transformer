import { ProcessorTestData } from '../../../testTypes';

export const data: ProcessorTestData[] = [
  {
    id: 'vwo-track-test-1',
    name: 'vwo',
    description: 'Track event with all properties',
    scenario: 'Business',
    successCriteria: 'Should create VWO offline conversion event successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              event: 'Product Purchased',
              userId: 'user123',
              anonymousId: 'anon123',
              properties: {
                product_id: 'prod_001',
                product_name: 'Premium Plan',
                price: 99.99,
                currency: 'USD',
                quantity: 1,
              },
              context: {
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '2.9.1',
                },
                userAgent: 'Mozilla/5.0',
              },
              timestamp: '2024-01-09T10:01:53.558Z',
              messageId: 'test-message-id-1',
            },
            destination: {
              ID: 'vwo-dest-id-1',
              Name: 'VWO',
              DestinationDefinition: {
                ID: '1',
                Name: 'VWO',
                DisplayName: 'VWO',
                Config: {},
              },
              Config: {
                accountId: 'test-account-123',
                region: 'DEFAULT',
              },
              Enabled: true,
              Transformations: [],
              WorkspaceID: 'test-workspace-1',
            },
            metadata: {
              destinationId: 'vwo-dest-id-1',
              workspaceId: 'test-workspace-1',
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
              endpoint:
                'https://dev.visualwebsiteoptimizer.com/events/t?en=rudderstack.track&a=test-account-123',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: {
                    msgId: 'user123-<timestampPlaceholder>',
                    visId: 'user123',
                    event: {
                      props: {
                        isCustomEvent: true,
                        vwoMeta: {
                          source: 'rudderstack',
                        },
                        product_id: 'prod_001',
                        product_name: 'Premium Plan',
                        price: 99.99,
                        currency: 'USD',
                        quantity: 1,
                        eventType: 'track',
                        eventName: 'Product Purchased',
                      },
                      name: 'rudderstack.track',
                      time: '<timestampPlaceholder>',
                    },
                    sessionId: '<sessionIdPlaceholder>',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon123',
            },
            metadata: {
              destinationId: 'vwo-dest-id-1',
              workspaceId: 'test-workspace-1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'vwo-track-test-2',
    name: 'vwo',
    description: 'Track event with EU region',
    scenario: 'Business',
    successCriteria: 'Should use EU endpoint for VWO offline conversion',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              userId: 'user456',
              properties: {
                order_id: 'order_123',
                total: 199.99,
              },
              timestamp: '2024-01-09T10:01:53.558Z',
              messageId: 'test-message-id-2',
            },
            destination: {
              ID: 'vwo-dest-id-2',
              Name: 'VWO',
              DestinationDefinition: {
                ID: '1',
                Name: 'VWO',
                DisplayName: 'VWO',
                Config: {},
              },
              Config: {
                accountId: 'test-account-456',
                region: 'EU',
              },
              Enabled: true,
              Transformations: [],
              WorkspaceID: 'test-workspace-1',
            },
            metadata: {
              destinationId: 'vwo-dest-id-2',
              workspaceId: 'test-workspace-1',
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
              endpoint:
                'https://dev.visualwebsiteoptimizer.com/eu01/events/t?en=rudderstack.track&a=test-account-456',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: {
                    msgId: 'user456-<timestampPlaceholder>',
                    visId: 'user456',
                    event: {
                      props: {
                        isCustomEvent: true,
                        vwoMeta: {
                          source: 'rudderstack',
                        },
                        order_id: 'order_123',
                        total: 199.99,
                        eventType: 'track',
                        eventName: 'Order Completed',
                      },
                      name: 'rudderstack.track',
                      time: '<timestampPlaceholder>',
                    },
                    sessionId: '<sessionIdPlaceholder>',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'vwo-dest-id-2',
              workspaceId: 'test-workspace-1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'vwo-track-test-3',
    name: 'vwo',
    description: 'Track event with AS region',
    scenario: 'Business',
    successCriteria: 'Should use AS endpoint for VWO offline conversion',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              event: 'Sign Up',
              anonymousId: 'anon789',
              properties: {
                plan: 'free',
              },
              timestamp: '2024-01-09T10:01:53.558Z',
              messageId: 'test-message-id-3',
            },
            destination: {
              ID: 'vwo-dest-id-3',
              Name: 'VWO',
              DestinationDefinition: {
                ID: '1',
                Name: 'VWO',
                DisplayName: 'VWO',
                Config: {},
              },
              Config: {
                accountId: 'test-account-789',
                region: 'AS',
              },
              Enabled: true,
              Transformations: [],
              WorkspaceID: 'test-workspace-1',
            },
            metadata: {
              destinationId: 'vwo-dest-id-3',
              workspaceId: 'test-workspace-1',
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
              endpoint:
                'https://dev.visualwebsiteoptimizer.com/as01/events/t?en=rudderstack.track&a=test-account-789',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: {
                    msgId: 'anon789-<timestampPlaceholder>',
                    visId: 'anon789',
                    event: {
                      props: {
                        isCustomEvent: true,
                        vwoMeta: {
                          source: 'rudderstack',
                        },
                        plan: 'free',
                        eventType: 'track',
                        eventName: 'Sign Up',
                      },
                      name: 'rudderstack.track',
                      time: '<timestampPlaceholder>',
                    },
                    sessionId: '<sessionIdPlaceholder>',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anon789',
            },
            metadata: {
              destinationId: 'vwo-dest-id-3',
              workspaceId: 'test-workspace-1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'vwo-error-test-1',
    name: 'vwo',
    description: 'Track event without event name',
    scenario: 'Business',
    successCriteria: 'Should throw instrumentation error for missing event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              userId: 'user999',
              properties: {
                test: 'value',
              },
              timestamp: '2024-01-09T10:01:53.558Z',
              messageId: 'test-message-id-4',
            },
            destination: {
              ID: 'vwo-dest-id-4',
              Name: 'VWO',
              DestinationDefinition: {
                ID: '1',
                Name: 'VWO',
                DisplayName: 'VWO',
                Config: {},
              },
              Config: {
                accountId: 'test-account-999',
                region: 'DEFAULT',
              },
              Enabled: true,
              Transformations: [],
              WorkspaceID: 'test-workspace-1',
            },
            metadata: {
              destinationId: 'vwo-dest-id-4',
              workspaceId: 'test-workspace-1',
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
              destinationId: 'vwo-dest-id-4',
              workspaceId: 'test-workspace-1',
            },
            statusCode: 400,
            error: 'Event name is required for track events',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'VWO',
              module: 'destination',
              implementation: 'native',
              destinationId: 'vwo-dest-id-4',
              workspaceId: 'test-workspace-1',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    id: 'vwo-error-test-2',
    name: 'vwo',
    description: 'Track event without userId or anonymousId',
    scenario: 'Business',
    successCriteria: 'Should throw instrumentation error for missing user identifier',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              event: 'Test Event',
              properties: {
                test: 'value',
              },
              timestamp: '2024-01-09T10:01:53.558Z',
              messageId: 'test-message-id-5',
            },
            destination: {
              ID: 'vwo-dest-id-5',
              Name: 'VWO',
              DestinationDefinition: {
                ID: '1',
                Name: 'VWO',
                DisplayName: 'VWO',
                Config: {},
              },
              Config: {
                accountId: 'test-account-999',
                region: 'DEFAULT',
              },
              Enabled: true,
              Transformations: [],
              WorkspaceID: 'test-workspace-1',
            },
            metadata: {
              destinationId: 'vwo-dest-id-5',
              workspaceId: 'test-workspace-1',
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
              destinationId: 'vwo-dest-id-5',
              workspaceId: 'test-workspace-1',
            },
            statusCode: 400,
            error: 'Either userId or anonymousId is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'VWO',
              module: 'destination',
              implementation: 'native',
              destinationId: 'vwo-dest-id-5',
              workspaceId: 'test-workspace-1',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    id: 'vwo-error-test-3',
    name: 'vwo',
    description: 'Identify event (unsupported event type)',
    scenario: 'Business',
    successCriteria: 'Should throw instrumentation error for unsupported event type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'identify',
              userId: 'user888',
              traits: {
                name: 'Test User',
                email: 'test@example.com',
              },
              timestamp: '2024-01-09T10:01:53.558Z',
              messageId: 'test-message-id-6',
            },
            destination: {
              ID: 'vwo-dest-id-6',
              Name: 'VWO',
              DestinationDefinition: {
                ID: '1',
                Name: 'VWO',
                DisplayName: 'VWO',
                Config: {},
              },
              Config: {
                accountId: 'test-account-888',
                region: 'DEFAULT',
              },
              Enabled: true,
              Transformations: [],
              WorkspaceID: 'test-workspace-1',
            },
            metadata: {
              destinationId: 'vwo-dest-id-6',
              workspaceId: 'test-workspace-1',
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
              destinationId: 'vwo-dest-id-6',
              workspaceId: 'test-workspace-1',
            },
            statusCode: 400,
            error: 'Event type "identify" is not supported. Only track events are supported.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'VWO',
              module: 'destination',
              implementation: 'native',
              destinationId: 'vwo-dest-id-6',
              workspaceId: 'test-workspace-1',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    id: 'vwo-error-test-4',
    name: 'vwo',
    description: 'Track event without account ID',
    scenario: 'Business',
    successCriteria: 'Should throw configuration error for missing account ID',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              event: 'Test Event',
              userId: 'user777',
              properties: {
                test: 'value',
              },
              timestamp: '2024-01-09T10:01:53.558Z',
              messageId: 'test-message-id-7',
            },
            destination: {
              ID: 'vwo-dest-id-7',
              Name: 'VWO',
              DestinationDefinition: {
                ID: '1',
                Name: 'VWO',
                DisplayName: 'VWO',
                Config: {},
              },
              Config: {
                region: 'DEFAULT',
              },
              Enabled: true,
              Transformations: [],
              WorkspaceID: 'test-workspace-1',
            },
            metadata: {
              destinationId: 'vwo-dest-id-7',
              workspaceId: 'test-workspace-1',
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
              destinationId: 'vwo-dest-id-7',
              workspaceId: 'test-workspace-1',
            },
            statusCode: 400,
            error: 'Account ID is required but not provided',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'VWO',
              module: 'destination',
              implementation: 'native',
              destinationId: 'vwo-dest-id-7',
              workspaceId: 'test-workspace-1',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
];

