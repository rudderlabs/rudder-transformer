const { removeUndefinedValues, getAuthErrCategoryFromErrDetailsAndStCode } = require('../../util');
const { prepareProxyRequest, getPayloadData, httpSend } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const tags = require('../../util/tags');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { NetworkError, RetryableError, AbortedError } = require('../../util/errorTypes');
const { HTTP_STATUS_CODES } = require('../../util/constant');

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

const scAudienceProxyRequest = async (request) => {
  const { endpoint, data, method, params, headers } = prepareProxyReq(request);

  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method,
  };
  const response = await httpSend(requestOptions, {
    feature: 'proxy',
    destType: 'snapchat_custom_audience',
  });
  return response;
};

const scaAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  const authErrCategory = getAuthErrCategoryFromErrDetailsAndStCode(status, response);

  if (authErrCategory === REFRESH_TOKEN) {
    throw new RetryableError(
      `Failed with ${response} ${stageMsg}`,
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      destResponse,
      authErrCategory,
    );
  }

  // Permissions error
  if (response?.error_code === 'E3002') {
    throw new AbortedError(
      `${response.error?.message} ${stageMsg}`,
      null,
      destResponse,
      authErrCategory,
    );
  }
  throw new NetworkError(
    `${response.error?.message} ${stageMsg}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destResponse,
    authErrCategory,
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
