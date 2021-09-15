const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const util = require("util");
const gracefulShutdown = require("http-graceful-shutdown");
const { EventEmitter } = require("events");
const logger = require("../logger");
const CacheFactory = require("../cache/factory");
const { authCacheEventName } = require("../constants");

const cacheEventEmitter = new EventEmitter();
const numWorkers = process.env.NUM_PROCS || numCPUs;

const promisifiedEventEmitter = (evEmitter, eventName, ...args) => {
  const promise = new Promise((resolve, reject) => {
    evEmitter.emit(eventName, ...args);
    evEmitter.on("end", resolve);
    evEmitter.on("error", reject);
  });
  return promise;
};

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
  logger.info(`worker ${process.pid} gracefully shutted down.....`);
}

// This function works only in master.
// It sends SIGTERM to all the workers
function shutdownWorkers() {
  for (const id in cluster.workers) {
    process.kill(cluster.workers[id].process.pid);
    logger.info(`Sent kill signal to ${cluster.workers[id].process.pid}`);
  }
}

function start(port, app) {
  if (cluster.isMaster) {
    logger.info(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numWorkers; i += 1) {
      cluster.fork();
    }

    const cache = new CacheFactory().createCache("account");
    cluster.on("online", worker => {
      logger.info(`Worker ${worker.process.pid} is online`);
      // To provide caching at pod-level
      worker.on("message", msg => {
        if (worker.process.pid === msg.pid) {
          const existingCacheValue = cache.get(msg.key);
          if (msg.type === "update") {
            if (typeof existingCacheValue === "object") {
              cache.set(msg.key, { ...existingCacheValue, ...msg.value });
            } else {
              cache.set(msg.key, msg.value);
            }
          }
          worker.send({
            ...msg,
            value: cache.get(msg.key)
          });
        }
      });
    });
    let isShuttingDown = false;
    cluster.on("exit", worker => {
      if (!isShuttingDown) {
        logger.error(`worker ${worker.process.pid} died`);
        logger.error(
          `Killing Process to avoid any side effects of dead worker.\nProcess Info: `,
          util.inspect(processInfo(), false, null, true)
        );
        isShuttingDown = true;
        shutdownWorkers();
      }
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received. Closing workers");
      isShuttingDown = true;
      shutdownWorkers();
    });
  } else {
    const server = app.listen(port);

    // For caching at pod-level
    cacheEventEmitter.on(authCacheEventName, cache => {
      process.send({
        ...cache,
        pid: process.pid
      });
    });
    process.on("message", retMsg => {
      cacheEventEmitter.emit("end", retMsg);
    });

    gracefulShutdown(server, {
      signals: "SIGINT SIGTERM",
      timeout: 30000, // timeout: 30 secs
      forceExit: true, // triggers process.exit() at the end of shutdown process
      finally: finalFunction
    });
    logger.info(`Worker ${process.pid} started`);
  }
  logger.debug("transformerServer: started");
}

module.exports = {
  start,
  processInfo,
  cacheEventEmitter,
  promisifiedEventEmitter
};
