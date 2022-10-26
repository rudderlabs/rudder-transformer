const ErrorBuilder = require("../../util/error");
const { TRANSFORMER_METRIC } = require("../../util/constant");

const statTags = destination => ({
  destType: destination,
  stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
  scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE
});

const INVALID_NAME_ERROR = (eventName, pattern) =>
  new ErrorBuilder()
    .setMessage(
      `Event name ${eventName} is not a valid FB APP event name.It must match the regex ${pattern}`
    )
    .setStatus(400)
    .setStatTags({
      ...statTags,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
    })
    .build();

const UNSUPPORTED_TYPE_ERROR = () =>
  new ErrorBuilder()
    .setMessage("message type not supported")
    .setStatus(400)
    .setStatTags({
      ...statTags,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
    })
    .build();

const BAD_PARAM_ERROR = message =>
  new ErrorBuilder()
    .setMessage(message)
    .setStatus(400)
    .setStatTags({
      ...statTags,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
    })
    .build();

const RESPONSE_TRANSFORMATION_ERROR = statusAndStats =>
  new ErrorBuilder()
    .setStatus(statusAndStats.status)
    .setDestinationResponse({ ...response, status: destResponse.status })
    .setMessage(
      `Facebook App Event: Failed with ${error.message} during response transformation`
    )
    .setStatTags(statusAndStats.statTags)
    .build();

module.exports = {
  INVALID_NAME_ERROR,
  UNSUPPORTED_TYPE_ERROR,
  BAD_PARAM_ERROR,
  RESPONSE_TRANSFORMATION_ERROR
};
