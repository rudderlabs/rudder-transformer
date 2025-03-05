import { authHeader2, secret2, secret1 } from '../maskedSecrets';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { commonHeaders, commonParams, validRequestPayload1 } from './business';

const API_VERSION = 'v18';

const commonStatTags = {
  destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

export const oauthError = [
  {
    id: 'garl_oauth_scenario',
    name: 'google_adwords_remarketing_lists',
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
          headers: commonHeaders,
          params: commonParams,
          JSON: validRequestPayload1,
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/customerid/offlineUserDataJobs`,
          accessToken: secret1,
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
              '{"error":{"code":401,"message":"Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.","status":"UNAUTHENTICATED"}} during ga_audience response transformation',
            response: [
              {
                error:
                  '{"error":{"code":401,"message":"Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.","status":"UNAUTHENTICATED"}} during ga_audience response transformation',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {
                    accessToken: secret1,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                statusCode: 401,
              },
            ],
            statTags: commonStatTags,
            status: 401,
          },
        },
      },
    },
  },
  {
    id: 'garl_oauth_scenario_with_wrong_customer_id',
    name: 'google_adwords_remarketing_lists',
    description: '[Proxy v1 API] :: Oauth  where customer has provided wrong customerId',
    successCriteria: 'The proxy should return 401 with authErrorCategory as AUTH_STATUS_INACTIVE',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          headers: { ...commonHeaders, Authorization: authHeader2 },
          params: { ...commonParams, customerId: secret2 },
          JSON: validRequestPayload1,
          endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/customerid/offlineUserDataJobs`,
          accessToken: secret2,
        }),
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
              '{"error":{"code":401,"message":"Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.","status":"UNAUTHENTICATED","details":[{"@type":"type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure","errors":[{"errorCode":{"authenticationError":"CUSTOMER_NOT_FOUND"},"message":"No customer found for the provided customer id."}],"requestId":"lvB3KOjGHsgduHjt0wCglQ"}]}} during ga_audience response transformation',
            response: [
              {
                error:
                  '{"error":{"code":401,"message":"Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.","status":"UNAUTHENTICATED","details":[{"@type":"type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure","errors":[{"errorCode":{"authenticationError":"CUSTOMER_NOT_FOUND"},"message":"No customer found for the provided customer id."}],"requestId":"lvB3KOjGHsgduHjt0wCglQ"}]}} during ga_audience response transformation',
                metadata: { ...generateMetadata(1), secret: { accessToken: secret2 } },
                statusCode: 401,
              },
            ],
            statTags: commonStatTags,
            status: 401,
          },
        },
      },
    },
  },
];
