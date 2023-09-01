/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable  array-callback-return */
const get = require('get-value');
const { EventType, WhiteListedTraits, MappedToDestinationKey } = require('../../../constants');
const {
  CONFIG_CATEGORIES,
  BASE_ENDPOINT,
  MAPPING_CONFIG,
  ecomExclusionKeys,
  ecomEvents,
  eventNameMapping,
  jsonNameMapping,
} = require('./config');
const {
  createCustomerProperties,
  subscribeUserToList,
  populateCustomFieldsFromTraits,
  batchSubscribeEvents,
  getIdFromNewOrExistingProfile,
  profileUpdateResponseBuilder,
} = require('./util');
const {
  defaultRequestConfig,
  constructPayload,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  extractCustomFields,
  removeUndefinedAndNullValues,
  isEmptyObject,
  addExternalIdToTraits,
  adduserIdFromExternalId,
  getSuccessRespEvents,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
  flattenJson,
} = require('../../util');

const { ConfigurationError, InstrumentationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * Main Identify request handler func
 * The function is used to create/update new users and also for adding/subscribing
 * members to the list depending on conditons.If listId is there member is added to that list &
 * if subscribe is true member is subscribed to that list else not.
 * DOCS: https://www.klaviyo.com/docs/http-api
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns
 */
const identifyRequestHandler = async (message, category, destination) => {
  // If listId property is present try to subscribe/member user in list
  const { privateApiKey, enforceEmailAsPrimary, flattenProperties } = destination.Config;
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    addExternalIdToTraits(message);
    adduserIdFromExternalId(message);
  }
  const traitsInfo = getFieldValueFromMessage(message, 'traits');
  let propertyPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  // Extract other K-V property from traits about user custom properties
  let customPropertyPayload = {};
  customPropertyPayload = extractCustomFields(
    message,
    customPropertyPayload,
    ['traits', 'context.traits'],
    WhiteListedTraits,
  );

  propertyPayload = removeUndefinedAndNullValues(propertyPayload);
  if (enforceEmailAsPrimary) {
    if (!propertyPayload.email && !propertyPayload.phone_number) {
      throw new InstrumentationError('None of email and phone are present in the payload');
    }
    delete propertyPayload.external_id;
    customPropertyPayload = {
      ...customPropertyPayload,
      _id: getFieldValueFromMessage(message, 'userId'),
    };
  }
  const data = {
    type: 'profile',
    attributes: {
      ...propertyPayload,
      properties: removeUndefinedAndNullValues(customPropertyPayload),
    },
  };
  // if flattenProperties is enabled from UI, flatten the user properties
  data.attributes.properties = flattenProperties
    ? flattenJson(data.attributes.properties, '.', 'normal', false)
    : data.attributes.properties;
  const payload = {
    data: removeUndefinedAndNullValues(data),
  };
  const endpoint = `${BASE_ENDPOINT}${category.apiUrl}`;
  const requestOptions = {
    headers: {
      Authorization: `Klaviyo-API-Key ${privateApiKey}`,
      accept: JSON_MIME_TYPE,
      'content-type': JSON_MIME_TYPE,
      revision: '2023-02-22',
    },
  };

  const profileId = await getIdFromNewOrExistingProfile(endpoint, payload, requestOptions);

  // Update Profile
  const responseArray = [profileUpdateResponseBuilder(payload, profileId, category, privateApiKey)];

  // check if user wants to subscribe profile or not and listId is present or not
  if (
    traitsInfo?.properties?.subscribe &&
    (traitsInfo.properties?.listId || destination.Config?.listId)
  ) {
    responseArray.push(subscribeUserToList(message, traitsInfo, destination));
    return responseArray;
  }
  return responseArray[0];
};

// ----------------------
// Main handler func for track request/screen request
// User info needs to be mapped to a track event (mandatory)
// DOCS: https://www.klaviyo.com/docs/http-api
// ----------------------

const trackRequestHandler = (message, category, destination) => {
  const payload = {};
  const { privateApiKey, flattenProperties } = destination.Config;
  let event = get(message, 'event');
  event = event ? event.trim().toLowerCase() : event;
  let attributes = {};
  if (ecomEvents.includes(event) && message.properties) {
    const eventName = eventNameMapping[event];
    const eventMap = jsonNameMapping[eventName];
    attributes.metric = { name: eventName };
    const categ = CONFIG_CATEGORIES[eventMap];
    attributes.properties = constructPayload(message.properties, MAPPING_CONFIG[categ.name]);
    attributes.properties = {
      ...attributes.properties,
      ...populateCustomFieldsFromTraits(message),
    };

    // products mapping using Items.json
    // mapping properties.items to payload.properties.items and using properties.products as a fallback to properties.items
    // properties.items is to be deprecated soon
    if (message.properties?.products || message.properties?.items) {
      const items = message.properties.items || message.properties.products;
      const itemArr = [];
      if (Array.isArray(items)) {
        items.forEach((key) => {
          let item = constructPayload(key, MAPPING_CONFIG[CONFIG_CATEGORIES.ITEMS.name]);
          item = removeUndefinedAndNullValues(item);
          if (!isEmptyObject(item)) {
            itemArr.push(item);
          }
        });
      }
      if (!attributes.properties) {
        payload.properties = {};
      }
      if (itemArr.length > 0) {
        attributes.properties.items = itemArr;
      }
    }

    // all extra props passed is incorporated inside properties
    let customProperties = {};
    customProperties = extractCustomFields(
      message,
      attributes.customProperties,
      ['properties'],
      ecomExclusionKeys,
    );
    if (!isEmptyObject(customProperties)) {
      attributes.properties = {
        ...attributes.properties,
        ...customProperties,
      };
    }

    if (isEmptyObject(attributes.properties)) {
      delete payload.properties;
    }
  } else {
    const value =
      message.properties?.revenue || message.properties?.total || message.properties?.value;
    attributes = constructPayload(message, MAPPING_CONFIG[category.name]);
    if (value) {
      attributes.value = value;
    }
    attributes.properties = {
      ...attributes.properties,
      ...populateCustomFieldsFromTraits(message),
    };
  }
  // if flattenProperties is enabled from UI, flatten the event properties
  attributes.properties = flattenProperties
    ? flattenJson(attributes.properties, '.', 'normal', false)
    : attributes.properties;
  // Map user properties to profile object
  attributes.profile = createCustomerProperties(message, destination.Config);
  if (message.timestamp) {
    attributes.time = message.timestamp;
  }
  payload.data = { type: 'event' };
  payload.data.attributes = attributes;
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}${category.apiUrl}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Klaviyo-API-Key ${privateApiKey}`,
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    revision: '2023-02-22',
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

// ----------------------
// Main handlerfunc for group request
// we will map user to list (subscribe and/or member)
// based on property sent
// DOCS: https://www.klaviyo.com/docs/api/v2/lists
// ----------------------
const groupRequestHandler = (message, category, destination) => {
  if (!message.groupId) {
    throw new InstrumentationError('groupId is a required field for group events');
  }
  if (!message.traits.subscribe) {
    throw new InstrumentationError('Subscribe flag should be true for group call');
  }

  const traitsInfo = getFieldValueFromMessage(message, 'traits');
  let response;
  if (traitsInfo?.subscribe) {
    response = subscribeUserToList(message, traitsInfo, destination);
  }
  return [response];
};

// Main event processor using specific handler funcs
const processEvent = async (message, destination) => {
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
      category = CONFIG_CATEGORIES.IDENTIFY;
      response = await identifyRequestHandler(message, category, destination);
      break;
    case EventType.SCREEN:
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      response = trackRequestHandler(message, category, destination);
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

const process = async (event) => {
  const result = await processEvent(event.message, event.destination);
  return result;
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

const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }
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
              message: await process(event),
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
  let batchedSubscribeResponseList = [];
  if (subscribeRespList.length > 0) {
    batchedSubscribeResponseList = batchSubscribeEvents(subscribeRespList);
  }
  const nonSubscribeSuccessList = nonSubscribeRespList.map((resp) =>
    getSuccessRespEvents(resp.message, [resp.metadata], resp.destination),
  );
  batchResponseList = [...batchedSubscribeResponseList, ...nonSubscribeSuccessList];

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
