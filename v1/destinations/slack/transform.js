const Handlebars = require("handlebars");
const { EventType } = require("../../../constants");

const logger = require("../../../logger");

const { SLACK_RUDDER_IMAGE_URL, SLACK_USER_NAME } = require("./config");
const { defaultPostRequestConfig, defaultRequestConfig } = require("../../util");

// to string json traits, not using JSON.stringify()
// always first check for whitelisted traits
function stringifyJSON(json, whiteListedTraits) {
  let output = "";
  Object.keys(json).forEach(key => {
    if (json.hasOwnProperty(key)) {
      if (whiteListedTraits && whiteListedTraits.length > 0) {
        if (whiteListedTraits.includes(key)) {
          output += `${key}: ${json[key]} `;
        }
      } else {
        output += `${key}: ${json[key]} `;
      }
    }
  });
  logger.debug("traitsString:: ", output);
  return output;
}

// get the name value from either traits.name/traits.firstName+traits.lastName/traits.username/
// properties.email/traits.email/userId/anonymousId
function getName(message) {
  const { context, anonymousId, userId, properties } = message;
  const { traits } = context;
  const { name, firstName, lastName, username, email } = traits;
  const uName =
    name ||
    (firstName
      ? lastName
        ? `${firstName}${lastName}`
        : firstName
      : undefined) ||
    username ||
    (properties ? properties.email : undefined) ||
    email ||
    (userId ? `User ${userId}` : undefined) ||
    `Anonymous user ${anonymousId}`;

  logger.debug("final name::: ", uName);
  return uName;
}

// build the response to be sent to backend, url encoded header is required as slack accepts payload in this format
// add the username and image for Rudder
// image currently served from prod CDN
function buildResponse(payloadJSON, message, destination) {
  const endpoint = destination.Config.webhookUrl;
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = { "Content-Type": "application/x-www-form-urlencoded" };
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.FORM = {
    payload: JSON.stringify({
      ...payloadJSON,
      username: SLACK_USER_NAME,
      icon_url: SLACK_RUDDER_IMAGE_URL
    })
  };
  response.statusCode = 200;
  logger.debug(response);
  return response;
}

// build default identify template
// if whitelisted traits are present build on it else build the entire traits object
function buildDefaultTraitTemplate(traitsList, traits) {
  let templateString = "Identified {{name}} ";
  // build template with whitelisted traits
  traitsList.forEach(trait => {
    templateString += `${trait}: ` + `{{${trait}}} `;
  });
  // else with all traits
  if (traitsList.length == 0) {
    Object.keys(traits).forEach(traitKey => {
      if (traits.hasOwnProperty(traitKey)) {
        templateString += `${traitKey}: ` + `{{${traitKey}}} `;
      }
    });
  }
  return templateString;
}

function getWhiteListedTraits(destination, traitsList) {
  destination.Config.whitelistedTraitsSettings.forEach(whiteListTrait => {
    if (
      whiteListTrait.trait
        ? whiteListTrait.trait.trim().length != 0
          ? whiteListTrait.trait
          : undefined
        : undefined
    ) {
      traitsList.push(whiteListTrait.trait);
    }
  });
}

function processIdentify(message, destination) {
  // debug(JSON.stringify(destination));
  const identifyTemplateConfig = destination.Config.identifyTemplate;
  const traitsList = [];

  getWhiteListedTraits(destination, traitsList);

  logger.debug("defaulTraitsList:: ", traitsList);
  const uName = getName(message);

  // required traitlist ??
  /* if (!traitsList || traitsList.length == 0) {
    throw Error("traits list in config not present");
  } */

  const template = Handlebars.compile(
    (identifyTemplateConfig
      ? identifyTemplateConfig.trim().length == 0
        ? undefined
        : identifyTemplateConfig
      : undefined) ||
      buildDefaultTraitTemplate(
        traitsList,
        message.context ? message.context.traits : {}
      )
  );
  logger.debug(
    "identifyTemplateConfig: ",
    (identifyTemplateConfig
      ? identifyTemplateConfig.trim().length == 0
        ? undefined
        : identifyTemplateConfig
      : undefined) ||
      buildDefaultTraitTemplate(
        traitsList,
        message.context ? message.context.traits : {}
      )
  );

  // provide a fat input with flattened traits as well as traits object
  // helps the user to build additional handlebar expressions
  const templateInput = {
    name: uName,
    ...message.context.traits,
    traits: stringifyJSON(
      message.context ? message.context.traits : {},
      traitsList
    ),
    traitsList: message.context ? message.context.traits : {}
  };
  logger.debug("templateInputIdentify: ", templateInput);

  const resultText = template(templateInput);
  return buildResponse({ text: resultText }, message, destination);
}

function processTrack(message, destination) {
  // logger.debug(JSON.stringify(destination));
  const traitsList = [];
  const eventChannelConfig = destination.Config.eventChannelSettings;
  const eventTemplateConfig = destination.Config.eventTemplateSettings;

  const eventName = message.event;
  const channelListToSendThisEvent = new Set();
  const templateListForThisEvent = new Set();

  getWhiteListedTraits(destination, traitsList);

  // Add global context to regex always
  // build the channel list and templatelist for the event, pick the first in case of multiple
  // using set to filter out
  // document this behaviour

  // building channel list
  eventChannelConfig.forEach(channelConfig => {
    const configEventName = channelConfig.eventName
      ? channelConfig.eventName.trim().length > 0
        ? channelConfig.eventName
        : undefined
      : undefined;
    const configEventChannel = channelConfig.eventChannel
      ? channelConfig.eventChannel.trim().length > 0
        ? channelConfig.eventChannel
        : undefined
      : undefined;
    if (configEventName && configEventChannel) {
      if (channelConfig.eventRegex) {
        logger.debug(
          "regex: ",
          `${channelConfig.eventName} trying to match with ${eventName}`
        );
        logger.debug(
          "match:: ",
          channelConfig.eventName,
          eventName,
          eventName.match(new RegExp(channelConfig.eventName, "g"))
        );
        if (
          eventName.match(new RegExp(channelConfig.eventName, "g")) &&
          eventName.match(new RegExp(channelConfig.eventName, "g")).length > 0
        ) {
          channelListToSendThisEvent.add(channelConfig.eventChannel);
        }
      }
      if (channelConfig.eventName == eventName) {
        channelListToSendThisEvent.add(channelConfig.eventChannel);
      }
    }
  });

  const channelListArray = Array.from(channelListToSendThisEvent);

  // building templatelist
  eventTemplateConfig.forEach(templateConfig => {
    const configEventName = templateConfig.eventName
      ? templateConfig.eventName.trim().length > 0
        ? templateConfig.eventName
        : undefined
      : undefined;
    const configEventTemplate = templateConfig.eventTemplate
      ? templateConfig.eventTemplate.trim().length > 0
        ? templateConfig.eventTemplate
        : undefined
      : undefined;
    if (configEventName && configEventTemplate) {
      if (templateConfig.eventRegex) {
        if (
          eventName.match(new RegExp(templateConfig.eventName, "g")) &&
          eventName.match(new RegExp(templateConfig.eventName, "g")).length > 0
        ) {
          templateListForThisEvent.add(templateConfig.eventTemplate);
        }
      } else if (templateConfig.eventName == eventName) {
        templateListForThisEvent.add(templateConfig.eventTemplate);
      }
    }
  });

  const templateListArray = Array.from(templateListForThisEvent);

  logger.debug(
    "templateListForThisEvent: ",
    templateListArray,
    templateListArray.length > 0 ? templateListArray[0] : undefined
  );
  logger.debug("channelListToSendThisEvent: ", channelListArray);

  // track event default handlebar expression
  const defaultTemplate = "{{name}} did {{event}}";

  const eventTemplate = Handlebars.compile(
    templateListArray
      ? templateListArray.length > 0
        ? templateListArray[0]
        : defaultTemplate
      : defaultTemplate
  );

  // provide flattened properties as well as propertie sobject
  const templateInput = {
    name: getName(message),
    event: eventName,
    ...message.properties,
    properties: message.properties,
    propertiesList: stringifyJSON(message.properties || {}),
    traits: stringifyJSON(
      message.context ? message.context.traits : {},
      traitsList
    ),
    traitsList: message.context ? message.context.traits : {}
  };

  logger.debug("templateInputTrack: ", templateInput);

  const resultText = eventTemplate(templateInput);
  if (channelListArray && channelListArray.length > 0) {
    return buildResponse(
      { channel: channelListArray[0], text: resultText },
      message,
      destination
    );
  }
  return buildResponse({ text: resultText }, message, destination);
}

function process(event) {
  logger.info("=====start=====");
  logger.info(JSON.stringify(event));
  const respList = [];
  let response;
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();
  logger.debug("messageType: ", messageType);

  switch (messageType) {
    case EventType.IDENTIFY:
      response = processIdentify(message, destination);
      response.statusCode = 200;
      respList.push(response);
      break;
    case EventType.TRACK:
      response = processTrack(message, destination);
      response.statusCode = 200;
      respList.push(response);
      break;
    default:
      logger.debug("Message type not supported");
      throw new Error("Message type not supported");
  }
  logger.info(JSON.stringify(respList));
  logger.info("=====end======");
  return respList;
}

exports.process = process;
