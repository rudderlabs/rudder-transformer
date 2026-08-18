/**
 * Helpers for reading Google Ads API partial-failure responses.
 *
 * On a partial failure the API replies with HTTP 200 and a `partialFailureError` of type
 * google.rpc.Status. Its `details` array carries GoogleAdsFailure payloads; each
 * GoogleAdsError inside names the specific error enum, carries its own human-readable
 * message, and points at the operation that failed via `location.fieldPathElements`.
 *
 * `partialFailureError.message` only ever summarises the FIRST error, e.g.
 * "Multiple errors in 'details'. First error: An internal error has occurred., at conversions[15]".
 * Stamping that single string onto every failed event loses the per-event cause, the error
 * enum (which is what says whether Google considers the failure retryable) and the request
 * id Google asks for when escalating.
 *
 * `trigger` is deliberately NOT surfaced: it echoes the value that caused the error, which
 * for conversion uploads can be a hashed email or a click id, and these strings are persisted
 * in error reporting.
 *
 * Refs:
 * - https://developers.google.com/google-ads/api/docs/best-practices/partial-failures
 * - https://github.com/googleapis/googleapis/blob/master/google/ads/googleads/v23/errors/errors.proto
 */

export type FieldPathElement = {
  fieldName?: string;
  /** Only set for repeated fields; absent for leaf scalars such as `conversion_action`. */
  index?: number;
};

export type GoogleAdsError = {
  /** A oneof, so exactly one key is set, e.g. `{ internalError: 'INTERNAL_ERROR' }`. */
  errorCode?: Record<string, string>;
  message?: string;
  location?: {
    fieldPathElements?: FieldPathElement[];
  };
};

export type GoogleAdsFailure = {
  /** e.g. `type.googleapis.com/google.ads.googleads.v23.errors.GoogleAdsFailure` */
  '@type'?: string;
  errors?: GoogleAdsError[];
  requestId?: string;
};

export type PartialFailureError = {
  code?: number;
  message?: string;
  details?: GoogleAdsFailure[];
};

export type ParsedPartialFailure = {
  /** Errors keyed by the 0-based index of the operation they belong to. */
  errorsByIndex: Map<number, GoogleAdsError[]>;
  /** Errors carrying no operation index, so they apply to the request as a whole. */
  unindexedErrors: GoogleAdsError[];
  requestId?: string;
};

/**
 * Flattens the `errorCode` oneof into an `internalError: INTERNAL_ERROR` label.
 */
export const getErrorCodeLabel = (error: GoogleAdsError): string | undefined => {
  const { errorCode } = error ?? {};
  if (!errorCode || typeof errorCode !== 'object') {
    return undefined;
  }
  const entry = Object.entries(errorCode).find(([, value]) => typeof value === 'string');
  return entry ? `${entry[0]}: ${entry[1]}` : undefined;
};

/**
 * Resolves which operation an error belongs to. Prefers the element naming `operationField`
 * (e.g. `conversions`) so nested paths such as `conversions[3].conversion_action` resolve to 3.
 *
 * The fallback only considers the FIRST element, because the operation index is always on the
 * outermost repeated field. Scanning every element would mis-attribute an error whose outer
 * element carries no index but whose nested one does — `conversions.user_identifiers[2]` would
 * otherwise be read as operation 2.
 */
export const getOperationIndex = (
  error: GoogleAdsError,
  operationField: string,
): number | undefined => {
  const elements = error?.location?.fieldPathElements;
  if (!Array.isArray(elements)) {
    return undefined;
  }
  const named = elements.find(
    (element) => element?.fieldName === operationField && Number.isInteger(element?.index),
  );
  const outermost = Number.isInteger(elements[0]?.index) ? elements[0] : undefined;
  return named?.index ?? outermost?.index;
};

/**
 * Renders the location as a readable field path, e.g. `conversions[1].conversion_action`, so the
 * offending field survives alongside the error code.
 */
export const getFieldPath = (error: GoogleAdsError): string | undefined => {
  const elements = error?.location?.fieldPathElements;
  if (!Array.isArray(elements)) {
    return undefined;
  }
  const path = elements
    .filter((element) => element?.fieldName)
    .map((element) =>
      Number.isInteger(element?.index)
        ? `${element.fieldName}[${element.index}]`
        : element.fieldName,
    )
    .join('.');
  return path || undefined;
};

/**
 * Groups the individual GoogleAdsErrors of a partial failure by the operation they refer to.
 */
export const parsePartialFailure = (
  partialFailureError: PartialFailureError | undefined,
  operationField = 'conversions',
): ParsedPartialFailure => {
  const errorsByIndex = new Map<number, GoogleAdsError[]>();
  const unindexedErrors: GoogleAdsError[] = [];
  let requestId: string | undefined;

  const details = Array.isArray(partialFailureError?.details) ? partialFailureError.details : [];
  details.forEach((detail) => {
    requestId = requestId ?? detail?.requestId;
    const errors = Array.isArray(detail?.errors) ? detail.errors : [];
    errors.forEach((error) => {
      const index = getOperationIndex(error, operationField);
      if (typeof index !== 'number') {
        unindexedErrors.push(error);
        return;
      }
      const existing = errorsByIndex.get(index);
      if (existing) {
        existing.push(error);
      } else {
        errorsByIndex.set(index, [error]);
      }
    });
  });

  return { errorsByIndex, unindexedErrors, requestId };
};

/**
 * Request-wide errors are replayed onto every failed event, so a response carrying many of them
 * would otherwise be rendered once per event — O(events x errors). These caps keep the size of
 * what we emit independent of what the destination returns.
 */
export const MAX_ERRORS_PER_EVENT = 3;
export const MAX_ERROR_LENGTH = 1024;

const describeError = (error: GoogleAdsError, fallbackMessage: string): string => {
  const code = getErrorCodeLabel(error);
  const fieldPath = getFieldPath(error);
  // Only fall back to the batch summary when Google gave us nothing specific at all. Splicing it
  // in beside a code or path would describe a different error than the one being annotated.
  const parts = [error?.message || (code || fieldPath ? '' : fallbackMessage)];
  if (code) {
    parts.push(`[${code}]`);
  }
  if (fieldPath) {
    parts.push(`at ${fieldPath}`);
  }
  return parts.filter(Boolean).join(' ');
};

/**
 * Renders the errors for a single failed event, falling back to the summary message when
 * Google gave us nothing more specific. The request id is appended so it reaches error
 * reporting, where it is the only handle Google support can act on.
 */
export const formatGoogleAdsErrors = (
  errors: GoogleAdsError[] | undefined,
  fallbackMessage: string,
  requestId?: string,
): string => {
  const all = errors ?? [];
  const described = all
    .slice(0, MAX_ERRORS_PER_EVENT)
    .map((error) => describeError(error, fallbackMessage))
    .filter(Boolean);

  let summary = described.length > 0 ? described.join('; ') : fallbackMessage;
  if (summary.length > MAX_ERROR_LENGTH) {
    summary = `${summary.slice(0, MAX_ERROR_LENGTH)}... (truncated)`;
  }
  // Appended after truncation so the dropped-error count and the request id, both of which are
  // short and load-bearing for debugging, cannot be the parts that get cut.
  const omitted = all.length - MAX_ERRORS_PER_EVENT;
  if (omitted > 0) {
    summary = `${summary}; (+${omitted} more)`;
  }
  return requestId ? `${summary} (requestId: ${requestId})` : summary;
};
