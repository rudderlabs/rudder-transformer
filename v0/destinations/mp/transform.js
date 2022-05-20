const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  removeUndefinedValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  constructPayload,
  getBrowserInfo,
  getValuesAsArrayFromConfig,
  toUnixTimestamp,
  getTimeDifference,
  getErrorRespEvents,
  getSuccessRespEvents,
  CustomError,
  isAppleFamily,
  getFullName,
  extractCustomFields
} = require("../../util");
const {
  ConfigCategory,
  mappingConfig,
  MP_IDENTIFY_EXCLUSION_LIST
} = require("./config");

const mPIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];
const mPProfileAndroidConfigJson =
  mappingConfig[ConfigCategory.PROFILE_ANDROID.name];
const mPProfileIosConfigJson = mappingConfig[ConfigCategory.PROFILE_IOS.name];
const mPEventPropertiesConfigJson =
  mappingConfig[ConfigCategory.EVENT_PROPERTIES.name];

function getEventTime(message) {
  return new Date(message.timestamp).toISOString();
}

function responseBuilderSimple(parameters, message, eventType, destConfig) {
  let headers = {};
  let endpoint =
    destConfig.dataResidency === "eu"
      ? "https://api-eu.mixpanel.com/engage/"
      : "https://api.mixpanel.com/engage/";

  if (
    eventType !== EventType.IDENTIFY &&
    eventType !== EventType.GROUP &&
    eventType !== "revenue"
  ) {
    const duration = getTimeDifference(message.timestamp);
    if (duration.days <= 5) {
      endpoint =
        destConfig.dataResidency === "eu"
          ? "https://api-eu.mixpanel.com/track/"
          : "https://api.mixpanel.com/track/";
    } else if (duration.years > 5) {
      throw new CustomError(
        "Event timestamp should be within last 5 years",
        400
      );
    } else {
      endpoint =
        destConfig.dataResidency === "eu"
          ? "https://api-eu.mixpanel.com/import/"
          : "https://api.mixpanel.com/import/";
      if (destConfig.apiSecret) {
        headers = {
          Authorization: `Basic ${Buffer.from(
            `${destConfig.apiSecret}:`
          ).toString("base64")}`
        };
      } else {
        throw new CustomError(
          "Event timestamp is older than 5 days and no apisecret is provided in destination config.",
          400
        );
      }
    }
  }

  const encodedData = Buffer.from(
    JSON.stringify(removeUndefinedValues(parameters))
  ).toString("base64");

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.headers = headers;
  response.userId = message.anonymousId || message.userId;
  response.params = { data: encodedData };

  return response;
}

function processRevenueEvents(message, destination) {
  const revenueValue = get(message, "properties.revenue");
  const transactions = {
    $time: getEventTime(message),
    $amount: revenueValue
  };
  const parameters = {
    $append: { $transactions: transactions },
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId
  };

  return responseBuilderSimple(
    parameters,
    message,
    "revenue",
    destination.Config
  );
}

function getEventValueForTrackEvent(message, destination) {
  const mappedProperties = constructPayload(
    message,
    mPEventPropertiesConfigJson
  );
  const unixTimestamp = toUnixTimestamp(message.timestamp);
  // ??
  const properties = {
    ...message.properties,
    ...get(message, "context.traits"),
    ...mappedProperties,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: unixTimestamp
  };

  if (message.channel === "web" && message.context.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    properties.$browser = browser.name;
    properties.$browser_version = browser.version;
  }

  const parameters = {
    event: message.event,
    properties
  };

  return responseBuilderSimple(
    parameters,
    message,
    EventType.TRACK,
    destination.Config
  );
}

function processTrack(message, destination) {
  const returnValue = [];
  if (message.properties && message.properties.revenue) {
    returnValue.push(processRevenueEvents(message, destination));
  }
  returnValue.push(getEventValueForTrackEvent(message, destination));
  return returnValue;
}

function getTransformedJSON(message, mappingJson, useNewMapping) {
  let rawPayload = constructPayload(message, mappingJson);
  const userName = get(rawPayload, "$name");
  if (!userName) {
    set(rawPayload, "$name", getFullName(message));
  }

  rawPayload = extractCustomFields(
    message,
    rawPayload,
    ["traits", "context.traits"],
    MP_IDENTIFY_EXCLUSION_LIST
  );
  /*
  we are adding backward compatibility using useNewMapping key.
  TODO :: This portion need to be removed after we deciding to stop 
  support for old mapping.
  */

  if (!useNewMapping) {
    if (rawPayload.$first_name) {
      rawPayload.$firstName = rawPayload.$first_name;
      delete rawPayload.$first_name;
    }
    if (rawPayload.$last_name) {
      rawPayload.$lastName = rawPayload.$last_name;
      delete rawPayload.$last_name;
    }
  }

  return rawPayload;
}

function processIdentifyEvents(message, type, destination) {
  const returnValue = [];
  // this variable is used for supporting backward compatibility
  const { useNewMapping } = destination.Config;
  // user payload created
  let properties = getTransformedJSON(
    message,
    mPIdentifyConfigJson,
    useNewMapping
  );
  const device = get(message, "context.device");
  if (device && device.token) {
    let payload;
    if (isAppleFamily(device.type)) {
      payload = constructPayload(message, mPProfileIosConfigJson);
      properties.$ios_devices = [device.token];
    } else if (device.type.toLowerCase() === "android") {
      payload = constructPayload(message, mPProfileAndroidConfigJson);
      properties.$android_devices = [device.token];
    }
    properties = { ...properties, ...payload };
  }
  if (message.channel === "web" && message.context.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    properties.$browser = browser.name;
    properties.$browser_version = browser.version;
  }
  const unixTimestamp = toUnixTimestamp(message.timestamp);

  const parameters = {
    $set: properties,
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId,
    $ip: get(message, "context.ip") || message.request_ip,
    $time: unixTimestamp
  };
  if (message.context?.active === false) {
    parameters.$ignore_time = true;
  }
  returnValue.push(
    responseBuilderSimple(parameters, message, type, destination.Config)
  );

  if (message.userId && message.anonymousId && destination.Config.apiSecret) {
    // Use this block when our userids are changed to UUID V4.
    // const trackParameters = {
    //   event: "$identify",
    //   properties: {
    //     $identified_id: message.userId,
    //     $anon_id: message.anonymousId,
    //     token: destination.Config.token
    //   }
    // };
    // const identifyTrackResponse = responseBuilderSimple(
    //   trackParameters,
    //   message,
    //   type,
    //   destination.Config
    // );
    // identifyTrackResponse.endpoint =
    //   destination.Config.dataResidency === "eu"
    //     ? "https://api-eu.mixpanel.com/track/"
    //     : "https://api.mixpanel.com/track/";
    // returnValue.push(identifyTrackResponse);

    const trackParameters = {
      event: "$merge",
      properties: {
        $distinct_ids: [message.userId, message.anonymousId],
        token: destination.Config.token
      }
    };
    const identifyTrackResponse = responseBuilderSimple(
      trackParameters,
      message,
      type,
      destination.Config
    );

    identifyTrackResponse.endpoint =
      destination.Config.dataResidency === "eu"
        ? "https://api-eu.mixpanel.com/import/"
        : "https://api.mixpanel.com/import/";

    identifyTrackResponse.headers = {
      Authorization: `Basic ${Buffer.from(
        `${destination.Config.apiSecret}:`
      ).toString("base64")}`
    };
    returnValue.push(identifyTrackResponse);
  }

  return returnValue;
}

function processPageOrScreenEvents(message, type, destination) {
  const mappedProperties = constructPayload(
    message,
    mPEventPropertiesConfigJson
  );
  const unixTimestamp = toUnixTimestamp(message.timestamp);
  const properties = {
    ...get(message, "context.traits"),
    ...message.properties,
    ...mappedProperties,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: unixTimestamp
  };

  if (message.name) {
    properties.name = message.name;
  }
  if (message.category) {
    properties.category = message.category;
  }
  if (message.channel === "web" && message.context.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    properties.$browser = browser.name;
    properties.$browser_version = browser.version;
  }

  const eventName = type === "page" ? "Loaded a Page" : "Loaded a Screen";
  const parameters = {
    event: eventName,
    properties
  };
  return responseBuilderSimple(parameters, message, type, destination.Config);
}

function processAliasEvents(message, type, destination) {
  if (!(message.previousId || message.anonymousId)) {
    throw new CustomError(
      "Either previous id or anonymous id should be present in alias payload",
      400
    );
  }
  const parameters = {
    event: "$create_alias",
    properties: {
      distinct_id: message.previousId || message.anonymousId,
      alias: message.userId,
      token: destination.Config.token
    }
  };
  return responseBuilderSimple(parameters, message, type, destination.Config);
}

function processGroupEvents(message, type, destination) {
  const returnValue = [];
  const groupKeys = getValuesAsArrayFromConfig(
    destination.Config.groupKeySettings,
    "groupKey"
  );
  let groupKeyVal;
  if (groupKeys.length > 0) {
    groupKeys.forEach(groupKey => {
      groupKeyVal = get(message.traits, groupKey);
      if (groupKeyVal) {
        const parameters = {
          $token: destination.Config.token,
          $distinct_id: message.userId || message.anonymousId,
          $set: {
            [groupKey]: [get(message.traits, groupKey)]
          }
        };
        const response = responseBuilderSimple(
          parameters,
          message,
          type,
          destination.Config
        );
        returnValue.push(response);

        const groupParameters = {
          $token: destination.Config.token,
          $group_key: groupKey,
          $group_id: get(message.traits, groupKey),
          $set: {
            ...message.traits
          }
        };

        const groupResponse = responseBuilderSimple(
          groupParameters,
          message,
          type,
          destination.Config
        );

        groupResponse.endpoint =
          destination.Config.dataResidency === "eu"
            ? "https://api-eu.mixpanel.com/groups/"
            : "https://api.mixpanel.com/groups/";

        returnValue.push(groupResponse);
      }
    });
  } else {
    throw new CustomError("config is not supported", 400);
  }
  return returnValue;
}

function processSingleMessage(message, destination) {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  switch (message.type) {
    case EventType.TRACK:
      return processTrack(message, destination);
    case EventType.SCREEN:
    case EventType.PAGE: {
      return processPageOrScreenEvents(message, message.type, destination);
    }
    case EventType.IDENTIFY:
      return processIdentifyEvents(message, message.type, destination);
    case EventType.ALIAS:
      return processAliasEvents(message, message.type, destination);
    case EventType.GROUP:
      return processGroupEvents(message, message.type, destination);

    default:
      throw new CustomError("message type not supported", 400);
  }
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

// Documentation about how Mixpanel handles the utm parameters
// Ref: https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel
// Ref: https://help.mixpanel.com/hc/en-us/articles/115004561786-Track-UTM-Tags

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
