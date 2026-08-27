import { createHash } from 'crypto';
import { processAudienceRecord } from '../../../util/audienceUtils';
import { DESTINATION_TYPE } from '../config';
import {
  IDENTIFIER_FIELD_CONFIG,
  buildGroupKey,
  buildRow,
  canonicalizeEmail,
  canonicalizeMaid,
  columnsFor,
} from '../utils';

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex');

const runProcess = (identifiers: Record<string, unknown>, isHashRequired = true) =>
  processAudienceRecord(identifiers, {
    fieldConfigs: IDENTIFIER_FIELD_CONFIG,
    destination: {
      workspaceId: 'wsp1',
      id: 'dest1',
      type: DESTINATION_TYPE,
      config: { isHashRequired },
    },
  });

describe('reddit_audience canonicalization — Reddit published vectors', () => {
  // Source: Reddit "Manual Advanced Matching for Developers". These are the
  // exact input/output pairs Reddit publishes. They are asserted end-to-end
  // (through processAudienceRecord, not just the normalize fn) because a
  // mismatch here is invisible at runtime: Reddit accepts the payload and
  // silently matches nothing.
  const EXPECTED_EMAIL = 'ff8d9819fc0e12bf0d24892e45987e249a28dce836a85cad60e28eaaa8c6d976';

  it.each([['alice@example.com'], ['Al.ice$+Apple@Example.Com']])(
    "hashes %s to Reddit's published email digest",
    (input) => {
      expect(sha256(canonicalizeEmail(input))).toBe(EXPECTED_EMAIL);
      expect(runProcess({ EMAIL_SHA256: input })).toEqual({ EMAIL_SHA256: EXPECTED_EMAIL });
    },
  );

  it.each([
    // IDFA — uppercase hex, dashes retained
    [
      'EA7583CD-A667-48BC-B806-42ECB2B48606',
      '70574fa9c8f498a7b2e5c8712b1126de7b1406fd02fdc591821c5bd33092fd1c',
    ],
    // AAID — lowercase hex, dashes retained
    [
      'cdda802e-fb9c-47ad-9866-0794d394c912',
      'f23b554b2a8fb732a8b973733832e70f018da7bc294dfea289735a07d5dd2c9f',
    ],
  ])("hashes MAID %s to Reddit's published digest", (input, expected) => {
    expect(sha256(canonicalizeMaid(input))).toBe(expected);
    expect(runProcess({ MAID_SHA256: input })).toEqual({ MAID_SHA256: expected });
  });

  it('does not case-fold MAIDs — IDFA and AAID casing are opposite by design', () => {
    // Lower-casing an IDFA (or upper-casing an AAID) would silently produce a
    // different, unmatchable hash. Guards against "normalize everything" edits.
    const idfa = 'EA7583CD-A667-48BC-B806-42ECB2B48606';
    expect(canonicalizeMaid(idfa)).toBe(idfa);
    expect(sha256(canonicalizeMaid(idfa.toLowerCase()))).not.toBe(
      '70574fa9c8f498a7b2e5c8712b1126de7b1406fd02fdc591821c5bd33092fd1c',
    );
  });
});

describe('canonicalizeEmail', () => {
  it('strips the +alias and all non-alphanumerics from the username only', () => {
    // The dot in the DOMAIN must survive; only the username is stripped.
    expect(canonicalizeEmail('First.Last+promo@Sub.Example.CO.UK')).toBe(
      'firstlast@sub.example.co.uk',
    );
  });

  it('applies dot-stripping to every domain, not just gmail', () => {
    expect(canonicalizeEmail('a.b.c@yahoo.com')).toBe('abc@yahoo.com');
  });

  it('trims surrounding whitespace', () => {
    expect(canonicalizeEmail('  alice@example.com  ')).toBe('alice@example.com');
  });

  it('leaves a value with no @ alone so validation can reject it', () => {
    expect(canonicalizeEmail('not-an-email')).toBe('not-an-email');
  });
});

describe('identifier validation', () => {
  it('drops an email that is not shaped like an address', () => {
    expect(runProcess({ EMAIL_SHA256: 'not-an-email' })).toEqual({});
  });

  it('drops a MAID that is not a UUID', () => {
    expect(runProcess({ MAID_SHA256: 'abc123' })).toEqual({});
  });

  it('ignores identifier keys Reddit does not accept', () => {
    // Phone / userId exist on Reddit's Conversions API but not on Custom
    // Audiences. They must not reach the payload.
    const out = runProcess({
      EMAIL_SHA256: 'alice@example.com',
      phone: '+15554441234',
      userId: 'u-1',
    });
    expect(columnsFor(out)).toEqual(['EMAIL_SHA256']);
  });

  it('passes through pre-hashed values when isHashRequired is false', () => {
    const pre = sha256('alice@example.com');
    expect(runProcess({ EMAIL_SHA256: pre }, false)).toEqual({ EMAIL_SHA256: pre });
  });

  it('rejects unhashed input when isHashRequired is false', () => {
    expect(() => runProcess({ EMAIL_SHA256: 'alice@example.com' }, false)).toThrow(
      /appears to be unhashed/,
    );
  });

  it('rejects already-hashed input when isHashRequired is true', () => {
    expect(() => runProcess({ EMAIL_SHA256: sha256('alice@example.com') })).toThrow(
      /already be hashed/,
    );
  });
});

describe('column ordering', () => {
  it('returns Reddit canonical order regardless of key insertion order', () => {
    const processed = { MAID_SHA256: 'm', EMAIL_SHA256: 'e' };
    expect(columnsFor(processed)).toEqual(['EMAIL_SHA256', 'MAID_SHA256']);
  });

  it('builds a row aligned positionally to column_order', () => {
    const processed = { MAID_SHA256: 'm', EMAIL_SHA256: 'e' };
    const columns = columnsFor(processed);
    expect(buildRow(processed, columns)).toEqual(['e', 'm']);
  });

  it('omits absent columns rather than padding them', () => {
    // Reddit requires every row to match column_order exactly; a padded empty
    // cell would be a hash of nothing and could never match.
    const processed = { EMAIL_SHA256: 'e' };
    expect(columnsFor(processed)).toEqual(['EMAIL_SHA256']);
    expect(buildRow(processed, columnsFor(processed))).toEqual(['e']);
  });

  it('separates group keys by action and by column set', () => {
    expect(buildGroupKey('ADD', ['EMAIL_SHA256'])).not.toBe(
      buildGroupKey('REMOVE', ['EMAIL_SHA256']),
    );
    expect(buildGroupKey('ADD', ['EMAIL_SHA256'])).not.toBe(
      buildGroupKey('ADD', ['EMAIL_SHA256', 'MAID_SHA256']),
    );
  });
});
