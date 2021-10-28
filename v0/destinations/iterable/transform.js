const { get } = require("lodash");
const { EventType, MappedToDestinationKey } = require("../../../constants");
const { ConfigCategory, mappingConfig } = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  constructPayload,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  addExternalIdToTraits,
  adduserIdFromExternalId
} = require("../../util");
const logger = require("../../../logger");

function validateMandatoryField(payload) {
  if (payload.email === undefined && payload.userId === undefined) {
    throw new CustomError("userId or email is mandatory for this request", 400);
  }
}

function constructPayloadItem(message, category, destination) {
  const rawPayloadItemArr = [];
  let rawPayload = {};

  switch (category.action) {
    case "identifyDevice":
      rawPayload = constructPayload(
        message,
        mappingConfig[ConfigCategory.IDENTIFY_DEVICE.name]
      );
      rawPayload.device = constructPayload(
        message,
        mappingConfig[ConfigCategory.DEVICE.name]
      );
      rawPayload.preferUserId = true;
      if (message.context.device.type.toLowerCase() === "ios") {
        rawPayload.device.platform = "APNS";
      } else {
        rawPayload.device.platform = "GCM";
      }
      break;
    case "identifyBrowser":
      rawPayload = constructPayload(
        message,
        mappingConfig[ConfigCategory.IDENTIFY_BROWSER.name]
      );
      validateMandatoryField(rawPayload);
      break;
    case "identify":
      // If mapped to destination, Add externalId to traits
      if (get(message, MappedToDestinationKey)) {
        addExternalIdToTraits(message);
        adduserIdFromExternalId(message);
      }
      rawPayload = constructPayload(message, mappingConfig[category.name]);
      rawPayload.preferUserId = true;
      rawPayload.mergeNestedObjects = true;
      validateMandatoryField(rawPayload);
      break;
    case "page":
      if (destination.Config.trackAllPages) {
        rawPayload = constructPayload(message, mappingConfig[category.name]);
      } else if (
        destination.Config.trackCategorisedPages &&
        ((message.properties && message.properties.category) ||
          message.category)
      ) {
        rawPayload = constructPayload(message, mappingConfig[category.name]);
      } else if (
        destination.Config.trackNamedPages &&
        ((message.properties && message.properties.name) || message.name)
      ) {
        rawPayload = constructPayload(message, mappingConfig[category.name]);
      } else {
        throw new CustomError("Invalid page call", 400);
      }
      validateMandatoryField(rawPayload);
      if (destination.Config.mapToSingleEvent) {
        rawPayload.eventName = "Loaded a Page";
      } else {
        rawPayload.eventName += " page";
      }
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      if (rawPayload.campaignId) {
        rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
      }
      if (rawPayload.templateId) {
        rawPayload.templateId = parseInt(rawPayload.templateId, 10);
      }
      break;
    case "screen":
      if (destination.Config.trackAllPages) {
        rawPayload = constructPayload(message, mappingConfig[category.name]);
      } else if (
        destination.Config.trackCategorisedPages &&
        ((message.properties && message.properties.category) ||
          message.category)
      ) {
        rawPayload = constructPayload(message, mappingConfig[category.name]);
      } else if (
        destination.Config.trackNamedPages &&
        ((message.properties && message.properties.name) || message.name)
      ) {
        rawPayload = constructPayload(message, mappingConfig[category.name]);
      } else {
        throw new CustomError("Invalid screen call", 400);
      }
      validateMandatoryField(rawPayload);
      if (destination.Config.mapToSingleEvent) {
        rawPayload.eventName = "Loaded a Screen";
      } else {
        rawPayload.eventName += " screen";
      }
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      if (rawPayload.campaignId) {
        rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
      }
      if (rawPayload.templateId) {
        rawPayload.templateId = parseInt(rawPayload.templateId, 10);
      }
      break;
    case "track":
      rawPayload = constructPayload(message, mappingConfig[category.name]);
      validateMandatoryField(rawPayload);
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      if (rawPayload.campaignId) {
        rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
      }
      if (rawPayload.templateId) {
        rawPayload.templateId = parseInt(rawPayload.templateId, 10);
      }
      break;
    case "trackPurchase":
      rawPayload = constructPayload(message, mappingConfig[category.name]);
      rawPayload.user = constructPayload(
        message,
        mappingConfig[ConfigCategory.IDENTIFY.name]
      );
      validateMandatoryField(rawPayload.user);
      rawPayload.user.preferUserId = true;
      rawPayload.user.mergeNestedObjects = true;
      rawPayload.items = message.properties.products;
      if (rawPayload.items) {
        rawPayload.items.forEach(el => {
          const element = constructPayload(
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
      } else {
        const element = constructPayload(
          message.properties,
          mappingConfig[ConfigCategory.PRODUCT.name]
        );
        if (element.categories) {
          element.categories = element.categories.split(",");
        }
        element.price = parseFloat(element.price);
        element.quantity = parseInt(element.quantity, 10);
        const clone = { ...element };
        rawPayloadItemArr.push(clone);
      }

      rawPayload.items = rawPayloadItemArr;
      rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
      rawPayload.total = parseFloat(rawPayload.total);
      if (rawPayload.id) {
        rawPayload.id = rawPayload.id.toString();
      }
      if (rawPayload.campaignId) {
        rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
      }
      if (rawPayload.templateId) {
        rawPayload.templateId = parseInt(rawPayload.templateId, 10);
      }
      break;
    case "updateCart":
      rawPayload.user = constructPayload(
        message,
        mappingConfig[ConfigCategory.IDENTIFY.name]
      );
      validateMandatoryField(rawPayload.user);
      rawPayload.user.preferUserId = true;
      rawPayload.user.mergeNestedObjects = true;
      rawPayload.items = message.properties.products;
      if (rawPayload.items) {
        rawPayload.items.forEach(el => {
          const element = constructPayload(
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
      } else {
        const element = constructPayload(
          message.properties,
          mappingConfig[ConfigCategory.PRODUCT.name]
        );
        if (element.categories) {
          element.categories = element.categories.split(",");
        }
        element.price = parseFloat(element.price);
        element.quantity = parseInt(element.quantity, 10);
        const clone = { ...element };
        rawPayloadItemArr.push(clone);
      }

      rawPayload.items = rawPayloadItemArr;
      break;
    default:
      logger.debug("not supported type");
  }

  return removeUndefinedValues(rawPayload);
}

function responseBuilderSimple(message, category, destination) {
  const response = defaultRequestConfig();
  response.endpoint = category.endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = constructPayloadItem(message, category, destination);
  response.headers = {
    "Content-Type": "application/json",
    api_key: destination.Config.apiKey
  };
  return response;
}

function responseBuilderSimpleForIdentify(message, category, destination) {
  const response = defaultRequestConfig();
  const { os, device } = message.context;

  if (device) {
    response.endpoint = category.endpointDevice;
    response.body.JSON = constructPayloadItem(
      message,
      { ...category, action: category.actionDevice },
      destination
    );
  } else if (os) {
    response.endpoint = category.endpointBrowser;
    response.body.JSON = constructPayloadItem(
      message,
      { ...category, action: category.actionBrowser },
      destination
    );
  }

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
      throw new CustomError("Message type not supported", 400);
  }
  const response = responseBuilderSimple(message, category, destination);

  if (
    message.type === EventType.IDENTIFY &&
    message.context &&
    ((message.context.device && message.context.device.token) ||
      (message.context.os && message.context.os.token))
  ) {
    return [
      response,
      responseBuilderSimpleForIdentify(message, category, destination)
    ];
  }

  return response;
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
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
