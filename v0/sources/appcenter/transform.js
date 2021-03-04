const path = require("path");
const fs = require("fs");
const Message = require("../message");

const mappingJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

const { removeUndefinedAndNullValues } = require("../../util");

function guidGenerator() {
  const S4 = function() {
    // eslint-disable-next-line no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

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

  // app center does not has the concept of user but we need to set some random anonymousId in order to make the server accept the message
  message.anonymousId = guidGenerator();
  return message;
}

function process(event) {
  const response = processEvent(event);
  const returnValue = removeUndefinedAndNullValues(response);
  // to bypass the unit testcases ( we may change this)
  // returnValue.anonymousId = "7e32188a4dab669f";
  return returnValue;
}

exports.process = process;
