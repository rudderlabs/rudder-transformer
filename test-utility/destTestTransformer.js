const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const router = require("./integrationTestRouter");
const logger = require("./logger");

const PORT = 9090;
const app = new Koa();

app.use(
  bodyParser({
    jsonLimit: "200mb"
  })
);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT);
logger.debug(`Listening on Port: ${PORT}`);
