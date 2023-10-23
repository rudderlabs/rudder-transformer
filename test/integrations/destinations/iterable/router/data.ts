export const data = [
  {
    name: 'iterable',
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
                receivedAt: '2022-09-27T11:12:59.080Z',
                sentAt: '2022-09-27T11:13:03.777Z',
                messageId: '9ad41366-8060-4c9f-b181-f6bea67d5469',
                originalTimestamp: '2022-09-27T11:13:03.777Z',
                traits: {
                  ruchira: 'donaldbaker@ellis.com',
                  new_field2: 'GB',
                },
                channel: 'sources',
                rudderId: '3d51640c-ab09-42c1-b7b2-db6ab433b35e',
                context: {
                  sources: {
                    version: 'feat.SupportForTrack',
                    job_run_id: 'ccpdlajh6cfi19mr1vs0',
                    task_run_id: 'ccpdlajh6cfi19mr1vsg',
                    batch_id: '4917ad78-280b-40d2-a30d-119434152a0f',
                    job_id: '2FLKJDcTdjPHQpq7pUjB34dQ5w6/Syncher',
                    task_id: 'rows_100',
                  },
                  mappedToDestination: 'true',
                  externalId: [
                    {
                      id: 'Tiffany',
                      type: 'ITERABLE-test-ruchira',
                      identifierType: 'itemId',
                    },
                  ],
                },
                timestamp: '2022-09-27T11:12:59.079Z',
                type: 'identify',
                userId: 'Tiffany',
                recordId: '10',
                request_ip: '10.1.86.248',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  apiKey: '583af2f8-15ba-49c0-8511-76383e7de07e',
                  hubID: '22066036',
                },
                Enabled: true,
              },
            },
            {
              message: {
                receivedAt: '2022-09-27T11:12:59.080Z',
                sentAt: '2022-09-27T11:13:03.777Z',
                messageId: '9ad41366-8060-4c9f-b181-f6bea67d5469',
                originalTimestamp: '2022-09-27T11:13:03.777Z',
                traits: {
                  ruchira: 'abc@ellis.com',
                  new_field2: 'GB1',
                },
                channel: 'sources',
                rudderId: '3d51640c-ab09-42c1-b7b2-db6ab433b35e',
                context: {
                  sources: {
                    version: 'feat.SupportForTrack',
                    job_run_id: 'ccpdlajh6cfi19mr1vs0',
                    task_run_id: 'ccpdlajh6cfi19mr1vsg',
                    batch_id: '4917ad78-280b-40d2-a30d-119434152a0f',
                    job_id: '2FLKJDcTdjPHQpq7pUjB34dQ5w6/Syncher',
                    task_id: 'rows_100',
                  },
                  mappedToDestination: 'true',
                  externalId: [
                    {
                      id: 'ABC',
                      type: 'ITERABLE-test-ruchira',
                      identifierType: 'itemId',
                    },
                  ],
                },
                timestamp: '2022-09-27T11:12:59.079Z',
                type: 'identify',
                userId: 'Tiffany',
                recordId: '10',
                request_ip: '10.1.86.248',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  apiKey: '583af2f8-15ba-49c0-8511-76383e7de07e',
                  hubID: '22066036',
                },
                Enabled: true,
              },
            },
          ],
          destType: 'iterable',
        },
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
                endpoint: 'https://api.iterable.com/api/catalogs/test-ruchira/items',
                headers: {
                  'Content-Type': 'application/json',
                  api_key: '583af2f8-15ba-49c0-8511-76383e7de07e',
                },
                params: {},
                body: {
                  JSON: {
                    documents: {
                      Tiffany: {
                        ruchira: 'donaldbaker@ellis.com',
                        new_field2: 'GB',
                      },
                      ABC: {
                        ruchira: 'abc@ellis.com',
                        new_field2: 'GB1',
                      },
                    },
                    replaceUploadedFieldsOnly: true,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 2,
                },
                {
                  jobId: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: '583af2f8-15ba-49c0-8511-76383e7de07e',
                  hubID: '22066036',
                },
                Enabled: true,
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'iterable',
    description: 'routerTest 1',
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
                event: 'Email Opened',
                sentAt: '2020-08-28T16:26:16.473Z',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                _metadata: {
                  nodeVersion: '10.22.0',
                },
                messageId:
                  'node-570110489d3e99b234b18af9a9eca9d4-6009779e-82d7-469d-aaeb-5ccf162b0453',
                properties: {
                  subject: 'resume validate',
                  sendtime: '2020-01-01',
                  sendlocation: 'akashdeep@gmail.com',
                },
                anonymousId: 'abcdeeeeeeeexxxx102',
                originalTimestamp: '2020-08-28T16:26:06.468Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                  mapToSingleEvent: false,
                  trackAllPages: true,
                  trackCategorisedPages: false,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
            {
              message: {
                type: 'identify',
                event: 'Details',
                sentAt: '2020-08-28T16:26:06.466Z',
                traits: {
                  city: 'Bangalore',
                  name: 'manashi',
                  email: 'manashi@website.com',
                  country: 'India',
                },
                context: {
                  traits: {
                    city: 'Bangalore',
                    name: 'manashi',
                    email: 'manashi@website.com',
                    country: 'India',
                  },
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                _metadata: {
                  nodeVersion: '10.22.0',
                },
                messageId:
                  'node-cc3ef811f686139ee527b806ee0129ef-163a3a88-266f-447e-8cce-34a8f42f8dcd',
                anonymousId: 'abcdeeeeeeeexxxx102',
                originalTimestamp: '2020-08-28T16:26:06.462Z',
              },
              metadata: {
                jobId: 3,
              },
              destination: {
                Config: {
                  apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                  mapToSingleEvent: false,
                  trackAllPages: true,
                  trackCategorisedPages: false,
                  trackNamedPages: false,
                },
                Enabled: true,
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
                    email: 'sayan@gmail.com',
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
                  path: '/abc',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                  category: 'test-category',
                },
                integrations: {
                  All: true,
                },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                jobId: 4,
              },
              destination: {
                Config: {
                  apiKey: '12345',
                  mapToSingleEvent: false,
                  trackAllPages: false,
                  trackCategorisedPages: true,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
            {
              message: {
                channel: 'sources',
                context: {
                  externalId: [
                    {
                      id: 'lynnanderson@smith.net',
                      identifierType: 'email',
                      type: 'ITERABLE-users',
                    },
                  ],
                  mappedToDestination: 'true',
                  sources: {
                    batch_id: 'f5f240d0-0acb-46e0-b043-57fb0aabbadd',
                    job_id: '1zAj94bEy8komdqnYtSoDp0VmGs/Syncher',
                    job_run_id: 'c5tar6cqgmgmcjvupdhg',
                    task_id: 'tt_10_rows_check',
                    task_run_id: 'c5tar6cqgmgmcjvupdi0',
                    version: 'release.v1.6.8',
                  },
                  device: {
                    token: 54321,
                  },
                },
                messageId: '2f052f7c-f694-4849-a7ed-a432f7ffa0a4',
                originalTimestamp: '2021-10-28T14:03:50.503Z',
                receivedAt: '2021-10-28T14:03:46.567Z',
                recordId: '8',
                request_ip: '10.1.94.92',
                rudderId: 'c0f6843e-e3d6-4946-9752-fa339fbadef2',
                sentAt: '2021-10-28T14:03:50.503Z',
                timestamp: '2021-10-28T14:03:46.566Z',
                traits: {
                  administrative_unit: 'Minnesota',
                  am_pm: 'AM',
                  boolean: true,
                  firstname: 'Jacqueline',
                  pPower: 'AM',
                  userId: 'Jacqueline',
                },
                type: 'identify',
                userId: 'lynnanderson@smith.net',
              },
              metadata: {
                jobId: 5,
              },
              destination: {
                ID: '1zia9wKshXt80YksLmUdJnr7IHI',
                Name: 'test_iterable',
                DestinationDefinition: {
                  ID: '1iVQvTRMsPPyJzwol0ifH93QTQ6',
                  Name: 'ITERABLE',
                  DisplayName: 'Iterable',
                  Config: {
                    destConfig: {
                      defaultConfig: [
                        'apiKey',
                        'mapToSingleEvent',
                        'trackAllPages',
                        'trackCategorisedPages',
                        'trackNamedPages',
                      ],
                    },
                    excludeKeys: [],
                    includeKeys: [],
                    saveDestinationResponse: true,
                    secretKeys: [],
                    supportedMessageTypes: ['identify', 'page', 'screen', 'track'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'warehouse',
                      'reactnative',
                      'flutter',
                      'cordova',
                    ],
                    supportsVisualMapper: true,
                    transformAt: 'processor',
                    transformAtV1: 'processor',
                  },
                  ResponseRules: null,
                },
                Config: {
                  apiKey: '12345',
                  mapToSingleEvent: true,
                  trackAllPages: false,
                  trackCategorisedPages: true,
                  trackNamedPages: true,
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: true,
              },
              libraries: [],
              request: {
                query: {},
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
                    email: 'sayan@gmail.com',
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
                event: 'product added',
                type: 'track',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  campaignId: '1',
                  templateId: '0',
                  orderId: 10000,
                  total: 1000,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      price: '19',
                      position: '1',
                      category: 'cars',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                      quantity: '2',
                    },
                    {
                      product_id: '507f1f77bcf86cd7994390112',
                      sku: '45790-322',
                      name: 'Monopoly: 3rd Edition2',
                      price: '192',
                      quantity: 22,
                      position: '12',
                      category: 'Cars2',
                      url: 'https://www.example.com/product/path2',
                      image_url: 'https://www.example.com/product/path.jpg2',
                    },
                  ],
                },
                integrations: {
                  All: true,
                },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                jobId: 6,
              },
              destination: {
                Config: {
                  apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                  mapToSingleEvent: false,
                  trackAllPages: true,
                  trackCategorisedPages: false,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
            {
              message: {
                type: 'page',
                sentAt: '2020-08-28T16:26:16.473Z',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                _metadata: {
                  nodeVersion: '10.22.0',
                },
                messageId:
                  'node-6f62b91e789a636929ca38aed01c5f6e-103c720d-81bd-4742-98d6-d45a65aed23e',
                properties: {
                  url: 'https://dominos.com',
                  title: 'Pizza',
                  referrer: 'https://google.com',
                },
                anonymousId: 'abcdeeeeeeeexxxx102',
                originalTimestamp: '2020-08-28T16:26:06.468Z',
              },
              metadata: {
                jobId: 7,
              },
              destination: {
                Config: {
                  apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                  mapToSingleEvent: false,
                  trackAllPages: true,
                  trackCategorisedPages: false,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
            {
              message: {
                type: 'alias',
                sentAt: '2020-08-28T16:26:16.473Z',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                _metadata: {
                  nodeVersion: '10.22.0',
                },
                messageId:
                  'node-6f62b91e789a636929ca38aed01c5f6e-103c720d-81bd-4742-98d6-d45a65aed23e',
                properties: {
                  url: 'https://dominos.com',
                  title: 'Pizza',
                  referrer: 'https://google.com',
                },
                userId: 'new@email.com',
                previousId: 'old@email.com',
                anonymousId: 'abcdeeeeeeeexxxx102',
                originalTimestamp: '2020-08-28T16:26:06.468Z',
              },
              metadata: {
                jobId: 8,
              },
              destination: {
                Config: {
                  apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                  mapToSingleEvent: false,
                  trackAllPages: false,
                  trackCategorisedPages: true,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
          ],
          destType: 'iterable',
        },
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
                endpoint: 'https://api.iterable.com/api/events/trackBulk',
                headers: {
                  'Content-Type': 'application/json',
                  api_key: '62d12498c37c4fd8a1a546c2d35c2f60',
                },
                params: {},
                body: {
                  JSON: {
                    events: [
                      {
                        dataFields: {
                          subject: 'resume validate',
                          sendtime: '2020-01-01',
                          sendlocation: 'akashdeep@gmail.com',
                        },
                        userId: 'abcdeeeeeeeexxxx102',
                        eventName: 'Email Opened',
                        createdAt: 1598631966468,
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
                  jobId: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                  mapToSingleEvent: false,
                  trackAllPages: true,
                  trackCategorisedPages: false,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.iterable.com/api/users/bulkUpdate',
                headers: {
                  'Content-Type': 'application/json',
                  api_key: '62d12498c37c4fd8a1a546c2d35c2f60',
                },
                params: {},
                body: {
                  JSON: {
                    users: [
                      {
                        email: 'manashi@website.com',
                        dataFields: {
                          city: 'Bangalore',
                          name: 'manashi',
                          email: 'manashi@website.com',
                          country: 'India',
                        },
                        userId: 'abcdeeeeeeeexxxx102',
                        preferUserId: true,
                        mergeNestedObjects: true,
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
                  jobId: 3,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                  mapToSingleEvent: false,
                  trackAllPages: true,
                  trackCategorisedPages: false,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.iterable.com/api/events/trackBulk',
                headers: {
                  'Content-Type': 'application/json',
                  api_key: '12345',
                },
                params: {},
                body: {
                  JSON: {
                    events: [
                      {
                        email: 'sayan@gmail.com',
                        dataFields: {
                          path: '/abc',
                          referrer: '',
                          search: '',
                          title: '',
                          url: '',
                          category: 'test-category',
                        },
                        userId: '12345',
                        eventName: 'ApplicationLoaded page',
                        createdAt: 1571051718299,
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
                  jobId: 4,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: '12345',
                  mapToSingleEvent: false,
                  trackAllPages: false,
                  trackCategorisedPages: true,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.iterable.com/api/commerce/updateCart',
                headers: {
                  'Content-Type': 'application/json',
                  api_key: '62d12498c37c4fd8a1a546c2d35c2f60',
                },
                params: {},
                body: {
                  JSON: {
                    user: {
                      email: 'sayan@gmail.com',
                      dataFields: {
                        email: 'sayan@gmail.com',
                      },
                      userId: '12345',
                      preferUserId: true,
                      mergeNestedObjects: true,
                    },
                    items: [
                      {
                        id: '507f1f77bcf86cd799439011',
                        sku: '45790-32',
                        name: 'Monopoly: 3rd Edition',
                        categories: ['cars'],
                        price: 19,
                        quantity: 2,
                        imageUrl: 'https://www.example.com/product/path.jpg',
                        url: 'https://www.example.com/product/path',
                      },
                      {
                        id: '507f1f77bcf86cd7994390112',
                        sku: '45790-322',
                        name: 'Monopoly: 3rd Edition2',
                        categories: ['Cars2'],
                        price: 192,
                        quantity: 22,
                        imageUrl: 'https://www.example.com/product/path.jpg2',
                        url: 'https://www.example.com/product/path2',
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
                  jobId: 6,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                  mapToSingleEvent: false,
                  trackAllPages: true,
                  trackCategorisedPages: false,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.iterable.com/api/events/trackBulk',
                headers: {
                  'Content-Type': 'application/json',
                  api_key: '62d12498c37c4fd8a1a546c2d35c2f60',
                },
                params: {},
                body: {
                  JSON: {
                    events: [
                      {
                        dataFields: {
                          url: 'https://dominos.com',
                          title: 'Pizza',
                          referrer: 'https://google.com',
                        },
                        userId: 'abcdeeeeeeeexxxx102',
                        createdAt: 1598631966468,
                        eventName: 'undefined page',
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
                  jobId: 7,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                  mapToSingleEvent: false,
                  trackAllPages: true,
                  trackCategorisedPages: false,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.iterable.com/api/users/updateEmail',
                headers: {
                  'Content-Type': 'application/json',
                  api_key: '62d12498c37c4fd8a1a546c2d35c2f60',
                },
                params: {},
                body: {
                  JSON: {
                    currentEmail: 'old@email.com',
                    newEmail: 'new@email.com',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 8,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: '62d12498c37c4fd8a1a546c2d35c2f60',
                  mapToSingleEvent: false,
                  trackAllPages: false,
                  trackCategorisedPages: true,
                  trackNamedPages: false,
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.iterable.com/api/users/bulkUpdate',
                headers: {
                  'Content-Type': 'application/json',
                  api_key: '12345',
                },
                params: {},
                body: {
                  JSON: {
                    users: [
                      {
                        email: 'lynnanderson@smith.net',
                        dataFields: {
                          administrative_unit: 'Minnesota',
                          am_pm: 'AM',
                          boolean: true,
                          firstname: 'Jacqueline',
                          pPower: 'AM',
                          userId: 'Jacqueline',
                          email: 'lynnanderson@smith.net',
                        },
                        userId: 'lynnanderson@smith.net',
                        preferUserId: true,
                        mergeNestedObjects: true,
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
                  jobId: 5,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '1zia9wKshXt80YksLmUdJnr7IHI',
                Name: 'test_iterable',
                DestinationDefinition: {
                  ID: '1iVQvTRMsPPyJzwol0ifH93QTQ6',
                  Name: 'ITERABLE',
                  DisplayName: 'Iterable',
                  Config: {
                    destConfig: {
                      defaultConfig: [
                        'apiKey',
                        'mapToSingleEvent',
                        'trackAllPages',
                        'trackCategorisedPages',
                        'trackNamedPages',
                      ],
                    },
                    excludeKeys: [],
                    includeKeys: [],
                    saveDestinationResponse: true,
                    secretKeys: [],
                    supportedMessageTypes: ['identify', 'page', 'screen', 'track'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'warehouse',
                      'reactnative',
                      'flutter',
                      'cordova',
                    ],
                    supportsVisualMapper: true,
                    transformAt: 'processor',
                    transformAtV1: 'processor',
                  },
                  ResponseRules: null,
                },
                Config: {
                  apiKey: '12345',
                  mapToSingleEvent: true,
                  trackAllPages: false,
                  trackCategorisedPages: true,
                  trackNamedPages: true,
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
];
