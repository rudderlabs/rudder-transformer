export const data = [
  {
    name: 'persistiq',
    description: '[::IDENTIFY::]-> Update call with leadId in externalId and no email',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
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
          destType: 'persistiq',
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
                    data: {
                      Snippet: 'extra value',
                      age: 15,
                      company_name: 'abc123',
                      country: 'india',
                      extra: 'extraVal',
                      first_name: 'test',
                      last_name: 'rudderstack',
                      linkedin: 'www.google.com',
                      occupation: 'software engineer',
                      phone: '9876543210',
                    },
                    status: 'open',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.persistiq.com/v1/leads/lel1c5u1wuk8',
                files: {},
                headers: { 'x-api-key': 'dummyApiKey' },
                method: 'PATCH',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  persistIqAttributesMapping: [{ from: 'useroccupation', to: 'occupation' }],
                },
              },
              metadata: [null],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
