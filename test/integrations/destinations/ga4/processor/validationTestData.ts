import { defaultMockFns } from '../mocks';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, generateSimplifiedTrackPayload } from '../../../testUtils';

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

const anonymousId = 'dummyAnonId';
const userId = 'default-user-id';
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
const sentAt = '2022-04-20T15:20:57Z';
const originalTimestamp = '2022-04-26T05:17:09Z';

const commonProductInfo = [
  {
    coupon: 'SUMMER_FUN',
    category: 'Apparel',
    brand: 'Google',
    variant: 'green',
    price: '19',
    quantity: '2',
    position: '1',
    affiliation: 'Google Merchandise Store',
    currency: 'USD',
    discount: 2.22,
    item_category2: 'Adult',
    item_category3: 'Shirts',
    item_category4: 'Crew',
    item_category5: 'Short sleeve',
    item_list_id: 'related_products',
    item_list_name: 'Related Products',
    location_id: 'L_12345',
  },
];

const reservedEventsErrorMessage = 'track:: Reserved event names are not allowed';
const expectedStatTags = {
  destType: 'GA4',
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'ga4-validation-test-1',
    name: 'ga4',
    description: 'Scenario to test reserved event name to GA4',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw error with respective message',
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
              event: 'ad_click',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                total: 10,
              },
              originalTimestamp,
            }),
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
            error: reservedEventsErrorMessage,
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    // @ts-ignore
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-2',
    name: 'ga4',
    description: 'Scenario to test reserved event name along with reserved event properties to GA4',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw error with respective message',
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
              event: 'app_remove',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                firebase_conversion: 'firebase_conversion',
                google_id: 'ga_id',
                ga_value: 'ga_value',
                value: 10,
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
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: reservedEventsErrorMessage,
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: (_) => {
      return jest
        .spyOn(Date, 'now')
        .mockReturnValueOnce(new Date('2012-04-29T05:17:09Z').valueOf());
    },
  },
  {
    id: 'ga4-validation-test-3',
    name: 'ga4',
    description: 'Scenario to test reserved prefix names to GA4',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw error with respective message',
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
              event: 'firebase_event1',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                value: 10,
                google_id: 'ga_id',
                ga_value: 'ga_value',
                firebase_conversion: 'firebase_conversion',
              },
              originalTimestamp,
            }),
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
            error: 'Reserved custom prefix names are not allowed',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-4',
    name: 'ga4',
    description:
      'Scenario to  pass event name to GA4 with missing fields i.e required in products: [..]',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw error with respective message',
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
              event: 'product added',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                total: 7.77,
                products: commonProductInfo,
              },
              originalTimestamp,
            }),
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
            error: 'One of product_id or name is required',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-5',
    name: 'ga4',
    description:
      'Scenario to pass event name to GA4 with missing fields i.e required in products: [..]',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw error with respective message',
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
              event: 'Product Viewed',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                total: 7.77,
                currency: 'USD',
              },
              originalTimestamp,
            }),
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
            error: 'One of product_id or name is required',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-6',
    name: 'ga4',
    description: 'Scenario to test missing API Secret',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw configuration error with respective message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ...destination,
              Config: { ...destination.Config, apiSecret: null },
              Enabled: true,
            },
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'tutotial complete',
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
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'API Secret not found. Aborting ',
            statTags: { ...expectedStatTags, errorType: 'configuration' },
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-7',
    name: 'ga4',
    description: 'Scenario to test missing measurementId',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw configuration error with respective message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ...destination,
              Config: { ...destination.Config, measurementId: null },
              Enabled: true,
            },
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'tutotial complete',
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
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'measurementId must be provided. Aborting',
            statTags: { ...expectedStatTags, errorType: 'configuration' },
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-8',
    name: 'ga4',
    description: 'Scenario to test missing message type',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              event: 'tutotial complete',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
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
            error: 'Message Type is not present. Aborting message.',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-9',
    name: 'ga4',
    description: 'Scenario to test missing message event name',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective message',
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
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
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
            error: 'Event name is required',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-10',
    name: 'ga4',
    description: 'Scenario to test missing ga4AppInstanceId for firebase client type',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                typesOfClient: 'firebase',
                firebaseAppId: 'dummyFirebaseAppId',
              },
            },
            message: {
              type: 'track',
              event: 'tutotial complete',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
              },
              originalTimestamp,
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
            error: 'ga4AppInstanceId must be provided under externalId',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-11',
    name: 'ga4',
    description: 'Scenario to test reserved event name for firebase client type',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                typesOfClient: 'firebase',
                firebaseAppId: 'dummyFirebaseAppId',
              },
            },
            message: {
              type: 'track',
              event: 'app_store_subscription_cancel',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
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
            error: 'Reserved custom event names are not allowed',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-12',
    name: 'ga4',
    description: 'Scenario to test missing firebaseAppId for firebase client type',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw configuration error with respective message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                typesOfClient: 'firebase',
                firebaseAppId: null,
              },
            },
            message: {
              type: 'track',
              event: 'tutotial complete',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
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
            error: 'firebaseAppId must be provided. Aborting',
            statTags: { ...expectedStatTags, errorType: 'configuration' },
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    id: 'ga4-validation-test-13',
    name: 'ga4',
    description: 'Scenario to test timestamp more than 72 hours into the past',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective message',
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
              event: 'tutotial complete',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp: '2022-04-20T05:17:09Z',
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
            error: 'Allowed timestamp is [72 hours] into the past',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: (_) => {
      return jest
        .spyOn(Date, 'now')
        .mockReturnValueOnce(new Date('2023-04-29T05:17:09Z').valueOf());
    },
  },
  {
    id: 'ga4-validation-test-14',
    name: 'ga4',
    description: 'Scenario to test timestamp more than 15 min into the future',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective message',
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
              event: 'tutotial complete',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp: '2022-05-05T15:47:57Z',
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
            error: 'Allowed timestamp is [15 minutes] into the future',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    mockFns: (_) => {
      return jest
        .spyOn(Date, 'now')
        .mockReturnValueOnce(new Date('2021-04-29T05:17:09Z').valueOf());
    },
  },
  {
    id: 'ga4-validation-test-15',
    name: 'ga4',
    description: 'Scenario to test event value other then string',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective message',
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
              event: {
                name: 'promotion_viewed',
              },
              properties: {
                products: commonProductInfo,
              },
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp: '2022-05-05T15:47:57Z',
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
            error: 'track:: event name should be string',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'ga4-validation-test-16',
    name: 'ga4',
    description: 'Scenario to test client_id not found in payload',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw configuration error with respective message',
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
              event: 'product added',
              properties: {
                products: commonProductInfo,
              },
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
              },
              originalTimestamp,
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
            error: 'ga4ClientId, anonymousId or messageId must be provided',
            statTags: { ...expectedStatTags, errorType: 'configuration' },
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'ga4-validation-test-17',
    name: 'ga4',
    description: 'Scenario to test event name starts with numbers',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective message',
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
              event: '1234_sign_up',
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              originalTimestamp,
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
            error:
              'Event name must start with a letter and can only contain letters, numbers, and underscores',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
