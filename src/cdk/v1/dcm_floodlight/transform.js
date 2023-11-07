/* eslint-disable no-param-reassign */
const get = require('get-value');
const lodash = require('lodash');
const {
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
} = require('rudder-transformer-cdk/build/utils');
const {
  getIntegrationsObj,
  isEmpty,
  isEmptyObject,
  getValueFromPropertiesOrTraits,
  getHashFromArray,
} = require('../../../v0/util');
const { GENERIC_TRUE_VALUES, GENERIC_FALSE_VALUES } = require('../../../constants');
const { BASE_URL, BLACKLISTED_CHARACTERS } = require('./config');
const { ConfigurationError, InstrumentationError } = require('../../../v0/util/errorTypes');

// append properties to endpoint
// eg: ${BASE_URL}key1=value1;key2=value2;....
const appendProperties = (payload) => {
  let endpoint = '';
  endpoint += Object.keys(payload)
    .map((key) => `${key}=${payload[key]}`)
    .join(';');

  return endpoint;
};

// transform webapp dynamicForm custom floodlight variable
// into {property1: u1, property2: u2, ...}
// Ref - https://support.google.com/campaignmanager/answer/2823222?hl=en
const transformCustomVariable = (customFloodlightVariable, message) => {
  const customVariable = {};
  const customMapping = getHashFromArray(customFloodlightVariable, 'from', 'to', false);

  Object.keys(customMapping).forEach((key) => {
    // it takes care of getting the value in the order.
    // returns null if not present
    const itemValue = getValueFromPropertiesOrTraits({
      message,
      key,
    });

    if (
      // the value is not null
      !lodash.isNil(itemValue) &&
      // the value is string and doesn't have any blacklisted characters
      !(
        typeof itemValue === 'string' && BLACKLISTED_CHARACTERS.some((k) => itemValue.includes(k))
      ) &&
      // boolean values are not supported
      typeof itemValue !== 'boolean'
    ) {
      customVariable[`u${customMapping[key].replace(/u/g, '')}`] = encodeURIComponent(itemValue);
    }
  });

  return customVariable;
};

// valid flag should be provided [1|true] or [0|false]
const mapFlagValue = (key, value) => {
  if (GENERIC_TRUE_VALUES.includes(value.toString())) {
    return 1;
  }
  if (GENERIC_FALSE_VALUES.includes(value.toString())) {
    return 0;
  }

  throw new InstrumentationError(`${key}: valid parameters are [1|true] or [0|false]`);
};

/**
 * postMapper does the processing after we do the initial mapping
 * defined in mapping/*.yaml
 * @param {*} input
 * @param {*} mappedPayload
 * @param {*} rudderContext
 * @returns
 */
const postMapper = (input, mappedPayload, rudderContext) => {
  const { message, destination } = input;
  const { advertiserId, conversionEvents } = destination.Config;
  let { activityTag, groupTag } = destination.Config;
  let customFloodlightVariable;
  let salesTag;

  let event;
  // for page() take event from name and category
  if (message.type.toLowerCase() === 'page') {
    const { category } = message.properties;
    const { name } = message || message.properties;

    if (category && name) {
      message.event = `Viewed ${category} ${name} Page`;
    } else if (category) {
      // categorized pages
      message.event = `Viewed ${category} Page`;
    } else if (name) {
      // named pages
      message.event = `Viewed ${name} Page`;
    } else {
      message.event = 'Viewed Page';
    }
  }

  event = message.event;

  if (!event) {
    throw new InstrumentationError(`${message.type}:: event is required`);
  }

  const userAgent = get(message, 'context.userAgent');
  if (!userAgent) {
    throw new InstrumentationError(`${message.type}:: userAgent is required`);
  }
  rudderContext.userAgent = userAgent;

  // find conversion event
  // some() stops execution if at least one condition is passed and returns bool
  event = event.trim().toLowerCase();
  const conversionEventFound = conversionEvents.some((conversionEvent) => {
    if (
      conversionEvent &&
      conversionEvent.eventName &&
      conversionEvent.eventName.trim().toLowerCase() === event
    ) {
      if (
        !isEmpty(conversionEvent.floodlightActivityTag) &&
        !isEmpty(conversionEvent.floodlightGroupTag)
      ) {
        activityTag = conversionEvent.floodlightActivityTag.trim();
        groupTag = conversionEvent.floodlightGroupTag.trim();
      }
      salesTag = conversionEvent.salesTag;
      customFloodlightVariable = conversionEvent.customVariables || [];
      return true;
    }
    return false;
  });

  if (!conversionEventFound) {
    throw new ConfigurationError(`${message.type}:: Conversion event not found`);
  }

  // Ref - https://support.google.com/displayvideo/answer/6040012?hl=en
  customFloodlightVariable = transformCustomVariable(customFloodlightVariable, message);
  mappedPayload = {
    src: advertiserId,
    cat: activityTag,
    type: groupTag,
    ...mappedPayload,
  };

  if (salesTag) {
    // sums quantity from products array or fallback to properties.quantity
    const products = get(message, 'properties.products');
    if (!isEmpty(products) && Array.isArray(products)) {
      const quantities = products.reduce((accumulator, product) => {
        if (product.quantity) {
          return accumulator + product.quantity;
        }
        return accumulator;
      }, 0);
      if (quantities) {
        mappedPayload.qty = quantities;
      }
    }
  } else {
    // for counter tag
    mappedPayload.ord = get(message, 'messageId');
    delete mappedPayload.qty;
    delete mappedPayload.cost;
  }

  // COPPA, GDPR, npa must be provided inside integration object ("DCM FLoodlight")
  // Ref - https://support.google.com/displayvideo/answer/6040012?hl=en
  const integrationsObj = getIntegrationsObj(message, 'dcm_floodlight');
  if (integrationsObj) {
    if (isDefinedAndNotNull(integrationsObj.COPPA)) {
      mappedPayload.tag_for_child_directed_treatment = mapFlagValue('COPPA', integrationsObj.COPPA);
    }

    if (isDefinedAndNotNull(integrationsObj.GDPR)) {
      mappedPayload.tfua = mapFlagValue('GDPR', integrationsObj.GDPR);
    }

    if (isDefinedAndNotNull(integrationsObj.npa)) {
      mappedPayload.npa = mapFlagValue('npa', integrationsObj.npa);
    }
  }

  if (isDefinedAndNotNull(mappedPayload.dc_lat)) {
    mappedPayload.dc_lat = mapFlagValue('dc_lat', mappedPayload.dc_lat);
  }

  mappedPayload = removeUndefinedAndNullValues(mappedPayload);
  customFloodlightVariable = removeUndefinedAndNullValues(customFloodlightVariable);

  let dcmEndpoint = `${BASE_URL}${appendProperties(mappedPayload)}`;
  if (!isEmptyObject(customFloodlightVariable)) {
    dcmEndpoint = `${dcmEndpoint};${appendProperties(customFloodlightVariable)}`;
  }

  rudderContext.endpoint = dcmEndpoint;

  return {};
};

module.exports = { postMapper };
