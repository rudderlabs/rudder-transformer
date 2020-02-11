const _ = require("lodash");
const get = require("get-value");
const set = require("set-value");

const { EventType, SpecedTraits, TraitsMapping } = require("../../constants");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig
} = require("../util");
const {
  Event, 
  ConfigCategory,
  mappingConfig,
  nameToEventMap,  
  getIdentifyEndpoint,
  getTrackEndPoint
} = require("./config");

// Get the spec'd traits, for now only address needs treatment as 2 layers.
const populateSpecedTraits = (payload, message) => {
  SpecedTraits.forEach(trait => {
    const mapping = TraitsMapping[trait];
    const keys = Object.keys(mapping);
    keys.forEach(key => {
      set(payload, "user_properties." + key, get(message, mapping[key]));
    });
  });
};

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

//https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
function stringToHash(string) {
  var hash = 0;

  if (string.length == 0) return hash;

  for (i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash);
}

function fixSessionId(payload) {
  payload.session_id = payload.session_id
    ? stringToHash(payload.session_id)
    : -1;
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

  set(rawPayload, "event_properties", message.properties);
  set(rawPayload, "user_properties", message.userProperties);

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });

  const endpoint = ENDPOINT; // evType === EventType.IDENTIFY ? IDENTIFY_ENDPOINT : ENDPOINT; // identify on same endpoint also works

  // in case of identify, populate user_properties from traits as well, don't need to send evType
  if (evType === EventType.IDENTIFY) {
    populateSpecedTraits(rawPayload, message);
    const traits = Object.keys(message.context.traits);
    traits.forEach(trait => {
      if (!SpecedTraits.includes(trait)) {
        set(
          rawPayload,
          "user_properties." + trait,
          get(message, "context.traits." + trait)
        );
      }
    });
    rawPayload.event_type = EventType.IDENTIFY_AM;
  } else {
    rawPayload.event_type = evType;
  }

  rawPayload.time = new Date(message.originalTimestamp).getTime();
  rawPayload.user_id = message.userId ? message.userId : message.anonymousId;
  const payload = removeUndefinedValues(rawPayload);
  fixSessionId(payload);

  // console.log(payload);
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.JSON = {
    api_key: destination.Config.apiKey,
    [rootElementName]: payload
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

  var messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      // payloadObjectName = "identification"; // identify same as events
      evType = "identify";
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.PAGE:
      evType = "pageview";
      category = ConfigCategory.PAGE;
      break;
    case EventType.SCREEN:
      evType = "screenview";
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
      console.log("could not determine type");
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
  const products = message.properties.products;

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


function formatGender(gender) {
  if (!gender) return;
  if (typeof gender !== 'string') return;

  var femaleGenders = ['woman', 'female', 'w', 'f'];
  var maleGenders = ['man', 'male', 'm'];
  var otherGenders = ['other', 'o'];

  if (femaleGenders.indexOf(gender.toLowerCase()) > -1) return 'F';
  if (maleGenders.indexOf(gender.toLowerCase()) > -1) return 'M';
  if (otherGenders.indexOf(gender.toLowerCase()) > -1) return 'O';
}

function buildResponse(message, properties, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.params = {
    ...properties
  };
  return response;
}

function setAliasObjectWithAnonId(payload,message){ 
  payload[ "user_alias" ] = {
      "alias_name" : message.anonymousId,
      "alias_label" : 'rudder_id'
    }
  return payload;
} 

function setExternalId(payload,message){
  if(message.userId)
    payload['external_id'] = message.userId;
  return payload;
}

function getIdentifyPayload(message){
  let payload = {};
  payload = setAliasObjectWithAnonId(payload,message);
  payload = setExternalId(payload,message);
  return {"aliases_to_identify" : payload};
}

function getUserAttributesObject(message,mappingJson){ 
  const sourceKeys = Object.keys(mappingJson);
  const data = {};
  sourceKeys.forEach(ś => {
    let value = get(message, sourceKey);
    if(value){
      if(mappingJson[sourceKey] === 'gender'){
        data[mappingJson[sourceKey]] = formatGender(value); 
      }
      else{
        data[mappingJson[sourceKey]] = value; 
      }
   }
  });

  var reserved = ['avatar', 'address', 'birthday', 'email', 'id', 'firstname', 'gender', 'lastname', 'phone', 'facebook', 'twitter', 'first_name', 'last_name', 'dob', 'external_id', 'country', 'home_city', 'bio', 'gender', 'phone', 'email_subscribe', 'push_subscribe'];
   
  reserved.forEach(element => {
    delete message.context.traits[element];
  }); 

  Object.keys(message.context.traits).forEach( key => {  
    data[key]=message.context.traits[key];
  });
  return data;

}

function appendApiKey(payload,destination){
  payload["api_key"] = destination.Config.restApiKey;
  return payload;
}

function processIdentify(message, destination) {
  return buildResponse(message, 
    appendApiKey(getIdentifyPayload(message),destination), 
    getIdentifyEndpoint(destination.Config.endPoint)); 
}

function processTrackWithUserAttributes(message, destination, mappingJson){ 
  let payload = getUserAttributesObject(message, mappingJson);
  payload = setExternalId(payload,message);
  payload = setAliasObjectWithAnonId(payload,message);
  payload = appendApiKey(payload,destination);
  return buildResponse(message, 
    payload, 
    getTrackEndPoint(destination.Config.endPoint));  
}

function process(event) {

  const respList = [];
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();
  const eventType = message.event ? message.event.toLowerCase() : undefined;


  if(destination.Config.dataCenter){
    let dataCenterArr =  destination.Config.dataCenter.trim().split('-');
    if(dataCenterArr[0].toLowerCase() === 'eu'){
       destination.Config.endPoint = 'https://rest.fra-01.braze.eu';
    }
    else{
       destination.Config.endPoint = 'https://rest.iad-'+dataCenterArr[1]+'.braze.com'
    }
  } 


  let category = ConfigCategory.DEFAULT; 
  switch (messageType) { 
    case EventType.TRACK:
      responses = processTrack(message, destination);
      responses.forEach(element => {
        element.statusCode = 200;
        respList.push(element);
      });
      break;
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      response = processIdentify(message, destination);
      response.statusCode = 200;
      respList.push(response);

      response = processTrackWithUserAttributes(message, destination, mappingConfig[category.name]);
      response.statusCode = 200;
      respList.push(response); 
      break;
  }


  console.log(JSON.stringify(respList, null, 4));
  return respList;

  const toSendEvents = [];
  if (
    messageType === EventType.TRACK &&
    (eventType === Event.PRODUCT_LIST_VIEWED.name ||
      eventType === Event.PRODUCT_LIST_CLICKED)
  ) {
    toSendEvents.push(processProductListAction(message));
  } else if (
    messageType === EventType.TRACK &&
    (eventType == Event.CHECKOUT_STARTED.name ||
      eventType == Event.ORDER_UPDATED.name ||
      eventType == Event.ORDER_COMPLETED.name ||
      eventType == Event.ORDER_CANCELLED.name)
  ) {
    toSendEvents.push(processTransaction(message));
  } else {
    toSendEvents.push(message);
  }

  toSendEvents.forEach(sendEvent => {
    const result = processSingleMessage(sendEvent, destination);
    if (!result.statusCode) {
      result.statusCode = 200;
    }
    respList.push(result);
  });
  return respList;
}

exports.process = process;
