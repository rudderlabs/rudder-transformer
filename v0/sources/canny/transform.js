const path = require("path");
const fs = require("fs");
const Message = require("../message");
const sha256 = require("sha256");

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

function process(event) {
  const message = new Message(`Canny`);

  // event type is always track
  const eventType = "track";

  message.setEventType(eventType);

  message.setPropertiesV2(event, mapping);

  message.context.integration.version = "1.0.0";
  try {
    switch (event.type) {
      case "vote.created":
      case "vote.deleted":
        // setting up userId
        if (event.object?.voter?.userID) {
          message.userId = event.object.voter.userID;
        } else {
          // setting up anonymousId if userId is not present
          message.anonymousId = sha256(event.object.voter?.email);
        }

        if (event.object?.voter?.id) {
          message.context.externalId = [
            {
              type: "cannyUserId",
              value: event.object.voter.id
            }
          ];
        }

        message.context.traits = event.object?.voter;

        // deleting already mapped fields
        delete message.properties?.voter;
        delete message.context.traits?.userID;
        delete message.context.traits?.id;
        break;

      default:
        // setting up userId
        if (event.object?.author?.userID) {
          message.userId = event.object.author.userID;
        } else {
          // setting up anonymousId if userId is not present
          message.anonymousId = sha256(event.object.author?.email);
        }

        if (event.object?.author?.id) {
          message.context.externalId = [
            {
              type: "cannyUserId",
              value: event.object.author.id
            }
          ];
        }

        message.context.traits = event.object?.author;

        // deleting already mapped fields
        delete message.properties?.author;
        delete message.context.traits?.userID;
        delete message.context.traits?.id;
    }
  } catch (e) {
    throw new Error(`Missing essential fields from Canny. Error: (${e})`);
  }

  return message;
}
module.exports = { process };
