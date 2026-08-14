import { MetaTransferObject } from '../../../types/index';
import { DestinationPostTransformationService } from '../postTransformation';
import { ProcessorTransformationResponse } from '../../../types';

describe('PostTransformation Service', () => {
  test('should handleProcessorTransformFailureEvents', async () => {
    const e = new Error('test error');
    const metaTo = { errorContext: 'error Context' } as MetaTransferObject;
    const resp = DestinationPostTransformationService.handleProcessorTransformFailureEvents(
      e,
      metaTo,
    );

    const expected = {
      statusCode: 500,
      error: 'test error',
      statTags: { errorCategory: 'transformation' },
    } as ProcessorTransformationResponse;

    expect(resp).toEqual(expected);
  });

  test('buildResponseTooLargeFallbackV0 returns a small, bounded v0 error response', () => {
    const resp = DestinationPostTransformationService.buildResponseTooLargeFallbackV0();

    expect(resp).toEqual({
      status: 500,
      message: 'Destination response payload was too large to serialize',
      destinationResponse: 'Destination response payload was too large to serialize',
      statTags: {},
    });
  });

  test('buildResponseTooLargeFallbackV1 maps every job to its own bounded error entry', () => {
    const metadata = [{ jobId: 1 } as any, { jobId: 2 } as any, { jobId: 3 } as any];

    const resp = DestinationPostTransformationService.buildResponseTooLargeFallbackV1(metadata);

    expect(resp).toEqual({
      status: 500,
      message: 'Destination response payload was too large to serialize',
      response: metadata.map((m) => ({
        error: 'Destination response payload was too large to serialize',
        statusCode: 500,
        metadata: m,
      })),
    });
  });
});
