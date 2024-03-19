const crypto = require('crypto');
const { formatEmail, calculateConversionObject } = require('./utils');

describe('formatEmail', () => {
  // Returns a hashed email when a valid email is passed as argument.
  it('should return a hashed email when a valid email is passed as argument', () => {
    const email = 'test@example.com';
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    expect(formatEmail(email)).toEqual(hashedEmail);
  });

  // Returns null when an empty string is passed as argument.
  it('should return null when an empty string is passed as argument', () => {
    const email = '';
    expect(formatEmail(email)).toBeNull();
  });
});

describe('calculateConversionObject', () => {
  // Returns a conversion object with currency code 'USD' and amount 0 when message properties are empty
  it('should return a conversion object with currency code "USD" and amount 0 when message properties are empty', () => {
    const message = { properties: {} };
    const conversionObject = calculateConversionObject(message);
    expect(conversionObject).toEqual({ currencyCode: 'USD', amount: 0 });
  });

  // Returns a conversion object with currency code 'USD' and amount 0 when message properties price is defined but quantity is 0
  it('should return a conversion object with currency code "USD" and amount 0 when message properties price is defined but quantity is 0', () => {
    const message = { properties: { price: 10, quantity: 0 } };
    const conversionObject = calculateConversionObject(message);
    expect(conversionObject).toEqual({ currencyCode: 'USD', amount: 0 });
  });
});
