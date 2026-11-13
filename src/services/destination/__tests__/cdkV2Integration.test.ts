import { processCdkV2Workflow } from '../../../cdk/v2/handler';
import { ProcessorTransformationRequest } from '../../../types';
import stats from '../../../util/stats';
import { ErrorReportingService } from '../../errorReporting';
import { CDKV2DestinationService } from '../cdkV2Integration';

jest.mock('../../../cdk/v2/handler', () => ({ processCdkV2Workflow: jest.fn() }));

afterEach(() => jest.restoreAllMocks());

test('CDK v2 processor rejects only the conflicting event before counting successes', async () => {
  const report = jest.spyOn(ErrorReportingService, 'reportError').mockImplementation(jest.fn());
  const increment = jest.spyOn(stats, 'increment').mockImplementation(jest.fn());
  const events = [1, 2].map(
    (jobId) =>
      ({
        message: { jobId },
        metadata: { jobId, destinationId: `dest-${jobId}`, workspaceId: `ws-${jobId}` },
      }) as unknown as ProcessorTransformationRequest,
  );
  const good = {
    version: 'v0',
    type: 'REST',
    method: 'POST',
    endpoint: '/ok',
    body: { JSON: { id: 1 } },
  };
  const bad = { ...good, body: { JSON: { id: 2 }, GZIP: { payload: 'compressed' } } };
  jest
    .mocked(processCdkV2Workflow)
    .mockImplementation(async (_dest, event) => (event.metadata.jobId === 1 ? good : [good, bad]));

  const result = await new CDKV2DestinationService().doProcessorTransformation(
    events,
    'example',
    'v0',
    {},
  );

  expect(result).toEqual([
    { output: { ...good, userId: '' }, metadata: events[0].metadata, statusCode: 200 },
    {
      metadata: events[1].metadata,
      statusCode: 400,
      error: 'delivery request has more than one non-empty body format: JSON, GZIP',
      statTags: {
        errorCategory: 'platform',
        destType: 'EXAMPLE',
        module: 'destination',
        implementation: 'cdkV2',
        feature: 'processor',
        destinationId: 'dest-2',
        workspaceId: 'ws-2',
      },
    },
  ]);
  expect(report).toHaveBeenCalledTimes(1);
  expect(increment.mock.calls.filter(([name]) => name === 'event_transform_success')).toHaveLength(
    1,
  );
  expect(increment.mock.calls.filter(([name]) => name === 'event_transform_failure')).toHaveLength(
    1,
  );
});
