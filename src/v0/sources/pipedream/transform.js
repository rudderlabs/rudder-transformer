const Message = require("../message");
const { generateUUID } = require("../../util");
const { callTypes } = require("./config");
const { findUserIdOrAnonymousId } = require("./util");

const buildTrackPayload = event => {
  const message = new Message(`PIPEDREAM`);
  message.setEventType("track");
  message.setEventName("pipedream_source_event");
  message.setProperty("properties", event);
  return message;
};

const processEvent = event => {
  const userIdorAnonymousId = findUserIdOrAnonymousId(event);
  if (
    event?.type &&
    callTypes.includes(event.type.toLowerCase()) &&
    userIdorAnonymousId
  ) {
    return event;
  }
  // default case
  const message = buildTrackPayload(event);
  message.anonymousId = userIdorAnonymousId || generateUUID();

  return message;
};

const process = event => {
  const response = processEvent(event);
  return response;
};

exports.process = process;
