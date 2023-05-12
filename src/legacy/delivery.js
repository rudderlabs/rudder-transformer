/**
 * --------------------------------------
 * --------------------------------------
 * ---------TO BE DEPRICIATED------------
 * --------------------------------------
 * --------------------------------------
 */

const path = require('path');
const KoaRouter = require('@koa/router');
const { DestProxyController } = require('../controllers/obs.delivery');
const { getIntegrations } = require('../routes/utils');
const { SUPPORTED_VERSIONS, API_VERSION } = require('../routes/utils/constants');

const router = new KoaRouter();

SUPPORTED_VERSIONS.forEach((version) => {
  const destinations = getIntegrations(path.resolve(__dirname, `../${version}/destinations`));
  destinations.forEach((destination) => {
    router.post(`/${version}/destinations/${destination}/proxyTest`, async (ctx) => {
      ctx.set('apiVersion', API_VERSION);
      await DestProxyController.handleProxyTestRequest(destination, ctx);
    });
  });
});

module.exports = router.routes();
