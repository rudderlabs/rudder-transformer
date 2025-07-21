/* eslint-disable */
const { parentPort } = require('worker_threads');
const { MESSAGE_TYPES } = require('./metricsAggregator');
const { AggregatorRegistry } = require('prom-client');

parentPort.on('message', async (message) => {
  if (message.type === MESSAGE_TYPES.AGGREGATE_METRICS_REQ) {
    try {
      const promString = await AggregatorRegistry.aggregate(message.metrics).metrics();
      parentPort.postMessage({
        type: MESSAGE_TYPES.AGGREGATE_METRICS_RES,
        metrics: promString,
        requestId: message.requestId,
      });
    } catch (error) {
      parentPort.postMessage({
        type: MESSAGE_TYPES.AGGREGATE_METRICS_RES,
        error: error.message,
        requestId: message.requestId,
      });
    }
  }
});
