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

const prepareIntercomProxyRequest = async (request) => {
  const { metadata } = request;
  const preparedRequest = await prepareProxyRequest(request);
  preparedRequest.headers['User-Agent'] = process.env.INTERCOM_USER_AGENT_HEADER ?? 'RudderStack';
  return { ...preparedRequest, metadata };
};

const getContactIdFromConflictResponse = (response) => {
  const errorMessage = response.response?.response?.data?.errors?.[0]?.message || '';
  const match = errorMessage.match(/id=([\da-f]+)/);
  return match ? match[1] : null;
};

const retryAsUpdateContact = async (requestOptions, endpoint, contactId, metadata) => {
  const updatedRequestOptions = {
    ...requestOptions,
    url: `${endpoint}/${contactId}`,
    method: 'PUT',
  };
  return httpSend(
    updatedRequestOptions,
    {
      destType: 'intercom',
      feature: 'proxy',
      endpointPath: '/proxy',
      requestMethod: 'PUT',
      module: 'router',
      metadata,
    },
    true,
  );
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
  let response = await httpSend(
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

  if (response.response.status === 409 && endpoint.endsWith('/contacts')) {
    const contactId = getContactIdFromConflictResponse(response);
    if (contactId) {
      response = await retryAsUpdateContact(requestOptions, endpoint, contactId, metadata);
    }
  }

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
