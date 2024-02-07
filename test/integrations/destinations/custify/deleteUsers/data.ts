const destType = 'custify';

export const data = [
  {
    name: destType,
    description: 'Test 0: should fail when config is not being sent',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
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
    name: destType,
    description: 'Test 1: should fail when apiKey is not present in config',
    feature: 'userDeletion',
    module: 'destination',
    version: 'v0',
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
              apiToken: 'dummyApiKey',
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
];
