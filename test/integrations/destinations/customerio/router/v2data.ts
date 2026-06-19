import { authHeader1, secret1, secret2 } from '../maskedSecrets';

// Generated from the exact v1 router input (see captureV2.ts / genV2data.ts) with
// the batching flag enabled, asserting the Track API v2 batched output.
export const v2data = [
  {
    name: 'customerio',
    description: 'v2: mixed events batch into a single /v2/batch request',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    envOverrides: {
      CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL',
    },
    input: {
      request: {
        body: {
          input: [
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
                    email: 'test@rudderstack.com',
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
                user_properties: {
                  prop1: 'val1',
                  prop2: 'val2',
                },
                type: 'identify',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                userId: '123456',
                integrations: {
                  All: true,
                },
                traits: {
                  anonymousId: 'anon-id',
                  email: 'test@gmail.com',
                  'dot.name': 'Arnab Pal',
                  address: {
                    city: 'NY',
                    country: 'USA',
                    postalCode: 712136,
                    state: 'CA',
                    street: '',
                  },
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
            },
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
                    email: 'test@rudderstack.com',
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
                integrations: {
                  All: true,
                },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.0-beta.2',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.0-beta.2',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                },
                groupId: 'group@1',
                integrations: {
                  All: true,
                },
                traits: {
                  domainNames: 'rudderstack.com',
                  email: 'help@rudderstack.com',
                  name: 'rudderstack',
                  action: 'identify',
                },
                type: 'group',
                userId: 'user@1',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.0-beta.2',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.0-beta.2',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                },
                groupId: 'group@1',
                integrations: {
                  All: true,
                },
                traits: {
                  domainNames: 'rudderstack.com',
                  email: 'help@rudderstack.com',
                  name: 'rudderstack',
                  action: 'delete',
                },
                type: 'group',
                userId: 'user@1',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
            },
          ],
          destType: 'customerio',
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
                endpoint: 'https://track.customer.io/api/v2/batch',
                endpointPath: 'v2/batch',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'identify',
                        identifiers: {
                          id: '123456',
                        },
                        attributes: {
                          city: 'NY',
                          country: 'USA',
                          postalCode: 712136,
                          state: 'CA',
                          street: '',
                          email: 'test@gmail.com',
                          'dot.name': 'Arnab Pal',
                          _timestamp: 1571043797,
                          anonymous_id: '123456',
                        },
                      },
                      {
                        type: 'person',
                        action: 'page',
                        identifiers: {
                          id: '12345',
                        },
                        name: 'ApplicationLoaded',
                        attributes: {
                          path: '/test',
                          referrer: 'Rudder',
                          search: 'abc',
                          title: 'Test Page',
                          url: 'www.rudderlabs.com',
                        },
                        timestamp: 1571051718,
                      },
                      {
                        type: 'object',
                        action: 'identify',
                        identifiers: {
                          object_id: 'group@1',
                          object_type_id: '1',
                        },
                        attributes: {
                          domainNames: 'rudderstack.com',
                          email: 'help@rudderstack.com',
                          name: 'rudderstack',
                        },
                        cio_relationships: [
                          {
                            identifiers: {
                              id: 'user@1',
                            },
                          },
                        ],
                      },
                      {
                        type: 'object',
                        action: 'delete',
                        identifiers: {
                          object_id: 'group@1',
                          object_type_id: '1',
                        },
                        attributes: {
                          domainNames: 'rudderstack.com',
                          email: 'help@rudderstack.com',
                          name: 'rudderstack',
                        },
                        cio_relationships: [
                          {
                            identifiers: {
                              id: 'user@1',
                            },
                          },
                        ],
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
                {
                  jobId: 1,
                  userId: 'u1',
                  workspaceId: 'ws-cio-v2',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                  workspaceId: 'ws-cio-v2',
                },
                {
                  jobId: 3,
                  userId: 'u1',
                  workspaceId: 'ws-cio-v2',
                },
                {
                  jobId: 4,
                  userId: 'u1',
                  workspaceId: 'ws-cio-v2',
                },
              ],
              destination: {
                Config: {
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
