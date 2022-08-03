const path = require("path");
const fs = require("fs");
const Message = require("../message");
const sha256 = require("sha256");
const { CustomError } = require("../../util");

// import mapping json using JSON.parse to preserve object key order
const voterMapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./voterMapping.json"), "utf-8")
);
const authorMapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./authorMapping.json"), "utf-8")
);

/**
 * This function throws an error if required fields are not present.
 * @param {*} message
 */
function checkForRequiredFields(message) {
  if (!message.event || !(message.userId || message.anonymousId)) {
    throw new CustomError("Missing essential fields from Canny.", 400);
  }
}

/**
 * This function is used for setting up userId and anonymousId.
 * @param {*} message
 * @param {*} event
 * @param {*} typeOfUser
 */
function settingIds(message, event, typeOfUser) {
  try {
    // setting up userId
    if (event.object[`${typeOfUser}`]?.userID) {
      message.userId = event.object[`${typeOfUser}`].userID;
    } else {
      // setting up anonymousId if userId is not present
      message.anonymousId = sha256(event.object[`${typeOfUser}`]?.email);
    }
  } catch (e) {
    throw new Error(`Missing essential fields from Canny. Error: (${e})`);
  }
}

/**
 * This function creates message for given type of user(i.e., voter or author).
 * @param {*} message
 * @param {*} typeOfUser
 * @returns message
 */
function createMessage(event, typeOfUser) {
  const message = new Message(`Canny`);

  message.setEventType("track");

  if (typeOfUser === "voter") {
    message.setPropertiesV2(event, voterMapping);
  } else {
    message.setPropertiesV2(event, authorMapping);
  }

  message.context.integration.version = "1.0.0";

  settingIds(message, event, typeOfUser);

  checkForRequiredFields(message);

  if (event.object[`${typeOfUser}`]?.id) {
    message.context.externalId = [
      {
        type: "cannyUserId",
        value: event.object[`${typeOfUser}`].id
      }
    ];
  }

  // deleting already mapped fields
  delete message.properties[`${typeOfUser}`];
  delete message.context.traits?.userID;
  delete message.context.traits?.id;

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
