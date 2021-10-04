const fs = require("fs");
const http2 = require("http2");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("./logger");
require("dotenv").config();

const { router } = require("./versionedRouter");
const cluster = require("./util/cluster");

const clusterEnabled = true;

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
  // app.listen(PORT);
  const options = {
    key: fs.readFileSync("./server.key"),
    cert: fs.readFileSync("./server.crt")
  };
  http2
    .createSecureServer(options, app.callback())
    .listen(PORT, err => console.log(err));
  logger.info(`Listening on Port: ${PORT}`);
}
