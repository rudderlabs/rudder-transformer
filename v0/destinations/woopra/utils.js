const { set } = require("lodash");
const {
  getBrowserInfo,
  getFieldValueFromMessage,
  getDestinationExternalID
} = require("../../util");
const { commomGenericFields } = require("./config");

/**
 * @param {Object} attributes
 * @param {List} prefix the prefix to be added
 * @param {Boolean} genericFields fields for which data is already added
 * adds the prefix to the fields name inside the attributes object
 * and updates the local payload
 * @return generated payload
 */
const customFieldsPayloadMapping = (attributes, prefix, genericFields) => {
  const payload = {};
  Object.keys(attributes).forEach(v => {
    if (!genericFields.includes(v)) {
      set(payload, `${prefix}_${v}`, attributes[v]);
    }
  });
  return payload;
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
  if (message?.name) {
    return `Loaded ${message.name} page`;
  }
  return `Loaded a page`;
};

/**
 * It adds the field (cookie,app and browser) requiring some manipulation to the local payload
 * and also the custom fields provided
 * @param {*} message
 * @param {List} prefix=ce for properties and cv for traits or both as list
 * @return generated payload
 */
const refinePayload = (message, specificGenericFields) => {
  const browser = getBrowserValue(getBrowserInfo(message.context?.userAgent));
  let payload = {};
  if (browser) {
    set(payload, "browser", browser);
  }
  const cookie = getCookie(message);
  set(payload, "cookie", cookie);
  const traits = getFieldValueFromMessage(message, "traits");
  let customTraitsPayload;
  // For User Properties
  if (traits) {
    customTraitsPayload = customFieldsPayloadMapping(
      traits,
      "cv",
      commomGenericFields
    );
  }
  payload = { ...payload, ...customTraitsPayload };
  // For event Properties
  const { properties } = message;
  let customPropertiesPayload;
  if (properties) {
    customPropertiesPayload = customFieldsPayloadMapping(
      properties,
      "ce",
      specificGenericFields
    );
  }
  payload = { ...payload, ...customPropertiesPayload };
  return payload;
};
module.exports = { refinePayload, getEvent };
