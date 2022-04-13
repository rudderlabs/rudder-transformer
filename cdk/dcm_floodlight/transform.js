/* eslint-disable no-param-reassign */
const get = require("get-value");
const {
  getValueFromMessage,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull
} = require("rudder-transformer-cdk/build/utils");
const { CustomError, getIntegrationsObj, isEmpty } = require("../../v0/util");

// append properties to endpoint
// eg: ${endpoint}key1=value1;key2=value2;....
function appendProperties(endpoint, payload) {
  Object.keys(payload).forEach(key => {
    endpoint += `${key}=${payload[key]};`;
  });

  return endpoint;
}

// transform webapp dynamicForm custom floodlight variable
// into {u1: value, u2: value, ...}
function transformCustomVariable(customFloodlightVariable) {
  const customVariable = {};
  customFloodlightVariable.forEach(item => {
    if (item && !isEmpty(item.from) && !isEmpty(item.to)) {
      // remove u if already there
      customVariable[
        `u${item.from.trim().replace(/u/g, "")}`
      ] = `[${item.to.trim()}]`;
    }
  });

  return customVariable;
}

// valid flag should be provided [1|true] or [0|false]
function isValidFlag(key, value) {
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
}

function trackPostMapper(input, mappedPayload, rudderContext) {
  const { message, destination } = input;
  const { advertiserId, conversionEvents } = destination.Config;
  let { activityTag, groupTag } = destination.Config;
  let customFloodlightVariable;
  let salesTag;

  const baseEndpoint = "https://ad.doubleclick.net/ddm/activity/";

  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError(
      "[DCM Floodlight]:: event is required for track call",
      400
    );
  }

  const userAgent = get(message, "context.userAgent");
  if (!userAgent) {
    throw new CustomError(
      "[DCM Floodlight]:: userAgent is required for track call",
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
    throw new CustomError("[DCM Floodlight]:: Conversion event not found", 400);
  }

  customFloodlightVariable = transformCustomVariable(customFloodlightVariable);
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
      mappedPayload.tag_for_child_directed_treatment = isValidFlag(
        "COPPA",
        integrationsObj.COPPA
      );
    }

    if (isDefinedAndNotNull(integrationsObj.GDPR)) {
      mappedPayload.tfua = isValidFlag("GDPR", integrationsObj.GDPR);
    }

    if (isDefinedAndNotNull(integrationsObj.npa)) {
      mappedPayload.npa = isValidFlag("npa", integrationsObj.npa);
    }
  }

  if (isDefinedAndNotNull(mappedPayload.dc_lat)) {
    mappedPayload.dc_lat = isValidFlag("dc_lat", mappedPayload.dc_lat);
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
}

module.exports = { trackPostMapper };
