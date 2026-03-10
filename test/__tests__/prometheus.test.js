const prometheus = require('../../src/util/prometheus');

function parseMetrics(text) {
  const metrics = text.split('\n').filter(line => line.trim() !== '');
  const metricMap = new Map();
  for (const line of metrics) {
    const [metricName, metricValue] = line.split(' ');
    if (metricName.includes('{') && metricName.includes('}')) {
      const name = metricName.split('{')[0];
      const tags = metricName.split('{')[1].split('}')[0].split(',');
      const tagMap = tags.reduce((acc, tag) => {
        const [tagName, tagValue] = tag.split('=');
        acc[tagName] = tagValue.replace(/^"|"$/g, '');
        return acc;
      }, {});
      metricMap.set(name, { value: Number(metricValue), tagMap });
    }
  }
  return metricMap;
}

describe('Prometheus class', () => {
  let prom;

  beforeEach(async () => {
    prom = new prometheus.Prometheus();
  })

  afterEach(async () => {
    prom.shutdown();
  })

  it('Static list', async () => {
    prom.gauge('v0_transformation_time', 1, {
      destType: 'testDestType', feature: 'testFeature' }
    );
    prom.counter('event_transform_success', 1, {
      destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation'
    });

    const metrics = await prom.prometheusRegistry.metrics();
    const metricMap = parseMetrics(metrics);

    expect(metricMap.get('transformer_v0_transformation_time')).toEqual({
      value: 1,
      tagMap: { destType: 'testDestType', feature: 'testFeature', instanceName: 'localhost', },
    });
    expect(metricMap.get('transformer_event_transform_success')).toEqual({
      value: 1,
      tagMap: {
        destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost',
      },
    });
  })

  it('Dynamic list', async () => {
    prom.gauge('vx_transformation_time', 1, { destType: 'testDestType', feature: 'testFeature', newTag: 'test' });
    prom.counter('event_transform_status', 1, { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', newTag: 'test' });

    const metrics = await prom.prometheusRegistry.metrics();
    const metricMap = parseMetrics(metrics);
    expect(metricMap.get('transformer_vx_transformation_time')).toEqual({
      value: 1,
      tagMap: { destType: 'testDestType', feature: 'testFeature', newTag: 'test', instanceName: 'localhost', },
    });
    expect(metricMap.get('transformer_event_transform_status')).toEqual({
      value: 1,
      tagMap: { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', newTag: 'test', instanceName: 'localhost', },
    });
  })

  it('New counter', async () => {
    prom.counter('counter_metric', 1, { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation' });

    const metrics = await prom.prometheusRegistry.metrics();
    const metricMap = parseMetrics(metrics);
    expect(metricMap.get('transformer_counter_metric')).toEqual({
      value: 1,
      tagMap: { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', },
    });
  })

  it('New gauge', async () => {
    prom.gauge('gauge_metric', 1, { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation' });

    const metrics = await prom.prometheusRegistry.metrics();
    const metricMap = parseMetrics(metrics);
    expect(metricMap.get('transformer_gauge_metric')).toEqual({
      value: 1,
      tagMap: { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', },
    });
  })

  it('New Increment', async () => {
    prom.increment('increment_metric', { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation' });

    const metrics = await prom.prometheusRegistry.metrics();
    const metricMap = parseMetrics(metrics);
    expect(metricMap.get('transformer_increment_metric')).toEqual({
      value: 1,
      tagMap: { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', },
    });
  })

  it('New histogram', async () => {
    prom.histogram('histogram_metric', 1, { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation' });

    const metrics = await prom.prometheusRegistry.metrics();
    const metricMap = parseMetrics(metrics);
    expect(metricMap.get('transformer_histogram_metric_bucket')).toEqual({
      value: 1,
      tagMap: { le: '+Inf', destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', },
    });
    expect(metricMap.get('transformer_histogram_metric_sum')).toEqual({
      value: 1,
      tagMap: { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', },
    });
    expect(metricMap.get('transformer_histogram_metric_count')).toEqual({
      value: 1,
      tagMap: { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', },
    });
  })

  it('Summary', async () => {
    prom.summary('summary_metric', 1, { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation' });

    const metrics = await prom.prometheusRegistry.metrics();
    const metricMap = parseMetrics(metrics);
    expect(metricMap.get('transformer_summary_metric')).toEqual({
      value: 1,
      tagMap: { quantile: '0.99', destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', },
    });
  })

  it('Timing', async () => {
    prom.timing('timing_metric', Date.now(), { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation' });

    const metrics = await prom.prometheusRegistry.metrics();
    const metricMap = parseMetrics(metrics);
    const bucket = metricMap.get('transformer_timing_metric_bucket');
    expect(bucket.value).toBe(1);
    expect(bucket.tagMap).toEqual({ le: '+Inf', destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', });
    const sum = metricMap.get('transformer_timing_metric_sum');
    expect(sum.value).toBeGreaterThanOrEqual(0);
    expect(sum.tagMap).toEqual({ destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', });
    const count = metricMap.get('transformer_timing_metric_count');
    expect(count.value).toBe(1);
    expect(count.tagMap).toEqual({ destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', });
  })

  it('Timing summary', async () => {
    prom.timingSummary('timing_summary_metric', Date.now(), { destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation' });

    const metrics = await prom.prometheusRegistry.metrics();
    const metricMap = parseMetrics(metrics);
    console.log(metricMap);
    const summary = metricMap.get('transformer_timing_summary_metric');
    expect(summary.value).toBeGreaterThanOrEqual(0);
    expect(summary.tagMap).toEqual({ quantile: '0.99', destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', });
    const summarySum = metricMap.get('transformer_timing_summary_metric_sum');
    expect(summarySum.value).toBeGreaterThanOrEqual(0);
    expect(summarySum.tagMap).toEqual({ destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', });
    const summaryCount = metricMap.get('transformer_timing_summary_metric_count');
    expect(summaryCount.value).toBe(1);
    expect(summaryCount.tagMap).toEqual({ destType: 'testDestType', module: 'testModule', destinationId: 'testDestinationId', workspaceId: 'testWorkspaceId', feature: 'testFeature', implementation: 'testImplementation', instanceName: 'localhost', });
  })
});
