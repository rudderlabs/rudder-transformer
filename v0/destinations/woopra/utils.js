const { set } = require("lodash");
const {
  getBrowserInfo,
  getFieldValueFromMessage,
  getDestinationExternalID
} = require("../../util");
const { commomGenericFields } = require("./config");

/**
 * @param {Object} attributes
 * @param {*} payload
 * @param {List} prefix the prefix to be added
 * @param {Boolean} genericFields fields for which data is already added
 * adds the prefix to the fields name inside the attributes object
 * and updates the payload
 *
 */
const customFieldsPayloadMapping = (
  attributes,
  payload,
  prefix,
  genericFields
) => {
  Object.keys(attributes).forEach(v => {
    if (!genericFields.includes(v)) {
      set(payload, `${prefix}_${v}`, attributes[v]);
    }
  });
};

/**
 * @param {*} message
 * @returns the value for cookie Field
 */
const getCookie = message => {
  const woopraId = getDestinationExternalID(message, "woopraId");
  if (woopraId) {
    return woopraId;
  }
  return message.anonymousId;
};

/**
 * @param {*} object
 * concatenates only values of the object
 * @returns the concatenated string
 */
const getBrowserValue = browser => {
  if (browser?.name && browser?.version) {
    return `${browser.name}${browser.version}`;
  }
  return null;
};

const getEvent = message => {
  if (message?.context?.page?.category) {
    if (message?.name) {
      return `Loaded ${message.coontext.page.category} ${message.name} page`;
    }
    return `Loaded ${message.coontext.page.category}page`;
  }
  return `Loaded a page`;
};

/**
 * It adds the field (cookie,app and browser) requiring some manipulation to the payload
 * and also the custom fields provided
 * @param {*} message
 * @param {*} payload
 * @param {List} prefix=ce for properties and cv for traits or both as list
 */
const refinePayload = (message, payload, specificGenericFields) => {
  const browser = getBrowserValue(getBrowserInfo(message.context?.userAgent));
  if (browser) {
    set(payload, "browser", browser);
  }
  const cookie = getCookie(message);
  set(payload, "cookie", cookie);
  const traits = getFieldValueFromMessage(message, "traits");

  // For User Properties
  if (traits) {
    customFieldsPayloadMapping(traits, payload, "cv", commomGenericFields);
  }

  // For event Properties
  const { properties } = message;
  if (properties) {
    customFieldsPayloadMapping(
      properties,
      payload,
      "ce",
      specificGenericFields
    );
  }
};
module.exports = { refinePayload, getEvent };
