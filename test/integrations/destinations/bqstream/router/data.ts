export const data = [
  {
    name: 'dicord',
    description: 'Discord batch events',
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
                event: 'insert product',
                userId: 'user12345',

                properties: {
                  count: 10,
                  productId: 10,
                  productName: 'Product-10',
                },
                anonymousId: 'd8b2ed61-7fa5-4ef8-bd92-6a506157c0cf',
              },
              metadata: {
                jobId: 1,
                userId: 'user12345',
              },
              destination: {
                Config: {
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  projectId: 'gc-project-id',
                  datasetId: 'gc_dataset',
                  tableId: 'gc_table',
                  insertId: 'productId',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                },

                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
            {
              message: {
                type: 'track',
                event: 'insert product',
                userId: 'user12345',
                properties: {
                  count: 20,
                  productId: 20,
                  productName: 'Product-20',
                },
              },
              metadata: {
                jobId: 2,
                userId: 'user12345',
              },
              destination: {
                Config: {
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  projectId: 'gc-project-id',
                  datasetId: 'gc_dataset',
                  tableId: 'gc_table',
                  insertId: 'productId',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                },

                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
            {
              message: {
                type: 'identify',
                event: 'insert product',
                userId: 'user12345',
                traits: {
                  count: 20,
                  productId: 20,
                  productName: 'Product-20',
                },
                anonymousId: 'd8b2ed61-7fa5-4ef8-bd92-6a506157c0cf',
              },
              metadata: {
                jobId: 3,
                userId: 'user12345',
              },
              destination: {
                Config: {
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  projectId: 'gc-project-id',
                  datasetId: 'gc_dataset',
                  tableId: 'gc_table',
                  insertId: 'productId',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                },

                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
            {
              message: {
                type: 'track',
                event: 'insert product',
                userId: 'user12345',
                properties: {
                  count: 20,
                  productId: 20,
                  productName: 'Product-20',
                },
                anonymousId: 'd8b2ed61-7fa5-4ef8-bd92-6a506157c0cf',
              },
              metadata: {
                jobId: 5,
                userId: 'user123',
              },
              destination: {
                Config: {
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  projectId: 'gc-project-id',
                  datasetId: 'gc_dataset',
                  tableId: 'gc_table',
                  insertId: 'productId',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                },

                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
            {
              message: {
                type: 'track',
                event: 'insert product',
                userId: 'user12345',
                properties: {
                  count: 20,
                  productId: 20,
                  productName: 'Product-20',
                },
                anonymousId: 'd8b2ed61-7fa5-4ef8-bd92-6a506157c0cf',
              },
              metadata: {
                jobId: 6,
                userId: 'user124',
              },
              destination: {
                Config: {
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  projectId: 'gc-project-id',
                  datasetId: 'gc_dataset',
                  tableId: 'gc_table',
                  insertId: 'productId',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                },

                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
            {
              message: {
                type: 'track',
                event: 'insert product',

                userId: 'user12345',
              },
              metadata: {
                jobId: 7,
                userId: 'user124',
              },
              destination: {
                Config: {
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  projectId: 'gc-project-id',
                  datasetId: 'gc_dataset',
                  tableId: 'gc_table',
                  insertId: 'productId',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                },

                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
            {
              message: {
                type: 'track',
                event: 'insert product',
                userId: 'user12345',
              },
              metadata: {
                jobId: 8,
                userId: 'user125',
              },
              destination: {
                Config: {
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  projectId: 'gc-project-id',
                  datasetId: 'gc_dataset',
                  tableId: 'gc_table',
                  insertId: 'productId',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                },

                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
            {
              message: {
                type: 'identify',
                event: 'insert product',

                userId: 'user12345',

                context: {
                  os: {
                    Name: '',
                    version: '',
                  },
                  app: {
                    Name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.18',
                    Namespace: 'com.rudderlabs.javascript',
                  },
                  page: {
                    url: 'http://127.0.0.1:5500/index.html',
                    path: '/index.html',
                    title: 'Document',
                    search: '',
                    tab_url: 'http://127.0.0.1:5500/index.html',
                    referrer: '$direct',
                    initial_referrer: '$direct',
                    referring_domain: '',
                    initial_referring_domain: '',
                  },
                  locale: 'en-GB',
                  screen: {
                    width: 1536,
                    height: 960,
                    density: 2,
                    innerWidth: 1536,
                    innerHeight: 776,
                  },
                  traits: {},
                  library: {
                    Name: 'RudderLabs JavaScript SDK',
                    version: '1.1.18',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
                },

                traits: {
                  count: 20,
                  productId: 20,
                  productName: 'Product-20',
                },
                receivedAt: '2021-11-15T14:06:42.497+05:30',
                anonymousId: 'd8b2ed61-7fa5-4ef8-bd92-6a506157c0cf',
              },
              metadata: {
                jobId: 9,
                userId: 'user125',
              },
              destination: {
                Config: {
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  projectId: 'gc-project-id',
                  datasetId: 'gc_dataset',
                  tableId: 'gc_table',
                  insertId: 'productId',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                },

                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
          ],
          destType: 'bqstream',
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
                datasetId: 'gc_dataset',
                projectId: 'gc-project-id',
                properties: [
                  {
                    count: 10,
                    insertId: '10',
                    productId: 10,
                    productName: 'Product-10',
                  },
                  {
                    count: 20,
                    insertId: '20',
                    productId: 20,
                    productName: 'Product-20',
                  },
                  {
                    count: 20,
                    insertId: '20',
                    productId: 20,
                    productName: 'Product-20',
                  },
                  {
                    count: 20,
                    insertId: '20',
                    productId: 20,
                    productName: 'Product-20',
                  },
                ],
                tableId: 'gc_table',
              },
              destination: {
                Config: {
                  datasetId: 'gc_dataset',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                  insertId: 'productId',
                  projectId: 'gc-project-id',
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  tableId: 'gc_table',
                },
                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
              metadata: [
                {
                  jobId: 1,
                  userId: 'user12345',
                },
                {
                  jobId: 2,
                  userId: 'user12345',
                },
                {
                  jobId: 5,
                  userId: 'user123',
                },
                {
                  jobId: 6,
                  userId: 'user124',
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              destination: {
                Config: {
                  datasetId: 'gc_dataset',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                  insertId: 'productId',
                  projectId: 'gc-project-id',
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  tableId: 'gc_table',
                },
                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
              error: 'Invalid payload for the destination',
              metadata: [
                {
                  jobId: 7,
                  userId: 'user124',
                },
                {
                  jobId: 8,
                  userId: 'user125',
                },
              ],
              statTags: {
                destType: 'BQSTREAM',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
            },
            {
              batched: false,
              destination: {
                Config: {
                  datasetId: 'gc_dataset',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                  insertId: 'productId',
                  projectId: 'gc-project-id',
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  tableId: 'gc_table',
                },
                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },

              error: 'Message Type not supported: identify',
              metadata: [
                {
                  jobId: 3,
                  userId: 'user12345',
                },
                {
                  jobId: 9,
                  userId: 'user125',
                },
              ],
              statTags: {
                destType: 'BQSTREAM',
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
];
