import { get, set } from 'lodash';
import sha256 from 'sha256';
import {
  NetworkError,
  // NetworkInstrumentationError,
  GoogleAdsSDK,
  InstrumentationError,
  isDefinedAndNotNullAndNotEmpty,
} from '@rudderstack/integrations-lib';
import type { GaecPayload } from './types';
// import SqlString from 'sqlstring';
import { prepareProxyRequest } from '../../../adapters/network';
import { isHttpStatusSuccess } from '../../util/index';
import { CONVERSION_ACTION_ID_CACHE_TTL } from './config';
import { getDeveloperToken, getAuthErrCategory } from '../../util/googleUtils';
import CacheClass from '../../util/cache';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import tags from '../../util/tags';
import logger from '../../../logger';

/** Minimal interface for the Cache utility (`src/v0/util/cache.js`). */
interface CacheInstance {
  get(key: string, storeFunction: () => Promise<string | undefined>): Promise<string | undefined>;
}

/** Shape of the SDK response from `googleAds.addConversionAdjustMent`. */
interface SdkResponse {
  statusCode: number;
  // absent on the SDK's client-error responses
  responseBody?: unknown;
  headers?: Record<string, unknown>;
}

/** Shape of a client-error or application-error response from `googleAds.getConversionActionId`. */
interface SdkErrorResponse {
  type: string;
  statusCode: number;
  message?: string;
  responseBody?: unknown;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSdkErrorResponse = (value: unknown): value is SdkErrorResponse =>
  isObject(value) && typeof value.type === 'string';

/** Shape of `destinationResponse.response` when a partial failure is present. */
interface PartialFailureBody {
  partialFailureError?: { code: number; message?: string };
}

const isPartialFailureBody = (value: unknown): value is PartialFailureBody => isObject(value);

const conversionActionIdCache: CacheInstance = new CacheClass(
  'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_ACTION_ID',
  CONVERSION_ACTION_ID_CACHE_TTL,
);

/**
 * This function is used for collecting the conversionActionId using the conversion name
 */
const getConversionActionId = async ({
  params,
  googleAds,
}: {
  params: { event: string; customerId: string };
  googleAds: { getConversionActionId: (event: string) => Promise<unknown> };
}): Promise<string | undefined> => {
  const conversionActionIdKey = sha256(params.event + params.customerId).toString();
  return conversionActionIdCache.get(conversionActionIdKey, async () => {
    const resp: unknown = await googleAds.getConversionActionId(params.event);
    if (typeof resp === 'string') {
      return resp;
    }
    if (resp === null) {
      throw new InstrumentationError(
        'Conversion Action not found, make sure the event name provided on the dashboard is exactly same as the conversion action name in Google Ads',
      );
    }
    if (isSdkErrorResponse(resp) && resp.type === 'client-error') {
      throw new NetworkError(
        `"${String(resp.message)} during Google_adwords_enhanced_conversions response transformation[client-error]"`,
        resp.statusCode,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(resp.statusCode),
        },
        resp,
        getAuthErrCategory({ response: resp, status: resp.statusCode }),
      );
    }

    if (isSdkErrorResponse(resp) && resp.type === 'application-error') {
      throw new NetworkError(
        `"${JSON.stringify(resp.responseBody)} during Google_adwords_enhanced_conversions response transformation"`,
        resp.statusCode,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(resp.statusCode),
        },
        resp.responseBody,
        getAuthErrCategory({ response: resp.responseBody, status: resp.statusCode }),
      );
    }
    throw new NetworkError(
      `"${JSON.stringify(resp)} during Google_adwords_enhanced_conversions response transformation"`,
      500,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(500),
      },
      resp,
    );
  });
};

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
const gaecProxyRequest = async (request: GaecProxyRequest): Promise<SdkResponse> => {
  const { body, params } = request;
  // Method syntax (not arrow-function properties) is deliberate: it keeps parameter checks
  // bivariant, so the SDK instance stays assignable to this minimal boundary interface even
  // though the SDK declares stricter payload types than the loosely typed proxy payload.
  const googleAds: {
    getConversionActionId(event: string): Promise<unknown>;
    addConversionAdjustMent(payload: GaecPayload): Promise<SdkResponse>;
  } = new GoogleAdsSDK.GoogleAds(
    {
      accessToken: params.accessToken,
      customerId: params.customerId,
      // in-flight payloads built by the legacy JS transformer may carry a numeric
      // loginCustomerId; the SDK config field is typed string
      loginCustomerId:
        params.subAccount && params.loginCustomerId ? String(params.loginCustomerId) : '',
      developerToken: getDeveloperToken(),
    },
    {
      httpClient: {
        // `statsClient` was never exported by util/stats, so the legacy `require` destructure
        // always wired `undefined` here; kept explicit to preserve the SDK httpClient shape.
        statsClient: undefined,
        // logger.js's `requestLog`/`responseLog` destructure their second argument and treat
        // `metadata` as required, while the SDK's IHttpLogger declares both as optional;
        // adapt so a no-data or no-metadata call can't crash the logger.
        logger: {
          ...logger,
          requestLog: (message, data) => {
            if (data) {
              logger.requestLog(message, {
                metadata: undefined,
                ...data,
                requestDetails: {
                  url: undefined,
                  body: undefined,
                  method: undefined,
                  ...data.requestDetails,
                },
              });
            }
          },
          responseLog: (message, data) => {
            if (data) {
              logger.responseLog(message, {
                metadata: undefined,
                ...data,
                responseDetails: {
                  body: undefined,
                  status: undefined,
                  headers: undefined,
                  ...data.responseDetails,
                },
              });
            }
          },
        },
      },
    },
  );
  const conversionActionId = await getConversionActionId({
    params,
    googleAds,
  });

  // A request may carry multiple conversion adjustments when events are batched. They all
  // share the same conversion name (grouping key), so the single resolved conversionActionId
  // applies to every adjustment. For the non-batched path this is an array of one.
  body.JSON.conversionAdjustments.forEach((_, index) => {
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

const gaecProcessAxiosResponse = (
  sdkResponse: SdkResponse,
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
