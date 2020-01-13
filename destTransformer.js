const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
require("dotenv").config();

const router = require("./versionedRouter");
const cluster = require("./util/cluster");

const clusterEnabled = false;

const PORT = 9090;
const app = new Koa();

app.use(
  bodyParser({
    jsonLimit: "200mb"
  })
);

app.use(router.routes()).use(router.allowedMethods());

if (clusterEnabled) {
  cluster.start(PORT, app);
} else {
  app.listen(PORT);
  console.log(`Listening on Port: ${PORT}`);
}
