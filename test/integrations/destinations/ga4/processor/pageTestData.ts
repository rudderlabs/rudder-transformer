import { defaultMockFns } from '../mocks';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  transformResultBuilder,
  generatePageOrScreenPayload,
} from '../../../testUtils';

const destination: Destination = {
  ID: '123',
  Name: 'GA4',
  DestinationDefinition: {
    ID: '123',
    Name: 'GA4',
    DisplayName: 'Google Analytics 4 (GA4)',
    Config: {},
  },
  Config: {
    apiSecret: 'dummyApiSecret',
    measurementId: 'dummyMeasurementId',
    firebaseAppId: '',
    blockPageViewEvent: false,
    typesOfClient: 'gtag',
    extendPageViewParams: false,
    sendUserId: false,
    eventFilteringOption: 'disable',
    blacklistedEvents: [
      {
        eventName: '',
      },
    ],
    whitelistedEvents: [
      {
        eventName: '',
      },
    ],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const deviceInfo = {
  adTrackingEnabled: 'false',
  advertisingId: 'dummyAdvertisingId',
  id: 'device@1',
  manufacturer: 'Google',
  model: 'AOSP on IA Emulator',
  name: 'generic_x86_arm',
  type: 'ios',
  attTrackingStatus: 3,
};

const commonOutputHeaders = {
  HOST: 'www.google-analytics.com',
  'Content-Type': 'application/json',
};

const commonOutputParams = {
  api_secret: 'dummyApiSecret',
  measurement_id: 'dummyMeasurementId',
};

const anonymousId = 'dummyAnonId';
const externalId = [
  {
    type: 'ga4AppInstanceId',
    id: 'dummyAppInstanceId',
  },
];
const page = {
  url: 'http://morkey.in',
  path: '/cart',
  title: 'miphone',
  search: 'MI',
  referrer: 'morkey',
};
const sentAt = '2022-04-20T15:20:57Z';
const originalTimestamp = '2022-04-26T05:17:09Z';

const userId = 'default-userId';
const non_personalized_ads = true;
const defaultEngagementTimeMsec = 1;
const timestamp_micros = 1650950229000000;

const expectedOutputParams = {
  page_title: 'miphone',
  page_referrer: 'morkey',
  page_location: 'http://morkey.in',
};

const eventEndPoint = 'https://www.google-analytics.com/mp/collect';

export const pageTestData: ProcessorTestData[] = [
  {
    id: 'ga4-page-test-1',
    name: 'ga4',
    description: 'Scenario to test page call',
    scenario: 'Business',
    successCriteria: 'Response status code should be 200 and event name should be page_view',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generatePageOrScreenPayload(
              {
                anonymousId,
                sentAt,
                context: {
                  device: deviceInfo,
                  externalId,
                },
                originalTimestamp,
              },
              'page',
            ),
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'page_view',
                    params: {
                      engagement_time_msec: defaultEngagementTimeMsec,
                    },
                  },
                ],
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-page-test-2',
    name: 'ga4',
    description: 'Scenario to test page call with custom properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and event payload should contain all custom properties event name should be page_view',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generatePageOrScreenPayload(
              {
                anonymousId,
                sentAt,
                context: {
                  device: deviceInfo,
                  externalId,
                },
                properties: {
                  view: 'login',
                },
                originalTimestamp,
              },
              'page',
            ),
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'page_view',
                    params: {
                      view: 'login',
                      engagement_time_msec: defaultEngagementTimeMsec,
                    },
                  },
                ],
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-page-test-3',
    name: 'ga4',
    description:
      'Scenario to test take page properties from context.page for page call along with custom properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and event payload should contain all custom properties event name should be page_view',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generatePageOrScreenPayload(
              {
                anonymousId,
                sentAt,
                context: {
                  device: deviceInfo,
                  externalId,
                  page,
                },
                properties: {
                  id: 'dummyId',
                },
                originalTimestamp,
              },
              'page',
            ),
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: eventEndPoint,
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'page_view',
                    params: {
                      id: 'dummyId',
                      ...expectedOutputParams,
                      engagement_time_msec: defaultEngagementTimeMsec,
                    },
                  },
                ],
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-page-test-4',
    name: 'ga4',
    description:
      'Scenario to test setting of reserved properties like constructor, __proto__, prototype in page call',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and event payload should not fail due to reserved properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiSecret: 'api_secr',
                debugMode: false,
                typesOfClient: 'gtag',
                measurementId: 'meas_id',
                firebaseAppId: '',
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                blacklistedEvents: [
                  {
                    eventName: '',
                  },
                ],
                eventFilteringOption: 'disable',
                piiPropertiesToIgnore: [
                  {
                    piiProperty: '',
                  },
                ],
                sdkBaseUrl: 'https://www.googletagmanager.com',
                serverContainerUrl: '',
                debugView: true,
                useNativeSDK: false,
                connectionMode: 'cloud',
                capturePageView: 'rs',
                useNativeSDKToSend: false,
                extendPageViewParams: false,
                overrideClientAndSessionId: false,
                eventDelivery: false,
              },
              ID: '2ncdvkljndsvkuiurf',
              WorkspaceID: 'wspId',
              DestinationDefinition: {
                ...destination.DestinationDefinition,
              },
              Transformations: [],
              IsConnectionEnabled: true,
              IsProcessorEnabled: true,
              Name: 'my ga4',
              Enabled: true,
            },
            message: {
              name: '',
              type: 'page',
              sentAt: '2022-04-29T05:17:09Z',
              userId: '',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '3.7.6',
                  namespace: 'com.rudderlabs.javascript',
                  installType: 'npm',
                },
                page: {
                  url: 'https://somewebsite.com/?constructor.prototype.tenable_propexxx=tenable_something',
                  path: '/',
                  title: 'Mercedes-Benz Tire Center',
                  search: '?constructor.prototype.tenable_propexxx=tenable_something',
                  tab_url:
                    'https://somewebsite.com/?constructor.prototype.tenable_propexxx=tenable_something',
                  referrer: '$direct',
                  initial_referrer: '$direct',
                  referring_domain: '',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 800,
                  height: 600,
                  density: 1,
                  innerWidth: 1600,
                  innerHeight: 1200,
                },
                traits: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '3.7.6',
                },
                campaign: {},
                timezone: 'GMT+0000',
                sessionId: 123465,
                userAgent:
                  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.207 Safari/537.36',
              },
              rudderId: '7d02bb53-ff1a-46a2-9cb1-1ea78dcd4ca8',
              timestamp: '2022-04-29T05:17:09Z',
              properties: {
                url: 'https://somewebsite.com/?constructor.prototype.tenable_propexxx=tenable_something',
                path: '/',
                title: 'Mercedes-Benz Tire Center',
                search: '?constructor.prototype.tenable_propexxx=tenable_something',
                tab_url:
                  'https://somewebsite.com/?constructor.prototype.tenable_propexxx=tenable_something',
                vehicle: {
                  make: '',
                  trim: '',
                  year: '',
                  model: '',
                  ratio: '',
                  width: '',
                  option: '',
                  diameter: '',
                },
                national: true,
                referrer: '$direct',
                search_type: 'Vehicle',
                initial_referrer: '$direct',
                oem_program_code: 'CODE',
                referring_domain: '',
                initial_referring_domain: '',
                'constructor.prototype.tenable_propexxx': 'tenable_something',
              },
              receivedAt: '2022-04-29T05:17:09Z',
              request_ip: '34.201.223.160',
              anonymousId: 'f577a7e1-6c76-49c3-8312-12846471e025',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-04-29T05:17:09Z',
            },
            metadata: generateMetadata(1),
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
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      name: 'page_view',
                      params: {
                        url: 'https://somewebsite.com/?constructor.prototype.tenable_propexxx=tenable_something',
                        path: '/',
                        title: 'Mercedes-Benz Tire Center',
                        search: '?constructor.prototype.tenable_propexxx=tenable_something',
                        tab_url:
                          'https://somewebsite.com/?constructor.prototype.tenable_propexxx=tenable_something',
                        national: true,
                        referrer: '$direct',
                        page_title: 'Mercedes-Benz Tire Center',
                        session_id: 123465,
                        search_type: 'Vehicle',
                        page_location:
                          'https://somewebsite.com/?constructor.prototype.tenable_propexxx=tenable_something',
                        page_referrer: '$direct',
                        initial_referrer: '$direct',
                        oem_program_code: 'CODE',
                        engagement_time_msec: 1,
                        'constructor.prototype.tenable_propexxx': 'tenable_something',
                      },
                    },
                  ],
                  client_id: 'f577a7e1-6c76-49c3-8312-12846471e025',
                  timestamp_micros: 1651209429000000,
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {
                api_secret: 'api_secr',
                measurement_id: 'meas_id',
              },
              userId: '',
              headers: {
                HOST: 'www.google-analytics.com',
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://www.google-analytics.com/mp/collect',
            },
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
];
