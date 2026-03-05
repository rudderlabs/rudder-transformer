import { getDataSource, responseBuilderSimple, getUpdatedDataElement } from './util';
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
        name: 'Should not hash field if isHashRequired is set to false (pre-hashed input is passed through as-is)',
        initialData: [],
        isHashRequired: false,
        field: 'FN',
        value: '59107c750fd5ee2758d1988f2bf12d9f110439221ebdb7997e70d6a2c1c5afda',
        expected: ['59107c750fd5ee2758d1988f2bf12d9f110439221ebdb7997e70d6a2c1c5afda'],
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
          'ws-1',
          'dest-1',
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
        delete process.env.FB_CUSTOM_AUDIENCE_HASHING_VALIDATION_ENABLED;
      });

      it('Hashing ON + pre-hashed value → emits metric and throws when validation enabled', () => {
        process.env.FB_CUSTOM_AUDIENCE_HASHING_VALIDATION_ENABLED = 'true';
        expect(() =>
          getUpdatedDataElement([], true, 'EMAIL', hashedValue, 'ws-1', 'dest-1'),
        ).toThrow(
          'Hashing is enabled but the value for field EMAIL appears to already be hashed. Either disable hashing or send unhashed data.',
        );
        expect(mockStatsIncrement).toHaveBeenCalledWith(
          'fb_custom_audience_hashing_inconsistency',
          {
            propertyName: 'EMAIL',
            type: 'hashed_when_hash_enabled',
            workspaceId: 'ws-1',
            destinationId: 'dest-1',
          },
        );
      });

      it('Hashing ON + plaintext value → no error, no metric', () => {
        expect(() =>
          getUpdatedDataElement([], true, 'EMAIL', plaintextEmail, 'ws-1', 'dest-1'),
        ).not.toThrow();
        expect(mockStatsIncrement).not.toHaveBeenCalled();
      });

      it('Hashing OFF + plaintext value → emits metric and throws when validation enabled', () => {
        process.env.FB_CUSTOM_AUDIENCE_HASHING_VALIDATION_ENABLED = 'true';
        expect(() =>
          getUpdatedDataElement([], false, 'EMAIL', plaintextEmail, 'ws-1', 'dest-1'),
        ).toThrow(
          'Hashing is disabled but the value for field EMAIL appears to be unhashed. Either enable hashing or send pre-hashed data.',
        );
        expect(mockStatsIncrement).toHaveBeenCalledWith(
          'fb_custom_audience_hashing_inconsistency',
          {
            propertyName: 'EMAIL',
            type: 'unhashed_when_hash_disabled',
            workspaceId: 'ws-1',
            destinationId: 'dest-1',
          },
        );
      });

      it('Hashing OFF + 64-char hex value → no error, no metric', () => {
        expect(() =>
          getUpdatedDataElement([], false, 'EMAIL', hashedValue, 'ws-1', 'dest-1'),
        ).not.toThrow();
        expect(mockStatsIncrement).not.toHaveBeenCalled();
      });

      it('Validation disabled (default) + hashing ON + pre-hashed value → emits metric but no throw', () => {
        expect(() =>
          getUpdatedDataElement([], true, 'EMAIL', hashedValue, 'ws-1', 'dest-1'),
        ).not.toThrow();
        expect(mockStatsIncrement).toHaveBeenCalledWith(
          'fb_custom_audience_hashing_inconsistency',
          {
            propertyName: 'EMAIL',
            type: 'hashed_when_hash_enabled',
            workspaceId: 'ws-1',
            destinationId: 'dest-1',
          },
        );
      });

      it('Validation disabled (default) + hashing OFF + plaintext value → emits metric but no throw', () => {
        expect(() =>
          getUpdatedDataElement([], false, 'EMAIL', plaintextEmail, 'ws-1', 'dest-1'),
        ).not.toThrow();
        expect(mockStatsIncrement).toHaveBeenCalledWith(
          'fb_custom_audience_hashing_inconsistency',
          {
            propertyName: 'EMAIL',
            type: 'unhashed_when_hash_disabled',
            workspaceId: 'ws-1',
            destinationId: 'dest-1',
          },
        );
      });
    });
  });
});
