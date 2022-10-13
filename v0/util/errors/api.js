const { TRANSFORMER_METRIC } = require("../constant");
const { RudderErrorBase } = require("./base");

class ApiError extends RudderErrorBase {
  constructor(
    message,
    statusCode = 400,
    statTags,
    destResponse,
    authErrCategory = "",
    destination
  ) {
    const defScope = TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE;
    const defMeta = TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.UNHANDLED;
    const finalStatTags = RudderErrorBase.getStatTags(statTags, {
      defMeta,
      defScope,
      destination
    });

    super(message, statusCode, finalStatTags, destResponse, authErrCategory);
  }
}

module.exports = ApiError;
