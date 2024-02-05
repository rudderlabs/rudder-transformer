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
        status: 403,
        body: [
          {
            statusCode: 403,
            error: 'User deletion request failed',
          },
        ],
      },
    },
  },
  {
    name: 'sprig',
    description: 'Too many requests',
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
              {
                userId: '4',
              },
              {
                userId: '5',
              },
              {
                userId: '6',
              },
              {
                userId: '7',
              },
              {
                userId: '8',
              },
              {
                userId: '9',
              },
              {
                userId: '10',
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
        status: 429,
        body: [
          {
            statusCode: 429,
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
        status: 200,
        body: [
          {
            statusCode: 200,
            status: 'successful',
          },
          ,
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
