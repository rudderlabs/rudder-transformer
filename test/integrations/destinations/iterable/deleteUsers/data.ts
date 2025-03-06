import { defaultApiKey } from '../../../common/secrets';

const destType = 'iterable';

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
              apiToken: defaultApiKey,
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
    name: destType,
    description: 'Test 2: should fail when one of the user-deletion requests fails',
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
              {
                userId: 'rudder2',
              },
            ],
            config: {
              apiKey: defaultApiKey,
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
            error:
              'User deletion request failed for userIds : [{"userId":"rudder2","Reason":"User does not exist. Email:  UserId: rudder2"}]',
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Test 3: should fail when invalid api key is set in config',
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
                userId: 'rudder3',
              },
              {
                userId: 'rudder4',
              },
            ],
            config: {
              apiKey: 'invalidKey',
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
            error: 'User deletion request failed : Invalid API key',
            statusCode: 401,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Test 4: should pass when proper apiKey & valid users are sent to destination',
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
                userId: 'rudder5',
              },
              {
                userId: 'rudder6',
              },
            ],
            config: {
              apiKey: defaultApiKey,
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
    name: destType,
    description: 'Test 5: should pass when dataCenter is selected as EUDC',
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
                userId: 'rudder7',
              },
            ],
            config: {
              apiKey: defaultApiKey,
              dataCenter: 'EUDC',
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
