const get = require("get-value");
const { EventType } = require("../../../constants");
const { endpoints } = require("./config");
const { categoriesList } = require("./data/eventMapping");
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  isDefinedAndNotNull
} = require("../../util");

function responseBuilder(payload, message, destination, category) {

  const os = get(message, "context.os.name");

  if (isDefinedAndNotNull(os)) {
    if (os.toLowerCase() === "ios") {
      payload.idfa = get(message, "context.device.advertisingId");
      payload.idfv = get(message, "context.device.id");
    } else if (os.toLowerCase() === "android") {
      payload.advertising_id = get(
        message,
        "context.device.advertisingId"
      );
    }
  }

  const att = get(message, "context.device.attTrackingStatus");
  if (isDefinedAndNotNull(att)) {
    payload.att = att;
  }

  const response = defaultRequestConfig();

  if (category === "custom") {
    response.endpoint = endpoints.customEventUrl;
  } else {
    response.endpoint = endpoints.standardEventUrl;
  }
  response.method = defaultPostRequestConfig.requestMethod;

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
      return { evName: requiredName, category: requiredCategory };
    }
  }
  return { evName: rudderEventName, category: "custom" };
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

function getCommonPayload(message, category, evName) {
  const rawPayload = {};
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
  rawPayload.name = evName;

  return rawPayload;
}

// function getTrackPayload(message) {
//   const rawPayload = {};
//   const { name, category } = getCategoryAndName(message.event);
//   rawPayload.name = name;
//
//   return commonPayload(message, rawPayload, category);
// }

function processMessage(message, destination) {
  switch (message.type) {
    case EventType.TRACK:
      var { evName, category } = getCategoryAndName(message.event);
      break;
    case EventType.IDENTIFY:
      var { evName, category } = getCategoryAndName(message.userId);
      break;
    default:
      throw new CustomError("Message type is not supported", 400);
  }
  const rawPayload = getCommonPayload(message, category, evName);
  return responseBuilder(rawPayload, message, destination, category);
}

function process(event) {
  const { message, destination } = event;
  return processMessage(message, destination);
}

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

