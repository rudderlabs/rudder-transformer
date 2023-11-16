const set = require('set-value');
const get = require('get-value');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  constructPayload,
  isDefinedAndNotNull,
  getIntegrationsObj,
  removeUndefinedAndNullValues,
  isDefinedAndNotNullAndNotEmpty,
  simpleProcessRouterDest,
} = require('../../util');
const { EventType } = require('../../../constants');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');

// This function handles the common response payload for the supported calls
const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const { authToken } = destination.Config;
  set(payload, 'auth_token', authToken);

  // channels is defined only for Identify call
  if (category.type === EventType.IDENTIFY) {
    const address = get(payload, 'channels.address');
    const platform = get(payload, 'channels.platform');

    // Vero only accepts a valid channels object - address, platform and type should be defined and not null
    // Added this block because channels & channels.device can be defined and not null, which should be removed
    if (!(isDefinedAndNotNull(address) && isDefinedAndNotNull(platform))) {
      delete payload.channels;
    }
  }

  // Setting required tag fields
  if (category.type === 'tags') {
    const integrationsObj = getIntegrationsObj(message, 'vero');
    const addTags = get(integrationsObj, 'tags.add');
    const removeTags = get(integrationsObj, 'tags.remove');
    set(payload, 'add', addTags);
    set(payload, 'remove', removeTags);
  }

  const response = defaultRequestConfig();
  response.endpoint = category.endpoint;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.method = category.method;

  return response;
};

// This block handles any tag addition or removal requests.
// Ref - https://developers.getvero.com/?bash#tags
const tagResponseBuilder = (message, category, destination) => {
  const integrationsObj = getIntegrationsObj(message, 'vero');
  const addTags = get(integrationsObj, 'tags.add');
  const removeTags = get(integrationsObj, 'tags.remove');
  let tagResponse = {};
  // Both add and remove should be an array and at least one should have a length > 0
  if (
    (Array.isArray(removeTags) && removeTags.length > 0) ||
    (Array.isArray(addTags) && addTags.length > 0)
  ) {
    const tagCategory = CONFIG_CATEGORIES.TAGS;
    tagResponse = responseBuilderSimple(message, tagCategory, destination);
  }

  return tagResponse;
};

// This function handles identify requests as well as addition-removal of tags.
// Identify Ref - https://developers.getvero.com/?bash#users-identify
const identifyResponseBuilder = (message, category, destination) => {
  const respList = [];
  const response = responseBuilderSimple(message, category, destination);
  respList.push(response);

  // Handling tags
  const tagResponse = tagResponseBuilder(message, category, destination);
  if (isDefinedAndNotNullAndNotEmpty(tagResponse)) {
    respList.push(tagResponse);
  }

  return respList;
};

// This function handles track requests as well as addition-removal of tags.
// Track Ref - https://developers.getvero.com/?bash#events-track
const trackResponseBuilder = (message, category, destination) => {
  const event = message.event.toLowerCase();
  if (event === 'unsubscribe' || event === 'resubscribe') {
    const eventCategory = CONFIG_CATEGORIES[message.event.toUpperCase()];
    return responseBuilderSimple(message, eventCategory, destination);
  }

  const respList = [];
  const response = responseBuilderSimple(message, category, destination);
  respList.push(response);

  // Handling tags
  const tagResponse = tagResponseBuilder(message, category, destination);
  if (isDefinedAndNotNullAndNotEmpty(tagResponse)) {
    respList.push(tagResponse);
  }

  return respList;
};

const process = async (event) => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const authToken = get(destination, 'Config.authToken');
  if (!authToken) {
    throw new ConfigurationError('Auth Token required for Authentication');
  }

  let response;
  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, CONFIG_CATEGORIES.TRACK, destination);
      break;
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, CONFIG_CATEGORIES.IDENTIFY, destination);
      break;
    case EventType.ALIAS:
      // Alias Ref - https://developers.getvero.com/?bash#users-alias
      response = responseBuilderSimple(message, CONFIG_CATEGORIES.ALIAS, destination);
      break;
    case EventType.PAGE:
    case EventType.SCREEN: {
      const eventCategory = get(message, 'properties.category');
      const name = get(message, 'name');
      const evtType = message.type.toLowerCase() === EventType.PAGE ? 'Page' : 'Screen';
      message.event = `Viewed ${eventCategory ? `${eventCategory} ` : ''}${
        name ? `${name} ` : ''
      }${evtType}`;
      response = responseBuilderSimple(message, CONFIG_CATEGORIES.TRACK, destination);
      break;
    }
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
