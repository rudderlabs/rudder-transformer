/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable  array-callback-return */
const get = require('get-value');
const _ = require('lodash');
const { EventType, WhiteListedTraits, MappedToDestinationKey } = require('../../../constants');
const {
  CONFIG_CATEGORIES,
  BASE_ENDPOINT,
  MAPPING_CONFIG,
  ecomExclusionKeys,
  ecomEvents,
  eventNameMapping,
  jsonNameMapping,
  MAX_BATCH_SIZE,
} = require('./config');
const {
  createCustomerProperties,
  subscribeUserToList,
  generateBatchedPaylaodForArray,
  populateCustomFieldsFromTraits,
} = require('./util');
const {
  defaultRequestConfig,
  constructPayload,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  extractCustomFields,
  toUnixTimestamp,
  removeUndefinedAndNullValues,
  isEmptyObject,
  addExternalIdToTraits,
  adduserIdFromExternalId,
  defaultPatchRequestConfig,
  getSuccessRespEvents,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
} = require('../../util');

const { ConfigurationError, InstrumentationError, NetworkError } = require('../../util/errorTypes');
const { httpPOST } = require('../../../adapters/network');
const tags = require('../../util/tags');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
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
  const { privateApiKey, enforceEmailAsPrimary } = destination.Config;
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    addExternalIdToTraits(message);
    adduserIdFromExternalId(message);
  }
  const traitsInfo = getFieldValueFromMessage(message, 'traits');
  let profileId;
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
    delete propertyPayload.external_id;
    propertyPayload.properties._id = getFieldValueFromMessage(message, 'userId');
  }
  const data = {
    type: 'profile',
    attributes: propertyPayload,
    properties: removeUndefinedAndNullValues(customPropertyPayload),
  };
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
  const resp = await httpPOST(endpoint, payload, requestOptions);
  if (resp.response?.status === 201) {
    profileId = resp.response?.data?.data?.id;
  } else if (resp.response?.response?.status === 409) {
    const { response } = resp.response;
    profileId = response.data?.errors[0]?.meta?.duplicate_profile_id;
  } else {
    throw new NetworkError(
      `Failed to create user due to ${resp.response?.data}`,
      resp.response?.response?.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(resp.response?.response?.status),
      },
      resp.response?.data,
    );
  }

  // Update Profile
  const identifyResponse = defaultRequestConfig();
  payload.data.id = profileId;
  identifyResponse.endpoint = `${BASE_ENDPOINT}${category.apiUrl}/${profileId}`;
  identifyResponse.method = defaultPatchRequestConfig.requestMethod;
  identifyResponse.headers = {
    Authorization: `Klaviyo-API-Key ${privateApiKey}`,
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    revision: '2023-02-22',
  };
  identifyResponse.body.JSON = removeUndefinedAndNullValues(payload);
  const responseArray = [identifyResponse];
  if (traitsInfo?.properties?.subscribe) {
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
  let event = get(message, 'event');
  event = event ? event.trim().toLowerCase() : event;
  let attributes = {};
  if (ecomEvents.includes(event) && message.properties) {
    const eventName = eventNameMapping[event];
    const eventMap = jsonNameMapping[eventName];
    attributes.metric = { name: eventName };
    // using identify to create customer properties
    attributes.profile = createCustomerProperties(message);
    if (!attributes.profile.$email && !attributes.profile.$phone_number) {
      throw new InstrumentationError('email or phone is required for track call');
    }
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
    attributes = constructPayload(message, MAPPING_CONFIG[category.name]);
    const value =
      message.properties?.revenue || message.properties?.total || message.properties?.value;
    if (value) {
      attributes.value = value;
      if (attributes.properties) {
        if (attributes.properties.revenue) {
          delete attributes.properties.revenue;
        } else if (attributes.properties.total) {
          delete attributes.properties.total;
        } else if (attributes.properties.value) {
          delete attributes.properties.value;
        }
      }
    }
    attributes.properties = {
      ...attributes.properties,
      ...populateCustomFieldsFromTraits(message),
    };
    attributes.profile = createCustomerProperties(message);
  }
  if (message.timestamp) {
    attributes.time = toUnixTimestamp(message.timestamp);
  }
  payload.data = { type: 'event' };
  payload.data.attributes = attributes;
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}${category.apiUrl}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Klaviyo-API-Key ${destination.Config.privateApiKey}`,
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
  // let profile = constructPayload(message, MAPPING_CONFIG[category.name]);
  // profile = removeUndefinedAndNullValues(profile);
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

const batchEvents = (successRespList) => {
  const batchedResponseList = [];
  const identifyResponseList = [];
  successRespList.forEach((event) => {
    const processedEvent = event;
    if (processedEvent.message.length === 2) {
      identifyResponseList.push(event.message[0]);
      [processedEvent.message] = event.message.slice(1);
    } else {
      [processedEvent.message] = processedEvent.message;
    }
  });
  const subscribeEventGroups = _.groupBy(
    successRespList,
    (event) => event.message.body.JSON.data.attributes.list_id,
  );
  Object.keys(subscribeEventGroups).forEach((listId) => {
    // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const eventChunks = _.chunk(subscribeEventGroups[listId], MAX_BATCH_SIZE);
    eventChunks.forEach((chunk) => {
      const batchEventResponse = generateBatchedPaylaodForArray(chunk);
      batchedResponseList.push(
        getSuccessRespEvents(
          batchEventResponse.batchedRequest,
          batchEventResponse.metadata,
          batchEventResponse.destination,
          true,
        ),
      );
    });
  });
  identifyResponseList.forEach((response) => {
    batchedResponseList[0].batchedRequest.push(response);
  });
  return batchedResponseList;
};

// This function separates subscribe response and other responses in chunks
const getEventChunks = (event, subscribeRespList, otherRespList) => {
  if (Array.isArray(event.message)) {
    subscribeRespList.push(event);
  } else {
    otherRespList.push(event);
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
  const otherRespList = [];
  const { destination } = inputs[0];
  await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(
            { message: event.message, metadata: event.metadata, destination },
            subscribeRespList,
            otherRespList,
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
            otherRespList,
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
    batchedSubscribeResponseList = batchEvents(subscribeRespList);
  }
  const otherResponseList = [];
  otherRespList.forEach((resp) => {
    otherResponseList.push(getSuccessRespEvents(resp.message, [resp.metadata], resp.destination));
  });
  batchResponseList = batchResponseList.concat(batchedSubscribeResponseList, otherResponseList);

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
