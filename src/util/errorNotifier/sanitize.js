/**
 * Recursively removes the given keys from an object/array, at any depth.
 *
 * Used to strip sensitive payload sections (e.g. the per-job `metadata`, which
 * carries `secret.access_token`/`refresh_token`/`developer_token`) before an
 * error payload is handed to the error notifier (Bugsnag / logger).
 *
 * The input is never mutated — it is the same object reference that may also be
 * returned as the delivery response — so we operate on a fresh copy.
 *
 * @param {*} value - any value (object, array, or primitive)
 * @param {string[]} keys - property names to drop wherever they appear
 * @param {WeakSet} seen - internal guard against circular references
 * @returns {*} a copy of `value` with the given keys removed
 */
const stripKeysDeep = (value, keys = ['metadata'], seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Circular reference — drop it rather than recursing infinitely
  if (seen.has(value)) {
    return undefined;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => stripKeysDeep(item, keys, seen));
  }

  const result = {};
  Object.keys(value).forEach((key) => {
    if (keys.includes(key)) {
      return;
    }
    result[key] = stripKeysDeep(value[key], keys, seen);
  });
  return result;
};

module.exports = { stripKeysDeep };
