const { RetryableError } = require('@rudderstack/integrations-lib');
const { prepareProxyRequest, httpSend } = require('../../../adapters/network');
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
  const { metadata } = request;
  const preparedRequest = prepareProxyRequest(request);
  preparedRequest.headers['User-Agent'] = process.env.INTERCOM_USER_AGENT_HEADER ?? 'RudderStack';
  return { ...preparedRequest, metadata };
};

/**
 * depricating: handles proxying requests to destinations from server, expects requsts in "defaultRequestConfig"
 * note: needed for test api
 * @param {*} request
 * @returns
 */
const intercomProxyRequest = async (request) => {
  const { endpoint, data, method, params, headers, metadata } =
    prepareIntercomProxyRequest(request);

  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method,
  };
  const response = await httpSend(requestOptions, {
    destType: 'intercom',
    feature: 'proxy',
    endpointPath: '/proxy',
    requestMethod: 'POST',
    module: 'router',
    metadata,
  });
  return response;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
class networkHandler {
  constructor() {
    this.responseHandler = destResponseHandler;
    this.proxy = intercomProxyRequest;
    this.prepareProxy = prepareIntercomProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }
}

module.exports = {
  networkHandler,
};
