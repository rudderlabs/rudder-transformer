export const data = [
  {
    name: 'ga',
    description: 'Test 0',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        headers: {
          'x-rudder-dest-info': '{"secret": { "access_token": "valid_token" }}',
        },
        body: [
          {
            destType: 'GA',
            userAttributes: [
              {
                userId: 'test_user_1',
              },
              {
                userId: 'test_user_2',
              },
            ],
            config: {
              trackingID: 'UA-123456789-5',
              useNativeSDK: false,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 200,
            status: 'successful',
          },
        ],
      },
    },
  },
  {
    name: 'ga',
    description: 'Test 1',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        headers: {
          'x-rudder-dest-info': '{"secret": { "access_token": "expired_token" }}',
        },
        body: [
          {
            destType: 'GA',
            userAttributes: [
              {
                userId: 'test_user_3',
              },
              {
                userId: 'test_user_4',
              },
            ],
            config: {
              trackingID: 'UA-123456789-6',
              useNativeSDK: false,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 500,
        body: [
          {
            statusCode: 500,
            authErrorCategory: 'REFRESH_TOKEN',
            error: 'invalid credentials',
          },
        ],
      },
    },
  },
  {
    name: 'ga',
    description: 'Test 2',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        headers: {
          'x-rudder-dest-info': '{"secret": { "access_token": "valid_token_1" }}',
        },
        body: [
          {
            destType: 'GA',
            userAttributes: [
              {
                userId: 'test_user_5',
              },
              {
                userId: 'test_user_6',
              },
              {
                userId: 'test_user_7',
              },
              {
                userId: 'test_user_8',
              },
              {
                userId: 'test_user_9',
              },
            ],
            config: {
              trackingID: 'UA-123456789-7',
              useNativeSDK: false,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 403,
        body: [
          {
            statusCode: 403,
            error:
              'Error occurred while completing deletion request: [dummy response] The parameter used to query is not correct',
          },
        ],
      },
    },
  },
];
