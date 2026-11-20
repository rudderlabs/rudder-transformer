import type { DeliveryV1Response } from '../../../../../src/types';
import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { apiKey } from '../maskedSecrets';
import { destType, endpoint, endpointPath, headers, tagGroup } from '../common';
import { bodies, responses } from './network';

const DEST = 'AIRSHIP_AUDIENCE';

const statTags = (errorType: string) => ({
  destType: DEST,
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType,
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
});

const jobs = (count: number) => Array.from({ length: count }, (_, i) => generateMetadata(i + 1));

const payload = (JSON: Record<string, unknown>, jobCount: number) =>
  generateProxyV1Payload(
    { JSON, headers, method: 'POST', endpoint, endpointPath },
    jobs(jobCount),
    { rudderAccountId: 'acc-1', apiKey, dataCenter: 'US', tagGroup },
  );

const deliveryCase = (
  id: string,
  description: string,
  JSON: Record<string, unknown>,
  jobCount: number,
  output: DeliveryV1Response,
): ProxyV1TestData => ({
  id,
  name: destType,
  description,
  successCriteria: description,
  scenario: 'Business',
  feature: 'dataDelivery',
  module: 'destination',
  version: 'v1',
  input: { request: { body: payload(JSON, jobCount), method: 'POST' } },
  output: { response: { status: 200, body: { output } } },
});

/**
 * A uniform whole-batch failure leaves the framework as a TransformerProxyError carrying Airship's
 * status: the top-level message is the reason, and postTransformation sets each job's error to
 * the response body.
 */
const thrown = (status: number, reason: string, errorType: string, body: unknown, n: number) => ({
  status,
  message: `[${DEST}] ${reason}`,
  statTags: statTags(errorType),
  response: jobs(n).map((metadata) => ({
    statusCode: status,
    metadata,
    error: JSON.stringify(body),
  })),
});

/** A dontBatch verdict is returned per job, so each job carries the reason, never the body. */
const perJob = (
  status: number,
  reason: string,
  errorType: string,
  jobStatus: number,
  n: number,
  dontBatch: boolean,
) => ({
  status,
  message: `[${DEST}] ${reason}`,
  statTags: statTags(errorType),
  response: jobs(n).map((metadata) => ({
    statusCode: jobStatus,
    metadata: dontBatch ? { ...metadata, dontBatch: true } : metadata,
    error: reason,
  })),
});

const INVALID_TAG_REASON = 'Airship 40006: Could not parse request body.';

export const data: ProxyV1TestData[] = [
  deliveryCase('airship_v1_200_success', '200 → success for every job', bodies.success, 2, {
    status: 200,
    message: `[${DEST}] Request processed successfully`,
    response: jobs(2).map((metadata) => ({ statusCode: 200, metadata, error: 'success' })),
  }),
  deliveryCase(
    'airship_v1_400_40090_abort',
    '400 40090 on three jobs → abort all, no dontBatch (splitting cannot fix a missing group)',
    bodies.missingGroup,
    3,
    thrown(
      400,
      `Airship 40090: ${responses.missingGroup.error}`,
      'aborted',
      responses.missingGroup,
      3,
    ),
  ),
  deliveryCase(
    'airship_v1_400_40006_batch_dont_batch',
    '400 40006 on three jobs → retry each alone (dontBatch); details stay out of the reason',
    bodies.invalidTagBatch,
    3,
    perJob(400, INVALID_TAG_REASON, 'retryable', 500, 3, true),
  ),
  deliveryCase(
    'airship_v1_400_40006_single_abort',
    '400 40006 on a single job → abort (nothing left to isolate)',
    bodies.invalidTagSingle,
    1,
    perJob(400, INVALID_TAG_REASON, 'aborted', 400, 1, false),
  ),
  deliveryCase(
    'airship_v1_401_abort',
    '401 40101 → abort with Airship 40101: Unauthorized',
    bodies.unauthorized,
    1,
    thrown(401, 'Airship 40101: Unauthorized', 'aborted', responses.unauthorized, 1),
  ),
  deliveryCase(
    'airship_v1_429_throttled',
    '429 → throttled',
    bodies.rateLimited,
    1,
    thrown(429, 'Airship request failed with status 429', 'throttled', '', 1),
  ),
  deliveryCase(
    'airship_v1_503_retry',
    '503 → retry',
    bodies.unavailable,
    1,
    thrown(503, 'Airship request failed with status 503', 'retryable', '', 1),
  ),
  deliveryCase(
    'airship_v1_502_html_retry',
    '502 with an HTML body → retry with the static fallback reason',
    bodies.badGateway,
    1,
    thrown(502, 'Airship request failed with status 502', 'retryable', responses.badGatewayHtml, 1),
  ),
  deliveryCase(
    'airship_v1_400_empty_dont_batch',
    '400 with an empty body → dontBatch retry with the static fallback reason, no throw',
    bodies.emptyBadRequest,
    2,
    perJob(400, 'Airship request failed with status 400', 'retryable', 500, 2, true),
  ),
];
