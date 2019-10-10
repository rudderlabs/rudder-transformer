const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

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
    });
  } else {
    app.listen(port);
    console.log(`Worker ${process.pid} started`);
  }
  console.log("transformerServer: started");
}

exports.start = start;
