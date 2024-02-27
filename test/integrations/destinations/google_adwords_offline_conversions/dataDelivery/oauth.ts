import {
  generateMetadata,
  generateProxyV1Payload,
  generateProxyV0Payload,
} from '../../../testUtils';

const commonHeaders1 = {
  Authorization: 'Bearer abcd1234',
  'Content-Type': 'application/json',
  'developer-token': 'ijkl91011',
  'login-customer-id': 'logincustomerid',
};

const commonHeaders2 = {
  Authorization: 'Bearer abcd1234',
  'Content-Type': 'application/json',
  'developer-token': 'ijkl91011',
};

const commonParams1 = {
  customerId: '1112223333',
  event: 'Sign-up - click',
};

const commonParams2 = {
  event: 'Sign-up - click',
  customerId: '1234567890',
  customVariables: [
    {
      from: 'value',
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
    value: 'value',
    merchantId: '9876merchantId',
    feedCountryCode: 'feedCountryCode',
    feedLanguageCode: 'feedLanguageCode',
    localTransactionCost: 20,
    products: [
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
    ],
    userIdentifierSource: 'FIRST_PARTY',
    conversionEnvironment: 'WEB',
    gclid: 'gclid',
    conversionDateTime: '2022-01-01 12:32:45-08:00',
    conversionValue: '1',
    currency: 'GBP',
    orderId: 'PL-123QR',
  },
};

const invalidCredsRequestPayload1 = {
  addConversionPayload: {
    enable_partial_failure: false,
    enable_warnings: false,
    operations: [
      {
        create: {
          transaction_attribute: {
            CUSTOM_KEY: 'CUSTOM_VALUE',
            currency_code: 'INR',
            order_id: 'order id',
            store_attribute: {
              store_code: 'store code',
            },
            transaction_amount_micros: '100000000',
            transaction_date_time: '2019-10-14 11:15:18+00:00',
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
  createJobPayload: {
    job: {
      storeSalesMetadata: {
        custom_key: 'CUSTOM_KEY',
        loyaltyFraction: 1,
        transaction_upload_fraction: '1',
      },
      type: 'STORE_SALES_UPLOAD_FIRST_PARTY',
    },
  },
  event: '1112223333',
  executeJobPayload: {
    validate_only: false,
  },
  isStoreConversion: true,
};

const invalidCredsRequestPayload2 = {
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
          hashedEmail: '6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110',
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

export const v0oauthScenarios = [
  {
    id: 'gaoc_v0_oauth_scenario_1',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v0 API] :: Oauth  where valid credentials are missing as mock response from destination',
    successCriteria: 'The proxy should return 401 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: commonHeaders1,
          params: commonParams1,
          JSON: invalidCredsRequestPayload1,
          endpoint: 'https://googleads.googleapis.com/v14/customers/customerid/offlineUserDataJobs',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            status: 401,
            message:
              '[Google Ads Offline Conversions]:: Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project. during google_ads_offline_store_conversions Job Creation',
            authErrorCategory: 'REFRESH_TOKEN',
            destinationResponse: {
              error: {
                code: 401,
                message:
                  'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
                status: 'UNAUTHENTICATED',
              },
            },
            statTags: expectedStatTags,
          },
        },
      },
    },
  },
  {
    id: 'gaoc_v0_oauth_scenario_2',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v0 API] :: Oauth  where valid credentials are missing as mock response from destination',
    successCriteria: 'The proxy should return 401 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: commonHeaders2,
          params: commonParams2,
          JSON: invalidCredsRequestPayload2,
          endpoint:
            'https://googleads.googleapis.com/v14/customers/1234567890:uploadClickConversions',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            status: 401,
            message:
              '[Google Ads Offline Conversions]:: [{"error":{"code":401,"message":"Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.","status":"UNAUTHENTICATED"}}] during google_ads_offline_conversions response transformation',
            authErrorCategory: 'REFRESH_TOKEN',
            destinationResponse: [
              {
                error: {
                  code: 401,
                  message:
                    'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
                  status: 'UNAUTHENTICATED',
                },
              },
            ],
            statTags: expectedStatTags,
          },
        },
      },
    },
  },
];

export const v1oauthScenarios = [
  {
    id: 'gaoc_v1_oauth_scenario_1',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v1 API] :: Oauth  where valid credentials are missing as mock response from destination',
    successCriteria: 'The proxy should return 401 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          headers: commonHeaders1,
          params: commonParams1,
          JSON: invalidCredsRequestPayload1,
          endpoint: 'https://googleads.googleapis.com/v14/customers/customerid/offlineUserDataJobs',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            authErrorCategory: 'REFRESH_TOKEN',
            message:
              '[Google Ads Offline Conversions]:: Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project. during google_ads_offline_store_conversions Job Creation',
            response: [
              {
                error:
                  '[Google Ads Offline Conversions]:: Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project. during google_ads_offline_store_conversions Job Creation',
                metadata: generateMetadata(1),
                statusCode: 401,
              },
            ],
            statTags: expectedStatTags,
            status: 401,
          },
        },
      },
    },
  },
  {
    id: 'gaoc_v1_oauth_scenario_2',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v1 API] :: Oauth  where valid credentials are missing as mock response from destination',
    successCriteria: 'The proxy should return 401 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          headers: commonHeaders2,
          params: commonParams2,
          JSON: invalidCredsRequestPayload2,
          endpoint:
            'https://googleads.googleapis.com/v14/customers/1234567890:uploadClickConversions',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            authErrorCategory: 'REFRESH_TOKEN',
            message:
              '[Google Ads Offline Conversions]:: [{"error":{"code":401,"message":"Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.","status":"UNAUTHENTICATED"}}] during google_ads_offline_conversions response transformation',
            response: [
              {
                error:
                  '[Google Ads Offline Conversions]:: [{"error":{"code":401,"message":"Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.","status":"UNAUTHENTICATED"}}] during google_ads_offline_conversions response transformation',
                metadata: generateMetadata(1),
                statusCode: 401,
              },
            ],
            statTags: expectedStatTags,
            status: 401,
          },
        },
      },
    },
  },
];
