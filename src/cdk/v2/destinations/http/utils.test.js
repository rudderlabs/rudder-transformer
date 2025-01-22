const { encodeParamsObject, prepareEndpoint, getXMLPayload } = require('./utils');

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
      const apiUrl = 'https://api.example.com/resource/${$.id}';
      expect(prepareEndpoint(message, apiUrl, [])).toBe('https://api.example.com/resource/123');
    });
    test('should replace template variables in API URL and add path params', () => {
      const message = { id: 123, p2: 'P2' };
      const apiUrl = 'https://api.example.com/resource/${$.id}';
      const pathParams = [
        {
          path: 'p1',
        },
        {
          path: '$.p2',
        },
      ];
      expect(prepareEndpoint(message, apiUrl, pathParams)).toBe(
        'https://api.example.com/resource/123/p1/P2',
      );
    });
    test('should add path params after uri encoding', () => {
      const message = { id: 123, p2: 'P2%&' };
      const apiUrl = 'https://api.example.com/resource/${$.id}';
      const pathParams = [
        {
          path: 'p1',
        },
        {
          path: '$.p2',
        },
      ];
      expect(prepareEndpoint(message, apiUrl, pathParams)).toBe(
        'https://api.example.com/resource/123/p1/P2%25%26',
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

  describe('getXMLPayload', () => {
    test('should generate XML payload with correct structure', () => {
      const payload = { key: null };
      const expectedXML = '<?xml version="1.0" encoding="UTF-8"?><key xsi:nil></key>';
      const result = getXMLPayload(payload);
      expect(result).toBe(expectedXML);
    });
  });
});
