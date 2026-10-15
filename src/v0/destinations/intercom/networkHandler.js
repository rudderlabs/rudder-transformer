const { RetryableError } = require('@rudderstack/integrations-lib');
const { prepareProxyRequest, httpSend } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');

const isArchivedContactConflict = (response) =>
  response?.errors?.some(
    (error) => typeof error?.message === 'string' && /archived/i.test(error.message),
  );

const errorResponseHandler = (destinationResponse, dest, destinationRequest) => {
  const { status, response } = destinationResponse;
  const endpoint = destinationRequest?.endpoint || '';
  // Intercom uses 409 for both transient search-index conflicts and permanent archived-contact
  // conflicts. Retry the transient case so a later search can find and update the contact, but let
  // archived conflicts fall through with their original status so rudder-server's isJobTerminated
  // aborts them without blocking subsequent events for the user.
  if (status === 409 && endpoint.endsWith('/contacts') && !isArchivedContactConflict(response)) {
    throw new RetryableError(
      `[Intercom Response Handler] Request failed for destination ${dest} with status: ${status}. ${JSON.stringify(response)}`,
      500,
      destinationResponse,
    );
  }
  if (status === 408) {
    throw new RetryableError(
      `[Intercom Response Handler] Request failed for destination ${dest} with status: ${status}`,
      500,
      destinationResponse,
    );
  }
};

const destResponseHandler = (responseParams) => {
  const { destinationResponse, destType, destinationRequest } = responseParams;
  errorResponseHandler(destinationResponse, destType, destinationRequest);
  return {
    destinationResponse: destinationResponse.response,
    message: 'Request Processed Successfully',
    status: destinationResponse.status,
  };
};

const prepareIntercomProxyRequest = async (request) => {
  const { metadata } = request;
  const preparedRequest = await prepareProxyRequest(request);
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
    await prepareIntercomProxyRequest(request);

  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method,
  };
  const response = await httpSend(
    requestOptions,
    {
      destType: 'intercom',
      feature: 'proxy',
      endpointPath: '/proxy',
      requestMethod: 'POST',
      module: 'router',
      metadata,
    },
    true,
  );
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
