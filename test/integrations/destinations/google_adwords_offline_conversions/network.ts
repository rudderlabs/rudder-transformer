export const networkCallsData = [
  {
    httpReq: {
      url: 'https://googleads.googleapis.com/v14/customers/11122233331/offlineUserDataJobs:create',
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
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
      url: 'https://googleads.googleapis.com/v14/customers/1112223333/googleAds:searchStream',
      data: {
        query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Sign-up - click'`,
      },
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
      url: 'https://googleads.googleapis.com/v14/customers/11122233331/offlineUserDataJobs/OFFLINE_USER_DATA_JOB_ID_FOR_ADD_FAILURE:addOperations',
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
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
              '@type': 'type.googleapis.com/google.ads.googleads.v14.errors.GoogleAdsFailure',
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
      url: 'https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs:create',
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
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
      url: 'https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs/OFFLINE_USER_DATA_JOB_ID:addOperations',
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
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
      url: 'https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs/OFFLINE_USER_DATA_JOB_ID:run',
      data: { validate_only: false },
      params: { destination: 'google_adwords_offline_conversion' },
      headers: {
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
    httpReq: {
      url: 'https://googleads.googleapis.com/v14/customers/customerid/offlineUserDataJobs:create',
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
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
    httpReq: {
      url: 'https://googleads.googleapis.com/v14/customers/1234567890/googleAds:searchStream',
      data: {
        query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Sign-up - click'`,
      },
      headers: {
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
      url: 'https://googleads.googleapis.com/v14/customers/1234567891/googleAds:searchStream',
      data: {
        query:
          "SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Sign-up - click'",
      },
      headers: {
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
      url: 'https://googleads.googleapis.com/v14/customers/1234567891/googleAds:searchStream',
      data: { query: 'SELECT conversion_custom_variable.name FROM conversion_custom_variable' },
      headers: {
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
      url: 'https://googleads.googleapis.com/v14/customers/1234567891:uploadClickConversions',
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
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
      url: 'https://googleads.googleapis.com/v14/customers/1234567891:uploadClickConversions',
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
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/json',
        'developer-token': 'ijkl91011',
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
];
