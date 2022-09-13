const {
  getDynamicMeta,
  trimResponse
} = require("../../../adapters/utils/networkUtils");
const { isDefinedAndNotNull, ErrorBuilder } = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { DESTINATION } = require("./config");
const { isEmpty } = require("../../util/index");

const responseTransform = destResponse => {
  let respBody;
  try {
    respBody = JSON.parse(destResponse.Body);
  } catch (err) {
    respBody = isEmpty(!destResponse.Body) ? destResponse.Body : null;
  }
  const { data } = trimResponse(respBody);
  if (
    respBody &&
    respBody.success &&
    isDefinedAndNotNull(data.rejected) &&
    data.rejected > 0
  ) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(`${data.rejected} requests rejected`)
      .setDestinationResponse({ ...respBody, success: false })
      .setStatTags({
        destType: DESTINATION,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        meta: getDynamicMeta(destResponse.Status || 400)
      })
      .build();
  } else if (respBody && !respBody.success) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Request failed for Ometria")
      .setDestinationResponse({ ...respBody, success: false })
      .setStatTags({
        destType: DESTINATION,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        meta: getDynamicMeta(destResponse.Status || 400)
      })
      .build();
  }
  const status = destResponse.Status;
  const message = respBody.message || "Event delivered successfuly";
  const destinationResponse = { ...respBody, status: destResponse.Status };
  const { apiLimit } = respBody;
  return {
    status,
    message,
    destinationResponse,
    apiLimit
  };
};

module.exports = { responseTransform };
