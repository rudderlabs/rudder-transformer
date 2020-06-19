const { EventType } = require("../../../constants");
const { ConfigCategory, mappingConfig } = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  setValues
} = require("../util");
const logger = require("../../../logger");

function constructPayload(message, category, destination) {
  mappingJson = mappingConfig[category.name];
  rawPayload = {};
  switch (category.action) {
    case "identifyDevice":
      rawPayloadDevice = {};
      mappingJson = mappingConfig[ConfigCategory.IDENTIFYDEVICE.name];
      console.log(mappingJson);
      rawPayload = setValues(rawPayload, message, mappingJson);
      console.log(rawPayload);
      mappingJson = mappingConfig[ConfigCategory.DEVICE.name];
      rawPayload.device = setValues(rawPayloadDevice, message, mappingJson);
      rawPayload.preferUserId = true;
      if (message.context.device.type === "ios")
        rawPayload.device.platform = "APNS";
      else rawPayload.device.platform = "GCM";
      break;
    case "identifyBrowser":
      mappingJson = mappingConfig[ConfigCategory.IDENTIFYBROWSER.name];
      rawPayload = setValues(rawPayload, message, mappingJson);
      console.log(rawPayload);
      break;
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
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      if (rawPayload.campaignId)
        rawPayload.campaignId = parseInt(rawPayload.campaignId);
      if (rawPayload.templateId)
        rawPayload.templateId = parseInt(rawPayload.templateId);
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
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      if (rawPayload.campaignId)
        rawPayload.campaignId = parseInt(rawPayload.campaignId);
      if (rawPayload.templateId)
        rawPayload.templateId = parseInt(rawPayload.templateId);
      break;
    case "track":
      rawPayload = setValues(rawPayload, message, mappingJson);
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      if (rawPayload.campaignId)
        rawPayload.campaignId = parseInt(rawPayload.campaignId);
      if (rawPayload.templateId)
        rawPayload.templateId = parseInt(rawPayload.templateId);
      break;
    case "trackPurchase":
      rawPayload = setValues(rawPayload, message, mappingJson);
      mappingJson = mappingConfig[ConfigCategory.IDENTIFY.name];
      rawPayloadUser = {};
      rawPayload.user = setValues(rawPayloadUser, message, mappingJson);
      rawPayload.user.preferUserId = true;
      rawPayload.user.mergeNestedObjects = true;

      mappingJson = mappingConfig[ConfigCategory.PRODUCT.name];
      rawPayloadItem = {};
      rawPayload.items = message.properties.products;
      console.log(rawPayload);

      console.log("!!!!!!!!!!!!!");
      console.log(rawPayload);
      for (var i in rawPayload.items) {
        rawPayload.items[i] = setValues(
          rawPayloadItem,
          message.properties.products[i],
          mappingJson
        );
        if (rawPayload.items[i].categories) {
          rawPayload.items[i].categories = rawPayload.items[i].categories.split(
            ","
          );
        }
        rawPayload.items[i].price = parseFloat(rawPayload.items[i].price);
        rawPayload.items[i].quantity = parseInt(rawPayload.items[i].quantity);
      }
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      rawPayload.total = parseFloat(rawPayload.total);
      if (rawPayload.id) {
        rawPayload.id = rawPayload.id.toString();
      }
      if (rawPayload.campaignId)
        rawPayload.campaignId = parseInt(rawPayload.campaignId);
      if (rawPayload.templateId)
        rawPayload.templateId = parseInt(rawPayload.templateId);
      break;
    case "updateCart":
      mappingJson = mappingConfig[ConfigCategory.IDENTIFY.name];

      rawPayloadUser = {};
      rawPayload.user = setValues(rawPayloadUser, message, mappingJson);
      rawPayload.user.preferUserId = true;
      rawPayload.user.mergeNestedObjects = true;
      mappingJson = mappingConfig[ConfigCategory.PRODUCT.name];
      rawPayloadItem = {};
      rawPayload.items = message.properties.products;
      for (var i in rawPayload.items) {
        rawPayload.items[i] = setValues(
          rawPayloadItem,
          message.properties.products[i],
          mappingJson
        );
        if (rawPayload.items[i].categories) {
          rawPayload.items[i].categories = rawPayload.items[i].categories.split(
            ","
          );
        }
        rawPayload.items[i].price = parseFloat(rawPayload.items[i].price);
        rawPayload.items[i].quantity = parseInt(rawPayload.items[i].quantity);
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
    api_key: destination.Config.apiKey
  };
  return response;
}
function responseBuilderSimpleForIdentify(message, category, destination) {
  const response = defaultRequestConfig();
  if (message.context.device) {
    response.endpoint = category.endpointDevice;
    category.action = category.actionDevice;
  } else if (message.context.os) {
    response.endpoint = category.endpointBrowser;
    category.action = category.actionBrowser;
  }
  response.body.JSON = constructPayload(message, category, destination);
  response.userId = message.userId;
  response.headers = {
    "Content-Type": "application/json",
    api_key: destination.Config.apiKey
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
        case "product added":
        case "product removed":
          category = ConfigCategory.UPDATECART;
          break;
        default:
          category = ConfigCategory.TRACK;
      }
      break;
    default:
      throw Error("Message type not supported");
  }
  const response = responseBuilderSimple(message, category, destination);

  if (
    (message.type === EventType.IDENTIFY &&
      message.context.device &&
      message.context.device.token) ||
    (message.context.os && message.context.os.token)
  ) {
    var respIdentify;

    respIdentify = responseBuilderSimpleForIdentify(
      message,
      category,
      destination
    );

    return [response, respIdentify];
  }
  logger.debug("No token present thus device/browser not mapped with user");
  // console.log("No token present thus device/browser not mapped with user");
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
