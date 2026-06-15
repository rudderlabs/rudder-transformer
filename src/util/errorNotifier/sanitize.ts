// Only these metadata fields are safe to forward to the error notifier (Bugsnag / logger).
// Everything else on the per-job metadata — notably `secret` (access/refresh/developer
// tokens), plus jobId/userId/attemptNum/dontBatch — is dropped.
const ALLOWED_METADATA_FIELDS = ['sourceId', 'destinationId', 'workspaceId'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Reduce a `metadata` value to the allowlisted fields it actually has. An array is
// reduced element-by-element; a primitive (or null) can't be allowlisted and might
// itself be a secret, so it collapses to {}.
const allowlistMetadata = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(allowlistMetadata);
  }
  if (!isRecord(value)) {
    return {};
  }
  return Object.fromEntries(
    ALLOWED_METADATA_FIELDS.filter((field) =>
      Object.prototype.hasOwnProperty.call(value, field),
    ).map((field) => [field, value[field]]),
  );
};

/**
 * Returns a sanitized deep copy of an error payload: wherever a `metadata` key
 * appears (at any depth) its value is reduced to the allowlisted fields. The input
 * is never mutated — it doubles as the live delivery response — and circular
 * references are dropped rather than followed.
 */
export const sanitizeMetadata = (
  value: unknown,
  seen: WeakSet<object> = new WeakSet(),
): unknown => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  // Only suppress true circular references (a back-edge to an ancestor still being
  // traversed); `seen` tracks the in-progress path and is cleared in `finally`, so
  // shared (non-cyclic) references are preserved rather than dropped.
  if (seen.has(value)) {
    return undefined;
  }
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      return value.map((item) => sanitizeMetadata(item, seen));
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        key === 'metadata' ? allowlistMetadata(val) : sanitizeMetadata(val, seen),
      ]),
    );
  } finally {
    seen.delete(value);
  }
};
