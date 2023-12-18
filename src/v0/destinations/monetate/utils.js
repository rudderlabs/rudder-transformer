const set = require('set-value');
const get = require('get-value');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { isDefinedAndNotNull, defaultRequestConfig, getValueFromMessage } = require('../../util');
const { ENDPOINT } = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');

const createObject = (type) => {
  if (!type) {
    throw new InstrumentationError('[createObject] type not defined');
  }
  // TODO: check if default makes sense
  let retObj = {};
  switch (type.toLowerCase()) {
    case 'array':
      retObj = [];
      break;
    case 'object':
      retObj = {};
      break;
    default:
      break;
  }
  return retObj;
};

const getStringValue = (value, key) => {
  let val;
  if (key === 'sourceKeyValue') {
    val = value;
  } else if (key.startsWith('sourceKeyValue.')) {
    // gets the substring after the first .
    // sourceKeyValue.page.url => page.url
    const k = key.substring(key.indexOf('.') + 1);
    val = get(value, k);
  } else {
    // leave the sourceKey as it is if cannot be replaced
    val = key;
  }
  return val;
};

const getValue = (value, key) => {
  let val;
  if (typeof key === 'string') {
    val = getStringValue(value, key);
  } else if (Array.isArray(key)) {
    val = [];
    key.forEach((k) => {
      if (typeof k === 'string') {
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
    // eslint-disable-next-line no-restricted-syntax
    for (const formatKey of formatKeys) {
      key = formatKey;
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
  const clonedPayload = { ...payload };
  // make sure payload.destKey exists and is of correct type
  if (!get(clonedPayload, destKey) && metadata.targetType) {
    clonedPayload[destKey] = createObject(metadata.targetType);
  }
  // populate payload
  if (metadata.isTargetTypePrimite) {
    // set value directly if it is primitive
    // TODO : call format value for here, we can use the function alredy defined in utils
    set(clonedPayload, destKey, value);
  } else {
    // value is not a primitive type
    // TODO: add else or refactor for better code cov
    const targetValue = formatValue(value, metadata.targetFormat, metadata.targetFormatRequired);
    if (metadata.action && clonedPayload[destKey][metadata.action] && targetValue) {
      clonedPayload[destKey][metadata.action](targetValue);
    }
  }
  return clonedPayload;
};

function responseBuilder(body, destination) {
  const destinationConfig = destination.Config || {};
  const response = defaultRequestConfig();

  // adding monetate channel to body
  const clonedBody = { ...body };
  clonedBody.channel = destinationConfig.monetateChannel;

  response.endpoint = ENDPOINT + destinationConfig.retailerShortName;
  response.body.JSON = clonedBody;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };

  return response;
}

const constructPayload = (message, mappingJson) => {
  // Mapping JSON should be an array
  if (Array.isArray(mappingJson) && mappingJson.length > 0) {
    let payload = {};

    mappingJson.forEach((mapping) => {
      const { sourceKeys, destKey, required, metadata } = mapping;
      // get the value from event
      const value = getValueFromMessage(message, sourceKeys);
      if (value) {
        // set the value only if correct
        if (metadata) {
          payload = customMetadataHandler(payload, destKey, value, metadata);
        } else {
          set(payload, destKey, value);
        }
      } else if (required) {
        // throw error if reqired value is missing
        throw new InstrumentationError(`Missing required value from ${JSON.stringify(sourceKeys)}`);
      }
    });
    return payload;
  }
  return null;
};

const handleProductViewed = (properties, rawPayload) => {
  if (properties.product_id) {
    const sku = properties.sku || '';
    rawPayload.events.push({
      eventType: 'monetate:context:ProductDetailView',
      products: [
        {
          productId: properties.product_id,
          sku,
        },
      ],
    });
  } else {
    throw new InstrumentationError("'product_id' is a required field for Product Viewed");
  }
  return rawPayload;
};

const handleProductListViewed = (properties, rawPayload) => {
  if (properties.products && Array.isArray(properties.products)) {
    const viewedProducts = properties.products.filter((product) => product.product_id);
    if (viewedProducts.length !== properties.products.length) {
      throw new InstrumentationError(
        "'product_id' is a required field for all products for Product List Viewed",
      );
    }
    rawPayload.events.push({
      eventType: 'monetate:context:ProductThumbnailView',
      products: properties.products.map((product) => product.product_id.toString()),
    });
  } else {
    throw new InstrumentationError("'products' missing or not array in Product List Viewed");
  }
  return rawPayload;
};

const handleProductAdded = (properties, rawPayload) => {
  const currency = properties.currency || 'USD';
  const sku = properties.sku || '';
  if (
    properties.product_id &&
    properties.quantity &&
    Number.isInteger(properties.quantity) &&
    properties.cart_value
  ) {
    rawPayload.events.push({
      eventType: 'monetate:context:Cart',
      cartLines: [
        {
          pid: properties.product_id ? properties.product_id.toString() : '',
          sku,
          quantity: properties.quantity,
          value: properties.cart_value ? properties.cart_value.toString() : '',
          currency,
        },
      ],
    });
  } else {
    throw new InstrumentationError(
      "'product_id', 'quantity', 'cart_value' are required fields and 'quantity' should be a number for Product Added",
    );
  }
  return rawPayload;
};

const handleCartViewed = (properties, rawPayload) => {
  if (properties.products && Array.isArray(properties.products)) {
    const cartProducts = properties.products.filter(
      (product) =>
        product.quantity &&
        Number.isInteger(product.quantity) &&
        isDefinedAndNotNull(product.price) &&
        typeof product.price === 'number' &&
        product.product_id,
    );
    if (cartProducts.length !== properties.products.length) {
      throw new InstrumentationError(
        "'quantity', 'price' and 'product_id' are required fields and 'quantity' and 'price' should be a number for all products for Cart Viewed",
      );
    }
    rawPayload.events.push({
      eventType: 'monetate:context:Cart',
      cartLines: properties.products.map((product) => {
        const cartValue = (product.quantity * product.price).toFixed(2);
        const currency = product.currency || properties.currency || 'USD';
        const sku = product.sku || '';
        return {
          pid: product.product_id ? product.product_id.toString() : '',
          sku,
          quantity: product.quantity,
          value: cartValue ? cartValue.toString() : '',
          currency,
        };
      }),
    });
  }
  return rawPayload;
};

const handleOrderCompleted = (properties, rawPayload) => {
  const purchaseId = properties.order_id;
  const { products } = properties;
  if (purchaseId && products && Array.isArray(products)) {
    const purchaseLines = products.filter(
      (product) =>
        product.quantity &&
        Number.isInteger(product.quantity) &&
        isDefinedAndNotNull(product.price) &&
        typeof product.price === 'number' &&
        product.product_id,
    );
    if (purchaseLines.length !== products.length) {
      throw new InstrumentationError(
        "'quantity', 'price' and 'product_id' are required fields and 'quantity' and 'price' should be a number for all products for Order Completed",
      );
    }
    rawPayload.events.push({
      eventType: 'monetate:context:Purchase',
      purchaseId,
      purchaseLines: purchaseLines.map((product) => {
        const valueStr = (product.quantity * product.price).toFixed(2);
        const currency = product.currency || properties.currency || 'USD';
        const sku = product.sku || '';
        return {
          pid: product.product_id ? product.product_id.toString() : '',
          sku,
          quantity: product.quantity,
          value: valueStr ? valueStr.toString() : '',
          currency,
        };
      }),
    });
  }
  return rawPayload;
};

module.exports = {
  handleProductViewed,
  handleProductListViewed,
  handleProductAdded,
  handleCartViewed,
  handleOrderCompleted,
  responseBuilder,
  constructPayload,
};
