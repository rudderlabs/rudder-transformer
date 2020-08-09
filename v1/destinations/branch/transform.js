const get = require("get-value");
const { EventType } = require("../../../constants");
const { endpoints } = require("./config");
const { categoriesList } = require("./data/eventMapping");
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage
} = require("../../util");

function responseBuilder(payload, message, destination) {
  const response = defaultRequestConfig();

  if (payload.event_data === null && payload.content_items === null) {
    response.method = defaultPostRequestConfig.requestMethod;
    response.endpoint = endpoints.customEventUrl;
  } else {
    response.method = defaultPostRequestConfig.requestMethod;
    response.endpoint = endpoints.standardEventUrl;
  }

  response.body.JSON = removeUndefinedAndNullValues({
    ...payload,
    branch_key: destination.Config.branchKey
  });

  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    userId: message.anonymousId
  };
}

function getCategoryAndName(rudderEventName) {
  for (let i = 0; i < categoriesList.length; i += 1) {
    const category = categoriesList[i];
    let requiredName = null;
    let requiredCategory = null;
    // eslint-disable-next-line array-callback-return
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
    developer_identity: getFieldValueFromMessage(message, "userId")
  });
}

function mapPayload(category, rudderProperty, rudderPropertiesObj) {
  const content_items = {};
  const event_data = {};
  const custom_data = {};

  let valFound = false;
  if (category.content_items) {
    Object.keys(category.content_items).find(branchMappingProperty => {
      if (branchMappingProperty === rudderProperty) {
        const tmpKeyName = category.content_items[branchMappingProperty];
        content_items[tmpKeyName] = rudderPropertiesObj[rudderProperty];
        valFound = true;
      }
    });
  }

  if (!valFound) {
    if (category.event_data) {
      category.event_data.find(branchMappingProperty => {
        if (branchMappingProperty === rudderProperty) {
          event_data[rudderProperty] = rudderPropertiesObj[rudderProperty];
          valFound = true;
        }
      });
    }
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
  const content_items = [];
  const event_data = {};
  const custom_data = {};
  let productObj = {};

  // eslint-disable-next-line default-case
  switch (message.type) {
    case EventType.TRACK:
      rudderPropertiesObj = get(message, "properties")
        ? message.properties
        : null;
      break;
    case EventType.IDENTIFY:
      rudderPropertiesObj = getFieldValueFromMessage(message, "traits");
      break;
  }

  if (rudderPropertiesObj != null) {
    Object.keys(rudderPropertiesObj).map(rudderProperty => {
      if (rudderProperty === "products") {
        productObj = {};
        for (let i = 0; i < rudderPropertiesObj.products.length; i++) {
          const product = rudderPropertiesObj.products[i];
          // eslint-disable-next-line no-loop-func
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
      if (Object.keys(rawPayload[key]).length == 0) {
        rawPayload[key] = null;
      }
    });
  }

  return rawPayload;
}

function getPayload(message, categoryName) {
  const rawPayload = {};
  const { name, category } = getCategoryAndName(categoryName);
  rawPayload.name = name;

  return commonPayload(message, rawPayload, category);
}

// function getTrackPayload(message) {
//   const rawPayload = {};
//   const { name, category } = getCategoryAndName(message.event);
//   rawPayload.name = name;
//
//   return commonPayload(message, rawPayload, category);
// }

function getTransformedJSON(message) {
  let rawPayload;
  switch (message.type) {
    case EventType.TRACK:
      rawPayload = getPayload(message, message.event);
      break;
    case EventType.IDENTIFY:
      rawPayload = getPayload(message, message.userId);
      break;
    default:
      throw new Error("Message type is not supported");
  }
  return { ...rawPayload };
}

function process(event) {
  const { message, destination } = event;
  const properties = getTransformedJSON(message, destination);
  return responseBuilder(properties, message, destination);
}

exports.process = process;
