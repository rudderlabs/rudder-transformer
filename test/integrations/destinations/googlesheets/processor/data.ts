export const data = [
  {
    name: 'googlesheets',
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
                credentials: '{ sheets credentials }',
                eventKeyMap: [
                  {
                    from: 'firstName',
                    to: 'First Name',
                  },
                  {
                    from: 'lastName',
                    to: 'Last Name',
                  },
                  {
                    from: 'birthday',
                    to: 'Birthday',
                  },
                  {
                    from: 'address.city',
                    to: 'City',
                  },
                  {
                    from: 'address.country',
                    to: 'Country',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'offer',
                    to: 'Offer',
                  },
                  {
                    from: 'title',
                    to: 'Title Page',
                  },
                  {
                    from: 'Cart Value',
                    to: 'Cart Value',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'context.app.build',
                    to: 'App Build',
                  },
                  {
                    from: 'context.app.name',
                    to: 'App Name',
                  },
                  {
                    from: 'context.library.name',
                    to: 'Library Name',
                  },
                  {
                    from: 'context.ip',
                    to: 'IP',
                  },
                ],
                sheetId: 'rudder_sheet_id',
                sheetName: 'rudder_sheet',
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: 'OS-X',
                  version: '19.02.3',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  userId: 'sheetuser001',
                  firstName: 'James',
                  lastName: 'Doe',
                  address: {
                    city: 'Kolkata',
                    country: 'India',
                    postalCode: '789003',
                    state: 'WB',
                  },
                },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: 'anon_id',
              type: 'identify',
              traits: {
                anonymousId: 'anon_id',
                email: 'jamesDoe@gmail.com',
                name: 'James Doe',
                phone: '92374162212',
                gender: 'M',
                employed: true,
                birthday: '1614775793',
                education: 'Science',
                graduate: true,
                married: true,
                customerType: 'Prime',
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
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: {
                message: {
                  '0': {
                    attributeKey: 'messageId',
                    attributeValue: '84e26acc-56a5-4835-8233-591137fca468',
                  },
                  '1': {
                    attributeKey: 'First Name',
                    attributeValue: 'James',
                  },
                  '2': {
                    attributeKey: 'Last Name',
                    attributeValue: 'Doe',
                  },
                  '3': {
                    attributeKey: 'Birthday',
                    attributeValue: '1614775793',
                  },
                  '4': {
                    attributeKey: 'City',
                    attributeValue: 'kolkata',
                  },
                  '5': {
                    attributeKey: 'Country',
                    attributeValue: 'India',
                  },
                  '6': {
                    attributeKey: 'Revenue',
                    attributeValue: '',
                  },
                  '7': {
                    attributeKey: 'Offer',
                    attributeValue: '',
                  },
                  '8': {
                    attributeKey: 'Title Page',
                    attributeValue: '',
                  },
                  '9': {
                    attributeKey: 'Cart Value',
                    attributeValue: '',
                  },
                  '10': {
                    attributeKey: 'Revenue',
                    attributeValue: '',
                  },
                  '11': {
                    attributeKey: 'App Build',
                    attributeValue: '1.0.0',
                  },
                  '12': {
                    attributeKey: 'App Name',
                    attributeValue: 'RudderLabs JavaScript SDK',
                  },
                  '13': {
                    attributeKey: 'Library Name',
                    attributeValue: 'RudderLabs JavaScript SDK',
                  },
                  '14': {
                    attributeKey: 'IP',
                    attributeValue: '0.0.0.0',
                  },
                },
              },
              spreadSheet: 'rudder_sheet',
              spreadSheetId: 'rudder_sheet_id',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlesheets',
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
                credentials: '{ sheets credentials }',
                eventKeyMap: [
                  {
                    from: 'firstName',
                    to: 'First Name',
                  },
                  {
                    from: 'lastName',
                    to: 'Last Name',
                  },
                  {
                    from: 'birthday',
                    to: 'Birthday',
                  },
                  {
                    from: 'address.city',
                    to: 'City',
                  },
                  {
                    from: 'address.country',
                    to: 'Country',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'offer',
                    to: 'Offer',
                  },
                  {
                    from: 'title',
                    to: 'Title Page',
                  },
                  {
                    from: 'Cart Value',
                    to: 'Cart Value',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'context.app.build',
                    to: 'App Build',
                  },
                  {
                    from: 'context.app.name',
                    to: 'App Name',
                  },
                  {
                    from: 'context.library.name',
                    to: 'Library Name',
                  },
                  {
                    from: 'context.ip',
                    to: 'IP',
                  },
                ],
                sheetId: 'rudder_sheet_id',
                sheetName: 'rudder_sheet',
              },
            },
            message: {
              type: 'track',
              userId: 'userTest004',
              event: 'Added to Cart',
              properties: {
                name: 'HomePage',
                revenue: 5.99,
                value: 5.5,
                offer: 'Discount',
                Sale: false,
              },
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '0.1.4',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              batch: {
                message: {
                  '0': {
                    attributeKey: 'messageId',
                    attributeValue: '',
                  },
                  '1': {
                    attributeKey: 'First Name',
                    attributeValue: '',
                  },
                  '2': {
                    attributeKey: 'Last Name',
                    attributeValue: '',
                  },
                  '3': {
                    attributeKey: 'Birthday',
                    attributeValue: '',
                  },
                  '4': {
                    attributeKey: 'City',
                    attributeValue: '',
                  },
                  '5': {
                    attributeKey: 'Country',
                    attributeValue: '',
                  },
                  '6': {
                    attributeKey: 'Revenue',
                    attributeValue: 5.99,
                  },
                  '7': {
                    attributeKey: 'Offer',
                    attributeValue: 'Discount',
                  },
                  '8': {
                    attributeKey: 'Title Page',
                    attributeValue: '',
                  },
                  '9': {
                    attributeKey: 'Cart Value',
                    attributeValue: '',
                  },
                  '10': {
                    attributeKey: 'Revenue',
                    attributeValue: 5.99,
                  },
                  '11': {
                    attributeKey: 'App Build',
                    attributeValue: '1',
                  },
                  '12': {
                    attributeKey: 'App Name',
                    attributeValue: 'RudderAndroidClient',
                  },
                  '13': {
                    attributeKey: 'Library Name',
                    attributeValue: 'com.rudderstack.android.sdk.core',
                  },
                  '14': {
                    attributeKey: 'IP',
                    attributeValue: '14.5.67.21',
                  },
                },
              },
              spreadSheet: 'rudder_sheet',
              spreadSheetId: 'rudder_sheet_id',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlesheets',
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
                credentials: '{ sheets credentials }',
                eventKeyMap: [
                  {
                    from: 'firstName',
                    to: 'First Name',
                  },
                  {
                    from: 'lastName',
                    to: 'Last Name',
                  },
                  {
                    from: 'birthday',
                    to: 'Birthday',
                  },
                  {
                    from: 'address.city',
                    to: 'City',
                  },
                  {
                    from: 'address.country',
                    to: 'Country',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'offer',
                    to: 'Offer',
                  },
                  {
                    from: 'title',
                    to: 'Title Page',
                  },
                  {
                    from: 'Cart Value',
                    to: 'Cart Value',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'context.app.build',
                    to: 'App Build',
                  },
                  {
                    from: 'context.app.name',
                    to: 'App Name',
                  },
                  {
                    from: 'context.library.name',
                    to: 'Library Name',
                  },
                  {
                    from: 'context.ip',
                    to: 'IP',
                  },
                ],
                sheetId: 'rudder_sheet_id',
                sheetName: 'rudder_sheet',
              },
            },
            message: {
              type: 'page',
              userId: 'userTest004',
              anonymousId: 'anon-id-new',
              name: '1mg Cart',
              properties: {
                title: 'Cart',
                path: '/',
                'Cart Value': 7800,
                revenue: 7500,
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              batch: {
                message: {
                  '0': {
                    attributeKey: 'messageId',
                    attributeValue: '',
                  },
                  '1': {
                    attributeKey: 'First Name',
                    attributeValue: '',
                  },
                  '2': {
                    attributeKey: 'Last Name',
                    attributeValue: '',
                  },
                  '3': {
                    attributeKey: 'Birthday',
                    attributeValue: '',
                  },
                  '4': {
                    attributeKey: 'City',
                    attributeValue: '',
                  },
                  '5': {
                    attributeKey: 'Country',
                    attributeValue: '',
                  },
                  '6': {
                    attributeKey: 'Revenue',
                    attributeValue: 7500,
                  },
                  '7': {
                    attributeKey: 'Offer',
                    attributeValue: '',
                  },
                  '8': {
                    attributeKey: 'Title Page',
                    attributeValue: 'Cart',
                  },
                  '9': {
                    attributeKey: 'Cart Value',
                    attributeValue: 7800,
                  },
                  '10': {
                    attributeKey: 'Revenue',
                    attributeValue: 7500,
                  },
                  '11': {
                    attributeKey: 'App Build',
                    attributeValue: '',
                  },
                  '12': {
                    attributeKey: 'App Name',
                    attributeValue: '',
                  },
                  '13': {
                    attributeKey: 'Library Name',
                    attributeValue: 'http',
                  },
                  '14': {
                    attributeKey: 'IP',
                    attributeValue: '14.5.67.21',
                  },
                },
              },
              spreadSheet: 'rudder_sheet',
              spreadSheetId: 'rudder_sheet_id',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlesheets',
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
                credentials: '{ sheets credentials }',
                eventKeyMap: [
                  {
                    from: 'firstName',
                    to: 'First Name',
                  },
                  {
                    from: 'lastName',
                    to: 'Last Name',
                  },
                  {
                    from: 'birthday',
                    to: 'Birthday',
                  },
                  {
                    from: 'address.city',
                    to: 'City',
                  },
                  {
                    from: 'address.country',
                    to: 'Country',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'offer',
                    to: 'Offer',
                  },
                  {
                    from: 'title',
                    to: 'Title Page',
                  },
                  {
                    from: 'Cart Value',
                    to: 'Cart Value',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'context.app.build',
                    to: 'App Build',
                  },
                  {
                    from: 'context.app.name',
                    to: 'App Name',
                  },
                  {
                    from: 'context.library.name',
                    to: 'Library Name',
                  },
                  {
                    from: 'context.ip',
                    to: 'IP',
                  },
                ],
                sheetId: 'rudder_sheet_id',
                sheetName: 'rudder_sheet',
              },
            },
            message: {
              type: 'page',
              userId: 'userTest005',
              anonymousId: 'anon-id-test',
              name: 'Viewed Home Screen',
              properties: {
                title: 'Home',
                path: '/home',
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              batch: {
                message: {
                  '0': {
                    attributeKey: 'messageId',
                    attributeValue: '',
                  },
                  '1': {
                    attributeKey: 'First Name',
                    attributeValue: '',
                  },
                  '2': {
                    attributeKey: 'Last Name',
                    attributeValue: '',
                  },
                  '3': {
                    attributeKey: 'Birthday',
                    attributeValue: '',
                  },
                  '4': {
                    attributeKey: 'City',
                    attributeValue: '',
                  },
                  '5': {
                    attributeKey: 'Country',
                    attributeValue: '',
                  },
                  '6': {
                    attributeKey: 'Revenue',
                    attributeValue: '',
                  },
                  '7': {
                    attributeKey: 'Offer',
                    attributeValue: '',
                  },
                  '8': {
                    attributeKey: 'Title Page',
                    attributeValue: 'Home',
                  },
                  '9': {
                    attributeKey: 'Cart Value',
                    attributeValue: '',
                  },
                  '10': {
                    attributeKey: 'Revenue',
                    attributeValue: '',
                  },
                  '11': {
                    attributeKey: 'App Build',
                    attributeValue: '',
                  },
                  '12': {
                    attributeKey: 'App Name',
                    attributeValue: '',
                  },
                  '13': {
                    attributeKey: 'Library Name',
                    attributeValue: 'http',
                  },
                  '14': {
                    attributeKey: 'IP',
                    attributeValue: '14.5.67.21',
                  },
                },
              },
              spreadSheet: 'rudder_sheet',
              spreadSheetId: 'rudder_sheet_id',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlesheets',
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
                credentials: '{ sheets credentials }',
                eventKeyMap: [
                  {
                    from: 'firstName',
                    to: 'First Name',
                  },
                  {
                    from: 'lastName',
                    to: 'Last Name',
                  },
                  {
                    from: 'birthday',
                    to: 'Birthday',
                  },
                  {
                    from: 'address.city',
                    to: 'City',
                  },
                  {
                    from: 'address.country',
                    to: 'Country',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'offer',
                    to: 'Offer',
                  },
                  {
                    from: 'title',
                    to: 'Title Page',
                  },
                  {
                    from: 'Cart Value',
                    to: 'Cart Value',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'context.app.build',
                    to: 'App Build',
                  },
                  {
                    from: 'context.app.name',
                    to: 'App Name',
                  },
                  {
                    from: 'context.library.name',
                    to: 'Library Name',
                  },
                  {
                    from: 'context.ip',
                    to: 'IP',
                  },
                ],
                sheetId: 'rudder_sheet_id',
                sheetName: 'rudder_sheet',
              },
            },
            message: {
              type: 'screen',
              name: 'Trello home Screen',
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              batch: {
                message: {
                  '0': {
                    attributeKey: 'messageId',
                    attributeValue: '',
                  },
                  '1': {
                    attributeKey: 'First Name',
                    attributeValue: '',
                  },
                  '2': {
                    attributeKey: 'Last Name',
                    attributeValue: '',
                  },
                  '3': {
                    attributeKey: 'Birthday',
                    attributeValue: '',
                  },
                  '4': {
                    attributeKey: 'City',
                    attributeValue: '',
                  },
                  '5': {
                    attributeKey: 'Country',
                    attributeValue: '',
                  },
                  '6': {
                    attributeKey: 'Revenue',
                    attributeValue: '',
                  },
                  '7': {
                    attributeKey: 'Offer',
                    attributeValue: '',
                  },
                  '8': {
                    attributeKey: 'Title Page',
                    attributeValue: '',
                  },
                  '9': {
                    attributeKey: 'Cart Value',
                    attributeValue: '',
                  },
                  '10': {
                    attributeKey: 'Revenue',
                    attributeValue: '',
                  },
                  '11': {
                    attributeKey: 'App Build',
                    attributeValue: '',
                  },
                  '12': {
                    attributeKey: 'App Name',
                    attributeValue: '',
                  },
                  '13': {
                    attributeKey: 'Library Name',
                    attributeValue: 'http',
                  },
                  '14': {
                    attributeKey: 'IP',
                    attributeValue: '14.5.67.21',
                  },
                },
              },
              spreadSheet: 'rudder_sheet',
              spreadSheetId: 'rudder_sheet_id',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'googlesheets',
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
                credentials: '{ sheets credentials }',
                eventKeyMap: [
                  {
                    from: 'firstName',
                    to: 'First Name',
                  },
                  {
                    from: 'lastName',
                    to: 'Last Name',
                  },
                  {
                    from: 'birthday',
                    to: 'Birthday',
                  },
                  {
                    from: 'address.city',
                    to: 'City',
                  },
                  {
                    from: 'address.country',
                    to: 'Country',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'offer',
                    to: 'Offer',
                  },
                  {
                    from: 'title',
                    to: 'Title Page',
                  },
                  {
                    from: 'Cart Value',
                    to: 'Cart Value',
                  },
                  {
                    from: 'revenue',
                    to: 'Revenue',
                  },
                  {
                    from: 'context.app.build',
                    to: 'App Build',
                  },
                  {
                    from: 'context.app.name',
                    to: 'App Name',
                  },
                  {
                    from: 'context.library.name',
                    to: 'Library Name',
                  },
                  {
                    from: 'context.ip',
                    to: 'IP',
                  },
                ],
                sheetId: 'rudder_sheet_id',
              },
            },
            message: {
              type: 'screen',
              name: 'Trello home Screen',
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
            error: 'No Spread Sheet set for this event',
            statTags: {
              destType: 'GOOGLESHEETS',
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
];
