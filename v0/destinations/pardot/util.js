const { removeUndefinedValues } = require("../../util");
const {
  prepareProxyRequest,
  getPayloadData,
  httpSend
} = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const ErrorBuilder = require("../../util/error");
const { DESTINATION } = require("./config");

/**
 * Example Response from pardot
 *
  {
    "@attributes": {
      "stat": "fail",
      "version": 1,
      "err_code": 59
    },
    "err": "A CRM connector was detected"
  }
 * 
 * 
 */

const getAuthErrCategory = code => {
  switch (code) {
    case 184:
      return REFRESH_TOKEN;
    case 49: // Access Denied
    case 46: // Lack of permissions
    case 119: // https://community.auth0.com/t/cant-generate-refresh-token-for-salesforce-authentication-provider/32949
      return DISABLE_DEST;
    default:
      return "";
  }
};
const RETRYABLE_CODES = [85, 116, 120, 121, 183, 184, 214];

const getStatusAndStats = (code, stage) => {
  if (RETRYABLE_CODES.includes(code)) {
    return {
      status: 500,
      stats: {
        destType: DESTINATION,
        stage,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
      }
    };
  }
  return {
    status: 400,
    stats: {
      destType: DESTINATION,
      stage,
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
    }
  };
};

const pardotRespHandler = (destResponse, stageMsg, stage) => {
  const { status, response } = destResponse;
  const respAttributes = response["@attributes"];
  const { stat, err_code: errorCode } = respAttributes;

  if (isHttpStatusSuccess(status) && stat !== "fail") {
    // Mostly any error will not have a status of 2xx
    return response;
  }
  const statusAndStats = getStatusAndStats(errorCode, stage);
  throw new ErrorBuilder()
    .setStatus(statusAndStats.status)
    .setDestinationResponse(response)
    .setMessage(`Pardot: ${response.err} ${stageMsg}`)
    .setAuthErrorCategory(getAuthErrCategory(errorCode))
    .setStatTags(statusAndStats.stats)
    .build();
};

const responseHandler = destinationResponse => {
  const message = `[Pardot Response Handler] - Request Processed Successfully`;
  const { status } = destinationResponse;
  // else successfully return status, message and original destination response
  pardotRespHandler(
    destinationResponse,
    "during Pardot response transformation",
    TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
  );
  return {
    status,
    message,
    destinationResponse
  };
};

const prepareProxyReq = request => {
  const { body } = request;
  // Build the destination request data using the generic method
  const { endpoint, data, method, params, headers } = prepareProxyRequest(
    request
  );

  // Modify the data
  const { payloadFormat } = getPayloadData(body);
  if (payloadFormat === "FORM") {
    data.append("format", "json");
  }

  return removeUndefinedValues({
    endpoint,
    data,
    params,
    headers,
    method
  });
};

/**
 * depricating: handles proxying requests to destinations from server, expects requsts in "defaultRequestConfig"
 * note: needed for test api
 * @param {*} request
 * @returns
 */
const pardotProxyRequest = async request => {
  const { endpoint, data, method, params, headers } = prepareProxyReq(request);

  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method
  };
  const response = await httpSend(requestOptions);
  return response;
};

const networkHandler = function() {
  this.responseHandler = responseHandler;
  this.proxy = pardotProxyRequest;
  this.prepareProxy = prepareProxyReq;
  this.processAxiosResponse = processAxiosResponse;
};

module.exports = {
  networkHandler
};
