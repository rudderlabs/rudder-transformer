export const data = [
  {
    name: 'persistiq',
    description: '[::IDENTIFY::]-> Update call with leadId in externalId and no email',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'test@16',
              type: 'identify',
              context: {
                traits: {
                  firstName: 'test',
                  lastName: 'rudderstack',
                  age: 15,
                  gender: 'male',
                  city: 'Kolkata',
                  country: 'india',
                  phone: '9876543210',
                  useroccupation: 'software engineer',
                  Snippet: 'extra value',
                  extra: 'extraVal',
                },
                externalId: [
                  {
                    type: 'persistIqLeadId',
                    id: 'lel1c5u1wuk8',
                  },
                ],
              },
              traits: {
                linkedinUrl: 'www.google.com',
                dup: 'update',
                status: 'open',
                company: {
                  name: 'abc123',
                },
              },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                persistIqAttributesMapping: [
                  {
                    from: 'useroccupation',
                    to: 'occupation',
                  },
                ],
              },
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
                  data: {
                    age: 15,
                    country: 'india',
                    extra: 'extraVal',
                    occupation: 'software engineer',
                    first_name: 'test',
                    Snippet: 'extra value',
                    last_name: 'rudderstack',
                    linkedin: 'www.google.com',
                    phone: '9876543210',
                    company_name: 'abc123',
                  },
                  status: 'open',
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.persistiq.com/v1/leads/lel1c5u1wuk8',
              files: {},
              userId: '',
              headers: {
                'x-api-key': 'dummyApiKey',
              },
              method: 'PATCH',
              params: {},
              type: 'REST',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'persistiq',
    description: '[::IDENTIFY::]-> Create new call with company name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'test@16',
              type: 'identify',
              context: {
                traits: {
                  address: {
                    cityName: 'Delhi',
                    country: 'India',
                  },
                  email: 'new@rudderstack.com',
                  firstName: 'test',
                  lastName: 'rudderstack',
                  age: 15,
                  dup: 'update',
                  gender: 'male',
                  phone: '9876543210',
                  useroccupation: 'software engineer',
                  Snippet: 'extra value',
                  extra: 'extraVal',
                  creator_id: 'mVEv91Y3oW5o3PnBOyKw',
                  company: 'abc1234',
                },
              },
              traits: {
                linkedinUrl: 'www.google.com',
                dup: 'update',
              },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                persistIqAttributesMapping: [
                  {
                    from: 'useroccupation',
                    to: 'occupation',
                  },
                ],
              },
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
                  dup: 'update',
                  creator_id: 'mVEv91Y3oW5o3PnBOyKw',
                  leads: [
                    {
                      email: 'new@rudderstack.com',
                      age: 15,
                      extra: 'extraVal',
                      occupation: 'software engineer',
                      first_name: 'test',
                      Snippet: 'extra value',
                      last_name: 'rudderstack',
                      linkedin: 'www.google.com',
                      phone: '9876543210',
                      company_name: 'abc1234',
                      cityName: 'Delhi',
                      country: 'India',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.persistiq.com/v1/leads',
              files: {},
              userId: '',
              headers: {
                'x-api-key': 'dummyApiKey',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'persistiq',
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
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
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
            error: 'Event type is required',
            statTags: {
              destType: 'PERSISTIQ',
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
    name: 'persistiq',
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
                  phone: '9876543210',
                },
              },
              traits: {
                googleUrl: 'www.google.com',
              },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
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
            error: 'Event type trackuser is not supported',
            statTags: {
              destType: 'PERSISTIQ',
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
    name: 'persistiq',
    description: '[::Group::] without groupId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                email: 'business@rudderstack.com',
                plan: 'premium',
                logins: 5,
              },
              type: 'group',
              userId: 'user@123',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
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
            error: 'Group Id can not be empty',
            statTags: {
              destType: 'PERSISTIQ',
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
    name: 'persistiq',
    description: '[::Group::] add user',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              context: {
                externalId: [
                  {
                    type: 'persistIqLeadId',
                    id: 'lel1c5u1wuk8',
                  },
                ],
              },
              groupId: 'testgroup1',
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                email: 'business@rudderstack.com',
                mailbox_id: 'mbid1',
              },
              type: 'group',
              userId: 'user@123',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
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
                XML: {},
                FORM: {},
                JSON: {
                  lead_id: 'lel1c5u1wuk8',
                  mailbox_id: 'mbid1',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              userId: '',
              method: 'POST',
              params: {},
              headers: {
                'x-api-key': 'dummyApiKey',
              },
              version: '1',
              endpoint: 'https://api.persistiq.com/v1/campaigns/testgroup1/leads',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'persistiq',
    description: '[::Group::] Remove user',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              context: {
                externalId: [
                  {
                    type: 'persistIqLeadId',
                    id: 'lel1c5u1wuk8',
                  },
                ],
              },
              groupId: 'testgroup1',
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                operation: 'remove',
              },
              type: 'group',
              userId: 'user@123',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
              },
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
                XML: {},
                FORM: {},
                JSON: {},
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              userId: '',
              method: 'DELETE',
              params: {},
              headers: {
                'x-api-key': 'dummyApiKey',
              },
              version: '1',
              endpoint: 'https://api.persistiq.com/v1/campaigns/testgroup1/leads/lel1c5u1wuk8',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'persistiq',
    description: '[::IDENTIFY::]-> Create new call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'test@16',
              type: 'identify',
              context: {
                traits: {
                  address: {
                    cityName: 'Delhi',
                    country: 'India',
                  },
                  firstName: 'test',
                  lastName: 'rudderstack',
                  age: 15,
                  dup: 'update',
                  gender: 'male',
                  phone: '9876543210',
                  useroccupation: 'software engineer',
                  Snippet: 'extra value',
                  extra: 'extraVal',
                  creator_id: 'mVEv91Y3oW5o3PnBOyKw',
                },
              },
              traits: {
                linkedinUrl: 'www.google.com',
                dup: 'update',
              },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                persistIqAttributesMapping: [
                  {
                    from: 'useroccupation',
                    to: 'occupation',
                  },
                ],
              },
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
            error: 'Email is required for new lead',
            statTags: {
              destType: 'PERSISTIQ',
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
];
