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

  timing(name, start, tags = {}) {
    try {
      let metric = this.prometheusInstance.prometheusRegistry.getSingleMetric(name);
      if (!metric) {
        logger.warn(
          `Prometheus: Timing metric ${name} not found in the registry. Creating a new one`,
        );
        metric = this.prometheusInstance.newHistogramStat(name, name, Object.keys(tags));
      }
      metric.observe(tags, (new Date() - start) / 1000);
    } catch (e) {
      logger.error(`Prometheus: Timing metric ${name} failed with error ${e}`);
    }
  }

  registerCallbacks() {
    if (cluster.isPrimary) {
      // register callback for master process
      cluster.on('message', async (worker, message) => {
        const startTime = Date.now();
        if (message.type === GET_METRICS_RES) {
          logger.info(
            `${new Date().toISOString()} [MetricsAggregator] Master received metrics from worker ${worker.id}`,
          );
          this.timing('getMetricsReq', message.startTime, { workerId: worker.id });
          await this.handleMetricsResponse(message);
        }
        logger.info(
          `[MetricsAggregator] Master processed ${message.type} in ${new Date() - startTime} ms`,
        );
      });
      return;
    }
    // register callback for worker process
    cluster.worker.on('message', async (message) => {
      const startTime = new Date();
      if (message.type === GET_METRICS_REQ) {
        logger.info(
          `${new Date().toISOString()} [MetricsAggregator] Worker ${cluster.worker.id} received metrics request`,
        );
        try {
          const metrics = await this.prometheusInstance.prometheusRegistry.getMetricsAsJSON();
          cluster.worker.send({ type: GET_METRICS_RES, metrics, startTime: message.startTime });
        } catch (error) {
          cluster.worker.send({ type: GET_METRICS_RES, error: error.message });
        }
      } else if (message.type === RESET_METRICS_REQUEST) {
        logger.info(
          `[MetricsAggregator] Worker ${cluster.worker.id} received reset metrics request `,
        );
        this.prometheusInstance.prometheusRegistry.resetMetrics();
        logger.info(`[MetricsAggregator] Worker ${cluster.worker.id} reset metrics successfully`);
      }
      logger.info(
        `[MetricsAggregator] Worker ${cluster.worker.id} processed ${message.type} in ${new Date() - startTime} ms`,
      );
    });
  }

  createWorkerThread() {
    if (cluster.isPrimary && isMainThread) {
      this.workerThread = new Worker('./src/util/worker.js');
      logger.info(
        `[MetricsAggregator] Worker thread created with threadId ${this.workerThread.threadId}`,
      );

      this.workerThread.on('message', (message) => {
        const startTime = new Date();
        if ((message.type = AGGREGATE_METRICS_RES)) {
          logger.info(
            `${new Date().toISOString()} [MetricsAggregator] Master received aggregated metrics from worker thread`,
          );
          this.timing('aggregateMetricsReq', message.startTime);
          if (message.error) {
            this.rejectFunc(new Error(message.error));
            this.resetAggregator();
            return;
          }
          this.resolveFunc(message.metrics);
          this.resetAggregator();
        }
        logger.info(
          `[MetricsAggregator] Master processed ${message.type} in ${new Date() - startTime} ms`,
        );
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
      const startTime = Date.now();
      for (const id in cluster.workers) {
        this.pendingMetricRequests++;
        logger.info(`[MetricsAggregator] Requesting metrics from worker ${id}`);
        cluster.workers[id].send({ type: GET_METRICS_REQ, startTime });
      }
    });
  }

  async aggregateMetricsInWorkerThread() {
    this.metricsBuffer.push(await this.prometheusInstance.prometheusRegistry.getMetricsAsJSON());
    this.workerThread.postMessage({
      type: AGGREGATE_METRICS_REQ,
      metrics: this.metricsBuffer,
      startTime: Date.now(),
    });
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
      this.timing('getMetricsAll', message.startTime);
      logger.info(
        `${new Date().toISOString()} [MetricsAggregator] All metrics received, sending metrics to worker thread`,
      );
      await this.aggregateMetricsInWorkerThread();
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
