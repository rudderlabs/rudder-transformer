const get = require("get-value");
const { EventType } = require("../../constants");
const { destinationConfigKeys, endpoints } = require("./config");
const { categoriesList } = require("./data/eventMapping");
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues
} = require("../util");

function responseBuilder(payload, message) {
  const response = defaultRequestConfig();

  if (payload.event_data === null && payload.content_items === null) {
    response.method = defaultPostRequestConfig.requestMethod;
    response.endpoint = endpoints.customEventUrl;
  } else {
    response.method = defaultPostRequestConfig.requestMethod;
    response.endpoint = endpoints.standardEventUrl;
  }

  response.body.JSON = removeUndefinedAndNullValues(payload);
  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    userId: message.userId ? message.userId : message.anonymousId
  };
}

function getCategoryAndName(rudderEventName) {
  for (let i = 0; i < categoriesList.length; i += 1) {
    const category = categoriesList[i];
    let requiredName = null;
    let requiredCategory = null;
    // TODO : fix lint error
    Object.keys(category.name).find(branchKey => {
      if (branchKey.toLowerCase() === rudderEventName.toLowerCase()) {
        requiredName = category.name[branchKey];
        requiredCategory = category;
      }
    });
    if (requiredName != null && requiredCategory != null) {
      return { name: requiredName, category: requiredCategory };
    }
  }
  return { name: rudderEventName, category: "custom" };
}

function getUserData(message) {
  const { context } = message;

  return removeUndefinedAndNullValues({
    os: context.os.name,
    os_version: context.os.version,
    app_version: context.app.version,
    screen_dpi: context.screen.density,
    android_id: get(context, "android_id") ? context.android_id : null,
    idfa: get(context, "idfa") ? context.android_id : null,
    idfv: get(context, "idfv") ? context.android_id : null,
    aaid: get(context, "aaid") ? context.android_id : null,
    developer_identity: message.userId || message.anonymousId
  });
}

function mapPayload(category, rudderProperty, rudderPropertiesObj) {
  const contentItems = {};
  const eventData = {};
  const customData = {};

  let valFound = false;
  // TODO : fix lint
  Object.keys(category.content_items).find(branchMappingProperty => {
    if (branchMappingProperty === rudderProperty) {
      const tmpKeyName = category.content_items[branchMappingProperty];
      contentItems[tmpKeyName] = rudderPropertiesObj[rudderProperty];
      valFound = true;
    }
  });

  if (!valFound) {
    // TODO : fix lint
    category.event_data.find(branchMappingProperty => {
      if (branchMappingProperty === rudderProperty) {
        const tmpKeyName = category.content_items[branchMappingProperty];
        eventData[tmpKeyName] = rudderPropertiesObj[rudderProperty];
        valFound = true;
      }
    });
  }

  if (!valFound) {
    customData[rudderProperty] = rudderPropertiesObj[rudderProperty];
  }

  return { contentItems, eventData, customData };
}

function commonPayload(message, rawPayload, category) {
  let rudderPropertiesObj;
  const contentItems = [];
  const eventData = {};
  const customData = {};
  let productObj = {};

  switch (message.type) {
    case EventType.TRACK:
      rudderPropertiesObj = message.properties;
      break;
    case EventType.IDENTIFY:
      rudderPropertiesObj = message.context.traits;
      break;
    default:
      break;
  }

  if (rudderPropertiesObj != null) {
    // TODO : fix lint
    Object.keys(rudderPropertiesObj).map(rudderProperty => {
      if (rudderProperty === "products") {
        productObj = {};
        for (let i = 0; i < rudderPropertiesObj.products.length; i += 1) {
          const product = rudderPropertiesObj.products[i];
          Object.keys(product).map(productProp => {
            const { eventData, customData } = mapPayload(
              category,
              productProp,
              product
            );
            Object.assign(productObj, content_itemsObj);
            Object.assign(eventData, event_dataObj);
            Object.assign(customData, custom_dataObj);
          });
          contentItems.push(productObj);
          productObj = {};
        }
      } else {
        const { content_itemsObj, event_dataObj, custom_dataObj } = mapPayload(
          category,
          rudderProperty,
          rudderPropertiesObj
        );
        Object.assign(productObj, content_itemsObj);
        Object.assign(eventData, event_dataObj);
        Object.assign(customData, custom_dataObj);
      }
    });
    contentItems.push(productObj);
    rawPayload.custom_data = customData;
    rawPayload.content_items = contentItems;
    rawPayload.event_data = eventData;
    rawPayload.user_data = getUserData(message);

    Object.keys(rawPayload).map(key => {
      if (Object.keys(rawPayload[key]).length == 0) {
        rawPayload[key] = null;
      }
    });
  }

  return rawPayload;
}

function getIdentifyPayload(message, branchConfig) {
  const rawPayload = {
    branch_key: branchConfig.BRANCH_KEY
  };
  const { name, category } = getCategoryAndName(message.userId);
  rawPayload.name = name;

  return commonPayload(message, rawPayload, category);
}

function getTrackPayload(message, branchConfig) {
  const rawPayload = {
    branch_key: branchConfig.BRANCH_KEY
  };
  const { name, category } = getCategoryAndName(message.event);
  rawPayload.name = name;

  return commonPayload(message, rawPayload, category);
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

function getDestinationKeys(destination) {
  const branchConfig = {};
  Object.keys(destination.Config).forEach(key => {
    switch (key) {
      case destinationConfigKeys.BRANCH_KEY:
        branchConfig.BRANCH_KEY = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
  return branchConfig;
}

function process(event) {
  const branchConfig = getDestinationKeys(event.destination);
  const properties = getTransformedJSON(event.message, branchConfig);
  return responseBuilder(properties, event.message);
}

exports.process = process;
