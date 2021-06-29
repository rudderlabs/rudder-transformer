const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const util = require("util");
const logger = require("../logger");
const gracefulShutdown = require('http-graceful-shutdown');
const numWorkers = process.env.NUM_PROCS || numCPUs

function processInfo() {
  return {
    pid: process.pid,
    ppid: process.ppid,
    mem: process.memoryUsage(),
    cpu: process.cpuUsage(),
    cmd: `${process.argv0} ${process.argv.join(" ")}`
  };
}

function finalFunction() {
  logger.info(`worker ${process.pid} gracefully shutted down.....`)
}

// This function works only in master.
// It sends SIGTERM to all the workers
function shutdownWorkers() {
  for (var id in cluster.workers) {
    process.kill(cluster.workers[id].process.pid);
    logger.info(`Sent kill signal to ${cluster.workers[id].process.pid}`)
  }
}

function start(port, app) {
  if (cluster.isMaster) {
    logger.info(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numWorkers; i += 1) {
      cluster.fork();
    }

    cluster.on("online", worker => {
      logger.info(`Worker ${worker.process.pid} is online`);
    });

    let isShuttingDown = false
    cluster.on("exit", worker => {
      if (!isShuttingDown){
        logger.error(`worker ${worker.process.pid} died`);
        logger.error(
          `Killing Process to avoid any side effects of dead worker.\nProcess Info: `,
          util.inspect(processInfo(), false, null, true)
        );
        isShuttingDown = true
        shutdownWorkers()
      }
    });
    
    process.on("SIGTERM", () => {
      logger.info(
        "SIGTERM signal received. Closing workers"
      );
      isShuttingDown = true
      shutdownWorkers()
    });
    
  } else {
    server = app.listen(port);
    gracefulShutdown(server,
      {
        signals: 'SIGINT SIGTERM',
        timeout: 30000,                  // timeout: 30 secs
        forceExit: true,                 // triggers process.exit() at the end of shutdown process
        finally: finalFunction
      });
    logger.info(`Worker ${process.pid} started`);

  }
  logger.debug("transformerServer: started");
}

exports.start = start;
