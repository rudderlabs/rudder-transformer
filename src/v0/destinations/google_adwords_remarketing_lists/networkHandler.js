const { httpSend, prepareProxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');

const { getAuthErrCategory } = require('./util');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { NetworkError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

/**
 * This function helps to run a offlineUserDataJobs
 * @param endpoint
 * @param headers
 * @param method
 * @param jobId
 */
const runTheJob = async (endpoint, headers, method) => {
  const thirdRequest = {
    url: endpoint,
    headers,
    method,
  };
  const response = await httpSend(thirdRequest);
  return response;
};

/**
 * This function is responsible for making the three steps required for uploding
 * data to customer list.
 * @param {*} request
 * @returns
 */
const gaAudienceProxyRequest = async (request) => {
  const { method, endpoint } = request;
  const { headers } = request;
  // step3: running the job
  const thirdResponse = await runTheJob(endpoint, headers, method);
  return thirdResponse;
};

const gaAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  // const respAttributes = response["@attributes"] || null;
  // const { stat, err_code: errorCode } = respAttributes;

  throw new NetworkError(
    `${response?.error?.message} ${stageMsg}`,
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
  gaAudienceRespHandler(destinationResponse, 'during ga_audience response transformation');
  return undefined;
};

function networkHandler() {
  this.proxy = gaAudienceProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
}
module.exports = { networkHandler };
