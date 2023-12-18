import { FEATURES, IMPLEMENTATIONS, MODULES } from '../../../../../src/v0/util/tags';

export const data = [
  {
    name: 'snapchat_conversion',
    description: 'Test 0',
    feature: FEATURES.ROUTER,
    module: MODULES.DESTINATION,
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
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  apiKey: 'dummyApiKey',
                },
              },
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
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  apiKey: 'dummyApiKey',
                },
              },
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
              metadata: {
                jobId: 3,
              },
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  apiKey: 'dummyApiKey',
                },
              },
            },
          ],
          destType: 'snapchat_conversion',
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
                endpoint: 'https://tr.snapchat.com/v2/conversion',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummyApiKey',
                },
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch:
                      '[{"search_string":"t-shirts","event_type":"SEARCH","user_agent":"mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36","hashed_email":"73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2","hashed_phone_number":"bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492","hashed_idfv":"54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f","hashed_mobile_ad_id":"f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2","timestamp":"1650625078","event_conversion_type":"OFFLINE","pixel_id":"dummyPixelId"},{"search_string":"t-shirts","event_type":"SEARCH","user_agent":"mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36","hashed_email":"73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2","hashed_phone_number":"bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492","hashed_idfv":"54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f","hashed_mobile_ad_id":"f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2","timestamp":"1650625078","event_conversion_type":"OFFLINE","pixel_id":"dummyPixelId"},{"search_string":"t-shirts","event_type":"SEARCH","user_agent":"mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36","hashed_email":"73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2","hashed_phone_number":"bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492","hashed_idfv":"54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f","hashed_mobile_ad_id":"f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2","timestamp":"1650625078","event_conversion_type":"OFFLINE","pixel_id":"dummyPixelId"}]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                },
                {
                  jobId: 2,
                },
                {
                  jobId: 3,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  apiKey: 'dummyApiKey',
                },
              },
            },
          ],
        },
      },
    },
    mockFns: (_) => {
      // @ts-ignore
      Date.now = jest.fn(() => new Date('2022-04-22T10:57:58Z'));
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test 1',
    feature: FEATURES.ROUTER,
    module: MODULES.DESTINATION,
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
              metadata: {
                jobId: 4,
              },
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  apiKey: 'dummyApiKey',
                  appId: 'jahsdfjk-5487-asdfa-9957-7c74eb8d3e80',
                  snapAppId: '',
                  enableDeduplication: false,
                  rudderEventsToSnapEvents: [
                    {
                      from: 'Product List Viewed',
                      to: 'product_list_viewed',
                    },
                  ],
                },
              },
            },
          ],
          destType: 'snapchat_conversion',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [
                {
                  jobId: 4,
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'Snap App Id is required for app events',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                feature: FEATURES.ROUTER,
                implementation: IMPLEMENTATIONS.NATIVE,
                module: MODULES.DESTINATION,
                destType: 'SNAPCHAT_CONVERSION',
              },
              destination: {
                Config: {
                  pixelId: 'dummyPixelId',
                  apiKey: 'dummyApiKey',
                  appId: 'jahsdfjk-5487-asdfa-9957-7c74eb8d3e80',
                  snapAppId: '',
                  enableDeduplication: false,
                  rudderEventsToSnapEvents: [
                    {
                      from: 'Product List Viewed',
                      to: 'product_list_viewed',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
];
