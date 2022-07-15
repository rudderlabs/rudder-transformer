/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable  array-callback-return */
const get = require("get-value");
const {
  EventType,
  WhiteListedTraits,
  MappedToDestinationKey
} = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  BASE_ENDPOINT,
  MAPPING_CONFIG,
  ecomExclusionKeys,
  ecomEvents,
  eventNameMapping,
  jsonNameMapping
} = require("./config");
const {
  isProfileExist,
  checkForMembersAndSubscribe,
  createCustomerProperties
} = require("./util");
const {
  defaultRequestConfig,
  constructPayload,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  extractCustomFields,
  toUnixTimestamp,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  isEmptyObject,
  addExternalIdToTraits,
  adduserIdFromExternalId,
  defaultPutRequestConfig
} = require("../../util");

// ---------------------
// Main Identify request handler func
// internally it uses axios if membership and(or)
// subscription is enabled for that user to
// specific List.
// DOCS: https://www.klaviyo.com/docs/http-api
// ---------------------
const identifyRequestHandler = async (message, category, destination) => {
  // If listId property is present try to subscribe/member user in list
  const traitsInfo = getFieldValueFromMessage(message, "traits");
  const response = defaultRequestConfig();
  const personId = await isProfileExist(message, destination);
  if (!personId) {
    const mappedToDestination = get(message, MappedToDestinationKey);
    if (mappedToDestination) {
      addExternalIdToTraits(message);
      adduserIdFromExternalId(message);
    }
    // actual identify call
    let propertyPayload = constructPayload(
      message,
      MAPPING_CONFIG[category.name]
    );
    // Extract other K-V property from traits about user custom properties
    propertyPayload = extractCustomFields(
      message,
      propertyPayload,
      ["traits", "context.traits"],
      WhiteListedTraits
    );
    propertyPayload = removeUndefinedAndNullValues(propertyPayload);
    if (destination.Config.enforceEmailAsPrimary) {
      delete propertyPayload.$id;
      propertyPayload._id = getFieldValueFromMessage(message, "userId");
    }

    const payload = {
      token: destination.Config.publicApiKey,
      properties: propertyPayload
    };
    response.endpoint = `${BASE_ENDPOINT}${category.apiUrl}`;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Accept: "text/html"
    };
    response.body.JSON = removeUndefinedAndNullValues(payload);
  } else {
    const propertyPayload = constructPayload(
      message,
      MAPPING_CONFIG[category.name]
    );
    response.endpoint = `${BASE_ENDPOINT}/api/v1/person/${personId}`;
    response.method = defaultPutRequestConfig.requestMethod;
    response.headers = {
      Accept: "application/json"
    };
    response.params = removeUndefinedAndNullValues(propertyPayload);
    response.params.api_key = destination.Config.privateApiKey;
  }
  const responseArray = [response];
  responseArray.push(
    ...checkForMembersAndSubscribe(message, traitsInfo, destination)
  );
  return responseArray;
};

// ----------------------
// Main handler func for track request/screen request
// User info needs to be mapped to a track event (mandatory)
// DOCS: https://www.klaviyo.com/docs/http-api
// ----------------------

const trackRequestHandler = (message, category, destination) => {
  let payload = {};
  let event = get(message, "event");
  event = event ? event.trim().toLowerCase() : event;
  if (ecomEvents.includes(event) && message.properties) {
    const eventName = eventNameMapping[event];
    payload.event = eventName;
    payload.token = destination.Config.publicApiKey;
    const eventMap = jsonNameMapping[eventName];
    // using identify to create customer properties
    payload.customer_properties = createCustomerProperties(message);
    if (
      !payload.customer_properties.$email &&
      !payload.customer_properties.$phone_number
    ) {
      throw new CustomError(
        "email or phone is required for customer_properties",
        400
      );
    }
    const categ = CONFIG_CATEGORIES[eventMap];
    payload.properties = constructPayload(
      message.properties,
      MAPPING_CONFIG[categ.name]
    );

    // products mapping using Items.json
    if (message.properties.items && Array.isArray(message.properties.items)) {
      const itemArr = [];
      message.properties.items.forEach(key => {
        let item = constructPayload(
          key,
          MAPPING_CONFIG[CONFIG_CATEGORIES.ITEMS.name]
        );
        item = removeUndefinedAndNullValues(item);
        if (!isEmptyObject(item)) {
          itemArr.push(item);
        }
      });
      if (!payload.properties) {
        payload.properties = {};
      }
      payload.properties.items = itemArr;
    }

    // all extra props passed is incorporated inside properties
    let customProperties = {};
    customProperties = extractCustomFields(
      message,
      customProperties,
      ["properties"],
      ecomExclusionKeys
    );
    if (!isEmptyObject(customProperties)) {
      payload.properties = {
        ...payload.properties,
        ...customProperties
      };
    }

    if (isEmptyObject(payload.properties)) {
      delete payload.properties;
    }
  } else {
    payload = constructPayload(message, MAPPING_CONFIG[category.name]);
    payload.token = destination.Config.publicApiKey;
    if (message.properties && message.properties.revenue) {
      payload.properties.$value = message.properties.revenue;
      delete payload.properties.revenue;
    }
    const customerProperties = createCustomerProperties(message);
    if (destination.Config.enforceEmailAsPrimary) {
      delete customerProperties.$id;
      customerProperties._id = getFieldValueFromMessage(message, "userId");
    }
    payload.customer_properties = customerProperties;
  }
  if (message.timestamp) {
    payload.time = toUnixTimestamp(message.timestamp);
  }
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}${category.apiUrl}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Accept: "text/html"
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
const groupRequestHandler = async (message, category, destination) => {
  const targetUrl = `${BASE_ENDPOINT}/api/v2/list/${get(
    message,
    "groupId"
  )}/subscribe`;
  let profile = constructPayload(message, MAPPING_CONFIG[category.name]);
  // Extract other K-V property from traits about user custom properties
  const groupWhitelistedTraits = [
    ...WhiteListedTraits,
    ...["consent", "smsConsent", "subscribe"]
  ];
  profile = extractCustomFields(
    message,
    profile,
    ["traits", "context.traits"],
    groupWhitelistedTraits
  );
  profile = removeUndefinedAndNullValues(profile);
  if (destination.Config.enforceEmailAsPrimary) {
    delete profile.$id;
    profile._id = getFieldValueFromMessage(message, "userId");
  }
  const responseArray = [];
  if (get(message.traits, "subscribe") === true) {
    // If consent info not present draw it from dest config
    if (!profile.sms_consent) {
      profile.sms_consent = destination.Config.smsConsent;
    }
    if (!profile.$consent) {
      profile.$consent = destination.Config.consent;
    }
    // send network request
    const payload = {
      profiles: [profile]
    };
    const subscribeResponse = defaultRequestConfig();
    subscribeResponse.endpoint = targetUrl;
    subscribeResponse.headers = {
      "Content-Type": "application/json"
    };
    subscribeResponse.body.JSON = payload;
    subscribeResponse.method = defaultPostRequestConfig.requestMethod;
    subscribeResponse.params = { api_key: destination.Config.privateApiKey };
    responseArray.push(subscribeResponse);
  }
  delete profile.sms_consent;
  delete profile.$consent;
  const payload = {
    profiles: [profile]
  };
  const membersResponse = defaultRequestConfig();
  membersResponse.endpoint = `${BASE_ENDPOINT}/api/v2/list/${get(
    message,
    "groupId"
  )}/members`;
  membersResponse.headers = {
    "Content-Type": "application/json"
  };
  membersResponse.body.JSON = payload;
  membersResponse.method = defaultPostRequestConfig.requestMethod;
  membersResponse.params = { api_key: destination.Config.privateApiKey };
  responseArray.push(membersResponse);
  return responseArray;
};

// Main event processor using specific handler funcs
const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
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
      response = await groupRequestHandler(message, category, destination);
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }
  return response;
};

const process = async event => {
  const result = await processEvent(event.message, event.destination);
  return result;
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
