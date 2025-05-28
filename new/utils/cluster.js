const cluster = require('cluster');
const os = require('os');
const gracefulShutdown = require('http-graceful-shutdown');
const redisConnector = require('./redis');

// Import Piscina termination function if Piscina is enabled
const usePiscina = process.env.USE_PISCINA === 'true';
let terminatePiscina;
if (usePiscina) {
  ({ terminatePiscina } = require('../services/piscina/wrapper'));
}

/**
 * Cluster module for the Rudder Transformer Custom
 * Uses Node.js cluster module to create multiple worker processes
 */

// Number of worker processes to create
const numWorkers = parseInt(process.env.NUM_PROCS || os.cpus().length, 10);

/**
 * Function to run when a worker is shutting down
 */
async function finalFunction() {
  console.log('Process exit event received');

  // Disconnect from Redis
  redisConnector.disconnect();

  // Terminate Piscina if enabled
  if (usePiscina && terminatePiscina) {
    try {
      console.log('Terminating Piscina worker pool');
      await terminatePiscina();
    } catch (error) {
      console.error('Error terminating Piscina:', error);
    }
  }

  console.log(`Worker (pid: ${process.pid}) was gracefully shutdown`);
}

/**
 * Function to shut down all worker processes
 * Called by the master process
 */
function shutdownWorkers() {
  Object.values(cluster.workers).forEach((worker) => {
    process.kill(worker.process.pid);
    console.log(`Sent kill signal to worker ${worker.id} (pid: ${worker.process.pid})`);
  });
}

/**
 * Start the cluster
 * @param {number} port - The port to listen on
 * @param {Object} app - The Koa app
 */
function start(port, app) {
  // Skip clustering if not enabled
  if (numWorkers < 2) {
    const server = app.listen(port, () => {
      console.log(`App started. Listening on port: ${port}`);
    });

    // Set up graceful shutdown
    gracefulShutdown(server, {
      signals: 'SIGINT SIGTERM',
      timeout: 30000, // timeout: 30 secs
      forceExit: true, // triggers process.exit() at the end of shutdown process
      finally: finalFunction,
    });

    return;
  }

  if (cluster.isMaster) {
    console.log(`Master (pid: ${process.pid}) has started`);

    // Fork workers
    for (let i = 0; i < numWorkers; i += 1) {
      cluster.fork({
        WORKER_ID: `worker-${i + 1}`,
      });
    }

    cluster.on('online', (worker) => {
      console.log(`Worker (pid: ${worker.process.pid}) is online`);
    });

    let isShuttingDown = false;
    cluster.on('exit', (worker) => {
      if (!isShuttingDown) {
        console.error(`Worker (pid: ${worker.process.pid}) died`);
        console.error(`Killing other workers to avoid any side effects of the dead worker`);
        isShuttingDown = true;
        shutdownWorkers();
      }
    });

    process.on('SIGTERM', () => {
      console.error('SIGTERM signal received. Closing workers...');
      isShuttingDown = true;
      shutdownWorkers();
    });

    process.on('SIGINT', () => {
      console.error('SIGINT signal received. Closing workers...');
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

    process.on('SIGTERM', () => {
      console.error(`SIGTERM signal received in the worker`);
    });

    process.on('SIGINT', () => {
      console.error(`SIGINT signal received in the worker`);
    });

    console.log(`Worker (pid: ${process.pid}) has started`);
    console.log(`App started. Listening on port: ${port}`);
  }
}

module.exports = {
  start,
};
