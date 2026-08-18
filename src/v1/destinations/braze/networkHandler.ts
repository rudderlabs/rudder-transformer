import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { TAG_NAMES } from '../../../v0/util/tags';
import { isHttpStatusSuccess } from '../../../v0/util/index';
import { HTTP_STATUS_CODES } from '../../../v0/util/constant';
import stats from '../../../util/stats';
import type { DeliveryJobState, DeliveryV1Response, ProxyMetdata } from '../../../types';
import {
  BrazeError,
  BrazeEvent,
  BrazeProxyV1Request,
  BrazeResponseHandlerParams,
} from '../../../v0/destinations/braze/types';
import { isBrazeEcommerceEventName } from '../../../v0/destinations/braze/ecommerceUtil';

const DESTINATION = 'braze';

const SUCCESS_MESSAGE = `Request for ${DESTINATION} Processed Successfully`;
const failureMessage = (status: number): string =>
  `Request failed for ${DESTINATION} with status: ${status}`;

// Ops-facing metric names — kept as constants so dashboards and alerts have a
// single definition site to grep for.
const METRIC_PARTIAL_FAILURE = 'braze_partial_failure';
const METRIC_DELIVERED_WITH_WARNING = 'braze_delivered_with_warning';
const METRIC_DELIVERY_ABORTED = 'braze_delivery_aborted';

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

// Braze validates each recommended-ecommerce event against its ecommerce event
// schema and reports violations in `errors[i].type`, prefixed with the failing
// item's JSON pointer. Observed forms:
//   The property '#/' did not contain a required property of 'product_id'
//   The property '#/price' of type string did not match the following type: number
// These are per-item payload defects — Braze kept the rest of the batch and
// dropped only the offending item — so the owning job is delivered-with-warning
// rather than aborted.
const ECOMMERCE_SCHEMA_ERROR_TYPE = /^The property '#\//;

// True when the delivery request was aimed at /users/track. Uses the
// framework-populated `endpointPath` on the ProxyV1Request. Absence of the
// field (or a request the framework didn't attach) is treated as non-track:
// the handler falls back to uniform-per-job outcomes rather than mis-attributing.
const isTrackEndpoint = (destinationRequest: BrazeProxyV1Request | undefined): boolean =>
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

// A single warned position matched back to a job: which track sub-array it came
// from, its index within that array, and Braze's verbatim `error.type`.
type WarnedHit = {
  inputArray: TrackInputArray;
  index: number;
  type: string;
};

// Correlate a single metadata against the warned index maps. Returns every
// matching entry across the job's contributions to events/attributes/purchases,
// preserving encounter order. Duplicates are intentionally kept — each hit
// reflects a distinct warned payload item, so the count carries information for
// downstream consumers.
const collectWarnedHits = (
  metadata: ProxyMetdata,
  warned: Record<TrackInputArray, WarnedIndexMap>,
): WarnedHit[] => {
  const hits: WarnedHit[] = [];
  for (const inputArray of TRACK_INPUT_ARRAYS) {
    const indices = readIndicesFor(metadata, inputArray);
    if (indices) {
      for (const index of indices) {
        const type = warned[inputArray].get(index);
        if (type) hits.push({ inputArray, index, type });
      }
    }
  }
  return hits;
};

// The `events[]` we sent on this chunk, positionally aligned with Braze's
// `errors[i].index`. `cleanTrackChunk` omits empty sub-arrays when building the
// body, so an absent `events` is normal rather than a broken contract.
const readSentEvents = (destinationRequest: BrazeProxyV1Request | undefined): BrazeEvent[] => {
  const events = destinationRequest?.body?.JSON?.events;
  // The body is an unvalidated echo of what we sent, so the declared type is a
  // statement of intent rather than a guarantee — check before trusting it.
  return Array.isArray(events) ? events : [];
};

// True when the item we sent at `index` was built by the recommended-ecommerce
// path, identified by its Braze event name — only that path emits those names,
// so it separates ecommerce events from the legacy custom events that share the
// same `events[]` array after chunking.
const isEcommerceEventAt = (sentEvents: BrazeEvent[], index: number): boolean =>
  isBrazeEcommerceEventName(sentEvents[index]?.name);

// A hit is delivered-with-warning only when it is a schema rejection of a
// recommended-ecommerce event. Every other correlated failure aborts its job.
const isEcommerceSchemaWarning = (hit: WarnedHit, sentEvents: BrazeEvent[]): boolean =>
  hit.inputArray === 'events' &&
  isEcommerceEventAt(sentEvents, hit.index) &&
  ECOMMERCE_SCHEMA_ERROR_TYPE.test(hit.type);

// Separator for concatenating multiple warned error.type strings on a single
// job — chosen for readability when the field is logged verbatim.
const ERROR_TYPE_JOIN = '; ';

// Map every metadata to its DeliveryJobState. Jobs that intersect no warned
// index get 200 with the full response body (matching the happy-path shape);
// the rest get 296 when every hit is an ecommerce schema rejection and 400
// otherwise, carrying all matching Braze error.type strings concatenated.
// Pure — the caller aggregates and emits the counters after inspecting the result.
const buildTrackPartialFailureStates = (
  response: unknown,
  rudderJobMetadata: ProxyMetdata[],
  warned: Record<TrackInputArray, WarnedIndexMap>,
  sentEvents: BrazeEvent[],
): DeliveryJobState[] => {
  const successBody = JSON.stringify(response) ?? '';
  return rudderJobMetadata.map((metadata) => {
    const hits = collectWarnedHits(metadata, warned);
    if (hits.length === 0) {
      return { statusCode: 200, metadata, error: successBody };
    }
    // Abort outranks warning: one non-ecommerce-schema hit aborts the whole
    // job, though `error` still carries every hit that matched it.
    const statusCode = hits.every((hit) => isEcommerceSchemaWarning(hit, sentEvents))
      ? HTTP_STATUS_CODES.DELIVERED_WITH_WARNING
      : HTTP_STATUS_CODES.BAD_REQUEST;
    return { statusCode, metadata, error: hits.map((hit) => hit.type).join(ERROR_TYPE_JOIN) };
  });
};

type MetricLabels = { destinationId: string; workspaceId: string };

// Emit `metricName` with the number of states carrying `statusCode`, skipping
// the call entirely when nothing matched so the series stays absent rather than
// reporting a zero.
const countStatesByStatus = (
  states: DeliveryJobState[],
  statusCode: number,
  metricName: string,
  labels: MetricLabels,
): void => {
  const count = states.filter((state) => state.statusCode === statusCode).length;
  if (count > 0) {
    stats.counter(metricName, count, labels);
  }
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

  const errors = response?.errors;
  const hasErrors = Array.isArray(errors) && errors.length > 0;
  const brazeMessage = response?.message;

  // Guard 2: application-level error — destination returned 2xx but the
  // Braze body did not carry `message: "success"`, meaning the entire
  // request was rejected at the application layer despite the transport
  // succeeding. This covers both `message: "failure"` responses (with or
  // without an `errors[]` array) and responses missing the field entirely.
  if (brazeMessage !== 'success') {
    throw new TransformerProxyError(
      failureMessage(status),
      status,
      { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
      '',
      buildJobStates(response, status, rudderJobMetadata),
    );
  }

  // Guard 3: partial failure — destination accepted the request but some items
  // within the batch were invalid. Braze signals this with message='success'
  // and a non-empty errors array. (Guard 2 above already ensured
  // brazeMessage === 'success' on this code path.)
  if (hasErrors) {
    const destinationId = rudderJobMetadata[0]?.destinationId ?? '';
    const workspaceId = rudderJobMetadata[0]?.workspaceId ?? '';
    const labels: MetricLabels = { destinationId, workspaceId };
    stats.increment(METRIC_PARTIAL_FAILURE, labels);

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
      const states = buildTrackPartialFailureStates(
        response,
        rudderJobMetadata,
        warned,
        readSentEvents(destinationRequest),
      );
      countStatesByStatus(
        states,
        HTTP_STATUS_CODES.DELIVERED_WITH_WARNING,
        METRIC_DELIVERED_WITH_WARNING,
        labels,
      );
      countStatesByStatus(states, HTTP_STATUS_CODES.BAD_REQUEST, METRIC_DELIVERY_ABORTED, labels);
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
