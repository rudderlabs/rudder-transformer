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

  describe('serialization fallbacks', () => {
    const metaTo = {
      errorDetails: {
        destType: 'FB_CUSTOM_AUDIENCE',
        module: 'destination',
        implementation: 'native',
        feature: 'dataDelivery',
        destinationId: 'dest-1',
        workspaceId: 'ws-1',
      },
    } as MetaTransferObject;

    // Every other delivery failure carries these, and rudder-server categorises off them - a
    // fallback without them lands uncategorised in the dashboards used to spot this failure.
    const expectedStatTags = {
      destType: 'FB_CUSTOM_AUDIENCE',
      module: 'destination',
      implementation: 'native',
      feature: 'dataDelivery',
      destinationId: 'dest-1',
      workspaceId: 'ws-1',
      errorCategory: 'platform',
      errorType: 'retryable',
    };

    test('buildSerializationFallbackV0 returns a small, bounded, categorised v0 error response', () => {
      const resp = DestinationPostTransformationService.buildSerializationFallbackV0(
        metaTo,
        'tooLarge',
      );

      expect(resp).toEqual({
        status: 500,
        message: 'Destination response payload was too large to serialize',
        destinationResponse: 'Destination response payload was too large to serialize',
        statTags: expectedStatTags,
      });
    });

    test('buildSerializationFallbackV0 reports a non-size failure as unserializable', () => {
      const resp = DestinationPostTransformationService.buildSerializationFallbackV0(
        metaTo,
        'unserializable',
      );

      expect(resp.message).toEqual('Destination response payload could not be serialized');
      expect(resp.destinationResponse).toEqual(
        'Destination response payload could not be serialized',
      );
    });

    test('buildSerializationFallbackV1 maps every job to its own bounded error entry', () => {
      const metadata = [{ jobId: 1 } as any, { jobId: 2 } as any, { jobId: 3 } as any];

      const resp = DestinationPostTransformationService.buildSerializationFallbackV1(
        metadata,
        metaTo,
        'tooLarge',
      );

      expect(resp).toEqual({
        status: 500,
        message: 'Destination response payload was too large to serialize',
        statTags: expectedStatTags,
        response: metadata.map((m) => ({
          error: 'Destination response payload was too large to serialize',
          statusCode: 500,
          metadata: m,
        })),
      });
    });

    test('buildSerializationFallbackV1 reports a non-size failure as unserializable', () => {
      const metadata = [{ jobId: 1 } as any];

      const resp = DestinationPostTransformationService.buildSerializationFallbackV1(
        metadata,
        metaTo,
        'unserializable',
      );

      expect(resp.message).toEqual('Destination response payload could not be serialized');
      expect(resp.response[0].error).toEqual(
        'Destination response payload could not be serialized',
      );
    });
  });
});
