import { MetaTransferObject } from '../../../types/index';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { DestinationPostTransformationService } from '../postTransformation';
import {
  DeliveryV1Response,
  ProcessorTransformationResponse,
  ProxyMetdata,
  RouterTransformationResponse,
} from '../../../types';
import stats from '../../../util/stats';
import { ErrorReportingService } from '../../errorReporting';

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

  describe('router delivery body validation', () => {
    const good = {
      version: 'v0',
      type: 'REST',
      method: 'POST',
      endpoint: '/ok',
      body: { JSON: { id: 1 } },
    };
    const bad = { ...good, body: { JSON: { id: 2 }, GZIP: { payload: 'compressed' } } };
    const jobs = [metadata(1), { ...metadata(2), destinationId: 'destination-2' }];
    const destination = { ID: 'destination-1' };
    const input = [
      { batchedRequest: good, metadata: [jobs[0]], destination, statusCode: 200, batched: false },
      { batchedRequest: bad, metadata: [jobs[1]], destination, statusCode: 200, batched: false },
    ] as unknown as RouterTransformationResponse[];
    const errorDetails = {
      destType: 'EXAMPLE',
      module: 'destination',
      implementation: 'native',
      feature: 'router',
      destinationId: jobs[0].destinationId,
      workspaceId: jobs[0].workspaceId,
    };
    const expectedFailure = {
      metadata: [jobs[1]],
      destination,
      batched: false,
      statusCode: 400,
      error: 'delivery request has more than one non-empty body format: JSON, GZIP',
      statTags: {
        errorCategory: 'platform',
        ...errorDetails,
        destinationId: jobs[1].destinationId,
      },
    };
    const cases = [
      { name: 'one request', batchedRequest: bad },
      { name: 'one invalid nested request', batchedRequest: [good, bad] },
      { name: '2xx response with an error key', batchedRequest: bad, error: 'old error' },
    ];

    it.each(cases)('rejects $name and keeps sibling responses', ({ batchedRequest, error }) => {
      const report = jest.spyOn(ErrorReportingService, 'reportError').mockImplementation(jest.fn());
      const increment = jest.spyOn(stats, 'increment').mockImplementation(jest.fn());
      const responses = [{ ...input[0] }, { ...input[1], batchedRequest, ...(error && { error }) }];
      const meta: MetaTransferObject = {
        errorContext: 'router error',
        errorDetails,
        metadata: jobs[0],
      };

      const result = DestinationPostTransformationService.handleRouterTransformSuccessEvents(
        responses,
        undefined,
        meta,
        'native',
        'EXAMPLE',
      );

      expect(result).toEqual([{ ...input[0], batchedRequest: { ...good } }, expectedFailure]);
      expect(report).toHaveBeenCalledTimes(1);
      expect(
        increment.mock.calls.filter(([name]) => name === 'event_transform_success'),
      ).toHaveLength(1);
      expect(
        increment.mock.calls.filter(([name]) => name === 'event_transform_failure'),
      ).toHaveLength(1);
    });

    it('runs the metadata hook for valid and failed responses', () => {
      const report = jest.spyOn(ErrorReportingService, 'reportError').mockImplementation(jest.fn());
      const hook = jest.fn((response: RouterTransformationResponse) =>
        response.destination ? response.metadata : [],
      );
      const result = DestinationPostTransformationService.handleRouterTransformSuccessEvents(
        input,
        { processMetadataForRouter: hook },
        { errorContext: 'router error', errorDetails, metadata: jobs[0] },
        'native',
        'EXAMPLE',
      );

      expect(result).toEqual([input[0], expectedFailure]);
      expect(hook).toHaveBeenCalledTimes(2);
      expect(report).toHaveBeenCalledTimes(1);
    });
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
