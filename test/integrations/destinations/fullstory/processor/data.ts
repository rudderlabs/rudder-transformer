export const data = [
  {
    name: 'fullstory',
    description: 'Complete track event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '78c53c15-32a1-4b65-adac-bec2d7bb8fab',
              channel: 'web',
              context: {
                app: {
                  name: 'RSPM',
                  version: '1.9.0',
                },
                campaign: {
                  name: 'sales campaign',
                  source: 'google',
                  medium: 'medium',
                  term: 'event data',
                  content: 'Make sense of the modern data stack',
                },
                ip: '192.0.2.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '2.9.1',
                },
                locale: 'en-US',
                device: {
                  manufacturer: 'Nokia',
                  model: 'N2023',
                },
                page: {
                  path: '/best-seller/1',
                  initial_referrer: 'https://www.google.com/search',
                  initial_referring_domain: 'google.com',
                  referrer: 'https://www.google.com/search?q=estore+bestseller',
                  referring_domain: 'google.com',
                  search: 'estore bestseller',
                  title: 'The best sellers offered by EStore',
                  url: 'https://www.estore.com/best-seller/1',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                  innerHeight: 200,
                  innerWidth: 100,
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              event: 'Product Reviewed',
              integrations: {
                All: true,
              },
              messageId: '1578564113557-af022c68-429e-4af4-b99b-2b9174056383',
              properties: {
                userId: 'u001',
                sessionId: 's001',
                review_id: 'review_id_1',
                product_id: 'product_id_1',
                rating: 5,
                review_body: 'Sample Review Body',
                latitude: 44.56,
                longitude: 54.46,
                region: 'Atlas',
                city: 'NY',
                country: 'USA',
              },
              originalTimestamp: '2020-01-09T10:01:53.558Z',
              type: 'track',
              sentAt: '2020-01-09T10:02:03.257Z',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'Fullstory',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'dummyfullstoryAPIKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  name: 'Product Reviewed',
                  properties: {
                    userId: 'u001',
                    sessionId: 's001',
                    review_id: 'review_id_1',
                    product_id: 'product_id_1',
                    rating: 5,
                    review_body: 'Sample Review Body',
                    latitude: 44.56,
                    longitude: 54.46,
                    region: 'Atlas',
                    city: 'NY',
                    country: 'USA',
                  },
                  timestamp: '2020-01-09T10:01:53.558Z',
                  context: {
                    browser: {
                      url: 'https://www.estore.com/best-seller/1',
                      user_agent:
                        'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
                      initial_referrer: 'https://www.google.com/search',
                    },
                    mobile: {
                      app_name: 'RSPM',
                      app_version: '1.9.0',
                    },
                    device: {
                      manufacturer: 'Nokia',
                      model: 'N2023',
                    },
                    location: {
                      ip_address: '192.0.2.0',
                      latitude: 44.56,
                      longitude: 54.46,
                      city: 'NY',
                      region: 'Atlas',
                      country: 'USA',
                    },
                  },
                  session: {
                    id: 's001',
                  },
                  user: {
                    id: 'u001',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.fullstory.com/v2/events',
              headers: {
                authorization: 'Basic dummyfullstoryAPIKey',
                'content-type': 'application/json',
              },
              params: {},
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fullstory',
    description: 'Missing event name',
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
                device: {
                  manufacturer: 'Nokia',
                  model: 'N2023',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              integrations: {
                All: true,
              },
              properties: {
                userId: 'u001',
                latitude: 44.56,
                longitude: 54.46,
                region: 'Atlas',
                city: 'NY',
                country: 'USA',
              },
              originalTimestamp: '2020-01-09T10:01:53.558Z',
              type: 'track',
              sentAt: '2020-01-09T10:02:03.257Z',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'Fullstory',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'dummyfullstoryAPIKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'event is required for track call: Workflow: procWorkflow, Step: validateEventName, ChildStep: undefined, OriginalError: event is required for track call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'FULLSTORY',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'fullstory',
    description: 'Complete identify event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'dummy-user001',
              channel: 'web',
              context: {
                traits: {
                  company: 'Initech',
                  address: {
                    country: 'USA',
                    state: 'CA',
                    street: '101 dummy street',
                  },
                  email: 'dummyuser@domain.com',
                  name: 'dummy user',
                  phone: '099-999-9999',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'Fullstory',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'fullstoryAPIKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  properties: {
                    company: 'Initech',
                    address: {
                      country: 'USA',
                      state: 'CA',
                      street: '101 dummy street',
                    },
                    email: 'dummyuser@domain.com',
                    name: 'dummy user',
                    phone: '099-999-9999',
                  },
                  uid: 'dummy-user001',
                  email: 'dummyuser@domain.com',
                  display_name: 'dummy user',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.fullstory.com/v2/users',
              headers: {
                authorization: 'Basic fullstoryAPIKey',
                'content-type': 'application/json',
              },
              params: {},
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fullstory',
    description: 'Identify event with needed traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'dummy-user001',
              channel: 'web',
              context: {
                traits: {
                  email: 'dummyuser@domain.com',
                  name: 'dummy user',
                  phone: '099-999-9999',
                },
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'Fullstory',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'fullstoryAPIKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  properties: {
                    email: 'dummyuser@domain.com',
                    name: 'dummy user',
                    phone: '099-999-9999',
                  },
                  uid: 'dummy-user001',
                  email: 'dummyuser@domain.com',
                  display_name: 'dummy user',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.fullstory.com/v2/users',
              headers: {
                authorization: 'Basic fullstoryAPIKey',
                'content-type': 'application/json',
              },
              params: {},
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
