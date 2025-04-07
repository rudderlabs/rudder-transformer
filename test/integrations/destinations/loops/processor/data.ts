import { ProcessorTestData } from '../../../testTypes';
import { authHeader1, secret1 } from '../maskedSecrets';

export const data: ProcessorTestData[] = [
  {
    id: 'loops-1',
    scenario: 'Contact is created/updated in Loops',
    successCriteria: 'Test should pass successfully.',
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
                ID: 'loops-destination',
                Name: 'Loops Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              WorkspaceID: 'default-workspace',
              Config: {
                apiKey: secret1,
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
        method: 'POST',
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
                authorization: authHeader1,
                'content-type': 'application/json',
              },
              method: 'PUT',
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
    id: 'loops-2',
    scenario: 'Contact is created/updated in Loops with mailing lists',
    successCriteria: 'Test should pass successfully.',
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
                ID: 'loops-destination',
                Name: 'Loops Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              WorkspaceID: 'default-workspace',
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {},
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
                authorization: authHeader1,
                'content-type': 'application/json',
              },
              method: 'PUT',
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
    id: 'loops-3',
    scenario: 'Identify event with missing email or userId',
    successCriteria: 'Test should fail.',
    name: 'loops',
    description: 'Identify event with missing email or userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
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
                ID: 'loops-destination',
                Name: 'Loops Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              WorkspaceID: 'default-workspace',
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {},
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
            error:
              'email is required for identify call.: Workflow: procWorkflow, Step: validateIdentifyEvent, ChildStep: undefined, OriginalError: email is required for identify call.',
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
    id: 'loops-4',
    scenario: 'Send event to Loops',
    successCriteria: 'Test should pass successfully.',
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
                ID: 'loops-destination',
                Name: 'Loops Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              WorkspaceID: 'default-workspace',
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {},
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
                authorization: authHeader1,
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
    id: 'loops-5',
    scenario: 'Send event to Loops (no email in traits)',
    successCriteria: 'Test should pass successfully.',
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
                ID: 'loops-destination',
                Name: 'Loops Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              WorkspaceID: 'default-workspace',
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {},
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
                authorization: authHeader1,
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
    id: 'loops-6',
    scenario: 'Send event to Loops (no email or userId)',
    successCriteria: 'Test should fail.',
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
                ID: 'loops-destination',
                Name: 'Loops Definition',
                DisplayName: 'Default Display Name',
                Config: {
                  cdkV2Enabled: true,
                },
              },
              WorkspaceID: 'default-workspace',
              Config: {
                apiKey: secret1,
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {},
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
            error:
              'Either email or userId is required for track call.: Workflow: procWorkflow, Step: validateTrackEvent, ChildStep: undefined, OriginalError: Either email or userId is required for track call.',
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
