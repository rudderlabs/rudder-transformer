import { authHeader1, secret1 } from '../maskedSecrets';
export const dataV3 = [
  {
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Test case for Page event-> PAGE_VIEW ',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                apiVersion: 'newApi',
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
                      action_source: 'WEB',
                      event_name: 'PAGE_VIEW',
                      event_source_url: 'http://www.rudderstack.com',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Test case for Prodcuts Searched event for conversion type offline',
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
                apiKey: secret1,
                apiVersion: 'newApi',
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
                        num_items: 4,
                        search_string: 't-shirts',
                      },
                      event_name: 'SEARCH',
                      event_time: '1650625078',
                      user_data: {
                        client_user_agent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                        em: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                        fn: '96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a',
                        idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                        ln: '799ef92a11af918e3fb741df42934f3b568ed2d93ac1df74f1b8d41a27932a6f',
                        madid: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                        ph: 'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                        sc_click_id: 'some_click_id',
                        st: '6db488fc98e30afdf67a05a6da916805b02891ce58f03970c6deff79129c5f1c',
                      },
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
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Test case for Track event without event Key',
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
                apiKey: secret1,
                apiVersion: 'newApi',
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
    description:
      '[CAPIv3]: Test case for Identify event which is not supported in this destination',
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
                apiKey: secret1,
                apiVersion: 'newApi',
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
    description: '[CAPIv3]: Pixel id is not set as a destination config field',
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
                apiKey: secret1,
                apiVersion: 'newApi',
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
    description: '[CAPIv3]: Test case for Prodcuts Searched event for conversion type web',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                apiVersion: 'newApi',
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
                      action_source: 'WEB',
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
    description: '[CAPIv3]: Test case where appId is not present in destination config',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                apiVersion: 'newApi',
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
    description: '[CAPIv3]: Test case where snap app id is not present in destination config',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                apiVersion: 'newApi',
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
    description: '[CAPIv3]: Product Searched event where conversion type is mobile app',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
    name: 'snapchat_conversion',
    description:
      '[CAPIv3]: Test Case for Product List Viewed event where conversion type is mobile app',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        app_id: 'dhfeih44f',
                      },
                      custom_data: {
                        content_ids: ['123', '123'],
                        value: '56',
                      },
                      event_name: 'VIEW_CONTENT',
                      event_time: '1650625078',
                      user_data: {
                        client_user_agent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                        country: '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
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
      '[CAPIv3]: Test case for checkout_started event where conversion type is mobile app',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        app_id: 'dhfeih44f',
                      },
                      custom_data: {
                        content_ids: ['123', '123'],
                        value: '42',
                      },
                      event_name: 'START_CHECKOUT',
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
      '[CAPIv3]: Test Case for Order Completed event where conversion type is mobile app',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        app_id: 'dhfeih44f',
                      },
                      custom_data: {
                        brands: ['brand01', 'brand02'],
                        content_ids: ['123', '124'],
                        value: '56',
                      },
                      event_name: 'PURCHASE',
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
    description: '[CAPIv3]: Test Case for Product Added event where conversion type is mobile app',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        app_id: 'dhfeih44f',
                      },
                      custom_data: {
                        content_category: 'shoes',
                        content_ids: '123',
                        currency: 'USD',
                        value: '14',
                      },
                      event_name: 'ADD_CART',
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
    description: '[CAPIv3]: Test case for Product Viewed event where conversion type is web',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                      action_source: 'WEB',
                      custom_data: {
                        content_category: 'shoes',
                        content_ids: '123',
                        currency: 'USD',
                        num_items: 14,
                        value: '14',
                      },
                      event_name: 'VIEW_CONTENT',
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
    description: '[CAPIv3]: Test case for Product Viewed event where conversion type is offline',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        content_category: 'shoes',
                        content_ids: '123',
                        currency: 'USD',
                        num_items: 1,
                        value: '14',
                      },
                      event_name: 'VIEW_CONTENT',
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
      '[CAPIv3]: Test case for Payment Info Entered event where conversion type is offline',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                      event_id: '12dfdfdf3',
                      event_name: 'ADD_BILLING',
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
    description: '[CAPIv3]: Test case for Subscribe event where conversion type is web',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        content_category: 'shoes',
                        currency: 'USD',
                        value: '14',
                      },
                      event_name: 'SUBSCRIBE',
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
    description: '[CAPIv3]: Test case for Promotion Viewed event for conversion type offline',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        content_category: 'shoes',
                        currency: 'USD',
                        price: '14',
                      },
                      event_name: 'AD_VIEW',
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
    description: '[CAPIv3]: Test case for Promotion Clicked event for conversion type offline',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        content_category: 'shoes',
                        currency: 'USD',
                        price: '14',
                      },
                      event_name: 'AD_CLICK',
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
    description: '[CAPIv3]: Test case for save event for conversion type offline',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        content_category: 'shoes',
                        currency: 'USD',
                        value: '14',
                      },
                      event_name: 'SAVE',
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
    description: '[CAPIv3]: Test case for Product Viewed event where conversion type is web',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                      action_source: 'WEB',
                      custom_data: {
                        content_category: 'shoes',
                        currency: 'USD',
                        value: '14',
                      },
                      event_name: 'VIEW_CONTENT',
                      event_source_url: 'hjhb.com',
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
    description: '[CAPIv3]: Test case for Product Viewed event where conversion type is offline',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        content_category: 'shoes',
                        currency: 'USD',
                        value: '14',
                      },
                      event_name: 'VIEW_CONTENT',
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
    description: '[CAPIv3]: Test case for Product Searched event where conversion type is offline',
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
                apiKey: secret1,
                apiVersion: 'newApi',
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
    name: 'snapchat_conversion',
    description:
      '[CAPIv3]: Test Case for Product Added To Whishlist event where conversion type is mobile app',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        app_id: 'dhfeih44f',
                      },
                      custom_data: {
                        content_category: 'shoes',
                        content_ids: '123',
                        currency: 'USD',
                        value: '14',
                      },
                      event_name: 'ADD_TO_WISHLIST',
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
    description: '[CAPIv3]: Test case for Products Searched event using event mapping',
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
                apiKey: secret1,
                rudderEventsToSnapEvents: [
                  {
                    from: 'ProdSearched',
                    to: 'products_searched',
                  },
                ],
                apiVersion: 'newApi',
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
                  ],
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
    description: "[CAPIv3]: Test case event doesn't match with snapchat events",
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
                apiKey: secret1,
                rudderEventsToSnapEvents: [],
                apiVersion: 'newApi',
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
      '[CAPIv3]: test event naming (i.e passed vs the names provided in webapp) by bringing them to a common ground',
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
                apiKey: secret1,
                rudderEventsToSnapEvents: [
                  {
                    from: 'Product_Added_To_Cart',
                    to: 'products_searched',
                  },
                ],
                apiVersion: 'newApi',
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
    name: 'snapchat_conversion',
    description:
      '[CAPIv3]: test event naming (i.e passed vs the names provided in webapp) by bringing them to a common ground - here destination config need to be modified',
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
                apiKey: secret1,
                rudderEventsToSnapEvents: [
                  {
                    from: 'Product Added To Cart',
                    to: 'products_searched',
                  },
                ],
                apiVersion: 'newApi',
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
                  ],
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
    description: '[CAPIv3]: Enable deduplication with duplication key as email',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                deduplicationKey: 'properties.custom_dedup_id',
                enableDeduplication: true,
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        app_id: 'dhfeih44f',
                      },
                      custom_data: {
                        content_ids: ['123', '123'],
                        value: '100',
                      },
                      event_id: '1234',
                      event_name: 'PURCHASE',
                      event_time: '1650625078',
                      user_data: {
                        client_ip_address: '127.0.0.1',
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
    description: '[CAPIv3]: Mapping revenue to price for product list viewed event',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        app_id: 'dhfeih44f',
                      },
                      custom_data: {
                        content_ids: ['123', '123'],
                        value: '100',
                      },
                      event_name: 'VIEW_CONTENT',
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
    description: '[CAPIv3]: Mapping revenue to price for product list viewed event',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        app_id: 'dhfeih44f',
                      },
                      custom_data: {
                        content_ids: ['123', '123'],
                        value: '100',
                      },
                      event_name: 'VIEW_CONTENT',
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
    description: '[CAPIv3]: Test Case for Order Completed event category',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        app_id: 'dhfeih44f',
                      },
                      custom_data: {
                        brands: ['brand01', 'brand02'],
                        content_category: 'shoes',
                        content_ids: ['123', '124'],
                        value: '56',
                      },
                      event_name: 'PURCHASE',
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
      '[CAPIv3]: Test Case for Order Completed event with both category and item_category',
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
                item_category: 'glass',
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
                apiKey: secret1,
                pixelId: 'dummyPixelId',
                appId: 'dhfeih44f',
                snapAppId: 'hfhdhfd',
                apiVersion: 'newApi',
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
                        app_id: 'dhfeih44f',
                      },
                      custom_data: {
                        brands: ['brand01', 'brand02'],
                        content_category: 'glass',
                        content_ids: ['123', '124'],
                        value: '56',
                      },
                      event_name: 'PURCHASE',
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
    description: '[CAPIv3]: test event mapping from destination config',
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
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: false,
                },
              },
              Config: {
                pixelId: 'dummyPixelId',
                apiKey: secret1,
                rudderEventsToSnapEvents: [
                  {
                    from: 'Custom Event',
                    to: 'level_complete',
                  },
                ],
                apiVersion: 'newApi',
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
              endpoint: 'https://tr.snapchat.com/v3/dummyPixelId/events',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                access_token: 'snapchat_conversion1',
              },
              body: {
                FORM: {},
                JSON: {
                  data: [
                    {
                      action_source: 'OFFLINE',
                      event_name: 'LEVEL_COMPLETE',
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
    description: "[CAPIv3]: Test case non string event doesn't match with snapchat events",
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
              event: 1234,
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
                apiKey: secret1,
                rudderEventsToSnapEvents: [],
                apiVersion: 'newApi',
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
            error: "Event 1234 doesn't match with Snapchat Events!",
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
    description: '[CAPIv3]: Test case for Product Searched event for conversion type offline',
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
                clientUserAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              type: 'track',
              event: 'Products Searched',
              properties: {
                brands: 'abc',
                action_source: 'web',
                num_items: 4,
                sc_click_id: 'some_click_id',
                description: 'Products Searched event for conversion type offline',
                event_source_url: 'https://www.example.com&ScCid=123',
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
                apiKey: secret1,
                apiVersion: 'newApi',
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
                      event_name: 'SEARCH',
                      event_time: '1650625078',
                      user_data: {
                        em: '73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2',
                        fn: '96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a',
                        idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                        ln: '799ef92a11af918e3fb741df42934f3b568ed2d93ac1df74f1b8d41a27932a6f',
                        madid: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                        ph: 'bc77d64d7045fe44795ed926df37231a0cfb6ec6b74588c512790e9f143cc492',
                        st: '6db488fc98e30afdf67a05a6da916805b02891ce58f03970c6deff79129c5f1c',
                      },
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
].map((tc) => ({
  ...tc,
  mockFns: (_) => {
    // @ts-ignore
    Date.now = jest.fn(() => new Date('2022-04-23T10:57:58Z'));
  },
}));
