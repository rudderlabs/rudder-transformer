const { getIntegrationsObj, getFieldValueFromMessage, getBrowserInfo } = require('../../util');
const { InstrumentationError } = require('../../util/errorTypes');

// For mapping device_type value
const deviceTypeMapping = {
  android: 1,
  ios: 0,
  chrome: 5,
  safari: 7,
  firefox: 8,
};

// This function is used to check for the valid device_type value. device_type value should be integer
// and can be from [0 to 14] only.
const validateDeviceType = (deviceType) =>
  !(Number.isNaN(deviceType) || deviceType < 0 || deviceType > 14);

/**
 * This function is used to populate the tags using the traits
 * @param {} message
 */
const populateTags = (message) => {
  const tags = {};
  const traits = getFieldValueFromMessage(message, 'traits');
  if (traits) {
    const traitsKey = Object.keys(traits);
    traitsKey.forEach((key) => {
      if (typeof traits[key] === 'string') {
        tags[key] = traits[key];
      }
    });
    if (message.anonymousId) {
      tags.anonymousId = message.anonymousId;
    }
    return tags;
  }
  return undefined;
};

/**
 * This function is used to populate device_type required for creating a device
 * @param {*} message
 * @param {*} payload
 */
const populateDeviceType = (message, payload) => {
  const integrationsObj = getIntegrationsObj(message, 'one_signal');
  const devicePayload = payload;
  if (integrationsObj && integrationsObj.deviceType && integrationsObj.identifier) {
    devicePayload.device_type = parseInt(integrationsObj.deviceType, 10);
    devicePayload.identifier = integrationsObj.identifier;
    if (!validateDeviceType(devicePayload.device_type)) {
      throw new InstrumentationError(
        `device_type ${devicePayload.device_type} is not a valid device_type`,
      );
    }
  }
  // Mapping device_type when it is not present in the integrationsObject
  if (!devicePayload.device_type) {
    // if channel is mobile, checking for device_type from `context.device.type`
    if (message.channel === 'mobile') {
      devicePayload.device_type = deviceTypeMapping[message.context?.device?.type?.toLowerCase()];
      devicePayload.identifier = message.context?.device?.token
        ? message.context?.device?.token
        : message.context?.device?.id;
    }
    // Parsing the UA to get the browser info to map the device_type
    if (message.channel === 'web' && message.context?.userAgent) {
      const browser = getBrowserInfo(message.context.userAgent);
      devicePayload.device_type = deviceTypeMapping[browser.name?.toLowerCase()];
      devicePayload.identifier = message.anonymousId;
    }
  }
};

module.exports = { populateDeviceType, populateTags };
