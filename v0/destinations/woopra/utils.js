const { set } = require("lodash");
const {
  getBrowserInfo,
  getFieldValueFromMessage,
  getDestinationExternalID
} = require("../../util");
const { genericFields } = require("./config");

/**
 *
 * @param {*} message
 * @param {*} payload
 * @param {List} prefix
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
    return browser.name + browser.version;
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
  let app;
  if (message.context?.app?.name && message.context?.app?.build) {
    app = message.context?.app?.name + message.context?.app?.build;
    set(payload, "app", app);
  }
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
