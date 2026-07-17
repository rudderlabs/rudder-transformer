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
});
