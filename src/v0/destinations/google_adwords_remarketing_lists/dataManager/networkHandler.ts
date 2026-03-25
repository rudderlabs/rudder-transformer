import { NetworkError } from '@rudderstack/integrations-lib';
import logger from '../../../../logger';
import { handleHttpRequest } from '../../../../adapters/network';
import { isHttpStatusSuccess } from '../../../util/index';
import { getDynamicErrorType } from '../../../../adapters/utils/networkUtils';
import { getAuthErrCategory } from '../../../util/googleUtils';
import tags from '../../../util/tags';
import type { ResponseHandlerParams } from '../../../../types/destinationTransformation';

/**
 * Single-call proxy for the Google Data Manager API (audienceMembers:ingest / audienceMembers:remove).
 *
 * Replaces the 3-step OfflineUserDataJobs flow for workspaces that have the DM feature flag enabled.
 * - No `developer-token` header (not accepted by the Data Manager API).
 * - `login-customer-id` is forwarded as-is if the transform layer already set it.
 * - `requestId` from the response is logged for debugging / support tracing.
 */
const dataManagerProxyRequest = async (request: {
  body: { JSON: unknown };
  method: string;
  endpoint: string;
  metadata: unknown;
  headers: Record<string, string>;
  endpointPath?: string;
}) => {
  const { body, method, endpoint, metadata, headers, endpointPath } = request;

  const proxyRequest = {
    url: endpoint,
    data: body.JSON,
    headers,
    method,
  };

  const { httpResponse } = await handleHttpRequest('constructor', proxyRequest, {
    destType: 'google_adwords_remarketing_lists',
    feature: 'proxy',
    endpointPath,
    requestMethod: 'POST',
    module: 'dataDelivery',
    metadata,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestId = (httpResponse as any)?.response?.data?.requestId;
  if (requestId) {
    logger.info(`[GARL DM] ingest/remove requestId: ${requestId}`);
  }

  return httpResponse;
};

/**
 * Response handler for the Data Manager API path.
 *
 * Key differences from the legacy OfflineUserDataJobs handler:
 * - No `partialFailureError` check (not part of the DM API response contract).
 * - No CONCURRENT_MODIFICATION 400→500 conversion (OfflineUserDataJobs-specific).
 * - requestId is extracted from error.details and logged for support tracing.
 * - Error type is determined from gRPC status string (error.status) to correctly
 *   classify ABORTED (HTTP 409) as retryable per DM API docs.
 */
const dataManagerResponseHandler = (responseParams: ResponseHandlerParams) => {
  const { destinationResponse } = responseParams;
  const { status, response } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    return {
      status,
      message: 'Request Processed Successfully',
      destinationResponse,
    };
  }

  const errorBody = (response as Record<string, unknown> | undefined)?.error as
    | Record<string, unknown>
    | undefined;

  // Use error.code from the response body as the authoritative status code.
  const errorCode = typeof errorBody?.code === 'number' ? errorBody.code : status;

  throw new NetworkError(
    `[Google Ads Remarketing Lists DM API] ${JSON.stringify(response)}`,
    errorCode,
    { [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorCode) },
    response,
    getAuthErrCategory({ status: errorCode, response }),
  );
};

export { dataManagerProxyRequest, dataManagerResponseHandler };
