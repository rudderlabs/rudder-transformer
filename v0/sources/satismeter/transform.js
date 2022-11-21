const md5 = require("md5");
const Message = require("../message");
const { refinePayload } = require("./utils");
const trackMapping = require("./data/trackMapping.json");

// Ref: https://support.gainsight.com/PX/Integrations/01Technology_Partner_Integrations/Integrate_with_Gainsight_PX_Using_Webhooks
const buildTrackPayload = event => {
  const message = new Message(`SATISMETER`);
  message.setEventType("track");
  message.setPropertiesV2(event, trackMapping);
  message.event = `Survey ${event.event}`;
  console.log("location:", event.response.location);
  return message;
};

function processEvent(event) {
  const message = buildTrackPayload(event);
  // making sure we are returning either userId or AnonymousId
  if (!message?.userId && !message?.anonymousId) {
    message.anonymousId = event?.response.Id
      ? event.response.id
      : md5(event.response.user.email);
  }
  return message;
}

function process(event) {
  // console.log("input: ", event);
  const response = processEvent(event);
  const returnValue = refinePayload(response);
  // console.log("output: ", returnValue);
  return returnValue;
}

exports.process = process;
