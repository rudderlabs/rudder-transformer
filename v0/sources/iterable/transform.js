const path = require("path");
const fs = require("fs");
// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);
const Message = require("../message");
// const { mappingJson } = require("./mapping");

function process(event) {
  const message = new Message(`Iterable`);

  // event type is always track
  const eventType = "track";

  message.setEventType(eventType);

  message.setEventName(event.eventName);

  message.setProperties(event, mapping);

  message.context.integration.version = "1.0.0";

  if (event.dataFields.createdAt) {
    const ts = new Date(event.dataFields.createdAt).toISOString();
    message.receivedAt = ts;
    message.timestamp = ts;
  }

  // when iterable does not pass an associated userId, set the email address as anonymousId
  if (message.userId === null || message.userId === undefined) {
    if (
      message.context &&
      message.context.traits &&
      message.context.traits.email
    ) {
      message.anonymousId = message.context.traits.email;
    }
  }

  return message;
}

module.exports = { process };
