const data = [
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
                sentAt: '2021-09-08T11:10:45.466Z',
                userId: 'user12345',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.18',
                    namespace: 'com.rudderlabs.javascript',
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
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.18',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
                },
                rudderId: 'fa2994a5-2a81-45fd-9919-fcf5596ad380',
                messageId: 'e2d1a383-d9a2-4e03-a9dc-131d153c4d95',
                timestamp: '2021-11-15T14:06:42.497+05:30',
                properties: {
                  count: 10,
                  productId: 10,
                  productName: 'Product-10',
                },
                receivedAt: '2021-11-15T14:06:42.497+05:30',
                request_ip: '[::1]',
                anonymousId: 'd8b2ed61-7fa5-4ef8-bd92-6a506157c0cf',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-09-08T11:10:45.466Z',
              },
              metadata: {
                jobId: 1,
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
                Enabled: true,
                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
            {
              message: {
                type: 'track',
                event: 'insert product',
                sentAt: '2021-09-08T11:10:45.466Z',
                userId: 'user12345',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.18',
                    namespace: 'com.rudderlabs.javascript',
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
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.18',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
                },
                rudderId: 'fa2994a5-2a81-45fd-9919-fcf5596ad380',
                messageId: 'e2d1a383-d9a2-4e03-a9dc-131d153c4d95',
                timestamp: '2021-11-15T14:06:42.497+05:30',
                properties: {
                  count: 20,
                  productId: 20,
                  productName: 'Product-20',
                },
                receivedAt: '2021-11-15T14:06:42.497+05:30',
                request_ip: '[::1]',
                anonymousId: 'd8b2ed61-7fa5-4ef8-bd92-6a506157c0cf',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-09-08T11:10:45.466Z',
              },
              metadata: {
                jobId: 2,
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
                Enabled: true,
                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
          ],
          destType: 'bqstream',
        },
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                datasetId: 'gc_dataset',
                projectId: 'gc-project-id',
                properties: [
                  {
                    count: 10,
                    productId: 10,
                    productName: 'Product-10',
                    insertId: '10',
                  },
                  {
                    count: 20,
                    productId: 20,
                    productName: 'Product-20',
                    insertId: '20',
                  },
                ],
                tableId: 'gc_table',
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
                Config: {
                  rudderAccountId: '1z8LpaSAuFR9TPWL6fECZfjmRa-',
                  projectId: 'gc-project-id',
                  datasetId: 'gc_dataset',
                  tableId: 'gc_table',
                  insertId: 'productId',
                  eventDelivery: true,
                  eventDeliveryTS: 1636965406397,
                },
                Enabled: true,
                ID: '1WXjIHpu7ETXgjfiGPW3kCUgZFR',
                Name: 'bqstream test',
              },
            },
          ],
        },
      },
    },
  },
];

module.exports = {
  data,
};
