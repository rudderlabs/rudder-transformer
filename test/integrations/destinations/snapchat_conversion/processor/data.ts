export const data = [
  {
    name: 'snapchat_conversion',
    description: 'Test case for Page event-> PAGE_VIEW ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
              },
            },
            metadata: {
              jobId: 20,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 20,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              userId: '',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Prodcuts Searched event for conversion type offline',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                pixelId: 'dummyPixelId',
                apiKey: 'dummyApiKey',
              },
            },
            metadata: {
              jobId: 21,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 21,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Track event without event Key',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
                  country: 'IN',
                  zicode: 'Sxp-12345',
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
              properties: {
                query: 't-shirts',
                event_conversion_type: 'web',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                pixelId: 'dummyPixelId',
                apiKey: 'dummyApiKey',
              },
            },
            metadata: {
              jobId: 22,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            error: 'Event name is required',
            metadata: {
              jobId: 22,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            statTags: {
              destType: 'SNAPCHAT_CONVERSION',
              destinationId: 'd2',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'w2',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Identify event which is not supported in this destination',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
              type: 'identify',
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                pixelId: 'dummyPixelId',
                apiKey: 'dummyApiKey',
              },
            },
            metadata: {
              jobId: 23,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 23,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            error: 'Event type identify is not supported',
            statTags: {
              destType: 'SNAPCHAT_CONVERSION',
              destinationId: 'd2',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'w2',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Pixel id is not set as a destination config field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
                query: 't-shirts',
                event_conversion_type: 'web',
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
              },
            },
            metadata: {
              jobId: 24,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 24,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            error: 'Pixel Id is required for web and offline events',
            statTags: {
              destType: 'SNAPCHAT_CONVERSION',
              destinationId: 'd2',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'w2',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Prodcuts Searched event for conversion type web',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
              },
            },
            metadata: {
              jobId: 25,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 25,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case where appId is not present in destination config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
              },
            },
            metadata: {
              jobId: 26,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 26,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            error: 'Snap App Id is required for app events',
            statTags: {
              destType: 'SNAPCHAT_CONVERSION',
              destinationId: 'd2',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'w2',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case where snap app id is not present in destination config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
              },
            },
            metadata: {
              jobId: 27,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 27,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            error: 'Snap App Id is required for app events',
            statTags: {
              destType: 'SNAPCHAT_CONVERSION',
              destinationId: 'd2',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'w2',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Product Searched event where conversion type is mobile app',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 28,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 28,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test Case for Product List Viewed event where conversion type is mobile app',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 29,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 29,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for checkout_started event where conversion type is mobile app',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 30,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 30,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test Case for Order Completed event where conversion type is mobile app',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 31,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 31,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test Case for Product Added event where conversion type is mobile app',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 32,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 32,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Product Viewed event where conversion type is web',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 33,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 33,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Product Viewed event where conversion type is offline',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 34,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 34,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Payment Info Entered event where conversion type is offline',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 35,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 35,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Subscribe event where conversion type is web',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 36,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 36,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Promotion Viewed event for conversion type offline',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 37,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 37,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Promotion Clicked event for conversion type offline',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 38,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 38,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for save event for conversion type offline',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 39,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 39,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Product Viewed event where conversion type is web',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 40,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 40,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Product Viewed event where conversion type is offline',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 41,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 41,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Product Searched event where conversion type is offline',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                pixelId: 'dummyPixelId',
                apiKey: 'dummyApiKey',
              },
            },
            metadata: {
              jobId: 42,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 42,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description:
      'Test Case for Product Added To Whishlist event where conversion type is mobile app',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 43,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 43,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test case for Products Searched event using event mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                pixelId: 'dummyPixelId',
                apiKey: 'dummyApiKey',
                rudderEventsToSnapEvents: [
                  {
                    from: 'ProdSearched',
                    to: 'products_searched',
                  },
                ],
              },
            },
            metadata: {
              jobId: 44,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 44,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              userId: '',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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

            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: "Test case event doesn't match with snapchat events",
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                pixelId: 'dummyPixelId',
                apiKey: 'dummyApiKey',
                rudderEventsToSnapEvents: [],
              },
            },
            metadata: {
              jobId: 45,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 45,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            error: "Event ProdSearched doesn't match with Snapchat Events!",
            statTags: {
              destType: 'SNAPCHAT_CONVERSION',
              destinationId: 'd2',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'w2',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description:
      'test event naming (i.e passed vs the names provided in webapp) by bringing them to a common ground',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                pixelId: 'dummyPixelId',
                apiKey: 'dummyApiKey',
                rudderEventsToSnapEvents: [
                  {
                    from: 'Product_Added_To_Cart',
                    to: 'products_searched',
                  },
                ],
              },
            },
            metadata: {
              jobId: 46,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 46,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description:
      'test event naming (i.e passed vs the names provided in webapp) by bringing them to a common ground - here destination config need to be modified',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                pixelId: 'dummyPixelId',
                apiKey: 'dummyApiKey',
                rudderEventsToSnapEvents: [
                  {
                    from: 'Product Added To Cart',
                    to: 'products_searched',
                  },
                ],
              },
            },
            metadata: {
              jobId: 47,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 47,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Enable deduplication with duplication key as email',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                deduplicationKey: 'properties.custom_dedup_id',
                enableDeduplication: true,
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 48,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 48,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Mapping revenue to price for product list viewed event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 49,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 49,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Mapping revenue to price for product list viewed event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 50,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 50,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test Case for Order Completed event category',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
                category: 'shoes'
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 31,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 31,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'PURCHASE',
                  item_ids: ['123', '124'],
                  brands: ['brand01', 'brand02'],
                  item_category: "shoes",
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: 'Test Case for Order Completed event with both category and item_category',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
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
                item_category: 'glass'
              },
              integrations: {
                All: true,
              },
              sentAt: '2022-04-22T10:57:58Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                apiKey: 'dummyApiKey',
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
              },
            },
            metadata: {
              jobId: 31,
              destinationId: 'd2',
              workspaceId: 'w2',
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
            metadata: {
              jobId: 31,
              destinationId: 'd2',
              workspaceId: 'w2',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://tr.snapchat.com/v2/conversion',
              headers: {
                Authorization: 'Bearer dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event_type: 'PURCHASE',
                  item_ids: ['123', '124'],
                  brands: ['brand01', 'brand02'],
                  item_category: "glass",
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
            statusCode: 200,
          },
        ],
      },
    },
  }
].map((tc) => ({
  ...tc,
  mockFns: (_) => {
    // @ts-ignore
    Date.now = jest.fn(() => new Date('2022-04-23T10:57:58Z'));
  },
}));
