export const data = [
  {
    name: 'loops',
    description: 'Identify event with traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'dummy-user001',
              channel: 'web',
              context: {
                traits: {
                  email: 'dummyuser@domain.com',
                  firstName: 'Bob',
                  lastName: 'Brown',
                  phone: '099-999-9999',
                },
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'Loops',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
              },
              Enabled: true,
              Transformations: [],
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
            output: {
              body: {
                JSON: {
                  email: 'dummyuser@domain.com',
                  firstName: 'Bob',
                  lastName: 'Brown',
                  phone: '099-999-9999',
                  userId: 'dummy-user001',
                },
                FORM: {},
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://app.loops.so/api/v1/contacts/update',
              files: {},
              headers: {
                authorization: 'Bearer dummyApiKey',
                'content-type': 'application/json',
              },
              method: 'POST',
              type: 'REST',
              version: '1',
              params: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'loops',
    description: 'Identify event with mailing lists',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'dummy-user001',
              channel: 'web',
              context: {
                traits: {
                  email: 'dummyuser@domain.com',
                  firstName: 'Bob',
                  lastName: 'Brown',
                  phone: '099-999-9999',
                  mailinglists: {
                    list_001: true,
                    list_002: false,
                  },
                },
              },
              type: 'identify',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'Loops',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {},
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
                JSON: {
                  email: 'dummyuser@domain.com',
                  firstName: 'Bob',
                  lastName: 'Brown',
                  phone: '099-999-9999',
                  userId: 'dummy-user001',
                  mailinglists: {
                    list_001: true,
                    list_002: false,
                  },
                },
                FORM: {},
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://app.loops.so/api/v1/contacts/update',
              files: {},
              headers: {
                authorization: 'Bearer dummyApiKey',
                'content-type': 'application/json',
              },
              method: 'POST',
              type: 'REST',
              version: '1',
              params: {},
              userId: '',
            },
            metadata: {},
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'loops',
    description: 'Identify event with missing email trait',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'dummy-user001',
              channel: 'web',
              context: {
                traits: {
                  firstName: 'Bob',
                  lastName: 'Brown',
                  phone: '099-999-9999',
                },
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'Loops',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {},
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'email is required. Aborting: Workflow: procWorkflow, Step: validateIdentifyEmail, ChildStep: undefined, OriginalError: email is required. Aborting',
            metadata: {},
            statTags: {
              destType: 'LOOPS',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'loops',
    description: 'Track event with traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'dummy-user001',
              channel: 'web',
              event: 'signup',
              properties: {
                subscriptionStatus: 'trial',
                plan: null,
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'track',
              context: {
                traits: {
                  email: 'dummyuser@domain.com',
                  firstName: 'Bob',
                  lastName: 'Brown',
                  phone: '099-999-9999',
                },
              },
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'Loops',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {},
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {},
            output: {
              body: {
                JSON: {
                  email: 'dummyuser@domain.com',
                  firstName: 'Bob',
                  lastName: 'Brown',
                  phone: '099-999-9999',
                  userId: 'dummy-user001',
                  eventName: 'signup',
                  eventProperties: {
                    subscriptionStatus: 'trial',
                    plan: null,
                  },
                },
                FORM: {},
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://app.loops.so/api/v1/events/send',
              files: {},
              headers: {
                authorization: 'Bearer dummyApiKey',
                'content-type': 'application/json',
              },
              method: 'POST',
              type: 'REST',
              version: '1',
              params: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'loops',
    description: 'Track event with no email in traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'dummy-user001',
              channel: 'web',
              event: 'signup',
              properties: {
                subscriptionStatus: 'trial',
                plan: null,
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'track',
              context: {
                traits: {},
              },
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'Loops',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {},
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {},
            output: {
              body: {
                JSON: {
                  userId: 'dummy-user001',
                  eventName: 'signup',
                  eventProperties: {
                    subscriptionStatus: 'trial',
                    plan: null,
                  },
                },
                FORM: {},
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://app.loops.so/api/v1/events/send',
              files: {},
              headers: {
                authorization: 'Bearer dummyApiKey',
                'content-type': 'application/json',
              },
              method: 'POST',
              type: 'REST',
              version: '1',
              params: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'loops',
    description: 'Track event with missing email and userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'dummy-user001',
              channel: 'web',
              event: 'signup',
              properties: {
                subscriptionStatus: 'trial',
                plan: null,
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'track',
              context: {},
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'Loops',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {},
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Either email or userId is required. Aborting: Workflow: procWorkflow, Step: validateTrackIdentifier, ChildStep: undefined, OriginalError: Either email or userId is required. Aborting',
            metadata: {},
            statTags: {
              destType: 'LOOPS',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
];
