const get = require("get-value");
const { EventType } = require("../../constants");
const {
  Event,
  ConfigCategory,
  destinationConfigKeys,
  endpoints
} = require("./config");
const { EventConfig, payloadMapping } = require("./data/eventMapping");
const {
  defaultPostRequestConfig,
  removeUndefinedAndNullValues
} = require("../util");

function responseBuilder(payload, message, branchConfig) {
  let endpoint;
  let requestConfig;
  if (payload.event_data === null && payload.content_items === null) {
    requestConfig = defaultPostRequestConfig;
    endpoint = endpoints.customEventUrl;
  } else {
    requestConfig = defaultPostRequestConfig;
    endpoint = endpoints.standardEventUrl;
  }

  const response = {
    endpoint,
    header: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    requestConfig,
    userId: message.userId ? message.userId : message.anonymousId,
    payload: removeUndefinedAndNullValues(payload)
  };
  return response;
}

function getUserData(message) {
  let context = message.context;

  return {
    os: context.os.name,
    os_version: context.os.version,
    app_version: context.app.version,
    screen_dpi: context.screen.density,
    android_id: get(context, "android_id") ? context.android_id : null,
    idfa: get(context, "idfa") ? context.android_id : null,
    idfv: get(context, "idfv") ? context.android_id : null,
    aaid: get(context, "aaid") ? context.android_id : null,
    developer_identity: message.anonymousId
  };
}

function mapPayload(rudderPropetiesArr, rudderPropertiesObj, config) {
  let custom_data = {};
  let content_item = {};
  let event_data = {};

  rudderPropetiesArr.map(rudderKey => {
    const filteredKey = Object.keys(EventConfig[config]).find(key => {
      return key === rudderKey;
    });
    const desiredKey = EventConfig[config][filteredKey];

    switch (config) {
      case "TransactionEventConfig":
        if (!desiredKey || desiredKey === undefined) {
          custom_data[rudderKey] = rudderPropertiesObj[rudderKey];
        } else {
          event_data[desiredKey] = rudderPropertiesObj[rudderKey];
        }
        break;
      case "SharingEventConfig":
        if (!desiredKey || desiredKey === undefined) {
          custom_data[rudderKey] = rudderPropertiesObj[rudderKey];
        } else {
          content_item[desiredKey] = rudderPropertiesObj[rudderKey];
        }
        break;
      case "ProductEventConfig":
        if (!desiredKey || desiredKey === undefined) {
          custom_data[rudderKey] = rudderPropertiesObj[rudderKey];
        } else {
          content_item[desiredKey] = rudderPropertiesObj[rudderKey];
        }
        break;
      case "PaymentRelatedEventConfig":
        if (!desiredKey || desiredKey === undefined) {
          custom_data[rudderKey] = rudderPropertiesObj[rudderKey];
        } else {
          content_item[desiredKey] = rudderPropertiesObj[rudderKey];
        }
        break;
      case "EComGenericEventConfig":
        if (!desiredKey || desiredKey === undefined) {
          custom_data[rudderKey] = rudderPropertiesObj[rudderKey];
        } else {
          content_item[desiredKey] = rudderPropertiesObj[rudderKey];
        }
        break;

      default:
        custom_data[rudderKey] = rudderPropertiesObj[rudderKey];
        break;
    }
  });
  if (content_item == {} && event_data == {}) {
    content_item = null;
    event_data = null;
  }
  return {
    custom_data,
    content_item,
    event_data
  };
}

function getConfig(rudderEvent) {
  let requiredConfig;
  Object.keys(Event).map(obj => {
    if (Event[obj].name === rudderEvent) {
      requiredConfig = Event[obj].category.name;
    }
  });
  return requiredConfig;
}

function commonPayload(message, rawPayload, type) {
  let rudderPropetiesArr;
  let rudderPropertiesObj;

  switch (type) {
    case EventType.TRACK:
      rudderPropetiesArr = get(message, "properties")
        ? Object.keys(message.properties)
        : null;
      rudderPropertiesObj = message.properties;
      break;
    case EventType.IDENTIFY:
      rudderPropetiesArr = get(message.context, "traits")
        ? Object.keys(message.context.traits)
        : null;
      rudderPropertiesObj = message.context.traits;
      break;
  }

  const rudderEvent = message.event.toLowerCase();
  const payload = mapPayload(
    rudderPropetiesArr,
    rudderPropertiesObj,
    getConfig(rudderEvent)
  );
  rawPayload.custom_data = payload.custom_data;
  rawPayload.content_items = [payload.content_item];
  rawPayload.event_data = payload.event_data;
  rawPayload.user_data = getUserData(message);

  return rawPayload;
}

function getIdentifyPayload(message, branchConfig) {
  let rawPayload = {
    branch_key: branchConfig.BRANCH_KEY,
    name: updateNameValue(
      rawPayload,
      message.userId,
      payloadMapping.common.acceptedNames
    )
  };
  return commonPayload(message, rawPayload, message.type);
}

function getTrackPayload(message, branchConfig) {
  let rawPayload = {
    branch_key: branchConfig.BRANCH_KEY,
    name: updateNameValue(
      rawPayload,
      message.event,
      payloadMapping.common.acceptedNames
    )
  };
  return commonPayload(message, rawPayload, message.type);
}

function getTransformedJSON(message, branchConfig) {
  let rawPayload;
  switch (message.type) {
    case EventType.TRACK:
      rawPayload = getTrackPayload(message, branchConfig);
      break;
    case EventType.IDENTIFY:
      rawPayload = getIdentifyPayload(message, branchConfig);
      break;
    default:
      break;
  }
  return { ...rawPayload };
}

function getDestinationKeys(message, destination) {
  let branchConfig = {};
  const configKeys = Object.keys(destination.Config);
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.BRANCH_KEY:
        branchConfig.BRANCH_KEY = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.BRANCH_SECRET:
        branchConfig.BRANCH_SECRET = `${destination.Config[key]}`;
        break;
    }
  });
  return branchConfig;
}

function process(event) {
  const branchConfig = getDestinationKeys(event.message, event.destination);
  const properties = getTransformedJSON(event.message, branchConfig);
  return responseBuilder(properties, event.message, branchConfig);
}

exports.process = process;
