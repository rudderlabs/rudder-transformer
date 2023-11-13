export const data = [
  {
    name: 'new_relic',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'first',
              userId: 'identified user id',
              type: 'track',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              sentAt: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                accountId: '12345',
                insertKey: '11111122702j2a2U2K2C7H',
                customEventType: '',
                sendDeviceContext: true,
                sendUserIdanonymousId: true,
                dataCenter: 'us',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://insights-collector.newrelic.com/v1/accounts/12345/events',
              headers: {
                'Api-Key': '11111122702j2a2U2K2C7H',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'first',
                  abc: '123',
                  'key.abc': 123,
                  'array[0].abc': 123,
                  'array[1].def': 123,
                  timestamp: 1580602989,
                  eventType: 'rudderstack',
                  userId: 'identified user id',
                  anonymousId: 'anon-id-new',
                  'traits.trait1': 'new-val',
                  ip: '14.5.67.21',
                  'library.name': 'http',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'new_relic',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'second',
              userId: 'identified user id',
              type: 'track',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 'test',
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              sentAt: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                accountId: '12345',
                insertKey: '11111122702j2a2U2K2C7H',
                customEventType: '',
                sendDeviceContext: false,
                sendUserIdanonymousId: false,
                dataCenter: 'us',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://insights-collector.newrelic.com/v1/accounts/12345/events',
              headers: {
                'Api-Key': '11111122702j2a2U2K2C7H',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'second',
                  abc: '123',
                  'key.abc': 123,
                  'array[0].abc': 123,
                  'array[1].def': 'test',
                  timestamp: 1580602989,
                  eventType: 'rudderstack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'new_relic',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'test',
              userId: 'identified user id',
              type: 'track',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              sentAt: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                accountId: '12345',
                insertKey: '11111122702j2a2U2K2C7H',
                customEventType: 'rudder-testing',
                sendDeviceContext: false,
                sendUserIdanonymousId: false,
                dataCenter: 'us',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://insights-collector.newrelic.com/v1/accounts/12345/events',
              headers: {
                'Api-Key': '11111122702j2a2U2K2C7H',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'test',
                  abc: '123',
                  'key.abc': 123,
                  'array[0].abc': 123,
                  'array[1].def': 123,
                  timestamp: 1580602989,
                  eventType: 'rudder-testing',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'new_relic',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'first',
              userId: 'identified user id',
              type: 'track',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              sentAt: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                accountId: '12345',
                insertKey: '11111122702j2a2U2K2C7H',
                customEventType: '',
                sendDeviceContext: true,
                sendUserIdanonymousId: true,
                dataCenter: 'eu',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://insights-collector.eu01.nr-data.net/v1/accounts/12345/events',
              headers: {
                'Api-Key': '11111122702j2a2U2K2C7H',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'first',
                  abc: '123',
                  'key.abc': 123,
                  'array[0].abc': 123,
                  'array[1].def': 123,
                  timestamp: 1580602989,
                  eventType: 'rudderstack',
                  userId: 'identified user id',
                  anonymousId: 'anon-id-new',
                  'traits.trait1': 'new-val',
                  ip: '14.5.67.21',
                  'library.name': 'http',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'new_relic',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'second',
              userId: 'identified user id',
              type: 'track',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 'test',
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              sentAt: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                accountId: '12345',
                insertKey: '11111122702j2a2U2K2C7H',
                customEventType: '',
                sendDeviceContext: false,
                sendUserIdanonymousId: false,
                dataCenter: 'eu',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://insights-collector.eu01.nr-data.net/v1/accounts/12345/events',
              headers: {
                'Api-Key': '11111122702j2a2U2K2C7H',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'second',
                  abc: '123',
                  'key.abc': 123,
                  'array[0].abc': 123,
                  'array[1].def': 'test',
                  timestamp: 1580602989,
                  eventType: 'rudderstack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'new_relic',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'test',
              userId: 'identified user id',
              type: 'track',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              sentAt: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                accountId: '12345',
                insertKey: '11111122702j2a2U2K2C7H',
                customEventType: 'rudder-testing',
                sendDeviceContext: false,
                sendUserIdanonymousId: true,
                dataCenter: 'eu',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://insights-collector.eu01.nr-data.net/v1/accounts/12345/events',
              headers: {
                'Api-Key': '11111122702j2a2U2K2C7H',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'test',
                  abc: '123',
                  'key.abc': 123,
                  'array[0].abc': 123,
                  'array[1].def': 123,
                  timestamp: 1580602989,
                  eventType: 'rudder-testing',
                  userId: 'identified user id',
                  anonymousId: 'anon-id-new',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'new_relic',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'test',
              type: 'track',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              sentAt: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                accountId: '12345',
                insertKey: '11111122702j2a2U2K2C7H',
                customEventType: '',
                sendDeviceContext: true,
                sendUserIdanonymousId: true,
                dataCenter: 'us',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'https://insights-collector.newrelic.com/v1/accounts/12345/events',
              headers: {
                'Api-Key': '11111122702j2a2U2K2C7H',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'test',
                  abc: '123',
                  'key.abc': 123,
                  'array[0].abc': 123,
                  'array[1].def': 123,
                  timestamp: 1580602989,
                  eventType: 'rudderstack',
                  anonymousId: 'anon-id-new',
                  'traits.trait1': 'new-val',
                  ip: '14.5.67.21',
                  'library.name': 'http',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'new_relic',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'first',
              userId: 'identified user id',
              type: 'identify',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              traits: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              sentAt: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                accountId: '12345',
                insertKey: '11111122702j2a2U2K2C7H',
                customEventType: '',
                sendDeviceContext: true,
                sendUserIdanonymousId: true,
                dataCenter: 'us',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              'message type identify is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type identify is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'NEW_RELIC',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
];
