/* eslint-disable no-unused-vars */
const { isEmpty } = require("lodash");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { isHttpStatusSuccess } = require("../../util/index");
const ErrorBuilder = require("../../util/error");
const { proxyRequest } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");

const { defaultRequestConfig } = require("../../util");
const {
  IDENTIFIER_PRIORITY_ORDER,
  getCriteoPayloadTemplate
} = require("./config");
const { DESTINATION } = require("./config");

const insertIdentifierData = (obj, identifierAddList, userSchema) => {
  IDENTIFIER_PRIORITY_ORDER.forEach(type => {
    if (type in obj && userSchema.includes(type)) {
      // add the value in array
      identifierAddList[type].push(obj[type]);
    }
  });
  return identifierAddList;
};

const createResponse = (list, type, obj, endpoint, accessToken, Config) => {
  const response = defaultRequestConfig();
  response.method = "PATCH";
  response.body.JSON = getCriteoPayloadTemplate(type, obj, list, Config);
  response.endpoint = endpoint;
  response.headers = {
    Authorization: `Bearer ${accessToken}`
  };
  return response;
};

const getAuthErrCategory = (code, response) => {
  switch (code) {
    case 401:
      if (
        response.errors[0].code === "authorization-token-invalid" ||
        response.errors[0].code === "authorization-token-expired"
      ) {
        return REFRESH_TOKEN;
      }
      break;
    case 403: // Forbidden
    case 404: // Not found
    case 415: // Unsupported media type
    case 400: // Bad request, invalid syntax
    case 413: // Payload too large
    case 429: // rate limit exceeded
      return DISABLE_DEST;
    default:
      return "";
  }
};

const RETRYABLE_CODES = [500, 503];

const getStatusAndStats = (code, stage) => {
  if (RETRYABLE_CODES.includes(code)) {
    return {
      status: 500,
      stats: {
        destination: DESTINATION,
        stage,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
      }
    };
  }
  return {
    status: 400,
    stats: {
      destination: DESTINATION,
      stage,
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
    }
  };
};

const criteoRespHandler = (destResponse, stageMsg, stage) => {
  const { response, status } = destResponse;
  const respAttributes = response["@attributes"]; // where this attribute is generated???
  const { stat, err_code: errorCode } = respAttributes;

  // common error format
  //   "warnings": [],
  //   "errors": [
  //       {
  //           "traceIdentifier": "7693d346d1c9ea93",
  //           "type": "authorization",
  //           "code": "authorization-token-invalid",
  //           "instance": "/2021-10/audiences/137883/contactlist",
  //           "title": "The authorization header is invalid",
  //           "detail": null,
  //           "source": null
  //       }
  //   ]
  // }

  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    const statusAndStats = getStatusAndStats(errorCode, stage);
    throw new ErrorBuilder()
      .setStatus(statusAndStats.status)
      .setDestinationResponse(response)
      .setMessage(
        `Criteo Audience Upload: ${response.errors[0].title} ${stageMsg}`
      )
      .setAuthErrorCategory(getAuthErrCategory(errorCode))
      .setStatTags(statusAndStats.stats)
      .build();
  }
};
const responseHandler = (destinationResponse, _dest) => {
  const message = `[Criteo Response Handler] - Request Processed Successfully`;
  const { status } = destinationResponse;
  // else successfully return status, message and original destination response
  criteoRespHandler(
    destinationResponse,
    "during Criteo Audience response transformation",
    TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
  );
  return {
    status,
    message,
    destinationResponse
  };
};

const networkHandler = function() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
};

module.exports = {
  insertIdentifierData,
  createResponse,
  networkHandler
};
