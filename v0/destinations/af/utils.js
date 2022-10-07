const {
  proxyRequest,
  prepareProxyRequest
} = require("../../../adapters/network");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { isHttpStatusSuccess } = require("../../util/index");
const ErrorBuilder = require("../../util/error");
const {
  getDynamicMeta,
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

const DESTINATION_NAME = "AppsFlyer";

// Ref for error codes of Appsflyer: https://support.appsflyer.com/hc/en-us/articles/207034486#response-codes
/**
 * Maps the Destination Error Codes to Rudder Error Codes
 * Have used Obect in order to incroporate any future error code handliing
 */
const destToRudderStatusMap = {
  403: {
    default: 400
  },
  400: {
    default: 400
  },
  500: { default: 500 },
  401: { default: 400 }
};

/**
 * @param {*} status status code provided by the destination
 * @returns the rudder status code for the same error
 */
const getStatusAndCategory = status => {
  const rudderStatus = destToRudderStatusMap[status]
    ? destToRudderStatusMap[status].default
    : 500;
  return { status: rudderStatus };
};

/**
 * @param status status code provided by the destination
 * @param {*} dresponse response by the destinationResponse
 * throws error if destination has send an error for the particular request
 */
const processResponse = ({ dresponse, status } = {}) => {
  const isSuccess = isHttpStatusSuccess(status);
  if (!isSuccess) {
    const { status: rudderStatus } = getStatusAndCategory(status);
    throw new ErrorBuilder()
      .setStatus(rudderStatus)
      .setMessage(
        dresponse.error.message ||
          `Request failed for ${DESTINATION_NAME} with status: ${status}`
      )
      .setDestinationResponse(dresponse)
      .isTransformResponseFailure(!isSuccess)
      .setStatTags({
        destType: DESTINATION_NAME,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        meta: getDynamicMeta(rudderStatus)
      })
      .build();
  }
};

const responseHandler = destinationResponse => {
  const { body, status } = destinationResponse;
  processResponse({
    dresponse: body,
    status
  });
  return {
    status,
    destinationResponse: body,
    message: "Request Processed Successfully"
  };
};
// eslint-disable-next-line func-names
class networkHandler {
  constructor() {
    this.proxy = proxyRequest;
    this.responseHandler = responseHandler;
    this.processAxiosResponse = processAxiosResponse;
    this.prepareProxy = prepareProxyRequest;
  }
}
module.exports = { networkHandler };
