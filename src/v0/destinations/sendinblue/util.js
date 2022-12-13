const { DESTINATION, EMAIL_SUFFIX } = require("./config");
const { TransformationError } = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");

const validateEmail = email => {
  const regex = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;
  return !!regex.test(email);
};

const validatePhoneWithCountryCode = phone => {
  const regex = /^\+(?:[\d{] ?){6,14}\d$/;
  return !!regex.test(phone);
};

const checkIfEmailAndPhoneExists = payload => {
  if (!payload.email && !payload.phone) {
    throw new TransformationError(
      "At least one of email or phone is required",
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      },
      DESTINATION
    );
  }
};

const validateEmailAndPhone = payload => {
  if (!validateEmail(payload.email)) {
    throw new TransformationError(
      "The provided email is invalid",
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      },
      DESTINATION
    );
  }

  if (!validatePhoneWithCountryCode(payload.phone)) {
    throw new TransformationError(
      "The provided phone number is invalid",
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      },
      DESTINATION
    );
  }
};

const prepareEmailFromPhone = phone => {
  return `${phone}${EMAIL_SUFFIX}`;
};

module.exports = {
  checkIfEmailAndPhoneExists,
  validateEmailAndPhone,
  prepareEmailFromPhone,
  validateEmail,
  validatePhoneWithCountryCode
};
