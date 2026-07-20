import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { TAG_NAMES } from '../../../v0/util/tags';
import { isHttpStatusSuccess } from '../../../v0/util/index';
import stats from '../../../util/stats';
import type { DeliveryJobState, DeliveryV1Response, ProxyMetdata } from '../../../types';
import { BrazeResponseHandlerParams } from '../../../v0/destinations/braze/types';

const DESTINATION = 'braze';

/**
 * Typed subset of the Braze REST API response body. The `message` field
 * signals overall success ('success') or failure. The `errors` array is
 * present on both partial failures (message='success') and full application-
 * level errors (message!='success').
 */
type BrazeApiResponse = {
  message?: string;
  errors?: unknown[];
};

function isBrazeApiResponse(value: unknown): value is BrazeApiResponse {
  return typeof value === 'object' && value !== null;
}

/**
 * Maps every job in `rudderJobMetadata` to a `DeliveryJobState` using the
 * same `error` string and the given `statusCode`. The `error` field is the
 * JSON-serialised Braze response body so downstream consumers can inspect it.
 * `JSON.stringify(undefined)` returns `undefined` at runtime despite the
 * TypeScript return type, so the `?? ''` guard ensures we never emit
 * `error: undefined`.
 */
const buildJobStates = (
  response: unknown,
  statusCode: number,
  rudderJobMetadata: ProxyMetdata[],
): DeliveryJobState[] =>
  rudderJobMetadata.map((metadata) => ({
    statusCode,
    metadata,
    error: JSON.stringify(response) ?? '',
  }));

const responseHandler = (params: BrazeResponseHandlerParams): DeliveryV1Response => {
  const { destinationResponse, rudderJobMetadata } = params;
  const { response, status } = destinationResponse;

  // Guard 1: non-2xx HTTP status — destination rejected the request entirely
  if (!isHttpStatusSuccess(status)) {
    throw new TransformerProxyError(
      `Request failed for ${DESTINATION} with status: ${status}`,
      status,
      { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
      '',
      buildJobStates(response, status, rudderJobMetadata),
    );
  }

  const responseBody: BrazeApiResponse | null = isBrazeApiResponse(response) ? response : null;
  const errors = responseBody?.errors;
  const hasErrors = Array.isArray(errors) && errors.length > 0;
  const brazeMessage = responseBody?.message;

  // Guard 2: partial failure — destination accepted the request but some items
  // within the batch were invalid. Braze signals this with message='success'
  // and a non-empty errors array. Emit a metric so ops can track frequency;
  // the batch is still considered delivered (fall through to success).
  if (brazeMessage === 'success' && hasErrors) {
    stats.increment('braze_partial_failure');
  }

  // Guard 3: application-level error — destination returned 2xx but with an
  // error message (message!='success') and errors, meaning the entire request
  // was rejected at the application layer despite the transport succeeding.
  if (brazeMessage !== 'success' && hasErrors) {
    throw new TransformerProxyError(
      `Request failed for ${DESTINATION} with status: ${status}`,
      status,
      { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
      '',
      buildJobStates(response, status, rudderJobMetadata),
    );
  }

  return {
    status,
    message: `Request for ${DESTINATION} Processed Successfully`,
    response: buildJobStates(response, status, rudderJobMetadata),
  };
};

function networkHandler(this: {
  responseHandler: typeof responseHandler;
  proxy: typeof proxyRequest;
  prepareProxy: typeof prepareProxyRequest;
  processAxiosResponse: typeof processAxiosResponse;
}) {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
}

export { networkHandler, responseHandler };
