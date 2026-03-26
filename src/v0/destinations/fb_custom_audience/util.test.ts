import sha256 from 'sha256';
import { getDataSource, responseBuilderSimple, processAndAppendDataElement } from './util';
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

// Helper: normalize a single field value without hashing
const normalize = (field: string, value: string) =>
  processAndAppendDataElement(
    [],
    true,
    false,
    field,
    value,
    TEST_WORKSPACE_ID,
    TEST_DESTINATION_ID,
  )[0];

describe('FB_custom_audience utils test', () => {
  describe('processAndAppendDataElement', () => {
    describe('hashing', () => {
      it('hashes field value when isHashRequired is true', () => {
        expect(
          processAndAppendDataElement(
            [],
            true,
            false,
            'FN',
            'some-name',
            TEST_WORKSPACE_ID,
            TEST_DESTINATION_ID,
          ),
        ).toEqual([sha256('somename')]); // 'some-name' normalized (hyphen stripped) → 'somename'
      });

      it('passes field value through unchanged when isHashRequired is false', () => {
        expect(
          processAndAppendDataElement(
            [],
            false,
            false,
            'FN',
            'some-name',
            TEST_WORKSPACE_ID,
            TEST_DESTINATION_ID,
          ),
        ).toEqual(['some-name']);
      });

      describe('fields that are never hashed', () => {
        it('passes MADID value through unchanged regardless of isHashRequired', () => {
          expect(
            processAndAppendDataElement(
              [],
              true,
              false,
              'MADID',
              'some-id',
              TEST_WORKSPACE_ID,
              TEST_DESTINATION_ID,
            ),
          ).toEqual(['some-id']);
        });

        it('passes EXTERN_ID value through unchanged regardless of isHashRequired', () => {
          expect(
            processAndAppendDataElement(
              [],
              true,
              false,
              'EXTERN_ID',
              'some-ext-id',
              TEST_WORKSPACE_ID,
              TEST_DESTINATION_ID,
            ),
          ).toEqual(['some-ext-id']);
        });

        it('passes empty MADID value through unchanged', () => {
          expect(
            processAndAppendDataElement(
              [],
              true,
              false,
              'MADID',
              '',
              TEST_WORKSPACE_ID,
              TEST_DESTINATION_ID,
            ),
          ).toEqual(['']);
        });

        it('passes empty EXTERN_ID value through unchanged', () => {
          expect(
            processAndAppendDataElement(
              [],
              true,
              false,
              'EXTERN_ID',
              '',
              TEST_WORKSPACE_ID,
              TEST_DESTINATION_ID,
            ),
          ).toEqual(['']);
        });
      });

      describe('hashing consistency validation', () => {
        const hashedValue = 'b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576ca48e1cb0d7d6267'; // sha256 of 'test'
        const plaintextEmail = 'user@example.com';
        const mockStatsIncrement = stats.increment as jest.Mock;

        beforeEach(() => {
          mockStatsIncrement.mockClear();
        });

        afterEach(() => {
          delete process.env.AUDIENCE_HASHING_VALIDATION_ENABLED;
        });

        describe('when validation is enabled', () => {
          beforeEach(() => {
            process.env.AUDIENCE_HASHING_VALIDATION_ENABLED = 'true';
          });

          it('hashing ON + pre-hashed value → emits metric and throws', () => {
            expect(() =>
              processAndAppendDataElement(
                [],
                true,
                false,
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

          it('hashing ON + plaintext value → no error, no metric', () => {
            expect(() =>
              processAndAppendDataElement(
                [],
                true,
                false,
                'EMAIL',
                plaintextEmail,
                TEST_WORKSPACE_ID,
                TEST_DESTINATION_ID,
              ),
            ).not.toThrow();
            expect(mockStatsIncrement).not.toHaveBeenCalled();
          });

          it('hashing OFF + plaintext value → emits metric and throws', () => {
            expect(() =>
              processAndAppendDataElement(
                [],
                false,
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

          it('hashing OFF + 64-char hex value → no error, no metric', () => {
            expect(() =>
              processAndAppendDataElement(
                [],
                false,
                false,
                'EMAIL',
                hashedValue,
                TEST_WORKSPACE_ID,
                TEST_DESTINATION_ID,
              ),
            ).not.toThrow();
            expect(mockStatsIncrement).not.toHaveBeenCalled();
          });
        });

        describe('when validation is disabled (default)', () => {
          it('hashing ON + pre-hashed value → emits metric but does not throw', () => {
            expect(() =>
              processAndAppendDataElement(
                [],
                true,
                false,
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

          it('hashing OFF + plaintext value → emits metric but does not throw', () => {
            expect(() =>
              processAndAppendDataElement(
                [],
                false,
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

    describe('normalization', () => {
      describe('PHONE', () => {
        const cases = [
          { input: '+1 (650) 555-1212', normalized: '16505551212' },
          { input: '00919876543210', normalized: '919876543210' },
          { input: '+44 20 7946 0958', normalized: '442079460958' },
        ];
        cases.forEach(({ input, normalized }) => {
          it(`"${input}" → sha256("${normalized}")`, () => {
            expect(normalize('PHONE', input)).toBe(sha256(normalized));
          });
        });
      });

      describe('FN / LN — lowercase, remove ASCII punctuation, preserve spaces and UTF-8', () => {
        const cases = [
          { input: 'Mary', normalized: 'mary' },
          { input: 'Valéry', normalized: 'valéry' },
          { input: '정', normalized: '정' },
          { input: "O'Brien", normalized: 'obrien' },
          { input: 'John Smith1', normalized: 'john smith1' },
          { input: 'Mary-Jane', normalized: 'maryjane' },
        ];
        (['FN', 'LN'] as const).forEach((field) => {
          cases.forEach(({ input, normalized }) => {
            it(`${field}: "${input}" → sha256("${normalized}")`, () => {
              expect(normalize(field, input)).toBe(sha256(normalized));
            });
          });
        });
      });

      describe('COUNTRY — lowercase, must be exactly two alpha characters', () => {
        describe('valid codes', () => {
          const validCases = [
            { input: 'US', normalized: 'us' },
            { input: 'in', normalized: 'in' },
            { input: 'GB', normalized: 'gb' },
          ];
          validCases.forEach(({ input, normalized }) => {
            it(`"${input}" → sha256("${normalized}")`, () => {
              expect(normalize('COUNTRY', input)).toBe(sha256(normalized));
            });
          });
        });

        describe('invalid codes', () => {
          const invalidCases = [
            { input: 'USA', normalized: 'usa', description: 'three letters' },
            { input: 'U', normalized: 'u', description: 'single letter' },
            { input: 'U1', normalized: 'u1', description: 'contains digit' },
            { input: '12', normalized: '12', description: 'all digits' },
          ];
          invalidCases.forEach(({ input, normalized, description }) => {
            it(`${description}: "${input}" → sha256("${normalized}") when reject disabled`, () => {
              expect(normalize('COUNTRY', input)).toBe(sha256(normalized));
            });
          });

          it('increments stats counter and returns empty string when reject enabled', () => {
            const mockStatsIncrement = stats.increment as jest.Mock;
            mockStatsIncrement.mockClear();
            process.env.FB_CUSTOM_AUDIENCE_REJECT_INVALID_FIELDS = 'true';
            try {
              const result = normalize('COUNTRY', 'USA');
              expect(result).toBe('');
              expect(mockStatsIncrement).toHaveBeenCalledWith('fb_custom_audience_invalid_field', {
                fieldName: 'COUNTRY',
                workspaceId: TEST_WORKSPACE_ID,
                destinationId: TEST_DESTINATION_ID,
              });
            } finally {
              delete process.env.FB_CUSTOM_AUDIENCE_REJECT_INVALID_FIELDS;
            }
          });
        });
      });

      describe('ZIP — remove spaces and dashes, lowercase', () => {
        const cases = [
          { input: '94035-1234', normalized: '940351234' },
          { input: 'M1 1AE', normalized: 'm11ae' },
          { input: '75018', normalized: '75018' },
          { input: '  K1A 0A6  ', normalized: 'k1a0a6' },
        ];
        cases.forEach(({ input, normalized }) => {
          it(`"${input}" → sha256("${normalized}")`, () => {
            expect(normalize('ZIP', input)).toBe(sha256(normalized));
          });
        });
      });
    });

    describe('LOOKALIKE_VALUE', () => {
      const cases = [
        { name: 'parses valid string number', value: '5', expected: [5] },
        { name: 'defaults to 0 when value is negative', value: '-5', expected: [0] },
        { name: 'defaults to 0 when value is NaN', value: 'not-a-number', expected: [0] },
        { name: 'defaults to 0 when value is Infinity', value: Infinity, expected: [0] },
        { name: 'defaults to 0 when value is null', value: null, expected: [0] },
        { name: 'defaults to 0 when value is undefined', value: undefined, expected: [0] },
        { name: 'parses small float', value: '0.0001', expected: [0.0001] },
      ];
      cases.forEach(({ name, value, expected }) => {
        it(name, () => {
          expect(
            processAndAppendDataElement(
              [],
              true,
              false,
              'LOOKALIKE_VALUE',
              value,
              TEST_WORKSPACE_ID,
              TEST_DESTINATION_ID,
            ),
          ).toEqual(expected);
        });
      });
    });
  });

  describe('getDataSource', () => {
    it('returns empty object when type and subType are both NA', () => {
      expect(getDataSource('NA', 'NA')).toEqual({});
    });

    it('sets type when value matches preset list', () => {
      expect(getDataSource('EVENT_BASED', 'something')).toEqual({ type: 'EVENT_BASED' });
    });
  });

  describe('responseBuilderSimple', () => {
    it('returns correct response for add payload', () => {
      const payload = basePayload;
      payload.operationCategory = 'add';
      const expectedResponse = baseResponse;
      expectedResponse.method = 'POST';
      expect(responseBuilderSimple(payload, '23848494844100489')).toEqual(expectedResponse);
    });

    it('returns correct response for delete payload', () => {
      const payload = basePayload;
      payload.operationCategory = 'remove';
      const expectedResponse = baseResponse;
      expectedResponse.method = 'DELETE';
      expect(responseBuilderSimple(payload, '23848494844100489')).toEqual(expectedResponse);
    });

    it('throws when payload is empty', () => {
      let emptyPayload: WrappedResponse | undefined;
      expect.assertions(1);
      try {
        responseBuilderSimple(emptyPayload, '');
      } catch (error: any) {
        expect(error.message).toEqual('Payload could not be constructed');
      }
    });
  });
});
