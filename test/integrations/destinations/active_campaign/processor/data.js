const data = [
  {
    name: 'active_campaign',
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
                apiKey: 'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                apiUrl: 'https://active.campaigns.rudder.com',
                actid: '476550467',
                eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
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
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: 'anon_id',
              userId: '123456',
              type: 'identify',
              traits: {
                anonymousId: 'anon_id',
                email: 'jamesDoe@gmail.com',
                firstName: 'James',
                lastName: 'Doe',
                phone: '92374162212',
                tags: ['Test_User', 'Interested_User', 'DIY_Hobby'],
                fieldInfo: {
                  Office: 'Trastkiv',
                  Country: 'Russia',
                  Likes: ['Potato', 'Onion'],
                  Random: 'random',
                },
                lists: [
                  { id: 2, status: 'subscribe' },
                  { id: 3, status: 'unsubscribe' },
                  { id: 3, status: 'unsubscribexyz' },
                ],
                address: {
                  city: 'kolkata',
                  country: 'India',
                  postalCode: 789223,
                  state: 'WB',
                  street: '',
                },
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://active.campaigns.rudder.com/api/3/contact/sync',
              headers: {
                'Content-Type': 'application/json',
                'Api-Token':
                  'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
              },
              params: {},
              body: {
                JSON: {
                  contact: {
                    email: 'jamesDoe@gmail.com',
                    phone: '92374162212',
                    firstName: 'James',
                    lastName: 'Doe',
                    fieldValues: [
                      { field: '0', value: 'Trastkiv' },
                      { field: '1', value: 'Russia' },
                      { field: '3', value: '||Potato||Onion||' },
                      { field: '4', value: 'random' },
                    ],
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'active_campaign',
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
                apiKey: 'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                apiUrl: 'https://active.campaigns.rudder.com',
                actid: '476550467',
                eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
              },
            },
            message: {
              channel: 'web',
              context: {
                page: { referring_domain: 'https://www.rudderlabs.com' },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: { email: 'jamesDoe@gmail.com', anonymousId: '12345' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              request_ip: '1.1.1.1',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                name: 'ApplicationLoaded',
                path: '/test',
                referrer: 'Rudder',
                search: 'abc',
                title: 'Test Page',
                url: 'https://www.rudderlabs.com',
              },
              integrations: { All: true },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
                JSON_ARRAY: {},
                JSON: { siteTrackingDomain: { name: 'rudderlabs.com' } },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Api-Token':
                  'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://active.campaigns.rudder.com/api/3/siteTrackingDomains',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'active_campaign',
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
                apiKey: 'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                apiUrl: 'https://active.campaigns.rudder.com',
                actid: '476550467',
                eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
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
                traits: { email: 'jamesDoe@gmail.com', anonymousId: '12345' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              request_ip: '1.1.1.1',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                name: 'ApplicationLoaded',
                path: '/test',
                referrer: 'Rudder',
                search: 'abc',
                title: 'Test Page',
                url: 'https://www.rudderlabs.com',
              },
              integrations: { All: true },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
                JSON_ARRAY: {},
                JSON: { siteTrackingDomain: { name: 'rudderlabs.com' } },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Api-Token':
                  'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://active.campaigns.rudder.com/api/3/siteTrackingDomains',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'active_campaign',
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
                apiKey: 'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                apiUrl: 'https://active.campaigns.rudder.com',
                actid: '476550467',
                eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
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
                traits: { email: 'jamesDoe@gmail.com', anonymousId: '12345' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              request_ip: '1.1.1.1',
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                name: 'ApplicationLoaded',
                path: '/test',
                referrer: 'Rudder',
                referring_domain: 'https://www.rudderlabs.com',
                search: 'abc',
                title: 'Test Page',
                url: 'https://www.rudderlabs.com',
              },
              integrations: { All: true },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
                JSON_ARRAY: {},
                JSON: { siteTrackingDomain: { name: 'rudderlabs.com' } },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Api-Token':
                  'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://active.campaigns.rudder.com/api/3/siteTrackingDomains',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'active_campaign',
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
                apiKey: 'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                apiUrl: 'https://active.campaigns.rudder.com',
                actid: '476550467',
                eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
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
                traits: { email: 'jamesDoe@gmail.com', anonymousId: '12345' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              request_ip: '1.1.1.1',
              type: 'screen',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/test',
                referrer: 'Rudder',
                search: 'abc',
                title: 'Test Page',
                url: 'www.rudderlabs.com',
                name: 'Rudder_Event_Screen_Test',
              },
              event: 'ScreenViewed',
              integrations: { All: true },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
                FORM: {
                  key: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                  actid: '476550467',
                  event: 'ScreenViewed',
                  visit: '{"email":"jamesDoe@gmail.com"}',
                  eventdata: 'Rudder_Event_Screen_Test',
                },
                JSON: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Api-Token':
                  'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              version: '1',
              endpoint: 'https://trackcmp.net/event',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'active_campaign',
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
                apiKey: 'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                apiUrl: 'https://active.campaigns.rudder.com',
                actid: '476550467',
                eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
              },
            },
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: { carrier: 'Banglalink' },
                os: { name: 'android', version: '8.1.0' },
                traits: {
                  email: 'jamesDoe@gmail.com',
                  address: { city: 'Dhaka', country: 'Bangladesh' },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'Tracking Action',
              integrations: { All: true },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: { name: 'Rudder_Event_Track_Test' },
              userId: 'test_user_id',
              timestamp: '2019-09-01T15:46:51.693Z',
              originalTimestamp: '2019-09-01T15:46:51.693Z',
              type: 'track',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
                FORM: {
                  key: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                  actid: '476550467',
                  event: 'Tracking Action',
                  visit: '{"email":"jamesDoe@gmail.com"}',
                  eventdata: 'Rudder_Event_Track_Test',
                },
                JSON: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Api-Token':
                  'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              version: '1',
              endpoint: 'https://trackcmp.net/event',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'active_campaign',
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
                apiKey: 'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                apiUrl: 'https://active.campaigns.rudder.com',
                actid: '476550467',
                eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
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
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: 'anon_id',
              userId: '123456',
              type: 'identify',
              traits: {
                anonymousId: 'anon_id',
                email: 'jamesDoe@gmail.com',
                phone: '92374162212',
                tags: ['Test_User', 'Interested_User', 'DIY_Hobby'],
                fieldInfo: {
                  Office: 'Trastkiv',
                  Country: 'Russia',
                  Likes: ['Potato', 'Onion'],
                  Random: 'random',
                },
                lists: [
                  { id: 2, status: 'subscribe' },
                  { id: 3, status: 'unsubscribe' },
                  { id: 3, status: 'unsubscribexyz' },
                ],
                address: {
                  city: 'kolkata',
                  country: 'India',
                  postalCode: 789223,
                  state: 'WB',
                  street: '',
                },
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
                JSON_ARRAY: {},
                JSON: {
                  contact: {
                    email: 'jamesDoe@gmail.com',
                    phone: '92374162212',
                    fieldValues: [
                      { field: '0', value: 'Trastkiv' },
                      { field: '1', value: 'Russia' },
                      { field: '3', value: '||Potato||Onion||' },
                      { field: '4', value: 'random' },
                    ],
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Api-Token':
                  'fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1',
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://active.campaigns.rudder.com/api/3/contact/sync',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
module.exports = {
  data,
};
