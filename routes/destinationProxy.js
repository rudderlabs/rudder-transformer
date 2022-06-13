const KoaRouter = require("koa-router");
const { DestProxyController } = require("../controllers/destinationProxy");
const { SUPPORTED_VERSIONS, API_VERSION } = require("./utils/constants");

const router = new KoaRouter();

SUPPORTED_VERSIONS.forEach(version => {
  router.post(`/${version}/proxyTest`, async ctx => {
    ctx.set("apiVersion", API_VERSION);
    await DestProxyController.handleProxyTestRequest(ctx);
  });
});

module.exports = router.routes();
