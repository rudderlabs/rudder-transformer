const path = require("path");
const fs = require("fs");
const sha256 = require("sha256");
const {
  CustomError,
  flattenJson,
  removeUndefinedAndNullAndEmptyValues
} = require("../../util");
const Message = require("../message");

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

function settingProperties(event, message) {
  const flatEvent = event;

  // deleting object fields(already mapped) before flattening the event
  delete flatEvent?.recipientData;
  delete flatEvent?.recordedAt;
  delete flatEvent?.triggerData?.formSubmissionData?.recordedAt;
  delete flatEvent?.triggerData?.formSubmissionData?.recipientData;

  // flattening the event and assigning it to properties
  message.properties = removeUndefinedAndNullAndEmptyValues(
    flattenJson(flatEvent)
  );

  // fields that are already mapped
  const excludeFields = [
    "triggerData.email",
    "triggerData.userId",
    "recipientData.email",
    "recipientEmail",
    "triggerData.formSubmissionData.email",
    "triggerData.formSubmissionData.recipientEmail"
  ];

  // deleting already mapped fields
  for (let i = 0; i < excludeFields.length; i++) {
    delete message?.properties[excludeFields[i]];
  }
}

function process(event) {
  const message = new Message(`Mailmodo`);

  // event type is always track
  const eventType = "track";

  message.setEventType(eventType);

  message.setPropertiesV2(event, mapping);

  message.context.integration.version = "1.0.0";

  // setting event Name
  if (event?.triggerData?.triggerSource) {
    message.setEventName(event.triggerData.triggerSource);
  } else {
    message.setEventName("Form Submitted");
  }
  // setting up mailmodo userId to externalId
  if (event?.triggerData?.userId) {
    message.context.externalId = [
      {
        type: "mailmodoUserId",
        id: event.triggerData.userId
      }
    ];
  }

  const email =
    event?.triggerData?.email ||
    event?.recipientData?.email ||
    event?.recipientEmail ||
    null;
  // throws an error if email is not present
  if (!email) {
    throw new CustomError("Missing essential fields from Mailmodo.", 400);
  }

  // generating anonymousId using email
  message.anonymousId = sha256(email);

  // setting originalTimestamp
  if (event?.recordedAt?.ts) {
    message.originalTimestamp = new Date(
      event.recordedAt.ts * 1000
    ).toISOString();
  } else if (event?.triggerData?.formSubmissionData?.recordedAt?.ts) {
    message.originalTimestamp = new Date(
      event.triggerData.formSubmissionData.recordedAt.ts * 1000
    ).toISOString();
  }

  settingProperties(event, message);

  return message;
}

module.exports = { process };
