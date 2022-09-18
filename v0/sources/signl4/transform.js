const path = require("path");
const fs = require("fs");
const { flattenJson, removeUndefinedAndNullValues } = require("../../util");
const Message = require("../message");

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

function settingProperties(event, message) {
  const flatEvent = event;
  const messageReplica = message;

  // flattening the event and assigning it to properties
  messageReplica.properties = removeUndefinedAndNullValues(
    flattenJson(flatEvent)
  );

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
  const eventType = "track";

  message.setEventType(eventType);

  message.setPropertiesV2(event, mapping);

  // setting event Name
  switch (event.eventType) {
    case 200:
      message.setEventName("New Signl Created");
      break;
    case 201:
      message.setEventName("Signl Confirmed");
      break;
    case 202:
      message.setEventName("Signl Escalated");
      break;
    case 203:
      message.setEventName("Signl Annotated");
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
