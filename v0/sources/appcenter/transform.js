const path = require("path");
const fs = require("fs");
const Message = require("../message");

const mappingJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

const { removeUndefinedAndNullValues } = require("../../util");

function processEvent(event) {
  const message = new Message(`APPCENTER`);
  message.setEventType("track");

  if (event.build_status && event.build_status === "Succeeded") {
    message.setEventName("Build Succeeded");
  } else if (event.build_status && event.build_status === "Broken") {
    message.setEventName("Build Failed");
  } else if (
    event.release_id &&
    event.release_id !== "" &&
    event.short_version &&
    event.short_version !== ""
  ) {
    message.setEventName(`Released Version ${event.short_version}`);
  } else if (
    event.id &&
    event.id !== "" &&
    event.reason &&
    event.reason !== ""
  ) {
    message.setEventName("App Crashed");
  } else {
    message.setEventName("Appcenter Test Event");
    // for now lets comment it but it should thrown an error saying unsupported event
    // throw new Error("Unknwon event type from Appcenter");
  }
  const properties = { ...event };
  message.setProperty("properties", properties);

  // set fields in payload from mapping json
  message.setPropertiesV2(event, mappingJson);

  return message;
}

function process(event) {
  const response = processEvent(event);
  const returnValue = removeUndefinedAndNullValues(response);
  // to make the server accept the request for now but need to decide on this
  //returnValue.anonymousId = "7e32188a4dab669f";
  return returnValue;
}

exports.process = process;
