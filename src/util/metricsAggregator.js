/* eslint-disable */
const cluster = require('cluster');
const logger = require('../logger');
const { Worker, isMainThread } = require('worker_threads');
const GET_METRICS_REQ = 'rudder-transformer:getMetricsReq';
const GET_METRICS_RES = 'rudder-transformer:getMetricsRes';
const AGGREGATE_METRICS_REQ = 'rudder-transformer:aggregateMetricsReq';
const AGGREGATE_METRICS_RES = 'rudder-transformer:aggregateMetricsRes';
const RESET_METRICS_REQUEST = 'rudder-transformer:resetMetricsReq';

class MetricsAggregator {
  constructor(prometheusInstance) {
    this.metricsBuffer = [];
    this.pendingMetricRequests = 0;
    this.resolveFunc = null;
    this.rejectFunc = null;
    this.prometheusInstance = prometheusInstance;
    this.createWorkerThread();
    this.registerCallbacks();
  }

  registerCallbacks() {
    if (cluster.isPrimary) {
      // register callback for master process
      cluster.on('message', async (worker, message) => {
        if (message.type === GET_METRICS_RES) {
          logger.debug(`[MetricsAggregator] Master received metrics from worker ${worker.id}`);
          await this.handleMetricsResponse(message);
        }
      });
      return;
    }
    // register callback for worker process
    cluster.worker.on('message', async (message) => {
      if (message.type === GET_METRICS_REQ) {
        logger.debug(`[MetricsAggregator] Worker ${cluster.worker.id} received metrics request`);
        try {
          const metrics = await this.prometheusInstance.prometheusRegistry.getMetricsAsJSON();
          cluster.worker.send({ type: GET_METRICS_RES, metrics });
        } catch (error) {
          cluster.worker.send({ type: GET_METRICS_RES, error: error.message });
        }
      } else if (message.type === RESET_METRICS_REQUEST) {
        logger.info(
          `[MetricsAggregator] Worker ${cluster.worker.id} received reset metrics request`,
        );
        this.prometheusInstance.prometheusRegistry.resetMetrics();
        logger.info(`[MetricsAggregator] Worker ${cluster.worker.id} reset metrics successfully`);
      }
    });
  }

  createWorkerThread() {
    if (cluster.isPrimary && isMainThread) {
      this.workerThread = new Worker('./src/util/worker.js');
      logger.info(
        `[MetricsAggregator] Worker thread created with threadId ${this.workerThread.threadId}`,
      );

      this.workerThread.on('message', (message) => {
        if ((message.type = AGGREGATE_METRICS_RES)) {
          if (message.error) {
            this.rejectFunc(new Error(message.error));
            this.resetAggregator();
            return;
          }
          this.resolveFunc(message.metrics);
          this.resetAggregator();
        }
      });
    }
  }

  resetAggregator() {
    this.metricsBuffer = [];
    this.pendingMetricRequests = 0;
    this.resolveFunc = null;
    this.rejectFunc = null;
  }

  async aggregateMetrics() {
    // If a request is already being processed, reject the new request
    // Use resolveFunc to check if a request is already being processed
    // we dont support concurrent /metrics requests for now - we would need to implement a requestId mechanism and then handle all message calls accoridng to this requestId
    // this is how it is implemented in prom-client [https://github.com/siimon/prom-client/blob/564e46724e258704df52ab329a7be833aaed4b69/lib/cluster.js#L43]
    // we are not implementing it for now to keep things simple, once we validate the solution we can implement it
    if (this.resolveFunc !== null) {
      logger.error(
        '[MetricsAggregator] Failed to serve /metrics request, a request is already being processed.',
      );
      throw new Error(
        '[MetricsAggregator] Currently processing a request, please try again later.',
      );
    }
    return new Promise((resolve, reject) => {
      this.resolveFunc = resolve;
      this.rejectFunc = reject;
      for (const id in cluster.workers) {
        this.pendingMetricRequests++;
        logger.debug(`[MetricsAggregator] Requesting metrics from worker ${id}`);
        cluster.workers[id].send({ type: GET_METRICS_REQ });
      }
    });
  }

  async aggregateMetricsInWorkerThread() {
    this.workerThread.postMessage({ type: AGGREGATE_METRICS_REQ, metrics: this.metricsBuffer });
  }

  async handleMetricsResponse(message) {
    if (message.error) {
      this.rejectFunc(new Error(message.error));
      this.resetAggregator();
      return;
    }
    this.metricsBuffer.push(message.metrics);
    this.pendingMetricRequests--;
    if (this.pendingMetricRequests === 0) {
      this.aggregateMetricsInWorkerThread();
    }
  }

  async terminateWorkerThread() {
    logger.info(
      `[MetricsAggregator] Worker thread terminated with exit code ${await this.workerThread.terminate()}`,
    );
  }

  resetMetrics() {
    for (const id in cluster.workers) {
      logger.info(`[MetricsAggregator] Resetting metrics for worker ${id}`);
      cluster.workers[id].send({ type: RESET_METRICS_REQUEST });
    }
  }
}

module.exports = { MetricsAggregator, AGGREGATE_METRICS_REQ, AGGREGATE_METRICS_RES };
