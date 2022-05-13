const get = require("get-value");
const { logger } = require("handlebars");
const { stringify } = require("uuid");
const moment = require("moment");
const { EventType } = require("../../../constants");

const {
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  defaultBatchRequestConfig,
  getErrorRespEvents,
  getSuccessRespEvents,
  CustomError
} = require("../../util");
const {
  ENDPOINT,
  eventNameMapping,
  mappingConfig,
  ConfigCategory,
  MAX_BATCH_SIZE
} = require("./config");
const {
  msUnixTimestamp,
  getHashedValue,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber,
  channelMapping
} = require("./util");

function trackResponseBuilder(message, { Config }) {
  let event = get(message, "event");
  if (!event) {
    throw new CustomError("[Snapchat] :: Event name is required", 400);
  }
  event = event.trim().replace(/\s+/g, "_");

  const { apiKey, pixelId, snapAppId, appId } = Config;
  let channel = get(message, "channel");
  let eventConversionType = message?.properties?.eventConversionType;
  if (
    channelMapping[eventConversionType?.toLowerCase()] ||
    channelMapping[channel?.toLowerCase()]
  ) {
    eventConversionType = eventConversionType
      ? channelMapping[eventConversionType?.toLowerCase()]
      : channelMapping[channel?.toLowerCase()];
  } else {
    eventConversionType = "OFFLINE";
  }

  if (
    (eventConversionType === "WEB" || eventConversionType === "OFFLINE") &&
    !pixelId
  ) {
    throw new CustomError(
      "[Snapchat] :: Pixel Id is required for web and offline events",
      400
    );
  }

  if (eventConversionType === "MOBILE_APP" && !(appId && snapAppId)) {
    if (!appId) {
      throw new CustomError("[Snapchat] :: App Id is required for app events");
    } else {
      throw new CustomError(
        "[Snapchat] :: Snap App Id is required for app events"
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
          mappingConfig[ConfigCategory.PRODUCT_LIST_VIEWED.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = getPriceSum(message);
        break;
      /* Promotions Section */
      case "promotion_viewed":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.PROMOTION_VIEWED.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case "promotion_clicked":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.PROMOTION_CLICKED.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Ordering Section */
      case "product_viewed":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_VIEWED.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case "checkout_started":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.CHECKOUT_STARTED.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = getPriceSum(message);
        break;
      case "payment_info_entered":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.PAYMENT_INFO_ENTERED.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case "order_completed":
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
          mappingConfig[ConfigCategory.PRODUCT_ADDED_TO_WISHLIST.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Snapchat General Events */
      case "sign_up":
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.SIGN_UP.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      default:
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.COMMON.name]
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
    }
  } else {
    throw new CustomError(
      `Event ${event} doesn't match with Snapchat Events!`,
      400
    );
  }

  if (get(message, "properties.event_tag")) {
    payload.event_tag = message.properties.event_tag;
  }

  payload.hashed_email = getHashedValue(
    message?.context?.traits?.email
      ?.trim()
      ?.toString()
      ?.toLowerCase()
  );
  payload.hashed_phone_number = getHashedValue(
    getNormalizedPhoneNumber(message)
      ?.toString()
      ?.toLowerCase()
  );
  payload.user_agent = message?.context?.userAgent?.toString()?.toLowerCase();
  payload.hashed_ip_address = getHashedValue(
    message?.context?.ip?.toString()?.toLowerCase()
  );
  (hashed_mobile_ad_id = getHashedValue(
    message?.context?.idfa?.toString()?.toLowerCase()
  )),
    (hashed_idfv = getHashedValue(
      message?.context?.idfv?.toString()?.toLowerCase()
    ));

  if (
    !payload.hashed_email &&
    !payload.hashed_phone_number &&
    !payload.hashed_mobile_ad_id &&
    !(payload.hashed_ip_address && payload.user_agent)
  ) {
    throw new CustomError(
      "At least one of email or phone or idfa or ip and userAgent is required",
      400
    );
  }
  payload.timestamp = getFieldValueFromMessage(message, "timestamp");
  const timeStamp = payload.timestamp;
  if (timeStamp) {
    const start = moment.unix(moment(timeStamp).format("X"));
    const current = moment.unix(moment().format("X"));
    // calculates past event in days
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asDays());
    if (deltaDay > 28) {
      throw new CustomError(
        "[snapchat_conversion]: Events must be sent within 28 days of their occurrence.",
        400
      );
    }
  }
  payload.data_use = getDataUseValue(message);
  if (timeStamp) {
    payload.timestamp = msUnixTimestamp(payload.timestamp)
      ?.toString()
      ?.slice(0, 10);
  }

  payload.event_conversion_type = eventConversionType;
  if (eventConversionType === "WEB") {
    payload.pixel_id = pixelId;
    payload.page_url = getFieldValueFromMessage(message, "pageUrl");
  }
  if (eventConversionType === "MOBILE_APP") {
    payload.snap_app_id = snapAppId;
    payload.app_id = appId;
  }
  if (eventConversionType === "OFFLINE") {
    payload.pixel_id = pixelId;
  }

  payload = removeUndefinedAndNullValues(payload);

  // build response
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
}

function process(event) {
  const { message, destination } = event;

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
      response = trackResponseBuilder(message, destination);
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
    const { apiKey } = destination.Config;

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
      Authorization: `Bearer ${apiKey}`
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

function getEventChunks(event, eventsChunk) {
  // build eventsChunk of MAX_BATCH_SIZE
  eventsChunk.push(event);
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  let eventsChunk = []; // temporary variable to divide payload into chunks
  const arrayChunks = []; // transformed payload of (2000) batch size
  const errorRespList = [];
  await Promise.all(
    inputs.map(async (event, index) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(event, eventsChunk);
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
    batchedResponseList = batchEvents(arrayChunks);
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
