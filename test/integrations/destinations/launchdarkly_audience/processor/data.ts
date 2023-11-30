export const data = [
  {
    name: 'launchdarkly_audience',
    description: 'Unsupported event type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              type: 'abc',
              properties: {
                listData: {
                  add: [
                    {
                      identifier: 'alex@email.com',
                    },
                    {
                      identifier: 'ryan@email.com',
                    },
                    {
                      identifier: 'van@email.com',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                audienceId: 'test-audienceId',
                audienceName: 'test-audienceName',
                accessToken: 'test-accessToken',
                clientSideId: 'test-clientSideId',
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'Event type abc is not supported. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Event type abc is not supported. Aborting message.',
            statTags: {
              destType: 'LAUNCHDARKLY_AUDIENCE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'launchdarkly_audience',
    description: 'List data is not passed',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              type: 'audiencelist',
              properties: {},
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                audienceId: 'test-audienceId',
                audienceName: 'test-audienceName',
                accessToken: 'test-accessToken',
                clientSideId: 'test-clientSideId',
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              '`listData` is not present inside properties. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: `listData` is not present inside properties. Aborting message.',
            statTags: {
              destType: 'LAUNCHDARKLY_AUDIENCE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'launchdarkly_audience',
    description: 'List data is empty',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              type: 'audiencelist',
              properties: {
                listData: {},
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                audienceId: 'test-audienceId',
                audienceName: 'test-audienceName',
                accessToken: 'test-accessToken',
                clientSideId: 'test-clientSideId',
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              '`listData` is empty. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: `listData` is empty. Aborting message.',
            statTags: {
              destType: 'LAUNCHDARKLY_AUDIENCE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'launchdarkly_audience',
    description: 'Unsupported action type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              type: 'audiencelist',
              properties: {
                listData: {
                  update: [
                    {
                      identifier: 'alex@email.com',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                audienceId: 'test-audienceId',
                audienceName: 'test-audienceName',
                accessToken: 'test-accessToken',
                clientSideId: 'test-clientSideId',
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'Unsupported action type. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Unsupported action type. Aborting message.',
            statTags: {
              destType: 'LAUNCHDARKLY_AUDIENCE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'launchdarkly_audience',
    description: 'Add members to the audience list',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      identifier: 'alex@email.com',
                    },
                    {
                      identifier: 'ryan@email.com',
                    },
                    {
                      identifier: 'van@email.com',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                audienceId: 'test-audienceId',
                audienceName: 'test-audienceName',
                accessToken: 'test-accessToken',
                clientSideId: 'test-clientSideId',
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.launchdarkly.com/api/v2/segment-targets/rudderstack',
              headers: {
                Authorization: 'test-accessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  environmentId: 'test-clientSideId',
                  cohortId: 'test-audienceId',
                  cohortName: 'test-audienceName',
                  listData: {
                    add: [
                      {
                        id: 'alex@email.com',
                      },
                      {
                        id: 'ryan@email.com',
                      },
                      {
                        id: 'van@email.com',
                      },
                    ],
                    remove: [],
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
          },
        ],
      },
    },
  },
  {
    name: 'launchdarkly_audience',
    description: 'Remove members from the audience list',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              type: 'audiencelist',
              properties: {
                listData: {
                  remove: [
                    {
                      identifier: 'alex@email.com',
                    },
                    {
                      identifier: 'ryan@email.com',
                    },
                    {
                      identifier: 'van@email.com',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                audienceId: 'test-audienceId',
                audienceName: 'test-audienceName',
                accessToken: 'test-accessToken',
                clientSideId: 'test-clientSideId',
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.launchdarkly.com/api/v2/segment-targets/rudderstack',
              headers: {
                Authorization: 'test-accessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  environmentId: 'test-clientSideId',
                  cohortId: 'test-audienceId',
                  cohortName: 'test-audienceName',
                  listData: {
                    remove: [
                      {
                        id: 'alex@email.com',
                      },
                      {
                        id: 'ryan@email.com',
                      },
                      {
                        id: 'van@email.com',
                      },
                    ],
                    add: [],
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
          },
        ],
      },
    },
  },
  {
    name: 'launchdarkly_audience',
    description: 'Add/Remove members',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      identifier: 'alex@email.com',
                    },
                    {
                      userId: 'user1',
                    },
                  ],
                  remove: [
                    {
                      identifier: 'ryan@email.com',
                    },
                    {
                      identifier: 'van@email.com',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                audienceId: 'test-audienceId',
                audienceName: 'test-audienceName',
                accessToken: 'test-accessToken',
                clientSideId: 'test-clientSideId',
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.launchdarkly.com/api/v2/segment-targets/rudderstack',
              headers: {
                Authorization: 'test-accessToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  environmentId: 'test-clientSideId',
                  cohortId: 'test-audienceId',
                  cohortName: 'test-audienceName',
                  listData: {
                    add: [
                      {
                        id: 'alex@email.com',
                      },
                    ],
                    remove: [
                      {
                        id: 'ryan@email.com',
                      },
                      {
                        id: 'van@email.com',
                      },
                    ],
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
          },
        ],
      },
    },
  },
];
