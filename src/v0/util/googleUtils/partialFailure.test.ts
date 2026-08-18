import {
  formatGoogleAdsErrors,
  getErrorCodeLabel,
  getFieldPath,
  getOperationIndex,
  parsePartialFailure,
  GoogleAdsError,
  PartialFailureError,
} from './partialFailure';

const failureWith = (errors: GoogleAdsError[], requestId?: string): PartialFailureError => ({
  code: 3,
  message: 'summary message',
  details: [
    {
      '@type': 'type.googleapis.com/google.ads.googleads.v23.errors.GoogleAdsFailure',
      errors,
      ...(requestId ? { requestId } : {}),
    },
  ],
});

describe('getErrorCodeLabel', () => {
  it('flattens the errorCode oneof into a label', () => {
    expect(getErrorCodeLabel({ errorCode: { internalError: 'INTERNAL_ERROR' } })).toBe(
      'internalError: INTERNAL_ERROR',
    );
  });

  it('returns undefined when errorCode is absent or not an object', () => {
    expect(getErrorCodeLabel({})).toBeUndefined();
    expect(getErrorCodeLabel({ errorCode: 'INTERNAL_ERROR' } as never)).toBeUndefined();
  });
});

describe('getOperationIndex', () => {
  it('reads the index of the named operation field', () => {
    const error = {
      location: { fieldPathElements: [{ fieldName: 'conversions', index: 3 }] },
    };
    expect(getOperationIndex(error, 'conversions')).toBe(3);
  });

  it('resolves index 0, which is the most common case', () => {
    const error = {
      location: { fieldPathElements: [{ fieldName: 'conversions', index: 0 }] },
    };
    expect(getOperationIndex(error, 'conversions')).toBe(0);
  });

  it('resolves nested paths where the leaf element carries no index', () => {
    const error = {
      location: {
        fieldPathElements: [
          { fieldName: 'conversions', index: 1 },
          { fieldName: 'conversion_action' },
        ],
      },
    };
    expect(getOperationIndex(error, 'conversions')).toBe(1);
  });

  it('falls back to the first indexed element when the field name does not match', () => {
    const error = {
      location: { fieldPathElements: [{ fieldName: 'conversion_adjustments', index: 2 }] },
    };
    expect(getOperationIndex(error, 'conversions')).toBe(2);
  });

  it('returns undefined when there is no location or no index', () => {
    expect(getOperationIndex({}, 'conversions')).toBeUndefined();
    expect(
      getOperationIndex(
        { location: { fieldPathElements: [{ fieldName: 'conversion_action' }] } },
        'conversions',
      ),
    ).toBeUndefined();
  });

  it('ignores an index on a nested repeated field', () => {
    // conversions.user_identifiers[2] is identifier 2 of ONE conversion, not conversion 2.
    expect(
      getOperationIndex(
        {
          location: {
            fieldPathElements: [
              { fieldName: 'conversions' },
              { fieldName: 'user_identifiers', index: 2 },
            ],
          },
        },
        'conversions',
      ),
    ).toBeUndefined();
  });
});

describe('parsePartialFailure', () => {
  it('groups errors by conversion index and picks up the request id', () => {
    const partialFailureError = failureWith(
      [
        {
          errorCode: { conversionUploadError: 'NO_CONVERSION_ACTION_FOUND' },
          message: 'The conversion action cannot be found.',
          location: {
            fieldPathElements: [
              { fieldName: 'conversions', index: 1 },
              { fieldName: 'conversion_action' },
            ],
          },
        },
        {
          errorCode: { internalError: 'INTERNAL_ERROR' },
          message: 'An internal error has occurred.',
          location: { fieldPathElements: [{ fieldName: 'conversions', index: 4 }] },
        },
      ],
      'f4J_sjHfhbgNieU4pkBOqg',
    );

    const { errorsByIndex, unindexedErrors, requestId } = parsePartialFailure(partialFailureError);

    expect(requestId).toBe('f4J_sjHfhbgNieU4pkBOqg');
    expect(unindexedErrors).toEqual([]);
    expect(errorsByIndex.get(1)?.[0]?.message).toBe('The conversion action cannot be found.');
    expect(errorsByIndex.get(4)?.[0]?.errorCode).toEqual({ internalError: 'INTERNAL_ERROR' });
  });

  it('collects several errors reported against the same conversion', () => {
    const partialFailureError = failureWith([
      {
        message: 'first',
        location: { fieldPathElements: [{ fieldName: 'conversions', index: 0 }] },
      },
      {
        message: 'second',
        location: { fieldPathElements: [{ fieldName: 'conversions', index: 0 }] },
      },
    ]);

    expect(parsePartialFailure(partialFailureError).errorsByIndex.get(0)).toHaveLength(2);
  });

  it('treats errors without a location as request-wide', () => {
    const partialFailureError = failureWith([
      { errorCode: { conversionAdjustmentUploadError: 'CONVERSION_ALREADY_ENHANCED' } },
    ]);

    const { errorsByIndex, unindexedErrors } = parsePartialFailure(partialFailureError);
    expect(errorsByIndex.size).toBe(0);
    expect(unindexedErrors).toHaveLength(1);
  });

  it('returns empty results for malformed or missing input', () => {
    [undefined, {}, { details: 'nope' }, { details: [{}] }].forEach((input) => {
      const parsed = parsePartialFailure(input as PartialFailureError);
      expect(parsed.errorsByIndex.size).toBe(0);
      expect(parsed.unindexedErrors).toEqual([]);
      expect(parsed.requestId).toBeUndefined();
    });
  });
});

describe('getFieldPath', () => {
  it('renders indexed and scalar elements as a readable path', () => {
    expect(
      getFieldPath({
        location: {
          fieldPathElements: [
            { fieldName: 'conversions', index: 1 },
            { fieldName: 'conversion_action' },
          ],
        },
      }),
    ).toBe('conversions[1].conversion_action');
  });

  it('returns undefined when there is no usable location', () => {
    expect(getFieldPath({})).toBeUndefined();
    expect(getFieldPath({ location: { fieldPathElements: [] } })).toBeUndefined();
  });
});

describe('formatGoogleAdsErrors', () => {
  it('renders the message with its error code and the request id', () => {
    expect(
      formatGoogleAdsErrors(
        [
          {
            errorCode: { internalError: 'INTERNAL_ERROR' },
            message: 'An internal error occurred.',
          },
        ],
        'fallback',
        'req-1',
      ),
    ).toBe('An internal error occurred. [internalError: INTERNAL_ERROR] (requestId: req-1)');
  });

  it('keeps the field path Google reported for the failing conversion', () => {
    expect(
      formatGoogleAdsErrors(
        [
          {
            errorCode: { conversionUploadError: 'NO_CONVERSION_ACTION_FOUND' },
            message: 'The conversion action cannot be found.',
            location: {
              fieldPathElements: [
                { fieldName: 'conversions', index: 1 },
                { fieldName: 'conversion_action' },
              ],
            },
          },
        ],
        'fallback',
      ),
    ).toBe(
      'The conversion action cannot be found. [conversionUploadError: NO_CONVERSION_ACTION_FOUND] at conversions[1].conversion_action',
    );
  });

  it('joins multiple errors for the same event', () => {
    expect(formatGoogleAdsErrors([{ message: 'a' }, { message: 'b' }], 'fallback')).toBe('a; b');
  });

  it('falls back to the summary message when there is nothing more specific', () => {
    expect(formatGoogleAdsErrors([], 'fallback')).toBe('fallback');
    expect(formatGoogleAdsErrors(undefined, 'fallback', 'req-1')).toBe(
      'fallback (requestId: req-1)',
    );
  });

  it('does not splice the batch summary next to a specific code', () => {
    // The summary describes the FIRST error in the batch, so pairing it with another error's
    // code would attribute the wrong cause.
    expect(
      formatGoogleAdsErrors([{ errorCode: { internalError: 'INTERNAL_ERROR' } }], 'summary'),
    ).toBe('[internalError: INTERNAL_ERROR]');
  });

  it('caps how many errors are rendered per event', () => {
    const errors = Array.from({ length: 10 }, (_, i) => ({ message: `e${i}` }));
    expect(formatGoogleAdsErrors(errors, 'fallback')).toBe('e0; e1; e2; (+7 more)');
  });

  it('truncates without losing the request id or the dropped-error count', () => {
    const errors = Array.from({ length: 10 }, () => ({ message: 'x'.repeat(5000) }));
    const formatted = formatGoogleAdsErrors(errors, 'fallback', 'req-1');
    expect(formatted.length).toBeLessThan(1200);
    expect(formatted).toContain('(truncated)');
    expect(formatted).toContain('(+7 more)');
    expect(formatted.endsWith('(requestId: req-1)')).toBe(true);
  });

  it('stays bounded when a request-wide error set is replayed onto every event', () => {
    const errors = Array.from({ length: 2000 }, () => ({
      message: 'An internal error has occurred.',
    }));
    expect(formatGoogleAdsErrors(errors, 'fallback').length).toBeLessThan(200);
  });
});
