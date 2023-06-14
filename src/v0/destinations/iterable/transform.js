const _ = require('lodash');
const get = require('get-value');
const {
  pageAction,
  trackAction,
  screenAction,
  identifyAction,
  updateCartAction,
  getCatalogEndpoint,
  trackPurchaseAction,
  identifyDeviceAction,
  identifyBrowserAction,
  filterEventsAndPrepareBatchRequests,
} = require('./util');
const { EventType, MappedToDestinationKey } = require('../../../constants');
const { mappingConfig, ConfigCategory } = require('./config');
const {
  constructPayload,
  defaultRequestConfig,
  removeUndefinedValues,
  checkInvalidRtTfEvents,
  defaultPostRequestConfig,
  handleRtTfSingleEventError,
  getDestinationExternalIDInfoForRetl,
} = require('../../util');
const logger = require('../../../logger');
const { InstrumentationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const constructPayloadItem = (message, category, destination) => {
  // const rawPayloadItemArr = [];
  let rawPayload = {};

  switch (category.action) {
    case 'identifyDevice':
      rawPayload = identifyDeviceAction(message);
      break;
    case 'identifyBrowser':
      rawPayload = identifyBrowserAction(message);
      break;
    case 'identify':
      rawPayload = identifyAction(message, category);
      break;
    case 'page':
      rawPayload = pageAction(message, destination, category);
      break;
    case 'screen':
      rawPayload = screenAction(message, destination, category);
      break;
    case 'track':
      rawPayload = trackAction(message, category);
      break;
    case 'trackPurchase':
      rawPayload = trackPurchaseAction(message, category);
      break;
    case 'updateCart':
      rawPayload = updateCartAction(message);
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
      logger.debug('not supported type');
  }

  return removeUndefinedValues(rawPayload);
};

const responseBuilderSimple = (message, category, destination) => {
  const response = defaultRequestConfig();
  response.endpoint =
    category.action === 'catalogs' ? getCatalogEndpoint(category, message) : category.endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = constructPayloadItem(message, category, destination);
  // adding operation to understand what type of event will be sent in batch
  if (category.action === 'catalogs') {
    response.operation = 'catalogs';
  }
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    api_key: destination.Config.apiKey,
  };
  return response;
};

const responseBuilderSimpleForIdentify = (message, category, destination) => {
  const response = defaultRequestConfig();
  const { os, device } = message.context;

  if (device) {
    response.endpoint = category.endpointDevice;
    response.body.JSON = constructPayloadItem(
      message,
      { ...category, action: category.actionDevice },
      destination,
    );
  } else if (os) {
    response.endpoint = category.endpointBrowser;
    response.body.JSON = constructPayloadItem(
      message,
      { ...category, action: category.actionBrowser },
      destination,
    );
  }

  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    api_key: destination.Config.apiKey,
  };
  return response;
};

const getCategoryUsingEventName = (event) => {
  let category;
  switch (event) {
    case 'order completed':
      category = ConfigCategory.TRACK_PURCHASE;
      break;
    case 'product added':
    case 'product removed':
      category = ConfigCategory.UPDATE_CART;
      break;
    default:
      category = ConfigCategory.TRACK;
  }
  return category;
};

const processSingleMessage = (message, destination) => {
  const messageType = message.type.toLowerCase();
  let category = {};
  let event;
  switch (messageType) {
    case EventType.IDENTIFY:
      if (
        get(message, MappedToDestinationKey) &&
        getDestinationExternalIDInfoForRetl(message, 'ITERABLE').objectType !== 'users'
      ) {
        // catagory will be catalog for any other object other than users
        // DOC: https://support.iterable.com/hc/en-us/articles/360033214932-Catalog-Overview
        category = ConfigCategory.CATALOG;
      } else {
        category = ConfigCategory.IDENTIFY;
      }
      break;
    case EventType.PAGE:
      category = ConfigCategory.PAGE;
      break;
    case EventType.SCREEN:
      category = ConfigCategory.SCREEN;
      break;
    case EventType.TRACK:
      event = message.event?.toLowerCase();
      category = getCategoryUsingEventName(event);
      break;
    case EventType.ALIAS:
      category = ConfigCategory.ALIAS;
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  const response = responseBuilderSimple(message, category, destination);

  if (
    message.type === EventType.IDENTIFY &&
    category === ConfigCategory.IDENTIFY &&
    message.context &&
    ((message.context.device && message.context.device.token) ||
      (message.context.os && message.context.os.token))
  ) {
    return [response, responseBuilderSimpleForIdentify(message, category, destination)];
  }

  return response;
};

const process = (event) => processSingleMessage(event.message, event.destination);

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
