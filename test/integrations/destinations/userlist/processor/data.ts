export const data = [
  {
    name: 'userlist',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                pushKey: 'userlist-push-key',
              },
            },
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
                  email: 'test@rudderstack.com',
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
              userId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'anon-id',
                email: 'test@gmail.com',
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                JSON: {
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
                      email: 'test@rudderstack.com',
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
                  userId: '123456',
                  integrations: {
                    All: true,
                  },
                  traits: {
                    anonymousId: 'anon-id',
                    email: 'test@gmail.com',
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
                FORM: {},
              },
              files: {},
              endpoint: 'https://incoming.userlist.com/rudderstack/events',
              headers: {
                Authorization: 'Push userlist-push-key',
                'Content-Type': 'application/json',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              userId: '',
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
    name: 'userlist',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                pushKey: 'userlist-push-key',
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'test@rudderstack.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.5',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 0.8999999761581421,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/html/sajal.html',
                  referrer: '',
                  search:
                    '?utm_source=google&utm_medium=medium&utm_term=keyword&utm_content=some%20content&utm_campaign=some%20campaign&utm_test=other%20value',
                  title: '',
                  url: 'http://localhost:9116/html/sajal.html?utm_source=google&utm_medium=medium&utm_term=keyword&utm_content=some%20content&utm_campaign=some%20campaign&utm_test=other%20value',
                },
              },
              type: 'group',
              messageId: 'e5034df0-a404-47b4-a463-76df99934fea',
              originalTimestamp: '2020-10-20T07:54:58.983Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'sampleusrRudder3',
              integrations: {
                All: true,
              },
              groupId: 'Sample_groupId23',
              traits: {
                KEY_3: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                KEY_2: {
                  CHILD_KEY_92: 'value_95',
                  CHILD_KEY_102: 'value_103',
                },
                name_trait: 'Company',
                value_trait: ['Comapny-ABC'],
              },
              sentAt: '2020-10-20T07:54:58.983Z',
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                JSON: {
                  channel: 'web',
                  context: {
                    app: {
                      build: '1.0.0',
                      name: 'RudderLabs JavaScript SDK',
                      namespace: 'com.rudderlabs.javascript',
                      version: '1.1.5',
                    },
                    traits: {
                      name: 'Shehan Study',
                      category: 'SampleIdentify',
                      email: 'test@rudderstack.com',
                      plan: 'Open source',
                      logins: 5,
                      createdAt: 1599264000,
                    },
                    library: {
                      name: 'RudderLabs JavaScript SDK',
                      version: '1.1.5',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                    locale: 'en-US',
                    os: {
                      name: '',
                      version: '',
                    },
                    screen: {
                      density: 0.8999999761581421,
                    },
                    campaign: {
                      source: 'google',
                      medium: 'medium',
                      term: 'keyword',
                      content: 'some content',
                      name: 'some campaign',
                      test: 'other value',
                    },
                    page: {
                      path: '/html/sajal.html',
                      referrer: '',
                      search:
                        '?utm_source=google&utm_medium=medium&utm_term=keyword&utm_content=some%20content&utm_campaign=some%20campaign&utm_test=other%20value',
                      title: '',
                      url: 'http://localhost:9116/html/sajal.html?utm_source=google&utm_medium=medium&utm_term=keyword&utm_content=some%20content&utm_campaign=some%20campaign&utm_test=other%20value',
                    },
                  },
                  type: 'group',
                  messageId: 'e5034df0-a404-47b4-a463-76df99934fea',
                  originalTimestamp: '2020-10-20T07:54:58.983Z',
                  anonymousId: 'my-anonymous-id-new',
                  userId: 'sampleusrRudder3',
                  integrations: {
                    All: true,
                  },
                  groupId: 'Sample_groupId23',
                  traits: {
                    KEY_3: {
                      CHILD_KEY_92: 'value_95',
                      CHILD_KEY_102: 'value_103',
                    },
                    KEY_2: {
                      CHILD_KEY_92: 'value_95',
                      CHILD_KEY_102: 'value_103',
                    },
                    name_trait: 'Company',
                    value_trait: ['Comapny-ABC'],
                  },
                  sentAt: '2020-10-20T07:54:58.983Z',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://incoming.userlist.com/rudderstack/events',
              headers: {
                Authorization: 'Push userlist-push-key',
                'Content-Type': 'application/json',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              userId: '',
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
    name: 'userlist',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                pushKey: 'userlist-push-key',
              },
            },
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
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
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
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
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
              body: {
                XML: {},
                JSON_ARRAY: {},
                JSON: {
                  channel: 'web',
                  context: {
                    app: {
                      build: '1.0.0',
                      name: 'RudderLabs JavaScript SDK',
                      namespace: 'com.rudderlabs.javascript',
                      version: '1.0.0',
                    },
                    traits: {
                      email: 'test@rudderstack.com',
                      anonymousId: '12345',
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
                  type: 'track',
                  messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
                  originalTimestamp: '2019-10-14T11:15:18.300Z',
                  anonymousId: '00000000000000000000000000',
                  userId: '12345',
                  event: 'test track event',
                  properties: {
                    user_actual_role: 'system_admin',
                    user_actual_id: 12345,
                    user_time_spent: 50000,
                  },
                  integrations: {
                    All: true,
                  },
                  sentAt: '2019-10-14T11:15:53.296Z',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'https://incoming.userlist.com/rudderstack/events',
              headers: {
                Authorization: 'Push userlist-push-key',
                'Content-Type': 'application/json',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
              userId: '',
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
    name: 'userlist',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                pushKey: 'userlist-push-key',
              },
            },
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
                  email: 'test@rudderstack.com',
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
                email: 'test@gmail.com',
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
              'userId is required: Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: userId is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'USERLIST',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
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
    name: 'userlist',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                pushKey: 'userlist-push-key',
              },
            },
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
                  email: 'test@rudderstack.com',
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
                email: 'test@gmail.com',
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
              'userId is required: Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: userId is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'USERLIST',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
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
    name: 'userlist',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                pushKey: 'userlist-push-key',
              },
            },
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
                  email: 'test@rudderstack.com',
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
              type: 'page',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'anon-id',
                email: 'test@gmail.com',
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
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'USERLIST',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
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
