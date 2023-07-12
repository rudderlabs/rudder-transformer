const get = require('get-value');
const {
  getDestinationExternalIDInfoForRetl,
  constructPayload,
  isAppleFamily,
  addExternalIdToTraits,
} = require('../../util');
const { ConfigCategory, mappingConfig } = require('./config');

const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');
const { MappedToDestinationKey } = require('../../../constants');

const getCatalogEndpoint = (category, message) => {
  const externalIdInfo = getDestinationExternalIDInfoForRetl(message, 'ITERABLE');
  return `${category.endpoint}/${externalIdInfo.objectType}/items/${externalIdInfo.destinationExternalId}`;
};

function validateMandatoryField(payload) {
  if (payload.email === undefined && payload.userId === undefined) {
    throw new InstrumentationError('userId or email is mandatory for this request');
  }
}

const getPreferUserId = (config) => {
  if (config.preferUserId !== undefined) {
    return config.preferUserId;
  }
  return true;
};

const getMergeNestedObjects = (config) => {
  if (config.mergeNestedObjects !== undefined) {
    return config.mergeNestedObjects;
  }
  return true;
};

const identifyDeviceAction = (message, config) => {
  let rawPayload = {};
  rawPayload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY_DEVICE.name]);
  rawPayload.device = constructPayload(message, mappingConfig[ConfigCategory.DEVICE.name]);
  rawPayload.preferUserId = getPreferUserId(config);
  if (isAppleFamily(message.context.device.type)) {
    rawPayload.device.platform = 'APNS';
  } else {
    rawPayload.device.platform = 'GCM';
  }
  return rawPayload;
};

const identifyBrowserAction = (message) => {
  const rawPayload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY_BROWSER.name]);
  validateMandatoryField(rawPayload);
  return rawPayload;
};

const identifyAction = (message, category, config) => {
  // If mapped to destination, Add externalId to traits
  if (get(message, MappedToDestinationKey)) {
    addExternalIdToTraits(message);
  }
  const rawPayload = constructPayload(message, mappingConfig[category.name]);
  rawPayload.preferUserId = getPreferUserId(config);
  rawPayload.mergeNestedObjects = getMergeNestedObjects(config);
  validateMandatoryField(rawPayload);
  return rawPayload;
};

const pageAction = (message, destination, category) => {
  let rawPayload = {};
  if (destination.Config.trackAllPages) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else if (
    destination.Config.trackCategorisedPages &&
    (message.properties?.category || message.category)
  ) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else if (destination.Config.trackNamedPages && (message.properties?.name || message.name)) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else {
    throw new ConfigurationError('Invalid page call');
  }
  validateMandatoryField(rawPayload);
  if (destination.Config.mapToSingleEvent) {
    rawPayload.eventName = 'Loaded a Page';
  } else {
    rawPayload.eventName += ' page';
  }
  rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
  if (rawPayload.campaignId) {
    rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
  }
  if (rawPayload.templateId) {
    rawPayload.templateId = parseInt(rawPayload.templateId, 10);
  }

  return rawPayload;
};

const screenAction = (message, destination, category) => {
  let rawPayload = {};
  if (destination.Config.trackAllPages) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else if (
    destination.Config.trackCategorisedPages &&
    (message.properties?.category || message.category)
  ) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else if (destination.Config.trackNamedPages && (message.properties?.name || message.name)) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else {
    throw new ConfigurationError('Invalid screen call');
  }
  validateMandatoryField(rawPayload);
  if (destination.Config.mapToSingleEvent) {
    rawPayload.eventName = 'Loaded a Screen';
  } else {
    rawPayload.eventName += ' screen';
  }
  rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
  if (rawPayload.campaignId) {
    rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
  }
  if (rawPayload.templateId) {
    rawPayload.templateId = parseInt(rawPayload.templateId, 10);
  }

  return rawPayload;
};

const trackAction = (message, category) => {
  let rawPayload = {};
  rawPayload = constructPayload(message, mappingConfig[category.name]);
  validateMandatoryField(rawPayload);
  rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
  if (rawPayload.campaignId) {
    rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
  }
  if (rawPayload.templateId) {
    rawPayload.templateId = parseInt(rawPayload.templateId, 10);
  }

  return rawPayload;
};

const trackPurchaseAction = (message, category, config) => {
  let rawPayload = {};
  const rawPayloadItemArr = [];
  rawPayload = constructPayload(message, mappingConfig[category.name]);
  rawPayload.user = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);
  validateMandatoryField(rawPayload.user);
  rawPayload.user.preferUserId = getPreferUserId(config);
  rawPayload.user.mergeNestedObjects = getMergeNestedObjects(config);
  rawPayload.items = message.properties.products;
  if (rawPayload.items && Array.isArray(rawPayload.items)) {
    rawPayload.items.forEach((el) => {
      const element = constructPayload(el, mappingConfig[ConfigCategory.PRODUCT.name]);
      if (element.categories && typeof element.categories === 'string') {
        element.categories = element.categories.split(',');
      }
      element.price = parseFloat(element.price);
      element.quantity = parseInt(element.quantity, 10);
      const clone = { ...element };
      rawPayloadItemArr.push(clone);
    });
  } else {
    const element = constructPayload(
      message.properties,
      mappingConfig[ConfigCategory.PRODUCT.name],
    );
    if (element.categories && typeof element.categories === 'string') {
      element.categories = element.categories.split(',');
    }
    element.price = parseFloat(element.price);
    element.quantity = parseInt(element.quantity, 10);
    const clone = { ...element };
    rawPayloadItemArr.push(clone);
  }

  rawPayload.items = rawPayloadItemArr;
  rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
  rawPayload.total = parseFloat(rawPayload.total);
  if (rawPayload.id) {
    rawPayload.id = rawPayload.id.toString();
  }
  if (rawPayload.campaignId) {
    rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
  }
  if (rawPayload.templateId) {
    rawPayload.templateId = parseInt(rawPayload.templateId, 10);
  }

  return rawPayload;
};

const updateCartAction = (message, config) => {
  const rawPayload = {
    items: message.properties.products,
  };
  const rawPayloadItemArr = [];
  rawPayload.user = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);
  validateMandatoryField(rawPayload.user);
  rawPayload.user.preferUserId = getPreferUserId(config);
  rawPayload.user.mergeNestedObjects = getMergeNestedObjects(config);
  if (rawPayload.items && Array.isArray(rawPayload.items)) {
    rawPayload.items.forEach((el) => {
      const element = constructPayload(el, mappingConfig[ConfigCategory.PRODUCT.name]);
      if (element.categories && typeof element.categories === 'string') {
        element.categories = element.categories.split(',');
      }
      element.price = parseFloat(element.price);
      element.quantity = parseInt(element.quantity, 10);
      const clone = { ...element };
      rawPayloadItemArr.push(clone);
    });
  } else {
    const element = constructPayload(
      message.properties,
      mappingConfig[ConfigCategory.PRODUCT.name],
    );
    if (element.categories && typeof element.categories === 'string') {
      element.categories = element.categories.split(',');
    }
    element.price = parseFloat(element.price);
    element.quantity = parseInt(element.quantity, 10);
    const clone = { ...element };
    rawPayloadItemArr.push(clone);
  }

  rawPayload.items = rawPayloadItemArr;
  return rawPayload;
};

module.exports = {
  getCatalogEndpoint,
  identifyDeviceAction,
  identifyBrowserAction,
  identifyAction,
  pageAction,
  screenAction,
  trackAction,
  trackPurchaseAction,
  updateCartAction,
};
