/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable  array-callback-return */
const get = require('get-value');
const { ConfigurationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const { EventType, MappedToDestinationKey } = require('../../../constants');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const {
  constructProfile,
  subscribeOrUnsubscribeUserToListV2,
  buildRequest,
  buildSubscriptionOrUnsubscriptionPayload,
  getTrackRequests,
  fetchTransformedEvents,
  addSubscribeFlagToTraits,
} = require('./util');
const { batchRequestV2 } = require('./batchUtil');
const {
  constructPayload,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
  handleRtTfSingleEventError,
  addExternalIdToTraits,
  adduserIdFromExternalId,
  flattenJson,
  isDefinedAndNotNull,
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
  let traitsInfo = getFieldValueFromMessage(message, 'traits');
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    addExternalIdToTraits(message);
    adduserIdFromExternalId(message);
    traitsInfo = addSubscribeFlagToTraits(traitsInfo);
  }
  const payload = removeUndefinedAndNullValues(constructProfile(message, destination, true));
  const response = { profile: payload };
  // check if user wants to subscribe/unsubscribe profile or do nothing and listId is present or not
  if (
    isDefinedAndNotNull(traitsInfo?.properties?.subscribe) &&
    (traitsInfo.properties?.listId || listId)
  ) {
    response.subscription = subscribeOrUnsubscribeUserToListV2(
      message,
      traitsInfo,
      destination,
      traitsInfo.properties.subscribe ? 'subscribe' : 'unsubscribe',
    );
  }
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
 * Main handlerfunc for group request add/subscribe to or remove/delete users to the list based on property sent
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
  if (!isDefinedAndNotNull(traitsInfo?.subscribe)) {
    throw new InstrumentationError('Subscribe flag should be included in group call');
  }
  return {
    subscription: subscribeOrUnsubscribeUserToListV2(
      message,
      traitsInfo,
      destination,
      traitsInfo.subscribe ? 'subscribe' : 'unsubscribe',
    ),
  };
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
// {subscription:{}, event:{}, profile:{}}
const processV2 = (event) => {
  const response = processEvent(event);
  const { destination } = event;
  const respList = [];
  if (response.profile) {
    respList.push(buildRequest(response.profile, destination, CONFIG_CATEGORIES.IDENTIFYV2));
  }
  if (response.subscription) {
    respList.push(buildSubscriptionOrUnsubscriptionPayload(response.subscription, destination));
  }
  if (response.event) {
    respList.push(buildRequest(response.event, destination, CONFIG_CATEGORIES.TRACKV2));
  }
  return respList;
};

// This function separates subscribe, proifle and event responses from process () and other responses in chunks
const getEventChunks = (
  input,
  subscribeRespList,
  profileRespList,
  eventRespList,
  unsubscriptionList,
) => {
  if (input.payload.subscription) {
    if (input.payload.subscription.operation === 'subscribe') {
      subscribeRespList.push({ payload: input.payload.subscription, metadata: input.metadata });
    } else {
      unsubscriptionList.push({ payload: input.payload.subscription, metadata: input.metadata });
    }
  }
  if (input.payload.profile) {
    profileRespList.push({ payload: input.payload.profile, metadata: input.metadata });
  }
  if (input.payload.event) {
    eventRespList.push({ payload: input.payload.event, metadata: input.metadata });
  }
};

const processRouter = (inputs, reqMetadata) => {
  const batchResponseList = [];
  const batchErrorRespList = [];
  const subscribeRespList = [];
  const unsubscriptionList = [];
  const profileRespList = [];
  const eventRespList = [];
  const { destination } = inputs[0];
  inputs.map((event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        batchResponseList.push(fetchTransformedEvents(event));
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
          unsubscriptionList,
        );
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      batchErrorRespList.push(errRespEvent);
    }
  });
  const batchedResponseList = batchRequestV2(
    subscribeRespList,
    unsubscriptionList,
    profileRespList,
    destination,
  );
  const trackRespList = getTrackRequests(eventRespList, destination);

  batchResponseList.push(...trackRespList, ...batchedResponseList);

  return { successEvents: batchResponseList, errorEvents: batchErrorRespList };
};

module.exports = { processV2, processRouter };
