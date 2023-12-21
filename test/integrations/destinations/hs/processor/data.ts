export const data = [
  {
    name: 'hs',
    description: 'Test 0',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint:
                'https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/testhubspot2@email.com',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                hapikey: 'dummy-apikey',
              },
              body: {
                JSON: {
                  properties: [
                    {
                      property: 'email',
                      value: 'testhubspot2@email.com',
                    },
                    {
                      property: 'firstname',
                      value: 'Test Hubspot',
                    },
                  ],
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 1',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'page',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '',
                referrer: '',
                search: '',
                title: '',
                url: '',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            error: 'Message type page is not supported',
            statTags: {
              destType: 'HS',
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
    name: 'hs',
    description: 'Test 2',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS',
              properties: {
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'GET',
              messageType: 'track',
              endpoint: 'https://track.hubspot.com/v1/event',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                _a: 'dummy-hubId',
                _n: 'test track event HS',
                email: 'testhubspot2@email.com',
                firstname: 'Test Hubspot',
              },
              body: {
                JSON: {},
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
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
    name: 'hs',
    description: 'Test 3',
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              traits: {
                email: 'testhubspot2@email.com',
                firstname: 'Test Hubspot',
                anonymousId: '12345',
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint:
                'https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/testhubspot2@email.com',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                hapikey: 'dummy-apikey',
              },
              body: {
                JSON: {
                  properties: [
                    {
                      property: 'email',
                      value: 'testhubspot2@email.com',
                    },
                    {
                      property: 'firstname',
                      value: 'Test Hubspot',
                    },
                  ],
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 4',
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
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            error: 'Identify without email is not supported.',
            statTags: {
              destType: 'HS',
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
    name: 'hs',
    description: 'Test 5',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS',
              properties: {
                revenue: 4.99,
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'GET',
              messageType: 'track',
              endpoint: 'https://track.hubspot.com/v1/event',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                _a: 'dummy-hubId',
                _n: 'test track event HS',
                _m: 4.99,
                email: 'testhubspot2@email.com',
                firstname: 'Test Hubspot',
              },
              body: {
                JSON: {},
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
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
    name: 'hs',
    description: 'Test 6',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS',
              properties: {
                value: 4.99,
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'GET',
              messageType: 'track',
              endpoint: 'https://track.hubspot.com/v1/event',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                _a: 'dummy-hubId',
                _n: 'test track event HS',
                _m: 4.99,
                email: 'testhubspot2@email.com',
                firstname: 'Test Hubspot',
              },
              body: {
                JSON: {},
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
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
    name: 'hs',
    description: 'Test 7',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              jobId: 2,
            },
            destination: {
              Config: {
                apiKey: 'invalid-api-key',
                hubID: 'dummy-hubId',
              },
              secretConfig: {},
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              name: 'Hubspot',
              enabled: true,
              workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              deleted: false,
              createdAt: '2020-12-30T08:39:32.005Z',
              updatedAt: '2021-02-03T16:22:31.374Z',
              destinationDefinition: {
                id: '1aIXqM806xAVm92nx07YwKbRrO9',
                name: 'HS',
                displayName: 'Hubspot',
                createdAt: '2020-04-09T09:24:31.794Z',
                updatedAt: '2021-01-11T11:03:28.103Z',
              },
              transformations: [],
              isConnectionEnabled: true,
              isProcessorEnabled: true,
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
            metadata: {
              jobId: 2,
            },
            error:
              '{"message":"Failed to get hubspot properties: {\\"status\\":\\"error\\",\\"message\\":\\"The API key provided is invalid. View or manage your API key here: https://app.hubspot.com/l/api-key/\\",\\"correlationId\\":\\"4d39ff11-e121-4514-bcd8-132a9dd1ff50\\",\\"category\\":\\"INVALID_AUTHENTICATION\\",\\"links\\":{\\"api key\\":\\"https://app.hubspot.com/l/api-key/\\"}}","destinationResponse":{"response":{"status":"error","message":"The API key provided is invalid. View or manage your API key here: https://app.hubspot.com/l/api-key/","correlationId":"4d39ff11-e121-4514-bcd8-132a9dd1ff50","category":"INVALID_AUTHENTICATION","links":{"api key":"https://app.hubspot.com/l/api-key/"}},"status":401}}',
            statTags: {
              destType: 'HS',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 401,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 8',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              jobId: 2,
            },
            destination: {
              Config: {
                apiKey: 'rate-limit-id',
                hubID: 'dummy-hubId',
              },
              secretConfig: {},
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              name: 'Hubspot',
              enabled: true,
              workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              deleted: false,
              createdAt: '2020-12-30T08:39:32.005Z',
              updatedAt: '2021-02-03T16:22:31.374Z',
              destinationDefinition: {
                id: '1aIXqM806xAVm92nx07YwKbRrO9',
                name: 'HS',
                displayName: 'Hubspot',
                createdAt: '2020-04-09T09:24:31.794Z',
                updatedAt: '2021-01-11T11:03:28.103Z',
              },
              transformations: [],
              isConnectionEnabled: true,
              isProcessorEnabled: true,
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
            metadata: {
              jobId: 2,
            },
            error:
              '{"message":"Failed to get hubspot properties: {\\"status\\":\\"error\\",\\"message\\":\\"Request Rate Limit reached\\",\\"correlationId\\":\\"4d39ff11-e121-4514-bcd8-132a9dd1ff50\\",\\"category\\":\\"RATE-LIMIT_REACHED\\",\\"links\\":{\\"api key\\":\\"https://app.hubspot.com/l/api-key/\\"}}","destinationResponse":{"response":{"status":"error","message":"Request Rate Limit reached","correlationId":"4d39ff11-e121-4514-bcd8-132a9dd1ff50","category":"RATE-LIMIT_REACHED","links":{"api key":"https://app.hubspot.com/l/api-key/"}},"status":429}}',
            statTags: {
              destType: 'HS',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 429,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 9',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'GET',
              messageType: 'track',
              endpoint: 'https://track.hubspot.com/v1/event',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                _a: 'dummy-hubId',
                _n: 'test track event HS',
                email: 'testhubspot2@email.com',
                firstname: 'Test Hubspot',
              },
              body: {
                JSON: {},
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
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
    name: 'hs',
    description: '[HS] (legacyApiKey): trigger update all objects endpoint for rETL source',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (legacyApiKey): trigger update all objects endpoint for rETL source',
            message: {
              channel: 'web',
              context: {
                mappedToDestination: true,
                externalId: [
                  {
                    identifierType: 'email',
                    id: 'testhubspot2@email.com',
                    type: 'HS-lead',
                  },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              traits: {
                firstname: 'Test Hubspot',
                anonymousId: '12345',
                country: 'India',
              },
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'PATCH',
              endpoint: 'https://api.hubapi.com/crm/v3/objects/lead/103605',
              source: 'rETL',
              operation: 'updateObject',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                hapikey: 'dummy-apikey',
              },
              body: {
                JSON: {
                  properties: {
                    firstname: 'Test Hubspot',
                    anonymousId: '12345',
                    country: 'India',
                    email: 'testhubspot2@email.com',
                  },
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: '[HS] (legacyApiKey): trigger create custom objects endpoint',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (legacyApiKey): trigger create custom objects endpoint',
            message: {
              channel: 'web',
              context: {
                mappedToDestination: true,
                externalId: [
                  {
                    identifierType: 'email',
                    id: 'testhubspot@email.com',
                    type: 'HS-lead',
                  },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              traits: {
                firstname: 'Test Hubspot',
                anonymousId: '12345',
                country: 'India',
              },
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.hubapi.com/crm/v3/objects/lead',
              source: 'rETL',
              operation: 'createObject',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                hapikey: 'dummy-apikey',
              },
              body: {
                JSON: {
                  properties: {
                    firstname: 'Test Hubspot',
                    anonymousId: '12345',
                    country: 'India',
                    email: 'testhubspot@email.com',
                  },
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: '[HS] (newApiKey): trigger create all objects endpoint for rETL source',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (newApiKey): trigger create all objects endpoint for rETL source',
            message: {
              channel: 'web',
              context: {
                mappedToDestination: true,
                externalId: [
                  {
                    identifierType: 'email',
                    id: 'testhubspot@email.com',
                    type: 'HS-lead',
                  },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              traits: {
                firstname: 'Test Hubspot',
                anonymousId: '12345',
                country: 'India',
              },
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              userId: '',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.hubapi.com/crm/v3/objects/lead',
              source: 'rETL',
              operation: 'createObject',
              headers: {
                Authorization: 'Bearer dummy-access-token',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  properties: {
                    firstname: 'Test Hubspot',
                    anonymousId: '12345',
                    country: 'India',
                    email: 'testhubspot@email.com',
                  },
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: '[HS] (newApiKey): trigger update all objects endpoint for rETL source',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (newApiKey): trigger update all objects endpoint for rETL source',
            message: {
              channel: 'web',
              context: {
                mappedToDestination: true,
                externalId: [
                  {
                    identifierType: 'email',
                    id: 'testhubspot2@email.com',
                    type: 'HS-lead',
                  },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              traits: {
                firstname: 'Test Hubspot',
                anonymousId: '12345',
                country: 'India',
              },
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'PATCH',
              endpoint: 'https://api.hubapi.com/crm/v3/objects/lead/103605',
              source: 'rETL',
              operation: 'updateObject',
              headers: {
                Authorization: 'Bearer dummy-access-token',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  properties: {
                    firstname: 'Test Hubspot',
                    anonymousId: '12345',
                    country: 'India',
                    email: 'testhubspot2@email.com',
                  },
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 14',
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
                traits: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS',
              sentAt: '2019-10-14T11:15:53.296Z',
              properties: {
                email: 'testhubspot2@email.com',
                firstname: 'Test Hubspot',
              },
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'GET',
              messageType: 'track',
              endpoint: 'https://track.hubspot.com/v1/event',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                _a: 'dummy-hubId',
                _n: 'test track event HS',
                email: 'testhubspot2@email.com',
                firstname: 'Test Hubspot',
              },
              body: {
                JSON: {},
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
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
    name: 'hs',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              description: '[HS] (legacyApi): use (API Key) - check external id i.e hubspotId',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'hubspotId',
                    id: '6556',
                  },
                ],
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS 2',
              properties: {
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'GET',
              messageType: 'track',
              endpoint: 'https://track.hubspot.com/v1/event',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                _a: 'dummy-hubId',
                _n: 'test track event HS 2',
                id: '6556',
                email: 'testhubspot2@email.com',
                firstname: 'Test Hubspot',
              },
              body: {
                JSON: {},
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
  },
  {
    name: 'hs',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              description: '[HS] (legacyApi): use (API Key) - check HS common config mappings',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'hubspotId',
                    id: '6556',
                  },
                ],
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS 2',
              properties: {
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
                address: {
                  street: '24. park',
                },
                company: {
                  name: 'RudderStack',
                },
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'GET',
              messageType: 'track',
              endpoint: 'https://track.hubspot.com/v1/event',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                _a: 'dummy-hubId',
                _n: 'test track event HS 2',
                id: '6556',
                address: '24. park',
                company: 'RudderStack',
              },
              body: {
                JSON: {},
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
  },
  {
    name: 'hs',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              description: '[HS] (legacyApi): use (newPrivateAppApi) for contact endpoint',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikey',
                accessToken: 'dummy-access-token',
                apiVersion: 'legacyApi',
                lookupField: '',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint:
                'https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/testhubspot2@email.com',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummy-access-token',
              },
              params: {},
              body: {
                JSON: {
                  properties: [
                    {
                      property: 'email',
                      value: 'testhubspot2@email.com',
                    },
                    {
                      property: 'firstname',
                      value: 'Test Hubspot',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 18',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              description:
                '[HS] (newApi): get contact from hs with email (lookupField) exactly matching with one contact',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                  lookupField: 'email',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                accessToken: 'dummy-access-tokensuccess',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikey',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/103604',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummy-access-tokensuccess',
              },
              params: {},
              operation: 'updateContacts',
              body: {
                JSON: {
                  properties: {
                    email: 'testhubspot@email.com',
                    firstname: 'Test Hubspot',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 19',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              description:
                '[HS] (newApi): get contact from hs with email (lookupField) having no contacts',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'noname@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                  lookupField: 'email',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                accessToken: 'dummy-access-token',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikey',
                apiVersion: 'newApi',
                lookupField: 'email',
                hubspotEvents: [],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummy-access-token',
              },
              params: {},
              operation: 'createContacts',
              body: {
                JSON: {
                  properties: {
                    email: 'noname@email.com',
                    firstname: 'Test Hubspot',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              description:
                '[HS] (newApi): get contact from hs with firstname (lookupField) having more than one result',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'nonamess@email.com',
                  firstname: 'Jhon',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                accessToken: 'dummy-access-tokenmultiple',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikey',
                apiVersion: 'newApi',
                lookupField: 'firstname',
                hubspotEvents: [],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error:
              'Unable to get single Hubspot contact. More than one contacts found. Retry with unique lookupPropertyName and lookupValue',
            statTags: {
              destType: 'HS',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'processor',
              implementation: 'native',
              meta: 'instrumentation',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 21',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              description: '[HS] (newApi): Track - validate properties of custom behavioral events',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'Purchase',
              properties: {
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
                Revenue: 100,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '1',
                apiKey: '1',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              messageType: 'track',
              endpoint: 'https://api.hubapi.com/events/v3/send',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummy-access-token',
              },
              params: {},
              body: {
                JSON: {
                  email: 'testhubspot2@email.com',
                  occurredAt: '2019-10-15T09:35:31.291Z',
                  eventName: 'pe22315509_rs_hub_test',
                  properties: {
                    value: 100,
                  },
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
  },
  {
    name: 'hs',
    description: 'Test 22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              description:
                '[HS] (legacyApi): (legacyApiKey) Identify - testing legacy api with new destination config',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                authorizationType: 'legacyApiKey',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikey',
                accessToken: '',
                apiVersion: 'legacyApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint:
                'https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/testhubspot2@email.com',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                hapikey: 'dummy-apikey',
              },
              body: {
                JSON: {
                  properties: [
                    {
                      property: 'email',
                      value: 'testhubspot2@email.com',
                    },
                    {
                      property: 'firstname',
                      value: 'Test Hubspot',
                    },
                  ],
                },
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 23',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              description:
                '[HS] (legacyApi): (legacyApiKey) Track - testing legacy api with new destination config',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS',
              properties: {
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                authorizationType: 'legacyApiKey',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikey',
                accessToken: '',
                apiVersion: 'legacyApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'GET',
              messageType: 'track',
              endpoint: 'https://track.hubspot.com/v1/event',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                _a: 'dummy-hubId',
                _n: 'test track event HS',
                email: 'testhubspot2@email.com',
                firstname: 'Test Hubspot',
              },
              body: {
                JSON: {},
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
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
    name: 'hs',
    description:
      '[HS] (New API v3) - (newPrivateAppApi) check for email in traits which is the deafult lookup field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              '[HS] (New API v3) - (newPrivateAppApi) check for email in traits which is the deafult lookup field',
            message: {
              type: 'identify',
              traits: {},
              context: {
                externalId: [
                  {
                    id: 'osvaldocostaferreira98@gmail.com',
                    type: 'HS-contacts',
                    identifierType: 'email',
                  },
                ],
                mappedToDestination: false,
              },
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error:
              'Identify:: email i.e a default lookup field for contact lookup not found in traits',
            statTags: {
              destType: 'HS',
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
    name: 'hs',
    description:
      '[HS] (New API v3) - (newPrivateAppApi) email is present in traits as a default lookup field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              '[HS] (New API v3) - (newPrivateAppApi) email is present in traits as a default lookup field',
            message: {
              type: 'identify',
              traits: {
                email: 'noname@email.com',
              },
              context: {
                mappedToDestination: false,
              },
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummy-access-token',
              },
              params: {},
              body: {
                JSON: {
                  properties: {
                    email: 'noname@email.com',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              operation: 'createContacts',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: '[HS] (New API v3) - (newPrivateAppApi) - rETL source - minimum config check',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              '[HS] (New API v3) - (newPrivateAppApi) - rETL source - minimum config check',
            message: {
              type: 'identify',
              traits: {},
              context: {
                externalId: [
                  {
                    id: 'osvaldocostaferreira98@gmail.com',
                    type: 'HS-contacts',
                    identifierType: 'email',
                  },
                ],
                mappedToDestination: 'true',
              },
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummy-access-token',
              },
              params: {},
              body: {
                JSON: {
                  properties: {
                    email: 'osvaldocostaferreira98@gmail.com',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              source: 'rETL',
              operation: 'createObject',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description:
      '[HS] (New API v3) - (newPrivateAppApi) rETL - object type is not provided i.e externalId is empty',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              '[HS] (New API v3) - (newPrivateAppApi) rETL - object type is not provided i.e externalId is empty',
            message: {
              type: 'identify',
              traits: {},
              context: {
                mappedToDestination: 'true',
              },
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: 'rETL - external Id not found.',
            statTags: {
              destType: 'HS',
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
    name: 'hs',
    description: '[HS] (New API v3) - (newPrivateAppApi) sample track call for property check',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              '[HS] (New API v3) - (newPrivateAppApi) sample track call for property check',
            message: {
              type: 'track',
              traits: {},
              context: {
                externalId: [
                  {
                    id: 'osvaldocostaferreira98@gmail.com',
                    type: 'HS-contacts',
                    identifierType: 'email',
                  },
                ],
              },
              event: 'Purchase',
              properties: {
                Revenue: 'name1',
              },
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.hubapi.com/events/v3/send',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummy-access-token',
              },
              params: {},
              body: {
                JSON: {
                  email: 'osvaldocostaferreira98@gmail.com',
                  eventName: 'pe22315509_rs_hub_test',
                  properties: {
                    value: 'name1',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              messageType: 'track',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: '[HS] (New API v3) - (newPrivateAppApi) - check for accesstoken existence',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (New API v3) - (newPrivateAppApi) - check for accesstoken existence',
            message: {
              type: 'identify',
              traits: {
                lookupField: 'firstname',
                firstname: 'Test',
              },
              context: {
                externalId: [
                  {
                    id: 'osvaldocostaferreira98@gmail.com',
                    type: 'HS-contacts',
                    identifierType: 'email',
                  },
                ],
              },
              event: 'Purchase',
              properties: {
                revenue: 'name1',
              },
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: '',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: 'Access Token not found. Aborting',
            statTags: {
              destType: 'HS',
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
  {
    name: 'hs',
    description: '[HS] (New API v3) - (legacyApiKey) - check for hubId existence',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (New API v3) - (legacyApiKey) - check for hubId existence',
            message: {
              type: 'identify',
              traits: {
                lookupField: 'firstname',
                firstname: 'Test',
              },
              context: {
                externalId: [
                  {
                    id: 'osvaldocostaferreira98@gmail.com',
                    type: 'HS-contacts',
                    identifierType: 'email',
                  },
                ],
              },
              event: 'Purchase',
              properties: {
                revenue: 'name1',
              },
            },
            destination: {
              Config: {
                authorizationType: 'legacyApiKey',
                hubID: '',
                apiKey: '',
                accessToken: '',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: 'Hub ID not found. Aborting',
            statTags: {
              destType: 'HS',
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
  {
    name: 'hs',
    description: '[HS] (New API v3) - (legacyApiKey) - check basic track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (New API v3) - (legacyApiKey) - check basic track call',
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'Purchase',
              properties: {
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
                address: {
                  city: 'kolkata',
                  country: 'India',
                },
                objectId: '5005',
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                authorizationType: 'legacyApiKey',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikey',
                accessToken: '',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.hubapi.com/events/v3/send?hapikey=dummy-apikey',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  occurredAt: '2019-10-15T09:35:31.291Z',
                  objectId: '5005',
                  eventName: 'pe22315509_rs_hub_test',
                  properties: {
                    hs_city: 'kolkata',
                    hs_country: 'India',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              messageType: 'track',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description:
      '[HS] (New API v3) - (legacyApiKey) - either of email, utk or objectId must be present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              '[HS] (New API v3) - (legacyApiKey) - either of email, utk or objectId must be present',
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'Purchase',
              properties: {
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
                address: {
                  city: 'kolkata',
                  country: 'India',
                },
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                authorizationType: 'legacyApiKey',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikey',
                accessToken: '',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: 'Either of email, utk or objectId is required for custom behavioral events',
            statTags: {
              destType: 'HS',
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
    name: 'hs',
    description: 'Test 33',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              description: '[HS] (newApi): check for legacyApiKey',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'noname@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                authorizationType: 'legacyApiKey',
                accessToken: 'dummy-access-token',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikeysuccess',
                apiVersion: 'newApi',
                lookupField: 'email',
                hubspotEvents: [],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                hapikey: 'dummy-apikeysuccess',
              },
              operation: 'createContacts',
              body: {
                JSON: {
                  properties: {
                    email: 'noname@email.com',
                    firstname: 'Test Hubspot',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: '[HS] (New API v3) - (newPrivateAppApi) message type not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (New API v3) - (newPrivateAppApi) message type not present',
            message: {
              traits: {},
              context: {
                externalId: [
                  {
                    id: 'osvaldocostaferreira98@gmail.com',
                    type: 'HS-contacts',
                    identifierType: 'email',
                  },
                ],
              },
              event: 'Purchase',
              properties: {
                revenue: 'name1',
              },
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: 'Message type is not present. Aborting message.',
            statTags: {
              destType: 'HS',
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
    name: 'hs',
    description: '[HS] (New API v3) - (legacyApiKey) - check for api key existence',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (New API v3) - (legacyApiKey) - check for api key existence',
            message: {
              type: 'identify',
              traits: {
                lookupField: 'firstname',
                firstname: 'Test',
              },
              context: {
                externalId: [
                  {
                    id: 'osvaldocostaferreira98@gmail.com',
                    type: 'HS-contacts',
                    identifierType: 'email',
                  },
                ],
              },
              event: 'Purchase',
              properties: {
                revenue: 'name1',
              },
            },
            destination: {
              Config: {
                authorizationType: 'legacyApiKey',
                hubID: 'dummy-hubId',
                apiKey: '',
                accessToken: '',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: 'API Key not found. Aborting',
            statTags: {
              destType: 'HS',
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
  {
    name: 'hs',
    description: '[HS] (New API v3) - (newPrivateAppApi) Identify: traits is not supplied',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (New API v3) - (newPrivateAppApi) Identify: traits is not supplied',
            message: {
              type: 'identify',
              context: {
                mappedToDestination: false,
              },
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: 'Identify - Invalid traits value for lookup field',
            statTags: {
              destType: 'HS',
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
    name: 'hs',
    description: '[HS] (New API v3) - (legacyApiKey) - event not found',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (New API v3) - (legacyApiKey) - event not found',
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'Temp Event',
              properties: {
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
                address: {
                  city: 'kolkata',
                  country: 'India',
                },
                objectId: '5005',
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                authorizationType: 'legacyApiKey',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikey',
                accessToken: '',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: "Event name 'temp event' mappings are not configured in the destination",
            statTags: {
              destType: 'HS',
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
  {
    name: 'hs',
    description: '[HS] (New API v3) - (legacyApiKey) - event name is required',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: '[HS] (New API v3) - (legacyApiKey) - event name is required',
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
                address: {
                  city: 'kolkata',
                  country: 'India',
                },
                objectId: '5005',
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                authorizationType: 'legacyApiKey',
                hubID: 'dummy-hubId',
                apiKey: 'dummy-apikey',
                accessToken: '',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: 'event name is required for track call',
            statTags: {
              destType: 'HS',
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
    name: 'hs',
    description:
      '[HS] (Legacy API v1) - (newPrivateAppApi) rETL - object type is not provided i.e externalId is empty',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              '[HS] (Legacy API v1) - (newPrivateAppApi) rETL - object type is not provided i.e externalId is empty',
            message: {
              type: 'identify',
              traits: {},
              context: {
                mappedToDestination: 'true',
              },
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'legacyApi',
                lookupField: 'lookupField',
                hubspotEvents: [
                  {
                    rsEventName: 'Purchase',
                    hubspotEventName: 'pe22315509_rs_hub_test',
                    eventProperties: [
                      {
                        from: 'Revenue',
                        to: 'value',
                      },
                      {
                        from: 'Price',
                        to: 'cost',
                      },
                    ],
                  },
                  {
                    rsEventName: 'Order Complete',
                    hubspotEventName: 'pe22315509_rs_hub_chair',
                    eventProperties: [
                      {
                        from: 'firstName',
                        to: 'first_name',
                      },
                      {
                        from: 'lastName',
                        to: 'last_name',
                      },
                    ],
                  },
                ],
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: 'rETL - external Id not found.',
            statTags: {
              destType: 'HS',
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
    name: 'hs',
    description:
      '[HS] (Legacy API v1) - (newPrivateAppApi) - sample track call for legacy api with newPrivateAppApi',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              '[HS] (Legacy API v1) - (newPrivateAppApi) - sample track call for legacy api with newPrivateAppApi',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS',
              properties: {
                user_actual_role: 'system_admin, system_user',
                user_actual_id: 12345,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
                authorizationType: 'newPrivateAppApi',
                accessToken: 'dummy-access-token',
                apiVersion: 'legacyApi',
              },
              Enabled: true,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'GET',
              messageType: 'track',
              endpoint: 'https://track.hubspot.com/v1/event',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummy-access-token',
              },
              params: {
                _a: 'dummy-hubId',
                _n: 'test track event HS',
                email: 'testhubspot2@email.com',
                firstname: 'Test Hubspot',
              },
              body: {
                JSON: {},
                XML: {},
                FORM: {},
                JSON_ARRAY: {},
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
    name: 'hs',
    description: 'Test 41',
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
                mappedToDestination: true,
                externalId: [
                  {
                    identifierType: 'email',
                    id: 'testhubspot2@email.com',
                    type: 'HS-lead',
                  },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
              },
              type: 'identify',
              traits: {
                firstname: 'Test Hubspot',
                anonymousId: '12345',
                country: 'India',
              },
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            metadata: {
              jobId: 2,
            },
            destination: {
              Config: {
                apiKey: 'rate-limit-id',
                hubID: 'dummy-hubId',
              },
              secretConfig: {},
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              name: 'Hubspot',
              enabled: true,
              workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              deleted: false,
              createdAt: '2020-12-30T08:39:32.005Z',
              updatedAt: '2021-02-03T16:22:31.374Z',
              destinationDefinition: {
                id: '1aIXqM806xAVm92nx07YwKbRrO9',
                name: 'HS',
                displayName: 'Hubspot',
                createdAt: '2020-04-09T09:24:31.794Z',
                updatedAt: '2021-01-11T11:03:28.103Z',
              },
              transformations: [],
              isConnectionEnabled: true,
              isProcessorEnabled: true,
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
            error:
              '{"message":"rETL - Error during searching object record. Request Rate Limit reached","destinationResponse":{"response":{"status":"error","message":"Request Rate Limit reached","correlationId":"4d39ff11-e121-4514-bcd8-132a9dd1ff50","category":"RATE-LIMIT_REACHED","links":{"api key":"https://app.hubspot.com/l/api-key/"}},"status":429}}',
            metadata: {
              jobId: 2,
            },
            statTags: {
              destType: 'HS',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 429,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 42',
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  path: '',
                  referrer: '',
                  search: '',
                  title: '',
                  url: '',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
                  days_to_close: '29 days to close',
                },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2023-04-11T09:35:31.288Z',
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: 'user@1',
              integrations: {
                All: true,
              },
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            error:
              'Property days_to_close data type string is not matching with Hubspot property data type number',
            statTags: {
              destType: 'HS',
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
    name: 'hs',
    description: 'Test 43',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'identify',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {},
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              body: {
                FORM: {},
                JSON: {
                  properties: [
                    {
                      property: 'email',
                      value: 'testhubspot2@email.com',
                    },
                    {
                      property: 'firstname',
                      value: 'Test Hubspot',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint:
                'https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/testhubspot2@email.com',
              files: {},
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
              params: {
                hapikey: 'dummy-apikey',
              },
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 44',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'identify',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              body: {
                FORM: {},
                JSON: {
                  properties: [
                    {
                      property: 'email',
                      value: 'testhubspot2@email.com',
                    },
                    {
                      property: 'firstname',
                      value: 'Test Hubspot',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint:
                'https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/testhubspot2@email.com',
              files: {},
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
              params: {
                hapikey: 'dummy-apikey',
              },
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description: 'Test 45',
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
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'identify',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: '',
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                apiKey: 'dummy-apikey',
                hubID: 'dummy-hubId',
              },
              Enabled: true,
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
            output: {
              body: {
                FORM: {},
                JSON: {
                  properties: [
                    {
                      property: 'email',
                      value: 'testhubspot2@email.com',
                    },
                    {
                      property: 'firstname',
                      value: 'Test Hubspot',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint:
                'https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/testhubspot2@email.com',
              files: {},
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
              params: {
                hapikey: 'dummy-apikey',
              },
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'hs',
    description:
      '[HS] (New API v3) - (newPrivateAppApi) sample track call when hubspotEvents is undefined',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              '[HS] (New API v3) - (newPrivateAppApi) sample track call when hubspotEvents is undefined',
            message: {
              type: 'track',
              traits: {},
              context: {
                externalId: [
                  {
                    id: 'osvaldocostaferreira98@gmail.com',
                    type: 'HS-contacts',
                    identifierType: 'email',
                  },
                ],
              },
              event: 'Purchase',
              properties: {
                Revenue: 'name1',
              },
            },
            destination: {
              Config: {
                authorizationType: 'newPrivateAppApi',
                hubID: '',
                apiKey: '',
                accessToken: 'dummy-access-token',
                apiVersion: 'newApi',
                lookupField: 'lookupField',
                eventFilteringOption: 'disable',
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
              Enabled: true,
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
            error: 'Event and property mappings are required for track call',
            statTags: {
              destType: 'HS',
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
