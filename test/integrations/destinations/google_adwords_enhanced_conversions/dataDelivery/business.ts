import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { API_VERSION } from '../../../../../src/v0/destinations/google_adwords_enhanced_conversions/config';

const headers = {
  Authorization: 'Bearer abcd1234',
  'Content-Type': 'application/json',
  'developer-token': 'ijkl91011',
  'login-customer-id': '0987654321',
};

const params = {
  event: 'Product Added',
  customerId: '1234567899',
  destination: 'google_adwords_enhanced_conversions',
};

const validRequestPaylod = {
  partialFailure: true,
  conversionAdjustments: [
    {
      gclidDateTimePair: {
        gclid: 'gclid1234',
        conversionDateTime: '2022-01-01 12:32:45-08:00',
      },
      restatementValue: {
        adjustedValue: 10,
        currency: 'INR',
      },
      order_id: '10000',
      adjustmentDateTime: '2022-01-01 12:32:45-08:00',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
      userIdentifiers: [
        {
          addressInfo: {
            hashedFirstName: 'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
            hashedLastName: '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
            state: 'UK',
            city: 'London',
            hashedStreetAddress: '9a4d2e50828448f137f119a3ebdbbbab8d6731234a67595fdbfeb2a2315dd550',
          },
        },
      ],
      adjustmentType: 'ENHANCEMENT',
    },
  ],
};

const commonRequestParameters = {
  headers,
  params,
  JSON: validRequestPaylod,
};

const expectedStatTags = {
  destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

export const testScenariosForV0API = [
  {
    id: 'gaec_v0_scenario_1',
    name: 'google_adwords_enhanced_conversions',
    description:
      '[Proxy v0 API] :: Test for a valid request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567899:uploadConversionAdjustments`,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: [
                {
                  results: [
                    {
                      adjustmentDateTime: '2021-01-01 12:32:45-08:00',
                      adjustmentType: 'ENHANCEMENT',
                      conversionAction: 'customers/7693729833/conversionActions/874224905',
                      gclidDateTimePair: {
                        conversionDateTime: '2021-01-01 12:32:45-08:00',
                        gclid: '1234',
                      },
                      orderId: '12345',
                    },
                  ],
                },
              ],
              status: 200,
            },
            message: 'Request Processed Successfully',
            status: 200,
          },
        },
      },
    },
  },
  {
    id: 'gaec_v0_scenario_2',
    name: 'google_adwords_enhanced_conversions',
    description:
      '[Proxy v0 API] :: Test for a partial failure request with a 200 response from the destination',
    successCriteria: 'Should return 400 with partial failure error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          params: {
            event: 'Product Added',
            customerId: '1234567888',
            destination: 'google_adwords_enhanced_conversions',
          },
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567888:uploadConversionAdjustments`,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: {
              code: 3,
              details: [
                {
                  '@type': 'type.googleapis.com/google.ads.googleads.v15.errors.GoogleAdsFailure',
                  errors: [
                    {
                      errorCode: {
                        conversionAdjustmentUploadError: 'CONVERSION_ALREADY_ENHANCED',
                      },
                      location: {
                        fieldPathElements: [
                          {
                            fieldName: 'conversion_adjustments',
                            index: 0,
                          },
                        ],
                      },
                      message:
                        'Conversion already has enhancements with the same Order ID and conversion action. Make sure your data is correctly configured and try again.',
                    },
                  ],
                },
              ],
              message:
                'Conversion already has enhancements with the same Order ID and conversion action. Make sure your data is correctly configured and try again., at conversion_adjustments[0]',
            },
            message:
              '[Google Adwords Enhanced Conversions]:: partialFailureError - {"code":3,"message":"Conversion already has enhancements with the same Order ID and conversion action. Make sure your data is correctly configured and try again., at conversion_adjustments[0]","details":[{"@type":"type.googleapis.com/google.ads.googleads.v15.errors.GoogleAdsFailure","errors":[{"errorCode":{"conversionAdjustmentUploadError":"CONVERSION_ALREADY_ENHANCED"},"message":"Conversion already has enhancements with the same Order ID and conversion action. Make sure your data is correctly configured and try again.","location":{"fieldPathElements":[{"fieldName":"conversion_adjustments","index":0}]}}]}]}',
            statTags: expectedStatTags,
            status: 400,
          },
        },
      },
    },
  },
];

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'gaec_v1_scenario_1',
    name: 'google_adwords_enhanced_conversions',
    description:
      '[Proxy v1 API] :: Test for a valid request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567899:uploadConversionAdjustments`,
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request Processed Successfully',
            response: [
              {
                error:
                  '[{"results":[{"adjustmentType":"ENHANCEMENT","conversionAction":"customers/7693729833/conversionActions/874224905","adjustmentDateTime":"2021-01-01 12:32:45-08:00","gclidDateTimePair":{"gclid":"1234","conversionDateTime":"2021-01-01 12:32:45-08:00"},"orderId":"12345"}]}]',
                metadata: generateMetadata(1),
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
    id: 'gaec_v1_scenario_2',
    name: 'google_adwords_enhanced_conversions',
    description:
      '[Proxy v1 API] :: Test for a partial failure request with a 200 response from the destination',
    successCriteria: 'Should return 400 with partial failure error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            params: {
              event: 'Product Added',
              customerId: '1234567888',
              destination: 'google_adwords_enhanced_conversions',
            },
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567888:uploadConversionAdjustments`,
          },
          [generateMetadata(1)],
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
              '[Google Adwords Enhanced Conversions]:: partialFailureError - {"code":3,"message":"Conversion already has enhancements with the same Order ID and conversion action. Make sure your data is correctly configured and try again., at conversion_adjustments[0]","details":[{"@type":"type.googleapis.com/google.ads.googleads.v15.errors.GoogleAdsFailure","errors":[{"errorCode":{"conversionAdjustmentUploadError":"CONVERSION_ALREADY_ENHANCED"},"message":"Conversion already has enhancements with the same Order ID and conversion action. Make sure your data is correctly configured and try again.","location":{"fieldPathElements":[{"fieldName":"conversion_adjustments","index":0}]}}]}]}',
            response: [
              {
                error:
                  '[Google Adwords Enhanced Conversions]:: partialFailureError - {"code":3,"message":"Conversion already has enhancements with the same Order ID and conversion action. Make sure your data is correctly configured and try again., at conversion_adjustments[0]","details":[{"@type":"type.googleapis.com/google.ads.googleads.v15.errors.GoogleAdsFailure","errors":[{"errorCode":{"conversionAdjustmentUploadError":"CONVERSION_ALREADY_ENHANCED"},"message":"Conversion already has enhancements with the same Order ID and conversion action. Make sure your data is correctly configured and try again.","location":{"fieldPathElements":[{"fieldName":"conversion_adjustments","index":0}]}}]}]}',
                metadata: generateMetadata(1),
                statusCode: 400,
              },
            ],
            statTags: expectedStatTags,
            status: 400,
          },
        },
      },
    },
  },
];
