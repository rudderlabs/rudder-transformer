const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  getIntegrationsObj,
  getFieldValueFromMessage,
  getBrowserInfo,
  constructPayload,
  removeUndefinedAndNullValues,
} = require('../../util');
const { ConfigCategory, mappingConfig, deviceTypesV2Enums } = require('./config');
const { isDefinedAndNotNullAndNotEmpty } = require('../../util');
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
  if (integrationsObj?.deviceType && integrationsObj?.identifier) {
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

/**
 * This function is used to populate device type required for creating a subscription
 * it checks from integrations object and fall back to message.channel and fif nothing is given it return a n empty object
 * @param {*} message
 * @param {*} payload
 * returns Object
 */
const getDeviceDetails = (message) => {
  const integrationsObj = getIntegrationsObj(message, 'one_signal');
  const devicePayload = {};
  if (integrationsObj?.deviceType && integrationsObj?.identifier) {
    devicePayload.type = integrationsObj.deviceType;
    devicePayload.token = integrationsObj.token || integrationsObj.identifier;
  }
  // Mapping device type when it is not present in the integrationsObject
  if (!devicePayload.type) {
    // if channel is mobile, checking for type from `context.device.type`
    if (message.channel === 'mobile') {
      devicePayload.type = message.context?.device?.type;
      devicePayload.token = message.context?.device?.token
        ? message.context.device.token
        : message.context?.device?.id;
    }
    // Parsing the UA to get the browser info to map the device_type
    if (message.channel === 'web' && message.context?.userAgent) {
      const browser = getBrowserInfo(message.context.userAgent);
      devicePayload.type = `${browser.name}Push`; // For chrome it would be like ChromePush
      devicePayload.token = message.anonymousId;
    }
  }
  if (!deviceTypesV2Enums.includes(devicePayload.type)) {
    return {}; // No device related information available
  }
  return devicePayload;
};
/**
 * This function maps and returns the product purchases details built from input message.properties.products
 * @param {*} message
 * @returns
 */
const getProductPurchasesDetails = (message) => {
  const { properties } = message;
  const purchases = properties?.products;
  if (purchases && Array.isArray(purchases)) {
    return purchases.map((product) => ({
      sku: product.sku,
      iso: product.iso,
      count: product.quantity,
      amount: product.amount,
    }));
  }
  const purchaseObject = removeUndefinedAndNullValues({
    sku: properties?.sku,
    iso: properties?.iso,
    count: properties?.quantity,
    amount: properties?.amount,
  });
  return Object.keys(purchaseObject).length > 0 ? [purchaseObject] : [];
};

/**
 * This function generates the subscriptions Payload for the given deviceType and token
 * https://documentation.onesignal.com/reference/create-user#:~:text=string-,subscriptions,-array%20of%20objects
 * @param {*} message
 * @param {*} deviceType
 * @param {*} token
 * @returns
 */
const constructSubscription = (message, subscriptionType, token, subscriptionField) => {
  const deviceModel = message.context?.device?.model;
  const deviceOs = message.context?.os?.version;
  let deviceSubscriptionPayload = {
    type: subscriptionType,
    token,
    device_model: deviceModel,
    device_os: deviceOs,
  };
  // Following mapping is used to do paticular and specific property mapping for subscription
  const traits = message.context?.traits || message.traits;
  if (traits?.subscriptions?.[subscriptionField]) {
    deviceSubscriptionPayload = {
      ...deviceSubscriptionPayload,
      ...constructPayload(
        traits.subscriptions[subscriptionField],
        mappingConfig[ConfigCategory.SUBSCRIPTION.name],
      ),
    };
  }
  return deviceSubscriptionPayload;
};

/**
 * This function constructs subscriptions list from message and returns subscriptions list
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const getSubscriptions = (message, Config) => {
  const { emailDeviceType, smsDeviceType } = Config;
  // Creating response for creation of new device or updation of an existing device
  const subscriptions = [];
  const deviceTypeSubscription = getDeviceDetails(message);
  if (deviceTypeSubscription.token) {
    subscriptions.push(
      constructSubscription(message, deviceTypeSubscription.type, deviceTypeSubscription.token),
    );
  }

  // Creating a device with email as an identifier
  if (emailDeviceType) {
    const token = getFieldValueFromMessage(message, 'email');
    if (isDefinedAndNotNullAndNotEmpty(token)) {
      subscriptions.push(constructSubscription(message, 'Email', token, 'email'));
    }
  }
  // Creating a device with phone as an identifier
  if (smsDeviceType) {
    const token = getFieldValueFromMessage(message, 'phone');
    if (isDefinedAndNotNullAndNotEmpty(token)) {
      subscriptions.push(constructSubscription(message, 'SMS', token, 'phone'));
    }
  }
  return subscriptions.length > 0 ? subscriptions : undefined;
};

/**
 * This function fetched all the aliases to be passed to one signal from integrations object
 * @param {*} message
 * @returns object
 */
const getOneSignalAliases = (message) => {
  const integrationsObj = getIntegrationsObj(message, 'one_signal');
  if (integrationsObj?.aliases) {
    return integrationsObj.aliases;
  }
  return {};
};
module.exports = {
  populateDeviceType,
  populateTags,
  getProductPurchasesDetails,
  getSubscriptions,
  getOneSignalAliases,
};
