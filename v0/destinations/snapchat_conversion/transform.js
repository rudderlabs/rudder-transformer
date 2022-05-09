const get = require("get-value");
const { logger } = require("handlebars");
const sha256 = require("sha256");
const { EventType } = require("../../../constants");

const {
  CustomError,
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  defaultBatchRequestConfig,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");
const ErrorBuilder = require("../../util/error");
const {
  ENDPOINT,
  eventNameMapping,
  mappingConfig,
  ConfigCategory,
  MAX_BATCH_SIZE
} = require("./config");
const {
  msUnixTimestamp,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber
} = require("./util");

/**
 * Get access token to be bound to the event req headers
 *
 * Note:
 * This method needs to be implemented particular to the destination
 * As the schema that we'd get in `metadata.secret` can be different
 * for different destinations
 *
 * @param {Object} metadata
 * @returns
 */
const getAccessToken = metadata => {
  // OAuth for this destination
  const { secret } = metadata;
  if (!secret) {
    throw new ErrorBuilder()
      .setMessage("Empty/Invalid access token")
      .setStatus(500)
      .build();
  }
  return secret.access_token;
};

function trackResponseBuilder(message, metadata, { Config }) {
  let event = get(message, "event");
  if (!event) {
    throw new CustomError("Event name is required", 400);
  }
  event = event.trim().replace(/\s+/g, "_");

  const { pixelId, snapAppId, appId } = Config;
  const eventConversionType = message?.context.snapchat_conversion_type?.toUpperCase();

  if (
    (eventConversionType === "WEB" || eventConversionType === "OFFLINE") &&
    !pixelId
  ) {
    throw new CustomError(
      "[Snapchat] :: Pixel Id is required for web and offline events",
      400
    );
  }

  if (eventConversionType === "MOBILE_APP" && (!appId || snapAppId)) {
    if (!appId) {
      throw new CustomError(
        "[Snapchat] :: App Id is required for app events",
        400
      );
    } else {
      throw new CustomError(
        "[Snapchat] :: Snap App Id is required for app events",
        400
      );
    }
  }

  if (eventNameMapping[event.toLowerCase()]) {
    // Snapchat standard events
    // get event specific parameters

    switch (event.toLowerCase()) {
      /* Browsing Section */
      case "products_searched":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCTS_SEARCHED.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case "product_list_viewed":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.COMMON.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = getPriceSum(message);
        break;
      /* Promotions Section */
      case "promotion_viewed":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.COMMON.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case "promotion_clicked":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.COMMON.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Ordering Section */
      case "product_viewed":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.COMMON.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case "checkout_started":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.COMMON.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = getPriceSum(message);
        break;
      case "payment_info_entered":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.COMMON.name]
        );
        payload.transaction_id = parseInt(
          get(message, "properties.checkout_id"),
          10
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case "order_completed":
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.ORDER_COMPLETED.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = getPriceSum(message);
        break;
      case "product_added":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_ADDED.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Wishlist Section */
      case "product_added_to_wishlist":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.COMMON.name]
        );
        payload.item_ids = getItemIds(message);
        payload.price = getPriceSum(message);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Snapchat Common Events */
      default:
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.COMMON.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
    }
  } else {
    logger.debug(`Event ${event} doesn't match with Snapchat Events!`);
  }

  payload.hashed_email = sha256(
    message?.context?.traits?.email.toString().toLowerCase()
  );
  payload.hashed_phone_number = sha256(
    getNormalizedPhoneNumber(message)
      .toString()
      .toLowerCase()
  );
  payload.user_agent = message?.context?.userAgent.toString().toLowerCase();
  payload.hashed_ip_address = sha256(
    message?.context?.ip.toString().toLowerCase()
  );
  (hashed_mobile_ad_id = sha256(
    message?.context?.idfa?.toString()?.toLowerCase()
  )),
    (hashed_idfv = sha256(message?.context?.idfv.toString().toLowerCase()));

  payload.timestamp = getFieldValueFromMessage(message, "timestamp");
  payload.data_use = getDataUseValue(message);
  if (payload.timestamp) {
    payload.timestamp = msUnixTimestamp(payload.timestamp)
      .toString()
      .slice(0, 10);
  }

  payload.event_conversion_type = eventConversionType;
  if (eventConversionType === "WEB") {
    payload.pixel_id = pixelId;
    payload.page_url = get(message, "properties.page_url");
  }
  if (eventConversionType === "MOBILE_APP") {
    payload.snap_app_id = snapAppId;
    payload.app_id = appId;
  }
  if (eventConversionType === "OFFLINE") {
    payload.pixel_id = pixelId;
  }

  payload = removeUndefinedAndNullValues(payload);

  /**
   * This function is used for building the response. It create a default rudder response
   * and populate headers, params and body.JSON
   * @param {*} metadata
   * @returns
   */

  // build response
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  const accessToken = getAccessToken(metadata);
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
}

function process(event) {
  const { message, metadata, destination } = event;

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, metadata, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
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

    batchEventResponse.batchedRequest.body.JSON_ARRAY = {
      batch: JSON.stringify(batchResponseList)
    };

    batchEventResponse.batchedRequest.endpoint = ENDPOINT;
    batchEventResponse.batchedRequest.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
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

function getEventChunks(event, trackResponseList, eventsChunk) {
  // build eventsChunk of MAX_BATCH_SIZE
  eventsChunk.push(event);
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const trackResponseList = []; // list containing single track event in batched format
  let eventsChunk = []; // temporary variable to divide payload into chunks
  const arrayChunks = []; // transformed payload of (2000) batch size
  const errorRespList = [];
  await Promise.all(
    inputs.map(async (event, index) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(event, trackResponseList, eventsChunk);
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
          getEventChunks(
            {
              message: await process(event),
              metadata: event.metadata,
              destination: event.destination
            },
            trackResponseList,
            eventsChunk
          );
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
