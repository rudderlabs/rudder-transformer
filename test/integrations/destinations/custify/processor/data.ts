import { authHeader2, secret2 } from '../maskedSecrets';
export const data = [
  {
    name: 'custify',
    description: 'Identify Call with all traits and adding to company',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: secret2,
                sendAnonymousId: false,
              },
              ID: 'custify-1234',
            },
            message: {
              type: 'identify',
              userId: 'user_1234',
              context: {
                traits: {
                  email: 'user111@gmail.com',
                  firstName: 'New',
                  lastName: 'User',
                  phone: 9830311522,
                  sessionCount: 23,
                  unsubscribedFromEmails: false,
                  unsubscribedFromCalls: false,
                  signed_up_at: '2022-04-27T13:56:13.012Z',
                  custom_prop1: 'custom_value1',
                  custom_prop2: 123,
                  custom_prop3: false,
                  custom_prop4: {
                    test: 'test',
                  },
                  custom_prop5: [1, 3, 4],
                  createdAt: '2022-04-27T13:56:13.012Z',
                  company: {
                    id: 'company_123',
                  },
                },
              },
              timestamp: '2022-04-27T13:56:13.012Z',
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
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
              endpoint: 'https://api.custify.com/people',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader2,
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'user_1234',
                  email: 'user111@gmail.com',
                  phone: 9830311522,
                  session_count: 23,
                  unsubscribed_from_emails: false,
                  unsubscribed_from_calls: false,
                  signed_up_at: '2022-04-27T13:56:13.012Z',
                  custom_attributes: {
                    firstName: 'New',
                    lastName: 'User',
                    sessionCount: 23,
                    unsubscribedFromEmails: false,
                    unsubscribedFromCalls: false,
                    custom_prop1: 'custom_value1',
                    custom_prop2: 123,
                    custom_prop3: false,
                    createdAt: '2022-04-27T13:56:13.012Z',
                  },
                  name: 'New User',
                  companies: [
                    {
                      company_id: 'company_123',
                      remove: false,
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'user_1234',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'custify',
    description: 'Identify Call removing the user from company',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: secret2,
                sendAnonymousId: false,
              },
              ID: 'custify-1234',
            },
            message: {
              type: 'identify',
              userId: 'user_1234',
              context: {
                traits: {
                  email: 'user111@gmail.com',
                  firstName: 'New',
                  lastName: 'User',
                  phone: 9830311522,
                  sessionCount: 23,
                  unsubscribedFromEmails: false,
                  unsubscribedFromCalls: false,
                  signed_up_at: '2022-04-27T13:56:13.012Z',
                  custom_prop1: 'custom_value1',
                  custom_prop2: 123,
                  custom_prop3: false,
                  custom_prop4: {
                    test: 'test',
                  },
                  custom_prop5: [1, 3, 4],
                  createdAt: '2022-04-27T13:56:13.012Z',
                  company: {
                    id: 'company_123',
                    remove: true,
                  },
                },
              },
              timestamp: '2022-04-27T13:56:13.012Z',
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
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
              endpoint: 'https://api.custify.com/people',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader2,
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'user_1234',
                  email: 'user111@gmail.com',
                  phone: 9830311522,
                  session_count: 23,
                  unsubscribed_from_emails: false,
                  unsubscribed_from_calls: false,
                  signed_up_at: '2022-04-27T13:56:13.012Z',
                  custom_attributes: {
                    firstName: 'New',
                    lastName: 'User',
                    sessionCount: 23,
                    unsubscribedFromEmails: false,
                    unsubscribedFromCalls: false,
                    custom_prop1: 'custom_value1',
                    custom_prop2: 123,
                    custom_prop3: false,
                    createdAt: '2022-04-27T13:56:13.012Z',
                  },
                  name: 'New User',
                  companies: [
                    {
                      company_id: 'company_123',
                      remove: true,
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'user_1234',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'custify',
    description: 'Identify Call without userId and email and anoymousId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: secret2,
                sendAnonymousId: false,
              },
              ID: 'custify-1234',
            },
            message: {
              type: 'identify',
              context: {
                traits: {
                  firstName: 'New',
                  lastName: 'User',
                  phone: 9830311522,
                  sessionCount: 23,
                  unsubscribedFromEmails: false,
                  unsubscribedFromCalls: false,
                  signed_up_at: '2022-04-27T13:56:13.012Z',
                  custom_prop1: 'custom_value1',
                  custom_prop2: 123,
                  custom_prop3: false,
                  custom_prop4: {
                    test: 'test',
                  },
                  custom_prop5: [1, 3, 4],
                  createdAt: '2022-04-27T13:56:13.012Z',
                  company: {
                    id: 'company_123',
                    remove: true,
                  },
                },
              },
              timestamp: '2022-04-27T13:56:13.012Z',
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
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
            error: 'Email or userId is mandatory',
            statTags: {
              destType: 'CUSTIFY',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'custify',
    description: 'Identify Call without userId and email and sendAnonymous is false',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: secret2,
                sendAnonymousId: false,
              },
              ID: 'custify-1234',
            },
            message: {
              type: 'identify',
              context: {
                traits: {
                  firstName: 'New',
                  lastName: 'User',
                  phone: 9830311522,
                  sessionCount: 23,
                  unsubscribedFromEmails: false,
                  unsubscribedFromCalls: false,
                  signed_up_at: '2022-04-27T13:56:13.012Z',
                  custom_prop1: 'custom_value1',
                  custom_prop2: 123,
                  custom_prop3: false,
                  custom_prop4: {
                    test: 'test',
                  },
                  custom_prop5: [1, 3, 4],
                  createdAt: '2022-04-27T13:56:13.012Z',
                  company: {
                    id: 'company_123',
                    remove: true,
                  },
                },
              },
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              timestamp: '2022-04-27T13:56:13.012Z',
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
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
            error: 'Email or userId is mandatory',
            statTags: {
              destType: 'CUSTIFY',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'custify',
    description: 'Identify Call without userId and email and sendAnonymous is true',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: secret2,
                sendAnonymousId: true,
              },
              ID: 'custify-1234',
            },
            message: {
              type: 'identify',
              context: {
                traits: {
                  firstName: 'New',
                  lastName: 'User',
                  phone: 9830311522,
                  sessionCount: 23,
                  unsubscribedFromEmails: false,
                  unsubscribedFromCalls: false,
                  signed_up_at: '2022-04-27T13:56:13.012Z',
                  custom_prop1: 'custom_value1',
                  custom_prop2: 123,
                  custom_prop3: false,
                  custom_prop4: {
                    test: 'test',
                  },
                  custom_prop5: [1, 3, 4],
                  createdAt: '2022-04-27T13:56:13.012Z',
                  company: {
                    id: 'company_123',
                    remove: true,
                  },
                },
              },
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              timestamp: '2022-04-27T13:56:13.012Z',
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
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
              endpoint: 'https://api.custify.com/people',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader2,
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  phone: 9830311522,
                  session_count: 23,
                  unsubscribed_from_emails: false,
                  unsubscribed_from_calls: false,
                  signed_up_at: '2022-04-27T13:56:13.012Z',
                  custom_attributes: {
                    firstName: 'New',
                    lastName: 'User',
                    sessionCount: 23,
                    unsubscribedFromEmails: false,
                    unsubscribedFromCalls: false,
                    custom_prop1: 'custom_value1',
                    custom_prop2: 123,
                    custom_prop3: false,
                    createdAt: '2022-04-27T13:56:13.012Z',
                  },
                  user_id: 'bf412108-0357-4330-b119-7305e767823c',
                  name: 'New User',
                  companies: [
                    {
                      company_id: 'company_123',
                      remove: true,
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'bf412108-0357-4330-b119-7305e767823c',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'custify',
    description: 'Track call with all properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: secret2,
                sendAnonymousId: false,
              },
              ID: 'custify-1234',
            },
            message: {
              type: 'track',
              event: 'Order Completed Version 2',
              sentAt: '2021-08-26T14:16:47.321Z',
              userId: 'user_111',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '1.0.3',
                },
                traits: {
                  email: 'user111@gmail.com',
                },
                page: {
                  url: 'https://www.website.com/product/path',
                },
              },
              rudderId: '70612f39-0607-45bb-8236-bf0995fde4fa',
              _metadata: {
                nodeVersion: '10.24.1',
              },
              messageId:
                'node-84952e4eb9c6debbda735c49d08a8b31-fcbfed6a-38cf-42c5-881c-f590f59311b1',
              properties: {
                product: 'Cube',
                revenue: 9002,
                organization_id: 'company_123',
              },
              originalTimestamp: '2021-08-26T14:16:47.317Z',
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
              endpoint: 'https://api.custify.com/event',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader2,
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'user_111',
                  email: 'user111@gmail.com',
                  name: 'Order Completed Version 2',
                  created_at: '2021-08-26T14:16:47.317Z',
                  company_id: 'company_123',
                  metadata: {
                    product: 'Cube',
                    revenue: 9002,
                    organization_id: 'company_123',
                    user_id: 'user_111',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'user_111',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'custify',
    description: 'Group call with all fields success scenario',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: secret2,
                sendAnonymousId: false,
              },
              ID: 'custify-1234',
            },
            message: {
              type: 'group',
              userId: 'user_111',
              groupId: 'company_222',
              traits: {
                name: 'Absolute Company',
                industry: ' Absolute',
                employees: 121,
                size: 100,
                website: 'www.rudder.com',
                plan: 'GOLD',
                monthly_revenue: 8000,
                churned: false,
                test_att1: 'test_att_val1',
              },
              context: {
                traits: {
                  firstName: 'Absolute',
                  lastName: 'User',
                  phone: 9830311522,
                  session_count: 23,
                  signed_up_at: '2022-04-27T13:56:13.012Z',
                  custom_prop1: 'custom_value1',
                  custom_prop2: 123,
                  custom_prop3: false,
                  custom_prop4: {
                    test: 'test',
                  },
                  custom_prop5: [1, 3, 4],
                  createdAt: '2022-04-27T13:56:13.012Z',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-01-21T00:21:34.208Z',
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
              endpoint: 'https://api.custify.com/people',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader2,
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'user_111',
                  phone: 9830311522,
                  signed_up_at: '2020-01-21T00:21:34.208Z',
                  custom_attributes: {
                    firstName: 'Absolute',
                    lastName: 'User',
                    custom_prop1: 'custom_value1',
                    custom_prop2: 123,
                    custom_prop3: false,
                    createdAt: '2022-04-27T13:56:13.012Z',
                  },
                  name: 'Absolute User',
                  companies: [
                    {
                      company_id: 'company_222',
                      remove: false,
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'user_111',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
