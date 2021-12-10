const path = require("path");
const fs = require("fs");
const Message = require("../message");

const mappingJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

const { removeUndefinedAndNullValues, isObject } = require("../../util");

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

    if (!isObject(message.context.device)) {
      message.context.device = {};
    }

    if (event.platform) {
      if (event.platform.toLowerCase() === "ios") {
        message.context.device.advertisingId = event.idfa;
      } else if (event.platform.toLowerCase() === "android") {
        message.context.device.advertisingId = event.android_id;
      }
      // remove idfa from message properties as it is already mapped.
      if (message.properties && message.properties.idfa !== undefined) {
        delete message.properties.idfa;
      }
      // remove android_id from message properties as it is already mapped.
      if (message.properties && message.properties.android_id !== undefined) {
        delete message.properties.android_id;
      }
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
      // remove appsflyer_id from message properties as it is already mapped.
      if (message.properties && message.properties.appsflyer_id !== undefined) {
        delete message.properties.appsflyer_id;
      }
    }

    if (message.userId && message.userId !== "") {
      return message;
    }
    return null;
  }
  throw new Error("Unknwon event type from Appsflyer");
}

function process(event) {
  const response = processEvent(event);
  const returnValue = removeUndefinedAndNullValues(response);
  return returnValue;
}

exports.process = process;
