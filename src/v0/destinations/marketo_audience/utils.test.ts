import { classifyMarketoCode, readListId, resolveIdentifier } from './utils';

describe('resolveIdentifier', () => {
  const leadIdCases = [
    { name: 'a decimal string', id: '101', leadId: 101 },
    { name: 'a padded string', id: '  101 ', leadId: 101 },
    { name: 'leading zeros', id: '007', leadId: 7 },
    { name: 'a positive integer', id: 202, leadId: 202 },
    { name: 'the largest safe integer', id: '9007199254740991', leadId: 9007199254740991 },
  ];

  const invalidLeadIdCases = [
    { name: 'letters', id: 'abc' },
    { name: 'zero', id: '0' },
    { name: 'a negative string', id: '-1' },
    { name: 'a fraction string', id: '1.5' },
    { name: 'an exponent string', id: '1e3' },
    { name: 'an unsafe integer', id: '9007199254740993' },
    { name: 'numeric zero', id: 0 },
    { name: 'a negative number', id: -1 },
    { name: 'a fractional number', id: 1.5 },
    { name: 'an unsafe number', id: 2 ** 53 },
    { name: 'a boolean', id: true },
    { name: 'an object', id: { value: 1 } },
  ];

  const emailCases = [
    { name: 'trimmed and lowercased', email: '  Bob@Acme.IO ', expected: 'bob@acme.io' },
    { name: 'plus addressing kept', email: 'bob+promo@acme.io', expected: 'bob+promo@acme.io' },
    { name: 'ampersand kept', email: 'r&d@acme.io', expected: 'r&d@acme.io' },
  ];

  const invalidEmailCases = [
    { name: 'no at sign', email: 'not-an-email' },
    { name: 'a comma', email: 'a,b@acme.io' },
    { name: 'a quoted comma', email: '"a,b"@acme.io' },
    { name: 'a number', email: 12345 },
  ];

  const emptyCases = [
    { name: 'no identifiers object', identifiers: undefined },
    { name: 'an empty object', identifiers: {} },
    { name: 'null values', identifiers: { id: null, email: null } },
    { name: 'blank strings', identifiers: { id: '  ', email: '' } },
  ];

  it.each(leadIdCases)('uses the lead ID: $name', ({ id, leadId }) => {
    expect(resolveIdentifier({ id, email: 'ignored@acme.io' })).toEqual({ kind: 'id', leadId });
  });

  it.each(invalidLeadIdCases)(
    'fails a malformed lead ID without falling back to email: $name',
    ({ id }) => {
      expect(resolveIdentifier({ id, email: 'bob@acme.io' })).toEqual({
        kind: 'error',
        message: 'Invalid Marketo Lead ID',
      });
    },
  );

  it.each(emailCases)('uses the email when the lead ID is empty: $name', ({ email, expected }) => {
    expect(resolveIdentifier({ id: '', email })).toEqual({ kind: 'email', email: expected });
  });

  it.each(invalidEmailCases)('fails an invalid email: $name', ({ email }) => {
    expect(resolveIdentifier({ email })).toEqual({
      kind: 'error',
      message: 'Invalid email identifier',
    });
  });

  it.each(emptyCases)('fails when nothing is mapped: $name', ({ identifiers }) => {
    expect(resolveIdentifier(identifiers)).toEqual({
      kind: 'error',
      message: 'No identifier mapped',
    });
  });
});

describe('readListId', () => {
  const connectionWith = (audienceId: unknown) => ({ config: { destination: { audienceId } } });

  const validCases = [
    { name: 'a numeric string', audienceId: '1234', listId: '1234' },
    { name: 'a padded string', audienceId: ' 1234 ', listId: '1234' },
    { name: 'a number', audienceId: 1234, listId: '1234' },
  ];

  const missingCases = [
    { name: 'no connection', connection: undefined },
    { name: 'no destination config', connection: { config: {} } },
    { name: 'no audienceId', connection: connectionWith(undefined) },
    { name: 'a blank audienceId', connection: connectionWith('  ') },
  ];

  const invalidCases = [
    { name: 'letters', audienceId: 'list-a' },
    { name: 'a path segment', audienceId: '../12' },
    { name: 'zero', audienceId: '0' },
    { name: 'a fraction', audienceId: 1.5 },
  ];

  it.each(validCases)('reads $name', ({ audienceId, listId }) => {
    expect(readListId(connectionWith(audienceId))).toEqual({ ok: true, listId });
  });

  it.each(missingCases)('requires a list ID: $name', ({ connection }) => {
    expect(readListId(connection)).toEqual({
      ok: false,
      message: 'Marketo static list ID is required',
    });
  });

  it.each(invalidCases)('rejects a non-numeric list ID: $name', ({ audienceId }) => {
    expect(readListId(connectionWith(audienceId))).toEqual({
      ok: false,
      message: 'Marketo static list ID is invalid',
    });
  });
});

describe('classifyMarketoCode', () => {
  const membershipReasons = {
    '603': 'Marketo API user lacks Read-Write Lead permission',
    '1013': 'Marketo static list not found',
  };

  const cases = [
    {
      code: '601',
      expected: {
        kind: 'retry',
        reason: 'Marketo rejected the access token (code 601)',
        evictToken: true,
      },
    },
    {
      code: '602',
      expected: {
        kind: 'retry',
        reason: 'Marketo rejected the access token (code 602)',
        evictToken: true,
      },
    },
    ...['604', '611', '713'].map((code) => ({
      code,
      expected: {
        kind: 'retry',
        reason: `Marketo is temporarily unavailable (code ${code})`,
        evictToken: false,
      },
    })),
    ...['502', '606', '608', '615'].map((code) => ({
      code,
      expected: {
        kind: 'throttled',
        reason: `Marketo rate limit reached (code ${code})`,
        evictToken: false,
      },
    })),
    {
      code: '607',
      expected: { kind: 'abort', reason: 'Marketo daily API quota reached', evictToken: false },
    },
    {
      code: '603',
      expected: {
        kind: 'abort',
        reason: 'Marketo API user lacks Read-Write Lead permission',
        evictToken: false,
      },
    },
    {
      code: '1013',
      expected: { kind: 'abort', reason: 'Marketo static list not found', evictToken: false },
    },
    {
      code: '1003',
      expected: { kind: 'abort', reason: 'Marketo request failed (code 1003)', evictToken: false },
    },
  ];

  it.each(cases)('classifies $code', ({ code, expected }) => {
    expect(classifyMarketoCode(code, membershipReasons, 'Marketo request failed')).toEqual(
      expected,
    );
  });
});
