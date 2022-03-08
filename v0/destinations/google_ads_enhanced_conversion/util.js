const { get, set } = require("lodash");
const sha256 = require("sha256");
const { httpSend } = require("../../../adapters/network");
const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const Cache = require("../../util/cache");

const conversionActionIdCache = new Cache(24 * 60 * 60);

const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { BASE_ENDPOINT } = require("./config");

/**
 *  This function is used for collecting the conversionActionId using the conversion name
 * @param {*} method
 * @param {*} headers
 * @param {*} params
 * @returns
 */

const getConversionActionId = async (method, headers, params) => {
  const conversionActionIdKey = sha256(
    params.event + params.customerId
  ).toString();
  return conversionActionIdCache.get(conversionActionIdKey, async () => {
    const data = {
      query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = '${params.event}'`
    };
    const requestBody = {
      url: `${BASE_ENDPOINT}/${params.customerId}/googleAds:searchStream`,
      data,
      headers,
      method
    };
    const response = await httpSend(requestBody);
    return response;
  });
};

/**
 * This function is responsible for collecting the conversionActionId
 * and calling the enhanced conversion.
 * data to customer list.
 * @param {*} request
 * @returns
 */
const gaemProxyRequest = async request => {
  const { body, method, endpoint, params } = request;
  const { headers } = request;

  const conversionActionIdResponse = await getConversionActionId(
    method,
    headers,
    params
  );
  if (
    !conversionActionIdResponse.success &&
    !isHttpStatusSuccess(conversionActionIdResponse.response.response.status)
  ) {
    // eslint-disable-next-line prefer-destructuring
    set(
      conversionActionIdResponse,
      "response.response.data",
      get(conversionActionIdResponse, "response.response.data[0]")
    );
    return conversionActionIdResponse;
  }

  const conversionActionId = get(
    conversionActionIdResponse,
    "response.data[0].results[0].conversionAction.id"
  );
  if (!conversionActionId)
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(
        `Google_ads_enhanced_conversion: Unable to find conversionActionId for conversion:${params.event}`
      )
      .build();
  set(
    body.JSON,
    "conversionAdjustments[0].conversionAction",
    `customers/${params.customerId}/conversionActions/${conversionActionId}`
  );
  const requestBody = { url: endpoint, data: body.JSON, headers, method };
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

/**
 * This function will handle the responses from google ads api
 * @param {*} destResponse
 * @param {*} stageMsg
 */
const gaecRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  throw new ErrorBuilder()
    .setStatus(status)
    .setDestinationResponse(response)
    .setMessage(
      `Google_ads_enhanced_conversion: ${response.error.message} ${stageMsg}`
    )
    .setAuthErrorCategory(getAuthErrCategory(status, response))
    .build();
};

const responseHandler = destinationResponse => {
  const message = `[Google_ads_enhanced_conversion Response Handler] - Request Processed Successfully`;
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
  gaecRespHandler(
    destinationResponse,
    "during Google_ads_enhanced_conversion response transformation",
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
