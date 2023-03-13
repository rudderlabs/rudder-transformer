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
    // Counters
    counter: newCounterStat('counter', 'Counter', ['label']),

    userTransformInputEvents: newCounterStat(
      'user_transform_input_events',
      'Number of input events to user transform',
      ['processSessions'],
    ),

    cdkLiveCompareTestFailed: newCounterStat(
      'cdk_live_compare_test_failed',
      'cdk_live_compare_test_failed',
      ['destType', 'feature'],
    ),

    cdkLiveCompareTestSuccess: newCounterStat(
      'cdk_live_compare_test_success',
      'cdk_live_compare_test_success',
      ['destType', 'feature'],
    ),

    cdkLiveCompareTestErrored: newCounterStat(
      'cdk_live_compare_test_errored',
      'cdk_live_compare_test_errored',
      ['destType', 'feature'],
    ),

    hvViolationType: newCounterStat('hv_violation_type', 'hv_violation_type', [
      'violationType',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    hvPropagatedEvents: newCounterStat('hv_propagated_events', 'hv_propagated_events', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    hvErrors: newCounterStat('hv_errors', 'hv_errors', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    hvEventsCount: newCounterStat('hv_events_count', 'hv_events_count', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    hvRequestSize: newCounterStat('hv_request_size', 'hv_request_size', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    userTransformFunctionGroupSize: newCounterStat(
      'user_transform_function_group_size',
      'user_transform_function_group_size',
      ['processSessions'],
    ),

    userTransformFunctionInputEvents: newCounterStat(
      'user_transform_function_input_events',
      'user_transform_function_input_events',
      ['processSessions', 'sourceType', 'destinationType', 'k8_namespace'],
    ),

    userTransformErrors: newCounterStat('user_transform_errors', 'user_transform_errors', [
      'transformationVersionId',
      'processSessions',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    // Gauges
    gauge: newGaugeStat('gauge', 'Gauge', ['label']),

    v0TransformationTimeGauge: newGaugeStat('v0_transformation_time', 'v0_transformation_time', [
      'destType',
      'feature',
    ]),

    cdkTransformationGauge: newGaugeStat('cdk_transformation_time', 'cdk_transformation_time', [
      'destType',
      'feature',
    ]),

    // Summaries
    summary: newSummaryStat('summary', 'Summary', ['label']),

    // Histograms
    httpRequestDurationSummary: newHistogramStat(
      'http_request_duration',
      'Summary of HTTP requests duration in seconds',
      ['method', 'route', 'code'],
    ),

    hvRequestLatency: newHistogramStat('hv_request_latency', 'hv_request_latency', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    userTransformFunctionLatency: newHistogramStat(
      'user_transform_function_latency',
      'user_transform_function_latency',
      [
        'transformationVersionId',
        'processSessions',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ],
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
