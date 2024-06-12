/* eslint-disable */
const { parentPort } = require('worker_threads');
const { AGGREGATE_METRICS_REQ, AGGREGATE_METRICS_RES } = require('./metricsAggregator');
const { AggregatorRegistry } = require('prom-client');

parentPort.on('message', async (message) => {
  if ((message.type = AGGREGATE_METRICS_REQ)) {
    try {
      const promString = await AggregatorRegistry.aggregate(message.metrics).metrics();
      parentPort.postMessage({ type: AGGREGATE_METRICS_RES, metrics: promString });
    } catch (error) {
      parentPort.postMessage({ type: AGGREGATE_METRICS_RES, error: error.message });
    }
  }
});
