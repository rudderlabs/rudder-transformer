import { ProcessorTestData } from '../../../testTypes';
import { destination, metadata, mockFns } from '../commonConfig';
import { overrideDestination } from '../../../testUtils';
import { authHeader1 } from '../maskedSecrets';

export const dataV2: ProcessorTestData[] = [
  {
    id: 'processor-1746381267902',
    name: 'snapchat_conversion',
    description: 'Test case for Page event-> PAGE_VIEW ',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              channel: 'web',
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
              type: 'page',
              name: 'Home Page Viewed',
              properties: {
                title: 'Home | RudderStack',
                url: 'http://www.rudderstack.com',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              userId: '',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'PAGE_VIEW',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'WEB',
                  page_url: 'http://www.rudderstack.com',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267902',
    name: 'snapchat_conversion',
    description: 'Test case for Prodcuts Searched event for conversion type offline',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              context: {
                traits: {
                  email: 'test@email.com',
                  phone: '+91 2111111 ',
                  firstName: 'john',
                  middleName: 'victor',
                  lastName: 'doe',
                  city: 'some_city',
                  state: 'some_state',
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
                brands: 'abc',
                query: 't-shirts',
                event_conversion_type: 'web',
                number_items: 4,
                click_id: 'some_click_id',
                description: 'Products Searched event for conversion type offline',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  search_string: 't-shirts',
                  event_type: 'SEARCH',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                  number_items: 4,
                  click_id: 'some_click_id',
                  description: 'Products Searched event for conversion type offline',
                  hashed_first_name_sha:
                    '96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a',
                  hashed_last_name_sha:
                    '799ef92a11af918e3fb741df42934f3b568ed2d93ac1df74f1b8d41a27932a6f',
                  hashed_state_sha:
                    '6db488fc98e30afdf67a05a6da916805b02891ce58f03970c6deff79129c5f1c',
                  hashed_middle_name_sha:
                    '99bde068af2d49ed7fc8b8fa79abe13a6059e0db320bb73459fd96624bb4b33f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267902',
    name: 'snapchat_conversion',
    description: 'Test case for Prodcuts Searched event for conversion type web',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              channel: 'web',
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
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  search_string: 't-shirts',
                  event_type: 'SEARCH',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'WEB',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267902',
    name: 'snapchat_conversion',
    description: 'Product Searched event where conversion type is mobile app',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  delivery_method: 'in_store',
                  device_model: 'AOSP on IA Emulator',
                  search_string: 't-shirts',
                  event_type: 'SEARCH',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test Case for Product List Viewed event where conversion type is mobile app',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'VIEW_CONTENT',
                  item_ids: ['123', '123'],
                  price: '56',
                  country: 'IN',
                  hashed_zip: 'cbb2704f5b334a0cec32e5463d1fd9355f6ef73987bfe0ebb8389b7617452152',
                  region: 'some_region',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for checkout_started event where conversion type is mobile app',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
              event: 'checkout_started',
              properties: {
                products: [
                  {
                    product_id: '123',
                    price: '14',
                  },
                  {
                    product_id: '123',
                    price: 14,
                    quantity: '2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'START_CHECKOUT',
                  item_ids: ['123', '123'],
                  price: '42',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test Case for Order Completed event where conversion type is mobile app',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
              event: 'Order Completed',
              properties: {
                brands: ['brand01', 'brand02'],
                products: [
                  {
                    product_id: '123',
                    price: '14',
                    quantity: 1,
                  },
                  {
                    product_id: '124',
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
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'PURCHASE',
                  item_ids: ['123', '124'],
                  brands: ['brand01', 'brand02'],
                  price: '56',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test Case for Product Added event where conversion type is mobile app',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
              event: 'Product Added',
              properties: {
                product_id: '123',
                price: '14',
                category: 'shoes',
                currency: 'USD',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  item_ids: '123',
                  item_category: 'shoes',
                  price: '14',
                  currency: 'USD',
                  event_type: 'ADD_CART',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for Product Viewed event where conversion type is web',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              channel: 'web',
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
              event: 'Product Viewed',
              properties: {
                product_id: '123',
                price: '14',
                category: 'shoes',
                currency: 'USD',
                number_items: 14,
                quantity: 1,
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  item_ids: '123',
                  item_category: 'shoes',
                  price: '14',
                  currency: 'USD',
                  event_type: 'VIEW_CONTENT',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'WEB',
                  pixel_id: 'dummyPixelId',
                  number_items: 14,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for Product Viewed event where conversion type is offline',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              channel: '',
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
              event: 'Product Viewed',
              properties: {
                product_id: '123',
                price: '14',
                category: 'shoes',
                currency: 'USD',
                quantity: 1,
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  item_ids: '123',
                  item_category: 'shoes',
                  price: '14',
                  currency: 'USD',
                  event_type: 'VIEW_CONTENT',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                  number_items: 1,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for Payment Info Entered event where conversion type is offline',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              channel: '',
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
              event: 'Payment Info Entered',
              properties: {
                checkout_id: '12dfdfdf3',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  transaction_id: '12dfdfdf3',
                  event_type: 'ADD_BILLING',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for Subscribe event where conversion type is web',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              channel: '',
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
              event: 'subscribe',
              properties: {
                checkout_id: '123',
                price: '14',
                category: 'shoes',
                currency: 'USD',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  item_category: 'shoes',
                  price: '14',
                  currency: 'USD',
                  event_type: 'SUBSCRIBE',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for Promotion Viewed event for conversion type offline',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              channel: '',
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
              event: 'Promotion Viewed',
              properties: {
                checkout_id: '123',
                price: '14',
                category: 'shoes',
                currency: 'USD',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  item_category: 'shoes',
                  price: '14',
                  currency: 'USD',
                  event_type: 'AD_VIEW',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for Promotion Clicked event for conversion type offline',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              channel: '',
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
              event: 'Promotion clicked',
              properties: {
                checkout_id: '123',
                price: '14',
                category: 'shoes',
                currency: 'USD',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  item_category: 'shoes',
                  price: '14',
                  currency: 'USD',
                  event_type: 'AD_CLICK',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for save event for conversion type offline',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              channel: '',
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
              event: 'save',
              properties: {
                checkout_id: '123',
                price: '14',
                category: 'shoes',
                currency: 'USD',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  item_category: 'shoes',
                  price: '14',
                  currency: 'USD',
                  event_type: 'SAVE',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for Product Viewed event where conversion type is web',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
              event: 'Product Viewed',
              properties: {
                eventConversionType: 'web',
                checkout_id: '123',
                price: '14',
                category: 'shoes',
                currency: 'USD',
                url: 'hjhb.com',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  item_category: 'shoes',
                  page_url: 'hjhb.com',
                  price: '14',
                  currency: 'USD',
                  event_type: 'VIEW_CONTENT',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'WEB',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for Product Viewed event where conversion type is offline',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
              event: 'Product Viewed',
              properties: {
                eventConversionType: 'offline',
                checkout_id: '123',
                price: '14',
                category: 'shoes',
                currency: 'USD',
                url: 'hjhb.com',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  item_category: 'shoes',
                  price: '14',
                  currency: 'USD',
                  event_type: 'VIEW_CONTENT',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for Product Searched event where conversion type is offline',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
                event_tag: 'offline',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  search_string: 't-shirts',
                  event_type: 'SEARCH',
                  event_tag: 'offline',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description:
      'Test Case for Product Added To Whishlist event where conversion type is mobile app',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
              event: 'Product Added to Wishlist',
              properties: {
                product_id: '123',
                price: '14',
                category: 'shoes',
                currency: 'USD',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  item_category: 'shoes',
                  item_ids: '123',
                  price: '14',
                  currency: 'USD',
                  event_type: 'ADD_TO_WISHLIST',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for Products Searched event using event mapping',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
              event: 'ProdSearched',
              properties: {
                query: 't-shirts',
                event_conversion_type: 'web',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              rudderEventsToSnapEvents: [
                {
                  from: 'ProdSearched',
                  to: 'products_searched',
                },
              ],
            }),
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
              userId: '',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  search_string: 't-shirts',
                  event_type: 'SEARCH',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description:
      'test event naming (i.e passed vs the names provided in webapp) by bringing them to a common ground',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              type: 'track',
              event: 'Product Added to Cart',
              properties: {
                query: 't-shirts',
                event_conversion_type: 'web',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              rudderEventsToSnapEvents: [
                {
                  from: 'Product_Added_To_Cart',
                  to: 'products_searched',
                },
              ],
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  search_string: 't-shirts',
                  event_type: 'SEARCH',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description:
      'test event naming (i.e passed vs the names provided in webapp) by bringing them to a common ground - here destination config need to be modified',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              type: 'track',
              event: 'Product_Added_to_Cart',
              properties: {
                query: 't-shirts',
                event_conversion_type: 'web',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              rudderEventsToSnapEvents: [
                {
                  from: 'Product_Added_To_Cart',
                  to: 'products_searched',
                },
              ],
            }),
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
              userId: '',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  search_string: 't-shirts',
                  event_type: 'SEARCH',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Enable deduplication with duplication key as email',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-04-22T10:57:58Z',
              channel: 'mobile',
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              request_ip: '127.0.0.1',
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
              event: 'Order Completed',
              properties: {
                products: [
                  {
                    product_id: '123',
                    price: '14',
                    quantity: 1,
                  },
                  {
                    product_id: '123',
                    price: 14,
                    quantity: 3,
                  },
                ],
                revenue: '100',
                custom_dedup_id: '1234',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
              enableDeduplication: true,
              deduplicationKey: 'properties.custom_dedup_id',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'PURCHASE',
                  item_ids: ['123', '123'],
                  client_dedup_id: '1234',
                  hashed_ip_address:
                    '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0',
                  price: '100',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Mapping revenue to price for product list viewed event',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
                revenue: '100',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'VIEW_CONTENT',
                  item_ids: ['123', '123'],
                  price: '100',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Mapping revenue to price for product list viewed event',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
                revenue: '100',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'VIEW_CONTENT',
                  item_ids: ['123', '123'],
                  price: '100',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test Case for Order Completed event category',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
              event: 'Order Completed',
              properties: {
                brands: ['brand01', 'brand02'],
                products: [
                  {
                    product_id: '123',
                    price: '14',
                    quantity: 1,
                  },
                  {
                    product_id: '124',
                    price: 14,
                    quantity: 3,
                  },
                ],
                category: 'shoes',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'PURCHASE',
                  item_ids: ['123', '124'],
                  brands: ['brand01', 'brand02'],
                  item_category: 'shoes',
                  price: '56',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test Case for Order Completed event with both category and item_category',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
              event: 'Order Completed',
              properties: {
                brands: ['brand01', 'brand02'],
                products: [
                  {
                    product_id: '123',
                    price: '14',
                    quantity: 1,
                  },
                  {
                    product_id: '124',
                    price: 14,
                    quantity: 3,
                  },
                ],
                category: 'shoes',
                item_category: 'glass',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              appId: 'dhfeih44f',
              snapAppId: 'hfhdhfd',
            }),
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
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'PURCHASE',
                  item_ids: ['123', '124'],
                  brands: ['brand01', 'brand02'],
                  item_category: 'glass',
                  price: '56',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'MOBILE_APP',
                  snap_app_id: 'hfhdhfd',
                  app_id: 'dhfeih44f',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'test event mapping from destination config',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              type: 'track',
              event: 'Custom Event',
              properties: {
                query: 't-shirts',
                event_conversion_type: 'web',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, {
              rudderEventsToSnapEvents: [
                {
                  from: 'Custom Event',
                  to: 'level_complete',
                },
              ],
            }),
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
              userId: '',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'LEVEL_COMPLETE',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: 'Test case for sign_up event',
    scenario: 'Business',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              type: 'track',
              event: 'sign_up',
              properties: {
                query: 't-shirts',
                event_conversion_type: 'web',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            metadata,
            destination,
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
              userId: '',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'SIGN_UP',
                  hashed_email: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                  hashed_phone_number:
                    'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                  hashed_mobile_ad_id:
                    'f9779d734aaee50f16ee0011260bae7048f1d9a128c62b6a661077875701edd2',
                  hashed_idfv: '54bd0b26a3d39dad90f5149db49b9fd9ba885f8e35d1d94cae69273f5e657b9f',
                  user_agent:
                    'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.88 safari/537.36',
                  timestamp: '1650625078',
                  event_conversion_type: 'OFFLINE',
                  pixel_id: 'dummyPixelId',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
];
