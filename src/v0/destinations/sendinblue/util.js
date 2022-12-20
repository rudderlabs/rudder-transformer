const {
  DESTINATION,
  EMAIL_SUFFIX,
  getContactDetailsEndpoint
} = require("./config");
const {
  TransformationError,
  getHashFromArray,
  getIntegrationsObj,
  isNotEmpty
} = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { httpGET } = require("../../../adapters/network");
const {
  processAxiosResponse,
  getDynamicMeta
} = require("../../../adapters/utils/networkUtils");
const { ApiError } = require("../../util/errors");

const prepareHeader = (apiKey, clientKey = null, trackerApi = false) => {
  if (trackerApi) {
    return {
      "Content-Type": "application/json",
      "ma-key": clientKey
    };
  }
  return {
    "Content-Type": "application/json",
    "api-key": apiKey
  };
};

const validateEmail = email => {
  const regex = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;
  return !!regex.test(email);
};

const validatePhoneWithCountryCode = phone => {
  const regex = /^\+(?:[\d{] ?){6,14}\d$/;
  return !!regex.test(phone);
};

const checkIfEmailOrPhoneExists = (email, phone) => {
  if (!email && !phone) {
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

const validateEmailAndPhone = (email, phone = null) => {
  if (email && !validateEmail(email)) {
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

  if (phone && !validatePhoneWithCountryCode(phone)) {
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

/**
 * Sendinblue is appending `@mailin-sms.com` to phone number and setting it in a email field if, only phone is passed while creating a contact
 * @param {*} phone +919315446189
 * @returns +919315446189@mailin-sms.com
 */
const prepareEmailFromPhone = phone => {
  return `${phone}${EMAIL_SUFFIX}`;
};

const checkIfContactExists = async (identifier, apiKey) => {
  const endpoint = getContactDetailsEndpoint(identifier);
  const requestOptions = {
    headers: prepareHeader(apiKey)
  };
  const contactDetailsResponse = await httpGET(endpoint, requestOptions);

  const processedContactDetailsResponse = processAxiosResponse(
    contactDetailsResponse
  );
  if (
    processedContactDetailsResponse.status === 200 &&
    processedContactDetailsResponse?.response?.id
  ) {
    return true;
  }

  if (processedContactDetailsResponse.status !== 404) {
    throw new ApiError(
      `Failed to fetch contact details due to "${JSON.stringify(
        processedContactDetailsResponse.response
      )}"`,
      processedContactDetailsResponse.status,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(processedContactDetailsResponse.status)
      },
      processedContactDetailsResponse.response,
      undefined,
      DESTINATION
    );
  }

  // for status code 404 (contact not found)
  return false;
};

/**
 * Function to remove empty key ("") from payload
 * @param {*} payload {"key1":"a","":{"id":1}}
 * @returns // {"key1":"a"}
 */
const removeEmptyKey = payload => {
  const rawPayload = payload;
  const key = "";
  if (Object.prototype.hasOwnProperty.call(rawPayload, key)) {
    delete rawPayload[""];
  }
  return rawPayload;
};

const refineUserTraits = (userTraits, attributeMap) => {
  const refinedTraits = userTraits;
  Object.keys(userTraits).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(attributeMap, key)) {
      delete refinedTraits[key];
    }
  });
  return refinedTraits;
};

const prepareUserTraits = (traits, contactAttributeMapping) => {
  // convert destination.Config.contactAttributeMapping to hashMap
  const attributeMap = getHashFromArray(
    contactAttributeMapping,
    "from",
    "to",
    false
  );

  const userTraits = traits;
  Object.keys(attributeMap).forEach(key => {
    const traitValue = traits[key];
    if (traitValue) {
      userTraits[attributeMap[key]] = traitValue;
    }
  });

  return refineUserTraits(userTraits, attributeMap);
};

const prepareTrackEventData = (message, payload) => {
  const { messageId, data } = payload;
  if (isNotEmpty(data)) {
    const integrationsObj = getIntegrationsObj(message, "sendinblue");
    const idKey = integrationsObj?.propertiesIdKey;
    const id = data[idKey] || messageId;
    return { id, data };
  }
  return {};
};

module.exports = {
  checkIfEmailOrPhoneExists,
  prepareEmailFromPhone,
  validateEmail,
  validatePhoneWithCountryCode,
  validateEmailAndPhone,
  checkIfContactExists,
  prepareHeader,
  removeEmptyKey,
  prepareUserTraits,
  prepareTrackEventData
};
