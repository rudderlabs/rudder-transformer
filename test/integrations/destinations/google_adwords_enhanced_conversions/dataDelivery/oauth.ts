import { API_VERSION } from '../../../../../src/v0/destinations/google_adwords_enhanced_conversions/config';
import {
  generateProxyV1Payload,
  generateProxyV0Payload,
  generateMetadata,
} from '../../../testUtils';

const requestPayload = {
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

const headers = {
  Authorization: 'Bearer abcd1234',
  'Content-Type': 'application/json',
  'developer-token': 'ijkl91011',
  'login-customer-id': '0987654321',
};

const params = {
  event: 'Product Added',
  customerId: '1234567890',
  destination: 'google_adwords_enhanced_conversions',
};

const commonRequestParameters = {
  params,
  headers,
  JSON: requestPayload,
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

export const v0oauthScenarios = [
  {
    id: 'gaec_v0_oauth_scenario_1',
    name: 'google_adwords_enhanced_conversions',
    description:
      '[Proxy v0 API] :: Oauth  where valid credentials are missing as mock response from destination',
    successCriteria:
      'Since the error from the destination is 401 - the proxy should return 500 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567890:uploadConversionAdjustments`,
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
            message:
              '""Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project." during Google_adwords_enhanced_conversions response transformation"',
            statTags: expectedStatTags,
            status: 401,
          },
        },
      },
    },
  },
  {
    id: 'gaec_v0_oauth_scenario_2',
    name: 'google_adwords_enhanced_conversions',
    description:
      '[Proxy v0 API] :: Oauth  where caller does not have permission mock response from destination',
    successCriteria:
      'Since the error from the destination is 403 - the proxy should return 403 with error',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          JSON: {
            query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Product Added'`,
          },
          headers,
          params: {
            event: 'Product Added',
            customerId: '1234567910',
            destination: 'google_adwords_enhanced_conversions',
          },
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567910/googleAds:searchStream`,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 403,
        body: {
          output: {
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
            destinationResponse: [
              {
                error: {
                  code: 403,
                  errors: [
                    {
                      domain: 'global',
                      message: 'The caller does not have permission',
                      reason: 'forbidden',
                    },
                  ],
                  message: 'The caller does not have permission',
                  status: 'PERMISSION_DENIED',
                },
              },
            ],
            message:
              '""The caller does not have permission" during Google_adwords_enhanced_conversions response transformation"',
            statTags: expectedStatTags,
            status: 403,
          },
        },
      },
    },
  },
];

export const v1oauthScenarios = [
  {
    id: 'gaec_v1_oauth_scenario_1',
    name: 'google_adwords_enhanced_conversions',
    description:
      '[Proxy v1 API] :: Oauth  where valid credentials are missing as mock response from destination',
    successCriteria:
      'Since the error from the destination is 401 - the proxy should return 500 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567890:uploadConversionAdjustments`,
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
              '""Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project." during Google_adwords_enhanced_conversions response transformation"',
            response: [
              {
                error:
                  '""Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project." during Google_adwords_enhanced_conversions response transformation"',
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
    id: 'gaec_v1_oauth_scenario_2',
    name: 'google_adwords_enhanced_conversions',
    description:
      '[Proxy v1 API] :: Oauth  where caller does not have permission mock response from destination',
    successCriteria:
      'Since the error from the destination is 403 - the proxy should return 403 with error',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: {
            query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Product Added'`,
          },
          headers,
          params: {
            event: 'Product Added',
            customerId: '1234567910',
            destination: 'google_adwords_enhanced_conversions',
          },
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/1234567910/googleAds:searchStream`,
        }),
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
              '""The caller does not have permission" during Google_adwords_enhanced_conversions response transformation"',
            response: [
              {
                error:
                  '""The caller does not have permission" during Google_adwords_enhanced_conversions response transformation"',
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
  },
];
