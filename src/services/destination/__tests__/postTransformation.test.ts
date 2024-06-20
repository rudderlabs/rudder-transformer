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
});
