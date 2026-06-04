import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { AudienceListStrategy } from './strategies/audience-list';
import type { GenericProxyHandlerInput } from '../iterable/types';

const audienceListStrategy = new AudienceListStrategy();

const responseHandler = (responseParams: GenericProxyHandlerInput) =>
  audienceListStrategy.handleResponse(responseParams);

function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

export { networkHandler };
