export const data = [
  {
    name: 'sprig',
    description: 'Missing api key',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'SPRIG',
            userAttributes: [
              {
                userId: '1',
              },
              {
                userId: '2',
              },
            ],
            config: {
              apiKey: undefined,
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
            error: 'Api Key is required for user deletion',
          },
        ],
      },
    },
  },
  {
    name: 'sprig',
    description: 'Invalid api key',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'SPRIG',
            userAttributes: [
              {
                userId: '1',
              },
              {
                userId: '2',
              },
            ],
            config: {
              apiKey: 'invalidApiKey',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 401,
        body: [
          {
            statusCode: 401,
            error: 'User deletion request failed',
          },
        ],
      },
    },
  },
  {
    name: 'sprig',
    description: 'Given userId is not present for user deletion',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'SPRIG',
            userAttributes: [
              {
                userId: '9',
              },
            ],
            config: {
              apiKey: 'testApiKey',
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
    name: 'sprig',
    description: 'Successful user deletion',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'SPRIG',
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
              apiKey: 'testApiKey',
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
