export const data = [
  {
    name: 'clevertap',
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
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
              },
            },
            message: {
              channel: 'web',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        Email: 'jamesDoe@gmail.com',
                        Name: 'James Doe',
                        Phone: '92374162212',
                        Gender: 'M',
                        Employed: true,
                        DOB: '1614775793',
                        Education: 'Science',
                        Married: true,
                        'Customer Type': 'Prime',
                        graduate: true,
                        msg_push: true,
                        msgSms: true,
                        msgemail: true,
                        msgwhatsapp: false,
                        custom_tags: '["Test_User","Interested_User","DIY_Hobby"]',
                        custom_mappings: '{"Office":"Trastkiv","Country":"Russia"}',
                        address:
                          '{"city":"kolkata","country":"India","postalCode":789223,"state":"WB","street":""}',
                      },
                      identity: 'anon_id',
                    },
                  ],
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
    name: 'clevertap',
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
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        Email: 'jamesDoe@gmail.com',
                        Name: 'James Doe',
                        Phone: '92374162212',
                        Gender: 'M',
                        Employed: true,
                        DOB: '1614775793',
                        Education: 'Science',
                        Married: true,
                        'Customer Type': 'Prime',
                        graduate: true,
                        msg_push: true,
                        msgSms: true,
                        msgemail: true,
                        msgwhatsapp: false,
                        custom_tags: '["Test_User","Interested_User","DIY_Hobby"]',
                        custom_mappings: '{"Office":"Trastkiv","Country":"Russia"}',
                        address:
                          '{"city":"kolkata","country":"India","postalCode":789223,"state":"WB","street":""}',
                      },
                      identity: 'anon_id',
                    },
                  ],
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
    name: 'clevertap',
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
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
              },
            },
            message: {
              type: 'page',
              anonymousId: 'anon-id-new',
              name: 'Rudder',
              properties: {
                title: 'Home',
                path: '/',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      evtName: 'Web Page Viewed: Rudder',
                      evtData: {
                        title: 'Home',
                        path: '/',
                      },
                      type: 'event',
                      identity: 'anon-id-new',
                    },
                  ],
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
    name: 'clevertap',
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
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
              },
            },
            message: {
              type: 'screen',
              userId: 'identified_user_id',
              name: 'Rudder-Screen',
              properties: {
                prop1: '5',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      evtName: 'Screen Viewed: Rudder-Screen',
                      evtData: {
                        prop1: '5',
                      },
                      type: 'event',
                      identity: 'identified_user_id',
                    },
                  ],
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
    name: 'clevertap',
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
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
              },
            },
            message: {
              type: 'track',
              userId: 'user123',
              event: 'Product Purchased',
              properties: {
                name: "Rubik's Cube",
                revenue: 4.99,
              },
              context: {
                ip: '14.5.67.21',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      evtName: 'Product Purchased',
                      evtData: {
                        name: "Rubik's Cube",
                        revenue: 4.99,
                      },
                      type: 'event',
                      identity: 'user123',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 5: ERROR - Message Type is not present. Aborting message.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
              },
            },
            message: {
              userId: 'user1234',
              event: 'FailTest',
              properties: {
                name: 'Random',
                revenue: 4.99,
              },
              context: {
                ip: '14.5.67.21',
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
            statusCode: 400,
            error: 'Message Type is not present. Aborting message.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CLEVERTAP',
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
    name: 'clevertap',
    description: 'Test 6: ERROR - Message type not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
              },
            },
            message: {
              type: 'Rndm',
              userId: 'user1234',
              event: 'FailTest',
              properties: {
                name: 'Random2',
                revenue: 4.99,
              },
              context: {
                ip: '14.5.67.21',
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
            statusCode: 400,
            error: 'Message type not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CLEVERTAP',
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
    name: 'clevertap',
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
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
              },
            },
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2021-03-10T11:59:57.815Z',
              userId: 'riverjohn',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.13',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:5500/test.html',
                  path: '/test.html',
                  title: 'sample source',
                  search: '',
                  referrer: 'http://127.0.0.1:5500/',
                  referring_domain: '127.0.0.1:5500',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'riverjohn@gmail.com',
                  phone: '+12345678900',
                  avatar: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
                  testIng: true,
                  lastName: 'John',
                  firstname: 'River',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.13',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0',
              },
              rudderId: 'fd5d3d37-3ce6-471d-b416-2f351212a44f',
              messageId: '8ff6fd1b-b381-43fc-883c-92bf8eb0e725',
              properties: {
                tax: 1,
                total: 20,
                coupon: 'ImagePro',
                revenue: 15,
                currency: 'USD',
                discount: 1.5,
                order_id: '1234',
                ts: '2021-03-10T11:59:22.080Z',
                products: [
                  {
                    sku: 'G-32',
                    url: 'https://www.website.com/product/path',
                    name: 'Monopoly',
                    price: 14,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https://www.website.com/product/path.jpg',
                    product_id: '123',
                  },
                  {
                    sku: 'F-32',
                    name: 'UNO',
                    price: 3.45,
                    category: 'Games',
                    quantity: 2,
                    product_id: '345',
                  },
                ],
                shipping: 22,
                affiliation: 'Apple Store',
                checkout_id: '12345',
              },
              anonymousId: 'b2e06708-dd2a-4aee-bb32-41855d2fbdab',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-03-10T11:59:22.080Z',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      evtName: 'Charged',
                      evtData: {
                        'Charged ID': '12345',
                        Amount: 15,
                        Items: [
                          {
                            sku: 'G-32',
                            url: 'https://www.website.com/product/path',
                            name: 'Monopoly',
                            price: 14,
                            category: 'Games',
                            quantity: 1,
                            image_url: 'https://www.website.com/product/path.jpg',
                            product_id: '123',
                          },
                          {
                            sku: 'F-32',
                            name: 'UNO',
                            price: 3.45,
                            category: 'Games',
                            quantity: 2,
                            product_id: '345',
                          },
                        ],
                        tax: 1,
                        total: 20,
                        coupon: 'ImagePro',
                        currency: 'USD',
                        discount: 1.5,
                        order_id: '1234',
                        shipping: 22,
                        affiliation: 'Apple Store',
                      },
                      ts: 1615377562,
                      type: 'event',
                      identity: 'riverjohn',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 8: ERROR - userId, not present cannot track anonymous user',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: false,
                enableObjectIdMapping: false,
              },
            },
            message: {
              type: 'track',
              anonymousId: 'random_anon_id',
              event: 'FailTest_with_anon',
              properties: {
                name: 'Random2',
                revenue: 4.99,
              },
              context: {
                ip: '14.5.67.21',
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
            statusCode: 400,
            error: 'userId, not present cannot track anonymous user',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CLEVERTAP',
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
    name: 'clevertap',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
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
                anonymousId: 'anon_id',
                email: 'jamesDoe@gmail.com',
                name: 'James Doe',
                phone: '92374162212',
                gender: 'female',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        Email: 'jamesDoe@gmail.com',
                        Name: 'James Doe',
                        Phone: '92374162212',
                        Gender: 'F',
                        Employed: true,
                        DOB: '1614775793',
                        Education: 'Science',
                        Married: true,
                        'Customer Type': 'Prime',
                        graduate: true,
                        msg_push: true,
                        msgSms: true,
                        msgemail: true,
                        msgwhatsapp: false,
                        custom_tags: '["Test_User","Interested_User","DIY_Hobby"]',
                        custom_mappings: '{"Office":"Trastkiv","Country":"Russia"}',
                        address:
                          '{"city":"kolkata","country":"India","postalCode":789223,"state":"WB","street":""}',
                      },
                      identity: 'anon_id',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
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
                anonymousId: 'anon_id',
                email: 'jamesDoe@gmail.com',
                name: 'James Doe',
                phone: '92374162212',
                gender: 'other',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        Email: 'jamesDoe@gmail.com',
                        Name: 'James Doe',
                        Phone: '92374162212',
                        Employed: true,
                        DOB: '1614775793',
                        Education: 'Science',
                        Married: true,
                        'Customer Type': 'Prime',
                        graduate: true,
                        msg_push: true,
                        msgSms: true,
                        msgemail: true,
                        msgwhatsapp: false,
                        custom_tags: '["Test_User","Interested_User","DIY_Hobby"]',
                        custom_mappings: '{"Office":"Trastkiv","Country":"Russia"}',
                        address:
                          '{"city":"kolkata","country":"India","postalCode":789223,"state":"WB","street":""}',
                      },
                      identity: 'anon_id',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: true,
              },
            },
            message: {
              type: 'identify',
              event: 'identify',
              sentAt: '2021-05-24T08:53:38.762Z',
              userId: 'useran4',
              channel: 'mobile',
              context: {
                os: {
                  name: 'Android',
                  version: '10',
                },
                app: {
                  name: 'myfirstapp',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.example.myfirstapp',
                },
                device: {
                  id: 'f54bb572361c4fd1',
                  name: 'whyred',
                  type: 'Android',
                  model: 'Redmi Note 5 Pro',
                  manufacturer: 'Xiaomi',
                  token: 'frfsgvrwe:APfdsafsgdfsgghfgfgjkhfsfgdhjhbvcvnetry767456fxsasdf',
                },
                locale: 'en-IN',
                screen: {
                  width: 1080,
                  height: 2118,
                  density: 420,
                },
                traits: {
                  id: 'useran4',
                  email: 'tony4an@testmail.com',
                  phone: '4444457700',
                  userId: 'useran4',
                  lastname: 'Stark',
                  firstname: 'Tony4AN',
                  anonymousId: 'f54bb572361c4fd1',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.12',
                },
                network: {
                  wifi: true,
                  carrier: 'airtel',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 10; Redmi Note 5 Pro Build/QQ3A.200805.001)',
              },
              rudderId: 'd8dd4917-bdb2-4c17-8f62-24c79d87a937',
              messageId: '1621846417928-7fbb739f-5f96-48ca-9ebb-5bfc4076a687',
              anonymousId: 'f54bb572361c4fd1',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-05-24T08:53:37.929Z',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        Email: 'tony4an@testmail.com',
                        Phone: '4444457700',
                        Name: 'Tony4AN Stark',
                        identity: 'useran4',
                      },
                      objectId: 'f54bb572361c4fd1',
                    },
                  ],
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
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'token',
                      tokenData: {
                        id: 'frfsgvrwe:APfdsafsgdfsgghfgfgjkhfsfgdhjhbvcvnetry767456fxsasdf',
                        type: 'fcm',
                      },
                      objectId: 'f54bb572361c4fd1',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: true,
              },
            },
            message: {
              type: 'identify',
              event: 'identify',
              sentAt: '2021-04-21T12:05:42.383Z',
              userId: 'ankur4',
              channel: 'mobile',
              context: {
                os: {
                  name: 'iOS',
                  version: '13.0',
                },
                app: {
                  name: 'Rudder-CleverTap_Example',
                  build: '1.0',
                  version: '1.0',
                  namespace: 'org.cocoapods.demo.Rudder-CleverTap-Example',
                },
                device: {
                  id: 'cd3a4439-7df0-4475-acb9-6659c7c4dfe3',
                  name: 'iPhone 11 Pro Max',
                  type: 'iOS',
                  model: 'iPhone',
                  manufacturer: 'Apple',
                  token: 'frfsgvrwe:APfdsafsgdfsgghfgfgjkhfsfgdhjhbvcvnetry767456fxsasdf',
                },
                locale: 'en-US',
                screen: {
                  width: 896,
                  height: 414,
                  density: 3,
                },
                traits: {
                  name: 'Ankur4 Mittal',
                  email: 'ankur4gmail',
                  phone: '8260294239',
                  userId: 'ankur4',
                },
                library: {
                  name: 'rudder-ios-library',
                  version: '1.0.11',
                },
                network: {
                  wifi: true,
                  carrier: 'unavailable',
                  cellular: false,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent: 'unknown',
              },
              rudderId: 'f5bb9c22-4987-4ef2-9b58-52788035ffb7',
              messageId: '1619006730-60fa60c0-3c77-4de7-95d4-e7dc58214947',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-04-21T12:05:30.330Z',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        Email: 'ankur4gmail',
                        Name: 'Ankur4 Mittal',
                        Phone: '8260294239',
                      },
                      identity: 'ankur4',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: true,
              },
            },
            message: {
              event: 'Random',
              properties: {
                country_region: 'India',
                test: 'abc',
              },
              receivedAt: '2021-08-20T12:49:07.691Z',
              rudderId: '138c4214-b537-4f77-9dea-9abde70b5147',
              type: 'track',
              anonymousId: 'cd3a4439-7df0-4475-acb9-6659c7c4dfe3',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      evtName: 'Random',
                      evtData: {
                        country_region: 'India',
                        test: 'abc',
                      },
                      type: 'event',
                      objectId: 'cd3a4439-7df0-4475-acb9-6659c7c4dfe3',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: true,
              },
            },
            message: {
              event: 'Random 2',
              properties: {
                country_region: 'India',
                test: 'abc',
              },
              receivedAt: '2021-08-20T12:49:07.691Z',
              rudderId: '138c4214-b537-4f77-9dea-9abde70b5147',
              type: 'track',
              userId: 'ankur4',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      evtName: 'Random 2',
                      evtData: {
                        country_region: 'India',
                        test: 'abc',
                      },
                      type: 'event',
                      identity: 'ankur4',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
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
                ts: '2021-03-10T11:59:22.080Z',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        Email: 'jamesDoe@gmail.com',
                        Name: 'James Doe',
                        Phone: '92374162212',
                        Gender: 'M',
                        Employed: true,
                        DOB: '1614775793',
                        Education: 'Science',
                        Married: true,
                        'Customer Type': 'Prime',
                        graduate: true,
                        msg_push: true,
                        msgSms: true,
                        msgemail: true,
                        msgwhatsapp: false,
                        custom_tags: '["Test_User","Interested_User","DIY_Hobby"]',
                        custom_mappings: '{"Office":"Trastkiv","Country":"Russia"}',
                        address:
                          '{"city":"kolkata","country":"India","postalCode":789223,"state":"WB","street":""}',
                      },
                      ts: 1615377562,
                      identity: 'anon_id',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: true,
              },
            },
            message: {
              type: 'identify',
              event: 'identify',
              sentAt: '2021-05-24T08:53:38.762Z',
              userId: 'useran4',
              channel: 'mobile',
              context: {
                os: {
                  name: 'watchos',
                },
                app: {
                  name: 'myfirstapp',
                  build: '1',
                  version: '1.0',
                  namespace: 'com.example.myfirstapp',
                },
                device: {
                  id: 'cd3a4439-7df0-4475-acb9-6659c7c4dfe3',
                  type: 'watchos',
                  manufacturer: 'Apple',
                  token: 'frfsgvrwe:APfdsafsgdfsgghfgfgjkhfsfgdhjhbvcvnetry767456fxsasdf',
                },
                locale: 'en-IN',
                screen: {
                  width: 1080,
                  height: 2118,
                  density: 420,
                },
                traits: {
                  id: 'useran4',
                  email: 'tony4an@testmail.com',
                  phone: '4444457700',
                  userId: 'useran4',
                  lastname: 'Stark',
                  firstname: 'Tony4AN',
                  anonymousId: 'f54bb572361c4fd1',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.12',
                },
                network: {
                  wifi: true,
                  carrier: 'airtel',
                  cellular: true,
                  bluetooth: false,
                },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 10; Redmi Note 5 Pro Build/QQ3A.200805.001)',
              },
              rudderId: 'd8dd4917-bdb2-4c17-8f62-24c79d87a937',
              messageId: '1621846417928-7fbb739f-5f96-48ca-9ebb-5bfc4076a687',
              anonymousId: 'f54bb572361c4fd1',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-05-24T08:53:37.929Z',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        Email: 'tony4an@testmail.com',
                        Phone: '4444457700',
                        Name: 'Tony4AN Stark',
                        identity: 'useran4',
                      },
                      objectId: 'f54bb572361c4fd1',
                    },
                  ],
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
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'token',
                      tokenData: {
                        id: 'frfsgvrwe:APfdsafsgdfsgghfgfgjkhfsfgdhjhbvcvnetry767456fxsasdf',
                        type: 'apns',
                      },
                      objectId: 'f54bb572361c4fd1',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: true,
              },
            },
            message: {
              type: 'alias',
              userId: 'newaddedid001',
              context: {
                traits: {
                  ts: 1468308340,
                },
              },
              rudderId: 'a8556b1b-9d11-478d-9242-be124d1f0c93',
              messageId: '46c1a69c-cc24-4a49-8079-3fcbabf15eb8',
              previousId: '1122121',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        identity: 'newaddedid001',
                      },
                      ts: 1468308340,
                      identity: '1122121',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 18',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
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
                anonymousId: 'anon_id',
                email: 'johnDoe@gmail.com',
                first_name: 'John',
                last_name: 'Doe',
                phone: '92374162212',
                gender: 'M',
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
                overrideFields: {
                  first_name: 'John',
                  last_name: 'Doe',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        Email: 'johnDoe@gmail.com',
                        Phone: '92374162212',
                        Gender: 'M',
                        Employed: true,
                        DOB: '1614775793',
                        Education: 'Science',
                        Married: true,
                        'Customer Type': 'Prime',
                        Name: 'John Doe',
                        graduate: true,
                        msg_push: true,
                        msgSms: true,
                        msgemail: true,
                        msgwhatsapp: false,
                        custom_tags: '["Test_User","Interested_User","DIY_Hobby"]',
                        custom_mappings: '{"Office":"Trastkiv","Country":"Russia"}',
                        address:
                          '{"city":"kolkata","country":"India","postalCode":789223,"state":"WB","street":""}',
                        first_name: 'John',
                        last_name: 'Doe',
                      },
                      identity: 'anon_id',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 19',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
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
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  overrideFields: {
                    first_name: 'John',
                    last_name: 'Doe',
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
                email: 'johnDoe@gmail.com',
                first_name: 'John',
                last_name: 'Doe',
                phone: '92374162212',
                gender: 'M',
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
              endpoint: 'https://api.clevertap.com/1/upload',
              headers: {
                'X-CleverTap-Account-Id': '476550467',
                'X-CleverTap-Passcode': 'sample_passcode',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  d: [
                    {
                      type: 'profile',
                      profileData: {
                        Email: 'johnDoe@gmail.com',
                        Phone: '92374162212',
                        Gender: 'M',
                        Employed: true,
                        DOB: '1614775793',
                        Education: 'Science',
                        Married: true,
                        'Customer Type': 'Prime',
                        Name: 'John Doe',
                        graduate: true,
                        msg_push: true,
                        msgSms: true,
                        msgemail: true,
                        msgwhatsapp: false,
                        custom_tags: '["Test_User","Interested_User","DIY_Hobby"]',
                        custom_mappings: '{"Office":"Trastkiv","Country":"Russia"}',
                        address:
                          '{"city":"kolkata","country":"India","postalCode":789223,"state":"WB","street":""}',
                        first_name: 'John',
                        last_name: 'Doe',
                      },
                      identity: 'anon_id',
                    },
                  ],
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
    name: 'clevertap',
    description: 'Test 20: ERROR - Products property value must be an array of objects',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: false,
              },
            },
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2021-03-10T11:59:57.815Z',
              userId: 'riverjohn',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.13',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:5500/test.html',
                  path: '/test.html',
                  title: 'sample source',
                  search: '',
                  referrer: 'http://127.0.0.1:5500/',
                  referring_domain: '127.0.0.1:5500',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'riverjohn@gmail.com',
                  phone: '+12345678900',
                  avatar: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
                  testIng: true,
                  lastName: 'John',
                  firstname: 'River',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.13',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0',
              },
              rudderId: 'fd5d3d37-3ce6-471d-b416-2f351212a44f',
              messageId: '8ff6fd1b-b381-43fc-883c-92bf8eb0e725',
              properties: {
                tax: 1,
                total: 20,
                coupon: 'ImagePro',
                revenue: 15,
                currency: 'USD',
                discount: 1.5,
                order_id: '1234',
                ts: '2021-03-10T11:59:22.080Z',
                products: {
                  sku: 'G-32',
                  url: 'https://www.website.com/product/path',
                  name: 'Monopoly',
                  price: 14,
                  category: 'Games',
                  quantity: 1,
                  image_url: 'https://www.website.com/product/path.jpg',
                  product_id: '123',
                },
                shipping: 22,
                affiliation: 'Apple Store',
                checkout_id: '12345',
              },
              anonymousId: 'b2e06708-dd2a-4aee-bb32-41855d2fbdab',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-03-10T11:59:22.080Z',
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
            error: 'Products property value must be an array of objects',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CLEVERTAP',
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
    name: 'clevertap',
    description: 'Test 21: ERROR - Unable to process without anonymousId or userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                passcode: 'sample_passcode',
                accountId: '476550467',
                trackAnonymous: true,
                enableObjectIdMapping: true,
              },
            },
            message: {
              event: 'Random',
              properties: {
                country_region: 'India',
                test: 'abc',
              },
              receivedAt: '2021-08-20T12:49:07.691Z',
              rudderId: '138c4214-b537-4f77-9dea-9abde70b5147',
              type: 'track',
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
            error: 'Unable to process without anonymousId or userId',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CLEVERTAP',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
];
