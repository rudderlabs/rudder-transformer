import {
  enhanceMappings,
  prepareEndpoint,
  prepareBody,
  stringifyFirstLevelValues,
  validateHeaders,
} from './utils';
import { InstrumentationError } from '@rudderstack/integrations-lib';

describe('Utils Functions', () => {
  describe('prepareEndpoint', () => {
    test('should preserve single trailing slash when pathParams is empty array', () => {
      const message = { id: 123 };
      const apiUrl = 'https://api.example.com/resource/';
      expect(prepareEndpoint(message, apiUrl, [])).toBe('https://api.example.com/resource/');
    });
    test('should normalize multiple trailing slashes to one when pathParams is empty array', () => {
      const message = { id: 123 };
      const apiUrl = 'https://api.example.com/resource///';
      expect(prepareEndpoint(message, apiUrl, [])).toBe('https://api.example.com/resource/');
    });
    test('should not add trailing slash when pathParams is empty array and URL has no slash', () => {
      const message = { id: 123 };
      const apiUrl = 'https://api.example.com/resource';
      expect(prepareEndpoint(message, apiUrl, [])).toBe('https://api.example.com/resource');
    });
    test('should replace template variables in API URL and add path params', () => {
      const message = { id: 123, p2: 'P2' };
      const apiUrl = 'https://api.example.com/resource/';
      const pathParams = [
        {
          path: 'p1',
        },
        {
          path: '$.p2',
        },
      ];
      expect(prepareEndpoint(message, apiUrl, pathParams)).toBe(
        'https://api.example.com/resource/p1/P2',
      );
    });
    test('should add path params after uri encoding', () => {
      const message = { id: 123, p2: 'P2%&' };
      const apiUrl = 'https://api.example.com/resource/';
      const pathParams = [
        {
          path: 'p1',
        },
        {
          path: '$.p2',
        },
      ];
      expect(prepareEndpoint(message, apiUrl, pathParams)).toBe(
        'https://api.example.com/resource/p1/P2%25%26',
      );
    });
    test('should throw error as path contains slash', () => {
      const message = { id: 123, p2: 'P2%&' };
      const apiUrl = 'https://api.example.com/resource/${$.id}';
      const pathParams = [
        {
          path: 'p1/',
        },
        {
          path: '$.p2',
        },
      ];
      expect(() => prepareEndpoint(message, apiUrl, pathParams)).toThrowError(
        'Path value cannot contain "/"',
      );
    });
  });

  describe('prepareBody', () => {
    test('should prepare XML payload when content type is XML', () => {
      const payload = { key: 'value' };
      const expectedXML = '<?xml version="1.0" encoding="UTF-8"?><root><key>value</key></root>';
      const result = prepareBody(payload, 'XML', 'root');
      expect(result).toEqual({ payload: expectedXML });
    });

    test('should prepare FORM-URLENCODED payload when content type is FORM-URLENCODED', () => {
      const payload = {
        key1: 'value1',
        key2: 'value2',
        key3: { subKey: 'value3', subkey2: undefined },
      };
      const expectedFORM = {
        key1: 'value1',
        key2: 'value2',
        key3: JSON.stringify({ subKey: 'value3' }),
      };
      const result = prepareBody(payload, 'FORM');
      expect(result).toEqual(expectedFORM);
    });

    test('should return original payload without null or undefined values for other content types', () => {
      const payload = {
        key1: 'value1',
        key2: null,
        key3: undefined,
        key4: 'value4',
        key5: { subKey1: undefined, subKey2: 'value5' },
      };
      const expected = { key1: 'value1', key4: 'value4', key5: { subKey2: 'value5' } };
      const result = prepareBody(payload, 'JSON');
      expect(result).toEqual(expected);
    });
  });

  describe('stringifyFirstLevelValues', () => {
    test('converts non-string first-level values to strings', () => {
      const input = { a: 1, b: true, c: { d: 42 } };
      const expected = { a: '1', b: 'true', c: JSON.stringify({ d: 42 }) };
      expect(stringifyFirstLevelValues(input)).toEqual(expected);
    });

    test('keeps string values unchanged', () => {
      const input = { a: 'hello', b: 'world' };
      expect(stringifyFirstLevelValues(input)).toEqual(input);
    });

    test('handles empty objects', () => {
      expect(stringifyFirstLevelValues({})).toEqual({});
    });
  });

  describe('enhanceMappings function', () => {
    test("should wrap 'from' property in single quotes if it is not already wrapped and does not contain '$'", () => {
      const input = [{ to: 'a', from: 'b' }];
      const output = enhanceMappings(input);
      expect(output).toEqual([{ to: 'a', from: "'b'" }]);
    });

    test("should not modify 'from' property if it is already wrapped in single quotes", () => {
      const input = [{ to: 'a', from: "'b'" }];
      const output = enhanceMappings(input);
      expect(output).toEqual([{ to: 'a', from: "'b'" }]);
    });

    test("should not modify 'from' property if it contains '$'", () => {
      const input = [{ to: 'a', from: '$.b' }];
      const output = enhanceMappings(input);
      expect(output).toEqual([{ to: 'a', from: '$.b' }]);
    });

    test('should return an empty array if input is an empty array', () => {
      const input: { to: string; from: string }[] = [];
      const output = enhanceMappings(input);
      expect(output).toEqual([]);
    });

    test('should correctly handle multiple mappings in an array', () => {
      const input = [
        { to: 'a', from: 'b' },
        { to: 'x', from: "'y'" },
        { to: 'p', from: '$.q' },
      ];
      const output = enhanceMappings(input);
      expect(output).toEqual([
        { to: 'a', from: "'b'" },
        { to: 'x', from: "'y'" },
        { to: 'p', from: '$.q' },
      ]);
    });
  });

  describe('validateHeaders', () => {
    const validCases: { description: string; input: Record<string, unknown> }[] = [
      {
        description: 'all string values',
        input: { h1: 'value1', h2: 'value2', 'content-type': 'application/json' },
      },
      {
        description: 'empty object',
        input: {},
      },
    ];

    test.each(validCases)('should not throw for $description', ({ input }) => {
      expect(() => validateHeaders(input)).not.toThrow();
    });

    test.each([
      { description: 'null input', input: null },
      { description: 'undefined input', input: undefined },
    ])('should not throw for $description', ({ input }) => {
      expect(() => validateHeaders(input as unknown as Record<string, unknown>)).not.toThrow();
    });

    const invalidCases: {
      description: string;
      input: Record<string, unknown>;
      errorMessageType: string;
    }[] = [
      {
        description: 'object value',
        input: { h1: 'value1', h2: { nested: 'object' } },
        errorMessageType: 'object',
      },
      {
        description: 'array value',
        input: { h1: 'value1', h2: ['array', 'value'] },
        errorMessageType: 'object',
      },
      {
        description: 'number value',
        input: { h1: 'value1', h2: 12345 },
        errorMessageType: 'number',
      },
      {
        description: 'boolean value',
        input: { h1: 'value1', h2: true },
        errorMessageType: 'boolean',
      },
      {
        description: 'undefined value',
        input: { h1: 'value1', h2: undefined },
        errorMessageType: 'undefined',
      },
      {
        description: 'null value',
        input: { h1: 'value1', h2: null },
        errorMessageType: 'object',
      },
    ];

    test.each(invalidCases)(
      'should throw InstrumentationError for $description',
      ({ input, errorMessageType }) => {
        expect(() => validateHeaders(input)).toThrow(InstrumentationError);
        expect(() => validateHeaders(input)).toThrow(
          `Header "h2" has a non-string value of type "${errorMessageType}"`,
        );
      },
    );
  });
});
