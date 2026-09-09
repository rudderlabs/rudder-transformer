import { HashingType, type AudienceField } from '../../util/audienceUtils';
import { REDDIT_COLUMNS, type RedditColumn } from './config';

/**
 * Reddit's canonicalization rules, from "Manual Advanced Matching for Developers".
 *
 * Email — the documented steps, in order:
 *   1. lowercase the whole address
 *   2. remove the alias: everything from the first `+` to the end of the username
 *   3. remove all non-alphanumeric characters from the username
 *   4. SHA-256, returned as lowercase hex (64 chars)
 *
 * Note step 3 applies to the username of EVERY domain — this is not Gmail-only
 * dot-stripping. The domain is left untouched. Reddit's own published vectors
 * pin this: `alice@example.com` and `Al.ice$+Apple@Example.Com` must both hash
 * to ff8d9819fc0e12bf0d24892e45987e249a28dce836a85cad60e28eaaa8c6d976.
 *
 * Getting this wrong does not fail — it produces a silently reduced match rate
 * with no error from Reddit, so the vectors are asserted in the unit tests.
 */
export const canonicalizeEmail = (value: unknown): string => {
  const lowered = String(value).trim().toLowerCase();
  const at = lowered.lastIndexOf('@');
  if (at <= 0) {
    // No usable local part / domain split — hand back the trimmed value and let
    // `validate` reject it rather than fabricating an address here.
    return lowered;
  }
  const username = lowered.slice(0, at);
  const domain = lowered.slice(at + 1);
  const withoutAlias = username.split('+')[0];
  const stripped = withoutAlias.replace(/[^\da-z]/g, '');
  return `${stripped}@${domain}`;
};

const EMAIL_SHAPE = /^[^\s@]+@[^\s.@]+\.[^\s@]+$/;

/**
 * MAID — Reddit asks for the advertising ID in its canonical vendor form:
 * IDFA uppercase hex, AAID lowercase hex, dashes retained. Because the two
 * cases are opposite, the value CANNOT be case-folded here: normalizing to
 * either case would corrupt the other platform's hash. Trim only.
 */
export const canonicalizeMaid = (value: unknown): string => String(value).trim();

const MAID_SHAPE = /^[\dA-Fa-f]{8}(?:-[\dA-Fa-f]{4}){3}-[\dA-Fa-f]{12}$/;

/**
 * Consumed by `processAudienceRecord`, keyed by the Reddit column names — which
 * are also what the webapp mapper writes as `to`, so `message.identifiers`
 * already arrives keyed this way (rudder-sources resolves identifierMappings
 * upstream, as it does for iterable_audience).
 */
export const IDENTIFIER_FIELD_CONFIG: Record<RedditColumn, AudienceField> = {
  EMAIL_SHA256: {
    hashingType: HashingType.SHA256,
    normalize: canonicalizeEmail,
    validate: (v: unknown) => typeof v === 'string' && EMAIL_SHAPE.test(v),
  },
  MAID_SHA256: {
    hashingType: HashingType.SHA256,
    normalize: canonicalizeMaid,
    validate: (v: unknown) => typeof v === 'string' && MAID_SHAPE.test(v),
  },
};

/**
 * The columns present on a single processed row, in Reddit's canonical order.
 *
 * `column_order` is declared once per request and every `user_data` row must
 * align to it positionally, so rows carrying different identifier sets cannot
 * share a request. Returning a stable, ordered signature here is what lets the
 * router group them correctly (see routerTransform's `internalGroupKey`).
 */
export const columnsFor = (processed: Record<string, unknown>): RedditColumn[] =>
  REDDIT_COLUMNS.filter(
    (column) => typeof processed[column] === 'string' && (processed[column] as string).length > 0,
  );

/** A row is the processed values in exactly the order `column_order` declares. */
export const buildRow = (processed: Record<string, unknown>, columns: RedditColumn[]): string[] =>
  columns.map((column) => processed[column] as string);

/** Group key: one URL serves both actions, and column_order must not mix. */
export const buildGroupKey = (actionType: string, columns: RedditColumn[]): string =>
  `${actionType}|${columns.join(',')}`;
