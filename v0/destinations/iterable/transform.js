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
  const rawPayloadUser = {};
  const rawPayloadDevice = {};

  const rawPayloadItemArr = [];
  const rawPayloadItem = {};
  let rawPayload = {};

  switch (category.action) {
    case "identifyDevice":
      rawPayload = setValues(
        rawPayload,
        message,
        mappingConfig[ConfigCategory.IDENTIFY_DEVICE.name]
      );
      rawPayload.device = setValues(
        rawPayloadDevice,
        message,
        mappingConfig[ConfigCategory.DEVICE.name]
      );
      rawPayload.preferUserId = true;
      if (message.context.device.type === "ios")
        rawPayload.device.platform = "APNS";
      else rawPayload.device.platform = "GCM";
      break;
    case "identifyBrowser":
      rawPayload = setValues(
        rawPayload,
        message,
        mappingConfig[ConfigCategory.IDENTIFY_BROWSER.name]
      );
      break;
    case "identify":
      rawPayload = setValues(rawPayload, message, mappingConfig[category.name]);
      rawPayload.preferUserId = true;
      rawPayload.mergeNestedObjects = true;
      break;
    case "page":
      if (destination.Config.trackAllPages) {
        rawPayload = setValues(
          rawPayload,
          message,
          mappingConfig[category.name]
        );
      } else if (
        destination.Config.trackCategorisedPages &&
        message.properties.category
      ) {
        rawPayload = setValues(
          rawPayload,
          message,
          mappingConfig[category.name]
        );
      } else if (
        destination.Config.trackNamedPages &&
        message.properties.name
      ) {
        rawPayload = setValues(
          rawPayload,
          message,
          mappingConfig[category.name]
        );
      }
      if (destination.Config.mapToSingleEvent) {
        rawPayload.eventName = "Loaded a Page";
      } else {
        rawPayload.eventName += " page";
      }
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      if (rawPayload.campaignId)
        rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
      if (rawPayload.templateId)
        rawPayload.templateId = parseInt(rawPayload.templateId, 10);
      break;
    case "screen":
      if (destination.Config.trackAllPages) {
        rawPayload = setValues(
          rawPayload,
          message,
          mappingConfig[category.name]
        );
      } else if (
        destination.Config.trackCategorisedPages &&
        message.properties.category
      ) {
        rawPayload = setValues(
          rawPayload,
          message,
          mappingConfig[category.name]
        );
      } else if (
        destination.Config.trackNamedPages &&
        message.properties.name
      ) {
        rawPayload = setValues(
          rawPayload,
          message,
          mappingConfig[category.name]
        );
      }
      if (destination.Config.mapToSingleEvent) {
        rawPayload.eventName = "Loaded a Screen";
      } else {
        rawPayload.eventName += " screen";
      }
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      if (rawPayload.campaignId)
        rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
      if (rawPayload.templateId)
        rawPayload.templateId = parseInt(rawPayload.templateId, 10);
      break;
    case "track":
      rawPayload = setValues(rawPayload, message, mappingConfig[category.name]);
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      if (rawPayload.campaignId)
        rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
      if (rawPayload.templateId)
        rawPayload.templateId = parseInt(rawPayload.templateId, 10);
      break;
    case "trackPurchase":
      rawPayload = setValues(rawPayload, message, mappingConfig[category.name]);
      rawPayload.user = setValues(
        rawPayloadUser,
        message,
        mappingConfig[ConfigCategory.IDENTIFY.name]
      );
      rawPayload.user.preferUserId = true;
      rawPayload.user.mergeNestedObjects = true;
      rawPayload.items = message.properties.products;
      rawPayload.items.forEach(el => {
        const element = setValues(
          rawPayloadItem,
          el,
          mappingConfig[ConfigCategory.PRODUCT.name]
        );
        if (element.categories) {
          element.categories = element.categories.split(",");
        }
        element.price = parseFloat(element.price);
        element.quantity = parseInt(element.quantity, 10);
        const clone = { ...element };
        rawPayloadItemArr.push(clone);
      });

      rawPayload.items = rawPayloadItemArr;
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      rawPayload.total = parseFloat(rawPayload.total);
      if (rawPayload.id) {
        rawPayload.id = rawPayload.id.toString();
      }
      if (rawPayload.campaignId)
        rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
      if (rawPayload.templateId)
        rawPayload.templateId = parseInt(rawPayload.templateId, 10);
      break;
    case "updateCart":
      rawPayload.user = setValues(
        rawPayloadUser,
        message,
        mappingConfig[ConfigCategory.IDENTIFY.name]
      );
      rawPayload.user.preferUserId = true;
      rawPayload.user.mergeNestedObjects = true;
      rawPayload.items = message.properties.products;
      rawPayload.items.forEach(el => {
        const element = setValues(
          rawPayloadItem,
          el,
          mappingConfig[ConfigCategory.PRODUCT.name]
        );
        if (element.categories) {
          element.categories = element.categories.split(",");
        }
        element.price = parseFloat(element.price);
        element.quantity = parseInt(element.quantity, 10);
        const clone = { ...element };
        rawPayloadItemArr.push(clone);
      });

      rawPayload.items = rawPayloadItemArr;
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
    response.body.JSON = constructPayload(
      message,
      { ...category, action: category.actionDevice },
      destination
    );
  } else if (message.context.os) {
    response.endpoint = category.endpointBrowser;
    response.body.JSON = constructPayload(
      message,
      { ...category, action: category.actionBrowser },
      destination
    );
  }

  response.userId = message.userId;
  response.headers = {
    "Content-Type": "application/json",
    api_key: destination.Config.apiKey
  };
  return response;
}

function processSingleMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let category = {};
  let event;
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
      event = message.event.toLowerCase();
      switch (event) {
        case "order completed":
          category = ConfigCategory.TRACK_PURCHASE;
          break;
        case "product added":
        case "product removed":
          category = ConfigCategory.UPDATE_CART;
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
    return [
      response,
      responseBuilderSimpleForIdentify(message, category, destination)
    ];
  }
  logger.debug("No token present thus device/browser not mapped with user");
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
