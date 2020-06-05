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
  console.log(payload);
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
