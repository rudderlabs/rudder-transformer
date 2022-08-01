const get = require("get-value");
const {
  getDestinationExternalID,
  getIntegrationsObj,
  getFieldValueFromMessage
} = require("../../util");

/**
 * This funnction is used to populate the tags using the traits
 * @param {} message
 */
const populateTags = message => {
  const tags = {};
  const traits = getFieldValueFromMessage(message, "traits");
  const traitsKey = Object.keys(traits);
  traitsKey.forEach(key => {
    tags[key] = traits[key];
  });
  if (message.anonymousId) {
    tags.anonymousId = message.anonymousId;
  }
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

/**
 * This function is used to check, if playerId is present in the input payload,
 * if playerId is present in the externalId, it is being extracted and returned.
 * @param {*} message
 * @returns
 */
const checkForPlayerId = message => {
  // Data Structure expected:
  // context.externalId: [ {type: playerId, id: __id}]
  const externalId = get(message, "context.externalId");
  let playerId;
  if (externalId && Array.isArray(externalId)) {
    externalId.forEach(id => {
      if (id.type === "playerId") {
        playerId = getDestinationExternalID(message, id.type);
      }
    });
  }
  return playerId;
};

module.exports = { populateDeviceType, checkForPlayerId, populateTags };
