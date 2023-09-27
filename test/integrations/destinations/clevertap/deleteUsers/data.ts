export const data = [
  {
    name: 'clevertap',
    description: 'Test 0',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'CLEVERTAP',
            userAttributes: [
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
            ],
            config: {
              accountId: '476550467',
              trackAnonymous: true,
              enableObjectIdMapping: false,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 400,
        body: [
          {
            statusCode: 400,
            error: 'Project ID and Passcode is required for delete user',
          },
        ],
      },
    },
  },
  {
    name: 'clevertap',
    description: 'Test 1',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'CLEVERTAP',
            userAttributes: [
              {
                email: 'testUser@testMail.com',
              },
              {
                userId: 'user_sdk2',
              },
            ],
            config: {
              passcode: 'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
              trackAnonymous: true,
              enableObjectIdMapping: false,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 400,
        body: [
          {
            statusCode: 400,
            error: 'Project ID and Passcode is required for delete user',
          },
        ],
      },
    },
  },
  {
    name: 'clevertap',
    description: 'Test 2',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'CLEVERTAP',
            userAttributes: [
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
              {
                userId: 'test_user_id',
              },
              {
                userId: 'user_sdk2',
              },
            ],
            config: {
              accountId: 'testFail',
              passcode: 'tofail',
              trackAnonymous: true,
              enableObjectIdMapping: false,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 400,
        body: [
          {
            statusCode: 400,
            error: 'User deletion request failed',
          },
        ],
      },
    },
  },
];
