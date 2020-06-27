const Handlebars = require("handlebars");
const { EventType } = require("../../../constants");

const logger = require("../../../logger");

const { SLACK_RUDDER_IMAGE_URL, SLACK_USER_NAME } = require("./config");
const { defaultPostRequestConfig, defaultRequestConfig } = require("../util");

// to string json traits, not using JSON.stringify()
// always first check for whitelisted traits
function stringifyJSON(json, whiteListedTraits) {
  let output = "";
  Object.keys(json).forEach(key => {
    if (whiteListedTraits && whiteListedTraits.length > 0) {
      if (whiteListedTraits.includes(key)) {
        output += `${key}: ${json[key]} `;
      }
    } else {
      output += `${key}: ${json[key]} `;
    }
  });
  logger.debug("traitsString:: ", output);
  return output;
}

// get the name value from either traits.name/traits.firstName+traits.lastName/traits.username/
// properties.email/traits.email/userId/anonymousId
function getName(message) {
  const { context, anonymousId, userId } = message;
  const { name, firstName, lastName, username } = context.traits;
  let uName;
  if (name) {
    uName = name;
  } else if (firstName) {
    if (lastName) {
      uName = `${firstName} ${lastName}`;
    } else {
      uName = `${firstName}`;
    }
  } else if (username) {
    uName = username;
  } else if (userId) {
    uName = `User ${userId}`;
  } else {
    uName = `Anonymous user ${anonymousId}`;
  }

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
    templateString += `${trait}: {{${trait}}}`;
  });
  // else with all traits
  if (traitsList.length === 0) {
    Object.keys(traits).forEach(traitKey => {
      templateString += `${traitKey}: {{${traitKey}}} `;
    });
  }
  return templateString;
}

function processIdentify(message, destination) {
  // debug(JSON.stringify(destination));
  const identifyTemplateConfig = destination.Config.identifyTemplate;
  const traitsList = [];
  destination.Config.whitelistedTraitsSettings.forEach(whiteListTrait => {
    if (whiteListTrait.trait && whiteListTrait.trait.trim().length !== 0) {
      traitsList.push(whiteListTrait.trait);
    }
  });
  logger.debug("defaulTraitsList:: ", traitsList);
  const uName = getName(message);

  // required traitlist ??
  /* if (!traitsList || traitsList.length == 0) {
    throw Error("traits list in config not present");
  } */

  let templateConfig;
  if (identifyTemplateConfig && identifyTemplateConfig.length > 0) {
    templateConfig = identifyTemplateConfig;
  }
  const template = Handlebars.compile(
    templateConfig ||
      buildDefaultTraitTemplate(traitsList, message.context || {})
  );
  logger.debug(
    "identifyTemplateConfig: ",
    templateConfig ||
      buildDefaultTraitTemplate(traitsList, message.context || {})
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
  const eventChannelConfig = destination.Config.eventChannelSettings;
  const eventTemplateConfig = destination.Config.eventTemplateSettings;

  const eventName = message.event;
  const channelListToSendThisEvent = new Set();
  const templateListForThisEvent = new Set();

  // Add global context to regex always
  // build the channel list and templatelist for the event, pick the first in case of multiple
  // using set to filter out
  // document this behaviour

  // building channel list
  eventChannelConfig.forEach(channelConfig => {
    let configEventName;
    if (channelConfig.eventName && channelConfig.eventName.trim().length > 0) {
      configEventName = channelConfig.eventName;
    }

    let configEventChannel;
    if (
      channelConfig.eventChannel &&
      channelConfig.eventChannel.trim().length > 0
    ) {
      configEventChannel = channelConfig.eventChannel;
    }

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
      if (channelConfig.eventName === eventName) {
        channelListToSendThisEvent.add(channelConfig.eventChannel);
      }
    }
  });

  const channelListArray = Array.from(channelListToSendThisEvent);

  // building templatelist
  eventTemplateConfig.forEach(templateConfig => {
    let configEventName;
    if (
      templateConfig.eventName &&
      templateConfig.eventName.trim().length > 0
    ) {
      configEventName = templateConfig.eventName;
    }

    let configEventTemplate;
    if (
      templateConfig.eventTemplate &&
      templateConfig.eventTemplate.trim().length > 0
    ) {
      configEventTemplate = templateConfig.eventTemplate;
    }

    if (configEventName && configEventTemplate) {
      if (templateConfig.eventRegex) {
        if (
          eventName.match(new RegExp(templateConfig.eventName, "g")) &&
          eventName.match(new RegExp(templateConfig.eventName, "g")).length > 0
        ) {
          templateListForThisEvent.add(templateConfig.eventTemplate);
        }
      } else if (templateConfig.eventName === eventName) {
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

  let templateList = defaultTemplate;
  if (templateListArray && templateListArray.length > 0) {
    [templateList] = templateListArray;
  }
  const eventTemplate = Handlebars.compile(templateList);

  // provide flattened properties as well as propertie sobject
  const templateInput = {
    name: getName(message),
    event: eventName,
    ...message.properties,
    properties: message.properties
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

function handleEvent(event) {
  logger.info("=====start=====");
  logger.info(JSON.stringify(event));
  let response;
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();
  logger.debug("messageType: ", messageType);

  switch (messageType) {
    case EventType.IDENTIFY:
      response = processIdentify(message, destination);
      response.statusCode = 200;
      break;
    case EventType.TRACK:
      response = processTrack(message, destination);
      response.statusCode = 200;
      break;
    default:
      logger.debug("Message type not supported");
      throw new Error("Message type not supported");
  }

  return response;
}

const process = event => {
  try {
    return handleEvent(event);
  } catch (error) {
    return {
      statusCode: 400,
      error: error.message || "Unkown error"
    };
  }
};

exports.process = process;
