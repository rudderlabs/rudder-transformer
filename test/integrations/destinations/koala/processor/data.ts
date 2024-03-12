export const data = [
  {
    name: 'koala',
    description: 'Sucessful track event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              properties: {
                email: 'johndoe@somemail.com',
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
                        email: 'johndoe@somemail.com',
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
              userId: '',
              headers: {
                'content-type': 'application/json',
              },
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'koala',
    description: 'Successful identify event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              type: 'identify',
              traits: {
                FirstName: 'John',
                LastName: 'Doe',
                address: {
                  city: 'San Francisco',
                  state: 'CA',
                  postalCode: '94107',
                },
                email: 'johndoe@somemail.com',
                ko_profile_id: 'xxxx-2222-xxxx-xxxx',
              },
              originalTimestamp: '2024-01-23T08:35:17.342Z',
              sentAt: '2024-01-23T08:35:35.234Z',
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
                FORM: {},
                JSON_ARRAY: {},
                XML: {},
                JSON: {
                  email: 'johndoe@somemail.com',
                  profile_id: 'xxxx-2222-xxxx-xxxx',
                  identifies: [
                    {
                      type: 'identify',
                      sent_at: '2024-01-23T08:35:17.342Z',
                      traits: {
                        FirstName: 'John',
                        LastName: 'Doe',
                        address: {
                          city: 'San Francisco',
                          state: 'CA',
                          postalCode: '94107',
                        },
                        email: 'johndoe@somemail.com',
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
              userId: '',
              headers: {
                'content-type': 'application/json',
              },
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'koala',
    description: 'Missing required email or ko_profile_id fields in traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              type: 'track',
              traits: {
                name: 'John Doe',
              },
              originalTimestamp: '2024-01-23T08:35:17.342Z',
              sentAt: '2024-01-23T08:35:35.234Z',
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
            statusCode: 400,
            error:
              'Neither email or ko_profile_id are present on traits. Aborting message: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Neither email or ko_profile_id are present on traits. Aborting message',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'KOALA',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'koala',
    description: 'Invalid message type page',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              type: 'page',
              groupId: 'group-uuid',
              originalTimestamp: '2024-01-23T08:35:17.342Z',
              sentAt: '2024-01-23T08:35:35.234Z',
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
            statusCode: 400,
            error:
              'message type page is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type page is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'KOALA',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
];
