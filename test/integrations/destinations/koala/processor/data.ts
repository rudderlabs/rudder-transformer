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
              traits: {
                email: 'johndoe@somemail.com'
              },
              properties: {
                label: 'test',
                value: 10,
              },
              originalTimestamp: '2024-01-23T08:35:17.562Z',
              sentAt: '2024-01-23T08:35:17.562Z',
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
                  userId: 'user-uuid',
                  annonymousId: 'annonymous-uuid',
                  event: 'User Signed Up',
                  type: 'track',
                  traits: {
                    email: 'johndoe@somemail.com'
                  },
                  properties: {
                    label: 'test',
                    value: 10,
                  },
                  originalTimestamp: '2024-01-23T08:35:17.562Z',
                  sentAt: '2024-01-23T08:35:17.562Z',
                },
              },
              endpoint: 'https://api2.getkoala.com/web/profiles/kkooaallaa321/batch',
              files: {},
              params: {},
              type: 'REST',
              version: '1',
              method: 'POST',
              userId: '',
              headers: {
                'User-Agent': 'rudderstack/1.0.0',
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
    description: 'Successful indentity event',
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
                  },
                  originalTimestamp: '2024-01-23T08:35:17.342Z',
                  sentAt: '2024-01-23T08:35:35.234Z',
                },
              },
              endpoint: 'https://api2.getkoala.com/web/profiles/kkooaallaa321/batch',
              files: {},
              params: {},
              type: 'REST',
              version: '1',
              method: 'POST',
              userId: '',
              headers: {
                'User-Agent': 'rudderstack/1.0.0',
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
    description: 'Missing required email field in traits',
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
              'email is not present on traits. Aborting message: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: email is not present on traits. Aborting message',
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
    description: 'Validate track event with invalid message type',
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
