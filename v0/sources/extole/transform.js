/* eslint-disable no-case-declarations */
const path = require("path");
const fs = require("fs");
const Message = require("../message");
const {
  removeUndefinedAndNullValues,
  extractCustomFields
} = require("../../util");

const mappingJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

function guidGenerator() {
  const S4 = () =>
    // eslint-disable-next-line no-bitwise
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

function processEvent(event) {
  const message = new Message(`EXTOLE`);
  message.setEventType("track");

  switch (event.type) {
    case "reward_earned":
    case "reward_fulfilled":
    case "reward_sent":
      message.setEventName(event.type);
      // set fields in payload from mapping json
      message.setPropertiesV2(event, mappingJson);
      break;
    default:
      message.setEventName(event.type);
      let messageProperties = {};
      messageProperties = extractCustomFields(
        event,
        messageProperties,
        "root",
        ["type"]
      );
      message.setProperty("properties", messageProperties);
  }

  // setting anonymous id for failsafety from server
  message.anonymousId = guidGenerator();
  return message;
}

function process(event) {
  const response = processEvent(event);
  const returnValue = removeUndefinedAndNullValues(response);
  return returnValue;
}

exports.process = process;
