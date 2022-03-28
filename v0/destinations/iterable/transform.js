const get = require("get-value");
const { EventType, MappedToDestinationKey } = require("../../../constants");
const {
  ConfigCategory,
  mappingConfig,
  IDENTIFY_BATCH_ENDPOINT,
  TRACK_BATCH_ENDPOINT,
  IDENTIFY_MAX_BATCH_SIZE,
  TRACK_MAX_BATCH_SIZE
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
          if (element.categories && typeof element.categories === "string") {
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
        if (element.categories && typeof element.categories === "string") {
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
          if (element.categories && typeof element.categories === "string") {
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
        if (element.categories && typeof element.categories === "string") {
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
    const metadatas = [];

    // extracting destination
    // from the first event in a batch
    const { destination } = chunk[0];
    const { apiKey } = destination.Config;

    let batchEventResponse = defaultBatchRequestConfig();

    // Batch event into dest batch structure
    chunk.forEach(ev => {
      batchResponseList.push(get(ev, "message.body.JSON"));
      metadatas.push(ev.metadata);
    });
    // batching into identify batch structure
    if (chunk[0].message.endpoint.includes("/api/users")) {
      batchEventResponse.batchedRequest.body.JSON = {
        users: batchResponseList
      };
      batchEventResponse.batchedRequest.endpoint = IDENTIFY_BATCH_ENDPOINT;
    } else {
      // batching into track batch structure
      batchEventResponse.batchedRequest.body.JSON = {
        events: batchResponseList
      };
      batchEventResponse.batchedRequest.endpoint = TRACK_BATCH_ENDPOINT;
    }

    batchEventResponse.batchedRequest.headers = {
      "Content-Type": "application/json",
      api_key: apiKey
    };

    batchEventResponse = {
      ...batchEventResponse,
      metadata: metadatas,
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

function getEventChunks(
  event,
  identifyEventChunks,
  trackEventChunks,
  eventResponseList
) {
  // Categorizing identify and track type of events
  // Checking if it is identify type event
  if (event.message.endpoint.includes("api/users/update")) {
    identifyEventChunks.push(event);
  } else if (event.message.endpoint.includes("api/events/track")) {
    // Checking if it is track type of event
    trackEventChunks.push(event);
  } else {
    // any other type of event
    const { message, metadata, destination } = event;
    const endpoint = get(message, "endpoint");

    const batchedResponse = defaultBatchRequestConfig();
    batchedResponse.batchedRequest.headers = message.headers;
    batchedResponse.batchedRequest.endpoint = endpoint;
    batchedResponse.batchedRequest.body = message.body;
    batchedResponse.batchedRequest.params = message.params;
    batchedResponse.batchedRequest.method =
      defaultPostRequestConfig.requestMethod;
    batchedResponse.metadata = [metadata];
    batchedResponse.destination = destination;

    eventResponseList.push(
      getSuccessRespEvents(
        batchedResponse.batchedRequest,
        batchedResponse.metadata,
        batchedResponse.destination
      )
    );
  }
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  let identifyEventChunks = []; // list containing identify events in batched format
  let trackEventChunks = []; // list containing track events in batched format
  const eventResponseList = []; // list containing other events in batched format
  const identifyArrayChunks = [];
  const trackArrayChunks = [];
  const errorRespList = [];
  await Promise.all(
    inputs.map(async (event, index) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(
            event,
            identifyEventChunks,
            trackEventChunks,
            eventResponseList
          );
          // slice according to batch size
          if (
            identifyEventChunks.length &&
            (identifyEventChunks.length >= IDENTIFY_MAX_BATCH_SIZE ||
              index === inputs.length - 1)
          ) {
            identifyArrayChunks.push(identifyEventChunks);
            identifyEventChunks = [];
          }
          if (
            trackEventChunks.length &&
            (trackEventChunks.length >= TRACK_MAX_BATCH_SIZE ||
              index === inputs.length - 1)
          ) {
            trackArrayChunks.push(trackEventChunks);
            trackEventChunks = [];
          }
        } else {
          // if not transformed
          getEventChunks(
            {
              message: await process(event),
              metadata: event.metadata,
              destination: event.destination
            },
            identifyEventChunks,
            trackEventChunks,
            eventResponseList
          );

          // slice according to batch size
          if (
            identifyEventChunks.length &&
            (identifyEventChunks.length >= IDENTIFY_MAX_BATCH_SIZE ||
              index === inputs.length - 1)
          ) {
            identifyArrayChunks.push(identifyEventChunks);
            identifyEventChunks = [];
          }
          if (
            trackEventChunks.length &&
            (trackEventChunks.length >= TRACK_MAX_BATCH_SIZE ||
              index === inputs.length - 1)
          ) {
            trackArrayChunks.push(trackEventChunks);
            trackEventChunks = [];
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

  // batching identifyArrayChunks
  let identifyBatchedResponseList = [];
  if (identifyArrayChunks.length) {
    identifyBatchedResponseList = await batchEvents(identifyArrayChunks);
  }
  // batching TrackArrayChunks
  let trackBatchedResponseList = [];
  if (trackArrayChunks.length) {
    trackBatchedResponseList = await batchEvents(trackArrayChunks);
  }
  let batchedResponseList = [];
  // appending all kinds of batches
  batchedResponseList = batchedResponseList
    .concat(identifyBatchedResponseList)
    .concat(trackBatchedResponseList)
    .concat(eventResponseList);

  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
