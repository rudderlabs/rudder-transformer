import { normalizeEmail, normalizePhone, normalizeName } from './userDataNormalization';

describe('normalizeEmail', () => {
  const gmailCases = [
    {
      name: 'strips dots from gmail username',
      input: 'j.o.h.n@gmail.com',
      expected: 'john@gmail.com',
    },
    {
      name: 'strips +suffix from gmail username',
      input: 'john+alias@gmail.com',
      expected: 'john@gmail.com',
    },
    {
      name: 'strips dots and +suffix from gmail username',
      input: 'j.o.h.n+alias@gmail.com',
      expected: 'john@gmail.com',
    },
    {
      name: 'treats googlemail.com as gmail domain',
      input: 'j.o.h.n+alias@googlemail.com',
      expected: 'john@googlemail.com',
    },
    {
      name: 'lowercases gmail address',
      input: 'JOHN@GMAIL.COM',
      expected: 'john@gmail.com',
    },
  ];

  const nonGmailCases = [
    {
      name: 'lowercases and trims non-gmail address',
      input: '  TEST@EXAMPLE.COM  ',
      expected: 'test@example.com',
    },
    {
      name: 'preserves dots in non-gmail username',
      input: 'first.last@example.com',
      expected: 'first.last@example.com',
    },
    {
      name: 'preserves +suffix in non-gmail username',
      input: 'user+tag@example.com',
      expected: 'user+tag@example.com',
    },
    {
      name: 'returns trimmed+lowercased value when no @ sign',
      input: '  NOTANEMAIL  ',
      expected: 'notanemail',
    },
  ];

  it.each(gmailCases)('gmail: $name', ({ input, expected }) => {
    expect(normalizeEmail(input)).toBe(expected);
  });

  it.each(nonGmailCases)('non-gmail: $name', ({ input, expected }) => {
    expect(normalizeEmail(input)).toBe(expected);
  });
});

describe('normalizePhone', () => {
  const cases = [
    {
      name: 'prepends + when missing',
      input: '912382193',
      expected: '+912382193',
    },
    {
      name: 'preserves existing +',
      input: '+912382193',
      expected: '+912382193',
    },
    {
      name: 'strips spaces',
      input: '91 238 2193',
      expected: '+912382193',
    },
    {
      name: 'strips parentheses',
      input: '(912)382193',
      expected: '+912382193',
    },
    {
      name: 'strips dots',
      input: '912.382.193',
      expected: '+912382193',
    },
    {
      name: 'strips dashes',
      input: '912-382-193',
      expected: '+912382193',
    },
    {
      name: 'returns empty string when only separators',
      input: '  -  ',
      expected: '',
    },
  ];

  it.each(cases)('$name', ({ input, expected }) => {
    expect(normalizePhone(input)).toBe(expected);
  });
});

describe('normalizeName', () => {
  const cases = [
    {
      name: 'trims and lowercases',
      input: '  John  ',
      expected: 'john',
    },
    {
      name: 'already clean name',
      input: 'gomes',
      expected: 'gomes',
    },
    {
      name: 'uppercased name',
      input: 'JOHN',
      expected: 'john',
    },
    {
      name: 'mixed case name',
      input: 'McCallister',
      expected: 'mccallister',
    },
  ];

  it.each(cases)('$name', ({ input, expected }) => {
    expect(normalizeName(input)).toBe(expected);
  });
});
