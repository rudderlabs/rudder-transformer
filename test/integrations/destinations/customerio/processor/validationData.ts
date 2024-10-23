export const validationData = [
  {
    name: 'customerio',
    id: 'Test 0',
    description: 'instrumentation error: userID nor email is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  anonymousId: '123456',
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 712136,
                    state: 'WB',
                    street: '',
                  },
                  ip: '0.0.0.0',
                  age: 26,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              user_properties: {
                prop1: 'val1',
                prop2: 'val2',
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'anon-id',
                'dot.name': 'Arnab Pal',
                address: {
                  city: 'NY',
                  country: 'USA',
                  postalCode: 712136,
                  state: 'CA',
                  street: '',
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
              },
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
            error: 'userId or email is not present',
            statTags: {
              destType: 'CUSTOMERIO',
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
  {
    name: 'customerio',
    id: 'Test 1',
    feature: 'processor',
    description: 'api key not found in config',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {},
            destination: {
              Config: {
                datacenter: 'US',
                siteID: '46be54768e7d49ab2628',
              },
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
            error: 'apiKey not found in Configs',
            statTags: {
              destType: 'CUSTOMERIO',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
