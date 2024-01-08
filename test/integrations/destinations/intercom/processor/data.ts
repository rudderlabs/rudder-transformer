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
              'Either email or userId is required for Identify call: Workflow: procWorkflow, Step: validateIdentifyPayload, ChildStep: undefined, OriginalError: Either email or userId is required for Identify call',
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
              'Event name is required for track call: Workflow: procWorkflow, Step: validateTrackPayload, ChildStep: undefined, OriginalError: Event name is required for track call',
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
              'groupId is required for group call: Workflow: procWorkflow, Step: prepareCreateOrUpdateCompanyPayload, ChildStep: undefined, OriginalError: groupId is required for group call',
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
                  custom_attributes: {},
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
                apiServer: 'standard',
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
              endpoint: 'https://api.intercom.io/contacts/70701240741e45d040/companies',
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
];
