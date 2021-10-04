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

const options = {
  key: fs.readFileSync("./transformer.key"),
  cert: fs.readFileSync("./transformer.crt")
};

if (clusterEnabled) {
  cluster.start(PORT, app);
} else {
  // app.listen(PORT);
  http2.createServer(options, app.callback()).listen(PORT, err => {
    if (err) {
      throw new Error(err);
    }
    logger.info(`Listening on port ${PORT}`);
  });
  // logger.info(`Listening on Port: ${PORT}`);
}
