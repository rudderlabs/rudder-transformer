import { isHttpStatusSuccess } from '../../../v0/util/index';
import { proxyRequest, prepareProxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import tags from '../../../v0/util/tags';
import type { DeliveryJobState, DeliveryV1Response, ProxyMetdata } from '../../../types';

const stats = require('../../../util/stats');

const DEST = 'BRAZE_AUDIENCE';

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
  for (const err of errors) {
    if (typeof err.index === 'number') {
      failedByIndex.set(err.index, {
        type: err.type,
        message: err.type || 'braze_partial_error',
      });
    }
  }

  const jobStates: DeliveryJobState[] = rudderJobMetadata.map((metadata, idx) => {
    const fail = failedByIndex.get(idx);
    if (!fail) {
      return { statusCode: 200, metadata, error: 'success' };
    }

    const isIdentity =
      typeof fail.type === 'string' &&
      /external_id|invalid.*(user|id)|user.?not.?found/i.test(fail.type);

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
