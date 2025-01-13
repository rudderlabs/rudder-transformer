export const data = [
  {
    name: 'vitally',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKeyVitally: 'abc123',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              userId: '0220c056-934e-11ed-a1eb-0242ac120002',
              event: 'this is a track event',
              type: 'track',
              properties: {
                thing: 'amazing!',
              },
              originalTimestamp: '2023-01-13T09:03:17.562Z',
              sentAt: '2023-01-13T09:03:17.562Z',
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
                  userId: '0220c056-934e-11ed-a1eb-0242ac120002',
                  event: 'this is a track event',
                  type: 'track',
                  properties: {
                    thing: 'amazing!',
                  },
                  originalTimestamp: '2023-01-13T09:03:17.562Z',
                  sentAt: '2023-01-13T09:03:17.562Z',
                },
              },
              endpoint: 'https://api.vitally.io/rudderstack',
              files: {},
              params: {},
              type: 'REST',
              version: '1',
              method: 'POST',
              userId: '',
              headers: {
                authorization: 'Basic abc123',
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
    name: 'vitally',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKeyVitally: 'abc123',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              userId: '0220c056-934e-11ed-a1eb-0242ac120002',
              type: 'identify',
              traits: {
                name: 'Johnny Appleseed',
              },
              originalTimestamp: '2023-01-13T09:03:17.562Z',
              sentAt: '2023-01-13T09:03:17.562Z',
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
                  userId: '0220c056-934e-11ed-a1eb-0242ac120002',
                  type: 'identify',
                  traits: {
                    name: 'Johnny Appleseed',
                  },
                  originalTimestamp: '2023-01-13T09:03:17.562Z',
                  sentAt: '2023-01-13T09:03:17.562Z',
                },
              },
              endpoint: 'https://api.vitally.io/rudderstack',
              files: {},
              params: {},
              type: 'REST',
              version: '1',
              method: 'POST',
              userId: '',
              headers: {
                authorization: 'Basic abc123',
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
    name: 'vitally',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKeyVitally: 'abc123',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              userId: '0220c056-934e-11ed-a1eb-0242ac120002',
              type: 'group',
              groupId: '5de17322-934e-11ed-a1eb-0242ac120002',
              originalTimestamp: '2023-01-13T09:03:17.562Z',
              sentAt: '2023-01-13T09:03:17.562Z',
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
                  userId: '0220c056-934e-11ed-a1eb-0242ac120002',
                  type: 'group',
                  groupId: '5de17322-934e-11ed-a1eb-0242ac120002',
                  originalTimestamp: '2023-01-13T09:03:17.562Z',
                  sentAt: '2023-01-13T09:03:17.562Z',
                },
              },
              endpoint: 'https://api.vitally.io/rudderstack',
              files: {},
              params: {},
              type: 'REST',
              version: '1',
              method: 'POST',
              userId: '',
              headers: {
                authorization: 'Basic abc123',
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
    name: 'vitally',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKeyVitally: 'abc123',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              userId: '0220c056-934e-11ed-a1eb-0242ac120002',
              type: 'page',
              groupId: '5de17322-934e-11ed-a1eb-0242ac120002',
              originalTimestamp: '2023-01-13T09:03:17.562Z',
              sentAt: '2023-01-13T09:03:17.562Z',
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
              destType: 'VITALLY',
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
