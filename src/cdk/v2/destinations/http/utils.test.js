const {
  encodeParamsObject,
  prepareEndpoint,
  prepareBody,
  stringifyFirstLevelValues,
} = require('./utils');

const { XMLBuilder } = require('fast-xml-parser');
const jsonpath = require('rs-jsonpath');

describe('Utils Functions', () => {
  describe('encodeParamsObject', () => {
    test('should return empty object for invalid inputs', () => {
      expect(encodeParamsObject(null)).toEqual({});
      expect(encodeParamsObject(undefined)).toEqual({});
      expect(encodeParamsObject('string')).toEqual({});
    });

    test('should encode object keys and values', () => {
      const params = { key1: 'value1', key2: 'value2 3 4' };
      const expected = { key1: 'value1', key2: 'value2%203%204' };
      expect(encodeParamsObject(params)).toEqual(expected);
    });
  });

  describe('prepareEndpoint', () => {
    test('should replace template variables in API URL', () => {
      const message = { id: 123 };
      const apiUrl = 'https://api.example.com/resource/';
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
      const expectedFORM = { key1: 'value1', key2: 'value2', key3: '{"subKey":"value3"}' };
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
      const expected = { a: '1', b: 'true', c: '{"d":42}' };
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
});
