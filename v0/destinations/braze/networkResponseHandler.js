const { getDynamicMeta } = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { DESTINATION } = require("./config");
const ErrorBuilder = require("../../util/error");

// eslint-disable-next-line no-unused-vars
const responseTransform = (destinationResponse, _dest) => {
  const message = `[Braze Response Transform] Request for ${DESTINATION} Processed Successfully`;
  const { response, status } = destinationResponse;
  // if the responsee from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new ErrorBuilder()
      .setStatus(status)
      .setMessage(
        `[Braze Response Transfom] Request failed for ${DESTINATION} with status: ${status}`
      )
      .setDestinationResponse(destinationResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(status)
      })
      .build();
  }
  // application level errors
  if (!!response && response.errors && response.errors.length > 0) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(
        `[Braze Response Transfom] Request failed for ${DESTINATION} with status: ${status}`
      )
      .setDestinationResponse(destinationResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
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

module.exports = { responseTransform };
