import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';
import { adAccountId, customerListId, destType, metadataFor } from '../common';
import {
  authExpiredBody,
  authExpiredResponse,
  endpoint,
  endpointPath,
  forbiddenBody,
  forbiddenResponse,
  headers,
  malformedBody,
  malformedResponse,
  notFoundBody,
  notFoundResponse,
  rateLimitBody,
  rateLimitResponse,
  removeBody,
  serverErrorBody,
  serverErrorResponse,
  successBody,
} from './network';

const DEST = 'PINTEREST_AUDIENCE';
const SUCCESS_MESSAGE = `[${DEST}] Request processed successfully`;

const jobs = (n: number) => Array.from({ length: n }, (_, i) => metadataFor(i + 1));

// generateProxyV1Payload defaults `method` to POST; the mocks register PATCH.
const proxyPayload = (JSON: Record<string, unknown>, metadata: ReturnType<typeof jobs>) =>
  generateProxyV1Payload({ JSON, headers, endpoint, endpointPath, method: 'PATCH' }, metadata);

const statTags = (errorType: 'aborted' | 'throttled' | 'retryable') => ({
  destType: DEST,
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType,
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
});

/** Per-job `error` is the raw response; top-level `message` is the delivery spec's reason. */
const failed = (
  response: Record<string, unknown>,
  reason: string,
  jobStatusCode: number,
  errorType: 'aborted' | 'throttled' | 'retryable',
) => ({
  message: `[${DEST}] ${reason}`,
  statTags: statTags(errorType),
  response: jobs(1).map((metadata) => ({
    statusCode: jobStatusCode,
    metadata,
    error: JSON.stringify(response),
  })),
});

const deliveryCase = (
  id: string,
  description: string,
  JSON: Record<string, unknown>,
  jobCount: number,
  httpStatus: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: any,
): ProxyV1TestData => ({
  id,
  name: destType,
  description,
  successCriteria: description,
  scenario: 'Business',
  feature: 'dataDelivery',
  module: 'destination',
  version: 'v1',
  input: { request: { body: proxyPayload(JSON, jobs(jobCount)), method: 'POST' } },
  output: { response: { status: httpStatus, body: { output } } },
});

export const data: ProxyV1TestData[] = [
  deliveryCase('pinterest_audience_v1_add_200', '[Proxy v1] D12 200 CustomerList → every job 200', successBody, 2, 200, {
    status: 200,
    message: SUCCESS_MESSAGE,
    response: jobs(2).map((metadata) => ({ statusCode: 200, metadata, error: 'success' })),
  }),
  deliveryCase('pinterest_audience_v1_remove_200', '[Proxy v1] REMOVE succeeds on the same URL', removeBody, 1, 200, {
    status: 200,
    message: SUCCESS_MESSAGE,
    response: jobs(1).map((metadata) => ({ statusCode: 200, metadata, error: 'success' })),
  }),
  deliveryCase(
    'pinterest_audience_v1_401_refresh',
    '[Proxy v1] D13 401 with an auth body → REFRESH_TOKEN',
    authExpiredBody,
    1,
    401,
    {
      status: 401,
      authErrorCategory: 'REFRESH_TOKEN',
      ...failed(authExpiredResponse, '2: Authentication failed.', 401, 'retryable'),
    },
  ),
  deliveryCase('pinterest_audience_v1_403_abort', '[Proxy v1] 403 aborts and names the ad account', forbiddenBody, 1, 200, {
    status: 403,
    ...failed(
      forbiddenResponse,
      `Pinterest refused the request: You are not permitted to access that resource. Check the connected account still has access to ad account ${adAccountId}.`,
      403,
      'aborted',
    ),
  }),
  deliveryCase('pinterest_audience_v1_404_list_not_found', '[Proxy v1] D14 404/1018 aborts: list not found', notFoundBody, 1, 200, {
    status: 404,
    ...failed(
      notFoundResponse,
      `Customer list ${customerListId} was not found — it may have been deleted. Pick or create the audience again.`,
      404,
      'aborted',
    ),
  }),
  deliveryCase('pinterest_audience_v1_400_malformed', '[Proxy v1] D15 400/2740 aborts with code: message', malformedBody, 1, 200, {
    status: 400,
    ...failed(malformedResponse, '2740: Malformatted user list.', 400, 'aborted'),
  }),
  deliveryCase('pinterest_audience_v1_429_throttled', '[Proxy v1] D16 429 is throttled', rateLimitBody, 1, 200, {
    status: 429,
    ...failed(rateLimitResponse, '8: Rate limit exceeded.', 429, 'throttled'),
  }),
  deliveryCase('pinterest_audience_v1_500_retry', '[Proxy v1] D17 5xx retries', serverErrorBody, 1, 200, {
    status: 500,
    ...failed(serverErrorResponse, '1: Something went wrong on our end.', 500, 'retryable'),
  }),
];
