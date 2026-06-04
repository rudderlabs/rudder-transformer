import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { headers } from '../common';
import {
  subscribeSuccessBody,
  subscribeSuccessResponse,
  subscribeInvalidEmailBody,
  subscribeInvalidEmailResponse,
  subscribeConflictUserIdBody,
  subscribeConflictUserIdResponse,
  subscribeNotFoundBody,
  subscribeNotFoundResponse,
  subscribeForgottenBody,
  subscribeForgottenResponse,
  subscribeEmailCaseBody,
  subscribeEmailCaseResponse,
  subscribeUserIdCaseBody,
  subscribeUserIdCaseResponse,
  subscribeMixedBody,
  subscribeMixedResponse,
  unsubscribeNotFoundEmailBody,
  unsubscribeNotFoundEmailResponse,
  unsubscribeNotFoundUserIdBody,
  unsubscribeNotFoundUserIdResponse,
  subscribeInvalidDataBody,
  subscribeInvalidDataResponse,
  subscribeBothForgottenBody,
  subscribeBothForgottenResponse,
  subscribeAuthErrorBody,
  subscribeServerErrorBody,
  authErrorResponse,
  serverErrorResponse,
} from './network';

const subscribeEndpoint = 'https://api.iterable.com/api/lists/subscribe';
const unsubscribeEndpoint = 'https://api.iterable.com/api/lists/unsubscribe';
const SUCCESS_MESSAGE = '[ITERABLE_AUDIENCE Response Handler] - Request Processed Successfully';

export const data: ProxyV1TestData[] = [
  {
    id: 'iterable_audience_v1_subscribe_full_success',
    name: 'iterable_audience',
    description: '[Proxy v1] subscribe batch fully accepted by Iterable returns 200 for every job',
    successCriteria: 'Each subscriber maps to a 200 success status',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeSuccessBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1), generateMetadata(2)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: subscribeSuccessResponse },
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
    id: 'iterable_audience_v1_subscribe_partial_invalid_email',
    name: 'iterable_audience',
    description: '[Proxy v1] subscriber listed in failedUpdates.invalidEmails is marked 400',
    successCriteria: 'Invalid email job is 400; the valid email job is 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeInvalidEmailBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1), generateMetadata(2)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: subscribeInvalidEmailResponse },
            response: [
              { statusCode: 200, metadata: generateMetadata(1), error: 'success' },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: 'email error:"bad@example.com" in "failedUpdates.invalidEmails".',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_subscribe_conflict_userid',
    name: 'iterable_audience',
    description: '[Proxy v1] subscriber listed in failedUpdates.conflictUserIds is marked 400',
    successCriteria: 'Conflicting userId job is 400 with a userId error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeConflictUserIdBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: subscribeConflictUserIdResponse },
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: 'userId error:"conflict_user" in "failedUpdates.conflictUserIds".',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_subscribe_not_found_is_400',
    name: 'iterable_audience',
    description: '[Proxy v1] notFoundEmails on a subscribe request is an error (400)',
    successCriteria: 'notFound on subscribe maps to 400',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeNotFoundBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: subscribeNotFoundResponse },
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: 'email error:"missing@example.com" in "failedUpdates.notFoundEmails".',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_subscribe_forgotten_user_is_200',
    name: 'iterable_audience',
    description: '[Proxy v1] GDPR-forgotten user is returned as 200 (never retried)',
    successCriteria: 'forgottenEmails maps to 200 success despite being a failed update',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeForgottenBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: subscribeForgottenResponse },
            response: [{ statusCode: 200, metadata: generateMetadata(1), error: 'success' }],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_subscribe_email_case_insensitive',
    name: 'iterable_audience',
    description: '[Proxy v1] subscriber email is matched case-insensitively against failedUpdates',
    successCriteria: 'Mixed-case subscriber email matches the lowercased failed email and is 400',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeEmailCaseBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: subscribeEmailCaseResponse },
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: 'email error:"mixedcase@example.com" in "failedUpdates.invalidEmails".',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_subscribe_userid_case_sensitive',
    name: 'iterable_audience',
    description: '[Proxy v1] subscriber userId is matched case-sensitively (no false match)',
    successCriteria: 'userId with different case does not match the failed userId and is 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeUserIdCaseBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: subscribeUserIdCaseResponse },
            response: [{ statusCode: 200, metadata: generateMetadata(1), error: 'success' }],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_subscribe_mixed_batch_alignment',
    name: 'iterable_audience',
    description: '[Proxy v1] mixed batch aligns per-job statuses to subscriber order',
    successCriteria: 'forgotten/clean rows are 200; invalid/conflict rows are 400, in order',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeMixedBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [
            generateMetadata(1),
            generateMetadata(2),
            generateMetadata(3),
            generateMetadata(4),
            generateMetadata(5),
          ],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: subscribeMixedResponse },
            response: [
              { statusCode: 200, metadata: generateMetadata(1), error: 'success' },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: 'email error:"invalid2@example.com" in "failedUpdates.invalidEmails".',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(3),
                error: 'userId error:"conflict_user2" in "failedUpdates.conflictUserIds".',
              },
              { statusCode: 200, metadata: generateMetadata(4), error: 'success' },
              { statusCode: 200, metadata: generateMetadata(5), error: 'success' },
            ],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_unsubscribe_not_found_email_is_200',
    name: 'iterable_audience',
    description: '[Proxy v1] notFoundEmails on an unsubscribe request is a no-op success (200)',
    successCriteria: 'notFound on unsubscribe maps to 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: unsubscribeNotFoundEmailBody,
            headers,
            endpoint: unsubscribeEndpoint,
            endpointPath: 'lists/unsubscribe',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: unsubscribeNotFoundEmailResponse },
            response: [{ statusCode: 200, metadata: generateMetadata(1), error: 'success' }],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_unsubscribe_not_found_userid_is_200',
    name: 'iterable_audience',
    description: '[Proxy v1] notFoundUserIds on an unsubscribe request is a no-op success (200)',
    successCriteria: 'notFound userId on unsubscribe maps to 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: unsubscribeNotFoundUserIdBody,
            headers,
            endpoint: unsubscribeEndpoint,
            endpointPath: 'lists/unsubscribe',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: unsubscribeNotFoundUserIdResponse },
            response: [{ statusCode: 200, metadata: generateMetadata(1), error: 'success' }],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_subscribe_invalid_data_email_is_400',
    name: 'iterable_audience',
    description: '[Proxy v1] subscriber in failedUpdates.invalidDataEmails is marked 400',
    successCriteria: 'invalidData paths are classified as abortable (400)',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeInvalidDataBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: subscribeInvalidDataResponse },
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: 'email error:"baddata@example.com" in "failedUpdates.invalidDataEmails".',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_subscribe_both_identifiers_forgotten_via_userid',
    name: 'iterable_audience',
    description:
      '[Proxy v1] dual-identifier subscriber is matched as forgotten via its userId (email is clean)',
    successCriteria:
      'A subscriber carrying both identifiers matches the forgotten lookup on either',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeBothForgottenBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: SUCCESS_MESSAGE,
            destinationResponse: { status: 200, response: subscribeBothForgottenResponse },
            response: [{ statusCode: 200, metadata: generateMetadata(1), error: 'success' }],
          },
        },
      },
    },
  },
  {
    id: 'iterable_audience_v1_subscribe_401_auth_error',
    name: 'iterable_audience',
    description:
      '[Proxy v1] 401 from Iterable aborts the batch (no AuthErrorCategory — Api-Key auth)',
    successCriteria: 'Every job in the batch is marked 401 with the destination error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeAuthErrorBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 401,
            message:
              'ITERABLE_AUDIENCE: Error transformer proxy during ITERABLE_AUDIENCE response transformation. "Invalid API key"',
            statTags: {
              destType: 'ITERABLE_AUDIENCE',
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
    id: 'iterable_audience_v1_subscribe_500_server_error',
    name: 'iterable_audience',
    description: '[Proxy v1] 5xx from Iterable is fanned out across every job in the batch',
    successCriteria: 'Every job in the batch is marked 500 with the destination error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: subscribeServerErrorBody,
            headers,
            endpoint: subscribeEndpoint,
            endpointPath: 'lists/subscribe',
          },
          [generateMetadata(1), generateMetadata(2)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 500,
            message:
              'ITERABLE_AUDIENCE: Error transformer proxy during ITERABLE_AUDIENCE response transformation. "Internal server error"',
            statTags: {
              destType: 'ITERABLE_AUDIENCE',
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
