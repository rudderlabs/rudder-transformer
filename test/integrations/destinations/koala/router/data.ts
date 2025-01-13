export const data = [
  {
    name: 'koala',
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
                  publicKey: 'kkooaallaa321',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              message: {
                userId: 'user-uuid',
                annonymousId: 'annonymous-uuid',
                event: 'User Signed Up',
                type: 'track',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                traits: {
                  email: 'johndoe@somemail.com',
                },
                properties: {
                  label: 'test',
                  value: 10,
                },
                context: {
                  network: 'wifi',
                },
                originalTimestamp: '2024-01-23T08:35:17.562Z',
                sentAt: '2024-01-23T08:35:17.562Z',
                request_ip: '192.11.22.33',
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
                  publicKey: 'kkooaallaa321',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              message: {
                userId: 'user-uuid',
                annonymousId: 'annonymous-uuid',
                event: 'User Deleted account',
                type: 'track',
                messageId: '8bc79b03-2a5c-4615-b2da-54c0aaaaaae8',
                traits: {
                  ko_profile_id: '123456',
                },
                properties: {
                  attr1: 'foo',
                  attr2: 'bar',
                },
                context: {
                  network: 'wifi',
                },
                originalTimestamp: '2024-01-23T08:35:17.562Z',
                sentAt: '2024-01-23T08:35:17.562Z',
                request_ip: '192.11.55.1',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
                destinationId: 'destId',
                workspaceId: 'wspId',
              },
            },
          ],
          destType: 'koala',
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
                    ip: '192.11.22.33',
                    email: 'johndoe@somemail.com',
                    events: [
                      {
                        type: 'track',
                        event: 'User Signed Up',
                        sent_at: '2024-01-23T08:35:17.562Z',
                        message_id: '84e26acc-56a5-4835-8233-591137fca468',
                        properties: {
                          label: 'test',
                          value: 10,
                        },
                        context: {
                          network: 'wifi',
                        },
                      },
                    ],
                  },
                },
                endpoint: 'https://api2.getkoala.com/web/projects/kkooaallaa321/batch',
                files: {},
                params: {},
                type: 'REST',
                version: '1',
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                },
              },
              batched: false,
              metadata: [{ jobId: 1, userId: 'u1', workspaceId: 'wspId', destinationId: 'destId' }],
              statusCode: 200,
              destination: {
                Config: {
                  publicKey: 'kkooaallaa321',
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
                    ip: '192.11.55.1',
                    profile_id: '123456',
                    events: [
                      {
                        type: 'track',
                        event: 'User Deleted account',
                        sent_at: '2024-01-23T08:35:17.562Z',
                        message_id: '8bc79b03-2a5c-4615-b2da-54c0aaaaaae8',
                        properties: {
                          attr1: 'foo',
                          attr2: 'bar',
                        },
                        context: {
                          network: 'wifi',
                        },
                      },
                    ],
                  },
                },
                endpoint: 'https://api2.getkoala.com/web/projects/kkooaallaa321/batch',
                files: {},
                params: {},
                type: 'REST',
                version: '1',
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                },
              },
              batched: false,
              metadata: [{ jobId: 2, userId: 'u1', workspaceId: 'wspId', destinationId: 'destId' }],
              statusCode: 200,
              destination: {
                Config: {
                  publicKey: 'kkooaallaa321',
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
