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
const getAuthErrCategory = code => {
  switch (code) {
    // https://developers.criteo.com/marketing-solutions/docs/api-error-types#:~:text=If%20Criteo%20API%20responded%20with%20401%20it%20means
    case 401:
      return REFRESH_TOKEN;
    default:
      return "";
  }
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
    getAuthErrCategory(status)
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
