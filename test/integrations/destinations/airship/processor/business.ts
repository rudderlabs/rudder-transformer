import { authHeader1, secret1 } from '../maskedSecrets';
const arrayHandlingCases = [
  {
    description:
      '[identify] should send array traits as is to airship when present in integrationsObject(even when similar key is present in traits)',
    inputEvent: {
      channel: 'web',
      context: {
        app: {
          build: '1.0.0',
          name: 'RudderLabs JavaScript SDK',
          namespace: 'com.rudderlabs.javascript',
          version: '1.0.0',
        },
        traits: {
          email: 'testone@gmail.com',
          firstName: 'test',
          lastName: 'one',
          colors: ['red', 'blue'],
        },
        library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
        locale: 'en-US',
        ip: '0.0.0.0',
        os: { name: '', version: '' },
        screen: { density: 2 },
      },
      type: 'identify',
      messageId: '84e26acc-56a5-4835-8233-591137fca468',
      session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
      originalTimestamp: '2019-10-14T09:03:17.562Z',
      anonymousId: '123456',
      userId: 'testuserId1',
      integrations: {
        All: true,
        Airship: {
          JSONAttributes: {
            'colors#r012': {
              colors: ['green', 'yellow'],
            },
          },
        },
      },
      sentAt: '2019-10-14T09:03:22.563Z',
    },
    expectedOutputResponse: {
      status: 200,
      body: [
        {
          output: {
            version: '1',
            type: 'REST',
            method: 'POST',
            endpoint: 'https://go.urbanairship.com/api/named_users/testuserId1/attributes',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/vnd.urbanairship+json; version=3',
              Authorization: authHeader1,
            },
            params: {},
            body: {
              JSON: {
                attributes: [
                  {
                    action: 'set',
                    key: 'email',
                    value: 'testone@gmail.com',
                    timestamp: '2019-10-14T09:03:17Z',
                  },
                  {
                    action: 'set',
                    key: 'first_name',
                    value: 'test',
                    timestamp: '2019-10-14T09:03:17Z',
                  },
                  {
                    action: 'set',
                    key: 'last_name',
                    value: 'one',
                    timestamp: '2019-10-14T09:03:17Z',
                  },
                  {
                    action: 'set',
                    key: 'colors#r012',
                    value: {
                      colors: ['green', 'yellow'],
                    },
                    timestamp: '2019-10-14T09:03:17Z',
                  },
                ],
              },
              JSON_ARRAY: {},
              XML: {},
              FORM: {},
            },
            files: {},
            userId: '',
          },
          statusCode: 200,
        },
      ],
    },
  },
  // not expected in reality & leads to error in airship, but just to test the delimiter handling
  {
    description: '[identify] should handle keys with delimiters and JSON attributes correctly',
    inputEvent: {
      channel: 'web',
      context: {
        traits: {
          preferences: ['value1'], // should be processed as preferences_0
          'settings.theme': 'dark',
          'data[test]_value': 'test',
          simple: 'value', // no delimiters
          'company[location]': 'SF', // should be processed since not in JSONAttributes
        },
      },
      type: 'identify',
      messageId: '84e26acc-56a5-4835-8233-591137fca468',
      originalTimestamp: '2019-10-14T09:03:17.562Z',
      userId: 'testuserId1',
      integrations: {
        All: true,
        Airship: {
          JSONAttributes: {
            'company#pow2': {
              name: 'Test Corp',
              size: 100,
            },
          },
        },
      },
      sentAt: '2019-10-14T09:03:22.563Z',
    },
    expectedOutputResponse: {
      status: 200,
      body: [
        {
          output: {
            version: '1',
            type: 'REST',
            method: 'POST',
            endpoint: 'https://go.urbanairship.com/api/named_users/testuserId1/attributes',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/vnd.urbanairship+json; version=3',
              Authorization: authHeader1,
            },
            params: {},
            body: {
              JSON: {
                attributes: [
                  {
                    action: 'set',
                    key: 'preferences[0]',
                    value: 'value1',
                    timestamp: '2019-10-14T09:03:17Z',
                  },
                  {
                    action: 'set',
                    key: 'settings_theme',
                    value: 'dark',
                    timestamp: '2019-10-14T09:03:17Z',
                  },
                  {
                    action: 'set',
                    key: 'data[test]_value',
                    value: 'test',
                    timestamp: '2019-10-14T09:03:17Z',
                  },
                  {
                    action: 'set',
                    key: 'simple',
                    value: 'value',
                    timestamp: '2019-10-14T09:03:17Z',
                  },
                  {
                    action: 'set',
                    key: 'company#pow2',
                    value: {
                      name: 'Test Corp',
                      size: 100,
                    },
                    timestamp: '2019-10-14T09:03:17Z',
                  },
                ],
              },
              JSON_ARRAY: {},
              XML: {},
              FORM: {},
            },
            files: {},
            userId: '',
          },
          statusCode: 200,
        },
      ],
    },
  },
];

const getIdentifyTestCase = ({ description, inputEvent, expectedOutputResponse }) => {
  return {
    name: 'airship',
    description: description,
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: inputEvent,
            destination: {
              Config: {
                apiKey: secret1,
                appKey: 'O2YARRI15I',
                dataCenter: false,
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: expectedOutputResponse,
    },
  };
};

export const identifyTestCases = arrayHandlingCases.map((tc) => getIdentifyTestCase(tc));
