import { authHeader1, secret1 } from '../maskedSecrets';
export const data = [
  {
    name: 'segment',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afmecIpsJm7D72aRTksxyODrwR',
              Name: 'Segment',
              DestinationDefinition: {
                ID: '1afjjahf0X5lSyNze7Xh7aqJs11',
                Name: 'SEGMENT',
                DisplayName: 'Segment',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                writeKey: secret1,
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  age: 23,
                  email: 'testmp@rudderstack.com',
                  firstname: 'Test Kafka',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '258b77c6-442d-4bdc-8729-f0e4cef41353',
              name: 'home',
              originalTimestamp: '2020-04-17T14:55:31.367Z',
              properties: {
                path: '/tests/html/index4.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index4.html',
              },
              receivedAt: '2020-04-17T20:25:31.381+05:30',
              request_ip: '[::1]:57363',
              sentAt: '2020-04-17T14:55:31.367Z',
              timestamp: '2020-04-17T20:25:31.381+05:30',
              type: 'page',
              userId: 'user12345',
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
              userId: 'user12345',
              endpoint: 'https://api.segment.io/v1/batch',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  batch: [
                    {
                      anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
                      type: 'page',
                      userId: 'user12345',
                      traits: {
                        age: 23,
                        email: 'testmp@rudderstack.com',
                        firstname: 'Test Kafka',
                      },
                      properties: {
                        path: '/tests/html/index4.html',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'http://localhost/tests/html/index4.html',
                      },
                      timeStamp: '2020-04-17T20:25:31.381+05:30',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'segment',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afmecIpsJm7D72aRTksxyODrwR',
              Name: 'Segment',
              DestinationDefinition: {
                ID: '1afjjahf0X5lSyNze7Xh7aqJs11',
                Name: 'SEGMENT',
                DisplayName: 'Segment',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                writeKey: secret1,
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  age: 23,
                  email: 'testmp@email.com',
                  firstname: 'Test Transformer',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '023a3a48-190a-4968-9394-a8e99b81a3c0',
              originalTimestamp: '2020-04-17T14:55:31.37Z',
              receivedAt: '2020-04-17T20:25:31.401+05:30',
              request_ip: '[::1]:57364',
              sentAt: '2020-04-17T14:55:31.37Z',
              timestamp: '2020-04-17T20:25:31.401+05:30',
              type: 'identify',
              userId: 'user12345',
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
              userId: 'user12345',
              method: 'POST',
              endpoint: 'https://api.segment.io/v1/batch',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  batch: [
                    {
                      anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
                      type: 'identify',
                      userId: 'user12345',
                      traits: {
                        age: 23,
                        email: 'testmp@email.com',
                        firstname: 'Test Transformer',
                      },
                      timeStamp: '2020-04-17T20:25:31.401+05:30',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'segment',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afmecIpsJm7D72aRTksxyODrwR',
              Name: 'Segment',
              DestinationDefinition: {
                ID: '1afjjahf0X5lSyNze7Xh7aqJs11',
                Name: 'SEGMENT',
                DisplayName: 'Segment',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                writeKey: secret1,
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  age: 23,
                  email: 'testmp@email.com',
                  firstname: 'Test Transformer',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: '584fde02-901a-4964-a4a0-4078b999d5b2',
              originalTimestamp: '2020-04-17T14:55:31.372Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-17T20:25:31.401+05:30',
              request_ip: '[::1]:57365',
              sentAt: '2020-04-17T14:55:31.372Z',
              timestamp: '2020-04-17T20:25:31.401+05:30',
              type: 'track',
              userId: 'user12345',
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
              userId: 'user12345',
              method: 'POST',
              endpoint: 'https://api.segment.io/v1/batch',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  batch: [
                    {
                      anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
                      type: 'track',
                      userId: 'user12345',
                      event: 'test track with property',
                      traits: {
                        age: 23,
                        email: 'testmp@email.com',
                        firstname: 'Test Transformer',
                      },
                      properties: {
                        test_prop_1: 'test prop',
                        test_prop_2: 1232,
                      },
                      timeStamp: '2020-04-17T20:25:31.401+05:30',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'segment',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afmecIpsJm7D72aRTksxyODrwR',
              Name: 'Segment',
              DestinationDefinition: {
                ID: '1afjjahf0X5lSyNze7Xh7aqJs11',
                Name: 'SEGMENT',
                DisplayName: 'Segment',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                writeKey: secret1,
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  age: 23,
                  email: 'testmp@rudderstack.com',
                  firstname: 'Test Kafka',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '258b77c6-442d-4bdc-8729-f0e4cef41353',
              name: 'home',
              originalTimestamp: '2020-04-17T14:55:31.367Z',
              properties: {
                path: '/tests/html/index4.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index4.html',
              },
              receivedAt: '2020-04-17T20:25:31.381+05:30',
              request_ip: '[::1]:57363',
              sentAt: '2020-04-17T14:55:31.367Z',
              timestamp: '2020-04-17T20:25:31.381+05:30',
              type: 'page',
              userId: 'user12345',
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
              endpoint: 'https://api.segment.io/v1/batch',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  batch: [
                    {
                      type: 'page',
                      userId: 'user12345',
                      traits: {
                        age: 23,
                        email: 'testmp@rudderstack.com',
                        firstname: 'Test Kafka',
                      },
                      properties: {
                        path: '/tests/html/index4.html',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'http://localhost/tests/html/index4.html',
                      },
                      timeStamp: '2020-04-17T20:25:31.381+05:30',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'user12345',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'segment',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afmecIpsJm7D72aRTksxyODrwR',
              Name: 'Segment',
              DestinationDefinition: {
                ID: '1afjjahf0X5lSyNze7Xh7aqJs11',
                Name: 'SEGMENT',
                DisplayName: 'Segment',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                writeKey: secret1,
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: '584fde02-901a-4964-a4a0-4078b999d5b2',
              originalTimestamp: '2020-04-17T14:55:31.372Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-17T20:25:31.401+05:30',
              request_ip: '[::1]:57365',
              sentAt: '2020-04-17T14:55:31.372Z',
              timestamp: '2020-04-17T20:25:31.401+05:30',
              type: 'track',
              userId: 'user12345',
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
              endpoint: 'https://api.segment.io/v1/batch',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  batch: [
                    {
                      anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
                      type: 'track',
                      userId: 'user12345',
                      event: 'test track with property',
                      properties: {
                        test_prop_1: 'test prop',
                        test_prop_2: 1232,
                      },
                      timeStamp: '2020-04-17T20:25:31.401+05:30',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'user12345',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
