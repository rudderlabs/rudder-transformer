const get = require("get-value");
const md5 = require("md5");
const { EventType } = require("../../../constants");
const {
  Event,
  GA_ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
} = require("./config");
const {
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getParsedIP,
  formatValue,
  getFieldValueFromMessage,
  getDestinationExternalID,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");

const gaDisplayName = "Google Analytics";

function getParamsFromConfig(message, destination) {
  const params = {};
  const obj = {};
  const messageType = message.type;
  const traits = getFieldValueFromMessage(message, "traits");
  if (destination) {
    destination.forEach(mapping => {
      obj[mapping.from] = mapping.to;
    });
  }
  const keys = Object.keys(obj);
  keys.forEach(key => {
    obj[key] = obj[key].replace(/dimension/g, "cd");
    obj[key] = obj[key].replace(/metric/g, "cm");
    obj[key] = obj[key].replace(/contentGroup/g, "cg");
    params[obj[key]] =
      messageType !== "identify"
        ? get(message.properties, key)
        : get(traits, key);
  });
  return params;
}

function getProductLevelCustomParams(product, index, customParamKeys) {
  const customParams = {};

  // add all custom parameters
  if (product && Object.keys(customParamKeys).length > 0) {
    const productKey = `pr${index}`;
    Object.keys(customParamKeys).forEach(customParamKey => {
      customParams[`${productKey}${customParamKey}`] =
        product[customParamKeys[customParamKey]];
    });
  }

  return removeUndefinedAndNullValues(customParams);
}

function getCustomParamKeys(config) {
  if (config) {
    const customParams = {};
    const { dimensions } = config;
    const { metrics } = config;
    let valueKey;
    let dimensionKey;
    let metricKey;

    // convert dimension<index> to cd<index> and push to customParams
    if (dimensions && dimensions.length > 0) {
      dimensions.forEach(dimension => {
        valueKey = dimension.from;
        dimensionKey = dimension.to.replace(/dimension/g, "cd");
        customParams[dimensionKey] = valueKey;
      });
    }

    // convert metric<index> to cm<index> and push to customParams
    if (metrics && metrics.length > 0) {
      metrics.forEach(metric => {
        valueKey = metric.from;
        metricKey = metric.to.replace(/metric/g, "cm");
        customParams[metricKey] = valueKey;
      });
    }

    return removeUndefinedAndNullValues(customParams);
  }
  // return empty object if config is undefined or invalid
  return {};
}

function getCustomParamsFromOldConfig(config) {
  const dimensions = [];
  const metrics = [];
  if (config && config.customMappings && config.customMappings.length > 0) {
    config.customMappings.forEach(mapping => {
      if (mapping.to && mapping.to.startsWith("cd")) {
        dimensions.push(mapping);
      }
      if (mapping.to && mapping.to.startsWith("cm")) {
        metrics.push(mapping);
      }
    });
  }
  return [dimensions, metrics];
}

// Function for processing pageviews
function processPageViews(message, destination) {
  let documentPath;
  let documentUrl;
  let hostname;
  let { includeSearch } = destination.Config;
  includeSearch = includeSearch || false;
  if (message.properties) {
    documentUrl = getFieldValueFromMessage(message, "GApageUrl");
    let url;
    if (documentUrl) {
      try {
        url = new URL(documentUrl);
        hostname = url.hostname;
        documentPath = url.pathname;
        const search = getFieldValueFromMessage(message, "GApageSearch");
        if (search && includeSearch) {
          documentPath += search;
        }
      } catch (error) {
        throw new Error(`Invalid Url: ${documentUrl}`);
      }
    }
  }
  const parameters = {
    dp: documentPath,
    dl: documentUrl,
    dh: hostname,
    dt: getFieldValueFromMessage(message, "GApageTitle"),
    dr: getFieldValueFromMessage(message, "GApageRef")
  };
  return removeUndefinedAndNullValues(parameters);
}

function setProductLevelProperties(
  products,
  parameters,
  enhancedEcommerce,
  destination
) {
  const params = parameters;
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    const prodIndex = i + 1;
    // If product_id is not provided, then SKU will be used in place of id
    if (!product.product_id || product.product_id.length === 0) {
      params[`pr${prodIndex}id`] = product.sku;
    } else {
      params[`pr${prodIndex}id`] = product.product_id;
    }

    // add product level custom dimensions and metrics to parameters
    if (enhancedEcommerce) {
      const customParamKeys = getCustomParamKeys(destination.Config);
      Object.assign(
        parameters,
        getProductLevelCustomParams(product, prodIndex, customParamKeys)
      );
    }

    params[`pr${prodIndex}nm`] = product.name;
    params[`pr${prodIndex}ca`] = product.category;
    params[`pr${prodIndex}br`] = product.brand;
    params[`pr${prodIndex}va`] = product.variant;
    params[`pr${prodIndex}cc`] = product.coupon;
    params[`pr${prodIndex}ps`] = product.position;
    params[`pr${prodIndex}pr`] = product.price;
    params[`pr${prodIndex}qt`] = product.quantity || 1;
  }
  return params;
}

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
  let {
    doubleClick,
    anonymizeIp,
    enhancedLinkAttribution,
    dimensions,
    metrics,
    contentGroupings
  } = destination.Config;
  const { trackingID } = destination.Config;
  doubleClick = doubleClick || false;
  anonymizeIp = anonymizeIp || false;
  enhancedLinkAttribution = enhancedLinkAttribution || false;
  contentGroupings = contentGroupings || [];

  // for backward compatibility with old config
  if (!dimensions && !metrics) {
    [dimensions, metrics] = getCustomParamsFromOldConfig(destination.Config);
  }

  const rawPayload = {
    v: "1",
    t: hitType,
    tid: trackingID,
    ds: message.channel
  };

  if (doubleClick) {
    rawPayload.npa = 1;
  }
  if (anonymizeIp) {
    rawPayload.aip = 1;
  }
  if (enhancedLinkAttribution && message.properties) {
    rawPayload.linkid = message.properties.linkid;
  }

  if (message.context) {
    const { campaign, userAgent, locale, app } = message.context;
    rawPayload.ua = userAgent;
    rawPayload.ul = locale;
    if (app) {
      rawPayload.an = app.name;
      rawPayload.av = app.version;
      rawPayload.aiid = app.namespace;
    }
    if (campaign) {
      const { name, source, medium, content, term } = campaign;
      rawPayload.cn = name;
      rawPayload.cs = source;
      rawPayload.cm = medium;
      rawPayload.cc = content;
      rawPayload.ck = term;
    }
  }

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    rawPayload[mappingJson[sourceKey]] = get(message, sourceKey);
  });
  let pageParams;
  if (hitType !== "pageview") {
    pageParams = processPageViews(message, destination);
    delete pageParams.dr;
  }

  // Remove keys with undefined values
  const payload = removeUndefinedAndNullValues(rawPayload);

  const params = removeUndefinedAndNullValues(parameters);

  // Get dimensions  from destination config
  let dimensionsParam = getParamsFromConfig(message, dimensions, "dimensions");

  dimensionsParam = removeUndefinedAndNullValues(dimensionsParam);

  // Get metrics from destination config
  let metricsParam = getParamsFromConfig(message, metrics, "metrics");
  metricsParam = removeUndefinedAndNullValues(metricsParam);

  // Get contentGroupings from destination config
  let contentGroupingsParam = getParamsFromConfig(
    message,
    contentGroupings,
    "content"
  );
  contentGroupingsParam = removeUndefinedAndNullValues(contentGroupingsParam);

  const customParams = {
    ...dimensionsParam,
    ...metricsParam,
    ...contentGroupingsParam
  };

  const finalPayload = {
    ...params,
    ...customParams,
    ...payload,
    ...pageParams
  };
  let { sendUserId } = destination.Config;
  sendUserId = sendUserId || false;
  // check if userId is there and populate
  if (message.userId && message.userId.length > 0 && sendUserId) {
    finalPayload.uid = message.userId;
  }
  const integrationsClientId = message.integrations
    ? message.integrations[gaDisplayName]
      ? message.integrations[gaDisplayName].clientId
      : undefined
    : undefined;

  if (destination.Config.disableMd5) {
    finalPayload.cid =
      integrationsClientId ||
      getDestinationExternalID(message, "gaExternalId") ||
      message.anonymousId ||
      message.userId;
  } else {
    finalPayload.cid =
      integrationsClientId ||
      getDestinationExternalID(message, "gaExternalId") ||
      message.anonymousId ||
      md5(message.userId);
  }
  finalPayload.uip = getParsedIP(message);

  const timestamp = message.originalTimestamp
    ? new Date(message.originalTimestamp)
    : new Date(message.timestamp);
  finalPayload.qt = Date.now() - timestamp.getTime();

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = GA_ENDPOINT;
  response.userId = message.anonymousId || message.userId;
  response.params = finalPayload;

  return response;
}

function processIdentify(message, destination) {
  let {
    serverSideIdentifyEventCategory,
    serverSideIdentifyEventAction
  } = destination.Config;
  serverSideIdentifyEventAction = serverSideIdentifyEventAction || "";
  serverSideIdentifyEventCategory = serverSideIdentifyEventCategory || "";
  let ea;
  if (serverSideIdentifyEventAction) {
    ea = serverSideIdentifyEventAction;
  } else {
    ea = "User Enriched";
  }
  let ec;
  const identifyTraits = getFieldValueFromMessage(message, "traits") || {};
  if (
    serverSideIdentifyEventAction &&
    identifyTraits[serverSideIdentifyEventCategory]
  ) {
    ec = identifyTraits[serverSideIdentifyEventCategory];
  } else {
    ec = "All";
  }

  return {
    ea,
    ec,
    ni: 1
  };
}

// Function for processing non-ecom generic track events
function processNonEComGenericEvent(message, destination) {
  let { nonInteraction } = destination.Config;
  nonInteraction = nonInteraction || false;
  const nonInteractionProp =
    message.properties !== undefined &&
    message.properties.nonInteraction !== undefined
      ? !!message.properties.nonInteraction
      : !!nonInteraction;
  const parameters = {
    ea: message.event,
    ec:
      message.properties !== undefined &&
      message.properties.category !== undefined
        ? message.properties.category
        : "All",
    ni: nonInteractionProp === false ? 0 : 1
  };

  return parameters;
}

// Function for processing promotion viewed or clicked event
function processPromotionEvent(message, destination) {
  const eventString = message.event;

  // Future releases will have additional logic for below elements allowing for
  // customer-side overriding of event category and event action values
  const parameters = {
    cu: message.properties.currency
  };

  switch (eventString.toLowerCase()) {
    case Event.PROMOTION_VIEWED.name:
      parameters.promoa = "view";
      break;
    case Event.PROMOTION_CLICKED.name:
      parameters.promoa = "promo_click";
      break;
    default:
      break;
  }
  let { enhancedEcommerce } = destination.Config;
  enhancedEcommerce = enhancedEcommerce || false;
  if (enhancedEcommerce) {
    switch (eventString.toLowerCase()) {
      case Event.PROMOTION_VIEWED.name:
        parameters.pa = "view";
        break;
      case Event.PROMOTION_CLICKED.name:
        parameters.pa = "promo_click";
        break;
      default:
        break;
    }
  }

  return parameters;
}

// Function for processing payment-related events
function processPaymentRelatedEvent(message, destination) {
  let { enhancedEcommerce } = destination.Config;
  enhancedEcommerce = enhancedEcommerce || false;
  let pa;
  switch (message.event.toLowerCase()) {
    case Event.CHECKOUT_STEP_COMPLETED.name:
      pa = "checkout_option";
      break;
    default:
      pa = "checkout";
      break;
  }
  if (enhancedEcommerce) {
    return {
      pa
    };
  }
  return {
    pa: "checkout"
  };
}

// Function for processing order refund events
function processRefundEvent(message, destination) {
  const parameters = {
    pa: "refund"
  };
  let { enhancedEcommerce } = destination.Config;
  enhancedEcommerce = enhancedEcommerce || false;

  const { products } = message.properties;
  if (products && products.length > 0) {
    const productParams = setProductLevelProperties(
      products,
      parameters,
      enhancedEcommerce,
      destination
    );
    Object.assign(parameters, productParams);
  } else {
    // full refund, only populate order_id
    parameters.ti = message.properties.order_id;
  }
  // Finally fill up with mandatory and directly mapped fields
  return parameters;
}

// Function for processing product and cart shared events =
// This is not an Enhanced Ecomm event
function processSharingEvent(message) {
  const parameters = {};
  // URL will be there for Product Shared event, hence that can be used as share target
  // For Cart Shared, the list of product ids can be shared
  const eventTypeString = message.event;
  parameters.ec = message.properties.category || "All";
  switch (eventTypeString.toLowerCase()) {
    case Event.PRODUCT_SHARED.name:
      parameters.st = message.properties.url;
      break;
    case Event.CART_SHARED.name: {
      const { products } = message.properties;
      let shareTargetString = ""; // all product ids will be concatenated with separation
      products.forEach(product => {
        shareTargetString += ` ${product.product_id}`;
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
function processProductListEvent(message, destination) {
  const eventString = message.event;
  let { enhancedEcommerce } = destination.Config;
  enhancedEcommerce = enhancedEcommerce || false;
  const parameters = {};

  // Set action depending on Product List Action

  if (enhancedEcommerce) {
    switch (eventString.toLowerCase()) {
      case Event.PRODUCT_LIST_VIEWED.name:
      case Event.PRODUCT_LIST_FILTERED.name:
        parameters.pa = "detail";
        break;
      case Event.PRODUCT_LIST_CLICKED.name:
        parameters.pa = "click";
        break;
      default:
        throw new Error("unknown ProductListEvent type");
    }
    const { products } = message.properties;
    let { filters, sorts } = message.properties;
    filters = Array.isArray(filters) ? filters : [];
    sorts = Array.isArray(sorts) ? sorts : [];
    filters = filters
      .filter(
        obj =>
          Object.prototype.hasOwnProperty.call(obj, "type") &&
          Object.prototype.hasOwnProperty.call(obj, "value")
      )
      .map(obj => {
        return `${obj.type}:${obj.value}`;
      })
      .join();
    sorts = sorts
      .filter(
        obj =>
          Object.prototype.hasOwnProperty.call(obj, "type") &&
          Object.prototype.hasOwnProperty.call(obj, "value")
      )
      .map(obj => {
        return `${obj.type}:${obj.value}`;
      })
      .join();
    if (products && products.length > 0) {
      const customParamKeys = getCustomParamKeys(destination.Config);
      for (let i = 0; i < products.length; i += 1) {
        const value = products[i];
        const prodIndex = i + 1;

        if (!value.product_id || value.product_id.length === 0) {
          parameters[`il1pi${prodIndex}id`] = value.sku;
        } else {
          parameters[`il1pi${prodIndex}id`] = value.product_id;
        }

        // add product level custom dimensions and metrics to parameters
        Object.assign(
          parameters,
          getProductLevelCustomParams(value, prodIndex, customParamKeys)
        );

        parameters[`il1pi${prodIndex}nm`] = value.name;
        parameters[`il1pi${prodIndex}ca`] = value.category;
        parameters[`il1pi${prodIndex}br`] = value.brand;
        parameters[`il1pi${prodIndex}va`] =
          filters || sorts ? `${filters}::${sorts}` : undefined;
        parameters[`il1pi${prodIndex}cc`] = value.coupon;
        parameters[`il1pi${prodIndex}ps`] = value.position;
        parameters[`il1pi${prodIndex}pr`] = value.price;
        parameters[`il1pi${prodIndex}qt`] = value.quantity || 1;
      }
    }
  }
  return parameters;
}

// Function for processing product viewed or clicked events
function processProductEvent(message, destination) {
  const eventString = message.event;
  let { enhancedEcommerce } = destination.Config;
  enhancedEcommerce = enhancedEcommerce || false;

  // Future releases will have additional logic for below elements allowing for
  // customer-side overriding of event category and event action values

  const parameters = {};

  // Set product action to click or detail depending on event

  if (enhancedEcommerce) {
    switch (eventString.toLowerCase()) {
      case Event.PRODUCT_CLICKED.name:
        parameters.pa = "click";
        break;
      case Event.PRODUCT_VIEWED.name:
        parameters.pa = "detail";
        break;
      case Event.PRODUCT_ADDED.name:
      case Event.WISHLIST_PRODUCT_ADDED_TO_CART.name:
      case Event.PRODUCT_ADDED_TO_WISHLIST.name:
        parameters.pa = "add";
        break;
      case Event.PRODUCT_REMOVED.name:
      case Event.PRODUCT_REMOVED_FROM_WISHLIST.name:
        parameters.pa = "remove";
        break;
      default:
        throw new Error("unknown ProductEvent type");
    }

    // add produt level custom dimensions and metrics to parameters
    // TODO:: This below block will be rejected if "pa" is not set, it is better fo this block should go under the above if block
    // for better readability. ref: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pa
    const customParamKeys = getCustomParamKeys(destination.Config);
    Object.assign(
      parameters,
      getProductLevelCustomParams(message.properties, 1, customParamKeys)
    );
  }
  const { sku } = message.properties;
  const productId = message.properties.product_id;

  if (!productId || productId.length === 0) {
    parameters.pr1id = sku;
  } else {
    parameters.pr1id = productId;
  }

  return parameters;
}

// Function for processing transaction event
function processTransactionEvent(message, destination) {
  const eventString = message.event;
  const parameters = {};
  let { enhancedEcommerce } = destination.Config;
  enhancedEcommerce = enhancedEcommerce || false;

  // Set product action as per event
  switch (eventString.toLowerCase()) {
    case Event.CHECKOUT_STARTED.name:
      parameters.pa = "checkout";
      break;
    case Event.ORDER_UPDATED.name:
      parameters.pa = "checkout";
      break;
    case Event.ORDER_COMPLETED.name:
      parameters.pa = "purchase";
      break;
    case Event.ORDER_CANCELLED.name:
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

  if (products && products.length > 0) {
    const productParams = setProductLevelProperties(
      products,
      parameters,
      enhancedEcommerce,
      destination
    );
    Object.assign(parameters, productParams);
  } else {
    // throw error, empty Product List in Product List Viewed event payload
    throw new Error("No product information supplied for transaction event");
  }

  // TODO: parameters.ec missing message.properties check and All value?
  return parameters;
}

// Function for handling generic e-commerce events
function processEComGenericEvent(message, destination) {
  const eventString = message.event;
  const parameters = {};
  let { enhancedEcommerce } = destination.Config;
  enhancedEcommerce = enhancedEcommerce || false;
  if (enhancedEcommerce) {
    // Set product action as per event
    switch (eventString.toLowerCase()) {
      case Event.CART_VIEWED.name:
        parameters.pa = "detail";
        break;
      case Event.COUPON_ENTERED.name:
        parameters.pa = "add";
        break;
      case Event.COUPON_APPLIED.name:
        parameters.pa = "add";
        break;
      case Event.COUPON_DENIED.name:
        parameters.pa = "remove";
        break;
      case Event.COUPON_REMOVED.name:
        parameters.pa = "remove";
        break;
      case Event.PRODUCT_REVIEWED.name:
        parameters.pa = "detail";
        break;
      case Event.PRODUCTS_SEARCHED.name:
        parameters.pa = "click";
        break;
      default:
        throw new Error("unknown TransactionEvent type");
    }
  }
  const { products } = message.properties;

  if (products && products.length > 0) {
    const productParams = setProductLevelProperties(
      products,
      parameters,
      enhancedEcommerce,
      destination
    );
    Object.assign(parameters, productParams);
  }
  return parameters;
}

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
function processSingleMessage(message, destination) {
  // Route to appropriate process depending on type of message received
  const messageType = message.type ? message.type.toLowerCase() : undefined;
  if (!messageType) {
    throw new Error("Message type is not present");
  }
  let customParams = {};
  let category;
  let { enableServerSideIdentify, enhancedEcommerce } = destination.Config;
  enableServerSideIdentify = enableServerSideIdentify || false;
  enhancedEcommerce = enhancedEcommerce || false;
  switch (messageType) {
    case EventType.IDENTIFY:
      if (enableServerSideIdentify) {
        customParams = processIdentify(message, destination);
        category = ConfigCategory.IDENTIFY;
      } else {
        throw new Error("server side identify is not on");
      }
      break;
    case EventType.PAGE:
      customParams = processPageViews(message, destination);
      category = ConfigCategory.PAGE;
      break;
    case EventType.SCREEN:
      customParams = {};
      category = ConfigCategory.SCREEN;
      break;
    case EventType.TRACK: {
      let eventName = message.event;
      if (!(typeof eventName === "string" || eventName instanceof String)) {
        throw new Error("Event name is not present/is not a string");
      }
      if (enhancedEcommerce) {
        eventName = eventName.toLowerCase();
        category = nameToEventMap[eventName]
          ? nameToEventMap[eventName].category
          : ConfigCategory.NON_ECOM;
        category.hitType = "event";
        customParams.ni = 1;
        customParams.ea = message.event;
        let eventValue;
        let setCategory;
        if (message.properties) {
          const { value, revenue, total } = message.properties;
          eventValue = value || revenue || total;

          setCategory = message.properties.category;
        }
        customParams.ec = setCategory || "EnhancedEcommerce";
        customParams.ev = formatValue(eventValue);
        switch (category.name) {
          case ConfigCategory.PRODUCT_LIST.name:
            Object.assign(
              customParams,
              processProductListEvent(message, destination)
            );
            break;
          case ConfigCategory.PROMOTION.name:
            Object.assign(
              customParams,
              processPromotionEvent(message, destination)
            );
            break;
          case ConfigCategory.PRODUCT.name:
            Object.assign(
              customParams,
              processProductEvent(message, destination)
            );
            break;
          case ConfigCategory.TRANSACTION.name:
            Object.assign(
              customParams,
              processTransactionEvent(message, destination)
            );
            break;
          case ConfigCategory.PAYMENT.name:
            Object.assign(
              customParams,
              processPaymentRelatedEvent(message, destination)
            );
            break;
          case ConfigCategory.REFUND.name:
            Object.assign(
              customParams,
              processRefundEvent(message, destination)
            );
            break;
          case ConfigCategory.ECOM_GENERIC.name:
            Object.assign(
              customParams,
              processEComGenericEvent(message, destination)
            );
            break;
          case ConfigCategory.SHARING.name:
            Object.assign(customParams, processSharingEvent(message));
            break;
          default:
            Object.assign(
              customParams,
              processNonEComGenericEvent(message, destination)
            );
            break;
        }
      } else {
        category = ConfigCategory.NON_ECOM;
        customParams = processNonEComGenericEvent(message, destination);
      }
      const label = message.properties ? message.properties.label : undefined;
      customParams.el = label || "event";
      break;
    }
    default:
      // throw new RangeError('Unexpected value in type field');
      throw new Error("message type not supported");
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
function process(event) {
  let response;
  try {
    response = processSingleMessage(event.message, event.destination);
  } catch (error) {
    throw new Error(error.message || "Unknown error");
  }

  return response;
}
const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }
  const respList = inputs.map(input => {
    return getSuccessRespEvents(
      process(input),
      [input.metadata],
      input.destination
    );
  });
  return respList;
};

module.exports = { process, processRouterDest };
