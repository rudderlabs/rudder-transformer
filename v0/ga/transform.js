const get = require("get-value");
const { EventType } = require("../../constants");
const {
  GAEvent,
  GA_ENDPOINT,
  GAConfigCategory,
  mappingConfig,
  nameToEventMap
} = require("./config");

// Load and parse configurations for different messages

const defaultRequestConfig = {
  "request-format": "PARAMS",
  request_method: "GET"
};

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
  const payload = {
    v: "1",
    t: hitType,
    tid: destination.Config.trackingID
  };

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    payload[mappingJson[sourceKey]] = get(message, sourceKey);
  });

  const response = {
    endpoint: GA_ENDPOINT,
    request_config: defaultRequestConfig,
    header: {},
    user_id: message.anonymous_id,
    payload: { ...parameters, ...payload }
  };
  return response;
}

// Function for processing pageviews
function processPageviews(message, destination) {
  return responseBuilderSimple(
    {},
    message,
    "pageview",
    mappingConfig[GAConfigCategory.PAGE],
    destination
  );
}

// Function for processing screenviews
function processScreenviews(message, destination) {
  return responseBuilderSimple(
    {},
    message,
    "screenview",
    mappingConfig[GAConfigCategory.SCREEN],
    destination
  );
}

// Function for processing non-ecom generic track events
function processNonEComGenericEvent(message, destination) {
  return responseBuilderSimple(
    {},
    message,
    "event",
    mappingConfig[GAConfigCategory.NON_ECOM],
    destination
  );
}

// Function for processing promotion viewed or clicked event
function processPromotionEvent(message, destination) {
  const eventString = message.event;

  // Future releases will have additional logic for below elements allowing for
  // customer-side overriding of event category and event action values
  const parameters = {
    ea: eventString,
    ec: eventString
  };

  switch (eventString.toLowerCase()) {
    case GAEvent.PROMOTION_VIEWED:
      parameters["promoa"] = "view";
      break;
    case GAEvent.PROMOTION_CLICKED:
      parameters["promoa"] = "promo_click";
      break;
  }

  return responseBuilderSimple(
    parameters,
    message,
    "event",
    mappingConfig[GAConfigCategory.PROMOTION],
    destination
  );
}

// Function for processing payment-related events
function processPaymentRelatedEvent(message, destination) {
  const parameters = { pa: "checkout" };
  return responseBuilderSimple(
    parameters,
    message,
    "transaction",
    mappingConfig[GAConfigCategory.PAYMENT],
    destination
  );
}

// Function for processing order refund events
function processRefundEvent(message, destination) {
  const parameters = { pa: "refund" };

  const { products } = message.properties;
  if (products.length > 0) {
    // partial refund
    // Now iterate through the products and add parameters accordingly
    for (i = 0; i < products.length; i++) {
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
    parameters["ti"] = message.order_id;
  }
  // Finally fill up with mandatory and directly mapped fields
  return responseBuilderSimple(
    parameters,
    message,
    "transaction",
    mappingConfig[GAConfigCategory.REFUND],
    destination
  );
}

// Function for processing product and cart shared events
function processSharingEvent(message, destination) {
  const parameters = {};
  // URL will be there for Product Shared event, hence that can be used as share target
  // For Cart Shared, the list of product ids can be shared
  const eventTypeString = message.event;
  switch (eventTypeString.toLowerCase()) {
    case GAEvent.PRODUCT_SHARED:
      parameters[st] = message.properties.url;
      break;
    case GAEvent.CART_SHARED:
      const products = message.properties.products;
      let shareTargetString = ""; // all product ids will be concatenated with separation
      products.forEach(product => {
        shareTargetString += " " + product.product_id;
      });
      parameters["st"] = shareTargetString;
      break;
    default:
      parameterMap.set("st", "empty");
  }
  return responseBuilderSimple(
    parameters,
    message,
    "social",
    mappingConfig[GAConfigCategory.SHARING],
    destination
  );
}

// Function for processing product list view event
function processProductListEvent(message, destination) {
  const eventString = message.event;
  const parameters = {
    ea: eventString,
    ec: eventString
  };

  // Set action depending on Product List Action
  switch (eventString.toLowerCase()) {
    case GAEvent.PRODUCT_LIST_VIEWED:
    case GAEvent.PRODUCT_LIST_FILTERED:
      parameters["pa"] = "detail";
      break;
    case GAEvent.PRODUCT_LIST_CLICKED:
      parameters["pa"] = "click";
      break;
  }

  const { products } = message.properties;
  if (products.length > 0) {
    for (i = 0; i < products.length; i++) {
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
  return responseBuilderSimple(
    parameters,
    message,
    "event",
    mappingConfig[GAConfigCategory.PRODUCT_LIST],
    destination
  );
}

// Function for processing product viewed or clicked events
function processProductEvent(message, destination) {
  const eventString = message.event;

  // Future releases will have additional logic for below elements allowing for
  // customer-side overriding of event category and event action values

  const parameters = {
    ea: eventString,
    ec: eventString
  };

  // Set product action to click or detail depending on event
  switch (eventString.toLowerCase()) {
    case GAEvent.PRODUCT_CLICKED:
      parameters["pa"] = "click";
      break;
    case GAEvent.PRODUCT_VIEWED:
      parameters["pa"] = "detail";
      break;
    case GAEvent.PRODUCT_ADDED:
    case GAEvent.WISHLIST_PRODUCT_ADDED_TO_CART:
    case GAEvent.PRODUCT_ADDED_TO_WISHLIST:
      parameters["pa"] = "add";
      break;
    case GAEvent.PRODUCT_REMOVED:
    case GAEvent.PRODUCT_REMOVED_FROM_WISHLIST:
      parameters["pa"] = "remove";
      break;
  }

  const productId = message.properties.product_id;
  const sku = message.properties.sku;
  parameters["pr1id"] = productId ? productId : sku;

  return responseBuilderSimple(
    parameters,
    message,
    "event",
    mappingConfig[GAConfigCategory.PRODUCT],
    destination
  );
}

// Function for processing transaction event
function processTransactionEvent(message, destination) {
  const eventString = message.event;
  const parameters = {};

  // Set product action as per event
  switch (eventString.toLowerCase()) {
    case GAEvent.CHECKOUT_STARTED:
    case GAEvent.ORDER_UPDATED:
      parameters["pa"] = "checkout";
      break;
    case GAEvent.ORDER_COMPLETED:
      parameters["pa"] = "purchase";
      break;
    case GAEvent.ORDER_CANCELLED:
      parameters["pa"] = "refund";
      break;
  }

  // One of total/revenue/value should be there
  const { revenue, value, total } = message.properties;

  if (!revenue || revenue.length === 0) {
    // revenue field is null or empty, cannot be used
    if (!value || value.length === 0) {
      // value field is null or empty, cannot be used
      if (!(!total || total.length === 0)) {
        // last option - total field
        parameters["tr"] = total;
      }
    } else {
      parameters["tr"] = value; // value field is populated, usable
    }
  } else {
    parameters["tr"] = revenue; // revenue field is populated, usable
  }

  const { products } = message.properties;

  if (products.length > 0) {
    for (i = 0; i < products.length; i++) {
      const value = products[i];
      const prodIndex = i + 1;
      // If product_id is not provided, then SKU will be used in place of id
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
    }
  } else {
    // throw error, empty Product List in Product List Viewed event payload
    throw new Error("No product information supplied for transaction event");
  }
  return responseBuilderSimple(
    parameters,
    message,
    "transaction",
    mappingConfig[GAConfigCategory.TRANSACTION],
    destination
  );
}

// Function for handling generic e-commerce events
function processEComGenericEvent(message, destination) {
  const eventString = message.event;
  const parameters = {
    ea: eventString,
    ec: eventString
  };

  return responseBuilderSimple(
    parameters,
    message,
    "event",
    mappingConfig[GAConfigCategory.ECOM_GENERIC],
    destination
  );
}

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
function processSingleMessage(message, destination) {
  // Route to appropriate process depending on type of message received
  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.PAGE:
      return processPageviews(message);
    case EventType.SCREEN:
      return processScreenviews(message);
    case EventType.TRACK:
      const eventName = message.event.toLowerCase();
      const category = GAEvent[nameToEventMap[eventName]].category;

      switch (category) {
        case GAConfigCategory.PRODUCT_LIST:
          return processProductListEvent(message);
        case GAConfigCategory.PROMOTION:
          return processPromotionEvent(message);
        case GAConfigCategory.PRODUCT:
          return processProductEvent(message);
        case GAConfigCategory.TRANSACTION:
          return processTransactionEvent(message);
        case GAConfigCategory.PAYMENT:
          return processPaymentRelatedEvent(message);
        case GAConfigCategory.REFUND:
          return processRefundEvent(message);
        case GAConfigCategory.SHARING:
          return processSharingEvent(message);
        case GAConfigCategory.ECOM_GENERIC:
          return processEComGenericEvent(message);
        default:
          return processNonEComGenericEvent(message, destination);
      }
    default:
      console.log("could not determine type");
      // throw new RangeError('Unexpected value in type field');
      const events = [];
      events.push('{"error":"message type not supported"}');
      return events;
  }
}

// Iterate over input batch and generate response for each message
function process(events) {
  const respList = [];

  events.forEach(event => {
    const result = processSingleMessage(event.message, event.destination);
    respList.push(result);
  });

  return respList;
}

exports.process = process;
