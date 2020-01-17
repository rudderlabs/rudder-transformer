const get = require("get-value");
const { EventType } = require("../../constants");
const { destinationConfigKeys, endpoints } = require("./config");
const { categoriesList } = require("./data/eventMapping");
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues
} = require("../util");

function responseBuilder(payload, message, branchConfig) {
  let response = defaultRequestConfig();

  if (payload.event_data === null && payload.content_items === null) {
    response.method = defaultPostRequestConfig.requestMethod;
    response.endpoint = endpoints.customEventUrl;
  } else {
    response.method = defaultPostRequestConfig.requestMethod;
    response.endpoint = endpoints.standardEventUrl;
  }

  response.body.JSON = payload;
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
  for (let i = 0; i < categoriesList.length; i++) {
    const category = categoriesList[i];
    let requiredName = null;
    let requiredCategory = null;
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
}

function getUserData(message) {
  let context = message.context;

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
  let content_items = {};
  let event_data = {};
  let custom_data = {};

  let valFound = false;
  Object.keys(category.content_items).find(branchMappingProperty => {
    if (branchMappingProperty === rudderProperty) {
      let tmpKeyName = category.content_items[branchMappingProperty];
      content_items[tmpKeyName] = rudderPropertiesObj[rudderProperty];
      valFound = true;
    }
  });

  if (!valFound) {
    category.event_data.find(branchMappingProperty => {
      if (branchMappingProperty === rudderProperty) {
        let tmpKeyName = category.content_items[branchMappingProperty];
        event_data[tmpKeyName] = rudderPropertiesObj[rudderProperty];
        valFound = true;
      }
    });
  }

  if (!valFound) {
    custom_data[rudderProperty] = rudderPropertiesObj[rudderProperty];
  }
  return {
    content_itemsObj: content_items,
    event_dataObj: event_data,
    custom_dataObj: custom_data
  };
}

function commonPayload(message, rawPayload, category) {
  let rudderPropertiesObj;
  let content_items = [];
  let event_data = {};
  let custom_data = {};
  let productObj = {};

  switch (message.type) {
    case EventType.TRACK:
      rudderPropertiesObj = get(message, "properties")
        ? message.properties
        : null;
      break;
    case EventType.IDENTIFY:
      rudderPropertiesObj = get(message.context, "traits")
        ? message.context.traits
        : null;
      break;
  }

  Object.keys(rudderPropertiesObj).map(rudderProperty => {
    if (rudderProperty === "products") {
      productObj = {};
      for (let i = 0; i < rudderPropertiesObj.products.length; i++) {
        const product = rudderPropertiesObj.products[i];
        Object.keys(product).map(productProp => {
          const {
            content_itemsObj,
            event_dataObj,
            custom_dataObj
          } = mapPayload(category, productProp, product);
          Object.assign(productObj, content_itemsObj);
          Object.assign(event_data, event_dataObj);
          Object.assign(custom_data, custom_dataObj);
        });
        content_items.push(productObj);
        productObj = {};
      }
    } else {
      const { content_itemsObj, event_dataObj, custom_dataObj } = mapPayload(
        category,
        rudderProperty,
        rudderPropertiesObj
      );
      Object.assign(productObj, content_itemsObj);
      Object.assign(event_data, event_dataObj);
      Object.assign(custom_data, custom_dataObj);
    }
  });
  content_items.push(productObj);
  rawPayload.custom_data = custom_data;
  rawPayload.content_items = content_items;
  rawPayload.event_data = event_data;
  rawPayload.user_data = getUserData(message);

  Object.keys(rawPayload).map(key => {
    if (rawPayload[key] == {}) {
      rawPayload[key] = null;
    }
  });
  return removeUndefinedAndNullValues(rawPayload);
}

function getIdentifyPayload(message, branchConfig) {
  let rawPayload = {
    branch_key: branchConfig.BRANCH_KEY
  };
  const { name, category } = getCategoryAndName(message.userId);
  rawPayload.name = name;

  return commonPayload(message, rawPayload, category);
}

function getTrackPayload(message, branchConfig) {
  let rawPayload = {
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

function getDestinationKeys(message, destination) {
  let branchConfig = {};
  Object.keys(destination.Config).forEach(key => {
    switch (key) {
      case destinationConfigKeys.BRANCH_KEY:
        branchConfig.BRANCH_KEY = `${destination.Config[key]}`;
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
