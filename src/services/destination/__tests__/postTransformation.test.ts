import { MetaTransferObject } from '../../../types/index';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { DestinationPostTransformationService } from '../postTransformation';
import { DeliveryV1Response, ProcessorTransformationResponse, ProxyMetdata } from '../../../types';

afterEach(() => {
  jest.restoreAllMocks();
});

const metadata = (jobId: number): ProxyMetdata => ({
  jobId,
  attemptNum: 0,
  userId: `user-${jobId}`,
  sourceId: 'source-1',
  destinationId: 'destination-1',
  workspaceId: 'workspace-1',
  secret: {},
  dontBatch: false,
});

const metaTo = (metadatas: ProxyMetdata[]): MetaTransferObject => ({
  errorContext: 'error context',
  errorDetails: {
    destType: 'TEST',
    module: 'destination',
    implementation: 'native',
    feature: 'dataDelivery',
  },
  metadatas,
});

describe('PostTransformation Service', () => {
  test('should handleProcessorTransformFailureEvents', async () => {
    const e = new Error('test error');
    const meta = { errorContext: 'error Context' } as MetaTransferObject;
    const resp = DestinationPostTransformationService.handleProcessorTransformFailureEvents(
      e,
      meta,
    );

    const expected = {
      statusCode: 500,
      error: 'test error',
      statTags: { errorCategory: 'transformation' },
    } as ProcessorTransformationResponse;

    expect(resp).toEqual(expected);
  });

  describe('handlevV1DeliveriesFailureEvents', () => {
    const metadatas = [metadata(1), metadata(2), metadata(3)];

    const cases = [
      {
        name: 'uses the serialized destination response body',
        message: 'destination rejected the batch',
        destinationResponse: { status: 400, response: { code: 'invalid', detail: 'bad data' } },
        expectedError: JSON.stringify({ code: 'invalid', detail: 'bad data' }),
      },
      {
        name: 'falls back to the error message for an undefined response body',
        message: 'destination request failed',
        destinationResponse: { status: 500, response: undefined },
        expectedError: 'destination request failed',
      },
      {
        name: 'falls back to the default delivery message when the error message is empty',
        message: '',
        destinationResponse: { status: 500, response: undefined },
        expectedError: '[Delivery] Error occured while processing payload',
      },
    ];

    test.each(cases)(
      'serializes once and $name',
      ({ message, destinationResponse, expectedError }) => {
        const error = new TransformerProxyError(
          message,
          destinationResponse.status,
          {},
          destinationResponse,
        );
        const stringifySpy = jest.spyOn(JSON, 'stringify');

        const result = DestinationPostTransformationService.handlevV1DeliveriesFailureEvents(
          error,
          metaTo(metadatas),
        ) as DeliveryV1Response;

        expect(result).toEqual({
          status: destinationResponse.status,
          message,
          statTags: {
            errorCategory: 'network',
            errorType: 'aborted',
            destType: 'TEST',
            module: 'destination',
            implementation: 'native',
            feature: 'dataDelivery',
          },
          response: metadatas.map((jobMetadata) => ({
            error: expectedError,
            statusCode: destinationResponse.status,
            metadata: jobMetadata,
          })),
        });
        expect(result.response[1].error).toBe(result.response[0].error);
        expect(result.response[2].error).toBe(result.response[0].error);
        expect(
          stringifySpy.mock.calls.filter(([value]) => value === destinationResponse.response),
        ).toHaveLength(1);
      },
    );
  });
});
