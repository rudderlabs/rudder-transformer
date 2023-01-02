/* eslint-disable no-nested-ternary */
/* eslint-disable no-prototype-builtins */
const Handlebars = require("handlebars");
const { EventType } = require("../../../constants");

const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  simpleProcessRouterDest
} = require("../../util");
const { InstrumentationError } = require("../../util/errorTypes");
const {
  stringifyJSON,
  getName,
  getWhiteListedTraits,
  buildDefaultTraitTemplate
} = require("../slack/util");

const getEmbed = (templateInput, destination, callType) => {
  // building titleTemplate
  let embedTitleTemplate = "";
  let titleTemplate;
  if (
    destination.Config?.embedTitleTemplate &&
    destination.Config.embedTitleTemplate.trim().length > 0
  ) {
    embedTitleTemplate = destination.Config.embedTitleTemplate.trim();
    titleTemplate = Handlebars.compile(embedTitleTemplate);
  }
  // building desription template
  let embedDescriptionTemplate = "";
  let descriptionTemplate;
  if (
    destination.Config?.embedDescriptionTemplate &&
    destination.Config.embedDescriptionTemplate.trim().length > 0
  ) {
    embedDescriptionTemplate = destination.Config.embedDescriptionTemplate.trim();
    descriptionTemplate = Handlebars.compile(embedDescriptionTemplate);
  }
  return {
    title:
      embedTitleTemplate.length > 0
        ? titleTemplate(templateInput)
        : "Message from Rudderstack ",
    description:
      embedDescriptionTemplate.length > 0
        ? descriptionTemplate(templateInput)
        : `${callType} call made`
  };
};

const buildResponse = (responseBody, destination) => {
  const endpoint = destination.Config.webhookUrl;
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = { "Content-Type": "application/json" };
  response.body.JSON = responseBody;
  return response;
};
const processIdentify = (message, destination) => {
  let identifyTemplateConfig;
  const defaultIdentifyTemplate = "Identified {{name}} with ";
  if (
    destination.Config?.identifyTemplate &&
    destination.Config.identifyTemplate.trim().length > 0
  ) {
    identifyTemplateConfig = destination.Config.identifyTemplate.trim();
  }

  const whiteTraitsList = getWhiteListedTraits(destination);

  const uName = getName(message);

  // provide a fat input with flattened traits as well as traits object
  // helps the user to build additional handlebar expressions
  const identityTraits = getFieldValueFromMessage(message, "traits") || {};

  const template = Handlebars.compile(
    identifyTemplateConfig ||
      buildDefaultTraitTemplate(
        whiteTraitsList,
        identityTraits,
        defaultIdentifyTemplate
      )
  );

  const templateInput = {
    name: uName,
    ...identityTraits,
    traits: stringifyJSON(identityTraits, whiteTraitsList),
    traitsList: identityTraits
  };

  const resultText = template(templateInput);
  //  constructing embed message
  if (destination?.Config?.embedFlag) {
    const embedMessage = getEmbed(templateInput, destination, "Identify");
    const response = {
      content: resultText,
      embeds: [embedMessage]
    };
    return buildResponse(response, destination);
  }
  const response = {
    content: resultText
  };
  return buildResponse(response, destination);
};

const processTrack = (message, destination) => {
  const eventTemplateConfig = destination.Config.eventTemplateSettings;

  if (!message.event) {
    throw new InstrumentationError("Event name is required");
  }
  const eventName = message.event;
  const templateListForThisEvent = new Set();

  const traitsList = getWhiteListedTraits(destination);

  /** Add global context to regex always
  build the templatelist for the event, pick the first in case of multiple
  using set to filter out
  document this behaviour
  */
  eventTemplateConfig.forEach(templateConfig => {
    // building templatelist
    let configEventName;
    let configEventTemplate;
    if (
      templateConfig.eventName &&
      templateConfig.eventName.trim().length > 0
    ) {
      configEventName = templateConfig.eventName.trim();
    }
    if (
      templateConfig.eventTemplate &&
      templateConfig.eventTemplate.trim().length > 0
    ) {
      configEventTemplate = templateConfig.eventTemplate.trim();
    }
    if (configEventName && configEventTemplate) {
      if (templateConfig.eventRegex) {
        if (
          eventName.match(new RegExp(configEventName, "g")) &&
          eventName.match(new RegExp(configEventName, "g")).length > 0
        ) {
          templateListForThisEvent.add(configEventTemplate);
        }
      } else if (configEventName === eventName) {
        templateListForThisEvent.add(configEventTemplate);
      }
    }
  });

  const templateListArray = Array.from(templateListForThisEvent);

  // track event default handlebar expression
  const defaultTemplate = "{{name}} did {{event}} with {{propertiesList}}";

  const eventTemplate = Handlebars.compile(
    templateListArray.length > 0 ? templateListArray[0] : defaultTemplate
  );

  // provide flattened properties as well as properties object
  const identityTraits = getFieldValueFromMessage(message, "traits") || {};
  const templateInput = {
    name: getName(message),
    event: eventName,
    ...message.properties,
    properties: message.properties,
    propertiesList: stringifyJSON(message.properties || {}),
    traits: stringifyJSON(identityTraits, traitsList),
    traitsList: identityTraits
  };

  const resultText = eventTemplate(templateInput);
  //  constructing embed message
  if (destination?.Config?.embedFlag) {
    const embedMessage = getEmbed(templateInput, destination, "Track");
    const response = {
      content: resultText,
      embeds: [embedMessage]
    };
    return buildResponse(response, destination);
  }
  const response = {
    content: resultText
  };
  return buildResponse(response, destination);
};

const process = event => {
  let response;
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
  }
  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.IDENTIFY:
      response = processIdentify(message, destination);
      return response;
    case EventType.TRACK:
      response = processTrack(message, destination);
      return response;
    default:
      throw new InstrumentationError(
        `Event type ${messageType} is not supported`
      );
  }
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
