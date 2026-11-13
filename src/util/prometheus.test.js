const { Prometheus } = require('./prometheus');
const client = new Prometheus(false);

// These tests pin the semantics the ivm platform-error 0-seed relies on: `counter(name, 0)` must
// materialise a series at 0 (so increase()/rate() get a 0 -> N edge) and must NOT reset an already
// incremented series when it runs again after an isolate is evicted and rebuilt.
//
// A single Prometheus instance is shared: constructing it twice would re-register the predefined
// metrics on prom-client's global registry and throw. Distinct workspaceIds keep each test's series
// independent on the shared, lazily-created `ivm_platform_error` counter.
describe('Prometheus platform-error zero-seed semantics', () => {
  const valueFor = async (labels) => {
    const metrics = await client.prometheusRegistry.getMetricsAsJSON();
    const metric = metrics.find((m) => m.name === 'transformer_ivm_platform_error');
    const series = metric?.values.find((v) =>
      Object.entries(labels).every(([k, val]) => v.labels[k] === val),
    );
    return series?.value;
  };

  it('counter(name, 0) materialises the series at 0 before any increment', async () => {
    const tags = { functionName: 'fn', workspaceId: 'ws-seed', cache: 'custom_mappings_ivm' };

    client.counter('ivm_platform_error', 0, tags);

    expect(await valueFor(tags)).toBe(0);
  });

  it('re-seeding with 0 after an increment does not reset the accumulated count', async () => {
    const tags = { functionName: 'fn', workspaceId: 'ws-reset', cache: 'custom_mappings_ivm' };

    client.counter('ivm_platform_error', 0, tags); // seed on first isolate build
    client.increment('ivm_platform_error', tags); // one platform error -> 1
    client.counter('ivm_platform_error', 0, tags); // re-seed after eviction/rebuild

    // inc(0) is add-only, so the second seed must leave the series at 1, not reset it to 0.
    expect(await valueFor(tags)).toBe(1);
  });
});

describe('GZIP delivery metric declarations and gauge delta', () => {
  // prom-client registers predeclared metrics globally; share the single instance above.
  const metric = (name) => client.prometheusRegistry.getSingleMetric(`transformer_${name}`);
  const labels = [
    'destType',
    'endpointPath',
    'destinationId',
    'workspaceId',
    'sourceId',
    'feature',
    'module',
    'implementation',
  ];
  const byteBuckets = [
    64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 65536, 262144, 1048576, 4194304, 16777216,
    52428800,
  ];

  it.each([
    ['delivery_compressed_payload_size_bytes', 'histogram'],
    ['delivery_compression_ratio', 'histogram'],
    ['delivery_compression_duration_seconds', 'histogram'],
    ['delivery_compression_inflight', 'gauge'],
    ['delivery_compression_bytes_saved_total', 'counter'],
    ['delivery_compression_bytes_expanded_total', 'counter'],
  ])('pre-registers %s with all delivery labels', (name, type) => {
    expect(metric(name)).toBeDefined();
    expect(metric(name).type).toBe(type);
    expect(metric(name).labelNames).toEqual(labels);
  });

  it('uses byte, expansion-aware ratio, and second-scale latency buckets', () => {
    expect(metric('delivery_compressed_payload_size_bytes').upperBounds).toEqual(byteBuckets);
    expect(metric('delivery_payload_size_bytes').upperBounds).toEqual(byteBuckets);
    expect(metric('delivery_compression_ratio').upperBounds).toEqual([
      0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5, 10, 20, 50, 100,
    ]);
    expect(metric('delivery_compression_duration_seconds').upperBounds).toEqual([
      0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10,
    ]);
  });

  it('increments and decrements the same gauge series across a registry reset', async () => {
    const tags = { destType: 'MP', endpointPath: '/engage', workspaceId: 'ws-gauge' };
    expect(client.gaugeDelta('delivery_compression_inflight', 1, tags)).toBe(true);
    expect(client.gaugeDelta('delivery_compression_inflight', 1, tags)).toBe(true);
    const series = async () => {
      const metrics = await client.prometheusRegistry.getMetricsAsJSON();
      return metrics
        .find((m) => m.name === 'transformer_delivery_compression_inflight')
        .values.find((value) => value.labels.workspaceId === 'ws-gauge').value;
    };
    expect(await series()).toBe(2);
    client.resetMetrics();
    expect(await series()).toBe(2);
    expect(client.gaugeDelta('delivery_compression_inflight', -1, tags)).toBe(true);
    expect(await series()).toBe(1);
    expect(client.gaugeDelta('delivery_compression_inflight', -1, tags)).toBe(true);
    expect(await series()).toBe(0);
  });
});
