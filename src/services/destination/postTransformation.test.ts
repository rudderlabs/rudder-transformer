import { BaseError } from '@rudderstack/integrations-lib';
import type { DeliveryJobState, MetaTransferObject, ProxyMetdata } from '../../types';
import { DestinationPostTransformationService } from './postTransformation';

jest.mock('../errorReporting', () => ({
  ErrorReportingService: {
    reportError: jest.fn(),
  },
}));

const metadata = (jobId: number): ProxyMetdata => ({
  jobId,
  attemptNum: 0,
  userId: '',
  sourceId: 'source-1',
  destinationId: 'dest-1',
  workspaceId: 'workspace-1',
  secret: {},
  dontBatch: false,
});

const buildMetaTransferObject = (metadatas: ProxyMetdata[]): MetaTransferObject => ({
  metadatas,
  errorContext: '[test] delivery failure',
  errorDetails: {
    module: 'destination',
    implementation: 'native',
    feature: 'dataDelivery',
    destType: 'BRAZE',
    destinationId: 'dest-1',
    workspaceId: 'workspace-1',
  },
});

describe('DestinationPostTransformationService.handlevV1DeliveriesFailureEvents', () => {
  it('preserves destination-provided per-job response states when a TransformerProxyError carries them', () => {
    const metadatas = [metadata(1), metadata(2)];
    const perJobResponse: DeliveryJobState[] = [
      { statusCode: 200, metadata: metadatas[0], error: '{"message":"success"}' },
      { statusCode: 296, metadata: metadatas[1], error: "'external_id' is required" },
    ];
    const error = new BaseError(
      'Request failed for braze with status: 400',
      400,
      { errorCategory: 'network', errorType: 'aborted' },
      { response: { message: 'success' }, status: 200 } as unknown as string,
    ) as BaseError & { response: DeliveryJobState[] };
    error.response = perJobResponse;

    const result = DestinationPostTransformationService.handlevV1DeliveriesFailureEvents(
      error,
      buildMetaTransferObject(metadatas),
    );

    expect(result).toEqual({
      response: perJobResponse,
      statTags: {
        errorCategory: 'network',
        errorType: 'aborted',
        module: 'destination',
        implementation: 'native',
        feature: 'dataDelivery',
        destType: 'BRAZE',
        destinationId: 'dest-1',
        workspaceId: 'workspace-1',
      },
      message: 'Request failed for braze with status: 400',
      status: 400,
    });
  });
});
