const path = require("path");
const fs = require("fs");
const md5 = require("md5");
const Message = require("../message");
const { TransformationError } = require("../../util/errorTypes");

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

function process(event) {
  // throw an error if (email, eventName) are not present
  if (!(event.email && event.eventName)) {
    throw new TransformationError("Unknwon event type from Iterable");
  }
  const message = new Message(`Iterable`);

  // event type is always track
  const eventType = "track";

  message.setEventType(eventType);

  message.setEventName(event.eventName);

  message.setPropertiesV2(event, mapping);

  message.context.integration.version = "1.0.0";

  if (event.dataFields?.createdAt) {
    const ts = new Date(event.dataFields.createdAt).toISOString();
    message.receivedAt = ts;
    message.timestamp = ts;
  }

  // As email is present in message.traits, removing it from properties to reduce redundancy
  delete message.properties?.email;

  // Treating userId as unique identifier
  // If userId is not present, then generating it from email using md5 hash function
  if (message.userId === null || message.userId === undefined) {
    message.userId = md5(event.email);
  }

  return message;
}

module.exports = { process };
