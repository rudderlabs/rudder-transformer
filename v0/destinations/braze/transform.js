const get = require("get-value");
const _ = require("lodash");

const { EventType } = require("../../../constants");
const {
  defaultBatchRequestConfig,
  defaultRequestConfig,
  getDestinationExternalID,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues
} = require("../../util");
const {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint,
  BRAZE_PARTNER_NAME,
  BRAZE_MAX_REQ_COUNT
} = require("./config");

function formatGender(gender) {
  if (!gender) return;
  if (typeof gender !== "string") return;

  const femaleGenders = ["woman", "female", "w", "f"];
  const maleGenders = ["man", "male", "m"];
  const otherGenders = ["other", "o"];

  if (femaleGenders.indexOf(gender.toLowerCase()) > -1) return "F";
  if (maleGenders.indexOf(gender.toLowerCase()) > -1) return "M";
  if (otherGenders.indexOf(gender.toLowerCase()) > -1) return "O";
}

function buildResponse(message, destination, properties, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.userId = message.userId || message.anonymousId;
  response.body.JSON = removeUndefinedAndNullValues(properties);
  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${destination.Config.restApiKey}`
    },
    userId: message.userId || message.anonymousId
  };
}

function setAliasObjectWithAnonId(payload, message) {
  if (message.anonymousId) {
    payload.user_alias = {
      alias_name: message.anonymousId,
      alias_label: "rudder_id"
    };
  }
  return payload;
}

function setExternalId(payload, message) {
  const externalId =
    getDestinationExternalID(message, "brazeExternalId") || message.userId;
  if (externalId) {
    payload.external_id = externalId;
  }
  return payload;
}

function setExternalIdOrAliasObject(payload, message) {
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  if (userId || getDestinationExternalID(message, "brazeExternalId")) {
    return setExternalId(payload, message);
  }

  payload._update_existing_only = false;
  return setAliasObjectWithAnonId(payload, message);
}

function getIdentifyPayload(message) {
  let payload = {};
  payload = setAliasObjectWithAnonId(payload, message);
  payload = setExternalId(payload, message);
  return { aliases_to_identify: [payload] };
}

function getUserAttributesObject(message, mappingJson) {
  const data = {};
  const destKeys = Object.keys(mappingJson);
  destKeys.forEach(destKey => {
    const sourceKeys = mappingJson[destKey];

    let value;
    for (let index = 0; index < sourceKeys.length; index += 1) {
      value = get(message, sourceKeys[index]);

      if (value) {
        break;
      }
    }

    if (value) {
      if (destKey === "gender") {
        data[destKey] = formatGender(value);
      } else {
        data[destKey] = value;
      }
    }
  });

  // const sourceKeys = Object.keys(mappingJson);
  // sourceKeys.forEach(sourceKey => {
  //   const value = get(message, sourceKey);
  //   if (value) {
  //     if (mappingJson[sourceKey] === "gender") {
  //       data[mappingJson[sourceKey]] = formatGender(value);
  //     } else {
  //       data[mappingJson[sourceKey]] = value;
  //     }
  //   }
  // });

  const reserved = [
    "avatar",
    "address",
    "birthday",
    "email",
    "id",
    "firstname",
    "gender",
    "lastname",
    "phone",
    "facebook",
    "twitter",
    "first_name",
    "last_name",
    "dob",
    "external_id",
    "country",
    "home_city",
    "bio",
    "gender",
    "phone",
    "email_subscribe",
    "push_subscribe"
  ];

  const traits = message.traits || (message.context && message.context.traits);

  if (traits) {
    reserved.forEach(element => {
      delete traits[element];
    });

    Object.keys(traits).forEach(key => {
      data[key] = traits[key];
    });
  }

  return data;
}

function processIdentify(message, destination) {
  return buildResponse(
    message,
    destination,
    getIdentifyPayload(message),
    getIdentifyEndpoint(destination.Config.endPoint)
  );
}

function processTrackWithUserAttributes(message, destination, mappingJson) {
  let payload = getUserAttributesObject(message, mappingJson);
  payload = setExternalIdOrAliasObject(payload, message);
  return buildResponse(
    message,
    destination,
    { attributes: [payload] },
    getTrackEndPoint(destination.Config.endPoint)
  );
}

function handleReservedProperties(props) {
  // remove reserved keys from custom event properties
  // https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
  const reserved = [
    "time",
    "product_id",
    "quantity",
    "event_name",
    "price",
    "currency"
  ];

  reserved.forEach(element => {
    delete props[element];
  });
  return props;
}

function addMandatoryEventProperties(payload, message) {
  payload.name = message.event;
  payload.time = message.timestamp;
  return payload;
}

function addMandatoryPurchaseProperties(
  productId,
  price,
  currencyCode,
  quantity,
  timestamp
) {
  if (currencyCode) {
    return {
      product_id: productId,
      price,
      currency: currencyCode,
      quantity,
      time: timestamp
    };
  }
  return null;
  // payload.price = price;
  // payload.product_id = productId;
  // payload.currency = currencyCode;
  // payload.quantity = quantity;
  // payload.time = timestamp;
  // return payload;
}

function getPurchaseObjs(message) {
  const { products } = message.properties;
  const currencyCode = message.properties.currency;

  const purchaseObjs = [];

  if (products) {
    // we have to make a separate call to appboy for each product
    products.forEach(product => {
      const productId = product.product_id || product.sku;
      const { price, quantity, currency } = product;
      if (productId && price && quantity) {
        if (Number.isNaN(price) || Number.isNaN(quantity)) {
          return;
        }
        let purchaseObj = addMandatoryPurchaseProperties(
          productId,
          price,
          currencyCode || currency,
          quantity,
          message.timestamp
        );
        if (purchaseObj) {
          purchaseObj = setExternalIdOrAliasObject(purchaseObj, message);
          purchaseObjs.push(purchaseObj);
        }
      }
    });
  }

  return purchaseObjs.length === 0 ? null : purchaseObjs;
}

function processTrackEvent(messageType, message, destination, mappingJson) {
  const eventName = message.event;

  if (!message.properties) {
    message.properties = {};
  }
  let { properties } = message;

  let attributePayload = getUserAttributesObject(message, mappingJson);
  attributePayload = setExternalIdOrAliasObject(attributePayload, message);

  if (
    messageType === EventType.TRACK &&
    eventName.toLowerCase() === "order completed"
  ) {
    const purchaseObjs = getPurchaseObjs(message);

    if (purchaseObjs) {
      // del used properties
      delete properties.products;
      delete properties.currency;

      let payload = {};
      payload.properties = properties;

      payload = setExternalIdOrAliasObject(payload, message);
      return buildResponse(
        message,
        destination,
        {
          attributes: [attributePayload],
          purchases: purchaseObjs,
          partner: BRAZE_PARTNER_NAME
        },
        getTrackEndPoint(destination.Config.endPoint)
      );
    }

    throw new Error("Invalid Order Completed event");
  }
  properties = handleReservedProperties(properties);
  let payload = {};

  // mandatory fields
  payload = addMandatoryEventProperties(payload, message);
  payload.properties = properties;

  payload = setExternalIdOrAliasObject(payload, message);
  return buildResponse(
    message,
    destination,
    {
      attributes: [attributePayload],
      events: [payload],
      partner: BRAZE_PARTNER_NAME
    },
    getTrackEndPoint(destination.Config.endPoint)
  );
}

function process(event) {
  const respList = [];
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();

  // Init -- mostly for test cases
  destination.Config.endPoint = "https://rest.fra-01.braze.eu";

  if (destination.Config.dataCenter) {
    const dataCenterArr = destination.Config.dataCenter.trim().split("-");
    if (dataCenterArr[0].toLowerCase() === "eu") {
      destination.Config.endPoint = "https://rest.fra-01.braze.eu";
    } else {
      destination.Config.endPoint = `https://rest.iad-${dataCenterArr[1]}.braze.com`;
    }
  }

  let category = ConfigCategory.DEFAULT;
  switch (messageType) {
    case EventType.TRACK:
      response = processTrackEvent(
        messageType,
        message,
        destination,
        mappingConfig[category.name]
      );
      respList.push(response);
      break;
    case EventType.PAGE:
      message.event = message.name;
      response = processTrackEvent(
        messageType,
        message,
        destination,
        mappingConfig[category.name]
      );
      respList.push(response);
      break;
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      response = processIdentify(message, destination);
      respList.push(response);

      response = processTrackWithUserAttributes(
        message,
        destination,
        mappingConfig[category.name]
      );
      respList.push(response);
      break;
    default:
      throw new Error("Message type is not supported");
  }

  return respList;
}

// This function can return one or more batched events
// function getBatchedRequests(events) {
//   const response = defaultRequestConfig();
//   response.endpoint = events[0].destination.url;
//   response.method = "POST";
//   response.body.JSON = {
//     type: "batch",
//     data: events.map(ev => ev.message)
//   };
//
//   return [
//     {
//       batchedRequest: response,
//       jobs: events.map(ev => ev.metadata.job_id)
//     }
//   ];
// }

// function getBatchEvents(message, metadata, batchEventResponse) {
//   let batchComplete = false;
//   let batchEventArray =
//     get(batchEventResponse, "batchedRequest.body.JSON.events") || [];
//   let batchEventJobs = get(batchEventResponse, "metadata") || [];
//   let batchPayloadJSON =
//     get(batchEventResponse, "batchedRequest.body.JSON") || {};
//   let incomingMessageJSON = get(message, "body.JSON");
//   let incomingMessageEvent = get(message, "body.JSON.events");
//   // check if the incoming singular event is an array or not
//   // and set it back to array
//   incomingMessageEvent = Array.isArray(incomingMessageEvent)
//     ? incomingMessageEvent[0]
//     : incomingMessageEvent;
//   set(message, "body.JSON.events", [incomingMessageEvent]);
//   // if this is the first event, push to batch and return
//   if (batchEventArray.length == 0) {
//     if (JSON.stringify(incomingMessageJSON).length < AMBatchSizeLimit) {
//       delete message.body.JSON.options;
//       batchEventResponse = Object.assign(batchEventResponse, {
//         batchedRequest: message
//       });
//       set(batchEventResponse, "batchedRequest.endpoint", BATCH_EVENT_ENDPOINT);
//       batchEventResponse.metadata = [metadata];
//     } else {
//       // check not required as max individual event size is always less than 20MB
//       // https://developers.amplitude.com/docs/batch-event-upload-api#feature-comparison-between-httpapi-2httpapi--batch
//       // batchComplete = true;
//     }
//   } else {
//     // https://developers.amplitude.com/docs/batch-event-upload-api#feature-comparison-between-httpapi-2httpapi--batch
//     if (
//       batchEventArray.length < AMBatchEventLimit &&
//       JSON.stringify(batchPayloadJSON).length +
//         JSON.stringify(incomingMessageEvent).length <
//         AMBatchSizeLimit
//     ) {
//       batchEventArray.push(incomingMessageEvent); // set value
//       batchEventJobs.push(metadata);
//       set(
//         batchEventResponse,
//         "batchedRequest.body.JSON.events",
//         batchEventArray
//       );
//       set(batchEventResponse, "metadata", batchEventJobs);
//     } else {
//       // event could not be pushed
//       // it will be pushed again by a call from the caller of this method
//       batchComplete = true;
//     }
//   }
//   return batchComplete;
// }

function formatBatchResponse(batchPayload, metadataList, destination) {
  const response = defaultBatchRequestConfig();
  response.batchedRequest = batchPayload;
  response.metadata = metadataList;
  response.destination = destination;
  return response;
}

function batch(destEvents) {
  const respList = [];
  let trackEndpoint;
  let jsonBody;
  let endPoint;
  let type;
  let counter = 0;
  let attributesBatch = [];
  let eventsBatch = [];
  let purchasesBatch = [];
  let metadataBatch = [];

  for (let index = 0; index < destEvents.length; index += 1) {
    // take out a single event
    const ev = destEvents[index];
    const { message, metadata, destination } = ev;

    // get the JSON body
    jsonBody = get(message, "body.JSON");

    // get the type
    endPoint = get(message, "endpoint");
    type = endPoint && endPoint.includes("track") ? "track" : "identify";

    // if it is a track keep on adding to the existing track list
    // keep a count of event, attribute, purchases - 75 is the cap
    if (type === "track") {
      // keep the trackEndpoint for reuse later
      if (!trackEndpoint) {
        trackEndpoint = endPoint;
      }

      // look for events, attributes, purchases
      const { events, attributes, purchases } = jsonBody;

      // add only if present
      if (attributes) {
        attributesBatch.push(...attributes);
      }

      if (events) {
        eventsBatch.push(...events);
      }

      if (purchases) {
        purchasesBatch.push(...purchases);
      }

      // set the counter to max of len(attributesBatch), len(eventsBatch), len(purchasesBatch)
      counter = Math.max(
        attributesBatch.length,
        eventsBatch.length,
        purchasesBatch.length
      );

      // keep the original metadata object. needed later to form the batch
      metadataBatch.push(metadata);

      // put the cap on 75 or look for the last index
      if (counter >= BRAZE_MAX_REQ_COUNT || index === destEvents.length - 1) {
        // form a batch and start over
        // reuse the last message response for the auth and endpoint
        // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
        //  TODO: Need to think about reusing the code
        // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
        if (
          attributesBatch.length > 0 ||
          eventsBatch.length > 0 ||
          purchasesBatch.length > 0
        ) {
          const batchResponse = defaultRequestConfig();
          batchResponse.headers = message.headers;
          batchResponse.endpoint = trackEndpoint;
          batchResponse.body.JSON = {
            attributes: attributesBatch,
            events: eventsBatch,
            purchases: purchasesBatch,
            partner: BRAZE_PARTNER_NAME
          };
          // modify the endpoint to track endpoint
          batchResponse.endpoint = trackEndpoint;
          respList.push(
            formatBatchResponse(batchResponse, metadataBatch, destination)
          );

          // clear the arrays and reuse
          attributesBatch = [];
          eventsBatch = [];
          purchasesBatch = [];
          metadataBatch = [];
        }
        // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
      }
    } else {
      // identify
      // form a batch with whatever we have till now
      // reuse the last message response for the auth and endpoint
      // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
      //  TODO: Need to think about reusing the code
      // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
      // don't add the response if everything is empty
      if (
        attributesBatch.length > 0 ||
        eventsBatch.length > 0 ||
        purchasesBatch.length > 0
      ) {
        const batchResponse = defaultRequestConfig();
        batchResponse.headers = message.headers;
        batchResponse.endpoint = trackEndpoint;
        batchResponse.body.JSON = {
          attributes: attributesBatch,
          events: eventsBatch,
          purchases: purchasesBatch,
          partner: BRAZE_PARTNER_NAME
        };
        // modify the endpoint as message object will have identify endpoint
        batchResponse.endpoint = trackEndpoint;
        respList.push(
          formatBatchResponse(batchResponse, metadataBatch, destination)
        );

        // clear the arrays and reuse
        attributesBatch = [];
        eventsBatch = [];
        purchasesBatch = [];
        metadataBatch = [];
      }
      // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

      // separate out the identify request
      respList.push(formatBatchResponse(message, [metadata], destination));
    }
  }

  return respList;
}

/*
 *
  input: [
   { "message": {"id": "m1"}, "metadata": {"job_id": 1}, "destination": {"ID": "a", "url": "a"} },
   { "message": {"id": "m2"}, "metadata": {"job_id": 2}, "destination": {"ID": "a", "url": "a"} },
   { "message": {"id": "m3"}, "metadata": {"job_id": 3}, "destination": {"ID": "a", "url": "a"} },
   { "message": {"id": "m4"}, "metadata": {"job_id": 4}, "destination": {"ID": "a", "url": "a"} }
  ]
  output: [
    { batchedRequest: {}, jobs: [1, 3]},
    { batchedRequest: {}, jobs: [2, 4]},
  ]
*/

// function batch(events) {
//   // Replace this with destination specific batching logic
//   const perChunk = 2;
//   const batchedEvents = events.reduce((resultArray, item, index) => {
//     const chunkIndex = Math.floor(index / perChunk);
//
//     if (!resultArray[chunkIndex]) {
//       resultArray[chunkIndex] = []; // start a new chunk
//     }
//
//     resultArray[chunkIndex].push(item);
//
//     return resultArray;
//   }, []);
//
//   // Create response for every batch
//   const finalResponse = [];
//   for (let i = 0; i < batchedEvents.length; i += 1) {
//     const batchedRequests = getBatchedRequests(batchedEvents[i]);
//     if (batchedRequests.length > 0) {
//       finalResponse.push(...batchedRequests);
//     }
//   }
//
//   return finalResponse;
// }

module.exports = {
  process,
  batch
};
