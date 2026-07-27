import { normalizeExternalId } from '../utils';

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
    ['null', null],
    ['undefined', undefined],
    ['empty string', ''],
    ['whitespace', '   '],
    ['object', { id: 'x' }],
    ['array', ['x']],
    ['boolean', true],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
  ])('rejects %s', (_label, raw) => {
    expect(normalizeExternalId(raw)).toBeNull();
  });
});
