import { BATCH_ENDPOINT } from '../../../../../src/v0/destinations/tiktok_ads/config';
import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

export const commonHeaderPart = {
  'Access-Token': 'dummyAccessToken',
  'Content-Type': 'application/json',
};

export const params = {
  destination: 'tiktok_ads',
};

export const statTags = {
  destType: 'TIKTOK_ADS',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

export const commonParts = {
  context: {
    ad: {
      callback: '123ATXSfe',
    },
    page: {
      url: 'http://demo.mywebsite.com/purchase',
      referrer: 'http://demo.mywebsite.com',
    },
    user: {
      external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
      phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
      email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
    },
    ip: '13.57.97.131',
    user_agent: 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
  },
  pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
  partner_name: 'RudderStack',
  event: 'CompletePayment',
  event_id: '1616318632825_357',
  timestamp: '2020-09-17T19:49:27Z',
};

export const V1BusinessTestScenarion: ProxyV1TestData[] = [
  {
    id: 'tiktok_ads_business_0',
    name: 'tiktok_ads',
    description: '[Business]:: Test for tiktok_ads with multiple contents in properties',
    feature: 'dataDelivery',
    scenario: 'business',
    successCriteria: 'Should return 200 after successfully sending the request',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: {
              ...commonHeaderPart,
              'test-dest-response-key': 'successResponse',
            },
            params,
            endpoint: BATCH_ENDPOINT,
            JSON: {
              ...commonParts,
              properties: {
                contents: [
                  {
                    price: 8,
                    quantity: 2,
                    content_type: 'socks',
                    content_id: '1077218',
                  },
                  {
                    price: 30,
                    quantity: 1,
                    content_type: 'dress',
                    content_id: '1197218',
                  },
                ],
                currency: 'USD',
                value: 46,
              },
            },
          },
          [generateMetadata(1234)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[TIKTOK_ADS Response Handler] - Request Processed Successfully',
            response: [
              {
                error: JSON.stringify({ code: 0, message: 'OK' }),
                statusCode: 200,
                metadata: generateMetadata(1234),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'tiktok_ads_business_1',
    name: 'tiktok_ads',
    description:
      '[Business]:: Test for tiktok_ads with multiple contents in properties but content_id is not a string',
    feature: 'dataDelivery',
    scenario: 'business',
    successCriteria: 'Should return 400 after successfully processing the request with code 40002',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            params,
            headers: {
              ...commonHeaderPart,
              'test-dest-response-key': 'invalidDataTypeResponse',
            },
            endpoint: BATCH_ENDPOINT,
            JSON: {
              properties: {
                contents: [
                  {
                    price: 8,
                    quantity: 2,
                    content_type: 'socks',
                    content_id: 1077218,
                  },
                  {
                    price: 30,
                    quantity: 1,
                    content_type: 'dress',
                    content_id: 1197218,
                  },
                ],
                currency: 'USD',
                value: 46,
              },
              ...commonParts,
            },
          },
          [generateMetadata(1234)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: 'Request failed with status: 40002',
            response: [
              {
                statusCode: 400,
                error: JSON.stringify({
                  code: 40002,
                  message: 'Batch.0.properties.contents.0.content_id: Not a valid string',
                }),
                metadata: generateMetadata(1234),
              },
            ],
            statTags,
          },
        },
      },
    },
  },
  {
    id: 'tiktok_ads_business_2',
    name: 'tiktok_ads',
    description: '[Business]:: Test for tiktok_ads with wrong pixel code',
    feature: 'dataDelivery',
    scenario: 'business',
    successCriteria: 'Should return 400 after successfully processing the request with code 40001',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            params,
            endpoint: BATCH_ENDPOINT,
            headers: {
              ...commonHeaderPart,
              'test-dest-response-key': 'invalidPermissionsResponse',
            },
            JSON: {
              ...commonParts,
              properties: {
                contents: [
                  {
                    price: 8,
                    quantity: 2,
                    content_type: 'socks',
                    content_id: 1077218,
                  },
                  {
                    price: 30,
                    quantity: 1,
                    content_type: 'dress',
                    content_id: 1197218,
                  },
                ],
                currency: 'USD',
                value: 46,
              },
            },
          },
          [generateMetadata(1234)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: 'Request failed with status: 40001',
            response: [
              {
                statusCode: 400,
                error: JSON.stringify({
                  code: 40001,
                  message:
                    'No permission to operate pixel code: BU35TSQHT2A1QT375OMG. You must be an admin or operator of this advertiser account.',
                }),
                metadata: generateMetadata(1234),
              },
            ],
            statTags,
          },
        },
      },
    },
  },
];
