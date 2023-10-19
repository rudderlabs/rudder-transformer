export const data = [
  {
    name: 'branch',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
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
                    os_version: '14.4.1',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  attTrackingStatus: 2,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'Android',
                  version: '9',
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
                    os: 'Android',
                    os_version: '9',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    android_id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    aaid: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: true,
                    model: 'AOSP on IA Emulator',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  name: '',
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
              type: 'page',
              userId: 'sampath',
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
            statusCode: 400,
            statTags: {
              destType: 'BRANCH',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            error: 'Message type is not supported',
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
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
              endpoint: 'https://api2.branch.io/v2/event/standard',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  content_items: [
                    {
                      $product_name: 'sampath',
                    },
                  ],
                  user_data: {
                    os: 'watchos',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                  name: 'ADD_TO_CART',
                  branch_key: '<branch key goes here>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
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
                  name: 'ipados',
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
              endpoint: 'https://api2.branch.io/v2/event/standard',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  content_items: [
                    {
                      $product_name: 'sampath',
                    },
                  ],
                  user_data: {
                    os: 'ipados',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                  name: 'ADD_TO_CART',
                  branch_key: '<branch key goes here>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
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
                  name: 'tvos',
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
              endpoint: 'https://api2.branch.io/v2/event/standard',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  content_items: [
                    {
                      $product_name: 'sampath',
                    },
                  ],
                  user_data: {
                    os: 'tvos',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                  name: 'ADD_TO_CART',
                  branch_key: '<branch key goes here>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
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
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              request_ip: '[::1]:64059',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
              type: 'track',
              userId: 'sampath',
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
              endpoint: 'https://api2.branch.io/v2/event/standard',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user_data: {
                    os: 'iOS',
                    os_version: '14.4.1',
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                  name: 'ADD_TO_CART',
                  branch_key: '<branch key goes here>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
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
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              request_ip: '[::1]:64059',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
              type: 'track',
              userId: 'sampath',
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
              endpoint: 'https://api2.branch.io/v2/event/standard',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user_data: {
                    app_version: '1.0.0',
                    screen_dpi: 2,
                    developer_identity: 'sampath',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                  name: 'ADD_TO_CART',
                  branch_key: '<branch key goes here>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            message: {
              anonymousId: 'sampath',
              channel: 'web',
              context: {
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
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
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              request_ip: '[::1]:64059',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
              type: 'track',
              userId: 'sampath',
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
              endpoint: 'https://api2.branch.io/v2/event/standard',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  user_data: {
                    os: 'iOS',
                    os_version: '14.4.1',
                    developer_identity: 'sampath',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: false,
                    model: 'AOSP on IA Emulator',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                  },
                  name: 'ADD_TO_CART',
                  branch_key: '<branch key goes here>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            message: {
              anonymousId: 'sampath',
              channel: 'web',
              context: {
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              request_ip: '[::1]:64059',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
              type: 'track',
              userId: 'sampath',
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
            statusCode: 400,
            error: 'Event name is required',
            statTags: {
              destType: 'BRANCH',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  attTrackingStatus: 2,
                  brand: 'testBrand',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 2,
                  height: 1794,
                  width: 1080,
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
              endpoint: 'https://api2.branch.io/v2/event/custom',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  custom_data: {
                    anonymousId: 'sampath',
                    email: 'sampath@gmail.com',
                  },
                  content_items: [{}],
                  user_data: {
                    os: 'Android',
                    os_version: '9',
                    app_version: '1.0.0',
                    model: 'AOSP on IA Emulator',
                    brand: 'testBrand',
                    screen_dpi: 2,
                    screen_height: 1794,
                    screen_width: 1080,
                    developer_identity: 'sampath',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                    android_id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    aaid: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: true,
                  },
                  name: 'sampath',
                  branch_key: '<branch key goes here>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'branch',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                device: {
                  adTrackingEnabled: true,
                  advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 2,
                  brand: 'testBrand',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                  height: 1794,
                  width: 1080,
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
              endpoint: 'https://api2.branch.io/v2/event/custom',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  custom_data: {
                    anonymousId: 'sampath',
                    email: 'sampath@gmail.com',
                  },
                  content_items: [{}],
                  user_data: {
                    os: 'iOS',
                    os_version: '14.4.1',
                    app_version: '1.0.0',
                    model: 'AOSP on IA Emulator',
                    brand: 'testBrand',
                    screen_dpi: 2,
                    screen_height: 1794,
                    screen_width: 1080,
                    developer_identity: 'sampath',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                    idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    limit_ad_tracking: true,
                  },
                  name: 'sampath',
                  branch_key: '<branch key goes here>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
