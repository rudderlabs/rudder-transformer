const {
  proxyRequest,
  prepareProxyRequest
} = require("../../../adapters/network");
const {
  getDynamicMeta,
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const {
  isDefinedAndNotNull,
  isDefined,
  isHttpStatusSuccess
} = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");

const responseHandler = (destinationResponse, dest) => {
  const message = `[GA4 Response Handler] - Request Processed Successfully`;
  let { status } = destinationResponse;
  const { response } = destinationResponse;
  if (status === 204) {
    // GA4 always returns a 204 response, other than in case of
    // validation endpoint.
    status = 200;
  } else if (
    status === 200 &&
    isDefinedAndNotNull(response) &&
    isDefined(response.validationMessages)
  ) {
    // for GA4 debug validation endpoint, status is always 200
    // validationMessages[] is empty, thus event is valid
    if (response.validationMessages?.length === 0) {
      status = 200;
    } else {
      // Build the error in case the validationMessages[] is non-empty
      const {
        description,
        validationCode,
        fieldPath
      } = response.validationMessages[0];
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage(
          `[GA4] Validation Server Response Handler:: Validation Error for ${dest} of field path :${fieldPath} | ${validationCode}-${description}`
        )
        .isTransformResponseFailure(true)
        .setDestinationResponse(response?.validationMessages[0]?.description)
        .setStatTags({
          destType: dest,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: getDynamicMeta(status)
        })
        .build();
    }
  }

  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new ErrorBuilder()
      .setStatus(status)
      .setMessage(
        `[GA4 Response Handler] Request failed for destination ${dest} with status: ${status}`
      )
      .isTransformResponseFailure(true)
      .setDestinationResponse(destinationResponse)
      .setStatTags({
        destType: dest,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(status)
      })
      .build();
  }

  return {
    status,
    message,
    destinationResponse
  };
};

const networkHandler = function() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
};

module.exports = {
  networkHandler
};
