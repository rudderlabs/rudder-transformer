import { defaultMockFns } from '../mocks';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder, generateGroupPayload } from '../../../testUtils';

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
const sentAt = '2022-04-20T15:20:57Z';
const originalTimestamp = '2022-04-26T05:17:09Z';
const timezone = {
  name: 'Europe/Tallinn',
};
const clientId = 'dummyClientId';
const userId = 'default-user-id';

const sessionId = 655;
const engagementTimeMsec = 100;
const non_personalized_ads = true;
const defaultEngagementTimeMsec = 1;
const timestamp_micros = 1650950229000000;

export const groupTestData: ProcessorTestData[] = [
  {
    id: 'ga4-group-test-1',
    name: 'ga4',
    description: 'Group event call with event name',
    scenario: 'Business',
    successCriteria: 'Response status code should be 200 and event name should be join_group',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateGroupPayload({
              type: 'group',
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
                    name: 'join_group',
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
    id: 'ga4-group-test-2',
    name: 'ga4',
    description: 'Group event call with event name and properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and event payload should contain all properties and event name should be join_group',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateGroupPayload({
              type: 'group',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              traits: {
                org: 'rudderlabs',
                sector: 'cdp',
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
                    name: 'join_group',
                    params: {
                      sector: 'cdp',
                      org: 'rudderlabs',
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
    id: 'ga4-group-test-3',
    name: 'ga4',
    description: 'Scenario to test firing group calls with GA4 hybrid mode connection',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should containe track event properties',
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
              type: 'group',
              event: 'tutorial complete',
              userId,
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
                sessionId: 1683172874065,
              },
              integrations: {
                'Google Analytics 4': {
                  clientId: '4718026.1683606287',
                  sessionId: '1683606287',
                  sessionNumber: 1,
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
                client_id: '4718026.1683606287',
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'join_group',
                    params: {
                      session_id: '1683606287',
                      session_number: 1,
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
