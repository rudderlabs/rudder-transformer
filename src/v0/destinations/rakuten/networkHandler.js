const { NetworkError } = require('@rudderstack/integrations-lib');
const { httpSend } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { TAG_NAMES } = require('../../util/tags');
const { HTTP_STATUS_CODES } = require('../../util/constant');

const DESTINATION = 'RAKUTEN';
const prepareProxyRequest = async (request) => request;
const proxyRequest = async (request, destType) => {
  const { metadata } = request;
  const { endpoint, data, method, params, headers } = await prepareProxyRequest(request);
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
      feature: 'proxy',
      destType,
      metadata,
      endpointPath: '/ep',
      requestMethod: 'GET',
      module: 'dataDelivery',
    },
    true,
  );
  return response;
};
const extractContent = (xmlPayload, tagName) => {
  const pattern = new RegExp(`<${tagName}>(.*?)</${tagName}>`);
  const match = xmlPayload.match(pattern);
  return match ? match[1] : null;
};

const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
  const msg = `[${DESTINATION} Response Handler] - Request Processed Successfully`;
  const { response, status } = destinationResponse;
  if (status === 400) {
    throw new NetworkError(
      `Request failed with status: ${status} due to invalid Marketing Id`,
      400,
      {
        [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }
  // Extract errors, good and bad between different tags
  const badRecords = extractContent(response, 'bad');
  const errors = extractContent(response, 'error');

  // For access denied for a mid rakuten sends status code 200 with response as <response> <error> Access denied </error> </response>
  if (errors) {
    throw new NetworkError(
      `Request failed with status: ${status} due to ${errors}. Can you try to enable pixel tracking for this mid.`,
      400,
      {
        // status would be 200 but since no error type for this status code hence it will take it as aborted
        [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }
  if (parseInt(badRecords, 10)) {
    throw new NetworkError(
      `Request failed with status: ${status} with number of bad records ${badRecords}`,
      400,
      {
        // status would be 200 but since no error type for this status code hence it will take it as aborted
        [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }
  /* just puttting it here for 429 and 500's we dont have documentation for these two 
  neither we have any sample response but just in case if we recoeve non 2xx status
  */
  if (status !== 200) {
    throw new NetworkError(
      `Request failed with status: ${status}`,
      status,
      {
        [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }
  // if no error or bad record is found and status is 200 the request is successfull
  return {
    status: HTTP_STATUS_CODES.OK,
    message: msg,
    destinationResponse,
  };
};
// eslint-disable-next-line @typescript-eslint/naming-convention
class networkHandler {
  constructor() {
    this.responseHandler = responseHandler;
    this.proxy = proxyRequest;
    this.prepareProxy = prepareProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }
}

module.exports = {
  networkHandler,
  responseHandler,
};
