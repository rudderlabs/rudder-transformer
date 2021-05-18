/* eslint-disable no-prototype-builtins */
const Handlebars = require("handlebars");
const { EventType } = require("../../../constants");
const { EndPoints } = require("./config");
const { getHashFromArray } = require("../../util");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  getDestinationExternalID
} = require("../../util");

const getTemplate = (message, destination) => {
  const { eventTemplateMap } = destination.Config;
  const hashMap = getHashFromArray(eventTemplateMap, "from", "to", false);

  return (
    (message.event ? hashMap[message.event] : null) || hashMap["*"] || null
  );
};

const stringifyJSON = json => {
  let output = "";
  Object.keys(json).forEach(key => {
    if (json.hasOwnProperty(key)) {
      output += `${key}: ${json[key]} `;
    }
  });
  return output;
};

const responseBuilderSimple = (message, messageType, destination) => {
  let eventEndpoint;
  let payload;
  if (!destination.Config.channelId) {
    throw new Error(
      "[Trengo] :: Cound not process event, missing mandatory field channelId"
    );
  }
  const externalId = getDestinationExternalID(message, "trengo");
  if (messageType === EventType.IDENTIFY) {
    // create contact
  } else {
    // create ticket
    let subjectLine;
    if (destination.Config.channelIdentifier === "email") {
      const template = getTemplate(message, destination);
      if (!(template && template.length > 0)) {
        throw new Error(
          `[Trengo] :: Cound not process track events, template value not present - Template ${template}`
        );
      }
      const hTemplate = Handlebars.compile(template.trim());
      const templateInput = {
        event: message.event,
        properties: stringifyJSON(message.properties),
        ...message.properties
      };
      subjectLine = hTemplate(templateInput).trim();
    }

    payload = {
      contact_id: getFieldValueFromMessage(message, "userId"),
      channel_id: externalId || destination.Config.channelId,
      subject: subjectLine || message.event
    };
    eventEndpoint = EndPoints.createTicket;
  }
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = eventEndpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${destination.Config.apiToken}`
    };
    response.body.JSON = payload;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  if (messageType !== EventType.IDENTIFY && messageType !== EventType.TRACK) {
    throw new Error("Message type not supported");
  }
  return responseBuilderSimple(message, messageType, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
