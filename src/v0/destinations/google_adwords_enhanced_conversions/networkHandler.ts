import { get, set } from 'lodash';
import {
  NetworkError,
  // NetworkInstrumentationError,
  isDefinedAndNotNullAndNotEmpty,
} from '@rudderstack/integrations-lib';
import type { GaecPayload, GaecSdkResponse } from './types';
// import SqlString from 'sqlstring';
import { prepareProxyRequest } from '../../../adapters/network';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import { isHttpStatusSuccess } from '../../util/index';
import { getAuthErrCategory } from '../../util/googleUtils';
// The SDK client builder, the conversion action lookup and its cache live in ./utils because
// routerTransform needs the lookup too when the framework transport is enabled; both paths must
// share the one cache.
import { buildGoogleAdsClient, getConversionActionId, isObject } from './utils';
import tags from '../../util/tags';

/** Shape of `destinationResponse.response` when a partial failure is present. */
interface PartialFailureBody {
  partialFailureError?: { code: number; message?: string };
}

const isPartialFailureBody = (value: unknown): value is PartialFailureBody => isObject(value);

interface GaecProxyRequest {
  body: { JSON: GaecPayload };
  params: {
    accessToken: string;
    customerId: string;
    loginCustomerId?: string | number;
    subAccount?: boolean;
    event: string;
  };
}

/**
 * This function is responsible for collecting the conversionActionId
 * and calling the enhanced conversion.
 */
const gaecProxyRequest = async (request: GaecProxyRequest): Promise<GaecSdkResponse> => {
  const { body, params } = request;
  if (!params?.event) {
    const error = new NetworkError(
      '[Google Ads Enhanced Conversions] new-shape payload reached legacy proxy after transport flag flip',
      500,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.RETRYABLE,
      },
      { status: 500, response: 'new-shape payload reached legacy proxy' },
    );
    error.statTags[tags.TAG_NAMES.META] = 'gaec_transport_flag_shape_mismatch_new_to_legacy';
    throw error;
  }
  // in-flight payloads built by the legacy JS transformer may carry a numeric
  // loginCustomerId; the SDK config field is typed string
  const loginCustomerId = params.subAccount ? String(params.loginCustomerId) : '';
  const googleAds = buildGoogleAdsClient({
    accessToken: params.accessToken,
    customerId: params.customerId,
    loginCustomerId,
  });
  const conversionActionId = await getConversionActionId({
    event: params.event,
    customerId: params.customerId,
    loginCustomerId,
    accessToken: params.accessToken,
  });

  // A request may carry multiple conversion adjustments when events are batched. They all
  // share the same conversion name (grouping key), so the single resolved conversionActionId
  // applies to every adjustment. For the non-batched path this is an array of one.
  body.JSON.conversionAdjustments!.forEach((_, index) => {
    set(body.JSON, `conversionAdjustments[${index}].conversionAction`, `${conversionActionId}`);
  });

  const response = await googleAds.addConversionAdjustMent(body.JSON);

  return response;
};

/** The destination response shape shared by the handler params and result. */
interface GaecDestinationResponse {
  status: number;
  response: unknown;
  headers?: Record<string, unknown>;
}

interface GaecResponseHandlerParams {
  destinationResponse: GaecDestinationResponse;
}

interface GaecV0HandlerResult {
  status: number;
  message: string;
  destinationResponse: GaecDestinationResponse;
}

/**
 * Adapts the Google Ads SDK's `{ statusCode, responseBody }` to the `{ status, response }` the
 * delivery path expects. Only ever sees an SDK response: when the framework owns the transport it
 * sends the request itself and normalizes the reply with the shared `processAxiosResponse`,
 * without going through this handler at all.
 */
const gaecProcessAxiosResponse = (
  sdkResponse: GaecSdkResponse,
): { response: unknown; status: number; headers?: Record<string, unknown> } => ({
  response: sdkResponse.responseBody,
  status: sdkResponse.statusCode,
  ...(isDefinedAndNotNullAndNotEmpty(sdkResponse.headers) ? { headers: sdkResponse.headers } : {}),
});

const gaecResponseHandler = (responseParams: GaecResponseHandlerParams): GaecV0HandlerResult => {
  const { destinationResponse } = responseParams;
  const message = 'Request Processed Successfully';
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // for google ads enhance conversions the partialFailureError returns with status 200
    // a successful 200 may also have an empty/undefined body (no partial failures),
    // so guard against reading partialFailureError off a non-object body
    const responseBody = destinationResponse.response;
    const partialFailureError = isPartialFailureBody(responseBody)
      ? responseBody.partialFailureError
      : undefined;
    // non-zero code signifies partialFailure
    // Ref - https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
    if (partialFailureError && partialFailureError.code !== 0) {
      throw new NetworkError(
        JSON.stringify(partialFailureError),
        400,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400),
        },
        partialFailureError,
      );
    }

    return {
      status,
      message,
      destinationResponse,
    };
  }
  // non-2xx status — extract error message and throw
  const { response } = destinationResponse;
  const errMessage: string = get(response, 'error.message', '');
  throw new NetworkError(
    `${errMessage}" during Google_adwords_enhanced_conversions response transformation`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    response,
    getAuthErrCategory(destinationResponse),
  );
};

// PascalCase class name (fixes lint); re-exported under the lowercase `networkHandler` alias
// so networkHandlerFactory.js's `networkHandler.networkHandler` lookup keeps working.
class NetworkHandler {
  proxy: typeof gaecProxyRequest;

  responseHandler: typeof gaecResponseHandler;

  processAxiosResponse: typeof gaecProcessAxiosResponse;

  prepareProxy: typeof prepareProxyRequest;

  constructor() {
    this.proxy = gaecProxyRequest;
    this.responseHandler = gaecResponseHandler;
    this.processAxiosResponse = gaecProcessAxiosResponse;
    this.prepareProxy = prepareProxyRequest;
  }
}

export { NetworkHandler as networkHandler, gaecProxyRequest, gaecProcessAxiosResponse };
