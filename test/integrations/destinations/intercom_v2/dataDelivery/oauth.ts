import { secret1 } from '../maskedSecrets';
import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { headers, headersWithRevokedAccessToken, RouterNetworkErrorStatTags } from '../common';

const commonRequestParameters = {
  endpoint: `https://api.intercom.io/events`,
  JSON: {
    created_at: 1700628164,
    email: 'test@rudderlabs.com',
    event_name: 'Product Viewed',
    metadata: {
      price: {
        amount: 3000,
        currency: 'USD',
      },
      revenue: {
        amount: 1232,
        currency: 'inr',
        test: 123,
      },
    },
    user_id: 'user-id-1',
  },
};

export const oauthScenariosV0 = [
  {
    id: 'INTERCOM_V2_v0_oauth_scenario_1',
    name: 'intercom_v2',
    description: '[Proxy v0 API] :: [oauth] app event fails due to revoked access token',
    successCriteria: 'Should return 400 with revoked access token error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          headers: headersWithRevokedAccessToken,
          accessToken: secret1,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: {
              response: {
                errors: [
                  {
                    code: 'unauthorized',
                    message: 'Access Token Invalid',
                  },
                ],
                request_id: 'request_id-1',
                type: 'error.list',
              },
              status: 401,
            },
            statTags: {
              ...RouterNetworkErrorStatTags,
              feature: 'dataDelivery',
            },
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 401. {"type":"error.list","request_id":"request_id-1","errors":[{"code":"unauthorized","message":"Access Token Invalid"}]}',
            status: 400,
          },
        },
      },
    },
  },
  {
    id: 'INTERCOM_V2_v0_oauth_scenario_2',
    name: 'intercom_v2',
    description: '[Proxy v0 API] :: [oauth] success case',
    successCriteria: 'Should return 200 response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          headers,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 202,
            message: 'Request Processed Successfully',
            destinationResponse: '',
          },
        },
      },
    },
  },
];

export const oauthScenariosV1: ProxyV1TestData[] = [
  {
    id: 'INTERCOM_V2_v1_oauth_scenario_1',
    name: 'intercom_v2',
    description: '[Proxy v1 API] :: [oauth] app event fails due to revoked access token',
    successCriteria: 'Should return 400 with revoked access token error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          headers: headersWithRevokedAccessToken,
          accessToken: secret1,
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
                error: JSON.stringify({
                  type: 'error.list',
                  request_id: 'request_id-1',
                  errors: [{ code: 'unauthorized', message: 'Access Token Invalid' }],
                }),
                statusCode: 400,
                metadata: {
                  ...generateMetadata(1),
                  secret: { accessToken: secret1 },
                },
              },
            ],
            statTags: {
              ...RouterNetworkErrorStatTags,
              feature: 'dataDelivery',
            },
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 401. {"type":"error.list","request_id":"request_id-1","errors":[{"code":"unauthorized","message":"Access Token Invalid"}]}',
            status: 400,
          },
        },
      },
    },
  },
  {
    id: 'INTERCOM_V2_v1_oauth_scenario_2',
    name: 'intercom_v2',
    description: '[Proxy v1 API] :: [oauth] success case',
    successCriteria: 'Should return 200 response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          headers,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 202,
            message: 'Request Processed Successfully',
            response: [
              {
                statusCode: 202,
                metadata: generateMetadata(1),
                error: '""',
              },
            ],
          },
        },
      },
    },
  },
];
