import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "./logger";
import dotenv from "dotenv";
import { router } from "./versionedRouter";
import { testRouter } from "./testRouter";
import cluster from "./util/cluster";
import { addPrometheusMiddleware } from "./middleware";
import { applicationRoutes } from "./routes";

dotenv.config();
const clusterEnabled = process.env.CLUSTER_ENABLED !== "false";
const useUpdatedRoutes = process.env.ENABLE_NEW_ROUTES !== "false";
const port = parseInt(process.env.PORT || "9090", 10);
const app = new Koa();
addPrometheusMiddleware(app);

app.use(
  bodyParser({
    jsonLimit: "200mb"
  })
);

if (useUpdatedRoutes) {
  applicationRoutes(app);
} else {
  // To be depricated
  app.use(router.routes()).use(router.allowedMethods());
  app.use(testRouter.routes()).use(testRouter.allowedMethods());
}

if (clusterEnabled) {
  cluster.start(port, app);
} else {
  app.listen(port);
  logger.info(`Listening on port: ${port}`);
}

export default app;
