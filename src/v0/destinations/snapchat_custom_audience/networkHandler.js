const { removeUndefinedValues } = require('../../util');
const { prepareProxyRequest, getPayloadData, httpSend } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const tags = require('../../util/tags');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { NetworkError } = require('../../util/errorTypes');

const prepareProxyReq = (request) => {
  const { body } = request;
  // Build the destination request data using the generic method
  const { endpoint, data, method, params, headers } = prepareProxyRequest(request);

  // Modify the data
  const { payloadFormat } = getPayloadData(body);
  if (payloadFormat === 'FORM') {
    data.append('format', 'json');
  }

  return removeUndefinedValues({
    endpoint,
    data,
    params,
    headers,
    method,
  });
};

/**
 * This function helps to determine type of error occurred. According to the response
 * we set authErrorCategory to take decision if we need to refresh the access_token
 * or need to disable the destination.
 * @param {*} code
 * @param {*} response
 * @returns
 */
const getAuthErrCategory = (code, response) => {
  let authErrCategory;
  if (code === 401) {
    authErrCategory = !response.error?.details ? REFRESH_TOKEN : '';
  } else {
    authErrCategory = '';
  }
  return authErrCategory;
};

const scAudienceProxyRequest = async (request) => {
  const { endpoint, data, method, params, headers } = prepareProxyReq(request);

  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method,
  };
  const response = await httpSend(requestOptions);
  return response;
};

const scaAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  // const respAttributes = response["@attributes"] || null;
  // const { stat, err_code: errorCode } = respAttributes;
  throw new NetworkError(
    `${response.error?.message} ${stageMsg}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    response,
    getAuthErrCategory(status, response),
  );
};

const responseHandler = (destinationResponse) => {
  const message = `Request Processed Successfully`;
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // Mostly any error will not have a status of 2xx
    return {
      status,
      message,
      destinationResponse,
    };
  }
  // else successfully return status, message and original destination response
  scaAudienceRespHandler(
    destinationResponse,
    'during snapchat_custom_audience response transformation',
  );
  return undefined;
};

function networkHandler() {
  this.proxy = scAudienceProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
}
module.exports = { networkHandler };
