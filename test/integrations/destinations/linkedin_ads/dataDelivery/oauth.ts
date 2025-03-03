import {
  getAuthHeader_1,
  getSecret_1,
  getAuthHeader_2,
  getSecret_2,
  getAuthHeader_3,
  getSecret_3,
} from '../maskedSecrets';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';

export const testJSONData = {
  elements: [
    {
      conversion: 'urn:lla:llaPartnerConversion:23456',
      conversionHappenedAt: 1697241600000,
      conversionValue: {
        amount: '0',
        currencyCode: 'USD',
      },
      eventId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
      user: {
        userIds: [
          {
            idType: 'SHA256_EMAIL',
            idValue: 'abc@gmail.com',
          },
        ],
      },
    },
  ],
};
export const statTags = {
  destType: 'LINKEDIN_ADS',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

export const metadata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'default-userId',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  sourceId: 'default-sourceId',
  secret: {
    accessToken: getSecret_1(),
  },
  dontBatch: false,
};

export const headerBlockWithCorrectAccessToken = {
  Authorization: getAuthHeader_1(),
  'Content-Type': 'application/json',
  'LinkedIn-Version': '202409',
  'X-RestLi-Method': 'BATCH_CREATE',
  'X-Restli-Protocol-Version': '2.0.0',
};

const commonRequestParameters = {
  headers: headerBlockWithCorrectAccessToken,
  JSON: testJSONData,
};
const commonRequestParametersWithInvalidAccess = {
  headers: { ...headerBlockWithCorrectAccessToken, Authorization: getAuthHeader_2() },
  JSON: testJSONData,
  accessToken: getSecret_2(),
};

const commonRequestParametersWithRevokedAccess = {
  headers: { ...headerBlockWithCorrectAccessToken, Authorization: getAuthHeader_3() },
  JSON: testJSONData,
  accessToken: getSecret_3(),
};

export const oauthScenariosV1: ProxyV1TestData[] = [
  {
    id: 'linkedin_ads_v1_oauth_scenario_1',
    name: 'linkedin_ads',
    description: 'app event fails due to revoked access token error',
    successCriteria: 'Should return 400 with revoked access token error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://api.linkedin.com/rest/conversionEvents`,
          ...commonRequestParametersWithRevokedAccess,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            response: [
              {
                error:
                  '{"status":401,"serviceErrorCode":65601,"code":"REVOKED_ACCESS_TOKEN","message":"The token used in the request has been revoked by the user"}',
                statusCode: 400,
                metadata: { ...metadata, secret: { accessToken: getSecret_3() } },
              },
            ],
            statTags,
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
            message:
              'LinkedIn Conversion API: Error transformer proxy v1 during LinkedIn Conversion API response transformation. Invalid or expired access token. Retrying',
            status: 400,
          },
        },
      },
    },
  },
  {
    id: 'linkedin_ads_v1_oauth_scenario_2',
    name: 'linkedin_ads',
    description: 'app event fails due to invalid access token error',
    successCriteria: 'Should return 500 with invalid access token error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://api.linkedin.com/rest/conversionEvents`,
          ...commonRequestParametersWithInvalidAccess,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            response: [
              {
                error:
                  '{"status":401,"serviceErrorCode":65600,"code":"INVALID_ACCESS_TOKEN","message":"Invalid access token"}',
                statusCode: 500,
                metadata: { ...metadata, secret: { accessToken: getSecret_2() } },
              },
            ],
            statTags: { ...statTags, errorType: 'retryable' },
            authErrorCategory: 'REFRESH_TOKEN',
            message:
              'LinkedIn Conversion API: Error transformer proxy v1 during LinkedIn Conversion API response transformation. Invalid or expired access token. Retrying',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'linkedin_ads_v1_oauth_scenario_3',
    name: 'linkedin_ads',
    description: 'success case',
    successCriteria: 'Should return 200 response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://api.linkedin.com/rest/conversionEvents`,
          ...commonRequestParameters,
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
              '[LINKEDIN_CONVERSION_API Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                elements: [
                  {
                    status: 201,
                  },
                  {
                    status: 201,
                  },
                ],
              },
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
];
