const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
require("dotenv").config();

const { router } = require("../src/versionedRouter");
const { addPrometheusMiddleware } = require("../src/middleware");

const app = new Koa();
addPrometheusMiddleware(app);

app.use(
  bodyParser({
    jsonLimit: "200mb"
  })
);

app.use(router.routes()).use(router.allowedMethods());
// app.use(testRouter.routes()).use(testRouter.allowedMethods());

module.exports = app;
