import { getScalarProperties, normalizeEventName } from './utils';

describe('normalizeEventName', () => {
  it.each([
    ['trial_started', 'trial_started'],
    ['checkout.completed:v2-a', 'checkout.completed:v2-a'],
    ['Order Completed', 'Order_Completed'],
    ['  Signed  up!  ', 'Signed_up_'],
  ])('turns %s into %s', (input, expected) => {
    expect(normalizeEventName(input)).toBe(expected);
  });

  it('cuts names to 64 characters', () => {
    expect(normalizeEventName('a'.repeat(70))).toHaveLength(64);
  });
});

describe('getScalarProperties', () => {
  it('keeps strings, numbers and booleans', () => {
    expect(
      getScalarProperties({ plan: 'pro', seats: 3, trial: false, nested: { a: 1 }, none: null }),
    ).toEqual({ plan: 'pro', seats: 3, trial: false });
  });

  it('keeps at most 20 values', () => {
    const properties = Object.fromEntries(
      Array.from({ length: 25 }, (_, index) => [`key${index}`, index]),
    );
    expect(Object.keys(getScalarProperties(properties) ?? {})).toHaveLength(20);
  });

  it('returns undefined when nothing is left', () => {
    expect(getScalarProperties({ nested: {} })).toBeUndefined();
    expect(getScalarProperties(undefined)).toBeUndefined();
  });
});
