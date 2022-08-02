const path = require("path");
const fs = require("fs");
const Message = require("../message");
const sha256 = require("sha256");

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

// creates message for given type of user(i.e., voter or author)
function createMessage(event, typeOfUser) {
  const message = new Message(`Canny`);

  message.setEventType("track");

  message.setPropertiesV2(event, mapping);

  message.context.integration.version = "1.0.0";
  try {
    if (event.object[`${typeOfUser}`]?.userID) {
      message.userId = event.object[`${typeOfUser}`].userID;
    } else {
      // setting up anonymousId if userId is not present
      message.anonymousId = sha256(event.object[`${typeOfUser}`]?.email);
    }

    if (event.object[`${typeOfUser}`]?.id) {
      message.context.externalId = [
        {
          type: "cannyUserId",
          value: event.object[`${typeOfUser}`].id
        }
      ];
    }

    message.context.traits = event.object[`${typeOfUser}`];

    // deleting already mapped fields
    delete message.properties[`${typeOfUser}`];
    delete message.context.traits?.userID;
    delete message.context.traits?.id;
  } catch (e) {
    throw new Error(`Missing essential fields from Canny. Error: (${e})`);
  }

  return message;
}

function process(event) {
  let typeOfUser;

  switch (event.type) {
    case "vote.created":
    case "vote.deleted":
      typeOfUser = "voter";
      break;

    default:
      typeOfUser = "author";
  }

  const message = createMessage(event, typeOfUser);

  return message;
}
module.exports = { process };
