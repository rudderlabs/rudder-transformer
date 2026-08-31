import { proxyRequest, prepareProxyRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { networkHandler as genericNetworkHandler } from '../../../adapters/networkhandler/genericNetworkHandler';
import type { ProxyRequest } from '../../../types';
import { JSON_MIME_TYPE } from '../../util/constant';

const openAIAdsProxy = async (deliveryRequest: ProxyRequest, destType: string) => {
  const headers = {
    ...deliveryRequest.headers,
    'Content-Type': JSON_MIME_TYPE,
  };
  return proxyRequest({ ...deliveryRequest, headers }, destType);
};

function networkHandler(this: Record<string, unknown>) {
  genericNetworkHandler.call(this);
  this.proxy = openAIAdsProxy;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
}

export { networkHandler };
