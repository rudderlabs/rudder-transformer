import {
  classifyEmail,
  membershipEndpoint,
  membershipOperation,
  normalizeContactId,
  readAccessToken,
  readListId,
  resolveIdentifier,
  wrapMembershipBody,
} from '../utils';
import { isSafeListId } from '../config';

const LARGE_ID = '9007199254740993';

describe('normalizeContactId', () => {
  it('keeps a decimal string longer than MAX_SAFE_INTEGER without converting it', () => {
    // The literal 9007199254740993 is itself rounded in JS, so compare via string.
    expect(String(Number(LARGE_ID))).not.toBe(LARGE_ID);
    expect(normalizeContactId(LARGE_ID)).toEqual({ ok: true, id: LARGE_ID });
  });

  it('strips leading zeros by string replace', () => {
    expect(normalizeContactId('00123')).toEqual({ ok: true, id: '123' });
    expect(normalizeContactId('  00123  ')).toEqual({ ok: true, id: '123' });
  });

  it('accepts a positive safe integer and rejects an unsafe one', () => {
    expect(normalizeContactId(42)).toEqual({ ok: true, id: '42' });
    expect(normalizeContactId(Number.MAX_SAFE_INTEGER)).toEqual({
      ok: true,
      id: String(Number.MAX_SAFE_INTEGER),
    });
    expect(normalizeContactId(Number.MAX_SAFE_INTEGER + 1)).toEqual({ ok: false, empty: false });
  });

  it('rejects zero, fractions, and non-decimal strings', () => {
    expect(normalizeContactId(0)).toEqual({ ok: false, empty: false });
    expect(normalizeContactId('0')).toEqual({ ok: false, empty: false });
    expect(normalizeContactId('000')).toEqual({ ok: false, empty: false });
    expect(normalizeContactId(-4)).toEqual({ ok: false, empty: false });
    expect(normalizeContactId(1.5)).toEqual({ ok: false, empty: false });
    expect(normalizeContactId('12.0')).toEqual({ ok: false, empty: false });
    expect(normalizeContactId('abc')).toEqual({ ok: false, empty: false });
  });

  it('rejects booleans, objects, and arrays, and treats whitespace as empty', () => {
    expect(normalizeContactId(true)).toEqual({ ok: false, empty: false });
    expect(normalizeContactId(false)).toEqual({ ok: false, empty: false });
    expect(normalizeContactId({ id: '1' })).toEqual({ ok: false, empty: false });
    expect(normalizeContactId(['1'])).toEqual({ ok: false, empty: false });
    expect(normalizeContactId(undefined)).toEqual({ ok: false, empty: true });
    expect(normalizeContactId(null)).toEqual({ ok: false, empty: true });
    expect(normalizeContactId('')).toEqual({ ok: false, empty: true });
    expect(normalizeContactId('   ')).toEqual({ ok: false, empty: true });
  });
});

describe('resolveIdentifier', () => {
  it('trims and lowercases email when the record id is empty', () => {
    expect(resolveIdentifier({ email: '  Alice@Example.COM  ' })).toEqual({
      kind: 'email',
      email: 'alice@example.com',
    });
    expect(resolveIdentifier({ hs_object_id: '   ', email: 'Alice@Example.COM' })).toEqual({
      kind: 'email',
      email: 'alice@example.com',
    });
  });

  it('uses a valid record id and does not validate the email', () => {
    expect(resolveIdentifier({ hs_object_id: '00123', email: 'not-an-email' })).toEqual({
      kind: 'id',
      recordId: '123',
    });
  });

  it('does not fall back to email when the record id is malformed', () => {
    expect(resolveIdentifier({ hs_object_id: 'abc', email: 'alice@example.com' })).toEqual({
      kind: 'error',
      message: 'Invalid HubSpot Record ID',
    });
    expect(
      resolveIdentifier({ hs_object_id: Number.MAX_SAFE_INTEGER + 1, email: 'alice@example.com' }),
    ).toEqual({
      kind: 'error',
      message: 'Invalid HubSpot Record ID',
    });
    expect(resolveIdentifier({ hs_object_id: true, email: 'alice@example.com' })).toEqual({
      kind: 'error',
      message: 'Invalid HubSpot Record ID',
    });
  });

  it('rejects a nonempty invalid email and reports both empty as unmapped', () => {
    expect(resolveIdentifier({ email: 'not-an-email' })).toEqual({
      kind: 'error',
      message: 'Invalid email identifier',
    });
    expect(classifyEmail(12)).toEqual({ kind: 'invalid' });
    expect(resolveIdentifier({ email: 12 })).toEqual({
      kind: 'error',
      message: 'Invalid email identifier',
    });
    expect(resolveIdentifier({})).toEqual({ kind: 'error', message: 'No identifier mapped' });
    expect(resolveIdentifier({ hs_object_id: null, email: '  ' })).toEqual({
      kind: 'error',
      message: 'No identifier mapped',
    });
  });
});

describe('readListId', () => {
  it('returns the trimmed row list id without contact-id normalization', () => {
    expect(readListId({ config: { destination: { audienceId: '  00123  ' } } })).toEqual({
      ok: true,
      listId: '00123',
    });
  });

  it('requires a nonempty string and rejects unsafe ids', () => {
    expect(readListId(undefined)).toEqual({ ok: false, message: 'HubSpot list ID is required' });
    expect(readListId({ config: { destination: {} } })).toEqual({
      ok: false,
      message: 'HubSpot list ID is required',
    });
    expect(readListId({ config: { destination: { audienceId: '   ' } } })).toEqual({
      ok: false,
      message: 'HubSpot list ID is required',
    });
    expect(readListId({ config: { destination: { audienceId: 10 } } })).toEqual({
      ok: false,
      message: 'HubSpot list ID is required',
    });
    expect(readListId({ config: { destination: { audienceId: '../secret' } } })).toEqual({
      ok: false,
      message: 'HubSpot list ID is invalid',
    });
  });
});

describe('isSafeListId', () => {
  it('matches the integrations-info path-segment check', () => {
    expect(isSafeListId('')).toBe(false);
    expect(isSafeListId('.')).toBe(false);
    expect(isSafeListId('..')).toBe(false);
    expect(isSafeListId('a/b')).toBe(false);
    expect(isSafeListId('a\\b')).toBe(false);
    expect(isSafeListId('a?b')).toBe(false);
    expect(isSafeListId('a#b')).toBe(false);
    expect(isSafeListId('a b')).toBe(false);
    expect(isSafeListId('a\nb')).toBe(false);
    expect(isSafeListId('a\u007fb')).toBe(false);
    expect(isSafeListId('ok-list_1')).toBe(true);
    expect(isSafeListId('00123')).toBe(true);
  });
});

describe('membership helpers', () => {
  it('maps insert and update to add, and delete to remove', () => {
    expect(membershipOperation('insert')).toBe('add');
    expect(membershipOperation('update')).toBe('add');
    expect(membershipOperation('delete')).toBe('remove');
    expect(membershipOperation('upsert')).toBeNull();
  });

  it('encodes the list id only in the URL path', () => {
    expect(membershipEndpoint('a%b')).toBe(
      'https://api.hubapi.com/crm/v3/lists/a%25b/memberships/add-and-remove',
    );
    expect(membershipEndpoint('00123')).toContain('/lists/00123/');
  });

  it('preserves duplicate ids and writes only the shared operation', () => {
    expect(
      wrapMembershipBody([
        { operation: 'add', recordId: '5' },
        { operation: 'add', recordId: '5' },
        { operation: 'add', recordId: '7' },
      ]),
    ).toEqual({ recordIdsToAdd: ['5', '5', '7'], recordIdsToRemove: [] });
    expect(
      wrapMembershipBody([
        { operation: 'remove', recordId: '9' },
        { operation: 'remove', recordId: '8' },
      ]),
    ).toEqual({ recordIdsToAdd: [], recordIdsToRemove: ['9', '8'] });
  });

  it('reads a trimmed destination token and ignores a blank one', () => {
    expect(readAccessToken({ accessToken: '  pat-test  ' })).toBe('pat-test');
    expect(readAccessToken({ accessToken: '   ' })).toBeNull();
    expect(readAccessToken({ accessToken: 1 })).toBeNull();
    expect(readAccessToken(undefined)).toBeNull();
  });
});
