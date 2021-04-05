const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  removeUndefinedValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  getBrowserInfo,
  getValuesAsArrayFromConfig,
  toUnixTimestamp,
  getTimeDifference
} = require("../../util");
const { ConfigCategory, mappingConfig } = require("./config");

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
      throw new Error("Event timestamp should be within last 5 years");
    } else {
      endpoint =
        destConfig.dataResidency === "eu"
          ? "https://api-eu.mixpanel.com/import/"
          : "https://api.mixpanel.com/import/";
      if (destConfig.apiSecret) {
        headers = {
          Authorization: `Basic ${Buffer.from(destConfig.apiSecret).toString(
            "base64"
          )}`
        };
      } else {
        throw new Error(
          "Event timestamp is older than 5 days and no apisecret is provided in destination config."
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
  const revenueValue = message.properties.revenue;
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
  const properties = {
    ...message.properties,
    ...message.context.traits,
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

function getTransformedJSON(message, mappingJson) {
  const rawPayload = {};

  const sourceKeys = Object.keys(mappingJson);
  let traits = getFieldValueFromMessage(message, "traits");
  if (traits) {
    traits = { ...traits };
    const keys = Object.keys(traits);
    keys.forEach(key => {
      if (sourceKeys.includes(key)) {
        set(rawPayload, mappingJson[key], get(traits, key));
      } else {
        set(rawPayload, key, get(traits, key));
      }
    });
  }

  set(
    rawPayload,
    '$initial_referrer',
    get(message, "properties.initial_referrer")
  );
  set(
    rawPayload,
    '$initial_referring_domain',
    get(message, "properties.initial_referring_domain")
  );

  return rawPayload;
}

function processIdentifyEvents(message, type, destination) {
  const returnValue = [];

  let properties = getTransformedJSON(message, mPIdentifyConfigJson);
  const { device } = message.context;
  if (device && device.token) {
    let payload;
    if (device.type.toLowerCase() === "ios") {
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
    $ip: (message.context && message.context.ip) || message.request_ip,
    $time: unixTimestamp
  };
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
        destination.Config.apiSecret
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
    ...message.context.traits,
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

  const eventName = type === "page" ? "Loaded a page" : "Loaded a screen";
  const parameters = {
    event: eventName,
    properties
  };
  return responseBuilderSimple(parameters, message, type, destination.Config);
}

function processAliasEvents(message, type, destination) {
  if (!(message.previousId || message.anonymousId)) {
    throw new Error(
      "Either previous id or anonymous id should be present in alias payload"
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
    throw new Error("config is not supported");
  }
  return returnValue;
}

function processSingleMessage(message, destination) {
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
      throw new Error("message type not supported");
  }
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

exports.process = process;
