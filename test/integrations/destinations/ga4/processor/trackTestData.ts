import { defaultMockFns } from '../mocks';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  transformResultBuilder,
  generateSimplifiedTrackPayload,
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
const externalIdWithClientId = [
  {
    type: 'ga4AppInstanceId',
    id: 'dummyAppInstanceId',
  },
  {
    type: 'ga4ClientId',
    id: 'dummyClientId',
  },
];
const page = {
  initial_referrer: '$direct',
  path: '/',
  referrer: '$direct',
  tab_url: 'https://www.rudderstack.com/',
  title: 'Document',
  url: 'https://www.rudderstack.com/',
};
const campaign = {
  id: 'google_1234',
  name: 'Summer_fun',
  source: 'google',
  medium: 'cpc',
  term: 'summer+travel',
  content: 'logo link',
};
const sentAt = '2022-04-20T15:20:57Z';
const originalTimestamp = '2022-04-26T05:17:09Z';

const clientId = 'dummyClientId';
const userId = 'default-user-id';
const groupId = 'dummyGroupId';
const defaultCurrency = 'USD';
const value = 7.77;
const total = 10;
const sessionId = 655;
const engagementTimeMsec = 100;
const non_personalized_ads = true;
const defaultEngagementTimeMsec = 1;
const timestamp_micros = 1650950229000000;
const timezone = {
  name: 'Europe/Tallinn',
};

const expectedCampaignOutputParams = {
  campaign_id: 'google_1234',
  campaign: 'Summer_fun',
  source: 'google',
  medium: 'cpc',
  term: 'summer+travel',
  content: 'logo link',
};

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'ga4-track-test-1',
    name: 'ga4',
    description: 'Track event call for earn virtual currency event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all earn virtual currency event properties and event name should be earn_virtual_currency',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'earn virtual currency',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                value,
                virtual_currency_name: 'Gems',
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'earn_virtual_currency',
                    params: {
                      value,
                      virtual_currency_name: 'Gems',
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
    id: 'ga4-track-test-2',
    name: 'ga4',
    description: 'Track event call for earn virtual currency without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no earn virtual currency event properties and event name should be earn_virtual_currency',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'earn virtual currency',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'earn_virtual_currency',
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
    id: 'ga4-track-test-3',
    name: 'ga4',
    description: 'Track event call for generate_lead event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all generate_lead event properties and event name should be generate_lead',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'generate_lead',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                value,
                currency: defaultCurrency,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'generate_lead',
                    params: {
                      value,
                      currency: defaultCurrency,
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
    id: 'ga4-track-test-4',
    name: 'ga4',
    description: 'Track event call for level_up event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all level_up event properties and event name should be level_up',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'level_up',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                level: 5,
                character: 'Player 1',
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'level_up',
                    params: {
                      level: 5,
                      character: 'Player 1',
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
    id: 'ga4-track-test-5',
    name: 'ga4',
    description: 'Track event call for level_up without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no level_up event properties and event name should be level_up',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'level_up',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'level_up',
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
    id: 'ga4-track-test-6',
    name: 'ga4',
    description: 'Track event call for group event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all group event properties and event name should be group',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'group',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                group_id: groupId,
                engagementTimeMsec,
                sessionId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'group',
                    params: {
                      group_id: groupId,
                      session_id: sessionId,
                      engagement_time_msec: engagementTimeMsec,
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
    id: 'ga4-track-test-7',
    name: 'ga4',
    description: 'Track event call for group without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no group event properties and event name should be group',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'group',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'group',
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
    id: 'ga4-track-test-8',
    name: 'ga4',
    description: 'Track event call for login event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all login event properties and event name should be login',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'login',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                method: 'Google',
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'login',
                    params: {
                      method: 'Google',
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
    id: 'ga4-track-test-9',
    name: 'ga4',
    description: 'Track event call for login without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no login event properties and event name should be login',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'login',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'login',
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
    id: 'ga4-track-test-10',
    name: 'ga4',
    description: 'Track event call for post_score event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all post_score event properties and event name should be post_score',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'post_score',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                score: 10000,
                level: 5,
                character: 'Player 1',
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'post_score',
                    params: {
                      score: 10000,
                      level: 5,
                      character: 'Player 1',
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
    id: 'ga4-track-test-11',
    name: 'ga4',
    description: 'Track event call for post_score event with only required event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain only required post_score event properties and event name should be post_score',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'post_score',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                score: 10000,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'post_score',
                    params: {
                      score: 10000,
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
    id: 'ga4-track-test-12',
    name: 'ga4',
    description: 'Track event call for select_content event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all select_content event properties and event name should be select_content',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'select_content',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                item_id: 'I_12345',
                content_type: 'product',
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'select_content',
                    params: {
                      item_id: 'I_12345',
                      content_type: 'product',
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
    id: 'ga4-track-test-13',
    name: 'ga4',
    description: 'Track event call for select_content without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no select_content event properties and event name should be select_content',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'select_content',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'select_content',
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
    id: 'ga4-track-test-14',
    name: 'ga4',
    description: 'Track event call for sign_up event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all sign_up event properties and event name should be sign_up',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'sign_up',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                method: 'Google',
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'sign_up',
                    params: {
                      method: 'Google',
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
    id: 'ga4-track-test-15',
    name: 'ga4',
    description: 'Track event call for sign_up without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no sign_up event properties and event name should be sign_up',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'sign_up',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'sign_up',
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
    id: 'ga4-track-test-16',
    name: 'ga4',
    description: 'Track event call for spend_virtual_currency event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all spend_virtual_currency event properties and event name should be spend_virtual_currency',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'spend_virtual_currency',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                value: 5,
                item_name: 'Starter Boost',
                virtual_currency_name: 'Gems',
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'spend_virtual_currency',
                    params: {
                      value: 5,
                      item_name: 'Starter Boost',
                      virtual_currency_name: 'Gems',
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
    id: 'ga4-track-test-17',
    name: 'ga4',
    description: 'Track event call for spend_virtual_currency without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no spend_virtual_currency event properties and event name should be spend_virtual_currency',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'spend_virtual_currency',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'spend_virtual_currency',
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
    id: 'ga4-track-test-18',
    name: 'ga4',
    description: 'Track event call for tutorial_begin without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no tutorial_begin event properties and event name should be tutorial_begin',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'tutorial_begin',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'tutorial_begin',
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
    id: 'ga4-track-test-19',
    name: 'ga4',
    description: 'Track event call for tutorial_complete without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no tutorial_complete event properties and event name should be tutorial_complete',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'tutorial_complete',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'tutorial_complete',
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
    id: 'ga4-track-test-20',
    name: 'ga4',
    description: 'Track event call for unlock_achievement event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all unlock_achievement event properties and event name should be unlock_achievement',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'unlock_achievement',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                achievement_id: 'A_12345',
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'unlock_achievement',
                    params: {
                      achievement_id: 'A_12345',
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
    id: 'ga4-track-test-21',
    name: 'ga4',
    description: 'Track event call for rudderstack event event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all rudderstack event event properties and event name should be rudderstack_event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'rudderstack event',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                total,
                timezone,
                engagementTimeMsec,
                sessionId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'rudderstack_event',
                    params: {
                      total,
                      timezone_name: timezone.name,
                      session_id: sessionId,
                      engagement_time_msec: engagementTimeMsec,
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
    id: 'ga4-track-test-22',
    name: 'ga4',
    description:
      'Track event call for rudderstack event event with all event properties and user properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all rudderstack event event properties and user properties and event name should be rudderstack_event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'rudderstack event',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                total,
                user_properties: {
                  price: '19',
                },
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                user_properties: {
                  price: {
                    value: '19',
                  },
                },
                events: [
                  {
                    name: 'rudderstack_event',
                    params: {
                      total,
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
    id: 'ga4-track-test-23',
    name: 'ga4',
    description: 'Scenario to test custom events by passing reserved property names in payload',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all custom event properties and reserved properties should gets filtered from transformed payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'rudderstack event',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                total,
                firebase_conversion: 'firebase_conversion',
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'rudderstack_event',
                    params: {
                      total,
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
    id: 'ga4-track-test-24',
    name: 'ga4',
    description:
      'Scenario to test custom events by passing reserved properties and reserved user properties in payload',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all custom event properties and reserved properties and reserved user properties should gets filtered from transformed payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'rudderstack event',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                total,
                firebase_conversion: 'firebase_conversion',
                user_properties: {
                  first_open_time: 'first_open_time',
                  user_id: userId,
                  firebase_value: 'firebase_value',
                },
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'rudderstack_event',
                    params: {
                      total,
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
    id: 'ga4-track-test-25',
    name: 'ga4',
    description: 'Track event call for custom event without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no custom event properties and event name should be custom event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'rudderstack event',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'rudderstack_event',
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
    id: 'ga4-track-test-26',
    name: 'ga4',
    description: 'Track event call for taking client_id from anonymousId',
    scenario: 'Business',
    successCriteria: 'Response status code should be 200 and client_id should be anonymousId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'tutotial complete',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'tutotial_complete',
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
    id: 'ga4-track-test-27',
    name: 'ga4',
    description: 'Track event call for tutorial_complete without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no tutorial_complete event properties and event name should be tutorial_complete',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'tutorial complete',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: clientId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'tutorial_complete',
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
    id: 'ga4-track-test-28',
    name: 'ga4',
    description:
      'Scenario to test client_id is not sent from the path defined in the webapp config, falling back to default values i.e here it is anonymousId',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, client_id value should be equal to anonymousId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'tutorial complete',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
              },
              originalTimestamp,
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'tutorial_complete',
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
    id: 'ga4-track-test-29',
    name: 'ga4',
    description: 'Scenario to test extract session_id from context.sessionId',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, session_id value should be equal to context.sessionId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'tutorial complete',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
                sessionId: 16678456735,
              },
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                non_personalized_ads,
                events: [
                  {
                    name: 'tutorial_complete',
                    params: {
                      session_id: 16678456735,
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
    id: 'ga4-track-test-30',
    name: 'ga4',
    description: 'Scenario to test integer userId',
    scenario: 'Business',
    successCriteria: 'Response status code should be 200, user_id value should get stringified',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'tutorial complete',
              userId: 1234,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
                sessionId: 16678456735,
              },
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: '1234',
                non_personalized_ads,
                events: [
                  {
                    name: 'tutorial_complete',
                    params: {
                      session_id: 16678456735,
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
    id: 'ga4-track-test-31',
    name: 'ga4',
    description: 'Scenario to test login event with user_properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain all user_properties passed with payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'login',
              userId,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
                traits: {
                  campaign: 'advertizing',
                },
              },
              properties: {
                method: 'facebook',
              },
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                user_properties: {
                  campaign: {
                    value: 'advertizing',
                  },
                },
                events: [
                  {
                    name: 'login',
                    params: {
                      method: 'facebook',
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
    id: 'ga4-track-test-32',
    name: 'ga4',
    description: 'Scenario to test track call with page information such as url, title, referrer',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain all page related parameters',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'generate_lead',
              userId,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
                page,
              },
              properties: {
                value,
                source: 'instagram',
              },
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'generate_lead',
                    params: {
                      value,
                      currency: 'USD',
                      source: 'instagram',
                      page_location: 'https://www.rudderstack.com/',
                      page_referrer: '$direct',
                      page_title: 'Document',
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
    id: 'ga4-track-test-33',
    name: 'ga4',
    description:
      'Scenario to test track event with hybrid connection mode using buffer cloud mode event approach',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain track event properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ...destination,
              Config: { ...destination.Config, connectionMode: 'hybrid' },
            },
            message: {
              type: 'track',
              event: 'generate_lead',
              userId,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
              },
              properties: {
                value,
                source: 'instagram',
              },
              integrations: {
                All: true,
                'Google Analytics 4 (GA4)': {
                  clientId: '554581488.1683172875',
                  sessionId: '1683172875',
                },
              },
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: '554581488.1683172875',
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'generate_lead',
                    params: {
                      value,
                      currency: 'USD',
                      source: 'instagram',
                      session_id: '1683172875',
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
    id: 'ga4-track-test-34',
    name: 'ga4',
    description:
      'Scenario to test track event with hybrid connection mode using override client_id and session_id approach',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain track event properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ...destination,
              Config: { ...destination.Config, connectionMode: 'hybrid' },
            },
            message: {
              type: 'track',
              event: 'generate_lead',
              userId,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
                sessionId: 1683172874065,
              },
              properties: {
                value,
                source: 'instagram',
              },
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'generate_lead',
                    params: {
                      value,
                      currency: 'USD',
                      source: 'instagram',
                      session_id: 1683172874065,
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
    id: 'ga4-track-test-35',
    name: 'ga4',
    description: 'Scenario to test sign_up event with all data types of user_properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain all user_properties sent in payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ...destination,
              Config: { ...destination.Config, connectionMode: 'hybrid' },
            },
            message: {
              type: 'track',
              event: 'sign_up',
              userId,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
                sessionId: 1683172874065,
                traits: {
                  campaign: 'advertizing',
                  name: 'rudder',
                  age: 45,
                  hobby: ['dancing', 'singing', 'reading'],
                  enableEURegion: false,
                  isEnterpriseUser: {
                    value: false,
                  },
                },
              },
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                user_properties: {
                  age: {
                    value: 45,
                  },
                  name: {
                    value: 'rudder',
                  },
                  campaign: {
                    value: 'advertizing',
                  },
                  enableEURegion: {
                    value: false,
                  },
                },
                events: [
                  {
                    name: 'sign_up',
                    params: {
                      session_id: 1683172874065,
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
    id: 'ga4-track-test-36',
    name: 'ga4',
    description: 'Scenario to test event having multiple empty array and object parameters',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and in final response empty array and object should gets filtered out',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'login',
              userId,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
              },
              properties: {
                user_interest: 'Moderate',
                company_interest: '',
                profile: [
                  {
                    is_6qa: true,
                    product: null,
                    product_fit: 'Moderate',
                    product_stage: 'Purchase',
                    intent_score: 89,
                    profile_score: 52,
                    product_display$name: 'rudderstack',
                  },
                ],
                user_company: 'Analytics consulting',
                user_account: '1',
                user_id_mappings: '330098|245252|461224|282599',
                company_naics_6sense: '5173',
                usr_consent: null,
                firebase_user_id: 'kdgMnP',
                google_user_id: 'G-123456',
                company_domain: 'consulting.net',
                company_region: 'New Zealand',
                user_product_interests: {
                  ids: [],
                  list: [
                    {
                      id: 330098,
                      name: [],
                    },
                    {
                      id: 245252,
                      name: {},
                    },
                  ],
                  names: [],
                },
                company_country: {},
                company_industry: 'Business Analytics',
                company_revenue: '$5M - $10M',
                company_annual_revenue: '5568000',
                company_sic_description: '',
                company_naics_description: [],
              },
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'login',
                    params: {
                      company_annual_revenue: '5568000',
                      company_domain: 'consulting.net',
                      company_industry: 'Business Analytics',
                      company_naics_6sense: '5173',
                      company_region: 'New Zealand',
                      company_revenue: '$5M - $10M',
                      engagement_time_msec: defaultEngagementTimeMsec,
                      profile_0_intent_score: 89,
                      profile_0_is_6qa: true,
                      profile_0_product_display$name: 'rudderstack',
                      profile_0_product_fit: 'Moderate',
                      profile_0_product_stage: 'Purchase',
                      profile_0_profile_score: 52,
                      user_account: '1',
                      user_company: 'Analytics consulting',
                      user_id_mappings: '330098|245252|461224|282599',
                      user_interest: 'Moderate',
                      user_product_interests_list_0_id: 330098,
                      user_product_interests_list_1_id: 245252,
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
    id: 'ga4-track-test-37',
    name: 'ga4',
    description: "Teack event call with campaign_details custom event and it's properties",
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and resonse should contain all campaign_details event properties and event name should be campaign_details',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'campaign_details',
              userId,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
                campaign,
              },
              originalTimestamp,
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'campaign_details',
                    params: {
                      ...expectedCampaignOutputParams,
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
    id: 'ga4-track-test-38',
    name: 'ga4',
    description: 'Send consents setting to ga4 with login event',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain all consent settings',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'login',
              userId,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
                campaign,
              },
              originalTimestamp,
              integrations: {
                All: true,
                GA4: {
                  consents: {
                    ad_personalization: 'GRANTED',
                    ad_user_data: 'GRANTED',
                  },
                },
              },
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                consent: {
                  ad_personalization: 'GRANTED',
                  ad_user_data: 'GRANTED',
                },
                events: [
                  {
                    name: 'login',
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
    id: 'ga4-track-test-39',
    name: 'ga4',
    description: 'Send invalid consents settings to ga4 with login event',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain only valid consent setting',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'login',
              userId,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
                campaign,
              },
              originalTimestamp,
              integrations: {
                All: true,
                GA4: {
                  consents: {
                    ad_personalization: 'NOT_SPECIFIED',
                    ad_user_data: 'DENIED',
                  },
                },
              },
            },
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              endpointPath: 'mp/collect',
              headers: commonOutputHeaders,
              params: commonOutputParams,
              JSON: {
                client_id: anonymousId,
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                consent: {
                  ad_user_data: 'DENIED',
                },
                events: [
                  {
                    name: 'login',
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
];
