import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { BULK_ENDPOINTS } from '../../../v0/destinations/iterable/config';
import { GenericStrategy } from './strategies/generic';
import { TrackIdentifyStrategy } from './strategies/track-identify';
import { GenericProxyHandlerInput } from './types';

const strategyRegistry: { [key: string]: any } = {
  [TrackIdentifyStrategy.name]: new TrackIdentifyStrategy(),
  [GenericStrategy.name]: new GenericStrategy(),
};

const getResponseStrategy = (endpoint: string) => {
  if (BULK_ENDPOINTS.some((path) => endpoint.includes(path))) {
    return strategyRegistry[TrackIdentifyStrategy.name];
  }
  return strategyRegistry[GenericStrategy.name];
};

const responseHandler = (responseParams: GenericProxyHandlerInput) => {
  const { destinationRequest } = responseParams;
  const strategy = getResponseStrategy(destinationRequest.endpoint);
  return strategy.handleResponse(responseParams);
};

function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

export { networkHandler };
