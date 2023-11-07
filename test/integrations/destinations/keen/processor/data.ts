export const data = [
  {
    name: 'keen',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              type: 'page',
              context: null,
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/test',
                referrer: 'Rudder',
                search: 'abc',
                title: 'Test Page',
                url: 'www.rudderlabs.com',
              },
              traits: {
                email: 'test@gmail.com',
                anonymousId: 'anon-id',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                projectID: 'abcde',
                writeKey: 'xyz',
                ipAddon: true,
                uaAddon: true,
                urlAddon: true,
                referrerAddon: true,
              },
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                JSON: {
                  path: '/test',
                  referrer: 'Rudder',
                  search: 'abc',
                  title: 'Test Page',
                  url: 'www.rudderlabs.com',
                  userId: '12345',
                  keen: {
                    addons: [],
                  },
                  anonymousId: '00000000000000000000000000',
                  user: {
                    traits: {
                      anonymousId: 'anon-id',
                      email: 'test@gmail.com',
                    },
                    userId: '12345',
                  },
                },
                FORM: {},
              },
              files: {},
              endpoint:
                'https://api.keen.io/3.0/projects/abcde/events/Viewed ApplicationLoaded page',
              userId: '12345',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'xyz',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'keen',
    description: 'Test 1',
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
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  anonymousId: '123456',
                  email: 'sayan@gmail.com',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                  ip: '0.0.0.0',
                  age: 26,
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
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'my-anon-id',
                email: 'test@gmail.com',
                address: {
                  city: 'kolkata-1',
                  country: 'US',
                  postalCode: 712136,
                  state: 'CA',
                  street: '',
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                projectID: 'abcde',
                writeKey: 'xyz',
                ipAddon: true,
                uaAddon: true,
                urlAddon: true,
                referrerAddon: true,
              },
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
            error: 'Event type identify is not supported',
            statTags: {
              destType: 'KEEN',
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
    name: 'keen',
    description: 'Test 2',
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
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
                  anonymousId: '12345',
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
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/test',
                referrer: 'Rudder',
                search: 'abc',
                title: 'Test Page',
                url: 'www.rudderlabs.com',
              },
              traits: {
                email: 'test@gmail.com',
                anonymousId: 'anon-id',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                projectID: 'abcde',
                writeKey: 'xyz',
                ipAddon: true,
                uaAddon: true,
                urlAddon: true,
                referrerAddon: true,
              },
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                JSON: {
                  search: 'abc',
                  request_ip: '0.0.0.0',
                  title: 'Test Page',
                  url: 'www.rudderlabs.com',
                  referrer: 'Rudder',
                  userId: '12345',
                  keen: {
                    addons: [
                      {
                        input: {
                          ip: 'request_ip',
                        },
                        name: 'keen:ip_to_geo',
                        output: 'ip_geo_info',
                      },
                      {
                        input: {
                          ua_string: 'user_agent',
                        },
                        name: 'keen:ua_parser',
                        output: 'parsed_user_agent',
                      },
                    ],
                  },
                  anonymousId: '00000000000000000000000000',
                  user: {
                    traits: {
                      anonymousId: 'anon-id',
                      email: 'test@gmail.com',
                    },
                    userId: '12345',
                  },
                  path: '/test',
                  user_agent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                },
                FORM: {},
              },
              files: {},
              endpoint:
                'https://api.keen.io/3.0/projects/abcde/events/Viewed ApplicationLoaded page',
              userId: '12345',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'xyz',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'keen',
    description: 'Test 3',
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
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'sayan@gmail.com',
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
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event',
              request_ip: '1.1.1.1',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              traits: {
                email: 'test@gmail.com',
                anonymousId: 'anon-id',
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                projectID: 'abcde',
                writeKey: 'xyz',
                ipAddon: true,
                uaAddon: true,
                urlAddon: true,
                referrerAddon: true,
              },
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                JSON: {
                  user_actual_id: 12345,
                  user_actual_role: 'system_admin',
                  request_ip: '1.1.1.1',
                  user_time_spent: 50000,
                  userId: '12345',
                  keen: {
                    addons: [
                      {
                        input: {
                          ip: 'request_ip',
                        },
                        name: 'keen:ip_to_geo',
                        output: 'ip_geo_info',
                      },
                      {
                        input: {
                          ua_string: 'user_agent',
                        },
                        name: 'keen:ua_parser',
                        output: 'parsed_user_agent',
                      },
                    ],
                  },
                  anonymousId: '00000000000000000000000000',
                  user: {
                    traits: {
                      anonymousId: 'anon-id',
                      email: 'test@gmail.com',
                    },
                    userId: '12345',
                  },
                  user_agent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://api.keen.io/3.0/projects/abcde/events/test track event',
              userId: '12345',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'xyz',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
