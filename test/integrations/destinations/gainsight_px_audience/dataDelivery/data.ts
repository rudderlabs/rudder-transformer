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
 * message is PX's own message from the body; postTransformation sets each job's error to the PX body.
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
    '204 → 200 success; mock matched only with the key header the transform set',
    bodies.success,
    204,
    200,
    'success',
  ),
  failureCase(
    'gpx_v1_404_true_abort',
    '404 on true → abort with the PX message',
    bodies.notFoundTrue,
    404,
    'User not found',
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
    '400 does not exist or not enabled → abort with the PX subError message',
    bodies.attributeMissing,
    400,
    "User custom attribute api name 'rs_gpx_e2e' does not exist or not enabled",
    'aborted',
    responses.attributeMissing,
  ),
  failureCase(
    'gpx_v1_400_type_mismatch',
    '400 type mismatch → abort with the PX subError message',
    bodies.typeMismatch,
    400,
    'value null does not match the type BOOLEAN',
    'aborted',
    responses.typeMismatch,
  ),
  failureCase(
    'gpx_v1_401_abort',
    '401 → abort with the PX message',
    bodies.unauthorized,
    401,
    'Unauthorized',
    'aborted',
    responses.unauthorized,
  ),
  failureCase(
    'gpx_v1_403_abort',
    '403 → abort with the PX message',
    bodies.forbidden,
    403,
    'Forbidden',
    'aborted',
    responses.forbidden,
  ),
  failureCase(
    'gpx_v1_409_no_message',
    '409 with no message in the body → abort with the static fallback',
    bodies.noMessage,
    409,
    'Gainsight PX request failed with status 409',
    'aborted',
    {},
  ),
  failureCase(
    'gpx_v1_429_throttled',
    '429 → 429 throttled',
    bodies.rateLimited,
    429,
    'Too many requests',
    'throttled',
    responses.rateLimited,
  ),
  failureCase(
    'gpx_v1_500_retry',
    '500 → 500 retry',
    bodies.serverError,
    500,
    'Internal error',
    'retryable',
    responses.serverError,
  ),
  failureCase(
    'gpx_v1_404_member_with_traits_abort',
    '404 on a two-key member write (flag true plus traits) → abort, not a leave',
    bodies.notFoundMemberWithTraits,
    404,
    'User not found',
    'aborted',
    responses.notFound,
  ),
  deliveryCase(
    'gpx_v1_404_single_false_success',
    '404 on a one-key { flag: false } leave → 200 success',
    bodies.notFoundFalse,
    404,
    200,
    'success',
  ),
  failureCase(
    'gpx_v1_400_trait_type_mismatch',
    '400 trait type mismatch → abort with the PX message naming the attribute',
    bodies.traitTypeMismatch,
    400,
    'User custom attribute rs_gpx_number value abc does not match the type NUMBER',
    'aborted',
    responses.traitTypeMismatch,
  ),
];
