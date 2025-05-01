import { destType } from '../common';
import { secret1 } from '../maskedSecrets';
import { generateMetadata } from '../../../testUtils';

export const batched = [
  {
    id: 'dummy-batching-test-1',
    name: destType,
    description: 'Batching Test - Enabled',
    scenario: 'Business',
    successCriteria:
      'The response should correctly batch events based on the configured batch size',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  enableBatching: true,
                  maxBatchSize: '2',
                },
                DestinationDefinition: {
                  DisplayName: 'Dummy Destination',
                  ID: '123',
                  Name: 'DUMMY',
                  Config: {},
                },
                Enabled: true,
                ID: '123',
                Name: 'DUMMY',
                Transformations: [],
                WorkspaceID: 'test-workspace-id',
              },
              metadata: generateMetadata(1),
              message: {
                type: 'track',
                userId: 'test-user-id-1',
                anonymousId: 'test-anonymous-id-1',
                event: 'Test Event 1',
                properties: {
                  value: 100,
                  currency: 'USD',
                },
                messageId: 'test-message-id-1',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  enableBatching: true,
                  maxBatchSize: '2',
                },
                DestinationDefinition: {
                  DisplayName: 'Dummy Destination',
                  ID: '123',
                  Name: 'DUMMY',
                  Config: {},
                },
                Enabled: true,
                ID: '123',
                Name: 'DUMMY',
                Transformations: [],
                WorkspaceID: 'test-workspace-id',
              },
              metadata: generateMetadata(2),
              message: {
                type: 'track',
                userId: 'test-user-id-2',
                anonymousId: 'test-anonymous-id-2',
                event: 'Test Event 2',
                properties: {
                  value: 200,
                  currency: 'EUR',
                },
                messageId: 'test-message-id-2',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  enableBatching: true,
                  maxBatchSize: '2',
                },
                DestinationDefinition: {
                  DisplayName: 'Dummy Destination',
                  ID: '123',
                  Name: 'DUMMY',
                  Config: {},
                },
                Enabled: true,
                ID: '123',
                Name: 'DUMMY',
                Transformations: [],
                WorkspaceID: 'test-workspace-id',
              },
              metadata: generateMetadata(3),
              message: {
                type: 'track',
                userId: 'test-user-id-3',
                anonymousId: 'test-anonymous-id-3',
                event: 'Test Event 3',
                properties: {
                  value: 300,
                  currency: 'GBP',
                },
                messageId: 'test-message-id-3',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
          ],
          destType,
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
              metadata: [generateMetadata(1), generateMetadata(2)],
              destination: {
                Config: {
                  apiKey: secret1,
                  enableBatching: true,
                  maxBatchSize: '2',
                },
                DestinationDefinition: {
                  DisplayName: 'Dummy Destination',
                  ID: '123',
                  Name: 'DUMMY',
                  Config: {},
                },
                Enabled: true,
                ID: '123',
                Name: 'DUMMY',
                Transformations: [],
                WorkspaceID: 'test-workspace-id',
              },
              batched: true,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                params: {},
                endpoint: 'https://dummy-destination.example.com/api',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Dummy-Destination': 'true',
                },
                body: {
                  JSON: {
                    events: [
                      {
                        type: 'track',
                        event: 'Test Event 1',
                        userId: 'test-user-id-1',
                        properties: {
                          value: 100,
                          currency: 'USD',
                        },
                        value: 100,
                        currency: 'USD',
                        timestamp: '2023-01-01T00:00:00.000Z',
                        messageId: 'test-message-id-1',
                        throttlingCost: 1,
                      },
                      {
                        type: 'track',
                        event: 'Test Event 2',
                        userId: 'test-user-id-2',
                        properties: {
                          value: 200,
                          currency: 'EUR',
                        },
                        value: 200,
                        currency: 'EUR',
                        timestamp: '2023-01-01T00:00:00.000Z',
                        messageId: 'test-message-id-2',
                        throttlingCost: 1,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
                statusCode: 200,
              },
              statusCode: 200,
            },
            {
              metadata: [generateMetadata(3)],
              destination: {
                Config: {
                  apiKey: secret1,
                  enableBatching: true,
                  maxBatchSize: '2',
                },
                DestinationDefinition: {
                  DisplayName: 'Dummy Destination',
                  ID: '123',
                  Name: 'DUMMY',
                  Config: {},
                },
                Enabled: true,
                ID: '123',
                Name: 'DUMMY',
                Transformations: [],
                WorkspaceID: 'test-workspace-id',
              },
              batched: true,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                params: {},
                endpoint: 'https://dummy-destination.example.com/api',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Dummy-Destination': 'true',
                },
                body: {
                  JSON: {
                    events: [
                      {
                        type: 'track',
                        event: 'Test Event 3',
                        userId: 'test-user-id-3',
                        properties: {
                          value: 300,
                          currency: 'GBP',
                        },
                        value: 300,
                        currency: 'GBP',
                        timestamp: '2023-01-01T00:00:00.000Z',
                        messageId: 'test-message-id-3',
                        throttlingCost: 1,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
                statusCode: 200,
              },
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'dummy-batching-test-2',
    name: destType,
    description: 'Batching Test - Disabled',
    scenario: 'Business',
    successCriteria: 'The response should not batch events when batching is disabled',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  enableBatching: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Dummy Destination',
                  ID: '123',
                  Name: 'DUMMY',
                  Config: {},
                },
                Enabled: true,
                ID: '123',
                Name: 'DUMMY',
                Transformations: [],
                WorkspaceID: 'test-workspace-id',
              },
              metadata: generateMetadata(1),
              message: {
                type: 'track',
                userId: 'test-user-id-1',
                anonymousId: 'test-anonymous-id-1',
                event: 'Test Event 1',
                properties: {
                  value: 100,
                  currency: 'USD',
                },
                messageId: 'test-message-id-1',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  enableBatching: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Dummy Destination',
                  ID: '123',
                  Name: 'DUMMY',
                  Config: {},
                },
                Enabled: true,
                ID: '123',
                Name: 'DUMMY',
                Transformations: [],
                WorkspaceID: 'test-workspace-id',
              },
              metadata: generateMetadata(2),
              message: {
                type: 'track',
                userId: 'test-user-id-2',
                anonymousId: 'test-anonymous-id-2',
                event: 'Test Event 2',
                properties: {
                  value: 200,
                  currency: 'EUR',
                },
                messageId: 'test-message-id-2',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
          ],
          destType,
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
              metadata: [generateMetadata(1), generateMetadata(2)],
              destination: {
                Config: {
                  apiKey: secret1,
                  enableBatching: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Dummy Destination',
                  ID: '123',
                  Name: 'DUMMY',
                  Config: {},
                },
                Enabled: true,
                ID: '123',
                Name: 'DUMMY',
                Transformations: [],
                WorkspaceID: 'test-workspace-id',
              },
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                params: {},
                endpoint: 'https://dummy-destination.example.com/api',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Dummy-Destination': 'true',
                },
                body: {
                  JSON: {
                    events: [
                      {
                        type: 'track',
                        event: 'Test Event 1',
                        userId: 'test-user-id-1',
                        properties: {
                          value: 100,
                          currency: 'USD',
                        },
                        value: 100,
                        currency: 'USD',
                        timestamp: '2023-01-01T00:00:00.000Z',
                        messageId: 'test-message-id-1',
                        throttlingCost: 1,
                      },
                      {
                        type: 'track',
                        event: 'Test Event 2',
                        userId: 'test-user-id-2',
                        properties: {
                          value: 200,
                          currency: 'EUR',
                        },
                        value: 200,
                        currency: 'EUR',
                        timestamp: '2023-01-01T00:00:00.000Z',
                        messageId: 'test-message-id-2',
                        throttlingCost: 1,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
                statusCode: 200,
              },
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
