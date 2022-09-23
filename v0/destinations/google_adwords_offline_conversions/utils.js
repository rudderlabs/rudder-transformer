const get = require("get-value");
const set = require("set-value");
const sha256 = require("sha256");
const {
  prepareProxyRequest,
  httpPOST,
  httpSend
} = require("../../../adapters/network");
const { isHttpStatusSuccess, getHashFromArray } = require("../../util");
const Cache = require("../../util/cache");
const ErrorBuilder = require("../../util/error");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const {
  SEARCH_STREAM,
  CONVERSION_ACTION_ID_CACHE_TTL,
  CONVERSION_CUSTOM_VARIABLE_CACHE_TTL
} = require("./config");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

const conversionActionIdCache = new Cache(CONVERSION_ACTION_ID_CACHE_TTL);
const conversionCustomVariableCache = new Cache(
  CONVERSION_CUSTOM_VARIABLE_CACHE_TTL
);

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
    case 403:
      // PERMISSION_DENIED
      return DISABLE_DEST;
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
 * get all the custom variable for a customerID i.e created
 * in Google Ads using searchStream endpoint
 * @param {*} customerId
 * @param {*} event
 * @param {*} headers
 * @returns
 */
const getConversionCustomVariable = async (headers, params) => {
  const conversionCustomVariableKey = sha256(params.customerId).toString();
  return conversionCustomVariableCache.get(
    conversionCustomVariableKey,
    async () => {
      const data = {
        query: `SELECT conversion_custom_variable.name FROM conversion_custom_variable`
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
      const conversionCustomVariable = get(
        searchStreamResponse,
        "response.0.results"
      );
      if (!conversionCustomVariable) {
        throw new ErrorBuilder()
          .setStatus(400)
          .setMessage(
            `[Google Ads Offline Conversions]:: Conversion Custom Variable has not been created yet in Google Ads`
          )
          .build();
      }
      return conversionCustomVariable;
    }
  );
};

/**
 * convert it into hashMap
 *
 * input:
 * [
 *  {
 *    "conversionCustomVariable": {
 *    "resourceName": "customers/9625812972/conversionCustomVariables/19131634",
 *    "name": "revenue"
 *     }
 *   },
 * ]
 *
 * Output:
 * {
 *  revenue: "customers/9625812972/conversionCustomVariables/19131634"
 * }
 * @param {*} arrays
 * @returns
 */
const getConversionCustomVariableHashMap = arrays => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach(array => {
      hashMap[array.conversionCustomVariable.name] =
        array.conversionCustomVariable.resourceName;
    });
  }
  return hashMap;
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

// transformer proxy

/**
 * collect conversionActionId for conversionAction parameter
 * @param {*} request
 * @returns
 */
const ProxyRequest = async request => {
  const { method, endpoint, headers, params, body } = request;

  // fetch conversionAction
  // httpPOST -> axios.post()
  const conversionActionId = await getConversionActionId(headers, params);
  set(body.JSON, "conversions.0.conversionAction", conversionActionId);

  // fetch all conversion custom variable in google ads
  let conversionCustomVariable = await getConversionCustomVariable(
    headers,
    params
  );

  // convert it into hashMap
  conversionCustomVariable = getConversionCustomVariableHashMap(
    conversionCustomVariable
  );

  const { properties } = params;
  let { customVariables } = params;
  const resultantCustomVariables = [];
  customVariables = getHashFromArray(customVariables);
  Object.keys(customVariables).forEach(key => {
    if (properties[key] && conversionCustomVariable[customVariables[key]]) {
      // 1. set custom variable name
      // 2. set custom variable value
      resultantCustomVariables.push({
        conversionCustomVariable:
          conversionCustomVariable[customVariables[key]],
        value: String(properties[key])
      });
    }
  });

  if (resultantCustomVariables) {
    set(body.JSON, "conversions.0.customVariables", resultantCustomVariables);
  }

  const requestBody = { url: endpoint, data: body.JSON, headers, method };
  const response = await httpSend(requestBody);
  return response;
};

const responseHandler = destinationResponse => {
  const message = `[Google Ads Offline Conversions Response Handler] - Request processed successfully`;
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // for google ads offline conversions the partialFailureError returns with status 200
    const { partialFailureError } = destinationResponse.response;
    // non-zero code signifies partialFailure
    // Ref - https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
    if (partialFailureError && partialFailureError.code !== 0) {
      throw new ErrorBuilder()
        .setStatus(400)
        .setDestinationResponse(partialFailureError.details)
        .setMessage(
          `[Google Ads Offline Conversions]:: partialFailureError - ${partialFailureError.message}`
        )
        .build();
    }

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
    .setAuthErrorCategory(getAuthErrCategory(status))
    .build();
};

const networkHandler = function() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = ProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
};

module.exports = {
  validateDestinationConfig,
  getAccessToken,
  getConversionActionId,
  getConversionCustomVariable,
  removeHashToSha256TypeFromMappingJson,
  networkHandler
};
