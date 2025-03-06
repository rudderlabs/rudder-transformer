import { secretApiKey } from '../maskedSecrets';

export const data = [
  {
    name: 'profitwell',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: { Config: { privateApiKey: secretApiKey } },
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
                type: 'identify',
                userId: 'samual',
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
          ],
          destType: 'profitwell',
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
                body: {
                  XML: {},
                  FORM: {},
                  JSON: {
                    subscription_alias: 'samual',
                    email: 'sample@sample.com',
                    plan_id: '23',
                    plan_interval: 'month',
                    plan_currency: 'usd',
                    status: 'active',
                    value: '23',
                    user_alias: 'samual',
                    effective_date: 1571043797,
                  },
                  JSON_ARRAY: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: secretApiKey,
                },
                version: '1',
                endpoint: 'https://api.profitwell.com/v2/subscriptions/',
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: { Config: { privateApiKey: secretApiKey } },
            },
          ],
        },
      },
    },
  },
];
