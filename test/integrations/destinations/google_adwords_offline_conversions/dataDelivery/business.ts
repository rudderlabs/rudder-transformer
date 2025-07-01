import { authHeader1, secret3 } from '../maskedSecrets';
import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';

const API_VERSION = 'v19';

const transactionAttribute = {
  CUSTOM_KEY: 'CUSTOM_VALUE',
  currency_code: 'INR',
  order_id: 'order id',
  store_attribute: {
    store_code: 'store code',
  },
  transaction_amount_micros: '100000000',
  transaction_date_time: '2019-10-14 11:15:18+00:00',
};

const createJobPayload = {
  job: {
    storeSalesMetadata: {
      custom_key: 'CUSTOM_KEY',
      loyaltyFraction: 1,
      transaction_upload_fraction: '1',
    },
    type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
  },
};

const products = [
  {
    product_id: '507f1f77bcf86cd799439011',
    quantity: '2',
    price: '50',
    sku: '45790-32',
    name: 'Monopoly: 3rd Edition',
    position: '1',
    category: 'cars',
    url: 'https://www.example.com/product/path',
    image_url: 'https://www.example.com/product/path.jpg',
  },
];

const headers = {
  header1: {
    Authorization: authHeader1,
    'Content-Type': 'application/json',
    'developer-token': secret3,
    'login-customer-id': 'logincustomerid',
  },
  header2: {
    Authorization: authHeader1,
    'Content-Type': 'application/json',
    'developer-token': secret3,
  },
};

const params = {
  param1: {
    customerId: '1112223333',
    event: 'Sign-up - click',
  },
  param2: {
    event: 'Sign-up - click',
    customerId: '1234567891',
    customVariables: [
      {
        from: 'Value',
        to: 'revenue',
      },
      {
        from: 'total',
        to: 'cost',
      },
    ],
    properties: {
      gbraid: 'gbraid',
      wbraid: 'wbraid',
      externalAttributionCredit: 10,
      externalAttributionModel: 'externalAttributionModel',
      conversionCustomVariable: 'conversionCustomVariable',
      Value: 'value',
      merchantId: '9876merchantId',
      feedCountryCode: 'feedCountryCode',
      feedLanguageCode: 'feedLanguageCode',
      localTransactionCost: 20,
      products,
      userIdentifierSource: 'FIRST_PARTY',
      conversionEnvironment: 'WEB',
      gclid: 'gclid',
      conversionDateTime: '2022-01-01 12:32:45-08:00',
      conversionValue: '1',
      currency: 'GBP',
      orderId: 'PL-123QR',
    },
  },
  param3: {},
  param4: {},
};

params['param3'] = { ...params.param2, customVariables: [] };

params['param4'] = { ...params.param3, customerId: '1234567893', conversionEnvironment: 'APP' };

const validRequestPayload1 = {
  addConversionPayload: {
    enable_partial_failure: false,
    enable_warnings: false,
    operations: [
      {
        create: {
          transaction_attribute: transactionAttribute,
          userIdentifiers: [
            {
              hashedEmail: '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
              userIdentifierSource: 'UNSPECIFIED',
            },
          ],
        },
      },
    ],
    validate_only: false,
  },
  createJobPayload,
  event: '1112223333',
  executeJobPayload: {
    validate_only: false,
  },
  isStoreConversion: true,
};

const validRequestPayload2 = {
  conversions: [
    {
      gbraid: 'gbraid',
      wbraid: 'wbraid',
      externalAttributionData: {
        externalAttributionCredit: 10,
        externalAttributionModel: 'externalAttributionModel',
      },
      cartData: {
        merchantId: 9876,
        feedCountryCode: 'feedCountryCode',
        feedLanguageCode: 'feedLanguageCode',
        localTransactionCost: 20,
        items: [
          {
            productId: '507f1f77bcf86cd799439011',
            quantity: 2,
            unitPrice: 50,
          },
        ],
      },
      userIdentifiers: [
        {
          userIdentifierSource: 'FIRST_PARTY',
          hashedPhoneNumber: '04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd',
        },
      ],
      conversionEnvironment: 'WEB',
      gclid: 'gclid',
      conversionDateTime: '2022-01-01 12:32:45-08:00',
      conversionValue: 1,
      currencyCode: 'GBP',
      orderId: 'PL-123QR',
    },
  ],
  partialFailure: true,
};

const invalidArgumentRequestPayload = {
  addConversionPayload: {
    enable_partial_failure: false,
    enable_warnings: false,
    operations: [
      {
        create: {
          transaction_attribute: transactionAttribute,
          userIdentifiers: [
            {
              hashedEmail: '6db61e6dcbcf2390e4a46af26f26a133a3bee45021422fc7ae86e9136f14110',
              userIdentifierSource: 'UNSPECIFIED',
            },
          ],
        },
      },
    ],
    validate_only: false,
  },
  createJobPayload,
  event: '1112223333',
  executeJobPayload: {
    validate_only: false,
  },
  isStoreConversion: true,
};

const notAllowedToAccessFeatureRequestPayload = {
  ...validRequestPayload2,
  conversions: [
    {
      ...validRequestPayload2.conversions[0],
      conversionEnvironment: 'APP',
    },
  ],
};

const metadataArray = [generateMetadata(1)];

const expectedStatTags = {
  destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
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
    id: 'gaoc_v0_scenario_1',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v0 API] :: Test for invalid argument - where the destination responds with 400 with invalid argument error',
    successCriteria: 'Should return 400 with error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: headers.header1,
          params: params.param1,
          JSON: invalidArgumentRequestPayload,
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/11122233331/offlineUserDataJobs`,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              '[Google Ads Offline Conversions]:: Request contains an invalid argument. during google_ads_offline_store_conversions Add Conversion',
            destinationResponse: {
              error: {
                code: 400,
                details: [
                  {
                    '@type': 'type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure',
                    errors: [
                      {
                        errorCode: {
                          offlineUserDataJobError: 'INVALID_SHA256_FORMAT',
                        },
                        message: 'The SHA256 encoded value is malformed.',
                        location: {
                          fieldPathElements: [
                            {
                              fieldName: 'operations',
                              index: 0,
                            },
                            {
                              fieldName: 'create',
                            },
                            {
                              fieldName: 'user_identifiers',
                              index: 0,
                            },
                            {
                              fieldName: 'hashed_email',
                            },
                          ],
                        },
                      },
                    ],
                    requestId: '68697987',
                  },
                ],
                message: 'Request contains an invalid argument.',
                status: 'INVALID_ARGUMENT',
              },
            },
            statTags: expectedStatTags,
          },
        },
      },
    },
  },
  {
    id: 'gaoc_v0_scenario_2',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v0 API] :: Test for a valid operations request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: headers.header1,
          params: params.param1,
          JSON: validRequestPayload1,
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223333/offlineUserDataJobs`,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message:
              '[Google Ads Offline Conversions Response Handler] - Request processed successfully',
            destinationResponse: {
              response: {
                name: 'customers/111-222-3333/operations/abcd=',
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    id: 'gaoc_v0_scenario_3',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v0 API] :: Test for a valid request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: headers.header2,
          params: params.param2,
          JSON: validRequestPayload2,
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567891:uploadClickConversions`,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message:
              '[Google Ads Offline Conversions Response Handler] - Request processed successfully',
            destinationResponse: {
              response: [
                {
                  adjustmentType: 'ENHANCEMENT',
                  conversionAction: 'customers/1234567891/conversionActions/874224905',
                  adjustmentDateTime: '2021-01-01 12:32:45-08:00',
                  gclidDateTimePair: {
                    gclid: '1234',
                    conversionDateTime: '2021-01-01 12:32:45-08:00',
                  },
                  orderId: '12345',
                },
              ],
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    id: 'gaoc_v0_scenario_4',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v0 API] :: Test for a valid conversion action request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: headers.header2,
          params: params.param3,
          JSON: validRequestPayload2,
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567891:uploadClickConversions`,
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
                  adjustmentDateTime: '2021-01-01 12:32:45-08:00',
                  adjustmentType: 'ENHANCEMENT',
                  conversionAction: 'customers/1234567891/conversionActions/874224905',
                  gclidDateTimePair: {
                    conversionDateTime: '2021-01-01 12:32:45-08:00',
                    gclid: '1234',
                  },
                  orderId: '12345',
                },
              ],
              status: 200,
            },
            message:
              '[Google Ads Offline Conversions Response Handler] - Request processed successfully',
            status: 200,
          },
        },
      },
    },
  },
];

export const testScenariosForV1API = [
  {
    id: 'gaoc_v1_scenario_1',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v1 API] :: Test for invalid argument - where the destination responds with 400 with invalid argument error',
    successCriteria: 'Should return 400 with error with destination response',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: headers.header1,
            params: params.param1,
            JSON: invalidArgumentRequestPayload,
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/11122233331/offlineUserDataJobs`,
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
              '[Google Ads Offline Conversions]:: Request contains an invalid argument. during google_ads_offline_store_conversions Add Conversion',
            response: [
              {
                error:
                  '[Google Ads Offline Conversions]:: Request contains an invalid argument. during google_ads_offline_store_conversions Add Conversion',
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
  {
    id: 'gaoc_v1_scenario_2',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v1 API] :: Test for a valid operations request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: headers.header1,
            params: params.param1,
            JSON: validRequestPayload1,
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223333/offlineUserDataJobs`,
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
              '[Google Ads Offline Conversions Response Handler] - Request processed successfully',
            response: [
              {
                error: JSON.stringify({ name: 'customers/111-222-3333/operations/abcd=' }),
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
    id: 'gaoc_v1_scenario_3',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v1 API] :: Test for a valid request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: headers.header2,
            params: params.param2,
            JSON: validRequestPayload2,
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567891:uploadClickConversions`,
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
              '[Google Ads Offline Conversions Response Handler] - Request processed successfully',
            response: [
              {
                error: JSON.stringify([
                  {
                    adjustmentType: 'ENHANCEMENT',
                    conversionAction: 'customers/1234567891/conversionActions/874224905',
                    adjustmentDateTime: '2021-01-01 12:32:45-08:00',
                    gclidDateTimePair: {
                      gclid: '1234',
                      conversionDateTime: '2021-01-01 12:32:45-08:00',
                    },
                    orderId: '12345',
                  },
                ]),
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
    id: 'gaoc_v1_scenario_4',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v1 API] :: Test for a valid conversion action request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: headers.header2,
            params: params.param3,
            JSON: validRequestPayload2,
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567891:uploadClickConversions`,
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
              '[Google Ads Offline Conversions Response Handler] - Request processed successfully',
            response: [
              {
                error: JSON.stringify([
                  {
                    adjustmentType: 'ENHANCEMENT',
                    conversionAction: 'customers/1234567891/conversionActions/874224905',
                    adjustmentDateTime: '2021-01-01 12:32:45-08:00',
                    gclidDateTimePair: {
                      gclid: '1234',
                      conversionDateTime: '2021-01-01 12:32:45-08:00',
                    },
                    orderId: '12345',
                  },
                ]),
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
    id: 'gaoc_v1_scenario_5',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v1 API] :: Test for customer is not allowed Test for a valid request with a successful 200 response from the destinationto access feature partial failure error',
    successCriteria: 'Should return 400 with error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: headers.header2,
            params: params.param4,
            JSON: notAllowedToAccessFeatureRequestPayload,
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567893:uploadClickConversions`,
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
              '[Google Ads Offline Conversions]:: partialFailureError - Customer is not allowlisted for accessing this feature., at conversions[0].conversion_environment',
            response: [
              {
                error:
                  '[Google Ads Offline Conversions]:: partialFailureError - Customer is not allowlisted for accessing this feature., at conversions[0].conversion_environment',
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
