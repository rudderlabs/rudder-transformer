/* eslint-disable no-nested-ternary */
// We want to send the following kind of device properties from web platform
// which is not readily available, so have to parse the user-agent
// using similar  ua parsing logic used by AM native web sdk
// "platform": "Web",
// "os_name": "Chrome",
// "os_version": "85",
// "device_model": "Mac"
// Note: for http source still the direct mapping from payload sourceKeys is used to
// populate these dest keys
const get = require('get-value');
const uaParser = require('@amplitude/ua-parser-js');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const logger = require('../../../logger');
const { isDefinedAndNotNull } = require('../../util');

const getInfoFromUA = (path, payload, defaultVal) => {
  const ua = get(payload, 'context.userAgent');
  const devInfo = ua ? uaParser(ua) : {};
  return get(devInfo, path) || defaultVal;
};

const getOSName = (payload, sourceKey) => {
  const payloadVal = get(payload, sourceKey);
  if (payload.channel && payload.channel.toLowerCase() === 'web') {
    return getInfoFromUA('browser.name', payload, payloadVal);
  }
  return payloadVal;
};

const getOSVersion = (payload, sourceKey) => {
  const payloadVal = get(payload, sourceKey);

  if (payload.channel && payload.channel.toLowerCase() === 'web') {
    return getInfoFromUA('browser.version', payload, payloadVal);
  }
  return payloadVal;
};

const getDeviceModel = (payload, sourceKey) => {
  const payloadVal = get(payload, sourceKey);

  if (payload.channel && payload.channel.toLowerCase() === 'web') {
    return getInfoFromUA('os.name', payload, payloadVal);
  }
  return payloadVal;
};

const getDeviceManufacturer = (payload, sourceKey) => {
  const payloadVal = get(payload, sourceKey);

  if (payload.channel && payload.channel.toLowerCase() === 'web') {
    return getInfoFromUA('device.vendor', payload, payloadVal);
  }
  return payloadVal;
};

const getPlatform = (payload, sourceKey) => {
  const payloadVal = get(payload, sourceKey);
  return payload.channel
    ? payload.channel.toLowerCase() === 'web'
      ? 'Web'
      : payloadVal
    : payloadVal;
};

const getBrand = (payload, sourceKey, Config) => {
  if (Config.mapDeviceBrand) {
    const payloadVal = get(payload, sourceKey);
    return payloadVal;
  }
  return undefined;
};

const getEventId = (payload, sourceKey) => {
  const eventId = get(payload, sourceKey);

  if (isDefinedAndNotNull(eventId)) {
    if (typeof eventId === 'string') {
      logger.info(`event_id should be integer only`);
    } else return eventId;
  }
  return undefined;
};

/**
 * generates the unsetObject and returns it 
 * @param {*} message 
 * @returns 
 * 
 * Example message = {
    integrations: {
      Amplitude: { fieldsToUnset: ['Unset1', 'Unset2'] },
      All: true,
    },
  };
  return unsetObj = {
        "Unset1": "-",
        "Unset2": "-"
      }
  AM docs: https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/#keys-for-the-event-argument:~:text=exceed%2040%20layers.-,user_properties,-Optional.%20Object.%20A
 */
const getUnsetObj = (message) => {
  const fieldsToUnset = get(message, 'integrations.Amplitude.fieldsToUnset');
  let unsetObject;
  if (Array.isArray(fieldsToUnset)) {
    unsetObject = Object.fromEntries(fieldsToUnset.map((field) => [field, '-']));
  }

  return unsetObject;
};

/**
 * Check for evType as in some cases, like when the page name is absent,
 * either the template depends only on the event.name or there is no template provided by user
 * @param {*} evType
 */
const validateEventType = (evType) => {
  if (!isDefinedAndNotNull(evType) || (typeof evType === 'string' && evType.length === 0)) {
    throw new InstrumentationError(
      'Event type is missing. Please send it under `event.type`. For page/screen events, send it under `event.name`',
    );
  }
};

const userPropertiesPostProcess = (rawPayload) => {
  const operationList = [
    '$setOnce',
    '$add',
    '$unset',
    '$append',
    '$prepend',
    '$preInsert',
    '$postInsert',
    '$remove',
  ];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { user_properties } = rawPayload;
  const userPropertiesKeys = Object.keys(user_properties).filter(
    (key) => !operationList.includes(key),
  );
  const duplicatekeys = new Set();
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key of userPropertiesKeys) {
    // check if any of the keys are present in the user_properties $setOnce, $add, $unset, $append, $prepend, $preInsert, $postInsert, $remove keys as well as root level

    if (
      operationList.some(
        (operation) => user_properties[operation] && user_properties[operation][key],
      )
    ) {
      duplicatekeys.add(key);
    }
  }
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key of duplicatekeys) {
    delete user_properties[key];
  }

  // Moving root level properties that doesn't belong to any operation under $set
  const setProps = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(user_properties)) {
    if (!operationList.includes(key)) {
      setProps[key] = value;
      delete user_properties[key];
    }
  }

  if (Object.keys(setProps).length > 0) {
    user_properties.$set = setProps;
  }

  // eslint-disable-next-line no-param-reassign
  rawPayload.user_properties = user_properties;
  return rawPayload;
};

module.exports = {
  getOSName,
  getOSVersion,
  getDeviceModel,
  getDeviceManufacturer,
  getPlatform,
  getBrand,
  getEventId,
  getUnsetObj,
  validateEventType,
  userPropertiesPostProcess,
};
