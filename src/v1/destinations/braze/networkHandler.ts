import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { TAG_NAMES } from '../../../v0/util/tags';
import { isHttpStatusSuccess } from '../../../v0/util/index';
import stats from '../../../util/stats';
import type {
  DeliveryJobState,
  DeliveryV1Response,
  ProxyMetdata,
  ProxyV1Request,
} from '../../../types';
import { BrazeErrorEntry, BrazeResponseHandlerParams } from '../../../v0/destinations/braze/types';

const DESTINATION = 'braze';

// HTTP 296 — "Delivered with Warning". Emitted per originating job when Braze
// returns a 2xx with `message: "success"` + a non-empty `errors[]` that
// identifies specific per-item failures inside a /users/track call.
// Contract: rudder-server treats 296 as a delivered-but-warned outcome for
// alerting; the batch itself remains a success at the transport level.
const HTTP_STATUS_DELIVERED_WITH_WARNING = 296;

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

const isTrackInputArray = (value: string): value is TrackInputArray =>
  (TRACK_INPUT_ARRAYS as readonly string[]).includes(value);

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

// Read a metadata's per-track-input-array index array. Returns undefined when
// destInfo is missing OR the field isn't a number array — either signals we
// can't correlate this job against warned indices.
const readIndicesFor = (
  metadata: ProxyMetdata,
  inputArray: TrackInputArray,
): number[] | undefined => {
  const info = metadata.destInfo;
  if (!info) return undefined;
  const raw = info[DEST_INFO_KEY[inputArray]];
  if (!Array.isArray(raw)) return undefined;
  return raw.every((n) => typeof n === 'number') ? (raw as number[]) : undefined;
};

// Build per-input-array maps from Braze `errors[]` → { index → error.type }.
// The map preserves the FIRST error.type seen for each (input_array, index)
// pair; when a job spans multiple warned positions, only the first hit's
// type is surfaced verbatim.
type WarnedIndexMap = Map<number, string>;
const buildWarnedIndexMaps = (
  errors: BrazeErrorEntry[],
): Record<TrackInputArray, WarnedIndexMap> => {
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

// True when every metadata in the batch carries a `destInfo` (present, but
// possibly empty).
const allMetadataHaveDestInfo = (rudderJobMetadata: ProxyMetdata[]): boolean =>
  rudderJobMetadata.every((m) => m.destInfo !== undefined);

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
        if (typeof errorType === 'string') hits.push(errorType);
      }
    }
  }
  return hits;
};

// Separator for concatenating multiple warned error.type strings on a single
// 296 job — chosen for readability when the field is logged verbatim.
const ERROR_TYPE_JOIN = '; ';

// Map every metadata to its DeliveryJobState. Jobs that intersect at least
// one warned index get 296 with all matching Braze error.type strings
// concatenated (separated by `; `); others get 200 with the full response
// body (matching the happy-path shape).
const buildTrackPartialFailureStates = (
  response: unknown,
  rudderJobMetadata: ProxyMetdata[],
  warned: Record<TrackInputArray, WarnedIndexMap>,
  destinationId: string,
): DeliveryJobState[] => {
  const successBody = JSON.stringify(response) ?? '';
  const states: DeliveryJobState[] = [];
  for (const metadata of rudderJobMetadata) {
    const errorTypes = collectMatchingErrorTypes(metadata, warned);
    if (errorTypes.length > 0) {
      stats.increment('braze_delivered_with_warning', { destination_id: destinationId });
      states.push({
        statusCode: HTTP_STATUS_DELIVERED_WITH_WARNING,
        metadata,
        error: errorTypes.join(ERROR_TYPE_JOIN),
      });
    } else {
      states.push({ statusCode: 200, metadata, error: successBody });
    }
  }
  return states;
};

const responseHandler = (params: BrazeResponseHandlerParams): DeliveryV1Response => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = params;
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

  const errors = response?.errors;
  const hasErrors = Array.isArray(errors) && errors.length > 0;
  const brazeMessage = response?.message;

  // Guard 2: application-level error — destination returned 2xx but with an
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

  // Guard 3: partial failure — destination accepted the request but some items
  // within the batch were invalid. Braze signals this with message='success'
  // and a non-empty errors array.
  if (brazeMessage === 'success' && hasErrors) {
    stats.increment('braze_partial_failure');
    const destinationId = rudderJobMetadata[0]?.destinationId ?? '';

    // Only /users/track responses carry per-item errors correlatable back to
    // originating jobs. Subscription-groups and alias-merge responses surface
    // a single top-level message that applies uniformly to the whole call;
    // for those, every job gets 200. We dispatch on the outgoing endpoint
    // (via destinationRequest.endpointPath) rather than inspecting
    // error.input_array values so that if Braze ever adds a new sub-array on
    // /users/track, correlation still runs.
    if (isTrackEndpoint(destinationRequest) && allMetadataHaveDestInfo(rudderJobMetadata)) {
      const warned = buildWarnedIndexMaps(errors);
      return {
        status,
        message: `Request for ${DESTINATION} Processed Successfully`,
        response: buildTrackPartialFailureStates(
          response,
          rudderJobMetadata,
          warned,
          destinationId,
        ),
      };
    }
    // Defensive fallback: at least one metadata is missing destInfo (an
    // in-flight payload produced when per-job delivery-mapping was OFF at
    // the router-transform side) OR the request targeted a sub/merge
    // endpoint. Fall through to the uniform-200 behavior below.
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
