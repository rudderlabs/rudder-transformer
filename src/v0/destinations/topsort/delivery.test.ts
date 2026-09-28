import {
  firstJobIdentity,
  handleDeliveryResponse,
  toDeliveryV1Response,
  type DeliveryContext,
} from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata } from '../../../types';
import { ENDPOINT } from './config';
import { Integration } from './routerTransform';

const job = (jobId: number, dontBatch = false): ProxyMetdata => ({
  jobId,
  attemptNum: 1,
  userId: `u${jobId}`,
  sourceId: 'src-1',
  destinationId: 'dest-1',
  workspaceId: 'ws-1',
  secret: {},
  dontBatch,
});

const ctxFor = (status: number, response: unknown, jobs: ProxyMetdata[]): DeliveryContext => ({
  status,
  response,
  jobs,
  request: {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: ENDPOINT,
    userId: '',
    body: { JSON: { clicks: jobs.map(({ jobId }) => ({ id: `msg-${jobId}` })) } },
    metadata: jobs,
    destinationConfig: {},
  },
  destinationConfig: {},
  ...firstJobIdentity(jobs),
});

const viaFramework = (ctx: DeliveryContext) =>
  toDeliveryV1Response(handleDeliveryResponse(Integration, ctx), ctx, 'TOPSORT');

const futureEventResponse = [
  {
    errCode: 'invalid_event_time',
    docUrl: 'https://docs.topsort.com/en/api-reference/errors',
    message: 'At least one event is in the future',
  },
  { errCode: 'no_purchase_items', message: 'At least one item must be purchased' },
];
const futureEventMessage =
  'invalid_event_time: At least one event is in the future | ' +
  'no_purchase_items: At least one item must be purchased';

describe('Topsort delivery', () => {
  it('retries every job of a rejected batch alone on a 400', () => {
    expect(viaFramework(ctxFor(400, futureEventResponse, [job(1), job(2)])).response).toEqual([
      { statusCode: 500, metadata: job(1, true), error: futureEventMessage },
      { statusCode: 500, metadata: job(2, true), error: futureEventMessage },
    ]);
  });

  // The Events API documents only 400 for a rejected request, so any other 4xx keeps the
  // framework default: the batch is aborted as a whole, without dontBatch.
  it('aborts a 422 as a whole batch, without dontBatch', () => {
    expect(() => viaFramework(ctxFor(422, futureEventResponse, [job(1), job(2)]))).toThrow(
      futureEventMessage,
    );
  });

  it('aborts a job that was already sent alone', () => {
    expect(viaFramework(ctxFor(400, futureEventResponse, [job(1, true)])).response).toEqual([
      { statusCode: 400, metadata: job(1, true), error: futureEventMessage },
    ]);
  });

  it('aborts a 401 as a whole batch, with a generic reason for a non-array body', () => {
    expect(() => viaFramework(ctxFor(401, { detail: 'unauthorized' }, [job(1), job(2)]))).toThrow(
      '[TOPSORT] Topsort request failed',
    );
  });

  it('keeps a 5xx retryable as a batch, without dontBatch', () => {
    expect(() => viaFramework(ctxFor(500, futureEventResponse, [job(1), job(2)]))).toThrow(
      futureEventMessage,
    );
  });
});
