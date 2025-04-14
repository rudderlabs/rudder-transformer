import { secret1 } from '../maskedSecrets';
const destType = 'custify';
const commonData = {
  name: destType,
  feature: 'userDeletion',
  module: 'destination',
  version: 'v0',
};

export const data = [
  {
    description: 'Test 0: should fail when config is not being sent',
    input: {
      request: {
        body: [
          {
            destType: destType.toUpperCase(),
            userAttributes: [
              {
                userId: 'rudder1',
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
    description: 'Test 1: should fail when apiKey is not present in config',
    input: {
      request: {
        body: [
          {
            destType: destType.toUpperCase(),
            userAttributes: [
              {
                userId: 'rudder2',
              },
            ],
            config: {
              apiToken: secret1,
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
            error: 'api key for deletion not present',
          },
        ],
      },
    },
  },

  {
    description: 'Test 2: should pass when one of the users is not present in destination',
    input: {
      request: {
        body: [
          {
            destType: destType.toUpperCase(),
            userAttributes: [
              {
                userId: 'rudder1',
              },
              {
                userId: 'rudder2',
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
        body: [{ statusCode: 200, status: 'successful' }],
      },
    },
  },

  {
    description:
      'Test 3: should fail when one of the users is returning with 4xx(not 404) from destination',
    input: {
      request: {
        body: [
          {
            destType: destType.toUpperCase(),
            userAttributes: [
              {
                userId: 'rudder1',
              },
              {
                userId: 'rudder3',
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
          { statusCode: 400, error: JSON.stringify({ error: 'User: rudder3 has a problem' }) },
        ],
      },
    },
  },

  {
    description: 'Test 4: should fail when one of the userAttributes does not contain `userId`',
    input: {
      request: {
        body: [
          {
            destType: destType.toUpperCase(),
            userAttributes: [
              {
                userId: 'rudder1',
              },
              {},
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
        body: [{ statusCode: 400, error: 'User id for deletion not present' }],
      },
    },
  },
].map((props) => ({ ...commonData, ...props }));
