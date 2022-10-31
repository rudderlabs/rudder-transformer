const path = require("path");
const fs = require("fs");
const { removeUndefinedAndNullValues } = require("../../util");
const { getGroupId } = require("./util");
// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);
const Message = require("../message");

// Ref: https://auth0.com/docs/logs/references/log-event-type-codes
const eventNameMap = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./eventMapping.json"), "utf-8")
);

const prepareIdentifyPayload = event => {
  const message = new Message("Auth0");
  message.setEventType("identify");
  message.setPropertiesV2(event, mapping);
  return message;
};

const prepareTrackPayload = event => {
  const message = new Message("Auth0");
  message.setEventType("track");
  const eventType = event.type;
  const eventName = eventNameMap[eventType] || eventType;
  message.setEventName(eventName);
  message.setPropertiesV2(event, mapping);
  return message;
};

const prepareGroupPayload = event => {
  const message = new Message("Auth0");
  message.setEventType("group");
  message.setPropertiesV2(event, mapping);
  message.groupId = getGroupId(event);
  return message;
};

function processEvent(event) {
  // Dropping the event if type is not present
  if (!event.type) {
    return null;
  }
  const eventType = event.type;
  // ss -> successful signup
  if (eventType === "ss") {
    return prepareIdentifyPayload(event);
  }
  // sapi -> Success API Operation
  if (eventType === "sapi") {
    if (
      event.description &&
      event.description === "Add members to an organization"
    ) {
      return prepareGroupPayload(event);
    }
    return prepareTrackPayload(event);
  }
  return prepareTrackPayload(event);
}

function process(events) {
  const responses = [];
  let eventList = events;
  if (!Array.isArray(events)) {
    eventList = events.logs ? events.logs : [events];
  }
  eventList.forEach(event => {
    const resp = processEvent(event.data);
    if (resp) {
      resp.properties.log_id = event.log_id;
      responses.push(removeUndefinedAndNullValues(resp));
    }
  });
  return responses;
}

exports.process = process;
