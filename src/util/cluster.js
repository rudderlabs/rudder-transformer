const cluster = require('cluster');
const gracefulShutdown = require('http-graceful-shutdown');
const util = require('util');
const logger = require('../logger');

const numWorkers = parseInt(process.env.NUM_PROCS || '1', 10);

function processInfo() {
  return {
    pid: process.pid,
    ppid: process.ppid,
    mem: process.memoryUsage(),
    cpu: process.cpuUsage(),
    cmd: `${process.argv0} ${process.argv.join(' ')}`,
  };
}

function finalFunction() {
  logger.info(`worker (pid: ${process.pid}) was gracefully shutdown`);
}

// This function works only in master.
// It sends SIGTERM to all the workers
function shutdownWorkers() {
  Object.values(cluster.workers).forEach((worker) => {
    process.kill(worker.process.pid);
    logger.info(`Sent kill signal to worker ${worker.id} (pid: ${worker.process.pid})`);
  });
}

function start(port, app) {
  if (cluster.isMaster) {
    logger.info(`Master (pid: ${process.pid}) has started`);

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
        logger.error(
          `Killing process to avoid any side effects of dead worker.\nProcess info: `,
          util.inspect(processInfo(), false, null, true),
        );
        isShuttingDown = true;
        shutdownWorkers();
      }
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received. Closing workers...');
      isShuttingDown = true;
      shutdownWorkers();
    });
  } else {
    const server = app.listen(port);
    gracefulShutdown(server, {
      signals: 'SIGINT SIGTERM',
      timeout: 30000, // timeout: 30 secs
      forceExit: true, // triggers process.exit() at the end of shutdown process
      finally: finalFunction,
    });
    logger.info(`Worker (pid: ${process.pid}) started`);
  }
}

module.exports = {
  start,
  processInfo,
};
