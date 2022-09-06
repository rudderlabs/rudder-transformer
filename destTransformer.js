const app = require("./app");
const logger = require("./logger");

const cluster = require("./util/cluster");

const clusterEnabled = process.env.CLUSTER_ENABLED !== "false";

const PORT = 9090;

if (clusterEnabled) {
  cluster.start(PORT, app);
} else {
  app.listen(PORT);
  logger.info(`Listening on Port: ${PORT}`);
}
