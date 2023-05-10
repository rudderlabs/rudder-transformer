const path = require("path");
const fs = require("fs");
const { generateUUID, isDefinedAndNotNull } = require("../../util");
const Message = require("../message");

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

function process(event) {
  const message = new Message(`Formsort`);

  // we are setting event type as track always
  message.setEventType("track");

  message.setPropertiesV2(event, mapping);

  // setting anonymousId if userId is not present
  if (!isDefinedAndNotNull(message.userId)) {
    message.anonymousId = generateUUID();
  }

  // setting event Name
  if (event.finalized) {
    message.setEventName("FlowFinalized");
  } else {
    message.setEventName("FlowLoaded");
  }

  return message;
}

module.exports = { process };
