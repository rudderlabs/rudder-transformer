const { CommonUtils } = require('./common');

describe('CommonUtils', () => {
  describe('isNonEmptyArray', () => {
    const testCases = [
      { name: 'array with numbers', input: [1, 2, 3], expected: true },
      { name: 'array with single string', input: ['a'], expected: true },
      { name: 'array with object', input: [{}], expected: true },
      { name: 'empty array', input: [], expected: false },
      { name: 'null', input: null, expected: false },
      { name: 'undefined', input: undefined, expected: false },
      { name: 'number', input: 42, expected: false },
      { name: 'string', input: 'string', expected: false },
      { name: 'object', input: {}, expected: false },
      { name: 'boolean', input: false, expected: false },
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
      expect(CommonUtils.isNonEmptyArray(input)).toBe(expected);
    });
  });

  describe('objectDiff', () => {
    const testCases = [
      {
        name: 'different values in flat objects',
        obj1: { a: 1, b: 2 },
        obj2: { a: 1, b: 3 },
        expected: { b: [2, 3] },
      },
      {
        name: 'nested objects with differences',
        obj1: { a: { b: 1, c: 2 }, d: 3 },
        obj2: { a: { b: 1, c: 3 }, d: 3 },
        expected: { 'a.c': [2, 3] },
      },
      {
        name: 'missing keys in second object',
        obj1: { a: 1, b: 2 },
        obj2: { a: 1 },
        expected: { b: [2, undefined] },
      },
      {
        name: 'missing keys in first object',
        obj1: { a: 1 },
        obj2: { a: 1, b: 2 },
        expected: { b: [undefined, 2] },
      },
      {
        name: 'null inputs',
        obj1: null,
        obj2: { a: 1 },
        expected: { a: [undefined, 1] },
      },
      {
        name: 'empty objects',
        obj1: {},
        obj2: {},
        expected: {},
      },
    ];

    test.each(testCases)('$name', ({ obj1, obj2, expected }) => {
      expect(CommonUtils.objectDiff(obj1, obj2)).toEqual(expected);
    });
  });

  describe('toArray', () => {
    const testCases = [
      {
        name: 'existing array remains unchanged',
        input: [1, 2, 3],
        expected: [1, 2, 3],
      },
      {
        name: 'single number becomes array',
        input: 42,
        expected: [42],
      },
      {
        name: 'string becomes array',
        input: 'test',
        expected: ['test'],
      },
      {
        name: 'object becomes array',
        input: { a: 1 },
        expected: [{ a: 1 }],
      },
      {
        name: 'null becomes array',
        input: null,
        expected: [null],
      },
      {
        name: 'undefined becomes array',
        input: undefined,
        expected: [undefined],
      },
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
      expect(CommonUtils.toArray(input)).toEqual(expected);
    });
  });

  describe('setDiff', () => {
    const testCases = [
      {
        name: 'sets with different elements',
        mainSet: new Set([1, 2, 3]),
        comparisonSet: new Set([2, 3, 4]),
        expected: [1],
      },
      {
        name: 'identical sets',
        mainSet: new Set([1, 2, 3]),
        comparisonSet: new Set([1, 2, 3]),
        expected: [],
      },
      {
        name: 'completely different sets',
        mainSet: new Set([1, 2, 3]),
        comparisonSet: new Set([4, 5, 6]),
        expected: [1, 2, 3],
      },
      {
        name: 'empty comparison set',
        mainSet: new Set([1, 2, 3]),
        comparisonSet: new Set([]),
        expected: [1, 2, 3],
      },
      {
        name: 'empty main set',
        mainSet: new Set([]),
        comparisonSet: new Set([1, 2, 3]),
        expected: [],
      },
      {
        name: 'both empty sets',
        mainSet: new Set([]),
        comparisonSet: new Set([]),
        expected: [],
      },
    ];

    test.each(testCases)('$name', ({ mainSet, comparisonSet, expected }) => {
      expect(CommonUtils.setDiff(mainSet, comparisonSet)).toEqual(expected);
    });
  });
});
