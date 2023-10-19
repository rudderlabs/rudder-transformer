export const data = [
  {
    name: 'branch',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  branchKey: '<branch key goes here>',
                  useNativeSDK: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Branch Metrics',
                  ID: '1WTpBSTiL3iAUHUdW7rHT4sawgU',
                  Name: 'BRANCH',
                },
                Enabled: true,
                ID: '1WTpIHpH7NTBgjeiUPW1kCUgZGI',
                Name: 'branch test',
                Transformations: [],
              },
              metadata: {
                jobId: 1,
              },
              message: {
                anonymousId: 'sampath',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  locale: 'en-US',
                  os: {
                    name: 'iOS',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    anonymousId: 'sampath',
                    email: 'sampath@gmail.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                },
                event: 'product added',
                integrations: {
                  All: true,
                },
                messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
                originalTimestamp: '2020-01-17T04:53:51.185Z',
                properties: {
                  name: 'sampath',
                },
                receivedAt: '2020-01-17T10:23:52.688+05:30',
                request_ip: '[::1]:64059',
                sentAt: '2020-01-17T04:53:52.667Z',
                timestamp: '2020-01-17T10:23:51.206+05:30',
                type: 'track',
                userId: 'sampath',
              },
            },
            {
              destination: {
                Config: {
                  branchKey: '<branch key goes here>',
                  useNativeSDK: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Branch Metrics',
                  ID: '1WTpBSTiL3iAUHUdW7rHT4sawgU',
                  Name: 'BRANCH',
                },
                Enabled: true,
                ID: '1WTpIHpH7NTBgjeiUPW1kCUgZGI',
                Name: 'branch test',
                Transformations: [],
              },
              metadata: {
                jobId: 2,
              },
              message: {
                anonymousId: 'sampath',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  locale: 'en-US',
                  os: {
                    name: 'iOS',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
                originalTimestamp: '2020-01-17T04:53:51.185Z',
                receivedAt: '2020-01-17T10:23:52.688+05:30',
                request_ip: '[::1]:64059',
                sentAt: '2020-01-17T04:53:52.667Z',
                timestamp: '2020-01-17T10:23:51.206+05:30',
                type: 'identify',
                userId: 'sampath',
              },
            },
          ],
          destType: 'branch',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api2.branch.io/v2/event/standard',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    branch_key: '<branch key goes here>',
                    name: 'ADD_TO_CART',
                    content_items: [
                      {
                        $product_name: 'sampath',
                      },
                    ],
                    user_data: {
                      os: 'iOS',
                      os_version: '',
                      app_version: '1.0.0',
                      screen_dpi: 2,
                      developer_identity: 'sampath',
                      user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                    },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
                userId: 'sampath',
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  branchKey: '<branch key goes here>',
                  useNativeSDK: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Branch Metrics',
                  ID: '1WTpBSTiL3iAUHUdW7rHT4sawgU',
                  Name: 'BRANCH',
                },
                Enabled: true,
                ID: '1WTpIHpH7NTBgjeiUPW1kCUgZGI',
                Name: 'branch test',
                Transformations: [],
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api2.branch.io/v2/event/custom',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    branch_key: '<branch key goes here>',
                    name: 'sampath',
                    custom_data: {
                      anonymousId: 'sampath',
                      email: 'sampath@gmail.com',
                    },
                    content_items: [{}],
                    user_data: {
                      os: 'iOS',
                      os_version: '',
                      app_version: '1.0.0',
                      screen_dpi: 2,
                      developer_identity: 'sampath',
                      user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                    },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
                userId: 'sampath',
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  branchKey: '<branch key goes here>',
                  useNativeSDK: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Branch Metrics',
                  ID: '1WTpBSTiL3iAUHUdW7rHT4sawgU',
                  Name: 'BRANCH',
                },
                Enabled: true,
                ID: '1WTpIHpH7NTBgjeiUPW1kCUgZGI',
                Name: 'branch test',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
];
