import { secret1, secret3 } from '../maskedSecrets';
import {
  generateGoogleOAuthMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';

export const commonHeaders = {};

export const commonParams = {
  developerToken: 'dummy-dev-token',
  accessToken: secret1,
  destination: 'google_adwords_remarketing_lists',
  listId: '709078448',
  customerId: '7693729833',
  consent: { adPersonalization: 'UNSPECIFIED', adUserData: 'UNSPECIFIED' },
  loginCustomerId: '',
};

export const validRequestPayload1 = {
  enablePartialFailure: true,
  operations: [
    {
      create: {
        userIdentifiers: [
          {
            hashedEmail: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
          },
          {
            hashedPhoneNumber: '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
          },
          {
            hashedEmail: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
          },
          {
            hashedPhoneNumber: '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
          },
          {
            addressInfo: {
              hashedFirstName: 'e56d336922eaab3be8c1244dbaa713e134a8eba50ddbd4f50fd2fe18d72595cd',
            },
          },
        ],
      },
    },
  ],
};

const validRequestPayload2 = {
  enablePartialFailure: true,
  operations: [
    {
      remove: {
        userIdentifiers: [
          {
            hashedEmail: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
          },
          {
            hashedPhoneNumber: '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
          },
          {
            hashedEmail: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
          },
          {
            hashedPhoneNumber: '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
          },
          {
            addressInfo: {
              hashedFirstName: 'e56d336922eaab3be8c1244dbaa713e134a8eba50ddbd4f50fd2fe18d72595cd',
            },
          },
        ],
      },
    },
  ],
};

const invalidArgumentRequestPayload = {
  enablePartialFailure: true,
  operations: [
    {
      create: {
        userIdentifiers: [
          {
            hashedEmail: 'abcd@testmail.com',
          },
        ],
      },
    },
  ],
};

const metadataArray = [generateGoogleOAuthMetadata(1)];

export const expectedStatTags = {
  destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

export const testScenariosForV0API = [
  {
    id: 'garl_v0_scenario_1',
    name: 'google_adwords_remarketing_lists',
    description:
      '[Proxy v0 API] :: Test for a valid request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: commonHeaders,
          params: commonParams,
          JSON: validRequestPayload1,
          endpoint: ``,
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
            message: 'Request Processed Successfully',
            destinationResponse: { response: '', status: 200 },
          },
        },
      },
    },
  },
  {
    id: 'garl_v0_scenario_2',
    name: 'google_adwords_remarketing_lists',
    description:
      '[Proxy v0 API] :: Test for a invalid argument request with a 400 response from the destination',
    successCriteria: 'Should return 400 with invalid argument error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: commonHeaders,
          params: { ...commonParams, customerId: '7693729834' },
          JSON: invalidArgumentRequestPayload,
          endpoint: ``,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              '{"error":{"code":400,"details":[{"@type":"type.googleapis.com/google.ads.googleads.v9.errors.GoogleAdsFailure","errors":[{"errorCode":{"offlineUserDataJobError":"INVALID_SHA256_FORMAT"},"message":"The SHA256 encoded value is malformed.","location":{"fieldPathElements":[{"fieldName":"operations","index":0},{"fieldName":"remove"},{"fieldName":"user_identifiers","index":0},{"fieldName":"hashed_email"}]}}]}],"message":"Request contains an invalid argument.","status":"INVALID_ARGUMENT"}} during ga_audience response transformation',
            destinationResponse: {
              error: {
                code: 400,
                details: [
                  {
                    '@type': 'type.googleapis.com/google.ads.googleads.v9.errors.GoogleAdsFailure',
                    errors: [
                      {
                        errorCode: {
                          offlineUserDataJobError: 'INVALID_SHA256_FORMAT',
                        },
                        message: 'The SHA256 encoded value is malformed.',
                        location: {
                          fieldPathElements: [
                            { fieldName: 'operations', index: 0 },
                            { fieldName: 'remove' },
                            { fieldName: 'user_identifiers', index: 0 },
                            { fieldName: 'hashed_email' },
                          ],
                        },
                      },
                    ],
                  },
                ],
                message: 'Request contains an invalid argument.',
                status: 'INVALID_ARGUMENT',
              },
            },
            statTags: expectedStatTags,
          },
        },
      },
    },
  },
  {
    id: 'garl_v0_scenario_3',
    name: 'google_adwords_remarketing_lists',
    description:
      '[Proxy v0 API] :: Test for a valid request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: commonHeaders,
          params: commonParams,
          JSON: validRequestPayload2,
          endpoint: ``,
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
            message: 'Request Processed Successfully',
            destinationResponse: { response: '', status: 200 },
          },
        },
      },
    },
  },
];

export const testScenariosForV1API = [
  {
    id: 'garl_v1_scenario_1',
    name: 'google_adwords_remarketing_lists',
    description:
      '[Proxy v1 API] :: Test for a valid request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: commonHeaders,
            params: commonParams,
            JSON: validRequestPayload1,
            endpoint: ``,
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request Processed Successfully',
            response: [
              {
                error: '""',
                metadata: generateGoogleOAuthMetadata(1),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
  },
  {
    id: 'garl_v1_scenario_2',
    name: 'google_adwords_remarketing_lists',
    description:
      '[Proxy v1 API] :: Test for a invalid argument request with a 400 response from the destination',
    successCriteria: 'Should return 400 with invalid argument error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: commonHeaders,
            params: { ...commonParams, customerId: '7693729834' },
            JSON: invalidArgumentRequestPayload,
            endpoint: ``,
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              '{"error":{"code":400,"details":[{"@type":"type.googleapis.com/google.ads.googleads.v9.errors.GoogleAdsFailure","errors":[{"errorCode":{"offlineUserDataJobError":"INVALID_SHA256_FORMAT"},"message":"The SHA256 encoded value is malformed.","location":{"fieldPathElements":[{"fieldName":"operations","index":0},{"fieldName":"remove"},{"fieldName":"user_identifiers","index":0},{"fieldName":"hashed_email"}]}}]}],"message":"Request contains an invalid argument.","status":"INVALID_ARGUMENT"}} during ga_audience response transformation',
            response: [
              {
                error:
                  '{"error":{"code":400,"details":[{"@type":"type.googleapis.com/google.ads.googleads.v9.errors.GoogleAdsFailure","errors":[{"errorCode":{"offlineUserDataJobError":"INVALID_SHA256_FORMAT"},"message":"The SHA256 encoded value is malformed.","location":{"fieldPathElements":[{"fieldName":"operations","index":0},{"fieldName":"remove"},{"fieldName":"user_identifiers","index":0},{"fieldName":"hashed_email"}]}}]}],"message":"Request contains an invalid argument.","status":"INVALID_ARGUMENT"}} during ga_audience response transformation',
                metadata: generateGoogleOAuthMetadata(1),
                statusCode: 400,
              },
            ],
            statTags: expectedStatTags,
            status: 400,
          },
        },
      },
    },
  },
  {
    id: 'garl_v1_scenario_3',
    name: 'google_adwords_remarketing_lists',
    description:
      '[Proxy v1 API] :: Test for a valid request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: commonHeaders,
            params: commonParams,
            JSON: validRequestPayload2,
            endpoint: ``,
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request Processed Successfully',
            response: [
              {
                error: '""',
                metadata: generateGoogleOAuthMetadata(1),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
  },
  {
    id: 'garl_v1_scenario_4',
    name: 'google_adwords_remarketing_lists',
    description:
      '[Proxy v1 API] :: getting concurrent_modification error code while sending request to GA audience API',
    successCriteria: 'Should return 500 with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: commonHeaders,
            params: { ...commonParams, customerId: 'wrongCustomerId' },
            JSON: validRequestPayload2,
            endpoint: '',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              '{"error":{"code":400,"message":"Request contains an invalid argument.","status":"INVALID_ARGUMENT","details":[{"@type":"type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure","errors":[{"errorCode":{"databaseError":"CONCURRENT_MODIFICATION"},"message":"Multiple requests were attempting to modify the same resource at once. Retry the request."}],"requestId":"08X6xmM1WJPf_lW1ppYfsA"}]}} during ga_audience response transformation',
            response: [
              {
                error:
                  '{"error":{"code":400,"message":"Request contains an invalid argument.","status":"INVALID_ARGUMENT","details":[{"@type":"type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure","errors":[{"errorCode":{"databaseError":"CONCURRENT_MODIFICATION"},"message":"Multiple requests were attempting to modify the same resource at once. Retry the request."}],"requestId":"08X6xmM1WJPf_lW1ppYfsA"}]}} during ga_audience response transformation',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {
                    access_token: secret3,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                statusCode: 500,
              },
            ],
            statTags: {
              destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 500,
          },
        },
      },
    },
  },
  {
    id: 'garl_v1_scenario_5',
    name: 'google_adwords_remarketing_lists',
    description: '[Proxy v1 API] :: handle partial failure when addOperations throw error',
    successCriteria: 'Should return 400 with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: commonHeaders,
            params: { ...commonParams, customerId: '7693729835' },
            JSON: validRequestPayload1,
            endpoint: '',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              '[Google Ads Re-marketing Lists]:: partialFailureError - {\"code\":3,\"message\":\"Partial failure occurred. Check errors for details.\",\"details\":[{\"@type\":\"type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure\",\"errors\":[{\"message\":\"UserIdentifierError.INVALID_EMAIL\",\"location\":{\"fieldPathElements\":[{\"fieldName\":\"operations\",\"index\":0},{\"fieldName\":\"create\"},{\"fieldName\":\"userIdentifiers\"},{\"fieldName\":\"hashedEmail\"}]},\"errorCode\":{\"userIdentifierError\":\"INVALID_EMAIL\"}}]}]}',
            response: [
              {
                error:
                  '[Google Ads Re-marketing Lists]:: partialFailureError - {\"code\":3,\"message\":\"Partial failure occurred. Check errors for details.\",\"details\":[{\"@type\":\"type.googleapis.com/google.ads.googleads.v16.errors.GoogleAdsFailure\",\"errors\":[{\"message\":\"UserIdentifierError.INVALID_EMAIL\",\"location\":{\"fieldPathElements\":[{\"fieldName\":\"operations\",\"index\":0},{\"fieldName\":\"create\"},{\"fieldName\":\"userIdentifiers\"},{\"fieldName\":\"hashedEmail\"}]},\"errorCode\":{\"userIdentifierError\":\"INVALID_EMAIL\"}}]}]}',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {
                    access_token: secret3,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                statusCode: 400,
              },
            ],
            statTags: {
              destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 400,
          },
        },
      },
    },
  },
];
