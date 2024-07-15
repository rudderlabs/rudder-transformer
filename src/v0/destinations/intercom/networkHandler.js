const { RetryableError } = require('@rudderstack/integrations-lib');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');

const errorResponseHandler = (destinationResponse, dest) => {
  const { status } = destinationResponse;
  if (status === 408) {
    throw new RetryableError(
      `[Intercom Response Handler] Request failed for destination ${dest} with status: ${status}`,
      500,
      destinationResponse,
    );
  }
};

const destResponseHandler = (responseParams) => {
  const { destinationResponse, destType } = responseParams;
  errorResponseHandler(destinationResponse, destType);
  return {
    destinationResponse: destinationResponse.response,
    message: 'Request Processed Successfully',
    status: destinationResponse.status,
  };
};

const prepareIntercomProxyRequest = (request) => {
  const preparedRequest = prepareProxyRequest(request);
  preparedRequest.headers['User-Agent'] = process.env.INTERCOM_USER_AGENT_HEADER ?? 'RudderStack';
  return preparedRequest;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
class networkHandler {
  constructor() {
    this.responseHandler = destResponseHandler;
    this.proxy = proxyRequest;
    this.prepareProxy = prepareIntercomProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }
}

module.exports = {
  networkHandler,
};
