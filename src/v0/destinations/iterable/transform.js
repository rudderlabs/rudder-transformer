const _ = require('lodash');
const get = require('get-value');
const {
  getCatalogEndpoint,
  hasMultipleResponses,
  pageEventPayloadBuilder,
  trackEventPayloadBuilder,
  screenEventPayloadBuilder,
  getCategoryUsingEventName,
  purchaseEventPayloadBuilder,
  updateCartEventPayloadBuilder,
  updateUserEventPayloadBuilder,
  filterEventsAndPrepareBatchRequests,
  registerDeviceTokenEventPayloadBuilder,
  registerBrowserTokenEventPayloadBuilder,
} = require('./util');
const {
  constructPayload,
  defaultRequestConfig,
  checkInvalidRtTfEvents,
  defaultPostRequestConfig,
  handleRtTfSingleEventError,
  removeUndefinedAndNullValues,
  getDestinationExternalIDInfoForRetl,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { mappingConfig, ConfigCategory } = require('./config');
const { InstrumentationError } = require('../../util/errorTypes');
const { EventType, MappedToDestinationKey } = require('../../../constants');

/**
 * Common payload builder function for all events
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns
 */
const constructPayloadItem = (message, category, destination) => {
  let rawPayload = {};

  switch (category.action) {
    case 'identifyDevice':
      rawPayload = registerDeviceTokenEventPayloadBuilder(message);
      break;
    case 'identifyBrowser':
      rawPayload = registerBrowserTokenEventPayloadBuilder(message);
      break;
    case 'identify':
      rawPayload = updateUserEventPayloadBuilder(message, category);
      break;
    case 'page':
      rawPayload = pageEventPayloadBuilder(message, destination, category);
      break;
    case 'screen':
      rawPayload = screenEventPayloadBuilder(message, destination, category);
      break;
    case 'track':
      rawPayload = trackEventPayloadBuilder(message, category);
      break;
    case 'trackPurchase':
      rawPayload = purchaseEventPayloadBuilder(message, category);
      break;
    case 'updateCart':
      rawPayload = updateCartEventPayloadBuilder(message);
      break;
    case 'alias':
      rawPayload = constructPayload(message, mappingConfig[category.name]);
      break;
    case 'catalogs':
      rawPayload = constructPayload(message, mappingConfig[category.name]);
      rawPayload.catalogId = getDestinationExternalIDInfoForRetl(
        message,
        'ITERABLE',
      ).destinationExternalId;
      break;
    default:
      return removeUndefinedAndNullValues(rawPayload);
  }

  return removeUndefinedAndNullValues(rawPayload);
};

/**
 * Common response builder function for all events
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns
 */
const responseBuilder = (message, category, destination) => {
  const response = defaultRequestConfig();
  response.endpoint =
    category.action === 'catalogs' ? getCatalogEndpoint(category, message) : category.endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = constructPayloadItem(message, category, destination);
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    api_key: destination.Config.apiKey,
  };
  return response;
};

/**
 * Function to build response for register device and register browser events
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const responseBuilderForRegisterDeviceOrBrowserTokenEvents = (message, destination) => {
  const { device } = message.context;
  const category = device?.token ? ConfigCategory.IDENTIFY_DEVICE : ConfigCategory.IDENTIFY_BROWSER;
  return responseBuilder(message, category, destination);
};

/**
 * Function to find category value
 * @param {*} messageType
 * @param {*} message
 * @returns
 */
const getCategory = (messageType, message) => {
  const eventType = messageType.toLowerCase();

  switch (eventType) {
    case EventType.IDENTIFY:
      if (
        get(message, MappedToDestinationKey) &&
        getDestinationExternalIDInfoForRetl(message, 'ITERABLE').objectType !== 'users'
      ) {
        return ConfigCategory.CATALOG;
      }
      return ConfigCategory.IDENTIFY;
    case EventType.PAGE:
      return ConfigCategory.PAGE;
    case EventType.SCREEN:
      return ConfigCategory.SCREEN;
    case EventType.TRACK:
      return getCategoryUsingEventName(message);
    case EventType.ALIAS:
      return ConfigCategory.ALIAS;
    default:
      throw new InstrumentationError(`Message type ${eventType} not supported`);
  }
};

const process = (event) => {
  const { message, destination } = event;
  const messageType = message.type?.toLowerCase();
  const category = getCategory(messageType, message);
  const response = responseBuilder(message, category, destination);

  if (hasMultipleResponses(message, category)) {
    return [response, responseBuilderForRegisterDeviceOrBrowserTokenEvents(message, destination)];
  }

  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  let transformedEvents = await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          return {
            message: event.message,
            metadata: event.metadata,
            destination: event.destination,
          };
        }
        // if not transformed
        const transformedPayloads = [];
        let responses = await process(event);
        responses = Array.isArray(responses) ? responses : [responses];
        responses.forEach((response) => {
          transformedPayloads.push({
            message: response,
            metadata: event.metadata,
            destination: event.destination,
          });
        });
        return transformedPayloads;
      } catch (error) {
        return handleRtTfSingleEventError(event, error, reqMetadata);
      }
    }),
  );

  transformedEvents = _.flatMap(transformedEvents);
  return filterEventsAndPrepareBatchRequests(transformedEvents);
};

module.exports = { process, processRouterDest };
