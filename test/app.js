const Koa = require("koa");
const bodyParser = require("koa-bodyparser");

const { router } = require("../src/versionedRouter");

const app = new Koa();

app.use(
  bodyParser({
    jsonLimit: "200mb"
  })
);

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;
