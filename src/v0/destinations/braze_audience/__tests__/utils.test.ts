import { isIdentityAborted, normalizeExternalId } from '../utils';

describe('normalizeExternalId', () => {
  it.each([
    ['plain string', 'user-1', 'user-1'],
    ['trimmed string', '  user-1  ', 'user-1'],
    ['numeric', 42, '42'],
    ['zero', 0, '0'],
  ])('accepts %s', (_label, raw, expected) => {
    expect(normalizeExternalId(raw)).toBe(expected);
  });

  it.each([
    ['undefined', undefined],
    ['empty string', ''],
    ['whitespace', '   '],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
  ] as const)('rejects %s', (_label, raw) => {
    expect(normalizeExternalId(raw)).toBeNull();
  });
});

// Shared by the legacy network handler and the batching-framework delivery path, so it is tested
// where it lives rather than only through each caller.
describe('isIdentityAborted', () => {
  it.each([
    ['documented enum', 'EXTERNAL_USER_ID_TOO_LARGE'],
    ['blacklist enum', 'BLACKLISTED_EXTERNAL_USER_ID'],
    ['lowercased enum form', 'external_user_id_too_large'],
    ['live length message', "'external_id' must be fewer than 988 bytes"],
    ['live blacklist message', 'external_id is blacklisted'],
  ])('aborts on %s', (_label, type) => {
    expect(isIdentityAborted(type)).toBe(true);
  });

  it.each([
    ['undefined', undefined],
    ['empty string', ''],
    ['an unrelated attribute error', 'SOME_TRANSIENT_ATTR_ERROR'],
    // The pre-#5408 regex matched this; a missing user is retryable, not a permanent identity fault.
    ['a not-found message mentioning external_id', 'user not found for external_id'],
  ])('does not abort on %s', (_label, type) => {
    expect(isIdentityAborted(type)).toBe(false);
  });
});
