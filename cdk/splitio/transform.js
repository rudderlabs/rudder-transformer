/* eslint-disable no-param-reassign */
const { Utils } = require("rudder-transformer-cdk");
const ErrorBuilder = require("../../v0/util/error");
const { TRANSFORMER_METRIC } = require("../../v0/util/constant");

let bufferProperty = {};

const EVENT_TYPE_ID_REGEX = new RegExp("^[a-zA-Z0-9][-_.a-zA-Z0-9]{0,79}$");

const KEY_CHECK_LIST = [
  "eventTypeId",
  "environmentName",
  "trafficTypeName",
  "key",
  "timestamp",
  "value",
  "revenue",
  "total"
];

function formatEventTypeId(eventTypeId) {
  const formattedEventTypeId = eventTypeId.replace(/ /g, "_");
  if (!EVENT_TYPE_ID_REGEX.test(formattedEventTypeId)) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("eventTypeId does not match with ideal format")
      .setStatTags({
        destination: "splitio",
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
    // throw new Error("Email is required for track calls");
  }
  return formattedEventTypeId;
}

function populateOutputProperty(inputObject) {
  const outputProperty = {};
  Object.keys(inputObject).forEach(key => {
    if (!KEY_CHECK_LIST.includes(key) && !Array.isArray(inputObject[key])) {
      outputProperty[key] = inputObject[key];
    }
  });
  return outputProperty;
}

function identifyPostMapper(event, mappedPayload, rudderContext) {
  const { message } = event;
  const traits = Utils.getFieldValueFromMessage(message, "traits");

  mappedPayload.eventTypeId = formatEventTypeId(mappedPayload.eventTypeId);

  if (Utils.isDefinedAndNotNull(traits)) {
    bufferProperty = populateOutputProperty(traits);
  }
  mappedPayload.properties = Utils.flattenJson(bufferProperty);
  return mappedPayload;
}

function groupPostMapper(event, mappedPayload, rudderContext) {
  const { message } = event;
  mappedPayload.eventTypeId = formatEventTypeId(mappedPayload.eventTypeId);
  if (message.traits) {
    bufferProperty = populateOutputProperty(message.traits);
  }
  mappedPayload.properties = Utils.flattenJson(bufferProperty);
  return mappedPayload;
}

function defaultPostMapper(event, mappedPayload, rudderContext) {
  const { message } = event;
  mappedPayload.eventTypeId = formatEventTypeId(mappedPayload.eventTypeId);
  if (message.properties) {
    bufferProperty = populateOutputProperty(message.properties);
  }

  if (message.category) {
    bufferProperty.category = message.category;
  }

  if (message.type !== "track") {
    mappedPayload.eventTypeId = `Viewed_${mappedPayload.eventTypeId}_${message.type}`;
  }
  mappedPayload.properties = Utils.flattenJson(bufferProperty);
  return mappedPayload;
}

module.exports = { identifyPostMapper, groupPostMapper, defaultPostMapper };
