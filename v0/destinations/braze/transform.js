const get = require("get-value");

const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  getDestinationExternalID
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
  payload.user_alias = {
    alias_name: message.anonymousId,
    alias_label: "rudder_id"
  };
  return payload;
}


function setExternalId(payload, message) {
  payload.external_id =
  getDestinationExternalID(message, "brazeExternalId") || message.userId;
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

exports.process = process;
