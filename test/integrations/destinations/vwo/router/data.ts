import { RouterTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';

export const data: RouterTestData[] = [
  {
    id: 'vwo-router-test-1',
    name: 'vwo',
    description: 'Basic router transformation with multiple track events',
    scenario: 'Business',
    successCriteria: 'Should batch multiple track events successfully',
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
                event: 'Product Viewed',
                userId: 'user001',
                properties: {
                  product_id: 'prod_001',
                  product_name: 'Widget',
                },
                timestamp: '2024-01-09T10:01:53.558Z',
                messageId: 'msg-001',
              },
              destination: {
                ID: 'vwo-dest-1',
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
              metadata: generateMetadata(1),
            },
            {
              message: {
                type: 'track',
                event: 'Product Added',
                userId: 'user002',
                properties: {
                  product_id: 'prod_002',
                  quantity: 2,
                },
                timestamp: '2024-01-09T10:02:53.558Z',
                messageId: 'msg-002',
              },
              destination: {
                ID: 'vwo-dest-1',
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
              metadata: generateMetadata(2),
            },
          ],
          destType: 'vwo',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
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
                      msgId: 'user001-<timestampPlaceholder>',
                      visId: 'user001',
                      event: {
                        props: {
                          isCustomEvent: true,
                          vwoMeta: {
                            source: 'rudderstack',
                          },
                          product_id: 'prod_001',
                          product_name: 'Widget',
                          eventType: 'track',
                          eventName: 'Product Viewed',
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
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination: {
                ID: 'vwo-dest-1',
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
            },
            {
              batchedRequest: {
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
                      msgId: 'user002-<timestampPlaceholder>',
                      visId: 'user002',
                      event: {
                        props: {
                          isCustomEvent: true,
                          vwoMeta: {
                            source: 'rudderstack',
                          },
                          product_id: 'prod_002',
                          quantity: 2,
                          eventType: 'track',
                          eventName: 'Product Added',
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
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 200,
              destination: {
                ID: 'vwo-dest-1',
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
            },
          ],
        },
      },
    },
  },
  {
    id: 'vwo-router-test-2',
    name: 'vwo',
    description: 'Router transformation with mixed valid and invalid events',
    scenario: 'Business',
    successCriteria: 'Should process valid events and return errors for invalid ones',
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
                event: 'Valid Event',
                userId: 'user003',
                properties: {
                  test: 'value',
                },
                timestamp: '2024-01-09T10:03:53.558Z',
                messageId: 'msg-003',
              },
              destination: {
                ID: 'vwo-dest-2',
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
              metadata: generateMetadata(1),
            },
            {
              message: {
                type: 'track',
                userId: 'user004',
                properties: {
                  test: 'value',
                },
                timestamp: '2024-01-09T10:04:53.558Z',
                messageId: 'msg-004',
              },
              destination: {
                ID: 'vwo-dest-2',
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
              metadata: generateMetadata(2),
            },
          ],
          destType: 'vwo',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
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
                      msgId: 'user003-<timestampPlaceholder>',
                      visId: 'user003',
                      event: {
                        props: {
                          isCustomEvent: true,
                          vwoMeta: {
                            source: 'rudderstack',
                          },
                          test: 'value',
                          eventType: 'track',
                          eventName: 'Valid Event',
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
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination: {
                ID: 'vwo-dest-2',
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
            },
            {
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 400,
              error: 'Event name is required for track events',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'VWO',
                module: 'destination',
                implementation: 'native',
                destinationId: 'vwo-dest-2',
                workspaceId: 'test-workspace-1',
                feature: 'router',
              },
              destination: {
                ID: 'vwo-dest-2',
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
            },
          ],
        },
      },
    },
  },
];

