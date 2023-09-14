export const data = [
  {
    name: 'mailjet',
    description: 'No Message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'test@123',
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  username: 'Samle_putUserName',
                  firstName: 'uday',
                },
              },
              integrations: { All: true, 'user.com': { lookup: 'email' } },
            },
            destination: { Config: { apiKey: 'dummyApiKey', apiSecret: 'dummyApiSecret' } },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type is required',
            statTags: {
              destType: 'MAILJET',
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
    name: 'mailjet',
    description: 'Unsupported Type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'test@123',
              type: 'trackUser',
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  firstName: 'test',
                  lastName: 'rudderstack',
                  age: 15,
                  gender: 'male',
                  status: 'user',
                  city: 'Kalkata',
                  country: 'india',
                  tags: ['productuser'],
                  phone: '9225467887',
                },
              },
            },
            destination: { Config: { apiKey: 'dummyApiKey', apiSecret: 'dummyApiSecret' } },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type "trackuser" is not supported',
            statTags: {
              destType: 'MAILJET',
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
    name: 'mailjet',
    description: 'MailJet identify call without an email',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'test@123',
              type: 'identify',
              context: {
                traits: {
                  firstName: 'test',
                  lastName: 'rudderstack',
                  age: 15,
                  gender: 'male',
                  status: 'user',
                  city: 'Kalkata',
                  country: 'india',
                  tags: ['productuser'],
                  phone: '9225467887',
                },
              },
            },
            destination: { Config: { apiKey: 'dummyApiKey', apiSecret: 'dummyApiSecret' } },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Missing required value from "email"',
            statTags: {
              destType: 'MAILJET',
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
    name: 'mailjet',
    description: 'Mailjet identify call without batching',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
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
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                apiSecret: 'dummyApiSecret',
                listId: '58578',
                contactPropertiesMapping: [{ from: 'userCountry', to: 'country' }],
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: '',
              headers: {},
              params: {},
              body: {
                JSON: { email: 'test@user.com', properties: { country: 'india' } },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              listId: '58578',
              action: 'addnoforce',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
