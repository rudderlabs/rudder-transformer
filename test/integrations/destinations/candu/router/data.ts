export const data = [
  {
    name: 'candu',
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
                ID: '23uZJcllEOBx8GbZ31qYzoML8Up',
                Name: 'Candu local',
                DestinationDefinition: {
                  ID: '23uYPwdkxT7pUNDAiCVNK3aU0sT',
                  Name: 'CANDU',
                  DisplayName: 'Candu',
                  Config: {
                    destConfig: {
                      defaultConfig: ['apiKey'],
                    },
                    excludeKeys: [],
                    includeKeys: [
                      'apiKey',
                      'blackListedEvents',
                      'whiteListedEvents',
                      'oneTrustCookieCategories',
                    ],
                    saveDestinationResponse: true,
                    secretKeys: ['apiKey'],
                    supportedMessageTypes: ['identify', 'track'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                      'flutter',
                      'cordova',
                    ],
                    transformAt: 'router',
                    transformAtV1: 'router',
                  },
                  ResponseRules: {},
                },
                Config: {
                  apiKey: 'FXLkLUEhGJyvmY4',
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: true,
              },
              metadata: {
                jobId: 1,
              },
              message: {
                anonymousId: 'a1b2c3d4e5f6g7h8i9j10',
                channel: 'mobile',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  device: {
                    adTrackingEnabled: true,
                    advertisingId: '',
                    id: '',
                    manufacturer: 'Google',
                    model: 'AOSP on IA Emulator',
                    name: 'generic_x86_arm',
                    attTrackingStatus: 3,
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  locale: 'en-US',
                  os: {
                    name: 'watchos',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    email: 'sampath@gmail.com',
                    name: 'Joker',
                    Gender: 'male',
                    foo: {
                      foo: 'bar',
                    },
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
                receivedAt: '2020-01-17T10:23:52.688+05:30',
                request_ip: '[::1]:64059',
                sentAt: '2020-01-17T04:53:52.667Z',
                timestamp: '2020-01-17T10:23:51.206+05:30',
                type: 'identify',
                userId: 'sampath',
              },
            },
          ],
          destType: 'candu',
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
                endpoint: 'https://api.candu.ai/api/eventWebhook',
                headers: {
                  Authorization: 'Basic RlhMa0xVRWhHSnl2bVk0',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    traits: {
                      email: 'sampath@gmail.com',
                      name: 'Joker',
                      Gender: 'male',
                      foo: { foo: 'bar' },
                    },
                    type: 'identify',
                    userId: 'sampath',
                    anonymousId: 'a1b2c3d4e5f6g7h8i9j10',
                    timestamp: '2020-01-17T10:23:51.206+05:30',
                    messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
                    context: { source: 'RudderStack' },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                ID: '23uZJcllEOBx8GbZ31qYzoML8Up',
                Name: 'Candu local',
                DestinationDefinition: {
                  ID: '23uYPwdkxT7pUNDAiCVNK3aU0sT',
                  Name: 'CANDU',
                  DisplayName: 'Candu',
                  Config: {
                    destConfig: { defaultConfig: ['apiKey'] },
                    excludeKeys: [],
                    includeKeys: [
                      'apiKey',
                      'blackListedEvents',
                      'whiteListedEvents',
                      'oneTrustCookieCategories',
                    ],
                    saveDestinationResponse: true,
                    secretKeys: ['apiKey'],
                    supportedMessageTypes: ['identify', 'track'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                      'flutter',
                      'cordova',
                    ],
                    transformAt: 'router',
                    transformAtV1: 'router',
                  },
                  ResponseRules: {},
                },
                Config: { apiKey: 'FXLkLUEhGJyvmY4' },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
];
