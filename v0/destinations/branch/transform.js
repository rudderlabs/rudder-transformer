const get = require("get-value");
const { EventType } = require("../../../constants");
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
    const categoryKeys = Object.keys(category.name);
    for (let index = 0; index < categoryKeys.length; index += 1) {
      const branchKey = categoryKeys[index];
      if (branchKey.toLowerCase() === rudderEventName.toLowerCase()) {
        requiredName = category.name[branchKey];
        requiredCategory = category;
        break;
      }
    }

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
    developer_identity: get(message, "anonymousId")
      ? message.anonymousId
      : message.userId
  });
}

function mapPayload(category, rudderProperty, rudderPropertiesObj) {
  const contentItems = {};
  const eventData = {};
  const customData = {};

  let valFound = false;
  const contentItemKeys = Object.keys(category.content_items);
  for (let index = 0; index < contentItemKeys; index += 1) {
    const branchMappingProperty = contentItemKeys[index];
    if (branchMappingProperty === rudderProperty) {
      const tmpKeyName = category.content_items[branchMappingProperty];
      contentItems[tmpKeyName] = rudderPropertiesObj[rudderProperty];
      valFound = true;
      break;
    }
  }

  if (!valFound) {
    for (let index = 0; index < category.event_data.length; index += 1) {
      const branchMappingProperty = category.event_data[index];
      if (branchMappingProperty === rudderProperty) {
        const tmpKeyName = category.content_items[branchMappingProperty];
        eventData[tmpKeyName] = rudderPropertiesObj[rudderProperty];
        valFound = true;
        break;
      }
    }
  }

  if (!valFound) {
    customData[rudderProperty] = rudderPropertiesObj[rudderProperty];
  }
  return { contentItems, eventData, customData };
}

function commonPayload(message, rawPayload, category) {
  const contentItemsParent = [];
  const eventDataParent = {};
  const customDataParent = {};
  const contentItemObj = {};

  let payloadProperties = {};
  let rudderPropertiesObj;

  switch (message.type) {
    case EventType.TRACK:
      rudderPropertiesObj = message.properties || null;
      break;
    case EventType.IDENTIFY:
      rudderPropertiesObj = message.context.traits || null;
      break;
    default:
      break;
  }

  if (rudderPropertiesObj) {
    const rudderPropertyKeys = Object.keys(rudderPropertiesObj);
    for (let index = 0; index < rudderPropertyKeys.length; index += 1) {
      const rudderPropertyKey = rudderPropertyKeys[index];
      if (rudderPropertyKey === "products") {
        const { products } = rudderPropertiesObj;
        for (let pIndex = 0; pIndex < products.length; pIndex += 1) {
          const product = products[pIndex];
          const productKeys = Object.keys(product);
          const productObj = {};
          for (
            let pKeyIndex = 0;
            pKeyIndex < productKeys.length;
            pKeyIndex += 1
          ) {
            const productKey = productKeys[pKeyIndex];
            const { contentItems, eventData, customData } = mapPayload(
              category,
              productKey,
              product
            );
            Object.assign(productObj, contentItems);
            Object.assign(eventDataParent, eventData);
            Object.assign(customDataParent, customData);
          }

          contentItemsParent.push(productObj);
        }
      } else {
        const { contentItems, eventData, customData } = mapPayload(
          category,
          rudderPropertyKey,
          rudderPropertiesObj
        );
        Object.assign(contentItemObj, contentItems);
        Object.assign(eventDataParent, eventData);
        Object.assign(contentItemsParent, customData);
      }
    }
    contentItemsParent.push(contentItemObj);

    payloadProperties = {
      custom_data: customDataParent,
      content_items: contentItemsParent,
      event_data: eventDataParent,
      user_data: getUserData(message)
    };

    Object.keys(payloadProperties).forEach(key => {
      if (Object.keys(payloadProperties[key]).length === 0) {
        payloadProperties[key] = null;
      }
    });
  }

  return { ...rawPayload, ...payloadProperties };
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
