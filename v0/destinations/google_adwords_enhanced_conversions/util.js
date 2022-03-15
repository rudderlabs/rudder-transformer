const { get, set } = require("lodash");
const sha256 = require("sha256");
const { httpSend } = require("../../../adapters/network");
const { isHttpStatusSuccess } = require("../../util/index");
const ErrorBuilder = require("../../util/error");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const { CONVERSION_ACTION_ID_CACHE_TTL } = require("./config.js");
const Cache = require("../../util/cache");

const conversionActionIdCache = new Cache(CONVERSION_ACTION_ID_CACHE_TTL);

const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { BASE_ENDPOINT } = require("./config");
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
      if (!get(response, "error.details")) return REFRESH_TOKEN;
      return "";
    case 403: // Access Denied
      return DISABLE_DEST;
    default:
      return "";
  }
};

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
    if (
      !response.success &&
      !isHttpStatusSuccess(response.response.response.status)
    ) {
      throw new ErrorBuilder()
        .setStatus(response.response.response.status)
        .setDestinationResponse(response.response.response.data)
        .setMessage(
          `Google_awordds_enhanced_conversion: ${response.response.response.data[0].error.message} during Google_adwords_enhanced_conversions response transformation`
        )
        .setAuthErrorCategory(
          getAuthErrCategory(
            get(response, "response.response.status"),
            get(response, "response.response.data[0]")
          )
        )
        .build();
    }
    const conversionActionId = get(
      response,
      "response.data[0].results[0].conversionAction.id"
    );
    if (!conversionActionId) {
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage(
          `Google_adwords_enhanced_conversions: Unable to find conversionActionId for conversion:${params.event}`
        )
        .build();
    }
    return conversionActionId;
  });
};

/**
 * This function is responsible for collecting the conversionActionId
 * and calling the enhanced conversion.
 * data to customer list.
 * @param {*} request
 * @returns
 */
const ProxyRequest = async request => {
  const { body, method, endpoint, params } = request;
  const { headers } = request;

  const conversionActionId = await getConversionActionId(
    method,
    headers,
    params
  );

  set(
    body.JSON,
    "conversionAdjustments[0].conversionAction",
    `customers/${params.customerId}/conversionActions/${conversionActionId}`
  );
  const requestBody = { url: endpoint, data: body.JSON, headers, method };
  const response = await httpSend(requestBody);
  return response;
};

const responseHandler = destinationResponse => {
  const message = `[Google_adwords_enhanced_conversions Response Handler] - Request Processed Successfully`;
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
  const { response } = destinationResponse;
  throw new ErrorBuilder()
    .setStatus(status)
    .setDestinationResponse(response)
    .setMessage(
      `Google_awordds_enhanced_conversion: ${response.error.message} during Google_adwords_enhanced_conversions response transformation`
    )
    .setAuthErrorCategory(getAuthErrCategory(status, response))
    .build();
};
// eslint-disable-next-line func-names
class networkHandler {
  constructor() {
    this.proxy = ProxyRequest;
    this.responseHandler = responseHandler;
    this.processAxiosResponse = processAxiosResponse;
  }
}
module.exports = { networkHandler };
