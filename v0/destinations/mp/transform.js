/* eslint-disable eqeqeq */
/* eslint-disable vars-on-top */
/* eslint-disable block-scoped-var */
/* eslint-disable no-var */
const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  removeUndefinedValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  getBrowserInfo
} = require("../../util");
const { ConfigCategory, mappingConfig } = require("./config");

const mPIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];
const mPProfileAndroidConfigJson = mappingConfig[ConfigCategory.PROFILE_ANDROID.name];
const mPProfileIosConfigJson = mappingConfig[ConfigCategory.PROFILE_IOS.name];
const mPEventPropertiesConfigJson = mappingConfig[ConfigCategory.EVENT_PROPERTIES.name];

function getGroupKeys(config) {
  const groupKeys = [];
  const groupKeyConfig = config.groupKeySettings;
  if (
    groupKeyConfig &&
    Array.isArray(groupKeyConfig) &&
    groupKeyConfig.length > 0
  ) {
    let groupKey;
    groupKeyConfig.forEach(groupKeyObj => {
      groupKey = groupKeyObj["groupKey"];
      if (groupKey) {
        groupKeys.push(groupKey);
      }
    });
  }
  return groupKeys;
}

function getEventTime(message) {
  return new Date(message.originalTimestamp).toISOString();
}

function responseBuilderSimple(parameters, message, eventType, destConfig) {
  let endpoint =
    destConfig.dataResidency === "eu"
      ? "https://api-eu.mixpanel.com/engage/"
      : "https://api.mixpanel.com/engage/";

  if (
    eventType !== EventType.IDENTIFY &&
    eventType !== EventType.GROUP &&
    eventType !== "revenue"
  ) {
    endpoint =
      destConfig.dataResidency === "eu"
        ? "https://api-eu.mixpanel.com/track/"
        : "https://api.mixpanel.com/track/";
  }

  const encodedData = Buffer.from(
    JSON.stringify(removeUndefinedValues(parameters))
  ).toString("base64");

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.userId = message.anonymousId;
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
  const properties = {
    ...mappedProperties,
    ...message.properties,
    ...message.context.traits,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: message.timestamp
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
  getBrowserInfo(message.context.userAgent);
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
  return rawPayload;
}

function processIdentifyEvents(message, type, destination) {
  const returnValue = [];

  let properties = getTransformedJSON(message, mPIdentifyConfigJson);
  const { device } = message.context;
  if (device && device.token) {
    if (device.type.toLowerCase() === "ios") {
      var payload = constructPayload(message, mPProfileIosConfigJson);
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

  const parameters = {
    $set: properties,
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId,
    $ip: message.context.ip
  };
  returnValue.push(
    responseBuilderSimple(parameters, message, type, destination.Config)
  );

  if (message.userId && destination.Config.apiSecret) {
    // Use this block when our userids are changed to UUID V4.
    const trackParameters = {
      event: "$identify",
      properties: {
        $identified_id: message.userId,
        $anon_id: message.anonymousId,
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
        ? "https://api-eu.mixpanel.com/track/"
        : "https://api.mixpanel.com/track/";

    returnValue.push(identifyTrackResponse);

    /* const trackParameters = {
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
    returnValue.push(identifyTrackResponse); */
  }

  return returnValue;
}

function processPageOrScreenEvents(message, type, destination) {
  getBrowserInfo(message.context.userAgent);
  const properties = {
    ...message.properties,
    ...message.context.traits,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: message.timestamp
  };

  if (message.properties.name) {
    properties.page_name = message.properties.name;
  }
  if (message.channel === "web" && message.context.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    properties.$browser = browser.name;
    properties.$browser_version = browser.version;
  }

  const eventName = type == "page" ? "Loaded a page" : "Loaded a screen";
  const parameters = {
    event: eventName,
    properties
  };
  return responseBuilderSimple(parameters, message, type, destination.Config);
}

function processAliasEvents(message, type, destination) {
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
  const groupKeys = getGroupKeys(destination.Config);
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
