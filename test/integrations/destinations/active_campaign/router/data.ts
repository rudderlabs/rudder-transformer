export const data = [
  {
    name: 'active_campaign',
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
                  apiKey: 'dummyApiToken',
                  apiUrl: 'https://active.campaigns.rudder.com',
                  actid: '476550467',
                  eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                userId: '123456',
                type: 'identify',
                traits: {
                  anonymousId: 'anon_id',
                  email: 'jamesDoe@gmail.com',
                  firstName: 'James',
                  lastName: 'Doe',
                  phone: '92374162212',
                  tags: ['Test_User', 'Interested_User', 'DIY_Hobby'],
                  fieldInfo: {
                    Office: 'Trastkiv',
                    Country: 'Russia',
                    Likes: ['Potato', 'Onion'],
                    Random: 'random',
                  },
                  lists: [
                    {
                      id: 2,
                      status: 'subscribe',
                    },
                    {
                      id: 3,
                      status: 'unsubscribe',
                    },
                    {
                      id: 3,
                      status: 'unsubscribexyz',
                    },
                  ],
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 789223,
                    state: 'WB',
                    street: '',
                  },
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
          ],
          destType: 'active_campaign',
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
                body: {
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                  JSON: {
                    contact: {
                      email: 'jamesDoe@gmail.com',
                      firstName: 'James',
                      lastName: 'Doe',
                      phone: '92374162212',
                      fieldValues: [
                        {
                          field: '0',
                          value: 'Trastkiv',
                        },
                        {
                          field: '1',
                          value: 'Russia',
                        },
                        {
                          field: '3',
                          value: '||Potato||Onion||',
                        },
                        {
                          field: '4',
                          value: 'random',
                        },
                      ],
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  'Api-Token': 'dummyApiToken',
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://active.campaigns.rudder.com/api/3/contact/sync',
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiToken',
                  apiUrl: 'https://active.campaigns.rudder.com',
                  actid: '476550467',
                  eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'active_campaign',
    description: 'Test 1',
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
                  apiKey: 'dummyApiToken',
                  apiUrl: 'https://active.campaigns.rudder.com',
                  actid: '476550467',
                  eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'jamesDoe@gmail.com',
                    anonymousId: '12345',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                request_ip: '1.1.1.1',
                type: 'page',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  name: 'ApplicationLoaded',
                  path: '/test',
                  referrer: 'Rudder',
                  search: 'abc',
                  title: 'Test Page',
                  url: 'https://www.rudderlabs.com',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
              },
            },
          ],
          destType: 'active_campaign',
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
                body: {
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                  JSON: {
                    siteTrackingDomain: {
                      name: 'rudderlabs.com',
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  'Api-Token': 'dummyApiToken',
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://active.campaigns.rudder.com/api/3/siteTrackingDomains',
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiToken',
                  apiUrl: 'https://active.campaigns.rudder.com',
                  actid: '476550467',
                  eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'active_campaign',
    description: 'Test 2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                name: 'home',
                type: 'page',
                sentAt: '2023-01-10T22:31:10.954Z',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '2.20.0',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  page: {
                    url: 'url',
                    path: 'path',
                    title: 'title',
                    search: 'search',
                    tab_url: 'https://simple-tenet.github.io/rudderstack-sample-site/',
                    referrer: 'referrer',
                    initial_referrer: '$direct',
                    referring_domain: '',
                    initial_referring_domain: '',
                  },
                  locale: 'en-US',
                  screen: {
                    width: 1512,
                    height: 982,
                    density: 2,
                    innerWidth: 846,
                    innerHeight: 782,
                  },
                  traits: {},
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '2.20.0',
                  },
                  campaign: {},
                  sessionId: 1673389635049,
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                },
                rudderId: 'd37dd81f-5894-48ec-b312-09c590bab15c',
                messageId: '2774384870943800-0b15a357-c85d-4b22-916e-ed53286b742a',
                timestamp: '2023-01-10T22:31:11.601Z',
                properties: {
                  url: 'url',
                  name: 'home',
                  path: 'path',
                  title: 'title',
                  search: 'search',
                  tab_url: 'https://simple-tenet.github.io/rudderstack-sample-site/',
                  referrer: 'referrer',
                  initial_referrer: '$direct',
                  referring_domain: '',
                  initial_referring_domain: '',
                },
                receivedAt: '2023-01-10T22:31:11.612Z',
                request_ip: '0.0.0.20',
                anonymousId: '878e8f5f-9b6c-4aef-b5d3-1b970a13f17a',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2023-01-10T22:31:10.943Z',
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiToken',
                  apiUrl: 'https://active.campaigns.rudder.com',
                  actid: '476550467',
                  eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                },
              },
              metadata: {
                jobId: 5,
              },
            },
          ],
          destType: 'active_campaign',
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
              error: 'Invalid URL: url',
              statTags: {
                destType: 'ACTIVE_CAMPAIGN',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              metadata: [
                {
                  jobId: 5,
                },
              ],
              batched: false,
              destination: {
                Config: {
                  apiKey: 'dummyApiToken',
                  apiUrl: 'https://active.campaigns.rudder.com',
                  actid: '476550467',
                  eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                },
              },
            },
          ],
        },
      },
    },
  },
];
