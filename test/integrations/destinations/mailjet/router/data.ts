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
                  apiKey: 'dummyApiKey',
                  apiSecret: 'dummyApiSecret',
                  listId: '58578',
                  contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
                },
              },
              metadata: {
                jobId: 1,
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
                  Authorization: 'Basic ZHVtbXlBcGlLZXk6ZHVtbXlBcGlTZWNyZXQ=',
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
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'dummyApiSecret',
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
