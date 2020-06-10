const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../constants");
const { ConfigCategory, mappingConfig } = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
} = require("../util");

function setValues(payload, message, mappingJson) {
  if (Array.isArray(mappingJson)) {
    let val;
    let sourceKeys;
    mappingJson.forEach((mapping) => {
      val = undefined;
      sourceKeys = mapping.sourceKeys;
      if (Array.isArray(sourceKeys) && sourceKeys.length > 0) {
        for (let index = 0; index < sourceKeys.length; index++) {
          val = get(message, sourceKeys[index]);
          if (val) {
            break;
          }
        }

        if (val) {
          set(payload, mapping.destKey, val);
        } else if (mapping.required) {
          throw new Error(
            `One of ${JSON.stringify(mapping.sourceKeys)} is required`
          );
        }
      }
    });
  }

  return payload;
}

function constructPayload(message, category, destination) {
  mappingJson = mappingConfig[category.name];
  rawPayload = {};
  switch (category.action) {
    case "identify":
      rawPayload = setValues(rawPayload, message, mappingJson);
      rawPayload.preferUserId = true;
      rawPayload.mergeNestedObjects = true;
      break;
    case "page":
      if (destination.Config.trackAllPages) {
        rawPayload = setValues(rawPayload, message, mappingJson);
      } else if (
        destination.Config.trackCategorisedPages &&
        message.properties.category
      ) {
        rawPayload = setValues(rawPayload, message, mappingJson);
      } else if (
        destination.Config.trackNamedPages &&
        message.properties.name
      ) {
        rawPayload = setValues(rawPayload, message, mappingJson);
      }
      if (destination.Config.mapToSingleEvent) {
        rawPayload.eventName = "Loaded a Page";
      } else {
        rawPayload.eventName += " page";
      }
      rawPayload.createdAt = parseInt( (new Date(rawPayload.createdAt).getTime()/1000));
      break;
    case "screen":
      if (destination.Config.trackAllPages) {
        rawPayload = setValues(rawPayload, message, mappingJson);
      } else if (
        destination.Config.trackCategorisedPages &&
        message.properties.category
      ) {
        rawPayload = setValues(rawPayload, message, mappingJson);
      } else if (
        destination.Config.trackNamedPages &&
        message.properties.name
      ) {
        rawPayload = setValues(rawPayload, message, mappingJson);
      }
      if (destination.Config.mapToSingleEvent) {
        rawPayload.eventName = "Loaded a Screen";
      } else {
        rawPayload.eventName += " screen";
      }
      rawPayload.createdAt = parseInt( (new Date(rawPayload.createdAt).getTime()/1000));
      break;
    case "track":
      rawPayload = setValues(rawPayload, message, mappingJson);
      rawPayload.createdAt = parseInt( (new Date(rawPayload.createdAt).getTime()/1000));
      break;
    case "trackPurchase":
      rawPayload = setValues(rawPayload, message, mappingJson);

      mappingJson = mappingConfig[ConfigCategory.IDENTIFY.name];
      rawPayload.preferUserId = true;
      rawPayload.mergeNestedObjects = true;
      rawPayloadUser = {};
      rawPayload.user = setValues(rawPayloadUser, message, mappingJson);

      mappingJson = mappingConfig[ConfigCategory.PRODUCT.name];
      rawPayloadItemsArray = [];
      rawPayloadItems = {};

      for (var i in message.properties.products) {
        rawPayloadItemsArray.push(
          setValues(
            rawPayloadItems,
            message.properties.products[i],
            mappingJson
          )
        );
        rawPayloadItemsArray[i].categories = rawPayloadItemsArray[
          i
        ].categories.split(",");
        rawPayloadItemsArray[i].price = parseInt(rawPayloadItemsArray[i].price)
        rawPayloadItemsArray[i].quantity = parseInt(rawPayloadItemsArray[i].quantity)
      }
      rawPayload.items = rawPayloadItemsArray;
      rawPayload.createdAt = parseInt( (new Date(rawPayload.createdAt).getTime()/1000));
      rawPayload.total = parseInt(rawPayload.total)
     

      break;

    default:
      throw Error("not supported");
  }

  return removeUndefinedValues(rawPayload);
}

function responseBuilderSimple(message, category, destination) {
  const response = defaultRequestConfig();
  response.endpoint = category.endpoint;
  response.method = defaultPostRequestConfig.requestMethod;

  response.body.JSON = constructPayload(message, category, destination);
  response.userId = message.userId;
  response.headers = {
    "Content-Type": "application/json",
    api_key: destination.Config.apiKey,
  };
  return response;
}

function processSingleMessage(message, destination) {
  const messageType = message.type.toLowerCase();
 
  var category = {};
  switch (messageType) {
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.PAGE:
      category = ConfigCategory.PAGE;
      break;
    case EventType.SCREEN:
      category = ConfigCategory.SCREEN;
      break;
    case EventType.TRACK:
      const event = message.event.toLowerCase();
      switch (event) {
        case "order completed":
          category = ConfigCategory.TRACKPURCHASE;

          break;
        default:
          category = ConfigCategory.TRACK;
      }
      break;
    default:
      throw Error("Message type not supported");
  }
  const response = responseBuilderSimple(message, category, destination);
  return response;
}

async function process(event) {
  const result = processSingleMessage(event.message, event.destination);
  if (!result.statusCode) {
    result.statusCode = 200;
  }
  return result;
}

exports.process = process;
