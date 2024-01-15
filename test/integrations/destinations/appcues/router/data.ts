import { getBatchedRequest } from '../../../testUtils';

const destination = { Config: { accountId: '86086', useNativeSDK: false } };

export const data = [
  {
    name: 'appcues',
    description: 'Test 0', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                context: {
                  traits: {},
                },
                messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
                type: 'identify',
                userId: 'onlyUserId',
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination: destination,
            },
            {
              message: {
                context: {
                  traits: { 'first name': 'John', 'last name': 'Abraham' },
                },
                messageId: '57494c6a-3c62-4b30-83aa-6e821d37ac75',
                type: 'identify',
                userId: 'userIdWithProperties',
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: destination,
            },
          ],
          destType: 'appcues',
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
                body: {
                  JSON: { request_id: '6a5f38c0-4e75-4268-a066-2b73fbcad01f', profile_update: {} },
                },
                headers: { 'Content-Type': 'application/json' },
                endpoint: 'https://api.appcues.com/v1/accounts/86086/users/onlyUserId/activity',
              }),
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
            {
              batchedRequest: getBatchedRequest({
                body: {
                  JSON: {
                    request_id: '57494c6a-3c62-4b30-83aa-6e821d37ac75',
                    profile_update: { 'last name': 'Abraham', 'first name': 'John' },
                  },
                },
                headers: { 'Content-Type': 'application/json' },
                endpoint:
                  'https://api.appcues.com/v1/accounts/86086/users/userIdWithProperties/activity',
              }),
              metadata: [{ jobId: 2, userId: 'u1' }],
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
