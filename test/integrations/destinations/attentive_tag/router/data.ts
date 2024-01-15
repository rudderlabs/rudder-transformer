import { getBatchedRequest } from '../../../testUtils';

const destination = { Config: { apiKey: 'dummyApiKey', signUpSourceId: '241654' } };

export const data = [
  {
    name: 'attentive_tag',
    description: 'Test 0', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: destination,
              metadata: { jobId: 1, userId: 'u1' },
              message: {
                context: {
                  traits: {
                    email: 'test0@gmail.com',
                    phone: '+16465453911',
                  },
                },
                integrations: {
                  All: true,
                  attentive_tag: { signUpSourceId: '241654', identifyOperation: 'unsubscribe' },
                },
                type: 'identify',
              },
            },
          ],
          destType: 'attentive_tag',
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
              batchedRequest: getBatchedRequest({
                endpoint: 'https://api.attentivemobile.com/v1/subscriptions/unsubscribe',
                headers: {
                  Authorization: 'Bearer dummyApiKey',
                  'Content-Type': 'application/json',
                },
                body: {
                  JSON: { user: { phone: '+16465453911', email: 'test0@gmail.com' } },
                },
              }),
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
];
