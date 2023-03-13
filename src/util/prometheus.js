const prometheusClient = require('prom-client');

const prometheusRegistry = new prometheusClient.Registry();
prometheusClient.collectDefaultMetrics({ register: prometheusRegistry });

const newCounterStat = (name, help, labelNames) => {
  const counter = new prometheusClient.Counter({
    name,
    help,
    labelNames,
  });
  prometheusRegistry.registerMetric(counter);
  return counter;
};

const newGaugeStat = (name, help, labelNames) => {
  const gauge = new prometheusClient.Gauge({
    name,
    help,
    labelNames,
  });
  prometheusRegistry.registerMetric(gauge);
  return gauge;
};

const newSummaryStat = (name, help, labelNames) => {
  const summary = new prometheusClient.Summary({
    name,
    help,
    labelNames,
  });
  prometheusRegistry.registerMetric(summary);
  return summary;
};

const newHistogramStat = (name, help, labelNames) => {
  const histogram = new prometheusClient.Histogram({
    name,
    help,
    labelNames,
  });
  prometheusRegistry.registerMetric(histogram);
  return histogram;
};

let metrics;
function createMetrics() {
  metrics = {
    // Counter
    counter: newCounterStat('counter', 'Counter', ['label']),
    userTransformInputEvents: newCounterStat(
      'user_transform_input_events',
      'Number of input events to user transform',
      ['processSessions'],
    ),

    // Gauge
    gauge: newGaugeStat('gauge', 'Gauge', ['label']),

    // Summary
    summary: newSummaryStat('summary', 'Summary', ['label']),
    v0TransformationTimeSummary: newSummaryStat(
      'v0_transformation_time',
      'v0_transformation_time',
      ['destType', 'feature'],
    ),

    cdkTransformationTime: newSummaryStat('cdk_transformation_time', 'cdk_transformation_time', [
      'destType',
      'feature',
    ]),

    // Histogram
    httpRequestDurationSummary: newHistogramStat(
      'http_request_duration',
      'Summary of HTTP requests duration in seconds',
      ['method', 'route', 'code'],
    ),
  };

  return metrics;
}

function getMetrics() {
  return metrics;
}

module.exports = {
  prometheusRegistry,
  createMetrics,
  getMetrics,
};
