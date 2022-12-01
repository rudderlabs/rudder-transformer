const sha256 = require("sha256");
const get = require("get-value");
const { httpPOST } = require("../../../adapters/network");
const { isHttpStatusSuccess } = require("../../util");
const ErrorBuilder = require("../../util/error");
const {
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const { SEARCH_STREAM, CONVERSION_ACTION_ID_CACHE_TTL } = require("./config");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const Cache = require("../../util/cache");

const conversionActionIdCache = new Cache(CONVERSION_ACTION_ID_CACHE_TTL);

/**
 * validate destination config and check for existence of data
 * @param {*} param0
 */
const validateDestinationConfig = ({ Config }) => {
  if (!Config.customerId) {
    throw new ErrorBuilder()
      .setMessage(
        "[Google Ads Offline Conversions]:: Customer ID not found. Aborting"
      )
      .setStatus(400)
      .build();
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
    throw new ErrorBuilder()
      .setMessage(
        "[Google Ads Offline Conversions]:: OAuth - access token not found"
      )
      .setStatus(500)
      .build();
  }
  return secret.access_token;
};

/**
 * This function helps to determine the type of error occured. We set the authErrorCategory
 * as per the destination response that is received and take the decision whether
 * to refresh the access_token or disable the destination.
 * @param {*} status
 * @returns
 */
const getAuthErrCategory = status => {
  switch (status) {
    case 401:
      // UNAUTHORIZED
      return REFRESH_TOKEN;
    default:
      return "";
  }
};

/**
 * get conversionAction using the conversion name using searchStream endpoint
 * @param {*} customerId
 * @param {*} event
 * @param {*} headers
 * @returns
 */
const getConversionActionId = async (headers, params) => {
  const conversionActionIdKey = sha256(
    params.event + params.customerId
  ).toString();
  return conversionActionIdCache.get(conversionActionIdKey, async () => {
    const data = {
      query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = '${params.event}'`
    };
    const endpoint = SEARCH_STREAM.replace(":customerId", params.customerId);
    const requestOptions = {
      headers
    };
    let searchStreamResponse = await httpPOST(endpoint, data, requestOptions);
    searchStreamResponse = processAxiosResponse(searchStreamResponse);
    if (!isHttpStatusSuccess(searchStreamResponse.status)) {
      throw new ErrorBuilder()
        .setStatus(searchStreamResponse.status)
        .setDestinationResponse(searchStreamResponse.response)
        .setMessage(
          `[Google Ads Offline Conversions]:: ${searchStreamResponse.response[0].error.message} during google_ads_offline_conversions response transformation`
        )
        .setAuthErrorCategory(
          getAuthErrCategory(get(searchStreamResponse, "status"))
        )
        .build();
    }
    const conversionAction = get(
      searchStreamResponse,
      "response.0.results.0.conversionAction.resourceName"
    );
    if (!conversionAction) {
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage(
          `[Google Ads Offline Conversions]:: Unable to find conversionActionId for conversion:${params.event}`
        )
        .build();
    }
    return conversionAction;
  });
};

/**
 * update mapping Json config to remove 'hashToSha256'
 * operation from metadata.type and replace it with
 * 'toString'
 * @param {*} mapping
 * @returns
 */
const removeHashToSha256TypeFromMappingJson = mapping => {
  const newMapping = [];
  mapping.forEach(element => {
    if (get(element, "metadata.type")) {
      if (element.metadata.type === "hashToSha256") {
        // eslint-disable-next-line no-param-reassign
        element.metadata.type = "toString";
      }
    }
    newMapping.push(element);
  });
  return newMapping;
};

module.exports = {
  validateDestinationConfig,
  getAccessToken,
  getConversionActionId,
  removeHashToSha256TypeFromMappingJson
};
