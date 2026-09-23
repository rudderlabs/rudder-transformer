import { Integration } from './routerTransform';
import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import { MAX_BATCH_SIZE } from './config';

const destination = {
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

const makeInput = (jobId: number, event: string, properties: Record<string, unknown> = {}) =>
  ({
    message: {
      type: 'track',
      event,
      anonymousId: 'anon-1',
      messageId: `msg-${jobId}`,
      timestamp: '2024-11-05T15:19:08+00:00',
      properties: { product_id: 'p-1', ...properties },
    },
    metadata: { jobId, workspaceId: 'ws-1' },
    destination,
  }) as never;

const bodiesOf = (results: any[]) =>
  results.filter((r) => r.batched).map((r) => r.batchedRequest.body.JSON);

describe('Topsort batching', () => {
  it('splits a group larger than the API cap into several requests', async () => {
    const inputs = Array.from({ length: MAX_BATCH_SIZE + 20 }, (_, i) =>
      makeInput(i, 'Product Clicked'),
    );

    const bodies = bodiesOf(await processDestinationIntegration(inputs, Integration, {}));

    expect(bodies).toHaveLength(2);
    expect(bodies[0].clicks).toHaveLength(MAX_BATCH_SIZE);
    expect(bodies[1].clicks).toHaveLength(20);
    bodies.forEach((b) => expect(Object.keys(b)).toEqual(['clicks']));
  });

  it('counts fanned-out products against the cap, not input events', async () => {
    // 6 events x 10 products = 60 impressions, which must not ride in one request.
    const products = Array.from({ length: 10 }, (_, i) => ({ product_id: `p-${i}` }));
    const inputs = Array.from({ length: 6 }, (_, i) =>
      makeInput(i, 'Checkout Started', { products }),
    );

    const bodies = bodiesOf(await processDestinationIntegration(inputs, Integration, {}));

    expect(bodies.flatMap((b) => b.impressions)).toHaveLength(60);
    bodies.forEach((b) => expect(b.impressions.length).toBeLessThanOrEqual(MAX_BATCH_SIZE));
  });

  it('sends each event type as its own request', async () => {
    const inputs = [
      makeInput(1, 'Product Clicked'),
      makeInput(2, 'Product Viewed'),
      makeInput(3, 'Order Completed'),
    ];

    const bodies = bodiesOf(await processDestinationIntegration(inputs, Integration, {}));
    const keys = bodies.flatMap((b) => Object.keys(b)).sort();

    expect(keys).toEqual(['clicks', 'impressions', 'purchases']);
    bodies.forEach((b) => expect(Object.values(b)[0]).toHaveLength(1));
  });

  it('gives fanned-out events distinct ids that are stable across runs', async () => {
    const inputs = [
      makeInput(1, 'Checkout Started', {
        products: [{ product_id: 'a' }, { product_id: 'b' }, { product_id: 'c' }],
      }),
    ];

    const first = bodiesOf(await processDestinationIntegration(inputs, Integration, {}));
    const second = bodiesOf(await processDestinationIntegration(inputs, Integration, {}));

    const ids = first[0].impressions.map((e: any) => e.id);
    expect(ids).toEqual(['msg-1-0', 'msg-1-1', 'msg-1-2']);
    // Retry idempotency: the same input must produce the same ids.
    expect(second[0].impressions.map((e: any) => e.id)).toEqual(ids);
  });

  it('fails only the offending job when an event is not mapped', async () => {
    const inputs = [makeInput(1, 'Product Clicked'), makeInput(2, 'Totally Unmapped Event')];

    const results = await processDestinationIntegration(inputs, Integration, {});
    const bodies = bodiesOf(results);
    const failures = results.filter((r) => !r.batched);

    expect(bodies[0].clicks).toHaveLength(1);
    expect(failures).toHaveLength(1);
    expect(failures[0].metadata[0].jobId).toBe(2);
  });

  it('rejects non-track events', async () => {
    const input = makeInput(1, 'Product Clicked');
    (input as any).message.type = 'identify';

    const results = await processDestinationIntegration([input], Integration, {});

    expect(results[0].statusCode).toBe(400);
  });

  it('emits no request when every event fails', async () => {
    const inputs = [makeInput(1, 'Unmapped A'), makeInput(2, 'Unmapped B')];

    const results = await processDestinationIntegration(inputs, Integration, {});

    expect(bodiesOf(results)).toHaveLength(0);
    expect(results).toHaveLength(2);
  });
});
