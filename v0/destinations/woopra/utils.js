const { set } = require("lodash");
const {
  getBrowserInfo,
  getFieldValueFromMessage,
  getDestinationExternalID
} = require("../../util");
const { genericFields } = require("./config");

/**
 * @param {Object} attributes
 * @param {*} payload
 * @param {List} prefix the prefix tobe added
 * @param {Boolean} identifyFlag
 * adds the prefix to the fields name inside the attributes object
 * and updates the payload
 * identifyFlag helps us to decide whether to check genericFields for key
 * as there are some common attributes between properties and traits like title.
 * e.g. title is generated from config file and so it is included in genericFields as well
 * but for properties.title we still want to map
 * but are not able to until we are told not to check genericFields.
 * genericFields contains traits fields mostly and not of Properties
 */
const customFieldsPayloadMapping = (
  attributes,
  payload,
  prefix,
  identifyFlag
) => {
  Object.keys(attributes).forEach(v => {
    if (!identifyFlag || !genericFields.includes(v)) {
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

/**
 * It adds the field (cookie,app and browser) requiring some manipulation to the payload
 * and also the custom fields provided
 * @param {*} message
 * @param {*} payload
 * @param {List} prefix=ce for properties and cv for traits or both as list
 */
const refinePayload = (message, payload, prefix) => {
  const browser = getBrowserValue(getBrowserInfo(message.context?.userAgent));
  if (browser) {
    set(payload, "browser", browser);
  }
  const cookie = getCookie(message);
  set(payload, "cookie", cookie);
  prefix.forEach(preFix => {
    if (preFix === "cv") {
      const traits = getFieldValueFromMessage(message, "traits");
      if (traits) {
        const identifyFlag = true;
        customFieldsPayloadMapping(traits, payload, preFix, identifyFlag);
      }
    } else {
      const { properties } = message;
      if (properties) {
        const identifyFlag = false;
        customFieldsPayloadMapping(properties, payload, preFix, identifyFlag);
      }
    }
  });
};
module.exports = { refinePayload };
