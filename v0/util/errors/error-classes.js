// eslint-disable-next-line max-classes-per-file
const _ = require("lodash");
const { TRANSFORMER_METRIC } = require("../constant");
const { RudderErrorBase } = require("./base");

class TransformationError extends RudderErrorBase {
  constructor(message, statusCode = 400, statTags, destination) {
    const defScope = TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE;
    const defMeta =
      TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.CLIENT_ERROR;

    let finalStatTags = statTags;
    if (!finalStatTags || Array.isArray(finalStatTags)) {
      finalStatTags = {
        scope: defScope,
        meta: defMeta
      };
    }

    const tagNames = Object.keys(finalStatTags);
    if (!tagNames.includes("scope")) {
      finalStatTags = {
        ...finalStatTags,
        scope: defScope
      };
    }

    if (!tagNames.includes("meta")) {
      finalStatTags = {
        ...finalStatTags,
        meta: defMeta
      };
    }

    finalStatTags = { ...finalStatTags, destType: destination };

    super(message, statusCode, finalStatTags);
  }
}

class ApiError extends RudderErrorBase {
  constructor(
    message,
    statusCode = 400,
    statTags,
    destination,
    destResponse,
    authErrCategory
  ) {
    const defScope = TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE;
    const defMeta = TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.UNHANDLED;
    let finalStatTags = statTags;
    if (!finalStatTags || Array.isArray(finalStatTags)) {
      finalStatTags = {
        scope: defScope,
        meta: defMeta
      };
    }

    const tagNames = Object.keys(finalStatTags);
    if (!tagNames.includes("scope")) {
      finalStatTags = {
        ...finalStatTags,
        scope: defScope
      };
    }

    if (!tagNames.includes("meta")) {
      finalStatTags = {
        ...finalStatTags,
        meta: defMeta
      };
    }

    finalStatTags = { ...finalStatTags };

    super(message, statusCode, finalStatTags, destination, authErrCategory);
  }
}
module.exports = { TransformationError, ApiError };
