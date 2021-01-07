const path = require("path");
const fs = require("fs");
const Message = require("../message");

const mappingJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

const { removeUndefinedAndNullValues } = require("../../util");

function processEvent(event) {
  const messageType = "track";

  if (event.event_name) {
    const eventName = event.event_name;
    const message = new Message(`AF`);

    message.setEventType(messageType);

    message.setEventName(eventName);

    const properties = { ...event };
    message.setProperty("properties", properties);

    // set fields in payload from mapping json
    message.setProperties(event, mappingJson);

    // Remove the fields from properties that are already mapped to other fields.
    Object.keys(mappingJson).forEach(key => {
      if (message.properties && message.properties[key] !== undefined) {
        delete message.properties[key];
      }
    });

    if (event.platform && event.platform.toLowerCase() === "ios") {
      message.context.device.advertisingId = event.idfa;
    } else if (event.platform && event.platform.toLowerCase() === "android") {
      message.context.device.advertisingId = event.android_id;
    }
    if (message.context.device.advertisingId) {
      message.context.device.adTrackingEnabled = true;
    }

    if (event.appsflyer_id) {
      message.context.externalId = [
        {
          type: "appsflyerExternalId",
          value: event.appsflyer_id
        }
      ];
    }

    if (message.userId && message.userId !== "") {
      return message;
    }
    return null;
  }
  throw new Error("Unknwon event type from Appsflyer");
}

function process(event) {
  let returnValue = {};
  const response = processEvent(event);
  returnValue = removeUndefinedAndNullValues(response);
  return returnValue;
}

exports.process = process;
