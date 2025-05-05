import { ProcessorTestData } from '../../../testTypes';
import {
  destination,
  metadata,
  mockFns,
  processorConfigurationErrorStatTags,
  processorInstrumentationErrorStatTags,
} from '../commonConfig';
import { overrideDestination } from '../../../testUtils';

export const validationTestDataV3: ProcessorTestData[] = [
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Test case for Track event without event Key',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should fail',
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
            metadata,
            destination: overrideDestination(destination, { apiVersion: 'newApi' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: 'Event name is required',
            statTags: processorInstrumentationErrorStatTags,
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
      '[CAPIv3]: Test case for Identify event which is not supported in this destination',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should fail',
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
            metadata,
            destination: overrideDestination(destination, { apiVersion: 'newApi' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: 'Event type identify is not supported',
            statTags: processorInstrumentationErrorStatTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Pixel id is not set as a destination config field',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should fail',
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
            metadata,
            destination: overrideDestination(destination, {
              apiVersion: 'newApi',
              pixelId: undefined,
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
            metadata,
            statusCode: 400,
            error: 'Pixel Id is required for web and offline events',
            statTags: processorConfigurationErrorStatTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Test case where appId is not present in destination config',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should fail',
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
            destination: overrideDestination(destination, { apiVersion: 'newApi' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: 'Snap App Id is required for app events',
            statTags: processorConfigurationErrorStatTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Test case where snap app id is not present in destination config',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should fail',
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
            destination: overrideDestination(destination, { apiVersion: 'newApi' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: 'Snap App Id is required for app events',
            statTags: processorConfigurationErrorStatTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267903',
    name: 'snapchat_conversion',
    description: "[CAPIv3]: Test case event doesn't match with snapchat events",
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should fail',
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
            destination: overrideDestination(destination, { apiVersion: 'newApi' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: "Event ProdSearched doesn't match with Snapchat Events!",
            statTags: processorInstrumentationErrorStatTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267904',
    name: 'snapchat_conversion',
    description: "[CAPIv3]: Test case non string event doesn't match with snapchat events",
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should fail',
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
              event: '1234',
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
            destination: overrideDestination(destination, { apiVersion: 'newApi' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: "Event 1234 doesn't match with Snapchat Events!",
            statTags: processorInstrumentationErrorStatTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267904',
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Test case with unavailable required field',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should fail',
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
            metadata,
            destination: overrideDestination(destination, { apiVersion: 'newApi' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error:
              'At least one of email or phone or advertisingId or ip and clientUserAgent is required',
            statTags: processorInstrumentationErrorStatTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267904',
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Test case without any event type',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should fail',
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
              },
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
            metadata,
            destination: overrideDestination(destination, { apiVersion: 'newApi' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: 'Event type is required',
            statTags: processorInstrumentationErrorStatTags,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'processor-1746381267904',
    name: 'snapchat_conversion',
    description: '[CAPIv3]: Test case when event time is more than 7 days',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should fail',
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
              originalTimestamp: '2022-03-22T10:57:58Z',
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              context: {
                traits: {
                  email: 'test@gmail.com',
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
              },
              event: 'Products Searched',
              type: 'track',
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
              sentAt: '2022-03-22T10:57:58Z',
            },
            metadata,
            destination: overrideDestination(destination, { apiVersion: 'newApi' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error: 'Events must be sent within 7 days of their occurrence',
            statTags: processorInstrumentationErrorStatTags,
          },
        ],
      },
    },
    mockFns,
  },
];
