const { httpSend } = require("../../../adapters/network");
const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");

const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

/**
 * This function is responsible for making the three steps required for uploding
 * data to customer list.
 * @param {*} request
 * @returns
 */
const gaemProxyRequest = async request => {
  const { body, method, endpoint } = request;
  const { headers } = request;
  //   const { customerId, listId } = params;

  // step1: offlineUserDataJobs creation

  const requestBody = {
    url: endpoint,
    data: body.JSON,
    headers,
    method
  };
  const response = await httpSend(requestBody);
  return response;
};

/**
 * This function helps to detarmine type of error occured. According to the response
 * we set authErrorCategory to take decision if we need to refresh the access_token
 * or need to disable the destination.
 * @param {*} code
 * @param {*} response
 * @returns
 */
const getAuthErrCategory = (code, response) => {
  switch (code) {
    case 401:
      if (!response.error.details) return REFRESH_TOKEN;
      return "";
    case 403: // Access Denied
      return DISABLE_DEST;
    default:
      return "";
  }
};

const gaAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  // const respAttributes = response["@attributes"] || null;
  // const { stat, err_code: errorCode } = respAttributes;

  throw new ErrorBuilder()
    .setStatus(status)
    .setDestinationResponse(response)
    .setMessage(
      `Google_adwords_remarketing_list: ${response.error.message} ${stageMsg}`
    )
    .setAuthErrorCategory(getAuthErrCategory(status, response))
    .build();
};

const responseHandler = destinationResponse => {
  const message = `[Google_adwords_remarketing_list Response Handler] - Request Processed Successfully`;
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // Mostly any error will not have a status of 2xx
    return {
      status,
      message,
      destinationResponse
    };
  }
  // else successfully return status, message and original destination response
  gaAudienceRespHandler(
    destinationResponse,
    "during ga_audience response transformation",
    TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
  );
};
// eslint-disable-next-line func-names
class networkHandler {
  constructor() {
    this.proxy = gaemProxyRequest;
    this.responseHandler = responseHandler;
    this.processAxiosResponse = processAxiosResponse;
  }
}
module.exports = { networkHandler, responseHandler };
