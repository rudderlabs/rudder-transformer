const md5 = require("md5");
const Message = require("../message");
const customMapping = require("./data/customMapping.json");
const identifyMapping = require("./data/identifyMapping.json");
const segmentMapping = require("./data/segmentMapping.json");
const engagementMapping = require("./data/engagementMapping.json");
const feedbackMapping = require("./data/feedbackMapping.json");
const surveyMapping = require("./data/surveyMapping.json");
const featureMatchMapping = require("./data/featureMatchMapping.json");
const segmentIoMapping = require("./data/segmentIOMapping.json");
const { refinePayload, refineTraitPayload } = require("./utils");
const { TransformationError } = require("../../util/errorTypes");

const buildIdentifyPayload = event => {
  let message = new Message(`GAINSIGHTPX`);
  message.setEventType("identify");
  message.setPropertiesV2(event, identifyMapping);
  message.traits = { ...message.traits, ...event.user.location };
  message = refineTraitPayload(message);
  const ts = new Date(event.user.signUpDate).toISOString();
  message.setProperty("createdAt", ts);
  message.setProperty("originalTimestamp", ts);
  return message;
};

// Ref: https://support.gainsight.com/PX/Integrations/01Technology_Partner_Integrations/Integrate_with_Gainsight_PX_Using_Webhooks
const buildTrackPayload = event => {
  const message = new Message(`GAINSIGHTPX`);
  message.setEventType("track");
  switch (event.event.eventType) {
    case "CUSTOM":
      message.setPropertiesV2(event, customMapping);
      break;
    case "FEEDBACK":
      message.setPropertiesV2(event, feedbackMapping);
      break;
    case "SEGMENT":
      message.setPropertiesV2(event, segmentMapping);
      break;
    case "SURVEY":
      message.setPropertiesV2(event, surveyMapping);
      break;
    case "ENGAGEMENT":
      message.setPropertiesV2(event, engagementMapping);
      break;
    case "FEATURE_MATCH":
      message.setPropertiesV2(event, featureMatchMapping);
      break;
    case "SEGMENT_IO":
      message.setPropertiesV2(event, segmentIoMapping);
      message.event = "SegmentIO Cloud Server";
      break;
    default:
      throw new TransformationError(
        `Event type ${event.event.eventType} not supported`
      );
  }
  const ts = new Date(event.event.date).toISOString();
  message.setProperty("sentAt", ts);
  message.setProperty("originalTimestamp", ts);
  message.context.traits = {
    ...message.context.traits,
    ...event.user.location
  };
  message.context = refineTraitPayload(message.context);
  return message;
};

function processEvent(event) {
  let message;
  if (event.event.eventType === "SIGN_UP") {
    message = buildIdentifyPayload(event);
  } else {
    message = buildTrackPayload(event);
  }
  const externalId = [];
  externalId.push({
    type: "gainsightpxAptrinsicId",
    id: event.user?.aptrinsicId
  });
  message.context.externalId = externalId;
  // setting anonymous id for failsafety from server
  if (!message?.userId) {
    message.anonymousId = event?.event?.sessionId
      ? event.event.sessionId
      : md5(event.user.email);
  }
  return message;
}

function process(event) {
  const response = processEvent(event);
  const returnValue = refinePayload(response);
  return returnValue;
}

exports.process = process;
