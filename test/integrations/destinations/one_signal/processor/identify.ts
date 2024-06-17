import { commonTags, commonTraits, destination, endpoint, headers } from './commonConfig';

export const identifyTests = [
  {
    name: 'one_signal',
    id: 'One Signal V2-test-identify-success-1',
    description:
      'Identify call for creating new user with userId only available and no subscriptions available',
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
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  brand: 'John Players',
                  price: '15000',
                  firstName: 'Test',
                  userId: 'user@27',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
                    tags: {
                      brand: 'John Players',
                      price: '15000',
                      firstName: 'Test',
                      userId: 'user@27',
                      anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                    },
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
    id: 'One Signal V2-test-identify-success-1',
    description:
      'Identify call for creating new user with userId and one device subscription available',
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
];
