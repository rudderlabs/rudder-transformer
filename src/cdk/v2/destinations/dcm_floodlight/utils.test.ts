import { mapFlagValue, transformCustomVariable } from './utils';
import { InstrumentationError } from '@rudderstack/integrations-lib';

describe('DCM Floodlight Utils', () => {
  describe('mapFlagValue', () => {
    const testCases = [
      {
        name: 'should return 1 for true string',
        key: 'testKey',
        value: 'true',
        expected: 1,
      },
      {
        name: 'should return 1 for boolean true',
        key: 'testKey',
        value: true,
        expected: 1,
      },
      {
        name: 'should return 0 for false string',
        key: 'testKey',
        value: 'false',
        expected: 0,
      },
      {
        name: 'should return 0 for boolean false',
        key: 'testKey',
        value: false,
        expected: 0,
      },
      {
        name: 'should return 1 for string "1"',
        key: 'testKey',
        value: '1',
        expected: 1,
      },
      {
        name: 'should return 0 for string "0"',
        key: 'testKey',
        value: '0',
        expected: 0,
      },
    ];

    test.each(testCases)('$name', ({ key, value, expected }) => {
      expect(mapFlagValue(key, value)).toBe(expected);
    });

    it('should throw InstrumentationError for invalid values', () => {
      expect(() => mapFlagValue('testKey', 'invalid')).toThrow(InstrumentationError);
      expect(() => mapFlagValue('testKey', '2')).toThrow(InstrumentationError);
    });
  });

  describe('transformCustomVariable', () => {
    const testCases = [
      {
        name: 'should transform valid custom variables',
        customFloodlightVariable: [
          { from: 'property1', to: 'u1' },
          { from: 'property2', to: 'u2' },
        ],
        message: {
          properties: {
            property1: 'value1',
            property2: 'value2',
          },
        },
        expected: {
          u1: 'value1',
          u2: 'value2',
        },
      },
      {
        name: 'should handle empty custom variables',
        customFloodlightVariable: [],
        message: {
          properties: {},
        },
        expected: {},
      },
      {
        name: 'should skip blacklisted characters',
        customFloodlightVariable: [
          { from: 'prop1', to: 'u1' },
          { from: 'prop2', to: 'u2' },
        ],
        message: {
          properties: {
            prop1: 'value"with"quotes',
            prop2: 'normal_value',
          },
        },
        expected: {
          u2: 'normal_value',
        },
      },
      {
        name: 'should handle nested properties',
        customFloodlightVariable: [{ from: 'nested.prop', to: 'u1' }],
        message: {
          properties: {
            nested: {
              prop: 'nested_value',
            },
          },
        },
        expected: {
          u1: 'nested_value',
        },
      },
      {
        name: 'should encode URI components',
        customFloodlightVariable: [{ from: 'prop', to: 'u1' }],
        message: {
          properties: {
            prop: 'value with spaces',
          },
        },
        expected: {
          u1: 'value%20with%20spaces',
        },
      },
      {
        name: 'should skip boolean values',
        customFloodlightVariable: [
          { from: 'prop1', to: 'u1' },
          { from: 'prop2', to: 'u2' },
        ],
        message: {
          properties: {
            prop1: true,
            prop2: 'valid',
          },
        },
        expected: {
          u2: 'valid',
        },
      },
    ];

    test.each(testCases)('$name', ({ customFloodlightVariable, message, expected }) => {
      expect(transformCustomVariable(customFloodlightVariable, message)).toEqual(expected);
    });
  });
});
