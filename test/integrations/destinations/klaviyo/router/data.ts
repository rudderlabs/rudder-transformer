export const data = [
  {
    name: 'klaviyo',
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
                  publicApiKey: 'dummyPublicApiKey',
                  privateApiKey: 'dummyPrivateApiKey',
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                type: 'identify',
                sentAt: '2021-01-03T17:02:53.195Z',
                userId: 'test',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  traits: {
                    firstName: 'Test',
                    lastName: 'Rudderlabs',
                    email: 'test@rudderstack.com',
                    phone: '+12 345 578 900',
                    userId: 'Testc',
                    title: 'Developer',
                    organization: 'Rudder',
                    city: 'Tokyo',
                    region: 'Kanto',
                    country: 'JP',
                    zip: '100-0001',
                    Flagged: false,
                    Residence: 'Shibuya',
                    properties: {
                      consent: ['email', 'sms'],
                    },
                  },
                  locale: 'en-US',
                  screen: {
                    density: 2,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.11',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
            },
            {
              destination: {
                Config: {
                  publicApiKey: 'dummyPublicApiKey',
                  privateApiKey: 'dummyPrivateApiKey',
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                type: 'identify',
                sentAt: '2021-01-03T17:02:53.195Z',
                userId: 'test',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  traits: {
                    firstName: 'Test',
                    lastName: 'Rudderlabs',
                    email: 'test@rudderstack.com',
                    phone: '+12 345 578 900',
                    userId: 'test',
                    title: 'Developer',
                    organization: 'Rudder',
                    city: 'Tokyo',
                    region: 'Kanto',
                    country: 'JP',
                    zip: '100-0001',
                    Flagged: false,
                    Residence: 'Shibuya',
                    properties: {
                      listId: 'XUepkK',
                      subscribe: true,
                      consent: ['email', 'sms'],
                    },
                  },
                  locale: 'en-US',
                  screen: {
                    density: 2,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.11',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
            },
            {
              destination: {
                Config: {
                  publicApiKey: 'dummyPublicApiKey',
                  privateApiKey: 'dummyPrivateApiKey',
                },
              },
              metadata: {
                jobId: 3,
              },
              message: {
                userId: 'user123',
                type: 'group',
                groupId: 'XUepkK',
                traits: {
                  subscribe: true,
                },
                context: {
                  traits: {
                    email: 'test@rudderstack.com',
                    phone: '+12 345 678 900',
                    consent: ['email'],
                  },
                  ip: '14.5.67.21',
                  library: {
                    name: 'http',
                  },
                },
                timestamp: '2020-01-21T00:21:34.208Z',
              },
            },
            {
              destination: {
                Config: {
                  publicApiKey: 'dummyPublicApiKey',
                  privateApiKey: 'dummyPrivateApiKey',
                },
              },
              metadata: {
                jobId: 4,
              },
              message: {
                userId: 'user123',
                type: 'random',
                groupId: 'XUepkK',
                traits: {
                  subscribe: true,
                },
                context: {
                  traits: {
                    email: 'test@rudderstack.com',
                    phone: '+12 345 678 900',
                    consent: 'email',
                  },
                  ip: '14.5.67.21',
                  library: {
                    name: 'http',
                  },
                },
                timestamp: '2020-01-21T00:21:34.208Z',
              },
            },
            {
              destination: {
                Config: {
                  publicApiKey: 'dummyPublicApiKey',
                  privateApiKey: 'dummyPrivateApiKey',
                },
              },
              metadata: {
                jobId: 5,
              },
              message: {
                userId: 'user123',
                type: 'group',
                groupId: '',
                traits: {
                  subscribe: true,
                },
                context: {
                  traits: {
                    email: 'test@rudderstack.com',
                    phone: '+12 345 678 900',
                    consent: 'email',
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
          destType: 'klaviyo',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
                  headers: {
                    Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    revision: '2023-02-22',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile-subscription-bulk-create-job',
                        attributes: {
                          list_id: 'XUepkK',
                          subscriptions: [
                            {
                              email: 'test@rudderstack.com',
                              phone_number: '+12 345 678 900',
                            },
                            {
                              email: 'test@rudderstack.com',
                              phone_number: '+12 345 578 900',
                              channels: {
                                email: ['MARKETING'],
                                sms: ['MARKETING'],
                              },
                            },
                          ],
                        },
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'PATCH',
                  endpoint: 'https://a.klaviyo.com/api/profiles/01GW3PHVY0MTCDGS0A1612HARX',
                  headers: {
                    Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    revision: '2023-02-22',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile',
                        attributes: {
                          external_id: 'test',
                          email: 'test@rudderstack.com',
                          first_name: 'Test',
                          last_name: 'Rudderlabs',
                          phone_number: '+12 345 578 900',
                          title: 'Developer',
                          organization: 'Rudder',
                          location: {
                            city: 'Tokyo',
                            region: 'Kanto',
                            country: 'JP',
                            zip: '100-0001',
                          },
                          properties: {
                            Flagged: false,
                            Residence: 'Shibuya',
                          },
                        },
                        id: '01GW3PHVY0MTCDGS0A1612HARX',
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 3,
                },
                {
                  jobId: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  publicApiKey: 'dummyPublicApiKey',
                  privateApiKey: 'dummyPrivateApiKey',
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'PATCH',
                endpoint: 'https://a.klaviyo.com/api/profiles/01GW3PHVY0MTCDGS0A1612HARX',
                headers: {
                  Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  revision: '2023-02-22',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'profile',
                      attributes: {
                        external_id: 'test',
                        email: 'test@rudderstack.com',
                        first_name: 'Test',
                        last_name: 'Rudderlabs',
                        phone_number: '+12 345 578 900',
                        title: 'Developer',
                        organization: 'Rudder',
                        location: {
                          city: 'Tokyo',
                          region: 'Kanto',
                          country: 'JP',
                          zip: '100-0001',
                        },
                        properties: {
                          Flagged: false,
                          Residence: 'Shibuya',
                        },
                      },
                      id: '01GW3PHVY0MTCDGS0A1612HARX',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  publicApiKey: 'dummyPublicApiKey',
                  privateApiKey: 'dummyPrivateApiKey',
                },
              },
            },
            {
              metadata: [
                {
                  jobId: 4,
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'Event type random is not supported',
              statTags: {
                destType: 'KLAVIYO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              destination: {
                Config: {
                  publicApiKey: 'dummyPublicApiKey',
                  privateApiKey: 'dummyPrivateApiKey',
                },
              },
            },
            {
              metadata: [
                {
                  jobId: 5,
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'groupId is a required field for group events',
              statTags: {
                destType: 'KLAVIYO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              destination: {
                Config: {
                  publicApiKey: 'dummyPublicApiKey',
                  privateApiKey: 'dummyPrivateApiKey',
                },
              },
            },
          ],
        },
      },
    },
  },
];
