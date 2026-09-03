const setValue = require('set-value');
const logger = require('../../logger');

/**
 * A `set-value` call that cannot be crashed by a hostile key.
 *
 * `set-value` refuses to write keys that would corrupt the prototype chain and throws
 * `Cannot set unsafe key: "<key>"`. It validates *every* segment of the path, so
 * `address.constructor` is rejected just like `constructor`. Event payloads carry
 * arbitrary user-supplied keys, so any `set` whose path is built out of message data
 * can hit this. The throw is a plain `Error`, so `generateErrorObject` classifies it as
 * statusCode 500 — a *retryable* status for a payload that can never succeed, which means
 * the job is retried until its TTL instead of being dropped once.
 *
 * This wrapper skips the offending field and leaves the rest of the event intact.
 *
 * Which keys count as unsafe is deliberately NOT duplicated here. `set-value` exposes no
 * predicate for it, so on failure we simply ask `set-value` the same question again against
 * a throwaway target: if it still refuses, the path is what it objected to and the field is
 * skipped; otherwise the failure came from the target object (frozen, exotic setter, ...)
 * and is re-thrown untouched. That keeps this correct for free if the library's rules change.
 *
 * Note the happy path pays nothing: the probe only runs after a write has already failed.
 *
 * @param {object} target object to write into
 * @param {string|symbol|Array|undefined|null} path set-value path. As in `set-value` itself,
 *   a falsy path is a no-op rather than an error — several callers rely on that for
 *   optional keys.
 * @param {*} value value to write
 * @param {object} [options] set-value options, forwarded as-is
 * @returns {object} target, whether or not the write happened
 */
const safeSetValue = (target, path, value, options) => {
  try {
    return setValue(target, path, value, options);
  } catch (error) {
    try {
      setValue({}, path, value, options);
    } catch {
      // set-value objects to the path itself, not to `target`
      logger.info(`Dropping field: set-value rejected the key path "${String(path)}"`);
      return target;
    }
    throw error;
  }
};

module.exports = { safeSetValue };
