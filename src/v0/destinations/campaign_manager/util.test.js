const sha256 = require('sha256');
const {
  convertToMicroseconds,
  normalizeEmail,
  normalizePhone,
  normalizeAndHash,
} = require('./util');

describe('convertToMicroseconds utility test', () => {
  it('ISO 8601 input', () => {
    expect(convertToMicroseconds('2021-01-04T08:25:04.780Z')).toEqual(1609748704780000);
  });

  it('unix microseconds input', () => {
    expect(convertToMicroseconds('1668624722903333')).toEqual(1668624722903333);
  });

  it('non numeric time input', () => {
    expect(convertToMicroseconds('2022-11-17T00:22:02.903+05:30')).toEqual(1668624722903000);
  });

  it('unix seconds input', () => {
    expect(convertToMicroseconds('1697013935')).toEqual(1697013935000000);
  });

  it('unix miliseconds input', () => {
    expect(convertToMicroseconds('1697013935000')).toEqual(1697013935000000);
  });
});

describe('normalizeEmail', () => {
  it('should remove dots from the local part for gmail.com addresses', () => {
    const email = 'example.user@gmail.com';
    const normalized = normalizeEmail(email);
    expect(normalized).toBe('exampleuser@gmail.com');
  });

  it('should return the same email if no google domain is present', () => {
    const email = 'exampleuser@exampl.com';
    const normalized = normalizeEmail(email);
    expect(normalized).toBe('exampleuser@exampl.com');
  });
});

describe('normalizePhone', () => {
  it('should return a valid E.164 formatted phone number when provided with correct inputs', () => {
    const validPhone = '4155552671';
    const countryCode = 'US';
    expect(normalizePhone(validPhone, countryCode)).toBe('+14155552671');
  });

  it('should throw an InstrumentationError when the phone number is too short or too long', () => {
    const invalidPhone = '123';
    const countryCode = 'US';
    expect(() => normalizePhone(invalidPhone, countryCode)).toThrow('Invalid phone number');
  });

  it('should throw an InstrumentationError when the phone number is with invalid country code', () => {
    const invalidPhone = '1234567890';
    const countryCode = null;
    expect(() => normalizePhone(invalidPhone, countryCode)).toThrow(
      'Invalid phone number with error: ParseError: INVALID_COUNTRY',
    );
  });
});
