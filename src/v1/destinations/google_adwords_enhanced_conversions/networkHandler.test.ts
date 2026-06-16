import { NetworkError } from '@rudderstack/integrations-lib';
import { ProxyMetdata, ResponseProxyObject } from '../../../types';
import { gaecResponseHandler } from './networkHandler';

const makeMetadata = (jobId: number): ProxyMetdata => ({
  jobId,
  attemptNum: 1,
  userId: 'user-1',
  sourceId: 'source-1',
  destinationId: 'dest-1',
  workspaceId: 'ws-1',
  secret: {},
  dontBatch: false,
});

const partialFailureDetails = [
  {
    '@type': 'type.googleapis.com/google.ads.googleads.v15.errors.GoogleAdsFailure',
    errors: [
      {
        errorCode: { conversionAdjustmentUploadError: 'CONVERSION_ALREADY_ENHANCED' },
        message: 'Conversion already enhanced',
      },
    ],
  },
];

describe('google adwords enhanced conversions v1 - gaecResponseHandler', () => {
  const successCases = [
    {
      name: 'returns all events as success when no partial failure',
      input: {
        destinationResponse: {
          status: 200,
          response: [{ results: [{ adjustmentType: 'ENHANCEMENT' }] }],
        },
        rudderJobMetadata: [makeMetadata(1), makeMetadata(2)],
      },
      expected: {
        status: 200,
        message: 'Request Processed Successfully',
        response: [
          { statusCode: 200, metadata: makeMetadata(1), error: 'success' },
          { statusCode: 200, metadata: makeMetadata(2), error: 'success' },
        ],
      },
    },
    {
      name: 'returns success when partialFailureError has code 0',
      input: {
        destinationResponse: {
          status: 200,
          response: { partialFailureError: { code: 0 }, results: [{}, {}] },
        },
        rudderJobMetadata: [makeMetadata(1)],
      },
      expected: {
        status: 200,
        message: 'Request Processed Successfully',
        response: [{ statusCode: 200, metadata: makeMetadata(1), error: 'success' }],
      },
    },
    {
      name: 'handles undefined response body as success',
      input: {
        destinationResponse: { status: 200, response: undefined },
        rudderJobMetadata: [makeMetadata(1)],
      },
      expected: {
        status: 200,
        message: 'Request Processed Successfully',
        response: [{ statusCode: 200, metadata: makeMetadata(1), error: 'success' }],
      },
    },
  ];

  it.each(successCases)('$name', ({ input, expected }) => {
    const result = gaecResponseHandler(input);
    expect(result).toEqual(expect.objectContaining(expected));
  });

  const partialFailureCases = [
    {
      name: 'maps per-event success/failure with mixed results',
      input: {
        destinationResponse: {
          status: 200,
          response: {
            partialFailureError: {
              code: 3,
              message: 'event at index 1 failed, at conversion_adjustments[1]',
              details: partialFailureDetails,
            },
            results: [{ adjustmentType: 'ENHANCEMENT', orderId: '100' }, {}],
          },
        },
        rudderJobMetadata: [makeMetadata(1), makeMetadata(2)],
      },
      expected: {
        status: 400,
        response: [
          { statusCode: 200, metadata: makeMetadata(1), error: 'success' },
          {
            statusCode: 400,
            metadata: makeMetadata(2),
            error: 'event at index 1 failed, at conversion_adjustments[1]',
          },
        ],
      },
    },
    {
      name: 'marks all events as failed when no results array',
      input: {
        destinationResponse: {
          status: 200,
          response: {
            partialFailureError: { code: 3, message: 'all events failed' },
          },
        },
        rudderJobMetadata: [makeMetadata(1), makeMetadata(2)],
      },
      expected: {
        status: 400,
        response: [
          { statusCode: 400, metadata: makeMetadata(1), error: 'all events failed' },
          { statusCode: 400, metadata: makeMetadata(2), error: 'all events failed' },
        ],
      },
    },
    {
      name: 'uses "unknown error format" when partialFailureError has no message',
      input: {
        destinationResponse: {
          status: 200,
          response: { partialFailureError: { code: 3 }, results: [{}] },
        },
        rudderJobMetadata: [makeMetadata(1)],
      },
      expected: {
        status: 400,
        response: [{ statusCode: 400, metadata: makeMetadata(1), error: 'unknown error format' }],
      },
    },
  ];

  it.each(partialFailureCases)('$name', ({ input, expected }) => {
    const result = gaecResponseHandler(input);
    expect(result).toEqual(expect.objectContaining(expected));
  });

  it('returns correct statTags on partial failure', () => {
    const result = gaecResponseHandler({
      destinationResponse: {
        status: 200,
        response: { partialFailureError: { code: 3, message: 'some error' }, results: [{}] },
      },
      rudderJobMetadata: [makeMetadata(1)],
    }) as ResponseProxyObject;

    expect(result.statTags).toEqual({
      errorCategory: 'network',
      errorType: 'aborted',
      destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
      module: 'destination',
      implementation: 'native',
      feature: 'dataDelivery',
      destinationId: 'dest-1',
      workspaceId: 'ws-1',
    });
  });

  it('throws NetworkError for non-2xx status', () => {
    expect(() =>
      gaecResponseHandler({
        destinationResponse: {
          status: 401,
          response: { error: { message: 'Invalid credentials' } },
        },
        rudderJobMetadata: [makeMetadata(1)],
      }),
    ).toThrow(NetworkError);
  });
});
