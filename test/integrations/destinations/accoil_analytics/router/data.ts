// TODO Do I need this? Do we want/can we support batch requests? We only /segment
// Does it make sense to even have this defined?

export const data = [
  {
    name: 'accoil_analytics',
    description: 'Router batch request',
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
                  apiKey: 'api_key',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              message: {
                userId: 'user-uuid',
                event: 'User Signed Up',
                type: 'track',
                timestamp: '2024-01-23T08:35:17.562Z',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
                destinationId: 'destId',
                workspaceId: 'wspId',
              },
            },
            {
              destination: {
                Config: {
                  apiKey: 'api_key',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              message: {
                userId: 'user-uuid',
                event: 'User Deleted account',
                type: 'track',
                messageId: '8bc79b03-2a5c-4615-b2da-54c0aaaaaae8',
                timestamp: '2024-01-23T08:35:17.562Z',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
                destinationId: 'destId',
                workspaceId: 'wspId',
              },
            },
            {
              destination: {
                Config: {
                  apiKey: 'STG_api_key',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              message: {
                userId: 'user-uuid',
                event: 'User Deleted account',
                type: 'track',
                messageId: '8bc79b03-2a5c-4615-b2da-54c0aaaaaae8',
                timestamp: '2024-01-23T08:35:17.562Z',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
                destinationId: 'destId',
                workspaceId: 'wspId',
              },
            },
          ],
          destType: 'accoil_analytics',
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
                body: {
                  FORM: {},
                  JSON_ARRAY: {},
                  XML: {},
                  JSON: {
                    userId: 'user-uuid',
                    type: 'track',
                    event: 'User Signed Up',
                    timestamp: '2024-01-23T08:35:17.562Z',
                  },
                },
                endpoint: 'https://in.accoil.com/segment',
                files: {},
                params: {},
                type: 'REST',
                version: '1',
                method: 'POST',
                headers: {
                  'authorization': 'Basic YXBpX2tleTo=',
                  'content-type': 'application/json',
                },
              },
              batched: false,
              metadata: [{ jobId: 1, userId: 'u1', workspaceId: 'wspId', destinationId: 'destId' }],
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'api_key',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
            },
            {
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON_ARRAY: {},
                  XML: {},
                  JSON: {
                    userId: 'user-uuid',
                    type: 'track',
                    event: 'User Deleted account',
                    timestamp: '2024-01-23T08:35:17.562Z',
                  },
                },
                endpoint: 'https://in.accoil.com/segment',
                files: {},
                params: {},
                type: 'REST',
                version: '1',
                method: 'POST',
                headers: {
                  'authorization': 'Basic YXBpX2tleTo=',
                  'content-type': 'application/json',
                },
              },
              batched: false,
              metadata: [{ jobId: 2, userId: 'u1', workspaceId: 'wspId', destinationId: 'destId' }],
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'api_key',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
            },
            {
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON_ARRAY: {},
                  XML: {},
                  JSON: {
                    userId: 'user-uuid',
                    type: 'track',
                    event: 'User Deleted account',
                    timestamp: '2024-01-23T08:35:17.562Z',
                  },
                },
                endpoint: 'https://instaging.accoil.com/segment',
                files: {},
                params: {},
                type: 'REST',
                version: '1',
                method: 'POST',
                headers: {
                  'authorization': 'Basic U1RHX2FwaV9rZXk6',
                  'content-type': 'application/json',
                },
              },
              batched: false,
              metadata: [{ jobId: 3, userId: 'u1', workspaceId: 'wspId', destinationId: 'destId' }],
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'STG_api_key',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
];
