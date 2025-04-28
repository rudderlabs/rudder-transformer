// Mock dependencies
jest.mock('sha256', () => jest.fn((input) => `hashed_${input}`));

jest.mock('../../util', () => {
  const actualUtil = jest.requireActual('../../util');
  return {
    ...actualUtil,
    getFieldValueFromMessage: jest.fn(),
  };
});

jest.mock('./util', () => {
  const original = jest.requireActual('./util');
  return {
    ...original,
    msUnixTimestamp: jest.fn(),
  };
});

const moment = require('moment');

const {
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getEventTimestamp,
  getHashedValue,
  msUnixTimestamp,
} = require('./util');

const { getFieldValueFromMessage } = require('../../util');

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
      name: 'should return "null" when products is not an array',
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
      name: 'should return string ["lmu"] when att is 2',
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

describe('getEventTimestamp', () => {
  const fixedNow = moment('2023-01-15T00:00:00Z');

  beforeEach(() => {
    jest.spyOn(moment, 'now').mockImplementation(() => fixedNow.valueOf());
    jest.spyOn(moment, 'unix').mockImplementation((timestamp) => {
      if (timestamp) {
        return moment.utc(timestamp * 1000);
      }
      return fixedNow;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const testCases = [
    {
      name: 'should return timestamp if within required days',
      inputMessage: { timestamp: '2023-01-10T00:00:00Z' },
      mockFns: () => {
        getFieldValueFromMessage.mockReturnValue('2023-01-10T00:00:00Z');
        msUnixTimestamp.mockReturnValue(1673308800000); // Unix timestamp in ms for 2023-01-10
      },
      expected: '1673308800',
    },
    {
      name: 'should throw error if timestamp is older than required days',
      inputMessage: { timestamp: '2022-12-01T00:00:00Z' },
      mockFns: () => {
        getFieldValueFromMessage.mockReturnValue('2022-12-01T00:00:00Z');
      },
      expectedError: 'Events must be sent within 28 days of their occurrence',
    },
    {
      name: 'should return eventTime if no timestamp found in message',
      inputMessage: { other: 'data' },
      mockFns: () => {
        getFieldValueFromMessage.mockReturnValue(undefined);
      },
      expected: undefined,
    },
    {
      name: 'should accept custom required days parameter',
      inputMessage: { timestamp: '2023-01-10T00:00:00Z' },
      requiredDays: 7,
      mockFns: () => {
        getFieldValueFromMessage.mockReturnValue('2023-01-10T00:00:00Z');
        msUnixTimestamp.mockReturnValue(1673308800000);
      },
      expected: '1673308800',
    },
    {
      name: 'should throw error if timestamp is older than custom required days',
      inputMessage: { timestamp: '2023-01-01T00:00:00Z' },
      requiredDays: 7,
      mockFns: () => {
        getFieldValueFromMessage.mockReturnValue('2023-01-01T00:00:00Z');
      },
      expectedError: 'Events must be sent within 7 days of their occurrence',
    },
  ];

  testCases.forEach(({ name, inputMessage, requiredDays, mockFns, expected, expectedError }) => {
    it(name, () => {
      mockFns();
      if (expectedError) {
        expect(() => getEventTimestamp(inputMessage, requiredDays)).toThrow(expectedError);
      } else {
        const result = getEventTimestamp(inputMessage, requiredDays);
        expect(result).toBe(expected);
      }
    });
  });
});

describe('getHashedValue', () => {
  const testCases = [
    {
      name: 'should return the original hash if input is a valid SHA-256',
      input: 'a'.repeat(64),
      expected: 'a'.repeat(64),
    },
    {
      name: 'should hash the input if not already a valid SHA-256',
      input: 'testString',
      expected: 'hashed_testString',
    },
    {
      name: 'should return null if input is null',
      input: null,
      expected: null,
    },
    {
      name: 'should return null if input is undefined',
      input: undefined,
      expected: null,
    },
    {
      name: 'should return null if input is empty string',
      input: '',
      expected: null,
    },
    {
      name: 'should handle numeric inputs',
      input: 12345,
      expected: 'hashed_12345',
    },
    {
      name: 'should handle email addresses',
      input: 'test@example.com',
      expected: 'hashed_test@example.com',
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(getHashedValue(input)).toBe(expected);
    });
  });
});
