const path = require("path");
const fs = require("fs");
const {
  flattenJson,
  removeUndefinedAndNullValues,
  generateUUID
} = require("../../util");
const Message = require("../message");

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

function settingProperties(event, message) {
  const messageReplica = message;

  // flattening the event and assigning it to properties
  messageReplica.properties = removeUndefinedAndNullValues(flattenJson(event));

  return message;
}

function process(event) {
  let message = new Message(`Formsort`);

  // Here, we are checking for the test event to discard them
  if (event.eventType === 1) {
    return {
      outputToSource: {
        body: Buffer.from(JSON.stringify(event)).toString("base64"),
        contentType: "application/json"
      },
      statusCode: 200
    };
  }

  // we are setting event type as track always
  message.setEventType("track");

  // setting anonymousId
  message.anonymousId = generateUUID();

  message.setPropertiesV2(event, mapping);

  // Updating timestamp to acceptable timestamp format ["2017-09-01T09:16:17Z" -> "2017-09-01T09:16:17.000Z"]
  if (message.originalTimestamp) {
    const date = `${Math.floor(
      new Date(message.originalTimestamp).getTime() / 1000
    )}`;
    message.originalTimestamp = new Date(date * 1000).toISOString();
  }

  // setting event Name
  switch (event.eventType) {
    case 200:
      message.setEventName("New Alert Created");
      break;
    case 201:
      if (event.alert?.statusCode === 4) {
        message.setEventName("Alert Resolved");
      } else {
        message.setEventName("Alert Confirmed");
      }
      break;
    default:
      message.setEventName("Alert Updated");
  }

  message = settingProperties(event, message);

  return message;
}

module.exports = { process };
