/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable  array-callback-return */
const get = require('get-value');
const { ConfigurationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const {
  batchEvents,
  constructProfile,
  subscribeUserToListV2,
  buildRequest,
  buildSubscriptionRequest,
} = require('./util');
const {
  constructPayload,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
  flattenJson,
} = require('../../util');

/**
 * Main Identify request handler func
 * The function is used to create/update new users and also for subscribing
 * users to the list.
 * DOCS: 1. https://developers.klaviyo.com/en/reference/create_or_update_profile
 *       2. https://developers.klaviyo.com/en/reference/subscribe_profiles
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns one object with keys profile and subscription(conditional) and values as objects
 */
const identifyRequestHandler = (message, category, destination) => {
  // If listId property is present try to subscribe/member user in list
  const { listId } = destination.Config;
  const payload = removeUndefinedAndNullValues(constructProfile(message, destination, true));
  const response = { profile: payload };
  const traitsInfo = getFieldValueFromMessage(message, 'traits');
  // check if user wants to subscribe profile or not and listId is present or not
  if (traitsInfo?.properties?.subscribe && (traitsInfo.properties?.listId || listId)) {
    response.subscription = subscribeUserToListV2(message, traitsInfo, destination);
  }
  // returning list if subscription to a list is to be done else returning an object to upsert profile
  return response;
};

/**
 * Main handler func for track/screen request
 * User info needs to be mapped to a track event (mandatory)
 * DOCS: https://developers.klaviyo.com/en/reference/create_event
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns event request
 */
const trackOrScreenRequestHandler = (message, category, destination) => {
  const { flattenProperties } = destination.Config;
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
  return { event: { data: { type: 'event', attributes } } };
};

/**
 * Main handlerfunc for group request  add/subscribe users to the list based on property sent
 * DOCS:https://developers.klaviyo.com/en/reference/subscribe_profiles
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns subscription object
 */
const groupRequestHandler = (message, category, destination) => {
  if (!message.groupId) {
    throw new InstrumentationError('groupId is a required field for group events');
  }
  const traitsInfo = getFieldValueFromMessage(message, 'traits');
  if (!traitsInfo?.subscribe) {
    throw new InstrumentationError('Subscribe flag should be true for group call');
  }

  return { subscription: subscribeUserToListV2(message, traitsInfo, destination) };
};

const processEvent = (event) => {
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

const processV2 = (event) => {
  const response = processEvent(event);
  const { destination } = event;
  const respList = [];
  if (response.profile) {
    respList.push(buildRequest(response.profile, destination, CONFIG_CATEGORIES.IDENTIFYV2));
  }
  if (response.subscription) {
    respList.push(
      buildSubscriptionRequest(response.subscription, destination, CONFIG_CATEGORIES.TRACKV2),
    );
  }
  if (response.event) {
    respList.push(buildRequest(response.event, destination, CONFIG_CATEGORIES.TRACKV2));
  }
  return respList;
};

// This function separates subscribe, proifle and event responses from process () and other responses in chunks
const getEventChunks = (input, subscribeRespList, profileRespList, eventRespList) => {
  if (input.payload.subscription) {
    subscribeRespList.push({ payload: input.payload.subscription, metadata: input.metadata });
  }
  if (input.payload.profile) {
    profileRespList.push({ payload: input.payload.profile, metadata: input.metadata });
  }
  if (input.payload.event) {
    eventRespList.push({ payload: input.payload.event, metadata: input.metadata });
  }
};

const processRouterDestV2 = (inputs, reqMetadata) => {
  let batchResponseList = [];
  const batchErrorRespList = [];
  const subscribeRespList = [];
  const profileRespList = [];
  const eventRespList = [];
  const { destination } = inputs[0];
  inputs.map((event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        getEventChunks(
          { message: event.message, metadata: event.metadata, destination },
          subscribeRespList,
          profileRespList,
          eventRespList,
        );
      } else {
        // if not transformed
        getEventChunks(
          {
            payload: processEvent(event),
            metadata: event.metadata,
          },
          subscribeRespList,
          profileRespList,
          eventRespList,
        );
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      batchErrorRespList.push(errRespEvent);
    }
  });
  const batchedResponseList = batchEvents(subscribeRespList, profileRespList, destination);
  // building and pushing all the event requests
  const eventRequestList = eventRespList.map((resp) => {
    const { payload, metadata } = resp;
    return getSuccessRespEvents(
      buildRequest(payload, destination, CONFIG_CATEGORIES.TRACKV2),
      [metadata],
      destination,
    );
  });

  batchResponseList = [...batchedResponseList, ...eventRequestList];

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { processV2, processRouterDestV2 };
