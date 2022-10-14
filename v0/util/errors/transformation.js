const { TRANSFORMER_METRIC } = require("../constant");
const { RudderErrorBase } = require("./base");

class TransformationError extends RudderErrorBase {
  constructor(message, statusCode = 400, statTags, destination) {
    const defScope = TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE;
    const defMeta =
      TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.CLIENT_ERROR;

    const finalStatTags = RudderErrorBase.getStatTags(statTags, {
      meta: defMeta,
      scope: defScope,
      destType: destination
    });

    super(message, statusCode, finalStatTags);
  }
}

module.exports = TransformationError;
