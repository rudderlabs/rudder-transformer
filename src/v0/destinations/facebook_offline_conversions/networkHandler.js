const { proxyRequest } = require('../../../adapters/network');
const {
  networkHandler: GenericNetworkHandler,
} = require('../../../adapters/networkhandler/genericNetworkHandler');
const { facebookOfflineConversionsParamsSerializer } = require('./utils');

const facebookOfflineConversionsProxyRequest = (request, destType) =>
  proxyRequest(
    {
      ...request,
      paramsSerializer: facebookOfflineConversionsParamsSerializer,
    },
    destType,
  );

function networkHandler() {
  GenericNetworkHandler.call(this);
  this.proxy = facebookOfflineConversionsProxyRequest;
}

module.exports = { networkHandler };
