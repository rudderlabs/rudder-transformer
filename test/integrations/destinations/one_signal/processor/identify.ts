import { commonTags, commonTraits, destination, endpoint, headers } from './commonConfig';

export const identifyTests = [
  {
    name: 'one_signal',
    id: 'One Signal V2-test-identify-success-1',
    description:
      'V2-> Identify call for creating new user with userId only available and no subscriptions available',
    module: 'destination',
    successCriteria: 'Request gets passed with 200 Status Code with userId mapped to external_id',
    feature: 'processor',
    scenario: 'Framework+Buisness',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              userId: 'user@27',
              channel: 'server',
              context: {
                app: {
                  version: '1.1.11',
                },
                traits: commonTraits,
                locale: 'en-US',
                screen: { density: 2 },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint,
              headers,
              params: {},
              body: {
                FORM: {},
                JSON: {
                  properties: {
                    tags: commonTags,
                    laguage: 'en-US',
                    created_at: 1609693373,
                    last_active: 1609693373,
                  },
                  identity: {
                    external_id: 'user@27',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    id: 'One Signal V2-test-identify-success-2',
    description:
      'V2-> Identify call for creating new user with userId and one device subscription available',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code with userId mapped to external_id and one subscription for device where identifier is mapped from anonymousId',
    feature: 'processor',
    scenario: 'Framework+Buisness',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              userId: 'user@27',
              channel: 'web',
              context: {
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: commonTraits,
                locale: 'en-US',
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint,
              headers,
              params: {},
              body: {
                FORM: {},
                JSON: {
                  properties: {
                    tags: commonTags,
                    laguage: 'en-US',
                    created_at: 1609693373,
                    last_active: 1609693373,
                  },
                  subscriptions: [
                    { token: '97c46c81-3140-456d-b2a9-690d70aaca35', type: 'FirefoxPush' },
                  ],
                  identity: {
                    external_id: 'user@27',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    id: 'One Signal V2-test-identify-success-3',
    description:
      'V2-> Identify call for creating new user with userId and three device subscription available',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code with userId mapped to external_id and three subscription for device where one is mapped from anonymousId, one from email and one from phone',
    feature: 'processor',
    scenario: 'Framework+Buisness',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              integrations: {
                one_signal: {
                  aliases: { custom_alias: 'custom_alias_identifier' },
                },
              },
              channel: 'web',
              context: {
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                device: {
                  model: 'dummy model',
                },
                os: { version: '1.0.0' },
                traits: {
                  ...commonTraits,
                  email: 'example@abc.com',
                  phone: '12345678',
                  subscriptions: {
                    email: {
                      enabled: true,
                      notification_types: 'SMS',
                      session_time: 123456,
                      session_count: 22,
                      app_version: '1.0.0',
                      test_type: 'dev',
                    },
                  },
                },
                locale: 'en-US',
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint,
              headers,
              params: {},
              body: {
                FORM: {},
                JSON: {
                  properties: {
                    tags: { ...commonTags, email: 'example@abc.com', phone: '12345678' },
                    laguage: 'en-US',
                    created_at: 1609693373,
                    last_active: 1609693373,
                  },
                  subscriptions: [
                    {
                      device_model: 'dummy model',
                      device_os: '1.0.0',
                      token: '97c46c81-3140-456d-b2a9-690d70aaca35',
                      type: 'FirefoxPush',
                    },
                    {
                      app_version: '1.0.0',
                      device_model: 'dummy model',
                      device_os: '1.0.0',
                      enabled: true,
                      notification_types: 'SMS',
                      session_count: 22,
                      session_time: 123456,
                      test_type: 'dev',
                      token: 'example@abc.com',
                      type: 'Email',
                    },
                    {
                      device_model: 'dummy model',
                      device_os: '1.0.0',
                      token: '12345678',
                      type: 'SMS',
                    },
                  ],
                  identity: { custom_alias: 'custom_alias_identifier' },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    id: 'One Signal V2-test-identify-failure-1',
    description: 'V2-> Identify call without any aliases',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code and failure happened due no aliases present',
    feature: 'processor',
    scenario: 'Framework',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              channel: 'server',
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'userId or any other alias is required for identify',
            statTags: {
              destType: 'ONE_SIGNAL',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
];
