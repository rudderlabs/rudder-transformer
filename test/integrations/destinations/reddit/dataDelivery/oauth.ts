import { authHeader1 } from '../maskedSecrets';
import {
  generateMetadata,
  generateProxyV1Payload,
  generateProxyV0Payload,
} from '../../../testUtils';

const authorizationRequiredRequestPayload = {
  events: [
    {
      event_at: '2019-10-14T09:03:17.562Z',
      event_type: {
        tracking_type: 'ViewContent',
      },
      user: {
        aaid: 'c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a',
        email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
        external_id: '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
        ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
        user_agent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
        screen_dimensions: {},
      },
      event_metadata: {
        item_count: 3,
        products: [
          {
            id: '123',
            name: 'Monopoly',
            category: 'Games',
          },
          {
            id: '345',
            name: 'UNO',
            category: 'Games',
          },
        ],
      },
    },
  ],
};

const commonHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
};

const commonRequestParameters = {
  headers: commonHeaders,
  JSON: authorizationRequiredRequestPayload,
};

const expectedStatTags = {
  destType: 'REDDIT',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'retryable',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

export const v0oauthScenarios = [
  {
    id: 'reddit_v0_oauth_scenario_1',
    name: 'reddit',
    description: '[Proxy v0 API] :: Oauth where Authorization Required response from destination',
    successCriteria: 'Should return 500 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_gsddXXXfsfd',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            destinationResponse: {
              response: 'Authorization Required',
              status: 401,
            },
            message:
              '[Generic Response Handler] Request failed for destination reddit with status: 401',
            statTags: { ...expectedStatTags, errorType: 'aborted' },
            status: 401,
          },
        },
      },
    },
  },
  {
    id: 'reddit_v0_oauth_scenario_2',
    name: 'reddit',
    description: '[Proxy v0 API] :: Oauth where error response is an object from destination',
    successCriteria: 'Should return 401 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_objResp_401',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            destinationResponse: {
              response: {
                success: false,
                error: {
                  reason: 'UNAUTHORIZED',
                  explanation:
                    'This server could not verify that you are authorized to access the document you requested.',
                },
              },
              status: 401,
            },
            message:
              '[Generic Response Handler] Request failed for destination reddit with status: 401',
            statTags: { ...expectedStatTags, errorType: 'aborted' },
            status: 401,
          },
        },
      },
    },
  },
];

export const v1oauthScenarios = [
  {
    id: 'reddit_v1_oauth_scenario_1',
    name: 'reddit',
    description: '[Proxy v1 API] :: Oauth where Authorization Required response from destination',
    successCriteria: 'Should return 500 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_gsddXXXfsfd',
          },
          [generateMetadata(1)],
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
              'Request failed due to Authorization Required during reddit response transformation',
            response: [
              {
                error: '"Authorization Required"',
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
    id: 'reddit_v1_oauth_scenario_2',
    name: 'reddit',
    description: '[Proxy v1 API] :: Oauth where error response is an object from destination',
    successCriteria: 'Should return 401 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_objResp_401',
          },
          [generateMetadata(1)],
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
              'This server could not verify that you are authorized to access the document you requested. during reddit response transformation',
            response: [
              {
                error: JSON.stringify({
                  success: false,
                  error: {
                    reason: 'UNAUTHORIZED',
                    explanation:
                      'This server could not verify that you are authorized to access the document you requested.',
                  },
                }),
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
