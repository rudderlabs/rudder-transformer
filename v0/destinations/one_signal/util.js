const { getIntegrationsObj, getFieldValueFromMessage } = require("../../util");

/**
 * This funnction is used to populate the tags using the traits
 * @param {} message
 */
const populateTags = message => {
  const tags = {};
  const traits = getFieldValueFromMessage(message, "traits");
  const traitsKey = Object.keys(traits);
  traitsKey.forEach(key => {
    if (typeof traits[key] === "string") {
      tags[key] = traits[key];
    }
  });
  if (message.anonymousId) {
    tags.anonymousId = message.anonymousId;
  }
  return tags;
};

/**
 * This function is used to populate device_type required for creating a device
 * @param {*} message
 * @param {*} payload
 */
const populateDeviceType = (message, payload) => {
  const integrationsObj = getIntegrationsObj(message, "one_signal");
  const devicePayload = payload;
  if (integrationsObj && integrationsObj.deviceType) {
    devicePayload.device_type = integrationsObj.deviceType;
    devicePayload.identifier = integrationsObj.identifier;
  }
};

module.exports = { populateDeviceType, populateTags };
