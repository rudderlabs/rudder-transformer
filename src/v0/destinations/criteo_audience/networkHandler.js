const {
  prepareProxyRequest,
  proxyRequest
} = require("../../../adapters/network");
const { isHttpStatusSuccess } = require("../../util/index");
const {
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const tags = require("../../util/tags");
const {
  getDynamicErrorType,
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { NetworkError } = require("../../util/errorTypes");

/**
 * This function helps to determine type of error occured. According to the response
 * we set authErrorCategory to take decision if we need to refresh the access_token
 * or need to disable the destination.
 * @param {*} code
 * @param {*} response
 * @returns
 */
//  https://developers.criteo.com/marketing-solutions/v2021.01/docs/how-to-handle-api-errors#:~:text=the%20response%20body.-,401,-Authentication%20error
const getAuthErrCategory = (status,code) => {
  if (status === '401' && code === 'authorization-token-invalid') {
    return REFRESH_TOKEN;
  }

  return "";
};

const criteoAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  throw new NetworkError(
    `${response?.errors[0]?.title} ${stageMsg}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status)
    },
    response,
    getAuthErrCategory(status,response?.errors[0]?.code)
  );
};

const responseHandler = destinationResponse => {
  const message = `Request Processed Successfully`;
  const { status } = destinationResponse;
  if (!isHttpStatusSuccess(status)) {
    // if error, successfully return status, message and original destination response
    criteoAudienceRespHandler(
      destinationResponse,
      "during criteo_audience response transformation"
    );
  }
  // Mostly any error will not have a status of 2xx
  return {
    status,
    message,
    destinationResponse
  };
};

class networkHandler {
  constructor() {
    this.responseHandler = responseHandler;
    this.proxy = proxyRequest;
    this.prepareProxy = prepareProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }
}

module.exports = { networkHandler };
