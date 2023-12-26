export const data = [
  {
    name: 'intercom',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
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
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  apiKey: 'intercomApiKey',
                  appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                  collectContext: false,
                },
              },
            },
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
              metadata: {
                jobId: 2,
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
          destType: 'intercom',
        },
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
                    name: 'Test Name',
                    signed_up_at: 1601493060,
                    last_seen_user_agent: 'unknown',
                    update_last_request_at: true,
                    user_id: 'test_user_id_1',
                    custom_attributes: {
                      anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                      key1: 'value1',
                    },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
                userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
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
                  apiKey: 'intercomApiKey',
                  appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                  collectContext: false,
                },
              },
            },
            {
              batchedRequest: {
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
                    name: 'Test Name',
                    last_seen_user_agent: 'unknown',
                    update_last_request_at: true,
                    custom_attributes: {
                      anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
                      key1: 'value1',
                    },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
                userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
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
                  apiKey: 'intercomApiKey',
                  appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
                  collectContext: false,
                },
              },
            },
          ],
        },
      },
    },
  },
];
