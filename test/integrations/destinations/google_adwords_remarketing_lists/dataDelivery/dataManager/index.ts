import { generateProxyV1Payload, generateGoogleOAuthMetadata } from '../../../../testUtils';
import { authHeader4, secret4 } from '../../maskedSecrets';

const DM_INGEST_ENDPOINT = 'https://datamanager.googleapis.com/v1/audienceMembers:ingest';
const DM_REMOVE_ENDPOINT = 'https://datamanager.googleapis.com/v1/audienceMembers:remove';

const DM_WORKSPACE_ID = 'dm-enabled-workspaceId';

const dmHeaders = {
  Authorization: authHeader4,
  'Content-Type': 'application/json',
};

const generateDMMetadata = (jobId: number) => ({
  ...generateGoogleOAuthMetadata(jobId),
  workspaceId: DM_WORKSPACE_ID,
  secret: { access_token: secret4 },
});

const dmDestination = {
  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
  productDestinationId: '7090784486',
};

const validMember = {
  userData: {
    userIdentifiers: [
      { emailAddress: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05' },
      { phoneNumber: '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f' },
    ],
  },
};

const validIngestPayload = {
  destinations: [dmDestination],
  audienceMembers: [validMember],
  encoding: 'HEX',
  termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
};

const validRemovePayload = {
  destinations: [dmDestination],
  audienceMembers: [validMember],
  encoding: 'HEX',
};

const commonStatTags = {
  destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: DM_WORKSPACE_ID,
};

const metadataArray = [generateDMMetadata(1)];

export const dmDataDeliveryTests = [
  // ── 1. Ingest 200 success ─────────────────────────────────────────────────────
  {
    id: 'garl-dm-delivery-01',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API Proxy v1] :: audienceMembers:ingest — 200 success',
    successCriteria: 'Should return 200 with requestId in destinationResponse',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: dmHeaders,
            params: {},
            JSON: validIngestPayload,
            endpoint: DM_INGEST_ENDPOINT,
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
                error: '{"requestId":"dm-ingest-req-id-001"}',
                metadata: generateDMMetadata(1),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
  },

  // ── 2. Remove 200 success ─────────────────────────────────────────────────────
  {
    id: 'garl-dm-delivery-02',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API Proxy v1] :: audienceMembers:remove — 200 success',
    successCriteria: 'Should return 200 with requestId in destinationResponse',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: dmHeaders,
            params: {},
            JSON: validRemovePayload,
            endpoint: DM_REMOVE_ENDPOINT,
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
                error: '{"requestId":"dm-remove-req-id-001"}',
                metadata: generateDMMetadata(1),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
  },

  // ── 3. 400 INVALID_ARGUMENT → aborted ─────────────────────────────────────────
  {
    id: 'garl-dm-delivery-03',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API Proxy v1] :: audienceMembers:ingest — 400 INVALID_ARGUMENT → aborted',
    successCriteria: 'Should return 400 with errorType aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: dmHeaders,
            params: {},
            JSON: {
              destinations: [
                {
                  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                  productDestinationId: 'invalid-audience-id',
                },
              ],
              audienceMembers: [{ userData: { userIdentifiers: [{ emailAddress: 'bad-email' }] } }],
              encoding: 'HEX',
              termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
            },
            endpoint: DM_INGEST_ENDPOINT,
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
              '[Google Ads Remarketing Lists DM API] {"error":{"code":400,"message":"There was a problem with the request.","status":"INVALID_ARGUMENT","details":[{"@type":"type.googleapis.com/google.rpc.ErrorInfo","reason":"INVALID_ARGUMENT","domain":"datamanager.googleapis.com","metadata":{"requestId":"t-59f8b5bc-d4da-4d55-bf2b-0c6215a21b67"}},{"@type":"type.googleapis.com/google.rpc.RequestInfo","requestId":"t-59f8b5bc-d4da-4d55-bf2b-0c6215a21b67"},{"@type":"type.googleapis.com/google.rpc.BadRequest","fieldViolations":[{"field":"audience_members[0]","description":"Type of the user list is not applicable for this request.","reason":"INVALID_USER_LIST_TYPE"}]}]}}',
            response: [
              {
                error:
                  '[Google Ads Remarketing Lists DM API] {"error":{"code":400,"message":"There was a problem with the request.","status":"INVALID_ARGUMENT","details":[{"@type":"type.googleapis.com/google.rpc.ErrorInfo","reason":"INVALID_ARGUMENT","domain":"datamanager.googleapis.com","metadata":{"requestId":"t-59f8b5bc-d4da-4d55-bf2b-0c6215a21b67"}},{"@type":"type.googleapis.com/google.rpc.RequestInfo","requestId":"t-59f8b5bc-d4da-4d55-bf2b-0c6215a21b67"},{"@type":"type.googleapis.com/google.rpc.BadRequest","fieldViolations":[{"field":"audience_members[0]","description":"Type of the user list is not applicable for this request.","reason":"INVALID_USER_LIST_TYPE"}]}]}}',
                metadata: generateDMMetadata(1),
                statusCode: 400,
              },
            ],
            statTags: { ...commonStatTags, errorType: 'aborted' },
            status: 400,
          },
        },
      },
    },
  },

  // ── 4. 503 UNAVAILABLE → retryable ────────────────────────────────────────────
  {
    id: 'garl-dm-delivery-04',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API Proxy v1] :: audienceMembers:ingest — 503 UNAVAILABLE → retryable',
    successCriteria: 'Should return 503 with errorType retryable',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: dmHeaders,
            params: {},
            JSON: {
              destinations: [
                {
                  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                  productDestinationId: '7090784486',
                },
              ],
              audienceMembers: [
                { userData: { userIdentifiers: [{ emailAddress: 'trigger-503@test.com' }] } },
              ],
              encoding: 'HEX',
              termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
            },
            endpoint: DM_INGEST_ENDPOINT,
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
              '[Google Ads Remarketing Lists DM API] {"error":{"code":503,"message":"The service is currently unavailable.","status":"UNAVAILABLE","details":[{"@type":"type.googleapis.com/google.rpc.RequestInfo","requestId":"t-503-unavailable-req-id"}]}}',
            response: [
              {
                error:
                  '[Google Ads Remarketing Lists DM API] {"error":{"code":503,"message":"The service is currently unavailable.","status":"UNAVAILABLE","details":[{"@type":"type.googleapis.com/google.rpc.RequestInfo","requestId":"t-503-unavailable-req-id"}]}}',
                metadata: generateDMMetadata(1),
                statusCode: 503,
              },
            ],
            statTags: { ...commonStatTags, errorType: 'retryable' },
            status: 503,
          },
        },
      },
    },
  },

  // ── 5. 409 ABORTED → aborted (HTTP 409 classified by status code) ─────────────
  {
    id: 'garl-dm-delivery-05',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API Proxy v1] :: audienceMembers:ingest — 409 ABORTED → aborted',
    successCriteria: 'Should return 409 with errorType aborted (HTTP 409 is non-retryable)',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: dmHeaders,
            params: {},
            JSON: {
              destinations: [
                {
                  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                  productDestinationId: '7090784486',
                },
              ],
              audienceMembers: [
                { userData: { userIdentifiers: [{ emailAddress: 'trigger-409@test.com' }] } },
              ],
              encoding: 'HEX',
              termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
            },
            endpoint: DM_INGEST_ENDPOINT,
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
              '[Google Ads Remarketing Lists DM API] {"error":{"code":409,"message":"The operation was aborted.","status":"ABORTED","details":[{"@type":"type.googleapis.com/google.rpc.RequestInfo","requestId":"t-409-aborted-req-id"}]}}',
            response: [
              {
                error:
                  '[Google Ads Remarketing Lists DM API] {"error":{"code":409,"message":"The operation was aborted.","status":"ABORTED","details":[{"@type":"type.googleapis.com/google.rpc.RequestInfo","requestId":"t-409-aborted-req-id"}]}}',
                metadata: generateDMMetadata(1),
                statusCode: 409,
              },
            ],
            statTags: { ...commonStatTags, errorType: 'aborted' },
            status: 409,
          },
        },
      },
    },
  },

  // ── 6. 401 UNAUTHENTICATED → REFRESH_TOKEN ────────────────────────────────────
  {
    id: 'garl-dm-delivery-06',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API Proxy v1] :: audienceMembers:ingest — 401 UNAUTHENTICATED → REFRESH_TOKEN',
    successCriteria: 'Should return 401 with authErrorCategory REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: dmHeaders,
            params: {},
            JSON: {
              destinations: [
                {
                  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                  productDestinationId: '7090784486',
                },
              ],
              audienceMembers: [
                { userData: { userIdentifiers: [{ emailAddress: 'trigger-401@test.com' }] } },
              ],
              encoding: 'HEX',
              termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
            },
            endpoint: DM_INGEST_ENDPOINT,
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
              '[Google Ads Remarketing Lists DM API] {"error":{"code":401,"message":"Request had invalid authentication credentials.","status":"UNAUTHENTICATED","details":[{"@type":"type.googleapis.com/google.rpc.RequestInfo","requestId":"t-401-unauth-req-id"}]}}',
            response: [
              {
                error:
                  '[Google Ads Remarketing Lists DM API] {"error":{"code":401,"message":"Request had invalid authentication credentials.","status":"UNAUTHENTICATED","details":[{"@type":"type.googleapis.com/google.rpc.RequestInfo","requestId":"t-401-unauth-req-id"}]}}',
                metadata: generateDMMetadata(1),
                statusCode: 401,
              },
            ],
            statTags: { ...commonStatTags, errorType: 'aborted' },
            status: 401,
          },
        },
      },
    },
  },
];
