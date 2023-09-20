const cluster = require('cluster');
const gracefulShutdown = require('http-graceful-shutdown');
const logger = require('../logger');
const { logProcessInfo } = require('./utils');
const { RedisDB } = require('./redis/redisConnector');

const numWorkers = parseInt(process.env.NUM_PROCS || '1', 10);
const metricsPort = parseInt(process.env.METRICS_PORT || '9091', 10);

function finalFunction() {
  logger.info('Process exit event received');
  RedisDB.disconnect();
  logger.info('Redis client disconnected');

  logger.error(`Worker (pid: ${process.pid}) was gracefully shutdown`);
  logProcessInfo();
}

// This function works only in master.
// It sends SIGTERM to all the workers
function shutdownWorkers() {
  Object.values(cluster.workers).forEach((worker) => {
    process.kill(worker.process.pid);
    logger.error(`Sent kill signal to worker ${worker.id} (pid: ${worker.process.pid})`);
  });
}

function start(port, app, metricsApp) {
  if (cluster.isMaster) {
    logger.info(`Master (pid: ${process.pid}) has started`);

    // HTTP server for exposing metrics
    if (process.env.STATS_CLIENT === 'prometheus') {
      const metricsServer = metricsApp.listen(metricsPort);

      gracefulShutdown(metricsServer, {
        signals: 'SIGINT SIGTERM SIGSEGV',
        timeout: 30000, // timeout: 30 secs
        forceExit: false, // triggers process.exit() at the end of shutdown process
      });
    }

    // Fork workers.
    for (let i = 0; i < numWorkers; i += 1) {
      cluster.fork();
    }

    cluster.on('online', (worker) => {
      logger.info(`Worker (pid: ${worker.process.pid}) is online`);
      // To provide caching at pod-level
    });

    let isShuttingDown = false;
    cluster.on('exit', (worker) => {
      if (!isShuttingDown) {
        logger.error(`Worker (pid: ${worker.process.pid}) died`);
        logger.error(`Killing other workers to avoid any side effects of the dead worker`);
        logProcessInfo();
        isShuttingDown = true;
        shutdownWorkers();
      }
    });

    process.on('SIGTERM', () => {
      logger.error('SIGTERM signal received. Closing workers...');
      logProcessInfo();
      isShuttingDown = true;
      shutdownWorkers();
    });

    process.on('SIGINT', () => {
      logger.error('SIGINT signal received. Closing workers...');
      logProcessInfo();
      isShuttingDown = true;
      shutdownWorkers();
    });

    process.on('SIGSEGV', () => {
      logger.error('SIGSEGV - JavaScript memory error occurred. Closing workers...');
      logProcessInfo();
      isShuttingDown = true;
      shutdownWorkers();
    });
  } else {
    const server = app.listen(port);
    gracefulShutdown(server, {
      signals: 'SIGINT SIGTERM SIGSEGV',
      timeout: 30000, // timeout: 30 secs
      forceExit: true, // triggers process.exit() at the end of shutdown process
      finally: finalFunction,
    });

    process.on('SIGTERM', () => {
      logger.error(`SIGTERM signal received in the worker`);
    });

    process.on('SIGINT', () => {
      logger.error(`SIGINT signal received in the worker`);
    });

    process.on('SIGSEGV', () => {
      logger.error(`SIGSEGV - JavaScript memory error occurred in the worker`);
    });

    logger.info(`Worker (pid: ${process.pid}) has started`);
    logger.info(`App started. Listening on port: ${port}`);
  }
}

module.exports = {
  start,
};
