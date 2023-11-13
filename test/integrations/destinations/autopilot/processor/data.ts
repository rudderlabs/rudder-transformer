export const data = [
  {
    name: 'autopilot',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'Autopilot',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'AUTOPILOT',
                DisplayName: 'Autopilot',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                customMappings: [
                  {
                    from: '0001',
                    to: 'Signup',
                  },
                ],
                triggerId: '00XX',
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
              integrations: {
                All: true,
              },
              messageId: 'fad9b3fb-5778-4db3-9fb6-7168b554191f',
              originalTimestamp: '2020-04-17T14:42:44.722Z',
              receivedAt: '2020-04-17T20:12:44.758+05:30',
              request_ip: '[::1]:53513',
              sentAt: '2020-04-17T14:42:44.722Z',
              traits: {
                age: 23,
                email: 'testmp@rudderstack.com',
                firstname: 'Test Kafka',
              },
              timestamp: '2020-04-17T20:12:44.758+05:30',
              type: 'identify',
              userId: 'user12345',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              endpoint: 'https://api2.autopilothq.com/v1/contact',
              headers: {
                Accept: 'application/json',
                autopilotapikey: 'dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  contact: {
                    Email: 'testmp@rudderstack.com',
                    FirstName: 'Test Kafka',
                    custom: {
                      age: 23,
                    },
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
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
    name: 'autopilot',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'Autopilot',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'AUTOPILOT',
                DisplayName: 'Autopilot',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                customMappings: [
                  {
                    from: '0001',
                    to: 'Signup',
                  },
                ],
                triggerId: '00XX',
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
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: '37b75e61-9bd2-4fb8-91ed-e3a064905f3a',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-17T20:12:44.758+05:30',
              request_ip: '[::1]:53512',
              sentAt: '2020-04-17T14:42:44.725Z',
              timestamp: '2020-04-17T20:12:44.757+05:30',
              type: 'track',
              userId: 'user12345',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              endpoint:
                'https://api2.autopilothq.com/v1/trigger/00XX/contact/testmp@rudderstack.com',
              headers: {
                Accept: 'application/json',
                autopilotapikey: 'dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  property: {
                    test_prop_1: 'test prop',
                    test_prop_2: 1232,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
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
    name: 'autopilot',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'Autopilot',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'AUTOPILOT',
                DisplayName: 'Autopilot',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                customMappings: [
                  {
                    from: '0001',
                    to: 'Signup',
                  },
                ],
                triggerId: '00XX',
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
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: '37b75e61-9bd2-4fb8-91ed-e3a064905f3a',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-17T20:12:44.758+05:30',
              request_ip: '[::1]:53512',
              sentAt: '2020-04-17T14:42:44.725Z',
              timestamp: '2020-04-17T20:12:44.757+05:30',
              type: 'page',
              userId: 'user12345',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            error:
              'message type page is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type page is not supported',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AUTOPILOT',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'autopilot',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'Autopilot',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'AUTOPILOT',
                DisplayName: 'Autopilot',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                customMappings: [
                  {
                    from: '0001',
                    to: 'Signup',
                  },
                ],
                triggerId: '00XX',
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
                  firstname: 'Test Kafka',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: '37b75e61-9bd2-4fb8-91ed-e3a064905f3a',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-17T20:12:44.758+05:30',
              request_ip: '[::1]:53512',
              sentAt: '2020-04-17T14:42:44.725Z',
              timestamp: '2020-04-17T20:12:44.757+05:30',
              type: 'track',
              userId: 'user12345',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            error:
              'Email is required for track calls: Workflow: procWorkflow, Step: preparePayloadForTrack, ChildStep: undefined, OriginalError: Email is required for track calls',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AUTOPILOT',
              module: 'destination',
              implementation: 'cdkV2',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'autopilot',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'Autopilot',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'AUTOPILOT',
                DisplayName: 'Autopilot',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                customMappings: [
                  {
                    from: '0001',
                    to: 'Signup',
                  },
                ],
                triggerId: '00XX',
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
                  firstname: 'Test Kafka',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: '37b75e61-9bd2-4fb8-91ed-e3a064905f3a',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-17T20:12:44.758+05:30',
              request_ip: '[::1]:53512',
              sentAt: '2020-04-17T14:42:44.725Z',
              timestamp: '2020-04-17T20:12:44.757+05:30',
              userId: 'user12345',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            error:
              'message Type is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message Type is not present. Aborting message.',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AUTOPILOT',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'autopilot',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'Autopilot',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'AUTOPILOT',
                DisplayName: 'Autopilot',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                customMappings: [
                  {
                    from: '0001',
                    to: 'Signup',
                  },
                ],
                triggerId: '00XX',
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
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: '37b75e61-9bd2-4fb8-91ed-e3a064905f3a',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-17T20:12:44.758+05:30',
              request_ip: '[::1]:53512',
              sentAt: '2020-04-17T14:42:44.725Z',
              timestamp: '2020-04-17T20:12:44.757+05:30',
              type: 'group',
              userId: 'user12345',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            error:
              'message type group is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type group is not supported',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AUTOPILOT',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'autopilot',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'Autopilot',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'AUTOPILOT',
                DisplayName: 'Autopilot',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                customMappings: [
                  {
                    from: '0001',
                    to: 'Signup',
                  },
                ],
                triggerId: '00XX',
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
                  email: 'abc@rudderstack.com',
                  firstname: 'Anuraj',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-04-17T14:42:44.722Z',
              receivedAt: '2020-04-17T20:12:44.758+05:30',
              request_ip: '[::1]:53513',
              sentAt: '2020-04-17T14:42:44.722Z',
              timestamp: '2020-04-17T20:12:44.758+05:30',
              type: 'identify',
              userId: 'user12345',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              endpoint: 'https://api2.autopilothq.com/v1/contact',
              headers: {
                Accept: 'application/json',
                autopilotapikey: 'dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  contact: {
                    Email: 'abc@rudderstack.com',
                    FirstName: 'Anuraj',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'autopilot',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'Autopilot',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'AUTOPILOT',
                DisplayName: 'Autopilot',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                customMappings: [
                  {
                    from: '0001',
                    to: 'Signup',
                  },
                ],
                triggerId: '00XX',
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
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: '37b75e61-9bd2-4fb8-91ed-e3a064905f3a',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-17T20:12:44.758+05:30',
              request_ip: '[::1]:53512',
              sentAt: '2020-04-17T14:42:44.725Z',
              timestamp: '2020-04-17T20:12:44.757+05:30',
              userId: 'user12345',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            error:
              'message Type is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message Type is not present. Aborting message.',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AUTOPILOT',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'autopilot',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'Autopilot',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'AUTOPILOT',
                DisplayName: 'Autopilot',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                customMappings: [
                  {
                    from: '0001',
                    to: 'Signup',
                  },
                ],
                triggerId: '00XX',
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
                  email: 'abc@rudderstack.com',
                  firstname: 'Anuraj',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-04-17T14:42:44.722Z',
              receivedAt: '2020-04-17T20:12:44.758+05:30',
              request_ip: '[::1]:53513',
              sentAt: '2020-04-17T14:42:44.722Z',
              timestamp: '2020-04-17T20:12:44.758+05:30',
              type: 'group',
              userId: 'user12345',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            error:
              'message type group is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type group is not supported',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AUTOPILOT',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'autopilot',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
              Name: 'Autopilot',
              DestinationDefinition: {
                ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
                Name: 'AUTOPILOT',
                DisplayName: 'Autopilot',
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                customMappings: [
                  {
                    from: '0001',
                    to: 'Signup',
                  },
                ],
                triggerId: '00XX',
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
                  email: 'abc@rudderstack.com',
                  firstname: 'Anuraj',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-04-17T14:42:44.722Z',
              receivedAt: '2020-04-17T20:12:44.758+05:30',
              request_ip: '[::1]:53513',
              sentAt: '2020-04-17T14:42:44.722Z',
              timestamp: '2020-04-17T20:12:44.758+05:30',
              type: 'Tals',
              userId: 'user12345',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            error:
              'message type Tals is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type Tals is not supported',
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'AUTOPILOT',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
];
