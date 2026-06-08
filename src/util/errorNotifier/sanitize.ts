// Only these metadata fields are safe to forward to the error notifier (Bugsnag / logger).
// Everything else on the per-job metadata — notably `secret` (access/refresh/developer
// tokens), plus jobId/userId/attemptNum/dontBatch — is dropped.
export const DEFAULT_ALLOWED_METADATA_FIELDS: string[] = [
  'sourceId',
  'destinationId',
  'workspaceId',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Returns a new object containing only the allowed fields that are present on `obj`.
 */
const pickFields = (obj: unknown, allowedFields: string[]): Record<string, unknown> => {
  const picked: Record<string, unknown> = {};
  if (!isRecord(obj)) {
    return picked;
  }
  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
      picked[field] = obj[field];
    }
  });
  return picked;
};

/**
 * Reduces a `metadata` value to the allowlisted fields. Handles both a single
 * metadata object and an array of metadata objects.
 */
const allowlistMetadata = (metadataValue: unknown, allowedFields: string[]): unknown => {
  if (Array.isArray(metadataValue)) {
    return metadataValue.map((item) => pickFields(item, allowedFields));
  }
  if (isRecord(metadataValue)) {
    return pickFields(metadataValue, allowedFields);
  }
  return metadataValue;
};

/**
 * Recursively walks an error payload and, wherever a `metadata` key is found,
 * replaces its value with only the allowlisted fields. All other keys are kept.
 *
 * The input is never mutated — it is the same object reference that may also be
 * returned as the delivery response — so we operate on a fresh copy.
 *
 * @param value - any value (object, array, or primitive)
 * @param allowedFields - metadata fields to retain
 * @param seen - internal guard against circular references
 * @returns a sanitized copy of `value`
 */
export const sanitizeMetadata = (
  value: unknown,
  allowedFields: string[] = DEFAULT_ALLOWED_METADATA_FIELDS,
  seen: WeakSet<object> = new WeakSet(),
): unknown => {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Circular reference — drop it rather than recursing infinitely
  if (seen.has(value)) {
    return undefined;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeMetadata(item, allowedFields, seen));
  }

  if (!isRecord(value)) {
    return value;
  }

  const result: Record<string, unknown> = {};
  Object.keys(value).forEach((key) => {
    if (key === 'metadata') {
      result[key] = allowlistMetadata(value[key], allowedFields);
      return;
    }
    result[key] = sanitizeMetadata(value[key], allowedFields, seen);
  });
  return result;
};
