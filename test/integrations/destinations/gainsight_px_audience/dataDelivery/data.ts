import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { authKey } from '../maskedSecrets';
import { destType, endpointPath, headers, usersUpdateEndpoint } from '../common';
import { bodies, responses } from './network';

const DEST = 'GAINSIGHT_PX_AUDIENCE';

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

const payload = (JSON: Record<string, unknown>) =>
  generateProxyV1Payload(
    { JSON, headers, method: 'PUT', endpoint: usersUpdateEndpoint, endpointPath },
    [generateMetadata(1)],
    { rudderAccountId: 'acc-1', apiKey: authKey, dataCenter: 'US' },
  );

const deliveryCase = (
  id: string,
  description: string,
  JSON: Record<string, unknown>,
  status: number,
  jobStatus: number,
  error: string,
  errorType?: string,
  jobError: string = error,
): ProxyV1TestData => ({
  id,
  name: destType,
  description,
  successCriteria: description,
  scenario: 'Business',
  feature: 'dataDelivery',
  module: 'destination',
  version: 'v1',
  input: { request: { body: payload(JSON), method: 'POST' } },
  output: {
    response: {
      status: 200,
      body: {
        output: {
          status,
          message: `[${DEST}] ${error === 'success' ? 'Request processed successfully' : error}`,
          ...(errorType ? { statTags: statTags(errorType) } : {}),
          response: [{ statusCode: jobStatus, metadata: generateMetadata(1), error: jobError }],
        },
      },
    },
  },
});

/**
 * A failure leaves the framework as a TransformerProxyError carrying the PX status. The top-level
 * message is our static reason; postTransformation sets each job's error to the PX body.
 */
const failureCase = (
  id: string,
  description: string,
  body: Record<string, unknown>,
  status: number,
  reason: string,
  errorType: string,
  pxBody: unknown,
): ProxyV1TestData =>
  deliveryCase(id, description, body, status, status, reason, errorType, JSON.stringify(pxBody));

export const data: ProxyV1TestData[] = [
  deliveryCase(
    'gpx_v1_204_success',
    '204 → 200 success; mock matched only with the injected key',
    bodies.success,
    204,
    200,
    'success',
  ),
  failureCase(
    'gpx_v1_404_true_abort',
    '404 on true → abort with the user-not-found reason',
    bodies.notFoundTrue,
    404,
    'Gainsight PX user not found',
    'aborted',
    responses.notFound,
  ),
  deliveryCase(
    'gpx_v1_404_false_success',
    '404 on false → 200 success',
    bodies.notFoundFalse,
    404,
    200,
    'success',
  ),
  failureCase(
    'gpx_v1_400_attribute_missing',
    '400 does not exist or not enabled → abort, attribute missing',
    bodies.attributeMissing,
    400,
    'Gainsight PX attribute is missing or disabled',
    'aborted',
    responses.attributeMissing,
  ),
  failureCase(
    'gpx_v1_400_type_mismatch',
    '400 type mismatch → abort, generic 400 reason',
    bodies.typeMismatch,
    400,
    'Gainsight PX rejected the request (400)',
    'aborted',
    responses.typeMismatch,
  ),
  failureCase(
    'gpx_v1_401_abort',
    '401 → abort, key or data center',
    bodies.unauthorized,
    401,
    'Gainsight PX rejected the API key or data center',
    'aborted',
    responses.unauthorized,
  ),
  failureCase(
    'gpx_v1_403_abort',
    '403 → abort, lacks Write',
    bodies.forbidden,
    403,
    'Gainsight PX API key lacks Write permission',
    'aborted',
    responses.forbidden,
  ),
  failureCase(
    'gpx_v1_429_throttled',
    '429 → 429 throttled',
    bodies.rateLimited,
    429,
    'Gainsight PX rate limit exceeded',
    'throttled',
    responses.rateLimited,
  ),
  failureCase(
    'gpx_v1_500_retry',
    '500 → 500 retry',
    bodies.serverError,
    500,
    'Gainsight PX server error (500)',
    'retryable',
    responses.serverError,
  ),
];
