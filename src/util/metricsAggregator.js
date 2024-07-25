/* eslint-disable */
const cluster = require('cluster');
const logger = require('../logger');
const { Worker, isMainThread } = require('worker_threads');

const MESSAGE_TYPES = {
  GET_METRICS_REQ: 'rudder-transformer:getMetricsReq',
  GET_METRICS_RES: 'rudder-transformer:getMetricsRes',
  AGGREGATE_METRICS_REQ: 'rudder-transformer:aggregateMetricsReq',
  AGGREGATE_METRICS_RES: 'rudder-transformer:aggregateMetricsRes',
  RESET_METRICS_REQ: 'rudder-transformer:resetMetricsReq',
};

const config = {
  isPeriodicResetEnabled: process.env.METRICS_AGGREGATOR_PERIODIC_RESET_ENABLED === 'true',
  periodicResetInterval: process.env.METRICS_AGGREGATOR_PERIODIC_RESET_INTERVAL_SECONDS
    ? parseInt(process.env.METRICS_AGGREGATOR_PERIODIC_RESET_INTERVAL_SECONDS, 10)
    : 30 * 60,
};

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

  // onWorkerMessage is called when the master receives a message from a worker
  async onWorkerMessage(worker, message) {
    if (message.type === MESSAGE_TYPES.GET_METRICS_RES) {
      logger.debug(`[MetricsAggregator] Master received metrics from worker ${worker.id}`);
      await this.handleMetricsResponse(message);
    }
  }

  // onMasterMessage is called when a worker receives a message from the master
  async onMasterMessage(message) {
    if (message.type === MESSAGE_TYPES.GET_METRICS_REQ) {
      logger.debug(`[MetricsAggregator] Worker ${cluster.worker.id} received metrics request`);
      try {
        const metrics = await this.prometheusInstance.prometheusRegistry.getMetricsAsJSON();
        cluster.worker.send({ type: MESSAGE_TYPES.GET_METRICS_RES, metrics });
      } catch (error) {
        cluster.worker.send({ type: MESSAGE_TYPES.GET_METRICS_RES, error: error.message });
      }
    } else if (message.type === MESSAGE_TYPES.RESET_METRICS_REQ) {
      logger.info(`[MetricsAggregator] Worker ${cluster.worker.id} received reset metrics request`);
      this.prometheusInstance.prometheusRegistry.resetMetrics();
      logger.info(`[MetricsAggregator] Worker ${cluster.worker.id} reset metrics successfully`);
    }
  }

  registerCallbacks() {
    if (cluster.isPrimary) {
      // register callback for master process
      cluster.on('message', this.onWorkerMessage.bind(this));
      if (config.isPeriodicResetEnabled) {
        // register callback to reset metrics if enabled
        this.registerCallbackForPeriodicReset(config.periodicResetInterval);
      }
      return;
    }
    // register callback for worker process
    cluster.worker.on('message', this.onMasterMessage.bind(this));
  }

  registerCallbackForPeriodicReset(intervalSeconds) {
    // store the timer in the aggregator for future operations like shutdown
    this.periodicResetTimer = setInterval(() => {
      logger.info(
        `[MetricsAggregator] Periodic reset interval of ${intervalSeconds} seconds expired, reseting metrics`,
      );
      this.resetMetrics();
    }, intervalSeconds * 1000);
  }

  createWorkerThread() {
    if (cluster.isPrimary && isMainThread) {
      this.workerThread = new Worker('./src/util/worker.js');
      logger.info(
        `[MetricsAggregator] Worker thread created with threadId ${this.workerThread.threadId}`,
      );

      this.workerThread.on('message', (message) => {
        if (message.type === MESSAGE_TYPES.AGGREGATE_METRICS_RES) {
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
        cluster.workers[id].send({ type: MESSAGE_TYPES.GET_METRICS_REQ });
      }
    });
  }

  async aggregateMetricsInWorkerThread() {
    this.workerThread.postMessage({
      type: MESSAGE_TYPES.AGGREGATE_METRICS_REQ,
      metrics: this.metricsBuffer,
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
      cluster.workers[id].send({ type: MESSAGE_TYPES.RESET_METRICS_REQ });
    }
  }

  async shutdown() {
    // terminate worker thread if the current process is the master
    if (cluster.isPrimary) {
      await this.terminateWorkerThread();
    }
    if (this.periodicResetTimer) {
      clearInterval(this.periodicResetTimer);
    }
  }
}

module.exports = {
  MetricsAggregator,
  MESSAGE_TYPES,
};
