import { batchResponseBuilder, createEventChunk } from './utils';
import { InstrumentationError, ConfigurationError } from '@rudderstack/integrations-lib';
describe('utils', () => {
  describe('batchResponseBuilder', () => {
    const mockDestination = {
      Config: {
        siteId: 'test-site',
        apiKey: 'test-key',
      },
    };

    const mockConnection = {
      config: {
        destination: {
          identifierMappings: [{ to: 'email' }],
          audienceId: '123',
        },
      },
    };

    const testCases = [
      {
        name: 'should build batch responses for insert and delete',
        input: {
          insertOrUpdateRespList: [{ payload: { ids: ['user1'] }, metadata: { sourceId: '1' } }],
          deleteRespList: [{ payload: { ids: ['user2'] }, metadata: { sourceId: '2' } }],
        },
        expected: {
          length: 2,
          firstEndpoint: 'https://track.customer.io/api/v1/segments/123/add_customers',
          secondEndpoint: 'https://track.customer.io/api/v1/segments/123/remove_customers',
        },
      },
      {
        name: 'should handle empty lists',
        input: {
          insertOrUpdateRespList: [],
          deleteRespList: [],
        },
        expected: {
          length: 0,
        },
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      test(name, () => {
        const result = batchResponseBuilder(
          input.insertOrUpdateRespList,
          input.deleteRespList,
          mockDestination as any,
          mockConnection as any,
        );

        expect(result).toHaveLength(expected.length);
        if (expected.length > 0) {
          expect(result[0].batchedRequest.endpoint).toBe(expected.firstEndpoint);
          expect(result[1].batchedRequest.endpoint).toBe(expected.secondEndpoint);
        }
      });

      describe('createEventChunk', () => {
        const testCases = [
          {
            name: 'should create valid event chunk when audienceId is a string',
            input: {
              message: {
                type: 'record',
                action: 'insert',
                identifiers: { email: 'test@test.com' },
                rudderId: 'test-rudder-id',
                messageId: 'test-message-id',
              },
              connection: {
                config: {
                  destination: {
                    identifierMappings: [{ to: 'email', from: 'email' }],
                    audienceId: '123',
                  },
                },
              },
              metadata: { sourceId: '1' },
            },
            expected: {
              payload: { ids: ['test@test.com'] },
              eventAction: 'insert',
              metadata: { sourceId: '1' },
            },
          },
          {
            name: 'should create valid event chunk when audienceId is a number',
            input: {
              message: {
                type: 'record',
                action: 'insert',
                identifiers: { email: 'test@test.com' },
                rudderId: 'test-rudder-id',
                messageId: 'test-message-id',
              },
              connection: {
                config: {
                  destination: {
                    identifierMappings: [{ to: 'email', from: 'email' }],
                    audienceId: 123,
                  },
                },
              },
              metadata: { sourceId: '1' },
            },
            expected: {
              payload: { ids: ['test@test.com'] },
              eventAction: 'insert',
              metadata: { sourceId: '1' },
            },
          },
          {
            name: 'should throw InstrumentationError for invalid message',
            input: {
              message: {
                action: null,
                identifiers: {},
              },
              connection: {
                config: {
                  destination: {
                    identifierMappings: [{ to: 'email', from: 'email' }],
                    audienceId: '123',
                  },
                },
              },
            },
            throws: InstrumentationError,
          },
          {
            name: 'should throw ConfigurationError for invalid connection config',
            input: {
              message: {
                type: 'record',
                action: 'insert',
                identifiers: { email: 'test@test.com' },
                rudderId: 'test-rudder-id',
                messageId: 'test-message-id',
              },
              connection: {
                config: {
                  destination: {
                    identifierMappings: [],
                    audienceId: null,
                  },
                },
              },
            },
            throws: ConfigurationError,
          },
        ];

        testCases.forEach(({ name, input, expected, throws }) => {
          test(name, () => {
            if (throws) {
              expect(() => createEventChunk(input as any)).toThrow(throws);
            } else {
              const result = createEventChunk(input as any);
              expect(result).toEqual(expected);
            }
          });
        });
      });
    });
  });
});
