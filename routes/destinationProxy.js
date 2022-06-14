const KoaRouter = require("koa-router");
const { DestProxyController } = require("../controllers/destinationProxy");
const { getIntegrations } = require("./utils");
const { SUPPORTED_VERSIONS, API_VERSION } = require("./utils/constants");

const router = new KoaRouter();

SUPPORTED_VERSIONS.forEach(version => {
  const destinations = getIntegrations(`${version}/destinations`);
  destinations.forEach(destination => {
    router.post(
      `/${version}/destinations/${destination}/proxyTest`,
      async ctx => {
        ctx.set("apiVersion", API_VERSION);
        await DestProxyController.handleProxyTestRequest(destination, ctx);
      }
    );
  });
});

module.exports = router.routes();
