export const data = [
  {
    name: 'blueshift',
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
                Config: {
                  eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                  usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                  datacenterEU: false,
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.5',
                  },
                  traits: {
                    name: 'hardik',
                    email: 'hardik@rudderstack.com',
                    cookie: '1234abcd-efghklkj-1234kfjadslk-34iu123',
                    industry: 'Education',
                    employees: 399,
                    plan: 'enterprise',
                    'total billed': 830,
                  },
                },
                type: 'group',
                userId: 'rudderstack8',
                groupId: '35838',
              },
            },
            {
              destination: {
                Config: {
                  eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                  usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                  datacenterEU: false,
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                context: {
                  ip: '14.5.67.21',
                  device: {
                    adTrackingEnabled: true,
                    advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    manufacturer: 'Google',
                    model: 'AOSP on IA Emulator',
                    name: 'generic_x86_arm',
                    type: 'Android',
                    attTrackingStatus: 3,
                  },
                  os: {
                    name: 'Android',
                    version: '9',
                  },
                  network: {
                    bluetooth: false,
                    carrier: 'Android',
                    cellular: true,
                    wifi: true,
                  },
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 789223,
                    latitude: '37.7672319',
                    longitude: '-122.4021353',
                    state: 'WB',
                    street: 'rajnagar',
                  },
                },
                properties: {
                  cookie: '1234abcd-efghijkj-1234kfjadslk-34iu123',
                },
                messageId: '34abcd-efghijkj-1234kf',
                type: 'track',
                event: 'identify',
                userId: 'sampleusrRudder7',
              },
            },
            {
              destination: {
                Config: {
                  eventApiKey: 'a5e75d99c8a18acb4a29abd920ec1e2e',
                  usersApiKey: 'b4a29aba5e75d99c8a18acd920ec1e2e',
                  datacenterEU: false,
                },
              },
              metadata: {
                jobId: 3,
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
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                type: 'identify',
                traits: {
                  email: 'chandan@companyname.com',
                  userId: 'rudder123',
                  anonymousId: 'anon_id',
                  name: 'James Doe',
                  phone: '92374162212',
                  gender: 'M',
                  firstname: 'James',
                  lastname: 'Doe',
                  employed: true,
                  birthday: '1614775793',
                  education: 'Science',
                  graduate: true,
                  married: true,
                  customerType: 'Prime',
                  msg_push: true,
                  msgSms: true,
                  msgemail: true,
                  msgwhatsapp: false,
                  custom_tags: ['Test_User', 'Interested_User', 'DIY_Hobby'],
                  custom_mappings: {
                    Office: 'Trastkiv',
                    Country: 'Russia',
                  },
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 789223,
                    state: 'WB',
                    street: '',
                  },
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
          ],
          destType: 'blueshift',
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
                endpoint: 'https://api.getblueshift.com/api/v1/event',
                headers: {
                  Authorization: 'Basic ZWZlYjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q2MjBlYzE=',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    group_id: '35838',
                    customer_id: 'rudderstack8',
                    email: 'hardik@rudderstack.com',
                    event: 'identify',
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
                Config: {
                  eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                  usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                  datacenterEU: false,
                },
              },
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  FORM: {},
                  JSON: {
                    ip: '14.5.67.21',
                    event: 'identify',
                    cookie: '1234abcd-efghijkj-1234kfjadslk-34iu123',
                    os_name: 'Android',
                    latitude: '37.7672319',
                    device_id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    longitude: '-122.4021353',
                    event_uuid: '34abcd-efghijkj-1234kf',
                    customer_id: 'sampleusrRudder7',
                    device_idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    device_idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    device_type: 'Android',
                    network_carrier: 'Android',
                    device_manufacturer: 'Google',
                  },
                  JSON_ARRAY: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Basic ZWZlYjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q2MjBlYzE=',
                },
                version: '1',
                endpoint: 'https://api.getblueshift.com/api/v1/event',
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
                  eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                  usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                  datacenterEU: false,
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.getblueshift.com/api/v1/customers',
                headers: {
                  Authorization: 'Basic YjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q5MjBlYzFlMmU=',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    email: 'chandan@companyname.com',
                    customer_id: 'rudder123',
                    phone_number: '92374162212',
                    firstname: 'James',
                    lastname: 'Doe',
                    gender: 'M',
                    userId: 'rudder123',
                    anonymousId: 'anon_id',
                    name: 'James Doe',
                    employed: true,
                    birthday: '1614775793',
                    education: 'Science',
                    graduate: true,
                    married: true,
                    customerType: 'Prime',
                    msg_push: true,
                    msgSms: true,
                    msgemail: true,
                    msgwhatsapp: false,
                    custom_tags: ['Test_User', 'Interested_User', 'DIY_Hobby'],
                    custom_mappings: {
                      Office: 'Trastkiv',
                      Country: 'Russia',
                    },
                    address: {
                      city: 'kolkata',
                      country: 'India',
                      postalCode: 789223,
                      state: 'WB',
                      street: '',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  eventApiKey: 'a5e75d99c8a18acb4a29abd920ec1e2e',
                  usersApiKey: 'b4a29aba5e75d99c8a18acd920ec1e2e',
                  datacenterEU: false,
                },
              },
            },
          ],
        },
      },
    },
  },
];
