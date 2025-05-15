import { defaultApiKey } from '../../../common/secrets';

export const data = [
  {
    name: 'algolia',
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
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product clicked',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                filters: ['field1:hello', 'val1:val2'],
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product clicked',
                    to: 'cLick ',
                  },
                ],
              },
              hasDynamicConfig: false,
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
                FORM: {},
                JSON_ARRAY: {},
                JSON: {
                  events: [
                    {
                      eventName: 'product clicked',
                      eventType: 'click',
                      filters: ['field1:hello', 'val1:val2'],
                      index: 'products',
                      userToken: 'testuserId1',
                    },
                  ],
                },
                XML: {},
              },
              endpoint: 'https://insights.algolia.io/1/events',
              files: {},
              headers: {
                'X-Algolia-API-Key': defaultApiKey,
                'X-Algolia-Application-Id': 'O2YARRI15I',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                products: [
                  {
                    objectId: 'ecommerce-sample-data-919',
                    position: 7,
                  },
                  {
                    objectId: '9780439784542',
                    position: 8,
                  },
                ],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'click',
                  },
                ],
              },
              hasDynamicConfig: false,
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
                FORM: {},
                JSON_ARRAY: {},
                JSON: {
                  events: [
                    {
                      eventName: 'product list viewed',
                      eventType: 'click',
                      objectIDs: ['ecommerce-sample-data-919', '9780439784542'],
                      positions: [7, 8],
                      index: 'products',
                      userToken: 'testuserId1',
                      queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
                    },
                  ],
                },
                XML: {},
              },
              endpoint: 'https://insights.algolia.io/1/events',
              files: {},
              headers: {
                'X-Algolia-API-Key': defaultApiKey,
                'X-Algolia-Application-Id': 'O2YARRI15I',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product clicked',
              userId: 'testuserId1',
              properties: {
                eventType: 'click',
                index: 'products',
                queryId: '43b15df305339e827f0ac0bdc5ebcaa8',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [],
              },
              hasDynamicConfig: false,
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
            error:
              'Either filters or objectIds is required and must be non empty.: Workflow: procWorkflow, Step: validateDestPayload, ChildStep: undefined, OriginalError: Either filters or objectIds is required and must be non empty.',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'testuserId1',
              event: 'product clicked',
              properties: {
                index: 'products',
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [],
              },
              hasDynamicConfig: false,
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
            error:
              'eventType is mandatory for track call: Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: eventType is mandatory for track call',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'Test 4',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                products: [
                  {
                    objectId: 'ecommerce-sample-data-919',
                    position: 7,
                  },
                  {
                    objectId: '9780439784542',
                    position: 8,
                  },
                ],
                queryId: '',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'click',
                  },
                ],
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
            error:
              'for click eventType either both positions and queryId should be present or none: Workflow: procWorkflow, Step: validatePayloadForClickEvent, ChildStep: undefined, OriginalError: for click eventType either both positions and queryId should be present or none',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'Test 5',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                products: [
                  {
                    objectId: 'ecommerce-sample-data-919',
                    position: 7,
                  },
                  {
                    objectId: '9780439784542',
                    position: 8,
                  },
                ],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'view',
                  },
                ],
              },
              hasDynamicConfig: false,
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
                FORM: {},
                JSON_ARRAY: {},
                JSON: {
                  events: [
                    {
                      eventName: 'product list viewed',
                      eventType: 'view',
                      index: 'products',
                      objectIDs: ['ecommerce-sample-data-919', '9780439784542'],
                      userToken: 'testuserId1',
                      queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
                    },
                  ],
                },
                XML: {},
              },
              endpoint: 'https://insights.algolia.io/1/events',
              files: {},
              headers: {
                'X-Algolia-API-Key': defaultApiKey,
                'X-Algolia-Application-Id': 'O2YARRI15I',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'Test 6',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                products: [
                  {
                    objectId: 'ecommerce-sample-data-919',
                    position: '7',
                  },
                  {
                    objectId: '9780439784542',
                    position: 'a',
                  },
                ],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'click',
                  },
                ],
              },
              hasDynamicConfig: false,
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
            error:
              'for click eventType either both positions and queryId should be present or none: Workflow: procWorkflow, Step: validatePayloadForClickEvent, ChildStep: undefined, OriginalError: for click eventType either both positions and queryId should be present or none',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'Test 7',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                products: [
                  {
                    objectId: 'ecommerce-sample-data-919',
                    position: '7',
                  },
                  {
                    objectId: '9780439784542',
                    position: 'a',
                  },
                ],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'check',
                  },
                ],
              },
              hasDynamicConfig: false,
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
            error:
              'eventType can be either click, view or conversion: Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: eventType can be either click, view or conversion',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'Test 8',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                products: [
                  {
                    objectId: 'ecommerce-sample-data-919',
                    position: '7',
                  },
                  {
                    objectId: '9780439784542',
                    position: 'a',
                  },
                ],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
              },
              hasDynamicConfig: false,
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
            error:
              'eventType is mandatory for track call: Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: eventType is mandatory for track call',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'Test 9',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product clicked',
              userId: 'testuserId1',
              properties: {
                filters: ['field1:hello', 'val1:val2'],
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product clicked',
                    to: 'cLick ',
                  },
                ],
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
            error:
              'Missing required value from "properties.index": Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: Missing required value from "properties.index"',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',

              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'Test 10',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: ['abc', 'def'],
              userId: 'testuserId1',
              properties: {
                filters: ['field1:hello', 'val1:val2'],
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product clicked',
                    to: 'cLick ',
                  },
                ],
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
            error:
              'event name should be a string: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: event name should be a string',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'Eventype must be one of click, conversion pr view',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product clicked',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                filters: ['field1:hello', 'val1:val2'],
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product clicked',
                    to: 'abcd',
                  },
                ],
              },
              hasDynamicConfig: false,
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
            error:
              'eventType can be either click, view or conversion: Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: eventType can be either click, view or conversion',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'filters or objectIds must be non empty',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'product clicked',
              sentAt: '2024-02-25T17:55:36.882Z',
              userId: '12345',
              channel: 'web',
              properties: {
                index: 'products',
                list_id: 'search_results_page',
                queryId: '8e737',
                products: [],
                eventName: 'productListView',
                list_name: 'Search Results Page',
                objectIds: [],
                positions: [],
                userToken: 'e494',
                additional_attributes: {},
              },
              receivedAt: '2024-02-25T17:55:38.089Z',
              request_ip: '107.130.37.100',
              anonymousId: '68e9f4b8-fd4d-4c56-8ca4-858de2fd1df8',
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-02-25T17:55:36.880Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product clicked',
                    to: 'cLick ',
                  },
                ],
              },
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
            error:
              'Either filters or objectIds is required and must be non empty.: Workflow: procWorkflow, Step: validateDestPayload, ChildStep: undefined, OriginalError: Either filters or objectIds is required and must be non empty.',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description:
      'For conversion event including product array and subtype addToCart, object data is sent',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                eventSubtype: 'addToCart',
                currency: 'USD',
                products: [
                  {
                    objectId: 'ecommerce-sample-data-919',
                    position: 7,
                    quantity: '2',
                    price: 10,
                    queryID: '123',
                    discount: '10',
                  },
                  {
                    objectId: '9780439784542',
                    position: 8,
                    quantity: '3',
                    price: 30,
                    queryID: '123',
                    discount: '10',
                  },
                ],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'conversion',
                  },
                ],
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
                JSON: {
                  events: [
                    {
                      index: 'products',
                      currency: 'USD',
                      queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
                      objectIDs: ['ecommerce-sample-data-919', '9780439784542'],
                      userToken: 'testuserId1',
                      eventName: 'product list viewed',
                      eventSubtype: 'addToCart',
                      eventType: 'conversion',
                      objectData: [
                        {
                          quantity: 2,
                          price: '10',
                          queryID: '123',
                          discount: '10',
                        },
                        {
                          quantity: 3,
                          price: '30',
                          queryID: '123',
                          discount: '10',
                        },
                      ],
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insights.algolia.io/1/events',
              headers: {
                'X-Algolia-Application-Id': 'O2YARRI15I',
                'X-Algolia-API-Key': defaultApiKey,
              },
              params: {},
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description:
      'For conversion event including product array and subtype purchase, object data is sent',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                currency: 'USD',
                eventSubtype: 'purchase',
                products: [
                  {
                    objectId: 'ecommerce-sample-data-919',
                    position: 7,
                    quantity: '2',
                    price: 10,
                    queryID: '123',
                    discount: '10',
                  },
                  {
                    objectId: '9780439784542',
                    position: 8,
                    quantity: '3',
                    price: 30,
                    queryID: '123',
                    discount: '10',
                  },
                ],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'conversion',
                  },
                ],
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
                JSON: {
                  events: [
                    {
                      index: 'products',
                      currency: 'USD',
                      queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
                      objectIDs: ['ecommerce-sample-data-919', '9780439784542'],
                      userToken: 'testuserId1',
                      eventName: 'product list viewed',
                      eventSubtype: 'purchase',
                      eventType: 'conversion',
                      objectData: [
                        {
                          quantity: 2,
                          queryID: '123',
                          discount: '10',
                          price: '10',
                        },
                        {
                          quantity: 3,
                          queryID: '123',
                          discount: '10',
                          price: '30',
                        },
                      ],
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insights.algolia.io/1/events',
              headers: {
                'X-Algolia-Application-Id': 'O2YARRI15I',
                'X-Algolia-API-Key': defaultApiKey,
              },
              params: {},
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description:
      'For conversion event including product array and subtype wrong, object data is sent but subType is omitted',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                eventSubtype: 'random',
                value: 10,
                currency: 'USD',
                products: [
                  {
                    objectId: 'ecommerce-sample-data-919',
                    position: 7,
                    quantity: '2',
                    queryID: '123',
                    discount: '10',
                    price: 10,
                  },
                  {
                    objectId: '9780439784542',
                    position: 8,
                    quantity: '3',
                    queryID: '123',
                    discount: '10',
                    price: 10,
                  },
                ],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'conversion',
                  },
                ],
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
                JSON: {
                  events: [
                    {
                      index: 'products',
                      queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
                      objectIDs: ['ecommerce-sample-data-919', '9780439784542'],
                      userToken: 'testuserId1',
                      eventName: 'product list viewed',
                      eventType: 'conversion',
                      value: 10,
                      currency: 'USD',
                      objectData: [
                        {
                          price: '10',
                          quantity: 2,
                          queryID: '123',
                          discount: '10',
                        },
                        {
                          price: '10',
                          quantity: 3,
                          queryID: '123',
                          discount: '10',
                        },
                      ],
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insights.algolia.io/1/events',
              headers: {
                'X-Algolia-Application-Id': 'O2YARRI15I',
                'X-Algolia-API-Key': defaultApiKey,
              },
              params: {},
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description:
      'For conversion event without including product array and subtype purchase, object data is not sent but subType is sent',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                eventSubtype: 'purchase',
                filters: ['field1:hello', 'val1:val2'],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'conversion',
                  },
                ],
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
                JSON: {
                  events: [
                    {
                      index: 'products',
                      queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
                      filters: ['field1:hello', 'val1:val2'],
                      userToken: 'testuserId1',
                      eventName: 'product list viewed',
                      eventType: 'conversion',
                      eventSubtype: 'purchase',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insights.algolia.io/1/events',
              headers: {
                'X-Algolia-Application-Id': 'O2YARRI15I',
                'X-Algolia-API-Key': defaultApiKey,
              },
              params: {},
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'When price information is present in objectData, currency is mandatory',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                products: [
                  {
                    objectId: 'ecommerce-sample-data-919',
                    position: 7,
                    quantity: '2',
                    price: 10,
                  },
                  {
                    objectId: '9780439784542',
                    position: 8,
                    quantity: '3',
                    price: 30,
                  },
                ],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'conversion',
                  },
                ],
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
            error:
              'Currency missing when objectData fields has price informations.: Workflow: procWorkflow, Step: populateProductsData, ChildStep: populateForClickEvent, OriginalError: Currency missing when objectData fields has price informations.',
            statTags: {
              destType: 'ALGOLIA',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'algolia',
    description: 'queryID and queryId inconsistency test',
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
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
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
                page: {
                  path: '/destinations/ometria',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/ometria',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                eventSubtype: 'purchase',
                filters: ['field1:hello', 'val1:val2'],
                queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: defaultApiKey,
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product list viewed',
                    to: 'conversion',
                  },
                ],
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
                JSON: {
                  events: [
                    {
                      index: 'products',
                      queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
                      filters: ['field1:hello', 'val1:val2'],
                      userToken: 'testuserId1',
                      eventName: 'product list viewed',
                      eventType: 'conversion',
                      eventSubtype: 'purchase',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insights.algolia.io/1/events',
              headers: {
                'X-Algolia-Application-Id': 'O2YARRI15I',
                'X-Algolia-API-Key': defaultApiKey,
              },
              params: {},
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
];
