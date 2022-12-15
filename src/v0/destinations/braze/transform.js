/* eslint-disable no-nested-ternary,no-param-reassign */
const get = require("get-value");

const { EventType, MappedToDestinationKey } = require("../../../constants");
const {
  adduserIdFromExternalId,
  defaultBatchRequestConfig,
  defaultRequestConfig,
  getDestinationExternalID,
  getFieldValueFromMessage,
  removeUndefinedValues,
  isDefinedAndNotNull,
  simpleProcessRouterDest
} = require("../../util");

const { InstrumentationError } = require("../../util/errorTypes");

const {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint,
  getSubscriptionGroupEndPoint,
  BRAZE_PARTNER_NAME,
  TRACK_BRAZE_MAX_REQ_COUNT,
  IDENTIFY_BRAZE_MAX_REQ_COUNT
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
  response.body.JSON = removeUndefinedValues(properties);
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

  // eslint-disable-next-line no-underscore-dangle
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

  // return the traits as-is if message is mapped to destination
  if (get(message, MappedToDestinationKey)) {
    return traits;
  }

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
        if (value !== undefined) {
          data[traitKey] = value;
        }
      }
    });
  }

  return data;
}

function processIdentify(message, destination) {
  // override userId with externalId in context(if present) and event is mapped to destination
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    adduserIdFromExternalId(message);
  }

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
      if (productId && isDefinedAndNotNull(price) && quantity) {
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
    typeof eventName === "string" &&
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
    throw new InstrumentationError("Invalid Order Completed event");
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
  const groupId = getFieldValueFromMessage(message, "groupId");
  if (!groupId) {
    throw new InstrumentationError("Invalid groupId");
  }
  if (destination.Config.enableSubscriptionGroupInGroupCall) {
    if (!(message.traits && (message.traits.phone || message.traits.email))) {
      throw new InstrumentationError(
        "Message should have traits with subscriptionState, email or phone"
      );
    }
    const subscriptionGroup = {};
    subscriptionGroup.subscription_group_id = groupId;
    if (
      message.traits.subscriptionState !== "subscribed" &&
      message.traits.subscriptionState !== "unsubscribed"
    ) {
      throw new InstrumentationError(
        "you must provide a subscription state in traits and possible values are subscribed and unsubscribed."
      );
    }
    subscriptionGroup.subscription_state = message.traits.subscriptionState;
    subscriptionGroup.external_id = [message.userId || message.anonymousId];
    const phone = getFieldValueFromMessage(message, "phone");
    const email = getFieldValueFromMessage(message, "email");
    if (phone) {
      subscriptionGroup.phone = phone;
    } else if (email) {
      subscriptionGroup.email = email;
    }
    const response = defaultRequestConfig();
    response.endpoint = getSubscriptionGroupEndPoint(
      destination.Config.endPoint
    );
    response.body.JSON = removeUndefinedValues(subscriptionGroup);
    return {
      ...response,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${destination.Config.restApiKey}`
      }
    };
  }
  const groupAttribute = {};
  groupAttribute[`ab_rudder_group_${groupId}`] = true;
  setExternalId(groupAttribute, message);
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

  // Ref: https://www.braze.com/docs/user_guide/administrative/access_braze/braze_instances
  if (destination.Config.dataCenter) {
    const dataCenterArr = destination.Config.dataCenter.trim().split("-");
    if (dataCenterArr[0].toLowerCase() === "eu") {
      destination.Config.endPoint = `https://rest.fra-${dataCenterArr[1]}.braze.eu`;
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
      throw new InstrumentationError("Message type is not supported");
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
  let identifyEndpoint;
  let jsonBody;
  let endPoint;
  let type;
  let attributesBatch = [];
  let eventsBatch = [];
  let purchasesBatch = [];
  let trackMetadataBatch = [];
  let identifyMetadataBatch = [];
  let aliasBatch = [];
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

      if (maxCount > TRACK_BRAZE_MAX_REQ_COUNT) {
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
          // modify the endpoint to track endpoint
          batchResponse.endpoint = trackEndpoint;
          respList.push(
            formatBatchResponse(batchResponse, trackMetadataBatch, destination)
          );

          // clear the arrays and reuse
          attributesBatch = [];
          eventsBatch = [];
          purchasesBatch = [];
          trackMetadataBatch = [];
        }
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
      trackMetadataBatch.push(metadata);
    } else {
      // identify
      if (!identifyEndpoint) {
        identifyEndpoint = endPoint;
      }
      const aliasObjectArr = get(jsonBody, "aliases_to_identify");
      const aliasMaxCount =
        aliasBatch.length + (aliasObjectArr ? aliasObjectArr.length : 0);

      if (aliasMaxCount > IDENTIFY_BRAZE_MAX_REQ_COUNT) {
        // form an identify batch and start over
        const batchResponse = defaultRequestConfig();
        batchResponse.headers = message.headers;
        batchResponse.endpoint = identifyEndpoint;
        const responseBodyJson = {
          partner: BRAZE_PARTNER_NAME
        };
        if (aliasBatch.length > 0) {
          responseBodyJson.aliases_to_identify = [...aliasBatch];
        }
        batchResponse.body.JSON = responseBodyJson;
        respList.push(
          formatBatchResponse(batchResponse, identifyMetadataBatch, destination)
        );

        // clear the arrays and reuse
        aliasBatch = [];
        identifyMetadataBatch = [];
      }

      // separate out the identify request
      // respList.push(formatBatchResponse(message, [metadata], destination));
      if (aliasObjectArr.length > 0) {
        aliasBatch.push(aliasObjectArr[0]);
      }

      identifyMetadataBatch.push(metadata);
    }
  }

  // process identify events
  const ev = destEvents[index - 1];
  const { message, destination } = ev;
  if (aliasBatch.length > 0) {
    const identifyBatchResponse = defaultRequestConfig();
    identifyBatchResponse.headers = message.headers;
    const identifyResponseBodyJson = {
      partner: BRAZE_PARTNER_NAME
    };
    identifyResponseBodyJson.aliases_to_identify = aliasBatch;
    identifyBatchResponse.body.JSON = identifyResponseBodyJson;
    // modify the endpoint to identify endpoint
    identifyBatchResponse.endpoint = identifyEndpoint;
    respList.push(
      formatBatchResponse(
        identifyBatchResponse,
        identifyMetadataBatch,
        destination
      )
    );
  }

  // process track events
  if (
    attributesBatch.length > 0 ||
    eventsBatch.length > 0 ||
    purchasesBatch.length > 0
  ) {
    const trackBatchResponse = defaultRequestConfig();
    trackBatchResponse.headers = message.headers;
    trackBatchResponse.endpoint = trackEndpoint;
    const trackResponseBodyJson = {
      partner: BRAZE_PARTNER_NAME
    };
    if (attributesBatch.length > 0) {
      trackResponseBodyJson.attributes = attributesBatch;
    }
    if (eventsBatch.length > 0) {
      trackResponseBodyJson.events = eventsBatch;
    }
    if (purchasesBatch.length > 0) {
      trackResponseBodyJson.purchases = purchasesBatch;
    }
    trackBatchResponse.body.JSON = trackResponseBodyJson;
    // modify the endpoint to track endpoint
    trackBatchResponse.endpoint = trackEndpoint;
    respList.push(
      formatBatchResponse(trackBatchResponse, trackMetadataBatch, destination)
    );
  }

  return respList;
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest, batch };
