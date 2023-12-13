export const data = [
  {
    name: 'gladly',
    description: 'Gladly router tests',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
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
                timestamp: '2023-11-22T10:12:44.75705:30',
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
                timestamp: '2023-11-22T10:12:44.75705:30',
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
                timestamp: '2023-11-22T10:12:44.75705:30',
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
                jobId: 3,
              },
            },
          ],
          destType: 'gladly',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    address: 'california usa',
                    customAttributes: {
                      age: 23,
                    },
                    emails: [
                      {
                        original: 'test@rudderlabs.com',
                      },
                    ],
                    externalCustomerId: 'externalCustomer@1',
                    id: 'user@1',
                    phones: [
                      {
                        original: '+91 9999999999',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles',
                files: {},
                headers: {
                  Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiToken: 'testApiToken',
                  domain: 'rudderlabs.us-uat.gladly.qa',
                  userName: 'testUserName',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    address: 'New York, USA',
                    customAttributes: {
                      age: 23,
                    },
                    emails: [
                      {
                        original: 'test+2@rudderlabs.com',
                      },
                    ],
                    externalCustomerId: 'externalCustomer@2',
                    phones: [
                      {
                        original: '+91 9999999998',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles/user@2',
                files: {},
                headers: {
                  Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                  'Content-Type': 'application/json',
                },
                method: 'PATCH',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiToken: 'testApiToken',
                  domain: 'rudderlabs.us-uat.gladly.qa',
                  userName: 'testUserName',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    address: 'New York, USA',
                    externalCustomerId: 'externalCustomer@3',
                    phones: [
                      {
                        original: '+91 9999999988',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles/user@3',
                files: {},
                headers: {
                  Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                  'Content-Type': 'application/json',
                },
                method: 'PATCH',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiToken: 'testApiToken',
                  domain: 'rudderlabs.us-uat.gladly.qa',
                  userName: 'testUserName',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'gladly',
    description: 'Gladly rETL tests',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                userId: 'externalCustomer@1',
                channel: 'web',
                context: {
                  externalId: [
                    {
                      id: 'externalCustomer@1',
                      identifierType: 'externalCustomerId',
                    },
                  ],
                  mappedToDestination: true,
                },
                traits: {
                  id: 'user@1',
                  emails: ['test@rudderlabs.com'],
                  phones: ['+91 9999999999'],
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                  address: 'california usa',
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
                  apiToken: 'testApiToken',
                  userName: 'testUserName',
                  domain: 'rudderlabs.us-uat.gladly.qa',
                },
              },
              metadata: {
                jobId: 1,
              },
            },
            {
              message: {
                userId: 'externalCustomer@2',
                channel: 'web',
                context: {
                  externalId: [
                    {
                      id: 'externalCustomer@2',
                      identifierType: 'externalCustomerId',
                    },
                  ],
                  mappedToDestination: true,
                },
                traits: {
                  id: 'user@2',
                  emails: 'test+2@rudderlabs.com',
                  phones: '+91 9999999998',
                  firstName: 'Test',
                  lastName: 'Rudderstack',
                  address: 'New York, USA',
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
                  apiToken: 'testApiToken',
                  userName: 'testUserName',
                  domain: 'rudderlabs.us-uat.gladly.qa',
                },
              },
              metadata: {
                jobId: 2,
              },
            },
            {
              message: {
                userId: 'externalCustomer@3',
                channel: 'web',
                context: {
                  externalId: [
                    {
                      id: 'externalCustomer@3',
                      identifierType: 'externalCustomerId',
                    },
                  ],
                  mappedToDestination: true,
                },
                traits: {
                  id: 'user@3',
                  phones: '+91 9999999988',
                  firstName: 'Test',
                  lastName: 'Rudderstack',
                  address: 'New York, USA',
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
                  apiToken: 'testApiToken',
                  userName: 'testUserName',
                  domain: 'rudderlabs.us-uat.gladly.qa',
                },
              },
              metadata: {
                jobId: 3,
              },
            },
          ],
          destType: 'gladly',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    address: 'california usa',
                    emails: [
                      {
                        original: 'test@rudderlabs.com',
                      },
                    ],
                    externalCustomerId: 'externalCustomer@1',
                    id: 'user@1',
                    phones: [
                      {
                        original: '+91 9999999999',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles',
                files: {},
                headers: {
                  Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiToken: 'testApiToken',
                  domain: 'rudderlabs.us-uat.gladly.qa',
                  userName: 'testUserName',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    address: 'New York, USA',
                    emails: [
                      {
                        original: 'test+2@rudderlabs.com',
                      },
                    ],
                    externalCustomerId: 'externalCustomer@2',
                    phones: [
                      {
                        original: '+91 9999999998',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles/user@2',
                files: {},
                headers: {
                  Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                  'Content-Type': 'application/json',
                },
                method: 'PATCH',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiToken: 'testApiToken',
                  domain: 'rudderlabs.us-uat.gladly.qa',
                  userName: 'testUserName',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    address: 'New York, USA',
                    externalCustomerId: 'externalCustomer@3',
                    phones: [
                      {
                        original: '+91 9999999988',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rudderlabs.us-uat.gladly.qa/api/v1/customer-profiles/user@3',
                files: {},
                headers: {
                  Authorization: 'Basic dGVzdFVzZXJOYW1lOnRlc3RBcGlUb2tlbg==',
                  'Content-Type': 'application/json',
                },
                method: 'PATCH',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiToken: 'testApiToken',
                  domain: 'rudderlabs.us-uat.gladly.qa',
                  userName: 'testUserName',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
