/**
 * GAOC Data Delivery - Business Scenarios with Batch Fetching Feature Flag
 *
 * This file contains business logic tests for GAOC data delivery (proxy v0 and v1).
 * All tests include `envOverrides: { GAOC_ENABLE_BATCH_FETCHING: 'true' }` to validate
 * the new batch fetching optimization feature.
 *
 * Test scenarios cover:
 * - Proxy v0 API: Store conversions with offline user data jobs
 * - Proxy v1 API: Click conversions, store conversions, and call conversions
 * - Success cases: Valid requests returning 200 responses
 * - Error cases: Invalid arguments, permission errors, etc.
 *
 * Based on original dataDelivery tests but with batch fetching feature flag enabled.
 */

import { authHeader1 } from '../../maskedSecrets';
import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../../testUtils';

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
  conversion_action: 'customers/1112223333/conversionActions/848898416',
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
    'developer-token': 'test-developer-token-12345',
    'login-customer-id': 'logincustomerid',
  },
  header2: {
    Authorization: authHeader1,
    'Content-Type': 'application/json',
    'developer-token': 'test-developer-token-12345',
  },
};

const params = {
  param1: {
    customerId: '1112223333',
    conversionActionId: 'customers/1112223333/conversionActions/848898416',
  },
  param2: {
    conversionActionId: 'customers/1234567891/conversionActions/848898416',
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

params['param4'] = {
  ...params.param3,
  customerId: '1234567893',
  conversionEnvironment: 'APP',
  conversionActionId: 'customers/1234567893/conversionActions/848898417',
};

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
      conversionAction: 'customers/1234567891/conversionActions/848898416',
      customVariables: [
        {
          conversionCustomVariable: 'customers/1234567891/conversionCustomVariables/19131634',
          value: 'value',
        },
      ],
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
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
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
            destinationResponse: {
              response: {
                name: 'customers/111-222-3333/operations/abcd=',
              },
              status: 200,
            },
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
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
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
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
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
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
              '[Google Ads Offline Conversions]:: Customer is not allowlisted for accessing this feature., at conversions[0].conversion_environment',
            destinationResponse: {
              response: {
                partialFailureError: {
                  code: 3,
                  details: [
                    {
                      '@type':
                        'type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure',
                      errors: [
                        {
                          errorCode: {
                            notAllowlistedError: 'CUSTOMER_NOT_ALLOWLISTED_FOR_THIS_FEATURE',
                          },
                          location: {
                            fieldPathElements: [
                              {
                                fieldName: 'conversions',
                                index: 0,
                              },
                              {
                                fieldName: 'conversion_environment',
                              },
                            ],
                          },
                          message: 'Customer is not allowlisted for accessing this feature.',
                          trigger: {
                            int64Value: '2',
                          },
                        },
                      ],
                      requestId: 'dummyRequestId',
                    },
                  ],
                  message:
                    'Customer is not allowlisted for accessing this feature., at conversions[0].conversion_environment',
                },
                results: [{}],
              },
              status: 200,
            },
            response: [
              {
                error:
                  'Customer is not allowlisted for accessing this feature., at conversions[0].conversion_environment',
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
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
    },
  },
  {
    id: 'gaoc_v1_scenario_6',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v1 API] :: Test click conversion API request which contains partially valid request',
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
            JSON: {
              conversions: [
                { ...validRequestPayload2.conversions[0] },
                {
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
                      hashedPhoneNumber:
                        '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                    },
                  ],
                  conversionEnvironment: 'WEB',
                  conversionDateTime: '2025-11-12 16:21:53+05:30',
                  conversionValue: 1,
                  currencyCode: 'GBP',
                  orderId: 'PL-123QR',
                  conversionAction: 'customers/1234567891/conversionActions/848898417',
                  consent: {
                    adPersonalization: 'UNSPECIFIED',
                    adUserData: 'UNSPECIFIED',
                  },
                },
              ],
              partialFailure: true,
            },
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567893:uploadClickConversions`,
          },
          [generateMetadata(1), generateMetadata(2)],
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
              "[Google Ads Offline Conversions]:: The conversion action specified in the upload request cannot be found. Make sure it's available in this account., at conversions[1].conversion_action",
            destinationResponse: {
              response: {
                jobId: '5353383680802491057',
                partialFailureError: {
                  code: 3,
                  details: [
                    {
                      '@type':
                        'type.googleapis.com/google.ads.googleads.v22.errors.GoogleAdsFailure',
                      errors: [
                        {
                          errorCode: {
                            conversionUploadError: 'NO_CONVERSION_ACTION_FOUND',
                          },
                          location: {
                            fieldPathElements: [
                              {
                                fieldName: 'conversions',
                                index: 1,
                              },
                              {
                                fieldName: 'conversion_action',
                              },
                            ],
                          },
                          message:
                            "The conversion action specified in the upload request cannot be found. Make sure it's available in this account.",
                          trigger: {
                            stringValue: 'customers/4172647997/conversionActions/7377464874',
                          },
                        },
                      ],
                      requestId: 'f4J_sjHfhbgNieU4pkBOqg',
                    },
                  ],
                  message:
                    "The conversion action specified in the upload request cannot be found. Make sure it's available in this account., at conversions[1].conversion_action",
                },
                results: [
                  {
                    conversionAction: 'customers/1234567891/conversionActions/848898416',
                    conversionDateTime: '2025-11-12 16:21:53+05:30',
                    userIdentifiers: [
                      {
                        hashedPhoneNumber:
                          '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
                        userIdentifierSource: 'FIRST_PARTY',
                      },
                    ],
                  },
                  {},
                ],
              },
              status: 200,
            },
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
              {
                error:
                  "The conversion action specified in the upload request cannot be found. Make sure it's available in this account., at conversions[1].conversion_action",
                metadata: generateMetadata(2),
                statusCode: 400,
              },
            ],
            statTags: expectedStatTags,
            status: 400,
          },
        },
      },
    },
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
    },
  },
];
