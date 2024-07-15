/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable  array-callback-return */
const get = require('get-value');
const { ConfigurationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const { CONFIG_CATEGORIES, BASE_ENDPOINT, MAPPING_CONFIG, revision } = require('./config');
const { batchSubscribeEvents, constructProfile, subscribeUserToListV2 } = require('./util');
const {
  defaultRequestConfig,
  constructPayload,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
  flattenJson,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * Main Identify request handler func
 * The function is used to create/update new users and also for subscribing
 * users to the list.
 * DOCS: 1. https://developers.klaviyo.com/en/reference/create_or_update_profile
 *       2. https://developers.klaviyo.com/en/reference/subscribe_profiles
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns
 */
const identifyRequestHandler = (message, category, destination) => {
  // If listId property is present try to subscribe/member user in list
  const { privateApiKey, listId } = destination.Config;
  const payload = removeUndefinedAndNullValues(constructProfile(message, destination, true));
  const endpoint = `${BASE_ENDPOINT}${category.apiUrl}`;
  const requestOptions = {
    headers: {
      Authorization: `Klaviyo-API-Key ${privateApiKey}`,
      Accept: JSON_MIME_TYPE,
      'Content-Type': JSON_MIME_TYPE,
      revision,
    },
  };
  const profileRequest = defaultRequestConfig();
  profileRequest.endpoint = endpoint;
  profileRequest.body.JSON = payload;
  profileRequest.headers = requestOptions.headers;
  let responseList = profileRequest;
  const traitsInfo = getFieldValueFromMessage(message, 'traits');
  // check if user wants to subscribe profile or not and listId is present or not
  if (traitsInfo?.properties?.subscribe && (traitsInfo.properties?.listId || listId)) {
    responseList = [responseList, subscribeUserToListV2(message, traitsInfo, destination)];
  }
  // returning list if subscription to a list is to be done else returning an object to upsert profile
  return responseList;
};

/**
 * Main handler func for track/screen request
 * User info needs to be mapped to a track event (mandatory)
 * DOCS: https://developers.klaviyo.com/en/reference/create_event
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns requestBody
 */
const trackOrScreenRequestHandler = (message, category, destination) => {
  const payload = {};
  const { privateApiKey, flattenProperties } = destination.Config;
  // event for track and name for screen call
  const event = get(message, 'event') || get(message, 'name');
  if (event && typeof event !== 'string') {
    throw new InstrumentationError('Event type should be a string');
  }
  const attributes = constructPayload(message, MAPPING_CONFIG[category.name]);

  // if flattenProperties is enabled from UI, flatten the event properties
  attributes.properties = flattenProperties
    ? flattenJson(attributes.properties, '.', 'normal', false)
    : attributes.properties;

  // get profile object
  attributes.profile = removeUndefinedAndNullValues(constructProfile(message, destination, false));
  attributes.metric = {
    data: {
      type: 'metric',
      attributes: {
        name: event,
      },
    },
  };
  payload.data = { type: 'event', attributes };
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}${category.apiUrl}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Klaviyo-API-Key ${privateApiKey}`,
    Accept: JSON_MIME_TYPE,
    'Content-Type': JSON_MIME_TYPE,
    revision,
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

/**
 * Main handlerfunc for group request  add/subscribe users to the list based on property sent
 * DOCS:https://developers.klaviyo.com/en/reference/subscribe_profiles
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns
 */
const groupRequestHandler = (message, category, destination) => {
  if (!message.groupId) {
    throw new InstrumentationError('groupId is a required field for group events');
  }
  const traitsInfo = getFieldValueFromMessage(message, 'traits');
  if (!traitsInfo?.subscribe) {
    throw new InstrumentationError('Subscribe flag should be true for group call');
  }

  return [subscribeUserToListV2(message, traitsInfo, destination)];
};

const processV2 = async (event) => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  if (!destination.Config.privateApiKey) {
    throw new ConfigurationError(`Private API Key is a required field for ${message.type} events`);
  }
  const messageType = message.type.toLowerCase();

  let category;
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFYV2;
      response = identifyRequestHandler(message, category, destination);
      break;
    case EventType.SCREEN:
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACKV2;
      response = trackOrScreenRequestHandler(message, category, destination);
      break;
    case EventType.GROUP:
      category = CONFIG_CATEGORIES.GROUP;
      response = groupRequestHandler(message, category, destination);
      break;
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

// This function separates subscribe response and other responses in chunks
const getEventChunks = (event, subscribeRespList, nonSubscribeRespList) => {
  if (Array.isArray(event.message)) {
    // this list contains responses for subscribe endpoint
    subscribeRespList.push(event);
  } else {
    // this list doesn't contain subsribe endpoint responses
    nonSubscribeRespList.push(event);
  }
};

const processRouterDestV2 = async (inputs, reqMetadata) => {
  let batchResponseList = [];
  const batchErrorRespList = [];
  const subscribeRespList = [];
  const nonSubscribeRespList = [];
  const { destination } = inputs[0];
  await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(
            { message: event.message, metadata: event.metadata, destination },
            subscribeRespList,
            nonSubscribeRespList,
          );
        } else {
          // if not transformed
          getEventChunks(
            {
              message: await processV2(event),
              metadata: event.metadata,
              destination,
            },
            subscribeRespList,
            nonSubscribeRespList,
          );
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        batchErrorRespList.push(errRespEvent);
      }
    }),
  );
  const batchedSubscribeResponseList = [];
  if (subscribeRespList.length > 0) {
    const batchedResponseList = batchSubscribeEvents(subscribeRespList, 'v2');
    batchedSubscribeResponseList.push(...batchedResponseList);
  }
  const nonSubscribeSuccessList = nonSubscribeRespList.map((resp) => {
    const response = resp;
    const { message, metadata, destination: eventDestination } = response;
    return getSuccessRespEvents(message, [metadata], eventDestination);
  });

  batchResponseList = [...batchedSubscribeResponseList, ...nonSubscribeSuccessList];

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { processV2, processRouterDestV2 };
