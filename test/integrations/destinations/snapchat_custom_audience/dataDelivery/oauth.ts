import { ProxyV1TestData } from '../../../testTypes';
import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';
import { authHeader1 } from '../maskedSecrets';

const commonHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  'User-Agent': 'RudderLabs',
};

const commonRequestParameters = {
  headers: commonHeaders,
  JSON: {
    users: [
      {
        schema: ['EMAIL_SHA256'],
        data: [['938758751f5af66652a118e26503af824404bc13acd1cb7642ddff99916f0e1c']],
      },
    ],
  },
};

const retryStatTags = {
  destType: 'SNAPCHAT_CUSTOM_AUDIENCE',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'retryable',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

const abortStatTags = {
  destType: 'SNAPCHAT_CUSTOM_AUDIENCE',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

export const v0OauthScenarios = [
  {
    id: 'snapchat_custom_audience_v0_oauth_scenario_2',
    name: 'snapchat_custom_audience',
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
          endpoint: 'https://adsapi.snapchat.com/v1/segments/456/users',
          params: {
            destination: 'snapchat_custom_audience',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            destinationResponse: {
              response: 'unauthorized',
              status: 401,
            },
            message:
              'Failed with unauthorized during snapchat_custom_audience response transformation',
            statTags: retryStatTags,
            authErrorCategory: 'REFRESH_TOKEN',
          },
        },
      },
    },
  },
  {
    id: 'snapchat_custom_audience_v0_oauth_scenario_3',
    name: 'snapchat_custom_audience',
    description:
      '[Proxy v0 API] :: Oauth  where ACCESS_TOKEN_SCOPE_INSUFFICIENT error as mock response from destination',
    successCriteria:
      'Since the error from the destination is 403 - the proxy should return 500 with authErrorCategory as AUTH_STATUS_INACTIVE',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://adsapi.snapchat.com/v1/segments/999/users',
          params: {
            destination: 'snapchat_custom_audience',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
            status: 400,
            destinationResponse: {
              response: {
                request_status: 'ERROR',
                request_id: '98e2a602-3cf4-4596-a8f9-7f034161f89a',
                debug_message: 'Caller does not have permission',
                display_message:
                  "We're sorry, but the requested resource is not available at this time",
                error_code: 'E3002',
              },
              status: 403,
            },
            message: 'undefined during snapchat_custom_audience response transformation',
            statTags: abortStatTags,
          },
        },
      },
    },
  },
];

export const v1OauthScenarios: ProxyV1TestData[] = [
  {
    id: 'snapchat_custom_audience_v1_oauth_scenario_1',
    name: 'snapchat_custom_audience',
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
          endpoint: 'https://adsapi.snapchat.com/v1/segments/456/users',
          params: {
            destination: 'snapchat_custom_audience',
          },
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
                error: '"unauthorized"',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: retryStatTags,
            authErrorCategory: 'REFRESH_TOKEN',
            message:
              'Failed with unauthorized during snapchat_custom_audience response transformation',
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'snapchat_custom_audience_v1_oauth_scenario_2',
    name: 'snapchat_custom_audience',
    description:
      '[Proxy v1 API] :: Oauth  where ACCESS_TOKEN_SCOPE_INSUFFICIENT error as mock response from destination',
    successCriteria:
      'Since the error from the destination is 403 - the proxy should return 500 with authErrorCategory as AUTH_STATUS_INACTIVE',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          endpoint: 'https://adsapi.snapchat.com/v1/segments/999/users',
          params: {
            destination: 'snapchat_custom_audience',
          },
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
                error: `{"request_status":"ERROR","request_id":"98e2a602-3cf4-4596-a8f9-7f034161f89a","debug_message":"Caller does not have permission","display_message":"We're sorry, but the requested resource is not available at this time","error_code":"E3002"}`,
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
            statTags: abortStatTags,
            message: 'undefined during snapchat_custom_audience response transformation',
            status: 400,
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
          },
        },
      },
    },
  },
];
