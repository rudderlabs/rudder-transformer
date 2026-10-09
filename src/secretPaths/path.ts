/**
 * The path grammar published in `secretPaths`, as executable code rather than prose.
 *
 * The generator writes paths with these rules and the Go consumer applies them with sjson. The
 * escape and un-escape operations live together so generated paths can be round-trip tested.
 *
 * Grammar:
 *   headers.Authorization      a field of the outbound request
 *   headers.X-Api\.Key         a key whose name contains a separator, escaped
 *   body.JSON.messages.#.from  `#` matches every element of an array
 *   params.bd[0]              a key literally named `bd[0]`; brackets are not special
 */

/** Marks an array position during derivation, before it collapses to a wildcard. */
export const ARRAY_MARKER = '#';

/**
 * The request field that is never emitted as a path, however clearly it carries a credential.
 *
 * A URL is already exposed outside our control - to proxies, to TLS SNI, and in the provider's own
 * access logs - so masking it in Live Events protects little while removing the single most useful
 * field for diagnosing a delivery failure. Most endpoints that derive as secret-carrying only do
 * so because `secretKeys` declares an identifier that happens to sit in the host or path, such as
 * a subdomain or an account id, which is not a credential.
 *
 * It lives here, beside the grammar, because the generator omits it while the Go consumer has to
 * know the same name to implement `null`, which masks everything maskable *except* this field; its only spec is
 * the prose in swagger/components/schemas/features.yaml. Deliberately named for the endpoint
 * rather than as a general exclusion list: everything built on it - the `query` vs `url`
 * classification, the `endpoint-only` reason - is URL-shaped, so a second excluded field would be
 * a redesign of those rather than another entry here.
 */
export const ENDPOINT_FIELD = 'endpoint';

/**
 * gjson/sjson treat `.`, `*` and `?` as path syntax, so a key containing one must be escaped or
 * the path addresses something else entirely: `headers.X-Api.Key` unescaped creates a nested
 * `{"X-Api":{"Key":"***"}}` and leaves the real value untouched, with no error.
 */
export const escapeSegment = (key: string): string => key.replace(/([*.?\\])/g, '\\$1');

/**
 * Splits a path on unescaped separators and un-escapes each segment - the exact inverse of
 * `escapeSegment`.
 *
 * Scanned rather than split on a lookbehind: `/(?<!\\)\./` cannot tell an escaped backslash
 * from an escaping one, so a key ending in `\` followed by another segment silently parses as
 * one segment instead of two.
 */
export const parsePath = (path: string): string[] => {
  const segments: string[] = [];
  let current = '';
  for (let i = 0; i < path.length; i += 1) {
    const ch = path[i];
    if (ch === '\\' && i + 1 < path.length) {
      current += path[i + 1];
      i += 1;
    } else if (ch === '.') {
      segments.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  segments.push(current);
  return segments;
};

/** Joins segments into a path - the exact inverse of `parsePath`. */
export const formatPath = (segments: string[]): string => segments.map(escapeSegment).join('.');

/**
 * Collapses marked array positions to a single wildcard.
 *
 * Fixtures only ever exercise as many elements as they declare, so emitting the observed indices
 * would leave every element beyond that count unmasked in production.
 */
export const collapseArrayMarkers = (path: string): string =>
  path.replace(new RegExp(`\\.${ARRAY_MARKER}\\d+`, 'g'), `.${ARRAY_MARKER}`);
