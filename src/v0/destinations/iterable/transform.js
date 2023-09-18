const _ = require('lodash');
const get = require('get-value');
const {
  batchEvents,
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
      rawPayload = registerDeviceTokenEventPayloadBuilder(message, destination.Config);
      break;
    case 'identifyBrowser':
      rawPayload = registerBrowserTokenEventPayloadBuilder(message);
      break;
    case 'identify':
      rawPayload = updateUserEventPayloadBuilder(message, category, destination.Config);
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
      rawPayload = purchaseEventPayloadBuilder(message, category, destination.Config);
      break;
    case 'updateCart':
      rawPayload = updateCartEventPayloadBuilder(message, destination.Config);
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
  const response = responseBuilder(message, category, destination);
  response.headers.api_key = destination.Config.registerDeviceOrBrowserApiKey;
  return response;
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
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  const messageType = message.type.toLowerCase();
  const category = getCategory(messageType, message);
  const response = responseBuilder(message, category, destination);

  if (hasMultipleResponses(message, category, destination.Config)) {
    return [response, responseBuilderForRegisterDeviceOrBrowserTokenEvents(message, destination)];
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const batchedEvents = batchEvents(inputs);
  const response = await Promise.all(
    batchedEvents.map(async (listOfEvents) => {
      let transformedPayloads = await Promise.all(
        listOfEvents.map(async (event) => {
          try {
            if (event.message.statusCode) {
              // already transformed event
              return {
                message: event.message,
                metadata: event.metadata,
                destination: event.destination,
              };
            }

            /**
             * If not transformed
             *
             * responses = [e1_batched_event, e1_non_batched_event] or {e2}
             *
             * transformedPayloads =
             * [
             *   {
             *     message: e1_batched_message,
             *     metadata: m1,
             *     destination: {}
             *   },
             *   {
             *     message: e1_non_batched_message,
             *     metadata: m1,
             *     destination: {}
             *    }
             * ]
             *
             * or
             *
             * transformedPayloads =
             * [
             *   {
             *     message: e2_message,
             *     metadata: m2,
             *     destination: {}
             *   }
             * ]
             */

            const responses = process(event);
            const transformedPayloads = Array.isArray(responses) ? responses : [responses];
            return transformedPayloads.map((response) => ({
              message: response,
              metadata: event.metadata,
              destination: event.destination,
            }));
          } catch (error) {
            return handleRtTfSingleEventError(event, error, reqMetadata);
          }
        }),
      );

      /**
       * Before flat map : transformedPayloads = [{e1}, {e2}, [{e3}, {e4}, {e5}], {e6}]
       * After flat map : transformedPayloads = [{e1}, {e2}, {e3}, {e4}, {e5}, {e6}]
       */
      transformedPayloads = _.flatMap(transformedPayloads);
      return filterEventsAndPrepareBatchRequests(transformedPayloads);
    }),
  );

  // Flatten the response array containing batched events from multiple groups
  const allBatchedEvents = _.flatMap(response);

  return allBatchedEvents;
};

module.exports = { process, processRouterDest };
