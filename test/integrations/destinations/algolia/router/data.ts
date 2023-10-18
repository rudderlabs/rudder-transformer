export const data = [
  {
    name: 'algolia',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'product list viewed',
                sentAt: '2021-10-25T09:40:08.880Z',
                userId: 'test-user-id1',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.2.1',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  page: {
                    url: 'http://127.0.0.1:5500/index.html',
                    path: '/index.html',
                    title: 'Test',
                    search: '',
                    tab_url: 'http://127.0.0.1:5500/index.html',
                    referrer: 'http://127.0.0.1:5500/index.html',
                    initial_referrer: 'http://127.0.0.1:5500/index.html',
                    referring_domain: '127.0.0.1:5500',
                    initial_referring_domain: '127.0.0.1:5500',
                  },
                  locale: 'en-GB',
                  screen: {
                    width: 1440,
                    height: 900,
                    density: 2,
                    innerWidth: 1440,
                    innerHeight: 335,
                  },
                  traits: {
                    city: 'Brussels',
                    email: 'testemail@email.com',
                    phone: '1234567890',
                    country: 'Belgium',
                    firstName: 'Tintin',
                    custom_date: 1574769933368,
                    custom_date1: '2019-10-14T11:15:53.296Z',
                    custom_flavor: 'chocolate',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.2.1',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36',
                },
                rudderId: 'e3e907f1-f79a-444b-b91d-da47488f8273',
                messageId: '8cdd3d2e-5e07-42ec-abdc-9b6bd4333840',
                timestamp: '2021-10-25T15:10:08.888+05:30',
                properties: {
                  index: 'products',
                  queryId: '43b15df305339e827f0ac0bdc5ebcaa7',
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
                },
                receivedAt: '2021-10-25T15:10:08.889+05:30',
                request_ip: '[::1]',
                anonymousId: '7138f7d9-5dd2-4337-805d-ca17be59dc8e',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-10-25T09:40:08.879Z',
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                ID: '1zzHtStW2ZPlullmz6L7DGnmk9V',
                Name: 'algolia-dev',
                DestinationDefinition: {
                  ID: '1zgVZhcj1Tij4qlKg7B1Jp16IrH',
                  Name: 'ALGOLIA',
                  DisplayName: 'Algolia',
                  Config: {
                    destConfig: {
                      defaultConfig: ['apiKey', 'applicationId', 'eventTypeSettings'],
                    },
                    excludeKeys: [],
                    includeKeys: [],
                    saveDestinationResponse: true,
                    secretKeys: ['apiKey', 'applicationId'],
                    supportedMessageTypes: ['track'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                      'flutter',
                      'cordova',
                    ],
                    transformAt: 'router',
                    transformAtV1: 'router',
                  },
                  ResponseRules: {},
                },
                Config: {
                  apiKey: 'apiKey',
                  applicationId: 'appId',
                  eventTypeSettings: [
                    {
                      from: 'product clicked',
                      to: 'click',
                    },
                    {
                      from: 'product list viewed',
                      to: 'view',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: true,
              },
            },
            {
              message: {
                type: 'track',
                event: 'product clicked',
                sentAt: '2021-10-25T09:40:08.886Z',
                userId: 'test-user-id1',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.2.1',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  page: {
                    url: 'http://127.0.0.1:5500/index.html',
                    path: '/index.html',
                    title: 'Test',
                    search: '',
                    tab_url: 'http://127.0.0.1:5500/index.html',
                    referrer: 'http://127.0.0.1:5500/index.html',
                    initial_referrer: 'http://127.0.0.1:5500/index.html',
                    referring_domain: '127.0.0.1:5500',
                    initial_referring_domain: '127.0.0.1:5500',
                  },
                  locale: 'en-GB',
                  screen: {
                    width: 1440,
                    height: 900,
                    density: 2,
                    innerWidth: 1440,
                    innerHeight: 335,
                  },
                  traits: {
                    city: 'Brussels',
                    email: 'testemail@email.com',
                    phone: '1234567890',
                    country: 'Belgium',
                    firstName: 'Tintin',
                    custom_date: 1574769933368,
                    custom_date1: '2019-10-14T11:15:53.296Z',
                    custom_flavor: 'chocolate',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.2.1',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36',
                },
                rudderId: 'e3e907f1-f79a-444b-b91d-da47488f8273',
                messageId: '7b58e140-b66b-4e88-a5ec-bd6811fc3836',
                timestamp: '2021-10-25T15:10:08.943+05:30',
                properties: {
                  index: 'products',
                  filters: ['field1:hello', 'val1:val2'],
                },
                receivedAt: '2021-10-25T15:10:08.943+05:30',
                request_ip: '[::1]',
                anonymousId: '7138f7d9-5dd2-4337-805d-ca17be59dc8e',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-10-25T09:40:08.886Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                ID: '1zzHtStW2ZPlullmz6L7DGnmk9V',
                Name: 'algolia-dev',
                DestinationDefinition: {
                  ID: '1zgVZhcj1Tij4qlKg7B1Jp16IrH',
                  Name: 'ALGOLIA',
                  DisplayName: 'Algolia',
                  Config: {
                    destConfig: {
                      defaultConfig: ['apiKey', 'applicationId', 'eventTypeSettings'],
                    },
                    excludeKeys: [],
                    includeKeys: [],
                    saveDestinationResponse: true,
                    secretKeys: ['apiKey', 'applicationId'],
                    supportedMessageTypes: ['track'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                      'flutter',
                      'cordova',
                    ],
                    transformAt: 'router',
                    transformAtV1: 'router',
                  },
                  ResponseRules: {},
                },
                Config: {
                  apiKey: 'apiKey-2',
                  applicationId: 'appId-2',
                  eventTypeSettings: [
                    {
                      from: 'product clicked',
                      to: 'click',
                    },
                    {
                      from: 'product list viewed',
                      to: 'view',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: true,
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
                jobId: 3,
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
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
          destType: 'algolia',
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
                endpoint: 'https://insights.algolia.io/1/events',
                headers: {
                  'X-Algolia-Application-Id': 'appId',
                  'X-Algolia-API-Key': 'apiKey',
                },
                params: {},
                body: {
                  JSON: {
                    events: [
                      {
                        index: 'products',
                        userToken: 'test-user-id1',
                        queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
                        eventName: 'product list viewed',
                        eventType: 'view',
                        objectIDs: ['ecommerce-sample-data-919', '9780439784542'],
                      },
                      {
                        index: 'products',
                        userToken: 'test-user-id1',
                        filters: ['field1:hello', 'val1:val2'],
                        eventName: 'product clicked',
                        eventType: 'click',
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
                },
                {
                  jobId: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '1zzHtStW2ZPlullmz6L7DGnmk9V',
                Name: 'algolia-dev',
                DestinationDefinition: {
                  ID: '1zgVZhcj1Tij4qlKg7B1Jp16IrH',
                  Name: 'ALGOLIA',
                  DisplayName: 'Algolia',
                  Config: {
                    destConfig: {
                      defaultConfig: ['apiKey', 'applicationId', 'eventTypeSettings'],
                    },
                    excludeKeys: [],
                    includeKeys: [],
                    saveDestinationResponse: true,
                    secretKeys: ['apiKey', 'applicationId'],
                    supportedMessageTypes: ['track'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                      'flutter',
                      'cordova',
                    ],
                    transformAt: 'router',
                    transformAtV1: 'router',
                  },
                  ResponseRules: {},
                },
                Config: {
                  apiKey: 'apiKey',
                  applicationId: 'appId',
                  eventTypeSettings: [
                    {
                      from: 'product clicked',
                      to: 'click',
                    },
                    {
                      from: 'product list viewed',
                      to: 'view',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: true,
              },
            },
            {
              batched: false,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  applicationId: 'O2YARRI15I',
                  eventTypeSettings: [
                    {
                      from: 'product clicked',
                      to: 'cLick ',
                    },
                  ],
                },
              },
              error: 'Missing required value from "properties.index"',
              metadata: [
                {
                  jobId: 3,
                },
              ],
              statTags: {
                destType: 'ALGOLIA',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    name: 'algolia',
    description: 'Test 1',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Product List Viewed',
                sentAt: '2023-06-19T22:22:34.928Z',
                userId: 'anonymous',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '2.35.0',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  page: {
                    url: 'https://m2-staging.ecmdi.com/supplies/air-distribution/grilles',
                    path: '/supplies/air-distribution/grilles/',
                    title: 'Grilles - Air Distribution - Supplies | East Coast Metal Distributors',
                    search: '',
                    tab_url: 'https://m2-staging.ecmdi.com/supplies/air-distribution/grilles',
                    referrer: 'https://m2-staging.ecmdi.com/',
                    initial_referrer: 'https://m2-staging.ecmdi.com/',
                    referring_domain: 'm2-staging.ecmdi.com',
                    initial_referring_domain: 'm2-staging.ecmdi.com',
                  },
                  locale: 'en',
                  screen: {
                    width: 2560,
                    height: 1440,
                    density: 1,
                    innerWidth: 2514,
                    innerHeight: 567,
                  },
                  traits: {
                    loggedIn: false,
                    customerId: 'anonymous',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '2.35.0',
                  },
                  campaign: {},
                  sessionId: 1687204412379,
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/114.0',
                  trackingPlanId: 'tp_2P3vmVzstHPms8hwcqHYwgBjIC7',
                  violationErrors: [
                    {
                      meta: {
                        schemaPath: '#/properties/properties/properties/list_id/type',
                        instacePath: '/properties/list_id',
                      },
                      type: 'Datatype-Mismatch',
                      message: 'must be string',
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/0',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/0',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/0',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/0',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/0',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/0',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/0',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/1',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/1',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/1',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/1',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/1',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/1',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/1',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/2',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/2',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/2',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/2',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/2',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/2',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/2',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/3',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/3',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/3',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/3',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/3',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/3',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/3',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/4',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/4',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/4',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/4',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/4',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/4',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/4',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/5',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/5',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/5',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/5',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/5',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/5',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/5',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/6',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/6',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/6',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/6',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/6',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/6',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/6',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/7',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/7',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/7',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/7',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/7',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/7',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/7',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/8',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/8',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/8',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/8',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/8',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/8',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/8',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/9',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/9',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/9',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/9',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/9',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/9',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/9',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/10',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/10',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/10',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/10',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/10',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/10',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/10',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/11',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/11',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/11',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/11',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/11',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/11',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/11',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/12',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/12',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/12',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/12',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/12',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/12',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/12',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/13',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/13',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/13',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/13',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/13',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/13',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/13',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/14',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/14',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/14',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/14',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/14',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/14',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/14',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/15',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/15',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/15',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/15',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/15',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/15',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/15',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/16',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/16',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/16',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/16',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/16',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/16',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/16',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/17',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/17',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/17',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/17',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/17',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/17',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/17',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/18',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'bu_product_num'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/18',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'erp_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/18',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/18',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'list_name'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/18',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'location_id'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/18',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'mpn'",
                    },
                    {
                      meta: {
                        schemaPath:
                          '#/properties/properties/properties/products/items/additionalProperties',
                        instacePath: '/properties/products/18',
                      },
                      type: 'Additional-Properties',
                      message: "must NOT have additional properties 'pim_id'",
                    },
                  ],
                  trackingPlanVersion: 2,
                },
                rudderId: '0d1f77df-5882-402a-a69f-d2dfe3175ebc',
                timestamp: '2023-06-19T19:54:39.188Z',
                properties: {
                  index: 'ecm_stg_product',
                  list_id: 1100000063100,
                  queryId: 'eafb6ef1081263626abce46671147dc0',
                  products: [
                    {
                      mpn: '190RF14X20',
                      sku: '1367585787601',
                      name: '14" x 20" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168782',
                      pim_id: '1367585787601',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 1,
                      list_name: 'Grilles',
                      product_id: '49765',
                      location_id: 1,
                      bu_product_num: '49765',
                    },
                    {
                      mpn: '190RF20X20',
                      sku: '1367585788656',
                      name: '20" x 20" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168790',
                      pim_id: '1367585788656',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 2,
                      list_name: 'Grilles',
                      product_id: '49773',
                      location_id: 1,
                      bu_product_num: '49773',
                    },
                    {
                      mpn: '210VM10X04',
                      sku: '1367585790735',
                      name: '10" x 4" Bar Type Supply Sidewall/Ceiling Register - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '300529',
                      pim_id: '1367585790735',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 3,
                      list_name: 'Grilles',
                      product_id: '300529A',
                      location_id: 1,
                      bu_product_num: '300529A',
                    },
                    {
                      mpn: '17014X06',
                      sku: '1367585782036',
                      name: '14" x 6" Stamped Face Return Air Grille - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168752',
                      pim_id: '1367585782036',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 4,
                      list_name: 'Grilles',
                      product_id: '49741',
                      location_id: 1,
                      bu_product_num: '49741',
                    },
                    {
                      mpn: '17014X04',
                      sku: '1367585782285',
                      name: '14" x 4" Stamped Face Return Air Grille - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168751',
                      pim_id: '1367585782285',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 5,
                      list_name: 'Grilles',
                      product_id: '49740',
                      location_id: 1,
                      bu_product_num: '49740',
                    },
                    {
                      mpn: '190RF14X14',
                      sku: '1367585790111',
                      name: '14" x 14" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168781',
                      pim_id: '1367585790111',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 6,
                      list_name: 'Grilles',
                      product_id: '49764',
                      location_id: 1,
                      bu_product_num: '49764',
                    },
                    {
                      mpn: '17014X10',
                      sku: '1367585783304',
                      name: '14" x 10" Stamped Face Return Air Grille - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168755',
                      pim_id: '1367585783304',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 7,
                      list_name: 'Grilles',
                      product_id: '49743',
                      location_id: 1,
                      bu_product_num: '49743',
                    },
                    {
                      mpn: '210VM12X04',
                      sku: '1367585791531',
                      name: '12" x 4" Bar Type Supply Sidewall/Ceiling Register - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '240862',
                      pim_id: '1367585791531',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 8,
                      list_name: 'Grilles',
                      product_id: '49934',
                      location_id: 1,
                      bu_product_num: '49934',
                    },
                    {
                      mpn: '190RF20X25',
                      sku: '1367585788307',
                      name: '20" x 25" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168791',
                      pim_id: '1367585788307',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 9,
                      list_name: 'Grilles',
                      product_id: '49774',
                      location_id: 1,
                      bu_product_num: '49774',
                    },
                    {
                      mpn: '190RF20X14',
                      sku: '1367585789457',
                      name: '20" x 14" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168788',
                      pim_id: '1367585789457',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 10,
                      list_name: 'Grilles',
                      product_id: '49771',
                      location_id: 1,
                      bu_product_num: '49771',
                    },
                    {
                      mpn: '401M10X04',
                      sku: '1367585800344',
                      name: '10" x 4" Stamped Curved Blade Supply Sidewall/Ceiling Register',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '300734',
                      pim_id: '1367585800344',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 11,
                      list_name: 'Grilles',
                      product_id: '300734A',
                      location_id: 1,
                      bu_product_num: '300734A',
                    },
                    {
                      mpn: '190RF14X25',
                      sku: '1367585787467',
                      name: '14" x 25" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168783',
                      pim_id: '1367585787467',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 12,
                      list_name: 'Grilles',
                      product_id: '49766',
                      location_id: 1,
                      bu_product_num: '49766',
                    },
                    {
                      mpn: '17020X10',
                      sku: '1367585783058',
                      name: '20" x 10" Stamped Face Return Air Grille - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '219506',
                      pim_id: '1367585783058',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 13,
                      list_name: 'Grilles',
                      product_id: '49881',
                      location_id: 1,
                      bu_product_num: '49881',
                    },
                    {
                      mpn: '17020X08',
                      sku: '1367585783494',
                      name: '20" x 8" Stamped Face Return Air Grille - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '210374',
                      pim_id: '1367585783494',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 14,
                      list_name: 'Grilles',
                      product_id: '210374A',
                      location_id: 1,
                      bu_product_num: '210374A',
                    },
                    {
                      mpn: '190RF12X12',
                      sku: '1367585787042',
                      name: '12" x 12" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168777',
                      pim_id: '1367585787042',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 15,
                      list_name: 'Grilles',
                      product_id: '49761',
                      location_id: 1,
                      bu_product_num: '49761',
                    },
                    {
                      mpn: '210VM14X04',
                      sku: '1367585793228',
                      name: '14" x 4" Bar Type Supply Sidewall/Ceiling Register - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '232771',
                      pim_id: '1367585793228',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 16,
                      list_name: 'Grilles',
                      product_id: '49907',
                      location_id: 1,
                      bu_product_num: '49907',
                    },
                    {
                      mpn: '17014X144',
                      sku: '1367585783124',
                      name: '14" x 14" Stamped Face Return Air Grille - White - 4 Holes',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168757',
                      pim_id: '1367585783124',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 17,
                      list_name: 'Grilles',
                      product_id: '49744',
                      location_id: 1,
                      bu_product_num: '49744',
                    },
                    {
                      mpn: '190RF20X30',
                      sku: '1367585788366',
                      name: '20" x 30" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168792',
                      pim_id: '1367585788366',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 18,
                      list_name: 'Grilles',
                      product_id: '49775',
                      location_id: 1,
                      bu_product_num: '49775',
                    },
                    {
                      mpn: '190RF16X25',
                      sku: '1367585788996',
                      name: '16" x 25" Stamped Face Return Air Filter Grille with Removable Face - White',
                      brand: 'TRUaire',
                      price: 0,
                      erp_id: '168786',
                      pim_id: '1367585788996',
                      list_id: 1100000063100,
                      category: 'Grilles',
                      position: 19,
                      list_name: 'Grilles',
                      product_id: '49769',
                      location_id: 1,
                      bu_product_num: '49769',
                    },
                  ],
                  eventName: 'productListView',
                  eventType: 'view',
                  list_name: 'Grilles',
                  objectIds: [
                    '1367585787601',
                    '1367585788656',
                    '1367585790735',
                    '1367585782036',
                    '1367585782285',
                    '1367585790111',
                    '1367585783304',
                    '1367585791531',
                    '1367585788307',
                    '1367585789457',
                    '1367585800344',
                    '1367585787467',
                    '1367585783058',
                    '1367585783494',
                    '1367585787042',
                    '1367585793228',
                    '1367585783124',
                    '1367585788366',
                    '1367585788996',
                  ],
                  positions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                  userToken: 'anonymous',
                },
                receivedAt: '2023-06-19T22:22:32.431Z',
                request_ip: '104.205.211.60',
                anonymousId: '7b701174-5998-480e-a4df-b322d0ec9d1c',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2023-06-19T19:54:41.686Z',
              },
              destination: {
                secretConfig: {},
                Config: {
                  apiKey: 'apiKey',
                  applicationId: 'appId',
                  eventTypeSettings: [
                    {
                      from: 'productClicked',
                      to: 'click',
                    },
                    {
                      from: 'product list filtered',
                      to: 'click',
                    },
                    {
                      from: 'Product List Viewed',
                      to: 'view',
                    },
                    {
                      from: 'Order Completed',
                      to: 'conversion',
                    },
                    {
                      from: 'Product Added',
                      to: 'click',
                    },
                  ],
                  oneTrustCookieCategories: [],
                  eventDelivery: false,
                  eventDeliveryTS: 1687213909459,
                },
                liveEventsConfig: {
                  eventDelivery: false,
                  eventDeliveryTS: 1687213909459,
                },
                id: 'destId',
                workspaceId: 'wspId',
                DestinationDefinition: {
                  Config: {
                    destConfig: {
                      defaultConfig: [
                        'apiKey',
                        'applicationId',
                        'eventTypeSettings',
                        'oneTrustCookieCategories',
                      ],
                    },
                    secretKeys: ['apiKey', 'applicationId'],
                    excludeKeys: [],
                    includeKeys: ['oneTrustCookieCategories'],
                    transformAt: 'router',
                    cdkV2Enabled: true,
                    transformAtV1: 'router',
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                      'flutter',
                      'cordova',
                      'warehouse',
                    ],
                    supportedMessageTypes: ['track'],
                    saveDestinationResponse: true,
                  },
                  configSchema: {},
                  responseRules: {},
                  options: null,
                  id: '1xrHTzX8VrnvL6FTGOrBBgT687S',
                  name: 'ALGOLIA',
                  displayName: 'Algolia',
                  category: null,
                  createdAt: '2021-09-08T13:04:58.041Z',
                  updatedAt: '2023-06-13T13:18:08.335Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
                name: 'my_algolia',
                enabled: true,
                deleted: false,
                createdAt: '2023-05-26T14:18:01.205Z',
                updatedAt: '2023-06-19T22:31:49.460Z',
                revisionId: 'revisionId1',
                secretVersion: 7,
              },
              metadata: {
                sourceId: 'srcId',
                workspaceId: 'wspId',
                destinationId: 'destId',
                jobId: 12,
              },
            },
          ],
          destType: 'algolia',
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
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        eventName: 'product list viewed',
                        eventType: 'view',
                        index: 'ecm_stg_product',
                        objectIDs: [
                          '1367585787601',
                          '1367585788656',
                          '1367585790735',
                          '1367585782036',
                          '1367585782285',
                          '1367585790111',
                          '1367585783304',
                          '1367585791531',
                          '1367585788307',
                          '1367585789457',
                          '1367585800344',
                          '1367585787467',
                          '1367585783058',
                          '1367585783494',
                          '1367585787042',
                          '1367585793228',
                          '1367585783124',
                          '1367585788366',
                          '1367585788996',
                        ],
                        queryID: 'eafb6ef1081263626abce46671147dc0',
                        userToken: 'anonymous',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://insights.algolia.io/1/events',
                files: {},
                headers: {
                  'X-Algolia-API-Key': 'apiKey',
                  'X-Algolia-Application-Id': 'appId',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'apiKey',
                  applicationId: 'appId',
                  eventDelivery: false,
                  eventDeliveryTS: 1687213909459,
                  eventTypeSettings: [
                    {
                      from: 'productClicked',
                      to: 'click',
                    },
                    {
                      from: 'product list filtered',
                      to: 'click',
                    },
                    {
                      from: 'Product List Viewed',
                      to: 'view',
                    },
                    {
                      from: 'Order Completed',
                      to: 'conversion',
                    },
                    {
                      from: 'Product Added',
                      to: 'click',
                    },
                  ],
                  oneTrustCookieCategories: [],
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                    destConfig: {
                      defaultConfig: [
                        'apiKey',
                        'applicationId',
                        'eventTypeSettings',
                        'oneTrustCookieCategories',
                      ],
                    },
                    excludeKeys: [],
                    includeKeys: ['oneTrustCookieCategories'],
                    saveDestinationResponse: true,
                    secretKeys: ['apiKey', 'applicationId'],
                    supportedMessageTypes: ['track'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                      'flutter',
                      'cordova',
                      'warehouse',
                    ],
                    transformAt: 'router',
                    transformAtV1: 'router',
                  },
                  category: null,
                  configSchema: {},
                  createdAt: '2021-09-08T13:04:58.041Z',
                  displayName: 'Algolia',
                  id: '1xrHTzX8VrnvL6FTGOrBBgT687S',
                  name: 'ALGOLIA',
                  options: null,
                  responseRules: {},
                  updatedAt: '2023-06-13T13:18:08.335Z',
                },
                createdAt: '2023-05-26T14:18:01.205Z',
                deleted: false,
                enabled: true,
                id: 'destId',
                isConnectionEnabled: true,
                isProcessorEnabled: true,
                liveEventsConfig: {
                  eventDelivery: false,
                  eventDeliveryTS: 1687213909459,
                },
                name: 'my_algolia',
                revisionId: 'revisionId1',
                secretConfig: {},
                secretVersion: 7,
                transformations: [],
                updatedAt: '2023-06-19T22:31:49.460Z',
                workspaceId: 'wspId',
              },
              metadata: [
                {
                  sourceId: 'srcId',
                  workspaceId: 'wspId',
                  destinationId: 'destId',
                  jobId: 12,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
