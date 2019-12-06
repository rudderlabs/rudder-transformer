const get = require("get-value");

const { EventType } = require("../../constants");
const {
  Event,
  GA_ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
} = require("./config");
const {
  removeUndefinedValues,
  toStringValues,
  defaultGetRequestConfig
} = require("../util");

// Basic response builder
// We pass the parameterMap with any processing-specific key-value prepopulated
// We also pass the incoming payload, the hit type to be generated and
// the field mapping and credentials JSONs
function responseBuilderSimple(
  parameters,
  message,
  hitType,
  mappingJson,
  destination
) {
  const rawPayload = {
    v: "1",
    t: hitType,
    tid: destination.Config.trackingID
  };

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    rawPayload[mappingJson[sourceKey]] = get(message, sourceKey);
  });
  // Remove keys with undefined values
  const payload = removeUndefinedValues(rawPayload);
  const params = removeUndefinedValues(parameters);

  //Get custom params from destination config
  let customParams = getParamsFromConfig(message, destination);
  customParams = removeUndefinedValues(customParams);

  let finalPayload = { ...params, ...customParams, ...payload };

  //check if userId is there and populate
  if (message.userId && message.userId.length > 0) {
    finalPayload["cid"] = message.userId;
  }

  const response = {
    endpoint: GA_ENDPOINT,
    requestConfig: defaultGetRequestConfig,
    header: {},
    userId:
      message.userId && message.userId.length > 0
        ? message.userId
        : message.anonymousId,
    payload: finalPayload
  };
  //console.log("response ", response);
  return response;
}

function getParamsFromConfig(message, destination) {
  let params = {};

  var obj = {};
  // customMapping: [{from:<>, to: <>}] , structure of custom mapping
  if (destination.Config.customMappings) {
    destination.Config.customMappings.forEach(mapping => {
      obj[mapping.from] = mapping.to;
    });
  }
  // console.log(obj);
  let keys = Object.keys(obj);
  keys.forEach(key => {
    params[obj[key]] = get(message.properties, key);
  });
  //console.log(params);
  return params;
}

// Function for processing pageviews
function processPageViews(message) {
  return {};
}

// Function for processing screenviews
function processScreenViews(message) {
  return {};
}

// Function for processing non-ecom generic track events
function processNonEComGenericEvent(message) {
  return {};
}

// Function for processing promotion viewed or clicked event
function processPromotionEvent(message) {
  const eventString = message.event;

  // Future releases will have additional logic for below elements allowing for
  // customer-side overriding of event category and event action values
  const parameters = {
    ea: eventString,
    ec: eventString
  };

  switch (eventString.toLowerCase()) {
    case Event.PROMOTION_VIEWED:
      parameters.promoa = "view";
      break;
    case Event.PROMOTION_CLICKED:
      parameters.promoa = "promo_click";
      break;
    default:
      break;
  }

  return parameters;
}

// Function for processing payment-related events
function processPaymentRelatedEvent(message) {
  const parameters = { pa: "checkout" };
  return parameters;
}

// Function for processing order refund events
function processRefundEvent(message) {
  const parameters = { pa: "refund" };

  const { products } = message.properties;
  if (products.length > 0) {
    // partial refund
    // Now iterate through the products and add parameters accordingly
    for (let i = 0; i < products.length; i++) {
      const value = products[i];
      const prodIndex = i + 1;
      if (!value.product_id || value.product_id.length === 0) {
        parameters["pr" + prodIndex + "id"] = value.sku;
      } else {
        parameters["pr" + prodIndex + "id"] = value.product_id;
      }

      parameters["pr" + prodIndex + "nm"] = value.name;
      parameters["pr" + prodIndex + "ca"] = value.category;
      parameters["pr" + prodIndex + "br"] = value.brand;
      parameters["pr" + prodIndex + "va"] = value.variant;
      parameters["pr" + prodIndex + "cc"] = value.coupon;
      parameters["pr" + prodIndex + "ps"] = value.position;
      parameters["pr" + prodIndex + "pr"] = value.price;
      parameters["pr" + prodIndex + "qt"] = value.quantity;
    }
  } else {
    // full refund, only populate order_id
    parameters.ti = message.order_id;
  }
  // Finally fill up with mandatory and directly mapped fields
  return parameters;
}

// Function for processing product and cart shared events
function processSharingEvent(message) {
  const parameters = {};
  // URL will be there for Product Shared event, hence that can be used as share target
  // For Cart Shared, the list of product ids can be shared
  const eventTypeString = message.event;
  switch (eventTypeString.toLowerCase()) {
    case Event.PRODUCT_SHARED:
      parameters.st = message.properties.url;
      break;
    case Event.CART_SHARED: {
      const products = message.properties.products;
      let shareTargetString = ""; // all product ids will be concatenated with separation
      products.forEach(product => {
        shareTargetString += " " + product.product_id;
      });
      parameters.st = shareTargetString;
      break;
    }
    default:
      parameters.st = "empty";
  }
  return parameters;
}

// Function for processing product list view event
function processProductListEvent(message) {
  const eventString = message.event;
  const parameters = {
    ea: eventString,
    ec: eventString
  };

  // Set action depending on Product List Action
  switch (eventString.toLowerCase()) {
    case Event.PRODUCT_LIST_VIEWED:
    case Event.PRODUCT_LIST_FILTERED:
      parameters.pa = "detail";
      break;
    case Event.PRODUCT_LIST_CLICKED:
      parameters.pa = "click";
      break;
    default:
      throw new Error("unknown ProductListEvent type");
  }

  const { products } = message.properties;
  if (products.length > 0) {
    for (let i = 0; i < products.length; i++) {
      const value = products[i];
      const prodIndex = i + 1;

      if (!value.product_id || value.product_id.length === 0) {
        parameters["il1pi" + prodIndex + "id"] = value.sku;
      } else {
        parameters["il1pi" + prodIndex + "id"] = value.product_id;
      }
      parameters["il1pi" + prodIndex + "nm"] = value.name;
      parameters["il1pi" + prodIndex + "ca"] = value.category;
      parameters["il1pi" + prodIndex + "br"] = value.brand;
      parameters["il1pi" + prodIndex + "va"] = value.variant;
      parameters["il1pi" + prodIndex + "cc"] = value.coupon;
      parameters["il1pi" + prodIndex + "ps"] = value.position;
      parameters["il1pi" + prodIndex + "pr"] = value.price;
    }
  } else {
    // throw error, empty Product List in Product List Viewed event payload
    throw new Error(
      "Empty Product List provided for Product List Viewed Event"
    );
  }
  return parameters;
}

// Function for processing product viewed or clicked events
function processProductEvent(message) {
  const eventString = message.event;

  // Future releases will have additional logic for below elements allowing for
  // customer-side overriding of event category and event action values

  const parameters = {
    ea: eventString,
    ec: eventString
  };

  // Set product action to click or detail depending on event
  switch (eventString.toLowerCase()) {
    case Event.PRODUCT_CLICKED:
      parameters.pa = "click";
      break;
    case Event.PRODUCT_VIEWED:
      parameters.pa = "detail";
      break;
    case Event.PRODUCT_ADDED:
    case Event.WISHLIST_PRODUCT_ADDED_TO_CART:
    case Event.PRODUCT_ADDED_TO_WISHLIST:
      parameters.pa = "add";
      break;
    case Event.PRODUCT_REMOVED:
    case Event.PRODUCT_REMOVED_FROM_WISHLIST:
      parameters.pa = "remove";
      break;
    default:
      throw new Error("unknown ProductEvent type");
  }

  const { sku, product_id } = message.properties;

  if (!product_id || product_id.length === 0) {
    parameters.pr1id = sku;
  } else {
    parameters.pr1id = product_id;
  }

  return parameters;
}

// Function for processing transaction event
function processTransactionEvent(message) {
  const eventString = message.event;
  const parameters = {};

  // Set product action as per event
  switch (eventString.toLowerCase()) {
    case Event.CHECKOUT_STARTED:
    case Event.ORDER_UPDATED:
      parameters.pa = "checkout";
      break;
    case Event.ORDER_COMPLETED:
      parameters.pa = "purchase";
      break;
    case Event.ORDER_CANCELLED:
      parameters.pa = "refund";
      break;
    default:
      throw new Error("unknown TransactionEvent type");
  }

  // One of total/revenue/value should be there
  const { revenue, value, total } = message.properties;

  if (!revenue || revenue.length === 0) {
    // revenue field is null or empty, cannot be used
    if (!value || value.length === 0) {
      // value field is null or empty, cannot be used
      if (!(!total || total.length === 0)) {
        // last option - total field
        parameters.tr = total;
      }
    } else {
      parameters.tr = value; // value field is populated, usable
    }
  } else {
    parameters.tr = revenue; // revenue field is populated, usable
  }

  const { products } = message.properties;

  if (products.length > 0) {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const prodIndex = i + 1;
      // If product_id is not provided, then SKU will be used in place of id
      if (!product.product_id || product.product_id.length === 0) {
        parameters["pr" + prodIndex + "id"] = product.sku;
      } else {
        parameters["pr" + prodIndex + "id"] = product.product_id;
      }
      parameters["pr" + prodIndex + "nm"] = product.name;
      parameters["pr" + prodIndex + "ca"] = product.category;
      parameters["pr" + prodIndex + "br"] = product.brand;
      parameters["pr" + prodIndex + "va"] = product.variant;
      parameters["pr" + prodIndex + "cc"] = product.coupon;
      parameters["pr" + prodIndex + "ps"] = product.position;
      parameters["pr" + prodIndex + "pr"] = product.price;
    }
  } else {
    // throw error, empty Product List in Product List Viewed event payload
    throw new Error("No product information supplied for transaction event");
  }
  return parameters;
}

// Function for handling generic e-commerce events
function processEComGenericEvent(message) {
  const eventString = message.event;
  const parameters = {
    ea: eventString,
    ec: eventString
  };

  return parameters;
}

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
function processSingleMessage(message, destination) {
  // Route to appropriate process depending on type of message received
  const messageType = message.type.toLowerCase();
  let customParams = {};
  let category;

  switch (messageType) {
    case EventType.PAGE:
      customParams = processPageViews(message);
      category = ConfigCategory.PAGE;
      break;
    case EventType.SCREEN:
      customParams = processScreenViews(message);
      category = ConfigCategory.SCREEN;
      break;
    case EventType.TRACK: {
      const eventName = message.event.toLowerCase();
      category = Event[nameToEventMap[eventName]]
        ? Event[nameToEventMap[eventName]].category
        : ConfigCategory.NON_ECOM;

      switch (category.name) {
        case ConfigCategory.PRODUCT_LIST.name:
          customParams = processProductListEvent(message);
          break;
        case ConfigCategory.PROMOTION.name:
          customParams = processPromotionEvent(message);
          break;
        case ConfigCategory.PRODUCT.name:
          customParams = processProductEvent(message);
          break;
        case ConfigCategory.TRANSACTION.name:
          customParams = processTransactionEvent(message);
          break;
        case ConfigCategory.PAYMENT.name:
          customParams = processPaymentRelatedEvent(message);
          break;
        case ConfigCategory.REFUND.name:
          customParams = processRefundEvent(message);
          break;
        case ConfigCategory.SHARING.name:
          customParams = processSharingEvent(message);
          break;
        case ConfigCategory.ECOM_GENERIC.name:
          customParams = processEComGenericEvent(message);
          break;
        default:
          customParams = processNonEComGenericEvent(message);
          break;
      }
      break;
    }
    default:
      console.log("could not determine type");
      // throw new RangeError('Unexpected value in type field');
      throw new Error("message type not supported");
      return;
  }

  return responseBuilderSimple(
    customParams,
    message,
    category.hitType,
    mappingConfig[category.name],
    destination
  );
}

// Iterate over input batch and generate response for each message
async function process(event) {
  const result = processSingleMessage(event.message, event.destination);
  if (!result.statusCode) {
    result.statusCode = 200;
  }
  return result;
}

exports.process = process;
