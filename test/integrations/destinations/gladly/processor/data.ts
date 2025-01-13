export const data = [
  {
    name: 'gladly',
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
                  age: 23,
                  email: 'adc@test.com',
                  firstName: 'Test',
                },
              },
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
                apiToken: 'testApiToken',
                userName: 'testUserName',
                domain: 'rudderlabs.us-uat.gladly.qa',
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
              destType: 'GLADLY',
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
    name: 'gladly',
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
              channel: 'web',
              context: {
                traits: {
                  age: 23,
                  email: 'adc@test.com',
                  firstName: 'Test',
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
                apiToken: 'testApiToken',
                userName: 'testUserName',
                domain: 'rudderlabs.us-uat.gladly.qa',
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
              'message type track is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type track is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GLADLY',
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
    name: 'gladly',
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
                apiToken: 'testApiToken',
                domain: 'rudderlabs.us-uat.gladly.qa',
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
              'User Name is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: User Name is not present. Aborting',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'GLADLY',
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
    name: 'gladly',
    description: 'Create customer with email as lookup field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'externalCustomer@1',
              channel: 'web',
              context: {
                traits: {
                  age: 23,
                  email: 'test@rudderlabs.com',
                  phone: '+91 9999999999',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                  address: 'california usa',
                },
                externalId: [
                  {
                    id: 'user@1',
                    type: 'GladlyCustomerId',
                  },
                ],
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
                apiToken: 'testApiToken',
                userName: 'testUserName',
                domain: 'rudderlabs.us-uat.gladly.qa',
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
                  address: 'california usa',
                  customAttributes: { age: 23 },
                  emails: [{ original: 'test@rudderlabs.com' }],
                  externalCustomerId: 'externalCustomer@1',
                  id: 'user@1',
                  phones: [{ original: '+91 9999999999' }],
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles',
              headers: {
                Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                'Content-Type': 'application/json',
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
    name: 'gladly',
    description: 'Update customer with email as lookup field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'externalCustomer@2',
              channel: 'web',
              context: {
                traits: {
                  age: 23,
                  email: 'test+2@rudderlabs.com',
                  phone: '+91 9999999998',
                  firstName: 'Test',
                  lastName: 'Rudderstack',
                  address: 'New York, USA',
                },
                externalId: [
                  {
                    id: 'user@2',
                    type: 'GladlyCustomerId',
                  },
                ],
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
                apiToken: 'testApiToken',
                userName: 'testUserName',
                domain: 'rudderlabs.us-uat.gladly.qa',
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
                  address: 'New York, USA',
                  customAttributes: { age: 23 },
                  emails: [{ original: 'test+2@rudderlabs.com' }],
                  externalCustomerId: 'externalCustomer@2',
                  phones: [{ original: '+91 9999999998' }],
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles/user@2',
              headers: {
                Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                'Content-Type': 'application/json',
              },
              userId: '',
              version: '1',
              type: 'REST',
              method: 'PATCH',
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
    name: 'gladly',
    description: 'Update customer with phone as lookup field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'externalCustomer@3',
              channel: 'web',
              context: {
                traits: {
                  phone: '+91 9999999988',
                  firstName: 'Test',
                  lastName: 'Rudderstack',
                  address: 'New York, USA',
                },
                externalId: [
                  {
                    id: 'user@3',
                    type: 'GladlyCustomerId',
                  },
                ],
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
                apiToken: 'testApiToken',
                userName: 'testUserName',
                domain: 'rudderlabs.us-uat.gladly.qa',
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
            output: {
              body: {
                JSON: {
                  address: 'New York, USA',
                  externalCustomerId: 'externalCustomer@3',
                  phones: [{ original: '+91 9999999988' }],
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles/user@3',
              headers: {
                Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                'Content-Type': 'application/json',
              },
              userId: '',
              version: '1',
              type: 'REST',
              method: 'PATCH',
              files: {},
              params: {},
            },
            metadata: { jobId: 6 },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'gladly',
    description: 'Required values are not present in payload to create or update customer',
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
                  firstName: 'Test',
                  lastName: 'Rudderstack',
                  address: 'New York, USA',
                },
              },
              type: 'identify',
              anonymousId: '78c53c15-32a1-4b65-adac-bec2d7bb8fab',
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
                apiToken: 'testApiToken',
                userName: 'testUserName',
                domain: 'rudderlabs.us-uat.gladly.qa',
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
            statusCode: 400,
            error:
              'One of phone, email, userId or GladlyCustomerId is required for an identify call: Workflow: procWorkflow, Step: validatePayload, ChildStep: undefined, OriginalError: One of phone, email, userId or GladlyCustomerId is required for an identify call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GLADLY',
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
    name: 'gladly',
    description: 'Multiple emails and phones are present in payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'externalCustomer@6',
              channel: 'web',
              context: {
                traits: {
                  age: 23,
                  email: [
                    'test6@rudderlabs.com',
                    'test6home@rudderlabs.com',
                    'test6office@rudderlabs.com',
                  ],
                  phone: ['+91 8888888888', '+91 8888888889'],
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                  address: 'Germany',
                },
                externalId: [
                  {
                    id: 'user@6',
                    type: 'GladlyCustomerId',
                  },
                ],
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
                apiToken: 'testApiToken',
                userName: 'testUserName',
                domain: 'rudderlabs.us-uat.gladly.qa',
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
            output: {
              body: {
                JSON: {
                  address: 'Germany',
                  customAttributes: { age: 23 },
                  emails: [
                    { original: 'test6@rudderlabs.com' },
                    { original: 'test6home@rudderlabs.com' },
                    { original: 'test6office@rudderlabs.com' },
                  ],
                  externalCustomerId: 'externalCustomer@6',
                  id: 'user@6',
                  phones: [{ original: '+91 8888888888' }, { original: '+91 8888888889' }],
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles',
              headers: {
                Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                'Content-Type': 'application/json',
              },
              userId: '',
              version: '1',
              type: 'REST',
              method: 'POST',
              files: {},
              params: {},
            },
            metadata: { jobId: 8 },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'gladly',
    description: 'Create customer with only GladlyCustomerId',
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
                  firstName: 'Test',
                  lastName: 'Undefined',
                  address: 'India',
                  isProUser: true,
                },
                externalId: [
                  {
                    id: 'user@9',
                    type: 'GladlyCustomerId',
                  },
                ],
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
                apiToken: 'testApiToken',
                userName: 'testUserName',
                domain: 'rudderlabs.us-uat.gladly.qa',
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
                JSON: {
                  address: 'India',
                  customAttributes: { isProUser: true },
                  id: 'user@9',
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles',
              headers: {
                Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                'Content-Type': 'application/json',
              },
              userId: '',
              version: '1',
              type: 'REST',
              method: 'POST',
              files: {},
              params: {},
            },
            metadata: { jobId: 9 },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'gladly',
    description: 'Create customer with invalid lookup field value',
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
                  firstName: 'Test',
                  lastName: 'Undefined',
                  address: 'Pakistan',
                  email: 'abc',
                },
                externalId: [
                  {
                    id: 'user@10',
                    type: 'GladlyCustomerId',
                  },
                ],
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
                apiToken: 'testApiToken',
                userName: 'testUserName',
                domain: 'rudderlabs.us-uat.gladly.qa',
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
            output: {
              body: {
                JSON: {
                  address: 'Pakistan',
                  emails: [{ original: 'abc' }],
                  id: 'user@10',
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles',
              headers: {
                Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                'Content-Type': 'application/json',
              },
              userId: '',
              version: '1',
              type: 'REST',
              method: 'POST',
              files: {},
              params: {},
            },
            metadata: { jobId: 10 },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
