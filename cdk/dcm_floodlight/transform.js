/* eslint-disable no-param-reassign */
const get = require("get-value");
const {
  getValueFromMessage,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull
} = require("rudder-transformer-cdk/build/utils");
const { CustomError, getIntegrationsObj } = require("../../v0/util");

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
    // remove u if already there
    customVariable[`u${item.from.trim().replace(/u/g, "")}`] = item.to.trim();
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

  const baseEndpoint = "https://ad.doubleclick.net/ddm/activity/";

  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError(
      "[DCM Floodlight]:: event is required for track call",
      400
    );
  }

  let customFloodlightVariable;
  let salesTag;
  event = event.trim().toLowerCase();
  // find conversion event
  // some() stops execution if at least one condition is passed and returns bool
  const conversionEventFound = conversionEvents.some(conversionEvent => {
    if (conversionEvent.eventName.trim().toLowerCase() === event) {
      activityTag = conversionEvent.floodlightActivityTag.trim();
      groupTag = conversionEvent.floodlightGroupTag.trim();
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

  if (!salesTag) {
    // for counter tag
    mappedPayload.ord = get(message, "messageId");
    delete mappedPayload.qty;
    delete mappedPayload.cost;
  }

  const integrationsObj = getIntegrationsObj(message, "dcm_floodlight");
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

  mappedPayload.dc_lat = get(message, "context.device.adTrackingEnabled");
  if (isDefinedAndNotNull(mappedPayload.dc_lat)) {
    mappedPayload.dc_lat = isValidFlag("dc_lat", mappedPayload.dc_lat);
  }

  mappedPayload = removeUndefinedAndNullValues(mappedPayload);
  customFloodlightVariable = removeUndefinedAndNullValues(
    customFloodlightVariable
  );

  rudderContext.endpoint = appendProperties(baseEndpoint, mappedPayload);
  rudderContext.endpoint = appendProperties(
    rudderContext.endpoint,
    customFloodlightVariable
  ).slice(0, -1);

  return {};
}

module.exports = { trackPostMapper };
