import { secret1 } from '../maskedSecrets';
export const data = [
  {
    name: 'intercom',
    description: 'Test 0',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'INTERCOM',
            userAttributes: [
              {
                userId: '1',
              },
              {
                userId: '12',
              },
            ],
            config: {
              apiKey: secret1,
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
    name: 'intercom',
    description: 'Test 1',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'INTERCOM',
            userAttributes: [
              {
                userId: '7',
              },
              {
                userId: '9',
              },
            ],
            config: {
              apiKey: secret1,
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
    name: 'intercom',
    description: 'Test 2',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'INTERCOM',
            userAttributes: [
              {
                userId: '6188c2c5f47e464b4abf3235',
              },
              {
                userId: 'user_sdk2',
              },
            ],
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
            error: 'Config for deletion not present',
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 3',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'INTERCOM',
            userAttributes: [
              {
                userId: '6188c2c5f47e464b4abf3235',
              },
              {
                userId: 'user_sdk2',
              },
            ],
            config: {},
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
            error: 'The access token is not available',
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 4',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'INTERCOM',
            userAttributes: [{}],
            config: {
              apiKey: 'a=',
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
