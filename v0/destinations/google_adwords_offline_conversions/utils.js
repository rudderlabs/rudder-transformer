const get = require("get-value");
const set = require("set-value");
const sha256 = require("sha256");
const { httpSend, prepareProxyRequest } = require("../../../adapters/network");
const { CustomError, isHttpStatusSuccess } = require("../../util");
const Cache = require("../../util/cache");
const ErrorBuilder = require("../../util/error");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const { SEARCH_STREAM, CONVERSION_ACTION_ID_CACHE_TTL } = require("./config");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

const conversionActionIdCache = new Cache(CONVERSION_ACTION_ID_CACHE_TTL);

/**
 * validate destination config and check for existence of data
 * @param {*} param0
 */
const validateDestinationConfig = ({ Config }) => {
  if (!Config.customerId) {
    throw new CustomError(
      "[Google Ads Offline Conversions]:: Customer ID not found. Aborting",
      400
    );
  }
};

/**
 * for OAuth destination
 * get access_token from metadata.secret{ ... }
 * @param {*} param0
 * @returns
 */
const getAccessToken = ({ secret }) => {
  if (!secret) {
    throw new CustomError(
      "[Google Ads Offline Conversions]:: OAuth - access token not found",
      500
    );
  }
  return secret.access_token;
};

/**
 * This function helps to determine the type of error occured. We set the authErrorCategory
 * as per the destination response that is received and take the decision whether
 * to refresh the access_token or disable the destination.
 * @param {*} code
 * @param {*} response
 * @returns
 */
const getAuthErrCategory = code => {
  switch (code) {
    case 401:
      // UNAUTHORIZED
      return REFRESH_TOKEN;
    case 403:
      // PERMISSION_DENIED
      return DISABLE_DEST;
    default:
      return "";
  }
};

/**
 * get conversionActionId using the conversion name using searchStream endpoint
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
      url: SEARCH_STREAM.replace(":customerId", params.customerId),
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
          `[Google Ads Offline Conversions]:: ${response.response.response.data[0].error.message} during google_ads_offline_conversions response transformation`
        )
        .setAuthErrorCategory(
          getAuthErrCategory(get(response, "response.response.status"))
        )
        .build();
    }
    const conversionActionId = get(
      response,
      "response.data.0.results.0.conversionAction.id"
    );
    if (!conversionActionId) {
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage(
          `[Google Ads Offline Conversions]:: Unable to find conversionActionId for conversion:${params.event}`
        )
        .build();
    }
    return conversionActionId;
  });
};

// transformer proxy

/**
 * collect conversionActionId for conversionAction parameter
 * @param {*} request
 * @returns
 */
const proxyRequest = async request => {
  const { method, endpoint, headers, params, body } = request;

  const conversionActionId = await getConversionActionId(
    method,
    headers,
    params
  );

  set(
    body.JSON,
    "conversions.0.conversionAction",
    `customers/${params.customerId}/conversionActions/${conversionActionId}`
  );
  const requestBody = { url: endpoint, data: body.JSON, headers, method };
  const response = await httpSend(requestBody);
  return response;
};

const responseHandler = destinationResponse => {
  const message = `[Google Ads Offline Conversions Response Handler] - Request processed successfully`;
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // Mostly any error will not have a status of 2xx
    return {
      status,
      message,
      destinationResponse
    };
  }

  // the response from destination is not a success case build an explicit error
  // return status, original destination response, message
  const { response } = destinationResponse;
  throw new ErrorBuilder()
    .setStatus(status)
    .setDestinationResponse(response)
    .setMessage(
      `[Google Ads Offline Conversions]:: ${response.error.message} during google_ads_offline_conversions response transformation`
    )
    .setAuthErrorCategory(getAuthErrCategory(status, response))
    .build();
};

class networkHandler {
  constructor() {
    this.prepareProxy = prepareProxyRequest;
    this.proxy = proxyRequest;
    this.processAxiosResponse = processAxiosResponse;
    this.responseHandler = responseHandler;
  }
}

module.exports = { validateDestinationConfig, getAccessToken, networkHandler };
