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

  switch (event.type) {
    case "vote.created":
    case "vote.deleted":
      if (event.object?.voter?.userId) {
        message.userId = event.object.voter.userId;
      } else {
        message.anonymousId = sha256(event.object.voter?.email);
      }
      break;
    default:
      if (event.object?.author?.userId) {
        message.userId = event.object.author.userId;
      } else {
        message.anonymousId = sha256(event.object.author?.email);
      }
  }

  if (event.cannyId) {
    message.context.externalId = [
      {
        type: "cannyId",
        value: event.cannyId
      }
    ];
  }
  if (event.object?.author?.id || event.object?.post?.author?.id) {
    if (message.context.externalId) {
      message.context.externalId = message.context.externalId.push({
        type: "authorId",
        value: event.object?.author?.id || event.object?.post?.author?.id
      });
    } else {
      message.context.externalId = [
        {
          type: "authorId",
          value: event.object?.author?.id || event.object?.post?.author?.id
        }
      ];
    }
  }

  return message;
}
module.exports = { process };
