const { get } = require("lodash");
const { EventType, MappedToDestinationKey } = require("../../../constants");
const {
  ConfigCategory,
  mappingConfig,
  BATCH_ENDPOINT,
  MAX_BATCH_SIZE
} = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultBatchRequestConfig,
  defaultRequestConfig,
  constructPayload,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  addExternalIdToTraits,
  isAppleFamily
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
      if (isAppleFamily(message.context.device.type)) {
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
    case "alias":
      rawPayload = constructPayload(message, mappingConfig[category.name]);
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
    case EventType.ALIAS:
      category = ConfigCategory.ALIAS;
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

function batchEvents(arrayChunks) {
  const batchedResponseList = [];

  // list of chunks [ [..], [..] ]
  arrayChunks.forEach(chunk => {
    const batchResponseList = [];
    const metadata = [];

    // extracting destination
    // from the first event in a batch
    const { destination } = chunk[0];
    const { accessToken } = destination.Config;

    let batchEventResponse = defaultBatchRequestConfig();

    // Batch event into dest batch structure
    chunk.forEach(ev => {
      batchResponseList.push(ev.message.body.JSON);
      metadata.push(ev.metadata);
    });

    batchEventResponse.batchedRequest.body.JSON = {
      events: batchResponseList
    };

    batchEventResponse.batchedRequest.endpoint = BATCH_ENDPOINT;
    batchEventResponse.batchedRequest.headers = {
      "Access-Token": accessToken,
      "Content-Type": "application/json"
    };
    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true
      )
    );
  });

  return batchedResponseList;
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const trackResponseList = []; // list containing single track event in batched format
  let eventsChunk = []; // temporary variable to divide payload into chunks
  const arrayChunks = []; // transformed payload of (n) batch size
  const errorRespList = [];
  await Promise.all(
    inputs.map(async (event, index) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          eventsChunk.push(event);
          // slice according to batch size
          if (
            eventsChunk.length &&
            (eventsChunk.length >= MAX_BATCH_SIZE ||
              index === inputs.length - 1)
          ) {
            arrayChunks.push(eventsChunk);
            eventsChunk = [];
          }
        } else {
          // if not transformed
          eventsChunk.push({
            message: await process(event),
            metadata: event.metadata,
            destination: event.destination
          });
          // slice according to batch size
          if (
            eventsChunk.length &&
            (eventsChunk.length >= MAX_BATCH_SIZE ||
              index === inputs.length - 1)
          ) {
            arrayChunks.push(eventsChunk);
            eventsChunk = [];
          }
        }
      } catch (error) {
        errorRespList.push(
          getErrorRespEvents(
            [event.metadata],
            error.response ? error.response.status : 400,
            error.message || "Error occurred while processing payload."
          )
        );
      }
    })
  );

  let batchedResponseList = [];
  if (arrayChunks.length) {
    batchedResponseList = await batchEvents(arrayChunks);
  }
  return [...batchedResponseList.concat(trackResponseList), ...errorRespList];
};

module.exports = { process, processRouterDest };
