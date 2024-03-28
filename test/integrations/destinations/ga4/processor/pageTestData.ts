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
];
