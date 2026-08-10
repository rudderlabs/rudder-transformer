import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { destType } from '../common';
import {
  bulkTrackEndpoint,
  bulkTrackPath,
  headers,
  successBody,
  successResponse,
  partialIdentityBody,
  partialIdentityResponse,
  partialRetryableBody,
  partialRetryableResponse,
  authErrorBody,
  authErrorResponse,
  rateLimitBody,
  rateLimitResponse,
  serverErrorBody,
  serverErrorResponse,
} from './network';

// Messages produced by the batching framework's delivery bridge, which owns response handling for
// this destination once BRAZE_AUDIENCE_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS is set.
const FRAMEWORK_SUCCESS_MESSAGE = '[BRAZE_AUDIENCE] Request processed successfully';
// A mixed batch keeps Braze's own status (201) and reports the first real failure reason.
const frameworkFailure = (reason: string) => `[BRAZE_AUDIENCE] ${reason}`;

const proxyPayload = (
  JSON: Record<string, unknown>,
  metadata: ReturnType<typeof generateMetadata>[],
) =>
  generateProxyV1Payload(
    {
      JSON,
      headers,
      endpoint: bulkTrackEndpoint,
      endpointPath: bulkTrackPath,
    },
    metadata,
  );

const scenarios: ProxyV1TestData[] = [
  {
    id: 'braze_audience_v1_bulk_full_success',
    name: destType,
    description: '[Proxy v1] 2xx with empty errors[] returns 200 for every job',
    successCriteria: 'Each attribute maps to a 200 success status',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyPayload(successBody, [generateMetadata(1), generateMetadata(2)]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 201,
            message: FRAMEWORK_SUCCESS_MESSAGE,
            response: [
              { statusCode: 200, metadata: generateMetadata(1), error: 'success' },
              { statusCode: 200, metadata: generateMetadata(2), error: 'success' },
            ],
          },
        },
      },
    },
  },
  {
    id: 'braze_audience_v1_bulk_partial_identity_abort',
    name: destType,
    description: '[Proxy v1] indexed EXTERNAL_USER_ID_TOO_LARGE aborts that job; siblings stay 200',
    successCriteria: 'Identity error at index 1 → 400; other jobs 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyPayload(partialIdentityBody, [
          generateMetadata(1),
          generateMetadata(2),
          generateMetadata(3),
        ]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 201,
            message: frameworkFailure('EXTERNAL_USER_ID_TOO_LARGE'),
            response: [
              { statusCode: 200, metadata: generateMetadata(1), error: 'success' },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: 'EXTERNAL_USER_ID_TOO_LARGE',
              },
              { statusCode: 200, metadata: generateMetadata(3), error: 'success' },
            ],
          },
        },
      },
    },
  },
  {
    id: 'braze_audience_v1_bulk_partial_retryable',
    name: destType,
    description: '[Proxy v1] unknown indexed error type is retryable (500) for that job',
    successCriteria: 'Transient indexed error → 500; sibling 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyPayload(partialRetryableBody, [generateMetadata(1), generateMetadata(2)]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 201,
            message: frameworkFailure('SOME_TRANSIENT_ATTR_ERROR'),
            response: [
              {
                statusCode: 500,
                metadata: generateMetadata(1),
                error: 'SOME_TRANSIENT_ATTR_ERROR',
              },
              { statusCode: 200, metadata: generateMetadata(2), error: 'success' },
            ],
          },
        },
      },
    },
  },
  {
    id: 'braze_audience_v1_bulk_401_auth_error',
    name: destType,
    description: '[Proxy v1] 401 from Braze aborts every job in the batch',
    successCriteria: 'Every job marked 401; errorType aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyPayload(authErrorBody, [generateMetadata(1)]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 401,
            message: frameworkFailure('Invalid API key'),
            statTags: {
              destType: 'BRAZE_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
            response: [
              {
                statusCode: 401,
                metadata: generateMetadata(1),
                error: JSON.stringify(authErrorResponse),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'braze_audience_v1_bulk_429_rate_limit',
    name: destType,
    description: '[Proxy v1] 429 from Braze is throttled for every job',
    successCriteria: 'Every job marked 429; errorType throttled',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyPayload(rateLimitBody, [generateMetadata(1)]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 429,
            message: frameworkFailure('Rate limited'),
            statTags: {
              destType: 'BRAZE_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
            response: [
              {
                statusCode: 429,
                metadata: generateMetadata(1),
                error: JSON.stringify(rateLimitResponse),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'braze_audience_v1_bulk_500_server_error',
    name: destType,
    description: '[Proxy v1] 5xx from Braze is fanned out as retryable across every job',
    successCriteria: 'Every job marked 500; errorType retryable',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyPayload(serverErrorBody, [generateMetadata(1), generateMetadata(2)]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 500,
            message: frameworkFailure('Internal server error'),
            statTags: {
              destType: 'BRAZE_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
            response: [
              {
                statusCode: 500,
                metadata: generateMetadata(1),
                error: JSON.stringify(serverErrorResponse),
              },
              {
                statusCode: 500,
                metadata: generateMetadata(2),
                error: JSON.stringify(serverErrorResponse),
              },
            ],
          },
        },
      },
    },
  },
];

/**
 * BRAZE_AUDIENCE is already GA for the batching-framework transform, so only the delivery flag is
 * needed to move these scenarios onto the framework response path.
 */
export const data = scenarios.map((scenario) => ({
  ...scenario,
  envOverrides: {
    ...scenario.envOverrides,
    BRAZE_AUDIENCE_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS: 'ALL',
  },
}));
