import {
  firstJobIdentity,
  handleDeliveryResponse,
  toDeliveryV1Response,
} from '../../../services/destination/destinationIntegration/delivery';
import type { DeliveryContext } from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';
import { Integration } from './routerTransform';

const job = (jobId: number, dontBatch = false): ProxyMetdata =>
  ({
    jobId,
    attemptNum: 1,
    userId: `u${jobId}`,
    sourceId: 'src-1',
    destinationId: 'dest-1',
    workspaceId: 'ws-1',
    secret: {},
    dontBatch,
  }) as ProxyMetdata;

const ctxFor = (status: number, jobs: ProxyMetdata[]): DeliveryContext => ({
  status,
  response: {
    error: {
      message: 'invalid payload',
      code: 'invalid_event',
      param: 'events[0]',
      errors: [
        {
          message: 'nested invalid field',
          code: 'missing_event_data_type',
          param: 'events[0].data.type',
        },
      ],
    },
  },
  jobs,
  request: {
    body: { JSON: { events: jobs.map((metadata) => ({ id: metadata.jobId })) } },
  } as unknown as ProxyV1Request,
  destinationConfig: {},
  ...firstJobIdentity(jobs),
});

const viaFramework = (ctx: DeliveryContext) =>
  toDeliveryV1Response(handleDeliveryResponse(Integration, ctx), ctx, 'OPENAI_ADS');
const errorMessage =
  'invalid payload (code: invalid_event, param: events[0]) | ' +
  'nested invalid field (code: missing_event_data_type, param: events[0].data.type)';

describe('OpenAI Ads delivery', () => {
  it('marks multi-job 400/422 responses for dontBatch singleton retry', () => {
    const response = viaFramework(ctxFor(400, [job(1), job(2)]));

    expect(response.response).toEqual([
      { statusCode: 500, metadata: { ...job(1), dontBatch: true }, error: errorMessage },
      { statusCode: 500, metadata: { ...job(2), dontBatch: true }, error: errorMessage },
    ]);
  });

  it('terminates singleton 400 when dontBatch isolation already happened', () => {
    expect(viaFramework(ctxFor(422, [job(1, true)])).response).toEqual([
      { statusCode: 400, metadata: job(1, true), error: errorMessage },
    ]);
  });

  it('keeps 429 throttled and 5xx retryable without dontBatch', () => {
    expect(() => viaFramework(ctxFor(429, [job(1), job(2)]))).toThrow(/invalid payload/);
    expect(() => viaFramework(ctxFor(500, [job(1), job(2)]))).toThrow(/invalid payload/);
  });
});
