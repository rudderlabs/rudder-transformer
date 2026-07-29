import { isHttpStatusSuccess } from '../../../v0/util/index';
import { proxyRequest, prepareProxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import tags from '../../../v0/util/tags';
import stats from '../../../util/stats';
import type { DeliveryJobState, DeliveryV1Response, ProxyMetdata } from '../../../types';

const DEST = 'BRAZE_AUDIENCE';

/**
 * Permanent Braze `/users/track` identity error `type` values.
 * Docs list uppercase enums; live `/users/track/bulk` often returns human
 * messages (e.g. "'external_id' must be fewer than 988 bytes") instead.
 */
const ABORTED_IDENTITY_TYPES = new Set([
  'BLACKLISTED_EXTERNAL_USER_ID',
  'EXTERNAL_USER_ID_TOO_LARGE',
]);

const isIdentityAborted = (type?: string): boolean => {
  if (!type) return false;
  if (ABORTED_IDENTITY_TYPES.has(type)) return true;
  // Live Braze message forms for permanent identity failures (not retryable).
  return (
    /external_user_id_too_large|blacklisted_external_user_id/i.test(type) ||
    /external_id.*(?:fewer|bytes|too\s*large|blacklist)/i.test(type) ||
    /blacklist(?:ed)?.*external_id/i.test(type)
  );
};

type BrazeAudienceProxyParams = {
  destinationResponse: {
    response?: {
      message?: string;
      errors?: Array<{ type?: string; input_array?: string; index?: number }>;
      attributes_processed?: number;
    };
    status: number;
  };
  rudderJobMetadata: ProxyMetdata[];
  destinationRequest?: { body?: { JSON?: { attributes?: Array<{ external_id?: string }> } } };
};

/**
 * Classify Braze `/users/track/bulk` responses into per-record outcomes.
 * Uses destination-scoped `braze_audience_partial_failure` (not shared `braze_partial_failure`).
 */
const responseHandler = (responseParams: BrazeAudienceProxyParams): DeliveryV1Response => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const { response, status } = destinationResponse;
  const destinationId = rudderJobMetadata[0]?.destinationId ?? '';
  const workspaceId = rudderJobMetadata[0]?.workspaceId ?? '';

  if (!isHttpStatusSuccess(status)) {
    const errorMessage = JSON.stringify(response?.message ?? response) || 'unknown error';
    const responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    }));

    // HTTP status classification/throughput: use framework metrics
    // (outgoing_request_count, getDynamicErrorType) — don't re-count here.
    throw new TransformerProxyError(
      `${DEST}: Error during response transformation. ${errorMessage}`,
      status,
      { [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
      '',
      responseWithIndividualEvents,
    );
  }

  const errors = response?.errors ?? [];

  if (errors.length > 0) {
    // Own metric — do not reuse event-stream `braze_partial_failure` (pre-registered untagged).
    stats.increment('braze_audience_partial_failure', {
      destinationId,
      workspaceId,
    });
  }

  const failedByIndex = new Map<number, { type?: string; message: string }>();
  let hasUnindexedError = false;
  let unindexedMessage = 'braze_partial_error_unindexed';
  for (const err of errors) {
    if (typeof err.index === 'number') {
      failedByIndex.set(err.index, {
        type: err.type,
        message: err.type || 'braze_partial_error',
      });
    } else {
      hasUnindexedError = true;
      if (typeof err.type === 'string' && err.type.length > 0) {
        unindexedMessage = err.type;
      }
    }
  }

  const jobStates: DeliveryJobState[] = rudderJobMetadata.map((metadata, idx) => {
    const fail = failedByIndex.get(idx);
    if (!fail) {
      // Unindexed Braze errors cannot be correlated — mark unmapped jobs retryable
      // so we never report success for a batch Braze flagged as partially failed.
      if (hasUnindexedError) {
        stats.increment('braze_audience_retryable', {
          destinationId,
          workspaceId,
          reason: 'partial_unindexed',
        });
        return { statusCode: 500, metadata, error: unindexedMessage };
      }
      return { statusCode: 200, metadata, error: 'success' };
    }

    const isIdentity = isIdentityAborted(fail.type);

    if (isIdentity) {
      stats.increment('braze_audience_aborted', {
        destinationId,
        workspaceId,
      });
      return { statusCode: 400, metadata, error: fail.message };
    }

    stats.increment('braze_audience_retryable', {
      destinationId,
      workspaceId,
      reason: 'partial',
    });
    // Retryable partials: status so the platform can retry the record.
    return { statusCode: 500, metadata, error: fail.message };
  });

  return {
    status,
    message: `[${DEST} Response Handler] - Request Processed Successfully`,
    destinationResponse,
    response: jobStates,
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
