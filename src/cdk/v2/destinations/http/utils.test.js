const { encodeParamsObject, prepareEndpoint, prepareBody } = require('./utils');

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
      const payload = { root: { key: 'value', key2: null } };
      const expectedXML =
        '<?xml version="1.0" encoding="UTF-8"?><root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><key>value</key><key2 xsi:nil></key2></root>';
      const result = prepareBody(payload, 'XML');
      expect(result).toEqual({ payload: expectedXML });
    });

    test('should prepare FORM-URLENCODED payload when content type is FORM-URLENCODED', () => {
      const payload = { key1: 'value1', key2: 'value2' };
      const expectedFORM = { key1: 'value1', key2: 'value2' };
      const result = prepareBody(payload, 'FORM-URLENCODED');
      expect(result).toEqual(expectedFORM);
    });

    test('should return original payload without null or undefined values for other content types', () => {
      const payload = { key1: 'value1', key2: null, key3: undefined, key4: 'value4' };
      const expected = { key1: 'value1', key4: 'value4' };
      const result = prepareBody(payload, 'JSON');
      expect(result).toEqual(expected);
    });
  });
});
