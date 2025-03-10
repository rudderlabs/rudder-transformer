const { generateRandomString } = require('@rudderstack/integrations-lib');
const {
  msUnixTimestamp,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber,
  getHashedValue,
  channelMapping,
  generateBatchedPayloadForArray,
} = require('./util');

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
      {
        name: 'should return null when phone number is not present',
        input: { traits: {} },
        expected: null,
      },
      {
        name: 'should return null when message is empty',
        input: {},
        expected: null,
      },
      {
        name: 'should return the original hash when phone is already a 64-char hex',
        input: { traits: { phone: 'a'.repeat(64) } },
        expected: 'a'.repeat(64),
      },
      {
        name: 'should return null when phone normalizes to empty string',
        input: { traits: { phone: '000' } },
        expected: null,
      },
      {
        name: 'should handle integer phone numbers',
        input: { traits: { phone: 1234567890 } },
        expected: '1234567890',
      },
      {
        name: 'should handle object in place of phone number',
        input: { traits: { phone: { test: 'test' } } },
        expected: null,
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

describe('msUnixTimestamp', () => {
  const testCases = [
    {
      name: 'should convert timestamp to milliseconds unix timestamp',
      input: new Date('2024-01-01T00:00:00Z'),
      expected:
        new Date('2024-01-01T00:00:00Z').getTime() * 1000 +
        new Date('2024-01-01T00:00:00Z').getMilliseconds(),
    },
    {
      name: 'should handle different timezone',
      input: new Date('2024-01-01T12:30:45+05:30'),
      expected:
        new Date('2024-01-01T12:30:45+05:30').getTime() * 1000 +
        new Date('2024-01-01T12:30:45+05:30').getMilliseconds(),
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(msUnixTimestamp(input)).toBe(expected);
    });
  });
});

describe('getHashedValue', () => {
  const testCases = [
    {
      name: 'should return null for null input',
      input: null,
      expected: null,
    },
    {
      name: 'should return null for undefined input',
      input: undefined,
      expected: null,
    },
    {
      name: 'should return null for empty string',
      input: '',
      expected: null,
    },
    {
      name: 'should return original value if already a 64-char hex',
      input: 'a'.repeat(64),
      expected: 'a'.repeat(64),
    },
    {
      name: 'should hash non-hex64 values',
      input: 'test',
      expectedLength: 64,
      expectedPattern: /^[a-f0-9]{64}$/i,
    },
  ];

  testCases.forEach(({ name, input, expected, expectedLength, expectedPattern }) => {
    it(name, () => {
      const result = getHashedValue(input);
      if (expected !== undefined) {
        expect(result).toBe(expected);
      }
      if (expectedLength) {
        expect(result).toHaveLength(expectedLength);
      }
      if (expectedPattern) {
        expect(result).toMatch(expectedPattern);
      }
    });
  });
});

describe('getItemIds', () => {
  const testCases = [
    {
      name: 'should return null when products is not an array',
      input: { properties: {} },
      expected: null,
    },
    {
      name: 'should return array of product_ids',
      input: {
        properties: {
          products: [{ product_id: '123' }, { product_id: '456' }],
        },
      },
      expected: ['123', '456'],
    },
    {
      name: 'should skip products without product_id',
      input: {
        properties: {
          products: [{ product_id: '123' }, { name: 'test' }, { product_id: '456' }],
        },
      },
      expected: ['123', '456'],
    },
    {
      name: 'should return null when products is null',
      input: { properties: { products: null } },
      expected: null,
    },
    {
      name: 'should handle empty products array',
      input: { properties: { products: [] } },
      expected: [],
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(getItemIds(input)).toEqual(expected);
    });
  });
});

describe('getPriceSum', () => {
  const testCases = [
    {
      name: 'should return null when products is not an array',
      input: { properties: {} },
      expected: 'null',
    },
    {
      name: 'should sum prices * quantities',
      input: {
        properties: {
          products: [
            { price: '10.5', quantity: 2 },
            { price: '20.0', quantity: 1 },
          ],
        },
      },
      expected: '41',
    },
    {
      name: 'should use quantity=1 when not specified',
      input: {
        properties: {
          products: [{ price: '10.5' }, { price: '20.0' }],
        },
      },
      expected: '30.5',
    },
    {
      name: 'should skip invalid prices or quantities',
      input: {
        properties: {
          products: [
            { price: 'invalid', quantity: 2 },
            { price: '20.0', quantity: 'invalid' },
            { price: '10.0', quantity: 2 },
          ],
        },
      },
      expected: '20',
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(getPriceSum(input)).toBe(expected);
    });
  });
});

describe('getDataUseValue', () => {
  const testCases = [
    {
      name: 'should return null when att is not defined',
      input: {},
      expected: null,
    },
    {
      name: 'should return ["lmu"] when att is 2',
      input: {
        context: {
          device: {
            attTrackingStatus: 2,
          },
        },
      },
      expected: "['lmu']",
    },
    {
      name: 'should return null when att is 3',
      input: {
        context: {
          device: {
            attTrackingStatus: 3,
          },
        },
      },
      expected: null,
    },
    {
      name: 'should return null for other att values',
      input: {
        context: {
          device: {
            attTrackingStatus: 1,
          },
        },
      },
      expected: null,
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(getDataUseValue(input)).toBe(expected);
    });
  });
});

describe('generateBatchedPayloadForArray', () => {
  const apiKey = generateRandomString();
  const testCases = [
    {
      name: 'should generate batched payload with correct structure',
      input: {
        events: [{ body: { JSON: { event: 1 } } }, { body: { JSON: { event: 2 } } }],
        destination: {
          Config: {
            apiKey,
          },
        },
      },
      expected: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        endpoint: 'https://tr.snapchat.com/v2/conversion',
        body: {
          JSON_ARRAY: {
            batch: JSON.stringify([{ event: 1 }, { event: 2 }]),
          },
        },
      },
    },
    {
      name: 'should handle empty events array',
      input: {
        events: [],
        destination: {
          Config: {
            apiKey,
          },
        },
      },
      expected: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        endpoint: 'https://tr.snapchat.com/v2/conversion',
        body: {
          JSON_ARRAY: {
            batch: '[]',
          },
        },
      },
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = generateBatchedPayloadForArray(input.events, input.destination);
      expect(result.headers).toEqual(expected.headers);
      expect(result.endpoint).toEqual(expected.endpoint);
      expect(result.body.JSON_ARRAY).toEqual(expected.body.JSON_ARRAY);
    });
  });
});

describe('channelMapping', () => {
  const testCases = [
    {
      name: 'should have correct mapping values',
      expected: {
        web: 'WEB',
        mobile: 'MOBILE_APP',
        mobile_app: 'MOBILE_APP',
        offline: 'OFFLINE',
      },
    },
  ];

  testCases.forEach(({ name, expected }) => {
    it(name, () => {
      expect(channelMapping).toEqual(expected);
    });
  });
});
