import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { destType } from '../common';
import {
  authExpiredBody,
  authExpiredResponse,
  badRequestBody,
  badRequestResponse,
  endpoint,
  endpointPath,
  headers,
  notFoundBody,
  notFoundResponse,
  rateLimitBody,
  rateLimitResponse,
  removeBody,
  scopeErrorBody,
  scopeErrorResponse,
  serverErrorBody,
  serverErrorResponse,
  successBody,
  successResponse,
} from './network';

const SUCCESS_MESSAGE = '[REDDIT_AUDIENCE] Request processed successfully';
const failure = (reason: string) => `[REDDIT_AUDIENCE] ${reason}`;

const proxyPayload = (
  JSON: Record<string, unknown>,
  metadata: ReturnType<typeof generateMetadata>[],
) =>
  // `method` defaults to POST in generateProxyV1Payload — Reddit's user-update
  // endpoint is PATCH, and the axios mock registers per-method, so omitting this
  // silently misses every mock and every scenario retries as a 500.
  generateProxyV1Payload({ JSON, headers, endpoint, endpointPath, method: 'PATCH' }, metadata);

const jobs = (n: number) => Array.from({ length: n }, (_, i) => generateMetadata(i + 1));

const outcome = (
  metadata: ReturnType<typeof generateMetadata>[],
  statusCode: number,
  error: string,
) => metadata.map((m) => ({ statusCode, metadata: m, error }));

/**
 * The framework derives statTags itself when every job failed the same way.
 * `errorCategory` is always `network` on the delivery path; `errorType` is the
 * verdict kind.
 */
const statTags = (errorType: 'aborted' | 'throttled' | 'retryable') => ({
  destType: 'REDDIT_AUDIENCE',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType,
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
});

/**
 * On a failure the per-job `error` is the raw destination response, while the
 * top-level `message` carries the destination's own `failureReason` extractor —
 * which is where Reddit's `error.fields[]` detail surfaces.
 */
const failed = (
  redditResponse: Record<string, unknown>,
  reason: string,
  jobStatusCode: number,
  errorType: 'aborted' | 'throttled' | 'retryable',
) => ({
  message: failure(reason),
  statTags: statTags(errorType),
  response: outcome(jobs(1), jobStatusCode, JSON.stringify(redditResponse)),
});

const scenarios: ProxyV1TestData[] = [
  {
    id: 'reddit_audience_v1_add_204_success',
    name: destType,
    description: '[Proxy v1] 204 No Content is the documented success for ADD',
    successCriteria: 'Every job in the batch reports 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyPayload(successBody, jobs(2)), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 204,
            message: SUCCESS_MESSAGE,
            response: outcome(jobs(2), 200, 'success'),
          },
        },
      },
    },
  },
  {
    id: 'reddit_audience_v1_remove_204_success',
    name: destType,
    description: '[Proxy v1] REMOVE succeeds on the same endpoint with the same 204 contract',
    successCriteria: 'The single job reports 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyPayload(removeBody, jobs(1)), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 204,
            message: SUCCESS_MESSAGE,
            response: outcome(jobs(1), 200, 'success'),
          },
        },
      },
    },
  },
  {
    id: 'reddit_audience_v1_400_aborts_with_field_detail',
    name: destType,
    description: '[Proxy v1] 400 aborts and surfaces Reddit error.fields[] alongside the message',
    successCriteria: 'Job reports 400 and the error names the offending field',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyPayload(badRequestBody, jobs(1)), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            ...failed(
              badRequestResponse,
              'Bad request. (user_data: Invalid value.)',
              400,
              'aborted',
            ),
          },
        },
      },
    },
  },
  {
    id: 'reddit_audience_v1_401_refreshes_token',
    name: destType,
    description:
      '[Proxy v1] 401 with Reddit UNAUTHORIZED body drives a token refresh, not an abort',
    successCriteria: 'Job is retryable (500) and authErrorCategory is REFRESH_TOKEN',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyPayload(authExpiredBody, jobs(1)), method: 'POST' } },
    output: {
      response: {
        // An authExpired verdict sets authErrorCategory, and the proxy surfaces
        // the destination's own 401 at the top level rather than a flat 200.
        status: 401,
        body: {
          output: {
            status: 401,
            authErrorCategory: 'REFRESH_TOKEN',
            ...failed(authExpiredResponse, 'Request is not authenticated', 401, 'retryable'),
          },
        },
      },
    },
  },
  {
    id: 'reddit_audience_v1_403_scope_aborts',
    name: destType,
    description:
      '[Proxy v1] 403 (missing adsedit scope, or blocked User-Agent) aborts — never retried',
    successCriteria: 'Job reports 400 and the error names the adsedit scope',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyPayload(scopeErrorBody, jobs(1)), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 403,
            ...failed(
              scopeErrorResponse,
              "Insufficient authentication scopes. — Reddit returned 403. The connected account is missing the 'adsedit' scope, or the request was blocked. Re-authorize the Reddit Audience account.",
              403,
              'aborted',
            ),
          },
        },
      },
    },
  },
  {
    id: 'reddit_audience_v1_404_missing_audience_aborts',
    name: destType,
    description: '[Proxy v1] 404 means the audience was deleted in Reddit — a config error',
    successCriteria: 'Job reports 400 pointing at the missing audience',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyPayload(notFoundBody, jobs(1)), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 404,
            ...failed(
              notFoundResponse,
              'The specified resource was not found. — custom audience not found. It may have been deleted in Reddit Ads Manager; re-select the audience on this sync.',
              404,
              'aborted',
            ),
          },
        },
      },
    },
  },
  {
    id: 'reddit_audience_v1_429_throttled',
    name: destType,
    description: '[Proxy v1] 429 is throttled, honouring Reddit ingestion rate limits',
    successCriteria: 'Job reports 429',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyPayload(rateLimitBody, jobs(1)), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 429,
            ...failed(rateLimitResponse, 'Too many requests.', 429, 'throttled'),
          },
        },
      },
    },
  },
  {
    id: 'reddit_audience_v1_500_retries',
    name: destType,
    description: '[Proxy v1] 5xx retries the whole request',
    successCriteria: 'Job reports 500',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyPayload(serverErrorBody, jobs(1)), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 500,
            ...failed(serverErrorResponse, 'Server error.', 500, 'retryable'),
          },
        },
      },
    },
  },
];

/**
 * REDDIT_AUDIENCE is GA for the batching-framework transform via features.ts, so
 * only the delivery flag is needed to move these scenarios onto the framework
 * response path. Without it CI would keep exercising the legacy handler — which
 * this destination deliberately does not have.
 */
export const data = scenarios.map((scenario) => ({
  ...scenario,
  envOverrides: {
    ...scenario.envOverrides,
    REDDIT_AUDIENCE_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL',
    REDDIT_AUDIENCE_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS: 'ALL',
  },
}));
