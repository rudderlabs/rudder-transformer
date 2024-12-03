import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { BULK_ENDPOINTS } from '../../../v0/destinations/iterable/config';
import { CommonStrategy } from './commonStrategy';
import { TrackIdentifyStrategy } from './trackIdentifyStrategy';

interface ResponseParams {
  destinationRequest: {
    endpoint: string;
  };
}

const strategyRegistry: { [key: string]: any } = {
  [TrackIdentifyStrategy.name]: new TrackIdentifyStrategy(),
  [CommonStrategy.name]: new CommonStrategy(),
};

const getResponseStrategy = (endpoint: string) => {
  if (BULK_ENDPOINTS.some((path) => endpoint.includes(path))) {
    return strategyRegistry[TrackIdentifyStrategy.name];
  }
  return strategyRegistry[CommonStrategy.name];
};

const responseHandler = (responseParams: ResponseParams) => {
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
