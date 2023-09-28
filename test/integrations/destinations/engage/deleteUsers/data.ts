export const data = [
  {
    name: 'engage',
    description: 'Test 0',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'ENGAGE',
            userAttributes: [
              {
                userId: '1',
              },
              {
                userId: '2',
              },
              {
                userId: '3',
              },
            ],
            config: {
              publicKey: 'abcd',
              privateKey: 'efgh',
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
  {
    name: 'engage',
    description: 'Test 1',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'ENGAGE',
            userAttributes: [
              {
                userId: '4',
              },
              {
                userId: '5',
              },
              {
                userId: '6',
              },
            ],
            config: {
              publicKey: 'abcd',
              privateKey: 'efgh',
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
  {
    name: 'engage',
    description: 'Test 2',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'ENGAGE',
            userAttributes: [
              {
                userId: '7',
              },
              {
                userId: '8',
              },
              {
                userId: '9',
              },
            ],
            config: {
              publicKey: 'abcd',
              privateKey: 'efgh',
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
  {
    name: 'engage',
    description: 'Test 3',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'ENGAGE',
            userAttributes: [
              {
                userId: '12',
              },
            ],
            config: {
              publicKey: 'abcd',
              privateKey: 'efgh',
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
    name: 'engage',
    description: 'Test 4',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'ENGAGE',
            userAttributes: [
              {
                userId: 'userid1',
              },
              {
                userId: 'user_sdk2',
              },
            ],
            config: {
              privateKey: 'abcd',
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
            error: 'Public key is a required field for user deletion',
          },
        ],
      },
    },
  },
  {
    name: 'engage',
    description: 'Test 5',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'ENGAGE',
            userAttributes: [
              {
                email: 'testUser@testMail.com',
              },
              {
                userId: 'user_sdk2',
              },
            ],
            config: {
              publicKey: 'abcd',
              privateKey: 'efgh',
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
];
