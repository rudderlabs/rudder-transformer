import { generateMetadata, overrideDestination } from '../../../testUtils';
import { RouterTestData } from '../../../testTypes';
import { destination, mockFns } from '../commonConfig';

export const dataV3: RouterTestData[] = [
  {
    id: 'router-1746393448027',
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Router test case to batch the Web/Offline conversion events',
    scenario: 'Business + Framework',
    successCriteria: 'Router test should pass successfully',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
                originalTimestamp: '2022-04-22T10:57:58Z',
                anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
                context: {
                  traits: {
                    email: 'test@email.com',
                    phone: '+91 2111111 ',
                  },
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  device: {
                    advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    manufacturer: 'Google',
                    name: 'generic_x86_arm',
                    type: 'ios',
                    attTrackingStatus: 3,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  locale: 'en-US',
                  os: {
                    name: 'iOS',
                    version: '14.4.1',
                  },
                  screen: {
                    density: 2,
                  },
                  externalId: [
                    {
                      type: 'ga4AppInstanceId',
                      id: 'f0dd99v4f979fb997ce453373900f891',
                    },
                  ],
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                },
                type: 'track',
                event: 'Products Searched',
                properties: {
                  query: 't-shirts',
                  event_conversion_type: 'web',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2022-04-22T10:57:58Z',
              },
              metadata: generateMetadata(1),
              destination: overrideDestination(destination, { apiVersion: 'newApi' }),
            },
            {
              message: {
                messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
                originalTimestamp: '2022-04-22T10:57:58Z',
                anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
                context: {
                  traits: {
                    email: 'test@email.com',
                    phone: '+91 2111111 ',
                  },
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  device: {
                    advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    manufacturer: 'Google',
                    name: 'generic_x86_arm',
                    type: 'ios',
                    attTrackingStatus: 3,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  locale: 'en-US',
                  os: {
                    name: 'iOS',
                    version: '14.4.1',
                  },
                  screen: {
                    density: 2,
                  },
                  externalId: [
                    {
                      type: 'ga4AppInstanceId',
                      id: 'f0dd99v4f979fb997ce453373900f891',
                    },
                  ],
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                },
                type: 'track',
                event: 'Products Searched',
                properties: {
                  query: 't-shirts',
                  event_conversion_type: 'web',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2022-04-22T10:57:58Z',
              },
              metadata: generateMetadata(2),
              destination: overrideDestination(destination, { apiVersion: 'newApi' }),
            },
            {
              message: {
                messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
                originalTimestamp: '2022-04-22T10:57:58Z',
                anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
                context: {
                  traits: {
                    email: 'test@email.com',
                    phone: '+91 2111111 ',
                  },
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  device: {
                    advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    manufacturer: 'Google',
                    name: 'generic_x86_arm',
                    type: 'ios',
                    attTrackingStatus: 3,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  locale: 'en-US',
                  os: {
                    name: 'iOS',
                    version: '14.4.1',
                  },
                  screen: {
                    density: 2,
                  },
                  externalId: [
                    {
                      type: 'ga4AppInstanceId',
                      id: 'f0dd99v4f979fb997ce453373900f891',
                    },
                  ],
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                },
                type: 'track',
                event: 'Products Searched',
                properties: {
                  query: 't-shirts',
                  event_conversion_type: 'web',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2022-04-22T10:57:58Z',
              },
              metadata: generateMetadata(3),
              destination: overrideDestination(destination, { apiVersion: 'newApi' }),
            },
          ],
          destType: 'snapchat_conversion',
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
                endpoint: 'https://tr.snapchat.com/v3/dummyPixelId/events',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {
                  access_token: 'snapchat_conversion1',
                },
                body: {
                  JSON: {
                    data: [
                      {
                        action_source: 'OFFLINE',
                        custom_data: {
                          search_string: 't-shirts',
                        },
                        event_name: 'SEARCH',
                        event_time: '1650625078',
                        user_data: {
                          client_user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                          em: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                          idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                          madid: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                          ph: 'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                        },
                      },
                      {
                        action_source: 'OFFLINE',
                        custom_data: {
                          search_string: 't-shirts',
                        },
                        event_name: 'SEARCH',
                        event_time: '1650625078',
                        user_data: {
                          client_user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                          em: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                          idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                          madid: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                          ph: 'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                        },
                      },
                      {
                        action_source: 'OFFLINE',
                        custom_data: {
                          search_string: 't-shirts',
                        },
                        event_name: 'SEARCH',
                        event_time: '1650625078',
                        user_data: {
                          client_user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                          em: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                          idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                          madid: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                          ph: 'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
              statusCode: 200,
              destination: overrideDestination(destination, { apiVersion: 'newApi' }),
              batched: true,
            },
          ],
        },
      },
    },
    mockFns,
  },
  {
    id: 'router-1746393448027',
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Router test case to batch the Mobile Events conversion events',
    scenario: 'Business + Framework',
    successCriteria: 'Router test should pass successfully',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
                originalTimestamp: '2022-04-22T10:57:58Z',
                channel: 'mobile',
                anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
                context: {
                  traits: {
                    email: 'test@email.com',
                    phone: '+91 2111111 ',
                  },
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  device: {
                    advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    manufacturer: 'Google',
                    model: 'AOSP on IA Emulator',
                    name: 'generic_x86_arm',
                    type: 'ios',
                    attTrackingStatus: 3,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  locale: 'en-US',
                  os: {
                    name: 'iOS',
                    version: '14.4.1',
                  },
                  screen: {
                    density: 2,
                  },
                  externalId: [
                    {
                      type: 'ga4AppInstanceId',
                      id: 'f0dd99v4f979fb997ce453373900f891',
                    },
                  ],
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                },
                type: 'track',
                event: 'Products Searched',
                properties: {
                  delivery_method: 'in_store',
                  query: 't-shirts',
                  event_conversion_type: 'web',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2022-04-22T10:57:58Z',
              },
              metadata: generateMetadata(1),
              destination: overrideDestination(destination, {
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
              }),
            },
            {
              message: {
                messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
                originalTimestamp: '2022-04-22T10:57:58Z',
                channel: 'mobile',
                anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
                context: {
                  traits: {
                    email: 'test@email.com',
                    phone: '+91 2111111 ',
                    country: 'IN',
                    zipcode: 'Sxp-12345',
                    region: 'some_region',
                  },
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  device: {
                    advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    manufacturer: 'Google',
                    name: 'generic_x86_arm',
                    type: 'ios',
                    attTrackingStatus: 3,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  locale: 'en-US',
                  os: {
                    name: 'iOS',
                    version: '14.4.1',
                  },
                  screen: {
                    density: 2,
                  },
                  externalId: [
                    {
                      type: 'ga4AppInstanceId',
                      id: 'f0dd99v4f979fb997ce453373900f891',
                    },
                  ],
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                },
                type: 'track',
                event: 'Product List Viewed',
                properties: {
                  products: [
                    {
                      product_id: '123',
                      price: '14',
                    },
                    {
                      product_id: '123',
                      price: 14,
                      quantity: 3,
                    },
                  ],
                },
                integrations: {
                  All: true,
                },
                sentAt: '2022-04-22T10:57:58Z',
              },
              metadata: generateMetadata(2),
              destination: overrideDestination(destination, {
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
              }),
            },
          ],
          destType: 'snapchat_conversion',
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
                endpoint: 'https://tr.snapchat.com/v3/hfhdhfd/events',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {
                  access_token: 'snapchat_conversion1',
                },
                body: {
                  JSON: {
                    data: [
                      {
                        action_source: 'MOBILE_APP',
                        app_data: {
                          extinfo: [
                            'i2',
                            'com.rudderlabs.javascript',
                            '1.0.0',
                            '1.0.0',
                            '14.4.1',
                            'AOSP on IA Emulator',
                            'en-US',
                            '',
                            '',
                            '',
                            '',
                            '2',
                            '',
                            '',
                            '',
                            '',
                          ],
                          app_id: 'dhfeih44f',
                        },
                        custom_data: {
                          search_string: 't-shirts',
                        },
                        event_name: 'SEARCH',
                        event_time: '1650625078',
                        user_data: {
                          client_user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                          em: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                          idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                          madid: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                          ph: 'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                        },
                      },
                      {
                        action_source: 'MOBILE_APP',
                        app_data: {
                          extinfo: [
                            'i2',
                            'com.rudderlabs.javascript',
                            '1.0.0',
                            '1.0.0',
                            '14.4.1',
                            '',
                            'en-US',
                            '',
                            '',
                            '',
                            '',
                            '2',
                            '',
                            '',
                            '',
                            '',
                          ],
                          app_id: 'dhfeih44f',
                        },
                        custom_data: {
                          content_ids: ['123', '123'],
                          value: '56',
                          contents: [
                            {
                              id: '123',
                              item_price: '14',
                            },
                            {
                              id: '123',
                              quantity: 3,
                              item_price: 14,
                            },
                          ],
                        },
                        event_name: 'VIEW_CONTENT',
                        event_time: '1650625078',
                        user_data: {
                          client_user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                          country:
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          em: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                          idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                          madid: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                          ph: 'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                          zp: 'cbb2704f5b334a0cec32e5463d1fd9355f6ef73987bfe0ebb8389b7617452152',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2)],
              statusCode: 200,
              destination: overrideDestination(destination, {
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
              }),
              batched: true,
            },
          ],
        },
      },
    },
  },
  {
    id: 'router-1746393448027',
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Router test case with failure scenario',
    scenario: 'Business + Framework',
    successCriteria: 'Router test should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Product List Viewed',
                sentAt: '2022-08-01T15:04:58.764Z',
                userId: 'd131b5f1fc@nana.sa',
                channel: 'mobile',
                context: {
                  os: {
                    name: 'iOS',
                    version: '15.5',
                  },
                  app: {
                    name: 'CFBundleDisplayName',
                    build: '12.43.0.16',
                    version: '12.43.0',
                    namespace: 'iShopCloud.com',
                  },
                  device: {
                    id: 'f244e389-d899-40a0-9673-1db87a8db7d3',
                    name: 'iPhone Monerah',
                    type: 'iOS',
                    model: 'iPhone',
                    manufacturer: 'Apple',
                  },
                  locale: 'ar-SA',
                  screen: {
                    width: 896,
                    height: 414,
                    density: 2,
                  },
                  traits: {
                    email: 'm@gmail.com',
                    phone: '00966556747779',
                    userId: 'd131b5f1fc@nana.sa',
                    address: {
                      city: 'الرياض',
                      country: 'sa',
                    },
                    country: 'sa',
                    lastName: '',
                    firstName: 'منيرة ام عمر',
                    anonymousId: 'f244e389-d899-40a0-9673-1db87a8db7d3',
                    'Mobile Number': '00966556747779',
                    'Last App Close': '2022-07-29T21:43:30.342Z',
                    'Activation code': '9997',
                    'Activation date': '2022-03-24 19:37:42',
                    'First App Close': '2022-05-18 07:53:03',
                    'Mobile Number Status': 'Active',
                    'Last Activated Device': {
                      UUID: 'F244E389-D899-40A0-9673-1DB87A8DB7D3',
                      Platform: 'IOS',
                      'App Version': '12.38.0',
                      'App Language': 'AR',
                      'Platform Version': '15.4',
                    },
                    ml_availability_segment: -1,
                  },
                  library: {
                    name: 'rudder-ios-library',
                    version: '1.0.7',
                  },
                  network: {
                    wifi: true,
                    carrier: 'unavailable',
                    cellular: false,
                    bluetooth: false,
                  },
                  timezone: 'Asia/Riyadh',
                  userAgent: 'unknown',
                  externalId: [
                    {
                      id: 'CBEDC847-F22C-447C-85DE-2BB693240F8E',
                      type: 'brazeExternalId',
                    },
                  ],
                },
                rudderId: '8fd7a036-fcbd-4ec3-b498-ea2cbf1df629',
                messageId: '1659366289-4126c107-c1e1-4ee1-b534-fb49afca197b',
                timestamp: '2022-08-01T15:04:49.593Z',
                properties: {
                  Parent: 'Testing',
                  'List ID': 'CAT00002903',
                  store_id: 'STR00001959',
                  'List Name': 'User',
                  session_id: '',
                  'Viewed From': 'home',
                  'Category Position': 2,
                  'Banner Position Segment': 'B',
                  category_personalise_segment: 'B',
                },
                receivedAt: '2022-08-01T15:04:59.091Z',
                request_ip: '78.95.64.84',
                anonymousId: 'f244e389-d899-40a0-9673-1db87a8db7d3',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2022-08-01T15:04:49.266Z',
              },
              metadata: generateMetadata(1),
              destination: overrideDestination(destination, {
                snapAppId: '',
                apiVersion: 'newApi',
              }),
            },
          ],
          destType: 'snapchat_conversion',
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
              metadata: [generateMetadata(1)],
              statusCode: 400,
              destination: overrideDestination(destination, {
                snapAppId: '',
                apiVersion: 'newApi',
              }),
              batched: false,
              error: 'Snap App Id is required for app events',
              statTags: {
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                destType: 'SNAPCHAT_CONVERSION',
              },
            },
          ],
        },
      },
    },
  },
];
