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

const rudderId = 'dummyRudderId';
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
const sentAt = '2022-04-20T15:20:57Z';
const originalTimestamp = '2022-04-26T05:17:09Z';

const timezone = {
  name: 'Europe/Tallinn',
};
const clientId = 'dummyClientId';
const userId = 'default-user-id';

const coupon = 'SUMMER_FUN';
const defaultCurrency = 'USD';
const search_term = 'Clothing';
const shipping_method = 'Ground';
const payment_method = 'Credit Card';
const list_id = 'related_products';
const category = 'Related_products';

const value = 7.77;
const total = '7.77';
const sessionId = 655;
const engagementTimeMsec = 100;
const non_personalized_ads = true;
const defaultEngagementTimeMsec = 1;
const timestamp_micros = 1650950229000000;

const commonProductInfo = [
  {
    product_id: '507f1f77bcf86cd799439011',
    name: 'Monopoly: 3rd Edition',
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

const expectedOutputItems = [
  {
    item_id: '507f1f77bcf86cd799439011',
    item_name: 'Monopoly: 3rd Edition',
    coupon: 'SUMMER_FUN',
    item_category: 'Apparel',
    item_brand: 'Google',
    item_variant: 'green',
    price: 19,
    quantity: 2,
    index: 1,
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

const promotionEventsCommonProductInfo = [
  {
    product_id: '507f1f77bcf86cd799439011',
    name: 'Monopoly: 3rd Edition',
    coupon: 'SUMMER_FUN',
    category: 'Apparel',
    brand: 'Google',
    variant: 'green',
    price: '19',
    quantity: '2',
    position: '0',
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
    promotion_id: 'P_12345',
    promotion_name: 'Summer Sale',
    creative_name: 'summer_banner2',
    creative_slot: 'featured_app_1',
  },
];

const promotionEventsCommonParams = {
  creative_name: 'Summer Banner',
  creative_slot: 'featured_app_1',
  location_id: 'L_12345',
  promotion_id: 'P_12345',
  promotion_name: 'Summer Sale',
};

const promotionEventsExpectedOutputItems = [
  {
    item_id: '507f1f77bcf86cd799439011',
    item_name: 'Monopoly: 3rd Edition',
    coupon: 'SUMMER_FUN',
    item_category: 'Apparel',
    item_brand: 'Google',
    item_variant: 'green',
    price: 19,
    quantity: 2,
    index: 0,
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
    promotion_id: 'P_12345',
    promotion_name: 'Summer Sale',
    creative_name: 'summer_banner2',
    creative_slot: 'featured_app_1',
  },
];

const promotionEventsExpectedOutputParams = {
  creative_name: 'Summer Banner',
  creative_slot: 'featured_app_1',
  location_id: 'L_12345',
  promotion_id: 'P_12345',
  promotion_name: 'Summer Sale',
  engagement_time_msec: defaultEngagementTimeMsec,
};

const orderEventsCommonParams = {
  currency: defaultCurrency,
  order_id: 'T_12345',
  total: 12.21,
  affiliation: 'Google Store',
  coupon,
  shipping: 3.33,
  tax: 1.11,
};

const orderEventsExpectedOutputParams = {
  currency: defaultCurrency,
  transaction_id: 'T_12345',
  value: 12.21,
  affiliation: 'Google Store',
  coupon,
  shipping: 3.33,
  tax: 1.11,
};

const shareProductsCommonParams = {
  share_via: 'Twitter',
  content_type: 'image',
  item_id: 'C_12345',
};

const shareProductsExpectedOutputParams = {
  method: 'Twitter',
  content_type: 'image',
  item_id: 'C_12345',
};

export const ecommTestData: ProcessorTestData[] = [
  {
    id: 'ga4-ecom-test-1',
    name: 'ga4',
    description: 'Track event call for Products Searched event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all product searched event properties and event name should be search',
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
              event: 'Products Searched',
              sentAt,
              context: {
                externalId,
              },
              properties: {
                query: 't-shirts',
              },
              anonymousId,
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
                client_id: 'dummyAnonId',
                timestamp_micros,
                user_id: userId,
                events: [
                  {
                    name: 'search',
                    params: {
                      search_term: 't-shirts',
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
    id: 'ga4-ecom-test-2',
    name: 'ga4',
    description: 'Track event call for product list viewed event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all product list viewed event properties and event name should be view_item_list',
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
              event: 'product list viewed',
              rudderId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId,
              },
              properties: {
                list_id,
                category,
                products: commonProductInfo,
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
                client_id: 'default-anonymousId',
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'view_item_list',
                    params: {
                      engagement_time_msec: defaultEngagementTimeMsec,
                      item_list_id: 'related_products',
                      item_list_name: 'Related_products',
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-3',
    name: 'ga4',
    description: 'Track event call for promotion viewed event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all promotion viewed event properties and event name should be view_promotion',
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
              event: 'promotion viewed',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                ...promotionEventsCommonParams,
                products: promotionEventsCommonProductInfo,
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
                    name: 'view_promotion',
                    params: {
                      ...promotionEventsExpectedOutputParams,
                      items: promotionEventsExpectedOutputItems,
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
    id: 'ga4-ecom-test-4',
    name: 'ga4',
    description: 'Track event call for promotion clicked event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all promotion clicked event properties and event name should be select_promotion',
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
              event: 'promotion clicked',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                ...promotionEventsCommonParams,
                products: promotionEventsCommonProductInfo,
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
                    name: 'select_promotion',
                    params: {
                      ...promotionEventsExpectedOutputParams,
                      items: promotionEventsExpectedOutputItems,
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
    id: 'ga4-ecom-test-5',
    name: 'ga4',
    description:
      'Track event call for promotion clicked event by excuding products from properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all promotion clicked event properties except products and event name should be select_promotion',
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
              event: 'promotion clicked',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                ...promotionEventsCommonParams,
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
                    name: 'select_promotion',
                    params: {
                      ...promotionEventsExpectedOutputParams,
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
    id: 'ga4-ecom-test-6',
    name: 'ga4',
    description: 'Track event call for product clicked event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all product clicked event properties and event name should be select_item',
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
              event: 'product clicked',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                ...commonProductInfo[0],
                list_id,
                category,
                timezone,
                sessionId,
                engagementTimeMsec,
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
                    name: 'select_item',
                    params: {
                      item_list_id: list_id,
                      item_list_name: category,
                      items: [{ ...expectedOutputItems[0], item_category: category }],
                      timezone_name: timezone.name,
                      engagement_time_msec: engagementTimeMsec,
                      session_id: sessionId,
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
    id: 'ga4-ecom-test-7',
    name: 'ga4',
    description: 'Track event call for product viewed event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all product viewed event properties and event name should be view_item',
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
              event: 'product viewed',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                total,
                ...commonProductInfo[0],
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
                    name: 'view_item',
                    params: {
                      currency: defaultCurrency,
                      value,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-8',
    name: 'ga4',
    description: 'Track event call for product added event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all product added event properties and event name should be add_to_cart',
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
                currency: defaultCurrency,
                total,
                products: commonProductInfo,
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
                    name: 'add_to_cart',
                    params: {
                      currency: defaultCurrency,
                      value,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-9',
    name: 'ga4',
    description: 'Track event call for product removed event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all product removed event properties and event name should be remove_from_cart',
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
              event: 'product removed',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                currency: defaultCurrency,
                total,
                products: commonProductInfo,
                sessionId,
                engagementTimeMsec,
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
                    name: 'remove_from_cart',
                    params: {
                      currency: defaultCurrency,
                      value,
                      items: expectedOutputItems,
                      engagement_time_msec: engagementTimeMsec,
                      session_id: sessionId,
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
    id: 'ga4-ecom-test-10',
    name: 'ga4',
    description: 'Track event call for cart viewed event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all cart viewed event properties and event name should be view_cart',
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
              event: 'cart viewed',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                currency: defaultCurrency,
                total,
                products: commonProductInfo,
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
                    name: 'view_cart',
                    params: {
                      currency: defaultCurrency,
                      value,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-11',
    name: 'ga4',
    description: 'Track event call for checkout started event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all checkout started event properties and event name should be begin_checkout',
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
              event: 'checkout started',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                currency: defaultCurrency,
                total,
                coupon,
                products: commonProductInfo,
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
                    name: 'begin_checkout',
                    params: {
                      currency: defaultCurrency,
                      value,
                      coupon,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-12',
    name: 'ga4',
    description: 'Track event call for payment info entered event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all payment info entered event properties and event name should be add_payment_info',
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
              event: 'payment info entered',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                currency: defaultCurrency,
                total,
                coupon,
                payment_method,
                products: commonProductInfo,
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
                    name: 'add_payment_info',
                    params: {
                      currency: defaultCurrency,
                      value,
                      coupon,
                      payment_type: payment_method,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-13',
    name: 'ga4',
    description: 'Track event call for Checkout Step Completed event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all Checkout Step Completed event properties and event name should be add_shipping_info',
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
              event: 'Checkout Step Completed',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                currency: defaultCurrency,
                total,
                coupon,
                shipping_method,
                products: commonProductInfo,
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
                    name: 'add_shipping_info',
                    params: {
                      currency: defaultCurrency,
                      value,
                      coupon,
                      shipping_tier: shipping_method,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-14',
    name: 'ga4',
    description: 'Track event call for order completed event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all order completed event properties and event name should be purchase',
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
              event: 'order completed',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                ...orderEventsCommonParams,
                products: commonProductInfo,
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
                    name: 'purchase',
                    params: {
                      ...orderEventsExpectedOutputParams,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-15',
    name: 'ga4',
    description: 'Track event call for order refunded event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all order refunded event properties and event name should be refund',
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
              event: 'order refunded',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                ...orderEventsCommonParams,
                products: commonProductInfo,
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
                    name: 'refund',
                    params: {
                      ...orderEventsExpectedOutputParams,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-16',
    name: 'ga4',
    description: 'Track event call for order refunded event and exclude products from properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all order refunded event properties except products and event name should be refund',
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
              event: 'order refunded',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                ...orderEventsCommonParams,
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
                    name: 'refund',
                    params: {
                      ...orderEventsExpectedOutputParams,
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
    id: 'ga4-ecom-test-17',
    name: 'ga4',
    description: 'Track event call for product added to wishlist event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all product added to wishlist event properties and event name should be add_to_wishlist',
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
              event: 'product added to wishlist',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                currency: defaultCurrency,
                total,
                products: commonProductInfo,
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
                    name: 'add_to_wishlist',
                    params: {
                      currency: defaultCurrency,
                      value,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-18',
    name: 'ga4',
    description: 'Track event call for product_shared event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all product_shared event properties and event name should be share',
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
              event: 'product_shared',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: shareProductsCommonParams,
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
                    name: 'share',
                    params: {
                      ...shareProductsExpectedOutputParams,
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
    id: 'ga4-ecom-test-19',
    name: 'ga4',
    description: 'Track event call for product_shared event without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no product_shared event properties and event name should be share',
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
              event: 'product_shared',
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
                    name: 'share',
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
    id: 'ga4-ecom-test-20',
    name: 'ga4',
    description: 'Track event call for cart Shared event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all cart Shared event properties and event name should be share',
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
              event: 'cart Shared',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: shareProductsCommonParams,
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
                    name: 'share',
                    params: {
                      ...shareProductsExpectedOutputParams,
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
    id: 'ga4-ecom-test-21',
    name: 'ga4',
    description: 'Track event call for cart Shared event without properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain no cart Shared event properties and event name should be share',
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
              event: 'cart Shared',
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
                    name: 'share',
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
    id: 'ga4-ecom-test-22',
    name: 'ga4',
    description:
      'Track event call for promotion clicked event with all event properties and type of client is firebase',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all promotion clicked event properties and event name should be select_promotion and response should contain all firebase related params',
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
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'promotion clicked',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                ...promotionEventsCommonParams,
                products: promotionEventsCommonProductInfo,
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
              params: {
                api_secret: 'dummyApiSecret',
                firebase_app_id: 'dummyFirebaseAppId',
              },
              JSON: {
                app_instance_id: 'dummyAppInstanceId',
                timestamp_micros,
                user_id: userId,
                non_personalized_ads,
                events: [
                  {
                    name: 'select_promotion',
                    params: {
                      ...promotionEventsExpectedOutputParams,
                      items: promotionEventsExpectedOutputItems,
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
    id: 'ga4-ecom-test-23',
    name: 'ga4',
    description: 'Track event call for view_search_results event with all event properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain all view_search_results event properties and event name should be view_search_results',
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
              event: 'view_search_results',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                search_term,
                products: commonProductInfo,
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
                    name: 'view_search_results',
                    params: {
                      search_term,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-24',
    name: 'ga4',
    description: 'Track event call for view_search_results event with only products as properties',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain only products as view_search_results event properties and event name should be view_search_results',
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
              event: 'view_search_results',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                products: commonProductInfo,
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
                    name: 'view_search_results',
                    params: {
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-25',
    name: 'ga4',
    description: 'Track event call for product added event with products information at root level',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain items array with product information and event name should be add_to_cart',
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
                total,
                ...commonProductInfo[0],
                products: [],
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
                    name: 'add_to_cart',
                    params: {
                      currency: defaultCurrency,
                      value,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-26',
    name: 'ga4',
    description: 'Track event call for product added event with products as an object',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain items array with product information and event name should be add_to_cart',
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
                total,
                ...commonProductInfo[0],
                products: commonProductInfo[0],
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
                    name: 'add_to_cart',
                    params: {
                      currency: defaultCurrency,
                      value,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-27',
    name: 'ga4',
    description:
      'Scenario to test custom properties along with products: [..] parameters to GA4 standard events along with its stated ones',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain both custom and standard properties',
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
              event: 'order completed',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                revenue: 15,
                discount: 1.5,
                checkout_id: '12345',
                myCustomProp: 'My arbitray value',
                ...orderEventsCommonParams,
                products: commonProductInfo,
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
                    name: 'purchase',
                    params: {
                      affiliation: 'Google Store',
                      checkout_id: '12345',
                      coupon: 'SUMMER_FUN',
                      discount: 1.5,
                      currency: defaultCurrency,
                      myCustomProp: 'My arbitray value',
                      shipping: 3.33,
                      tax: 1.11,
                      transaction_id: 'T_12345',
                      value: 12.21,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-28',
    name: 'ga4',
    description:
      'Scenario to test custom properties excluding products: [..] parameter to GA4 standard events along with its stated ones',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain both custom and standard properties',
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
              event: 'promotion clicked',
              anonymousId,
              sentAt,
              context: {
                device: deviceInfo,
                externalId: externalIdWithClientId,
              },
              properties: {
                timezone,
                promotion_page: '/products',
                promotion_channel: 'facebook',
                ...promotionEventsCommonParams,
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
                    name: 'select_promotion',
                    params: {
                      promotion_page: '/products',
                      promotion_channel: 'facebook',
                      timezone_name: 'Europe/Tallinn',
                      ...promotionEventsExpectedOutputParams,
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
    id: 'ga4-ecom-test-29',
    name: 'ga4',
    description: 'Scenario to test price x currency multiplication for product added event',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200, event payload should contain value calculated from price x currency and event name should be add_to_cart',
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
                price: 2.4,
                quantity: 2,
                products: commonProductInfo,
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
                    name: 'add_to_cart',
                    params: {
                      price: 2.4,
                      quantity: 2,
                      value: 4.8,
                      currency: defaultCurrency,
                      items: expectedOutputItems,
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
    id: 'ga4-ecom-test-30',
    name: 'ga4',
    description:
      'Scenario to test any custom or item property with array value, is flattened with underscore delimeter',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and all the nested properties should get flattened in final payload',
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
                externalId,
              },
              properties: {
                ...commonProductInfo[0],
                address: {
                  city: 'kolkata',
                  district: '24pgs',
                },
                categoryLevels: ['Furniture', 'Bedroom Furniture', 'Dressers & Chests'],
                products: [
                  {
                    product_id: '1234',
                    product_details: {
                      colour: 'red',
                      shape: 'rectangle',
                    },
                    productLevels: ['test1', 'test2', 'test3'],
                  },
                ],
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
                    name: 'add_to_cart',
                    params: {
                      value: 38,
                      ...commonProductInfo[0],
                      address_city: 'kolkata',
                      address_district: '24pgs',
                      categoryLevels_0: 'Furniture',
                      categoryLevels_1: 'Bedroom Furniture',
                      categoryLevels_2: 'Dressers & Chests',
                      items: [
                        {
                          item_id: '1234',
                          productLevels_0: 'test1',
                          productLevels_1: 'test2',
                          productLevels_2: 'test3',
                          product_details_colour: 'red',
                          product_details_shape: 'rectangle',
                        },
                      ],
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
