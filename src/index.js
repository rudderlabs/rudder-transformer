const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("./logger");
require("dotenv").config();

const { router } = require("./versionedRouter");
const { testRouter } = require("./testRouter");
const cluster = require("./util/cluster");
const { addPrometheusMiddleware } = require("./middleware");

const clusterEnabled = process.env.CLUSTER_ENABLED !== "false";

const port = parseInt(process.env.PORT || "9090", 10);
const app = new Koa();
addPrometheusMiddleware(app);

app.use(
  bodyParser({
    jsonLimit: "200mb"
  })
);

app.use(router.routes()).use(router.allowedMethods());
app.use(testRouter.routes()).use(testRouter.allowedMethods());

if (clusterEnabled) {
  cluster.start(port, app);
} else {
  app.listen(port);
  logger.info(`Listening on port: ${port}`);
}
