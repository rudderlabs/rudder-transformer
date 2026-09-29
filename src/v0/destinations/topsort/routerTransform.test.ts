import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import type {
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types/destinationTransformation';
import type { Destination } from '../../../types';
import { MAX_BATCH_SIZE } from './config';
import { Integration } from './routerTransform';
import type { TopsortEventType } from './types';

const destination: Destination = {
  ID: 'topsort-dest-1',
  Config: {
    apiKey: 'dummyApiKey',
    topsortEvents: [
      { from: 'Product Clicked', to: 'clicks' },
      { from: 'Product Viewed', to: 'impressions' },
      { from: 'Order Completed', to: 'purchases' },
      { from: 'Checkout Started', to: 'impressions' },
    ],
  },
  DestinationDefinition: { ID: 'destDef-1', Name: 'TOPSORT', DisplayName: 'Topsort', Config: {} },
  Name: 'topsort',
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

const makeInput = (
  jobId: number,
  event: string,
  properties: Record<string, unknown> = {},
): RouterTransformationRequestData => ({
  message: {
    type: 'track',
    event,
    anonymousId: 'anon-1',
    messageId: `msg-${jobId}`,
    timestamp: '2024-11-05T15:19:08+00:00',
    properties: { product_id: 'p-1', ...properties },
  },
  metadata: {
    jobId,
    workspaceId: 'ws-1',
    destinationId: 'topsort-dest-1',
    sourceId: 'src-1',
    sourceType: 'web',
    sourceCategory: 'cloud',
    destinationType: 'TOPSORT',
    messageId: `msg-${jobId}`,
  },
  destination,
});

const productsOf = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ product_id: `p-${i}` }));

const run = (inputs: RouterTransformationRequestData[]): Promise<RouterTransformationResponse[]> =>
  processDestinationIntegration(inputs, Integration, {});

// A response's `batchedRequest` is a single request, or an array of them when
// `combineBatchRequestsWithSameJobIds` folds several chunks back into one response —
// which happens whenever a chunk boundary falls inside one job's fanned-out products.
const requestBodies = (results: RouterTransformationResponse[]): Record<string, unknown>[] =>
  results
    .flatMap(({ batchedRequest }) => (batchedRequest ? [batchedRequest].flat() : []))
    .map(({ body }) => body?.JSON ?? {});

const countOf = (body: Record<string, unknown>, eventType: TopsortEventType): number => {
  const events = body[eventType];
  return Array.isArray(events) ? events.length : 0;
};

const failedJobIds = (results: RouterTransformationResponse[]) =>
  results.filter(({ batched }) => !batched).flatMap(({ metadata }) => metadata.map((m) => m.jobId));

describe('Topsort batching', () => {
  it('starts a new request when an event array reaches the API cap', async () => {
    const inputs = Array.from({ length: MAX_BATCH_SIZE + 20 }, (_, i) =>
      makeInput(i, 'Product Clicked'),
    );

    const bodies = requestBodies(await run(inputs));

    expect(bodies.map((body) => countOf(body, 'clicks'))).toEqual([MAX_BATCH_SIZE, 20]);
  });

  it('sends clicks, impressions and purchases together in one request', async () => {
    const inputs = [
      makeInput(1, 'Product Clicked'),
      makeInput(2, 'Product Viewed'),
      makeInput(3, 'Order Completed'),
    ];

    const bodies = requestBodies(await run(inputs));

    expect(bodies).toEqual([
      {
        clicks: [expect.objectContaining({ id: 'msg-1' })],
        impressions: [expect.objectContaining({ id: 'msg-2' })],
        purchases: [expect.objectContaining({ id: 'msg-3' })],
      },
    ]);
  });

  it('caps each event array independently, so other types keep filling the request', async () => {
    // 60 clicks then 10 purchases: the first request fills with 50 clicks, and the rest of the
    // clicks ride with the purchases in the second.
    const inputs = [
      ...Array.from({ length: 60 }, (_, i) => makeInput(i, 'Product Clicked')),
      ...Array.from({ length: 10 }, (_, i) => makeInput(60 + i, 'Order Completed')),
    ];

    const bodies = requestBodies(await run(inputs));

    expect(bodies.map((body) => [countOf(body, 'clicks'), countOf(body, 'purchases')])).toEqual([
      [MAX_BATCH_SIZE, 0],
      [10, 10],
    ]);
  });

  it('counts fanned-out products against the cap, not input events', async () => {
    // 6 events x 10 products = 60 impressions, which must not ride in one request.
    const inputs = Array.from({ length: 6 }, (_, i) =>
      makeInput(i, 'Checkout Started', { products: productsOf(10) }),
    );

    const bodies = requestBodies(await run(inputs));

    expect(bodies.map((body) => countOf(body, 'impressions'))).toEqual([MAX_BATCH_SIZE, 10]);
  });

  it('accounts for every job once when the cap falls inside one job', async () => {
    // 7 events x 8 products = 56 impressions. The 50th lands mid-way through job 6, so that
    // job's events straddle two requests, which the framework folds into one response.
    const inputs = Array.from({ length: 7 }, (_, i) =>
      makeInput(i, 'Checkout Started', { products: productsOf(8) }),
    );

    const results = await run(inputs);

    expect(requestBodies(results).map((body) => countOf(body, 'impressions'))).toEqual([
      MAX_BATCH_SIZE,
      6,
    ]);
    expect(results.flatMap(({ metadata }) => metadata.map((m) => m.jobId)).sort()).toEqual([
      0, 1, 2, 3, 4, 5, 6,
    ]);
  });

  it('gives fanned-out events distinct ids that are stable across runs', async () => {
    const inputs = [makeInput(1, 'Checkout Started', { products: productsOf(3) })];
    const expected = [
      {
        impressions: [
          expect.objectContaining({ id: 'msg-1-0' }),
          expect.objectContaining({ id: 'msg-1-1' }),
          expect.objectContaining({ id: 'msg-1-2' }),
        ],
      },
    ];

    // Retry idempotency: the same input must produce the same ids.
    expect(requestBodies(await run(inputs))).toEqual(expected);
    expect(requestBodies(await run(inputs))).toEqual(expected);
  });
});

describe('Topsort validation', () => {
  const failureCases: { name: string; input: RouterTransformationRequestData }[] = [
    { name: 'an unmapped event', input: makeInput(2, 'Totally Unmapped Event') },
    {
      name: 'a non-track event',
      input: { ...makeInput(2, 'Product Clicked'), message: { type: 'identify', messageId: 'm' } },
    },
    {
      name: 'a missing messageId',
      input: {
        ...makeInput(2, 'Product Clicked'),
        message: { type: 'track', event: 'Product Clicked', properties: {} },
      },
    },
  ];

  it.each(failureCases)('fails only the offending job for $name', async ({ input }) => {
    const results = await run([makeInput(1, 'Product Clicked'), input]);

    expect(requestBodies(results)).toEqual([
      { clicks: [expect.objectContaining({ id: 'msg-1' })] },
    ]);
    expect(failedJobIds(results)).toEqual([2]);
  });

  it('emits no request when every event fails', async () => {
    const results = await run([makeInput(1, 'Unmapped A'), makeInput(2, 'Unmapped B')]);

    expect(requestBodies(results)).toEqual([]);
    expect(failedJobIds(results)).toEqual([1, 2]);
  });
});
