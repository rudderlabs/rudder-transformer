const get = require("get-value");

const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues
} = require("../../util");
const {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint,
  BRAZE_PARTNER_NAME
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

function buildResponse(message, properties, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.userId = message.userId || message.anonymousId;
  response.body.JSON = removeUndefinedAndNullValues(properties);
  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    userId: message.userId || message.anonymousId
  };
}

function setAliasObjectWithAnonId(payload, message) {
  payload.user_alias = {
    alias_name: message.anonymousId,
    alias_label: "rudder_id"
  };
  return payload;
}

function setExternalId(payload, message) {
  if (message.userId) {
    payload.external_id = message.userId;
  }
  return payload;
}

function setExternalIdOrAliasObject(payload, message) {
  if (message.userId) {
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

  const traits = message.traits || message.context.traits;

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

function appendApiKey(payload, destination) {
  payload.api_key = destination.Config.restApiKey;
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
  payload,
  productId,
  price,
  currencyCode,
  quantity,
  timestamp
) {
  payload.price = price;
  payload.product_id = productId;
  payload.currency = currencyCode;
  payload.quantity = quantity;
  payload.time = timestamp;
  return payload;
}

function getPurchaseObjs(message) {
  const { products } = message.properties;
  const currencyCode = message.properties.currency;

  const purchaseObjs = [];

  if (products) {
    // we have to make a separate call to appboy for each product
    products.forEach(product => {
      const productId = product.product_id;
      const { price } = product;
      const { quantity } = product;
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
  const eventName = message.event;

  if (!message.properties) {
    message.properties = {};
  }
  let { properties } = message;

  let attributePayload = getUserAttributesObject(message, mappingJson);
  attributePayload = setExternalIdOrAliasObject(attributePayload, message);

  if (
    messageType == EventType.TRACK &&
    eventName.toLowerCase() === "order completed"
  ) {
    purchaseObjs = getPurchaseObjs(message);

    // del used properties
    delete properties.products;
    delete properties.currency;

    let payload = {};
    payload.properties = properties;

    payload = setExternalIdOrAliasObject(payload, message);
    return buildResponse(
      message,
      appendApiKey(
        {
          attributes: [attributePayload],
          purchases: purchaseObjs,
          partner: BRAZE_PARTNER_NAME
        },
        destination
      ),
      getTrackEndPoint(destination.Config.endPoint)
    );
  }
  properties = handleReservedProperties(properties);
  let payload = {};

  // mandatory fields
  payload = addMandatoryEventProperties(payload, message);
  payload.properties = properties;

  payload = setExternalIdOrAliasObject(payload, message);
  return buildResponse(
    message,
    appendApiKey(
      {
        attributes: [attributePayload],
        events: [payload],
        partner: BRAZE_PARTNER_NAME
      },
      destination
    ),
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
  }

  return respList;
}

exports.process = process;
