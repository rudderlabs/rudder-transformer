import {
  authHeader1,
  authHeader3,
  authHeader4,
  secret1,
  secret2,
  secret5,
  secret6,
  secret7,
  secret8,
} from '../maskedSecrets';

// Generated from the exact v1 router input (see captureV2.ts / genV2data.ts) with
// the batching flag enabled, asserting the Track API v2 batched output.
export const dataV2 = [
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
  {
    name: 'customerio',
    description: 'v2: 3 valid events batch together, 2 invalid events returned as errors',
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
                type: 'track',
                userId: 'cio_v2_user1',
                event: 'Order Completed',
                properties: {
                  orderId: 'abc-123',
                  revenue: 49.99,
                },
                sentAt: '2024-01-15T10:00:00.000Z',
              },
              metadata: {
                jobId: 10,
                userId: 'u1',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  datacenter: 'US',
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
            },
            {
              message: {
                channel: 'web',
                type: 'identify',
                userId: 'cio_v2_user2',
                traits: {
                  email: 'user2@example.com',
                  plan: 'pro',
                },
                sentAt: '2024-01-15T10:01:00.000Z',
              },
              metadata: {
                jobId: 11,
                userId: 'u1',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  datacenter: 'US',
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
            },
            {
              message: {
                channel: 'web',
                type: 'alias',
                userId: 'cio_v2_new_id',
                previousId: 'cio_v2_old_id',
                sentAt: '2024-01-15T10:02:00.000Z',
              },
              metadata: {
                jobId: 12,
                userId: 'u1',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  datacenter: 'US',
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
            },
            {
              message: {
                channel: 'web',
                type: 'track',
                event: 'Button Clicked',
                properties: {
                  buttonId: 'signup',
                },
                sentAt: '2024-01-15T10:03:00.000Z',
              },
              metadata: {
                jobId: 13,
                userId: 'u1',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  datacenter: 'US',
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
            },
            {
              message: {
                channel: 'web',
                type: 'alias',
                previousId: 'cio_v2_orphan_old',
                sentAt: '2024-01-15T10:04:00.000Z',
              },
              metadata: {
                jobId: 14,
                userId: 'u1',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  datacenter: 'US',
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
                        action: 'event',
                        identifiers: {
                          id: 'cio_v2_user1',
                        },
                        name: 'Order Completed',
                        attributes: {
                          orderId: 'abc-123',
                          revenue: 49.99,
                        },
                      },
                      {
                        type: 'person',
                        action: 'identify',
                        identifiers: {
                          id: 'cio_v2_user2',
                        },
                        attributes: {
                          email: 'user2@example.com',
                          plan: 'pro',
                        },
                      },
                      {
                        type: 'person',
                        action: 'merge',
                        primary: {
                          id: 'cio_v2_new_id',
                        },
                        secondary: {
                          id: 'cio_v2_old_id',
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
                {
                  jobId: 10,
                  userId: 'u1',
                  workspaceId: 'ws-cio-v2',
                },
                {
                  jobId: 11,
                  userId: 'u1',
                  workspaceId: 'ws-cio-v2',
                },
                {
                  jobId: 12,
                  userId: 'u1',
                  workspaceId: 'ws-cio-v2',
                },
              ],
              destination: {
                Config: {
                  datacenter: 'US',
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
              batched: true,
              statusCode: 200,
            },
            {
              metadata: [
                {
                  jobId: 13,
                  userId: 'u1',
                  workspaceId: 'ws-cio-v2',
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'message: userId, email or anonymousId is required',
              statTags: {
                destType: 'CUSTOMERIO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  datacenter: 'US',
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
            },
            {
              metadata: [
                {
                  jobId: 14,
                  userId: 'u1',
                  workspaceId: 'ws-cio-v2',
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'message: userId, email or anonymousId is required',
              statTags: {
                destType: 'CUSTOMERIO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  datacenter: 'US',
                  siteID: secret1,
                  apiKey: secret2,
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description:
      'v2: RETL identify with externalId only (no userId/anonymousId/email) passes schema validation and resolves userId',
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
                type: 'identify',
                context: {
                  mappedToDestination: true,
                  externalId: [
                    {
                      type: 'CUSTOMERIO-userId',
                      identifierType: 'userId',
                      id: 'cio_retl_router_user',
                    },
                  ],
                  traits: {
                    plan: 'enterprise',
                  },
                },
                traits: {
                  plan: 'enterprise',
                },
                sentAt: '2024-01-15T10:00:00.000Z',
              },
              metadata: {
                jobId: 20,
                userId: 'u1',
                workspaceId: 'ws-cio-v2',
              },
              destination: {
                Config: {
                  datacenter: 'US',
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
                          id: 'cio_retl_router_user',
                        },
                        attributes: {
                          plan: 'enterprise',
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
                {
                  jobId: 20,
                  userId: 'u1',
                  workspaceId: 'ws-cio-v2',
                },
              ],
              destination: {
                Config: {
                  datacenter: 'US',
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
  // ─── Tests migrated from processor/dataV2.ts ────────────────────────────────
  {
    name: 'customerio',
    description: 'v2: userId with forward slash is preserved in identifiers',
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
                type: 'track',
                userId: 'user/with/slashes',
                event: 'Test Event',
                properties: { test: 'property', value: 123 },
                sentAt: '2023-05-14T09:03:22.563Z',
              },
              metadata: { jobId: 30, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'event',
                        identifiers: { id: 'user/with/slashes' },
                        name: 'Test Event',
                        attributes: { test: 'property', value: 123 },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 30, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: missing apiKey in Config returns 400 configuration error',
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
                type: 'identify',
                userId: '123456',
                traits: { email: 'test@gmail.com' },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: { jobId: 31, userId: 'u1', workspaceId: 'ws-cio-v2' },
              // apiKey intentionally omitted
              destination: { Config: { datacenter: 'US', siteID: secret1 } },
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
              metadata: [{ jobId: 31, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              batched: false,
              statusCode: 400,
              error: 'destination.Config.apiKey: Required',
              statTags: {
                destType: 'CUSTOMERIO',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-cio-v2',
              },
              destination: { Config: { datacenter: 'US', siteID: secret1 } },
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: identify without userId or email returns 400 instrumentation error',
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
                type: 'identify',
                // no userId, no email in traits
                traits: { plan: 'enterprise' },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: { jobId: 32, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
              metadata: [{ jobId: 32, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              batched: false,
              statusCode: 400,
              error: 'message: userId, email or anonymousId is required',
              statTags: {
                destType: 'CUSTOMERIO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-cio-v2',
              },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: page event uses name from properties.url when message.name is absent',
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
                type: 'page',
                userId: '12345',
                // no message.name — should fall back to properties.url
                properties: {
                  path: '/test',
                  referrer: 'Rudder',
                  search: 'abc',
                  title: 'Test Page',
                  url: 'www.rudderlabs.com',
                },
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: { jobId: 33, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'page',
                        identifiers: { id: '12345' },
                        name: 'www.rudderlabs.com',
                        attributes: {
                          path: '/test',
                          referrer: 'Rudder',
                          search: 'abc',
                          title: 'Test Page',
                          url: 'www.rudderlabs.com',
                        },
                        timestamp: 1571051718,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 33, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: track event falls back to email identifier when userId is empty',
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
                type: 'track',
                userId: '',
                context: { traits: { email: 'test@rudderstack.com' } },
                event: 'test track event',
                properties: { user_actual_role: 'system_admin' },
                originalTimestamp: '2019-10-14T11:15:18.300Z',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: { jobId: 34, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'event',
                        identifiers: { email: 'test@rudderstack.com' },
                        name: 'test track event',
                        attributes: { user_actual_role: 'system_admin' },
                        timestamp: 1571051718,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 34, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: android Application Installed maps to add_device action',
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
                anonymousId: '7e32188a4dab669f',
                channel: 'mobile',
                context: {
                  app: {
                    build: '1',
                    name: 'RudderAndroidClient',
                    namespace: 'com.example',
                    version: '1.0',
                  },
                  device: {
                    id: '7e32188a4dab669f',
                    manufacturer: 'Google',
                    model: 'Android SDK built for x86',
                    name: 'generic_x86',
                    type: 'android',
                    token: 'abcxyz',
                  },
                  library: { name: 'com.rudderlabs.android.sdk.core', version: '0.1.4' },
                  locale: 'en-US',
                  os: { name: 'Android', version: '9' },
                },
                event: 'Application Installed',
                userId: '12345',
                originalTimestamp: '2020-01-09T10:01:53.558Z',
                type: 'track',
                properties: { review_id: 'r1', product_id: 'p1', rating: 2 },
                sentAt: '2020-01-09T10:02:03.257Z',
              },
              metadata: { jobId: 35, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'add_device',
                        identifiers: { id: '12345' },
                        device: {
                          token: 'abcxyz',
                          last_used: 1578564113,
                          attributes: {
                            device_os: 'Android',
                            device_model: 'Android SDK built for x86',
                            app_version: '1.0',
                            device_locale: 'en-US',
                            review_id: 'r1',
                            product_id: 'p1',
                            rating: 2,
                          },
                          platform: 'android',
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
              metadata: [{ jobId: 35, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: android Application Uninstalled maps to delete_device action',
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
                anonymousId: '7e32188a4dab669f',
                channel: 'mobile',
                context: {
                  app: {
                    build: '1',
                    name: 'RudderAndroidClient',
                    namespace: 'com.example',
                    version: '1.0',
                  },
                  device: {
                    id: '7e32188a4dab669f',
                    manufacturer: 'Google',
                    model: 'Android SDK built for x86',
                    name: 'generic_x86',
                    type: 'android',
                    token: 'abcxyz',
                  },
                  library: { name: 'com.rudderlabs.android.sdk.core', version: '0.1.4' },
                  locale: 'en-US',
                  os: { name: 'Android', version: '9' },
                },
                event: 'Application Uninstalled',
                userId: '12345',
                originalTimestamp: '2020-01-09T10:01:53.558Z',
                type: 'track',
                sentAt: '2020-01-09T10:02:03.257Z',
              },
              metadata: { jobId: 36, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'delete_device',
                        identifiers: { id: '12345' },
                        device: { token: 'abcxyz' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 36, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: mobile device event without userId or email returns 400',
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
                channel: 'mobile',
                context: {
                  device: {
                    name: 'test android',
                    model: 'some_model',
                    type: 'mobile',
                    token: 'somel',
                  },
                  // no email in traits
                  traits: { anonymousId: '12345' },
                },
                type: 'track',
                event: 'Application Uninstalled',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: { jobId: 37, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
              metadata: [{ jobId: 37, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              batched: false,
              statusCode: 400,
              error: 'message: userId, email or anonymousId is required',
              statTags: {
                destType: 'CUSTOMERIO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-cio-v2',
              },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description:
      'v2: Application Installed with missing userId/email or device token falls back to a track event',
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
              // no userId/email — falls back to a track event identified by anonymous_id
              message: {
                anonymousId: '7e32188a4dab669f',
                channel: 'mobile',
                context: {
                  device: {
                    id: '7e32188a4dab669f',
                    type: 'android',
                    token: 'abcxyz',
                  },
                },
                event: 'Application Installed',
                originalTimestamp: '2020-01-09T10:01:53.558Z',
                type: 'track',
                properties: { review_id: 'r1', product_id: 'p1', rating: 2 },
                sentAt: '2020-01-09T10:02:03.257Z',
              },
              metadata: { jobId: 39, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
            {
              // no device token — falls back to a track event identified by id
              message: {
                anonymousId: '7e32188a4dab669f',
                channel: 'mobile',
                context: {
                  device: {
                    id: '7e32188a4dab669f',
                    type: 'android',
                    // no token present
                  },
                },
                event: 'Application Installed',
                userId: '12345',
                originalTimestamp: '2020-01-09T10:01:53.558Z',
                type: 'track',
                properties: { review_id: 'r1', product_id: 'p1', rating: 2 },
                sentAt: '2020-01-09T10:02:03.257Z',
              },
              metadata: { jobId: 40, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'event',
                        identifiers: { anonymous_id: '7e32188a4dab669f' },
                        name: 'Application Installed',
                        attributes: { review_id: 'r1', product_id: 'p1', rating: 2 },
                        timestamp: 1578564113,
                      },
                      {
                        type: 'person',
                        action: 'event',
                        identifiers: { id: '12345' },
                        name: 'Application Installed',
                        attributes: { review_id: 'r1', product_id: 'p1', rating: 2 },
                        timestamp: 1578564113,
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
                { jobId: 39, userId: 'u1', workspaceId: 'ws-cio-v2' },
                { jobId: 40, userId: 'u1', workspaceId: 'ws-cio-v2' },
              ],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: screen event with anonymousId maps to anonymous_id identifier',
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
                type: 'screen',
                anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                event: 'Home Screen',
                properties: { plan: 'enterprise' },
                originalTimestamp: '2019-10-14T11:15:18.300Z',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: { jobId: 38, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'screen',
                        identifiers: { anonymous_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1' },
                        name: 'Viewed Home Screen Screen',
                        attributes: { plan: 'enterprise' },
                        timestamp: 1571051718,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 38, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: iPadOS device type defaults to ios platform in add_device',
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
                anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                channel: 'mobile',
                context: {
                  app: { build: '1', name: 'TestApp', namespace: 'org.example', version: '1.0' },
                  device: {
                    id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                    manufacturer: 'Apple',
                    model: 'iPhone',
                    name: 'iPhone 13',
                    token: 'deviceToken',
                    type: 'ipados',
                  },
                  locale: 'en-US',
                  os: { name: 'iOS', version: '15.2' },
                  traits: { email: 'sofia@gmail.com' },
                },
                event: 'Application Opened',
                properties: { from_background: false },
                userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
                originalTimestamp: '2022-01-10T10:00:26.513Z',
                type: 'track',
                sentAt: '2022-01-10T10:00:26.982Z',
              },
              metadata: { jobId: 39, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: {
                Config: { datacenter: 'US', siteID: secret5, apiKey: secret6 },
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
                headers: { Authorization: authHeader3, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'add_device',
                        identifiers: { id: 'e91e0378-63fe-11ec-82ac-0a028ee659c3' },
                        device: {
                          token: 'deviceToken',
                          last_used: 1641808826,
                          attributes: {
                            device_os: 'iOS',
                            device_model: 'iPhone',
                            app_version: '1.0',
                            device_locale: 'en-US',
                            from_background: false,
                          },
                          platform: 'ios',
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
              metadata: [{ jobId: 39, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret5, apiKey: secret6 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: group with add_relationships action builds correct object payload',
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
                type: 'group',
                userId: 'user@1',
                groupId: 'group@1',
                traits: {
                  domainNames: 'rudderstack.com',
                  email: 'help@rudderstack.com',
                  name: 'rudderstack',
                  action: 'add_relationships',
                },
              },
              metadata: { jobId: 40, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret7, apiKey: secret8 } },
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
                headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'object',
                        action: 'add_relationships',
                        identifiers: { object_id: 'group@1', object_type_id: '1' },
                        attributes: {
                          domainNames: 'rudderstack.com',
                          email: 'help@rudderstack.com',
                          name: 'rudderstack',
                        },
                        cio_relationships: [{ identifiers: { id: 'user@1' } }],
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 40, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret7, apiKey: secret8 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: group with delete_relationships action builds correct object payload',
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
                type: 'group',
                userId: 'user@1',
                groupId: 'group@1',
                traits: {
                  domainNames: 'rudderstack.com',
                  email: 'help@rudderstack.com',
                  name: 'rudderstack',
                  action: 'delete_relationships',
                },
              },
              metadata: { jobId: 41, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret7, apiKey: secret8 } },
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
                headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'object',
                        action: 'delete_relationships',
                        identifiers: { object_id: 'group@1', object_type_id: '1' },
                        attributes: {
                          domainNames: 'rudderstack.com',
                          email: 'help@rudderstack.com',
                          name: 'rudderstack',
                        },
                        cio_relationships: [{ identifiers: { id: 'user@1' } }],
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 41, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret7, apiKey: secret8 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: group event uses EU endpoint when datacenter is EU',
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
                channel: 'server',
                type: 'group',
                userId: '432',
                groupId: '306',
                traits: {
                  city: 'Frankfurt',
                  name: 'rudder test',
                  country: 'DE',
                  action: 'identify',
                },
                originalTimestamp: '2023-03-28T09:36:49.882Z',
                sentAt: '2023-03-28T09:36:49.882Z',
              },
              metadata: { jobId: 42, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'EU', siteID: secret7, apiKey: secret8 } },
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
                endpoint: 'https://track-eu.customer.io/api/v2/batch',
                endpointPath: 'v2/batch',
                headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'object',
                        action: 'identify',
                        identifiers: { object_id: '306', object_type_id: '1' },
                        attributes: { city: 'Frankfurt', name: 'rudder test', country: 'DE' },
                        cio_relationships: [{ identifiers: { id: '432' } }],
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 42, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'EU', siteID: secret7, apiKey: secret8 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: page without name or url returns 400 invalid page error',
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
                type: 'page',
                anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                // no name, no properties.url
              },
              metadata: { jobId: 43, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
              metadata: [{ jobId: 43, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              batched: false,
              statusCode: 400,
              error: 'Event Name type should be a string',
              statTags: {
                destType: 'CUSTOMERIO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-cio-v2',
              },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description: 'v2: alias maps to person merge action with primary/secondary',
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
                type: 'alias',
                userId: 'cio_v2_1',
                previousId: 'cio_v2_2',
              },
              metadata: { jobId: 44, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'merge',
                        primary: { id: 'cio_v2_1' },
                        secondary: { id: 'cio_v2_2' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 44, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description:
      'v2: numeric userId/anonymousId/previousId/groupId are accepted and passed through unstringified',
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
                type: 'identify',
                userId: 432,
                traits: { email: 'numeric-id@rudderstack.com', plan: 'enterprise' },
              },
              metadata: { jobId: 45, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
            {
              message: {
                channel: 'web',
                type: 'track',
                anonymousId: 987654,
                event: 'Product Viewed',
                properties: { plan: 'enterprise' },
              },
              metadata: { jobId: 46, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
            {
              message: {
                channel: 'web',
                type: 'alias',
                userId: 432,
                previousId: 306,
              },
              metadata: { jobId: 47, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
            {
              message: {
                channel: 'web',
                type: 'group',
                userId: 432,
                groupId: 306,
                traits: { name: 'numeric group' },
              },
              metadata: { jobId: 48, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'identify',
                        identifiers: { id: 432 },
                        attributes: {
                          email: 'numeric-id@rudderstack.com',
                          plan: 'enterprise',
                        },
                      },
                      {
                        type: 'person',
                        action: 'event',
                        identifiers: { anonymous_id: 987654 },
                        name: 'Product Viewed',
                        attributes: { plan: 'enterprise' },
                      },
                      {
                        type: 'person',
                        action: 'merge',
                        primary: { id: 432 },
                        secondary: { id: 306 },
                      },
                      // group/object ids keep the `toString` mapping coercion, so they are
                      // emitted as strings while person identifiers stay numeric
                      {
                        type: 'object',
                        action: 'identify',
                        identifiers: { object_id: '306', object_type_id: '1' },
                        attributes: { name: 'numeric group' },
                        cio_relationships: [{ identifiers: { id: '432' } }],
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
                { jobId: 45, userId: 'u1', workspaceId: 'ws-cio-v2' },
                { jobId: 46, userId: 'u1', workspaceId: 'ws-cio-v2' },
                { jobId: 47, userId: 'u1', workspaceId: 'ws-cio-v2' },
                { jobId: 48, userId: 'u1', workspaceId: 'ws-cio-v2' },
              ],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'cio-v2-router-record-mirror',
    name: 'customerio',
    description: 'v2: record events (mirror mode) — insert+delete batch into one request',
    scenario: 'business',
    successCriteria:
      'insert maps to identify person action, delete maps to delete person action, both batched',
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
                type: 'record',
                action: 'insert',
                identifiers: { id: 'user-123', plan: 'pro', age: 30 },
              },
              metadata: { jobId: 100, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'person', syncMode: 'mirror' } },
              },
            },
            {
              message: {
                type: 'record',
                action: 'delete',
                identifiers: { id: 'user-456' },
              },
              metadata: { jobId: 101, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'person', syncMode: 'mirror' } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'identify',
                        identifiers: { id: 'user-123' },
                        attributes: { plan: 'pro', age: 30 },
                      },
                      {
                        type: 'person',
                        action: 'delete',
                        identifiers: { id: 'user-456' },
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
                { jobId: 100, userId: 'u1', workspaceId: 'ws-cio-v2' },
                { jobId: 101, userId: 'u1', workspaceId: 'ws-cio-v2' },
              ],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'cio-v2-router-record-event-object',
    name: 'customerio',
    description: 'v2: event object records — insert+update batch into event actions',
    scenario: 'business',
    successCriteria: 'insert and update map to CustomerIO event actions with top-level event names',
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
                type: 'record',
                action: 'insert',
                identifiers: {
                  id: 'user-123',
                  name: 'Order Completed',
                  plan: 'pro',
                  created_at: '2024-06-25T14:00:00.000Z',
                },
              },
              metadata: { jobId: 104, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'event', syncMode: 'upsert' } },
              },
            },
            {
              message: {
                type: 'record',
                action: 'update',
                identifiers: {
                  email: 'user@example.com',
                  name: 'Plan Changed',
                  plan: 'enterprise',
                  created_at: '2024-06-25T15:00:00.000Z',
                },
              },
              metadata: { jobId: 105, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'event', syncMode: 'upsert' } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'event',
                        identifiers: { id: 'user-123' },
                        name: 'Order Completed',
                        timestamp: 1719324000,
                        attributes: {
                          plan: 'pro',
                        },
                      },
                      {
                        type: 'person',
                        action: 'event',
                        identifiers: { email: 'user@example.com' },
                        name: 'Plan Changed',
                        timestamp: 1719327600,
                        attributes: {
                          plan: 'enterprise',
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
                { jobId: 104, userId: 'u1', workspaceId: 'ws-cio-v2' },
                { jobId: 105, userId: 'u1', workspaceId: 'ws-cio-v2' },
              ],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'cio-v2-router-record-event-delete',
    name: 'customerio',
    description: 'v2: event object record delete returns instrumentation error',
    scenario: 'business',
    successCriteria: 'delete is rejected for CustomerIO event object records',
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
                type: 'record',
                action: 'delete',
                identifiers: { id: 'user-123', event: 'Order Completed' },
              },
              metadata: { jobId: 106, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'event', syncMode: 'mirror' } },
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
              metadata: [{ jobId: 106, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              batched: false,
              statusCode: 400,
              error: '"delete" is not supported for object type "event"',
              statTags: {
                destType: 'CUSTOMERIO',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-cio-v2',
              },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
          ],
        },
      },
    },
  },
  {
    id: 'cio-v2-router-record-identifier-priority',
    name: 'customerio',
    description:
      'v2: record event — cio_id takes priority over id and email when all are present in identifiers',
    scenario: 'business',
    successCriteria:
      'only cio_id appears in payload identifiers; id, email and other fields are moved to attributes',
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
                type: 'record',
                action: 'insert',
                identifiers: {
                  cio_id: 'cio-abc',
                  id: 'user-789',
                  email: 'user@example.com',
                  plan: 'pro',
                },
              },
              metadata: { jobId: 103, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'person', syncMode: 'upsert' } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'identify',
                        identifiers: { cio_id: 'cio-abc' },
                        attributes: { id: 'user-789', email: 'user@example.com', plan: 'pro' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 103, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'cio-v2-router-record-missing-identifiers',
    name: 'customerio',
    description:
      'v2: record batch — valid event succeeds, event with undefined identifiers fails with 400',
    scenario: 'business',
    successCriteria:
      'valid record is batched and emitted; event with no identifiers returns a 400 instrumentation error',
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
                type: 'record',
                action: 'insert',
                identifiers: { id: 'user-100', plan: 'pro' },
              },
              metadata: { jobId: 200, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'person', syncMode: 'upsert' } },
              },
            },
            {
              message: {
                type: 'record',
                action: 'insert',
                identifiers: {},
              },
              metadata: { jobId: 201, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'person', syncMode: 'upsert' } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'identify',
                        identifiers: { id: 'user-100' },
                        attributes: { plan: 'pro' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 200, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
            {
              metadata: [{ jobId: 201, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              batched: false,
              statusCode: 400,
              error: 'message: A non-empty `id` or `email` identifier is required',
              statTags: {
                destType: 'CUSTOMERIO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-cio-v2',
              },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
          ],
        },
      },
    },
  },
  {
    id: 'cio-v2-router-record-upsert-email',
    name: 'customerio',
    description: 'v2: record event (upsert mode) — update with email identifier',
    scenario: 'business',
    successCriteria: 'update maps to identify person action with email as identifier',
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
                type: 'record',
                action: 'update',
                identifiers: { email: 'user@example.com', plan: 'enterprise' },
              },
              metadata: { jobId: 102, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'person', syncMode: 'upsert' } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'identify',
                        identifiers: { email: 'user@example.com' },
                        attributes: { plan: 'enterprise' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 102, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description:
      'v2: record and event-stream failures are attributed to the variant the message selected',
    scenario: 'framework',
    successCriteria:
      'each invalid event reports only its own variant’s rule — the record error never mentions userId/email and the event-stream error never mentions identifiers — while the valid events of both variants still batch',
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
              // valid record
              message: {
                type: 'record',
                action: 'insert',
                identifiers: { id: 'user-123' },
              },
              metadata: { jobId: 200, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'person', syncMode: 'mirror' } },
              },
            },
            {
              // valid event-stream event, carrying no connection at all (#5331)
              message: {
                channel: 'web',
                type: 'track',
                event: 'Order Completed',
                userId: 'user-789',
                properties: { total: 42 },
                originalTimestamp: '2020-01-09T10:01:53.558Z',
              },
              metadata: { jobId: 201, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
            {
              // invalid record: fails the RECORD-only rule (needs a non-empty id/email
              // identifier). Must not be blamed for the event-stream variant's rules.
              message: {
                type: 'record',
                action: 'update',
                identifiers: { plan: 'pro' },
              },
              metadata: { jobId: 202, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'person', syncMode: 'mirror' } },
              },
            },
            {
              // invalid event-stream: fails the EVENT-STREAM-only rule (needs userId /
              // email / anonymousId). Must not be blamed for the record variant's rules.
              message: {
                channel: 'web',
                type: 'track',
                event: 'Order Completed',
                properties: { total: 7 },
              },
              metadata: { jobId: 203, userId: 'u1', workspaceId: 'ws-cio-v2' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
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
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'identify',
                        identifiers: { id: 'user-123' },
                      },
                      {
                        type: 'person',
                        action: 'event',
                        identifiers: { id: 'user-789' },
                        name: 'Order Completed',
                        attributes: { total: 42 },
                        timestamp: 1578564113,
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
                { jobId: 200, userId: 'u1', workspaceId: 'ws-cio-v2' },
                { jobId: 201, userId: 'u1', workspaceId: 'ws-cio-v2' },
              ],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
            {
              metadata: [{ jobId: 202, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              batched: false,
              statusCode: 400,
              error: 'message: A non-empty `id` or `email` identifier is required',
              statTags: {
                destType: 'CUSTOMERIO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-cio-v2',
              },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
            {
              metadata: [{ jobId: 203, userId: 'u1', workspaceId: 'ws-cio-v2' }],
              batched: false,
              statusCode: 400,
              error: 'message: userId, email or anonymousId is required',
              statTags: {
                destType: 'CUSTOMERIO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-cio-v2',
              },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
          ],
        },
      },
    },
  },
];
