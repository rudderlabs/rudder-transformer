/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-lonely-if */
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
  ALIAS_ENDPOINT,
  GROUP_ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap,
  batchEventsWithUserIdLengthLowerThanFive
} = require("./config");
// const {
//   getOSName,
//   getOSVersion,
//   getDeviceModel,
//   getDeviceManufacturer
// } = require("./utils");

const AMUtils = require("./utils");

const logger = require("../../../logger");

const AMBatchSizeLimit = 20 * 1024 * 1024; // 20 MB
const AMBatchEventLimit = 500; // event size limit from sdk is 32KB => 15MB

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
    "request_ip",
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
  groupInfo,
  rootElementName,
  message,
  evType,
  mappingJson,
  destination
) {
  const rawPayload = {};
  const addOptions = "options";
  const respList = [];
  const response = defaultRequestConfig();
  const groupResponse = defaultRequestConfig();
  const aliasResponse = defaultRequestConfig();

  let groups;

  let endpoint = ENDPOINT;
  let traits;

  // 1. first populate the dest keys from the config files.
  // Group config file is similar to Identify config file
  // because we need to make an identify call too along with group entity update
  // to link the user to the partuclar group name/value. (pass in "groups" key to https://api.amplitude.com/2/httpapi where event_type: $identify)
  // Additionally, we will update the user_properties with groupName:groupValue
  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    // check if custom processing is required on the payload sourceKey ==> destKey
    if (typeof mappingJson[sourceKey] === "object") {
      const { isFunc, funcName, outKey } = mappingJson[sourceKey];
      if (isFunc) {
        // get the destKey/outKey value from calling the util function
        set(rawPayload, outKey, AMUtils[funcName](message, sourceKey));
      }
    } else {
      set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
    }
  });

  // 2. get campaign info (only present for JS sdk and http calls)
  const campaign = get(message, "context.campaign") || {};

  switch (evType) {
    case EventType.IDENTIFY:
    case EventType.GROUP:
      endpoint = ENDPOINT;
      // event_type for identify event is $identify
      rawPayload.event_type = EventType.IDENTIFY_AM;

      if (evType === EventType.IDENTIFY) {
        // update payload user_properties from userProperties/traits/context.traits/nested traits of Rudder message
        // traits like address converted to top level useproperties (think we can skip this extra processing as AM supports nesting upto 40 levels)
        set(rawPayload, "user_properties", message.userProperties);
        traits = getFieldValueFromMessage(message, "traits");
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
        // append campaign info extracted above(2.) to user_properties.
        // AM sdk's have a flag that captures the UTM params(https://amplitude.github.io/Amplitude-JavaScript/#amplitudeclientinit)
        // but http api docs don't have any such specific keys to send the UTMs, so attaching to user_properties
        rawPayload.user_properties = rawPayload.user_properties || {};
        rawPayload.user_properties = {
          ...rawPayload.user_properties,
          ...campaign
        };
      }

      if (evType === EventType.GROUP) {
        // for Rudder group call, update the user_properties with group info
        // Refer (1.)
        if (groupInfo && groupInfo.group_type && groupInfo.group_value) {
          groups = {};
          groups[groupInfo.group_type] = groupInfo.group_value;
          set(
            rawPayload,
            `user_properties.${[groupInfo.group_type]}`,
            groupInfo.group_value
          );
        }
      }
      break;
    case EventType.ALIAS:
      endpoint = ALIAS_ENDPOINT;
      break;
    default:
      set(rawPayload, "event_properties", message.properties);
      rawPayload.event_type = evType;
      groups = groupInfo && Object.assign(groupInfo);
  }
  // for  https://api.amplitude.com/2/httpapi , pass the "groups" key
  // refer (1.) for passing "groups" for Rudder group call
  // https://developers.amplitude.com/docs/http-api-v2#schemaevent
  set(rawPayload, "groups", groups);
  let payload = removeUndefinedValues(rawPayload);

  let unmapUserId;
  switch (evType) {
    case EventType.ALIAS:
      // By default (1.), Alias config file populates user_id and global_user_id
      // if the alias Rudder call has unmap set, delete the global_user_id key from AM event payload
      // https://help.amplitude.com/hc/en-us/articles/360002750712-Portfolio-Cross-Project-Analysis#h_76557c8b-54cd-4e28-8c82-2f6778f65cd4
      unmapUserId = get(message, "integrations.Amplitude.unmap");
      if (unmapUserId) {
        payload.user_id = unmapUserId;
        delete payload.global_user_id;
        payload.unmap = true;
      }
      aliasResponse.method = defaultPostRequestConfig.requestMethod;
      aliasResponse.endpoint = ALIAS_ENDPOINT;
      aliasResponse.userId = message.anonymousId;
      payload = removeUndefinedValues(payload);
      aliasResponse.body.FORM = {
        api_key: destination.Config.apiKey,
        [rootElementName]: [JSON.stringify(payload)]
      };
      respList.push(aliasResponse);
      break;
    default:
      if (message.channel === "mobile") {
        set(payload, "device_brand", message.context.device.manufacturer);
      }

      payload.time = new Date(
        getFieldValueFromMessage(message, "timestamp")
      ).getTime();

      // send user_id only when present, for anonymous users not required
      if (
        message.userId &&
        message.userId !== "" &&
        message.userId !== "null" &&
        message.userId !== null
      ) {
        payload.user_id = message.userId;
      }
      payload.session_id = getSessionId(payload);

      // we are not fixing the verson for android specifically any more because we've put a fix in iOS SDK
      // for correct versionName
      // ====================
      // fixVersion(payload, message);

      payload.ip = getParsedIP(message);
      payload = removeUndefinedValues(payload);
      response.endpoint = endpoint;
      response.method = defaultPostRequestConfig.requestMethod;
      response.headers = {
        "Content-Type": "application/json"
      };
      response.userId = message.anonymousId;
      response.body.JSON = {
        api_key: destination.Config.apiKey,
        [rootElementName]: [payload],
        [addOptions]: addMinIdlength()
      };
      respList.push(response);

      // https://developers.amplitude.com/docs/group-identify-api
      // Refer (1.), Rudder group call updates group propertiees.
      if (evType === EventType.GROUP && groupInfo) {
        groupResponse.method = defaultPostRequestConfig.requestMethod;
        groupResponse.endpoint = GROUP_ENDPOINT;
        let groupPayload = Object.assign(groupInfo);
        groupResponse.userId = message.anonymousId;
        groupPayload = removeUndefinedValues(groupPayload);
        groupResponse.body.FORM = {
          api_key: destination.Config.apiKey,
          identification: [JSON.stringify(groupPayload)]
        };
        respList.push(groupResponse);
      }
      break;
  }
  return respList;
}

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
function processSingleMessage(message, destination) {
  let payloadObjectName = "events";
  let evType;
  let groupTraits;
  let groupTypeTrait;
  let groupValueTrait;
  // It is expected that Rudder alias. identify group calls won't have this set
  // To be used for track/page calls to associate the event to a group in AM
  let groupInfo = get(message, "integrations.Amplitude.groups") || undefined;
  let category = ConfigCategory.DEFAULT;

  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.IDENTIFY:
      payloadObjectName = "events"; // identify same as events
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
    case EventType.GROUP:
      evType = "group";
      payloadObjectName = "events";
      category = ConfigCategory.GROUP;
      // read from group traits from message
      // groupTraits => top level "traits" for JS SDK
      // groupTraits => "context.traits" for mobile SDKs
      groupTraits = getFieldValueFromMessage(message, "groupTraits");
      // read destination config related group settings
      // https://developers.amplitude.com/docs/group-identify-api
      groupTypeTrait = get(destination, "Config.groupTypeTrait");
      groupValueTrait = get(destination, "Config.groupValueTrait");
      if (groupTypeTrait && groupValueTrait) {
        const groupTypeValue = get(groupTraits, groupTypeTrait);
        const groupNameValue = get(groupTraits, groupValueTrait);
        // since the property updates on group at https://api2.amplitude.com/groupidentify
        // expects a string group name and value , so error out if the keys are not primitive
        // Note: This different for groups object at https://api.amplitude.com/2/httpapi where the
        // group value can be array of strings as well.
        if (
          groupTypeValue &&
          typeof groupTypeValue === "string" &&
          groupNameValue &&
          (typeof groupNameValue === "string" ||
            typeof groupNameValue === "number")
        ) {
          groupInfo = {};
          groupInfo.group_type = groupTypeValue;
          groupInfo.group_value = groupNameValue;
          // passing the entire group traits without deleting the above keys
          groupInfo.group_properties = groupTraits;
        } else {
          logger.debug("Group call parameters are not valid");
          throw new Error("Group call parameters are not valid");
        }
      }
      break;
    case EventType.ALIAS:
      evType = "alias";
      // the alias call params end up under "mapping" params
      // https://help.amplitude.com/hc/en-us/articles/360002750712-Portfolio-Cross-Project-Analysis#h_76557c8b-54cd-4e28-8c82-2f6778f65cd4
      payloadObjectName = "mapping";
      category = ConfigCategory.ALIAS;
      break;
    case EventType.TRACK:
      evType = message.event;

      if (
        message.properties &&
        message.properties.revenue &&
        message.properties.revenue_type
      ) {
        // if properties has revenue and revenue_type fields
        // consider the event as revenue event directly
        category = ConfigCategory.REVENUE;
        break;
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
    groupInfo,
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
  if (eventType === Event.ORDER_CANCELLED.name) {
    // eslint-disable-next-line no-undef
    eventtype = Event.ORDER_CANCELLED.name;
    // eslint-disable-next-line no-undef
    return processProductListAction(message);
  }
  if (eventType === Event.ORDER_REFUNDED.name) {
    eventtype = Event.ORDER_REFUNDED.name;

    return processProductListAction(message);
  }
  if (eventType === Event.ORDER_COMPLETED.name) {
    eventtype = Event.ORDER_COMPLETED.name;
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
  let temp;
  if (
    messageType === EventType.TRACK &&
    (eventType === Event.PRODUCT_LIST_VIEWED.name ||
      eventType === Event.PRODUCT_LIST_CLICKED.name)
  ) {
    // toSendEvents.push(processProductListAction(message));
    temp = processProductListAction(message);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < temp.length; i += 1) {
      toSendEvents.push(temp[i]);
    }
  } else if (
    messageType === EventType.TRACK &&
    (eventType === Event.CHECKOUT_STARTED.name ||
      eventType === Event.ORDER_UPDATED.name ||
      eventType === Event.ORDER_COMPLETED.name ||
      eventType === Event.ORDER_CANCELLED.name)
  ) {
    temp = processTransaction(message);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < temp.length; i += 1) {
      toSendEvents.push(temp[i]);
    }
  } else {
    toSendEvents.push(message);
  }

  toSendEvents.forEach(sendEvent => {
    respList.push(...processSingleMessage(sendEvent, destination));
  });
  return respList;
}

function getBatchEvents(message, metadata, batchEventResponse) {
  let batchComplete = false;
  const batchEventArray =
    get(batchEventResponse, "batchedRequest.body.JSON.events") || [];
  const batchEventJobs = get(batchEventResponse, "metadata") || [];
  const batchPayloadJSON =
    get(batchEventResponse, "batchedRequest.body.JSON") || {};
  const incomingMessageJSON = get(message, "body.JSON");
  let incomingMessageEvent = get(message, "body.JSON.events");
  // check if the incoming singular event is an array or not
  // and set it back to array
  incomingMessageEvent = Array.isArray(incomingMessageEvent)
    ? incomingMessageEvent[0]
    : incomingMessageEvent;
  const userId = incomingMessageEvent.user_id;

  // delete the userId as it is less than 5 as AM is giving 400
  // that is not a documented behviour where it states if either deviceid or userid is present
  // batch request won't return 400
  //   {
  //     "code": 400,
  //     "events_with_invalid_id_lengths": {
  //         "user_id": [
  //             0
  //         ]
  //     },
  //     "error": "Invalid id length for user_id or device_id"
  // }
  if (batchEventsWithUserIdLengthLowerThanFive && userId && userId.length < 5) {
    delete incomingMessageEvent.user_id;
  }

  set(message, "body.JSON.events", [incomingMessageEvent]);
  // if this is the first event, push to batch and return

  if (batchEventArray.length === 0) {
    if (JSON.stringify(incomingMessageJSON).length < AMBatchSizeLimit) {
      delete message.body.JSON.options;
      batchEventResponse = Object.assign(batchEventResponse, {
        batchedRequest: message
      });
      set(batchEventResponse, "batchedRequest.endpoint", BATCH_EVENT_ENDPOINT);
      batchEventResponse.metadata = [metadata];
    } else {
      // check not required as max individual event size is always less than 20MB
      // https://developers.amplitude.com/docs/batch-event-upload-api#feature-comparison-between-httpapi-2httpapi--batch
      // batchComplete = true;
    }
  } else {
    // https://developers.amplitude.com/docs/batch-event-upload-api#feature-comparison-between-httpapi-2httpapi--batch
    if (
      batchEventArray.length < AMBatchEventLimit &&
      JSON.stringify(batchPayloadJSON).length +
        JSON.stringify(incomingMessageEvent).length <
        AMBatchSizeLimit
    ) {
      batchEventArray.push(incomingMessageEvent); // set value
      batchEventJobs.push(metadata);
      set(
        batchEventResponse,
        "batchedRequest.body.JSON.events",
        batchEventArray
      );
      set(batchEventResponse, "metadata", batchEventJobs);
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
  let response;
  let isBatchComplete;
  let jsonBody;
  let userId;
  let deviceId;
  let messageEvent;
  let destinationObject;
  destEvents.forEach(ev => {
    const { message, metadata, destination } = ev;
    destinationObject = { ...destination };
    jsonBody = get(message, "body.JSON");
    messageEvent = get(message, "body.JSON.events");
    userId =
      messageEvent && Array.isArray(messageEvent)
        ? messageEvent[0].user_id
        : messageEvent
        ? messageEvent.user_id
        : undefined;
    deviceId =
      messageEvent && Array.isArray(messageEvent)
        ? messageEvent[0].device_id
        : messageEvent
        ? messageEvent.device_id
        : undefined;
    // this case shold not happen and should be filtered already
    // by the first pass of single event transformation
    if (messageEvent && !userId && !deviceId) {
      return;
    }
    // check if not a JSON body or (userId length < 5 && batchEventsWithUserIdLengthLowerThanFive is false) or
    // (batchEventsWithUserIdLengthLowerThanFive is true and userId is less than 5 but deviceId not present)
    // , send the event as is after batching
    if (
      Object.keys(jsonBody).length === 0 ||
      (!batchEventsWithUserIdLengthLowerThanFive &&
        userId &&
        userId.length < 5) ||
      (batchEventsWithUserIdLengthLowerThanFive &&
        userId &&
        userId.length < 5 &&
        !deviceId)
    ) {
      response = defaultBatchRequestConfig();
      response = Object.assign(response, { batchedRequest: message });
      response.metadata = [metadata];
      response.destination = destinationObject;
      respList.push(response);
    } else {
      // check if the event can be pushed to an existing batch
      isBatchComplete = getBatchEvents(message, metadata, batchEventResponse);
      if (isBatchComplete) {
        // if the batch is already complete, push it to response list
        // and push the event to a new batch
        batchEventResponse.destination = destinationObject;
        respList.push({ ...batchEventResponse });
        batchEventResponse = defaultBatchRequestConfig();
        batchEventResponse.destination = destinationObject;
        isBatchComplete = getBatchEvents(message, metadata, batchEventResponse);
      }
    }
  });
  // if there is some unfinished batch push it to response list
  if (isBatchComplete !== undefined && isBatchComplete === false) {
    batchEventResponse.destination = destinationObject;
    respList.push(batchEventResponse);
  }
  return respList;
}

exports.process = process;
exports.batch = batch;
