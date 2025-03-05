import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload, generateProxyV0Payload } from '../../../testUtils';
import { defaultAccessToken } from '../../../common/secrets';
import { authHeader1 } from '../../am/maskedSecrets';
// Boilerplat data for the test cases
// ======================================

const commonHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
};

const encryptionInfo = {
  kind: 'dfareporting#encryptionInfo',
  encryptionSource: 'AD_SERVING',
  encryptionEntityId: '3564523',
  encryptionEntityType: 'DCM_ACCOUNT',
};

const testConversion1 = {
  timestampMicros: '1668624722000000',
  floodlightConfigurationId: '213123123',
  ordinal: '1',
  floodlightActivityId: '456543345245',
  value: 7,
  gclid: '123',
  limitAdTracking: true,
  childDirectedTreatment: true,
};

const testConversion2 = {
  timestampMicros: '1668624722000000',
  floodlightConfigurationId: '213123123',
  ordinal: '1',
  floodlightActivityId: '456543345245',
  value: 8,
  gclid: '321',
  limitAdTracking: true,
  childDirectedTreatment: true,
};

const commonRequestParameters = {
  headers: commonHeaders,
  JSON: {
    kind: 'dfareporting#conversionsBatchInsertRequest',
    encryptionInfo,
    conversions: [testConversion1, testConversion2],
  },
};

// Test scenarios for the test cases
// ===================================

export const v0oauthScenarios = [
  {
    id: 'cm360_v0_oauth_scenario_1',
    name: 'campaign_manager',
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
          endpoint: 'https://googleapis.com/test_url_for_credentials_missing',
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
            message:
              'Campaign Manager: Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project. during CAMPAIGN_MANAGER response transformation 3',
            destinationResponse: {
              response: {
                error: {
                  code: 401,
                  message:
                    'Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
                  errors: [
                    {
                      message: 'Login Required.',
                      domain: 'global',
                      reason: 'required',
                      location: 'Authorization',
                      locationType: 'header',
                    },
                  ],
                  status: 'UNAUTHENTICATED',
                  details: [
                    {
                      '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
                      reason: 'CREDENTIALS_MISSING',
                      domain: 'googleapis.com',
                      metadata: {
                        method: 'google.ads.xfa.op.v4.DfareportingConversions.Batchinsert',
                        service: 'googleapis.com',
                      },
                    },
                  ],
                },
              },
              status: 401,
            },
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            authErrorCategory: 'REFRESH_TOKEN',
          },
        },
      },
    },
  },
  {
    id: 'cm360_v0_oauth_scenario_2',
    name: 'campaign_manager',
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
          endpoint: 'https://googleapis.com/test_url_for_access_token_scope_insufficient',
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
            message:
              'Campaign Manager: Request had insufficient authentication scopes. during CAMPAIGN_MANAGER response transformation 3',
            destinationResponse: {
              response: {
                error: {
                  code: 403,
                  message: 'Request had insufficient authentication scopes.',
                  errors: [
                    {
                      message: 'Insufficient Permission',
                      domain: 'global',
                      reason: 'insufficientPermissions',
                    },
                  ],
                  status: 'PERMISSION_DENIED',
                  details: [
                    {
                      '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
                      reason: 'ACCESS_TOKEN_SCOPE_INSUFFICIENT',
                      domain: 'googleapis.com',
                      metadata: {
                        service: 'gmail.googleapis.com',
                        method: 'caribou.api.proto.MailboxService.GetProfile',
                      },
                    },
                  ],
                },
              },
              status: 403,
            },
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
          },
        },
      },
    },
  },
  {
    id: 'cm360_v0_oauth_scenario_3',
    name: 'campaign_manager',
    description:
      '[Proxy v0 API] :: Oauth  where google.auth.exceptions.RefreshError invalid_grant error as mock response from destination',
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
          endpoint: 'https://googleapis.com/test_url_for_invalid_grant',
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
            message:
              'Campaign Manager: invalid_grant during CAMPAIGN_MANAGER response transformation 3',
            destinationResponse: {
              response: {
                error: {
                  code: 403,
                  message: 'invalid_grant',
                  error_description: 'Bad accesss',
                },
              },
              status: 403,
            },
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
          },
        },
      },
    },
  },
  {
    id: 'cm360_v0_oauth_scenario_4',
    name: 'campaign_manager',
    description:
      '[Proxy v0 API] :: Oauth  where google.auth.exceptions.RefreshError refresh error as mock response from destination',
    successCriteria: 'Should return 500 with authErrorCategory as AUTH_STATUS_INACTIVE',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://googleapis.com/test_url_for_refresh_error',
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
            message:
              'Campaign Manager: undefined during CAMPAIGN_MANAGER response transformation 3',
            destinationResponse: {
              response: {
                error: 'unauthorized',
                error_description: 'Access token expired: 2020-10-20T12:00:00.000Z',
              },
              status: 401,
            },
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            authErrorCategory: 'REFRESH_TOKEN',
          },
        },
      },
    },
  },
];

export const v1oauthScenarios: ProxyV1TestData[] = [
  {
    id: 'cm360_v1_oauth_scenario_1',
    name: 'campaign_manager',
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
          endpoint: 'https://googleapis.com/test_url_for_credentials_missing',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            response: [
              {
                error: JSON.stringify({
                  error: {
                    code: 401,
                    message:
                      'Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
                    errors: [
                      {
                        message: 'Login Required.',
                        domain: 'global',
                        reason: 'required',
                        location: 'Authorization',
                        locationType: 'header',
                      },
                    ],
                    status: 'UNAUTHENTICATED',
                    details: [
                      {
                        '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
                        reason: 'CREDENTIALS_MISSING',
                        domain: 'googleapis.com',
                        metadata: {
                          method: 'google.ads.xfa.op.v4.DfareportingConversions.Batchinsert',
                          service: 'googleapis.com',
                        },
                      },
                    ],
                  },
                }),
                statusCode: 401,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'default-workspaceId',
                  sourceId: 'default-sourceId',
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  dontBatch: false,
                },
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            authErrorCategory: 'REFRESH_TOKEN',
            message:
              'Campaign Manager: Error transformer proxy v1 during CAMPAIGN_MANAGER response transformation',
            status: 401,
          },
        },
      },
    },
  },
  {
    id: 'cm360_v1_oauth_scenario_2',
    name: 'campaign_manager',
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
          endpoint: 'https://googleapis.com/test_url_for_access_token_scope_insufficient',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 403,
        body: {
          output: {
            response: [
              {
                error: JSON.stringify({
                  error: {
                    code: 403,
                    message: 'Request had insufficient authentication scopes.',
                    errors: [
                      {
                        message: 'Insufficient Permission',
                        domain: 'global',
                        reason: 'insufficientPermissions',
                      },
                    ],
                    status: 'PERMISSION_DENIED',
                    details: [
                      {
                        '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
                        reason: 'ACCESS_TOKEN_SCOPE_INSUFFICIENT',
                        domain: 'googleapis.com',
                        metadata: {
                          service: 'gmail.googleapis.com',
                          method: 'caribou.api.proto.MailboxService.GetProfile',
                        },
                      },
                    ],
                  },
                }),
                statusCode: 403,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'default-workspaceId',
                  sourceId: 'default-sourceId',
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  dontBatch: false,
                },
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
            message:
              'Campaign Manager: Error transformer proxy v1 during CAMPAIGN_MANAGER response transformation',
            status: 403,
          },
        },
      },
    },
  },
  {
    id: 'cm360_v1_oauth_scenario_3',
    name: 'campaign_manager',
    description:
      '[Proxy v1 API] :: Oauth  where google.auth.exceptions.RefreshError invalid_grant error as mock response from destination',
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
          endpoint: 'https://googleapis.com/test_url_for_invalid_grant',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 403,
        body: {
          output: {
            response: [
              {
                error: JSON.stringify({
                  error: { code: 403, message: 'invalid_grant', error_description: 'Bad accesss' },
                }),
                statusCode: 403,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'default-workspaceId',
                  sourceId: 'default-sourceId',
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  dontBatch: false,
                },
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            authErrorCategory: 'AUTH_STATUS_INACTIVE',
            message:
              'Campaign Manager: Error transformer proxy v1 during CAMPAIGN_MANAGER response transformation',
            status: 403,
          },
        },
      },
    },
  },
  {
    id: 'cm360_v1_oauth_scenario_4',
    name: 'campaign_manager',
    description:
      '[Proxy v1 API] :: Oauth  where google.auth.exceptions.RefreshError refresh error as mock response from destination',
    successCriteria: 'Should return 500 with authErrorCategory as AUTH_STATUS_INACTIVE',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          endpoint: 'https://googleapis.com/test_url_for_refresh_error',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            response: [
              {
                error: JSON.stringify({
                  error: 'unauthorized',
                  error_description: 'Access token expired: 2020-10-20T12:00:00.000Z',
                }),
                statusCode: 401,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'default-workspaceId',
                  sourceId: 'default-sourceId',
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  dontBatch: false,
                },
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            authErrorCategory: 'REFRESH_TOKEN',
            message:
              'Campaign Manager: Error transformer proxy v1 during CAMPAIGN_MANAGER response transformation',
            status: 401,
          },
        },
      },
    },
  },
];
