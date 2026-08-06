const { Prometheus } = require('./prometheus');

// These tests pin the semantics the ivm platform-error 0-seed relies on: `counter(name, 0)` must
// materialise a series at 0 (so increase()/rate() get a 0 -> N edge) and must NOT reset an already
// incremented series when it runs again after an isolate is evicted and rebuilt.
//
// A single Prometheus instance is shared: constructing it twice would re-register the predefined
// metrics on prom-client's global registry and throw. Distinct workspaceIds keep each test's series
// independent on the shared, lazily-created `ivm_platform_error` counter.
describe('Prometheus platform-error zero-seed semantics', () => {
  const client = new Prometheus(false);

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

  // The two IVM execution histograms are meant to be read against each other: queue wait and
  // evaluation duration answer "is this caller's latency waiting for a slot, or the work itself",
  // which only holds on a shared bucket scale. They share one IVM_EXECUTION_BUCKETS constant for
  // that reason, and this pins the property rather than the constant — the assertion still fails
  // if someone reintroduces a second literal that drifts.
  describe('IVM execution histograms', () => {
    const bucketsFor = async (name) => {
      const metrics = await client.prometheusRegistry.getMetricsAsJSON();
      const metric = metrics.find((m) => m.name === name);
      expect(metric).toBeDefined();
      // Bucket boundaries are exposed as the `le` label on the generated _bucket series.
      return [...new Set(metric.values.map((v) => v.labels.le).filter((le) => le !== undefined))];
    };

    it('records execution duration on the same scale as queue wait', async () => {
      // Observe once on each so prom-client materialises their bucket series.
      client.timing('ivm_execution_queue_wait', new Date(), {
        functionName: 'fn',
        workspaceId: 'ws-hist',
        cache: 'custom_mappings_ivm',
      });
      client.timing('ivm_execution_duration', new Date(), {
        functionName: 'fn',
        cache: 'custom_mappings_ivm',
      });

      const wait = await bucketsFor('transformer_ivm_execution_queue_wait');
      const duration = await bucketsFor('transformer_ivm_execution_duration');

      expect(duration).toEqual(wait);
      // Sub-millisecond floor: prom-client's default set starts at 5ms, which is coarser than
      // either metric and collapses healthy samples into one bucket.
      expect(duration).toContain(0.0005);
    });

    it('keeps execution duration free of workspaceId', async () => {
      client.timing('ivm_execution_duration', new Date(), {
        functionName: 'fn',
        cache: 'custom_mappings_ivm',
      });

      const metrics = await client.prometheusRegistry.getMetricsAsJSON();
      const metric = metrics.find((m) => m.name === 'transformer_ivm_execution_duration');

      // Unlike the gate metrics, this one fires on every execution — a per-workspace histogram
      // would mint a full bucket set per workspace per pod for the life of the process.
      expect(metric.values.every((v) => v.labels.workspaceId === undefined)).toBe(true);
    });
  });
});
