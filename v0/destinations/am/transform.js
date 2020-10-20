const _ = require("lodash");
const get = require("get-value");
const set = require("set-value");

const {
  EventType,
  SpecedTraits,
  TraitsMapping
} = require("../../../constants");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  defaultBatchRequestConfig,
  getParsedIP,
  getFieldValueFromMessage
} = require("../../util");
const {
  Event,
  ENDPOINT,
  BATCH_EVENT_ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
} = require("./config");

const logger = require("../../../logger");
const AMBatchSizeLimit = 20 * 1024 * 1024; // 20 MB
const AMBatchEventLimit = 500;  // event size limit from sdk is 32KB => 15MB

// Get the spec'd traits, for now only address needs treatment as 2 layers.
// const populateSpecedTraits = (payload, message) => {
//   const traits = getFieldValueFromMessage(message, "traits");
//   if (traits) {
//     SpecedTraits.forEach(trait => {
//       const mapping = TraitsMapping[trait];
//       const keys = Object.keys(mapping);
//       keys.forEach(key => {
//         set(payload, `user_properties.${key}`, get(traits, mapping[key]));
//       });
//     });
//   }
// };

// Utility method for creating the structure required for single message processing
// with basic fields populated
function createSingleMessageBasicStructure(message) {
  return _.pick(message, [
    "type",
    "event",
    "context",
    "userId",
    "originalTimestamp",
    "integrations",
    "session_id"
  ]);
}

// https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
/* function stringToHash(string) {
  let hash = 0;

  if (string.length == 0) return hash;

  for (i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }

  return Math.abs(hash);
} */

function getSessionId(payload) {
  const sessionId = payload.session_id;
  if (sessionId) {
    if (typeof sessionId === "string") {
      return sessionId.substr(sessionId.lastIndexOf(":") + 1, sessionId.length);
    }
    return sessionId;
  }
  return -1;
}

// function fixVersion(payload, message) {
//   if (message.context.library.name.includes("android")) {
//     payload.app_version = message.context.app.version;
//   }
// }

function addMinIdlength() {
  return { min_id_length: 1 };
}

// Build response for Amplitude. In this case, endpoint will be different depending
// on the event type being sent to Amplitude
function responseBuilderSimple(
  rootElementName,
  message,
  evType,
  mappingJson,
  destination
) {
  const rawPayload = {};
  const addOptions = "options";

  set(rawPayload, "event_properties", message.properties);
  set(rawPayload, "user_properties", message.userProperties);

  if (message.channel === "mobile") {
    set(rawPayload, "device_brand", message.context.device.manufacturer);
  }

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });

  const endpoint = ENDPOINT; // evType === EventType.IDENTIFY ? IDENTIFY_ENDPOINT : ENDPOINT; // identify on same endpoint also works

  // in case of identify, populate user_properties from traits as well, don't need to send evType
  if (evType === EventType.IDENTIFY) {
    // populateSpecedTraits(rawPayload, message);
    const traits = getFieldValueFromMessage(message, "traits");
    if (traits) {
      Object.keys(traits).forEach(trait => {
        if (SpecedTraits.includes(trait)) {
          const mapping = TraitsMapping[trait];
          Object.keys(mapping).forEach(key => {
            set(
              rawPayload,
              `user_properties.${key}`,
              get(traits, mapping[key])
            );
          });
        } else {
          set(rawPayload, `user_properties.${trait}`, get(traits, trait));
        }
      });
    }
    rawPayload.event_type = EventType.IDENTIFY_AM;
  } else {
    rawPayload.event_type = evType;
  }

  rawPayload.time = new Date(
    getFieldValueFromMessage(message, "timestamp")
  ).getTime();

  // send user_id only when present, for anonymous users not required
  if (
    message.userId &&
    message.userId !== "" &&
    message.userId !== "null" &&
    message.userId !== null
  ) {
    rawPayload.user_id = message.userId;
  }

  const payload = removeUndefinedValues(rawPayload);
  payload.session_id = getSessionId(payload);

  // we are not fixing the verson for android specifically any more because we've put a fix in iOS SDK
  // for correct versionName
  // ====================
  // fixVersion(payload, message);

  payload.ip = getParsedIP(message);

  // console.log(payload);
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.userId = message.anonymousId;
  response.body.JSON = {
    api_key: destination.Config.apiKey,
    [rootElementName]: payload,
    [addOptions]: addMinIdlength()
  };
  return response;
}

const isRevenueEvent = product => {
  if (
    product.quantity &&
    product.quantity.length > 0 &&
    product.price &&
    product.price.length > 0
  ) {
    return true;
  }
  return false;
};

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
function processSingleMessage(message, destination) {
  const payloadObjectName = "events";
  let evType;
  let category = ConfigCategory.DEFAULT;

  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      // payloadObjectName = "identification"; // identify same as events
      evType = "identify";
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.PAGE:
      evType = `Viewed ${message.name ||
        get(message.properties.category) ||
        ""} Page`;
      message.properties = {
        ...message.properties,
        name: message.name || get(message.properties.category)
      };
      category = ConfigCategory.PAGE;
      break;
    case EventType.SCREEN:
      evType = `Viewed ${message.name ||
        get(message.properties.category) ||
        ""} Screen`;
      message.properties = {
        ...message.properties,
        name: message.name || get(message.properties.category)
      };
      category = ConfigCategory.SCREEN;
      break;
    case EventType.TRACK:
      evType = message.event;

      if (message.products && message.products.length > 0) {
        let isRevenue = false;
        message.products.forEach(product => {
          if (isRevenueEvent(product)) {
            isRevenue = true;
          }
        });
        if (isRevenue) {
          category = ConfigCategory.REVENUE;
          break;
        }
      }

      switch (evType) {
        case Event.PROMOTION_CLICKED.name:
        case Event.PROMOTION_VIEWED.name:
        case Event.PRODUCT_CLICKED.name:
        case Event.PRODUCT_VIEWED.name:
        case Event.PRODUCT_ADDED.name:
        case Event.PRODUCT_REMOVED.name:
        case Event.PRODUCT_ADDED_TO_WISHLIST.name:
        case Event.PRODUCT_REMOVED_FROM_WISHLIST.name:
        case Event.PRODUCT_LIST_VIEWED.name:
        case Event.PRODUCT_LIST_CLICKED.name:
          category = nameToEventMap[evType].category;
          break;
        default:
          category = ConfigCategory.DEFAULT;
          break;
      }
      break;
    default:
      logger.debug("could not determine type");
      throw new Error("message type not supported");
  }

  return responseBuilderSimple(
    payloadObjectName,
    message,
    evType,
    mappingConfig[category.name],
    destination
  );
}

// Method for handling product list actions
function processProductListAction(message) {
  const eventList = [];
  const { products } = message.properties;

  // Now construct complete payloads for each product and
  // get them processed through single message processing logic
  products.forEach(product => {
    const productEvent = createSingleMessageBasicStructure(message);
    productEvent.properties = product;
    eventList.push(productEvent);
  });

  return eventList;
}

function processTransaction(message) {
  // For order cancel or refund, amounts need to be made negative
  const eventType = message.event.toLowerCase();

  // Why are we skipping Checkout started and Order Updated?
  // Order Cancelled is not being sent, but we are handling it here
  if (
    eventType === EventType.ORDER_CANCELLED.name ||
    eventType === EventType.ORDER_REFUNDED.name
  ) {
    return processProductListAction(message);
  }
  return [];
}

function process(event) {
  const respList = [];
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();
  const eventType = message.event ? message.event.toLowerCase() : undefined;
  const toSendEvents = [];
  if (
    messageType === EventType.TRACK &&
    (eventType === Event.PRODUCT_LIST_VIEWED.name ||
      eventType === Event.PRODUCT_LIST_CLICKED)
  ) {
    toSendEvents.push(processProductListAction(message));
  } else if (
    messageType === EventType.TRACK &&
    (eventType === Event.CHECKOUT_STARTED.name ||
      eventType === Event.ORDER_UPDATED.name ||
      eventType === Event.ORDER_COMPLETED.name ||
      eventType === Event.ORDER_CANCELLED.name)
  ) {
    toSendEvents.push(processTransaction(message));
  } else {
    toSendEvents.push(message);
  }

  toSendEvents.forEach(sendEvent => {
    respList.push(processSingleMessage(sendEvent, destination));
  });
  return respList;
}

function getBatchEvents(message, metadata, batchEventResponse) {
  let batchComplete = false;
  let batchEventArray = get(batchEventResponse, "batchedRequest.body.JSON.events") || []
  let batchEventJobs = get(batchEventResponse, "jobs") || []
  let batchPayloadJSON = get(batchEventResponse, "batchedRequest.body.JSON") || {}
  let incomingMessageJSON = get(message, "body.JSON")
  let incomingMessageEvent = get(message, "body.JSON.events")
  // check if the incoming singular event is an array or not
  // and set it back to array 
  incomingMessageEvent = Array.isArray(incomingMessageEvent) ? incomingMessageEvent[0] : incomingMessageEvent
  set(message, "body.JSON.events", [incomingMessageEvent])
  // if this is the first event, push to batch and return
  if(batchEventArray.length == 0) {
    if(JSON.stringify(incomingMessageJSON).length < AMBatchSizeLimit) {
      delete message.body.JSON.options
      batchEventResponse = Object.assign(batchEventResponse, {batchedRequest: message})
      set(batchEventResponse, "batchedRequest.endpoint", BATCH_EVENT_ENDPOINT)
      batchEventResponse.jobs = [metadata.job_id]
    } else {
      // check not required as max individual event size is always less than 20MB
      // https://developers.amplitude.com/docs/batch-event-upload-api#feature-comparison-between-httpapi-2httpapi--batch
      // batchComplete = true;
    }
  } else {
    // https://developers.amplitude.com/docs/batch-event-upload-api#feature-comparison-between-httpapi-2httpapi--batch
    if(batchEventArray.length < AMBatchEventLimit && (JSON.stringify(batchPayloadJSON).length + JSON.stringify(incomingMessageEvent).length < AMBatchSizeLimit)) {
      batchEventArray.push(incomingMessageEvent);  // set value
      batchEventJobs.push(metadata.job_id)
      set(batchEventResponse, "batchedRequest.body.JSON.events", batchEventArray);
      set(batchEventResponse, "jobs", batchEventJobs);
    } else {
      // event could not be pushed 
      // it will be pushed again by a call from the caller of this method
      batchComplete = true;
    }
  }
  return batchComplete;
}

function batch(destEvents) {
  const respList = [];
  let batchEventResponse = defaultBatchRequestConfig();
  let response, isBatchComplete, jsonBody, userId, messageEvent;
  destEvents.forEach(ev => {
    const {message, metadata, destination} = ev;
    jsonBody = get(message, "body.JSON");
    messageEvent = get(message, "body.JSON.events");
    userId = messageEvent && Array.isArray(messageEvent) ? messageEvent[0].user_id : messageEvent ? messageEvent.user_id : undefined;
    // check if not a JSON body or userId length < 5, send the event as is after batching
    if(Object.keys(jsonBody).length == 0 || !userId || userId.length < 5) {
      response = defaultBatchRequestConfig();
      response = Object.assign(response, {batchedRequest: message})
      response.jobs = [metadata.job_id]
      respList.push(response);
    } else {
      // check if the event can be pushed to an existing batch
      isBatchComplete = getBatchEvents(message,metadata,batchEventResponse)
      if(isBatchComplete) {
        // if the batch is already complete, push it to response list
        // and push the event to a new batch
        respList.push(Object.assign({}, batchEventResponse));
        batchEventResponse = defaultBatchRequestConfig();
        isBatchComplete = getBatchEvents(message,metadata,batchEventResponse)
      }
    }
  })
  // if there is some unfinished batch push it to response list
  if(isBatchComplete !== undefined && isBatchComplete === false) {
    respList.push(batchEventResponse)
  }
  return respList;
}

exports.process = process;
exports.batch = batch;
