const path = require("path");
const fs = require("fs");
const { removeUndefinedAndNullValues } = require("../../util");
const { getGroupId } = require("./util");
// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);
const Message = require("../message");
const { CustomError } = require("../../util");

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

function processEvents(eventList) {
  const responses = [];
  eventList.forEach(event => {
    let response = {};
    const { data } = event;
    // Dropping the event if type is not present
    if (data.type) {
      const eventType = data.type;
      // ss -> successful signup
      if (eventType === "ss") {
        response = prepareIdentifyPayload(data);
      } else if (
        eventType === "sapi" &&
        data.description === "Add members to an organization"
      ) {
        const payload = prepareGroupPayload(data);
        // Dropping event if groupId is not present for group call
        if (payload?.groupId) {
          response = payload;
        }
      } else {
        response = prepareTrackPayload(data);
      }
      if (response?.userId) {
        response.properties.log_id = event.log_id;
        responses.push(removeUndefinedAndNullValues(response));
      }
    }
  });
  return responses;
}

function process(events) {
  let eventList = events;
  if (!Array.isArray(events)) {
    eventList = events.logs || [events];
  }
  return processEvents(eventList);
}

exports.process = process;
