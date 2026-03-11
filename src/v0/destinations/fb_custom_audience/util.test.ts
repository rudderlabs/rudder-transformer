import {
  getDataSource,
  responseBuilderSimple,
  getUpdatedDataElement,
  ensureApplicableFormat,
} from './util';
import { getEndPoint, ENDPOINT_PATH } from './config';
jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
}));

import stats from '../../../util/stats';
import type { WrappedResponse } from './types';
const basePayload = {
  responseField: {
    access_token: 'ABC',
    payload: {
      schema: ['EMAIL', 'FI'],
      data: [
        [
          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
        ],
      ],
    },
  },
  operationCategory: '',
};

const baseResponse = {
  version: '1',
  type: 'REST',
  endpoint: getEndPoint('23848494844100489'),
  endpointPath: ENDPOINT_PATH,
  headers: {},
  params: {
    access_token: 'ABC',
    payload: {
      schema: ['EMAIL', 'FI'],
      data: [
        [
          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
        ],
      ],
    },
  },
  body: {
    JSON: {},
    JSON_ARRAY: {},
    XML: {},
    FORM: {},
  },
  files: {},
  method: '',
};

const TEST_WORKSPACE_ID = 'ws-1';
const TEST_DESTINATION_ID = 'dest-1';

describe('ensureApplicableFormat', () => {
  describe('PHONE', () => {
    const cases = [
      { input: '+1 (650) 555-1212', expected: '16505551212' },
      { input: '00919876543210', expected: '919876543210' },
      { input: '+44 20 7946 0958', expected: '442079460958' },
    ];
    cases.forEach(({ input, expected }) => {
      it(`"${input}" → "${expected}"`, () => {
        expect(ensureApplicableFormat('PHONE', input, TEST_WORKSPACE_ID, TEST_DESTINATION_ID)).toBe(
          expected,
        );
      });
    });
  });

  describe('FN / LN — lowercase, remove ASCII punctuation, preserve spaces and UTF-8', () => {
    const cases = [
      { input: 'Mary', expected: 'mary' },
      { input: 'Valéry', expected: 'valéry' },
      { input: '정', expected: '정' },
      { input: "O'Brien", expected: 'obrien' },
      { input: 'John Smith1', expected: 'john smith1' },
      { input: 'Mary-Jane', expected: 'maryjane' },
    ];
    (['FN', 'LN'] as const).forEach((field) => {
      cases.forEach(({ input, expected }) => {
        it(`${field}: "${input}" → "${expected}"`, () => {
          expect(ensureApplicableFormat(field, input, TEST_WORKSPACE_ID, TEST_DESTINATION_ID)).toBe(
            expected,
          );
        });
      });
    });
  });

  describe('COUNTRY — lowercase, must be exactly two alpha characters', () => {
    const validCases = [
      { input: 'US', expected: 'us' },
      { input: 'in', expected: 'in' },
      { input: 'GB', expected: 'gb' },
    ];
    validCases.forEach(({ input, expected }) => {
      it(`valid: "${input}" → "${expected}"`, () => {
        expect(
          ensureApplicableFormat('COUNTRY', input, TEST_WORKSPACE_ID, TEST_DESTINATION_ID),
        ).toBe(expected);
      });
    });

    const invalidCases = [
      { input: 'USA', description: 'three letters' },
      { input: 'U', description: 'single letter' },
      { input: 'U1', description: 'contains digit' },
      { input: '12', description: 'all digits' },
      { input: '', description: 'empty string' },
    ];
    invalidCases.forEach(({ input, description }) => {
      it(`invalid (${description}): "${input}" → passes through when reject disabled`, () => {
        const result = ensureApplicableFormat(
          'COUNTRY',
          input,
          TEST_WORKSPACE_ID,
          TEST_DESTINATION_ID,
        );
        expect(result).toBe(input.toLowerCase());
      });
    });

    it('invalid country code → increments stats counter and returns empty string when reject enabled', () => {
      const mockStatsIncrement = stats.increment as jest.Mock;
      mockStatsIncrement.mockClear();
      process.env.FB_CUSTOM_AUDIENCE_REJECT_INVALID_FIELDS = 'true';
      try {
        const result = ensureApplicableFormat(
          'COUNTRY',
          'USA',
          TEST_WORKSPACE_ID,
          TEST_DESTINATION_ID,
        );
        expect(result).toBe('');
        expect(mockStatsIncrement).toHaveBeenCalledWith('fb_custom_audience_invalid_country_code', {
          workspaceId: TEST_WORKSPACE_ID,
          destinationId: TEST_DESTINATION_ID,
        });
      } finally {
        delete process.env.FB_CUSTOM_AUDIENCE_REJECT_INVALID_FIELDS;
      }
    });
  });

  describe('ZIP — remove spaces and dashes, lowercase', () => {
    const cases = [
      { input: '94035-1234', expected: '940351234' },
      { input: 'M1 1AE', expected: 'm11ae' },
      { input: '75018', expected: '75018' },
      { input: '  K1A 0A6  ', expected: 'k1a0a6' },
    ];
    cases.forEach(({ input, expected }) => {
      it(`"${input}" → "${expected}"`, () => {
        expect(ensureApplicableFormat('ZIP', input, TEST_WORKSPACE_ID, TEST_DESTINATION_ID)).toBe(
          expected,
        );
      });
    });
  });
});

describe('FB_custom_audience utils test', () => {
  describe('getDataSource function tests', () => {
    it('Should return empty datasource if type and subType are both NA', () => {
      const expectedDataSource = {};
      const dataSource = getDataSource('NA', 'NA');
      expect(dataSource).toEqual(expectedDataSource);
    });
    it('Should set subType and type if value present in destination config macthes with preset list', () => {
      const expectedDataSource = {
        type: 'EVENT_BASED',
      };
      const dataSource = getDataSource('EVENT_BASED', 'something');
      expect(dataSource).toEqual(expectedDataSource);
    });
  });

  describe('responseBuilderSimple function tests', () => {
    it('Should return correct response for add payload', () => {
      const payload = basePayload;
      payload.operationCategory = 'add';
      const expectedResponse = baseResponse;
      expectedResponse.method = 'POST';
      const response = responseBuilderSimple(payload, '23848494844100489');
      expect(response).toEqual(expectedResponse);
    });

    it('Should return correct response for delete payload', () => {
      const payload = basePayload;
      payload.operationCategory = 'remove';
      const expectedResponse = baseResponse;
      expectedResponse.method = 'DELETE';
      const response = responseBuilderSimple(payload, '23848494844100489');
      expect(response).toEqual(expectedResponse);
    });

    it('Should throw error if payload is empty', () => {
      let emptyPayload: WrappedResponse | undefined;
      expect.assertions(1);
      try {
        responseBuilderSimple(emptyPayload, '');
      } catch (error: any) {
        expect(error.message).toEqual('Payload could not be constructed');
      }
    });
  });

  describe('getUpdatedDataElement function tests', () => {
    const testCases = [
      {
        name: 'Should hash field if isHashRequired is set to true',
        initialData: [],
        isHashRequired: true,
        field: 'FN',
        value: 'some-name',
        expected: ['59107c750fd5ee2758d1988f2bf12d9f110439221ebdb7997e70d6a2c1c5afda'],
      },
      {
        name: 'Should not hash field if isHashRequired is set to false',
        initialData: [],
        isHashRequired: false,
        field: 'FN',
        value: 'some-name',
        expected: ['some-name'],
      },
      {
        name: 'Should not hash MADID and just pass value',
        initialData: [],
        isHashRequired: true,
        field: 'MADID',
        value: 'some-id',
        expected: ['some-id'],
      },
      {
        name: 'Should not hash EXTERN_ID and just pass value',
        initialData: ['some-id'],
        isHashRequired: true,
        field: 'EXTERN_ID',
        value: 'some-ext-id',
        expected: ['some-id', 'some-ext-id'],
      },
      {
        name: 'Should not hash MADID and just pass empty value if value does not exist',
        initialData: [],
        isHashRequired: true,
        field: 'MADID',
        value: '',
        expected: [''],
      },
      {
        name: 'Should not hash EXTERN_ID and just pass empty value if value does not exist',
        initialData: [''],
        isHashRequired: true,
        field: 'EXTERN_ID',
        value: '',
        expected: ['', ''],
      },
      {
        name: 'Should correctly parse LOOKALIKE_VALUE to given string number value',
        initialData: [],
        isHashRequired: true,
        field: 'LOOKALIKE_VALUE',
        value: '5',
        expected: [5],
      },
      {
        name: 'Should default LOOKALIKE_VALUE to 0 when value is negative',
        initialData: [],
        isHashRequired: true,
        field: 'LOOKALIKE_VALUE',
        value: '-5',
        expected: [0],
      },
      {
        name: 'Should default LOOKALIKE_VALUE to 0 when value is NaN',
        initialData: [],
        isHashRequired: true,
        field: 'LOOKALIKE_VALUE',
        value: 'not-a-number',
        expected: [0],
      },
      {
        name: 'Should default LOOKALIKE_VALUE to 0 when value is Infinity',
        initialData: [],
        isHashRequired: true,
        field: 'LOOKALIKE_VALUE',
        value: Infinity,
        expected: [0],
      },
      {
        name: 'Should default LOOKALIKE_VALUE to 0 when value is null',
        initialData: [],
        isHashRequired: true,
        field: 'LOOKALIKE_VALUE',
        value: null,
        expected: [0],
      },
      {
        name: 'Should default LOOKALIKE_VALUE to 0 when value is undefined',
        initialData: [],
        isHashRequired: true,
        field: 'LOOKALIKE_VALUE',
        value: undefined,
        expected: [0],
      },
      {
        name: 'Should correctly parse small float LOOKALIKE_VALUE',
        initialData: [],
        isHashRequired: false,
        field: 'LOOKALIKE_VALUE',
        value: '0.0001',
        expected: [0.0001],
      },
    ];

    testCases.forEach(({ name, initialData, isHashRequired, field, value, expected }) => {
      it(name, () => {
        const result = getUpdatedDataElement(
          [...initialData],
          isHashRequired,
          field,
          value,
          TEST_WORKSPACE_ID,
          TEST_DESTINATION_ID,
        );
        expect(result).toEqual(expected);
      });
    });

    describe('validateHashingConsistency function tests', () => {
      const hashedValue = 'b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576ca48e1cb0d7d6267'; // sha256 of 'test'
      const plaintextEmail = 'user@example.com';
      const mockStatsIncrement = stats.increment as jest.Mock;

      beforeEach(() => {
        mockStatsIncrement.mockClear();
      });

      afterEach(() => {
        delete process.env.AUDIENCE_HASHING_VALIDATION_ENABLED;
      });

      it('Hashing ON + pre-hashed value → emits metric and throws when validation enabled', () => {
        process.env.AUDIENCE_HASHING_VALIDATION_ENABLED = 'true';
        expect(() =>
          getUpdatedDataElement(
            [],
            true,
            'EMAIL',
            hashedValue,
            TEST_WORKSPACE_ID,
            TEST_DESTINATION_ID,
          ),
        ).toThrow(
          'Hashing is enabled but the value for field EMAIL appears to already be hashed. Either disable hashing or send unhashed data.',
        );
        expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
          propertyName: 'EMAIL',
          type: 'hashed_when_hash_enabled',
          workspaceId: 'ws-1',
          destinationId: 'dest-1',
          destType: 'fb_custom_audience',
        });
      });

      it('Hashing ON + plaintext value → no error, no metric', () => {
        expect(() =>
          getUpdatedDataElement(
            [],
            true,
            'EMAIL',
            plaintextEmail,
            TEST_WORKSPACE_ID,
            TEST_DESTINATION_ID,
          ),
        ).not.toThrow();
        expect(mockStatsIncrement).not.toHaveBeenCalled();
      });

      it('Hashing OFF + plaintext value → emits metric and throws when validation enabled', () => {
        process.env.AUDIENCE_HASHING_VALIDATION_ENABLED = 'true';
        expect(() =>
          getUpdatedDataElement(
            [],
            false,
            'EMAIL',
            plaintextEmail,
            TEST_WORKSPACE_ID,
            TEST_DESTINATION_ID,
          ),
        ).toThrow(
          'Hashing is disabled but the value for field EMAIL appears to be unhashed. Either enable hashing or send pre-hashed data.',
        );
        expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
          propertyName: 'EMAIL',
          type: 'unhashed_when_hash_disabled',
          workspaceId: 'ws-1',
          destinationId: 'dest-1',
          destType: 'fb_custom_audience',
        });
      });

      it('Hashing OFF + 64-char hex value → no error, no metric', () => {
        expect(() =>
          getUpdatedDataElement(
            [],
            false,
            'EMAIL',
            hashedValue,
            TEST_WORKSPACE_ID,
            TEST_DESTINATION_ID,
          ),
        ).not.toThrow();
        expect(mockStatsIncrement).not.toHaveBeenCalled();
      });

      it('Validation disabled (default) + hashing ON + pre-hashed value → emits metric but no throw', () => {
        expect(() =>
          getUpdatedDataElement(
            [],
            true,
            'EMAIL',
            hashedValue,
            TEST_WORKSPACE_ID,
            TEST_DESTINATION_ID,
          ),
        ).not.toThrow();
        expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
          propertyName: 'EMAIL',
          type: 'hashed_when_hash_enabled',
          workspaceId: 'ws-1',
          destinationId: 'dest-1',
          destType: 'fb_custom_audience',
        });
      });

      it('Validation disabled (default) + hashing OFF + plaintext value → emits metric but no throw', () => {
        expect(() =>
          getUpdatedDataElement(
            [],
            false,
            'EMAIL',
            plaintextEmail,
            TEST_WORKSPACE_ID,
            TEST_DESTINATION_ID,
          ),
        ).not.toThrow();
        expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
          propertyName: 'EMAIL',
          type: 'unhashed_when_hash_disabled',
          workspaceId: 'ws-1',
          destinationId: 'dest-1',
          destType: 'fb_custom_audience',
        });
      });
    });
  });
});
