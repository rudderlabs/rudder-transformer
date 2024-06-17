/* eslint-disable */
const { parentPort } = require('worker_threads');
const { AGGREGATE_METRICS_REQ, AGGREGATE_METRICS_RES } = require('./metricsAggregator');
const { AggregatorRegistry } = require('prom-client');
const logger = require('../logger');

parentPort.on('message', async (message) => {
  const startTime = new Date();
  if ((message.type = AGGREGATE_METRICS_REQ)) {
    logger.info(
      `${new Date().toISOString()} [MetricsAggregator] Worker thread received aggregate metrics request`,
    );
    try {
      const promString = await AggregatorRegistry.aggregate(message.metrics).metrics();
      parentPort.postMessage({
        type: AGGREGATE_METRICS_RES,
        metrics: promString,
        startTime: message.startTime,
      });
    } catch (error) {
      parentPort.postMessage({ type: AGGREGATE_METRICS_RES, error: error.message });
    }
  }
  logger.info(
    `[MetricsAggregator] Worker thread processed ${message.type} in ${new Date() - startTime} ms`,
  );
});
