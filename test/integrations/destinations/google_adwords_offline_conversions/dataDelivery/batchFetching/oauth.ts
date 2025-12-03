/**
 * GAOC Data Delivery - OAuth Scenarios with Batch Fetching Feature Flag
 *
 * This file contains OAuth/authentication tests for GAOC data delivery (proxy v0 and v1).
 * All tests include `envOverrides: { GAOC_ENABLE_BATCH_FETCHING: 'true' }` to validate
 * authentication behavior with the new batch fetching optimization feature.
 *
 * Test scenarios cover:
 * - Proxy v0 API OAuth scenarios: Invalid credentials, insufficient scopes
 * - Proxy v1 API OAuth scenarios: Invalid credentials, insufficient scopes, 2FA issues
 * - Error response handling with proper authErrorCategory mapping
 * - Both REFRESH_TOKEN and AUTH_STATUS_INACTIVE error categories
 *
 * Based on original dataDelivery OAuth tests but with batch fetching feature flag enabled.
 */

import { authHeader1, authHeader2 } from '../../maskedSecrets';
import {
  generateMetadata,
  generateProxyV1Payload,
  generateProxyV0Payload,
} from '../../../../testUtils';
import { defaultAccessToken } from '../../../../common/secrets';

const API_VERSION = 'v19';

const commonHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  'login-customer-id': 'logincustomerid',
};

const commonParams = {
  customerId: '1112223333',
  conversionActionId: 'customers/1112223333/conversionActions/848898416',
};

const commonRequestPayload = {
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

const commonRequestParameters = {
  headers: commonHeaders,
  params: commonParams,
  JSON: commonRequestPayload,
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
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/customerid/offlineUserDataJobs`,
          },
          metadataArray,
        ),
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
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
    },
  },
  {
    id: 'gaoc_v1_oauth_scenario_2',
    name: 'google_adwords_offline_conversions',
    description:
      '[Proxy v1 API] :: Oauth  where ACCESS_TOKEN_SCOPE_INSUFFICIENT error as mock response from destination',
    successCriteria:
      'Since the error from the destination is 403 - the proxy should return 403 with authErrorCategory as AUTH_STATUS_INACTIVE',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234/offlineUserDataJobs`,
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 403,
        body: {
          output: {
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
            message:
              '[Google Ads Offline Conversions]:: Request had insufficient authentication scopes during google_ads_offline_store_conversions Job Creation',
            response: [
              {
                error:
                  '[Google Ads Offline Conversions]:: Request had insufficient authentication scopes during google_ads_offline_store_conversions Job Creation',
                metadata: generateMetadata(1),
                statusCode: 403,
              },
            ],
            statTags: expectedStatTags,
            status: 403,
          },
        },
      },
    },
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
    },
  },
  {
    id: 'gaoc_v1_oauth_scenario_3',
    name: 'google_adwords_offline_conversions',
    description:
      "[Proxy v1 API] :: Oauth when the user doesn't enabled 2 factor authentication but the google ads account has it enabled",
    successCriteria: 'The proxy should return 401 with authErrorCategory as AUTH_STATUS_INACTIVE',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            headers: {
              Authorization: authHeader2,
              'Content-Type': 'application/json',
              'developer-token': 'test-developer-token-12345',
              'login-customer-id': 'logincustomerid',
            },
            endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/customerid/offlineUserDataJobs`,
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
            message:
              '[Google Ads Offline Conversions]:: Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project. during google_ads_offline_store_conversions Job Creation',
            response: [
              {
                error:
                  '[Google Ads Offline Conversions]:: Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project. during google_ads_offline_store_conversions Job Creation',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                statusCode: 401,
              },
            ],
            statTags: {
              destType: 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 401,
          },
        },
      },
    },
    envOverrides: {
      GAOC_ENABLE_BATCH_FETCHING: 'true',
    },
  },
];
