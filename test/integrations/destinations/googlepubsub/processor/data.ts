export const data = [
  {
    name: 'googlepubsub',
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
                  email: 'ruchira@rudderlabs.com',
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
                  id: '72e528f869711c3d',
                  manufacturer: 'Google',
                  model: 'sdk_gphone_x86',
                  name: 'generic_x86_arm',
                  token: 'some_device_token',
                  type: 'android',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              event: 'product added',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: 'test',
                  },
                ],
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
            output: {
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
                    email: 'ruchira@rudderlabs.com',
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
                    id: '72e528f869711c3d',
                    manufacturer: 'Google',
                    model: 'sdk_gphone_x86',
                    name: 'generic_x86_arm',
                    token: 'some_device_token',
                    type: 'android',
                  },
                  screen: {
                    density: 2,
                  },
                },
                type: 'track',
                event: 'product added',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '00000000000000000000000000',
                userId: '123456',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              userId: '123456',
              topicId: 'test',
              attributes: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlepubsub',
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
                  email: 'ruchira@rudderlabs.com',
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
                  id: '72e528f869711c3d',
                  manufacturer: 'Google',
                  model: 'sdk_gphone_x86',
                  name: 'generic_x86_arm',
                  token: 'some_device_token',
                  type: 'android',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              event: 'product added',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'product added',
                    to: 'test',
                  },
                ],
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
            output: {
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
                    email: 'ruchira@rudderlabs.com',
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
                    id: '72e528f869711c3d',
                    manufacturer: 'Google',
                    model: 'sdk_gphone_x86',
                    name: 'generic_x86_arm',
                    token: 'some_device_token',
                    type: 'android',
                  },
                  screen: {
                    density: 2,
                  },
                },
                type: 'track',
                event: 'product added',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '00000000000000000000000000',
                userId: '123456',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              userId: '123456',
              topicId: 'test',
              attributes: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlepubsub',
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
                  email: 'ruchira@rudderlabs.com',
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
                  id: '72e528f869711c3d',
                  manufacturer: 'Google',
                  model: 'sdk_gphone_x86',
                  name: 'generic_x86_arm',
                  token: 'some_device_token',
                  type: 'android',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              event: 'product added',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: '*',
                    to: 'test',
                  },
                ],
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
            output: {
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
                    email: 'ruchira@rudderlabs.com',
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
                    id: '72e528f869711c3d',
                    manufacturer: 'Google',
                    model: 'sdk_gphone_x86',
                    name: 'generic_x86_arm',
                    token: 'some_device_token',
                    type: 'android',
                  },
                  screen: {
                    density: 2,
                  },
                },
                type: 'track',
                event: 'product added',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '00000000000000000000000000',
                userId: '123456',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              userId: '123456',
              topicId: 'test',
              attributes: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlepubsub',
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
                traits: {
                  email: 'ruchira@rudderlabs.com',
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
                  id: '72e528f869711c3d',
                  manufacturer: 'Google',
                  model: 'sdk_gphone_x86',
                  name: 'generic_x86_arm',
                  token: 'some_device_token',
                  type: 'android',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              event: 'product added',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'test event',
                    to: 'test',
                  },
                ],
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
            error: 'No topic set for this event',
            statTags: {
              destType: 'GOOGLEPUBSUB',
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
    name: 'googlepubsub',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2020-08-28T15:11:56.167Z',
              category: 'Food',
              messageId:
                'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
              anonymousId: 'abcdeeeeeeeexxxx111',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              originalTimestamp: '2020-08-28T15:11:56.162Z',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              type: 'track',
              name: 'Pizza',
              _metadata: {
                nodeVersion: '10.22.0',
              },
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: '',
                  },
                ],
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
            error: 'No topic set for this event',
            statTags: {
              destType: 'GOOGLEPUBSUB',
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
    name: 'googlepubsub',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2020-08-28T15:11:56.167Z',
              category: 'Food',
              messageId:
                'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
              anonymousId: 'abcdeeeeeeeexxxx111',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              originalTimestamp: '2020-08-28T15:11:56.162Z',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              type: 'track',
              name: 'Pizza',
              _metadata: {
                nodeVersion: '10.22.0',
              },
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: '',
                  },
                ],
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
            error: 'No topic set for this event',
            statTags: {
              destType: 'GOOGLEPUBSUB',
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
    name: 'googlepubsub',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2020-08-28T15:11:56.167Z',
              category: 'Food',
              messageId:
                'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
              anonymousId: 'abcdeeeeeeeexxxx111',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              originalTimestamp: '2020-08-28T15:11:56.162Z',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              type: 'track',
              name: 'Pizza',
              _metadata: {
                nodeVersion: '10.22.0',
              },
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: 'test',
                  },
                  {
                    from: '*',
                    to: 'test a',
                  },
                ],
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
            output: {
              message: {
                sentAt: '2020-08-28T15:11:56.167Z',
                category: 'Food',
                messageId:
                  'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
                anonymousId: 'abcdeeeeeeeexxxx111',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                originalTimestamp: '2020-08-28T15:11:56.162Z',
                properties: {
                  url: 'https://dominos.com',
                  title: 'Pizza',
                  referrer: 'https://google.com',
                },
                type: 'track',
                name: 'Pizza',
                _metadata: {
                  nodeVersion: '10.22.0',
                },
              },
              userId: 'abcdeeeeeeeexxxx111',
              topicId: 'test',
              attributes: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlepubsub',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2020-08-28T15:11:56.167Z',
              category: 'Food',
              messageId:
                'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
              anonymousId: 'abcdeeeeeeeexxxx111',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              originalTimestamp: '2020-08-28T15:11:56.162Z',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              type: 'track',
              event: 'product added',
              name: 'Pizza',
              _metadata: {
                nodeVersion: '10.22.0',
              },
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: 'test',
                  },
                  {
                    from: '*',
                    to: 'test a',
                  },
                  {
                    from: 'product added',
                    to: 'test b',
                  },
                ],
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
            output: {
              message: {
                sentAt: '2020-08-28T15:11:56.167Z',
                category: 'Food',
                messageId:
                  'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
                anonymousId: 'abcdeeeeeeeexxxx111',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                originalTimestamp: '2020-08-28T15:11:56.162Z',
                properties: {
                  url: 'https://dominos.com',
                  title: 'Pizza',
                  referrer: 'https://google.com',
                },
                type: 'track',
                event: 'product added',
                name: 'Pizza',
                _metadata: {
                  nodeVersion: '10.22.0',
                },
              },
              userId: 'abcdeeeeeeeexxxx111',
              topicId: 'test b',
              attributes: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlepubsub',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2020-08-28T15:11:56.167Z',
              category: 'Food',
              messageId:
                'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
              anonymousId: 'abcdeeeeeeeexxxx111',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              originalTimestamp: '2020-08-28T15:11:56.162Z',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              type: 'track',
              event: 'product added',
              name: 'Pizza',
              _metadata: {
                nodeVersion: '10.22.0',
              },
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: 'Test-Topic',
                  },
                ],
                eventToAttributesMap: [
                  {
                    from: 'track',
                    to: 'name',
                  },
                ],
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
            output: {
              message: {
                sentAt: '2020-08-28T15:11:56.167Z',
                category: 'Food',
                messageId:
                  'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
                anonymousId: 'abcdeeeeeeeexxxx111',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                originalTimestamp: '2020-08-28T15:11:56.162Z',
                properties: {
                  url: 'https://dominos.com',
                  title: 'Pizza',
                  referrer: 'https://google.com',
                },
                type: 'track',
                event: 'product added',
                name: 'Pizza',
                _metadata: {
                  nodeVersion: '10.22.0',
                },
              },
              userId: 'abcdeeeeeeeexxxx111',
              topicId: 'Test-Topic',
              attributes: {
                name: 'Pizza',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlepubsub',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2020-08-28T15:11:56.167Z',
              category: 'Food',
              messageId:
                'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
              anonymousId: 'abcdeeeeeeeexxxx111',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              originalTimestamp: '2020-08-28T15:11:56.162Z',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              type: 'track',
              event: 'product added',
              name: 'Pizza',
              _metadata: {
                nodeVersion: '10.22.0',
              },
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: 'Test-Topic',
                  },
                ],
                eventToAttributesMap: [
                  {
                    from: 'track',
                    to: 'url',
                  },
                  {
                    from: 'track',
                    to: 'title',
                  },
                ],
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
            output: {
              message: {
                sentAt: '2020-08-28T15:11:56.167Z',
                category: 'Food',
                messageId:
                  'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
                anonymousId: 'abcdeeeeeeeexxxx111',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                originalTimestamp: '2020-08-28T15:11:56.162Z',
                properties: {
                  url: 'https://dominos.com',
                  title: 'Pizza',
                  referrer: 'https://google.com',
                },
                type: 'track',
                event: 'product added',
                name: 'Pizza',
                _metadata: {
                  nodeVersion: '10.22.0',
                },
              },
              userId: 'abcdeeeeeeeexxxx111',
              topicId: 'Test-Topic',
              attributes: {
                url: 'https://dominos.com',
                title: 'Pizza',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlepubsub',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2020-08-28T15:11:56.167Z',
              category: 'Food',
              messageId:
                'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
              anonymousId: 'abcdeeeeeeeexxxx111',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              originalTimestamp: '2020-08-28T15:11:56.162Z',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              type: 'track',
              event: 'product added',
              name: 'Pizza',
              _metadata: {
                nodeVersion: '10.22.0',
              },
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: 'Test-Topic',
                  },
                ],
                eventToAttributesMap: [
                  {
                    from: 'track',
                    to: 'url',
                  },
                  {
                    from: 'track',
                    to: 'title',
                  },
                  {
                    from: 'product added',
                    to: 'referrer',
                  },
                ],
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
            output: {
              message: {
                sentAt: '2020-08-28T15:11:56.167Z',
                category: 'Food',
                messageId:
                  'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
                anonymousId: 'abcdeeeeeeeexxxx111',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                originalTimestamp: '2020-08-28T15:11:56.162Z',
                properties: {
                  url: 'https://dominos.com',
                  title: 'Pizza',
                  referrer: 'https://google.com',
                },
                type: 'track',
                event: 'product added',
                name: 'Pizza',
                _metadata: {
                  nodeVersion: '10.22.0',
                },
              },
              userId: 'abcdeeeeeeeexxxx111',
              topicId: 'Test-Topic',
              attributes: {
                referrer: 'https://google.com',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlepubsub',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2020-08-28T15:11:56.167Z',
              category: 'Food',
              messageId:
                'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
              anonymousId: 'abcdeeeeeeeexxxx111',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              originalTimestamp: '2020-08-28T15:11:56.162Z',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
                nestedObject: {
                  this: 'will be picked',
                },
              },
              type: 'track',
              name: 'Pizza',
              _metadata: {
                nodeVersion: '10.22.0',
              },
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: 'Test-Topic',
                  },
                ],
                eventToAttributesMap: [
                  {
                    from: 'track',
                    to: 'nestedObject.this',
                  },
                ],
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
            output: {
              message: {
                sentAt: '2020-08-28T15:11:56.167Z',
                category: 'Food',
                messageId:
                  'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
                anonymousId: 'abcdeeeeeeeexxxx111',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                originalTimestamp: '2020-08-28T15:11:56.162Z',
                properties: {
                  url: 'https://dominos.com',
                  title: 'Pizza',
                  referrer: 'https://google.com',
                  nestedObject: {
                    this: 'will be picked',
                  },
                },
                type: 'track',
                name: 'Pizza',
                _metadata: {
                  nodeVersion: '10.22.0',
                },
              },
              userId: 'abcdeeeeeeeexxxx111',
              topicId: 'Test-Topic',
              attributes: {
                this: 'will be picked',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlepubsub',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              sentAt: '2020-08-28T15:11:56.167Z',
              category: 'Food',
              messageId:
                'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
              anonymousId: 'abcdeeeeeeeexxxx111',
              context: {
                library: {
                  name: 'analytics-node',
                  version: '0.0.3',
                },
              },
              originalTimestamp: '2020-08-28T15:11:56.162Z',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
                nestedObject: {
                  this: 'will be picked',
                },
              },
              type: 'track',
              name: 'Pizza',
              _metadata: {
                nodeVersion: '10.22.0',
              },
            },
            destination: {
              Config: {
                credentials: 'abc',
                eventToTopicMap: [
                  {
                    from: 'track',
                    to: 'Test-Topic',
                  },
                ],
                eventToAttributesMap: [
                  {
                    from: 'track',
                    to: 'properties.nestedObject.this',
                  },
                ],
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
            output: {
              message: {
                sentAt: '2020-08-28T15:11:56.167Z',
                category: 'Food',
                messageId:
                  'node-cfc5fb7ec83b82bc29e16336a11331e2-0ba97212-0f6e-44cd-a0f1-c20b8b7a7cba',
                anonymousId: 'abcdeeeeeeeexxxx111',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                originalTimestamp: '2020-08-28T15:11:56.162Z',
                properties: {
                  url: 'https://dominos.com',
                  title: 'Pizza',
                  referrer: 'https://google.com',
                  nestedObject: {
                    this: 'will be picked',
                  },
                },
                type: 'track',
                name: 'Pizza',
                _metadata: {
                  nodeVersion: '10.22.0',
                },
              },
              userId: 'abcdeeeeeeeexxxx111',
              topicId: 'Test-Topic',
              attributes: {
                this: 'will be picked',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
