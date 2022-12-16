const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  DEFAULT_BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
} = require("./config");
const {
  defaultRequestConfig,
  getBrowserInfo,
  getDeviceModel,
  constructPayload,
  defaultPostRequestConfig,
  ErrorMessage,
  isValidUrl,
  stripTrailingSlash,
  isDefinedAndNotNull,
  removeUndefinedAndNullValues,
  getErrorRespEvents,
  getSuccessRespEvents,
  CustomError
} = require("../../util");

// Logic To match destination Property key that is in Rudder Stack Properties Object.
const generatePropertyDefination = message => {
  const PHPropertyJson = CONFIG_CATEGORIES.PROPERTY.name;
  const propertyJson = MAPPING_CONFIG[PHPropertyJson];
  let data = {};

  // Filter out property specific to mobile or web. isMobile key takes care of it.
  // Array Filter() will map propeerty on basis of given condition and filters it.
  // if (message.channel === "mobile") {
  //   propertyJson = propertyJson.filter(d => {
  //     return d.isMobile || d.all;
  //   });
  // } else {
  //   propertyJson = propertyJson.filter(d => {
  //     return !d.isMobile || d.all;
  //   });
  // }

  data = constructPayload(message, propertyJson);

  // This logic ensures to get browser info only for payload generated from web.
  if (
    message.channel === "web" &&
    message.context &&
    message.context.userAgent
  ) {
    const browser = getBrowserInfo(message.context.userAgent);
    const osInfo = getDeviceModel(message);
    data.$os = osInfo;
    data.$browser = browser.name;
    data.$browser_version = browser.version;
  }

  // For EventType Screen Posthog maps screen name to our event property.
  if (message.type === EventType.SCREEN) {
    data.$screen_name = message.event;
  }

  // Validate current url from payload and generate host form that url.
  const url = isValidUrl(data.$current_url);
  if (url) {
    data.$host = url.host;
  }

  // It pass the user traits in $set -> its an user Properties
  // For identify, we are mapping it from PHIdentifyConfig file.
  const userTraits = message.context?.traits;
  if (message.type.toLowerCase() !== EventType.IDENTIFY && userTraits) {
    data = {
      $set: userTraits,
      ...data
    };
  }

  return removeUndefinedAndNullValues(data);
};

const responseBuilderSimple = (message, category, destination) => {
  // This is to ensure backward compatibility of group calls.
  let payload;
  if (category.type === "group" && destination.Config.useV2Group) {
    payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.GROUPV2.name]
    );
  } else {
    payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  }
  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }

  payload.properties = {
    ...generatePropertyDefination(message),
    ...payload.properties
  };

  if (category.type === CONFIG_CATEGORIES.GROUP.type) {
    // This is to ensure groupType delete from $group_set, as it is properly mapped
    // in 'properties.$group_type'.
    if (destination.Config.useV2Group) {
      delete payload?.properties?.$group_set?.groupType;
    }
    // This will add the attributes $groups, which will associate the group with the user.
    if (payload.properties) {
      const groupType = get(payload, "properties.$group_type");
      const groupKey = get(payload, "properties.$group_key");
      if (groupType && groupKey) {
        payload.properties.$groups = {
          [groupType]: groupKey
        };
      }
    }
  }

  // Convert the distinct_id to string as that is the needed type in destinations.
  if (isDefinedAndNotNull(payload.distinct_id)) {
    payload.distinct_id = payload.distinct_id.toString();
  }
  if (
    payload.properties &&
    isDefinedAndNotNull(payload.properties.distinct_id)
  ) {
    payload.properties.distinct_id = payload.properties.distinct_id.toString();
  }

  // Mapping Destination Event with correct value
  if (category.type !== CONFIG_CATEGORIES.TRACK.type) {
    payload.event = category.event;
  }

  const responseBody = {
    ...payload,
    api_key: destination.Config.teamApiKey,
    type: category.type
  };
  const response = defaultRequestConfig();
  response.endpoint = `${stripTrailingSlash(destination.Config.yourInstance) ||
    DEFAULT_BASE_ENDPOINT}/batch`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.body.JSON = responseBody;
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(ErrorMessage.TypeNotFound, 400);
  }

  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  if (!category) {
    throw new CustomError(ErrorMessage.TypeNotSupported, 400);
  }

  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
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
