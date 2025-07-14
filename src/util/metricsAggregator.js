/* eslint-disable */
const cluster = require('cluster');
const logger = require('../logger');
const { Worker, isMainThread } = require('worker_threads');
const v8 = require('v8');

const MESSAGE_TYPES = {
  GET_METRICS_REQ: 'rudder-transformer:getMetricsReq',
  GET_METRICS_RES: 'rudder-transformer:getMetricsRes',
  AGGREGATE_METRICS_REQ: 'rudder-transformer:aggregateMetricsReq',
  AGGREGATE_METRICS_RES: 'rudder-transformer:aggregateMetricsRes',
  RESET_METRICS_REQ: 'rudder-transformer:resetMetricsReq',
};

const config = {
  requestTimeout: process.env.METRICS_AGGREGATOR_REQUEST_TIMEOUT_SECONDS
    ? parseInt(process.env.METRICS_AGGREGATOR_REQUEST_TIMEOUT_SECONDS, 10) * 1000
    : 10 * 1000, // default to 10 seconds
  isPeriodicResetEnabled: process.env.METRICS_AGGREGATOR_PERIODIC_RESET_ENABLED === 'true',
  periodicResetInterval: process.env.METRICS_AGGREGATOR_PERIODIC_RESET_INTERVAL_SECONDS
    ? parseInt(process.env.METRICS_AGGREGATOR_PERIODIC_RESET_INTERVAL_SECONDS, 10)
    : 30 * 60,
};

class MetricsAggregator {
  constructor(prometheusInstance) {
    this.requestTimeout = config.requestTimeout;
    this.isPeriodicResetEnabled = config.isPeriodicResetEnabled;
    this.periodicResetInterval = config.periodicResetInterval;
    this.shuttingDown = false;
    this.metricsBuffer = [];
    this.pendingMetricRequests = 0;
    this.requestId = 0; // request ID to track requests
    this.resolveFunc = null;
    this.rejectFunc = null;
    this.currentTimeout = null;
    this.prometheusInstance = prometheusInstance;
    this.createWorkerThread();
    this.registerCallbacks();
  }

  // onWorkerMessage is called when the master receives a message from a worker
  onWorkerMessage(worker, message) {
    try {
      if (message.type === MESSAGE_TYPES.GET_METRICS_RES) {
        logger.debug(`[MetricsAggregator] Master received metrics from worker ${worker.id}`);
        this.handleMetricsResponse(message);
      }
    } catch (error) {
      logger.error(`[MetricsAggregator] Error handling worker message: ${error.message}`, {
        error: error.stack,
        workerId: worker?.id,
        messageType: message?.type,
      });
      this.resetAggregator(true);
    }
  }

  onWorkerThreadMessage(message) {
    try {
      if (message.type === MESSAGE_TYPES.AGGREGATE_METRICS_RES) {
        if (message.requestId !== this.requestId) {
          logger.info(
            `[MetricsAggregator] Ignoring aggregation response for old request ${message.requestId}`,
          );
          return;
        }
        if (!this.resolveFunc) {
          logger.info('[MetricsAggregator] No active request, ignoring aggregation response');
          return;
        }
        if (message.error) {
          logger.error(`[MetricsAggregator] Worker aggregation error: ${message.error}`);
          this.rejectFunc(new Error(message.error));
          this.resetAggregator(true);
          return;
        }
        this.resolveFunc(message.metrics);
        this.resetAggregator();
      }
    } catch (error) {
      logger.error(`[MetricsAggregator] Error handling worker thread message: ${error.message}`, {
        error: error.stack,
        messageType: message?.type,
        requestId: message?.requestId,
      });
    }
  }

  // onMasterMessage is called when a worker receives a message from the master
  async onMasterMessage(message) {
    if (message.type === MESSAGE_TYPES.GET_METRICS_REQ) {
      logger.debug(`[MetricsAggregator] Worker ${cluster.worker.id} received metrics request`);
      try {
        const metrics = await this.prometheusInstance.prometheusRegistry.getMetricsAsJSON();
        cluster.worker.send({
          type: MESSAGE_TYPES.GET_METRICS_RES,
          metrics,
          requestId: message.requestId,
        });
      } catch (error) {
        logger.error(
          `[MetricsAggregator] Error getting metrics from worker ${cluster.worker.id}: ${error.message}`,
          { error: error.stack, workerId: cluster.worker.id, requestId: message.requestId },
        );
        this.prometheusInstance.prometheusRegistry.resetMetrics();
        try {
          cluster.worker.send({
            type: MESSAGE_TYPES.GET_METRICS_RES,
            error: error.message,
            requestId: message.requestId,
          });
        } catch (sendError) {
          logger.error(
            `[MetricsAggregator] Error sending error response to master: ${sendError.message}`,
            { error: sendError.stack, workerId: cluster.worker.id, requestId: message.requestId },
          );
        }
      }
    } else if (message.type === MESSAGE_TYPES.RESET_METRICS_REQ) {
      logger.info(`[MetricsAggregator] Worker ${cluster.worker.id} received reset metrics request`);
      try {
        this.prometheusInstance.prometheusRegistry.resetMetrics();
        logger.info(`[MetricsAggregator] Worker ${cluster.worker.id} reset metrics successfully`);
      } catch (error) {
        logger.error(
          `[MetricsAggregator] Error resetting metrics in worker ${cluster.worker.id}: ${error.message}`,
          { error: error.stack, workerId: cluster.worker.id },
        );
      }
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
    if (cluster.isPrimary) {
      this.workerThread = new Worker('./src/util/worker.js');
      logger.info(
        `[MetricsAggregator] Worker thread created with threadId ${this.workerThread.threadId}`,
      );
      this.workerThread.on('message', (message) => {
        try {
          this.onWorkerThreadMessage(message);
        } catch (error) {
          logger.error(
            `[MetricsAggregator] Error handling worker thread message: ${error.message}`,
            { error: error.stack, messageType: message?.type, requestId: message?.requestId },
          );
        }
      });
      this.workerThread.on('error', (error) => {
        if (this.shuttingDown) {
          // Ignore errors during shutdown
          return;
        }
        logger.error(`[MetricsAggregator] Worker thread error: ${error.message}`, {
          error: error.stack,
          threadId: this.workerThread?.threadId,
        });
      });
      this.workerThread.on('exit', (code) => {
        if (this.shuttingDown) {
          // Ignore exit events during shutdown
          return;
        }
        logger.error(`[MetricsAggregator] Worker thread exited with code ${code}`, {
          exitCode: code,
          threadId: this.workerThread?.threadId,
        });
        this.createWorkerThread(); // Restart the worker thread if it exits unexpectedly
      });
    }
  }

  resetAggregator(shouldResetMetrics = false) {
    if (this.currentTimeout) clearTimeout(this.currentTimeout);
    this.currentTimeout = null;
    this.metricsBuffer = [];
    this.pendingMetricRequests = 0;
    this.requestId++; // Increment to invalidate old responses
    this.resolveFunc = null;
    this.rejectFunc = null;
    if (shouldResetMetrics) {
      this.resetMetrics();
    }
  }

  async aggregateMetrics() {
    // If a request is already being processed, reject the new request
    // Use resolveFunc to check if a request is already being processed
    // We dont support concurrent /metrics requests.
    if (this.resolveFunc !== null) {
      logger.error(
        `[MetricsAggregator] Failed to serve /metrics request, a request (id: ${this.requestId}) is already being processed (pending requests: ${this.pendingMetricRequests}).`,
      );
      throw new Error(
        '[MetricsAggregator] Currently processing a request, please try again later.',
      );
    }
    const currentRequestId = this.requestId;

    return new Promise((resolve, reject) => {
      this.resolveFunc = resolve;
      this.rejectFunc = reject;

      // Add timeout to prevent hanging forever
      this.currentTimeout = setTimeout(() => {
        if (this.requestId === currentRequestId && this.resolveFunc) {
          logger.error(
            `[MetricsAggregator] Request (id: ${this.requestId}) timed out after ${config.requestTimeout / 1000} seconds (pending requests: ${this.pendingMetricRequests})`,
          );
          this.rejectFunc(new Error('Metrics request timed out'));
          this.resetAggregator();
        }
      }, config.requestTimeout);

      this.pendingMetricRequests = 0; // Reset pending requests count
      for (const id in cluster.workers) {
        if (cluster.workers[id].isConnected()) {
          // only aggregate metrics from connected workers
          logger.debug(`[MetricsAggregator] Requesting metrics from worker ${id}`);
          try {
            cluster.workers[id].send({
              type: MESSAGE_TYPES.GET_METRICS_REQ,
              requestId: currentRequestId,
            });
            this.pendingMetricRequests += 1;
          } catch (error) {
            logger.error(
              `[MetricsAggregator] Error sending message to worker ${id}: ${error.message}`,
              { error: error.stack, workerId: id, requestId: currentRequestId },
            );
            // Continue with other workers even if one fails
          }
        }
      }
    });
  }

  aggregateMetricsInWorkerThread() {
    try {
      this.workerThread.postMessage({
        type: MESSAGE_TYPES.AGGREGATE_METRICS_REQ,
        metrics: this.metricsBuffer,
        requestId: this.requestId,
      });
    } catch (error) {
      logger.error(
        `[MetricsAggregator] Failed to send aggregate metrics request to worker thread: ${error.message}`,
        {
          error: error.stack,
          requestId: this.requestId,
          metricsBufferLength: this.metricsBuffer.length,
        },
      );
      this.rejectFunc(new Error('Failed to send aggregate metrics request to worker thread'));
      this.resetAggregator();
    }
  }

  handleMetricsResponse(message) {
    // Ignore responses from old requests
    if (message.requestId !== this.requestId) {
      logger.info(`[MetricsAggregator] Ignoring response from old request ${message.requestId}`);
      return;
    }
    // Check if we still have an active request
    if (!this.resolveFunc) {
      logger.info('[MetricsAggregator] No active request, ignoring metrics response');
      return;
    }
    if (message.error) {
      logger.error(`[MetricsAggregator] Worker get metrics error: ${message.error}`);
      this.rejectFunc(new Error(message.error));
      this.resetAggregator(true);
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
    logger.info(`[MetricsAggregator] Resetting metrics`);
    for (const id in cluster.workers) {
      if (!cluster.workers[id].isConnected()) {
        logger.warn(`[MetricsAggregator] Worker ${id} is not connected, skipping reset`);
        continue;
      }
      logger.info(`[MetricsAggregator] Resetting metrics for worker ${id}`);
      try {
        cluster.workers[id].send({ type: MESSAGE_TYPES.RESET_METRICS_REQ });
      } catch (error) {
        logger.error(
          `[MetricsAggregator] Error sending reset metrics request to worker ${id}: ${error.message}`,
          { error: error.stack, workerId: id, operation: 'reset_metrics' },
        );
        // Continue with other workers even if one fails
      }
    }
  }

  async shutdown() {
    this.shuttingDown = true;
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
