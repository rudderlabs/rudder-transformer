import { authHeader1, authHeader2, authHeader401Test, secret3 } from './maskedSecrets';
const API_VERSION = 'v19';

const commonResponse = {
  status: 401,
  data: [
    {
      error: {
        code: 401,
        details: [
          {
            '@type': 'type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure',
            errors: [
              {
                errorCode: {
                  authenticationError: 'TWO_STEP_VERIFICATION_NOT_ENROLLED',
                },
                message:
                  "An account administrator changed this account's authentication settings. To access this Google Ads account, enable 2-Step Verification in your Google account at https://www.google.com/landing/2step.",
              },
            ],
            requestId: 'wy4ZYbsjWcgh6uC2Ruc_Zg',
          },
        ],
        message:
          'Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
        status: 'UNAUTHENTICATED',
      },
    },
  ],
};

export const networkCallsData = [
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/11122233331/offlineUserDataJobs:create`,
      data: {
        job: {
          storeSalesMetadata: {
            custom_key: 'CUSTOM_KEY',
            loyaltyFraction: 1,
            transaction_upload_fraction: '1',
          },
          type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
        },
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        resourceName:
          'customers/111-222-3333/offlineUserDataJobs/OFFLINE_USER_DATA_JOB_ID_FOR_ADD_FAILURE',
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223333/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Sign-up - click'`,
      },
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionAction: {
                resourceName: 'customers/111-222-3333/offlineUserDataJobs/conversion_id',
                id: '848898416',
              },
            },
          ],
          fieldMask: 'conversionAction.id',
          requestId: 'pNnCTCWGP9XOyy3Hmj7yGA',
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223333/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_action.name, conversion_action.resource_name FROM conversion_action WHERE conversion_action.name IN ('Sign-up - click', 'Page view', 'search')`,
      },
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionAction: {
                resourceName: 'customers/1112223333/conversionActions/848898416',
                name: 'Sign-up - click',
              },
            },
            {
              conversionAction: {
                resourceName: 'customers/1112223333/conversionActions/111222333',
                name: 'Page view',
              },
            },
            {
              conversionAction: {
                resourceName: 'customers/1112223333/conversionActions/444555666',
                name: 'search',
              },
            },
          ],
          fieldMask: 'conversionAction.id',
          requestId: 'pNnCTCWGP9XOyy3Hmj7yGA',
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223333/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_action.name, conversion_action.resource_name FROM conversion_action WHERE conversion_action.name IN ('Sign-up - click')`,
      },
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionAction: {
                resourceName: 'customers/1112223333/conversionActions/848898416',
                name: 'Sign-up - click',
              },
            },
          ],
          fieldMask: 'conversionAction.id',
          requestId: 'pNnCTCWGP9XOyy3Hmj7yGA',
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/9625812972/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_action.name, conversion_action.resource_name FROM conversion_action WHERE conversion_action.name IN ('Sign-up - click', 'Page view', 'search')`,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionAction: {
                resourceName: 'customers/9625812972/conversionActions/848898416',
                name: 'Sign-up - click',
              },
            },
            {
              conversionAction: {
                resourceName: 'customers/9625812972/conversionActions/111222333',
                name: 'Page view',
              },
            },
            {
              conversionAction: {
                resourceName: 'customers/9625812972/conversionActions/444555666',
                name: 'search',
              },
            },
          ],
          fieldMask: 'conversionAction.name,conversionAction.resourceName',
          requestId: 'batchConversionActionRequestAll',
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729833/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_action.name, conversion_action.resource_name FROM conversion_action WHERE conversion_action.name IN ('Data Reading Guide', 'Order Completed', 'Sign-up - click', 'Outbound click (rudderstack.com)', 'Page view', 'Store sales')`,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionAction: {
                resourceName: 'customers/7693729833/conversionActions/568898416',
                name: 'Data Reading Guide',
              },
            },
            {
              conversionAction: {
                resourceName: 'customers/7693729833/conversionActions/948898416',
                name: 'Order Completed',
              },
            },
            {
              conversionAction: {
                resourceName: 'customers/7693729833/conversionActions/848898416',
                name: 'Sign-up - click',
              },
            },
            {
              conversionAction: {
                resourceName: 'customers/7693729833/conversionActions/848898416',
                name: 'Outbound click (rudderstack.com)',
              },
            },
            {
              conversionAction: {
                resourceName: 'customers/7693729833/conversionActions/111222333',
                name: 'Page view',
              },
            },
            {
              conversionAction: {
                resourceName: 'customers/7693729833/conversionActions/444555666',
                name: 'Store sales',
              },
            },
          ],
          fieldMask: 'conversionAction.name,conversionAction.resourceName',
          requestId: 'batchConversionActionRequestAll',
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234556775/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_action.name, conversion_action.resource_name FROM conversion_action WHERE conversion_action.name IN ('Store sales')`,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionAction: {
                resourceName: 'customers/1234556775/conversionActions/948898416',
                name: 'Store sales',
              },
            },
          ],
          fieldMask: 'conversionAction.name,conversionAction.resourceName',
          requestId: 'batchConversionActionRequestAll',
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/11122233331/offlineUserDataJobs/OFFLINE_USER_DATA_JOB_ID_FOR_ADD_FAILURE:addOperations`,
      data: {
        enable_partial_failure: false,
        enable_warnings: false,
        operations: [
          {
            create: {
              transaction_attribute: {
                CUSTOM_KEY: 'CUSTOM_VALUE',
                currency_code: 'INR',
                order_id: 'order id',
                store_attribute: { store_code: 'store code' },
                transaction_amount_micros: '100000000',
                transaction_date_time: '2019-10-14 11:15:18+00:00',
                conversion_action: 'customers/111-222-3333/offlineUserDataJobs/conversion_id',
              },
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
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      status: 400,
      data: {
        error: {
          code: 400,
          message: 'Request contains an invalid argument.',
          status: 'INVALID_ARGUMENT',
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
        },
      },
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/11122233331/offlineUserDataJobs/OFFLINE_USER_DATA_JOB_ID_FOR_ADD_FAILURE:addOperations`,
      data: {
        enable_partial_failure: false,
        enable_warnings: false,
        operations: [
          {
            create: {
              transaction_attribute: {
                CUSTOM_KEY: 'CUSTOM_VALUE',
                currency_code: 'INR',
                order_id: 'order id',
                store_attribute: { store_code: 'store code' },
                transaction_amount_micros: '100000000',
                transaction_date_time: '2019-10-14 11:15:18+00:00',
                conversion_action: 'customers/1112223333/conversionActions/848898416',
              },
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
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      status: 400,
      data: {
        error: {
          code: 400,
          message: 'Request contains an invalid argument.',
          status: 'INVALID_ARGUMENT',
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
        },
      },
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223333/offlineUserDataJobs:create`,
      data: {
        job: {
          storeSalesMetadata: {
            custom_key: 'CUSTOM_KEY',
            loyaltyFraction: 1,
            transaction_upload_fraction: '1',
          },
          type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
        },
      },
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        resourceName: 'customers/111-222-3333/offlineUserDataJobs/OFFLINE_USER_DATA_JOB_ID',
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223333/offlineUserDataJobs/OFFLINE_USER_DATA_JOB_ID:addOperations`,
      data: {
        enable_partial_failure: false,
        enable_warnings: false,
        operations: [
          {
            create: {
              transaction_attribute: {
                CUSTOM_KEY: 'CUSTOM_VALUE',
                currency_code: 'INR',
                order_id: 'order id',
                store_attribute: { store_code: 'store code' },
                transaction_amount_micros: '100000000',
                transaction_date_time: '2019-10-14 11:15:18+00:00',
                conversion_action: 'customers/111-222-3333/offlineUserDataJobs/conversion_id',
              },
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
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      data: {},
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223333/offlineUserDataJobs/OFFLINE_USER_DATA_JOB_ID:addOperations`,
      data: {
        enable_partial_failure: false,
        enable_warnings: false,
        operations: [
          {
            create: {
              transaction_attribute: {
                CUSTOM_KEY: 'CUSTOM_VALUE',
                currency_code: 'INR',
                order_id: 'order id',
                store_attribute: { store_code: 'store code' },
                transaction_amount_micros: '100000000',
                transaction_date_time: '2019-10-14 11:15:18+00:00',
                conversion_action: 'customers/1112223333/conversionActions/848898416',
              },
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
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      data: {},
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223333/offlineUserDataJobs/OFFLINE_USER_DATA_JOB_ID:run`,
      data: { validate_only: false },
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        name: 'customers/111-222-3333/operations/abcd=',
      },
      status: 200,
    },
  },
  {
    description:
      'Mock response from destination depicting a request with invalid authentication credentials',
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/customerid/offlineUserDataJobs:create`,
      data: {
        job: {
          storeSalesMetadata: {
            custom_key: 'CUSTOM_KEY',
            loyaltyFraction: 1,
            transaction_upload_fraction: '1',
          },
          type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
        },
      },
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      status: 401,
      data: {
        error: {
          code: 401,
          message:
            'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
          status: 'UNAUTHENTICATED',
        },
      },
    },
  },
  {
    description:
      'Mock response from destination depicting a request with invalid authentication scopes',
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234/offlineUserDataJobs:create`,
      data: {
        job: {
          storeSalesMetadata: {
            custom_key: 'CUSTOM_KEY',
            loyaltyFraction: 1,
            transaction_upload_fraction: '1',
          },
          type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
        },
      },
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: {
      status: 403,
      data: {
        error: {
          code: 403,
          message: 'Request had insufficient authentication scopes',
          status: 'PERMISSION_DENIED',
        },
      },
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567890/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Sign-up - click'`,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
        {
          error: {
            code: 401,
            message:
              'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
            status: 'UNAUTHENTICATED',
          },
        },
      ],
      status: 401,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567891/googleAds:searchStream`,
      data: {
        query:
          "SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Sign-up - click'",
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionAction: {
                resourceName: 'customers/1234567891/conversionActions/848898416',
                id: '848898416',
              },
            },
          ],
          fieldMask: 'conversionAction.id',
          requestId: 'pNnCTCWGP9XOyy3Hmj7yGA',
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567891/googleAds:searchStream`,
      data: { query: 'SELECT conversion_custom_variable.name FROM conversion_custom_variable' },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionCustomVariable: {
                resourceName: 'customers/1234567891/conversionCustomVariables/19131634',
                name: 'revenue',
              },
            },
            {
              conversionCustomVariable: {
                resourceName: 'customers/1234567891/conversionCustomVariables/19134061',
                name: 'page_value',
              },
            },
          ],
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567891/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_custom_variable.name, conversion_custom_variable.resource_name FROM conversion_custom_variable WHERE conversion_custom_variable.name IN ('cost', 'revenue')`,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionCustomVariable: {
                resourceName: 'customers/1234567891/conversionCustomVariables/19131634',
                name: 'revenue',
              },
            },
            {
              conversionCustomVariable: {
                resourceName: 'customers/1234567891/conversionCustomVariables/19134062',
                name: 'cost',
              },
            },
          ],
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/9625812972/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_custom_variable.name, conversion_custom_variable.resource_name FROM conversion_custom_variable WHERE conversion_custom_variable.name IN ('revenue', 'cost')`,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionCustomVariable: {
                resourceName: 'customers/9625812972/conversionCustomVariables/19131634',
                name: 'revenue',
              },
            },
            {
              conversionCustomVariable: {
                resourceName: 'customers/9625812972/conversionCustomVariables/19134062',
                name: 'cost',
              },
            },
          ],
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729833/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_custom_variable.name, conversion_custom_variable.resource_name FROM conversion_custom_variable WHERE conversion_custom_variable.name IN ('revenue', 'cost')`,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionCustomVariable: {
                resourceName: 'customers/7693729833/conversionCustomVariables/19131634',
                name: 'revenue',
              },
            },
            {
              conversionCustomVariable: {
                resourceName: 'customers/7693729833/conversionCustomVariables/19134062',
                name: 'cost',
              },
            },
          ],
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223333/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_custom_variable.name, conversion_custom_variable.resource_name FROM conversion_custom_variable WHERE conversion_custom_variable.name IN ('revenue', 'cost')`,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionCustomVariable: {
                resourceName: 'customers/1112223333/conversionCustomVariables/19131634',
                name: 'revenue',
              },
            },
            {
              conversionCustomVariable: {
                resourceName: 'customers/1112223333/conversionCustomVariables/19134062',
                name: 'cost',
              },
            },
          ],
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567891/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_custom_variable.name, conversion_custom_variable.resource_name FROM conversion_custom_variable WHERE conversion_custom_variable.name IN ('revenue', 'cost')`,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionCustomVariable: {
                resourceName: 'customers/1234567891/conversionCustomVariables/19131634',
                name: 'revenue',
              },
            },
            {
              conversionCustomVariable: {
                resourceName: 'customers/1234567891/conversionCustomVariables/19134062',
                name: 'cost',
              },
            },
          ],
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567891:uploadClickConversions`,
      data: {
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
              items: [{ productId: '507f1f77bcf86cd799439011', quantity: 2, unitPrice: 50 }],
            },
            userIdentifiers: [
              {
                userIdentifierSource: 'FIRST_PARTY',
                hashedPhoneNumber:
                  '04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd',
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
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
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
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567891:uploadClickConversions`,
      data: {
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
              items: [{ productId: '507f1f77bcf86cd799439011', quantity: 2, unitPrice: 50 }],
            },
            userIdentifiers: [
              {
                userIdentifierSource: 'FIRST_PARTY',
                hashedPhoneNumber:
                  '04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd',
              },
            ],
            conversionEnvironment: 'WEB',
            gclid: 'gclid',
            conversionDateTime: '2022-01-01 12:32:45-08:00',
            conversionValue: 1,
            currencyCode: 'GBP',
            orderId: 'PL-123QR',
            conversionAction: 'customers/1234567891/conversionActions/848898416',
          },
        ],
        partialFailure: true,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
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
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567893/googleAds:searchStream`,
      data: {
        query:
          "SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Sign-up - click'",
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      data: [
        {
          results: [
            {
              conversionAction: {
                resourceName: 'customers/1234567893/conversionActions/848898417',
                id: '848898417',
              },
            },
          ],
          fieldMask: 'conversionAction.id',
          requestId: 'dummyRequestId',
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567893:uploadClickConversions`,
      data: {
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
              items: [{ productId: '507f1f77bcf86cd799439011', quantity: 2, unitPrice: 50 }],
            },
            userIdentifiers: [
              {
                userIdentifierSource: 'FIRST_PARTY',
                hashedPhoneNumber:
                  '04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd',
              },
            ],
            conversionEnvironment: 'APP',
            gclid: 'gclid',
            conversionDateTime: '2022-01-01 12:32:45-08:00',
            conversionValue: 1,
            currencyCode: 'GBP',
            orderId: 'PL-123QR',
            conversionAction: 'customers/1234567893/conversionActions/848898417',
          },
        ],
        partialFailure: true,
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      status: 200,
      data: {
        partialFailureError: {
          code: 3,
          message:
            'Customer is not allowlisted for accessing this feature., at conversions[0].conversion_environment',
          details: [
            {
              '@type': 'type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure',
              errors: [
                {
                  errorCode: {
                    notAllowlistedError: 'CUSTOMER_NOT_ALLOWLISTED_FOR_THIS_FEATURE',
                  },
                  message: 'Customer is not allowlisted for accessing this feature.',
                  trigger: {
                    int64Value: '2',
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
                },
              ],
              requestId: 'dummyRequestId',
            },
          ],
        },
        results: [{}],
      },
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567893:uploadClickConversions`,
      data: {
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
              items: [{ productId: '507f1f77bcf86cd799439011', quantity: 2, unitPrice: 50 }],
            },
            userIdentifiers: [
              {
                userIdentifierSource: 'FIRST_PARTY',
                hashedPhoneNumber:
                  '04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd',
              },
            ],
            conversionEnvironment: 'APP',
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
      },
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      status: 200,
      data: {
        partialFailureError: {
          code: 3,
          message:
            'Customer is not allowlisted for accessing this feature., at conversions[0].conversion_environment',
          details: [
            {
              '@type': 'type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure',
              errors: [
                {
                  errorCode: {
                    notAllowlistedError: 'CUSTOMER_NOT_ALLOWLISTED_FOR_THIS_FEATURE',
                  },
                  message: 'Customer is not allowlisted for accessing this feature.',
                  trigger: {
                    int64Value: '2',
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
                },
              ],
              requestId: 'dummyRequestId',
            },
          ],
        },
        results: [{}],
      },
    },
  },
  {
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567893:uploadClickConversions`,
      data: {
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
              items: [{ productId: '507f1f77bcf86cd799439011', quantity: 2, unitPrice: 50 }],
            },
            userIdentifiers: [
              {
                userIdentifierSource: 'FIRST_PARTY',
                hashedPhoneNumber:
                  '04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd',
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
      headers: {
        Authorization: authHeader1,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
      },
      method: 'POST',
      params: { destination: 'google_adwords_offline_conversion' },
    },
    httpRes: {
      status: 200,
      data: {
        partialFailureError: {
          code: 3,
          message:
            "The conversion action specified in the upload request cannot be found. Make sure it's available in this account., at conversions[1].conversion_action",
          details: [
            {
              '@type': 'type.googleapis.com/google.ads.googleads.v22.errors.GoogleAdsFailure',
              errors: [
                {
                  errorCode: {
                    conversionUploadError: 'NO_CONVERSION_ACTION_FOUND',
                  },
                  message:
                    "The conversion action specified in the upload request cannot be found. Make sure it's available in this account.",
                  trigger: {
                    stringValue: 'customers/4172647997/conversionActions/7377464874',
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
                },
              ],
              requestId: 'f4J_sjHfhbgNieU4pkBOqg',
            },
          ],
        },
        results: [
          {
            conversionAction: 'customers/1234567891/conversionActions/848898416',
            conversionDateTime: '2025-11-12 16:21:53+05:30',
            userIdentifiers: [
              {
                userIdentifierSource: 'FIRST_PARTY',
                hashedPhoneNumber:
                  '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
              },
            ],
          },
          {},
        ],
        jobId: '5353383680802491057',
      },
    },
  },
  {
    description:
      'Mock response from destination depicting a request from user who has not enabled 2 factor authentication',
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/customerid/offlineUserDataJobs:create`,
      data: {
        job: {
          storeSalesMetadata: {
            custom_key: 'CUSTOM_KEY',
            loyaltyFraction: 1,
            transaction_upload_fraction: '1',
          },
          type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
        },
      },
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: authHeader2,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: commonResponse,
  },
  {
    description:
      'Mock response from destination depicting a request from user who has not enabled 2 factor authentication',
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/1112223334/googleAds:searchStream`,
      data: {
        query:
          "SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Sign-up - click'",
      },
      headers: {
        Authorization: authHeader2,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid',
      },
      method: 'POST',
    },
    httpRes: commonResponse,
  },
  {
    description:
      'Mock 401 error response from searchStream API when access token is expired during batch fetching',
    httpReq: {
      url: `https://googleads.googleapis.com/${API_VERSION}/customers/9998887777/googleAds:searchStream`,
      data: {
        query: `SELECT conversion_action.name, conversion_action.resource_name FROM conversion_action WHERE conversion_action.name IN ('Purchase Conversion')`,
      },
      headers: {
        Authorization: authHeader401Test,
        'Content-Type': 'application/json',
        'developer-token': 'test-developer-token-12345',
        'login-customer-id': 'logincustomerid401',
      },
      method: 'POST',
    },
    httpRes: {
      status: 401,
      data: [
        {
          error: {
            code: 401,
            message:
              'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
            status: 'UNAUTHENTICATED',
          },
        },
      ],
    },
  },
];
