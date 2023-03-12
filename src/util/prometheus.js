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

module.exports = {
  prometheusRegistry,
  newSummaryStat,
  newCounterStat,
  newGaugeStat,
  newHistogramStat,
};
