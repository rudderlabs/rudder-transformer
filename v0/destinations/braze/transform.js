const get = require("get-value");

const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues
} = require("../util");
const {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint
} = require("./config");

function formatGender(gender) {
  if (!gender) return;
  if (typeof gender !== "string") return;

  var femaleGenders = ["woman", "female", "w", "f"];
  var maleGenders = ["man", "male", "m"];
  var otherGenders = ["other", "o"];

  if (femaleGenders.indexOf(gender.toLowerCase()) > -1) return "F";
  if (maleGenders.indexOf(gender.toLowerCase()) > -1) return "M";
  if (otherGenders.indexOf(gender.toLowerCase()) > -1) return "O";
}

function buildResponse(message, properties, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.JSON = removeUndefinedAndNullValues(properties);
  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    userId: message.userId ? message.userId : message.anonymousId
  };
}

function setAliasObjectWithAnonId(payload, message) {
  payload["user_alias"] = {
    alias_name: message.anonymousId,
    alias_label: "rudder_id"
  };
  return payload;
}

function setExternalId(payload, message) {
  if (message.userId) payload["external_id"] = message.userId;
  return payload;
}

function setExternalIdOrAliasObject(payload, message) {
  if (message.userId) return setExternalId(payload, message);
  else {
    payload["_update_existing_only"] = false;
    return setAliasObjectWithAnonId(payload, message);
  }
}

function getIdentifyPayload(message) {
  let payload = {};
  payload = setAliasObjectWithAnonId(payload, message);
  payload = setExternalId(payload, message);
  return { aliases_to_identify: [payload] };
}

function getUserAttributesObject(message, mappingJson) {
  const sourceKeys = Object.keys(mappingJson);
  const data = {};
  sourceKeys.forEach(sourceKey => {
    let value = get(message, sourceKey);
    if (value) {
      if (mappingJson[sourceKey] === "gender") {
        data[mappingJson[sourceKey]] = formatGender(value);
      } else {
        data[mappingJson[sourceKey]] = value;
      }
    }
  });

  var reserved = [
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

  reserved.forEach(element => {
    delete message.context.traits[element];
  });

  Object.keys(message.context.traits).forEach(key => {
    data[key] = message.context.traits[key];
  });
  return data;
}

function appendApiKey(payload, destination) {
  payload["api_key"] = destination.Config.restApiKey;
  return payload;
}

function processIdentify(message, destination) {
  return buildResponse(
    message,
    appendApiKey(getIdentifyPayload(message), destination),
    getIdentifyEndpoint(destination.Config.endPoint)
  );
}

function processTrackWithUserAttributes(message, destination, mappingJson) {
  let payload = getUserAttributesObject(message, mappingJson);
  payload = setExternalIdOrAliasObject(payload, message);
  return buildResponse(
    message,
    appendApiKey({ attributes: [payload] }, destination),
    getTrackEndPoint(destination.Config.endPoint)
  );
}

function handleReservedProperties(props) {
  // remove reserved keys from custom event properties
  // https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
  var reserved = [
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
  payload["name"] = message.event;
  payload["time"] = message.timestamp;
  return payload;
}

function addMandatoryPurchaseProperties(
  payload,
  productId,
  price,
  currencyCode,
  quantity,
  timestamp
) {
  payload["price"] = price;
  payload["product_id"] = productId;
  payload["currency"] = currencyCode;
  payload["quantity"] = quantity;
  payload["time"] = timestamp;
  return payload;
}

function getPurchaseObjs(message) {
  var products = message.properties.products;
  var currencyCode = message.properties.currency;

  let purchaseObjs = [];

  if (products) {
    // we have to make a separate call to appboy for each product
    products.forEach(product => {
      var productId = product.product_id;
      var price = product.price;
      var quantity = product.quantity;
      if (quantity && price && productId) {
        let purchaseObj = {};
        purchaseObj = addMandatoryPurchaseProperties(
          purchaseObj,
          productId,
          price,
          currencyCode,
          quantity,
          message.timestamp
        );
        purchaseObj = setExternalIdOrAliasObject(purchaseObj, message);
        purchaseObjs.push(purchaseObj);
      }
    });
  }

  return purchaseObjs;
}

function processTrackEvent(messageType, message, destination, mappingJson) {
  var eventName = message.event;

  if (!message.properties) {
    message.properties = {};
  }
  var properties = message.properties;

  let attributePayload = getUserAttributesObject(message, mappingJson);
  attributePayload = setExternalIdOrAliasObject(attributePayload, message);

  if (
    messageType == EventType.TRACK &&
    eventName.toLowerCase() === "order completed"
  ) {
    purchaseObjs = getPurchaseObjs(message);

    // del used properties
    delete properties["products"];
    delete properties["currency"];

    let payload = {};
    payload["properties"] = properties;

    payload = setExternalIdOrAliasObject(payload, message);
    return buildResponse(
      message,
      appendApiKey(
        { attributes: [attributePayload], purchases: purchaseObjs },
        destination
      ),
      getTrackEndPoint(destination.Config.endPoint)
    );
  } else {
    properties = handleReservedProperties(properties);
    let payload = {};

    //mandatory fields
    payload = addMandatoryEventProperties(payload, message);
    payload["properties"] = properties;

    payload = setExternalIdOrAliasObject(payload, message);
    return buildResponse(
      message,
      appendApiKey(
        { attributes: [attributePayload], events: [payload] },
        destination
      ),
      getTrackEndPoint(destination.Config.endPoint)
    );
  }
}

function process(event) {
  const respList = [];
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();
  //console.log(JSON.stringify(message, null, 4));

  //Init -- mostly for test cases
  destination.Config.endPoint = "https://rest.fra-01.braze.eu";

  if (destination.Config.dataCenter) {
    let dataCenterArr = destination.Config.dataCenter.trim().split("-");
    if (dataCenterArr[0].toLowerCase() === "eu") {
      destination.Config.endPoint = "https://rest.fra-01.braze.eu";
    } else {
      destination.Config.endPoint =
        "https://rest.iad-" + dataCenterArr[1] + ".braze.com";
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
  }

  //console.log(JSON.stringify(respList, null, 4));
  return respList;
}

exports.process = process;
