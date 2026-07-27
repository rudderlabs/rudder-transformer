import { isHttpStatusSuccess } from '../../../v0/util/index';
import { proxyRequest, prepareProxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import tags from '../../../v0/util/tags';
import type { DeliveryJobState, DeliveryV1Response, ProxyMetdata } from '../../../types';

const stats = require('../../../util/stats');

const DEST = 'BRAZE_AUDIENCE';

/**
 * Permanent Braze `/users/track` identity error `type` values.
 * Docs list uppercase enums; live `/users/track/bulk` often returns human
 * messages (e.g. "'external_id' must be fewer than 988 bytes") instead.
 */
const HARD_BOUNCE_IDENTITY_TYPES = new Set([
  'BLACKLISTED_EXTERNAL_USER_ID',
  'EXTERNAL_USER_ID_TOO_LARGE',
]);

const isIdentityHardBounce = (type?: string): boolean => {
  if (!type) return false;
  if (HARD_BOUNCE_IDENTITY_TYPES.has(type)) return true;
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
 * Destination-scoped partial-failure metric (do not share untagged braze_partial_failure).
 */
const responseHandler = (responseParams: BrazeAudienceProxyParams): DeliveryV1Response => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
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

    if (status === 401) {
      stats.increment('braze_audience_hard_bounce', {
        destinationId,
        workspaceId,
        reason: 'unauthorized',
      });
      stats.increment('braze_audience_sync_disabled', {
        destinationId,
        workspaceId,
        reason: 'unauthorized',
      });
    } else if (status === 429 || status >= 500) {
      stats.increment('braze_audience_soft_bounce', {
        destinationId,
        workspaceId,
        status: String(status),
      });
    }

    throw new TransformerProxyError(
      `${DEST}: Error during response transformation. ${errorMessage}`,
      status,
      { [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
      '',
      responseWithIndividualEvents,
    );
  }

  const attributes = destinationRequest?.body?.JSON?.attributes ?? [];
  const errors = response?.errors ?? [];

  if (errors.length > 0) {
    // Destination-tagged — never the untagged event-stream braze_partial_failure.
    stats.increment('braze_partial_failure', {
      destination: DEST,
      destinationId,
      workspaceId,
    });
  }

  stats.increment('braze_audience_batch_sent', {
    destinationId,
    workspaceId,
    items: String(attributes.length > 0 ? attributes.length : rudderJobMetadata.length),
  });

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
      // Unindexed Braze errors cannot be correlated — soft-bounce unmapped jobs
      // so we never report success for a batch Braze flagged as partially failed.
      if (hasUnindexedError) {
        stats.increment('braze_audience_soft_bounce', {
          destinationId,
          workspaceId,
          reason: 'partial_unindexed',
        });
        return { statusCode: 500, metadata, error: unindexedMessage };
      }
      return { statusCode: 200, metadata, error: 'success' };
    }

    const isIdentity = isIdentityHardBounce(fail.type);

    if (isIdentity) {
      stats.increment('braze_audience_hard_bounce', {
        destinationId,
        workspaceId,
        reason: 'identity',
      });
      return { statusCode: 400, metadata, error: fail.message };
    }

    stats.increment('braze_audience_soft_bounce', {
      destinationId,
      workspaceId,
      reason: 'partial',
    });
    // Soft partials: retryable status so the platform can retry the record.
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
