import { authHeader1, secret1 } from '../maskedSecrets';
export const data = [
  {
    name: 'fb',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: { Config: { apiKey: secret1 }, ID: 'june123' },
              metadata: { jobId: 1, userId: 'u1' },
              message: {
                type: 'identify',
                sentAt: '2022-01-20T13:39:21.033Z',
                channel: 'web',
                userId: '5136633649',
                context: { traits: { name: 'John Doe', email: 'johndoe@gmail.com', age: 25 } },
                rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
                anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
                originalTimestamp: '2022-01-20T13:39:21.032Z',
              },
            },
            {
              destination: { Config: { apiKey: secret1 }, ID: 'june123' },
              metadata: { jobId: 2, userId: 'u1' },
              message: {
                type: 'track',
                event: 'Product Reviewed',
                properties: {
                  review_id: '12345',
                  product_id: '123',
                  rating: 3,
                  review_body: 'Average product, expected much more.',
                  groupId: '91Yb32830',
                },
                context: {},
                rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
                anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
                originalTimestamp: '2022-01-20T13:39:21.032Z',
              },
            },
          ],
          destType: 'june',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
                    timestamp: '2022-01-20T13:39:21.032Z',
                    traits: { age: 25, email: 'johndoe@gmail.com', name: 'John Doe' },
                    userId: '5136633649',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.june.so/api/identify',
                files: {},
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: { Config: { apiKey: secret1 }, ID: 'june123' },
              metadata: [{ jobId: 1, userId: 'u1' }],
              statusCode: 200,
            },
            {
              destination: { Config: { apiKey: secret1 }, ID: 'june123' },
              batched: false,
              error: 'Missing required value from "userIdOnly"',
              metadata: [{ jobId: 2, userId: 'u1' }],
              statTags: {
                destType: 'JUNE',
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
