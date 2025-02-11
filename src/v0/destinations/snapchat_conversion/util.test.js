const { getNormalizedPhoneNumber } = require('./util');

describe('Snapchat Conversion Utils', () => {
  describe('getNormalizedPhoneNumber', () => {
    it('should remove non-numeric characters and leading zeros from phone number', () => {
      const message = { traits: { phone: '+1 (234) 567-8900' } };
      const expectedPhoneNumber = '12345678900';

      const result = getNormalizedPhoneNumber(message);

      expect(result).toBe(expectedPhoneNumber);
    });

    it('should remove leading zeros from phone number when present', () => {
      const phoneNumberWithLeadingZeros = '00123456789';
      const expectedPhoneNumber = '123456789';
      const message = { traits: { phone: phoneNumberWithLeadingZeros } };

      const result = getNormalizedPhoneNumber(message);

      expect(result).toBe(expectedPhoneNumber);
    });

    // Handle phone number with mixed alphanumeric characters
    it('should remove non-numeric characters and leading zeros from phone number', () => {
      const message = { traits: { phone: 'abc0123def0456' } };

      const result = getNormalizedPhoneNumber(message);

      expect(result).toBe('1230456');
    });
  });
});
