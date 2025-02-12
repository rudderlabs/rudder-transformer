const { getNormalizedPhoneNumber } = require('./util');

describe('Snapchat Conversion Utils', () => {
  describe('getNormalizedPhoneNumber', () => {
    const testCases = [
      {
        name: 'should remove non-numeric characters and leading zeros from phone number',
        input: { traits: { phone: '+1 (234) 567-8900' } },
        expected: '12345678900',
      },
      {
        name: 'should remove leading zeros from phone number when present',
        input: { traits: { phone: '00123456789' } },
        expected: '123456789',
      },
      {
        name: 'should remove non-numeric characters and leading zeros from mixed alphanumeric input',
        input: { traits: { phone: 'abc0123def0456' } },
        expected: '1230456',
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = getNormalizedPhoneNumber(input);
        expect(result).toBe(expected);
      });
    });
  });
});
