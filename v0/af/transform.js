const _ = require("lodash");
const get = require("get-value");
const set = require("set-value");
const data = require("../../__tests__/data/af_input.json");

const { EventType } = require("../../constants");
const { removeUndefinedValues, defaultRequestConfig } = require("../util");

const {
  Event,
  ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
} = require("./config");

// Helper function for generating desired JSON from Map
const mapToObj = m => {
  return Array.from(m).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
};

// TODO
function responseBuilderSimple(parameterMap, jsonQobj) {
  var responseMap = new Map();
  var app_id = String(
    jsonQobj
      .find("rl_context")
      .find("rl_app")
      .find("rl_namespace")
      .value()
  );
  responseMap.set("endpoint", ENDPOINT + app_id);

  var requestConfigMap = new Map();
  requestConfigMap.set("request-format", "JSON");
  requestConfigMap.set("request_method", "POST");

  responseMap.set("request_config", mapToObj(requestConfigMap));

  jsonQobj.find("rl_anonymous_id").each(function(index, path, value) {
    responseMap.set("user_id", String(value));
  });

  var headerMap = new Map();
  jsonQobj.find("rl_destination").each((i, p, value) => {
    headerMap.set("authentication", String(value.Config.apiKey));
    parameterMap.set("appsflyer_id", String(value.Config.appsFlyerId));
  });
  headerMap.set("Content-Type", "application/json");
  responseMap.set("header", mapToObj(headerMap));

  jsonQobj.find("rl_destination_props").each((i, p, value) => {
    parameterMap.set("appsflyer_id", String(value.AF.rl_af_uid));
  });

  // customer_user_id
  jsonQobj.find("rl_user_id").each(function(index, path, value) {
    parameterMap.set("customer_user_id", String(value));
  });
  // parameterMap.set("advertising_id","1");
  // parameterMap.set("eventCurrency","1");
  parameterMap.set("eventTime", String(jsonQobj.find("rl_timestamp").value()));
  parameterMap.set("af_events_api", "true");

  responseMap.set("payload", mapToObj(parameterMap));

  var responseJson = JSON.stringify(mapToObj(responseMap));

  var events = [];
  events.push(responseJson);
  return events;
}

function getEventValueForUnIdentifiedTrackEvent(
  message,
  destination,
  rawPayload
) {
  const properties = message.properties;
  set(rawPayload, "eventValue", JSON.stringify(properties));
  return rawPayload;
}

// TODO
function getEventValueMapFromMappingJson(
  message,
  destination,
  jsonFile,
  isMultiSupport,
  rawPayload
) {
  // for (const key in message) {
  //   if (key === "properties") {
  //     console.log(key);
  //     console.log(message[key]);
  //     for (const )
  //   }
  // }
  // message.properties.for((key, pair) => {
  //   console.log(key, pair);
  //   // if ((`properties.${key}`).length === 0){
  //   //   message.properties[key] = key;
  //   // }
  // });
  // jsonQobj.find("rl_properties").each(function(index, path, value) {
  //   console.log("=============");
  //   console.log(value);
  //   var mappingJsonQObj = jsonQ(mappingJson);
  //   jsonQ.each(value, function(key, val) {
  //     console.log("==key==:: ", key);
  //     if (mappingJsonQObj.find("rl_properties." + key).length == 0) {
  //       console.log("===adding extra mapping===");
  //       moreMappedJson["rl_properties." + key] = key;
  //     }
  //   });
  // });
  // jsonQ.each(moreMappedJson, function(sourceKey, destinationKey) {
  //   var tempObj = jsonQobj.find("rl_context").parent();
  //   var pathElements = sourceKey.split(".");
  //   for (var i = 0; i < pathElements.length; i++) {
  //     tempObj = tempObj.find(pathElements[i]);
  //   }
  //   tempObj.each(function(index, path, value) {
  //     eventValueMap.set(String(destinationKey), String(value));
  //   });
  // });
  // if (isMultiSupport) {
  //   var productIdArray = jsonQobj
  //     .find("rl_properties")
  //     .find("products")
  //     .find("product_id")
  //     .parent();
  //   var contentIdArray = [];
  //   var quantityArray = [];
  //   var priceArray = [];
  //   productIdArray.each(function(path, index, value) {
  //     contentIdArray.push(value.product_id);
  //     quantityArray.push(value.quantity);
  //     priceArray.push(value.price);
  //   });
  //   eventValueMap.set("af_content_id", contentIdArray);
  //   eventValueMap.set("af_quantity", quantityArray);
  //   eventValueMap.set("af_price", priceArray);
  // }
  // var eventValue = JSON.stringify(mapToObj(eventValueMap));
  // if (eventValue == "{}") {
  //   eventValue = "";
  // }
  // parameterMap.set("eventValue", eventValue);
}

async function processNonTrackEvents(message, destination, eventName) {
  const rawPayload = {};
  set(rawPayload, "eventName", eventName);
  return await getEventValueForUnIdentifiedTrackEvent(
    message,
    destination,
    rawPayload
  );
}

async function processEventTypeTrack(message, destination) {
  let isMultiSupport;
  let isUnIdentifiedEvent = false;
  let jsonFile;
  const evType = message.event.toLowerCase();
  const rawPayload = {};

  switch (evType) {
    case Event.WISHLIST_PRODUCT_ADDED_TO_CART.name:
      eventName = "af_add_to_cart";
      isMultiSupport = true;
      jsonFile = Event.WISHLIST_PRODUCT_ADDED_TO_CART.category.name;
      break;
    case Event.PRODUCT_ADDED_TO_WISHLIST:
      eventName = "af_add_to_wishlist";
      isMultiSupport = true;
      jsonFile = Event.PRODUCT_ADDED_TO_WISHLIST.category.name;
      break;
    case Event.CHECKOUT_STARTED:
      eventName = "af_initiated_checkout";
      isMultiSupport = true;
      jsonFile = Event.CHECKOUT_STARTED.category.name;
      break;
    case Event.ORDER_COMPLETED:
      eventName = "af_purchase";
      isMultiSupport = true;
      jsonFile = Event.ORDER_COMPLETED.category.name;
      break;
    case Event.PRODUCT_REMOVED:
      eventName = "remove_from_cart";
      isMultiSupport = true;
      jsonFile = Event.PRODUCT_REMOVED.category.name;
      break;
    case Event.PRODUCT_SEARCHED:
      eventName = "af_search";
      isMultiSupport = true;
      jsonFile = Event.PRODUCT_SEARCHED.category.name;
      break;
    case Event.PRODUCT_VIEWED:
      eventName = "af_content_view";
      isMultiSupport = true;
      jsonFile = Event.PRODUCT_VIEWED.category.name;
      break;
    case Event.DEFAULT:
      eventName = evType.toLowerCase();
      isUnIdentifiedEvent = true;
      break;
  }
  set(rawPayload, "eventName", eventName);
  if (isUnIdentifiedEvent) {
    getEventValueForUnIdentifiedTrackEvent(message, rawPayload);
  } else {
    getEventValueMapFromMappingJson(
      message,
      destination,
      jsonFile,
      isMultiSupport,
      rawPayload
    );
  }
}

const processSingleMessage = async (message, destination) => {
  const messageType = message.type.toLowerCase();
  let payload;
  switch (messageType) {
    case EventType.TRACK:
      eventName = EventType.TRACK;
      evType = message.event;
      payload = processEventTypeTrack(message, destination);
      break;

    case EventType.SCREEN:
      eventName = EventType.SCREEN;
      evType = message.event;
      payload = processNonTrackEvents(message, destination, eventName);

      break;
    case EventType.PAGE:
      eventName = EventType.PAGE;
      evType = message.event;
      payload = processNonTrackEvents(message, destination, eventName);
      break;

    default:
      break;
  }
  // return responseBuilderSimple(rawPayload, message);
};

async function process() {
  const respList = [];
  const events = data;

  events.forEach(event => {
    const { message, destination } = event;
    respList.push(processSingleMessage(message, destination));
  });
  //   return respList;
}

exports.process = process;
