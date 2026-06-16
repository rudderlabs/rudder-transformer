/**
 * V1 network handler for Google Ads Enhanced Conversions.
 *
 * Reuses the v0 proxy and processAxiosResponse. The response handler returns per-event
 * success/failure statuses on partial failure instead of throwing a single error for the
 * whole batch.
 *
 * This file lives under v1/ so the networkHandlerFactory registers it with
 * handlerVersion='v1', which bypasses the v0→v1 adaptation layer in nativeIntegration.ts.
 */
import { NetworkError } from '@rudderstack/integrations-lib';
import { prepareProxyRequest } from '../../../adapters/network';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import {
  DeliveryJobState,
  ProxyMetdata,
  ResponseHandlerParams,
  ResponseProxyObject,
} from '../../../types';
import { isHttpStatusSuccess, isEmptyObject } from '../../../v0/util';
import { getAuthErrCategory } from '../../../v0/util/googleUtils';
import tags from '../../../v0/util/tags';
import { CommonUtils } from '../../../util/common';
import {
  gaecProxyRequest,
  gaecProcessAxiosResponse,
} from '../../../v0/destinations/google_adwords_enhanced_conversions/networkHandler';

const DEST_TYPE = 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS';

/**
 * Per-event response handler for batched Google Ads Enhanced Conversions requests.
 *
 * When the API returns a partialFailureError alongside a results array, each event
 * is individually mapped to success or failure based on whether its positional entry
 * in results is populated or empty.
 *
 * Ref: https://developers.google.com/google-ads/api/reference/rpc/v17/UploadConversionAdjustmentsResponse
 */
const gaecResponseHandler = (responseParams: ResponseHandlerParams): ResponseProxyObject => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = 'Request Processed Successfully';
  const { status } = destinationResponse;
  const metaDataArray: ProxyMetdata[] = CommonUtils.toArray(rudderJobMetadata);

  if (isHttpStatusSuccess(status)) {
    const { partialFailureError, results } = destinationResponse?.response || {};

    // Fully successful — no partial failure or code 0 means all events succeeded
    if (!partialFailureError || partialFailureError.code === 0) {
      return {
        status,
        message,
        response: metaDataArray.map(
          (metadata): DeliveryJobState => ({
            statusCode: status,
            metadata,
            error: 'success',
          }),
        ),
      };
    }

    // Partial failure: map each event to its result. Empty result = failed event.
    // Ref: https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
    const errorMessage: string = partialFailureError.message || 'unknown error format';
    const responseWithIndividualEvents: DeliveryJobState[] = metaDataArray.map(
      (metadata, i): DeliveryJobState => {
        // The API returns results positionally: a populated object means the event
        // succeeded, an empty object (or missing entry) means it failed.
        // Failed events are always non-retryable data issues (duplicate enhancement,
        // invalid gclid, etc.) so 400 is the appropriate status.
        const eventResponse = results?.[i] ?? {};
        const isEventFailed = isEmptyObject(eventResponse);
        return {
          statusCode: isEventFailed ? 400 : 200,
          metadata,
          error: isEventFailed ? errorMessage : 'success',
        };
      },
    );

    return {
      status: 400,
      message: `[Google Ads Enhanced Conversions]:: ${errorMessage}`,
      destinationResponse,
      statTags: {
        errorCategory: 'network',
        errorType: 'aborted',
        destType: DEST_TYPE,
        module: 'destination',
        implementation: 'native',
        feature: 'dataDelivery',
        destinationId: metaDataArray[0]?.destinationId || '',
        workspaceId: metaDataArray[0]?.workspaceId || '',
      },
      response: responseWithIndividualEvents,
    };
  }

  // Non-2xx status — complete failure for all events
  const { response } = destinationResponse;
  const errMessage = response?.error?.message || '';
  throw new NetworkError(
    `${errMessage}" during Google_adwords_enhanced_conversions response transformation`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    response,
    getAuthErrCategory({ response, status }),
  );
};

function networkHandler(this: any) {
  this.proxy = gaecProxyRequest;
  this.responseHandler = gaecResponseHandler;
  this.processAxiosResponse = gaecProcessAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
}

export { networkHandler, gaecResponseHandler };
