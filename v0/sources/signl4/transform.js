const path = require("path");
const fs = require("fs");
const { flattenJson, removeUndefinedAndNullValues } = require("../../util");
const Message = require("../message");

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

function settingProperties(event, message) {
  const messageReplica = message;

  // flattening the event and assigning it to properties
  messageReplica.properties = removeUndefinedAndNullValues(flattenJson(event));

  // fields that are already mapped
  const excludeFields = [
    "user.userName",
    "user.mailAddress",
    "id",
    "eventRaisedUtc"
  ];

  // deleting already mapped fields
  excludeFields.forEach(field => {
    delete messageReplica.properties[field];
  });

  return message;
}

function process(event) {
  let message = new Message(`Signl4`);

  // we are setting event type as track always
  message.setEventType("track");

  message.setPropertiesV2(event, mapping);

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
    case 202:
      message.setEventName("Alert Escalated");
      break;
    case 203:
      message.setEventName("Alert Annotated");
      break;
    case 300:
      message.setEventName("Duty Period Started");
      break;
    case 301:
      message.setEventName("Duty Period Ended");
      break;
    case 302:
      message.setEventName("Somebody Punched-In");
      break;
    case 303:
      message.setEventName("Somebody Punched-Out");
      break;
    default:
      message.setEventName("Alert Updated");
  }

  // setting up signl4 user.id to externalId
  if (event.user?.id) {
    message.context.externalId = [
      {
        type: "signl4UserId",
        id: event.user.id
      }
    ];
  }

  message = settingProperties(event, message);

  return message;
}

module.exports = { process };
