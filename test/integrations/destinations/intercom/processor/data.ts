export const data = [
  {
    name: 'intercom',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  userId: 'test_user_id_1',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                  address: {
                    city: 'Kolkata',
                    state: 'West Bengal',
                  },
                  originalArray: [
                    {
                      nested_field: 'nested value',
                      tags: ['tag_1', 'tag_2', 'tag_3'],
                    },
                    {
                      nested_field: 'nested value',
                      tags: ['tag_1'],
                    },
                    {
                      nested_field: 'nested value',
                    },
                  ],
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'test_user_id_1',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  name: 'Test Name',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                    'address.city': 'Kolkata',
                    'address.state': 'West Bengal',
                    'originalArray[0].nested_field': 'nested value',
                    'originalArray[0].tags[0]': 'tag_1',
                    'originalArray[0].tags[1]': 'tag_2',
                    'originalArray[0].tags[2]': 'tag_3',
                    'originalArray[1].nested_field': 'nested value',
                    'originalArray[1].tags[0]': 'tag_1',
                    'originalArray[2].nested_field': 'nested value',
                  },
                  update_last_request_at: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: true,
                  name: 'Test Name',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: true,
                  name: 'Name',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  firstName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: true,
                  name: 'Name',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 4: ERROR - Either of `email` or `userId` is required for Identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  firstName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
            statusCode: 400,
            error: 'Either of `email` or `userId` is required for Identify call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'INTERCOM',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                  company: {
                    name: 'Test Comp',
                    id: 'company_id',
                    industry: 'test industry',
                    key1: 'value1',
                    key2: {
                      a: 'a',
                    },
                    key3: [1, 2, 3],
                  },
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: true,
                  name: 'Name',
                  companies: [
                    {
                      company_id: 'company_id',
                      custom_attributes: {
                        key1: 'value1',
                        key2: '{"a":"a"}',
                        key3: '[1,2,3]',
                      },
                      name: 'Test Comp',
                      industry: 'test industry',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                  company: {
                    name: 'Test Comp',
                    industry: 'test industry',
                    key1: 'value1',
                    key2: null,
                    key3: ['value1', 'value2'],
                    key4: {
                      foo: 'bar',
                    },
                  },
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
                updateLastRequestAt: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: false,
                  name: 'Name',
                  companies: [
                    {
                      company_id: 'c0277b5c814453e5135f515f943d085a',
                      custom_attributes: {
                        key1: 'value1',
                        key3: '["value1","value2"]',
                        key4: '{"foo":"bar"}',
                      },
                      name: 'Test Comp',
                      industry: 'test industry',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                  company: {
                    industry: 'test industry',
                    key1: 'value1',
                    key2: null,
                  },
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  update_last_request_at: true,
                  name: 'Name',
                  companies: [],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  userId: 'test_user_id_1',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              properties: {
                property1: 1,
                property2: 'test',
                property3: true,
                property4: '2020-10-05T09:09:03.731Z',
                property5: {
                  property1: 1,
                  property2: 'test',
                  property3: {
                    subProp1: {
                      a: 'a',
                      b: 'b',
                    },
                    subProp2: ['a', 'b'],
                  },
                },
                properties6: null,
                revenue: {
                  amount: 1232,
                  currency: 'inr',
                  test: 123,
                },
                price: {
                  amount: 3000,
                  currency: 'USD',
                },
                article: {
                  url: 'https://example.org/ab1de.html',
                  value: 'the dude abides',
                },
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/events',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'test_user_id_1',
                  email: 'test_1@test.com',
                  event_name: 'Test Event 2',
                  created: 1601493061,
                  metadata: {
                    revenue: {
                      amount: 1232,
                      currency: 'inr',
                      test: 123,
                    },
                    price: {
                      amount: 3000,
                      currency: 'USD',
                    },
                    article: {
                      url: 'https://example.org/ab1de.html',
                      value: 'the dude abides',
                    },
                    property1: 1,
                    property2: 'test',
                    property3: true,
                    property4: '2020-10-05T09:09:03.731Z',
                    'property5.property1': 1,
                    'property5.property2': 'test',
                    'property5.property3.subProp1.a': 'a',
                    'property5.property3.subProp1.b': 'b',
                    'property5.property3.subProp2[0]': 'a',
                    'property5.property3.subProp2[1]': 'b',
                    properties6: null,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  email: 'test_1@test.com',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/events',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  email: 'test_1@test.com',
                  event_name: 'Test Event 2',
                  created: 1601493061,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 10: ERROR - Either of `email` or `userId` is required for Track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
            statusCode: 400,
            error: 'Either of `email` or `userId` is required for Track call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'INTERCOM',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                externalId: [
                  {
                    identifierType: 'email',
                    id: 'test@gmail.com',
                  },
                ],
                mappedToDestination: true,
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                  email: 'test@gmail.com',
                  update_last_request_at: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
                sendAnonymousId: true,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer intercomApiKey',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  phone: '9876543210',
                  name: 'Test Name',
                  signed_up_at: 1601493060,
                  last_seen_user_agent: 'unknown',
                  custom_attributes: {
                    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                    key1: 'value1',
                  },
                  user_id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  update_last_request_at: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 13: ERROR - Either of `email` or `userId` is required for Identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              channel: 'mobile',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  name: 'Test Name',
                  firstName: 'Test',
                  lastName: 'Name',
                  createdAt: '2020-09-30T19:11:00.337Z',
                  phone: '9876543210',
                  key1: 'value1',
                },
                userAgent: 'unknown',
              },
              event: 'Test Event 2',
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              originalTimestamp: '2020-09-30T19:11:00.337Z',
              receivedAt: '2020-10-01T00:41:11.369+05:30',
              request_ip: '2405:201:8005:9856:7911:25e7:5603:5e18',
              sentAt: '2020-09-30T19:11:10.382Z',
              timestamp: '2020-10-01T00:41:01.324+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                apiKey: 'intercomApiKey',
                appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                collectContext: false,
                sendAnonymousId: false,
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
            statusCode: 400,
            error: 'Either of `email` or `userId` is required for Identify call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'INTERCOM',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              groupId: 'test_company_id_wdasda',
              traits: {
                employees: 450,
                plan: 'basic',
                userId: 'sdfrsdfsdfsf',
                email: 'test@test.com',
                name: 'rudderUpdate',
                size: '50',
                industry: 'IT',
                monthlySpend: '2131231',
                remoteCreatedAt: '1683017572',
                key1: 'val1',
              },
              anonymousId: 'sdfrsdfsdfsf',
              integrations: {
                All: true,
              },
              type: 'group',
              userId: 'sdfrsdfsdfsf',
            },
            destination: {
              Config: {
                apiKey: 'abcd=',
                appId: 'asdasdasd',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/companies',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  company_id: 'test_company_id_wdasda',
                  name: 'rudderUpdate',
                  plan: 'basic',
                  size: 50,
                  industry: 'IT',
                  monthly_spend: 2131231,
                  remote_created_at: 1683017572,
                  custom_attributes: {
                    employees: 450,
                    email: 'test@test.com',
                    key1: 'val1',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sdfrsdfsdfsf',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'sdfrsdfsdfsf',
                  companies: [
                    {
                      company_id: 'test_company_id_wdasda',
                      name: 'rudderUpdate',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sdfrsdfsdfsf',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              groupId: 'test_company_id',
              traits: {
                plan: 'basic',
                name: 'rudderUpdate',
                size: 50,
                industry: 'IT',
                monthlySpend: '2131231',
                email: 'comanyemail@abc.com',
              },
              anonymousId: '12312312',
              context: {
                app: {
                  build: '1.0',
                  name: 'Test_Example',
                  namespace: 'com.example.testapp',
                  version: '1.0',
                },
                device: {
                  id: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPod touch (7th generation)',
                  type: 'iOS',
                },
                library: {
                  name: 'test-ios-library',
                  version: '1.0.7',
                },
                locale: 'en-US',
                network: {
                  bluetooth: false,
                  carrier: 'unavailable',
                  cellular: false,
                  wifi: true,
                },
                os: {
                  name: 'iOS',
                  version: '14.0',
                },
                screen: {
                  density: 2,
                  height: 320,
                  width: 568,
                },
                timezone: 'Asia/Kolkata',
                userAgent: 'unknown',
              },
              integrations: {
                All: true,
              },
              messageId: '1601493060-39010c49-e6e4-4626-a75c-0dbf1925c9e8',
              type: 'group',
            },
            destination: {
              Config: {
                apiKey: 'abcd=',
                appId: 'asdasdasd',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/companies',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  company_id: 'test_company_id',
                  name: 'rudderUpdate',
                  plan: 'basic',
                  size: 50,
                  industry: 'IT',
                  monthly_spend: 2131231,
                  custom_attributes: {
                    email: 'comanyemail@abc.com',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '12312312',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              groupId: 'test_company_id_wdasda',
              context: {
                traits: {
                  email: 'testUser@test.com',
                },
              },
              traits: {
                employees: 450,
                plan: 'basic',
                email: 'test@test.com',
                name: 'rudderUpdate',
                size: '50',
                industry: 'IT',
                website: 'url',
                monthlySpend: '2131231',
                remoteCreatedAt: '1683017572',
                key1: 'val1',
              },
              anonymousId: 'sdfrsdfsdfsf',
              integrations: {
                All: true,
              },
              type: 'group',
              userId: 'sdfrsdfsdfsf',
            },
            destination: {
              Config: {
                apiKey: 'abcd=',
                appId: 'asdasdasd',
                collectContext: false,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/companies',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  company_id: 'test_company_id_wdasda',
                  name: 'rudderUpdate',
                  plan: 'basic',
                  size: 50,
                  website: 'url',
                  industry: 'IT',
                  monthly_spend: 2131231,
                  remote_created_at: 1683017572,
                  custom_attributes: {
                    employees: 450,
                    email: 'test@test.com',
                    key1: 'val1',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sdfrsdfsdfsf',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'sdfrsdfsdfsf',
                  email: 'testUser@test.com',
                  companies: [
                    {
                      company_id: 'test_company_id_wdasda',
                      name: 'rudderUpdate',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'sdfrsdfsdfsf',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'intercom',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              groupId: 'test_company_id_wdasda',
              context: {
                traits: {
                  email: 'testUser@test.com',
                },
              },
              traits: {
                employees: 450,
                plan: 'basic',
                email: 'test@test.com',
                name: 'rudderUpdate',
                size: '50',
                industry: 'IT',
                website: 'url',
                monthlySpend: '2131231',
                remoteCreatedAt: '1683017572',
                key1: 'val1',
                key2: {
                  a: 'a',
                  b: 'b',
                },
                key3: [1, 2, 3],
                key4: null,
              },
              anonymousId: 'anonId',
              integrations: {
                All: true,
              },
              type: 'group',
            },
            destination: {
              Config: {
                apiKey: 'abcd=',
                appId: 'asdasdasd',
                collectContext: false,
                sendAnonymousId: true,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/companies',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  company_id: 'test_company_id_wdasda',
                  name: 'rudderUpdate',
                  plan: 'basic',
                  size: 50,
                  website: 'url',
                  industry: 'IT',
                  monthly_spend: 2131231,
                  remote_created_at: 1683017572,
                  custom_attributes: {
                    employees: 450,
                    email: 'test@test.com',
                    key1: 'val1',
                    'key2.a': 'a',
                    'key2.b': 'b',
                    'key3[0]': 1,
                    'key3[1]': 2,
                    'key3[2]': 3,
                    key4: null,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anonId',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.intercom.io/users',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer abcd=',
                Accept: 'application/json',
                'Intercom-Version': '1.4',
              },
              params: {},
              body: {
                JSON: {
                  user_id: 'anonId',
                  email: 'testUser@test.com',
                  companies: [
                    {
                      company_id: 'test_company_id_wdasda',
                      name: 'rudderUpdate',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anonId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
