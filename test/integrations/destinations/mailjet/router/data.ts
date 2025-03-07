import { authHeader1, secret1, secret2 } from '../maskedSecrets';
export const data = [
  {
    name: 'mailjet',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
              metadata: { jobId: 1, userId: 'u1' },
              message: {
                userId: 'user@45',
                type: 'identify',
                context: {
                  traits: {
                    age: '30',
                    email: 'test@user.com',
                    phone: '7267286346802347827',
                    userId: 'sajal',
                    city: 'gondal',
                    userCountry: 'india',
                    lastName: 'dev',
                    username: 'Samle_putUserName',
                    firstName: 'rudderlabs',
                  },
                },
              },
            },
          ],
          destType: 'mailjet',
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.mailjet.com/v3/REST/contactslist/58578/managemanycontacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  FORM: {},
                  JSON: {
                    Action: 'addnoforce',
                    Contacts: [{ email: 'test@user.com', properties: { country: 'india' } }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                files: {},
              },
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'mailjet',
    description: 'batching with 1 listId and 1 action',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              message: {
                userId: 'user@45',
                type: 'identify',
                context: {
                  traits: {
                    age: '30',
                    email: 'test@user.com',
                    phone: '7267286346802347827',
                    userId: 'sajal',
                    city: 'gondal',
                    userCountry: 'india',
                    lastName: 'dev',
                    username: 'Samle_putUserName',
                    firstName: 'rudderlabs',
                  },
                },
              },
            },
          ],
          destType: 'mailjet',
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.mailjet.com/v3/REST/contactslist/58578/managemanycontacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  FORM: {},
                  JSON: {
                    Action: 'addnoforce',
                    Contacts: [
                      {
                        email: 'test@user.com',
                        properties: { country: 'india' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [
                    {
                      from: 'userCountry',
                      to: 'country',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'mailjet',
    description: 'batching with multiple listId and multiple action combinations',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              message: {
                userId: 'user@45',
                type: 'identify',
                context: {
                  traits: {
                    age: '30',
                    email: 'test@user.com',
                    phone: '7267286346802347827',
                    userId: 'sajal',
                    city: 'gondal',
                    userCountry: 'india',
                    lastName: 'dev',
                    username: 'Samle_putUserName',
                    firstName: 'rudderlabs',
                  },
                },
              },
            },
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              message: {
                userId: 'user@46',
                type: 'identify',
                context: {
                  traits: {
                    age: '30',
                    email: 'test2@user.com',
                    phone: '7267286346802347827',
                    userId: 'sajal',
                    city: 'gondal',
                    userCountry: 'india',
                    lastName: 'dev',
                    username: 'Samle_putUserName',
                    firstName: 'rudderlabs',
                  },
                  externalId: [
                    {
                      type: 'listId',
                      id: '58570',
                    },
                  ],
                },
                integrations: {
                  All: true,
                  mailjet: {
                    Action: 'unsub',
                  },
                },
              },
            },
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              message: {
                userId: 'user@47',
                type: 'identify',
                context: {
                  traits: {
                    age: '30',
                    email: 'test3@user.com',
                    phone: '7267286346802347827',
                    userId: 'sajal',
                    city: 'gondal',
                    userCountry: 'india',
                    lastName: 'dev',
                    username: 'Samle_putUserName',
                    firstName: 'rudderlabs',
                  },
                  externalId: [
                    {
                      type: 'listId',
                      id: '58576',
                    },
                  ],
                },
                integrations: {
                  All: true,
                  mailjet: {
                    Action: 'addforce',
                  },
                },
              },
            },
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
              },
              message: {
                userId: 'user@48',
                type: 'identify',
                context: {
                  traits: {
                    age: '30',
                    email: 'test4@user.com',
                    phone: '7267286346802347827',
                    userId: 'sajal',
                    city: 'gondal',
                    userCountry: 'india',
                    lastName: 'dev',
                    username: 'Samle_putUserName',
                    firstName: 'rudderlabs',
                  },
                  externalId: [
                    {
                      type: 'listId',
                      id: '58576',
                    },
                  ],
                },
                integrations: {
                  All: true,
                  mailjet: {
                    Action: 'unsub',
                  },
                },
              },
            },
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
              metadata: {
                jobId: 5,
                userId: 'u1',
              },
              message: {
                userId: 'user@49',
                type: 'identify',
                context: {
                  traits: {
                    age: '30',
                    email: 'test5@user.com',
                    phone: '7267286346802347827',
                    userId: 'sajal',
                    city: 'gondal',
                    userCountry: 'india',
                    lastName: 'dev',
                    username: 'Samle_putUserName',
                    firstName: 'rudderlabs',
                  },
                  externalId: [
                    {
                      type: 'listId',
                      id: '585896',
                    },
                  ],
                },
                integrations: {
                  All: true,
                  mailjet: {
                    Action: 'unsub',
                  },
                },
              },
            },
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
              metadata: {
                jobId: 6,
                userId: 'u1',
              },
              message: {
                userId: 'user@49',
                type: 'identify',
                context: {
                  traits: {
                    age: '30',
                    email: 'test5@user.com',
                    phone: '7267286346802347827',
                    userId: 'sajal',
                    city: 'gondal',
                    userCountry: 'india',
                    lastName: 'dev',
                    username: 'Samle_putUserName',
                    firstName: 'rudderlabs',
                  },
                  externalId: [
                    {
                      type: 'listId',
                      id: '584896',
                    },
                  ],
                },
              },
            },
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
              metadata: {
                jobId: 7,
                userId: 'u1',
              },
              message: {
                userId: 'user@50',
                type: 'identify',
                context: {
                  traits: {
                    age: '30',
                    email: 'test10@user.com',
                    phone: '7267286346802347827',
                    userId: 'sajal',
                    city: 'gondal',
                    userCountry: 'india',
                    lastName: 'dev',
                    username: 'Samle_putUserName',
                    firstName: 'rudderlabs',
                  },
                },
              },
            },
          ],
          destType: 'mailjet',
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.mailjet.com/v3/REST/contactslist/58578/managemanycontacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    Action: 'addnoforce',
                    Contacts: [
                      {
                        email: 'test@user.com',
                        properties: {
                          country: 'india',
                        },
                      },
                      {
                        email: 'test10@user.com',
                        properties: {
                          country: 'india',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 7, userId: 'u1' },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [
                    {
                      from: 'userCountry',
                      to: 'country',
                    },
                  ],
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.mailjet.com/v3/REST/contactslist/58570/managemanycontacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    Action: 'unsub',
                    Contacts: [
                      {
                        email: 'test2@user.com',
                        properties: {
                          country: 'india',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [
                    {
                      from: 'userCountry',
                      to: 'country',
                    },
                  ],
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.mailjet.com/v3/REST/contactslist/58576/managemanycontacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    Action: 'addforce',
                    Contacts: [
                      {
                        email: 'test3@user.com',
                        properties: {
                          country: 'india',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [
                    {
                      from: 'userCountry',
                      to: 'country',
                    },
                  ],
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.mailjet.com/v3/REST/contactslist/58576/managemanycontacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    Action: 'unsub',
                    Contacts: [
                      {
                        email: 'test4@user.com',
                        properties: {
                          country: 'india',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 4, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [
                    {
                      from: 'userCountry',
                      to: 'country',
                    },
                  ],
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.mailjet.com/v3/REST/contactslist/585896/managemanycontacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    Action: 'unsub',
                    Contacts: [
                      {
                        email: 'test5@user.com',
                        properties: {
                          country: 'india',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 5, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [
                    {
                      from: 'userCountry',
                      to: 'country',
                    },
                  ],
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.mailjet.com/v3/REST/contactslist/584896/managemanycontacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    Action: 'addnoforce',
                    Contacts: [
                      {
                        email: 'test5@user.com',
                        properties: {
                          country: 'india',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 6, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: secret1,
                  apiSecret: secret2,
                  listId: '58578',
                  contactPropertiesMapping: [
                    {
                      from: 'userCountry',
                      to: 'country',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
];
