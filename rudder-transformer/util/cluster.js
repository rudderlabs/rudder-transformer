const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const util = require("util");
const logger = require("../logger");

function processInfo() {
  return {
    pid: process.pid,
    ppid: process.ppid,
    mem: process.memoryUsage(),
    cpu: process.cpuUsage(),
    cmd: `${process.argv0} ${process.argv.join(" ")}`
  };
}

function start(port, app) {
  if (cluster.isMaster) {
    logger.info(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i += 1) {
      cluster.fork();
    }

    cluster.on("online", worker => {
      logger.info(`Worker ${worker.process.pid} is online`);
    });
    cluster.on("exit", worker => {
      logger.error(`worker ${worker.process.pid} died`);
      logger.error(
        `Killing Process to avoid any side effects of dead worker.\nProcess Info: `,
        util.inspect(processInfo(), false, null, true)
      );
      process.exit();
    });
  } else {
    app.listen(port);
    logger.info(`Worker ${process.pid} started`);
  }
  logger.debug("transformerServer: started");
}

exports.start = start;
