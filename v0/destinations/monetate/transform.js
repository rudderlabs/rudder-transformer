const get = require("get-value");
const set = require("set-value");

const {
  getValueFromMessage,
  defaultRequestConfig,
  removeUndefinedValues
} = require("../../util");
const { EventType } = require("../../../constants");

const { ENDPOINT, mappingConfig } = require("./config");

const createObject = type => {
  if (!type) {
    throw new Error("[createObject] type not defined");
  }
  switch (type.toLowerCase()) {
    case "array":
      return [];
    case "object":
      return {};
  }
};

const getStringValue = (value, key) => {
  let val;
  if (key === "sourceKeyValue") {
    val = value;
  } else if (key.startsWith("sourceKeyValue.")) {
    // gets the substring after the first .
    // sourceKeyValue.page.url => page.url
    const k = key.substring(key.indexOf(".") + 1);
    val = get(value, k);
  } else {
    // leave the sourceKey as it is if cannot be replaced
    val = key;
  }
  return val;
};

const getValue = (value, key) => {
  let val;
  if (typeof key === "string") {
    val = getStringValue(value, key);
  } else if (Array.isArray(key)) {
    val = [];
    key.forEach(k => {
      if (typeof k === "string") {
        const v = getStringValue(value, k);
        if (v) {
          val.push(v);
        }
      } else {
        // if child element of array is not a string, push it as it is
        // TODO : add support for more types
        val.push(k);
      }
    });
    if (val.length == 0) {
      val = undefined;
    }
  }
  return val;
};

const formatValue = (value, format) => {
  let formattedVal = {};
  // format is an object in this case
  // TODO : Add generic support for more types
  if (value && format) {
    let sourceKey, val;
    Object.keys(format).forEach(key => {
      sourceKey = format[key];
      val = getValue(value, sourceKey);
      formattedVal[key] = val;
    });
  }
  return formattedVal;
};

const customMetadataHandler = (payload, destKey, value, metadata) => {
  // make sure payload.destKey exists and is of correct type
  if (!get(payload, destKey) && metadata.targetType) {
    payload[destKey] = createObject(metadata.targetType);
  }
  // populate payload
  if (metadata.isTargetTypePrimite) {
    // set value directly if it is primitive
    // TODO : call format value for here, we can use the function alredy defined in utils
    set(payload, destKey, value);
  } else {
    // value is not a primitive type
    if (metadata.action && payload[destKey][metadata.action]) {
      payload[destKey][metadata.action](
        formatValue(value, metadata.targetFormat)
      );
    }
  }
};

const constructPayload = (message, mappingJson) => {
  // Mapping JSON should be an array
  if (Array.isArray(mappingJson) && mappingJson.length > 0) {
    const payload = {};

    mappingJson.forEach(mapping => {
      const { sourceKeys, destKey, required, metadata } = mapping;
      // get the value from event
      const value = getValueFromMessage(message, sourceKeys);
      if (value) {
        // set the value only if correct
        if (metadata) {
          customMetadataHandler(payload, destKey, value, metadata);
        } else {
          set(payload, destKey, value);
        }
      } else if (required) {
        // throw error if reqired value is missing
        throw new Error(
          `Missing required value from ${JSON.stringify(sourceKeys)}`
        );
      }
    });
    return payload;
  }
  return null;
};

function track(message, destination) {
  let rawPayload = constructPayload(message, mappingConfig["MONETATETrack"]);

  if (message.userId) {
    rawPayload.customerId = message.userId;
  } else {
    rawPayload.deviceId = message.anonymousId;
  }

  // Add Ecomm Events if applicable
  let evName = message.event;
  let properties = message.properties || {};
  if (evName) {
    if (evName == "Product Viewed") {
      if (properties.product_id) {
        const sku = properties.sku || "";
        rawPayload.events.push({
          eventType: "monetate:context:ProductDetailView",
          products: [
            {
              productId: properties.product_id,
              sku: sku
            }
          ]
        });
      }
    } else if (evName == "Product List Viewed") {
      if (properties.products && Array.isArray(properties.products)) {
        rawPayload.events.push({
          eventType: "monetate:context:ProductThumbnailView",
          products: properties.products.map(product =>
            product.product_id ? product.product_id.toString() : ""
          )
        });
      }
    } else if (evName == "Product Added") {
      let currency = properties.currency || "USD";
      const sku = properties.sku || "";
      rawPayload.events.push({
        eventType: "monetate:context:Cart",
        cartLines: [
          {
            pid: properties.product_id ? properties.product_id.toString() : "",
            sku: sku,
            quantity: properties.quantity,
            value: properties.cart_value
              ? properties.cart_value.toString()
              : "",
            currency: currency
          }
        ]
      });
    } else if (evName == "Cart Viewed") {
      if (properties.products && Array.isArray(properties.products)) {
        rawPayload.events.push({
          eventType: "monetate:context:Cart",
          cartLines: properties.products.map(product => {
            let cartValue = (product.quantity * product.price).toFixed(2);
            let currency = product.currency || properties.currency || "USD";
            const sku = product.sku || "";
            return {
              pid: product.product_id ? product.product_id.toString() : "",
              sku: sku,
              quantity: product.quantity,
              value: cartValue ? cartValue.toString() : "",
              currency: currency
            };
          })
        });
      }
    } else if (evName == "Order Completed") {
      let purchaseId = properties.order_id;
      let products = properties.products;
      if (purchaseId && products) {
        let purchaseLines = products.filter(
          product => product.quantity && product.price && product.product_id
        );
        rawPayload.events.push({
          eventType: "monetate:context:Purchase",
          purchaseId: purchaseId,
          purchaseLines: purchaseLines.map(product => {
            let valueStr = (product.quantity * product.price).toFixed(2);
            let currency = product.currency || properties.currency || "USD";
            const sku = product.sku || "";
            return {
              pid: product.product_id ? product.product_id.toString() : "",
              sku: sku,
              quantity: product.quantity,
              value: valueStr ? valueStr.toString() : "",
              currency: currency
            };
          })
        });
      }
    } else {
      // The Engine API does not currently support custom events.
      // For lifecycle events, we would prefer to add them to our spec,
      // rather than support free-form custom events.  Nevertheless, if
      // custom event support is added to the Engine API, the following
      // block can be uncommented.
      /*
        rawPayload.events.push({
          "eventType": "monetate:context:CustomEvents",
          "customEvents": [{
              name: evName,
              value: true,
          }],
        });
      */
    }
  }

  return responseBuilder(removeUndefinedValues(rawPayload), destination);
}

function page(message, destination) {
  let rawPayload = constructPayload(message, mappingConfig["MONETATEPage"]);

  return responseBuilder(removeUndefinedValues(rawPayload), destination);
}

function screen(message, destination) {
  let rawPayload = constructPayload(message, mappingConfig["MONETATEScreen"]);

  return responseBuilder(removeUndefinedValues(rawPayload), destination);
}

function responseBuilder(body, destination) {
  const destinationConfig = destination.Config || {};
  let response = defaultRequestConfig();

  // adding monetate channel to body
  body["channel"] = destinationConfig.monetateChannel;

  response.endpoint = ENDPOINT + destinationConfig.retailerShortName;
  response.body = body;
  response.headers = {
    "Content-Type": "application/json"
  };

  return response;
}

function process(event) {
  // get the event type
  let evType = get(event, "message.type");
  evType = evType ? evType.toLowerCase() : undefined;

  // call the appropriate handler based on event type
  if (evType) {
    switch (evType) {
      case EventType.TRACK:
        return track(event.message, event.destination);
      case EventType.PAGE:
        return page(event.message, event.destination);
      case EventType.SCREEN:
        return screen(event.message, event.destination);
      default:
        throw new Error(`Message type ${evType} not supported`);
    }
  }
  throw new Error("Message type missing from event");
}

exports.process = process;
