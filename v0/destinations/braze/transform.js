const get = require("get-value");

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
  // few possible cases of woman
  if (["woman", "female", "w", "f"].indexOf(gender.toLowerCase()) > -1) {
    return "F";
  }

  // few possible cases of man
  if (["man", "male", "m"].indexOf(gender.toLowerCase()) > -1) {
    return "M";
  }

  // few possible cases of other
  if (["other", "o"].indexOf(gender.toLowerCase()) > -1) {
    return "O";
  }

  return null;
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

// Ref: https://www.braze.com/docs/api/objects_filters/user_attributes_object/
function getUserAttributesObject(message, mappingJson) {
  // blank output object
  const data = {};
  // get traits from message
  const traits = getFieldValueFromMessage(message, "traits");

  // iterate over the destKeys and set the value if present
  Object.keys(mappingJson).forEach(destKey => {
    let value = get(traits, mappingJson[destKey]);
    if (value) {
      // handle gender special case
      if (destKey === "gender") {
        value = formatGender(value);
      }
      data[destKey] = value;
    }
  });

  // reserved keys : already mapped through mappingJson
  const reservedKeys = [
    "address",
    "birthday",
    "email",
    "firstName",
    "gender",
    "avatar",
    "lastName",
    "phone"
  ];

  if (traits) {
    // iterate over rest of the traits properties
    Object.keys(traits).forEach(traitKey => {
      // if traitKey is not reserved add the value to final output
      if (reservedKeys.indexOf(traitKey) === -1) {
        const value = get(traits, traitKey);
        if (value) {
          data[traitKey] = value;
        }
      }
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
  if (payload && Object.keys(payload).length > 0) {
    payload = setExternalIdOrAliasObject(payload, message);
    return buildResponse(
      message,
      destination,
      { attributes: [payload] },
      getTrackEndPoint(destination.Config.endPoint)
    );
  }
  return null;
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
  const requestJson = {
    partner: BRAZE_PARTNER_NAME
  };

  let attributePayload = getUserAttributesObject(message, mappingJson);
  if (attributePayload && Object.keys(attributePayload).length > 0) {
    attributePayload = setExternalIdOrAliasObject(attributePayload, message);
    requestJson.attributes = [attributePayload];
  }

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
  if (payload) {
    requestJson.events = [payload];
  }
  return buildResponse(
    message,
    destination,
    requestJson,
    getTrackEndPoint(destination.Config.endPoint)
  );
}

// For group call we will add a user attribute with the groupId attribute
// with the value as true
//
// Ex: If the groupId is 1234, we'll add a attribute to the user object with the
// key `ab_rudder_group_1234` with the value `true`
function processGroup(message, destination) {
  const groupAttribute = {};
  const groupId = getFieldValueFromMessage(message, "groupId");
  if (!groupId) {
    throw new Error("Invalid groupId");
  }
  groupAttribute[`ab_rudder_group_${groupId}`] = true;
  return buildResponse(
    message,
    destination,
    {
      attributes: [groupAttribute],
      partner: BRAZE_PARTNER_NAME
    },
    getTrackEndPoint(destination.Config.endPoint)
  );
}

function process(event) {
  const respList = [];
  let response;
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
      message.event =
        message.name || get(message, "properties.name") || "Page Viewed";
      response = processTrackEvent(
        messageType,
        message,
        destination,
        mappingConfig[category.name]
      );
      respList.push(response);
      break;
    case EventType.SCREEN:
      message.event =
        message.name || get(message, "properties.name") || "Screen Viewed";
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
      if (message.anonymousId) {
        response = processIdentify(message, destination);
        respList.push(response);
      }

      response = processTrackWithUserAttributes(
        message,
        destination,
        mappingConfig[category.name]
      );

      if (response) {
        respList.push(response);
      }
      break;
    case EventType.GROUP:
      response = processGroup(message, destination);
      respList.push(response);
      break;
    default:
      throw new Error("Message type is not supported");
  }

  return respList;
}

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
  let attributesBatch = [];
  let eventsBatch = [];
  let purchasesBatch = [];
  let metadataBatch = [];
  let index = 0;

  while (index < destEvents.length) {
    // take out a single event
    const ev = destEvents[index];
    const { message, metadata, destination } = ev;

    // get the JSON body
    jsonBody = get(message, "body.JSON");

    // get the type
    endPoint = get(message, "endpoint");
    type = endPoint && endPoint.includes("track") ? "track" : "identify";

    index += 1;

    // if it is a track keep on adding to the existing track list
    // keep a count of event, attribute, purchases - 75 is the cap
    if (type === "track") {
      // keep the trackEndpoint for reuse later
      if (!trackEndpoint) {
        trackEndpoint = endPoint;
      }

      // look for events, attributes, purchases
      const { events, attributes, purchases } = jsonBody;

      // if total count = 75 form a new batch
      const maxCount = Math.max(
        attributesBatch.length + (attributes ? attributes.length : 0),
        eventsBatch.length + (events ? events.length : 0),
        purchasesBatch.length + (purchases ? purchases.length : 0)
      );

      if (maxCount > BRAZE_MAX_REQ_COUNT) {
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
          const responseBodyJson = {
            partner: BRAZE_PARTNER_NAME
          };
          if (attributesBatch.length > 0) {
            responseBodyJson.attributes = attributesBatch;
          }
          if (eventsBatch.length > 0) {
            responseBodyJson.events = eventsBatch;
          }
          if (purchasesBatch.length > 0) {
            responseBodyJson.purchases = purchasesBatch;
          }
          batchResponse.body.JSON = responseBodyJson;
          // batchResponse.body.JSON = {
          //   attributes: attributesBatch,
          //   events: eventsBatch,
          //   purchases: purchasesBatch,
          // };
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

      // keep the original metadata object. needed later to form the batch
      metadataBatch.push(metadata);
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
        const responseBodyJson = {
          partner: BRAZE_PARTNER_NAME
        };
        if (attributesBatch.length > 0) {
          responseBodyJson.attributes = attributesBatch;
        }
        if (eventsBatch.length > 0) {
          responseBodyJson.events = eventsBatch;
        }
        if (purchasesBatch.length > 0) {
          responseBodyJson.purchases = purchasesBatch;
        }
        batchResponse.body.JSON = responseBodyJson;
        // batchResponse.body.JSON = {
        //   attributes: attributesBatch,
        //   events: eventsBatch,
        //   purchases: purchasesBatch,
        //   partner: BRAZE_PARTNER_NAME
        // };
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

  const ev = destEvents[index - 1];
  const { message, destination } = ev;
  if (
    attributesBatch.length > 0 ||
    eventsBatch.length > 0 ||
    purchasesBatch.length > 0
  ) {
    const batchResponse = defaultRequestConfig();
    batchResponse.headers = message.headers;
    batchResponse.endpoint = trackEndpoint;
    const responseBodyJson = {
      partner: BRAZE_PARTNER_NAME
    };
    if (attributesBatch.length > 0) {
      responseBodyJson.attributes = attributesBatch;
    }
    if (eventsBatch.length > 0) {
      responseBodyJson.events = eventsBatch;
    }
    if (purchasesBatch.length > 0) {
      responseBodyJson.purchases = purchasesBatch;
    }
    batchResponse.body.JSON = responseBodyJson;
    // batchResponse.body.JSON = {
    //   attributes: attributesBatch,
    //   events: eventsBatch,
    //   purchases: purchasesBatch,
    //   partner: BRAZE_PARTNER_NAME
    // };
    // modify the endpoint to track endpoint
    batchResponse.endpoint = trackEndpoint;
    respList.push(
      formatBatchResponse(batchResponse, metadataBatch, destination)
    );
  }

  return respList;
}

module.exports = {
  process,
  batch
};
