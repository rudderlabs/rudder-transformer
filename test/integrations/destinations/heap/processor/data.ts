export const data = [
  {
    name: 'heap',
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
                appId: '<app id>',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
                DisplayName: 'Heap.io',
                ID: '1WTbl0l5GjOQKOvfmcGwk0T49kV',
                Name: 'HEAP',
              },
              Enabled: true,
              ID: '1WTcDSEOE437e4ePH10BJNELXmE',
              Name: 'heap test',
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              messageId: 'fca2e71a-5d30-48e1-ba45-761c16e3820f',
              originalTimestamp: '2020-01-16T13:21:59.076Z',
              receivedAt: '2020-01-16T18:52:03.871+05:30',
              request_ip: '[::1]:62312',
              sentAt: '2020-01-16T13:22:03.85Z',
              timestamp: '2020-01-16T18:51:59.097+05:30',
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
              endpoint: 'https://heapanalytics.com/api/add_user_properties',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  identity: 'sampath',
                  properties: {
                    anonymousId: 'sampath',
                    email: 'sampath@gmail.com',
                  },
                  app_id: '<app id>',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'heap',
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
                appId: '<app id>',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
                DisplayName: 'Heap.io',
                ID: '1WTbl0l5GjOQKOvfmcGwk0T49kV',
                Name: 'HEAP',
              },
              Enabled: true,
              ID: '1WTcDSEOE437e4ePH10BJNELXmE',
              Name: 'heap test',
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Send Transactional Email',
              integrations: {
                All: true,
              },
              messageId: 'c0c5b892-0d54-449f-b85f-ebb39ff04e67',
              originalTimestamp: '2020-01-16T13:23:20.844Z',
              properties: {
                subject: 'Welcome to My App!',
                variation: 'A',
              },
              receivedAt: '2020-01-16T18:53:23.804+05:30',
              request_ip: '[::1]:62312',
              sentAt: '2020-01-16T13:23:23.782Z',
              timestamp: '2020-01-16T18:53:20.866+05:30',
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
              endpoint: 'https://heapanalytics.com/api/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  identity: 'sampath',
                  event: 'Send Transactional Email',
                  properties: {
                    subject: 'Welcome to My App!',
                    variation: 'A',
                  },
                  app_id: '<app id>',
                  timestamp: '2020-01-16T18:53:20.866+05:30',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'heap',
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
                appId: '<app id>',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
                DisplayName: 'Heap.io',
                ID: '1WTbl0l5GjOQKOvfmcGwk0T49kV',
                Name: 'HEAP',
              },
              Enabled: true,
              ID: '1WTcDSEOE437e4ePH10BJNELXmE',
              Name: 'heap test',
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              messageId: 'fca2e71a-5d30-48e1-ba45-761c16e3820f',
              originalTimestamp: '2020-01-16T13:21:59.076Z',
              receivedAt: '2020-01-16T18:52:03.871+05:30',
              request_ip: '[::1]:62312',
              sentAt: '2020-01-16T13:22:03.85Z',
              timestamp: '2020-01-16T18:51:59.097+05:30',
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
            error: 'invalid message type for heap',
            statTags: {
              destType: 'HEAP',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'heap',
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
                appId: '<app id>',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
                DisplayName: 'Heap.io',
                ID: '1WTbl0l5GjOQKOvfmcGwk0T49kV',
                Name: 'HEAP',
              },
              Enabled: true,
              ID: '1WTcDSEOE437e4ePH10BJNELXmE',
              Name: 'heap test',
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Send Transactional Email',
              integrations: {
                All: true,
              },
              messageId: 'c0c5b892-0d54-449f-b85f-ebb39ff04e67',
              originalTimestamp: '2020-01-16T13:23:20.844Z',
              properties: {
                subject: 'Welcome to My App!',
                variation: 'A',
              },
              receivedAt: '2020-01-16T18:53:23.804+05:30',
              request_ip: '[::1]:62312',
              sentAt: '2020-01-16T13:23:23.782Z',
              timestamp: '2020-01-16T18:53:20.866+05:30',
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
            error: 'message type page not supported for heap',
            statTags: {
              destinationId: 'destId',
              workspaceId: 'wspId',
              destType: 'HEAP',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'heap',
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
                appId: '<app id>',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
                DisplayName: 'Heap.io',
                ID: '1WTbl0l5GjOQKOvfmcGwk0T49kV',
                Name: 'HEAP',
              },
              Enabled: true,
              ID: '1WTcDSEOE437e4ePH10BJNELXmE',
              Name: 'heap test',
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Send Transactional Email',
              integrations: {
                All: true,
              },
              messageId: 'c0c5b892-0d54-449f-b85f-ebb39ff04e67',
              properties: {
                subject: 'Welcome to My App!',
                variation: 'A',
                idempotencyKey: '1234',
              },
              receivedAt: '2020-01-16T18:53:23.804+05:30',
              request_ip: '[::1]:62312',
              sentAt: '2020-01-16T13:23:23.782Z',
              timestamp: '2021-02-16T18:53:20.866+05:30',
              originalTimestamp: '2021-02-16T18:53:20.866+05:30',
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
              endpoint: 'https://heapanalytics.com/api/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  identity: 'sampath',
                  event: 'Send Transactional Email',
                  properties: {
                    subject: 'Welcome to My App!',
                    variation: 'A',
                  },
                  timestamp: '2021-02-16T18:53:20.866+05:30',
                  idempotency_key: '1234',
                  app_id: '<app id>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'heap',
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
                appId: '<app id>',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
                DisplayName: 'Heap.io',
                ID: '1WTbl0l5GjOQKOvfmcGwk0T49kV',
                Name: 'HEAP',
              },
              Enabled: true,
              ID: '1WTcDSEOE437e4ePH10BJNELXmE',
              Name: 'heap test',
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Send Transactional Email',
              integrations: {
                All: true,
              },
              messageId: 'c0c5b892-0d54-449f-b85f-ebb39ff04e67',
              originalTimestamp: '2020-01-17T13:23:20.844Z',
              properties: {
                subject: 'Welcome to My App!',
                variation: 'A',
                idempotencyKey: '1234',
              },
              receivedAt: '2020-01-16T18:53:23.804+05:30',
              request_ip: '[::1]:62312',
              sentAt: '2020-01-16T13:23:23.782Z',
              timestamp: '2020-01-16T18:53:20.866+05:30',
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
              endpoint: 'https://heapanalytics.com/api/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  identity: 'sampath',
                  event: 'Send Transactional Email',
                  properties: {
                    subject: 'Welcome to My App!',
                    variation: 'A',
                  },
                  timestamp: '2020-01-16T18:53:20.866+05:30',
                  idempotency_key: '1234',
                  app_id: '<app id>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'heap',
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
                appId: '<app id>',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
                DisplayName: 'Heap.io',
                ID: '1WTbl0l5GjOQKOvfmcGwk0T49kV',
                Name: 'HEAP',
              },
              Enabled: true,
              ID: '1WTcDSEOE437e4ePH10BJNELXmE',
              Name: 'heap test',
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Send Transactional Email',
              integrations: {
                All: true,
              },
              messageId: 'c0c5b892-0d54-449f-b85f-ebb39ff04e67',
              originalTimestamp: '2020-01-17T13:23:20.844Z',
              properties: {
                Location: {
                  City: 'Los Angeles',
                  State: 'CA',
                },
                hobbies: ['Music', 'Running'],
              },
              receivedAt: '2020-01-16T18:53:23.804+05:30',
              request_ip: '[::1]:62312',
              sentAt: '2020-01-16T13:23:23.782Z',
              timestamp: '2020-01-16T18:53:20.866+05:30',
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
              endpoint: 'https://heapanalytics.com/api/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  identity: 'sampath',
                  event: 'Send Transactional Email',
                  properties: {
                    'Location.City': 'Los Angeles',
                    'Location.State': 'CA',
                    'hobbies[0]': 'Music',
                    'hobbies[1]': 'Running',
                  },
                  timestamp: '2020-01-16T18:53:20.866+05:30',
                  app_id: '<app id>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'heap',
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
                appId: '<app id>',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
                DisplayName: 'Heap.io',
                ID: '1WTbl0l5GjOQKOvfmcGwk0T49kV',
                Name: 'HEAP',
              },
              Enabled: true,
              ID: '1WTcDSEOE437e4ePH10BJNELXmE',
              Name: 'heap test',
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                traits: {
                  anonymousId: 'sampath',
                  email: 'sampath@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Send Transactional Email',
              integrations: {
                All: true,
              },
              messageId: 'c0c5b892-0d54-449f-b85f-ebb39ff04e67',
              originalTimestamp: '2020-01-17T13:23:20.844Z',
              properties: {
                subject: 'Welcome to My App!',
                variation: 'A',
              },
              receivedAt: '2020-01-16T18:53:23.804+05:30',
              request_ip: '[::1]:62312',
              sentAt: '2020-01-16T13:23:23.782Z',
              timestamp: '2020-01-16T18:53:20.866+05:30',
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
              endpoint: 'https://heapanalytics.com/api/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  identity: 'sampath',
                  event: 'Send Transactional Email',
                  properties: {
                    subject: 'Welcome to My App!',
                    variation: 'A',
                  },
                  timestamp: '2020-01-16T18:53:20.866+05:30',
                  app_id: '<app id>',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sampath',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
];
