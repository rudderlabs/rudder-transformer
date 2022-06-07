/* eslint-disable no-param-reassign */
const get = require("get-value");
const {
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  getFieldValueFromMessage
} = require("rudder-transformer-cdk/build/utils");
const logger = require("../../logger");
const { CustomError, getIntegrationsObj, isEmpty } = require("../../v0/util");

// append properties to endpoint
// eg: ${endpoint}key1=value1;key2=value2;....
const appendProperties = (endpoint, payload) => {
  Object.keys(payload).forEach(key => {
    endpoint += `${key}=${payload[key]};`;
  });

  return endpoint;
};

// transform webapp dynamicForm custom floodlight variable
// into {u1: value, u2: value, ...}
// Ref - https://support.google.com/campaignmanager/answer/2823222?hl=en
const transformCustomVariable = (customFloodlightVariable, message) => {
  const customVariable = {};
  customFloodlightVariable.forEach(item => {
    if (item && !isEmpty(item.from) && !isEmpty(item.to)) {
      // remove u if already there
      // first we consider taking custom variable from properties
      // if not found then we will look into traits
      let itemValue = get(message, `properties.${item.to.trim()}`);
      // this condition adds support for numeric 0
      if (!isDefinedAndNotNull(itemValue)) {
        const traits = getFieldValueFromMessage(message, "traits");
        if (traits) {
          itemValue = traits[item.to.trim()];
        }
      }
      if (
        itemValue &&
        typeof itemValue === "string" &&
        ['"', "<", ">", "#"].some(key => itemValue.includes(key))
      ) {
        logger.info('", < , > or # string variable is not acceptable');
        itemValue = undefined;
      }
      // supported data types are number and string
      if (isDefinedAndNotNull(itemValue) && typeof itemValue !== "boolean") {
        customVariable[
          `u${item.from.trim().replace(/u/g, "")}`
        ] = encodeURIComponent(itemValue);
      }
    }
  });

  return customVariable;
};

// valid flag should be provided [1|true] or [0|false]
const mapFlagValue = (key, value) => {
  if (["true", "1"].includes(value.toString())) {
    return 1;
  }
  if (["false", "0"].includes(value.toString())) {
    return 0;
  }

  throw new CustomError(
    `[DCM Floodlight]:: ${key}: valid parameters are [1|true] or [0|false]`,
    400
  );
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

  const baseEndpoint = "https://ad.doubleclick.net/ddm/activity/";

  let event;
  // for page() take event from name and category
  if (message.type === "page") {
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
      message.event = "Viewed Page";
    }
  }

  event = message.event;

  if (!event) {
    throw new CustomError(
      `[DCM Floodlight] ${message.type}:: event is required`,
      400
    );
  }

  const userAgent = get(message, "context.userAgent");
  if (!userAgent) {
    throw new CustomError(
      `[DCM Floodlight] ${message.type}:: userAgent is required`,
      400
    );
  }
  rudderContext.userAgent = userAgent;

  // find conversion event
  // some() stops execution if at least one condition is passed and returns bool
  event = event.trim().toLowerCase();
  const conversionEventFound = conversionEvents.some(conversionEvent => {
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
    throw new CustomError(
      `[DCM Floodlight] ${message.type}:: Conversion event not found`,
      400
    );
  }

  // Ref - https://support.google.com/displayvideo/answer/6040012?hl=en
  customFloodlightVariable = transformCustomVariable(
    customFloodlightVariable,
    message
  );
  mappedPayload = {
    src: advertiserId,
    cat: activityTag,
    type: groupTag,
    ...mappedPayload
  };

  if (salesTag) {
    // sums quantity from products array or fallback to properties.quantity
    const products = get(message, "properties.products");
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
    mappedPayload.ord = get(message, "messageId");
    delete mappedPayload.qty;
    delete mappedPayload.cost;
  }

  // COPPA, GDPR, npa must be provided inside integration object ("DCM FLoodlight")
  // Ref - https://support.google.com/displayvideo/answer/6040012?hl=en
  const integrationsObj = getIntegrationsObj(message, "dcm_floodlight");
  if (integrationsObj) {
    if (isDefinedAndNotNull(integrationsObj.COPPA)) {
      mappedPayload.tag_for_child_directed_treatment = mapFlagValue(
        "COPPA",
        integrationsObj.COPPA
      );
    }

    if (isDefinedAndNotNull(integrationsObj.GDPR)) {
      mappedPayload.tfua = mapFlagValue("GDPR", integrationsObj.GDPR);
    }

    if (isDefinedAndNotNull(integrationsObj.npa)) {
      mappedPayload.npa = mapFlagValue("npa", integrationsObj.npa);
    }
  }

  if (isDefinedAndNotNull(mappedPayload.dc_lat)) {
    mappedPayload.dc_lat = mapFlagValue("dc_lat", mappedPayload.dc_lat);
  }

  mappedPayload = removeUndefinedAndNullValues(mappedPayload);
  customFloodlightVariable = removeUndefinedAndNullValues(
    customFloodlightVariable
  );

  let dcmEndpoint = appendProperties(baseEndpoint, mappedPayload);
  dcmEndpoint = appendProperties(dcmEndpoint, customFloodlightVariable).slice(
    0,
    -1
  );

  rudderContext.endpoint = dcmEndpoint;

  return {};
};

module.exports = { postMapper };
