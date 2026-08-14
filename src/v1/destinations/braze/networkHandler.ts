import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { TAG_NAMES } from '../../../v0/util/tags';
import { isHttpStatusSuccess } from '../../../v0/util/index';
import { HTTP_STATUS_CODES } from '../../../v0/util/constant';
import stats from '../../../util/stats';
import type {
  DeliveryJobState,
  DeliveryV1Response,
  ProxyMetdata,
  ProxyV1Request,
} from '../../../types';
import { BrazeError, BrazeResponseHandlerParams } from '../../../v0/destinations/braze/types';

const DESTINATION = 'braze';

const SUCCESS_MESSAGE = `Request for ${DESTINATION} Processed Successfully`;
const failureMessage = (status: number): string =>
  `Request failed for ${DESTINATION} with status: ${status}`;

// Braze's `endpointPath` value for the /users/track endpoint — the only
// endpoint whose response carries per-entry `errors[]` correlatable back to
// originating jobs. Sub/merge responses return a single top-level message
// that applies uniformly to the whole call, so they skip 296 correlation
// entirely and fall through to the uniform per-job outcome path.
const TRACK_ENDPOINT_PATH = 'users/track';

// Braze's `errors[i].input_array` values on /users/track responses,
// corresponding to the three sub-arrays in the request body. Each maps to
// the `destInfo` field name populated by the router transform.
const TRACK_INPUT_ARRAYS = ['events', 'attributes', 'purchases'] as const;
type TrackInputArray = (typeof TRACK_INPUT_ARRAYS)[number];
const TRACK_INPUT_ARRAY_SET = new Set<string>(TRACK_INPUT_ARRAYS);

const isTrackInputArray = (value: string): value is TrackInputArray =>
  TRACK_INPUT_ARRAY_SET.has(value);

// `destInfo` field name for each track input_array. Kept as a plain lookup
// so both the correlation logic and any future validation stay consistent.
const DEST_INFO_KEY: Record<TrackInputArray, string> = {
  events: 'eventsIndices',
  attributes: 'attributesIndices',
  purchases: 'purchasesIndices',
};

// True when the delivery request was aimed at /users/track. Uses the
// framework-populated `endpointPath` on the ProxyV1Request. Absence of the
// field (or a request the framework didn't attach) is treated as non-track:
// the handler falls back to uniform-per-job outcomes rather than mis-attributing.
const isTrackEndpoint = (destinationRequest: ProxyV1Request | undefined): boolean =>
  destinationRequest?.endpointPath === TRACK_ENDPOINT_PATH;

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

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((n) => typeof n === 'number');

// Read a metadata's per-track-input-array index array. Returns undefined when
// destInfo is missing OR the field isn't a number array — either signals we
// can't correlate this job against warned indices.
const readIndicesFor = (
  metadata: ProxyMetdata,
  inputArray: TrackInputArray,
): number[] | undefined => {
  const raw = metadata.destInfo?.[DEST_INFO_KEY[inputArray]];
  return isNumberArray(raw) ? raw : undefined;
};

// Build per-input-array maps from Braze `errors[]` → { index → error.type }.
// The map preserves the FIRST error.type seen for each (input_array, index)
// pair; when a job spans multiple warned positions, only the first hit's
// type is surfaced verbatim.
type WarnedIndexMap = Map<number, string>;
const buildWarnedIndexMaps = (errors: BrazeError[]): Record<TrackInputArray, WarnedIndexMap> => {
  const maps: Record<TrackInputArray, WarnedIndexMap> = {
    events: new Map(),
    attributes: new Map(),
    purchases: new Map(),
  };
  for (const err of errors) {
    if (isTrackInputArray(err.input_array) && !maps[err.input_array].has(err.index)) {
      maps[err.input_array].set(err.index, err.type);
    }
  }
  return maps;
};

// Correlate a single metadata against the warned index maps. Returns every
// matching Braze `error.type` (verbatim) across the job's contributions to
// events/attributes/purchases, preserving encounter order. Duplicates are
// intentionally kept — each hit reflects a distinct warned payload item,
// so the count carries information for downstream consumers.
const collectMatchingErrorTypes = (
  metadata: ProxyMetdata,
  warned: Record<TrackInputArray, WarnedIndexMap>,
): string[] => {
  const hits: string[] = [];
  for (const inputArray of TRACK_INPUT_ARRAYS) {
    const indices = readIndicesFor(metadata, inputArray);
    if (indices) {
      for (const idx of indices) {
        const errorType = warned[inputArray].get(idx);
        if (errorType) hits.push(errorType);
      }
    }
  }
  return hits;
};

// Separator for concatenating multiple warned error.type strings on a single
// 296 job — chosen for readability when the field is logged verbatim.
const ERROR_TYPE_JOIN = '; ';
const APPLICATION_ERROR_STATUS_CODE = HTTP_STATUS_CODES.BAD_REQUEST;

type BrazeResponseBody = {
  message?: unknown;
  errors?: unknown;
};

const isBrazeResponseBody = (response: unknown): response is BrazeResponseBody =>
  typeof response === 'object' && response !== null;

const isBrazeError = (error: unknown): error is BrazeError =>
  typeof error === 'object' &&
  error !== null &&
  typeof (error as BrazeError).type === 'string' &&
  typeof (error as BrazeError).input_array === 'string' &&
  typeof (error as BrazeError).index === 'number';

// Map every metadata to its DeliveryJobState. Jobs that intersect at least
// one warned index get 296 with all matching Braze error.type strings
// concatenated (separated by `; `); others get 200 with the full response
// body (matching the happy-path shape). Pure — the caller aggregates and
// emits the delivered-with-warning metric after inspecting the result.
const buildTrackPartialFailureStates = (
  response: unknown,
  rudderJobMetadata: ProxyMetdata[],
  warned: Record<TrackInputArray, WarnedIndexMap>,
): DeliveryJobState[] => {
  const successBody = JSON.stringify(response) ?? '';
  return rudderJobMetadata.map((metadata) => {
    const errorTypes = collectMatchingErrorTypes(metadata, warned);
    if (errorTypes.length > 0) {
      return {
        statusCode: HTTP_STATUS_CODES.DELIVERED_WITH_WARNING,
        metadata,
        error: errorTypes.join(ERROR_TYPE_JOIN),
      };
    }
    return { statusCode: 200, metadata, error: successBody };
  });
};

const responseHandler = (params: BrazeResponseHandlerParams): DeliveryV1Response => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = params;
  const { response, status } = destinationResponse;

  // Guard 1: non-2xx HTTP status — destination rejected the request entirely
  if (!isHttpStatusSuccess(status)) {
    throw new TransformerProxyError(
      failureMessage(status),
      status,
      { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
      '',
      buildJobStates(response, status, rudderJobMetadata),
    );
  }

  const responseBody = isBrazeResponseBody(response) ? response : {};
  const rawErrors = Array.isArray(responseBody.errors) ? responseBody.errors : [];
  const errors = rawErrors.filter(isBrazeError);
  const hasErrors = rawErrors.length > 0;
  const brazeMessage = responseBody.message;

  // Guard 2: application-level error — destination returned 2xx but the
  // Braze body did not carry `message: "success"`, meaning the entire
  // request was rejected at the application layer despite the transport
  // succeeding. Rudder-server classifies per-job states, so surface this as a
  // per-job 400 even though Braze transported it as 2xx. This avoids 2xx
  // TransformerProxyError normalization turning true application failures into
  // unexpected abort-style outcomes with statusCode 200.
  if (brazeMessage !== 'success') {
    throw new TransformerProxyError(
      failureMessage(APPLICATION_ERROR_STATUS_CODE),
      APPLICATION_ERROR_STATUS_CODE,
      { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(APPLICATION_ERROR_STATUS_CODE) },
      destinationResponse,
      '',
      buildJobStates(response, APPLICATION_ERROR_STATUS_CODE, rudderJobMetadata),
    );
  }

  // Guard 3: partial failure — destination accepted the request but some items
  // within the batch were invalid. Braze signals this with message='success'
  // and a non-empty errors array. (Guard 2 above already ensured
  // brazeMessage === 'success' on this code path.)
  if (hasErrors) {
    const destinationId = rudderJobMetadata[0]?.destinationId ?? '';
    const workspaceId = rudderJobMetadata[0]?.workspaceId ?? '';
    stats.increment('braze_partial_failure', {
      destination_id: destinationId,
      workspace_id: workspaceId,
    });

    // Only /users/track responses carry per-item errors correlatable back to
    // originating jobs. Subscription-groups and alias-merge responses surface
    // a single top-level message that applies uniformly to the whole call;
    // for those, every job gets 200. We dispatch on the outgoing endpoint
    // (via destinationRequest.endpointPath) rather than inspecting
    // error.input_array values so that if Braze ever adds a new sub-array on
    // /users/track, correlation still runs. Jobs whose metadata is missing
    // destInfo default to 200 inside the builder (nothing to correlate).
    if (isTrackEndpoint(destinationRequest)) {
      const warned = buildWarnedIndexMaps(errors);
      const states = buildTrackPartialFailureStates(response, rudderJobMetadata, warned);
      const warnedCount = states.filter(
        (s) => s.statusCode === HTTP_STATUS_CODES.DELIVERED_WITH_WARNING,
      ).length;
      if (warnedCount > 0) {
        stats.counter('braze_delivered_with_warning', warnedCount, {
          destination_id: destinationId,
          workspace_id: workspaceId,
        });
      }
      return { status, message: SUCCESS_MESSAGE, response: states };
    }
    // Non-track endpoint (sub/merge) — fall through to the uniform-200
    // behavior below.
  }

  return {
    status,
    message: SUCCESS_MESSAGE,
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
