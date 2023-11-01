export const data = [
  {
    name: 'blueshift',
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
                eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                dataCenter: 'standard',
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
                  name: 'hardik',
                  email: 'hardik@rudderstack.com',
                  cookie: '1234abcd-efghklkj-1234kfjadslk-34iu123',
                  industry: 'Education',
                  employees: 399,
                  plan: 'enterprise',
                  'total billed': 830,
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
              },
              type: 'group',
              messageId: 'e5034df0-a404-47b4-a463-76df99934fea',
              anonymousId: 'my-anonymous-id-new',
              userId: 'sampleusrRudder7',
              traits: {
                groupType: 'company',
                name_trait: 'Company',
                value_trait: 'Comapny-ABC',
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
            error: 'Missing required value from "groupId"',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BLUESHIFT',
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
    name: 'blueshift',
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
                eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                dataCenter: 'standard',
              },
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'blueshift',
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
                eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                usersApiKey: 'b4a29aba5e75d99c8a18acd920ec1e2e',
                dataCenter: 'standard',
              },
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
              endpoint: 'https://api.getblueshift.com/api/v1/event',
              headers: {
                Authorization: 'Basic ZWZlYjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q2MjBlYzE=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  customer_id: 'sampleusrRudder7',
                  event: 'identify',
                  device_type: 'Android',
                  device_id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  device_idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  device_idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  device_manufacturer: 'Google',
                  os_name: 'Android',
                  network_carrier: 'Android',
                  ip: '14.5.67.21',
                  latitude: '37.7672319',
                  longitude: '-122.4021353',
                  event_uuid: '34abcd-efghijkj-1234kf',
                  cookie: '1234abcd-efghijkj-1234kfjadslk-34iu123',
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
    name: 'blueshift',
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
                eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                dataCenter: 'standard',
              },
            },
            message: {
              type: 'track',
              event: 'Product Viewed',
              properties: {
                cookie: '1234abcd-efghijkj-1234kfjadslk-34iu123',
                checkout_id: 'C324532',
                order_id: 'T1230',
                value: 15.98,
                revenue: 16.98,
                shipping: 3,
                coupon: 'FY21',
                currency: 'INR',
                products: [
                  {
                    product_id: 'product-mixedfruit-jam',
                    sku: 'sku-1',
                    category: 'Food',
                    name: 'Food/Drink',
                    brand: 'Sample',
                    variant: 'None',
                    price: 10,
                    quantity: 2,
                    currency: 'INR',
                    position: 1,
                    value: 6,
                    typeOfProduct: 'Food',
                    url: 'https://www.example.com/product/bacon-jam',
                    image_url: 'https://www.example.com/product/bacon-jam.jpg',
                  },
                ],
              },
              context: {
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
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
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
                timezone: 'Asia/Mumbai',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
            },
            messageId: '34abcd-efghijkj-1234kf',
            userId: 'sampleRudderstack9',
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
              endpoint: 'https://api.getblueshift.com/api/v1/event',
              headers: {
                Authorization: 'Basic ZWZlYjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q2MjBlYzE=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'view',
                  device_type: 'android',
                  device_id: '7e32188a4dab669f',
                  device_idfv: '7e32188a4dab669f',
                  device_manufacturer: 'Google',
                  os_name: 'Android',
                  network_carrier: 'Android',
                  cookie: '1234abcd-efghijkj-1234kfjadslk-34iu123',
                  checkout_id: 'C324532',
                  order_id: 'T1230',
                  value: 15.98,
                  revenue: 16.98,
                  shipping: 3,
                  coupon: 'FY21',
                  currency: 'INR',
                  products: [
                    {
                      product_id: 'product-mixedfruit-jam',
                      sku: 'sku-1',
                      category: 'Food',
                      name: 'Food/Drink',
                      brand: 'Sample',
                      variant: 'None',
                      price: 10,
                      quantity: 2,
                      currency: 'INR',
                      position: 1,
                      value: 6,
                      typeOfProduct: 'Food',
                      url: 'https://www.example.com/product/bacon-jam',
                      image_url: 'https://www.example.com/product/bacon-jam.jpg',
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
    name: 'blueshift',
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
                eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                dataCenter: 'eu',
              },
            },
            message: {
              type: 'track',
              event: 'Products Searched',
              properties: {
                description: 'Sneaker purchase',
                brand: 'Victory Sneakers',
                colors: ['red', 'blue'],
                items: [
                  {
                    text: 'New Line Sneakers',
                    price: '$ 79.95',
                  },
                  {
                    text: 'Old Line Sneakers',
                    price: '$ 79.95',
                  },
                  {
                    text: 'Blue Line Sneakers',
                    price: '$ 79.95',
                  },
                ],
                name: 'Hugh Manbeing',
                userLocation: {
                  state: 'CO',
                  zip: '80202',
                },
              },
              context: {
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
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
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
                timezone: 'Asia/Mumbai',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
            },
            messageId: '34abcd-efghijkj-1234kf',
            userId: 'sampleRudderstack9',
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
              endpoint: 'https://api.eu.getblueshift.com/api/v1/event',
              headers: {
                Authorization: 'Basic ZWZlYjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q2MjBlYzE=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'search',
                  device_type: 'android',
                  device_id: '7e32188a4dab669f',
                  device_idfv: '7e32188a4dab669f',
                  device_manufacturer: 'Google',
                  os_name: 'Android',
                  network_carrier: 'Android',
                  description: 'Sneaker purchase',
                  brand: 'Victory Sneakers',
                  colors: ['red', 'blue'],
                  items: [
                    {
                      text: 'New Line Sneakers',
                      price: '$ 79.95',
                    },
                    {
                      text: 'Old Line Sneakers',
                      price: '$ 79.95',
                    },
                    {
                      text: 'Blue Line Sneakers',
                      price: '$ 79.95',
                    },
                  ],
                  name: 'Hugh Manbeing',
                  userLocation: {
                    state: 'CO',
                    zip: '80202',
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
    name: 'blueshift',
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
                usersApiKey: 'b4a29aba5e75d99c8a18acd920ec1e2e',
                dataCenter: 'standard',
              },
            },
            message: {
              type: 'track',
              event: 'Product_purchased',
              properties: {
                cookie: '1234abcd-efghijkj-1234kfjadslk-34iu123',
              },
              messageId: '34abcd-efghijkj-1234kf',
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
              userId: 'sampleRudderstack9',
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
            error: '[BLUESHIFT] event Api Keys required for Authentication.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'BLUESHIFT',
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
    name: 'blueshift',
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
                eventApiKey: 'a5e75d99c8a18acb4a29abd920ec1e2e',
                usersApiKey: 'b4a29aba5e75d99c8a18acd920ec1e2e',
                dataCenter: 'standard',
              },
            },
            message: {
              type: 'identify',
              event: 'Product_purchased',
              properties: {
                cookie: '1234abcd-efghijkj-1234kfjadslk-34iu123',
              },
              messageId: '34abcd-efghijkj-1234kf',
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
              userId: 'sampleRudderstack9',
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
            error: 'Missing required value from "email"',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BLUESHIFT',
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
    name: 'blueshift',
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
                eventApiKey: 'a5e75d99c8a18acb4a29abd920ec1e2e',
                usersApiKey: 'b4a29aba5e75d99c8a18acd920ec1e2e',
                dataCenter: 'standard',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'blueshift',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                eventApiKey: 'a5e75d99c8a18acb4a29abd920ec1e2e',
                dataCenter: 'eu',
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
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: '[BLUESHIFT] User API Key required for Authentication.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'BLUESHIFT',
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
    name: 'blueshift',
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
                eventApiKey: 'a5e75d99c8a18acb4a29abd920ec1e2e',
                usersApiKey: 'b4a29aba5e75d99c8a18acd920ec1e2e',
                dataCenter: 'eu',
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
                locale: 'en-US',
                ip: '0.0.0.0',
              },
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
              endpoint: 'https://api.eu.getblueshift.com/api/v1/customers',
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
    name: 'blueshift',
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
                eventApiKey: 'a5e75d99c8a18acb4a29abd920ec1e2e',
                usersApiKey: 'b4a29aba5e75d99c8a18acd920ec1e2e',
                dataCenter: 'eu',
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
                locale: 'en-US',
                ip: '0.0.0.0',
              },
              traits: {
                email: 'chandan@companyname.com',
                userId: 'rudder123',
                anonymousId: 'anon_id',
                name: 'James Doe',
                phone: '92374162212',
                gender: 'M',
                firstname: 'James',
                lastname: 'Doe',
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
            error: 'Message Type is not present. Aborting message.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BLUESHIFT',
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
    name: 'blueshift',
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
                eventApiKey: 'a5e75d99c8a18acb4a29abd920ec1e2e',
                usersApiKey: 'b4a29aba5e75d99c8a18acd920ec1e2e',
                dataCenter: 'eu',
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
                locale: 'en-US',
                ip: '0.0.0.0',
              },
              type: 'page',
              traits: {
                email: 'chandan@companyname.com',
                userId: 'rudder123',
                anonymousId: 'anon_id',
                name: 'James Doe',
                phone: '92374162212',
                gender: 'M',
                firstname: 'James',
                lastname: 'Doe',
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
            error: 'Message type page not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BLUESHIFT',
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
    name: 'blueshift',
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
                eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                dataCenter: 'eu',
              },
            },
            message: {
              type: 'track',
              event: 'Order Completed',
              properties: {
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'Games,Gifts,Entertainment,Toys',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    quantity: '2',
                    position: '1',
                    category: 'Games,Gifts,Entertainment,Toys',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                ],
              },
              context: {
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
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
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
                timezone: 'Asia/Mumbai',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              userId: 'sampleRudderstack11',
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
              endpoint: 'https://api.eu.getblueshift.com/api/v1/event',
              headers: {
                Authorization: 'Basic ZWZlYjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q2MjBlYzE=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  customer_id: 'sampleRudderstack11',
                  event: 'purchase',
                  device_type: 'android',
                  device_id: '7e32188a4dab669f',
                  device_idfv: '7e32188a4dab669f',
                  device_manufacturer: 'Google',
                  os_name: 'Android',
                  network_carrier: 'Android',
                  total: 1000,
                  products: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      price: '19',
                      position: '1',
                      category: 'Games,Gifts,Entertainment,Toys',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
                    },
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      sku: '45790-32',
                      name: 'Monopoly: 3rd Edition',
                      price: '19',
                      quantity: '2',
                      position: '1',
                      category: 'Games,Gifts,Entertainment,Toys',
                      url: 'https://www.example.com/product/path',
                      image_url: 'https://www.example.com/product/path.jpg',
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
    name: 'blueshift',
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
                eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                usersApiKey: 'b4a29aba5e75d99c8a18acd920ec1e2e',
                dataCenter: 'eu',
              },
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
              event: 'Custom Events',
              userId: 'sampleusrRudder7',
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
              endpoint: 'https://api.eu.getblueshift.com/api/v1/event',
              headers: {
                Authorization: 'Basic ZWZlYjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q2MjBlYzE=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  customer_id: 'sampleusrRudder7',
                  event: 'Custom_Events',
                  device_type: 'Android',
                  device_id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  device_idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  device_idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  device_manufacturer: 'Google',
                  os_name: 'Android',
                  network_carrier: 'Android',
                  ip: '14.5.67.21',
                  latitude: '37.7672319',
                  longitude: '-122.4021353',
                  event_uuid: '34abcd-efghijkj-1234kf',
                  cookie: '1234abcd-efghijkj-1234kfjadslk-34iu123',
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
    name: 'blueshift',
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
                eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                dataCenter: 'eu',
              },
            },
            message: {
              type: 'track',
              event: 'Order 9Completed',
              properties: {
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'Games,Gifts,Entertainment,Toys',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    quantity: '2',
                    position: '1',
                    category: 'Games,Gifts,Entertainment,Toys',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                ],
              },
              context: {
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
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
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
                timezone: 'Asia/Mumbai',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              userId: 'sampleRudderstack11',
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
              "[Blueshift] Event shouldn't contain period(.), numeric value and contains not more than 64 characters",
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BLUESHIFT',
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
    name: 'blueshift',
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
                eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                dataCenter: 'eu',
              },
            },
            message: {
              type: 'track',
              event: 'Order.Completed',
              properties: {
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'Games,Gifts,Entertainment,Toys',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    quantity: '2',
                    position: '1',
                    category: 'Games,Gifts,Entertainment,Toys',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                  },
                ],
              },
              context: {
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
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
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
                timezone: 'Asia/Mumbai',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              userId: 'sampleRudderstack11',
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
              "[Blueshift] Event shouldn't contain period(.), numeric value and contains not more than 64 characters",
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BLUESHIFT',
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
    name: 'blueshift',
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
                eventApiKey: 'efeb4a29aba5e75d99c8a18acd620ec1',
                usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                dataCenter: 'standard',
              },
            },
            message: {
              channel: 'web',
              context: {
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
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
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
                timezone: 'Asia/Mumbai',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              type: 'group',
              messageId: 'e5034jh0-a404-47b4-a463-76df99934kl2',
              userId: 'sampleusrRudder1',
              groupId: 'group22222',
              traits: {
                name: 'hardik',
                email: 'hardik@rudderstack.com',
                cookie: '1234abcd-efghklkj-1234kfjadslk-34iu123',
                industry: 'Education',
                employees: 399,
                plan: 'enterprise',
                'total billed': 830,
                gender: 'male',
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
              endpoint: 'https://api.getblueshift.com/api/v1/event',
              headers: {
                Authorization: 'Basic ZWZlYjRhMjlhYmE1ZTc1ZDk5YzhhMThhY2Q2MjBlYzE=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  group_id: 'group22222',
                  customer_id: 'sampleusrRudder1',
                  email: 'hardik@rudderstack.com',
                  device_type: 'android',
                  device_id: '7e32188a4dab669f',
                  device_idfv: '7e32188a4dab669f',
                  device_manufacturer: 'Google',
                  os_name: 'Android',
                  network_carrier: 'Android',
                  event_uuid: 'e5034jh0-a404-47b4-a463-76df99934kl2',
                  event: 'identify',
                  name: 'hardik',
                  cookie: '1234abcd-efghklkj-1234kfjadslk-34iu123',
                  industry: 'Education',
                  employees: 399,
                  plan: 'enterprise',
                  'total billed': 830,
                  gender: 'male',
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
    name: 'blueshift',
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
                usersApiKey: 'b4a29aba5e75duic8a18acd920ec1e2e',
                dataCenter: 'eu',
              },
            },
            message: {
              channel: 'web',
              context: {
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
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
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
                timezone: 'Asia/Mumbai',
                traits: {
                  anonymousId: '7e32188a4dab669f',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              type: 'group',
              messageId: 'e5034jh0-a404-47b4-a463-76df99934kl2',
              userId: 'sampleusrRudder1',
              groupId: 'group22222',
              traits: {
                name: 'hardik',
                email: 'hardik@rudderstack.com',
                cookie: '1234abcd-efghklkj-1234kfjadslk-34iu123',
                industry: 'Education',
                employees: 399,
                plan: 'enterprise',
                'total billed': 830,
                gender: 'male',
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
            error: '[BLUESHIFT] event API Key required for Authentication.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'BLUESHIFT',
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
