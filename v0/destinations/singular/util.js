const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  SINGULAR_SESSION_ANDROID_EXCLUSION,
  SINGULAR_SESSION_IOS_EXCLUSION,
  SINGULAR_EVENT_ANDROID_EXCLUSION,
  SINGULAR_EVENT_IOS_EXCLUSION,
  BASE_URL
} = require("./config");
const {
  constructPayload,
  defaultRequestConfig,
  defaultGetRequestConfig,
  removeUndefinedAndNullAndEmptyValues,
  CustomError,
  extractCustomFields,
  getValueFromMessage
} = require("../../util");

/*
  All the fields listed inside properties which are not directly mapped, will be sent to 'e' as custom event attributes
*/
const extractExtraFields = (message, EXCLUSION_FIELDS) => {
  const eventAttributes = {};
  extractCustomFields(
    message,
    eventAttributes,
    ["properties"],
    EXCLUSION_FIELDS
  );
  return eventAttributes;
};

/**
 * This function is used to generate the array of individual response for each of the products.
 * @param {*} products contains different products
 * @param {*} payload contains the common payload for each revenue event
 * @param {*} Config destination config
 * @param {*} eventAttributes custom attributes
 * @returns list of revenue event responses
 */
const generateRevenuePayload = (products, payload, Config, eventAttributes) => {
  const responseArray = [];
  products.forEach(product => {
    const productDetails = constructPayload(
      product,
      MAPPING_CONFIG[CONFIG_CATEGORIES.PRODUCT_PROPERTY.name]
    );
    let finalpayload = { ...payload, ...productDetails };
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}/evt`;
    finalpayload = removeUndefinedAndNullAndEmptyValues(finalpayload);
    response.params = { ...finalpayload, a: Config.apiKey, e: eventAttributes };
    response.method = defaultGetRequestConfig.requestMethod;
    responseArray.push(response);
  });
  return responseArray;
};

const exclusionList = {
  android_session_exclusion_list: SINGULAR_SESSION_ANDROID_EXCLUSION,
  ios_session_exclusion_list: SINGULAR_SESSION_IOS_EXCLUSION,
  android_event_exclusion_list: SINGULAR_EVENT_ANDROID_EXCLUSION,
  ios_event_exclusion_list: SINGULAR_EVENT_IOS_EXCLUSION
};

const platformWisePayloadGenerator = (message, isSessionEvent) => {
  let payload;
  let eventAttributes;
  let typeOfEvent;
  const platform = getValueFromMessage(message, "context.os.name");
  if (!platform) {
    throw new CustomError("[Singular] :: Platform name is missing", 400);
  }
  if (isSessionEvent) {
    typeOfEvent = "SESSION";
  } else {
    typeOfEvent = "EVENT";
  }
  if (platform.toLowerCase() === "android") {
    payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES[`${typeOfEvent}_ANDROID`].name]
    );
    if (!payload) {
      // fail-safety for developer error
      throw new CustomError(
        `Failed to Create Android ${typeOfEvent} Payload`,
        400
      );
    }
    eventAttributes = extractExtraFields(
      message,
      exclusionList[
        `${platform.toLowerCase()}_${typeOfEvent.toLowerCase()}_exclusion_list`
      ]
    );
  } else if (platform.toLowerCase() === "ios") {
    payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES[`${typeOfEvent}_IOS`].name]
    );
    if (!payload) {
      // fail-safety for developer error
      throw new CustomError(`Failed to Create iOS ${typeOfEvent} Payload`, 400);
    }
    eventAttributes = extractExtraFields(
      message,
      exclusionList[
        `${platform.toLowerCase()}_${typeOfEvent.toLowerCase()}_exclusion_list`
      ]
    );

    /*
      if att_authorization_status is true then dnt will be false,
      else by default dnt value is true
    */
    payload.dnt = !payload.att_authorization_status;
  } else {
    throw new CustomError("[Singular] :: Invalid Platform", 400);
  }
  return { payload, eventAttributes };
};

module.exports = { generateRevenuePayload, platformWisePayloadGenerator };
