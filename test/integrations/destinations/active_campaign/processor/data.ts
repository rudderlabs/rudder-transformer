import MockAdapter from 'axios-mock-adapter';
import { isMatch } from 'lodash';

export const data = [
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
                apiKey: 'dummyApiKey',
                apiUrl: 'https://active.campaigns.rudder.com',
                actid: '476550467',
                eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
              },
            },
            message: {
              channel: 'web',
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
                tags: 'Test_User',
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
                'Api-Token': 'dummyApiKey',
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
                apiKey: 'dummyApiKey',
                apiUrl: 'https://active.campaigns.rudder.com',
                actid: '476550467',
                eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
              },
            },
            message: {
              channel: 'web',
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
                'Api-Token': 'dummyApiKey',
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
                apiKey: 'dummyApiKey',
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
                'Api-Token': 'dummyApiKey',
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
                apiKey: 'dummyApiKey',
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
                'Api-Token': 'dummyApiKey',
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
                apiKey: 'dummyApiKey',
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
                'Api-Token': 'dummyApiKey',
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
                apiKey: 'dummyApiKey',
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
                'Api-Token': 'dummyApiKey',
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
                apiKey: 'dummyApiKey',
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
                'Api-Token': 'dummyApiKey',
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
                apiKey: 'dummyApiKey',
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
                'Api-Token': 'dummyApiKey',
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

  {
    name: 'active_campaign',
    description:
      'Test 7: node error(ECONNABORTED) where there is no response coming from dest. server',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                apiUrl: 'https://active.campaigns.dumber.com',
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
                email: 'patjane@gmail.com',
                phone: '92374162213',
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
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              '{"message":"Failed to create new contact (undefined,\\"[ECONNABORTED] :: Connection aborted\\")","destinationResponse":"[ECONNABORTED] :: Connection aborted"}',
            statTags: {
              destType: 'ACTIVE_CAMPAIGN',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 500,
          },
        ],
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost(
          'https://active.campaigns.dumber.com/api/3/contact/sync',
          {
            asymmetricMatch: (actual) => {
              return isMatch(actual, {
                contact: {
                  email: 'patjane@gmail.com',
                  phone: '92374162213',
                },
              });
            },
          },
          {
            asymmetricMatch: (actual) => {
              return isMatch(actual, {
                'Api-Token': 'dummyApiKey',
                'Content-Type': 'application/json',
              });
            },
          },
        )
        .abortRequest();
    },
  },
  {
    name: 'active_campaign',
    description: 'Test 8: erreneous response from active_campaign server(5xx)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                apiUrl: 'https://active.campaigns.dumber2.com',
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
                email: 'patjane1@gmail.com',
                phone: '92374162213',
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
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              '{"message":"Failed to create new contact (undefined,\\"<!DOCTYPE html>\\\\\\\\n<!--[if lt IE 7]> <html class=\\\\\\\\\\\\\\"no-js ie6 oldie\\\\\\\\\\\\\\" lang=\\\\\\\\\\\\\\"en-US\\\\\\\\\\\\\\"> <![endif]-->\\\\\\\\n<!--[if IE 7]> <html class=\\\\\\\\\\\\\\"no-js ie7 oldie\\\\\\\\\\\\\\" lang=\\\\\\\\\\\\\\"en-US\\\\\\\\\\\\\\"> <![endif]-->\\\\\\\\n<!--[if IE 8]> <html class=\\\\\\\\\\\\\\"no-js ie8 oldie\\\\\\\\\\\\\\" lang=\\\\\\\\\\\\\\"en-US\\\\\\\\\\\\\\"> <![endif]-->\\\\\\\\n<!--[if gt IE 8]><!--> <html class=\\\\\\\\\\\\\\"no-js\\\\\\\\\\\\\\" lang=\\\\\\\\\\\\\\"en-US\\\\\\\\\\\\\\"> <!--<![endif]-->\\\\\\\\n<head>\\\\\\\\n\\\\\\\\n\\\\\\\\n<title>accurx.api-us1.com | 504: Gateway time-out</title>\\\\\\\\n<meta charset=\\\\\\\\\\\\\\"UTF-8\\\\\\\\\\\\\\" />\\\\\\\\n<meta http-equiv=\\\\\\\\\\\\\\"Content-Type\\\\\\\\\\\\\\" content=\\\\\\\\\\\\\\"text/html; charset=UTF-8\\\\\\\\\\\\\\" />\\\\\\\\n<meta http-equiv=\\\\\\\\\\\\\\"X-UA-Compatible\\\\\\\\\\\\\\" content=\\\\\\\\\\\\\\"IE=Edge\\\\\\\\\\\\\\" />\\\\\\\\n<meta name=\\\\\\\\\\\\\\"robots\\\\\\\\\\\\\\" content=\\\\\\\\\\\\\\"noindex, nofollow\\\\\\\\\\\\\\" />\\\\\\\\n<meta name=\\\\\\\\\\\\\\"viewport\\\\\\\\\\\\\\" content=\\\\\\\\\\\\\\"width=device-width,initial-scale=1\\\\\\\\\\\\\\" />\\\\\\\\n<link rel=\\\\\\\\\\\\\\"stylesheet\\\\\\\\\\\\\\" id=\\\\\\\\\\\\\\"cf_styles-css\\\\\\\\\\\\\\" href=\\\\\\\\\\\\\\"/cdn-cgi/styles/main.css\\\\\\\\\\\\\\" />\\\\\\\\n\\\\\\\\n\\\\\\\\n</head>\\\\\\\\n<body>\\\\\\\\n<div id=\\\\\\\\\\\\\\"cf-wrapper\\\\\\\\\\\\\\">\\\\\\\\n <div id=\\\\\\\\\\\\\\"cf-error-details\\\\\\\\\\\\\\" class=\\\\\\\\\\\\\\"p-0\\\\\\\\\\\\\\">\\\\\\\\n <header class=\\\\\\\\\\\\\\"mx-auto pt-10 lg:pt-6 lg:px-8 w-240 lg:w-full mb-8\\\\\\\\\\\\\\">\\\\\\\\n <h1 class=\\\\\\\\\\\\\\"inline-block sm:block sm:mb-2 font-light text-60 lg:text-4xl text-black-dark leading-tight mr-2\\\\\\\\\\\\\\">\\\\\\\\n <span class=\\\\\\\\\\\\\\"inline-block\\\\\\\\\\\\\\">Gateway time-out</span>\\\\\\\\n <span class=\\\\\\\\\\\\\\"code-label\\\\\\\\\\\\\\">Error code 504</span>\\\\\\\\n </h1>\\\\\\\\n <div>\\\\\\\\n Visit <a href=\\\\\\\\\\\\\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\\\\\\\\\\\\\" target=\\\\\\\\\\\\\\"_blank\\\\\\\\\\\\\\" rel=\\\\\\\\\\\\\\"noopener noreferrer\\\\\\\\\\\\\\">cloudflare.com</a> for more information.\\\\\\\\n </div>\\\\\\\\n <div class=\\\\\\\\\\\\\\"mt-3\\\\\\\\\\\\\\">2023-12-06 10:33:27 UTC</div>\\\\\\\\n </header>\\\\\\\\n <div class=\\\\\\\\\\\\\\"my-8 bg-gradient-gray\\\\\\\\\\\\\\">\\\\\\\\n <div class=\\\\\\\\\\\\\\"w-240 lg:w-full mx-auto\\\\\\\\\\\\\\">\\\\\\\\n <div class=\\\\\\\\\\\\\\"clearfix md:px-8\\\\\\\\\\\\\\">\\\\\\\\n \\\\\\\\n<div id=\\\\\\\\\\\\\\"cf-browser-status\\\\\\\\\\\\\\" class=\\\\\\\\\\\\\\" relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center\\\\\\\\\\\\\\">\\\\\\\\n <div class=\\\\\\\\\\\\\\"relative mb-10 md:m-0\\\\\\\\\\\\\\">\\\\\\\\n \\\\\\\\n <span class=\\\\\\\\\\\\\\"cf-icon-browser block md:hidden h-20 bg-center bg-no-repeat\\\\\\\\\\\\\\"></span>\\\\\\\\n <span class=\\\\\\\\\\\\\\"cf-icon-ok w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4\\\\\\\\\\\\\\"></span>\\\\\\\\n \\\\\\\\n </div>\\\\\\\\n <span class=\\\\\\\\\\\\\\"md:block w-full truncate\\\\\\\\\\\\\\">You</span>\\\\\\\\n <h3 class=\\\\\\\\\\\\\\"md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3\\\\\\\\\\\\\\">\\\\\\\\n \\\\\\\\n Browser\\\\\\\\n \\\\\\\\n </h3>\\\\\\\\n <span class=\\\\\\\\\\\\\\"leading-1.3 text-2xl text-green-success\\\\\\\\\\\\\\">Working</span>\\\\\\\\n</div>\\\\\\\\n\\\\\\\\n<div id=\\\\\\\\\\\\\\"cf-cloudflare-status\\\\\\\\\\\\\\" class=\\\\\\\\\\\\\\" relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center\\\\\\\\\\\\\\">\\\\\\\\n <div class=\\\\\\\\\\\\\\"relative mb-10 md:m-0\\\\\\\\\\\\\\">\\\\\\\\n <a href=\\\\\\\\\\\\\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\\\\\\\\\\\\\" target=\\\\\\\\\\\\\\"_blank\\\\\\\\\\\\\\" rel=\\\\\\\\\\\\\\"noopener noreferrer\\\\\\\\\\\\\\">\\\\\\\\n <span class=\\\\\\\\\\\\\\"cf-icon-cloud block md:hidden h-20 bg-center bg-no-repeat\\\\\\\\\\\\\\"></span>\\\\\\\\n <span class=\\\\\\\\\\\\\\"cf-icon-ok w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4\\\\\\\\\\\\\\"></span>\\\\\\\\n </a>\\\\\\\\n </div>\\\\\\\\n <span class=\\\\\\\\\\\\\\"md:block w-full truncate\\\\\\\\\\\\\\">Frankfurt</span>\\\\\\\\n <h3 class=\\\\\\\\\\\\\\"md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3\\\\\\\\\\\\\\">\\\\\\\\n <a href=\\\\\\\\\\\\\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\\\\\\\\\\\\\" target=\\\\\\\\\\\\\\"_blank\\\\\\\\\\\\\\" rel=\\\\\\\\\\\\\\"noopener noreferrer\\\\\\\\\\\\\\">\\\\\\\\n Cloudflare\\\\\\\\n </a>\\\\\\\\n </h3>\\\\\\\\n <span class=\\\\\\\\\\\\\\"leading-1.3 text-2xl text-green-success\\\\\\\\\\\\\\">Working</span>\\\\\\\\n</div>\\\\\\\\n\\\\\\\\n<div id=\\\\\\\\\\\\\\"cf-host-status\\\\\\\\\\\\\\" class=\\\\\\\\\\\\\\"cf-error-source relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center\\\\\\\\\\\\\\">\\\\\\\\n <div class=\\\\\\\\\\\\\\"relative mb-10 md:m-0\\\\\\\\\\\\\\">\\\\\\\\n \\\\\\\\n <span class=\\\\\\\\\\\\\\"cf-icon-server block md:hidden h-20 bg-center bg-no-repeat\\\\\\\\\\\\\\"></span>\\\\\\\\n <span class=\\\\\\\\\\\\\\"cf-icon-error w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4\\\\\\\\\\\\\\"></span>\\\\\\\\n \\\\\\\\n </div>\\\\\\\\n <span class=\\\\\\\\\\\\\\"md:block w-full truncate\\\\\\\\\\\\\\">accurx.api-us1.com</span>\\\\\\\\n <h3 class=\\\\\\\\\\\\\\"md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3\\\\\\\\\\\\\\">\\\\\\\\n \\\\\\\\n Host\\\\\\\\n \\\\\\\\n </h3>\\\\\\\\n <span class=\\\\\\\\\\\\\\"leading-1.3 text-2xl text-red-error\\\\\\\\\\\\\\">Error</span>\\\\\\\\n</div>\\\\\\\\n\\\\\\\\n </div>\\\\\\\\n </div>\\\\\\\\n </div>\\\\\\\\n\\\\\\\\n <div class=\\\\\\\\\\\\\\"w-240 lg:w-full mx-auto mb-8 lg:px-8\\\\\\\\\\\\\\">\\\\\\\\n <div class=\\\\\\\\\\\\\\"clearfix\\\\\\\\\\\\\\">\\\\\\\\n <div class=\\\\\\\\\\\\\\"w-1/2 md:w-full float-left pr-6 md:pb-10 md:pr-0 leading-relaxed\\\\\\\\\\\\\\">\\\\\\\\n <h2 class=\\\\\\\\\\\\\\"text-3xl font-normal leading-1.3 mb-4\\\\\\\\\\\\\\">What happened?</h2>\\\\\\\\n <p>The web server reported a gateway time-out error.</p>\\\\\\\\n </div>\\\\\\\\n <div class=\\\\\\\\\\\\\\"w-1/2 md:w-full float-left leading-relaxed\\\\\\\\\\\\\\">\\\\\\\\n <h2 class=\\\\\\\\\\\\\\"text-3xl font-normal leading-1.3 mb-4\\\\\\\\\\\\\\">What can I do?</h2>\\\\\\\\n <p class=\\\\\\\\\\\\\\"mb-6\\\\\\\\\\\\\\">Please try again in a few minutes.</p>\\\\\\\\n </div>\\\\\\\\n </div>\\\\\\\\n </div>\\\\\\\\n\\\\\\\\n <div class=\\\\\\\\\\\\\\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\\\\\\\\\\\\\\">\\\\\\\\n <p class=\\\\\\\\\\\\\\"text-13\\\\\\\\\\\\\\">\\\\\\\\n <span class=\\\\\\\\\\\\\\"cf-footer-item sm:block sm:mb-1\\\\\\\\\\\\\\">Cloudflare Ray ID: <strong class=\\\\\\\\\\\\\\"font-semibold\\\\\\\\\\\\\\">8313dee7ad9c921a</strong></span>\\\\\\\\n <span class=\\\\\\\\\\\\\\"cf-footer-separator sm:hidden\\\\\\\\\\\\\\">&bull;</span>\\\\\\\\n <span id=\\\\\\\\\\\\\\"cf-footer-item-ip\\\\\\\\\\\\\\" class=\\\\\\\\\\\\\\"cf-footer-item hidden sm:block sm:mb-1\\\\\\\\\\\\\\">\\\\\\\\n Your IP:\\\\\\\\n <button type=\\\\\\\\\\\\\\"button\\\\\\\\\\\\\\" id=\\\\\\\\\\\\\\"cf-footer-ip-reveal\\\\\\\\\\\\\\" class=\\\\\\\\\\\\\\"cf-footer-ip-reveal-btn\\\\\\\\\\\\\\">Click to reveal</button>\\\\\\\\n <span class=\\\\\\\\\\\\\\"hidden\\\\\\\\\\\\\\" id=\\\\\\\\\\\\\\"cf-footer-ip\\\\\\\\\\\\\\">3.66.99.198</span>\\\\\\\\n <span class=\\\\\\\\\\\\\\"cf-footer-separator sm:hidden\\\\\\\\\\\\\\">&bull;</span>\\\\\\\\n </span>\\\\\\\\n <span class=\\\\\\\\\\\\\\"cf-footer-item sm:block sm:mb-1\\\\\\\\\\\\\\"><span>Performance &amp; security by</span> <a rel=\\\\\\\\\\\\\\"noopener noreferrer\\\\\\\\\\\\\\" href=\\\\\\\\\\\\\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\\\\\\\\\\\\\" id=\\\\\\\\\\\\\\"brand_link\\\\\\\\\\\\\\" target=\\\\\\\\\\\\\\"_blank\\\\\\\\\\\\\\">Cloudflare</a></span>\\\\\\\\n \\\\\\\\n </p>\\\\\\\\n <script>(function(){function d(){var b=a.getElementById(\\\\\\\\\\\\\\"cf-footer-item-ip\\\\\\\\\\\\\\"),c=a.getElementById(\\\\\\\\\\\\\\"cf-footer-ip-reveal\\\\\\\\\\\\\\");b&&\\\\\\\\\\\\\\"classList\\\\\\\\\\\\\\"in b&&(b.classList.remove(\\\\\\\\\\\\\\"hidden\\\\\\\\\\\\\\"),c.addEventListener(\\\\\\\\\\\\\\"click\\\\\\\\\\\\\\",function(){c.classList.add(\\\\\\\\\\\\\\"hidden\\\\\\\\\\\\\\");a.getElementById(\\\\\\\\\\\\\\"cf-footer-ip\\\\\\\\\\\\\\").classList.remove(\\\\\\\\\\\\\\"hidden\\\\\\\\\\\\\\")}))}var a=document;document.addEventListener&&a.addEventListener(\\\\\\\\\\\\\\"DOMContentLoaded\\\\\\\\\\\\\\",d)})();</script>\\\\\\\\n</div><!-- /.error-footer -->\\\\\\\\n\\\\\\\\n\\\\\\\\n </div>\\\\\\\\n</div>\\\\\\\\n</body>\\\\\\\\n</html>\\\\\\\\n\\\\\\")\\")","destinationResponse":"<!DOCTYPE html>\\\\n<!--[if lt IE 7]> <html class=\\\\\\"no-js ie6 oldie\\\\\\" lang=\\\\\\"en-US\\\\\\"> <![endif]-->\\\\n<!--[if IE 7]> <html class=\\\\\\"no-js ie7 oldie\\\\\\" lang=\\\\\\"en-US\\\\\\"> <![endif]-->\\\\n<!--[if IE 8]> <html class=\\\\\\"no-js ie8 oldie\\\\\\" lang=\\\\\\"en-US\\\\\\"> <![endif]-->\\\\n<!--[if gt IE 8]><!--> <html class=\\\\\\"no-js\\\\\\" lang=\\\\\\"en-US\\\\\\"> <!--<![endif]-->\\\\n<head>\\\\n\\\\n\\\\n<title>accurx.api-us1.com | 504: Gateway time-out</title>\\\\n<meta charset=\\\\\\"UTF-8\\\\\\" />\\\\n<meta http-equiv=\\\\\\"Content-Type\\\\\\" content=\\\\\\"text/html; charset=UTF-8\\\\\\" />\\\\n<meta http-equiv=\\\\\\"X-UA-Compatible\\\\\\" content=\\\\\\"IE=Edge\\\\\\" />\\\\n<meta name=\\\\\\"robots\\\\\\" content=\\\\\\"noindex, nofollow\\\\\\" />\\\\n<meta name=\\\\\\"viewport\\\\\\" content=\\\\\\"width=device-width,initial-scale=1\\\\\\" />\\\\n<link rel=\\\\\\"stylesheet\\\\\\" id=\\\\\\"cf_styles-css\\\\\\" href=\\\\\\"/cdn-cgi/styles/main.css\\\\\\" />\\\\n\\\\n\\\\n</head>\\\\n<body>\\\\n<div id=\\\\\\"cf-wrapper\\\\\\">\\\\n <div id=\\\\\\"cf-error-details\\\\\\" class=\\\\\\"p-0\\\\\\">\\\\n <header class=\\\\\\"mx-auto pt-10 lg:pt-6 lg:px-8 w-240 lg:w-full mb-8\\\\\\">\\\\n <h1 class=\\\\\\"inline-block sm:block sm:mb-2 font-light text-60 lg:text-4xl text-black-dark leading-tight mr-2\\\\\\">\\\\n <span class=\\\\\\"inline-block\\\\\\">Gateway time-out</span>\\\\n <span class=\\\\\\"code-label\\\\\\">Error code 504</span>\\\\n </h1>\\\\n <div>\\\\n Visit <a href=\\\\\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\\\\\" target=\\\\\\"_blank\\\\\\" rel=\\\\\\"noopener noreferrer\\\\\\">cloudflare.com</a> for more information.\\\\n </div>\\\\n <div class=\\\\\\"mt-3\\\\\\">2023-12-06 10:33:27 UTC</div>\\\\n </header>\\\\n <div class=\\\\\\"my-8 bg-gradient-gray\\\\\\">\\\\n <div class=\\\\\\"w-240 lg:w-full mx-auto\\\\\\">\\\\n <div class=\\\\\\"clearfix md:px-8\\\\\\">\\\\n \\\\n<div id=\\\\\\"cf-browser-status\\\\\\" class=\\\\\\" relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center\\\\\\">\\\\n <div class=\\\\\\"relative mb-10 md:m-0\\\\\\">\\\\n \\\\n <span class=\\\\\\"cf-icon-browser block md:hidden h-20 bg-center bg-no-repeat\\\\\\"></span>\\\\n <span class=\\\\\\"cf-icon-ok w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4\\\\\\"></span>\\\\n \\\\n </div>\\\\n <span class=\\\\\\"md:block w-full truncate\\\\\\">You</span>\\\\n <h3 class=\\\\\\"md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3\\\\\\">\\\\n \\\\n Browser\\\\n \\\\n </h3>\\\\n <span class=\\\\\\"leading-1.3 text-2xl text-green-success\\\\\\">Working</span>\\\\n</div>\\\\n\\\\n<div id=\\\\\\"cf-cloudflare-status\\\\\\" class=\\\\\\" relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center\\\\\\">\\\\n <div class=\\\\\\"relative mb-10 md:m-0\\\\\\">\\\\n <a href=\\\\\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\\\\\" target=\\\\\\"_blank\\\\\\" rel=\\\\\\"noopener noreferrer\\\\\\">\\\\n <span class=\\\\\\"cf-icon-cloud block md:hidden h-20 bg-center bg-no-repeat\\\\\\"></span>\\\\n <span class=\\\\\\"cf-icon-ok w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4\\\\\\"></span>\\\\n </a>\\\\n </div>\\\\n <span class=\\\\\\"md:block w-full truncate\\\\\\">Frankfurt</span>\\\\n <h3 class=\\\\\\"md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3\\\\\\">\\\\n <a href=\\\\\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\\\\\" target=\\\\\\"_blank\\\\\\" rel=\\\\\\"noopener noreferrer\\\\\\">\\\\n Cloudflare\\\\n </a>\\\\n </h3>\\\\n <span class=\\\\\\"leading-1.3 text-2xl text-green-success\\\\\\">Working</span>\\\\n</div>\\\\n\\\\n<div id=\\\\\\"cf-host-status\\\\\\" class=\\\\\\"cf-error-source relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center\\\\\\">\\\\n <div class=\\\\\\"relative mb-10 md:m-0\\\\\\">\\\\n \\\\n <span class=\\\\\\"cf-icon-server block md:hidden h-20 bg-center bg-no-repeat\\\\\\"></span>\\\\n <span class=\\\\\\"cf-icon-error w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4\\\\\\"></span>\\\\n \\\\n </div>\\\\n <span class=\\\\\\"md:block w-full truncate\\\\\\">accurx.api-us1.com</span>\\\\n <h3 class=\\\\\\"md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3\\\\\\">\\\\n \\\\n Host\\\\n \\\\n </h3>\\\\n <span class=\\\\\\"leading-1.3 text-2xl text-red-error\\\\\\">Error</span>\\\\n</div>\\\\n\\\\n </div>\\\\n </div>\\\\n </div>\\\\n\\\\n <div class=\\\\\\"w-240 lg:w-full mx-auto mb-8 lg:px-8\\\\\\">\\\\n <div class=\\\\\\"clearfix\\\\\\">\\\\n <div class=\\\\\\"w-1/2 md:w-full float-left pr-6 md:pb-10 md:pr-0 leading-relaxed\\\\\\">\\\\n <h2 class=\\\\\\"text-3xl font-normal leading-1.3 mb-4\\\\\\">What happened?</h2>\\\\n <p>The web server reported a gateway time-out error.</p>\\\\n </div>\\\\n <div class=\\\\\\"w-1/2 md:w-full float-left leading-relaxed\\\\\\">\\\\n <h2 class=\\\\\\"text-3xl font-normal leading-1.3 mb-4\\\\\\">What can I do?</h2>\\\\n <p class=\\\\\\"mb-6\\\\\\">Please try again in a few minutes.</p>\\\\n </div>\\\\n </div>\\\\n </div>\\\\n\\\\n <div class=\\\\\\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\\\\\\">\\\\n <p class=\\\\\\"text-13\\\\\\">\\\\n <span class=\\\\\\"cf-footer-item sm:block sm:mb-1\\\\\\">Cloudflare Ray ID: <strong class=\\\\\\"font-semibold\\\\\\">8313dee7ad9c921a</strong></span>\\\\n <span class=\\\\\\"cf-footer-separator sm:hidden\\\\\\">&bull;</span>\\\\n <span id=\\\\\\"cf-footer-item-ip\\\\\\" class=\\\\\\"cf-footer-item hidden sm:block sm:mb-1\\\\\\">\\\\n Your IP:\\\\n <button type=\\\\\\"button\\\\\\" id=\\\\\\"cf-footer-ip-reveal\\\\\\" class=\\\\\\"cf-footer-ip-reveal-btn\\\\\\">Click to reveal</button>\\\\n <span class=\\\\\\"hidden\\\\\\" id=\\\\\\"cf-footer-ip\\\\\\">3.66.99.198</span>\\\\n <span class=\\\\\\"cf-footer-separator sm:hidden\\\\\\">&bull;</span>\\\\n </span>\\\\n <span class=\\\\\\"cf-footer-item sm:block sm:mb-1\\\\\\"><span>Performance &amp; security by</span> <a rel=\\\\\\"noopener noreferrer\\\\\\" href=\\\\\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\\\\\" id=\\\\\\"brand_link\\\\\\" target=\\\\\\"_blank\\\\\\">Cloudflare</a></span>\\\\n \\\\n </p>\\\\n <script>(function(){function d(){var b=a.getElementById(\\\\\\"cf-footer-item-ip\\\\\\"),c=a.getElementById(\\\\\\"cf-footer-ip-reveal\\\\\\");b&&\\\\\\"classList\\\\\\"in b&&(b.classList.remove(\\\\\\"hidden\\\\\\"),c.addEventListener(\\\\\\"click\\\\\\",function(){c.classList.add(\\\\\\"hidden\\\\\\");a.getElementById(\\\\\\"cf-footer-ip\\\\\\").classList.remove(\\\\\\"hidden\\\\\\")}))}var a=document;document.addEventListener&&a.addEventListener(\\\\\\"DOMContentLoaded\\\\\\",d)})();</script>\\\\n</div><!-- /.error-footer -->\\\\n\\\\n\\\\n </div>\\\\n</div>\\\\n</body>\\\\n</html>\\\\n\\")"}',
            statTags: {
              destType: 'ACTIVE_CAMPAIGN',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 504,
          },
        ],
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost(
          'https://active.campaigns.dumber2.com/api/3/contact/sync',
          {
            asymmetricMatch: (actual) => {
              return isMatch(actual, {
                contact: {
                  email: 'patjane1@gmail.com',
                  phone: '92374162213',
                },
              });
            },
          },
          {
            asymmetricMatch: (actual) => {
              return isMatch(actual, {
                'Api-Token': 'dummyApiKey',
                'Content-Type': 'application/json',
              });
            },
          },
        )
        .replyOnce(
          504,
          '<!DOCTYPE html>\\n<!--[if lt IE 7]> <html class=\\"no-js ie6 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if IE 7]> <html class=\\"no-js ie7 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if IE 8]> <html class=\\"no-js ie8 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if gt IE 8]><!--> <html class=\\"no-js\\" lang=\\"en-US\\"> <!--<![endif]-->\\n<head>\\n\\n\\n<title>accurx.api-us1.com | 504: Gateway time-out</title>\\n<meta charset=\\"UTF-8\\" />\\n<meta http-equiv=\\"Content-Type\\" content=\\"text/html; charset=UTF-8\\" />\\n<meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=Edge\\" />\\n<meta name=\\"robots\\" content=\\"noindex, nofollow\\" />\\n<meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1\\" />\\n<link rel=\\"stylesheet\\" id=\\"cf_styles-css\\" href=\\"/cdn-cgi/styles/main.css\\" />\\n\\n\\n</head>\\n<body>\\n<div id=\\"cf-wrapper\\">\\n <div id=\\"cf-error-details\\" class=\\"p-0\\">\\n <header class=\\"mx-auto pt-10 lg:pt-6 lg:px-8 w-240 lg:w-full mb-8\\">\\n <h1 class=\\"inline-block sm:block sm:mb-2 font-light text-60 lg:text-4xl text-black-dark leading-tight mr-2\\">\\n <span class=\\"inline-block\\">Gateway time-out</span>\\n <span class=\\"code-label\\">Error code 504</span>\\n </h1>\\n <div>\\n Visit <a href=\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">cloudflare.com</a> for more information.\\n </div>\\n <div class=\\"mt-3\\">2023-12-06 10:33:27 UTC</div>\\n </header>\\n <div class=\\"my-8 bg-gradient-gray\\">\\n <div class=\\"w-240 lg:w-full mx-auto\\">\\n <div class=\\"clearfix md:px-8\\">\\n \\n<div id=\\"cf-browser-status\\" class=\\" relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center\\">\\n <div class=\\"relative mb-10 md:m-0\\">\\n \\n <span class=\\"cf-icon-browser block md:hidden h-20 bg-center bg-no-repeat\\"></span>\\n <span class=\\"cf-icon-ok w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4\\"></span>\\n \\n </div>\\n <span class=\\"md:block w-full truncate\\">You</span>\\n <h3 class=\\"md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3\\">\\n \\n Browser\\n \\n </h3>\\n <span class=\\"leading-1.3 text-2xl text-green-success\\">Working</span>\\n</div>\\n\\n<div id=\\"cf-cloudflare-status\\" class=\\" relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center\\">\\n <div class=\\"relative mb-10 md:m-0\\">\\n <a href=\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">\\n <span class=\\"cf-icon-cloud block md:hidden h-20 bg-center bg-no-repeat\\"></span>\\n <span class=\\"cf-icon-ok w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4\\"></span>\\n </a>\\n </div>\\n <span class=\\"md:block w-full truncate\\">Frankfurt</span>\\n <h3 class=\\"md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3\\">\\n <a href=\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">\\n Cloudflare\\n </a>\\n </h3>\\n <span class=\\"leading-1.3 text-2xl text-green-success\\">Working</span>\\n</div>\\n\\n<div id=\\"cf-host-status\\" class=\\"cf-error-source relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center\\">\\n <div class=\\"relative mb-10 md:m-0\\">\\n \\n <span class=\\"cf-icon-server block md:hidden h-20 bg-center bg-no-repeat\\"></span>\\n <span class=\\"cf-icon-error w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4\\"></span>\\n \\n </div>\\n <span class=\\"md:block w-full truncate\\">accurx.api-us1.com</span>\\n <h3 class=\\"md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3\\">\\n \\n Host\\n \\n </h3>\\n <span class=\\"leading-1.3 text-2xl text-red-error\\">Error</span>\\n</div>\\n\\n </div>\\n </div>\\n </div>\\n\\n <div class=\\"w-240 lg:w-full mx-auto mb-8 lg:px-8\\">\\n <div class=\\"clearfix\\">\\n <div class=\\"w-1/2 md:w-full float-left pr-6 md:pb-10 md:pr-0 leading-relaxed\\">\\n <h2 class=\\"text-3xl font-normal leading-1.3 mb-4\\">What happened?</h2>\\n <p>The web server reported a gateway time-out error.</p>\\n </div>\\n <div class=\\"w-1/2 md:w-full float-left leading-relaxed\\">\\n <h2 class=\\"text-3xl font-normal leading-1.3 mb-4\\">What can I do?</h2>\\n <p class=\\"mb-6\\">Please try again in a few minutes.</p>\\n </div>\\n </div>\\n </div>\\n\\n <div class=\\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\\">\\n <p class=\\"text-13\\">\\n <span class=\\"cf-footer-item sm:block sm:mb-1\\">Cloudflare Ray ID: <strong class=\\"font-semibold\\">8313dee7ad9c921a</strong></span>\\n <span class=\\"cf-footer-separator sm:hidden\\">&bull;</span>\\n <span id=\\"cf-footer-item-ip\\" class=\\"cf-footer-item hidden sm:block sm:mb-1\\">\\n Your IP:\\n <button type=\\"button\\" id=\\"cf-footer-ip-reveal\\" class=\\"cf-footer-ip-reveal-btn\\">Click to reveal</button>\\n <span class=\\"hidden\\" id=\\"cf-footer-ip\\">3.66.99.198</span>\\n <span class=\\"cf-footer-separator sm:hidden\\">&bull;</span>\\n </span>\\n <span class=\\"cf-footer-item sm:block sm:mb-1\\"><span>Performance &amp; security by</span> <a rel=\\"noopener noreferrer\\" href=\\"https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_504&utm_campaign=accurx.api-us1.com\\" id=\\"brand_link\\" target=\\"_blank\\">Cloudflare</a></span>\\n \\n </p>\\n <script>(function(){function d(){var b=a.getElementById(\\"cf-footer-item-ip\\"),c=a.getElementById(\\"cf-footer-ip-reveal\\");b&&\\"classList\\"in b&&(b.classList.remove(\\"hidden\\"),c.addEventListener(\\"click\\",function(){c.classList.add(\\"hidden\\");a.getElementById(\\"cf-footer-ip\\").classList.remove(\\"hidden\\")}))}var a=document;document.addEventListener&&a.addEventListener(\\"DOMContentLoaded\\",d)})();</script>\\n</div><!-- /.error-footer -->\\n\\n\\n </div>\\n</div>\\n</body>\\n</html>\\n")',
          {
            Accept: 'application/json, text/plain, */*',
            'Api-Token': 'dummyApiKey',
          },
        );
    },
  },
  {
    name: 'active_campaign',
    description: 'Test 9: erreneous response from active_campaign server(4xx)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                apiUrl: 'https://active.campaigns.dumber2.com',
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
                email: 'patjane2@gmail.com',
                phone: '92374162213',
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
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              '{"message":"Failed to create new contact (undefined,{\\"errors\\":[{\\"title\\":\\"Contact Email Address is not valid.\\",\\"detail\\":\\"\\",\\"code\\":\\"email_invalid\\",\\"error\\":\\"must_be_valid_email_address\\",\\"source\\":{\\"pointer\\":\\"/data/attributes/email\\"}}]})","destinationResponse":{"errors":[{"title":"Contact Email Address is not valid.","detail":"","code":"email_invalid","error":"must_be_valid_email_address","source":{"pointer":"/data/attributes/email"}}]}}',
            statTags: {
              destType: 'ACTIVE_CAMPAIGN',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 422,
          },
        ],
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost(
          'https://active.campaigns.dumber2.com/api/3/contact/sync',
          {
            asymmetricMatch: (actual) => {
              return isMatch(actual, {
                contact: {
                  email: 'patjane2@gmail.com',
                  phone: '92374162213',
                },
              });
            },
          },
          {
            asymmetricMatch: (actual) => {
              return isMatch(actual, {
                'Api-Token': 'dummyApiKey',
                'Content-Type': 'application/json',
              });
            },
          },
        )
        .replyOnce(
          422,
          {
            errors: [
              {
                title: 'Contact Email Address is not valid.',
                detail: '',
                code: 'email_invalid',
                error: 'must_be_valid_email_address',
                source: {
                  pointer: '/data/attributes/email',
                },
              },
            ],
          },
          {
            Accept: 'application/json, text/plain, */*',
            'Api-Token': 'dummyApiKey',
          },
        );
    },
  },
];
