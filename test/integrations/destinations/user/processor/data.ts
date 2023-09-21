export const data = [
  {
    name: 'user',
    description: 'No Message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'test@123',
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  username: 'Samle_putUserName',
                  firstName: 'uday',
                },
              },
              integrations: { All: true, 'user.com': { lookup: 'email' } },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appSubdomain: 'commander',
                userEvents: [{ rsEventName: 'login', userEventName: 'product viewed' }],
                companyAttributesMapping: [
                  { from: 'category', to: 'companycategory' },
                  { from: 'owner', to: 'companyowner' },
                ],
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type is required',
            statTags: {
              destType: 'USER',
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
    name: 'user',
    description: 'Unsupported Type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'test@123',
              type: 'trackUser',
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  firstName: 'test',
                  lastName: 'rudderstack',
                  age: 15,
                  gender: 'male',
                  status: 'user',
                  city: 'Kalkata',
                  country: 'india',
                  tags: ['productuser'],
                  phone: '9876543210',
                },
                externalId: [{ type: 'userKey', id: 'masncbjasbdljajdl' }],
              },
              traits: { googleUrl: 'www.google.com' },
            },
            destination: {
              Config: { apiKey: 'dummyApiKey', appSubdomain: 'commander' },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type trackuser is not supported',
            statTags: {
              destType: 'USER',
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
    name: 'user',
    description: 'track call without event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user@123',
              type: 'track',
              properties: { category: 'e-commerce', activity: 'user logged in' },
              traits: { email: 'rudderstack@test.com' },
              integrations: { 'user.com': { lookup: 'email' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: { apiKey: 'dummyApiKey', appSubdomain: 'commander' },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Parameter event is required',
            statTags: {
              destType: 'USER',
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
    name: 'user',
    description: 'group call without name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                email: 'business@rudderstack.com',
                plan: 'premium',
                logins: 5,
                address: {
                  street: '6th St',
                  city: 'San Francisco',
                  state: 'CA',
                  postalCode: '94103',
                  country: 'USA',
                },
              },
              type: 'group',
              userId: 'user@123',
            },
            destination: {
              Config: { apiKey: 'dummyApiKey', appSubdomain: 'commander' },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Parameter name is required',
            statTags: {
              destType: 'USER',
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
    name: 'user',
    description: 'identify call with userKey as externalId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'test@16',
              type: 'identify',
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  firstName: 'test',
                  lastName: 'rudderstack',
                  age: 15,
                  gender: 'male',
                  status: 'user',
                  city: 'Kalkata',
                  country: 'india',
                  tags: ['productuser'],
                  phone: '9876543210',
                  useroccupation: 'software engineer',
                },
                externalId: [{ type: 'userKey', id: 'lel1c5u1wuk8' }],
              },
              traits: { googleUrl: 'www.google.com' },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appSubdomain: 'commander',
                userAttributesMapping: [{ from: 'useroccupation', to: 'occupation' }],
              },
            },
          },
        ],
        method: 'POST',
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
                  age: 15,
                  country: 'india',
                  custom_id: 'test@16',
                  email: 'test@rudderstack.com',
                  first_name: 'test',
                  gender: 2,
                  google_url: 'www.google.com',
                  last_name: 'rudderstack',
                  occupation: 'software engineer',
                  phone_number: '9876543210',
                  status: 2,
                  tags: ['productuser'],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://commander.user.com/api/public/users/27/',
              files: {},
              headers: {
                Accept: '*/*;version=2',
                Authorization: 'Token dummyApiKey',
                'Content-Type': 'application/json',
              },
              method: 'PUT',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'user',
    description: 'identify call with email as lookup field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'test@12',
              type: 'identify',
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  firstName: 'test',
                  lastName: 'rudderstack',
                  age: 15,
                  gender: 'female',
                  status: 'visitor',
                  city: 'ahmedabad',
                  country: 'india',
                  phone: '9876543210',
                  useroccupation: 'mechanical engineer',
                },
              },
              traits: { googleUrl: 'www.google.com' },
              integrations: { All: true, 'user.com': { lookup: 'email' } },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appSubdomain: 'commander',
                userAttributesMapping: [{ from: 'useroccupation', to: 'occupation' }],
              },
            },
          },
        ],
        method: 'POST',
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
                FORM: {},
                JSON: {
                  age: 15,
                  email: 'test@rudderstack.com',
                  gender: 3,
                  status: 1,
                  country: 'india',
                  custom_id: 'test@12',
                  last_name: 'rudderstack',
                  first_name: 'test',
                  google_url: 'www.google.com',
                  occupation: 'mechanical engineer',
                  phone_number: '9876543210',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              headers: {
                Accept: '*/*;version=2',
                'Content-Type': 'application/json',
                Authorization: 'Token dummyApiKey',
              },
              version: '1',
              endpoint: 'https://commander.user.com/api/public/users/59/',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'user',
    description: 'track call without any lookup field(fallback to userId)',
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
                  version: '1.1.1-rc.2',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.1-rc.2' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: { density: 2 },
                traits: { age: 23, email: 'testmp@rudderstack.com', firstname: 'Test Kafka' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              event: 'login',
              messageId: '37b75e61-9bd2-4fb8-91ed-e3a064905f3a',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              properties: { test_prop_1: 'test prop', test_prop_2: 1232 },
              timestamp: '2022-09-13T20:12:44.757+05:30',
              type: 'track',
              userId: '43',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appSubdomain: 'commander',
                userAttributesMapping: [{ from: 'useroccupation', to: 'occupation' }],
                userEvents: [
                  {
                    rsEventName: 'login',
                    userEventName: 'product viewed',
                    eventProperties: [{ from: 'count', to: 'productcount' }],
                  },
                ],
              },
            },
          },
        ],
        method: 'POST',
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
                FORM: {},
                JSON: {
                  data: { test_prop_1: 'test prop', test_prop_2: 1232 },
                  name: 'product viewed',
                  user_id: 44,
                  timestamp: 1663080164,
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                Accept: '*/*;version=2',
                'Content-Type': 'application/json',
                Authorization: 'Token dummyApiKey',
              },
              version: '1',
              endpoint: 'https://commander.user.com/api/public/events/',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'user',
    description: 'page call without any lookup field(fallback to userId)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              category: 'page category',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                campaign: {},
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.9' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                page: {
                  path: '/testing',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://pagecall.com/testing',
                },
                screen: { density: 2 },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '397fdf96-daee-46c8-ac38-5d717cd8cabd',
              name: 'page name',
              originalTimestamp: '2021-01-04T14:13:05.801+05:30',
              properties: {
                category: 'page category',
                name: 'page name',
                path: '/testing',
                referrer: '',
                search: '',
                title: '',
                url: 'https://pagecall.com/testing',
              },
              request_ip: '[::1]',
              rudderId: '2d03081c-8053-4cce-9abf-bb024f747900',
              timestamp: '2021-01-04T14:13:05.801+05:30',
              type: 'page',
              userId: '43',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appSubdomain: 'commander',
                userAttributesMapping: [{ from: 'useroccupation', to: 'occupation' }],
                userEvents: [
                  {
                    rsEventName: 'login',
                    userEventName: 'product viewed',
                    eventProperties: [{ from: 'count', to: 'productcount' }],
                  },
                ],
              },
            },
          },
        ],
        method: 'POST',
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
                FORM: {},
                JSON: {
                  page_path: '/testing',
                  timestamp: '2021-01-04T14:13:05.801+05:30',
                  client_user: 'rpl0vjwysmc0',
                  page_domain: 'https://pagecall.com/testing',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                Accept: '*/*;version=2',
                'Content-Type': 'application/json',
                Authorization: 'Token dummyApiKey',
              },
              version: '1',
              endpoint: 'https://commander.user.com/api/public/site-views/',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'user',
    description: 'User.com group call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'browser',
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              userId: 'user@123',
              groupId: 'group@795',
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                name: 'rudder ventures',
                email: 'business@rudderstack.com',
                address: {
                  street: '6th St',
                  city: 'San Francisco',
                  state: 'CA',
                  postalCode: '94103',
                  country: 'USA',
                  owner: 'testuser',
                },
              },
              type: 'group',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appSubdomain: 'commander',
                userAttributesMapping: [{ from: 'useroccupation', to: 'occupation' }],
                userEvents: [
                  {
                    rsEventName: 'login',
                    userEventName: 'product viewed',
                    eventProperties: [{ from: 'count', to: 'productcount' }],
                  },
                ],
                companyAttributesMapping: [
                  { from: 'category', to: 'companycategory' },
                  { from: 'owner', to: 'companyowner' },
                ],
              },
            },
          },
        ],
        method: 'POST',
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
                FORM: {},
                JSON: { user_id: 52, user_custom_id: 'user@123' },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                Accept: '*/*;version=2',
                'Content-Type': 'application/json',
                Authorization: 'Token dummyApiKey',
              },
              version: '1',
              endpoint: 'https://commander.user.com/api/public/companies/21/add_member/',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
