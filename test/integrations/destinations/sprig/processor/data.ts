export const data = [
  {
    name: 'sprig',
    description: 'No message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@1',
              channel: 'web',
              context: {
                traits: {
                  email: 'test@gmail.com',
                  firstName: 'Test',
                  lastName: 'Ruddelabs',
                },
              },
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.75705:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
              },
            },
            metadata: {
              jobId: 1,
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              jobId: 1,
            },
            statusCode: 400,
            error:
              'message Type is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message Type is not present. Aborting',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SPRIG',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'sprig',
    description: 'Unsupported message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@1',
              groupId: 'group@1',
              channel: 'web',
              context: {
                traits: {
                  email: 'test@gmail.com',
                  firstName: 'Test',
                  lastName: 'Rudderstack',
                },
              },
              traits: {},
              type: 'group',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.75705:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
              },
            },
            metadata: {
              jobId: 2,
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              jobId: 2,
            },
            statusCode: 400,
            error:
              'message type group is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type group is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SPRIG',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'sprig',
    description: 'Missing config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@1',
              channel: 'web',
              context: {
                traits: {
                  email: 'test@gmail.com',
                  firstName: 'Test',
                  lastName: 'Rudderstack',
                },
              },
              type: 'identify',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.75705:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {},
            },
            metadata: {
              jobId: 3,
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              jobId: 3,
            },
            statusCode: 400,
            error:
              'API Key is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: API Key is not present. Aborting',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'SPRIG',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'sprig',
    description: 'Identify call without userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              anonymousId: 'anon@1',
              context: {
                traits: {
                  email: 'test@gmail.com',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                },
              },
              type: 'identify',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.75705:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
              },
            },
            metadata: {
              jobId: 4,
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              jobId: 4,
            },
            statusCode: 400,
            error:
              'userId is required: Workflow: procWorkflow, Step: validateIdentifyPayload, ChildStep: undefined, OriginalError: userId is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SPRIG',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'sprig',
    description: 'Successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              userId: 'user@1',
              context: {
                traits: {
                  email: 'test@gmail.com',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                },
              },
              type: 'identify',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.75705:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
              },
            },
            metadata: {
              jobId: 5,
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              jobId: 5,
            },
            output: {
              method: 'POST',
              endpoint: 'https://api.sprig.com/v2/users',
              headers: {
                accept: 'application/json',
                authorization: 'API-Key testApiKey',
                'content-type': 'application/json',
              },
              body: {
                JSON: {
                  attributes: {
                    email: 'test@gmail.com',
                    firstName: 'Test',
                    lastName: 'Rudderlabs',
                  },
                  emailAddress: 'test@gmail.com',
                  userId: 'user@1',
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              files: {},
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sprig',
    description: 'Track call with empty event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              userId: 'user@1',
              context: {
                traits: {
                  email: 'test@gmail.com',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                },
              },
              properties: {},
              type: 'track',
              event: '',
              originalTimestamp: '2020-11-29T19:11:00.337Z',
              timestamp: '2023-11-29T19:11:00.337Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
              },
            },
            metadata: {
              jobId: 6,
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              jobId: 6,
            },
            statusCode: 400,
            error:
              'event name is required: Workflow: procWorkflow, Step: validateTrackPayload, ChildStep: undefined, OriginalError: event name is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SPRIG',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'sprig',
    description: 'Successful track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              userId: 'user@1',
              context: {
                traits: {
                  email: 'test@gmail.com',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                },
              },
              properties: {},
              type: 'track',
              event: 'signup',
              originalTimestamp: '2020-11-29T19:11:00.337Z',
              timestamp: '2023-11-29T19:11:00.337Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
              },
            },
            metadata: {
              jobId: 7,
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              jobId: 7,
            },
            output: {
              method: 'POST',
              endpoint: 'https://api.sprig.com/v2/users',
              headers: {
                accept: 'application/json',
                authorization: 'API-Key testApiKey',
                'content-type': 'application/json',
              },
              body: {
                JSON: {
                  emailAddress: 'test@gmail.com',
                  userId: 'user@1',
                  events: [
                    {
                      event: 'signup',
                      timestamp: 1701285060337,
                    },
                  ],
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              files: {},
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
