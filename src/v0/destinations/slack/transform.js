/* eslint-disable no-nested-ternary, no-restricted-syntax, no-prototype-builtins */
const Handlebars = require('handlebars');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  stringifyJSON,
  getName,
  getWhiteListedTraits,
  buildDefaultTraitTemplate,
} = require('./util');
const logger = require('../../../logger');

const { SLACK_RUDDER_IMAGE_URL, SLACK_USER_NAME } = require('./config');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  simpleProcessRouterDest,
  isDefinedAndNotNull,
} = require('../../util');

// build the response to be sent to backend, url encoded header is required as slack accepts payload in this format
// add the username and image for Rudder
// image currently served from prod CDN
const buildResponse = (
  payloadJSON,
  message,
  destination,
  channelWebhook = null,
  sendAppNameAndIcon = true,
) => {
  const endpoint = channelWebhook || destination.Config.webhookUrl;
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  response.userId = message.userId ? message.userId : message.anonymousId;
  const payload =
    sendAppNameAndIcon === true
      ? JSON.stringify({
          ...payloadJSON,
          username: SLACK_USER_NAME,
          icon_url: SLACK_RUDDER_IMAGE_URL,
        })
      : JSON.stringify({
          ...payloadJSON,
        });
  response.body.FORM = {
    payload,
  };
  response.statusCode = 200;
  logger.debug(response);
  return response;
};

const processIdentify = (message, destination) => {
  const identifyTemplateConfig = destination.Config.identifyTemplate;
  const traitsList = getWhiteListedTraits(destination);
  const defaultIdentifyTemplate = 'Identified {{name}}';
  logger.debug('defaulTraitsList:: ', traitsList);
  const uName = getName(message);

  const template = Handlebars.compile(
    (identifyTemplateConfig
      ? identifyTemplateConfig.trim()?.length === 0
        ? undefined
        : identifyTemplateConfig
      : undefined) ||
      buildDefaultTraitTemplate(
        traitsList,
        getFieldValueFromMessage(message, 'traits'),
        defaultIdentifyTemplate || {},
      ),
  );
  logger.debug(
    'identifyTemplateConfig: ',
    (identifyTemplateConfig
      ? identifyTemplateConfig.trim()?.length === 0
        ? undefined
        : identifyTemplateConfig
      : undefined) ||
      buildDefaultTraitTemplate(
        traitsList,
        getFieldValueFromMessage(message, 'traits'),
        defaultIdentifyTemplate || {},
      ),
  );

  // provide a fat input with flattened traits as well as traits object
  // helps the user to build additional handlebar expressions
  const identityTraits = getFieldValueFromMessage(message, 'traits') || {};

  const templateInput = {
    name: uName,
    ...identityTraits,
    traits: stringifyJSON(identityTraits, traitsList),
    traitsList: identityTraits,
  };

  const resultText = template(templateInput);
  return buildResponse({ text: resultText }, message, destination);
};

const isEventNameMatchesRegex = (eventName, regex) => eventName.match(regex)?.length > 0;

const getChannelForEventName = (eventChannelSettings, eventName) => {
  for (const channelConfig of eventChannelSettings) {
    const configEventName =
      channelConfig?.eventName?.trim()?.length > 0 ? channelConfig.eventName : null;
    const channelWebhook =
      channelConfig?.eventChannelWebhook?.length > 0 ? channelConfig.eventChannelWebhook : null;

    if (configEventName && isDefinedAndNotNull(channelWebhook)) {
      if (channelConfig.eventRegex) {
        logger.debug('regex: ', `${configEventName} trying to match with ${eventName}`);
        logger.debug(
          'match:: ',
          configEventName,
          eventName,
          eventName.match(new RegExp(configEventName, 'g')),
        );
        if (isEventNameMatchesRegex(eventName, new RegExp(configEventName, 'g'))) {
          return channelWebhook;
        }
      } else if (channelConfig.eventName === eventName) {
        return channelWebhook;
      }
    }
  }
  return null;
};
const getChannelNameForEvent = (eventChannelSettings, eventName) => {
  for (const channelConfig of eventChannelSettings) {
    const configEventName =
      channelConfig?.eventName?.trim()?.length > 0 ? channelConfig.eventName : null;
    const configEventChannel =
      channelConfig?.eventChannel?.trim()?.length > 0 ? channelConfig.eventChannel : null;
    if (configEventName && configEventChannel) {
      if (channelConfig.eventRegex) {
        logger.debug('regex: ', `${configEventName} trying to match with ${eventName}`);
        logger.debug(
          'match:: ',
          configEventName,
          eventName,
          eventName.match(new RegExp(configEventName, 'g')),
        );
        if (isEventNameMatchesRegex(eventName, new RegExp(configEventName, 'g'))) {
          return configEventChannel;
        }
      } else if (configEventName === eventName) {
        return configEventChannel;
      }
    }
  }
  return null;
};

const buildtemplateList = (templateListForThisEvent, eventTemplateSettings, eventName) => {
  eventTemplateSettings.forEach((templateConfig) => {
    const configEventName =
      templateConfig?.eventName?.trim()?.length > 0 ? templateConfig.eventName : undefined;
    const configEventTemplate = templateConfig.eventTemplate
      ? templateConfig.eventTemplate.trim()?.length > 0
        ? templateConfig.eventTemplate
        : undefined
      : undefined;
    if (configEventName && configEventTemplate) {
      if (templateConfig.eventRegex) {
        if (isEventNameMatchesRegex(eventName, new RegExp(configEventName, 'g'))) {
          templateListForThisEvent.add(configEventTemplate);
        }
      } else if (configEventName === eventName) {
        templateListForThisEvent.add(configEventTemplate);
      }
    }
  });
};

const processTrack = (message, destination) => {
  // logger.debug(JSON.stringify(destination));
  const { Config } = destination;
  const { eventChannelSettings, eventTemplateSettings, incomingWebhooksType, denyListOfEvents } =
    Config;
  const eventName = message.event;

  if (!eventName) {
    throw new InstrumentationError('Event name is required');
  }
  if (denyListOfEvents?.length > 0) {
    const denyListofEvents = denyListOfEvents.map((item) => item.eventName);
    if (denyListofEvents.includes(eventName)) {
      throw new ConfigurationError('Event is denied. Please check configuration.');
    }
  }

  const templateListForThisEvent = new Set();
  const traitsList = getWhiteListedTraits(destination);

  /* Add global context to regex always
   * build the channel list and template list for the event, pick the first in case of multiple
   * using set to filter out
   * document this behaviour
   */

  // getting specific channel for event if available

  let channelWebhook;
  let channelName;
  if (incomingWebhooksType && incomingWebhooksType === 'modern') {
    channelWebhook = getChannelForEventName(eventChannelSettings, eventName);
  } else {
    // default
    channelName = getChannelNameForEvent(eventChannelSettings, eventName);
  }

  // building templatelist
  buildtemplateList(templateListForThisEvent, eventTemplateSettings, eventName);
  const templateListArray = Array.from(templateListForThisEvent);

  logger.debug(
    'templateListForThisEvent: ',
    templateListArray,
    templateListArray.length > 0 ? templateListArray[0] : undefined,
  );
  // track event default handlebar expression
  const defaultTemplate = '{{name}} did {{event}}';
  const template = templateListArray
    ? templateListArray.length > 0
      ? templateListArray[0]
      : defaultTemplate
    : defaultTemplate;

  const eventTemplate = Handlebars.compile(template);

  // provide flattened properties as well as propertie sobject
  const identityTraits = getFieldValueFromMessage(message, 'traits') || {};
  const templateInput = {
    name: getName(message),
    event: eventName,
    ...message.properties,
    properties: message.properties,
    propertiesList: stringifyJSON(message.properties || {}),
    traits: stringifyJSON(identityTraits, traitsList),
    traitsList: identityTraits,
  };

  logger.debug('templateInputTrack: ', templateInput);

  let resultText;
  try {
    resultText = eventTemplate(templateInput);
  } catch (err) {
    throw new ConfigurationError(`Something is wrong with the event template: '${template}'`);
  }
  if (incomingWebhooksType === 'modern' && channelWebhook) {
    return buildResponse({ text: resultText }, message, destination, channelWebhook, false);
  }
  if (channelName) {
    return buildResponse(
      { channel: channelName, text: resultText },
      message,
      destination,
      channelWebhook,
    );
  }
  return buildResponse({ text: resultText }, message, destination);
};

const process = (event) => {
  logger.debug('=====start=====');
  logger.debug(JSON.stringify(event));
  const respList = [];
  let response;
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  const messageType = message.type.toLowerCase();
  logger.debug('messageType: ', messageType);

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
      logger.debug('Message type not supported');
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  logger.debug(JSON.stringify(respList));
  logger.debug('=====end======');
  return respList;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
