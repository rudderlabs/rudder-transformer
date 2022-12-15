const get = require("get-value");
const set = require("set-value");

const {
  getValueFromMessage,
  defaultRequestConfig,
  removeUndefinedValues,
  simpleProcessRouterDest,
  isDefinedAndNotNull
} = require("../../util");
const { EventType } = require("../../../constants");
const { ENDPOINT, mappingConfig } = require("./config");
const { InstrumentationError } = require("../../util/errorTypes");

const createObject = type => {
  if (!type) {
    throw new InstrumentationError("[createObject] type not defined");
  }
  // TODO: check if default makes sense
  let retObj = {};
  switch (type.toLowerCase()) {
    case "array":
      retObj = [];
      break;
    case "object":
      retObj = {};
      break;
    default:
      break;
  }
  return retObj;
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
    if (val.length === 0) {
      val = undefined;
    }
  }
  return val;
};

const formatValue = (value, format, required) => {
  let formattedVal = {};
  // format is an object in this case
  // TODO : Add generic support for more types
  if (value && format) {
    let sourceKey;
    let key;
    let val;
    const formatKeys = Object.keys(format);
    for (let i = 0; i < formatKeys.length; i += 1) {
      key = formatKeys[i];
      // Object.keys(format).forEach(key => {
      sourceKey = format[key];
      val = getValue(value, sourceKey);
      if (val) {
        formattedVal[key] = val;
      } else if (required) {
        // return undefined if val doesn't exist.All keys for targetFormat are required.
        // TODO : make this configurable from JSON
        formattedVal = undefined;
        break;
      }
    }
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
    // TODO: add else or refactor for better code cov
    const targetValue = formatValue(
      value,
      metadata.targetFormat,
      metadata.targetFormatRequired
    );
    if (metadata.action && payload[destKey][metadata.action] && targetValue) {
      payload[destKey][metadata.action](targetValue);
    }
  }
};

function responseBuilder(body, destination) {
  const destinationConfig = destination.Config || {};
  const response = defaultRequestConfig();

  // adding monetate channel to body
  body.channel = destinationConfig.monetateChannel;

  response.endpoint = ENDPOINT + destinationConfig.retailerShortName;
  response.body.JSON = body;
  response.headers = {
    "Content-Type": "application/json"
  };

  return response;
}

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
        throw new InstrumentationError(
          `Missing required value from ${JSON.stringify(sourceKeys)}`
        );
      }
    });
    return payload;
  }
  return null;
};

function track(message, destination) {
  const rawPayload = constructPayload(message, mappingConfig.MONETATETrack);

  if (message.userId) {
    rawPayload.customerId = message.userId;
  } else {
    rawPayload.deviceId = message.anonymousId;
  }

  // Add Ecomm Events if applicable
  const evName = message.event;
  const properties = message.properties || {};
  if (evName) {
    if (evName === "Product Viewed") {
      if (properties.product_id) {
        const sku = properties.sku || "";
        rawPayload.events.push({
          eventType: "monetate:context:ProductDetailView",
          products: [
            {
              productId: properties.product_id,
              sku
            }
          ]
        });
      } else {
        throw new InstrumentationError(
          "'product_id' is a required field for Product Viewed"
        );
      }
    } else if (evName === "Product List Viewed") {
      if (properties.products && Array.isArray(properties.products)) {
        const viewedProducts = properties.products.filter(
          product => product.product_id
        );
        if (viewedProducts.length !== properties.products.length) {
          throw new InstrumentationError(
            "'product_id' is a required field for all products for Product List Viewed"
          );
        }
        rawPayload.events.push({
          eventType: "monetate:context:ProductThumbnailView",
          products: properties.products.map(product =>
            product.product_id.toString()
          )
        });
      } else {
        throw new InstrumentationError(
          "'products' missing or not array in Product List Viewed"
        );
      }
    } else if (evName === "Product Added") {
      const currency = properties.currency || "USD";
      const sku = properties.sku || "";
      if (
        properties.product_id &&
        properties.quantity &&
        Number.isInteger(properties.quantity) &&
        properties.cart_value
      ) {
        rawPayload.events.push({
          eventType: "monetate:context:Cart",
          cartLines: [
            {
              pid: properties.product_id
                ? properties.product_id.toString()
                : "",
              sku,
              quantity: properties.quantity,
              value: properties.cart_value
                ? properties.cart_value.toString()
                : "",
              currency
            }
          ]
        });
      } else {
        throw new InstrumentationError(
          "'product_id', 'quantity', 'cart_value' are required fields and 'quantity' should be a number for Product Added"
        );
      }
    } else if (evName === "Cart Viewed") {
      if (properties.products && Array.isArray(properties.products)) {
        const cartProducts = properties.products.filter(
          product =>
            product.quantity &&
            Number.isInteger(product.quantity) &&
            isDefinedAndNotNull(product.price) &&
            typeof product.price === "number" &&
            product.product_id
        );
        if (cartProducts.length !== properties.products.length) {
          throw new InstrumentationError(
            "'quantity', 'price' and 'product_id' are required fields and 'quantity' and 'price' should be a number for all products for Cart Viewed"
          );
        }
        rawPayload.events.push({
          eventType: "monetate:context:Cart",
          cartLines: properties.products.map(product => {
            const cartValue = (product.quantity * product.price).toFixed(2);
            const currency = product.currency || properties.currency || "USD";
            const sku = product.sku || "";
            return {
              pid: product.product_id ? product.product_id.toString() : "",
              sku,
              quantity: product.quantity,
              value: cartValue ? cartValue.toString() : "",
              currency
            };
          })
        });
      }
    } else if (evName === "Order Completed") {
      const purchaseId = properties.order_id;
      const { products } = properties;
      if (purchaseId && products && Array.isArray(products)) {
        const purchaseLines = products.filter(
          product =>
            product.quantity &&
            Number.isInteger(product.quantity) &&
            isDefinedAndNotNull(product.price) &&
            typeof product.price === "number" &&
            product.product_id
        );
        if (purchaseLines.length !== products.length) {
          throw new InstrumentationError(
            "'quantity', 'price' and 'product_id' are required fields and 'quantity' and 'price' should be a number for all products for Order Completed"
          );
        }
        rawPayload.events.push({
          eventType: "monetate:context:Purchase",
          purchaseId,
          purchaseLines: purchaseLines.map(product => {
            const valueStr = (product.quantity * product.price).toFixed(2);
            const currency = product.currency || properties.currency || "USD";
            const sku = product.sku || "";
            return {
              pid: product.product_id ? product.product_id.toString() : "",
              sku,
              quantity: product.quantity,
              value: valueStr ? valueStr.toString() : "",
              currency
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
  const rawPayload = constructPayload(message, mappingConfig.MONETATEPage);

  return responseBuilder(removeUndefinedValues(rawPayload), destination);
}

function screen(message, destination) {
  const rawPayload = constructPayload(message, mappingConfig.MONETATEScreen);

  return responseBuilder(removeUndefinedValues(rawPayload), destination);
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
        throw new InstrumentationError(`Event type ${evType} is not supported`);
    }
  }
  throw new InstrumentationError("Event type is required");
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
