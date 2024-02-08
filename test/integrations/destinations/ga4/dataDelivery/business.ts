import { ProxyMetdata } from '../../../../../src/types';
import { generateProxyV1Payload } from '../../../testUtils';
import { JSON_MIME_TYPE } from '../../../../../src/v0/util/constant';

const headers = {
  HOST: 'www.google-analytics.com',
  'Content-Type': JSON_MIME_TYPE,
};

const params = {
  api_secret: 'dymmyApiSecret',
};

const validRequest = {
  events: [
    {
      name: 'sign_up',
      params: {
        method: 'google',
        engagement_time_msec: 1,
      },
    },
  ],
  user_id: 'dummyUserId',
  client_id: 'dummyClientId',
  non_personalized_ads: true,
};

const invalidEventNameRequest = {
  events: [
    {
      name: 'campaign@details',
      params: {
        term: 'summer+travel',
        medium: 'cpc',
        source: 'google',
        content: 'logo link',
        campaign: 'Summer_fun',
        campaign_id: 'google_1234',
        engagement_time_msec: 1,
      },
    },
  ],
  user_id: 'dummyUserId',
  client_id: 'dummyClientId',
  non_personalized_ads: true,
};

const invalidParameterValueRequest = {
  events: [
    {
      name: 'add_to_cart',
      params: {
        currency: 'USD',
        value: 7.77,
        engagement_time_msec: 1,
        items: [
          {
            item_id: '507f1f77bcf86cd799439011',
            item_name: 'Monopoly: 3rd Edition',
            coupon: 'SUMMER_FUN',
            item_category: 'Apparel',
            item_brand: 'Google',
            item_variant: 'green',
            price: '$19',
            quantity: 2,
            affiliation: 'Google Merchandise Store',
            currency: 'USD',
            item_list_id: 'related_products',
            item_list_name: 'Related Products',
            location_id: 'L_12345',
          },
        ],
      },
    },
  ],
  user_id: 'dummyUserId',
  client_id: 'dummyClientId',
  non_personalized_ads: true,
};

const proxyMetdata: ProxyMetdata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {},
  dontBatch: false,
};

const metadataArray = [proxyMetdata];

export const testScenariosForV1API = [
  {
    id: 'ga4_v1_scenario_1',
    name: 'ga4',
    description:
      '[Proxy v1 API] :: Test for a valid request - where the destination responds with 200 without any error',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers,
            params,
            JSON: validRequest,
            endpoint: 'https://www.google-analytics.com/debug/mp/collect',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: '[GA4 Response Handler] - Request Processed Successfully',
            response: [
              {
                error: '{"validationMessages":[]}',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
  },
  {
    id: 'ga4_v1_scenario_2',
    name: 'ga4',
    description:
      '[Proxy v1 API] :: Test for a invalid event name - where the destination responds with 200 with error for invalid event name',
    successCriteria: 'Should return 200 with error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers,
            params,
            JSON: invalidEventNameRequest,
            endpoint: 'https://www.google-analytics.com/debug/mp/collect',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Validation Server Response Handler:: Validation Error for ga4 of field path :events | NAME_INVALID-Event at index: [0] has invalid name [campaign@details]. Only alphanumeric characters and underscores are allowed.',
            response: [
              {
                error:
                  'Validation Server Response Handler:: Validation Error for ga4 of field path :events | NAME_INVALID-Event at index: [0] has invalid name [campaign@details]. Only alphanumeric characters and underscores are allowed.',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 200,
              },
            ],
            statTags: {
              destType: 'GA4',
              destinationId: 'dummyDestinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'dummyWorkspaceId',
            },
            status: 200,
          },
        },
      },
    },
  },
  {
    id: 'ga4_v1_scenario_3',
    name: 'ga4',
    description:
      '[Proxy v1 API] :: Test for a invalid parameter value - where the destination responds with 200 with error for invalid parameter value',
    successCriteria: 'Should return 200 with error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers,
            params,
            JSON: invalidParameterValueRequest,
            endpoint: 'https://www.google-analytics.com/debug/mp/collect',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Validation Server Response Handler:: Validation Error for ga4 of field path :undefined | INTERNAL_ERROR-Validation of item.price should prevent conversion from unsupported value [string_value: "$19"]',
            response: [
              {
                error:
                  'Validation Server Response Handler:: Validation Error for ga4 of field path :undefined | INTERNAL_ERROR-Validation of item.price should prevent conversion from unsupported value [string_value: "$19"]',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 200,
              },
            ],
            statTags: {
              destType: 'GA4',
              destinationId: 'dummyDestinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'dummyWorkspaceId',
            },
            status: 200,
          },
        },
      },
    },
  },
];
