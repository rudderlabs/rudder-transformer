const { getDynamicMeta } = require("../../../adapters/utils/networkUtils");
const { isEmpty } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { DESTINATION } = require("./config");
const ErrorBuilder = require("../../util/error");

const responseTransform = destResponse => {
  let respBody;
  try {
    respBody = JSON.parse(destResponse.responseBody);
  } catch (err) {
    respBody = !isEmpty(destResponse.responseBody)
      ? destResponse.responseBody
      : "";
  }
  if (respBody && respBody.errors && respBody.errors.length > 0) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Braze Request Failed")
      .setDestinationResponse({
        response: respBody,
        status: destResponse.status
      })
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        meta: getDynamicMeta(destResponse.status || 400)
      })
      .build();
  }
  const { status } = destResponse;
  const message = "Event delivered successfuly";
  const destinationResponse = {
    response: respBody,
    status: destResponse.Status
  };
  const { apiLimit } = respBody;
  return {
    status,
    message,
    destinationResponse,
    apiLimit
  };
};

module.exports = { responseTransform };
