import { authHeader1, secret1 } from '../maskedSecrets';
export const data = [
  {
    name: 'drip',
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
                  apiKey: secret1,
                  accountId: '1809802',
                  campaignId: '',
                  enableUserCreation: true,
                },
              },
              metadata: { jobId: 1, userId: 'u1' },
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                type: 'identify',
                traits: {
                  email: 'test1@gmail.com',
                  firstName: 'James',
                  lastName: 'Doe',
                  phone: '237416221',
                  customFields: { filter1: 'filterval1' },
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
            {
              destination: {
                Config: {
                  apiKey: secret1,
                  accountId: '1809802',
                  campaignId: '915194776',
                  enableUserCreation: true,
                },
              },
              metadata: { jobId: 2, userId: 'u1' },
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                type: 'track',
                event: 'testing',
                properties: { email: 'user1@gmail.com', customFields: { field1: 'val1' } },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
          ],
          destType: 'drip',
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
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    subscribers: [
                      {
                        email: 'test1@gmail.com',
                        first_name: 'James',
                        last_name: 'Doe',
                        phone: '237416221',
                        ip_address: '0.0.0.0',
                        custom_fields: { filter1: 'filterval1' },
                      },
                    ],
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api.getdrip.com/v2/1809802/subscribers',
              },
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: secret1,
                  accountId: '1809802',
                  campaignId: '',
                  enableUserCreation: true,
                },
              },
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        email: 'user1@gmail.com',
                        properties: { field1: 'val1' },
                        action: 'testing',
                        occurred_at: '2019-10-14T09:03:17.562Z',
                      },
                    ],
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api.getdrip.com/v2/1809802/events',
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: secret1,
                  accountId: '1809802',
                  campaignId: '915194776',
                  enableUserCreation: true,
                },
              },
            },
          ],
        },
      },
    },
  },
];
