const { isEmpty } = require("lodash");
const {
  RETRYABLE_ERROR_CODES,
  THROTTLED_ERROR_CODES,
  errorDetailsMap
} = require("./marketingApiErrorCodes");
const { getDynamicMeta } = require("../../adapters/utils/networkUtils");
const { TRANSFORMER_METRIC } = require("../util/constant");

const getErrorDetailsFromErrorMap = error => {
  const { code, error_subcode: subCode } = error;
  let errDetails;
  if (!isEmpty(errorDetailsMap[code]) && subCode) {
    errDetails = errorDetailsMap[code][subCode];
  }
  return errDetails;
};

const defaultStatTags = destination => ({
  destType: destination,
  stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
  scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
  meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
});

const getStatusAndStats = (error, destination) => {
  const errorDetail = getErrorDetailsFromErrorMap(error);
  let errorStatus = 400;
  let statTags = { ...defaultStatTags(destination) };
  if (!isEmpty(errorDetail)) {
    errorStatus = errorDetail.status;
    statTags = {
      ...statTags,
      ...errorDetail.statTags
    };
  }
  if (RETRYABLE_ERROR_CODES.includes(error.code)) {
    errorStatus = 500;
    statTags = {
      ...statTags,
      meta: getDynamicMeta(errorStatus)
    };
  }

  if (THROTTLED_ERROR_CODES.includes(error.code)) {
    errorStatus = 429;
    statTags = {
      ...statTags,
      meta: getDynamicMeta(errorStatus)
    };
  }

  return {
    status: errorStatus,
    statTags
  };
};

module.exports = {
  getErrorDetailsFromErrorMap,
  getStatusAndStats
};
