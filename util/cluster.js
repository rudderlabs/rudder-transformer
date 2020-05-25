const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const util = require("util");

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
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("online", worker => {
      console.log(`Worker ${worker.process.pid} is online`);
    });
    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      console.log(
        `Killing Process to avoid any side effects of dead worker.\nProcess Info: `,
        util.inspect(processInfo(), false, null, true)
      );
      process.exit();
    });
  } else {
    app.listen(port);
    console.log(`Worker ${process.pid} started`);
  }
  console.log("transformerServer: started");
}

exports.start = start;
