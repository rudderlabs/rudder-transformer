export const data = [
  {
    name: 'intercom',
    description: 'No message type',
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
                  age: 23,
                  email: 'adc@test.com',
                  firstname: 'Test',
                  birthday: '2022-05-13T12:51:01.470Z',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              event: 'Product Searched',
              originalTimestamp: '2020-09-22T14:42:44.724Z',
              timestamp: '2022-09-22T20:12:44.757+05:30',
              userId: 'user@1',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
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
              destType: 'INTERCOM',
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
    name: 'intercom',
    description: 'Unsupported message type',
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
                  age: 23,
                  email: 'adc@test.com',
                  firstname: 'Test',
                  birthday: '2022-05-13T12:51:01.470Z',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              event: 'Product Searched',
              type: 'page',
              originalTimestamp: '2020-09-22T14:42:44.724Z',
              timestamp: '2022-09-22T20:12:44.757+05:30',
              userId: 'user@1',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
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
              'message type page is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type page is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'INTERCOM',
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
    name: 'intercom',
    description: 'Missing required config',
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
                  age: 23,
                  email: 'adc@test.com',
                  firstName: 'Test',
                },
              },
              type: 'identify',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
              },
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
              'Access Token is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Access Token is not present. Aborting',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'INTERCOM',
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
    name: 'intercom',
    description: 'Create customer with email as lookup field',
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
                  age: 23,
                  email: 'test@rudderlabs.com',
                  phone: '+91 9999999999',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                  address: 'california usa',
                  ownerId: '13',
                  lastSeenAt: '2023-11-10T14:42:44.724Z',
                },
              },
              type: 'identify',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
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
            output: {
              body: {
                JSON: {
                  email: 'test@rudderlabs.com',
                  external_id: 'user@1',
                  last_seen_at: 1699627364,
                  name: 'Test Rudderlabs',
                  owner_id: 13,
                  phone: '+91 9999999999',
                  custom_attributes: {
                    address: 'california usa',
                    age: 23,
                  },
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://api.intercom.io/contacts',
              headers: {
                Authorization: 'Bearer testApiKey',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Intercom-Version': '2.10',
              },
              userId: '',
              version: '1',
              type: 'REST',
              method: 'POST',
              files: {},
              params: {},
            },
            metadata: { jobId: 4 },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Update customer with email as lookup field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@2',
              channel: 'web',
              context: {
                traits: {
                  age: 32,
                  email: 'test+2@rudderlabs.com',
                  phone: '+91 9299999999',
                  firstName: 'Test',
                  lastName: 'RudderStack',
                  ownerId: '14',
                },
              },
              type: 'identify',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
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
            output: {
              body: {
                JSON: {
                  email: 'test+2@rudderlabs.com',
                  external_id: 'user@2',
                  name: 'Test RudderStack',
                  owner_id: 14,
                  phone: '+91 9299999999',
                  custom_attributes: {
                    age: 32,
                  },
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://api.intercom.io/contacts/7070129940741e45d040',
              headers: {
                Authorization: 'Bearer testApiKey',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Intercom-Version': '2.10',
              },
              userId: '',
              version: '1',
              type: 'REST',
              method: 'PUT',
              files: {},
              params: {},
            },
            metadata: { jobId: 5 },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Missing required parameters for an identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon@2',
              channel: 'web',
              context: {
                traits: {
                  age: 32,
                  phone: '+91 9299999999',
                  firstName: 'Test',
                  lastName: 'RudderStack',
                  ownerId: '14',
                  role: 'user',
                  source: 'rudder-sdk',
                },
              },
              integrations: {
                INTERCOM: {
                  lookup: 'phone',
                },
              },
              type: 'identify',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
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
              'Either email or userId is required for Identify call: Workflow: procWorkflow, Step: identifyPayloadForLatestVersion, ChildStep: undefined, OriginalError: Either email or userId is required for Identify call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'INTERCOM',
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
    name: 'intercom',
    description: 'Unauthorized error while searching contact for an identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@3',
              channel: 'web',
              context: {
                traits: {
                  phone: '+91 9399999999',
                  email: 'test+3@rudderlabs.com',
                  firstName: 'Test',
                  lastName: 'Rudder',
                  ownerId: '15',
                  role: 'admin',
                  source: 'rudder-android-sdk',
                },
              },
              integrations: {
                INTERCOM: {
                  lookup: 'email',
                },
              },
              type: 'identify',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'invalidApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
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
            statusCode: 401,
            error:
              '{"message":"{\\"message\\":\\"Unable to search contact due to : [{\\\\\\"code\\\\\\":\\\\\\"unauthorized\\\\\\",\\\\\\"message\\\\\\":\\\\\\"Access Token Invalid\\\\\\"}]: Workflow: procWorkflow, Step: searchContact, ChildStep: undefined, OriginalError: Unable to search contact due to : [{\\\\\\"code\\\\\\":\\\\\\"unauthorized\\\\\\",\\\\\\"message\\\\\\":\\\\\\"Access Token Invalid\\\\\\"}]\\",\\"destinationResponse\\":{\\"response\\":{\\"type\\":\\"error.list\\",\\"request_id\\":\\"request_1\\",\\"errors\\":[{\\"code\\":\\"unauthorized\\",\\"message\\":\\"Access Token Invalid\\"}]},\\"status\\":401}}","destinationResponse":{"response":{"type":"error.list","request_id":"request_1","errors":[{"code":"unauthorized","message":"Access Token Invalid"}]},"status":401}}',
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'INTERCOM',
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
    name: 'intercom',
    description: 'Track call without event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@3',
              channel: 'web',
              context: {
                traits: {
                  age: 32,
                  email: 'test+3@rudderlabs.com',
                  phone: '+91 9399999999',
                  firstName: 'Test',
                  lastName: 'RudderStack',
                  ownerId: '15',
                },
              },
              properties: {
                revenue: {
                  amount: 1232,
                  currency: 'inr',
                  test: 123,
                },
                price: {
                  amount: 3000,
                  currency: 'USD',
                },
              },
              type: 'track',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
              },
            },
            metadata: {
              jobId: 8,
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
              jobId: 8,
            },
            statusCode: 400,
            error:
              'Event name is required for track call: Workflow: procWorkflow, Step: trackPayload, ChildStep: undefined, OriginalError: Event name is required for track call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'INTERCOM',
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
    name: 'intercom',
    description: 'Successful track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@2',
              channel: 'web',
              context: {
                traits: {
                  age: 32,
                  email: 'test+2@rudderlabs.com',
                  phone: '+91 9299999999',
                  firstName: 'Test',
                  lastName: 'RudderStack',
                  ownerId: '14',
                },
              },
              properties: {
                revenue: {
                  amount: 1232,
                  currency: 'inr',
                  test: 123,
                },
                price: {
                  amount: 3000,
                  currency: 'USD',
                },
              },
              event: 'Product Viewed',
              type: 'track',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
              },
            },
            metadata: {
              jobId: 9,
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
            output: {
              body: {
                FORM: {},
                JSON: {
                  created_at: 1700628164,
                  email: 'test+2@rudderlabs.com',
                  event_name: 'Product Viewed',
                  metadata: {
                    price: {
                      amount: 3000,
                      currency: 'USD',
                    },
                    revenue: {
                      amount: 1232,
                      currency: 'inr',
                      test: 123,
                    },
                  },
                  user_id: 'user@2',
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.intercom.io/events',
              headers: {
                Accept: 'application/json',
                Authorization: 'Bearer testApiKey',
                'Content-Type': 'application/json',
                'Intercom-Version': '2.10',
              },
              method: 'POST',
              type: 'REST',
              userId: '',
              version: '1',
              params: {},
              files: {},
            },
            statusCode: 200,
            metadata: {
              jobId: 9,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Group call without groupId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@4',
              channel: 'web',
              context: {
                traits: {
                  email: 'test+4@rudderlabs.com',
                  phone: '+91 9499999999',
                  firstName: 'John',
                  lastName: 'Doe',
                  ownerId: '16',
                },
              },
              traits: {
                name: 'RudderStack',
                size: 500,
                website: 'www.rudderstack.com',
                industry: 'CDP',
                plan: 'enterprise',
              },
              type: 'group',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
              },
            },
            metadata: {
              jobId: 10,
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
              jobId: 10,
            },
            statusCode: 400,
            error:
              'groupId is required for group call: Workflow: procWorkflow, Step: groupPayloadForLatestVersion, ChildStep: validateMessageAndPreparePayload, OriginalError: groupId is required for group call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'INTERCOM',
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
    name: 'intercom',
    description: 'Successful group call to create or update company',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@4',
              groupId: 'rudderlabs',
              channel: 'web',
              context: {
                traits: {
                  email: 'test+4@rudderlabs.com',
                  phone: '+91 9499999999',
                  firstName: 'John',
                  lastName: 'Doe',
                  ownerId: '16',
                },
              },
              traits: {
                name: 'RudderStack',
                size: 500,
                website: 'www.rudderstack.com',
                industry: 'CDP',
                plan: 'enterprise',
              },
              type: 'group',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
              },
            },
            metadata: {
              jobId: 11,
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
            output: {
              body: {
                JSON: {
                  company_id: 'rudderlabs',
                  industry: 'CDP',
                  name: 'RudderStack',
                  plan: 'enterprise',
                  size: 500,
                  website: 'www.rudderstack.com',
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://api.intercom.io/companies',
              headers: {
                Accept: 'application/json',
                Authorization: 'Bearer testApiKey',
                'Content-Type': 'application/json',
                'Intercom-Version': '2.10',
              },
              method: 'POST',
              type: 'REST',
              userId: '',
              version: '1',
              params: {},
              files: {},
            },
            statusCode: 200,
            metadata: {
              jobId: 11,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Successful group call to add user to company',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@5',
              groupId: 'rudderlabs',
              channel: 'web',
              context: {
                traits: {
                  email: 'test+5@rudderlabs.com',
                  phone: '+91 9599999999',
                  firstName: 'John',
                  lastName: 'Snow',
                  ownerId: '17',
                },
              },
              traits: {
                name: 'RudderStack',
                size: 500,
                website: 'www.rudderstack.com',
                industry: 'CDP',
                plan: 'enterprise',
              },
              type: 'group',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'eu',
                sendAnonymousId: false,
              },
            },
            metadata: {
              jobId: 12,
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
            output: {
              body: {
                JSON: {
                  id: '657264e9018c0a647s45',
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://api.eu.intercom.io/contacts/70701240741e45d040/companies',
              headers: {
                Accept: 'application/json',
                Authorization: 'Bearer testApiKey',
                'Content-Type': 'application/json',
                'Intercom-Version': '2.10',
              },
              method: 'POST',
              type: 'REST',
              userId: '',
              version: '1',
              params: {},
              files: {},
            },
            statusCode: 200,
            metadata: {
              jobId: 12,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Identify rEtl test',
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
                mappedToDestination: true,
              },
              traits: {
                email: 'test@rudderlabs.com',
                phone: '+91 9999999999',
                name: 'Test Rudderlabs',
                owner_id: 13,
              },
              type: 'identify',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
              },
            },
            metadata: {
              jobId: 13,
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
            output: {
              body: {
                JSON: {
                  email: 'test@rudderlabs.com',
                  name: 'Test Rudderlabs',
                  phone: '+91 9999999999',
                  owner_id: 13,
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://api.intercom.io/contacts',
              headers: {
                Authorization: 'Bearer testApiKey',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Intercom-Version': '2.10',
              },
              userId: '',
              version: '1',
              type: 'REST',
              method: 'POST',
              files: {},
              params: {},
            },
            metadata: { jobId: 13 },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Track rEtl test',
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
                mappedToDestination: true,
              },
              traits: {
                event_name: 'Product Viewed',
                user_id: 'user@1',
                revenue: {
                  amount: 1232,
                  currency: 'inr',
                  test: 123,
                },
                price: {
                  amount: 3000,
                  currency: 'USD',
                },
              },
              event: 'Product Viewed',
              type: 'track',
              originalTimestamp: '2023-11-10T14:42:44.724Z',
              timestamp: '2023-11-22T10:12:44.757+05:30',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'testApiKey',
                apiVersion: 'v2',
                apiServer: 'standard',
                sendAnonymousId: false,
              },
            },
            metadata: {
              jobId: 14,
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
            output: {
              body: {
                JSON: {
                  event_name: 'Product Viewed',
                  price: {
                    amount: 3000,
                    currency: 'USD',
                  },
                  revenue: {
                    amount: 1232,
                    currency: 'inr',
                    test: 123,
                  },
                  user_id: 'user@1',
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://api.intercom.io/events',
              headers: {
                Authorization: 'Bearer testApiKey',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Intercom-Version': '2.10',
              },
              userId: '',
              version: '1',
              type: 'REST',
              method: 'POST',
              files: {},
              params: {},
            },
            metadata: { jobId: 14 },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version - successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  userId: 'test_user_id_1',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                  address: {
                    city: 'Kolkata',
                    state: 'West Bengal',
                  },
                  originalArray: [
                    {
                      nested_field: 'nested value',
                      tags: ['tag_1', 'tag_2', 'tag_3'],
                    },
                    {
                      nested_field: 'nested value',
                      tags: ['tag_1'],
                    },
                    {
                      nested_field: 'nested value',
                    },
                  ],
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 15,
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
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'test_user_id_1',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  name: 'Test Name',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                    'address.city': 'Kolkata',
                    'address.state': 'West Bengal',
                    'originalArray[0].nested_field': 'nested value',
                    'originalArray[0].tags[0]': 'tag_1',
                    'originalArray[0].tags[1]': 'tag_2',
                    'originalArray[0].tags[2]': 'tag_3',
                    'originalArray[1].nested_field': 'nested value',
                    'originalArray[1].tags[0]': 'tag_1',
                    'originalArray[2].nested_field': 'nested value',
                  },
                  update_last_request_at: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 15,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version - successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 16,
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
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: true,
                  name: 'Test Name',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 16,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version - successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 17,
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
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: true,
                  name: 'Name',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 17,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version - successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  firstName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 18,
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
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: true,
                  name: 'Name',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 18,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old Version: Identify call without email and userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  firstName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 19,
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
              'Either of `email` or `userId` is required for Identify call: Workflow: procWorkflow, Step: identifyPayloadForOlderVersion, ChildStep: undefined, OriginalError: Either of `email` or `userId` is required for Identify call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'INTERCOM',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
            },
            metadata: {
              jobId: 19,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version - successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                  company: {
                    name: 'Test Comp',
                    id: 'company_id',
                    industry: 'test industry',
                    key1: 'value1',
                    key2: {
                      a: 'a',
                    },
                    key3: [1, 2, 3],
                  },
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 20,
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
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: true,
                  name: 'Name',
                  companies: [
                    {
                      company_id: 'company_id',
                      custom_attributes: {
                        key1: 'value1',
                        key2: '{"a":"a"}',
                        key3: '[1,2,3]',
                      },
                      name: 'Test Comp',
                      industry: 'test industry',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 20,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version - successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                  company: {
                    name: 'Test Comp',
                    industry: 'test industry',
                    key1: 'value1',
                    key2: null,
                    key3: ['value1', 'value2'],
                    key4: {
                      foo: 'bar',
                    },
                  },
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
                updateLastRequestAt: false,
              },
            },
            metadata: {
              jobId: 21,
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
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: false,
                  name: 'Name',
                  companies: [
                    {
                      company_id: 'c0277b5c814453e5135f515f943d085a',
                      custom_attributes: {
                        key1: 'value1',
                        key3: '["value1","value2"]',
                        key4: '{"foo":"bar"}',
                      },
                      name: 'Test Comp',
                      industry: 'test industry',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 21,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version - successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                  company: {
                    industry: 'test industry',
                    key1: 'value1',
                    key2: null,
                  },
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 22,
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
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: true,
                  name: 'Name',
                  companies: [],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 22,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version - successful track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  userId: 'test_user_id_1',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              properties: {
                property1: 1,
                property2: 'test',
                property3: true,
                property4: '2020-10-05T09:09:03.731Z',
                property5: {
                  property1: 1,
                  property2: 'test',
                  property3: {
                    subProp1: {
                      a: 'a',
                      b: 'b',
                    },
                    subProp2: ['a', 'b'],
                  },
                },
                properties6: null,
                revenue: {
                  amount: 1232,
                  currency: 'inr',
                  test: 123,
                },
                price: {
                  amount: 3000,
                  currency: 'USD',
                },
                article: {
                  url: 'https://example.org/ab1de.html',
                  value: 'the dude abides',
                },
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'track',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 23,
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
              endpoint: 'https://api.intercom.io/events',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'test_user_id_1',
                  email: 'test_1@test.com',
                  event_name: 'Test Event 2',
                  created: 1601493061,
                  metadata: {
                    revenue: {
                      amount: 1232,
                      currency: 'inr',
                      test: 123,
                    },
                    price: {
                      amount: 3000,
                      currency: 'USD',
                    },
                    article: {
                      url: 'https://example.org/ab1de.html',
                      value: 'the dude abides',
                    },
                    property1: 1,
                    property2: 'test',
                    property3: true,
                    property4: '2020-10-05T09:09:03.731Z',
                    'property5.property1': 1,
                    'property5.property2': 'test',
                    'property5.property3.subProp1.a': 'a',
                    'property5.property3.subProp1.b': 'b',
                    'property5.property3.subProp2[0]': 'a',
                    'property5.property3.subProp2[1]': 'b',
                    properties6: null,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 23,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version - successful track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'track',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 24,
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
              endpoint: 'https://api.intercom.io/events',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  event_name: 'Test Event 2',
                  created: 1601493061,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 24,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version : Track call without email or userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'track',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 25,
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
              'Either email or userId is required for Track call: Workflow: procWorkflow, Step: trackPayload, ChildStep: undefined, OriginalError: Either email or userId is required for Track call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'INTERCOM',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
            },
            metadata: {
              jobId: 25,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version : successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                externalId: [
                  {
                    identifierType: 'email',
                    id: 'test@gmail.com',
                  },
                ],
                mappedToDestination: true,
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 26,
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
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                  email: 'test@gmail.com',
                  update_last_request_at: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 26,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version : successful identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
                sendAnonymousId: true,
              },
            },
            metadata: {
              jobId: 27,
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
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  phone: '9876543210',
                  name: 'Test Name',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  user_id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  update_last_request_at: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
            metadata: {
              jobId: 27,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version : Identify call without email or userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'intercomApiKey',
                apiVersion: 'v1',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
                sendAnonymousId: false,
              },
            },
            metadata: {
              jobId: 28,
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
              'Either of `email` or `userId` is required for Identify call: Workflow: procWorkflow, Step: identifyPayloadForOlderVersion, ChildStep: undefined, OriginalError: Either of `email` or `userId` is required for Identify call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'INTERCOM',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
            },
            metadata: {
              jobId: 28,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version : successful group call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              groupId: 'test_company_id_wdasda',
              traits: {
                employees: 450,
                plan: 'basic',
                userId: 'sdfrsdfsdfsf',
                email: 'test@test.com',
                name: 'rudderUpdate',
                size: '50',
                industry: 'IT',
                monthlySpend: '2131231',
                remoteCreatedAt: '1683017572',
                key1: 'val1',
              },
              anonymousId: 'sdfrsdfsdfsf',
              integrations: {
                All: true,
              },
              type: 'group',
              userId: 'sdfrsdfsdfsf',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'abcd=',
                appId: 'asdasdasd',
                apiVersion: 'v1',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 29,
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
              endpoint: 'https://api.intercom.io/companies',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  company_id: 'test_company_id_wdasda',
                  name: 'rudderUpdate',
                  plan: 'basic',
                  size: 50,
                  industry: 'IT',
                  monthly_spend: 2131231,
                  remote_created_at: 1683017572,
                  custom_attributes: {
                    employees: 450,
                    email: 'test@test.com',
                    key1: 'val1',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sdfrsdfsdfsf',
            },
            statusCode: 200,
            metadata: {
              jobId: 29,
            },
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'sdfrsdfsdfsf',
                  companies: [
                    {
                      company_id: 'test_company_id_wdasda',
                      name: 'rudderUpdate',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sdfrsdfsdfsf',
            },
            statusCode: 200,
            metadata: {
              jobId: 29,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version : successful group call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              groupId: 'test_company_id',
              traits: {
                plan: 'basic',
                name: 'rudderUpdate',
                size: 50,
                industry: 'IT',
                monthlySpend: '2131231',
                email: 'comanyemail@abc.com',
              },
              anonymousId: '12312312',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                userAgent: 'unknown',
              },
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              type: 'group',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'abcd=',
                apiVersion: 'v1',
                appId: 'asdasdasd',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 30,
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
              endpoint: 'https://api.intercom.io/companies',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  company_id: 'test_company_id',
                  name: 'rudderUpdate',
                  plan: 'basic',
                  size: 50,
                  industry: 'IT',
                  monthly_spend: 2131231,
                  custom_attributes: {
                    email: 'comanyemail@abc.com',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '12312312',
            },
            statusCode: 200,
            metadata: {
              jobId: 30,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version : successful group call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              groupId: 'test_company_id_wdasda',
              context: {
                traits: {
                  email: 'testUser@test.com',
                },
              },
              traits: {
                employees: 450,
                plan: 'basic',
                email: 'test@test.com',
                name: 'rudderUpdate',
                size: '50',
                industry: 'IT',
                website: 'url',
                monthlySpend: '2131231',
                remoteCreatedAt: '1683017572',
                key1: 'val1',
              },
              anonymousId: 'sdfrsdfsdfsf',
              integrations: {
                All: true,
              },
              type: 'group',
              userId: 'sdfrsdfsdfsf',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'abcd=',
                apiVersion: 'v1',
                appId: 'asdasdasd',
                collectContext: false,
              },
            },
            metadata: {
              jobId: 31,
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
              endpoint: 'https://api.intercom.io/companies',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  company_id: 'test_company_id_wdasda',
                  name: 'rudderUpdate',
                  plan: 'basic',
                  size: 50,
                  website: 'url',
                  industry: 'IT',
                  monthly_spend: 2131231,
                  remote_created_at: 1683017572,
                  custom_attributes: {
                    employees: 450,
                    email: 'test@test.com',
                    key1: 'val1',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sdfrsdfsdfsf',
            },
            statusCode: 200,
            metadata: {
              jobId: 31,
            },
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'sdfrsdfsdfsf',
                  email: 'testUser@test.com',
                  companies: [
                    {
                      company_id: 'test_company_id_wdasda',
                      name: 'rudderUpdate',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sdfrsdfsdfsf',
            },
            statusCode: 200,
            metadata: {
              jobId: 31,
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Old version : successful group call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              groupId: 'test_company_id_wdasda',
              context: {
                traits: {
                  email: 'testUser@test.com',
                },
              },
              traits: {
                employees: 450,
                plan: 'basic',
                email: 'test@test.com',
                name: 'rudderUpdate',
                size: '50',
                industry: 'IT',
                website: 'url',
                monthlySpend: '2131231',
                remoteCreatedAt: '1683017572',
                key1: 'val1',
                key2: {
                  a: 'a',
                  b: 'b',
                },
                key3: [1, 2, 3],
                key4: null,
              },
              anonymousId: 'anonId',
              integrations: {
                All: true,
              },
              type: 'group',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'abcd=',
                appId: 'asdasdasd',
                apiVersion: 'v1',
                collectContext: false,
                sendAnonymousId: true,
              },
            },
            metadata: {
              jobId: 32,
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
              endpoint: 'https://api.intercom.io/companies',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  company_id: 'test_company_id_wdasda',
                  name: 'rudderUpdate',
                  plan: 'basic',
                  size: 50,
                  website: 'url',
                  industry: 'IT',
                  monthly_spend: 2131231,
                  remote_created_at: 1683017572,
                  custom_attributes: {
                    employees: 450,
                    email: 'test@test.com',
                    key1: 'val1',
                    'key2.a': 'a',
                    'key2.b': 'b',
                    'key3[0]': 1,
                    'key3[1]': 2,
                    'key3[2]': 3,
                    key4: null,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anonId',
            },
            statusCode: 200,
            metadata: {
              jobId: 32,
            },
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'anonId',
                  email: 'testUser@test.com',
                  companies: [
                    {
                      company_id: 'test_company_id_wdasda',
                      name: 'rudderUpdate',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anonId',
            },
            statusCode: 200,
            metadata: {
              jobId: 32,
            },
          },
        ],
      },
    },
  },
];
