export const data = [
  {
    name: 'bingads_audience',
    description: 'unhashed email available with hashEmail as true in config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'BINGADS_AUDIENCE',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'BINGADS_AUDIENCE',
                DisplayName: 'BINGADS AUDIENCE',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: true,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'alex@email.com',
                    },
                    {
                      email: 'amy@abc.com',
                    },
                    {
                      email: 'van@abc.com',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: '',
              headers: {},
              userId: '',
              params: {},
              body: {
                JSON: {
                  list: [
                    {
                      email: 'alex@email.com',
                      hashedEmail:
                        'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                    },
                    {
                      email: 'amy@abc.com',
                      hashedEmail:
                        '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                    },
                    {
                      email: 'van@abc.com',
                      hashedEmail:
                        '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
                    },
                  ],
                  action: 'Add',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
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
    name: 'bingads_audience',
    description: 'hashed email available with hashEmail as false in config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'BINGADS_AUDIENCE',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'BINGADS_AUDIENCE',
                DisplayName: 'BINGADS AUDIENCE',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: false,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                    },
                    {
                      email: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                    },
                    {
                      email: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: '',
              userId: '',
              headers: {},
              params: {},
              body: {
                JSON: {
                  list: [
                    {
                      email: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                      hashedEmail:
                        'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                    },
                    {
                      email: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                      hashedEmail:
                        '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                    },
                    {
                      email: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
                      hashedEmail:
                        '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
                    },
                  ],
                  action: 'Add',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
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
    name: 'BINGADS_AUDIENCE',
    description: 'Unsupported action type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'BINGADS_AUDIENCE',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'BINGADS_AUDIENCE',
                DisplayName: 'BINGADS AUDIENCE',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: false,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  addition: [
                    {
                      email: 'alex@email.com',
                    },
                    {
                      email: 'amy@abc.com',
                    },
                    {
                      email: 'van@abc.com',
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
              'unsupported action type. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: unsupported action type. Aborting message.',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BINGADS_AUDIENCE',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'BINGADS_AUDIENCE',
    description: 'Unsupported event type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'BINGADS_AUDIENCE',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'BINGADS_AUDIENCE',
                DisplayName: 'BINGADS AUDIENCE',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: true,
              },
            },
            message: {
              userId: 'user 1',
              type: 'track',
              properties: {
                listData: {
                  addition: [
                    {
                      email: 'alex@email.com',
                    },
                    {
                      email: 'amy@abc.com',
                    },
                    {
                      email: 'van@abc.com',
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
              'Event type track is not supported. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Event type track is not supported. Aborting message.',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BINGADS_AUDIENCE',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'BINGADS_AUDIENCE',
    description: 'event type not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'BINGADS_AUDIENCE',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'BINGADS_AUDIENCE',
                DisplayName: 'BINGADS AUDIENCE',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: true,
              },
            },
            message: {
              userId: 'user 1',
              properties: {
                listData: {
                  addition: [
                    {
                      email: 'alex@email.com',
                    },
                    {
                      email: 'amy@abc.com',
                    },
                    {
                      email: 'van@abc.com',
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
              'message Type is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message Type is not present. Aborting message.',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BINGADS_AUDIENCE',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'BINGADS_AUDIENCE',
    description: 'event type not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'BINGADS_AUDIENCE',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'BINGADS_AUDIENCE',
                DisplayName: 'BINGADS AUDIENCE',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: true,
              },
            },
            message: {
              userId: 'user 1',
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              type: 'audiencelist',
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
              'Message properties is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Message properties is not present. Aborting message.',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BINGADS_AUDIENCE',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'bingads_audience',
    description: 'Both add and remove are present in listData',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'BINGADS_AUDIENCE',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'BINGADS_AUDIENCE',
                DisplayName: 'BINGADS AUDIENCE',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: false,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  remove: [
                    {
                      email: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                    },
                    {
                      email: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                    },
                    {
                      email: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
                    },
                  ],
                  update: [
                    {
                      email: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                    },
                    {
                      email: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                    },
                    {
                      email: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: '',
              userId: '',
              headers: {},
              params: {},
              body: {
                JSON: {
                  list: [
                    {
                      email: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                      hashedEmail:
                        'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                    },
                    {
                      email: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                      hashedEmail:
                        '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                    },
                    {
                      email: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
                      hashedEmail:
                        '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
                    },
                  ],
                  action: 'Remove',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: '',
              userId: '',
              headers: {},
              params: {},
              body: {
                JSON: {
                  list: [
                    {
                      email: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                      hashedEmail:
                        'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                    },
                    {
                      email: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                      hashedEmail:
                        '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                    },
                    {
                      email: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
                      hashedEmail:
                        '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
                    },
                  ],
                  action: 'Replace',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
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
];
